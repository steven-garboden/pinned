/* ── ITINERARY SCREEN ──────────────────────────────── */

let expandedStops = new Set(), aiLoaded = new Set();

function initItinerary() { renderItinerary(); }

function renderItinerary() {
  const body = document.getElementById('itinBody');
  if (!body) return;
  body.innerHTML = `
    <div>
      <div class="city-intro-card">
        <div class="cic-badge">📜 Historical Context</div>
        <div class="cic-title">Before you arrive: understanding Rome</div>
        <div class="cic-text">Rome isn't a city so much as a <em>sediment of civilizations</em> — each century pressing down on the last. When you stand at the Pantheon, you're inside a structure used continuously for <em>1,900 years</em>. The medieval street grid laid over Roman roads. Baroque churches built atop pagan temples. Understanding this changes how you see everything.</div>
        <div class="hist-chips">
          <div class="hist-chip">753 BC · Founded</div>
          <div class="hist-chip">44 BC · Caesar assassinated</div>
          <div class="hist-chip">80 AD · Colosseum opens</div>
          <div class="hist-chip">476 AD · Western Empire falls</div>
          <div class="hist-chip">1870 · Capital of unified Italy</div>
        </div>
      </div>
      ${itinStops.map((s, i) => buildItinStop(s, i)).join('')}
    </div>
    <div class="itin-sidebar">
      ${buildWeather()}${buildFriendRecs()}${buildPhrases()}
    </div>`;

  document.querySelectorAll('.itin-stop-hdr').forEach(hdr => hdr.addEventListener('click', () => toggleItinExpand(hdr.dataset.id)));
  document.querySelectorAll('.itin-expand-btn').forEach(btn => btn.addEventListener('click', e => { e.stopPropagation(); toggleItinExpand(btn.dataset.id); }));
}

