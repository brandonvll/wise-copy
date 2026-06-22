import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import AuthHeader from '../components/AuthHeader.jsx'
import Icon from '../components/Icon.jsx'
import OtpInput from '../components/OtpInput.jsx'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'

const field = 'w-full rounded-xl border-2 border-black/15 px-4 py-3.5 outline-none transition-colors focus:border-forest'

const GoogleG = () => (
  <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
    <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
  </svg>
)
const FacebookF = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" /></svg>
)
const AppleLogo = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#000" aria-hidden="true"><path d="M17.05 12.5c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.1-2.01-3.77-2.04-1.6-.16-3.13.94-3.94.94-.81 0-2.07-.92-3.4-.9-1.75.03-3.36 1.02-4.26 2.58-1.82 3.16-.47 7.83 1.3 10.4.86 1.25 1.89 2.66 3.23 2.61 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.38.81 1.4-.02 2.28-1.27 3.13-2.53.99-1.45 1.4-2.86 1.42-2.93-.03-.01-2.72-1.05-2.75-4.16zM14.6 4.84c.72-.87 1.2-2.08 1.07-3.28-1.03.04-2.28.69-3.02 1.55-.66.77-1.24 2-1.08 3.18 1.15.09 2.32-.58 3.03-1.45z" /></svg>
)

const EyeBtn = ({ show, onClick }) => (
  <button type="button" onClick={onClick} aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'} className="absolute right-3 top-1/2 -translate-y-1/2 text-content-tertiary hover:text-content-primary">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" />{!show && <path d="M3 3l18 18" />}
    </svg>
  </button>
)

const Err = ({ children }) => (
  <p role="alert" className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{children}</p>
)

const traducir = (msg = '') => {
  const m = msg.toLowerCase()
  if (m.includes('invalid login')) return 'Correo o contraseña incorrectos.'
  if (m.includes('email not confirmed')) return 'Tu correo aún no está activado. Entra con un código para activarlo.'
  if (m.includes('signups not allowed') || m.includes('not allowed')) return 'No encontramos una cuenta con ese correo. Pídele acceso al administrador.'
  if (m.includes('rate') || m.includes('too many')) return 'Demasiados intentos. Espera un momento antes de reintentar.'
  if (m.includes('should be at least') || m.includes('at least 6')) return 'La contraseña debe tener al menos 6 caracteres.'
  return msg
}
const isRate = (error) => error && (error.status === 429 || /rate|too many/i.test(error.message || ''))

