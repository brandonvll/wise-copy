import { useState } from 'react'
import Icon from '../components/Icon.jsx'

const reviews = [
  { text: 'Con Wise, podemos dividir nuestra vida entre dos continentes. Las transferencias son sencillas y muy, muy rápidas.', author: 'Stuart' },
  { text: 'Uso Wise para pagar una hipoteca en otro país todos los meses. Genial y fácil.', author: 'Gerald' },
  { text: '¡El mejor compañero de viaje para tu dinero! Wise te permite gestionar tus finanzas al instante de forma sencilla.', author: 'Gemma' },
  { text: 'Wise ha sido todo un descubrimiento para mí como estudiante en otro país.', author: 'Stefani' },
]

export default function Testimonials() {
  const [i, setI] = useState(0)
  const perView = 2
  const max = Math.max(0, reviews.length - perView)

  return (
    <section className="bg-bg-neutral py-16 md:py-24">
      <div className="container-wise">
        <div className="mb-10 flex items-end justify-between gap-4">
          <h2 className="display-h2 max-w-xl">Para gente que se mueve por el mundo</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setI((v) => Math.max(0, v - 1))}
              disabled={i === 0}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-content-primary/20 text-content-primary disabled:opacity-30"
              aria-label="Anterior"
            >
              <Icon name="chevronRight" size={20} className="rotate-180" />
            </button>
            <button
              onClick={() => setI((v) => Math.min(max, v + 1))}
              disabled={i === max}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-content-primary/20 text-content-primary disabled:opacity-30"
              aria-label="Siguiente"
            >
              <Icon name="chevronRight" size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex gap-6 transition-transform duration-500 ease-out"
            style={{ transform: `translateX(calc(-${i} * (100% + 1.5rem) / ${perView}))` }}
          >
            {reviews.map((r) => (
              <figure
                key={r.author}
                className="flex min-h-[260px] w-[calc(100%-1.5rem)] shrink-0 flex-col justify-between rounded-card-lg bg-white p-8 sm:w-[calc(50%-0.75rem)]"
              >
                <blockquote className="text-2xl font-bold leading-snug text-content-primary">
                  "{r.text}"
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-2 text-content-secondary">
                  <span className="font-semibold text-content-primary">{r.author}</span>
                  <span>en Trustpilot</span>
                  <span className="ml-1 flex gap-0.5 text-[#00B67A]">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Icon key={k} name="star" size={16} filled />
                    ))}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
