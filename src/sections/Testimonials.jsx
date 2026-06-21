import { useEffect, useRef, useState } from 'react'
import Icon from '../components/Icon.jsx'

const reviews = [
  { iso: 'us', dark: false, text: 'Con Wise, podemos dividir nuestra vida entre dos continentes. Las transferencias son sencillas y muy, muy rápidas.', author: 'Stuart', href: 'https://www.trustpilot.com/reviews/6502faa17a75830973fb7eff' },
  { iso: 'gb', dark: true, text: 'Uso Wise para pagar una hipoteca en otro país todos los meses. Genial y fácil.', author: 'Gerald', href: 'https://www.trustpilot.com/users/626f018b8385d500128a4c22' },
  { iso: 'us', dark: false, text: '¡El mejor compañero de viaje para tu dinero! Wise te permite gestionar tus finanzas al instante de forma sencilla.', author: 'Gemma', href: 'https://www.trustpilot.com/users/62240174ef541f00128623cc' },
  { iso: 'dk', dark: true, text: 'Wise ha sido todo un descubrimiento para mí como estudiante en otro país.', author: 'Stefani', href: 'https://www.trustpilot.com/reviews/6208f1a2bc5a51af69c0e62b' },
]

const LEFT_PAD = 'max(1.25rem, calc((100vw - 1520px) / 2 + 2.5rem))'
const GAP = 24

export default function Testimonials() {
  const wrap = useRef(null)
  const dragging = useRef(false)
  const start = useRef({ x: 0, moved: 0 })
  const [cw, setCw] = useState(480)
  const [index, setIndex] = useState(0)
  const [dragX, setDragX] = useState(0)

  const n = reviews.length
  const ch = Math.round(cw * 1.12)

  useEffect(() => {
    const calc = () => {
      const el = wrap.current
      if (!el) return
      setCw(Math.min(520, Math.max(280, Math.round(el.clientWidth * 0.6))))
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  const next = () => setIndex((i) => (i + 1) % n)
  const prev = () => setIndex((i) => (i - 1 + n) % n)

  const onDown = (e) => {
    dragging.current = true
    start.current = { x: e.clientX, moved: 0 }
  }
  const onMove = (e) => {
    if (!dragging.current) return
    const dx = e.clientX - start.current.x
    start.current.moved = Math.abs(dx)
    setDragX(dx)
  }
  const onUp = () => {
    if (!dragging.current) return
    dragging.current = false
    const dx = dragX
    setDragX(0)
    if (dx > 70) next()
    else if (dx < -70) prev()
  }
  const guardClick = (e) => {
    if (start.current.moved > 6) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  // Posición de cada card según su lugar relativo en la baraja
  const styleFor = (i) => {
    const rel = (i - index + n) % n
    const slot =
      { 0: { x: 0, s: 1, z: 40 }, 1: { x: cw + GAP, s: 1, z: 30 }, 2: { x: cw + GAP + 26, s: 0.95, z: 20 } }[rel] ||
      { x: cw + GAP + 52, s: 0.9, z: 10 }
    const x = slot.x + (rel === 0 ? dragX : 0)
    return {
      width: cw,
      height: ch,
      transform: `translateX(${x}px) scale(${slot.s})`,
      zIndex: slot.z,
      transition: dragging.current && rel === 0 ? 'none' : 'transform .55s cubic-bezier(.4,0,.2,1)',
    }
  }

  const ArrowBtn = ({ dir, green }) => (
    <button
      onClick={() => (dir < 0 ? prev() : next())}
      aria-label={dir < 0 ? 'Anterior' : 'Siguiente'}
      className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
        green ? 'bg-bright-green text-forest hover:bg-bright-green-hover' : 'bg-black/10 text-content-primary hover:bg-black/20'
      }`}
    >
      <Icon name="arrowRight" size={26} className={dir < 0 ? 'rotate-180' : ''} />
    </button>
  )

  return (
    <section className="overflow-hidden bg-bg-neutral py-20 md:py-32">
      <div className="lg:flex lg:items-center lg:gap-14" style={{ paddingLeft: LEFT_PAD }}>
        {/* Columna del título */}
        <div className="mb-10 pr-5 lg:mb-0 lg:w-[460px] lg:shrink-0">
          <div className="mb-6 flex items-center gap-2 text-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-[#00B67A] text-white">
              <Icon name="star" size={14} filled />
            </span>
            <span className="font-bold text-content-primary">4,3 ★ en Trustpilot</span>
            <span className="text-content-secondary">293.067 reseñas</span>
          </div>
          <h2
            className="mb-10 font-display font-black uppercase leading-[1.02] tracking-[-0.01em] text-content-primary"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
          >
            Para gente que se mueve por el mundo
          </h2>
          <div className="flex gap-4">
            <ArrowBtn dir={-1} green={false} />
            <ArrowBtn dir={1} green />
          </div>
        </div>

        {/* Baraja de cards (la del frente se oculta detrás de la siguiente) */}
        <div
          ref={wrap}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
          className="relative min-w-0 flex-1 cursor-grab select-none touch-pan-y active:cursor-grabbing"
          style={{ height: ch }}
        >
          {reviews.map((r, i) => (
            <figure
              key={r.author}
              style={styleFor(i)}
              className={`absolute left-0 top-0 flex flex-col justify-between rounded-card-lg p-8 shadow-sm ${
                r.dark ? 'bg-forest' : 'bg-bright-green'
              }`}
            >
              <div>
                <span className="mb-8 inline-block h-20 w-20 overflow-hidden rounded-full ring-2 ring-white/40">
                  <img src={`https://flagcdn.com/w160/${r.iso}.png`} alt="" className="h-full w-full object-cover" draggable="false" />
                </span>
                <blockquote className={`text-[1.7rem] font-bold leading-snug ${r.dark ? 'text-bright-green' : 'text-forest'}`}>
                  "{r.text}"
                </blockquote>
              </div>
              <a
                href={r.href}
                target="_blank"
                rel="noreferrer"
                onClick={guardClick}
                className={`inline-flex w-max items-center rounded-pill px-6 py-3 font-semibold ${
                  r.dark ? 'bg-bright-green text-forest' : 'bg-forest text-bright-green'
                }`}
              >
                {r.author} en Trustpilot
              </a>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
