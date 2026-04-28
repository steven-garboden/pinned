# Pinned — Travel Journal App

A travel journaling web app with Supabase auth, Postgres database, and Stripe poster print orders. Deployable to GitHub Pages with zero build step.

## Stack

- **Frontend**: Vanilla HTML/CSS/JS (no build step)
- **Auth + Database**: Supabase (Postgres + RLS)
- **Payments**: Stripe Checkout via Supabase Edge Functions
- **Hosting**: GitHub Pages
- **Analytics**: Amplitude

---

## Local Development

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/pinned.git
cd pinned

# Copy the config template and fill in your keys
cp js/config.example.js js/config.js
# Edit js/config.js with your real keys (never commit this file)

# Serve locally — any static server works, e.g.:
npx serve .
# or
python3 -m http.server 8080
```

Open http://localhost:8080 in your browser. Without Supabase configured, the app runs in demo mode with sample data.

---

## Supabase Setup

### 1. Create a project

Go to [supabase.com](https://supabase.com) and create a new project. Note your **Project URL** and **anon/public key** from Settings → API.

### 2. Run the schema

In the Supabase SQL Editor, paste and run the contents of [`supabase/schema.sql`](supabase/schema.sql).

This creates:
- `profiles` — auto-created on signup via trigger
- `trips` — user travel trips
- `stops` — stops within each trip (with map position, narration, etc.)
- `orders` — poster print orders linked to Stripe sessions

All tables have Row Level Security enabled so users can only access their own data.

### 3. Configure Auth

In Supabase Dashboard → Authentication → URL Configuration:
- **Site URL**: your GitHub Pages URL (e.g. `https://yourusername.github.io/pinned`)
- **Redirect URLs**: same URL

### 4. Deploy Edge Functions

Install the [Supabase CLI](https://supabase.com/docs/guides/cli) then:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# Set required secrets
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...

# Deploy both functions
supabase functions deploy create-checkout
supabase functions deploy stripe-webhook
```

---

## Stripe Setup

### 1. Get your keys

From the [Stripe Dashboard](https://dashboard.stripe.com):
- **Publishable key** (`pk_live_...`) → goes in `js/config.js` and GitHub secret
- **Secret key** (`sk_live_...`) → Supabase Edge Function secret only, never in the frontend

### 2. Configure the webhook

In Stripe Dashboard → Developers → Webhooks → Add endpoint:

- **Endpoint URL**: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/stripe-webhook`
- **Events to listen for**: `checkout.session.completed`, `checkout.session.expired`

Copy the **Signing secret** (`whsec_...`) and add it as the `STRIPE_WEBHOOK_SECRET` in Supabase.

---

## GitHub Pages Deployment

### 1. Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/pinned.git
git push -u origin main
```

### 2. Add repository secrets

In GitHub → Settings → Secrets and variables → Actions → New repository secret:

| Secret name           | Value |
|-----------------------|-------|
| `SUPABASE_URL`        | `https://YOUR_PROJECT_REF.supabase.co` |
| `SUPABASE_ANON_KEY`   | Your Supabase anon/public key |
| `STRIPE_PUBLISHABLE_KEY` | `pk_live_...` |
| `AMPLITUDE_API_KEY`   | Your Amplitude API key (optional) |
| `SITE_URL`            | `https://YOUR_USERNAME.github.io/pinned` |

### 3. Enable GitHub Pages

In GitHub → Settings → Pages:
- **Source**: GitHub Actions

Push to `main` or trigger the workflow manually — the site will be live at `https://YOUR_USERNAME.github.io/pinned`.

---

## Project Structure

```
pinned/
├── index.html                          # Main SPA shell
├── css/
│   └── styles.css                      # All app styles
├── js/
│   ├── config.example.js               # Config template (commit this)
│   ├── config.js                       # Your real keys (gitignored)
│   ├── app.js                          # Core: routing, toasts, nav, auth modal
│   ├── data.js                         # Demo data (trips, stops, photos, etc.)
│   ├── supabase.js                     # Supabase client + auth handlers
│   ├── db.js                           # All Supabase table CRUD
│   ├── stripe-client.js                # Stripe Checkout redirect flow
│   ├── journal.js                      # Journal / map board screen
│   ├── photos.js                       # Photo grid + tray screen
│   ├── narration.js                    # AI narration writing screen
│   ├── itinerary.js                    # Itinerary + intel panel screen
│   ├── cinematic.js                    # Cinematic slideshow mode
│   ├── share.js                        # Share / Story Frames modal
│   ├── poster.js                       # Poster order modal
│   ├── tripbuilder.js                  # Quick trip builder modal
│   ├── tour.js                         # First-visit onboarding tour
│   ├── discover.js                     # Discover / Trending screen
│   └── pricing.js                      # Pricing + Creator Hub screen
├── supabase/
│   ├── schema.sql                      # Database schema + RLS policies
│   └── functions/
│       ├── create-checkout/
│       │   └── index.ts                # Creates Stripe Checkout session
│       └── stripe-webhook/
│           └── index.ts                # Handles Stripe webhook events
└── .github/
    └── workflows/
        └── deploy.yml                  # GitHub Actions deploy to Pages
```

---

## Demo Mode

If `js/config.js` is missing or `SUPABASE_URL` contains `YOUR_PROJECT_ID`, the app runs in **demo mode**:
- Auth flows show a success toast without hitting Supabase
- All data comes from the hardcoded demo trips in `js/data.js`
- Poster checkout shows an error (Stripe requires real keys)

This is useful for exploring the UI before setting up a backend.

---

## Pricing

| Poster size | Price |
|-------------|-------|
| A4 · 8×12"  | $38   |
| A3 · 12×17" | $52   |
| A2 · 17×24" | $78   |

Subscription tiers (Wanderer $6/mo, Creator $14/mo) are shown in the Pricing screen. Subscription checkout is stubbed — wire up `upgradeTo()` in `js/pricing.js` to a new Edge Function when you're ready.
