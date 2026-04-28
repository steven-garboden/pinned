/* ── JOURNAL (CORK BOARD) ──────────────────────────── */

let curTrip = 0, boardMode = 'journal', selStop = null;

function initJournal() { renderBoard(); }

function renderBoard() {
  const t = trips[curTrip];
  document.getElementById('jsbTitle').textContent  = t.title;
  document.getElementById('jsbSub').textContent    = t.sub;
  document.getElementById('jsbStops').textContent  = t.stats.stops;
  document.getElementById('jsbDays').textContent   = t.stats.days;
  document.getElementById('jsbPhotos').textContent = t.stats.photos;
  document.getElementById('jsbRec').textContent    = t.stats.rec;

  const board = document.getElementById('corkboard');
  document.querySelectorAll('.pin,.polaroid').forEach(e => e.remove());

  const svg = document.getElementById('stringsSvg');
  svg.innerHTML = '';
  if (boardMode === 'journal') {
    t.stops.forEach((s, i) => {
      if (i >= t.stops.length - 1) return;
      const b = t.stops[i + 1];
      const x1=s.x*10, y1=s.y*7, x2=b.x*10, y2=b.y*7;
      const cx=(x1+x2)/2+(Math.random()-.5)*50, cy=(y1+y2)/2+(Math.random()-.5)*35;
      const path = document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('d', `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`);
      path.setAttribute('class','trip-string');
      path.style.animationDelay = `${i*0.18}s`;
      svg.appendChild(path);
    });
  }

  t.stops.forEach((s, i) => {
    const delay = i * 0.09;

    const pin = document.createElement('div');
    pin.className = 'pin';
    pin.style.cssText = `left:${s.x}%;top:${s.y}%;animation-delay:${delay}s;`;
    pin.innerHTML = `<div class="pin-tooltip">${s.name}</div><div class="pin-body ${boardMode==='guide'&&s.rec?'gold':s.color}"><span class="pin-num">${i+1}</span></div>`;
    pin.onclick = () => openStopDetail(s, i);
    board.appendChild(pin);

    if (boardMode === 'journal') {
      const rots = [-6,3,-4,5,-2,4,-3,2];
      const rot = rots[i % rots.length];
      const ox = (Math.random()-.5)*75, oy = (Math.random()-.5)*55;
      const pol = document.createElement('div');
      pol.className = 'polaroid';
      pol.style.cssText = `left:calc(${s.x}%+${ox+20}px);top:calc(${s.y}%+${oy+12}px);--rot:rotate(${rot}deg);transform:rotate(${rot}deg);animation-delay:${delay+0.14}s;`;
      pol.innerHTML = `<div class="polaroid-inner"><div class="pol-photo" style="background:${polBg(i)};">${s.pol}</div><div class="pol-caption">${s.polcap||s.name}</div></div>`;
      pol.onclick = () => openStopDetail(s, i);
      board.appendChild(pol);
    }
  });

  renderStopList(t.stops);
}

function polBg(i) {
  return ['#2a1a0a','#1a2a0a','#0a1a2a','#2a0a10','#1a0a2a','#0a2a1a'][i % 6];
}

function openStopDetail(s, i) {
  selStop = i;
  renderStopList(trips[curTrip].stops);
  showToast(`📍 ${s.name} · ${s.date}`);
  track('Stop Tapped', { stop: s.name, trip: trips[curTrip].title });
}

function renderStopList(stops) {
  const list = document.getElementById('jsbScroll');
  list.innerHTML = stops.map((s, i) => `
    <div class="stop-item ${selStop===i?'sel':''}" onclick="openStopDetail(stops_ref[${curTrip}][${i}], ${i})">
      <div class="si-row"><div class="si-num">${i+1}</div><div><div class="si-name">${s.emoji} ${s.name}</div><div class="si-date">${s.date}</div></div></div>
      <div class="si-tags">${s.tags.map(t=>`<span class="si-tag">${t}</span>`).join('')}</div>
      <div class="si-narration">"${s.narration.substring(0,80)}…"</div>
    </div>`).join('');
}

function setBoardMode(m) {
  boardMode = m;
  document.getElementById('modeJournal').classList.toggle('active', m==='journal');
  document.getElementById('modeGuide').classList.toggle('active', m==='guide');
  renderBoard();
  track('Board Mode Changed', { mode: m });
}

function selectTrip(idx, btn) {
  curTrip = idx;
  track('Trip Selected', { trip: trips[idx].title });
  document.querySelectorAll('.trip-chip').forEach(b => { b.className='trip-chip off'; });
  btn.className = 'trip-chip on';
  selStop = null;
  renderBoard();
}
