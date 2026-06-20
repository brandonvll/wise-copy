import { useState } from 'react'
import { Link } from 'react-router-dom'
import { countries } from '../data/countries.js'

const tabs = ['Envía dinero', 'Datos de cuenta', 'Guarda y convierte dinero']

export default function CountriesSection() {
  const [tab, setTab] = useState(0)
  const prefix = ['Envía dinero a', 'Datos de cuenta para', 'Convierte a'][tab]

  return (
    <section className="container-wise py-16 md:py-24">
      <h2 className="display-h2 mb-8 text-center">Wise funciona en casi todas partes</h2>

      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`rounded-pill px-5 py-2.5 font-semibold transition-colors ${
              tab === i ? 'bg-forest text-bright-green' : 'bg-bg-neutral text-content-primary hover:bg-black/10'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
        {countries.map((c) => (
          <Link
            key={c.slug}
            to={`/send-money/send-money-to-${c.slug}`}
            className="group flex items-start gap-3"
          >
            <span className="mt-0.5 inline-block h-9 w-9 shrink-0 overflow-hidden rounded-full bg-bg-neutral">
              <img src={`https://flagcdn.com/w80/${c.iso}.png`} alt="" loading="lazy" className="h-full w-full object-cover" />
            </span>
            <span className="text-content-primary underline-offset-4 group-hover:underline">
              {prefix} {c.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
