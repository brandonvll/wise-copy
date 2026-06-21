import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import AuthHeader from '../components/AuthHeader.jsx'
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

function OtpInput({ value, onChange, length = 6 }) {
  const refs = useRef([])
  const setDigit = (i, v) => {
    const d = v.replace(/\D/g, '').slice(-1)
    const arr = value.split('')
    arr[i] = d
    onChange(arr.join('').slice(0, length))
    if (d && i < length - 1) refs.current[i + 1]?.focus()
  }
  const onKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) refs.current[i - 1]?.focus()
  }
  const onPaste = (e) => {
    const t = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (t) {
      onChange(t)
      refs.current[Math.min(t.length, length - 1)]?.focus()
      e.preventDefault()
    }
  }
  return (
    <div className="flex justify-center gap-2 sm:gap-3" onPaste={onPaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={value[i] || ''}
          onChange={(e) => setDigit(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          inputMode="numeric"
          maxLength={1}
          className="h-14 w-11 rounded-xl border-2 border-black/15 text-center text-2xl font-bold text-content-primary outline-none transition-colors focus:border-forest sm:w-12"
        />
      ))}
    </div>
  )
}

export default function Register() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState('email') // email | code | password
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  // si ya está logueado y recién llega, al dashboard (no durante el flujo)
  if (session && step === 'email') return <Navigate to="/home" replace />

  // 1) Enviar código al correo
  const sendCode = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true },
    })
    setBusy(false)
    if (error) setError(error.message)
    else { setCode(''); setStep('code') }
  }

  // 2) Verificar código (auto al completar 6 dígitos)
  useEffect(() => {
    if (step !== 'code' || code.length !== 6 || busy) return
    ;(async () => {
      setError('')
      setBusy(true)
      const { error } = await supabase.auth.verifyOtp({ email: email.trim(), token: code, type: 'email' })
      setBusy(false)
      if (error) { setError(error.message); setCode('') }
      else setStep('password')
    })()
  }, [code, step]) // eslint-disable-line react-hooks/exhaustive-deps

  const resend = async () => {
    setError('')
    setCode('')
    await supabase.auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: true } })
  }

  // 3) Crear contraseña
  const setPwd = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    const { error } = await supabase.auth.updateUser({ password })
    setBusy(false)
    if (error) setError(error.message)
    else navigate('/home')
  }

  return (
    <div className="min-h-screen bg-white">
      <AuthHeader />
      <div className="mx-auto w-full max-w-[440px] px-5 py-12 md:py-16">
        <h1 className="mb-3 text-center text-[1.75rem] font-bold leading-tight text-content-primary">Crea tu cuenta Wise</h1>
        <p className="mb-8 text-center text-content-secondary">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="font-semibold text-content-primary underline underline-offset-2">Inicia sesión</Link>
        </p>

        {/* PASO 1 — correo */}
        {step === 'email' && (
          <>
            <form className="space-y-5" onSubmit={sendCode}>
              <div>
                <label className="mb-1.5 block text-content-secondary">Primero, indica tu correo electrónico</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
              </div>
              {error && <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}
              <button type="submit" disabled={busy} className="btn-primary w-full py-4 disabled:opacity-60">
                {busy ? 'Enviando…' : 'Siguiente'}
              </button>
            </form>

            <p className="my-7 text-center text-content-secondary">O regístrate con</p>
            <div className="grid grid-cols-3 gap-3">
              {[<GoogleG key="g" />, <FacebookF key="f" />, <AppleLogo key="a" />].map((ic, i) => (
                <button key={i} className="flex items-center justify-center rounded-pill border-2 border-black/15 py-3.5 transition-colors hover:border-content-primary" aria-label="Regístrate con red social">
                  {ic}
                </button>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-content-tertiary">
              Al registrarte, aceptas nuestras{' '}
              <a href="#" className="font-semibold text-content-primary underline">Condiciones de Uso</a> y{' '}
              <a href="#" className="font-semibold text-content-primary underline">Política de Privacidad</a>.
            </p>
          </>
        )}

        {/* PASO 2 — código */}
        {step === 'code' && (
          <div className="text-center">
            <p className="mb-6 text-content-secondary">
              Te enviamos un código de 6 dígitos a<br /><span className="font-semibold text-content-primary">{email}</span>
            </p>
            <OtpInput value={code} onChange={setCode} />
            {busy && <p className="mt-4 text-sm text-content-tertiary">Verificando…</p>}
            {error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}
            <button onClick={resend} className="mt-6 font-semibold text-content-primary underline underline-offset-4">Reenviar código</button>
            <div className="mt-2">
              <button onClick={() => { setStep('email'); setError(''); setCode('') }} className="text-content-tertiary underline underline-offset-4">Cambiar correo</button>
            </div>
          </div>
        )}

        {/* PASO 3 — contraseña */}
        {step === 'password' && (
          <form className="space-y-5" onSubmit={setPwd}>
            <div>
              <label className="mb-1.5 block font-semibold text-content-primary">Crea una contraseña</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className={`${field} pr-12`} />
                <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-content-tertiary hover:text-content-primary" aria-label="Mostrar contraseña">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                    <circle cx="12" cy="12" r="3" />
                    {!show && <path d="M3 3l18 18" />}
                  </svg>
                </button>
              </div>
              <p className="mt-2 text-sm text-content-tertiary">Mínimo 6 caracteres.</p>
            </div>
            {error && <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={busy} className="btn-primary w-full py-4 disabled:opacity-60">
              {busy ? 'Creando…' : 'Crear cuenta'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
