import { useEffect, useRef, useState } from 'react'
import Icon from '../components/Icon.jsx'

// Banderas que ruedan horizontalmente según el scroll (como en wise.com).
const flags = ['co', 'eu', 'gb', 'us', 'in', 'my', 'rs', 'br', 'au', 'jp', 'mx', 'es', 'ca', 'fr', 'it', 'kr']

const MOVE = 560 // px totales que recorren las banderas durante el scroll

export default function FlagStrip() {
  const ref = useRef(null)
  const [tx, setTx] = useState(-MOVE)

  useEffect(() => {
    let raf = 0
    const update = () => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      // progreso 0→1 mientras la sección cruza el viewport (bajar = aumenta)
      const p = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)))
      // siempre ≤ 0: el borde izquierdo de la fila nunca deja hueco tras la flecha.
      // al bajar (p↑) se desplaza a la derecha; al subir (p↓) vuelve.
      setTx(MOVE * (p - 1))
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
    <section ref={ref} className="overflow-hidden py-12 md:py-20">
      <div className="flex items-center">
        {/* Barra verde */}
        <div className="h-[88px] flex-[1.3] rounded-r-full bg-bright-green" />
        {/* Flecha */}
        <span className="z-10 -ml-1 flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-full bg-forest text-bright-green">
          <Icon name="arrowRight" size={36} />
        </span>
        {/* Banderas (recortadas: emergen limpias tras la flecha) */}
        <div className="ml-3 flex flex-1 items-center overflow-hidden self-stretch">
          <div
            className="flex items-center gap-4 will-change-transform"
            style={{ transform: `translate3d(${tx}px, 0, 0)` }}
          >
            {flags.concat(flags).map((iso, i) => (
              <span
                key={i}
                className="h-[88px] w-[88px] shrink-0 overflow-hidden rounded-full ring-1 ring-black/5"
              >
                <img
                  src={`https://flagcdn.com/w160/${iso}.png`}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
