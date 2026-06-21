import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import Logo from '../components/Logo.jsx'
import Icon from '../components/Icon.jsx'

const ADMIN_USER = 'admin'
const ADMIN_PASS = 'J2026'
const CURRENCIES = ['USD', 'EUR', 'GBP', 'COP', 'MXN', 'BRL']
const field = 'w-full rounded-xl border-2 border-black/15 px-4 py-3 outline-none transition-colors focus:border-forest'
const today = () => new Date().toISOString().slice(0, 10)

// ---------- Gate de acceso (admin / J2026) ----------
function Gate({ onOk }) {
  const [u, setU] = useState('')
  const [p, setP] = useState('')
  const [err, setErr] = useState('')
  const submit = (e) => {
    e.preventDefault()
    if (u.trim() === ADMIN_USER && p === ADMIN_PASS) {
      sessionStorage.setItem('wiseAdminOk', '1')
      onOk()
    } else {
      setErr('Usuario o contraseña incorrectos.')
    }
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-neutral px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-card-lg bg-white p-8 shadow-xl">
        <div className="mb-6 flex justify-center"><Logo height={26} /></div>
        <h1 className="mb-1 text-center text-2xl font-bold text-content-primary">Panel de administración</h1>
        <p className="mb-6 text-center text-content-secondary">Acceso restringido</p>
        <label className="mb-1.5 block text-sm font-semibold text-content-primary">Usuario</label>
        <input value={u} onChange={(e) => setU(e.target.value)} className={`${field} mb-4`} autoFocus />
        <label className="mb-1.5 block text-sm font-semibold text-content-primary">Contraseña</label>
        <input type="password" value={p} onChange={(e) => setP(e.target.value)} className={field} />
        {err && <p className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{err}</p>}
        <button type="submit" className="btn-primary mt-6 w-full py-3.5">Entrar</button>
        <Link to="/home" className="mt-4 block text-center font-semibold text-content-secondary hover:text-content-primary">Volver al dashboard</Link>
      </form>
    </div>
  )
}

