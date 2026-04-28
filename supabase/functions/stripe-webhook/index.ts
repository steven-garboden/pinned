// Supabase Edge Function: stripe-webhook
// Handles Stripe webhook events and updates order status.
//
// Required environment variables:
//   STRIPE_SECRET_KEY       — sk_live_... or sk_test_...
//   STRIPE_WEBHOOK_SECRET   — whsec_... (from Stripe Dashboard → Webhooks)
//   SUPABASE_URL            — auto-injected
//   SUPABASE_SERVICE_ROLE_KEY — auto-injected

import Stripe from "https://esm.sh/stripe@15?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } }
);

Deno.serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!
    );
  } catch (err) {
    console.error("[stripe-webhook] Signature verification failed:", err);
    return new Response(`Webhook error: ${err.message}`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      await supabase
        .from("orders")
        .update({ status: "expired", updated_at: new Date().toISOString() })
        .eq("stripe_session_id", session.id);
      break;
    }
    default:
      // Unhandled event type — acknowledge and ignore
      break;
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { error } = await supabase
    .from("orders")
    .update({
      status: "paid",
      stripe_payment_intent_id: session.payment_intent as string ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_session_id", session.id);

  if (error) {
    console.error("[stripe-webhook] Failed to update order:", error);
    return;
  }

  // TODO: trigger fulfillment (e.g., send to print-on-demand API, email confirmation)
  console.log("[stripe-webhook] Order paid:", session.id, "user:", session.metadata?.userId);
}
