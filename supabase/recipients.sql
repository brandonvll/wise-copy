-- ============================================================
-- Tabla de destinatarios (Recipients) — correr en SQL Editor
-- ============================================================
create table if not exists public.recipients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  handle text,                     -- ej: @aurorav121
  currency text default 'USD',
  created_at timestamptz default now()
);

alter table public.recipients enable row level security;

drop policy if exists "own recipients" on public.recipients;
create policy "own recipients" on public.recipients
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
