// Supabase Edge Function: create-checkout
// Creates a Stripe Checkout session for poster orders.
//
// Required environment variables (set in Supabase dashboard → Functions → Secrets):
//   STRIPE_SECRET_KEY   — sk_live_... or sk_test_...
//   SUPABASE_URL        — auto-injected
//   SUPABASE_SERVICE_ROLE_KEY — auto-injected

import Stripe from "https://esm.sh/stripe@15?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
  httpClient: Stripe.createFetchHttpClient(),
});

const PRICES_CENTS: Record<string, number> = {
  'A4 · 8×12"':  3800,
  'A3 · 12×17"': 5200,
  'A2 · 17×24"': 7800,
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } }
  );

  // Verify the caller is authenticated
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const body = await req.json();
  const { tripId, format, size, style, paper, successUrl, cancelUrl } = body;
  const amountCents = PRICES_CENTS[size] ?? 5200;

  // Create the Stripe Checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: {
          name: `Pinned Print Poster — ${size}`,
          description: `${style} style · ${paper} paper · ${format}`,
          images: [], // TODO: add product image URL
        },
        unit_amount: amountCents,
      },
      quantity: 1,
    }],
    mode: "payment",
    success_url: `${successUrl}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  cancelUrl,
    customer_email: user.email,
    metadata: {
      userId: user.id,
      tripId: tripId ?? "",
      format,
      size,
      style,
      paper,
    },
  });

  // Record a pending order in the database
  await supabase.from("orders").insert({
    user_id: user.id,
    trip_id: tripId ?? null,
    stripe_session_id: session.id,
    status: "pending",
    format,
    size,
    style,
    paper,
    amount_cents: amountCents,
  });

  return new Response(JSON.stringify({ url: session.url }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
