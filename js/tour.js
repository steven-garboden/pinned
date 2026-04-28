/* ── ONBOARDING TOUR ──────────────────────────────── */

const FTUX_KEY = 'pinned_ftux_completed';
const isFirstVisit = () => { try { return !localStorage.getItem(FTUX_KEY); } catch (e) { return false; } };
const markFtuxComplete = () => { try { localStorage.setItem(FTUX_KEY, '1'); } catch (e) {} };

const tourSteps = [
  {
    type: 'welcome',
    title: 'Welcome to <em>Pinned</em>',
    sub: 'Your trips, on a cork board. Pinned, told, and worth reliving. Take a 30-second tour, or skip and start building.',
    primaryLabel: 'Show me around',
    primaryAction: () => tourNext(),
    secondaryLabel: 'Skip and build my trip',
    secondaryAction: () => { closeTour(); openQuickBuilder(); }
  },
  {
    type: 'pulse',
    target: '.pin',
    title: 'Tap a pin',
    body: 'Each pin marks a place you went. Tap one to bring up the polaroid and the story behind it.',
    arrow: 'left'
  },
  {
    type: 'pulse',
    target: '.polaroid',
    title: 'That\'s your <em>memory</em>',
    body: 'Photos, narration, and the feel of a real polaroid. This is what every stop on your cork board looks like.',
    arrow: 'right'
  },
  {
    type: 'pulse',
    target: '.nav-cta',
    title: 'Now <em>relive</em> the whole thing',
    body: 'Click "Relive Trip" in the nav. The whole journey plays back as a short film.',
    arrow: 'top',
    primaryLabel: 'Got it · Build my trip',
    primaryAction: () => { closeTour(); openQuickBuilder(); }
  }
];

let currentTourStep = 0;

function startTour() {
  currentTourStep = 0;
  document.getElementById('tour-overlay').classList.add('active');
  track('Onboarding Tour Started');
  renderTourStep();
}

function tourNext() {
  currentTourStep++;
  if (currentTourStep >= tourSteps.length) { closeTour(); return; }
  renderTourStep();
}

function tourSkip() {
  track('Onboarding Tour Skipped', { step: currentTourStep });
  closeTour();
  showToast('You can restart the tour anytime from the menu');
}

function closeTour() {
  document.getElementById('tour-overlay').classList.remove('active');
  document.getElementById('tourPulse').style.display = 'none';
  document.getElementById('tourCardSlot').innerHTML = '';
  markFtuxComplete();
  track('Onboarding Tour Closed', { step: currentTourStep });
}

function renderTourStep() {
  const step = tourSteps[currentTourStep];
  const slot = document.getElementById('tourCardSlot');
  const pulse = document.getElementById('tourPulse');
  track('Onboarding Tour Step Shown', { step: currentTourStep, type: step.type });

  if (step.type === 'welcome') {
    pulse.style.display = 'none';
    slot.innerHTML = `
      <div class="tour-welcome-card">
        <div class="tour-welcome-icon">✨</div>
        <div class="tour-welcome-eyebrow">First time here</div>
        <div class="tour-welcome-title">${step.title}</div>
        <div class="tour-welcome-sub">${step.sub}</div>
        <div class="tour-welcome-actions">
          <button class="tour-secondary" onclick="(${step.secondaryAction})()">${step.secondaryLabel}</button>
          <button class="tour-primary" onclick="(${step.primaryAction})()">${step.primaryLabel} <span>→</span></button>
        </div>
      </div>`;
    return;
  }

  if (step.target.includes('pin') || step.target.includes('polaroid')) {
    if (!document.getElementById('screen-journal').classList.contains('active')) goTo('journal');
  }

  setTimeout(() => {
    const target = document.querySelector(step.target);
    if (!target) { tourNext(); return; }
    const rect = target.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    pulse.style.display = 'block';
    pulse.style.left = cx + 'px';
    pulse.style.top = cy + 'px';

    const cardW = 320, cardH = 180, margin = 30;
    let cardLeft, cardTop;
    if (step.arrow === 'left')  { cardLeft = cx + 50;          cardTop = cy - 50; }
    else if (step.arrow === 'right') { cardLeft = cx - cardW - 50; cardTop = cy - 50; }
    else if (step.arrow === 'top')   { cardLeft = cx - cardW / 2;  cardTop = cy + 50; }
    else { cardLeft = cx - cardW / 2; cardTop = cy - cardH - 50; }
    cardLeft = Math.max(margin, Math.min(window.innerWidth - cardW - margin, cardLeft));
    cardTop  = Math.max(margin + 70, Math.min(window.innerHeight - cardH - margin, cardTop));

    const isLast = currentTourStep === tourSteps.length - 1;
    const primaryLabel   = step.primaryLabel || 'Next';
    const primaryHandler = step.primaryAction ? `(${step.primaryAction})()` : 'tourNext()';
    const dots = tourSteps.slice(1).map((_, i) =>
      `<div class="tour-dot ${i === currentTourStep - 1 ? 'on' : ''}"></div>`
    ).join('');

    slot.innerHTML = `
      <div class="tour-step-card" data-arrow="${step.arrow}" style="left:${cardLeft}px;top:${cardTop}px;">
        <div class="tour-step-num">Step ${currentTourStep} of ${tourSteps.length - 1}</div>
        <div class="tour-step-title">${step.title}</div>
        <div class="tour-step-body">${step.body}</div>
        <div class="tour-step-actions">
          <button class="tour-skip" onclick="tourSkip()">Skip tour</button>
          <div class="tour-step-progress">${dots}</div>
          <button class="tour-primary" onclick="${primaryHandler}">${primaryLabel} <span>→</span></button>
        </div>
      </div>`;
  }, step.target.includes('pin') || step.target.includes('polaroid') ? 600 : 100);
}
