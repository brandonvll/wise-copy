import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useViewer } from '../context/ViewAsContext.jsx'
import { buildAccount } from '../lib/account.js'
import AppLayout from '../components/AppLayout.jsx'
import WiseCard from '../components/WiseCard.jsx'
import Icon from '../components/Icon.jsx'

const quick = [
  { icon: 'keypad', label: 'Show PIN' },
  { icon: 'card', label: 'Card details' },
  { icon: 'snowflake', label: 'Freeze card' },
]
const manage = [
  { icon: 'list', label: 'View recent card transactions' },
  { icon: 'gauge', label: 'Set limits for this card' },
  { icon: 'settings', label: 'Card controls' },
  { icon: 'lock', label: 'Unblock PIN' },
  { icon: 'pencil', label: 'Edit card' },
  { icon: 'card', label: 'Replace card' },
]

export default function CardDetail() {
  const navigate = useNavigate()
  const { id, client, ready } = useViewer()
  const [last4, setLast4] = useState('1043')

  useEffect(() => {
    if (!ready || !id) return
    client.from('accounts').select('card_last4').eq('user_id', id).order('created_at').limit(1).maybeSingle()
      .then(({ data }) => setLast4(buildAccount(data, id).card_last4))
  }, [id, ready, client])

  return (
    <AppLayout>
      <div className="mx-auto max-w-[860px]">
        <button
          onClick={() => navigate('/cards')}
          aria-label="Volver"
          className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-bg-neutral text-content-primary hover:bg-black/10"
        >
          <Icon name="arrowRight" size={20} className="rotate-180" />
        </button>

        <h1 className="text-4xl font-extrabold text-content-primary">Physical card</h1>
        <p className="mb-8 text-content-secondary">•••• {last4}</p>

        <div className="mb-10 flex flex-col items-start gap-8 sm:flex-row sm:items-center">
          <WiseCard />
          <div className="flex gap-6">
            {quick.map((q) => (
              <button key={q.label} className="flex w-20 flex-col items-center gap-2 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-bright-green text-forest"><Icon name={q.icon} size={24} /></span>
                <span className="text-sm font-medium text-content-primary">{q.label}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="mb-1 text-content-secondary">Manage card</p>
        <hr className="mb-2 border-black/10" />
        <div className="divide-y divide-black/5">
          {manage.map((m) => (
            <button key={m.label} className="flex w-full items-center gap-4 py-4 text-left">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/15 text-content-primary">
                <Icon name={m.icon} size={20} />
              </span>
              <span className="flex-1 font-bold text-content-primary">{m.label}</span>
              <Icon name="chevronRight" size={20} className="text-content-tertiary" />
            </button>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
