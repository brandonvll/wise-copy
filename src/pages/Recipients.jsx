import { useEffect, useState } from 'react'
import { useViewer } from '../context/ViewAsContext.jsx'
import AppLayout from '../components/AppLayout.jsx'
import Logo from '../components/Logo.jsx'
import Icon from '../components/Icon.jsx'

const initials = (name) => {
  const p = (name || '').trim().split(/\s+/)
  return ((p[0]?.[0] || '') + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase()
}

export default function Recipients() {
  const { id, client, ready } = useViewer()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [tip, setTip] = useState(true)

  useEffect(() => {
    if (!ready || !id) return
    client
      .from('recipients')
      .select('*')
      .eq('user_id', id)
      .order('full_name')
      .then(({ data }) => {
        setList(data || [])
        setLoading(false)
      })
  }, [id, ready, client])

  return (
    <AppLayout>
      <div className="mx-auto max-w-[820px]">
        <h1 className="mb-5 text-4xl font-extrabold text-content-primary">Recipients</h1>

        <div className="relative mb-10 flex gap-3">
          <button className="flex items-center gap-2 rounded-pill bg-bright-green px-5 py-2.5 font-semibold text-forest hover:bg-bright-green-hover">
            <span className="text-lg leading-none">+</span> Add
          </button>
          <button className="flex items-center gap-2 rounded-pill bg-bright-green/30 px-5 py-2.5 font-semibold text-forest hover:bg-bright-green/50">
            <Icon name="search" size={18} /> Upload
          </button>

          {tip && (
            <div className="absolute left-24 top-14 z-10 w-72 rounded-2xl bg-white p-5 shadow-xl ring-1 ring-black/5">
              <p className="mb-2 font-bold text-content-primary">¿Tienes una captura con sus datos?</p>
              <p className="mb-4 text-sm text-content-secondary">Sube una captura o factura y agregamos sus datos por ti.</p>
              <button onClick={() => setTip(false)} className="font-semibold text-content-primary underline underline-offset-4">Entendido</button>
            </div>
          )}
        </div>

        <p className="mb-1 text-content-secondary">Todas las cuentas</p>
        <hr className="mb-2 border-black/10" />

        {loading ? (
          <p className="py-10 text-content-tertiary">Cargando…</p>
        ) : list.length === 0 ? (
          <p className="rounded-card bg-bg-neutral py-16 text-center text-content-tertiary">
            Aún no hay destinatarios.
          </p>
        ) : (
          <ul className="divide-y divide-black/5">
            {list.map((r) => (
              <li key={r.id}>
                <button className="flex w-full items-center gap-4 py-4 text-left">
                  <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-bg-neutral font-bold text-content-secondary">
                    {initials(r.full_name)}
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-bright-green ring-2 ring-white">
                      <Logo height={8} />
                    </span>
                  </span>
                  <span className="flex-1">
                    <span className="block font-bold text-content-primary">{r.full_name}</span>
                    {r.handle && <span className="block text-sm text-content-secondary">{r.handle}</span>}
                  </span>
                  <Icon name="chevronRight" size={20} className="text-content-tertiary" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppLayout>
  )
}
