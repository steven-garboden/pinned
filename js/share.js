/* ── SHARE MODAL ──────────────────────────────────── */

let selectedFrames = new Set([0,1,2,3,4,5,6,7]);

function openShareModal() {
  track('Share Modal Opened', { trip: trips[curTrip].title });
  document.getElementById('share-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
  if (!window._storyFramesBuilt) { buildStoryFrames(); window._storyFramesBuilt = true; }
}

function closeShareModal() {
  document.getElementById('share-modal').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  const shareModal = document.getElementById('share-modal');
  if (shareModal) shareModal.addEventListener('click', function(e) { if (e.target === this) closeShareModal(); });
});

function setShareTab(idx, btn) {
  const tabNames = ['Story Sequence', 'Reel Cover', 'Feed Post', 'Shareable Link'];
  track('Share Format Selected', { format: tabNames[idx] });
  document.querySelectorAll('.share-pane').forEach(p => p.classList.remove('on'));
  document.getElementById('share-pane-' + idx).classList.add('on');
  document.querySelectorAll('.sft-tab').forEach(t => t.classList.remove('on'));
  btn.classList.add('on');
}

function buildStoryFrames() {
  const strip = document.getElementById('storyFrameStrip');
  if (!strip) return;
  strip.innerHTML = storyFrames.map((f, i) => buildFrameEl(f, i)).join('');
  updateFrameCount();
}

function buildFrameEl(f, i) {
  const sel = selectedFrames.has(i) ? 'selected' : '';
  if (f.type === 'title') return `
    <div class="sf-frame ${sel}" onclick="toggleFrame(${i},this)">
      <div class="sf-frame-num">${i+1}</div>
      <div class="sf-frame-check">✓</div>
      <div class="sf-title-frame">
        <div class="sf-title-ambient"></div>
        <div class="sf-wander-logo"><div class="sf-logo-pin"></div><div class="sf-logo-text">Pinned</div></div>
        <div class="sf-title-country">Italy<br>Summer 2024</div>
        <div class="sf-title-dates">June 12 — July 3</div>
        <div class="sf-title-stats">
          <div class="sf-stat"><div class="sf-stat-num">6</div><div class="sf-stat-lbl">stops</div></div>
          <div class="sf-stat-div"></div>
          <div class="sf-stat"><div class="sf-stat-num">21</div><div class="sf-stat-lbl">days</div></div>
          <div class="sf-stat-div"></div>
          <div class="sf-stat"><div class="sf-stat-num">142</div><div class="sf-stat-lbl">photos</div></div>
        </div>
      </div>
    </div>`;

  if (f.type === 'stop') return `
    <div class="sf-frame ${sel}" onclick="toggleFrame(${i},this)">
      <div class="sf-frame-num">${i+1}</div>
      <div class="sf-frame-check">✓</div>
      <div class="sf-stop-frame">
        <div class="sf-stop-photo" style="background:${f.bg};">
          ${f.emoji}
          <div class="sf-stop-photo-overlay"></div>
        </div>
        <div class="sf-stop-body">
          <div class="sf-stop-num-lbl">Stop ${f.idx+1} of 6</div>
          <div class="sf-stop-city">${f.city}</div>
          <div class="sf-stop-date">${f.date}</div>
          <div class="sf-stop-narr">${f.narr}</div>
          <div class="sf-stop-location"><div class="sf-stop-dot"></div><div class="sf-stop-loc-text">${f.city}, Italy</div></div>
          <div class="sf-stop-wander"><div class="sf-stop-wander-text">Pinned</div></div>
        </div>
      </div>
    </div>`;

  const qrPattern = [1,1,1,0,1,1,0,1,0,1,1,1,1,0,0,0,1,0,1,0,1,0,0,1,1,0,0,0,1,1,0,1,1,1,0,1,0,1,0,0,1,1,0,1,0,0,1,0,1,1];
  return `
    <div class="sf-frame ${sel}" onclick="toggleFrame(${i},this)">
      <div class="sf-frame-num">${i+1}</div>
      <div class="sf-frame-check">✓</div>
      <div class="sf-final-frame">
        <div class="sf-final-ambient"></div>
        <div class="sf-final-cork">
          <div class="sf-cork-grid"></div>
          <svg class="sf-final-route" viewBox="0 0 70 55" preserveAspectRatio="none">
            <path d="M13,23 Q19,17 40,21 Q52,14 64,12" stroke="rgba(122,62,20,0.6)" stroke-width="1" fill="none"/>
          </svg>
          ${[{x:'18%',y:'42%',c:'#d94040'},{x:'28%',y:'30%',c:'#d94040'},{x:'16%',y:'24%',c:'#f0c040'},{x:'38%',y:'20%',c:'#4090d0'},{x:'32%',y:'60%',c:'#f0c040'},{x:'46%',y:'72%',c:'#f0c040'}].map(p=>`<div style="position:absolute;left:${p.x};top:${p.y};width:7px;height:7px;background:${p.c};border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 1px 3px rgba(0,0,0,0.3);"></div>`).join('')}
        </div>
        <div class="sf-final-title">Italy · Summer 2024</div>
        <div class="sf-final-sub">6 stops · 21 days · 142 photos</div>
        <div class="sf-cta-pill">Build yours at pinned.app</div>
        <div class="sf-qr-block">${qrPattern.map(c=>`<div class="sf-qr-cell ${c?'sf-qr-dark':'sf-qr-light'}"></div>`).join('')}</div>
        <div class="sf-url">pinned.app</div>
      </div>
    </div>`;
}

