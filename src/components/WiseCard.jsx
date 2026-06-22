import Logo from './Logo.jsx'

// Tarjeta visual estilo Wise (verde, Visa).
export default function WiseCard({ className = '' }) {
  return (
    <div className={`relative aspect-[1.586/1] w-full max-w-[360px] overflow-hidden rounded-2xl bg-bright-green p-5 text-forest shadow-md ${className}`}>
      <div className="flex items-center gap-3">
        <span className="relative block h-8 w-11 rounded-md bg-forest/15">
          <span className="absolute inset-1.5 rounded-sm border border-forest/30" />
        </span>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M8.5 8a6 6 0 0 1 0 8M12 5a10 10 0 0 1 0 14" />
        </svg>
      </div>
      <Logo height={22} className="absolute right-5 top-5" />
      <span className="absolute bottom-4 right-5 text-2xl font-black italic text-white">VISA</span>
    </div>
  )
}
