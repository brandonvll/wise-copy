import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useViewer } from '../context/ViewAsContext.jsx'
import Logo from '../components/Logo.jsx'
import LogoMark from '../components/LogoMark.jsx'
import Icon from '../components/Icon.jsx'

const fmt = (n) => Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const FLAG = { USD: 'us', EUR: 'eu', GBP: 'gb', COP: 'co', MXN: 'mx', BRL: 'br' }

export default function AddMoney() {
  const navigate = useNavigate()
  const { id, client, ready } = useViewer()
  const [amount, setAmount] = useState('')
  const [focused, setFocused] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
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
  const fee = value * 0.0017 // comisión ACH (0.17%)
  const total = value + fee

  return (
    <div className="min-h-screen bg-white">
      {/* header */}
      <header className="border-b border-black/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Logo height={26} />

          {/* pasos centrados con barra de progreso arriba */}
          <div className="hidden flex-col items-stretch gap-2.5 sm:flex">
            <div className="h-1 overflow-hidden rounded-full bg-black/10">
              <div className="h-full w-1/3 rounded-full bg-forest transition-all" />
            </div>
            <div className="flex items-center justify-between gap-36 text-[15px] font-semibold">
              <span className="text-content-primary">Amount</span>
              <span className="text-content-tertiary">Verification</span>
              <span className="text-content-tertiary">Payment</span>
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

      <div className="mx-auto max-w-2xl px-5 pt-20 md:pt-28">
        <p className="mb-4 text-sm text-content-secondary">
          You add to <b className="text-content-primary">Main account</b>
        </p>

        <div className="flex items-center justify-between gap-4 border-y border-black/10 py-5">
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
              placeholder="0"
              className="max-w-full bg-transparent text-right outline-none placeholder:text-content-secondary"
              style={{ width: `${Math.max((display || '0').length, 1)}ch` }}
            />
            <span>.00</span>
          </div>
        </div>

        {canContinue ? (
          <div>
            <div>
              {/* Paying in */}
              <div className="flex items-center gap-4 py-4">
                <img src={`https://flagcdn.com/w80/${FLAG[currency] || 'us'}.png`} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
                <div className="flex-1">
                  <p className="text-sm text-content-secondary">Paying in</p>
                  <p className="font-bold text-content-primary">United States dollar</p>
                </div>
                <button className="rounded-pill bg-bright-green/25 px-4 py-1.5 font-semibold text-forest hover:bg-bright-green/40">Change</button>
              </div>
              {/* Paying with */}
              <div className="flex items-center gap-4 py-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/15 text-content-primary"><Icon name="bank" size={22} /></span>
                <div className="flex-1">
                  <p className="text-sm text-content-secondary">Paying with</p>
                  <p className="font-bold text-content-primary">Connected bank account (ACH)</p>
                </div>
                <button className="rounded-pill bg-bright-green/25 px-4 py-1.5 font-semibold text-forest hover:bg-bright-green/40">Change</button>
              </div>
              {/* Arrives */}
              <div className="flex items-center gap-4 border-t border-black/5 py-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/15 text-content-primary"><Icon name="zap" size={22} /></span>
                <div className="flex-1">
                  <p className="text-sm text-content-secondary">Arrives</p>
                  <p className="font-bold text-content-primary">Today - in seconds</p>
                </div>
              </div>
              {/* You pay */}
              <div className="flex items-center gap-4 py-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/15 text-content-primary"><Icon name="doc" size={22} /></span>
                <div className="flex-1">
                  <p className="text-sm text-content-secondary">You pay</p>
                  <p className="font-bold text-content-primary">Total with fees</p>
                  <p className="text-sm text-content-tertiary">{fmt(fee)} USD in fees</p>
                </div>
                <button className="flex items-center gap-1 font-semibold text-content-primary underline underline-offset-4">{fmt(total)} USD <Icon name="chevronRight" size={16} /></button>
              </div>
            </div>
            <button className="btn-primary mt-6 w-full py-4">Continue</button>
          </div>
        ) : (
          <div className="mt-16 space-y-1.5 rounded-card-lg bg-bg-neutral p-1.5">
            <p className="flex items-center justify-center gap-2 py-3 text-content-secondary">
              <Icon name="info" size={16} className="text-content-tertiary" /> Enter the amount you wish to add
            </p>
            <button disabled className="w-full cursor-default rounded-card bg-black/10 py-4 font-semibold text-content-tertiary">Continue</button>
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
    </div>
  )
}
