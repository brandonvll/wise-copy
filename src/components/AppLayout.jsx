import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import Logo from './Logo.jsx'
import Icon from './Icon.jsx'

const mainNav = [
  { to: '/home', icon: 'home', label: 'Home' },
  { to: '/cards', icon: 'card', label: 'Cards' },
  { to: '/transactions', icon: 'list', label: 'Transactions' },
]
const paymentsSub = [
  { to: '/payments/scheduled', label: 'Scheduled' },
  { to: '/payments/direct-debits', label: 'Direct Debits' },
  { to: '/payments/recurring', label: 'Recurring card payments' },
  { to: '/payments/requests', label: 'Payment requests' },
  { to: '/payments/bill-splits', label: 'Bill splits' },
]
const bottomNav = [
  { to: '/recipients', icon: 'users', label: 'Recipients' },
  { to: '/insights', icon: 'chart', label: 'Insights' },
]

export default function AppLayout({ children }) {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const [paymentsOpen, setPaymentsOpen] = useState(true)
  const [name, setName] = useState('')

  useEffect(() => {
    if (!user) return
    supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => setName(data?.full_name || user.email?.split('@')[0] || 'Usuario'))
  }, [user])

  const isActive = (to) => pathname === to
  const navClass = (active) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition-colors ${
      active ? 'bg-bright-green/30 text-forest' : 'text-content-secondary hover:bg-bg-neutral'
    }`

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <header>
        <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-5">
          <Link to="/home"><Logo height={24} /></Link>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-pill bg-bright-green/30 px-4 py-2 text-sm font-semibold text-forest sm:inline">Gana £50</span>
            <Link to="/your-account" className="flex items-center gap-2 rounded-pill px-2 py-1.5 hover:bg-bg-neutral">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-bg-neutral font-bold text-content-secondary">
                {(name || 'U').charAt(0).toUpperCase()}
                <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
              </span>
              <span className="hidden font-semibold text-content-primary sm:inline">{name}</span>
              <Icon name="chevronRight" size={16} className="text-content-tertiary" />
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1280px] gap-8 px-5 pb-16">
        {/* Sidebar */}
        <aside className="hidden w-60 shrink-0 lg:block">
          <nav className="space-y-1">
            {mainNav.map((it) => (
              <Link key={it.to} to={it.to} className={navClass(isActive(it.to))}>
                <Icon name={it.icon} size={20} />
                {it.label}
              </Link>
            ))}

            {/* Payments desplegable */}
            <button
              onClick={() => setPaymentsOpen((v) => !v)}
              className={navClass(pathname.startsWith('/payments')) + ' w-full justify-between'}
            >
              <span className="flex items-center gap-3">
                <Icon name="transfer" size={20} />
                Payments
              </span>
              <Icon name="chevronDown" size={18} className={paymentsOpen ? 'rotate-180' : ''} />
            </button>
            {paymentsOpen && (
              <div className="space-y-1 pb-1 pl-7">
                {paymentsSub.map((s) => (
                  <Link
                    key={s.to}
                    to={s.to}
                    className={`block rounded-xl px-4 py-2.5 text-[15px] font-medium transition-colors ${
                      isActive(s.to) ? 'bg-bright-green/30 text-forest' : 'text-content-secondary hover:bg-bg-neutral'
                    }`}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            )}

            {bottomNav.map((it) => (
              <Link key={it.to} to={it.to} className={navClass(isActive(it.to))}>
                <Icon name={it.icon} size={20} />
                {it.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Contenido */}
        <main className="min-w-0 flex-1 pt-2">{children}</main>
      </div>
    </div>
  )
}
