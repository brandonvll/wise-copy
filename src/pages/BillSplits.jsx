import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout.jsx'
import Icon from '../components/Icon.jsx'

const features = [
  { icon: 'doc', title: "Your friends don't need to be on Wise", text: "It's easy for them to pay you back - whether they're on Wise or not." },
  { icon: 'smile', title: 'Simple, fair and straightforward', text: 'Split evenly or set exact amounts - so everyone pays what they owe.' },
  { icon: 'check', title: "See who's paid and who hasn't", text: 'Keep track of who owes what - so you know how fast everyone pays.' },
]

export default function BillSplits() {
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
          {/* Ilustración de billetera */}
          <div className="relative mx-auto mb-8 h-28 w-36">
            <div className="absolute left-8 top-0 h-12 w-16 -rotate-[8deg] rounded-md bg-gradient-to-br from-[#9FE870] to-[#5fae3a] shadow" />
            <span className="absolute right-7 top-0 h-6 w-6 rounded-full bg-gradient-to-br from-[#ffd34d] to-[#dca21c] shadow" />
            <div className="absolute inset-x-0 bottom-0 h-16 rounded-xl bg-gradient-to-br from-[#ff8a3c] via-[#ff5e62] to-[#e0467c] shadow-lg" />
            <div className="absolute bottom-4 right-5 h-5 w-8 rounded bg-white/30" />
          </div>

          <h1 className="mx-auto mb-12 max-w-md font-display text-4xl font-black uppercase leading-[1.05] tracking-tight text-content-primary">
            Settle up fast with your friends
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

          <button className="btn-primary mx-auto w-full max-w-md py-4 text-lg">Get started</button>
        </div>
      </div>
    </AppLayout>
  )
}