export default function Login() {
  const { session, user, signIn, signOut } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('password') // 'password' | 'code'
  const [step, setStep] = useState('email') // modo código: 'email' | 'code'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [code, setCode] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [flowAuthed, setFlowAuthed] = useState(false) // se autenticó en ESTA pantalla (no sesión restaurada)

  const pwSet = !!user?.user_metadata?.password_set
  // "Crea tu contraseña" se muestra solo si el usuario acaba de verificar el código
  // o de iniciar sesión aquí y aún no tiene contraseña. Una sesión vieja restaurada
  // NO fuerza esta pantalla: ahí se ve el formulario normal de correo + contraseña.
  const showSetPass = (mode === 'code' && step === 'setpass') || (flowAuthed && !!session && !pwSet)

  // cuenta regresiva para reenviar
  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  // verificar código automáticamente al completar 6 dígitos
  useEffect(() => {
    if (!(mode === 'code' && step === 'code') || code.length !== 6 || busy || session) return
    ;(async () => {
      setError('')
      setBusy(true)
      const { error } = await supabase.auth.verifyOtp({ email: email.trim(), token: code, type: 'email' })
      setBusy(false)
      if (error) {
        setError(isRate(error) ? 'Demasiados intentos. Espera un momento.' : 'Código incorrecto o vencido.')
        setCode('')
      } else {
        setPassword(''); setPassword2(''); setStep('setpass'); setFlowAuthed(true)
      }
    })()
  }, [code, step, mode, busy, session, email])

  if (session && pwSet) return <Navigate to="/home" replace />

  // ---- Login con contraseña (usuarios que ya activaron su cuenta) ----
  const onPasswordLogin = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    const { error } = await signIn(email.trim(), password)
    setBusy(false)
    if (error) setError(traducir(error.message))
    else setFlowAuthed(true)
    // si entra OK con contraseña ya creada → el guard (session && pwSet) redirige a /home;
    // si la cuenta aún no tiene contraseña → showSetPass lo lleva a crearla
  }

  // ---- Flujo de código: enviar código ----
  const sendCode = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    const { error } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: false } })
    setBusy(false)
    if (isRate(error)) { setError(traducir(error.message)); return }
    // Respuesta neutral (no revelamos si la cuenta existe): siempre avanzamos al paso del código.
    setCode(''); setCooldown(45); setStep('code')
  }

  const resend = async () => {
    if (cooldown > 0 || busy) return
    setError('')
    setCode('')
    setBusy(true)
    const { error } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: false } })
    setBusy(false)
    if (isRate(error)) setError(traducir(error.message))
    else setCooldown(45)
  }

  // crear contraseña (dos veces) y entrar
  const savePassword = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.')
    if (password !== password2) return setError('Las contraseñas no coinciden.')
    setBusy(true)
    const { error } = await supabase.auth.updateUser({ password, data: { password_set: true } })
    setBusy(false)
    if (error) setError(traducir(error.message))
    else navigate('/home')
  }

  const goCode = () => { setMode('code'); setStep('email'); setError(''); setCode('') }
  const backToPassword = () => { setMode('password'); setStep('email'); setError(''); setCode(''); setPassword(''); setPassword2('') }
  const usarOtraCuenta = async () => { await signOut(); setMode('password'); setStep('email'); setEmail(''); setPassword(''); setPassword2(''); setCode(''); setError('') }

  return (
    <div className="min-h-screen bg-white">
      <AuthHeader />
      <div className="mx-auto w-full max-w-[480px] px-5 py-12 md:py-16">

        {/* ============ CREAR CONTRASEÑA (forzado si hay sesión sin contraseña) ============ */}
        {showSetPass ? (
          <>
            <h1 className="mb-3 text-center text-[1.4rem] font-bold leading-tight text-content-primary">Crea tu contraseña</h1>
            <p className="mb-8 text-center text-content-secondary">Ingrésala dos veces para confirmar y entrar a tu cuenta.</p>
            <form className="space-y-5" onSubmit={savePassword}>
              <div>
                <label className="mb-1.5 block font-semibold text-content-primary">Contraseña</label>
                <div className="relative">
                  <input type={show ? 'text' : 'password'} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className={`${field} pr-12`} autoFocus autoComplete="new-password" />
                  <EyeBtn show={show} onClick={() => setShow((s) => !s)} />
                </div>
                <p className="mt-2 text-sm text-content-tertiary">Mínimo 6 caracteres.</p>
              </div>
              <div>
                <label className="mb-1.5 block font-semibold text-content-primary">Repite la contraseña</label>
                <input type={show ? 'text' : 'password'} required minLength={6} value={password2} onChange={(e) => setPassword2(e.target.value)} className={field} autoComplete="new-password" />
              </div>
              {error && <Err>{error}</Err>}
              <button type="submit" disabled={busy} className="btn-primary w-full py-4 disabled:opacity-60">
                {busy ? 'Guardando…' : 'Guardar y entrar'}
              </button>
            </form>
            <div className="mt-6 text-center">
              <button onClick={usarOtraCuenta} className="text-content-tertiary underline underline-offset-4">Usar otra cuenta</button>
            </div>
          </>
        ) : mode === 'password' ? (
          /* ============ LOGIN CON CONTRASEÑA ============ */
          <>
            <h1 className="mb-3 text-center text-[1.4rem] font-bold leading-tight text-content-primary">Te damos la bienvenida de nuevo</h1>
            <p className="mb-8 text-center text-content-secondary">
              ¿Por primera vez en Wise?{' '}
              <Link to="/register" className="font-semibold text-content-primary underline underline-offset-2">Regístrate</Link>
            </p>

            <form className="space-y-5" onSubmit={onPasswordLogin}>
              <div>
                <label className="mb-1.5 block font-semibold text-content-primary">Tu dirección de correo electrónico</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={field} autoComplete="email" />
              </div>
              <div>
                <label className="mb-1.5 block font-semibold text-content-primary">Tu contraseña</label>
                <div className="relative">
                  <input type={show ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} className={`${field} pr-12`} autoComplete="current-password" />
                  <EyeBtn show={show} onClick={() => setShow((s) => !s)} />
                </div>
              </div>
              {error && <Err>{error}</Err>}
              <button type="submit" disabled={busy} className="btn-primary w-full py-4 disabled:opacity-60">
                {busy ? 'Entrando…' : 'Iniciar sesión'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button onClick={goCode} className="font-semibold text-content-primary underline underline-offset-4">
                Primera vez o ¿olvidaste tu contraseña? Entra con un código
              </button>
            </div>

            <p className="my-7 text-center text-content-secondary">O inicia sesión con</p>
            <div className="grid grid-cols-3 gap-3">
              {[<GoogleG key="g" />, <FacebookF key="f" />, <AppleLogo key="a" />].map((ic, i) => (
                <button key={i} disabled aria-disabled="true" title="Próximamente" className="flex items-center justify-center rounded-pill border-2 border-black/15 py-3.5 opacity-60" aria-label="Iniciar sesión con red social (próximamente)">
                  {ic}
                </button>
              ))}
            </div>
            <button disabled aria-disabled="true" title="Próximamente" className="mt-3 flex w-full items-center justify-center gap-2 rounded-pill border-2 border-black/15 py-3.5 font-semibold text-content-primary opacity-60">
              <Icon name="key" size={20} /> Inicia sesión con una llave de acceso
            </button>
          </>
        ) : step === 'email' ? (
          /* ============ MODO CÓDIGO — pedir correo ============ */
          <>
            <h1 className="mb-3 text-center text-[1.4rem] font-bold leading-tight text-content-primary">Accede con un código</h1>
            <p className="mb-8 text-center text-content-secondary">Te enviaremos un código de 6 dígitos a tu correo para que crees tu contraseña.</p>
            <form className="space-y-5" onSubmit={sendCode}>
              <div>
                <label className="mb-1.5 block font-semibold text-content-primary">Tu dirección de correo electrónico</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={field} autoFocus autoComplete="email" />
              </div>
              {error && <Err>{error}</Err>}
              <button type="submit" disabled={busy} className="btn-primary w-full py-4 disabled:opacity-60">
                {busy ? 'Enviando…' : 'Enviar código'}
              </button>
            </form>
            <div className="mt-6 text-center">
              <button onClick={backToPassword} className="font-semibold text-content-primary underline underline-offset-4">Volver a iniciar sesión</button>
            </div>
          </>
        ) : (
          /* ============ MODO CÓDIGO — ingresar código ============ */
          <div className="text-center">
            <h1 className="mb-3 text-[1.4rem] font-bold leading-tight text-content-primary">Revisa tu correo</h1>
            <p className="mb-6 text-content-secondary">
              Si tienes una cuenta con ese correo, te enviamos un código de 6 dígitos a<br /><span className="font-semibold text-content-primary">{email}</span>
            </p>
            <OtpInput value={code} onChange={setCode} />
            {busy && <p className="mt-4 text-sm text-content-tertiary" aria-live="polite">Verificando…</p>}
            {error && <div className="mt-4"><Err>{error}</Err></div>}
            <button onClick={resend} disabled={cooldown > 0 || busy} className="mt-6 font-semibold text-content-primary underline underline-offset-4 disabled:no-underline disabled:text-content-tertiary">
              {cooldown > 0 ? `Reenviar código en ${cooldown}s` : 'Reenviar código'}
            </button>
            <div className="mt-2 flex justify-center gap-4">
              <button onClick={() => { setStep('email'); setError(''); setCode('') }} className="text-content-tertiary underline underline-offset-4">Cambiar correo</button>
              <button onClick={backToPassword} className="text-content-tertiary underline underline-offset-4">Cancelar</button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
