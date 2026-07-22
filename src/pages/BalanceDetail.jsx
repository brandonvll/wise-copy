import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useViewer } from '../context/ViewAsContext.jsx'
import { buildAccount } from '../lib/account.js'
import AppLayout from '../components/AppLayout.jsx'
import Icon from '../components/Icon.jsx'
import LogoMark from '../components/LogoMark.jsx'

const SYMBOL = { USD: '$', EUR: '€', GBP: '£', COP: '$', MXN: '$', BRL: 'R$' }
const FLAG   = { USD: 'us', EUR: 'eu', GBP: 'gb', COP: 'co', MXN: 'mx', BRL: 'br' }
const fmt    = (n) => Math.abs(Number(n || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const fmtDate = (d) => {
  try {
    return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } catch {
    return d
  }
}

const actionButtons = [
  { key: 'add',     label: 'Add',     icon: 'plus' },
  { key: 'move',    label: 'Move',    icon: 'move' },
  { key: 'send',    label: 'Send',    icon: 'arrowUp' },
  { key: 'request', label: 'Request', icon: 'arrowDown' },
]

export default function BalanceDetail() {
  const { currency: paramCurrency } = useParams()
  const navigate = useNavigate()
  const { id, client, ready, name: viewName } = useViewer()

  const [account, setAccount] = useState(null)
  const [profile, setProfile] = useState(null)
  const [txns, setTxns] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')

  // Download drawer state
  const [showDownloadDrawer, setShowDownloadDrawer] = useState(false)
  const [downloadFormat, setDownloadFormat] = useState('pdf')
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (!ready || !id) return
    let active = true
    ;(async () => {
      const [{ data: a }, { data: t }, { data: p }] = await Promise.all([
        client.from('accounts').select('*').eq('user_id', id).order('created_at').limit(1).maybeSingle(),
        client.from('transactions').select('*').eq('user_id', id).order('date', { ascending: false }).order('created_at', { ascending: false }),
        client.from('profiles').select('full_name').eq('id', id).maybeSingle(),
      ])
      if (!active) return
      setAccount(a)
      setProfile(p)
      setTxns(t || [])
      setLoading(false)
    })()
    return () => { active = false }
  }, [id, ready, client])

  const acct = buildAccount(account, id)
  const currency = paramCurrency?.toUpperCase() || acct.currency || 'USD'
  const balance = acct.balance
  const accountNumber = acct.account_number
  const last4 = accountNumber ? accountNumber.slice(-4) : '----'
  const holderName = profile?.full_name || viewName || 'User'

  // Group transactions by date
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

  // ─── PDF generation with Wise professional design ───
  const downloadTransactions = async () => {
    setDownloading(true)
    try {
      const filtered = txns.filter((t) => t.name?.toLowerCase().includes(q.toLowerCase()))

      if (downloadFormat === 'pdf') {
        const { jsPDF } = await import('jspdf')
        const doc = new jsPDF()
        const pageW = doc.internal.pageSize.getWidth()
        const pageH = doc.internal.pageSize.getHeight()

        // Draw watermarks BEFORE content so they sit behind text
        const addWatermark = () => {
          doc.saveGraphicsState()
          doc.setTextColor(235, 235, 235) // very light, transparent-looking
          doc.setFontSize(42)
          const text = 'This is not an official statement'
          // Centered watermarks at 3 vertical positions
          const positions = [
            { x: pageW / 2, y: pageH * 0.30 },
            { x: pageW / 2, y: pageH * 0.55 },
            { x: pageW / 2, y: pageH * 0.80 },
          ]
          for (const pos of positions) {
            doc.text(text, pos.x, pos.y, {
              align: 'center',
              angle: 45,
              renderingMode: 'fill',
            })
          }
          doc.restoreGraphicsState()
        }

        // Draw watermark first so it's behind all content
        addWatermark()

        // ── Page 1: Header ──
        // Render the exact Wise SVG logo from Logo.jsx as an image
        const logoImgData = await new Promise((resolve) => {
          const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="352" height="80" viewBox="0 0 88 20" fill="none">
            <path fill="#163300" d="M48.9285.2989h5.413L51.6183 19.7263h-5.4131L48.9285.2989Zm-6.8241 0L38.4514 11.4904 36.8573.2989h-3.7858L28.2893 11.4572 27.6917.2989h-5.2472L24.271 19.7263h4.3504L34.0014 7.4389 35.8943 19.7263h4.284L47.2518.2989h-5.1474ZM87.5508 11.59H74.6988c.0665 2.5239 1.5775 4.1844 3.8025 4.1844 1.6771 0 3.0055-.8967 4.035-2.607l4.3382 1.972C85.3833 18.0775 82.2413 19.992 78.3685 19.992 73.0883 19.992 69.5847 16.4386 69.5847 10.7266 69.5847 4.4501 73.7025 0 79.5142 0c5.1145 0 8.3357 3.4538 8.3357 8.8336 0 .8967-.1 1.7933-.299 2.7564Zm-4.8153-3.7194c0-2.2582-1.262-3.6862-3.2877-3.6862-2.0922 0-3.8191 1.4944-4.2841 3.6862h7.5718ZM5.5255 6.1532 0 12.6107h9.8661l1.1086-3.0449H6.747l2.5832-2.9868.0083-.0792L7.6588 3.6085h7.5569l-5.8579 16.1179h4.0087L20.4402.2989H2.166L5.5255 6.1532Zm57.6165-1.9689c1.9095 0 3.5827 1.0269 5.0439 2.7869l.7677-5.4769C67.592.5729 65.7489 0 63.308 0c-4.8485 0-7.5716 2.8394-7.5716 6.4426 0 2.499 1.3948 4.0266 3.6862 5.0146l1.0959.4981c2.0423.8718 2.5904 1.3036 2.5904 2.2251 0 .9547-.9216 1.5608-2.3247 1.5608-2.3164.0083-4.1927-1.1789-5.6041-3.2047l-.7822 5.5803C56.0053 19.3423 58.0657 19.992 60.7842 19.992c4.6077 0 7.4389-2.6568 7.4389-6.343 0-2.5072-1.1125-4.1179-3.9188-5.3798l-1.1954-.5645c-1.6605-.7389-2.225-1.1457-2.225-1.9593 0-.88.7721-1.5609 2.2582-1.5609Z"/>
          </svg>`
          const img = new Image()
          const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' })
          const url = URL.createObjectURL(blob)
          img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = 352
            canvas.height = 80
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, 352, 80)
            URL.revokeObjectURL(url)
            resolve(canvas.toDataURL('image/png'))
          }
          img.src = url
        })
        doc.addImage(logoImgData, 'PNG', 15, 10, 44, 10)

        // Company info
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(80, 80, 80)
        doc.text('Wise US Inc.', 15, 30)
        doc.text('30 W 26th Street, Floor 6', 15, 35)
        doc.text('New York', 15, 40)
        doc.text('10010', 15, 45)
        doc.text('United States', 15, 50)

        // Title
        doc.setFontSize(22)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(0, 0, 0)
        doc.text('Transaction history', 15, 70)

        // Date range
        const today = new Date()
        const oneYearAgo = new Date(today)
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
        const fmtLong = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        const dateRange = `${fmtLong(oneYearAgo)} [UTC] - ${fmtLong(today)} [UTC]`
        doc.setFontSize(11)
        doc.setFont('helvetica', 'normal')
        doc.text(dateRange, 15, 78)

        // Generated on
        doc.setFontSize(9)
        doc.setTextColor(80, 80, 80)
        doc.text(`Generated on: ${fmtLong(today)} [UTC]`, 15, 88)

        // ── Account Holder Table ──
        let yPos = 105
        doc.setDrawColor(0, 0, 0)
        doc.setLineWidth(0.5)
        doc.line(15, yPos, pageW - 15, yPos)

        yPos += 6
        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(0, 0, 0)
        doc.text('Account Holder', 15, yPos)
        doc.text('Membership', 100, yPos)

        yPos += 7
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(60, 60, 60)
        doc.text(holderName, 15, yPos)
        doc.text(`P${accountNumber?.slice(0, 9) || '000000000'}`, 100, yPos)

        yPos += 10
        doc.setDrawColor(0, 0, 0)
        doc.setLineWidth(0.5)
        doc.line(15, yPos, pageW - 15, yPos)

        // ── Filters applied ──
        yPos += 12
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(0, 0, 0)
        doc.text('Filters applied', 15, yPos)

        yPos += 8
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(60, 60, 60)
        doc.text('Hidden transactions: Excluded', 15, yPos)
        yPos += 6
        doc.text(`Date range: ${fmtLong(oneYearAgo)} - ${fmtLong(today)}`, 15, yPos)
        yPos += 6
        doc.text(`Currency: ${currency}`, 15, yPos)

        yPos += 12
        doc.setDrawColor(0, 0, 0)
        doc.setLineWidth(0.5)
        doc.line(15, yPos, pageW - 15, yPos)

        // ── Transactions Table ──
        yPos += 12

        // Group by month
        const monthGroups = {}
        for (const t of filtered) {
          const d = new Date(t.date + 'T00:00:00')
          const key = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
          ;(monthGroups[key] ||= []).push(t)
        }

        let pageNum = 1
        const totalPages = Math.max(1, Math.ceil(filtered.length / 15))

        // Page number footer
        const addPageNumber = () => {
          doc.setFontSize(8)
          doc.setTextColor(120, 120, 120)
          doc.text(`${pageNum}/${totalPages}`, pageW - 20, pageH - 10, { align: 'right' })
        }

        for (const [month, items] of Object.entries(monthGroups)) {
          if (yPos > pageH - 40) {
            addPageNumber()
            doc.addPage()
            addWatermark() // draw watermark first on new page
            pageNum++
            yPos = 20
          }

          // Month header
          doc.setFontSize(10)
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(0, 0, 0)
          doc.text(month, 15, yPos)
          doc.text('Fee', 130, yPos)
          doc.text('Amount', pageW - 15, yPos, { align: 'right' })
          yPos += 3
          doc.setDrawColor(200, 200, 200)
          doc.setLineWidth(0.3)
          doc.line(15, yPos, pageW - 15, yPos)
          yPos += 8

          for (const t of items) {
            if (yPos > pageH - 30) {
              addPageNumber()
              doc.addPage()
              addWatermark() // draw watermark first on new page
              pageNum++
              yPos = 20
            }

            // Transaction name
            doc.setFontSize(9)
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(0, 0, 0)
            doc.text(t.name?.substring(0, 40) || 'Unknown', 15, yPos)
            // Amount
            const amount = Number(t.amount || 0)
            const amtText = `${amount >= 0 ? '' : '-'}${fmt(amount)} ${t.currency || currency}`
            doc.text(amtText, pageW - 15, yPos, { align: 'right' })
            // Fee
            doc.setFont('helvetica', 'normal')
            doc.setTextColor(100, 100, 100)
            doc.text(`0 ${currency}`, 130, yPos)

            yPos += 5

            // Transaction details line
            const txDate = new Date(t.date + 'T00:00:00')
            const txDateStr = txDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
            const txId = t.id ? `Transaction: ${t.id.substring(0, 20)}` : ''
            const category = t.category ? `Category: ${t.category}` : 'Category: General'
            doc.setFontSize(7)
            doc.text(`${txDateStr} | ${txId} | ${category}`, 15, yPos)

            yPos += 4
            // Running balance
            doc.setFontSize(8)
            doc.setFont('helvetica', 'normal')
            doc.text(`${fmt(amount)} ${currency}`, pageW - 15, yPos, { align: 'right' })

            yPos += 8
          }
        }

        // Final page number (watermark already drawn on this page)
        addPageNumber()

        doc.save(`exported-activities-${new Date().toISOString().split('T')[0]}.pdf`)
      } else {
        // ── CSV download ──
        const headers = ['Date', 'Description', 'Amount', 'Currency', 'Fee', 'Category']
        const rows = filtered.map((t) => [
          new Date(t.date + 'T00:00:00').toLocaleDateString('en-US'),
          t.name,
          t.amount,
          t.currency || currency,
          '0',
          t.category || 'General',
        ])

        const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')
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
      <div className="mx-auto max-w-[1200px]">
        {/* Back button */}
        <button
          onClick={() => navigate('/home')}
          aria-label="Volver"
          className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-bg-neutral text-content-primary hover:bg-black/10"
        >
          <Icon name="arrowRight" size={20} className="rotate-180" />
        </button>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* ─── Main Column ─── */}
          <div>
            {/* Account badge */}
            <div className="mb-2 flex items-center gap-2">
              <LogoMark height={16} />
              <img
                src={`https://flagcdn.com/w80/${FLAG[currency] || 'us'}.png`}
                alt=""
                className="h-6 w-6 rounded-full object-cover"
              />
              <span className="flex items-center gap-1 text-sm font-semibold text-content-primary">
                Main account <Icon name="chevronRight" size={14} className="text-content-tertiary" /> {currency}
              </span>
            </div>

            {/* Balance */}
            <h1 className="mb-3 text-4xl font-extrabold text-content-primary">
              {fmt(balance)} {currency}
            </h1>

            {/* Account number */}
            <Link
              to="/payments/account-details"
              className="mb-8 inline-flex items-center gap-2 rounded-pill bg-bg-neutral px-4 py-2 text-sm font-semibold text-forest hover:bg-black/10"
            >
              <Icon name="bank" size={16} />
              Account number ending {last4}
              <Icon name="chevronRight" size={14} className="text-content-tertiary" />
            </Link>

            {/* Action buttons */}
            <div className="mb-10 flex items-center gap-6">
              {actionButtons.map((a) => (
                <button
                  key={a.key}
                  className="group flex flex-col items-center gap-2"
                  onClick={() => {
                    if (a.key === 'add') navigate('/flows/balances/add')
                  }}
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-bright-green/30 text-forest transition-colors group-hover:bg-bright-green/50">
                    <Icon name={a.icon} size={22} />
                  </span>
                  <span className="text-xs font-semibold text-content-primary">{a.label}</span>
                </button>
              ))}
            </div>

            {/* Transactions section */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-content-primary">Transactions</h2>

              {/* Search + Filters + Download */}
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <div className="flex flex-1 items-center gap-2 rounded-pill border border-black/15 px-4 py-2.5">
                  <Icon name="search" size={18} className="text-content-tertiary" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search"
                    className="w-full bg-transparent text-sm text-content-primary outline-none placeholder:text-content-tertiary"
                  />
                </div>
                <button className="flex items-center gap-2 rounded-pill border border-black/15 px-4 py-2.5 text-sm font-semibold text-content-primary hover:bg-black/5">
                  <Icon name="filter" size={16} /> Filters
                </button>
                <button
                  onClick={() => setShowDownloadDrawer(true)}
                  className="flex items-center gap-2 rounded-pill border border-black/15 px-4 py-2.5 text-sm font-semibold text-content-primary hover:bg-black/5"
                >
                  <Icon name="download" size={16} /> Download
                </button>
              </div>

              {/* Transaction list */}
              {loading ? (
                <p className="py-10 text-content-tertiary">Cargando…</p>
              ) : groups.length === 0 ? (
                <p className="rounded-card bg-bg-neutral py-16 text-center text-content-tertiary">
                  {q ? 'No results.' : 'No transactions yet.'}
                </p>
              ) : (
                <div className="space-y-6">
                  {groups.map((g) => (
                    <div key={g.date}>
                      <p className="mb-1 text-sm text-content-secondary">{fmtDate(g.date)}</p>
                      <hr className="mb-2 border-black/10" />
                      <ul>
                        {g.items.map((t) => {
                          const incoming = Number(t.amount) >= 0
                          return (
                            <li key={t.id} className="flex items-center gap-4 py-3">
                              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bg-neutral text-content-primary">
                                <Icon name={incoming ? 'arrowDown' : 'arrowUp'} size={20} />
                              </span>
                              <span className="flex-1 font-semibold text-content-primary">{t.name}</span>
                              <span className={`font-semibold ${incoming ? 'text-forest' : 'text-content-primary'}`}>
                                {incoming ? '+ ' : ''}{fmt(t.amount)} {t.currency || currency}
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
          </div>

          {/* ─── Sidebar ─── */}
          <div className="hidden space-y-5 lg:block">
            {/* Earn APY card */}
            <div className="rounded-card-lg bg-bg-neutral p-6">
              <div className="mb-3 flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bright-green text-forest">
                  <Icon name="zap" size={20} />
                </span>
                <div>
                  <p className="font-bold text-content-primary">Earn 3.14% APY</p>
                  <p className="text-sm text-content-secondary">Start earning interest</p>
                </div>
              </div>
              <p className="text-xs text-content-tertiary">
                Annual Percentage Yield (APY) rate shown is true as of 18 Dec 2025.
              </p>
            </div>

            {/* Auto conversions card */}
            <div className="rounded-card-lg bg-bg-neutral p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bright-green text-forest">
                  <Icon name="refresh" size={20} />
                </span>
                <div>
                  <p className="font-bold text-content-primary">Auto conversions</p>
                  <p className="text-sm text-content-secondary">
                    Convert money between your currencies at your chosen rate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Download Drawer (right slide-in) ─── */}
      {showDownloadDrawer && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20 transition-opacity"
            onClick={() => setShowDownloadDrawer(false)}
          />

          {/* Drawer */}
          <div
            className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col bg-white shadow-2xl"
            style={{ animation: 'slideInRight 0.25s ease-out' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
              <h2 className="text-lg font-bold text-content-primary">Download your transactions history</h2>
              <button
                onClick={() => setShowDownloadDrawer(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-content-tertiary hover:bg-black/5 hover:text-content-primary"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <p className="mb-6 text-sm leading-relaxed text-content-secondary">
                This document will include your transactions currently in view, up to one year and a maximum of 10,000 entries — including any Filters applied.
              </p>

              <label className="mb-4 block text-sm font-semibold text-content-primary">File format</label>

              {/* PDF option */}
              <div className="mb-3 space-y-3">
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-colors ${
                    downloadFormat === 'pdf'
                      ? 'border-forest bg-bright-green/10'
                      : 'border-black/10 hover:bg-black/[0.02]'
                  }`}
                  onClick={() => setDownloadFormat('pdf')}
                >
                  <input
                    type="radio"
                    name="format"
                    value="pdf"
                    checked={downloadFormat === 'pdf'}
                    onChange={(e) => setDownloadFormat(e.target.value)}
                    className="h-5 w-5 cursor-pointer accent-forest"
                  />
                  <span className="font-semibold text-content-primary">PDF</span>
                </label>

                {/* CSV option */}
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-colors ${
                    downloadFormat === 'csv'
                      ? 'border-forest bg-bright-green/10'
                      : 'border-black/10 hover:bg-black/[0.02]'
                  }`}
                  onClick={() => setDownloadFormat('csv')}
                >
                  <input
                    type="radio"
                    name="format"
                    value="csv"
                    checked={downloadFormat === 'csv'}
                    onChange={(e) => setDownloadFormat(e.target.value)}
                    className="h-5 w-5 cursor-pointer accent-forest"
                  />
                  <span className="font-semibold text-content-primary">CSV</span>
                </label>
              </div>

              {/* Info note */}
              <div className="mt-6 rounded-xl bg-bg-neutral p-4">
                <p className="flex items-start gap-2 text-xs leading-relaxed text-content-secondary">
                  <Icon name="info" size={16} className="mt-0.5 shrink-0 text-content-tertiary" />
                  <span>
                    This document is not intended for official use. For a PDF of your transactions without a statement, download a statement instead.
                  </span>
                </p>
                <button className="mt-2 text-xs font-semibold text-forest underline underline-offset-2">
                  Go to my statements
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-black/10 px-6 py-5">
              <button
                onClick={downloadTransactions}
                disabled={downloading}
                className="w-full rounded-xl bg-bright-green py-4 text-center font-bold text-forest transition-colors hover:bg-bright-green-hover disabled:opacity-60"
              >
                {downloading ? 'Downloading…' : 'Download'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Drawer animation keyframe */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </AppLayout>
  )
}
