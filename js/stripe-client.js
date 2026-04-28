/* ── STRIPE CLIENT-SIDE PAYMENT FLOW ────────────────
   Poster orders go through Stripe Checkout (server-side
   session creation via a Supabase Edge Function).
   Subscription upgrades follow the same pattern.
   ──────────────────────────────────────────────────── */

async function startPosterCheckout() {
  const sb = getSupabase();
  if (!sb || !window._pinnedUser) {
    openAuthModal('signup');
    return;
  }

  // Read the current poster options from the modal
  const sizeEl  = document.querySelector('.po-section:nth-child(2) .po-opt.on');
  const styleEl = document.querySelector('.po-section:nth-child(3) .po-opt.on');
  const paperEl = document.querySelector('.po-section:nth-child(4) .po-opt.on');
  const fmtEl   = document.querySelector('.po-section:nth-child(1) .po-opt.on');

  const size   = sizeEl?.textContent.trim()  ?? 'A3 · 12×17"';
  const style  = styleEl?.textContent.trim() ?? 'Vintage Map';
  const paper  = paperEl?.textContent.trim() ?? 'Matte Premium';
  const format = fmtEl?.textContent.trim()   ?? 'Poster';

  const prices = { 'A4 · 8×12"': 3800, 'A3 · 12×17"': 5200, 'A2 · 17×24"': 7800 };
  const amountCents = prices[size] ?? 5200;

  const btn = document.querySelector('.poster-order-btn');
  if (btn) { btn.textContent = 'Creating order…'; btn.disabled = true; }

  try {
    const trip = trips[curTrip];
    const siteUrl = window.PINNED_CONFIG?.siteUrl ?? window.location.origin;

    // Call Supabase Edge Function to create Stripe Checkout session
    const { data: { session: sbSession } } = await sb.auth.getSession();
    const response = await fetch(
      `${window.PINNED_CONFIG.supabase.url}/functions/v1/create-checkout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sbSession?.access_token}`
        },
        body: JSON.stringify({
          tripId: trip.id,
          format, size, style, paper,
          amount: amountCents,
          successUrl: `${siteUrl}/?order=success`,
          cancelUrl:  `${siteUrl}/?order=cancel`
        })
      }
    );

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const { url } = await response.json();

    track('Stripe Checkout Initiated', { trip: trip.title, size, style, amount: amountCents });
    window.location.href = url; // Redirect to Stripe hosted checkout
  } catch (err) {
    console.error('[Pinned] Stripe checkout error:', err);
    showToast('Something went wrong — please try again');
    if (btn) { btn.textContent = 'Order Now →'; btn.disabled = false; }
  }
}

/* ── HANDLE RETURN FROM STRIPE ──
   Check URL params on page load and show success/cancel toasts.
   ──────────────────────────────────────────────────────────── */
(function handleStripeReturn() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('order') === 'success') {
    history.replaceState(null, '', window.location.pathname);
    setTimeout(() => showToast('🎉 Order placed! Your poster ships in 5–7 days.'), 600);
    track('Poster Order Completed');
  } else if (params.get('order') === 'cancel') {
    history.replaceState(null, '', window.location.pathname);
    showToast('Order cancelled — your cart is saved.');
  }
})();
