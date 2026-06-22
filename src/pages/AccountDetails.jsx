import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useViewer } from '../context/ViewAsContext.jsx'
import AppLayout from '../components/AppLayout.jsx'
import Icon from '../components/Icon.jsx'

const FLAG = { USD: 'us', EUR: 'eu', GBP: 'gb', COP: 'co', MXN: 'mx', BRL: 'br' }

// Número de cuenta único y estable por usuario (15 dígitos derivados del id).
const accountNumberFor = (id = '') => {
  let out = ''
  for (let i = 0; i < (id.length || 1); i++) out += String(id.charCodeAt(i) || 0)
  out = out.replace(/\D/g, '')
  while (out.length < 15) out += out
  return out.slice(0, 15)
}

function Field({ label, value, sub }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      /* noop */
    }
  }
  return (
    <div className="flex items-start justify-between gap-3 border-b border-black/5 px-5 py-4 last:border-0">
      <div className="min-w-0">
        <p className="text-sm text-content-secondary">{label}</p>
        <p className="font-bold text-content-primary">{value}</p>
        {sub && <p className="mt-0.5 text-sm text-content-tertiary">{sub}</p>}
      </div>
      <button onClick={copy} aria-label="Copiar" className="shrink-0 text-content-tertiary hover:text-content-primary">
        <Icon name={copied ? 'check' : 'copy'} size={20} />
      </button>
    </div>
  )
}

export default function AccountDetails() {
  const navigate = useNavigate()
  const { id, client, ready, name: viewName } = useViewer()
  const [name, setName] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [tab, setTab] = useState('Fees')

  useEffect(() => {
    if (!ready || !id) return
    ;(async () => {
      const [{ data: p }, { data: a }] = await Promise.all([
        client.from('profiles').select('full_name').eq('id', id).maybeSingle(),
        client.from('accounts').select('currency').eq('user_id', id).order('created_at').limit(1).maybeSingle(),
      ])
      setName(p?.full_name || viewName || 'Usuario')
      if (a?.currency) setCurrency(a.currency)
    })()
  }, [id, ready, client, viewName])

  const acctNum = accountNumberFor(id)

  return (
    <AppLayout>
      <div className="mx-auto max-w-[1080px]">
        <button
          onClick={() => navigate('/home')}
          aria-label="Volver"
          className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-bg-neutral text-content-primary hover:bg-black/10"
        >
          <Icon name="arrowRight" size={20} className="rotate-180" />
        </button>

        <div className="mb-8 flex items-center gap-3">
          <img src={`https://flagcdn.com/w80/${FLAG[currency] || 'us'}.png`} alt="" className="h-11 w-11 rounded-full object-cover" />
          <div>
            <p className="text-2xl font-extrabold text-content-primary">{currency}</p>
            <p className="text-content-secondary">Account details</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Receive details */}
          <div>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-content-primary">Receive {currency}</h2>
                <p className="text-content-secondary">From the US and <a href="#" className="font-semibold text-content-primary underline">150+ countries</a></p>
              </div>
              <button className="flex shrink-0 items-center gap-1 rounded-pill bg-bright-green px-4 py-2 font-semibold text-forest">
                Share <Icon name="chevronDown" size={16} />
              </button>
            </div>

            <div className="rounded-card-lg bg-bg-neutral">
              <Field label="Name" value={name} />
              <Field label="Account type" value="Deposit" sub="Only used for domestic transfers" />
              <Field label="Routing number (for wire and ACH)" value="084009519" sub="Provided to Wise by Column Bank, our partner" />
              <Field label="Account number" value={acctNum} />
              <Field label="Address" value="Wise US Inc, 108 W 13th St, Wilmington, DE, 19801, United States" sub="Only used for international Swift transfers" />
              <Field label="Swift/BIC" value="TRWIUS35XXX" sub="Only used for international Swift transfers" />
            </div>

            <p className="mt-4 text-sm text-content-secondary">
              Details not accepted? <a href="#" className="font-semibold text-content-primary underline">Tell us where</a> or <a href="#" className="font-semibold text-content-primary underline">give general feedback</a>
            </p>
          </div>

          {/* Quick facts */}
          <div>
            <h2 className="mb-4 text-2xl font-bold text-content-primary">Quick facts</h2>
            <div className="mb-5 flex gap-2">
              {['Fees', 'Speed', 'Limits'].map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`rounded-pill px-4 py-1.5 font-semibold transition-colors ${tab === t ? 'bg-forest text-bright-green' : 'border border-black/15 text-content-primary hover:border-content-primary'}`}>{t}</button>
              ))}
            </div>

            {tab === 'Fees' && (
              <>
                <p className="mb-3 font-semibold text-content-primary">What does it cost?</p>
                <div className="mb-6 rounded-card-lg border border-black/10 p-5">
                  <div className="flex items-start justify-between gap-3 border-b border-black/5 pb-4">
                    <div>
                      <p className="text-sm text-content-secondary">From the US (domestic)</p>
                      <p className="font-bold text-content-primary">ACH is free</p>
                      <p className="text-sm text-content-secondary">Wire transfers cost 6.11 USD</p>
                    </div>
                    <Icon name="chevronRight" size={20} className="shrink-0 text-content-tertiary" />
                  </div>
                  <div className="pt-4">
                    <p className="text-sm text-content-secondary">From outside the US (Swift)</p>
                    <p className="font-bold text-content-primary">6.11 USD Wise fee</p>
                    <p className="text-sm text-content-secondary">Bank fees may also apply</p>
                  </div>
                </div>
              </>
            )}
            {tab === 'Speed' && (
              <div className="mb-6 rounded-card-lg border border-black/10 p-5 text-content-secondary">
                ACH llega en 1–2 días hábiles. Las transferencias wire suelen llegar el mismo día.
              </div>
            )}
            {tab === 'Limits' && (
              <div className="mb-6 rounded-card-lg border border-black/10 p-5 text-content-secondary">
                Sin límite para recibir {currency} en tu cuenta.
              </div>
            )}

            <h3 className="mb-3 text-xl font-bold text-content-primary">Availability</h3>
            <div className="flex items-start gap-3 rounded-card-lg border border-black/10 p-5">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest text-bright-green"><Icon name="check" size={14} /></span>
              <div>
                <p className="font-bold text-content-primary">ACH debits available</p>
                <p className="text-sm text-content-secondary">Make regular payments. Works with Amazon, PayPal, Stripe and more.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
