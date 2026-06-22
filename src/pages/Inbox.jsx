import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout.jsx'
import Icon from '../components/Icon.jsx'

const notifications = [
  {
    title: 'Got a sec?',
    date: '26/05/2026',
    body: "We'd love to know how you heard about us. Tap to take this quick survey and help us better share our mission with the world.",
  },
]

export default function Inbox() {
  const navigate = useNavigate()
  return (
    <AppLayout>
      <div className="mx-auto max-w-[860px]">
        <button
          onClick={() => navigate('/your-account')}
          aria-label="Volver"
          className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-bg-neutral text-content-primary hover:bg-black/10"
        >
          <Icon name="arrowRight" size={20} className="rotate-180" />
        </button>

        <h1 className="mb-8 text-4xl font-extrabold text-content-primary">Inbox</h1>

        <p className="mb-1 text-content-secondary">Notifications</p>
        <hr className="mb-2 border-black/10" />

        {notifications.length === 0 ? (
          <p className="rounded-card bg-bg-neutral py-16 text-center text-content-tertiary">No tienes notificaciones.</p>
        ) : (
          <ul className="divide-y divide-black/5">
            {notifications.map((n, i) => (
              <li key={i} className="py-5">
                <div className="mb-1 flex items-start justify-between gap-4">
                  <h3 className="text-lg font-bold text-content-primary">{n.title}</h3>
                  <span className="shrink-0 text-sm text-content-tertiary">{n.date}</span>
                </div>
                <p className="text-content-secondary">{n.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppLayout>
  )
}
