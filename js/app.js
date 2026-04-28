/* ── APP CORE ──────────────────────────────────────────
   Navigation, toast, analytics wrapper, and the
   top-level initialization that runs on page load.
   ──────────────────────────────────────────────────── */

/* ── ANALYTICS WRAPPER ── */
function track(event, props) {
  try {
    if (window.amplitude) window.amplitude.track(event, props || {});
  } catch (e) { /* fail quietly */ }
}

/* ── AMPLITUDE INIT ── */
(function initAmplitude() {
  if (!window.PINNED_CONFIG) return;
  const key = window.PINNED_CONFIG.amplitude?.apiKey;
  if (!key || key.startsWith('YOUR_')) return;
  amplitude.init(key, {
    autocapture: { elementInteractions: true, pageViews: true, sessions: true, formInteractions: true },
    defaultTracking: true
  });
})();

/* ── NAVIGATION ── */
function goTo(screen) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + screen).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const nl = document.getElementById('nl-' + screen);
  if (nl) nl.classList.add('active');
  window.scrollTo(0, 0);
  track('Screen Viewed', { screen: screen });

  // Lazy-init each screen on first visit
  if (screen === 'journal'   && !window._journalInit)  { window._journalInit=true;  initJournal(); }
  if (screen === 'photos'    && !window._photosInit)   { window._photosInit=true;   initPhotos(); }
  if (screen === 'narration' && !window._narrInit)     { window._narrInit=true;     initNarration(); }
  if (screen === 'itinerary' && !window._itinInit)     { window._itinInit=true;     initItinerary(); }
  if (screen === 'discover'  && !window._discoverInit) { window._discoverInit=true; initDiscover(); }
}

/* ── TOAST ── */
let _toastT;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(_toastT);
  _toastT = setTimeout(() => el.classList.remove('show'), 2800);
}

/* ── NAV CTA: "Start for Free" / "My Journal" ──
   Swaps based on auth state (wired up by supabase.js).
   ──────────────────────────────────────────────── */
function updateNavCta(user) {
  const cta = document.getElementById('navCta');
  if (!cta) return;
  if (user) {
    cta.textContent = 'My Journal';
    cta.onclick = () => goTo('journal');
  } else {
    cta.textContent = 'Start for Free';
    cta.onclick = () => openAuthModal('signup');
  }
}

/* ── AUTH MODAL ── */
function openAuthModal(tab = 'signin') {
  document.getElementById('auth-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
  setAuthTab(tab);
  track('Auth Modal Opened', { tab });
}

function closeAuthModal() {
  document.getElementById('auth-modal').classList.remove('active');
  document.body.style.overflow = '';
}

function setAuthTab(tab) {
  ['signin', 'signup', 'reset'].forEach(t => {
    document.getElementById('authForm' + t.charAt(0).toUpperCase() + t.slice(1)).style.display = (t === tab ? '' : 'none');
    const tabEl = document.getElementById('authTab' + t.charAt(0).toUpperCase() + t.slice(1));
    if (tabEl) tabEl.classList.toggle('on', t === tab);
  });
  // Clear errors
  ['signinError','signupError','resetError'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const authModal = document.getElementById('auth-modal');
  if (authModal) {
    authModal.addEventListener('click', e => {
      if (e.target === authModal) closeAuthModal();
    });
  }
});

/* ── PAGE INIT ── */
window.addEventListener('load', function () {
  // Start on the landing screen (it has class="active" in HTML already)
  // Trigger first-visit tour after a short delay (defined in tour.js)
  if (typeof isFirstVisit === 'function' && isFirstVisit()) {
    track('First Visit Detected');
    setTimeout(startTour, 1200);
  }
});

// Shift+T resets FTUX tour for demo purposes
document.addEventListener('keydown', function (e) {
  if (e.shiftKey && e.key === 'T' && !e.target.matches('input, textarea')) {
    try { localStorage.removeItem(typeof FTUX_KEY !== 'undefined' ? FTUX_KEY : 'wander_ftux_completed'); } catch (_) {}
    if (typeof startTour === 'function') startTour();
  }
});
