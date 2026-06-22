import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useViewer } from '../context/ViewAsContext.jsx'
import { buildAccount } from '../lib/account.js'
import AppLayout from '../components/AppLayout.jsx'
import LogoMark from '../components/LogoMark.jsx'
import Icon from '../components/Icon.jsx'

function Row({ icon, title, subtitle, green, onClick }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-4 py-5 text-left">
      {green ? (
        <span className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-bright-green to-[#7ed957]">
          <LogoMark height={14} />
        </span>
      ) : (
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-black/15 text-content-primary">
          <Icon name={icon} size={22} />
        </span>
      )}
      <span className="flex-1">
        <span className="block font-bold text-content-primary">{title}</span>
        <span className="block text-sm text-content-secondary">{subtitle}</span>
      </span>
      <Icon name="chevronRight" size={20} className="text-content-tertiary" />
    </button>
  )
}

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
      <div className="mx-auto max-w-[820px]">
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-4xl font-extrabold text-content-primary">Cards</h1>
          <button className="flex items-center gap-2 rounded-pill border border-black/15 px-5 py-2.5 font-semibold text-content-primary hover:border-content-primary">
            <Icon name="luggage" size={20} /> Travel hub
          </button>
        </div>

        <p className="mb-1 text-content-secondary">Your cards</p>
        <hr className="mb-2 border-black/10" />

        <div className="divide-y divide-black/5">
          <Row icon="card" title="Order a new card" subtitle="Get another card for this account." />
          <Row icon="gauge" title="Your spending limits" subtitle="See how much you can spend and withdraw overall, and on each card." />
          <Row green title={`Physical card •••• ${last4}`} subtitle="Main account • Ready to use" onClick={() => navigate('/cards/detail')} />
        </div>
      </div>
    </AppLayout>
  )
}
