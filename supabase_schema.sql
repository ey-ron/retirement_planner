-- ==============================================================================
-- RETIREMENT SIMULATOR PRO: SUPABASE DATABASE SCHEMA & RLS POLICIES
-- Run this in your Supabase SQL Editor (supabase.com/dashboard/project/_/sql)
-- ==============================================================================

-- 1. Create PROFILES Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  is_pro boolean default false,
  is_dev boolean default false,
  pro_since timestamptz,
  lemon_order_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security (RLS) on profiles
alter table public.profiles enable row level security;
alter table public.profiles add column if not exists is_dev boolean default false;

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

-- 3. Create PRO_LICENSES Table with 7 Unlockables
create table if not exists public.pro_licenses (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  name text,
  is_pro boolean default true,
  is_dev boolean default false,
  lemon_order_id text,
  country text default 'Singapore',
  -- 7 Unlockable Feature Placeholders (values: 'Unlocked' or 'Locked')
  unlock_1 text default 'Locked',
  unlock_2 text default 'Locked',
  unlock_3 text default 'Locked',
  unlock_4 text default 'Locked',
  unlock_5 text default 'Locked',
  unlock_6 text default 'Locked',
  unlock_7 text default 'Locked',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Ensure new columns are added if pro_licenses table already existed earlier
alter table public.pro_licenses add column if not exists is_dev boolean default false;
alter table public.pro_licenses add column if not exists country text default 'Singapore';
alter table public.pro_licenses add column if not exists unlock_1 text default 'Locked';
alter table public.pro_licenses alter column unlock_1 set default 'Locked';
alter table public.pro_licenses add column if not exists unlock_2 text default 'Locked';
alter table public.pro_licenses add column if not exists unlock_3 text default 'Locked';
alter table public.pro_licenses add column if not exists unlock_4 text default 'Locked';
alter table public.pro_licenses add column if not exists unlock_5 text default 'Locked';
alter table public.pro_licenses add column if not exists unlock_6 text default 'Locked';
alter table public.pro_licenses add column if not exists unlock_7 text default 'Locked';
alter table public.pro_licenses enable row level security;

create policy "Allow read access to pro_licenses"
  on public.pro_licenses for select
  using (true);

create policy "Allow insert/update to pro_licenses"
  on public.pro_licenses for all
  using (true);

-- 4. Create Dedicated USER_RETIREMENT_PLANS Table (Linked to pro_licenses via user_id)
create table if not exists public.user_retirement_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.pro_licenses(id) on delete cascade,
  email text not null,
  is_dev boolean default false,
  
  -- Plan Input Columns
  birth_date date not null default '1995-01-01',
  monthly_expense numeric(12,2) not null default 3000.00,
  retire_age integer not null default 50,
  life_expectancy integer not null default 85,
  current_nest_egg numeric(14,2) not null default 20000.00,
  monthly_investment numeric(12,2) not null default 800.00,
  cagr numeric(5,2) not null default 8.00,
  inflation numeric(5,2) not null default 3.50,
  
  -- Calculated Snapshot Columns
  current_age integer,
  retire_year integer,
  future_monthly_expense numeric(12,2),
  required_corpus numeric(14,2),
  projected_nest_egg numeric(14,2),
  shortfall numeric(14,2) default 0.00,
  surplus numeric(14,2) default 0.00,
  funded_pct numeric(5,2) default 0.00,
  is_on_track boolean default false,
  currency_symbol text default '$',
  
  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Ensure is_dev column exists on user_retirement_plans
alter table public.user_retirement_plans add column if not exists is_dev boolean default false;

-- Indexes for lightning-fast lookups
create index if not exists idx_user_retirement_plans_user_id on public.user_retirement_plans(user_id);
create index if not exists idx_user_retirement_plans_email on public.user_retirement_plans(email);

-- Enable RLS on user_retirement_plans
alter table public.user_retirement_plans enable row level security;

create policy "Allow read access to user_retirement_plans"
  on public.user_retirement_plans for select
  using (true);

create policy "Allow insert/update to user_retirement_plans"
  on public.user_retirement_plans for all
  using (true);

-- 5. Automatic Profile Creation Trigger on Signup / Auth
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
