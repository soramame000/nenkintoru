-- Initial schema for nenkintoru

-- UUID helper
create extension if not exists "pgcrypto";

-- Users (NextAuth Credentials用)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

-- Subscriptions (Stripe購入情報 + 利用枠)
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  stripe_session_id text not null,
  stripe_payment_intent_id text,
  status text not null,
  starts_at timestamptz not null,
  expires_at timestamptz not null,
  max_generations int,
  generation_count int not null default 0,
  created_at timestamptz not null default now()
);

-- Generations (生成履歴)
create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  subscription_id uuid references public.subscriptions (id) on delete set null,
  diagnosis_type text not null,
  input_data jsonb not null,
  output_text text,
  created_at timestamptz not null default now()
);

-- Basic indexes
create index if not exists users_email_idx on public.users (email);
create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
create index if not exists generations_user_id_idx on public.generations (user_id);
create index if not exists generations_created_at_idx on public.generations (created_at desc);

