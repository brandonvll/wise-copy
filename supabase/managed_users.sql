-- ============================================================
-- Registro de usuarios creados desde el panel admin
-- (NO guarda contraseñas; solo para listar/dar seguimiento)
-- Correr en: Supabase → SQL Editor
-- ============================================================
create table if not exists public.managed_users (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz default now()
);

alter table public.managed_users enable row level security;

drop policy if exists "own managed_users" on public.managed_users;
create policy "own managed_users" on public.managed_users
  for all using (auth.uid() = created_by) with check (auth.uid() = created_by);
