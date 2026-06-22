import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { adminClient, ensureAdminSession, createSignupClient } from '../lib/supabase.js'
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
  const [busy, setBusy] = useState(false)
  const submit = async (e) => {
    e.preventDefault()
    if (u.trim() !== ADMIN_USER || p !== ADMIN_PASS) return setErr('Usuario o contraseña incorrectos.')
    setBusy(true)
    const r = await ensureAdminSession()
    setBusy(false)
    if (!r.ok) return setErr('No se pudo iniciar la sesión de administrador: ' + (r.error || '') + ' (revisa que "Confirm email" esté desactivado en Supabase).')
    sessionStorage.setItem('wiseAdminOk', '1')
    onOk()
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
        <button type="submit" disabled={busy} className="btn-primary mt-6 w-full py-3.5 disabled:opacity-60">{busy ? 'Entrando…' : 'Entrar'}</button>
        <Link to="/" className="mt-4 block text-center font-semibold text-content-secondary hover:text-content-primary">Volver al inicio</Link>
      </form>
    </div>
  )
}

export default function Admin() {
  const navigate = useNavigate()
  const [adminOk, setAdminOk] = useState(false)
  const [booting, setBooting] = useState(true)
  const [adminUserId, setAdminUserId] = useState(null)
  const [note, setNote] = useState('')

  // lista de usuarios
  const [users, setUsers] = useState([])
  const [newUser, setNewUser] = useState({ email: '', password: '', full_name: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [creating, setCreating] = useState(false)
  const [lastCreated, setLastCreated] = useState(null)

  // usuario seleccionado para administrar
  const [selected, setSelected] = useState(null) // { user_id, email, full_name }
  const [tab, setTab] = useState('cuenta')
  const [loadingUser, setLoadingUser] = useState(false)
  const [fullName, setFullName] = useState('')
  const [account, setAccount] = useState({ id: null, currency: 'USD', balance: 0 })
  const [txns, setTxns] = useState([])
  const [recipients, setRecipients] = useState([])
  const [newTxn, setNewTxn] = useState({ tipo: 'egreso', name: '', amount: '', currency: 'USD', date: today(), afecta: true })
  const [newRec, setNewRec] = useState({ full_name: '', handle: '', currency: 'USD' })

  const flash = (m) => { setNote(m); setTimeout(() => setNote(''), 2800) }

  const initAdmin = async () => {
    const r = await ensureAdminSession()
    if (!r.ok) { setBooting(false); return }
    const { data } = await adminClient.auth.getUser()
    setAdminUserId(data?.user?.id || null)
    setAdminOk(true)
    await loadUsers()
    setBooting(false)
  }

  useEffect(() => {
    if (sessionStorage.getItem('wiseAdminOk') === '1') initAdmin()
    else setBooting(false)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadUsers = async () => {
    const { data } = await adminClient.from('managed_users').select('*').order('created_at', { ascending: false })
    setUsers(data || [])
  }

  // ---------- Crear usuario ----------
  const createUser = async (e) => {
    e.preventDefault()
    setCreating(true)
    setLastCreated(null)
    const tmp = createSignupClient()
    const { data, error } = await tmp.auth.signUp({
      email: newUser.email.trim(),
      password: newUser.password,
      options: { data: { full_name: newUser.full_name || null, password_set: false } },
    })
    if (error) { setCreating(false); return flash('Error: ' + error.message) }
    const uid = data?.user?.id
    const { error: insErr } = await adminClient.from('managed_users').insert({
      created_by: adminUserId,
      email: newUser.email.trim(),
      full_name: newUser.full_name || null,
      user_id: uid,
    })
    if (insErr) flash('Usuario creado, pero no se registró: ' + insErr.message)
    else flash('Usuario creado ✓')
    setLastCreated({ email: newUser.email.trim(), password: newUser.password, full_name: newUser.full_name })
    setNewUser({ email: '', password: '', full_name: '' })
    setCreating(false)
    loadUsers()
  }

  const delUser = async (id) => {
    const { error } = await adminClient.from('managed_users').delete().eq('id', id)
    flash(error ? 'Error: ' + error.message : 'Registro eliminado ✓')
    loadUsers()
  }

  // ---------- Administrar usuario seleccionado ----------
  const openUser = async (u) => {
    if (!u.user_id) return flash('Este registro no tiene usuario vinculado.')
    setSelected({ user_id: u.user_id, email: u.email, full_name: u.full_name })
    setTab('cuenta')
    setLoadingUser(true)
    const [{ data: p }, { data: a }, { data: t }, { data: r }] = await Promise.all([
      adminClient.from('profiles').select('*').eq('id', u.user_id).maybeSingle(),
      adminClient.from('accounts').select('*').eq('user_id', u.user_id).order('created_at').limit(1).maybeSingle(),
      adminClient.from('transactions').select('*').eq('user_id', u.user_id).order('date', { ascending: false }),
      adminClient.from('recipients').select('*').eq('user_id', u.user_id).order('full_name'),
    ])
    setFullName(p?.full_name || u.full_name || '')
    setAccount(a ? { id: a.id, currency: a.currency, balance: a.balance } : { id: null, currency: 'USD', balance: 0 })
    setTxns(t || [])
    setRecipients(r || [])
    setNewTxn((n) => ({ ...n, currency: a?.currency || 'USD' }))
    setLoadingUser(false)
  }

  const reload = () => selected && openUser({ user_id: selected.user_id, email: selected.email, full_name: selected.full_name })

  const saveProfile = async () => {
    const { error } = await adminClient.from('profiles').upsert({ id: selected.user_id, full_name: fullName })
    flash(error ? 'Error: ' + error.message : 'Perfil guardado ✓')
  }

  const saveAccount = async () => {
    const payload = { user_id: selected.user_id, currency: account.currency, balance: Number(account.balance) || 0 }
    const { error } = account.id
      ? await adminClient.from('accounts').update(payload).eq('id', account.id)
      : await adminClient.from('accounts').insert(payload)
    flash(error ? 'Error: ' + error.message : 'Cuenta guardada ✓')
    if (!error) reload()
  }

  const addTxn = async (e) => {
    e.preventDefault()
    const monto = Math.abs(Number(newTxn.amount) || 0)
    const signed = newTxn.tipo === 'egreso' ? -monto : monto
    const { error } = await adminClient.from('transactions').insert({
      user_id: selected.user_id, name: newTxn.name, amount: signed, currency: newTxn.currency, date: newTxn.date,
    })
    if (error) return flash('Error: ' + error.message)
    if (newTxn.afecta && account.id) {
      await adminClient.from('accounts').update({ balance: (Number(account.balance) || 0) + signed }).eq('id', account.id)
    }
    setNewTxn({ tipo: 'egreso', name: '', amount: '', currency: account.currency, date: today(), afecta: true })
    flash('Movimiento registrado ✓')
    reload()
  }

  const delTxn = async (id) => {
    const { error } = await adminClient.from('transactions').delete().eq('id', id)
    flash(error ? 'Error: ' + error.message : 'Movimiento eliminado ✓')
    reload()
  }

  const addRec = async (e) => {
    e.preventDefault()
    const { error } = await adminClient.from('recipients').insert({
      user_id: selected.user_id, full_name: newRec.full_name, handle: newRec.handle || null, currency: newRec.currency,
    })
    if (error) return flash('Error: ' + error.message)
    setNewRec({ full_name: '', handle: '', currency: 'USD' })
    flash('Destinatario agregado ✓')
    reload()
  }

  const delRec = async (id) => {
    const { error } = await adminClient.from('recipients').delete().eq('id', id)
    flash(error ? 'Error: ' + error.message : 'Destinatario eliminado ✓')
    reload()
  }

  const lock = () => { sessionStorage.removeItem('wiseAdminOk'); setAdminOk(false); setSelected(null) }
  const logout = async () => { sessionStorage.removeItem('wiseAdminOk'); await adminClient.auth.signOut(); navigate('/') }

  if (booting) return <div className="flex min-h-screen items-center justify-center bg-bg-neutral text-content-tertiary">Cargando…</div>
  if (!adminOk) return <Gate onOk={initAdmin} />

  const tabs = [
    { id: 'cuenta', label: 'Cuenta', icon: 'bank' },
    { id: 'movimientos', label: 'Movimientos', icon: 'list' },
    { id: 'destinatarios', label: 'Destinatarios', icon: 'users' },
  ]

  return (
    <div className="min-h-screen bg-bg-neutral">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex h-[72px] max-w-[1000px] items-center justify-between px-5">
          <Link to="/"><Logo height={24} /></Link>
          <div className="flex items-center gap-4">
            <button onClick={lock} className="font-semibold text-content-secondary hover:text-content-primary">Bloquear</button>
            <button onClick={logout} className="font-semibold text-content-secondary hover:text-content-primary">Salir</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1000px] px-5 py-10">
        {note && <div className="mb-6 rounded-xl bg-bright-green/30 px-4 py-3 font-semibold text-forest">{note}</div>}

        {/* ============ LISTA DE USUARIOS ============ */}
        {!selected && (
          <>
            <h1 className="mb-1 text-3xl font-extrabold text-content-primary">Panel de administración</h1>
            <p className="mb-8 text-content-secondary">Crea usuarios y administra su cuenta, saldo y movimientos.</p>

            <section className="mb-6 rounded-card-lg bg-white p-6 shadow-sm">
              <h2 className="mb-1 text-xl font-bold text-content-primary">Crear usuario</h2>
              <p className="mb-3 text-sm text-content-secondary">
                Define correo y contraseña. En su primer ingreso, el usuario pondrá su correo, recibirá un código y luego escribirá esta contraseña. Empieza con su cuenta en 0.
              </p>
              <div className="mb-5 rounded-xl bg-bright-green/20 px-4 py-3 text-sm text-forest">
                ⚠️ En Supabase: corre <b>admin_access.sql</b>, desactiva “Confirm email” y pon <b>{'{{ .Token }}'}</b> en la plantilla <b>Magic Link</b>.
              </div>
              <form onSubmit={createUser} className="grid gap-3 sm:grid-cols-2">
                <input value={newUser.full_name} onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })} placeholder="Nombre (opcional)" className={field} />
                <input required type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} placeholder="Correo electrónico" className={field} />
                <div className="relative sm:col-span-2">
                  <input required minLength={6} type={showPwd ? 'text' : 'password'} value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} placeholder="Contraseña para el usuario (mín. 6)" className={`${field} pr-12`} />
                  <button type="button" onClick={() => setShowPwd((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-content-tertiary hover:text-content-primary" aria-label="Mostrar/ocultar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" />{!showPwd && <path d="M3 3l18 18" />}
                    </svg>
                  </button>
                </div>
                <button type="submit" disabled={creating} className="btn-primary px-6 py-2.5 disabled:opacity-60 sm:col-span-2 sm:w-fit">{creating ? 'Creando…' : 'Crear usuario'}</button>
              </form>

              {lastCreated && (
                <div className="mt-5 rounded-xl border border-bright-green bg-bright-green/10 p-4">
                  <p className="mb-2 font-bold text-content-primary">Usuario creado ✓ — comparte estos datos:</p>
                  <p className="text-sm text-content-secondary">Correo: <b className="text-content-primary">{lastCreated.email}</b></p>
                  <p className="text-sm text-content-secondary">Contraseña: <b className="text-content-primary">{lastCreated.password}</b></p>
                  <p className="mt-2 text-sm text-content-tertiary">Primer ingreso: app → “Entra con un código” → su correo → código → esta contraseña.</p>
                </div>
              )}
            </section>

            <section className="rounded-card-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-content-primary">Usuarios</h2>
              {users.length === 0 ? (
                <p className="text-content-tertiary">Aún no has creado usuarios.</p>
              ) : (
                <ul className="divide-y divide-black/5">
                  {users.map((u) => (
                    <li key={u.id} className="flex items-center gap-3 py-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-neutral font-bold text-content-secondary">{(u.full_name || u.email).charAt(0).toUpperCase()}</span>
                      <span className="flex-1">
                        <span className="block font-semibold text-content-primary">{u.full_name || u.email.split('@')[0]}</span>
                        <span className="block text-sm text-content-tertiary">{u.email}</span>
                      </span>
                      <button onClick={() => openUser(u)} className="rounded-pill bg-bright-green px-4 py-2 font-semibold text-forest">Administrar</button>
                      <button onClick={() => delUser(u.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50" aria-label="Eliminar registro">
                        <Icon name="arrowRight" size={18} className="rotate-45" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}

        {/* ============ ADMINISTRAR USUARIO ============ */}
        {selected && (
          <>
            <button onClick={() => setSelected(null)} className="mb-4 flex items-center gap-2 font-semibold text-content-secondary hover:text-content-primary">
              <Icon name="arrowRight" size={18} className="rotate-180" /> Volver a usuarios
            </button>
            <h1 className="mb-1 text-3xl font-extrabold text-content-primary">{selected.full_name || selected.email.split('@')[0]}</h1>
            <p className="mb-8 text-content-secondary">{selected.email}</p>

            <div className="mb-8 flex flex-wrap gap-2">
              {tabs.map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 rounded-pill px-5 py-2.5 font-semibold transition-colors ${tab === t.id ? 'bg-bright-green text-forest' : 'border border-black/15 text-content-primary hover:border-content-primary'}`}>
                  <Icon name={t.icon} size={18} /> {t.label}
                </button>
              ))}
            </div>

            {loadingUser ? (
              <p className="text-content-tertiary">Cargando…</p>
            ) : (
              <>
                {tab === 'cuenta' && (
                  <div className="space-y-6">
                    <section className="rounded-card-lg bg-white p-6 shadow-sm">
                      <h2 className="mb-4 text-xl font-bold text-content-primary">Perfil</h2>
                      <label className="mb-1.5 block text-sm font-semibold text-content-primary">Nombre completo</label>
                      <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={field} placeholder="Nombre" />
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
                    </section>
                  </div>
                )}

                {tab === 'movimientos' && (
                  <section className="rounded-card-lg bg-white p-6 shadow-sm">
                    <h2 className="mb-1 text-xl font-bold text-content-primary">Ingresos y egresos</h2>
                    <p className="mb-5 text-sm text-content-secondary">Marca “Afectar saldo” para que el movimiento sume o reste del saldo.</p>
                    <form onSubmit={addTxn} className="mb-6 space-y-3">
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
          </>
        )}
      </div>
    </div>
  )
}
