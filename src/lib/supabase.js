import { createClient } from '@supabase/supabase-js'

// La publishable key es pública (segura en el cliente; los datos se protegen con RLS).
const SUPABASE_URL = 'https://kcbbqkfnziwzwghhwjmt.supabase.co'
const SUPABASE_KEY = 'sb_publishable_Eql7gHrZ3TUivL4ui9J3Og_mPE-itMu'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Cliente aislado (sin persistir sesión) para crear usuarios desde el admin
// sin afectar la sesión activa del administrador.
export const createSignupClient = () =>
  createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { storageKey: 'wise-signup-temp', persistSession: false, autoRefreshToken: false },
  })
