import Icon from './Icon.jsx'

// Tarjeta de saldo estilo Wise (mock).
export function BalanceCard({ className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute -right-3 -top-3 h-10 w-10 overflow-hidden rounded-full ring-2 ring-white">
        <img src="https://flagcdn.com/w80/us.png" alt="" className="h-full w-full object-cover" />
      </div>
      <div className="absolute -right-1 -top-6 h-8 w-8 overflow-hidden rounded-full ring-2 ring-white">
        <img src="https://flagcdn.com/w80/eu.png" alt="" className="h-full w-full object-cover" />
      </div>
      <div className="rounded-2xl bg-white p-5 shadow-xl ring-1 ring-black/5">
        <div className="mb-1 flex items-center gap-2">
          <span className="inline-block h-6 w-6 overflow-hidden rounded-full">
            <img src="https://flagcdn.com/w80/gb.png" alt="" className="h-full w-full object-cover" />
          </span>
          <span className="font-semibold text-content-primary">GBP Balance</span>
        </div>
        <p className="font-display text-4xl font-black text-content-primary">
          1,289<span className="text-2xl align-top">.09</span>
        </p>
        <div className="mt-3 flex items-center gap-2 text-sm text-content-tertiary">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-bright-green text-forest">
            <Icon name="check" size={12} stroke={3} />
          </span>
          23-13-70 · 12345678
        </div>
      </div>
    </div>
  )
}

// Mockup de teléfono con la app Wise.
export function PhoneMock({ className = '' }) {
  return (
    <div className={`relative mx-auto w-[260px] rounded-[2.5rem] border-[10px] border-forest-dark bg-white shadow-2xl ${className}`}>
      <div className="rounded-[1.8rem] bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-semibold text-content-primary">Account</span>
          <span className="h-7 w-7 rounded-full bg-bright-green" />
        </div>
        <div className="mb-4 flex gap-3">
          <span className="h-9 w-9 overflow-hidden rounded-full"><img src="https://flagcdn.com/w80/us.png" alt="" className="h-full w-full object-cover" /></span>
          <span className="h-9 w-9 overflow-hidden rounded-full"><img src="https://flagcdn.com/w80/eu.png" alt="" className="h-full w-full object-cover" /></span>
        </div>
        <div className="flex justify-between text-lg font-bold text-content-primary">
          <span>156.90</span>
          <span>378.20</span>
        </div>
        <p className="mt-4 mb-2 text-xs font-semibold text-content-tertiary">Transactions</p>
        {[0, 1, 2].map((k) => (
          <div key={k} className="mb-2 flex items-center gap-3">
            <span className="h-8 w-8 rounded-full bg-bg-neutral" />
            <span className="h-2 flex-1 rounded bg-bg-neutral" />
            <span className="h-2 w-10 rounded bg-bg-neutral" />
          </div>
        ))}
        <div className="mt-4 rounded-xl bg-forest px-4 py-3 text-center font-semibold text-bright-green">
          Spend anywhere
        </div>
      </div>
    </div>
  )
}

// Foto con degradado de respaldo si la imagen falla.
export function Photo({ src, alt = '', className = '', rounded = 'rounded-card-lg' }) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-bright-green/40 to-forest/30 ${rounded} ${className}`}>
      {src && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
      )}
    </div>
  )
}
