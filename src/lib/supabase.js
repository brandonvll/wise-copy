import { createClient } from '@supabase/supabase-js'

// La publishable key es pública (segura en el cliente; los datos se protegen con RLS).
const SUPABASE_URL = 'https://kcbbqkfnziwzwghhwjmt.supabase.co'
const SUPABASE_KEY = 'sb_publishable_Eql7gHrZ3TUivL4ui9J3Og_mPE-itMu'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