function toggleFrame(idx, el) {
  if (selectedFrames.has(idx)) { selectedFrames.delete(idx); el.classList.remove('selected'); }
  else { selectedFrames.add(idx); el.classList.add('selected'); }
  updateFrameCount();
}

function selectAllFrames() {
  storyFrames.forEach((_, i) => selectedFrames.add(i));
  document.querySelectorAll('.sf-frame').forEach(el => el.classList.add('selected'));
  updateFrameCount();
}

function selectNoneFrames() {
  selectedFrames.clear();
  document.querySelectorAll('.sf-frame').forEach(el => el.classList.remove('selected'));
  updateFrameCount();
}

function updateFrameCount() {
  const n = selectedFrames.size;
  const badge = document.getElementById('frameCountBadge');
  if (badge) badge.textContent = `${n} of ${storyFrames.length} selected`;
}

function setCapTone(tone, btn) {
  btn.closest('.sc-section').querySelectorAll('.sc-sel-btn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  const preview = document.getElementById('captionPreview');
  if (preview && captions[tone]) {
    preview.innerHTML = captions[tone].replace(/\n/g,'<br>') + '<button class="sc-caption-copy" onclick="showToast(\'✓ Caption copied!\')">Copy</button>';
  }
}

function selectFeedStyle(style) {
  document.getElementById('feedCork').style.border = style==='cork' ? '3px solid var(--gold)' : '';
  document.getElementById('feedDark').style.border = style==='dark' ? '3px solid var(--gold)' : '';
  document.getElementById('fsbCork').classList.toggle('on', style==='cork');
  document.getElementById('fsbDark').classList.toggle('on', style==='dark');
  showToast(`Style: ${style === 'cork' ? 'Cork Board' : 'Dark Map'}`);
}

/* ── COLLABORATE ── */
let collabInvitesSent = [];

function openCollabModal() {
  track('Collaborate Modal Opened');
  document.getElementById('collab-modal').classList.add('active');
}

function closeCollabModal() { document.getElementById('collab-modal').classList.remove('active'); }

function sendCollabInvite() {
  const input = document.getElementById('inviteEmailInput');
  const email = input.value.trim();
  if (!email || !email.includes('@')) { showToast('Please enter a valid email'); return; }
  track('Collaborator Invited');
  collabInvitesSent.push(email); input.value = '';
  if (email.toLowerCase().includes('marco') || collabInvitesSent.length === 1) {
    document.getElementById('collabMarcoCard').style.display = 'flex';
    updateCollabAvatars('Marco');
  } else {
    document.getElementById('collabSarahCard').style.display = 'flex';
    updateCollabAvatars('Sarah');
  }
  showToast(`✉️ Invite sent to ${email}`);
}

function updateCollabAvatars(name) {
  const strip = document.getElementById('collabAvatarsStrip');
  if (strip.querySelectorAll('.collab-avatar-row').length >= 3) return;
  const row = document.createElement('div');
  row.className = 'collab-avatar-row';
  row.style.cursor = 'pointer';
  row.onclick = openCollabModal;
  row.innerHTML = `<div class="ca-dot" style="background:rgba(200,146,10,0.6);"></div><div class="ca-name">${name}</div><div class="ca-badge">invited</div>`;
  strip.appendChild(row);
}

function togglePerm(btn) {
  const toggle = btn.closest('.cp-toggle');
  toggle.querySelectorAll('.cp-toggle-btn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
}
