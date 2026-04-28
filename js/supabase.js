/* ── SUPABASE CLIENT + AUTH ──────────────────────────
   Initialises the Supabase client from PINNED_CONFIG,
   exposes auth helpers, and keeps the nav in sync with
   the current session state.
   ──────────────────────────────────────────────────── */

let _supabase = null;

(function initSupabase() {
  if (!window.PINNED_CONFIG) {
    console.warn('[Pinned] PINNED_CONFIG not found — copy js/config.example.js → js/config.js');
    return;
  }
  const { url, anonKey } = window.PINNED_CONFIG.supabase;
  if (!url || url.includes('YOUR_PROJECT_ID')) {
    console.warn('[Pinned] Supabase URL not configured — running in demo mode');
    return;
  }
  _supabase = supabase.createClient(url, anonKey);

  // Restore session + listen for auth changes
  _supabase.auth.getSession().then(({ data: { session } }) => {
    handleAuthChange(session?.user ?? null);
  });

  _supabase.auth.onAuthStateChange((_event, session) => {
    handleAuthChange(session?.user ?? null);
  });
})();

/* ── AUTH STATE HANDLER ── */
function handleAuthChange(user) {
  window._pinnedUser = user;
  if (typeof updateNavCta === 'function') updateNavCta(user);

  if (user) {
    // Load real trips from DB once signed in
    if (typeof loadTripsFromDb === 'function') loadTripsFromDb(user.id);
    track('Auth State Changed', { signed_in: true });
  } else {
    track('Auth State Changed', { signed_in: false });
  }
}

/* ── SIGN IN ── */
async function handleSignIn() {
  const email    = document.getElementById('signinEmail').value.trim();
  const password = document.getElementById('signinPassword').value;
  const errEl    = document.getElementById('signinError');
  errEl.textContent = '';

  if (!email || !password) { errEl.textContent = 'Email and password are required.'; return; }
  if (!_supabase) { showDemoAuthSuccess(); return; }

  const btn = document.querySelector('#authFormSignin .auth-submit');
  btn.textContent = 'Signing in…'; btn.disabled = true;

  const { error } = await _supabase.auth.signInWithPassword({ email, password });
  btn.textContent = 'Sign In'; btn.disabled = false;

  if (error) { errEl.textContent = error.message; return; }
  closeAuthModal();
  showToast('✓ Welcome back!');
  track('User Signed In');
}

/* ── SIGN UP ── */
async function handleSignUp() {
  const name     = document.getElementById('signupName').value.trim();
  const email    = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const errEl    = document.getElementById('signupError');
  errEl.textContent = '';

  if (!name || !email || !password) { errEl.textContent = 'All fields are required.'; return; }
  if (password.length < 8) { errEl.textContent = 'Password must be at least 8 characters.'; return; }
  if (!_supabase) { showDemoAuthSuccess(); return; }

  const btn = document.querySelector('#authFormSignup .auth-submit');
  btn.textContent = 'Creating account…'; btn.disabled = true;

  const { error } = await _supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } }
  });
  btn.textContent = 'Create Account'; btn.disabled = false;

  if (error) { errEl.textContent = error.message; return; }
  closeAuthModal();
  showToast('✓ Account created — check your email to confirm!');
  track('User Signed Up');
}

/* ── PASSWORD RESET ── */
async function handlePasswordReset() {
  const email = document.getElementById('resetEmail').value.trim();
  const errEl = document.getElementById('resetError');
  errEl.textContent = '';

  if (!email) { errEl.textContent = 'Please enter your email.'; return; }
  if (!_supabase) { showToast('✓ Reset link sent (demo mode — check console)'); return; }

  const siteUrl = window.PINNED_CONFIG?.siteUrl ?? window.location.origin;
  const { error } = await _supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/?reset=1`
  });

  if (error) { errEl.textContent = error.message; return; }
  closeAuthModal();
  showToast('✓ Reset link sent — check your email');
  track('Password Reset Requested');
}

/* ── SIGN OUT ── */
async function handleSignOut() {
  if (_supabase) await _supabase.auth.signOut();
  window._pinnedUser = null;
  if (typeof updateNavCta === 'function') updateNavCta(null);
  showToast('Signed out');
  track('User Signed Out');
  goTo('landing');
}

/* ── DEMO FALLBACK (no Supabase configured) ── */
function showDemoAuthSuccess() {
  closeAuthModal();
  showToast('✓ Signed in (demo mode — configure Supabase to persist data)');
}

/* ── GETTER for other modules ── */
function getSupabase() { return _supabase; }
