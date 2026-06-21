import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'

const BASE_H = 600 // alto base del teléfono (px); se escala para llenar la escena

// Simulador animado de la app Wise: cicla por 4 fases con transiciones.
// 0) Cuenta INR  1) Cuentas USD/EUR + tarjeta  2) Elegir divisas (toggles)  3) Listo
const PHASE_MS = 2900

const currencies = [
  { code: 'GBP', iso: 'gb' },
  { code: 'AUD', iso: 'au' },
  { code: 'CAD', iso: 'ca' },
  { code: 'HUF', iso: 'hu' },
  { code: 'RON', iso: 'ro' },
  { code: 'NZD', iso: 'nz' },
]

const Flag = ({ iso, size = 28 }) => (
  <span className="inline-block shrink-0 overflow-hidden rounded-full" style={{ width: size, height: size }}>
    <img src={`https://flagcdn.com/w80/${iso}.png`} alt="" className="h-full w-full object-cover" />
  </span>
)

function StatusBar({ light = false }) {
  const c = light ? 'text-bright-green' : 'text-content-primary'
  return (
    <div className={`flex items-center justify-between px-1 text-[11px] font-semibold ${c}`}>
      <span>9:41</span>
      <span className="flex items-center gap-1">
        <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor"><rect y="7" width="3" height="4" rx="1" /><rect x="4" y="5" width="3" height="6" rx="1" /><rect x="8" y="3" width="3" height="8" rx="1" /><rect x="12" width="3" height="11" rx="1" /></svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor"><path d="M7.5 2C4.5 2 1.9 3.2 0 5l1.4 1.4C3 4.9 5.1 4 7.5 4s4.5.9 6.1 2.4L15 5C13.1 3.2 10.5 2 7.5 2zm0 4c-1.6 0-3 .6-4.1 1.6L7.5 11l4.1-3.4C10.5 6.6 9.1 6 7.5 6z" /></svg>
        <svg width="24" height="12" viewBox="0 0 24 12" fill="none"><rect x="0.5" y="0.5" width="20" height="11" rx="3" stroke="currentColor" opacity="0.45" /><rect x="2" y="2" width="16" height="8" rx="1.5" fill="currentColor" /><rect x="21.5" y="4" width="1.6" height="4" rx="0.8" fill="currentColor" /></svg>
      </span>
    </div>
  )
}

const Avatar = () => (
  <span className="block h-9 w-9 overflow-hidden rounded-full bg-[#f0c0b0]">
    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80" alt="" className="h-full w-full object-cover" />
  </span>
)

function Txn({ icon, label, amount }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3f3f1] text-content-primary">
        <Icon name={icon} size={16} />
      </span>
      <span className="flex-1 truncate text-[13px] font-medium text-content-primary">{label}</span>
      <span className="shrink-0 text-[13px] font-medium text-content-primary">{amount}</span>
    </div>
  )
}

function NavBar() {
  return (
    <div className="flex items-center justify-around border-t border-black/5 bg-white px-3 pb-2 pt-2.5">
      <Icon name="home" size={22} className="text-content-tertiary" />
      <Icon name="card" size={22} className="text-content-tertiary" />
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-bright-green text-forest">
        <Icon name="arrowUp" size={18} stroke={2.5} />
      </span>
      <Icon name="users" size={22} className="text-content-tertiary" />
      <Icon name="grid" size={22} className="text-content-tertiary" />
    </div>
  )
}

// Página 0 — cuenta en INR
function AccountINR() {
  return (
    <div className="flex h-full flex-col px-4 pt-3">
      <StatusBar />
      <div className="mb-3 mt-3"><Avatar /></div>
      <h4 className="mb-3 text-lg font-bold text-content-primary">Account</h4>
      <div className="mb-5 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-[#f3f3f1] p-3">
          <Flag iso="in" size={34} />
          <p className="mt-6 text-lg font-bold text-content-primary">5,263.12</p>
        </div>
        <div className="rounded-xl bg-[#f3f3f1] p-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest text-bright-green text-xl font-bold">+</span>
          <p className="mt-6 text-lg font-bold text-forest">OPEN</p>
        </div>
      </div>
      <p className="mb-1 text-sm font-semibold text-content-primary">Transactions</p>
      <Txn icon="arrowUp" label="Ma" amount="40,000 INR" />
      <Txn icon="arrowDown" label="Spicy Duck" amount="2,300 INR" />
      <Txn icon="bus" label="New Delhi Taxi" amount="450 INR" />
    </div>
  )
}

// Página 1 — cuentas USD/EUR + tarjeta
function AccountUSD() {
  return (
    <div className="flex h-full flex-col px-4 pt-3">
      <StatusBar />
      <div className="mb-3 mt-3"><Avatar /></div>
      <h4 className="mb-3 text-lg font-bold text-content-primary">Account</h4>
      <div className="mb-5 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-[#f3f3f1] p-3">
          <Flag iso="us" size={34} />
          <p className="mt-6 text-lg font-bold text-content-primary">156.90</p>
        </div>
        <div className="rounded-xl bg-[#f3f3f1] p-3">
          <Flag iso="eu" size={34} />
          <p className="mt-6 text-lg font-bold text-content-primary">378.20</p>
        </div>
      </div>
      <p className="mb-1 text-sm font-semibold text-content-primary">Transactions</p>
      <Txn icon="bus" label="MTA NYCT Paygo" amount="2.75 USD" />
      <p className="mb-2 mt-2 text-sm font-semibold text-content-primary">Spend anywhere</p>
      <div className="relative h-20 overflow-hidden rounded-xl bg-gradient-to-br from-[#9FE870] via-[#a9d8ff] to-[#d9b8ff] p-3">
        <span className="absolute right-3 top-3 font-display text-lg font-black text-forest">wise</span>
        <span className="absolute bottom-3 left-3 h-5 w-7 rounded bg-white/40" />
      </div>
    </div>
  )
}

