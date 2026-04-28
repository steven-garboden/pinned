// Copy this file to js/config.js and fill in your real keys.
// js/config.js is gitignored — never commit secret keys.
//
// Supabase anon key and Stripe publishable key are safe to expose in
// client-side code. Stripe secret key and Supabase service-role key
// live only in your Supabase Edge Function environment variables.

const PINNED_CONFIG = {
  supabase: {
    url: 'https://YOUR_PROJECT_ID.supabase.co',
    anonKey: 'YOUR_SUPABASE_ANON_KEY',
  },
  stripe: {
    publishableKey: 'pk_live_YOUR_STRIPE_PUBLISHABLE_KEY',
    // Sandbox: 'pk_test_YOUR_STRIPE_TEST_KEY'
  },
  amplitude: {
    apiKey: 'YOUR_AMPLITUDE_API_KEY',
  },
  // The base URL of your deployed site — used for Stripe redirect URLs.
  // For GitHub Pages: 'https://YOUR_USERNAME.github.io/pinned'
  // For local dev:    'http://localhost:8080'
  siteUrl: 'https://YOUR_USERNAME.github.io/pinned',
};
