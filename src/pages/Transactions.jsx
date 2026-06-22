import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useViewer } from '../context/ViewAsContext.jsx'
import AppLayout from '../components/AppLayout.jsx'
import Icon from '../components/Icon.jsx'

const fmt = (n) => Math.abs(Number(n || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const fmtDate = (d) => {
  try {
    return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })
  } catch {
    return d
  }
}

export default function Transactions() {
  const { id, client, ready } = useViewer()
  const navigate = useNavigate()
  const [txns, setTxns] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')

  useEffect(() => {
    if (!ready || !id) return
    client
      .from('transactions')
      .select('*')
      .eq('user_id', id)
      .order('date', { ascending: false })
      .then(({ data }) => {
        setTxns(data || [])
        setLoading(false)
      })
  }, [id, ready, client])

  const groups = useMemo(() => {
    const filtered = txns.filter((t) => t.name?.toLowerCase().includes(q.toLowerCase()))
    const map = {}
    for (const t of filtered) {
      ;(map[t.date] ||= []).push(t)
    }
    return Object.keys(map)
      .sort((a, b) => b.localeCompare(a))
      .map((date) => ({ date, items: map[date] }))
  }, [txns, q])

  return (
    <AppLayout>
      <div className="mx-auto max-w-[860px]">
        <button
          onClick={() => navigate('/home')}
          aria-label="Volver"
          className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-bg-neutral text-content-primary hover:bg-black/10"
        >
          <Icon name="arrowRight" size={20} className="rotate-180" />
        </button>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-4xl font-extrabold text-content-primary">Transactions</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-pill border border-black/15 px-4 py-2.5">
              <Icon name="search" size={18} className="text-content-tertiary" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar"
                className="w-28 bg-transparent text-content-primary outline-none placeholder:text-content-tertiary sm:w-40"
              />
            </div>
            <button className="flex items-center gap-2 rounded-pill bg-bright-green/30 px-4 py-2.5 font-semibold text-forest hover:bg-bright-green/50">
              <Icon name="filter" size={18} /> Filters
            </button>
            <button className="flex items-center gap-2 rounded-pill bg-bright-green/30 px-4 py-2.5 font-semibold text-forest hover:bg-bright-green/50">
              <Icon name="download" size={18} /> Download
            </button>
          </div>
        </div>

        {loading ? (
          <p className="py-10 text-content-tertiary">Cargando…</p>
        ) : groups.length === 0 ? (
          <p className="rounded-card bg-bg-neutral py-16 text-center text-content-tertiary">
            {q ? 'Sin resultados.' : 'Aún no hay transacciones.'}
          </p>
        ) : (
          <div className="space-y-8">
            {groups.map((g) => (
              <div key={g.date}>
                <p className="mb-1 text-content-secondary">{fmtDate(g.date)}</p>
                <hr className="mb-2 border-black/10" />
                <ul>
                  {g.items.map((t) => {
                    const incoming = Number(t.amount) >= 0
                    return (
                      <li key={t.id} className="flex items-center gap-4 py-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-bg-neutral text-content-primary">
                          <Icon name={incoming ? 'arrowDown' : 'arrowUp'} size={22} />
                        </span>
                        <span className="flex-1 font-semibold text-content-primary">{t.name}</span>
                        <span className={`font-semibold ${incoming ? 'text-forest' : 'text-content-primary'}`}>
                          {incoming ? '+ ' : ''}{fmt(t.amount)} {t.currency}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
