import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout.jsx'
import Icon from '../components/Icon.jsx'

const features = [
  { icon: 'requestMoney', title: 'An easy way to ask for your money', text: "No matter whether they're on Wise or not." },
  { icon: 'list', title: 'Set the amount and currency', text: 'Or let them decide how much to pay.' },
  { icon: 'zap', title: 'Get your money fast', text: 'Once it arrives you can keep it, convert it, or send it on.' },
]

export default function PaymentRequests() {
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
          {/* Ilustración de billetes */}
          <div className="relative mx-auto mb-8 h-24 w-36">
            <div className="absolute inset-x-3 top-3 h-16 -rotate-[7deg] rounded-lg bg-[#7ec850]" />
            <div className="absolute inset-x-1 top-1 h-16 rotate-[4deg] rounded-lg bg-gradient-to-br from-[#9FE870] to-[#5fae3a] shadow" />
            <span className="absolute bottom-0 right-1 h-8 w-8 rounded-full bg-gradient-to-br from-[#ffd34d] to-[#dca21c] shadow ring-2 ring-white" />
            <span className="absolute bottom-3 right-7 h-6 w-6 rounded-full bg-gradient-to-br from-[#ffd34d] to-[#dca21c]" />
          </div>

          <h1 className="mx-auto mb-12 max-w-md font-display text-4xl font-black uppercase leading-[1.05] tracking-tight text-content-primary">
            Request money from anyone
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

          <button className="btn-primary mx-auto w-full max-w-md py-4 text-lg">Request a payment</button>
          <div className="mt-5">
            <a href="#" className="font-semibold text-content-primary underline underline-offset-4">Learn more</a>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
