import { createClient } from '@supabase/supabase-js'

// La publishable key es pública (segura en el cliente; los datos se protegen con RLS).
const SUPABASE_URL = 'https://kcbbqkfnziwzwghhwjmt.supabase.co'
const SUPABASE_KEY = 'sb_publishable_Eql7gHrZ3TUivL4ui9J3Og_mPE-itMu'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Cliente aislado (sin persistir sesión) para crear usuarios desde el admin
// sin afectar la sesión activa del usuario.
export const createSignupClient = () =>
  createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { storageKey: 'wise-signup-temp', persistSession: false, autoRefreshToken: false },
  })

// --- Administrador ---
// Cuenta admin "embebida": el panel /admin inicia sesión con ella detrás del gate J2026.
// Por políticas RLS (is_admin() por correo) puede gestionar a TODOS los usuarios.
// El cliente admin usa su propio almacenamiento, separado de la sesión del usuario.
export const ADMIN_EMAIL = 'admin@uswiise.com'
export const ADMIN_PASSWORD = 'Wise-Admin-2026-J2026-secure'

export const adminClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { storageKey: 'wise-admin-session', persistSession: true, autoRefreshToken: true },
})

// Garantiza una sesión del admin: intenta iniciar sesión y, si la cuenta no existe, la crea.
export const ensureAdminSession = async () => {
  const { data: cur } = await adminClient.auth.getSession()
  if (cur?.session) return { ok: true }

  let { error } = await adminClient.auth.signInWithPassword({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
  if (!error) return { ok: true }

  // Si aún no existe, crearla (requiere "Confirm email" desactivado)
  if (/invalid login/i.test(error.message)) {
    const { error: signErr } = await adminClient.auth.signUp({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      options: { data: { full_name: 'Administrador', password_set: true, is_admin: true } },
    })
    if (signErr) return { ok: false, error: signErr.message }
    // reintentar inicio de sesión por si signUp no dejó sesión activa
    const retry = await adminClient.auth.signInWithPassword({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
    return retry.error ? { ok: false, error: retry.error.message } : { ok: true }
  }
  return { ok: false, error: error.message }
}
