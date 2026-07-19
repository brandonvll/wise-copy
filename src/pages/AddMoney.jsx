import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useViewer } from '../context/ViewAsContext.jsx'
import Logo from '../components/Logo.jsx'
import LogoMark from '../components/LogoMark.jsx'
import Icon from '../components/Icon.jsx'

const fmt = (n) => Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const money = (n) => (n === 0 ? '0' : fmt(n)) // 0 sin decimales, el resto con 2
const FLAG = { USD: 'us', EUR: 'eu', GBP: 'gb', COP: 'co', MXN: 'mx', BRL: 'br' }

// Métodos de pago ("Choose how to pay").
//  · fee(v): comisión según el método (ACH 0.17%, wire fijo 6.11, débito 1.25%, crédito 6.57%).
//  · limit: monto máx. para tarjetas — solo disponibles si el valor no lo supera
//    (débito ≤ 1975, crédito ≤ 1877; es decir, que el total a pagar no pase de ~2,000 USD).
//  · speed: menor = más rápido (para ordenar en la pestaña "Quickest").
const METHODS = [
  { key: 'venmo', name: 'Venmo', icon: 'venmo', fee: () => 0, note: 'Should arrive by Thursday', arrives: 'By Thursday', speed: 5 },
  { key: 'ach', name: 'Connected bank account (ACH)', icon: 'bank', fee: (v) => v * 0.0017, note: 'Select for estimate', arrives: 'Today - in seconds', speed: 4 },
  { key: 'wire', name: 'Wire transfer', icon: 'bank', fee: () => 6.11, note: 'Should arrive by Wednesday', arrives: 'By Wednesday', speed: 6 },
  { key: 'debit', name: 'Debit card', icon: 'card', fee: (v) => v * 0.0125, note: 'Should arrive in seconds', arrives: 'In seconds', speed: 1, limit: 1975 },
  { key: 'credit', name: 'Credit card', icon: 'card', fee: (v) => v * 0.0657, note: 'Should arrive in seconds', arrives: 'In seconds', speed: 2, limit: 1877 },
]
const isAvailable = (m, v) => !m.limit || v <= m.limit

// Círculo con el ícono/logo del método (borde fino, estilo Wise).
function MethodGlyph({ m }) {
  if (m.key === 'venmo') {
    return (
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/15">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-black font-display text-base font-black italic leading-none text-white">v</span>
      </span>
    )
  }
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/15 text-content-primary">
      <Icon name={m.icon} size={22} />
    </span>
  )
}

// Fila "fantasma" con shimmer, mientras se recalcula el desglose.
function SkeletonRow({ withBorder }) {
  return (
    <div className={`flex animate-pulse items-center gap-4 py-4 ${withBorder ? 'border-t border-black/5' : ''}`}>
      <span className="h-11 w-11 shrink-0 rounded-full bg-black/[0.07]" />
      <div className="flex-1 space-y-2.5">
        <span className="block h-3 w-24 rounded-full bg-gradient-to-r from-black/10 to-transparent" />
        <span className="block h-3.5 w-2/3 rounded-full bg-gradient-to-r from-black/10 to-transparent" />
      </div>
      <span className="h-8 w-20 rounded-pill bg-gradient-to-r from-black/[0.09] to-transparent" />
    </div>
  )
}

