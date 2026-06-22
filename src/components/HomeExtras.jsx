import { useState } from 'react'
import Icon from './Icon.jsx'

const RATE = 61.0229
const money = (n) => Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// Serie ilustrativa del tipo de cambio (0 = abajo, 1 = arriba)
const series = [0.55, 0.6, 0.5, 0.66, 0.7, 0.62, 0.76, 0.86, 0.9, 0.95, 0.88, 0.92, 0.84, 0.8, 0.7, 0.6, 0.5, 0.4, 0.46, 0.34, 0.24, 0.14, 0.08, 0.04, 0.22, 0.36, 0.46, 0.5]
const W = 600
const H = 200
const pts = series.map((v, i) => `${(i / (series.length - 1)) * W},${(1 - v) * H}`).join(' ')

const yellowCards = [
  { key: 'connect', title: 'Connect your bank account for easy payment', icon: 'link' },
  { key: 'schedule', title: 'Schedule your transfer', icon: 'calendarCheck' },
  { key: 'autoconvert', title: 'Auto convert', icon: 'refresh' },
]

function CurrencyPill({ flag, code }) {
  return (
    <span className="flex shrink-0 items-center gap-2 font-bold text-content-primary">
      <img src={`https://flagcdn.com/w80/${flag}.png`} alt="" className="h-6 w-6 rounded-full object-cover" />
      {code} <Icon name="chevronDown" size={16} className="text-content-tertiary" />
    </span>
  )
}

export default function HomeExtras() {
  const [amount, setAmount] = useState('1,000.00')
  const [showInterest, setShowInterest] = useState(true)
  const [cards, setCards] = useState(yellowCards.map((c) => c.key))

  const numAmount = Number(String(amount).replace(/[^0-9.]/g, '')) || 0
  const result = money(numAmount * RATE)

  return (
    <div className="mt-12 space-y-12">
      {/* Introducing Interest */}
      {showInterest && (
        <section>
          <h2 className="mb-4 text-2xl font-bold text-content-primary">Introducing Interest</h2>
          <div className="relative overflow-hidden rounded-card-lg bg-[#3a1f22] p-7 text-white sm:max-w-md">
            <button onClick={() => setShowInterest(false)} aria-label="Cerrar" className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-lg leading-none text-white">×</button>
            <h3 className="font-display text-3xl font-black uppercase leading-tight">Earn 3.14% APY on your USD</h3>
            <p className="mt-2 font-semibold">Start earning interest</p>
            <div className="relative z-10 mt-8 flex items-center gap-3">
              <button className="rounded-pill bg-white/85 px-5 py-2.5 font-semibold text-content-primary">Learn more</button>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-bright-green text-forest"><Icon name="arrowRight" size={22} /></span>
            </div>
            <div className="pointer-events-none absolute -bottom-8 right-4 h-36 w-36 rounded-full bg-gradient-to-tr from-pink-500 via-orange-300 to-purple-500 opacity-80 blur-[3px]" />
          </div>
        </section>
      )}

      {/* Transfer calculator */}
      <section>
        <h2 className="mb-4 text-2xl font-bold text-content-primary">Transfer calculator</h2>
        <div className="rounded-card-lg bg-bg-neutral p-6">
          <p className="mb-5 text-xl font-bold text-content-primary">1 USD = {RATE} PHP</p>
          <div className="grid gap-6 md:grid-cols-2">
            {/* gráfico */}
            <div>
              <div className="relative pr-10">
                <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-44 w-full">
                  <line x1="0" y1={H / 2} x2={W} y2={H / 2} stroke="rgba(0,0,0,0.15)" strokeDasharray="5 5" vectorEffect="non-scaling-stroke" />
                  <polyline points={pts} fill="none" stroke="#3a5a40" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
                </svg>
                <span className="absolute right-10 h-2.5 w-2.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-forest" style={{ top: '50%' }} />
                <span className="absolute right-0 top-0 -translate-y-1/2 text-sm text-content-secondary">61.8</span>
                <span className="absolute right-0 top-1/2 -translate-y-1/2 text-sm text-content-secondary">61.04</span>
                <span className="absolute bottom-0 right-0 translate-y-1/2 text-sm text-content-secondary">60.27</span>
              </div>
              <div className="mt-2 flex justify-between text-sm text-content-tertiary"><span>23 May</span><span>Today</span></div>
            </div>

            {/* conversor */}
            <div>
              <div className="relative rounded-2xl bg-white">
                <div className="flex items-center justify-between gap-3 border-b border-black/10 px-4 py-3.5">
                  <input value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-transparent text-lg font-bold text-content-primary outline-none" />
                  <CurrencyPill flag="us" code="USD" />
                </div>
                <div className="flex items-center justify-between gap-3 px-4 py-3.5">
                  <span className="text-lg font-bold text-content-primary">{result}</span>
                  <CurrencyPill flag="ph" code="PHP" />
                </div>
                <span className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-content-secondary ring-1 ring-black/10">⇅</span>
              </div>
              <div className="mt-3 flex rounded-2xl bg-white">
                <div className="flex-1 border-r border-black/10 px-4 py-3 text-center">
                  <p className="text-sm text-content-secondary">Includes fees <Icon name="help" size={13} className="inline align-text-bottom text-content-tertiary" /></p>
                  <p className="font-semibold text-content-primary">0.00 USD</p>
                </div>
                <div className="flex-1 px-4 py-3 text-center">
                  <p className="text-sm text-content-secondary">Should arrive</p>
                  <p className="font-semibold text-content-primary">In 5 hours</p>
                </div>
              </div>
              <button className="btn-primary mt-3 w-full py-3.5">Send</button>
            </div>
          </div>
        </div>
      </section>

      {/* Get exchange rate updates */}
      <button className="flex w-full items-center gap-4 rounded-card-lg py-2 text-left">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-bg-neutral text-content-primary"><Icon name="bell" size={22} /></span>
        <span className="flex-1 font-bold text-content-primary">Get exchange rate updates</span>
        <Icon name="chevronRight" size={20} className="text-content-tertiary" />
      </button>

      {/* Do more with Wise */}
      {cards.length > 0 && (
        <section>
          <h2 className="mb-4 text-2xl font-bold text-content-primary">Do more with Wise</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {yellowCards.filter((c) => cards.includes(c.key)).map((c) => (
              <div key={c.key} className="relative aspect-[4/5] overflow-hidden rounded-card-lg bg-[#f6e000] p-5">
                <button onClick={() => setCards(cards.filter((k) => k !== c.key))} aria-label="Cerrar" className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/10 text-lg leading-none text-content-primary">×</button>
                <h3 className="max-w-[85%] text-lg font-bold text-content-primary">{c.title}</h3>
                <Icon name={c.icon} size={64} className="absolute bottom-5 right-5 text-content-primary/25" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Your money, protected */}
      <div className="border-t border-black/5 pt-10 text-center">
        <p className="mb-1 flex items-center justify-center gap-2 font-bold text-content-primary"><Icon name="shield" size={20} className="text-forest" /> Your money, protected</p>
        <p className="mb-4 text-content-secondary">We promise to protect every penny with cutting-edge tech and any time customer support.</p>
        <button className="rounded-pill bg-bg-neutral px-6 py-2.5 font-semibold text-content-primary hover:bg-black/10">Learn more</button>
      </div>
    </div>
  )
}
