import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import AppLayout from '../components/AppLayout.jsx'
import Icon from '../components/Icon.jsx'

const fmt = (n) => Math.abs(Number(n || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function Insights() {
  const { user } = useAuth()
  const [account, setAccount] = useState(null)
  const [txns, setTxns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    ;(async () => {
      const [{ data: a }, { data: t }] = await Promise.all([
        supabase.from('accounts').select('*').eq('user_id', user.id).order('created_at').limit(1).maybeSingle(),
        supabase.from('transactions').select('*').eq('user_id', user.id),
      ])
      setAccount(a)
      setTxns(t || [])
      setLoading(false)
    })()
  }, [user])

  const cur = account?.currency || 'USD'
  const balance = account?.balance ?? 0

  const { spentThis, spentLast } = useMemo(() => {
    const now = new Date()
    const m = now.getMonth()
    const y = now.getFullYear()
    const lm = new Date(y, m - 1, 1)
    let st = 0
    let sl = 0
    for (const t of txns) {
      if (Number(t.amount) >= 0) continue
      const d = new Date(t.date + 'T00:00:00')
      const abs = Math.abs(Number(t.amount))
      if (d.getMonth() === m && d.getFullYear() === y) st += abs
      else if (d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear()) sl += abs
    }
    return { spentThis: st, spentLast: sl }
  }, [txns])

  const circle = 'flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bg-neutral text-content-secondary'

  return (
    <AppLayout>
      <div className="mx-auto max-w-[860px]">
        {/* Balance total */}
        <div className="mb-1 flex items-center gap-1.5 text-content-secondary">
          Total balance <Icon name="help" size={16} className="text-content-tertiary" />
        </div>
        <p className="mb-8 text-4xl font-extrabold text-content-primary">{loading ? '—' : `${fmt(balance)} ${cur}`}</p>

        {/* Cash + Interest */}
        <div className="mb-2 flex items-center gap-4 border-b border-black/5 py-3">
          <span className={circle}><Icon name="cash" size={22} /></span>
          <span className="flex-1">
            <span className="block font-bold text-content-primary">Cash</span>
            <span className="block text-sm text-content-secondary">{fmt(balance)} {cur}</span>
          </span>
          <Icon name="chevronRight" size={20} className="text-content-tertiary" />
        </div>
        <div className="mb-10 flex items-center gap-4 py-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bright-green/30 text-forest"><Icon name="bag" size={22} /></span>
          <span className="flex-1 font-bold text-content-primary">Interest</span>
          <a href="#" className="font-semibold text-content-primary underline underline-offset-4">Learn more</a>
        </div>

        {/* Total earned */}
        <h2 className="mb-4 text-2xl font-bold text-content-primary">Total earned</h2>
        <div className="mb-8 rounded-card-lg bg-bg-neutral py-8 text-center">
          <p className="mb-1 text-content-secondary">Interest</p>
          <p className="text-2xl font-bold text-content-primary">0.00 {cur}</p>
        </div>

        {/* Spending */}
        <div className="rounded-card-lg border border-black/10 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-content-primary">Spending</h2>
            <Link to="/transactions" className="font-semibold text-content-primary underline underline-offset-4">See all</Link>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className={circle}><Icon name="cash" size={22} /></span>
              <span>
                <span className="block text-sm text-content-secondary">Spent this month</span>
                <span className="block text-lg font-bold text-content-primary">{fmt(spentThis)} {cur}</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className={circle}><Icon name="cash" size={22} /></span>
              <span>
                <span className="block text-sm text-content-secondary">Spent last month</span>
                <span className="block text-lg font-bold text-content-primary">{fmt(spentLast)} {cur}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className="mt-10 text-center">
          <p className="text-content-secondary">¿Qué te parece esta experiencia?</p>
          <a href="#" className="font-semibold text-content-primary underline underline-offset-4">Danos tu opinión</a>
        </div>
      </div>
    </AppLayout>
  )
}
