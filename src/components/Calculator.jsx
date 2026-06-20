import { useState, useMemo } from 'react'
import Icon from './Icon.jsx'

// Tasas estáticas relativas a 1 USD (solo para la demo visual).
// EUR calibrado para reproducir 1 USD = 0,8720 → recibe 867,22 con comisión 5,47.
const RATES = {
  USD: 1, EUR: 0.871985, GBP: 0.746, COP: 4050, MXN: 17.1, BRL: 5.05,
  ARS: 905, CLP: 945, AUD: 1.49, CAD: 1.36, JPY: 156, INR: 83.4,
}
const FLAGS = {
  USD: 'us', EUR: 'eu', GBP: 'gb', COP: 'co', MXN: 'mx', BRL: 'br',
  ARS: 'ar', CLP: 'cl', AUD: 'au', CAD: 'ca', JPY: 'jp', INR: 'in',
}

// Formato Wise: coma decimal, sin separador de miles → "1000,00", "867,22".
const fmt = (n) => (isFinite(n) ? n : 0).toFixed(2).replace('.', ',')
const fmtRate = (n) => n.toFixed(4).replace('.', ',')

function CurrencyPill({ value, onChange }) {
  return (
    <div className="relative inline-flex items-center gap-2 rounded-full bg-bg-neutral py-2 pl-2 pr-9">
      <span className="h-7 w-7 shrink-0 overflow-hidden rounded-full">
        <img src={`https://flagcdn.com/w80/${FLAGS[value]}.png`} alt="" className="h-full w-full object-cover" />
      </span>
      <span className="text-lg font-semibold text-content-primary">{value}</span>
      <Icon name="chevronDown" size={18} className="pointer-events-none absolute right-3 text-content-primary" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
        aria-label="Selecciona una divisa"
      >
        {Object.keys(RATES).map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  )
}

const ChevronLeft = () => (
  <Icon name="chevronRight" size={22} className="shrink-0 rotate-180 text-content-tertiary" />
)

export default function Calculator({ className = '' }) {
  const [amountStr, setAmountStr] = useState('1000,00')
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('EUR')

  const numeric = parseFloat(amountStr.replace(/[^\d.,]/g, '').replace(/\./g, '').replace(',', '.')) || 0
  const rate = useMemo(() => RATES[to] / RATES[from], [from, to])
  const fee = useMemo(() => +(numeric * 0.00547).toFixed(2), [numeric])
  const received = useMemo(() => (numeric - fee) * rate, [numeric, fee, rate])

  return (
    <div className={`w-full max-w-[504px] rounded-[28px] bg-white p-6 shadow-2xl ring-1 ring-black/5 sm:p-7 ${className}`}>
      {/* Tasa */}
      <button className="mb-5 ml-auto flex items-center gap-2 rounded-full bg-bg-neutral py-2.5 pl-3 pr-3 text-sm">
        <Icon name="lock" size={15} className="text-content-secondary" />
        <span className="font-semibold text-content-primary">1 {from} = {fmtRate(rate)} {to}</span>
        <Icon name="chevronRight" size={16} className="text-content-primary" />
      </button>

      {/* Envías exactamente */}
      <label className="block text-base text-content-secondary">Envías exactamente</label>
      <div className="mt-2 flex items-center justify-between gap-3">
        <CurrencyPill value={from} onChange={setFrom} />
        <div className="flex flex-1 items-center justify-end gap-2">
          <input
            type="text"
            inputMode="decimal"
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
            className="w-full bg-transparent text-right font-display text-4xl font-black leading-none text-forest outline-none sm:text-[2.75rem]"
          />
          <ChevronLeft />
        </div>
      </div>

      {/* Info caja */}
      <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-[#eaf1f8] px-4 py-3">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#163300" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
          <path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L3 13V3h10l7.59 7.59a2 2 0 0 1 0 2.82Z" />
          <path d="M7.5 7.5h.01" />
        </svg>
        <p className="text-sm leading-snug text-content-primary">
          ¿Envías más de 25.000 USD o equivalente?{' '}
          <a href="#" className="font-semibold underline underline-offset-2">Descontaremos nuestra comisión</a>
        </p>
      </div>

      {/* El destinatario recibe */}
      <label className="mt-5 block text-base text-content-secondary">El destinatario recibe</label>
      <div className="mt-2 flex items-center justify-between gap-3">
        <CurrencyPill value={to} onChange={setTo} />
        <div className="flex items-center gap-2">
          <span className="font-display text-4xl font-black leading-none text-forest sm:text-[2.75rem]">{fmt(received)}</span>
          <ChevronLeft />
        </div>
      </div>

      <hr className="my-5 border-black/10" />

      {/* Detalles */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Icon name="zap" size={20} className="text-forest" filled />
          <div className="leading-tight">
            <span className="text-content-secondary">Llega</span>
            <p className="font-semibold text-content-primary">Hoy - en segundos</p>
          </div>
        </div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Icon name="doc" size={20} className="mt-0.5 text-content-secondary" />
            <div className="leading-tight">
              <span className="font-semibold text-content-primary">Comisiones totales</span>
              <p className="text-sm text-content-secondary">Se incluyen en la cantidad en {from}</p>
            </div>
          </div>
          <span className="flex shrink-0 items-center gap-1 font-semibold text-content-primary">
            <span className="underline underline-offset-2">{fmt(fee)} {from}</span>
            <Icon name="chevronRight" size={16} />
          </span>
        </div>
      </div>

      <a href="/register" className="btn-primary mt-6 w-full py-4 text-lg">Envía dinero</a>
    </div>
  )
}
