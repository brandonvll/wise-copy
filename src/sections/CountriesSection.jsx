import { useState } from 'react'
import { Link } from 'react-router-dom'
import { countries } from '../data/countries.js'

const tabs = ['Envía dinero', 'Datos de cuenta', 'Guarda y convierte dinero']
const prefixes = ['Envía dinero a', 'Datos de cuenta para', 'Convierte a']

export default function CountriesSection() {
  const [tab, setTab] = useState(0)
  const prefix = prefixes[tab]

  return (
    <section className="bg-bg-neutral py-16 md:py-24">
      <div className="container-wise">
        <h2 className="mb-8 text-[2.25rem] font-extrabold leading-tight tracking-tight text-content-primary md:text-[2.75rem]">
          Wise funciona en casi todas partes
        </h2>

        <div className="mb-12 flex flex-wrap gap-3">
          {tabs.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`rounded-pill px-5 py-2.5 font-semibold transition-colors ${
                tab === i
                  ? 'bg-bright-green text-forest'
                  : 'border border-content-primary/25 text-content-primary hover:border-content-primary'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {countries.map((c) => (
            <Link key={c.slug} to={`/send-money/send-money-to-${c.slug}`} className="group block">
              <span className="mb-4 inline-block h-12 w-12 overflow-hidden rounded-full ring-1 ring-black/5">
                <img src={`https://flagcdn.com/w160/${c.iso}.png`} alt="" loading="lazy" className="h-full w-full object-cover" />
              </span>
              <span className="block font-medium text-content-primary underline underline-offset-4 decoration-from-font group-hover:decoration-2">
                {prefix} {c.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
