-- Security/consistency hardening for nenkintoru

-- 1) Prevent duplicate users
do $$
begin
  if to_regclass('public.users') is not null then
    create unique index if not exists users_email_unique
    on public.users (email);
  end if;
end $$;

-- 2) Prevent duplicate subscriptions from webhook retries
do $$
begin
  if to_regclass('public.subscriptions') is not null then
    create unique index if not exists subscriptions_stripe_session_id_unique
    on public.subscriptions (stripe_session_id);
  end if;
end $$;

-- Optional: payment intent id should be unique when present
do $$
begin
  if to_regclass('public.subscriptions') is not null then
    create unique index if not exists subscriptions_stripe_payment_intent_id_unique
    on public.subscriptions (stripe_payment_intent_id)
    where stripe_payment_intent_id is not null;
  end if;
end $$;

-- 3) Atomic generation count reservation
-- Expects columns:
--   subscriptions: id (uuid), max_generations (int), generation_count (int)
create or replace function public.increment_generation_count(sub_id uuid)
returns boolean
language plpgsql
security definer
as $$
declare
  current_count int;
  max_count int;
begin
  -- lock row to avoid race
  select generation_count, max_generations
    into current_count, max_count
  from public.subscriptions
  where id = sub_id
  for update;

  if not found then
    raise exception 'subscription not found';
  end if;

  if max_count is not null and current_count >= max_count then
    raise exception 'generation limit reached';
  end if;

  update public.subscriptions
    set generation_count = coalesce(generation_count, 0) + 1
  where id = sub_id;

  return true;
end;
$$;
