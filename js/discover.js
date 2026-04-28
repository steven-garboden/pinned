/* ── DISCOVER SCREEN ──────────────────────────────── */

let currentForkTrip = null;

function initDiscover() {
  renderTrending();
  renderCities('all');
}

function setDiscoverTab(idx, btn) {
  const tabNames = ['Trending Trips', 'Top 30 Cities'];
  track('Discover Tab Switched', { tab: tabNames[idx] });
  document.querySelectorAll('.dc-pane').forEach(p => p.classList.remove('on'));
  document.getElementById('dc-pane-' + idx).classList.add('on');
  document.querySelectorAll('.dc-tab').forEach(t => t.classList.remove('on'));
  btn.classList.add('on');
}

function renderTrending() {
  const featuredGrid = document.getElementById('trFeaturedGrid');
  if (!featuredGrid) return;
  const featured = trendingTrips.filter(t => t.featured);
  featuredGrid.innerHTML = featured.map(t => `
    <div class="tr-featured-card" onclick="openForkModal(${t.rank})">
      <div class="tr-rank-badge">★ #${t.rank} this week</div>
      <div class="tr-cork">
        <div class="tr-cork-grid"></div>
        <div class="tr-cork-vig"></div>
        ${t.pins.map(p => `<div class="tr-cork-pin ${p.c}" style="left:${p.x}%;top:${p.y}%;"></div>`).join('')}
      </div>
      <div class="tr-card-body">
        <div class="tr-creator-row">
          <div class="tr-creator-avatar">${t.avatar}</div>
          <div>
            <div class="tr-creator-name">${t.creator}</div>
            <div class="tr-creator-meta">${t.followers} followers · ${t.role}</div>
          </div>
          <div class="tr-saves"><span class="tr-saves-arrow">▲</span><span class="tr-saves-count">${t.saves}</span><span class="tr-saves-lbl">saves</span></div>
        </div>
        <div class="tr-trip-name">${t.name}</div>
        <div class="tr-trip-tagline">${t.tagline}</div>
        <div class="tr-trip-meta">
          <div><div class="tr-meta-num">${t.days}</div><div class="tr-meta-lbl">Days</div></div>
          <div><div class="tr-meta-num">${t.stops}</div><div class="tr-meta-lbl">Stops</div></div>
          <div><div class="tr-meta-num">${t.photos}</div><div class="tr-meta-lbl">Photos</div></div>
        </div>
        <div class="tr-tags">${t.tags.map(tag => `<div class="tr-tag">${tag}</div>`).join('')}</div>
        <div class="tr-actions">
          <button class="tr-take-btn" onclick="event.stopPropagation();openForkModal(${t.rank})">⤴ Take this Trip</button>
          <button class="tr-preview-btn" onclick="event.stopPropagation();showToast('Preview opening...')">Preview</button>
        </div>
      </div>
    </div>`).join('');

  const grid = document.getElementById('trGrid');
  const rest = trendingTrips.filter(t => !t.featured);
  grid.innerHTML = rest.map(t => `
    <div class="tr-grid-card" onclick="openForkModal(${t.rank})">
      <div class="tr-grid-cork">
        <div class="tr-cork-grid"></div>
        <div class="tr-cork-vig"></div>
        <div class="tr-grid-rank">#${t.rank}</div>
        <div class="tr-grid-saves">▲ ${t.saves}</div>
        ${t.pins.slice(0,4).map(p => `<div class="tr-cork-pin ${p.c}" style="left:${p.x}%;top:${p.y}%;width:10px;height:10px;"></div>`).join('')}
      </div>
      <div class="tr-grid-body">
        <div class="tr-grid-creator"><div class="tr-grid-avatar">${t.avatar}</div><div class="tr-grid-handle">${t.creator}</div></div>
        <div class="tr-grid-name">${t.name}</div>
        <div class="tr-grid-meta">${t.days} days · ${t.stops} stops · ${t.tags.slice(0,2).join(' · ')}</div>
        <button class="tr-grid-take" onclick="event.stopPropagation();openForkModal(${t.rank})">⤴ Take this Trip</button>
      </div>
    </div>`).join('');

  const newStrip = document.getElementById('trNewStrip');
  if (newStrip) {
    newStrip.innerHTML = newThisWeek.map(n => `
      <div class="tr-new-card" onclick="showToast('Opening ${n.name}...')">
        <div class="tr-new-fresh"><div class="tr-new-fresh-dot"></div>${n.hours}h ago</div>
        <div class="tr-new-name">${n.name}</div>
        <div class="tr-new-creator">${n.avatar} ${n.creator}</div>
        <div class="tr-new-stats">
          <div class="tr-new-stat"><strong>${n.days}</strong> days</div>
          <div class="tr-new-stat"><strong>${n.stops}</strong> stops</div>
        </div>
        <div class="tr-new-cta">View →</div>
      </div>`).join('');
  }
}

