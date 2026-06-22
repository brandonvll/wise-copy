import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { adminClient, ensureAdminSession } from '../lib/supabase.js'
import Logo from '../components/Logo.jsx'
import Icon from '../components/Icon.jsx'

const SYMBOL = { USD: '$', EUR: '€', GBP: '£', COP: '$', MXN: '$', BRL: 'R$' }
const FLAG = { USD: 'us', EUR: 'eu', GBP: 'gb', COP: 'co', MXN: 'mx', BRL: 'br' }
const fmt = (n) => Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const nav = [
  { icon: 'home', label: 'Home', active: true },
  { icon: 'card', label: 'Cards' },
  { icon: 'list', label: 'Transactions' },
  { icon: 'transfer', label: 'Payments' },
  { icon: 'users', label: 'Recipients' },
  { icon: 'chart', label: 'Insights' },
]

// Vista previa de SOLO LECTURA: muestra el dashboard tal como lo ve el usuario,
// usando el acceso del administrador (adminClient). Se abre en una pestaña nueva.
export default function AdminUserPreview() {
  const { userId } = useParams()
  const [name, setName] = useState('')
  const [account, setAccount] = useState(null)
  const [txns, setTxns] = useState([])
  const [loading, setLoading] = useState(true)
  const [denied, setDenied] = useState(false)

  useEffect(() => {
    let active = true
    ;(async () => {
      const r = await ensureAdminSession()
      if (!r.ok) { if (active) { setDenied(true); setLoading(false) } return }
      const [{ data: p }, { data: a }, { data: t }] = await Promise.all([
        adminClient.from('profiles').select('full_name').eq('id', userId).maybeSingle(),
        adminClient.from('accounts').select('*').eq('user_id', userId).order('created_at').limit(1).maybeSingle(),
        adminClient.from('transactions').select('*').eq('user_id', userId).order('date', { ascending: false }),
      ])
      if (!active) return
      setName(p?.full_name || 'Usuario')
      setAccount(a)
      setTxns(t || [])
      setLoading(false)
    })()
    return () => { active = false }
  }, [userId])

  const currency = account?.currency || 'USD'
  const balance = account?.balance ?? 0

  if (denied) {
    return <div className="flex min-h-screen items-center justify-center px-5 text-center text-content-tertiary">No autorizado. Abre esta vista desde el panel de administración.</div>
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-forest px-5 py-2 text-center text-sm font-semibold text-bright-green">
        Vista previa — así ve {name} su cuenta (solo lectura)
      </div>

      {/* Top bar */}
      <header>
        <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-5">
          <Logo height={24} />
          <div className="flex items-center gap-3">
            <span className="hidden rounded-pill bg-bright-green/30 px-4 py-2 text-sm font-semibold text-forest sm:inline">Gana £50</span>
            <span className="flex items-center gap-2 rounded-pill px-2 py-1.5">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-bg-neutral font-bold text-content-secondary">
                {(name || 'U').charAt(0).toUpperCase()}
                <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
              </span>
              <span className="hidden font-semibold text-content-primary sm:inline">{name}</span>
              <Icon name="chevronRight" size={16} className="text-content-tertiary" />
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1280px] gap-8 px-5 pb-16">
        {/* Sidebar (solo visual) */}
        <aside className="hidden w-60 shrink-0 lg:block">
          <nav className="space-y-1">
            {nav.map((it) => (
              <span key={it.label} className={`flex items-center gap-3 rounded-xl px-4 py-3 font-semibold ${it.active ? 'bg-bright-green/30 text-forest' : 'text-content-secondary'}`}>
                <Icon name={it.icon} size={20} /> {it.label}
              </span>
            ))}
          </nav>
        </aside>

        {/* Contenido */}
        <main className="min-w-0 flex-1 pt-2">
          <div className="mb-8 flex flex-wrap gap-3">
            {['Send', 'Add money', 'Request', 'Upload'].map((a) => (
              <span key={a} className="rounded-pill bg-bright-green/30 px-5 py-2.5 font-semibold text-forest">{a}</span>
            ))}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="overflow-hidden rounded-card-lg bg-bg-neutral">
              <div className="relative h-20 bg-bright-green px-6 pt-5">
                <span className="flex items-center gap-1 font-semibold text-forest">Tu tarjeta <Icon name="chevronRight" size={16} /></span>
                <Logo height={18} className="absolute right-6 top-5" />
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
                <span className="inline-flex items-center gap-2 rounded-pill bg-white px-4 py-2.5 font-semibold text-content-primary shadow-sm">
                  <Icon name="bank" size={18} /> Datos de la cuenta
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center rounded-card-lg bg-bg-neutral p-8 text-center">
              <h3 className="mb-2 text-2xl font-bold text-content-primary">Haz más con tu dinero</h3>
              <p className="mb-6 text-content-secondary">Gestiónalo, compártelo con otros y genera retorno.</p>
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-bright-green text-forest">
                <span className="text-3xl font-bold leading-none">+</span>
              </span>
            </div>
          </div>

          <div className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-content-primary">Transacciones</h2>
              <span className="font-semibold text-content-primary underline underline-offset-4">Ver todas</span>
            </div>
            {loading ? (
              <p className="py-8 text-content-tertiary">Cargando…</p>
            ) : txns.length === 0 ? (
              <p className="rounded-card bg-bg-neutral py-12 text-center text-content-tertiary">Aún no hay transacciones.</p>
            ) : (
              <ul className="divide-y divide-black/5">
                {txns.map((t) => (
                  <li key={t.id} className="flex items-center gap-4 py-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-bg-neutral font-bold text-content-secondary">
                      {t.name?.charAt(0).toUpperCase()}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-content-primary">{t.name}</p>
                      <p className="text-sm text-content-tertiary">{t.date}</p>
                    </div>
                    <span className={`font-semibold ${Number(t.amount) >= 0 ? 'text-forest' : 'text-content-primary'}`}>
                      {Number(t.amount) >= 0 ? '+' : ''}{fmt(t.amount)} {t.currency || currency}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
