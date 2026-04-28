/* ── QUICK TRIP BUILDER MODAL ──────────────────────── */

let qbCurrentTemplate = null;

function openQuickBuilder() {
  document.getElementById('qb-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
  document.getElementById('qb-step-1').style.display = '';
  document.getElementById('qb-step-2').style.display = 'none';
  document.getElementById('qb-step-3').style.display = 'none';
  document.getElementById('qbInput').value = '';
  document.getElementById('qbNextBtn').disabled = true;
  setTimeout(() => document.getElementById('qbInput').focus(), 200);
  track('Quick Builder Opened');
}

function qbClose() {
  document.getElementById('qb-modal').classList.remove('active');
  document.body.style.overflow = '';
  track('Quick Builder Closed');
}

function qbPickSuggestion(name) {
  document.getElementById('qbInput').value = name;
  document.getElementById('qbNextBtn').disabled = false;
  track('Quick Builder Suggestion Picked', { destination: name });
}

function qbGenerate() {
  const input = document.getElementById('qbInput').value.trim();
  if (!input) return;
  const key = input.toLowerCase();
  qbCurrentTemplate = qbTemplates[key] || {
    name: input, flag: '✈️',
    title: `${input} · <em>Your trip</em>`, dates: 'Pick your dates',
    days: 10,
    pins: [
      {x:20,y:32,c:'r',name:'Stop 1'},{x:26,y:24,c:'g',name:'Stop 2'},
      {x:18,y:48,c:'b',name:'Stop 3'},{x:30,y:60,c:'g',name:'Stop 4'}
    ]
  };
  track('Quick Builder Generation Started', { destination: input });

  document.getElementById('qb-step-1').style.display = 'none';
  document.getElementById('qb-step-2').style.display = '';

  const status = document.getElementById('qbGenStatus');
  const messages = [
    'Reading what travelers loved most...',
    `Mapping the best route through ${qbCurrentTemplate.name}...`,
    'Adding historical context for each stop...',
    'Pulling current weather and recommendations...',
    'Pinning everything to your cork board...'
  ];
  let i = 0;
  status.textContent = messages[0];
  const iv = setInterval(() => {
    i++;
    if (i >= messages.length) {
      clearInterval(iv);
      setTimeout(qbReveal, 600);
      return;
    }
    status.style.opacity = '0';
    setTimeout(() => { status.textContent = messages[i]; status.style.opacity = '1'; }, 200);
  }, 1400);
}

function qbReveal() {
  const t = qbCurrentTemplate;
  document.getElementById('qb-step-2').style.display = 'none';
  document.getElementById('qb-step-3').style.display = '';

  document.getElementById('qbTripName').innerHTML = t.title;
  document.getElementById('qbTripBodyName').textContent = t.name;
  document.getElementById('qbTripDates').textContent = t.dates;
  document.getElementById('qbStatStops').textContent = t.pins.length;
  document.getElementById('qbStatDays').textContent = t.days;

  const cork = document.getElementById('qbTripCork');
  cork.querySelectorAll('.qb-trip-pin').forEach(p => p.remove());
  t.pins.forEach((pin, i) => {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = `qb-trip-pin ${pin.c}`;
      el.style.left = pin.x * 3 + 'px';
      el.style.top = pin.y * 1.7 + 'px';
      cork.appendChild(el);
    }, i * 120);
  });

  document.getElementById('qbTripStops').innerHTML = t.pins.map((p, i) =>
    `<div class="qb-trip-stop"><span class="qb-trip-stop-num">${i+1}</span>${p.name}</div>`
  ).join('');

  track('Quick Builder Trip Revealed', { destination: t.name, stops: t.pins.length, days: t.days });
}

function qbConfirm() {
  const t = qbCurrentTemplate;
  if (!t) return;
  track('Quick Builder Trip Confirmed', { destination: t.name, stops: t.pins.length });
  qbClose();
  if (typeof markFtuxComplete === 'function') markFtuxComplete();
  showToast(`✓ Your ${t.name} cork board is ready — start adding photos!`);
  setTimeout(() => goTo('journal'), 600);
}

document.addEventListener('DOMContentLoaded', () => {
  const qbModal = document.getElementById('qb-modal');
  if (qbModal) qbModal.addEventListener('click', e => { if (e.target === qbModal) qbClose(); });

  const qbInput = document.getElementById('qbInput');
  if (qbInput) {
    qbInput.addEventListener('input', e => { document.getElementById('qbNextBtn').disabled = !e.target.value.trim(); });
    qbInput.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.value.trim()) qbGenerate(); });
  }
});
