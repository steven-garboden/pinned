/* ── PHOTOS SCREEN ──────────────────────────────────── */

let selPhotos = new Set(), favPhotos = new Set(), photoFilter = 'all', allSel = false;

function initPhotos() {
  const cont = document.getElementById('plStops');
  if (!cont) return;
  cont.innerHTML = plStopData.map((s, i) => `
    <div class="pl-stop ${i===0?'on':''}" onclick="selectPlStop(this)">
      <div class="pl-dot" style="background:${s.color};"></div>
      <div class="pl-stop-name">${s.name}</div>
      <div class="pl-stop-ct">${s.ct}</div>
    </div>`).join('');
  renderPhotoGrid();
}

function selectPlStop(el) {
  document.querySelectorAll('.pl-stop').forEach(e => e.classList.remove('on'));
  el.classList.add('on');
  selPhotos.clear(); favPhotos.clear();
  renderPhotoGrid(); renderTray();
}

function getFilteredPhotos(q) {
  let p = [...photoList];
  if (q) p = p.filter(ph => ph.loc.toLowerCase().includes(q.toLowerCase()));
  if (photoFilter === 'high') p = p.filter(ph => ph.conf === 'high');
  if (photoFilter === 'fav')  p = p.filter(ph => favPhotos.has(ph.id));
  return p;
}

function renderPhotoGrid(q='') {
  const scroll = document.getElementById('photoGridScroll');
  if (!scroll) return;
  const photos = getFilteredPhotos(q);
  const groups = {};
  photos.forEach(p => { if(!groups[p.time]) groups[p.time]=[]; groups[p.time].push(p); });
  scroll.innerHTML = Object.entries(groups).map(([day, dph]) => `
    <div class="photo-date-group"><div class="photo-date-lbl">${day} · ${dph.length} photos</div></div>
    <div class="photo-grid">
      ${dph.map((p, i) => `
        <div class="photo-cell ${selPhotos.has(p.id)?'sel':''} ${favPhotos.has(p.id)?'fav':''}" style="animation-delay:${i*0.03}s;" onclick="togglePhotoSel(${p.id})">
          <div class="photo-emoji" style="background:${p.bg};">${p.e}</div>
          <div class="photo-ring"></div>
          <div class="photo-check"></div>
          <div class="photo-conf ${p.conf==='high'?'conf-hi':'conf-mb'}">${p.conf==='high'?'Match':'Maybe'}</div>
          <div class="photo-star" onclick="toggleFav(event,${p.id})">${favPhotos.has(p.id)?'⭐':'☆'}</div>
        </div>`).join('')}
    </div>`).join('');
  document.getElementById('photoSelCount').textContent = selPhotos.size;
}

function togglePhotoSel(id) {
  if (selPhotos.has(id)) { selPhotos.delete(id); favPhotos.delete(id); }
  else { selPhotos.add(id); if(selPhotos.size===1) showToast('💡 Tap ⭐ to mark favorites'); }
  document.getElementById('plSumSel').textContent = selPhotos.size;
  renderPhotoGrid(); renderTray();
}

function toggleFav(e, id) {
  e.stopPropagation();
  if (!selPhotos.has(id)) selPhotos.add(id);
  if (favPhotos.has(id)) favPhotos.delete(id);
  else { favPhotos.add(id); showToast('⭐ Favorite — appears first in journal'); }
  document.getElementById('plSumFav').textContent = favPhotos.size;
  document.getElementById('plSumSel').textContent = selPhotos.size;
  renderPhotoGrid(); renderTray();
}

function renderTray() {
  const body = document.getElementById('trayBody');
  const btn  = document.getElementById('trayImportBtn');
  const n = selPhotos.size;
  if (n === 0) {
    body.innerHTML = '<div class="tray-empty"><div class="tray-empty-icon">🖼</div><div class="tray-empty-txt">Tap photos to add them here</div></div>';
    btn.disabled = true; btn.textContent = 'Import 0 Photos'; return;
  }
  const sel = photoList.filter(p => selPhotos.has(p.id)).sort((a, b) => favPhotos.has(b.id) - favPhotos.has(a.id));
  body.innerHTML = sel.map(p => `
    <div class="tray-thumb" style="background:${p.bg};">${p.e}
      <button class="tray-remove" onclick="removeFromTray(event,${p.id})">✕</button>
      ${favPhotos.has(p.id)?'<span style="position:absolute;bottom:4px;right:4px;font-size:11px;">⭐</span>':''}
    </div>`).join('');
  btn.disabled = false; btn.textContent = `Import ${n} Photo${n!==1?'s':''}`;
}

function removeFromTray(e, id) {
  e.stopPropagation();
  selPhotos.delete(id); favPhotos.delete(id);
  document.getElementById('plSumSel').textContent = selPhotos.size;
  document.getElementById('plSumFav').textContent = favPhotos.size;
  renderPhotoGrid(); renderTray();
}

function toggleSelAll() {
  allSel = !allSel;
  const photos = getFilteredPhotos('');
  if (allSel) { photos.forEach(p => selPhotos.add(p.id)); document.getElementById('selAllIcon').textContent='☑'; }
  else { photos.forEach(p => { selPhotos.delete(p.id); favPhotos.delete(p.id); }); document.getElementById('selAllIcon').textContent='☐'; }
  document.getElementById('plSumSel').textContent = selPhotos.size;
  renderPhotoGrid(); renderTray();
}

function setPhotoFilter(f, el) {
  photoFilter = f;
  document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('on'));
  el.classList.add('on');
  renderPhotoGrid();
}

function filterPhotoGrid(q) { renderPhotoGrid(q); }

/* ── GOOGLE PHOTOS MODAL ── */
function openGpModal() {
  document.getElementById('gphotos-modal').classList.add('active');
  document.getElementById('gpConnectState').style.display = 'block';
  document.getElementById('gpLoadingState').classList.remove('show');
  document.getElementById('gpSuccessState').style.display = 'none';
  document.getElementById('gpProgressFill').style.width = '0%';
}

function closeGpModal() { document.getElementById('gphotos-modal').classList.remove('active'); }

function startGpConnect() {
  track('Google Photos Connect Started');
  document.getElementById('gpConnectState').style.display = 'none';
  const loading = document.getElementById('gpLoadingState');
  loading.classList.add('show');
  const messages = ['Connecting to Google Photos...','Scanning by location & date...','Matching to trip stops...','Almost ready...'];
  let progress = 0, msgIdx = 0;
  const bar = document.getElementById('gpProgressFill');
  const text = document.getElementById('gpLoadingText');
  const iv = setInterval(() => {
    progress += 7;
    bar.style.width = Math.min(progress, 100) + '%';
    if (msgIdx < messages.length && progress > msgIdx * 28) text.textContent = messages[msgIdx++];
    if (progress >= 100) {
      clearInterval(iv);
      setTimeout(() => {
        loading.classList.remove('show');
        document.getElementById('gpSuccessState').style.display = 'block';
        document.getElementById('gpSuccessText').textContent = `Found 221 photos across your ${trips[curTrip].title} trip`;
        if (!window._photosInit) { window._photosInit = true; initPhotos(); }
      }, 300);
    }
  }, 80);
}
