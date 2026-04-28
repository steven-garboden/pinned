/* ── CINEMATIC PLAYBACK ──────────────────────────────── */

let cineInterval = null, cinePaused = false, cineStep = 0;

function startCinematic() {
  const overlay = document.getElementById('cinematic-overlay');
  overlay.classList.add('active');
  cinePaused = false; cineStep = 0;
  const stops = trips[curTrip].stops;
  track('Cinematic Started', { trip: trips[curTrip].title, stops: stops.length });

  document.getElementById('cineStopDots').innerHTML = stops.map((_, i) => `<div class="cine-stop-dot" id="cdot-${i}"></div>`).join('');

  const mapInner = document.getElementById('cineMapInner');
  mapInner.querySelectorAll('.cine-pin').forEach(e => e.remove());
  stops.forEach((s, i) => {
    const pin = document.createElement('div');
    pin.className = 'cine-pin'; pin.id = `cpin-${i}`;
    pin.style.cssText = `left:${s.x}%;top:${s.y}%;`;
    pin.innerHTML = `<div class="cine-pin-dot"></div><div class="cine-pin-label">${s.name}</div>`;
    mapInner.appendChild(pin);
  });

  const svg = document.getElementById('cineSvg');
  svg.innerHTML = '';
  stops.forEach((s, i) => {
    if (i >= stops.length - 1) return;
    const b = stops[i + 1];
    const x1=s.x*6, y1=s.y*4.5, x2=b.x*6, y2=b.y*4.5;
    const cx=(x1+x2)/2+(Math.random()-.5)*40, cy=(y1+y2)/2+(Math.random()-.5)*30;
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d',`M${x1},${y1} Q${cx},${cy} ${x2},${y2}`);
    path.setAttribute('class','cine-string'); path.id = `cstr-${i}`;
    svg.appendChild(path);
  });

  setTimeout(() => document.getElementById('cineMap').classList.add('visible'), 300);
  runCineStep(stops, 0);
}

function runCineStep(stops, idx) {
  if (idx >= stops.length) {
    setTimeout(() => {
      document.getElementById('cineCard').classList.remove('up');
      setTimeout(() => {
        document.getElementById('cineStopName').innerHTML = '<em>The End</em>';
        document.getElementById('cineStopNum').textContent = 'Your journey';
        document.getElementById('cineStopDate').textContent = trips[curTrip].sub;
        document.getElementById('cineNarration').textContent = 'Every place you visited. Every memory you made. All of it, yours forever.';
        document.getElementById('cinePhotos').innerHTML = '';
        document.getElementById('cineCard').classList.add('up');
        document.getElementById('cineProgressFill').style.width = '100%';
        track('Cinematic Completed', { trip: trips[curTrip].title });
        setTimeout(() => {
          const ec = document.getElementById('cineEndcard');
          if (ec) {
            ec.classList.add('show');
            track('Cinematic Endcard Shown', { trip: trips[curTrip].title });
          }
        }, 4000);
      }, 400);
    }, 400);
    return;
  }

  const s = stops[idx];
  const card = document.getElementById('cineCard');
  const flash = document.getElementById('cineFlash');
  document.getElementById('cineProgressFill').style.width = `${(idx / stops.length) * 100}%`;
  document.querySelectorAll('.cine-stop-dot').forEach((d, i) => {
    d.classList.remove('active','done');
    if (i < idx) d.classList.add('done');
    if (i === idx) d.classList.add('active');
  });

  flash.classList.add('show');
  setTimeout(() => flash.classList.remove('show'), 180);
  card.classList.remove('up');
  setTimeout(() => {
    document.getElementById('cineStopNum').textContent = `Stop ${idx+1} of ${stops.length}`;
    document.getElementById('cineStopName').textContent = s.name;
    document.getElementById('cineStopDate').textContent = s.date;
    document.getElementById('cineNarration').textContent = s.narration;
    const photoBgs = ['#2a1a0a','#1a2a0a','#0a1a2a','#2a0a10'];
    document.getElementById('cinePhotos').innerHTML = s.tags.slice(0,3).map((t, i) => `<div class="cine-photo" style="background:${photoBgs[i%4]};">${s.pol}</div>`).join('') + `<div class="cine-photo" style="background:#1a1a2a;">${s.emoji}</div>`;
    card.classList.add('up');
    const pin = document.getElementById(`cpin-${idx}`);
    if (pin) setTimeout(() => pin.classList.add('shown'), 300);
    if (idx > 0) { const str = document.getElementById(`cstr-${idx-1}`); if (str) str.classList.add('drawn'); }
  }, 500);

  if (!cinePaused) {
    cineStep = idx;
    cineInterval = setTimeout(() => { if (!cinePaused) runCineStep(stops, idx + 1); }, 4500);
  }
}

function toggleCinePause() {
  cinePaused = !cinePaused;
  const btn = document.getElementById('cinePauseBtn');
  if (cinePaused) { clearTimeout(cineInterval); btn.textContent = '▶ Resume'; }
  else { btn.textContent = '⏸ Pause'; runCineStep(trips[curTrip].stops, cineStep + 1); }
}

function closeCinematic() {
  clearTimeout(cineInterval); cinePaused = false;
  document.getElementById('cinematic-overlay').classList.remove('active');
  document.getElementById('cineMap').classList.remove('visible');
  document.getElementById('cineCard').classList.remove('up');
  document.getElementById('cineProgressFill').style.width = '0%';
  document.querySelectorAll('.cine-pin').forEach(p => p.classList.remove('shown'));
  document.querySelectorAll('.cine-string').forEach(s => s.classList.remove('drawn'));
  const ec = document.getElementById('cineEndcard');
  if (ec) ec.classList.remove('show');
  const ecForm = document.getElementById('cineEndForm');
  const ecSucc = document.getElementById('cineEndSuccess');
  if (ecForm) ecForm.style.display = '';
  if (ecSucc) ecSucc.classList.remove('show');
}

function submitEndCard() {
  const email = document.getElementById('cineEndEmail').value.trim();
  if (!email || !email.includes('@')) { showToast('Please enter a valid email address'); return; }
  track('Endcard Email Submitted', { trip: trips[curTrip].title });
  document.getElementById('cineEndForm').style.display = 'none';
  document.getElementById('cineEndSuccess').classList.add('show');
}
