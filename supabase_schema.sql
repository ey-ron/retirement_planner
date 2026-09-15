-- ==============================================================================
-- RETIREMENT SIMULATOR PRO: SUPABASE DATABASE SCHEMA & RLS POLICIES
-- Run this in your Supabase SQL Editor (supabase.com/dashboard/project/_/sql)
-- ==============================================================================

-- 1. Create PROFILES Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  is_pro boolean default false,
  pro_since timestamptz,
  lemon_order_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security (RLS) on profiles
alter table public.profiles enable row level security;

-- Profiles Policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 2. Create USER SCENARIOS / SAVED PLANS Table
create table if not exists public.saved_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  plan_name text default 'Primary Plan',
  plan_data jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on saved_plans
alter table public.saved_plans enable row level security;

-- Saved Plans Policies
create policy "Users can view own plans"
  on public.saved_plans for select
  using (auth.uid() = user_id);

create policy "Users can insert own plans"
  on public.saved_plans for insert
  with check (auth.uid() = user_id);

create policy "Users can update own plans"
  on public.saved_plans for update
  using (auth.uid() = user_id);

create policy "Users can delete own plans"
  on public.saved_plans for delete
  using (auth.uid() = user_id);

-- 3. Automatic Profile Creation Trigger on Signup / Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, is_pro, pro_since)
  values (
    new.id,
    new.email,
    coalesce((new.raw_user_meta_data->>'is_pro')::boolean, false),
    case when (new.raw_user_meta_data->>'is_pro')::boolean then now() else null end
  )
  on conflict (id) do update
  set email = excluded.email,
      is_pro = coalesce(public.profiles.is_pro, excluded.is_pro);
  return new;
end;
$$ language plpgsql security definer;

-- Attach trigger to auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
