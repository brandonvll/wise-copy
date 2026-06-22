import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
import Icon from '../components/Icon.jsx'

const features = [
  { icon: 'piggy', title: 'Set money aside', sub: 'For bills, goals, or anything else - with options to grow your money.', bg: '#3f3d1c', fg: '#cfe948' },
  { icon: 'users', title: 'Spend as a group', sub: 'One pot to spend from, shared by everyone you invite.', bg: '#3b2530', fg: '#eaa6c6' },
  { icon: 'plane', title: 'Get a lounge pass', sub: 'Access 1,400 airport lounges for less than on-the-door prices.', bg: '#16241f', fg: '#74d6c2' },
]

function Row({ icon, title, sub, bg, fg }) {
  return (
    <button className="flex w-full items-center gap-4 rounded-2xl py-4 text-left transition-colors hover:bg-bg-neutral">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: bg, color: fg }}>
        <Icon name={icon} size={22} />
      </span>
      <span className="flex-1">
        <span className="block font-bold text-content-primary">{title}</span>
        {sub && <span className="block text-sm text-content-secondary">{sub}</span>}
      </span>
      <Icon name="chevronRight" size={20} className="shrink-0 text-content-tertiary" />
    </button>
  )
}

export default function DoMore() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-black/5">
        <div className="mx-auto flex h-[72px] max-w-[1100px] items-center justify-between px-5">
          <Logo height={24} />
          <div className="flex items-center gap-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-neutral text-content-secondary">
              <Icon name="user" size={22} />
            </span>
            <button onClick={() => navigate('/home')} aria-label="Cerrar" className="text-content-primary hover:text-content-secondary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[640px] px-5 py-10">
        <h1 className="mb-8 text-center text-3xl font-extrabold text-content-primary">Do more with Wise</h1>

        <div className="space-y-1">
          {features.map((f) => <Row key={f.title} {...f} />)}
        </div>

        <p className="mb-1 mt-8 text-content-secondary">Add a currency to:</p>
        <hr className="mb-2 border-black/10" />
        <Row icon="cash" title="Main account" bg="#3f3d1c" fg="#cfe948" />
      </div>
    </div>
  )
}
