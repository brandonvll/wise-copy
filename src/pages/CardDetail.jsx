import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useViewer } from '../context/ViewAsContext.jsx'
import { buildAccount, last4Of, formatCardNumber } from '../lib/account.js'
import AppLayout from '../components/AppLayout.jsx'
import WiseCard from '../components/WiseCard.jsx'
import OtpInput from '../components/OtpInput.jsx'
import Icon from '../components/Icon.jsx'

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
  const [acct, setAcct] = useState(buildAccount(null, ''))

  // flujo "Card details"
  const [modal, setModal] = useState(null) // 'sending' | 'code' | 'reveal' | 'error' | 'noemail'
  const [code, setCode] = useState('')
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!ready || !id) return
    client.from('accounts').select('*').eq('user_id', id).order('created_at').limit(1).maybeSingle()
      .then(({ data }) => setAcct(buildAccount(data, id)))
  }, [id, ready, client])

  const last4 = last4Of(acct)

  const startCardDetails = async () => {
    if (!acct.contact_email) { setModal('noemail'); return }
    setError(''); setModal('sending')
    try {
      const r = await fetch('/api/card-code', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', email: acct.contact_email }),
      })
      const data = await r.json().catch(() => ({}))
      if (!r.ok || !data.token) {
        setError(data.error === 'no-resend-key' ? 'Falta configurar Resend (RESEND_API_KEY) en Vercel.' : 'No se pudo enviar el código.')
        setModal('error'); return
      }
      setToken(data.token); setCode(''); setModal('code')
    } catch {
      setError('No se pudo conectar con el servidor de correo.'); setModal('error')
    }
  }

  const verifyCode = async () => {
    setBusy(true); setError('')
    try {
      const r = await fetch('/api/card-code', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', code, token }),
      })
      const data = await r.json().catch(() => ({}))
      setBusy(false)
      if (data.ok) setModal('reveal')
      else setError('Código incorrecto o vencido.')
    } catch {
      setBusy(false); setError('No se pudo verificar el código.')
    }
  }

  const quick = [
    { icon: 'keypad', label: 'Show PIN' },
    { icon: 'card', label: 'Card details', onClick: startCardDetails },
    { icon: 'snowflake', label: 'Freeze card' },
  ]

  const closeModal = () => { setModal(null); setCode(''); setError(''); setToken('') }
  const cardNumberDisplay = acct.card_number ? formatCardNumber(acct.card_number) : `•••• •••• •••• ${last4}`

  return (
    <AppLayout>
      <div className="mx-auto max-w-[860px]">
        <button onClick={() => navigate('/cards')} aria-label="Volver" className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-bg-neutral text-content-primary hover:bg-black/10">
          <Icon name="arrowRight" size={20} className="rotate-180" />
        </button>

        <h1 className="text-4xl font-extrabold text-content-primary">Physical card</h1>
        <p className="mb-8 text-content-secondary">•••• {last4}</p>

        <div className="mb-10 flex flex-col items-start gap-8 sm:flex-row sm:items-center">
          <WiseCard />
          <div className="flex gap-6">
            {quick.map((q) => (
              <button key={q.label} onClick={q.onClick} className="flex w-20 flex-col items-center gap-2 text-center">
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
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/15 text-content-primary"><Icon name={m.icon} size={20} /></span>
              <span className="flex-1 font-bold text-content-primary">{m.label}</span>
              <Icon name="chevronRight" size={20} className="text-content-tertiary" />
            </button>
          ))}
        </div>
      </div>

      {/* Modal del flujo "Card details" */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5" onClick={closeModal}>
          <div className="w-full max-w-md rounded-card-lg bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            {modal === 'noemail' && (
              <>
                <h3 className="mb-2 text-xl font-bold text-content-primary">Sin correo registrado</h3>
                <p className="mb-6 text-content-secondary">Este usuario no tiene un correo para enviarle el código de seguridad. Agrégalo en el panel de administración (campo “Correo del usuario”).</p>
                <button onClick={closeModal} className="btn-primary w-full py-3">Entendido</button>
              </>
            )}
            {modal === 'sending' && <p className="py-8 text-center text-content-secondary">Enviando código a tu correo…</p>}
            {modal === 'error' && (
              <>
                <h3 className="mb-2 text-xl font-bold text-content-primary">No se pudo enviar</h3>
                <p className="mb-6 text-content-secondary">{error}</p>
                <button onClick={closeModal} className="btn-primary w-full py-3">Cerrar</button>
              </>
            )}
            {modal === 'code' && (
              <div className="text-center">
                <h3 className="mb-2 text-xl font-bold text-content-primary">Verifica que eres tú</h3>
                <p className="mb-6 text-content-secondary">Enviamos un código de 6 dígitos a<br /><span className="font-semibold text-content-primary">{acct.contact_email}</span></p>
                <OtpInput value={code} onChange={setCode} />
                {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}
                <button onClick={verifyCode} disabled={busy || code.length !== 6} className="btn-primary mt-6 w-full py-3 disabled:opacity-60">{busy ? 'Verificando…' : 'Ver datos de la tarjeta'}</button>
                <button onClick={closeModal} className="mt-3 font-semibold text-content-secondary">Cancelar</button>
              </div>
            )}
            {modal === 'reveal' && (
              <>
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-content-primary">Datos de la tarjeta</h3>
                  <button onClick={closeModal} aria-label="Cerrar" className="text-content-tertiary hover:text-content-primary"><Icon name="arrowRight" size={20} className="rotate-45" /></button>
                </div>
                <div className="mb-2 rounded-xl bg-bg-neutral px-4 py-3">
                  <p className="text-sm text-content-secondary">Número de tarjeta</p>
                  <p className="text-lg font-bold tracking-wide text-content-primary">{cardNumberDisplay}</p>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 rounded-xl bg-bg-neutral px-4 py-3">
                    <p className="text-sm text-content-secondary">Vence</p>
                    <p className="font-bold text-content-primary">{acct.card_exp}</p>
                  </div>
                  <div className="flex-1 rounded-xl bg-bg-neutral px-4 py-3">
                    <p className="text-sm text-content-secondary">CVV</p>
                    <p className="font-bold text-content-primary">{acct.card_cvv}</p>
                  </div>
                </div>
                <button onClick={closeModal} className="btn-primary mt-6 w-full py-3">Listo</button>
              </>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  )
}
