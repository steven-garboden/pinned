/* ── POSTER / PRINT MODAL ──────────────────────────── */
/* Poster ordering is wired to Stripe in stripe-client.js */

function openPosterModal() {
  track('Poster Modal Opened', { trip: trips[curTrip].title });
  document.getElementById('poster-modal').classList.add('active');
  renderPosterPreview();
}

function closePosterModal() { document.getElementById('poster-modal').classList.remove('active'); }

function renderPosterPreview() {
  const trip = trips[curTrip];
  document.getElementById('posterTripName').textContent = trip.title;
  document.getElementById('posterTripDates').textContent = trip.sub;
  document.getElementById('posterPins').innerHTML = trip.stops.map(s =>
    `<div class="poster-stop-pin" style="left:${s.x}%;top:${s.y}%;"><div class="poster-pin-dot ${s.rec?'gold':''}"></div><div class="poster-pin-name">${s.name}</div></div>`
  ).join('');

  const svg = document.getElementById('posterStringSvg');
  svg.innerHTML = '';
  trip.stops.forEach((s, i) => {
    if (i >= trip.stops.length - 1) return;
    const b = trip.stops[i + 1];
    const x1=s.x*4, y1=s.y*3, x2=b.x*4, y2=b.y*3;
    const cx=(x1+x2)/2, cy=(y1+y2)/2+(Math.random()-.5)*20;
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d',`M${x1},${y1} Q${cx},${cy} ${x2},${y2}`);
    path.setAttribute('stroke','rgba(44,24,16,0.3)');
    path.setAttribute('stroke-width','0.8');
    path.setAttribute('fill','none');
    path.setAttribute('stroke-dasharray','4 3');
    svg.appendChild(path);
  });

  const bgs = ['#2a1a0a','#1a2a0a','#0a1a2a','#2a0a10','#1a1a2a'];
  document.getElementById('posterPhotos').innerHTML = trip.stops.slice(0, 5).map((s, i) =>
    `<div class="poster-photo-thumb" style="background:${bgs[i]};">${s.pol}</div>`
  ).join('');
}

function selectPO(el, group) {
  el.closest('.po-options').querySelectorAll('.po-opt').forEach(o => o.classList.remove('on'));
  el.classList.add('on');
  const prices = {'A4 · 8×12"':38, 'A3 · 12×17"':52, 'A2 · 17×24"':78};
  const sizeEl = document.querySelector('.po-section:nth-child(2) .po-opt.on');
  if (sizeEl && prices[sizeEl.textContent.trim()]) {
    document.getElementById('posterPrice').textContent = '$' + prices[sizeEl.textContent.trim()];
  }
}

function orderPoster() {
  // Delegate to Stripe checkout (defined in stripe-client.js)
  if (typeof startPosterCheckout === 'function') {
    startPosterCheckout();
  } else {
    // Fallback for demo / unauthenticated state
    track('Poster Order Clicked (not signed in)', { trip: trips[curTrip].title });
    openAuthModal('signup');
  }
}
