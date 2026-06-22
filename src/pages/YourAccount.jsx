import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import AppLayout from '../components/AppLayout.jsx'
import Logo from '../components/Logo.jsx'
import Icon from '../components/Icon.jsx'

function Item({ icon, title, subtitle, dot, to }) {
  const cls = 'flex w-full items-center gap-4 rounded-xl px-2 py-4 text-left transition-colors hover:bg-bg-neutral'
  const inner = (
    <>
      <span className="relative shrink-0 text-content-primary">
        <Icon name={icon} size={24} />
        {dot && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500" />}
      </span>
      <span className="flex-1">
        <span className="block font-bold text-content-primary">{title}</span>
        {subtitle && <span className="block text-sm text-content-secondary">{subtitle}</span>}
      </span>
      <Icon name="chevronRight" size={20} className="shrink-0 text-content-tertiary" />
    </>
  )
  return to ? <Link to={to} className={cls}>{inner}</Link> : <button className={cls}>{inner}</button>
}

const account = [
  { icon: 'bell', title: 'Inbox', dot: true, to: '/your-account/inbox' },
  { icon: 'tag', title: 'Pricing and discounts' },
  { icon: 'help', title: 'Help' },
  { icon: 'doc', title: 'Statements and reports' },
]
const settings = [
  { icon: 'shield', title: 'Security and privacy', subtitle: 'Change your security and privacy settings.' },
  { icon: 'bell', title: 'Notifications', subtitle: 'Customise how you get updates.' },
  { icon: 'link', title: 'Connect and manage apps', subtitle: 'Connect your account to third-party software.' },
  { icon: 'bank', title: 'Payment methods', subtitle: 'Manage saved cards and bank accounts that are linked to this account.' },
  { icon: 'gauge', title: 'Limits', subtitle: 'Manage your transfer and card limits.' },
  { icon: 'contrast', title: 'Language and appearance', subtitle: 'Customise language settings and which theme is used.' },
  { icon: 'user', title: 'Personal details', subtitle: 'Update your personal information.' },
]
const actions = [
  { icon: 'users', title: 'Referrals', subtitle: 'Send and manage referrals' },
  { icon: 'info', title: 'Our agreements', subtitle: 'Review our terms and policies.' },
  { icon: 'xCircle', title: 'Close account', subtitle: 'Close your personal account.' },
]

export default function YourAccount() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')

  useEffect(() => {
    if (!user) return
    supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle()
      .then(({ data }) => setName(data?.full_name || user.email?.split('@')[0] || 'Usuario'))
  }, [user])

  const handle = '@' + (user?.email?.split('@')[0]?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'user')
  const membership = 'P' + (String(user?.id || '').replace(/\D/g, '') + '200285911').slice(0, 9)

  const logout = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <AppLayout>
      <button
        onClick={() => navigate('/home')}
        aria-label="Volver"
        className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-bg-neutral text-content-primary hover:bg-black/10"
      >
        <Icon name="arrowRight" size={20} className="rotate-180" />
      </button>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr]">
        {/* Columna izquierda: perfil */}
        <div>
          <div className="rounded-card-lg bg-bg-neutral p-8 text-center">
            <div className="relative mx-auto mb-4 h-20 w-20">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-black/5 text-content-secondary">
                <Icon name="user" size={36} />
              </div>
              <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-bright-green text-forest ring-2 ring-bg-neutral">
                <Icon name="camera" size={14} />
              </span>
            </div>
            <h2 className="mb-1 font-display text-2xl font-black uppercase leading-tight text-content-primary">{name}</h2>
            <p className="mb-4 text-content-secondary">Your personal account</p>
            <span className="inline-flex items-center gap-1.5 rounded-pill bg-white px-3 py-1.5 font-semibold text-content-primary">
              <Logo height={12} /> {handle}
            </span>
          </div>

          <button className="mt-4 flex w-full items-center gap-4 rounded-card border border-dashed border-black/20 p-5 text-left hover:border-content-primary">
            <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-bg-neutral text-content-primary">
              <Icon name="briefcase" size={22} />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-bright-green text-forest text-xs font-bold">+</span>
            </span>
            <span className="flex-1 font-bold text-content-primary">Open a business account</span>
            <Icon name="chevronRight" size={20} className="text-content-tertiary" />
          </button>

          <div className="mt-6 text-center">
            <p className="mb-4 text-sm text-content-secondary">
              Membership number: {membership} <Icon name="copy" size={14} className="ml-1 inline align-text-bottom text-content-tertiary" />
            </p>
            <button onClick={logout} className="rounded-pill bg-bg-neutral px-6 py-2.5 font-semibold text-content-primary hover:bg-black/10">
              Log out
            </button>
          </div>
        </div>

        {/* Columna derecha: opciones */}
        <div className="max-w-[560px]">
          <h1 className="mb-3 text-3xl font-extrabold text-content-primary">Your account</h1>
          <div className="mb-10 divide-y divide-black/5">
            {account.map((i) => <Item key={i.title} {...i} />)}
          </div>

          <h2 className="mb-3 text-3xl font-extrabold text-content-primary">Settings</h2>
          <div className="mb-10 divide-y divide-black/5">
            {settings.map((i) => <Item key={i.title} {...i} />)}
          </div>

          <h2 className="mb-3 text-3xl font-extrabold text-content-primary">Actions and agreements</h2>
          <div className="divide-y divide-black/5">
            {actions.map((i) => <Item key={i.title} {...i} />)}
          </div>

          <div className="mt-10 text-center">
            <p className="text-content-secondary">Tell us what you think about Wise.</p>
            <a href="#" className="font-semibold text-content-primary underline underline-offset-4">Give us feedback</a>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
