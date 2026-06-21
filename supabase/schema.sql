-- ============================================================
-- Wise clone — esquema Supabase
-- Pégalo en: Supabase → SQL Editor → New query → Run
-- ============================================================

-- 1) Tablas -------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz default now()
);

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  currency text not null default 'USD',
  balance numeric not null default 0,
  label text default 'Cuenta principal',
  created_at timestamptz default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  amount numeric not null default 0,
  currency text not null default 'USD',
  date date not null default current_date,
  created_at timestamptz default now()
);

-- 2) Row Level Security -------------------------------------
alter table public.profiles     enable row level security;
alter table public.accounts     enable row level security;
alter table public.transactions enable row level security;

-- cada usuario solo ve/edita SUS datos
drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own accounts" on public.accounts;
create policy "own accounts" on public.accounts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own transactions" on public.transactions;
create policy "own transactions" on public.transactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 3) Al registrarse: crea perfil + cuenta en 0 ------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));

  insert into public.accounts (user_id, currency, balance)
  values (new.id, 'USD', 0);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
