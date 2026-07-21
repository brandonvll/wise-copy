import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useViewer } from '../context/ViewAsContext.jsx'
import AppLayout from '../components/AppLayout.jsx'
import Icon from '../components/Icon.jsx'

const fmt = (n) => Math.abs(Number(n || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const fmtDate = (d) => {
  try {
    return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } catch {
    return d
  }
}

export default function Transactions() {
  const { id, client, ready } = useViewer()
  const navigate = useNavigate()
  const [txns, setTxns] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [showDownloadDrawer, setShowDownloadDrawer] = useState(false)
  const [downloadFormat, setDownloadFormat] = useState('pdf')
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (!ready || !id) return
    client
      .from('transactions')
      .select('*')
      .eq('user_id', id)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setTxns(data || [])
        setLoading(false)
      })
  }, [id, ready, client])

  const groups = useMemo(() => {
    const filtered = txns.filter((t) => t.name?.toLowerCase().includes(q.toLowerCase()))
    const map = {}
    for (const t of filtered) {
      ;(map[t.date] ||= []).push(t)
    }
    return Object.keys(map)
      .sort((a, b) => b.localeCompare(a))
      .map((date) => ({ date, items: map[date] }))
  }, [txns, q])

  const downloadTransactions = async () => {
    setDownloading(true)
    try {
      if (downloadFormat === 'pdf') {
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
        doc.text('Transaction history', 15, 70)

        // Fecha
        const today = new Date()
        const dateRange = `21 July 2025 [UTC] - ${today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} [UTC]`
        doc.setFontSize(10)
        doc.text(dateRange, 15, 80)

        const genDate = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        doc.text(`Generated on: ${genDate} [UTC]`, 15, 90)

        // Tabla de transacciones
        let yPos = 110
        doc.setFontSize(9)
        doc.text('Date', 15, yPos)
        doc.text('Description', 50, yPos)
        doc.text('Amount', 150, yPos)
        doc.text('Currency', 180, yPos)

        yPos += 7
        doc.setDrawColor(200, 200, 200)
        doc.line(15, yPos, 195, yPos)
        yPos += 5

        const filteredTxns = txns.filter((t) => t.name?.toLowerCase().includes(q.toLowerCase()))
        for (const t of filteredTxns.slice(0, 20)) {
          if (yPos > 270) {
            doc.addPage()
            yPos = 20
          }
          const txnDate = new Date(t.date + 'T00:00:00').toLocaleDateString('en-US')
          doc.text(txnDate, 15, yPos)
          doc.text(t.name?.substring(0, 30) || '', 50, yPos)
          doc.text(fmt(t.amount), 150, yPos)
          doc.text(t.currency || 'USD', 180, yPos)
          yPos += 6
        }

        // Footer
        doc.setFontSize(8)
        doc.setTextColor(100, 100, 100)
        doc.text('This is not an official statement.', 15, 275)

        doc.save(`exported-activities-${new Date().toISOString().split('T')[0]}.pdf`)
      } else {
        // CSV
        const headers = ['Date', 'Description', 'Amount', 'Currency']
        const filteredTxns = txns.filter((t) => t.name?.toLowerCase().includes(q.toLowerCase()))
        const rows = filteredTxns.map(t => [
          new Date(t.date + 'T00:00:00').toLocaleDateString('en-US'),
          t.name,
          t.amount,
          t.currency || 'USD'
        ])

        const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `exported-activities-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
      }
      setShowDownloadDrawer(false)
    } catch (error) {
      console.error('Error downloading transactions:', error)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-[860px]">
        <button
          onClick={() => navigate('/home')}
          aria-label="Volver"
          className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-bg-neutral text-content-primary hover:bg-black/10"
        >
          <Icon name="arrowRight" size={20} className="rotate-180" />
        </button>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-4xl font-extrabold text-content-primary">Transactions</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-pill border border-black/15 px-4 py-2.5">
              <Icon name="search" size={18} className="text-content-tertiary" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar"
                className="w-28 bg-transparent text-content-primary outline-none placeholder:text-content-tertiary sm:w-40"
              />
            </div>
            <button className="flex items-center gap-2 rounded-pill bg-bright-green/30 px-4 py-2.5 font-semibold text-forest hover:bg-bright-green/50">
              <Icon name="filter" size={18} /> Filters
            </button>
            <button
              onClick={() => setShowDownloadDrawer(true)}
              className="flex items-center gap-2 rounded-pill bg-bright-green/30 px-4 py-2.5 font-semibold text-forest hover:bg-bright-green/50"
            >
              <Icon name="download" size={18} /> Download
            </button>
          </div>
        </div>

        {loading ? (
          <p className="py-10 text-content-tertiary">Cargando…</p>
        ) : groups.length === 0 ? (
          <p className="rounded-card bg-bg-neutral py-16 text-center text-content-tertiary">
            {q ? 'Sin resultados.' : 'Aún no hay transacciones.'}
          </p>
        ) : (
          <div className="space-y-8">
            {groups.map((g) => (
              <div key={g.date}>
                <p className="mb-1 text-content-secondary">{fmtDate(g.date)}</p>
                <hr className="mb-2 border-black/10" />
                <ul>
                  {g.items.map((t) => {
                    const incoming = Number(t.amount) >= 0
                    return (
                      <li key={t.id} className="flex items-center gap-4 py-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-bg-neutral text-content-primary">
                          <Icon name={incoming ? 'arrowDown' : 'arrowUp'} size={22} />
                        </span>
                        <span className="flex-1 font-semibold text-content-primary">{t.name}</span>
                        <span className={`font-semibold ${incoming ? 'text-forest' : 'text-content-primary'}`}>
                          {incoming ? '+ ' : ''}{fmt(t.amount)} {t.currency}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {showDownloadDrawer && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setShowDownloadDrawer(false)}
          />
          <div className="fixed right-0 top-0 z-50 h-screen w-full max-w-md overflow-y-auto bg-white shadow-xl animate-in slide-in-from-right">
            <div className="flex items-center justify-between border-b border-black/10 p-6">
              <h2 className="text-xl font-bold text-content-primary">Download transactions</h2>
              <button
                onClick={() => setShowDownloadDrawer(false)}
                className="text-content-tertiary hover:text-content-primary"
              >
                <Icon name="x" size={24} />
              </button>
            </div>

            <div className="p-6">
              <p className="mb-6 text-sm text-content-secondary">
                This document will include your transactions currently in view, up to one year and 5,000 entries — including any filters applied.
              </p>

              <label className="mb-4 block text-sm font-semibold text-content-primary">File format</label>

              <div className="mb-8 space-y-3">
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
                  onClick={() => setShowDownloadDrawer(false)}
                  className="flex-1 rounded-lg border-2 border-black/15 px-4 py-3 font-semibold text-content-primary hover:bg-black/2"
                >
                  Cancel
                </button>
                <button
                  onClick={downloadTransactions}
                  disabled={downloading}
                  className="flex-1 rounded-lg bg-forest px-4 py-3 font-bold text-white hover:bg-forest/90 disabled:opacity-60"
                >
                  {downloading ? 'Downloading…' : 'Download'}
                </button>
              </div>

              <div className="mt-6 rounded-lg bg-amber-50 p-4">
                <p className="flex items-start gap-2 text-xs text-amber-700">
                  <Icon name="info" size={16} className="mt-0.5 shrink-0" />
                  <span>This document is not intended for official use. For official statement, download a statement report.</span>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  )
}
