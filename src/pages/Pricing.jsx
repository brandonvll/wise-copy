import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout.jsx'
import Icon from '../components/Icon.jsx'

const bars = [
  { h: 100, pct: '0.57%', dark: true },
  { h: 78, pct: '0.47%' },
  { h: 58, pct: '0.42%' },
  { h: 45, pct: '0.41%' },
  { h: 33, pct: '0.4%' },
]

const now = new Date()
const monthName = now.toLocaleString('en-US', { month: 'long' })
const daysLeft = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate()

function Selector({ label, flag, code, name }) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-semibold text-content-primary">{label}</p>
      <div className="flex items-center gap-2 rounded-xl border-2 border-black/15 px-3 py-3">
        <img src={`https://flagcdn.com/w80/${flag}.png`} alt="" className="h-6 w-6 shrink-0 rounded-full object-cover" />
        <span className="font-bold text-content-primary">{code}</span>
        <span className="truncate text-sm text-content-secondary">{name}</span>
        <Icon name="chevronDown" size={18} className="ml-auto shrink-0 text-content-tertiary" />
      </div>
    </div>
  )
}

export default function Pricing() {
  const navigate = useNavigate()
  return (
    <AppLayout>
      <div className="mx-auto max-w-[760px]">
        <button
          onClick={() => navigate('/your-account')}
          aria-label="Volver"
          className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-bg-neutral text-content-primary hover:bg-black/10"
        >
          <Icon name="arrowRight" size={20} className="rotate-180" />
        </button>

        <h1 className="mb-8 text-4xl font-extrabold text-content-primary">Pricing and discounts</h1>

        {/* Your pricing */}
        <section className="mb-6 rounded-card-lg border border-black/10 p-6">
          <h2 className="mb-1 text-xl font-bold text-content-primary">Your pricing</h2>
          <p className="mb-5 text-content-secondary">
            Move <b className="text-content-primary">25,000 USD</b> in FX volume in {monthName} to get a <b className="text-content-primary">0.1%</b> discount.
          </p>

          <div className="relative mb-2 h-10 rounded-full bg-[#eaf4dd]">
            <div className="absolute left-[2%] top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-forest ring-4 ring-white" />
          </div>
          <div className="mb-6 flex justify-between text-sm">
            <span><span className="block text-content-primary">0</span><span className="block text-content-tertiary">0%</span></span>
            <span className="text-right"><span className="block text-content-primary">25k</span><span className="block text-content-tertiary">-0.1%</span></span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <p className="text-lg font-bold text-content-primary">0 USD</p>
              <p className="text-sm text-content-secondary">moved this month</p>
            </div>
            <div className="text-right">
              <p className="flex items-center justify-end gap-1 text-lg font-bold text-content-primary">{daysLeft} days <Icon name="help" size={16} className="text-content-tertiary" /></p>
              <p className="text-sm text-content-secondary">to earn a discount</p>
            </div>
          </div>
        </section>

        {/* How volume discounts work */}
        <section className="rounded-card-lg border border-black/10 p-6">
          <h2 className="mb-1 text-xl font-bold text-content-primary">How volume discounts work</h2>
          <p className="mb-6 text-content-secondary">
            The more you move, the bigger your discount. Change currencies to see how a volume discount reduces your fees on different routes.
          </p>

          <p className="mb-4 font-semibold text-content-primary">0 — 25k USD</p>

          <div className="relative mb-8 h-72">
            {bars.map((b, i) => (
              <div key={`g${i}`} className="absolute inset-x-0 flex items-center" style={{ bottom: `${b.h}%` }}>
                <div className="flex-1 border-t border-dashed border-black/15" />
                <span className="w-12 pl-2 text-right text-sm text-content-secondary">{b.pct}</span>
              </div>
            ))}
            <div className="absolute bottom-0 left-0 right-14 top-0 flex items-end gap-2 sm:gap-4">
              {bars.map((b, i) => (
                <div key={`b${i}`} style={{ height: `${b.h}%` }} className={`flex-1 rounded-t-[2.5rem] ${b.dark ? 'bg-forest' : 'bg-black/[0.06]'}`} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
            <Selector label="From" flag="us" code="USD" name="United States dollar" />
            <span className="pb-3 text-content-tertiary">↔</span>
            <Selector label="To" flag="ph" code="PHP" name="Philippine peso" />
          </div>
        </section>

        <div className="mt-10 text-center">
          <p className="text-content-secondary">What do you think about this experience?</p>
          <a href="#" className="font-semibold text-content-primary underline underline-offset-4">Give us feedback</a>
        </div>
      </div>
    </AppLayout>
  )
}
