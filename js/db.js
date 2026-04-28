/* ── DATABASE CRUD ──────────────────────────────────
   All Supabase table operations. Falls back silently
   to in-memory demo data if Supabase isn't configured.
   ──────────────────────────────────────────────────── */

/* ── TRIPS ── */

async function loadTripsFromDb(userId) {
  const sb = getSupabase();
  if (!sb) return;

  const { data, error } = await sb
    .from('trips')
    .select(`*, stops(*)`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) { console.error('[Pinned] loadTrips error:', error); return; }
  if (!data?.length) return; // No trips yet — keep demo data

  // Map DB rows into the same shape as the demo `trips` array
  const dbTrips = data.map(row => ({
    id: row.id,
    title: row.title,
    sub: row.subtitle || '',
    stats: {
      stops: row.stops.length,
      days: row.days_count ?? row.stops.length * 3,
      photos: 0,
      rec: row.stops.filter(s => s.is_recommended).length
    },
    stops: (row.stops || [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(s => ({
        id: s.id,
        name: s.name,
        emoji: s.emoji || '📍',
        date: s.date_range || '',
        x: s.pos_x ?? 50,
        y: s.pos_y ?? 50,
        tags: s.tags || [],
        narration: s.narration || '',
        color: s.color || 'gold',
        pol: s.polaroid_emoji || '📸',
        polcap: s.polaroid_caption || s.name,
        rec: s.is_recommended ?? false
      }))
  }));

  // Replace demo data with user's real trips
  trips.splice(0, trips.length, ...dbTrips);
  window.stops_ref = trips.map(t => t.stops);

  // Re-render if journal screen is currently active
  if (document.getElementById('screen-journal')?.classList.contains('active')) {
    curTrip = 0;
    renderBoard();
  }
}

async function saveTrip(tripData) {
  const sb = getSupabase();
  if (!sb || !window._pinnedUser) return null;

  const { data, error } = await sb
    .from('trips')
    .upsert({
      id: tripData.id,
      user_id: window._pinnedUser.id,
      title: tripData.title,
      subtitle: tripData.sub,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) { console.error('[Pinned] saveTrip error:', error); return null; }
  return data;
}

async function saveStop(stopData, tripId) {
  const sb = getSupabase();
  if (!sb || !window._pinnedUser) return null;

  const { data, error } = await sb
    .from('stops')
    .upsert({
      id: stopData.id,
      trip_id: tripId,
      user_id: window._pinnedUser.id,
      name: stopData.name,
      emoji: stopData.emoji,
      date_range: stopData.date,
      pos_x: stopData.x,
      pos_y: stopData.y,
      color: stopData.color,
      narration: stopData.narration,
      tags: stopData.tags,
      polaroid_emoji: stopData.pol,
      polaroid_caption: stopData.polcap,
      is_recommended: stopData.rec ?? false,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) { console.error('[Pinned] saveStop error:', error); return null; }
  return data;
}

async function deleteTrip(tripId) {
  const sb = getSupabase();
  if (!sb || !window._pinnedUser) return;
  const { error } = await sb.from('trips').delete().eq('id', tripId).eq('user_id', window._pinnedUser.id);
  if (error) console.error('[Pinned] deleteTrip error:', error);
}

/* ── ORDERS ── */

async function createPendingOrder(orderData) {
  const sb = getSupabase();
  if (!sb || !window._pinnedUser) return null;

  const { data, error } = await sb
    .from('orders')
    .insert({
      user_id: window._pinnedUser.id,
      trip_id: orderData.tripId,
      format: orderData.format,
      size: orderData.size,
      style: orderData.style,
      paper: orderData.paper,
      amount_cents: orderData.amountCents,
      status: 'pending'
    })
    .select()
    .single();

  if (error) { console.error('[Pinned] createOrder error:', error); return null; }
  return data;
}

/* ── PROFILE ── */

async function getProfile() {
  const sb = getSupabase();
  if (!sb || !window._pinnedUser) return null;
  const { data } = await sb.from('profiles').select('*').eq('id', window._pinnedUser.id).single();
  return data;
}

async function updateProfile(updates) {
  const sb = getSupabase();
  if (!sb || !window._pinnedUser) return;
  await sb.from('profiles').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', window._pinnedUser.id);
}
