import { useParams, Link } from 'react-router-dom'
import { getCountry } from '../data/countries.js'
import Calculator from '../components/Calculator.jsx'
import Icon from '../components/Icon.jsx'
import NotFound from './NotFound.jsx'

const steps = [
  ['Regístrate gratis', 'Crea tu cuenta Wise en minutos, online o desde la app.'],
  ['Indica cuánto envías', 'Verás la comisión y el tipo de cambio medio del mercado por adelantado.'],
  ['Añade los datos del destinatario', 'Solo necesitas los datos bancarios de quien recibe el dinero.'],
  ['Confirma y paga', 'Paga con transferencia, tarjeta o débito directo. Y listo.'],
]

const reasons = [
  ['zap', 'Transferencias rápidas', 'La mayoría llega en segundos o el mismo día.'],
  ['globe', 'Tipo de cambio real', 'Siempre el tipo medio del mercado, sin márgenes ocultos.'],
  ['shield', 'Seguro y regulado', 'Tu dinero está protegido y regulado por las autoridades.'],
]

export default function SendMoneyCountry() {
  const { segment } = useParams()
  const slug = (segment || '').replace(/^send-money-to-/, '')
  const country = getCountry(slug)

  if (!country) return <NotFound />

  return (
    <>
      {/* HERO */}
      <section className="bg-bright-green">
        <div className="container-wise grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-12 w-12 overflow-hidden rounded-full ring-2 ring-white">
                <img src={`https://flagcdn.com/w160/${country.iso}.png`} alt="" className="h-full w-full object-cover" />
              </span>
              <span className="font-semibold text-forest">{country.currency}</span>
            </div>
            <h1 className="display-hero mb-6 text-forest">Envía dinero a {country.name}</h1>
            <p className="mb-8 max-w-md text-lg text-forest/80">
              Manda dinero a {country.name} con el tipo de cambio medio del mercado y comisiones bajas y transparentes. Rápido, seguro y sin sorpresas.
            </p>
            <Link to="/register" className="btn-dark px-7 py-3.5 text-lg">Envía dinero ahora</Link>
          </div>
          <div className="flex justify-center md:justify-end">
            <Calculator />
          </div>
        </div>
      </section>

      {/* POR QUÉ WISE */}
      <section className="container-wise py-16 md:py-24">
        <h2 className="display-h2 mb-12 max-w-2xl">Por qué enviar dinero a {country.name} con Wise</h2>
        <div className="grid gap-10 md:grid-cols-3">
          {reasons.map(([icon, title, text]) => (
            <div key={title}>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-bright-green text-forest">
                <Icon name={icon} size={24} />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{title}</h3>
              <p className="text-content-secondary">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CÓMO ENVIAR */}
      <section className="bg-bg-neutral py-16 md:py-24">
        <div className="container-wise">
          <h2 className="display-h2 mb-12 max-w-2xl">Cómo enviar dinero a {country.name}</h2>
          <div className="grid gap-8 md:grid-cols-4">
            {steps.map(([title, text], i) => (
              <div key={title} className="rounded-card bg-white p-6">
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-forest font-bold text-bright-green">
                  {i + 1}
                </span>
                <h3 className="mb-2 font-semibold text-content-primary">{title}</h3>
                <p className="text-sm text-content-secondary">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-wise py-16 text-center md:py-24">
        <h2 className="display-h2 mx-auto mb-6 max-w-2xl">Empieza a enviar dinero a {country.name} hoy</h2>
        <Link to="/register" className="btn-primary px-7 py-3.5 text-lg">Abre una cuenta</Link>
      </section>
    </>
  )
}
