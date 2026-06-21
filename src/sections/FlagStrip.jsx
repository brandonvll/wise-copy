import { useEffect, useRef, useState } from 'react'
import Icon from '../components/Icon.jsx'

// Banderas que ruedan con el scroll (como en wise.com).
// La flecha va EMBEBIDA dentro del extremo derecho de la barra verde; toda la
// fila se desplaza junta y las banderas giran como ruedas.
const flags = ['co', 'eu', 'gb', 'us', 'in', 'my', 'rs', 'br', 'au', 'jp', 'mx', 'es', 'ca', 'fr', 'it', 'kr']

const SIZE = 150 // diámetro de las banderas
const ARROW = 122 // círculo de la flecha (dentro de la barra)
const BAR_W = 2400 // ancho de la barra (sobresale por la izquierda)
const PAD_R = 14 // verde a la derecha de la flecha (extremo redondeado)
// centro de la flecha medido desde el origen de la fila
const ARROW_OFFSET = BAR_W - PAD_R - ARROW / 2
const START = 0.04 // posición de la flecha (fracción del viewport) al entrar (pegada a la izq.)
const END = 0.48 // posición al salir

export default function FlagStrip() {
  const ref = useRef(null)
  const [tx, setTx] = useState(() => (typeof window !== 'undefined' ? START * window.innerWidth : 80))
  const [rot, setRot] = useState(0)

  useEffect(() => {
    let raf = 0
    const update = () => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const vw = window.innerWidth || 1
      // progreso 0→1 mientras la sección cruza el viewport (bajar = aumenta)
      const p = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)))
      const nextTx = (START + (END - START) * p) * vw // = posición en pantalla del centro de la flecha
      const center = ((START + END) / 2) * vw
      const nextRot = ((nextTx - center) / (SIZE / 2)) * (180 / Math.PI)
      setTx(nextTx)
      setRot(nextRot)
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section ref={ref} className="overflow-hidden py-12 md:py-16">
      <div
        className="flex items-center gap-5 will-change-transform"
        style={{ transform: `translate3d(${tx}px, 0, 0)`, marginLeft: -ARROW_OFFSET }}
      >
        {/* Barra verde con la flecha embebida en su extremo derecho */}
        <div
          className="flex shrink-0 items-center justify-end rounded-full bg-bright-green"
          style={{ width: BAR_W, height: SIZE, paddingRight: PAD_R }}
        >
          <span
            className="flex items-center justify-center rounded-full bg-forest text-bright-green"
            style={{ width: ARROW, height: ARROW }}
          >
            <Icon name="arrowRight" size={46} />
          </span>
        </div>
        {/* Banderas (giran con el scroll) */}
        {flags.concat(flags).map((iso, i) => (
          <span
            key={i}
            className="shrink-0 overflow-hidden rounded-full ring-1 ring-black/5"
            style={{ width: SIZE, height: SIZE, transform: `rotate(${rot}deg)` }}
          >
            <img
              src={`https://flagcdn.com/w320/${iso}.png`}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </span>
        ))}
      </div>
    </section>
  )
}