function buildItinStop(s, i) {
  const bm = {hist:'ibadge-hist', food:'ibadge-food', cult:'ibadge-cult'};
  const lm = {hist:'History', food:'Food', cult:'Culture'};
  const id = `is${i}`;
  const intel = intelData[i] || intelData[0];
  return `
    <div class="itin-stop" style="animation-delay:${i*0.06}s;">
      <div class="itin-stop-hdr" data-id="${id}">
        <div class="itin-time-col"><div class="itin-time">${s.time}</div><div class="itin-dur">${s.dur}</div></div>
        <div class="itin-tl"><div class="itin-dot ${s.dot}"></div><div class="itin-tl-line"></div></div>
        <div class="itin-content">
          <div class="itin-name-row">
            <div class="itin-stop-name">${s.name}</div>
            <div class="itin-badge ${bm[s.type]}">${lm[s.type]}</div>
            ${i===0?'<div class="itin-badge ibadge-rec">Friend rec</div>':''}
            <div class="intel-live-badge" onclick="event.stopPropagation();openIntelPanel('${id}')"><div class="intel-live-dot"></div>Live Intel</div>
          </div>
          <div class="itin-tagline">${s.tagline}</div>
          <button class="itin-expand-btn" data-id="${id}"><span id="iexp-${id}">▾</span> History & tips</button>
        </div>
      </div>
      <div class="itin-expanded" id="iexp-body-${id}">
        <div class="itin-expanded-inner">
          <div class="hist-block">
            <div class="hist-block-lbl">Historical context</div>
            <div class="hist-block-title">${s.hist.title}</div>
            <div class="hist-block-text">${s.hist.text}</div>
          </div>
          <div class="prac-block">
            <div class="prac-lbl">Practical</div>
            ${s.prac.map(p=>`<div class="prac-row"><span class="prac-icon">${p.i}</span><span>${p.t}</span></div>`).join('')}
          </div>
          <div class="tips-block">
            <div class="tips-lbl">Insider tips</div>
            ${s.tips.map(t=>`<div class="tip-row"><span class="tip-arrow">→</span><span>${t}</span></div>`).join('')}
          </div>
          <div class="ai-deep">
            <div class="ai-deep-lbl"><div class="ai-deep-dot"></div>AI Deep Dive</div>
            <div class="ai-deep-text" id="aidp-${id}">
              <span style="display:flex;align-items:center;gap:7px;font-family:var(--label);font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:var(--sapphire);">
                <div class="typing-dots"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>
                Generating contextual insight...
              </span>
            </div>
          </div>
        </div>

        <div class="intel-toggle-row" id="intel-toggle-${id}">
          <button class="intel-tab on" onclick="setIntelTab('${id}','reddit',this)">
            <span class="reddit-icon">🟠</span> Community Intel <span class="intel-count">${intel.reddit.count || intel.reddit.tips.length}</span>
          </button>
          <button class="intel-tab" onclick="setIntelTab('${id}','blogger',this)">
            <span class="blogger-icon">🟣</span> Top Bloggers <span class="intel-count">${intel.bloggers.length}</span>
          </button>
        </div>

        <div class="intel-panel on" id="intel-reddit-${id}">
          <div class="reddit-block">
            <div class="reddit-hdr">
              <div class="reddit-logo">r/</div>
              <div class="reddit-meta">
                <div class="reddit-sub">${intel.reddit.subs}</div>
                <div class="reddit-thread">"${intel.reddit.thread}"</div>
              </div>
              <div class="reddit-upvotes">↑ ${intel.reddit.upvotes} upvotes</div>
            </div>
            <div class="reddit-consensus">${intel.reddit.consensus}</div>
            <div class="reddit-tips">
              ${intel.reddit.tips.map(t => `
                <div class="reddit-tip">
                  <div class="rt-votes"><div class="rt-arrow">▲</div><div class="rt-score">${t.score}</div></div>
                  <div class="rt-body">
                    <div class="rt-text">${t.text}</div>
                    <div class="rt-user">u/${t.user} · ${t.sub}${t.awards ? `<span class="rt-awards">${t.awards.map(a=>`<span class="rt-award">${a}</span>`).join('')}</span>` : ''}</div>
                  </div>
                </div>`).join('')}
            </div>
            <div class="reddit-footer">
              <div class="reddit-footer-link" onclick="showToast('Opening Reddit threads for ${s.name}...')">View source threads ↗</div>
              <div class="reddit-source-count">${intel.reddit.postCount} posts · synthesized by AI</div>
            </div>
          </div>
        </div>

        <div class="intel-panel" id="intel-blogger-${id}">
          <div class="blogger-block">
            <div class="blogger-hdr"><div class="blogger-hdr-dot"></div>Top Travel Writers on ${s.name}</div>
            ${intel.bloggers.map(b => `
              <div class="blogger-pick">
                <div class="bp-avatar">${b.avatar}</div>
                <div class="bp-body">
                  <div class="bp-name-row">
                    <div class="bp-name">${b.name}</div>
                    <div class="bp-blog">${b.blog}</div>
                    <div class="bp-verified">✓</div>
                    <div class="bp-monthly">${b.monthly} readers/mo</div>
                  </div>
                  <div class="bp-quote">"${b.quote}"</div>
                  <div class="bp-tags">
                    ${b.tags.map(t=>`<div class="bp-tag">${t}</div>`).join('')}
                    <div class="bp-aff-badge">💰 Earns on bookings</div>
                  </div>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </div>
    </div>`;
}

function toggleItinExpand(id) {
  const body = document.getElementById(`iexp-body-${id}`);
  const icon = document.getElementById(`iexp-${id}`);
  if (expandedStops.has(id)) { body.classList.remove('open'); icon.textContent='▾'; expandedStops.delete(id); }
  else {
    body.classList.add('open'); icon.textContent='▴'; expandedStops.add(id);
    if (!aiLoaded.has(id)) { aiLoaded.add(id); loadAiDeep(id); }
  }
}

function loadAiDeep(id) {
  const el = document.getElementById(`aidp-${id}`);
  if (!el) return;
  const idx = parseInt(id.replace('is', ''));
  const text = itinStops[idx]?.ai || '';
  setTimeout(() => {
    el.innerHTML = '<span id="aidp-t-'+id+'"></span><span class="ai-cursor"></span>';
    const typedEl = el.querySelector('span');
    let i = 0;
    const cursorEl = el.querySelectorAll('span')[1];
    function tick() {
      if (i < text.length) { typedEl.textContent += text[i++]; setTimeout(tick, 12+Math.random()*8); }
      else { if (cursorEl) cursorEl.remove(); }
    }
    tick();
  }, 1000);
}

function buildWeather() {
  return `<div class="itin-sidebar-card">
    <div class="isc-hdr"><div class="isc-title">🌤 Rome Weather</div><div class="isc-sub">June 12–16 · Forecast</div></div>
    <div class="isc-body">
      <div class="weather-main"><div class="wx-icon">☀️</div><div class="wx-temp">28°</div><div class="wx-detail">Sunny, low humidity<br><span>Sunscreen + light layers for evenings</span></div></div>
      <div class="wx-week">${[{d:'Thu',i:'☀️',t:'28°'},{d:'Fri',i:'⛅',t:'26°'},{d:'Sat',i:'☀️',t:'30°'},{d:'Sun',i:'🌤',t:'27°'},{d:'Mon',i:'☀️',t:'29°'}].map(w=>`<div class="wx-day"><div class="wxd-lbl">${w.d}</div><div class="wxd-icon">${w.i}</div><div class="wxd-temp">${w.t}</div></div>`).join('')}</div>
    </div>
  </div>`;
}

function buildFriendRecs() {
  return `<div class="itin-sidebar-card">
    <div class="isc-hdr"><div class="isc-title">👥 Friends' Recs</div><div class="isc-sub">3 friends visited Rome</div></div>
    <div class="isc-body">
      <div class="friend-rec"><div class="fr-avatar">👨</div><div><div class="fr-name">Marco</div><div class="fr-text">"Roscioli for dinner. Make a reservation or regret it for life."</div></div></div>
      <div class="friend-rec"><div class="fr-avatar">👩</div><div><div class="fr-name">Sarah</div><div class="fr-text">"Gianicolo hill at exactly 7pm in June. Do not miss it."</div></div></div>
      <div class="friend-rec"><div class="fr-avatar">🧑</div><div><div class="fr-name">Jenna</div><div class="fr-text">"Caffè Sant'Eustachio. Don't ask what's in it. Just drink it."</div></div></div>
    </div>
  </div>`;
}

function buildPhrases() {
  const p=[['Buongiorno','Good morning'],['Un caffè, per favore','One coffee, please'],['Il conto, per favore','The check, please'],["Dov'è il bagno?","Where's the bathroom?"],['Grazie mille','Thank you very much'],['Quanto costa?','How much?']];
  return `<div class="itin-sidebar-card">
    <div class="isc-hdr"><div class="isc-title">🗣 Italian Phrases</div><div class="isc-sub">Tap to hear</div></div>
    <div class="isc-body">${p.map(([it,en])=>`<div class="phrase-row" onclick="showToast('🔊 ${it}')"><div class="phrase-it">${it}</div><div class="phrase-en">${en}</div></div>`).join('')}</div>
  </div>`;
}

function setItinTab(idx, btn) {
  document.querySelectorAll('.itin-tab').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  expandedStops.clear(); aiLoaded.clear();
  const names = ['Rome','Florence','Cinque Terre','Venice','Amalfi Coast','Sicily'];
  showToast(`📍 Loading ${names[idx]}...`);
  setTimeout(() => renderItinerary(), 140);
}

function openIntelPanel(id) {
  track('Live Intel Opened', { stop: id });
  const body = document.getElementById(`iexp-body-${id}`);
  const icon = document.getElementById(`iexp-${id}`);
  if (!expandedStops.has(id)) {
    body.classList.add('open');
    icon.textContent = '▴';
    expandedStops.add(id);
    if (!aiLoaded.has(id)) { aiLoaded.add(id); loadAiDeep(id); }
  }
  setTimeout(() => {
    const toggle = document.getElementById(`intel-toggle-${id}`);
    if (toggle) toggle.scrollIntoView({ behavior:'smooth', block:'nearest' });
  }, 120);
}

function setIntelTab(id, mode, btn) {
  track('Live Intel Tab Switched', { mode, stop: id });
  btn.closest('.intel-toggle-row').querySelectorAll('.intel-tab').forEach(t => t.classList.remove('on'));
  btn.classList.add('on');
  document.getElementById(`intel-reddit-${id}`).classList.toggle('on', mode === 'reddit');
  document.getElementById(`intel-blogger-${id}`).classList.toggle('on', mode === 'blogger');
}
