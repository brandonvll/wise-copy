import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, adminClient, ensureAdminSession } from '../lib/supabase.js'
import { useAuth } from './AuthContext.jsx'

// Modo "ver como usuario": cuando está activo (preview del admin), las páginas
// leen los datos del usuario objetivo usando el cliente admin (RLS), en solo lectura.
// Se activa con ?viewAs=<userId> y se persiste por pestaña en sessionStorage.
const Ctx = createContext({ viewAs: false, id: null, client: supabase, name: '', ready: true })
export const useViewer = () => useContext(Ctx)

export function ViewAsProvider({ children }) {
  const { user } = useAuth()
  const [viewId] = useState(() => {
    try {
      const q = new URLSearchParams(window.location.search).get('viewAs')
      if (q) sessionStorage.setItem('viewAsUserId', q)
      return sessionStorage.getItem('viewAsUserId') || null
    } catch {
      return null
    }
  })
  const [name, setName] = useState('')
  const [ready, setReady] = useState(!viewId)

  useEffect(() => {
    if (!viewId) return
    let active = true
    ;(async () => {
      await ensureAdminSession()
      const { data } = await adminClient.from('profiles').select('full_name').eq('id', viewId).maybeSingle()
      if (!active) return
      setName(data?.full_name || 'Usuario')
      setReady(true)
    })()
    return () => { active = false }
  }, [viewId])

  const value = viewId
    ? { viewAs: true, id: viewId, client: adminClient, name, ready }
    : { viewAs: false, id: user?.id || null, client: supabase, name: '', ready: true }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
