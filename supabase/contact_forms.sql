-- Tabla para formularios de contacto de PlaidConnect
create table if not exists public.contact_forms (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text not null,
  note text,
  institution text,
  created_at timestamptz default now()
);

-- No necesita RLS porque es pública (sin login)
alter table public.contact_forms disable row level security;
