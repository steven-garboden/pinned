/* ── PRICING SCREEN ──────────────────────────────── */

let pricingPeriod = 'monthly';

function setPricingPeriod(period) {
  pricingPeriod = period;
  track('Pricing Period Toggled', { period });
  document.getElementById('prBtMonthly').classList.toggle('on', period === 'monthly');
  document.getElementById('prBtAnnual').classList.toggle('on', period === 'annual');
  if (period === 'monthly') {
    document.getElementById('prWandererPrice').textContent = '6';
    document.getElementById('prWandererStrike').style.display = 'none';
    document.getElementById('prWandererDetail').textContent = 'Billed monthly · Cancel anytime';
    document.getElementById('prCreatorPrice').textContent = '14';
    document.getElementById('prCreatorStrike').style.display = 'none';
    document.getElementById('prCreatorDetail').textContent = 'Pays for itself in one booking · Cancel anytime';
  } else {
    document.getElementById('prWandererPrice').textContent = '4';
    document.getElementById('prWandererStrike').style.display = '';
    document.getElementById('prWandererStrike').textContent = '$72';
    document.getElementById('prWandererDetail').textContent = '$48/year · Save $24 · Cancel anytime';
    document.getElementById('prCreatorPrice').textContent = '9';
    document.getElementById('prCreatorStrike').style.display = '';
    document.getElementById('prCreatorStrike').textContent = '$168';
    document.getElementById('prCreatorDetail').textContent = '$108/year · Save $60 · Cancel anytime';
  }
}

function upgradeTo(tier) {
  track('Upgrade Clicked', { tier, period: pricingPeriod });
  // If signed in, route to Stripe subscription checkout
  if (window._pinnedUser) {
    showToast(`✓ Starting your free trial of ${tier}...`);
    // TODO: call Supabase Edge Function to create Stripe subscription checkout
  } else {
    openAuthModal('signup');
  }
}

/* ── CREATOR PRO TABS ── */
function setProTab(tab, btn) {
  track('Creator Pro Tab Switched', { tab });
  document.querySelectorAll('.cr-pro-pane').forEach(p => p.classList.remove('on'));
  document.getElementById('cr-pro-' + tab).classList.add('on');
  document.querySelectorAll('.cr-pro-tab').forEach(t => t.classList.remove('on'));
  btn.classList.add('on');
}

function filterChartPeriod(period, btn) {
  track('Revenue Chart Period Changed', { period });
  btn.parentElement.querySelectorAll('.rev-period-btn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
}

function generateAiKit() {
  const tripName = document.getElementById('aidkTripSelect').value;
  track('AI Distribution Kit Generation Started', { trip: tripName });

  const outputs = document.getElementById('aidkOutputs');
  const generating = document.getElementById('aidkGenerating');
  outputs.style.display = 'none';
  generating.classList.add('show');

  const status = document.getElementById('aidkGenStatus');
  const progressItems = document.querySelectorAll('#aidkGenProgress .aidk-gen-progress-item');
  const messages = [
    { text: `Reading "${tripName}"...`, step: 0 },
    { text: 'Loading your voice profile (47 articles)...', step: 1 },
    { text: 'Drafting the blog post...', step: 2 },
    { text: 'Generating Instagram carousels & TikTok scripts...', step: 3 },
    { text: 'Composing newsletter & YouTube outline...', step: 4 },
    { text: 'Optimizing 30 Pinterest pins for SEO...', step: 5 }
  ];

  let i = 0;
  const iv = setInterval(() => {
    if (i < messages.length) {
      const m = messages[i];
      status.style.opacity = '0';
      setTimeout(() => {
        status.textContent = m.text;
        status.style.opacity = '1';
        progressItems.forEach((p, idx) => {
          p.classList.remove('active');
          if (idx < m.step) p.classList.add('done');
          if (idx === m.step) p.classList.add('active');
        });
      }, 200);
      i++;
    } else {
      clearInterval(iv);
      progressItems.forEach(p => p.classList.add('done'));
      setTimeout(() => {
        generating.classList.remove('show');
        outputs.style.display = '';
        showToast('✨ Distribution kit ready · 6 pieces of content generated');
        track('AI Distribution Kit Generated', { trip: tripName });
      }, 800);
    }
  }, 1300);
}

/* ── CREATOR HUB DISTRIBUTION MODALS ── */
function openDist(id) {
  track('Distribution Tool Opened', { tool: id });
  document.getElementById('modal-' + id).classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeDist(id) {
  document.getElementById('modal-' + id).classList.remove('active');
  document.body.style.overflow = '';
}

function setDistTab(modal, idx, btn) {
  const prefix = modal + '-pane-';
  document.querySelectorAll(`[id^="${prefix}"]`).forEach(p => p.classList.remove('on'));
  document.getElementById(prefix + idx).classList.add('on');
  btn.closest('.dist-tabs').querySelectorAll('.dist-tab').forEach(t => t.classList.remove('on'));
  btn.classList.add('on');
}

function toggleEmbedOpt(el) {
  el.closest('.embed-options, .po-options')
    ? el.closest('.embed-options, .po-options').querySelectorAll('.embed-opt-chip').forEach(c => c.classList.remove('on'))
    : null;
  el.classList.add('on');
  showToast('Preview updated');
}

function togglePlatform(el) {
  el.classList.toggle('on');
  showToast(el.classList.contains('on') ? '✓ Platform selected' : 'Platform deselected');
}

function toggleFmt(el) {
  el.closest('.format-selector').querySelectorAll('.fmt-btn').forEach(b => b.classList.remove('on'));
  el.classList.add('on');
  showToast('Format updated');
}

// Close dist modals on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.dist-modal.active').forEach(m => {
      m.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
});

// Close dist modals on backdrop click
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.dist-modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) closeDist(this.id.replace('modal-',''));
    });
  });
});
