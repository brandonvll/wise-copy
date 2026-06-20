import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { BalanceCard, PhoneMock, Photo } from '../components/Mockups.jsx'
import CountriesSection from '../sections/CountriesSection.jsx'

const features = [
  {
    title: 'Gestiona dinero sobre la marcha en todo el mundo',
    text: 'Mantén y convierte más de 40 divisas, y gasta en más de 150 países con la tarjeta Wise.',
    cta: 'Más sobre la tarjeta Wise',
  },
  {
    title: 'Envía dinero al extranjero y ahorra en comisiones',
    text: 'Envía dinero a más de 160 países con el tipo de cambio medio del mercado y comisiones bajas.',
    cta: 'Descubre cómo enviar dinero',
  },
]

const easy = [
  ['Regístrate gratis', 'Crea tu cuenta online o en la app en minutos.'],
  ['Verifica tu identidad', 'Sube un documento de identidad para activar tu cuenta.'],
  ['Empieza a mover dinero', 'Añade dinero y envía, gasta o convierte como un local.'],
]

const security = [
  { icon: 'lock', text: 'Equipos dedicados a la prevención del fraude y la seguridad.' },
  { icon: 'key', text: 'Autenticación de dos factores en cada inicio de sesión.' },
  { icon: 'bank', text: 'Tu dinero se mantiene en instituciones financieras establecidas.' },
]

export default function Personal() {
  return (
    <>
      {/* HERO */}
      <section className="bg-bright-green">
        <div className="container-wise grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
          <div>
            <h1 className="display-hero mb-6 text-forest">Una sola cuenta para todo el dinero del mundo</h1>
            <p className="mb-8 max-w-md text-lg text-forest/80">
              Recibe, gasta, envía y convierte dinero en más de 40 divisas. Todo desde una sola cuenta internacional.
            </p>
            <div className="flex flex-wrap items-center gap-5">
              <Link to="/register" className="btn-dark px-7 py-3.5 text-lg">Abre una cuenta</Link>
              <Link to="#" className="btn-link text-forest">Descarga la app</Link>
            </div>
          </div>
          <div className="flex justify-center">
            <PhoneMock />
          </div>
        </div>
      </section>

      {/* FEATURES alternadas */}
      {features.map((f, i) => (
        <section key={f.title} className="container-wise grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
          <div className={i % 2 ? 'order-2' : ''}>
            <h2 className="display-h2 mb-5">{f.title}</h2>
            <p className="mb-8 max-w-md text-lg text-content-secondary">{f.text}</p>
            <Link to="/register" className="btn-link">{f.cta}</Link>
          </div>
          <div className={`flex justify-center ${i % 2 ? 'order-1' : ''}`}>
            {i % 2 ? (
              <BalanceCard className="w-72" />
            ) : (
              <Photo src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80" className="aspect-square w-full max-w-md" />
            )}
          </div>
        </section>
      ))}

      {/* ES FÁCIL EMPEZAR */}
      <section className="bg-bg-neutral py-16 md:py-24">
        <div className="container-wise">
          <h2 className="display-h2 mb-12 text-center">Es fácil empezar a usar Wise</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {easy.map(([title, text], i) => (
              <div key={title} className="rounded-card bg-white p-8 text-center">
                <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-forest text-xl font-bold text-bright-green">
                  {i + 1}
                </span>
                <h3 className="mb-2 text-xl font-semibold">{title}</h3>
                <p className="text-content-secondary">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/register" className="btn-primary px-7 py-3.5">Abre una cuenta</Link>
          </div>
        </div>
      </section>

      {/* SEGURIDAD */}
      <section className="container-wise py-16 md:py-24">
        <h2 className="display-h2 mb-12 max-w-2xl">Confía en nosotros para proteger tu dinero</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {security.map((s) => (
            <div key={s.text}>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-bg-neutral text-content-primary">
                <Icon name={s.icon} size={22} />
              </div>
              <p className="text-content-secondary">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <CountriesSection />
    </>
  )
}
