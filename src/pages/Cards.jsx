import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useViewer } from '../context/ViewAsContext.jsx'
import { buildAccount } from '../lib/account.js'
import AppLayout from '../components/AppLayout.jsx'
import WiseCard from '../components/WiseCard.jsx'

export default function Cards() {
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
        <h1 className="mb-8 text-4xl font-extrabold text-content-primary">Cards</h1>
        <button onClick={() => navigate('/cards/detail')} className="block w-full max-w-[360px] text-left transition-transform hover:-translate-y-0.5">
          <WiseCard />
          <p className="mt-4 font-bold text-content-primary">Physical card</p>
          <p className="text-content-secondary">•••• {last4}</p>
        </button>
      </div>
    </AppLayout>
  )
}