export default function Admin() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [adminOk, setAdminOk] = useState(() => sessionStorage.getItem('wiseAdminOk') === '1')
  const [tab, setTab] = useState('cuenta')
  const [loading, setLoading] = useState(true)
  const [note, setNote] = useState('')

  const [fullName, setFullName] = useState('')
  const [account, setAccount] = useState({ id: null, currency: 'USD', balance: 0 })
  const [txns, setTxns] = useState([])
  const [recipients, setRecipients] = useState([])
  const [newTxn, setNewTxn] = useState({ tipo: 'egreso', name: '', amount: '', currency: 'USD', date: today(), afecta: true })
  const [newRec, setNewRec] = useState({ full_name: '', handle: '', currency: 'USD' })

  const flash = (m) => {
    setNote(m)
    setTimeout(() => setNote(''), 2800)
  }

  const load = async () => {
    const [{ data: p }, { data: a }, { data: t }, { data: r }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
      supabase.from('accounts').select('*').eq('user_id', user.id).order('created_at').limit(1).maybeSingle(),
      supabase.from('transactions').select('*').eq('user_id', user.id).order('date', { ascending: false }),
      supabase.from('recipients').select('*').eq('user_id', user.id).order('full_name'),
    ])
    setFullName(p?.full_name || '')
    if (a) setAccount({ id: a.id, currency: a.currency, balance: a.balance })
    setTxns(t || [])
    setRecipients(r || [])
    setNewTxn((n) => ({ ...n, currency: a?.currency || 'USD' }))
    setLoading(false)
  }

  useEffect(() => {
    if (user && adminOk) load()
  }, [user, adminOk]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!adminOk) return <Gate onOk={() => setAdminOk(true)} />

  // ---------- Acciones ----------
  const saveProfile = async () => {
    const { error } = await supabase.from('profiles').upsert({ id: user.id, full_name: fullName })
    flash(error ? 'Error: ' + error.message : 'Perfil guardado ✓')
  }

  const saveAccount = async () => {
    const payload = { user_id: user.id, currency: account.currency, balance: Number(account.balance) || 0 }
    const { error } = account.id
      ? await supabase.from('accounts').update(payload).eq('id', account.id)
      : await supabase.from('accounts').insert(payload)
    flash(error ? 'Error: ' + error.message : 'Cuenta guardada ✓')
    if (!error) load()
  }

  const addTxn = async (e) => {
    e.preventDefault()
    const monto = Math.abs(Number(newTxn.amount) || 0)
    const signed = newTxn.tipo === 'egreso' ? -monto : monto
    const { error } = await supabase.from('transactions').insert({
      user_id: user.id,
      name: newTxn.name,
      amount: signed,
      currency: newTxn.currency,
      date: newTxn.date,
    })
    if (error) return flash('Error: ' + error.message)
    // Afectar saldo de la cuenta (realizar la transacción)
    if (newTxn.afecta && account.id) {
      const nuevo = (Number(account.balance) || 0) + signed
      await supabase.from('accounts').update({ balance: nuevo }).eq('id', account.id)
    }
    setNewTxn({ tipo: 'egreso', name: '', amount: '', currency: account.currency, date: today(), afecta: true })
    flash('Movimiento registrado ✓')
    load()
  }

  const delTxn = async (id) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    flash(error ? 'Error: ' + error.message : 'Movimiento eliminado ✓')
    load()
  }

  const addRec = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('recipients').insert({
      user_id: user.id,
      full_name: newRec.full_name,
      handle: newRec.handle || null,
      currency: newRec.currency,
    })
    if (error) return flash('Error: ' + error.message)
    setNewRec({ full_name: '', handle: '', currency: 'USD' })
    flash('Destinatario agregado ✓')
    load()
  }

  const delRec = async (id) => {
    const { error } = await supabase.from('recipients').delete().eq('id', id)
    flash(error ? 'Error: ' + error.message : 'Destinatario eliminado ✓')
    load()
  }

  const logout = async () => {
    sessionStorage.removeItem('wiseAdminOk')
    await signOut()
    navigate('/')
  }

  const tabs = [
    { id: 'cuenta', label: 'Cuenta', icon: 'bank' },
    { id: 'movimientos', label: 'Movimientos', icon: 'list' },
    { id: 'destinatarios', label: 'Destinatarios', icon: 'users' },
  ]

  return (
    <div className="min-h-screen bg-bg-neutral">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex h-[72px] max-w-[1000px] items-center justify-between px-5">
          <Link to="/home"><Logo height={24} /></Link>
          <div className="flex items-center gap-4">
            <Link to="/home" className="font-semibold text-content-primary hover:underline">← Dashboard</Link>
            <button onClick={() => { sessionStorage.removeItem('wiseAdminOk'); setAdminOk(false) }} className="font-semibold text-content-secondary hover:text-content-primary">Bloquear</button>
            <button onClick={logout} className="font-semibold text-content-secondary hover:text-content-primary">Cerrar sesión</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1000px] px-5 py-10">
        <h1 className="mb-1 text-3xl font-extrabold text-content-primary">Panel de administración</h1>
        <p className="mb-6 text-content-secondary">Gestiona los datos que se muestran en la app.</p>

        {/* Tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 rounded-pill px-5 py-2.5 font-semibold transition-colors ${
                tab === t.id ? 'bg-bright-green text-forest' : 'border border-black/15 text-content-primary hover:border-content-primary'
              }`}
            >
              <Icon name={t.icon} size={18} /> {t.label}
            </button>
          ))}
        </div>

        {note && <div className="mb-6 rounded-xl bg-bright-green/30 px-4 py-3 font-semibold text-forest">{note}</div>}

        {loading ? (
          <p className="text-content-tertiary">Cargando…</p>
        ) : (
          <>
            {/* ---------- CUENTA ---------- */}
            {tab === 'cuenta' && (
              <div className="space-y-6">
                <section className="rounded-card-lg bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-xl font-bold text-content-primary">Perfil</h2>
                  <label className="mb-1.5 block text-sm font-semibold text-content-primary">Nombre completo</label>
                  <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={field} placeholder="Tu nombre" />
                  <button onClick={saveProfile} className="btn-primary mt-4 px-6 py-2.5">Guardar perfil</button>
                </section>

                <section className="rounded-card-lg bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-xl font-bold text-content-primary">Cuenta principal</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-content-primary">Divisa</label>
                      <select value={account.currency} onChange={(e) => setAccount({ ...account, currency: e.target.value })} className={field}>
                        {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-content-primary">Saldo</label>
                      <input type="number" step="0.01" value={account.balance} onChange={(e) => setAccount({ ...account, balance: e.target.value })} className={field} />
                    </div>
                  </div>
                  <button onClick={saveAccount} className="btn-primary mt-4 px-6 py-2.5">Guardar cuenta</button>
                  <p className="mt-3 text-sm text-content-tertiary">Saldo actual mostrado en la app: <b className="text-content-primary">{Number(account.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} {account.currency}</b></p>
                </section>
              </div>
            )}

            {/* ---------- MOVIMIENTOS ---------- */}
            {tab === 'movimientos' && (
              <section className="rounded-card-lg bg-white p-6 shadow-sm">
                <h2 className="mb-1 text-xl font-bold text-content-primary">Ingresos y egresos</h2>
                <p className="mb-5 text-sm text-content-secondary">Registra movimientos. Marca “Afectar saldo” para que la transacción sume o reste del saldo de la cuenta.</p>

                <form onSubmit={addTxn} className="mb-6 space-y-3">
                  {/* Tipo */}
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setNewTxn({ ...newTxn, tipo: 'ingreso' })} className={`flex-1 rounded-xl py-2.5 font-semibold transition-colors ${newTxn.tipo === 'ingreso' ? 'bg-bright-green text-forest' : 'border border-black/15 text-content-secondary'}`}>↓ Ingreso</button>
                    <button type="button" onClick={() => setNewTxn({ ...newTxn, tipo: 'egreso' })} className={`flex-1 rounded-xl py-2.5 font-semibold transition-colors ${newTxn.tipo === 'egreso' ? 'bg-forest text-bright-green' : 'border border-black/15 text-content-secondary'}`}>↑ Egreso</button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-[1fr_130px_110px_160px]">
                    <input required value={newTxn.name} onChange={(e) => setNewTxn({ ...newTxn, name: e.target.value })} placeholder="Concepto" className={field} />
                    <input required type="number" step="0.01" min="0" value={newTxn.amount} onChange={(e) => setNewTxn({ ...newTxn, amount: e.target.value })} placeholder="Monto" className={field} />
                    <select value={newTxn.currency} onChange={(e) => setNewTxn({ ...newTxn, currency: e.target.value })} className={field}>
                      {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input required type="date" value={newTxn.date} onChange={(e) => setNewTxn({ ...newTxn, date: e.target.value })} className={field} />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 font-medium text-content-primary">
                      <input type="checkbox" checked={newTxn.afecta} onChange={(e) => setNewTxn({ ...newTxn, afecta: e.target.checked })} className="h-5 w-5 accent-forest" />
                      Afectar saldo de la cuenta
                    </label>
                    <button type="submit" className="btn-primary px-6 py-2.5">Registrar</button>
                  </div>
                </form>

                {txns.length === 0 ? (
                  <p className="text-content-tertiary">Sin movimientos todavía.</p>
                ) : (
                  <ul className="divide-y divide-black/5">
                    {txns.map((t) => {
                      const inc = Number(t.amount) >= 0
                      return (
                        <li key={t.id} className="flex items-center gap-3 py-3">
                          <span className={`flex h-8 w-8 items-center justify-center rounded-full ${inc ? 'bg-bright-green/30 text-forest' : 'bg-bg-neutral text-content-secondary'}`}>
                            <Icon name={inc ? 'arrowDown' : 'arrowUp'} size={16} />
                          </span>
                          <span className="flex-1 font-semibold text-content-primary">{t.name}</span>
                          <span className="text-content-secondary">{t.date}</span>
                          <span className={`w-32 text-right font-semibold ${inc ? 'text-forest' : 'text-content-primary'}`}>{inc ? '+' : '−'}{Math.abs(t.amount)} {t.currency}</span>
                          <button onClick={() => delTxn(t.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50" aria-label="Eliminar">
                            <Icon name="arrowRight" size={18} className="rotate-45" />
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </section>
            )}

            {/* ---------- DESTINATARIOS ---------- */}
            {tab === 'destinatarios' && (
              <section className="rounded-card-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-content-primary">Destinatarios</h2>
                <form onSubmit={addRec} className="mb-6 grid gap-3 sm:grid-cols-[1fr_1fr_110px_auto]">
                  <input required value={newRec.full_name} onChange={(e) => setNewRec({ ...newRec, full_name: e.target.value })} placeholder="Nombre completo" className={field} />
                  <input value={newRec.handle} onChange={(e) => setNewRec({ ...newRec, handle: e.target.value })} placeholder="@usuario (opcional)" className={field} />
                  <select value={newRec.currency} onChange={(e) => setNewRec({ ...newRec, currency: e.target.value })} className={field}>
                    {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <button type="submit" className="btn-primary px-5">Agregar</button>
                </form>
                {recipients.length === 0 ? (
                  <p className="text-content-tertiary">Sin destinatarios todavía.</p>
                ) : (
                  <ul className="divide-y divide-black/5">
                    {recipients.map((r) => (
                      <li key={r.id} className="flex items-center gap-3 py-3">
                        <span className="flex-1 font-semibold text-content-primary">{r.full_name}</span>
                        <span className="text-content-secondary">{r.handle}</span>
                        <span className="w-12 text-right text-content-secondary">{r.currency}</span>
                        <button onClick={() => delRec(r.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50" aria-label="Eliminar">
                          <Icon name="arrowRight" size={18} className="rotate-45" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}
