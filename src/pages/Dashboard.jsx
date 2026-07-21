import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useViewer } from '../context/ViewAsContext.jsx'
import { shortDate } from '../lib/date.js'
import { ACCOUNT_DEFAULTS } from '../lib/account.js'
import AppLayout from '../components/AppLayout.jsx'
import HomeExtras from '../components/HomeExtras.jsx'
import LogoMark from '../components/LogoMark.jsx'
import Icon from '../components/Icon.jsx'

const SYMBOL = { USD: '$', EUR: '€', GBP: '£', COP: '$', MXN: '$', BRL: 'R$' }
const FLAG = { USD: 'us', EUR: 'eu', GBP: 'gb', COP: 'co', MXN: 'mx', BRL: 'br' }
const fmt = (n) => Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const actions = ['Send', 'Add money', 'Request', 'Upload']

export default function Dashboard() {
  const { id, client, ready } = useViewer()
  const navigate = useNavigate()
  const [account, setAccount] = useState(null)
  const [txns, setTxns] = useState([])
  const [loading, setLoading] = useState(true)
  const [showActionModal, setShowActionModal] = useState(false)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [downloadFormat, setDownloadFormat] = useState('pdf')
  const [downloading, setDownloading] = useState(false)
  const modalMsg = account?.modal_message || ACCOUNT_DEFAULTS.modal_message

  useEffect(() => {
    if (!ready || !id) return
    let active = true
    ;(async () => {
      const [{ data: a }, { data: t }] = await Promise.all([
        client.from('accounts').select('*').eq('user_id', id).order('created_at').limit(1).maybeSingle(),
        client.from('transactions').select('*').eq('user_id', id).order('date', { ascending: false }).order('created_at', { ascending: false }).limit(5),
      ])
      if (!active) return
      setAccount(a)
      setTxns(t || [])
      setLoading(false)
    })()
    return () => { active = false }
  }, [id, ready, client])

  const currency = account?.currency || 'USD'
  const balance = account?.balance ?? 0

  const downloadStatement = async () => {
    setDownloading(true)
    try {
      if (downloadFormat === 'pdf') {
        // Generar PDF
        const { jsPDF } = await import('jspdf')
        const doc = new jsPDF()

        // Header
        doc.setFillColor(76, 175, 80)
        doc.rect(0, 0, 210, 30, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(20)
        doc.text('Wise US Inc.', 15, 15)

        // Información de empresa
        doc.setTextColor(0, 0, 0)
        doc.setFontSize(10)
        doc.text('30 W 26th Street, Floor 6', 15, 40)
        doc.text('New York 10010', 15, 46)
        doc.text('United States', 15, 52)

        // Título
        doc.setFontSize(16)
        doc.text('Account Statement', 15, 70)

        // Información de la cuenta
        doc.setFontSize(10)
        const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        doc.text(`Generated on: ${today}`, 15, 85)

        doc.text('Account Holder', 15, 100)
        doc.text(account?.full_name || 'User', 15, 107)

        doc.text('Currency', 120, 100)
        doc.text(currency, 120, 107)

        doc.text('Current Balance', 15, 120)
        doc.setFontSize(14)
        doc.text(`${SYMBOL[currency]}${fmt(balance)}`, 15, 130)

        // Footer
        doc.setFontSize(8)
        doc.setTextColor(100, 100, 100)
        doc.text('This is not an official statement.', 15, 270)
        doc.text('Wise Payments Limited is registered in England and Wales with Companies House', 15, 275)

        doc.save(`statement-${currency}-${new Date().toISOString().split('T')[0]}.pdf`)
      } else {
        // Generar CSV
        const headers = ['Date', 'Description', 'Amount', 'Currency', 'Balance']
        const rows = txns.map(t => [
          new Date(t.date).toLocaleDateString('en-US'),
          t.name,
          t.amount,
          t.currency || currency,
          balance
        ])

        const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `statement-${currency}-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
      }
      setShowDownloadModal(false)
    } catch (error) {
      console.error('Error downloading statement:', error)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <AppLayout>
      {/* Acciones */}
      <div className="mb-8 flex flex-wrap gap-3">
        {actions.map((a) => (
          <button key={a} onClick={a === 'Add money' ? () => navigate('/flows/balances/add') : () => setShowActionModal(true)} className="rounded-pill bg-bright-green/30 px-5 py-2.5 font-semibold text-forest hover:bg-bright-green/50">
            {a}
          </button>
        ))}
      </div>

      {/* Tarjetas */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="overflow-hidden rounded-card-lg bg-bg-neutral">
          <div className="relative h-20 bg-bright-green px-6 pt-5">
            <span className="flex items-center gap-1 font-semibold text-forest">Tu tarjeta <Icon name="chevronRight" size={16} /></span>
            <LogoMark height={18} className="absolute right-6 top-5" />
          </div>
          <div className="px-6 pb-6 pt-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-2xl font-bold text-content-primary">Cuenta principal</span>
              <Icon name="chevronRight" size={20} className="text-content-tertiary" />
            </div>
            <button
              onClick={() => setShowDownloadModal(true)}
              className="mb-6 flex w-full items-center gap-3 rounded-lg p-2 hover:bg-black/5 transition-colors"
              title="Click to download statement"
            >
              <span className="h-7 w-7 overflow-hidden rounded-full">
                <img src={`https://flagcdn.com/w80/${FLAG[currency] || 'us'}.png`} alt="" className="h-full w-full object-cover" />
              </span>
              <span className="text-lg font-bold text-content-primary cursor-pointer">{SYMBOL[currency] || ''}{fmt(balance)}</span>
              <Icon name="chevronRight" size={16} className="text-content-tertiary" />
            </button>
            <Link to="/payments/account-details" className="flex items-center gap-2 rounded-pill bg-white px-4 py-2.5 font-semibold text-content-primary shadow-sm">
              <Icon name="bank" size={18} /> Datos de la cuenta
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center rounded-card-lg bg-bg-neutral p-8 text-center">
          <h3 className="mb-2 text-2xl font-bold text-content-primary">Haz más con tu dinero</h3>
          <p className="mb-6 text-content-secondary">Gestiónalo, compártelo con otros y genera retorno.</p>
          <Link to="/flows/account/open" className="flex h-14 w-14 items-center justify-center rounded-full bg-bright-green text-forest hover:bg-bright-green-hover">
            <span className="text-3xl font-bold leading-none">+</span>
          </Link>
        </div>
      </div>

      {/* Transacciones */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-content-primary">Transacciones</h2>
          <Link to="/transactions" className="font-semibold text-content-primary underline underline-offset-4">Ver todas</Link>
        </div>
        {loading ? (
          <p className="py-8 text-content-tertiary">Cargando…</p>
        ) : txns.length === 0 ? (
          <p className="rounded-card bg-bg-neutral py-12 text-center text-content-tertiary">
            Aún no hay transacciones.
          </p>
        ) : (
          <ul className="divide-y divide-black/5">
            {txns.map((t) => (
              <li key={t.id} className="flex items-center gap-4 py-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-bg-neutral font-bold text-content-secondary">
                  {t.name?.charAt(0).toUpperCase()}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-content-primary">{t.name}</p>
                  <p className="text-sm text-content-tertiary">{shortDate(t.date)}</p>
                </div>
                <span className={`font-semibold ${Number(t.amount) >= 0 ? 'text-forest' : 'text-content-primary'}`}>
                  {Number(t.amount) >= 0 ? '+' : ''}{fmt(t.amount)} {t.currency || currency}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <HomeExtras />

      {showActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5" onClick={() => setShowActionModal(false)}>
          <div className="w-full max-w-md rounded-card-lg bg-white p-6 text-center shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <Icon name="warning" size={24} />
            </div>
            <p className="mb-6 whitespace-pre-line text-content-primary">{modalMsg}</p>
            <button onClick={() => setShowActionModal(false)} className="btn-primary w-full py-3">Entendido</button>
          </div>
        </div>
      )}

      {showDownloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5" onClick={() => setShowDownloadModal(false)}>
          <div className="w-full max-w-md rounded-card-lg bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-content-primary">Download your statement</h3>
              <button onClick={() => setShowDownloadModal(false)} className="text-content-tertiary hover:text-content-primary">
                <Icon name="x" size={24} />
              </button>
            </div>

            <p className="mb-6 text-sm text-content-secondary">
              This document will include your current balance and transaction history for the selected period.
            </p>

            <div className="mb-6 space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-black/10 p-4 hover:bg-black/2" onClick={() => setDownloadFormat('pdf')}>
                <input
                  type="radio"
                  name="format"
                  value="pdf"
                  checked={downloadFormat === 'pdf'}
                  onChange={(e) => setDownloadFormat(e.target.value)}
                  className="h-4 w-4 cursor-pointer accent-forest"
                />
                <div>
                  <p className="font-semibold text-content-primary">PDF</p>
                  <p className="text-xs text-content-tertiary">Professional document format</p>
                </div>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-black/10 p-4 hover:bg-black/2" onClick={() => setDownloadFormat('csv')}>
                <input
                  type="radio"
                  name="format"
                  value="csv"
                  checked={downloadFormat === 'csv'}
                  onChange={(e) => setDownloadFormat(e.target.value)}
                  className="h-4 w-4 cursor-pointer accent-forest"
                />
                <div>
                  <p className="font-semibold text-content-primary">CSV</p>
                  <p className="text-xs text-content-tertiary">Spreadsheet-compatible format</p>
                </div>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDownloadModal(false)}
                className="flex-1 rounded-lg border-2 border-black/15 px-4 py-3 font-semibold text-content-primary hover:bg-black/2"
              >
                Cancel
              </button>
              <button
                onClick={downloadStatement}
                disabled={downloading}
                className="flex-1 rounded-lg bg-forest px-4 py-3 font-bold text-white hover:bg-forest/90 disabled:opacity-60"
              >
                {downloading ? 'Downloading…' : 'Download'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
