import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useViewer } from '../context/ViewAsContext.jsx'
import { shortDate } from '../lib/date.js'
import { ACCOUNT_DEFAULTS } from '../lib/account.js'
import AppLayout from '../components/AppLayout.jsx'
import HomeExtras from '../components/HomeExtras.jsx'
import LogoMark from '../components/LogoMark.jsx'
import Icon from '../components/Icon.jsx'

const SYMBOL = { USD: '$', EUR: '€', GBP: '£', COP: '$', MXN: '$', BRL: 'R$' }
const FLAG = { USD: 'us', EUR: 'eu', GBP: 'gb', COP: 'co', MXN: 'mx', BRL: 'br' }
const fmt = (n) => Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const actions = ['Send', 'Add money', 'Request', 'Upload']

export default function Dashboard() {
  const { id, client, ready } = useViewer()
  const [account, setAccount] = useState(null)
  const [txns, setTxns] = useState([])
  const [loading, setLoading] = useState(true)
  const [showActionModal, setShowActionModal] = useState(false)
  const modalMsg = account?.modal_message || ACCOUNT_DEFAULTS.modal_message

  useEffect(() => {
    if (!ready || !id) return
    let active = true
    ;(async () => {
      const [{ data: a }, { data: t }] = await Promise.all([
        client.from('accounts').select('*').eq('user_id', id).order('created_at').limit(1).maybeSingle(),
        client.from('transactions').select('*').eq('user_id', id).order('date', { ascending: false }),
      ])
      if (!active) return
      setAccount(a)
      setTxns(t || [])
      setLoading(false)
    })()
    return () => { active = false }
  }, [id, ready, client])

  const currency = account?.currency || 'USD'
  const balance = account?.balance ?? 0

  return (
    <AppLayout>
      {/* Acciones */}
      <div className="mb-8 flex flex-wrap gap-3">
        {actions.map((a) => (
          <button key={a} onClick={() => setShowActionModal(true)} className="rounded-pill bg-bright-green/30 px-5 py-2.5 font-semibold text-forest hover:bg-bright-green/50">
            {a}
          </button>
        ))}
      </div>

      {/* Tarjetas */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="overflow-hidden rounded-card-lg bg-bg-neutral">
          <div className="relative h-20 bg-bright-green px-6 pt-5">
            <span className="flex items-center gap-1 font-semibold text-forest">Tu tarjeta <Icon name="chevronRight" size={16} /></span>
            <LogoMark height={18} className="absolute right-6 top-5" />
          </div>
          <div className="px-6 pb-6 pt-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-2xl font-bold text-content-primary">Cuenta principal</span>
              <Icon name="chevronRight" size={20} className="text-content-tertiary" />
            </div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-7 w-7 overflow-hidden rounded-full">
                <img src={`https://flagcdn.com/w80/${FLAG[currency] || 'us'}.png`} alt="" className="h-full w-full object-cover" />
              </span>
              <span className="text-lg font-bold text-content-primary">{SYMBOL[currency] || ''}{fmt(balance)}</span>
              <Icon name="chevronRight" size={16} className="text-content-tertiary" />
            </div>
            <Link to="/payments/account-details" className="flex items-center gap-2 rounded-pill bg-white px-4 py-2.5 font-semibold text-content-primary shadow-sm">
              <Icon name="bank" size={18} /> Datos de la cuenta
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center rounded-card-lg bg-bg-neutral p-8 text-center">
          <h3 className="mb-2 text-2xl font-bold text-content-primary">Haz más con tu dinero</h3>
          <p className="mb-6 text-content-secondary">Gestiónalo, compártelo con otros y genera retorno.</p>
          <Link to="/flows/account/open" className="flex h-14 w-14 items-center justify-center rounded-full bg-bright-green text-forest hover:bg-bright-green-hover">
            <span className="text-3xl font-bold leading-none">+</span>
          </Link>
        </div>
      </div>

      {/* Transacciones */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-content-primary">Transacciones</h2>
          <Link to="/transactions" className="font-semibold text-content-primary underline underline-offset-4">Ver todas</Link>
        </div>
        {loading ? (
          <p className="py-8 text-content-tertiary">Cargando…</p>
        ) : txns.length === 0 ? (
          <p className="rounded-card bg-bg-neutral py-12 text-center text-content-tertiary">
            Aún no hay transacciones.
          </p>
        ) : (
          <ul className="divide-y divide-black/5">
            {txns.map((t) => (
              <li key={t.id} className="flex items-center gap-4 py-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-bg-neutral font-bold text-content-secondary">
                  {t.name?.charAt(0).toUpperCase()}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-content-primary">{t.name}</p>
                  <p className="text-sm text-content-tertiary">{shortDate(t.date)}</p>
                </div>
                <span className={`font-semibold ${Number(t.amount) >= 0 ? 'text-forest' : 'text-content-primary'}`}>
                  {Number(t.amount) >= 0 ? '+' : ''}{fmt(t.amount)} {t.currency || currency}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <HomeExtras />

      {showActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5" onClick={() => setShowActionModal(false)}>
          <div className="w-full max-w-md rounded-card-lg bg-white p-6 text-center shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <Icon name="warning" size={24} />
            </div>
            <p className="mb-6 whitespace-pre-line text-content-primary">{modalMsg}</p>
            <button onClick={() => setShowActionModal(false)} className="btn-primary w-full py-3">Entendido</button>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