export default function AnimatedPhone() {
  const [phase, setPhase] = useState(0)
  const [paused, setPaused] = useState(false)
  const [lit, setLit] = useState(0)
  const sceneRef = useRef(null)
  const [scale, setScale] = useState(1.1)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setPhase((p) => (p + 1) % 4), PHASE_MS)
    return () => clearInterval(id)
  }, [paused])

  // Escala el teléfono para llenar la altura de la escena
  useEffect(() => {
    const calc = () => {
      const el = sceneRef.current
      if (!el) return
      const s = (el.clientHeight * 0.84) / BASE_H
      setScale(Math.min(1.7, Math.max(0.85, s)))
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  // Toggles encendiéndose 1×1 durante la fase 2
  useEffect(() => {
    if (phase !== 2) {
      setLit(0)
      return
    }
    let n = 0
    const id = setInterval(() => {
      n += 1
      setLit(n)
      if (n >= currencies.length) clearInterval(id)
    }, 330)
    return () => clearInterval(id)
  }, [phase])

  return (
    <div
      ref={sceneRef}
      className="relative mx-auto h-[70vh] max-h-[960px] min-h-[520px] w-full max-w-[620px] overflow-hidden rounded-card-lg bg-[#efece7] md:h-[86vh]"
    >
      {/* Caja verde con patrón de escamas (escena) */}
      <div
        className="absolute left-1/2 top-1/2 h-[92%] w-[80%] -translate-x-1/2 -translate-y-1/2 rotate-[-7deg] rounded-[2rem]"
        style={{
          backgroundColor: '#33421c',
          backgroundImage:
            'radial-gradient(circle at 50% 100%, transparent 26px, rgba(159,232,112,0.5) 27px, rgba(159,232,112,0.5) 29px, transparent 30px)',
          backgroundSize: '60px 30px',
        }}
      />

      {/* Botón pausa/play */}
      <button
        onClick={() => setPaused((v) => !v)}
        className="absolute right-4 top-4 z-40 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-content-primary shadow-md backdrop-blur"
        aria-label={paused ? 'Reproducir' : 'Pausar'}
      >
        {paused ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M3 2l9 5-9 5z" /></svg>
        ) : (
          <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor"><rect width="4" height="14" rx="1" /><rect x="8" width="4" height="14" rx="1" /></svg>
        )}
      </button>

      {/* Teléfono (tamaño base fijo, escalado para llenar la escena) */}
      <div
        className="absolute left-1/2 top-1/2"
        style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        <div
          className="relative overflow-hidden rounded-[2.6rem] border-[9px] border-[#0E0F0C] bg-white shadow-2xl"
          style={{ width: 284, height: BASE_H }}
        >
          {/* Slider de cuentas */}
          <div
            className="absolute inset-0 flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(${phase === 0 ? '0%' : '-100%'})` }}
          >
            <div className="h-full w-full shrink-0"><AccountINR /></div>
            <div className="h-full w-full shrink-0"><AccountUSD /></div>
          </div>

          {/* Nav inferior (siempre visible salvo en "listo") */}
          <div className="absolute inset-x-0 bottom-0 z-20">
            <NavBar />
          </div>

          {/* Drawer: elegir divisas */}
          <div
            className="absolute inset-x-0 bottom-0 top-9 z-10 rounded-t-3xl bg-white px-4 pt-5 shadow-[0_-12px_30px_rgba(0,0,0,0.12)] transition-transform duration-500 ease-out"
            style={{ transform: phase === 2 ? 'translateY(0)' : 'translateY(115%)' }}
          >
            <h4 className="text-lg font-bold leading-tight text-content-primary">Choose your<br />currencies</h4>
            <p className="mb-3 mt-3 text-sm font-bold text-content-primary">Balances with account details</p>
            <ul>
              {currencies.map((c, i) => {
                const on = i < lit
                return (
                  <li key={c.code} className="flex items-center gap-3 py-1.5">
                    <Flag iso={c.iso} size={30} />
                    <span className="flex-1 font-display text-lg font-black text-content-primary">{c.code}</span>
                    <span className={`flex h-6 w-10 items-center rounded-full p-0.5 transition-colors duration-200 ${on ? 'bg-bright-green' : 'bg-black/15'}`}>
                      <span className={`h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${on ? 'translate-x-4' : ''}`} />
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Drawer: listo */}
          <div
            className="absolute inset-0 z-30 flex flex-col bg-forest px-5 pt-3 transition-transform duration-500 ease-out"
            style={{ transform: phase === 3 ? 'translateY(0)' : 'translateY(115%)' }}
          >
            <StatusBar light />
            <div className="flex flex-1 flex-col items-center justify-center">
              <span
                className="mb-8 flex h-24 w-24 items-center justify-center rounded-2xl"
                style={{ background: 'linear-gradient(135deg, #9FE870, #a9d8ff 60%, #d9b8ff)' }}
              >
                <Icon name="check" size={56} stroke={3} className="text-forest" />
              </span>
              <p className="font-display text-3xl font-black uppercase leading-tight text-bright-green">That's<br />done</p>
            </div>
            <button className="mb-4 w-full rounded-pill bg-bright-green py-3.5 font-semibold text-forest">Continue</button>
          </div>
        </div>
      </div>
    </div>
  )
}