function renderCities(region) {
  const grid = document.getElementById('exGrid');
  if (!grid) return;
  const list = region === 'all' ? top30Cities : top30Cities.filter(c => c.region === region);
  grid.innerHTML = list.map(c => `
    <div class="ex-city-card" onclick="showToast('Opening ${c.name} trips & recommendations...')">
      <div class="ex-city-hero">
        <div class="ex-city-bg" style="background:${c.gradient};"></div>
        <div class="ex-city-overlay"></div>
        <div class="ex-city-flag">${c.flag}</div>
        <div class="ex-city-rank">${c.rank}</div>
        <div class="ex-city-emoji">${c.emoji}</div>
      </div>
      <div class="ex-city-body">
        <div class="ex-city-name">${c.name}</div>
        <div class="ex-city-country">${c.country}</div>
        <div class="ex-city-tagline">${c.tagline}</div>
        <div class="ex-city-meta-row">
          <div class="ex-city-meta"><div class="ex-city-meta-num">${c.days}</div><div class="ex-city-meta-lbl">Days</div></div>
          <div class="ex-city-meta"><div class="ex-city-meta-num" style="font-size:11px;line-height:1.2;">${c.season}</div><div class="ex-city-meta-lbl">Best season</div></div>
          <div class="ex-city-meta"><div class="ex-city-meta-num">${c.trips}</div><div class="ex-city-meta-lbl">Trips</div></div>
        </div>
        <div class="ex-city-trips-link">See all ${c.trips} trips<span class="ex-city-trips-arrow">→</span></div>
      </div>
    </div>`).join('');
}

function filterCityRegion(region, btn) {
  track('Top Cities Region Filter', { region });
  btn.closest('.ex-region-tabs').querySelectorAll('.ex-region-tab').forEach(t => t.classList.remove('on'));
  btn.classList.add('on');
  renderCities(region);
}

function filterChip(btn) {
  const filter = btn.textContent.trim();
  track('Discover Filter Applied', { filter });
  btn.closest('.tr-filters').querySelectorAll('.tr-filter-chip').forEach(c => c.classList.remove('on'));
  btn.classList.add('on');
  showToast('Filter applied');
}

function openForkModal(rank) {
  const trip = trendingTrips.find(t => t.rank === rank);
  if (!trip) return;
  const tripName = trip.name.replace(/<[^>]*>/g, '');
  track('Take This Trip Clicked', { trip: tripName, rank: trip.rank, creator: trip.creator });
  currentForkTrip = trip;
  document.getElementById('forkTitle').innerHTML = trip.name;
  document.getElementById('forkAvatar').textContent = trip.avatar;
  document.getElementById('forkCreator').textContent = trip.creator;
  document.getElementById('forkCreatorMeta').textContent = `${trip.followers} followers · ${trip.role}`;
  document.getElementById('forkSaves').textContent = `↑ ${trip.saves} saves`;
  document.getElementById('forkStops').innerHTML = trip.stops_list.map((s, i) =>
    `<div class="ftp-stop"><div class="ftp-stop-num">${i+1}</div>${s}</div>`
  ).join('');
  document.getElementById('forkAttrName').textContent = `"Inspired by ${trip.creator}"`;
  document.getElementById('fork-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeForkModal() {
  document.getElementById('fork-modal').classList.remove('active');
  document.body.style.overflow = '';
  currentForkTrip = null;
}

function confirmFork() {
  if (!currentForkTrip) return;
  const tripName = currentForkTrip.name.replace(/<[^>]*>/g, '');
  track('Trip Forked', { trip: tripName, rank: currentForkTrip.rank, creator: currentForkTrip.creator });
  closeForkModal();
  showToast(`✓ ${tripName} forked to your journal — make it yours!`);
  setTimeout(() => goTo('journal'), 800);
}

document.addEventListener('DOMContentLoaded', () => {
  const forkModal = document.getElementById('fork-modal');
  if (forkModal) forkModal.addEventListener('click', e => { if (e.target === forkModal) closeForkModal(); });
});
