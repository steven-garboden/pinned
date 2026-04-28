-- Pinned — Supabase Schema
-- Run this in the Supabase SQL Editor to set up your database.
-- Tables: profiles, trips, stops, orders
-- Includes: RLS policies, triggers, indexes

-- ── EXTENSIONS ───────────────────────────────────────────────────────────────

create extension if not exists "uuid-ossp";

-- ── PROFILES ─────────────────────────────────────────────────────────────────

create table if not exists profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  full_name    text,
  avatar_url   text,
  plan         text not null default 'free', -- 'free' | 'wanderer' | 'creator'
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row when a new user signs up
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ── TRIPS ─────────────────────────────────────────────────────────────────────

create table if not exists trips (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  subtitle    text,
  days_count  int,
  cover_url   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists trips_user_id_idx on trips(user_id);

alter table trips enable row level security;

create policy "Users can view their own trips"
  on trips for select
  using (auth.uid() = user_id);

create policy "Users can insert their own trips"
  on trips for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own trips"
  on trips for update
  using (auth.uid() = user_id);

create policy "Users can delete their own trips"
  on trips for delete
  using (auth.uid() = user_id);

-- ── STOPS ─────────────────────────────────────────────────────────────────────

create table if not exists stops (
  id                 uuid primary key default uuid_generate_v4(),
  trip_id            uuid not null references trips(id) on delete cascade,
  user_id            uuid not null references auth.users(id) on delete cascade,
  name               text not null,
  emoji              text default '📍',
  date_range         text,
  pos_x              numeric(5,2) default 50,
  pos_y              numeric(5,2) default 50,
  color              text default 'gold',
  narration          text,
  tags               text[] default '{}',
  polaroid_emoji     text default '📸',
  polaroid_caption   text,
  is_recommended     boolean default false,
  sort_order         int default 0,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists stops_trip_id_idx on stops(trip_id);
create index if not exists stops_user_id_idx on stops(user_id);

alter table stops enable row level security;

create policy "Users can view their own stops"
  on stops for select
  using (auth.uid() = user_id);

create policy "Users can insert their own stops"
  on stops for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own stops"
  on stops for update
  using (auth.uid() = user_id);

create policy "Users can delete their own stops"
  on stops for delete
  using (auth.uid() = user_id);

-- ── ORDERS ────────────────────────────────────────────────────────────────────

create table if not exists orders (
  id                        uuid primary key default uuid_generate_v4(),
  user_id                   uuid not null references auth.users(id) on delete cascade,
  trip_id                   uuid references trips(id) on delete set null,
  stripe_session_id         text unique,
  stripe_payment_intent_id  text,
  status                    text not null default 'pending', -- 'pending' | 'paid' | 'expired' | 'refunded'
  format                    text,   -- 'Poster' | 'Framed Print'
  size                      text,   -- 'A4 · 8×12"' | 'A3 · 12×17"' | 'A2 · 17×24"'
  style                     text,   -- 'Vintage Map' | 'Minimal' | ...
  paper                     text,   -- 'Matte Premium' | 'Glossy' | ...
  amount_cents              int not null,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

create index if not exists orders_user_id_idx on orders(user_id);
create index if not exists orders_stripe_session_id_idx on orders(stripe_session_id);

alter table orders enable row level security;

create policy "Users can view their own orders"
  on orders for select
  using (auth.uid() = user_id);

-- Inserts are made by the Edge Function using service role key (bypasses RLS)
-- Updates are made by the stripe-webhook Edge Function using service role key

-- ── UPDATED_AT TRIGGER ────────────────────────────────────────────────────────

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on profiles
  for each row execute procedure set_updated_at();

create trigger set_trips_updated_at
  before update on trips
  for each row execute procedure set_updated_at();

create trigger set_stops_updated_at
  before update on stops
  for each row execute procedure set_updated_at();

create trigger set_orders_updated_at
  before update on orders
  for each row execute procedure set_updated_at();
