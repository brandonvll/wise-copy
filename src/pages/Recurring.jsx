import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout.jsx'
import Icon from '../components/Icon.jsx'

const features = [
  { icon: 'list', title: 'Manage your recurring card payments', text: 'See your online subscriptions, membership plans or other recurring charges in one place.' },
  { icon: 'minusCircle', title: 'Manage future charges', text: 'You can stop merchants from charging the card, if unable to cancel with them directly.' },
]

export default function Recurring() {
  const navigate = useNavigate()

  return (
    <AppLayout>
      <div className="mx-auto max-w-[760px]">
        <button
          onClick={() => navigate('/home')}
          aria-label="Volver"
          className="mb-10 flex h-11 w-11 items-center justify-center rounded-full bg-bg-neutral text-content-primary hover:bg-black/10"
        >
          <Icon name="arrowRight" size={20} className="rotate-180" />
        </button>

        <div className="text-center">
          {/* Calendario (ilustración) */}
          <div className="relative mx-auto mb-8 h-28 w-28">
            <div className="absolute left-1/2 top-0 flex -translate-x-1/2 gap-7">
              <span className="h-5 w-2 rounded-full bg-[#b5341f]" />
              <span className="h-5 w-2 rounded-full bg-[#b5341f]" />
            </div>
            <div className="mt-2 flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff9d3c] via-[#ff5e62] to-[#e0467c] font-display text-5xl font-black text-white/90 shadow-lg">
              1
            </div>
          </div>

          <h1 className="mx-auto mb-12 max-w-md font-display text-4xl font-black uppercase leading-[1.05] tracking-tight text-content-primary">
            Track recurring charges
          </h1>

          {/* Features */}
          <div className="mx-auto mb-12 max-w-md space-y-7 text-left">
            {features.map((f) => (
              <div key={f.title} className="flex gap-4">
                <Icon name={f.icon} size={26} className="mt-0.5 shrink-0 text-content-primary" />
                <div>
                  <p className="font-bold text-content-primary">{f.title}</p>
                  <p className="text-content-secondary">{f.text}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="btn-primary mx-auto w-full max-w-md py-4 text-lg">Add a recurring payment</button>
        </div>
      </div>
    </AppLayout>
  )
}
