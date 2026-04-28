/* ── NARRATION SCREEN ──────────────────────────────── */

let narrTypeTimeout = null;

function initNarration() {
  const narrPhotos = [
    {e:"🏛️",bg:"#2a1a0a",cover:true,fav:true},
    {e:"🍕",bg:"#1a2a0a",fav:true},
    {e:"☕",bg:"#0a1a2a"},
    {e:"🌅",bg:"#2a0a10",fav:true},
    {e:"🏺",bg:"#2a1a1a"},
    {e:"🌙",bg:"#0a0a2a"},
    {e:"🍷",bg:"#0a2a1a"},
    {e:"🎭",bg:"#1a0a1a"},
    {e:"🌿",bg:"#0a2a0a"},
  ];
  const strip = document.getElementById('narrStrip');
  if (strip) {
    strip.innerHTML = narrPhotos.map(p => `
      <div class="narr-strip-photo ${p.cover?'cover':''}" style="background:${p.bg};">
        ${p.e}
        ${p.fav?'<div class="narr-strip-fav">⭐</div>':''}
        ${p.cover?'<div class="narr-strip-covbadge">Cover</div>':''}
      </div>`).join('');
  }
  setTimeout(() => startNarrDraft(), 500);
}

function startNarrDraft() {
  const textEl = document.getElementById('narrAiText');
  if (!textEl) return;
  textEl.innerHTML = `<div style="display:flex;align-items:center;gap:8px;font-family:var(--label);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--sapphire);">
    <div class="typing-dots"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>
    Reading your photos...
  </div>`;
  setTimeout(() => {
    textEl.innerHTML = '<span id="narrTyped"></span><span class="ai-cursor" id="narrCursor"></span>';
    typewriter(document.getElementById('narrTyped'), document.getElementById('narrCursor'), narrDrafts[0]);
  }, 1400);
}

function typewriter(typedEl, cursorEl, text) {
  if (narrTypeTimeout) clearTimeout(narrTypeTimeout);
  typedEl.textContent = '';
  if (cursorEl) cursorEl.style.display = 'inline-block';
  let i = 0;
  function tick() {
    if (i < text.length) { typedEl.textContent += text[i++]; narrTypeTimeout = setTimeout(tick, 13 + Math.random()*9); }
    else { if (cursorEl) cursorEl.style.display = 'none'; }
  }
  tick();
}

function acceptAiDraft() {
  const typed = document.getElementById('narrTyped');
  if (!typed) return;
  track('AI Narration Accepted');
  document.getElementById('narrTa').value = typed.textContent;
  updateNarrWC();
  document.getElementById('narrAiBanner').style.display = 'none';
  showToast('✓ Draft added — edit freely to make it yours');
}

function dismissAiBanner() {
  document.getElementById('narrAiBanner').style.display = 'none';
  showToast('Draft dismissed');
}

function regenAiDraft() {
  document.getElementById('narrAiBanner').style.display = 'block';
  if (narrTypeTimeout) clearTimeout(narrTypeTimeout);
  const textEl = document.getElementById('narrAiText');
  textEl.innerHTML = `<div style="display:flex;align-items:center;gap:8px;font-family:var(--label);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--sapphire);">
    <div class="typing-dots"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>
    Generating new draft...
  </div>`;
  setTimeout(() => {
    textEl.innerHTML = '<span id="narrTyped"></span><span class="ai-cursor" id="narrCursor"></span>';
    const draft = narrDrafts[Math.floor(Math.random() * narrDrafts.length)];
    typewriter(document.getElementById('narrTyped'), document.getElementById('narrCursor'), draft);
  }, 1300);
  track('AI Narration Regenerated');
}

function updateNarrWC() {
  const ta = document.getElementById('narrTa');
  if (!ta) return;
  const w = ta.value.trim().split(/\s+/).filter(x => x.length).length;
  document.getElementById('narrWC').textContent = `${w} word${w!==1?'s':''}`;
}

function toggleFeeling(btn) {
  document.querySelectorAll('.feeling-chip').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
}

function addPrompt(text) {
  const ta = document.getElementById('narrTa');
  ta.value += (ta.value && !ta.value.endsWith('\n') ? '\n\n' : '') + text;
  ta.focus(); updateNarrWC();
  showToast('Prompt added');
}