// Lista de monedas para "Paying in"
const CURRENCIES_LIST = [
  { code: 'AUD', name: 'Australian dollar', flag: 'au' },
  { code: 'BRL', name: 'Brazilian real', flag: 'br' },
  { code: 'CAD', name: 'Canadian dollar', flag: 'ca' },
  { code: 'CHF', name: 'Swiss franc', flag: 'ch' },
  { code: 'CLP', name: 'Chilean peso', flag: 'cl' },
  { code: 'CNY', name: 'Chinese yuan', flag: 'cn' },
  { code: 'CZK', name: 'Czech koruna', flag: 'cz' },
  { code: 'DKK', name: 'Danish krone', flag: 'dk' },
  { code: 'EUR', name: 'Euro', flag: 'eu' },
  { code: 'GBP', name: 'British pound', flag: 'gb' },
  { code: 'HKD', name: 'Hong Kong dollar', flag: 'hk' },
  { code: 'HUF', name: 'Hungarian forint', flag: 'hu' },
  { code: 'IDR', name: 'Indonesian rupiah', flag: 'id' },
  { code: 'INR', name: 'Indian rupee', flag: 'in' },
  { code: 'JPY', name: 'Japanese yen', flag: 'jp' },
  { code: 'NOK', name: 'Norwegian krone', flag: 'no' },
  { code: 'NZD', name: 'New Zealand dollar', flag: 'nz' },
  { code: 'PHP', name: 'Philippine peso', flag: 'ph' },
  { code: 'PLN', name: 'Polish zloty', flag: 'pl' },
  { code: 'RON', name: 'Romanian leu', flag: 'ro' },
  { code: 'SEK', name: 'Swedish krona', flag: 'se' },
  { code: 'SGD', name: 'Singapore dollar', flag: 'sg' },
  { code: 'UAH', name: 'Ukrainian hryvnia', flag: 'ua' },
  { code: 'USD', name: 'United States dollar', flag: 'us' },
  { code: 'TRY', name: 'Turkish lira', flag: 'tr' },
  { code: 'ILS', name: 'Israeli shekel', flag: 'il' },
  { code: 'MYR', name: 'Malaysian ringgit', flag: 'my' },
]

