/* ── JOURNAL (MAP BOARD) ────────────────────────────── */

let curTrip = 0, boardMode = 'journal', selStop = null;
let _map = null, _markers = [], _pinEls = [];

function initJournal() { renderBoard(); }

function renderBoard() {
  const t = trips[curTrip];
  document.getElementById('jsbTitle').textContent  = t.title;
  document.getElementById('jsbSub').textContent    = t.sub;
  document.getElementById('jsbStops').textContent  = t.stats.stops;
  document.getElementById('jsbDays').textContent   = t.stats.days;
  document.getElementById('jsbPhotos').textContent = t.stats.photos;
  document.getElementById('jsbRec').textContent    = t.stats.rec;

  _initMap(t);
  renderStopList(t.stops);
}

function _initMap(t) {
  const el = document.getElementById('corkboard');

  document.querySelectorAll('.polaroid').forEach(e => e.remove());
  document.getElementById('stringsSvg').innerHTML = '';

  _markers.forEach(m => m.remove());
  _markers = [];
  _pinEls = [];

  // Init map once — Voyager tiles for warm tone, zoom in bottom-right
  if (!_map) {
    _map = L.map('corkboard', {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
    });

    // Warmer CartoDB Voyager tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(_map);

    // Zoom control bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(_map);

    // Minimal attribution bottom-right
    L.control.attribution({ prefix: false, position: 'bottomright' })
      .addAttribution('© CARTO © OSM')
      .addTo(_map);
  }

  const stops = t.stops.filter(s => s.lat && s.lng);
  if (!stops.length) return;

  const colorMap = { red: '#d94040', gold: '#f0c040', blue: '#4090d0' };

  stops.forEach((s, i) => {
    const c = boardMode === 'guide' && s.rec ? '#f0c040' : (colorMap[s.color] || '#f0c040');
    const isDark = c === '#f0c040';

    const icon = L.divIcon({
      className: '',
      html: `
        <div class="map-pin-wrap" data-idx="${i}">
          <div class="map-pin-body" style="background:radial-gradient(circle at 35% 35%, ${c}, ${c}bb);">
            <span class="pin-num" style="color:${isDark ? '#1a0e00' : '#fff'}">${i + 1}</span>
          </div>
          <div class="map-pin-label">${s.name}</div>
          <div class="map-pin-polaroid" style="display:none;">
            <div class="pol-photo" style="background:${polBg(i)};font-size:22px;display:flex;align-items:center;justify-content:center;width:72px;height:72px;">${s.pol}</div>
            <div class="pol-caption">${s.polcap || s.name}</div>
          </div>
        </div>`,
      iconSize: [80, 60],
      iconAnchor: [20, 50],
    });

    const marker = L.marker([s.lat, s.lng], { icon })
      .addTo(_map)
      .on('click', () => openStopDetail(s, i));

    _markers.push(marker);
  });

  // Route line — thicker, warmer, with drop shadow via two layered lines
  if (boardMode === 'journal' && stops.length > 1) {
    const latlngs = stops.map(s => [s.lat, s.lng]);
    // Shadow line (slightly wider, dark)
    const shadow = L.polyline(latlngs, {
      color: 'rgba(0,0,0,0.15)',
      weight: 5,
      dashArray: '8 10',
    }).addTo(_map);
    // Main line
    const line = L.polyline(latlngs, {
      color: 'rgba(200,146,10,0.8)',
      weight: 3,
      dashArray: '8 10',
    }).addTo(_map);
    _markers.push(shadow, line);
  }

  // Fit bounds with extra padding so Sicily/edge stops aren't clipped
  const bounds = L.latLngBounds(stops.map(s => [s.lat, s.lng]));
  setTimeout(() => {
    _map.invalidateSize();
    _map.fitBounds(bounds, { padding: [90, 90], maxZoom: 8 });
  }, 80);

  // Store pin DOM refs after map renders for active highlight
  setTimeout(() => {
    _pinEls = Array.from(document.querySelectorAll('.map-pin-wrap'));
    _highlightPin(selStop);
  }, 300);
}

// Highlight the active pin on the map
function _highlightPin(idx) {
  _pinEls.forEach((el, i) => {
    el.classList.toggle('map-pin-active', i === idx);
  });
}

function polBg(i) {
  return ['#2a1a0a','#1a2a0a','#0a1a2a','#2a0a10','#1a0a2a','#0a2a1a'][i % 6];
}

function openStopDetail(s, i) {
  selStop = i;
  _highlightPin(i);
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
