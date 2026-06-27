import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const TIMEOUT = 3 * 60 * 1000 // 3 minutos de inactividad

// Cierra la sesión del usuario tras 3 min sin actividad (medida de seguridad).
// No afecta el panel /admin (usa su propia sesión).
export default function IdleTimeout() {
  const { session, signOut } = useAuth()
  const navigate = useNavigate()
  const timer = useRef(null)

  useEffect(() => {
    if (!session) return

    const reset = () => {
      clearTimeout(timer.current)
      timer.current = setTimeout(async () => {
        if (window.location.pathname.startsWith('/admin')) return // no cerrar el panel admin
        sessionStorage.setItem('idleLogout', '1')
        await signOut()
        navigate('/login')
      }, TIMEOUT)
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click']
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }))
    reset()

    return () => {
      clearTimeout(timer.current)
      events.forEach((e) => window.removeEventListener(e, reset))
    }
  }, [session]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
