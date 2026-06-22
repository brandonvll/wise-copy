-- ============================================================
-- ACCESO DE ADMINISTRADOR (autosuficiente)
-- Crea lo que falte (recipients, managed_users) y luego da a la
-- cuenta admin (por correo) acceso total a los datos de TODOS los
-- usuarios. Se combina con las políticas "own ..." (RLS = OR), así
-- que los usuarios normales siguen viendo solo lo suyo.
--
-- Correr en: Supabase → SQL Editor (requiere que ya exista schema.sql:
-- profiles, accounts, transactions).
-- ============================================================

-- 0) Asegurar tabla de destinatarios
create table if not exists public.recipients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  handle text,
  currency text default 'USD',
  created_at timestamptz default now()
);
alter table public.recipients enable row level security;
drop policy if exists "own recipients" on public.recipients;
create policy "own recipients" on public.recipients
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 0b) Asegurar tabla de usuarios gestionados (seguimiento, sin contraseñas)
create table if not exists public.managed_users (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamptz default now()
);
alter table public.managed_users add column if not exists user_id uuid;
alter table public.managed_users add column if not exists username text;
alter table public.managed_users enable row level security;
drop policy if exists "own managed_users" on public.managed_users;
create policy "own managed_users" on public.managed_users
  for all using (auth.uid() = created_by) with check (auth.uid() = created_by);

-- 1) ¿El usuario actual es el administrador? (por correo)
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() ->> 'email') = 'admin@uswiise.com', false)
$$;

-- 2) Políticas de administrador en cada tabla
drop policy if exists "admin all profiles" on public.profiles;
create policy "admin all profiles" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin all accounts" on public.accounts;
create policy "admin all accounts" on public.accounts
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin all transactions" on public.transactions;
create policy "admin all transactions" on public.transactions
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin all recipients" on public.recipients;
create policy "admin all recipients" on public.recipients
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin all managed_users" on public.managed_users;
create policy "admin all managed_users" on public.managed_users
  for all using (public.is_admin()) with check (public.is_admin());

-- 3) Eliminar un usuario por completo (solo el admin).
-- Borra el registro de seguimiento y el usuario de Auth; el resto de sus datos
-- (perfil, cuenta, transacciones, destinatarios) se borra en cascada por las FKs.
create or replace function public.admin_delete_user(target uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'No autorizado';
  end if;
  delete from public.managed_users where user_id = target;
  delete from auth.users where id = target;
end;
$$;