export default function AddMoney() {
  const navigate = useNavigate()
  const { id, client, ready } = useViewer()
  const [amount, setAmount] = useState('')
  const [focused, setFocused] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [showCurrency, setShowCurrency] = useState(false)
  const [showPay, setShowPay] = useState(false)
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [payMethod, setPayMethod] = useState('venmo') // Venmo por defecto al iniciar
  const [payTab, setPayTab] = useState('all') // 'all' | 'quickest'
  const [breakdownLoading, setBreakdownLoading] = useState(false) // skeleton al escribir monto o cambiar de método
  const [step, setStep] = useState('amount') // 'amount' | 'payment' (Verification pasa derecho)
  const [showInvalid, setShowInvalid] = useState(false) // método no soportado aún
  const [payingIn, setPayingIn] = useState('USD')
  const payTimer = useRef(null)
  const [curQuery, setCurQuery] = useState('')
  const [account, setAccount] = useState(null)
  const inputRef = useRef(null)

  // Arranca enfocado (grande); al hacer clic afuera se achica.
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!ready || !id) return
    client.from('accounts').select('balance, currency').eq('user_id', id).order('created_at').limit(1).maybeSingle()
      .then(({ data }) => setAccount(data))
  }, [id, ready, client])

  const balance = account?.balance ?? 0
  const currency = account?.currency || 'USD'

  const onChange = (e) => setAmount(e.target.value.replace(/\D/g, '').slice(0, 12))
  const display = amount ? Number(amount).toLocaleString('en-US') : ''
  const value = parseFloat(amount) || 0
  const canContinue = value > 0
  const rawMethod = METHODS.find((m) => m.key === payMethod) || METHODS[1]
  const method = isAvailable(rawMethod, value) ? rawMethod : METHODS[1] // si el elegido deja de estar disponible → ACH
  const fee = method.fee(value) // comisión según el método elegido
  const total = value + fee

  // Métodos disponibles / no disponibles según el valor; "Quickest" ordena por rapidez.
  const availMethods = METHODS.filter((m) => isAvailable(m, value))
  const unavailMethods = METHODS.filter((m) => !isAvailable(m, value))
  const shownAvail = payTab === 'quickest' ? [...availMethods].sort((a, b) => a.speed - b.speed) : availMethods

  // Al elegir un método: se cierra el modal y la página muestra un skeleton
  // (carga de fondo) mientras "recalcula", luego aparecen los datos.
  const closePay = () => setShowPay(false)
  const chooseMethod = (key) => {
    clearTimeout(payTimer.current)
    setPayMethod(key)
    setShowPay(false)
    setBreakdownLoading(true)
    payTimer.current = setTimeout(() => setBreakdownLoading(false), 1100)
  }
  useEffect(() => () => clearTimeout(payTimer.current), [])

  // "Connect bank account": abre una pestaña nueva con la pantalla de Plaid.
  const openPlaid = () => {
    if (!ready || !id) {
      console.warn('User not loaded yet')
      return
    }
    const ott = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : 'na-iav'
    const url = `/external-callback/na-iav?ott=${ott}&provider=PLAID2&flowActionKey=PROVIDER_DATA_COLLECTING&profileId=93804428&language=en&flowType=ADD_MONEY&uid=${id}`
    window.open(url, '_blank')
  }

  // Al escribir/cambiar el monto: mismo skeleton de carga antes de mostrar las opciones.
  useEffect(() => {
    if (value <= 0) return
    setBreakdownLoading(true)
    const t = setTimeout(() => setBreakdownLoading(false), 1000)
    return () => clearTimeout(t)
  }, [value])

  const payingInCur = CURRENCIES_LIST.find((c) => c.code === payingIn) || CURRENCIES_LIST[23]
  const q = curQuery.trim().toLowerCase()
  const filteredCur = q ? CURRENCIES_LIST.filter((c) => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)) : CURRENCIES_LIST

  return (
    <div className="min-h-screen bg-white">
      {/* header */}
      <header className="border-b border-black/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Logo height={26} />

          {/* pasos centrados con barra de progreso arriba */}
          <div className="hidden flex-col items-stretch gap-2.5 sm:flex">
            <div className="h-1 overflow-hidden rounded-full bg-black/10">
              <div className={`h-full rounded-full bg-forest transition-all ${step === 'payment' ? 'w-full' : 'w-1/3'}`} />
            </div>
            <div className="flex items-center justify-between gap-36 text-[15px] font-semibold">
              <span className={step === 'amount' ? 'text-content-primary' : 'text-content-tertiary'}>Amount</span>
              <span className="text-content-tertiary">Verification</span>
              <span className={step === 'payment' ? 'text-content-primary' : 'text-content-tertiary'}>Payment</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-neutral text-content-secondary">
              <Icon name="user" size={26} />
            </span>
            <button onClick={() => navigate('/home')} aria-label="Cerrar" className="text-content-primary hover:text-content-secondary">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      </header>

      <div className={`mx-auto px-5 pt-20 md:pt-28 ${step === 'payment' ? 'max-w-3xl' : 'max-w-2xl'}`}>
        {step === 'amount' && (
        <>
        <p className="mb-4 text-sm text-content-secondary">
          You add to <b className="text-content-primary">Main account</b>
        </p>

        <div className="flex items-center justify-between gap-4 border-b border-black/10 py-5">
          <button onClick={() => setShowPicker(true)} className="flex shrink-0 items-center gap-2 rounded-pill bg-bg-neutral px-2.5 py-2 font-bold text-content-primary hover:bg-black/10">
            <span className="flex items-center">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-bright-green">
                <LogoMark height={13} />
              </span>
              <img src="https://flagcdn.com/w80/us.png" alt="" className="-ml-2.5 h-6 w-6 rounded-full object-cover ring-2 ring-bg-neutral" />
            </span>
            {currency} <Icon name="chevronDown" size={16} className="text-content-tertiary" />
          </button>
          <div className={`flex min-w-0 flex-1 items-baseline justify-end font-display font-black leading-none transition-all duration-200 ${focused ? 'text-[5.5rem]' : 'text-[3.25rem]'} ${amount ? 'text-forest' : 'text-content-secondary'}`}>
            <input
              ref={inputRef}
              value={display}
              onChange={onChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              inputMode="numeric"
              placeholder="0.00"
              className="max-w-full bg-transparent text-right outline-none placeholder:text-content-secondary"
              style={{ width: `${Math.max((amount ? display : '0.00').length, 1)}ch` }}
            />
            {amount && !focused && <span>.00</span>}
          </div>
        </div>

        {canContinue ? (
          <div>
            <div>
              {/* Paying in — todo el bloque es clickeable, con popover */}
              <div className="relative">
                <div onClick={() => { setCurQuery(''); setShowCurrency((v) => !v) }} className="flex cursor-pointer items-center gap-4 rounded-xl py-4 transition-colors hover:bg-black/[0.02]">
                  <img src={`https://flagcdn.com/w80/${payingInCur.flag}.png`} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="text-sm text-content-secondary">Paying in</p>
                    <p className="font-bold text-content-primary">{payingInCur.name}</p>
                  </div>
                  <span className="rounded-pill bg-bright-green/25 px-4 py-1.5 font-semibold text-forest">Change</span>
                </div>

                {showCurrency && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowCurrency(false)} />
                    <div className="absolute right-0 top-full z-50 mt-1 flex max-h-[340px] w-full max-w-md flex-col rounded-card-lg border border-black/10 bg-white p-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
                      <div className="mb-3 flex items-center gap-2 rounded-xl border-2 border-black/15 px-3 py-2.5">
                        <Icon name="search" size={18} className="shrink-0 text-content-tertiary" />
                        <input value={curQuery} onChange={(e) => setCurQuery(e.target.value)} placeholder="Type a currency / country" className="w-full bg-transparent text-content-primary outline-none placeholder:text-content-tertiary" autoFocus />
                      </div>
                      <p className="mb-1 px-1 text-sm text-content-secondary">All currencies</p>
                      <div className="-mx-1 overflow-y-auto px-1">
                        {filteredCur.length === 0 ? (
                          <p className="px-3 py-4 text-content-tertiary">Sin resultados.</p>
                        ) : (
                          filteredCur.map((c) => (
                            <button key={c.code} onClick={() => { setPayingIn(c.code); setShowCurrency(false); setCurQuery('') }} className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-bg-neutral">
                              <img src={`https://flagcdn.com/w80/${c.flag}.png`} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
                              <span className="font-bold text-content-primary">{c.code}</span>
                              <span className="flex-1 truncate text-content-secondary">{c.name}</span>
                              {c.code === payingIn && <Icon name="check" size={18} className="shrink-0 text-forest" />}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
              {breakdownLoading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow withBorder />
                  <SkeletonRow withBorder />
                </>
              ) : (
                <>
                  {/* Paying with — todo el bloque abre el modal "Choose how to pay" */}
                  <div onClick={() => setShowPay(true)} className="flex cursor-pointer items-center gap-4 rounded-xl py-4 transition-colors hover:bg-black/[0.02]">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/15 text-content-primary"><Icon name={method.icon === 'venmo' ? 'bank' : method.icon} size={22} /></span>
                    <div className="flex-1">
                      <p className="text-sm text-content-secondary">Paying with</p>
                      <p className="font-bold text-content-primary">{method.name}</p>
                    </div>
                    <span className="rounded-pill bg-bright-green/25 px-4 py-1.5 font-semibold text-forest">Change</span>
                  </div>
                  {/* Arrives */}
                  <div className="flex items-center gap-4 border-t border-black/5 py-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/15 text-content-primary"><Icon name="zap" size={22} /></span>
                    <div className="flex-1">
                      <p className="text-sm text-content-secondary">Arrives</p>
                      <p className="font-bold text-content-primary">{method.arrives}</p>
                    </div>
                  </div>
                  {/* You pay — abre el desglose de comisiones */}
                  <button onClick={() => setShowBreakdown(true)} className="flex w-full items-center gap-4 rounded-xl py-4 text-left transition-colors hover:bg-black/[0.02]">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/15 text-content-primary"><Icon name="doc" size={22} /></span>
                    <div className="flex-1">
                      <p className="text-sm text-content-secondary">You pay</p>
                      <p className="font-bold text-content-primary">Total with fees</p>
                      <p className="text-sm text-content-tertiary">{money(fee)} USD in fees</p>
                    </div>
                    <span className="flex items-center gap-1 font-semibold text-content-primary underline underline-offset-4">{fmt(total)} USD <Icon name="chevronRight" size={16} /></span>
                  </button>
                </>
              )}
            </div>
            <button disabled={breakdownLoading} onClick={() => { if (method.key === 'ach') { setStep('payment'); window.scrollTo(0, 0) } else { setShowInvalid(true) } }} className="btn-primary mt-6 flex w-full items-center justify-center py-4">
              {breakdownLoading ? <span className="h-6 w-6 animate-spin rounded-full border-[3px] border-forest/30 border-t-forest" /> : 'Continue'}
            </button>
          </div>
        ) : (
          <div className="mt-16 space-y-1.5 rounded-card-lg bg-bg-neutral p-1.5">
            <p className="flex items-center justify-center gap-2 py-3 text-content-secondary">
              <Icon name="info" size={16} className="text-content-tertiary" /> Enter the amount you wish to add
            </p>
            <button disabled className="w-full cursor-default rounded-card bg-black/10 py-4 font-semibold text-content-tertiary">Continue</button>
          </div>
        )}
        </>
        )}

        {step === 'payment' && (
          <div className="mx-auto max-w-2xl pb-24 pt-2 text-center">
            {/* Gráfico: Wise · candado · banco */}
            <div className="mb-7 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-black/10"><LogoMark height={26} /></span>
              <span className="z-10 -mx-3 flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-green-500"><Icon name="lock" size={17} /></span>
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-black/10">
                <span className="relative flex h-6 w-6 items-center justify-center text-content-primary">
                  <span className="absolute h-5 w-5 rotate-45 rounded-[5px] border-[2.5px] border-current" />
                  <span className="absolute h-5 w-5 rounded-[5px] border-[2.5px] border-current" />
                </span>
              </span>
            </div>

            <h1 className="mb-5 text-[1.6rem] font-bold leading-tight text-content-primary">Connect your U.S. bank account to Wise</h1>
            <p className="mb-4 text-content-secondary">Connecting with Plaid is secure and you can keep using your account for future payments. It also helps us verify you'll have enough money for each transaction.</p>
            <p className="mb-8 text-content-secondary">Most banks connect instantly using Plaid. If instant verification isn't available, you'll be guided through verification using a small deposit.</p>

            <ul className="mx-auto mb-9 max-w-md space-y-5 text-left">
              {[
                { icon: 'bank', text: "You'll be directed to log in to your U.S. bank" },
                { icon: 'check', text: "You'll get verified in less than a minute" },
                { icon: 'bank', text: 'Use the same account later when you pay for your transfer' },
                { icon: 'settings', text: 'Remove this connection any time in your account Settings' },
              ].map((b, i) => (
                <li key={i} className="flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/15 text-content-primary"><Icon name={b.icon} size={20} /></span>
                  <span className="font-bold text-content-primary">{b.text}</span>
                </li>
              ))}
            </ul>

            <div className="mx-auto max-w-md">
              <button onClick={openPlaid} className="btn-primary w-full py-4">Connect bank account</button>
              <button onClick={() => setStep('amount')} className="mt-5 font-bold text-forest underline underline-offset-4">Pay another way</button>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Add to (selector de cuenta) */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-5 pt-20" onClick={() => setShowPicker(false)}>
          <div className="w-full max-w-lg rounded-card-lg bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-start justify-between">
              <h3 className="text-2xl font-bold text-content-primary">Add to</h3>
              <button onClick={() => setShowPicker(false)} aria-label="Cerrar" className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-neutral text-content-primary hover:bg-black/10">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="overflow-hidden rounded-card-lg border border-black/10">
              <div className="flex items-center gap-3 border-b border-black/5 px-4 py-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-bright-green"><LogoMark height={17} /></span>
                <span className="flex-1 font-bold text-content-primary">Main account</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bg-neutral text-xl leading-none text-content-primary">+</span>
              </div>
              <button onClick={() => setShowPicker(false)} className="flex w-full items-center gap-3 px-4 py-4 text-left hover:bg-bg-neutral">
                <img src={`https://flagcdn.com/w80/${FLAG[currency] || 'us'}.png`} alt="" className="h-9 w-9 rounded-full object-cover" />
                <span className="flex-1 font-bold text-content-primary">{fmt(balance)} {currency}</span>
                <Icon name="chevronRight" size={20} className="text-content-tertiary" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: opción no válida (solo Connected bank account funciona por ahora) */}
      {showInvalid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5" onClick={() => setShowInvalid(false)}>
          <div className="w-full max-w-md rounded-card-lg bg-white p-6 text-center shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <Icon name="warning" size={24} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-content-primary">Option not valid</h3>
            <p className="mb-6 text-content-secondary">This payment option isn't available yet. Please select <b className="text-content-primary">Connected bank account (ACH)</b> to continue.</p>
            <button onClick={() => setShowInvalid(false)} className="btn-primary w-full py-3">Got it</button>
          </div>
        </div>
      )}

      {/* Modal: Choose how to pay */}
      {showPay && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-5 pt-14" onClick={closePay}>
          <div className="flex min-h-[600px] w-full max-w-xl flex-col rounded-card-lg bg-white p-7 shadow-xl sm:p-9" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex justify-end">
              <button onClick={closePay} aria-label="Cerrar" className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-neutral text-content-primary hover:bg-black/10">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <h3 className="mb-5 text-3xl font-bold text-content-primary">Choose how to pay</h3>

            {/* Pestañas All / Quickest */}
            <div className="mb-4 flex gap-2.5">
              {[{ k: 'all', label: 'All' }, { k: 'quickest', label: 'Quickest' }].map((t) => (
                <button key={t.k} onClick={() => setPayTab(t.k)} className={`rounded-pill px-5 py-2 font-semibold transition-colors ${payTab === t.k ? 'bg-forest text-white' : 'border border-black/20 text-content-primary hover:bg-bg-neutral'}`}>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="space-y-1">
              {shownAvail.map((m) => (
                <button key={m.key} onClick={() => chooseMethod(m.key)} className="flex w-full items-center gap-4 rounded-xl py-3.5 text-left transition-colors hover:bg-bg-neutral">
                  <MethodGlyph m={m} />
                  <div className="flex-1">
                    <p className="font-bold text-content-primary">{m.name}</p>
                    <p className="text-sm text-content-secondary">{money(m.fee(value))} USD fee • {m.note}</p>
                  </div>
                  <Icon name="chevronRight" size={20} className="shrink-0 text-content-tertiary" />
                </button>
              ))}
            </div>

            {unavailMethods.length > 0 && (
              <>
                <p className="mb-1 mt-6 text-sm text-content-secondary">Unavailable methods</p>
                <div className="space-y-1 border-t border-black/5 pt-2.5">
                  {unavailMethods.map((m) => (
                    <div key={m.key} className="flex items-start gap-4 py-3.5 opacity-50">
                      <MethodGlyph m={m} />
                      <div className="flex-1">
                        <p className="font-bold text-content-primary">{m.name}</p>
                        <p className="text-sm text-content-secondary">For this payment method, you'd need to pay {fmt(value + m.fee(value))} USD, which is above our limit of 2,000 USD.</p>
                        <p className="text-sm text-content-secondary">{money(m.fee(value))} USD fee</p>
                      </div>
                      <Icon name="chevronRight" size={20} className="shrink-0 text-content-tertiary" />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal: desglose "You pay" */}
      {showBreakdown && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-5 pt-16" onClick={() => setShowBreakdown(false)}>
          <div className="w-full max-w-lg rounded-card-lg bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex justify-end">
              <button onClick={() => setShowBreakdown(false)} aria-label="Cerrar" className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-neutral text-content-primary hover:bg-black/10">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <h3 className="mb-8 text-center font-display text-4xl font-black uppercase text-content-primary">You pay</h3>
            <div className="space-y-4 px-1">
              <div className="flex items-center justify-between">
                <span className="text-content-secondary">{method.name} fee</span>
                <span className="text-content-primary">{money(fee)} USD</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-content-secondary">Our fee</span>
                <span className="text-content-primary">0 USD</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-content-secondary">Total fees</span>
                <span className="text-content-primary">{money(fee)} USD</span>
              </div>
              <div className="flex items-start justify-between border-t border-dashed border-black/25 pt-4">
                <span className="font-bold text-content-primary">Total</span>
                <div className="text-right">
                  <p className="font-bold text-content-primary">{fmt(total)} USD</p>
                  <p className="text-sm text-content-tertiary">Total amount you'll pay</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
