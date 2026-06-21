import { useEffect, useState } from 'react'
import Icon from './Icon.jsx'

// Reel vertical estilo TikTok: 3 imágenes que hacen auto-scroll, con una
// notificación de transacción abajo y el QR de descarga.
const slides = [
  {
    img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&q=80',
    label: 'Pension',
    amount: '+221.21 GBP',
  },
  {
    img: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=900&q=80',
    label: 'Salary',
    amount: '+1,890.00 USD',
  },
  {
    img: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=900&q=80',
    label: 'Invoice #204',
    amount: '+540.00 EUR',
  },
]

export default function ReelColumn() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setI((p) => (p + 1) % slides.length), 3200)
    return () => clearInterval(id)
  }, [paused])

  return (
    <div className="relative mx-auto h-[70vh] max-h-[960px] min-h-[520px] w-full max-w-[620px] md:h-[86vh]">
      {/* Reel de imágenes (scroll vertical) */}
      <div className="absolute inset-0 overflow-hidden rounded-card-lg bg-bg-neutral">
        <div
          className="h-[300%] transition-transform duration-700 ease-out"
          style={{ transform: `translateY(-${i * (100 / 3)}%)` }}
        >
          {slides.map((s, idx) => (
            <img
              key={idx}
              src={s.img}
              alt=""
              loading="lazy"
              className="block h-1/3 w-full object-cover"
            />
          ))}
        </div>
      </div>

      {/* Botón pausa/play */}
      <button
        onClick={() => setPaused((v) => !v)}
        className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-content-primary shadow-md backdrop-blur"
        aria-label={paused ? 'Reproducir' : 'Pausar'}
      >
        {paused ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M3 2l9 5-9 5z" /></svg>
        ) : (
          <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor"><rect width="4" height="14" rx="1" /><rect x="8" width="4" height="14" rx="1" /></svg>
        )}
      </button>

      {/* Notificación de transacción */}
      <div className="absolute inset-x-4 bottom-7 z-10 flex items-center gap-4 rounded-pill bg-white p-2.5 pr-6 shadow-xl">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-bright-green text-forest">
          <Icon name="arrowDown" size={26} stroke={2.5} />
        </span>
        <span className="flex-1 truncate text-xl font-bold text-content-primary">{slides[i].label}</span>
        <span className="shrink-0 text-xl font-bold text-forest">{slides[i].amount}</span>
      </div>
    </div>
  )
}
