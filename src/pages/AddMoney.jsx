import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
import Icon from '../components/Icon.jsx'

export default function AddMoney() {
  const navigate = useNavigate()
  const [amount, setAmount] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)

  // Arranca enfocado (grande); al hacer clic afuera se achica.
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const onChange = (e) => {
    const v = e.target.value.replace(/[^\d.]/g, '')
    if (/^\d*\.?\d{0,2}$/.test(v)) setAmount(v)
  }
  const canContinue = (parseFloat(amount) || 0) > 0

  return (
    <div className="min-h-screen bg-white">
      {/* barra de progreso */}
      <div className="h-1 w-full bg-black/5">
        <div className="h-full w-1/3 bg-forest transition-all" />
      </div>

      {/* header */}
      <header>
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-4">
          <Logo height={26} />
          <div className="hidden flex-1 items-center gap-10 text-[15px] font-semibold sm:flex">
            <span className="text-content-primary">Amount</span>
            <span className="text-content-tertiary">Verification</span>
            <span className="text-content-tertiary">Payment</span>
          </div>
          <span className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-bg-neutral text-content-secondary sm:ml-0">
            <Icon name="user" size={20} />
          </span>
          <button onClick={() => navigate('/home')} aria-label="Cerrar" className="text-content-primary hover:text-content-secondary">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-5 pt-20 md:pt-28">
        <p className="mb-10 text-center text-xl text-content-secondary">
          You add to <b className="text-content-primary">Main account</b>
        </p>

        <div className="flex items-center justify-between gap-4">
          <button className="flex shrink-0 items-center gap-2 rounded-pill bg-bright-green/25 px-3 py-2 font-bold text-content-primary">
            <img src="https://flagcdn.com/w80/us.png" alt="" className="h-6 w-6 rounded-full object-cover" />
            USD <Icon name="chevronDown" size={16} className="text-content-tertiary" />
          </button>
          <input
            ref={inputRef}
            value={amount}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            inputMode="decimal"
            placeholder="0.00"
            className={`min-w-0 flex-1 bg-transparent text-right font-black leading-none text-content-primary outline-none transition-all duration-200 placeholder:text-content-tertiary ${focused ? 'text-[5.5rem]' : 'text-[3.25rem]'}`}
          />
        </div>

        <div className="mt-16 space-y-1.5 rounded-card-lg bg-bg-neutral p-1.5">
          {!canContinue && (
            <p className="flex items-center justify-center gap-2 py-3 text-content-secondary">
              <Icon name="info" size={16} className="text-content-tertiary" /> Enter the amount you wish to add
            </p>
          )}
          <button
            disabled={!canContinue}
            className={`w-full rounded-card py-4 font-semibold transition-colors ${canContinue ? 'bg-bright-green text-forest hover:bg-bright-green-hover' : 'cursor-default bg-transparent text-content-tertiary'}`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
