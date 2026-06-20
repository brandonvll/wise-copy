import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'

const categories = [
  ['card', 'Tu cuenta Wise', 'Verificación, datos de cuenta y configuración.'],
  ['globe', 'Enviar dinero', 'Transferencias, tiempos de entrega y tipos de cambio.'],
  ['doc', 'Recibir dinero', 'Datos de cuenta global y cobros internacionales.'],
  ['phone', 'Tarjeta Wise', 'Pagos, retiros y gestión de tu tarjeta.'],
  ['lock', 'Seguridad', 'Protege tu cuenta y evita estafas.'],
  ['users', 'Wise para Empresas', 'Cuentas empresariales y herramientas para equipos.'],
]

const popular = [
  '¿Cuánto tarda mi transferencia?',
  '¿Cómo verifico mi identidad?',
  '¿Cuáles son las comisiones de Wise?',
  '¿Cómo obtengo mis datos de cuenta?',
  'Olvidé mi contraseña',
]

export default function Help() {
  return (
    <>
      {/* HERO buscador */}
      <section className="bg-bright-green">
        <div className="container-wise py-16 text-center md:py-24">
          <h1 className="display-hero mb-8 text-forest">¿Cómo podemos ayudarte?</h1>
          <div className="mx-auto flex max-w-xl items-center gap-2 rounded-pill bg-white px-5 py-3 shadow-sm">
            <Icon name="globe" size={20} className="text-content-tertiary" />
            <input
              type="search"
              placeholder="Busca en la sección de ayuda"
              className="w-full bg-transparent text-content-primary outline-none placeholder:text-content-tertiary"
            />
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="container-wise py-16 md:py-24">
        <h2 className="display-h2 mb-12 text-center">Explora por tema</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map(([icon, title, text]) => (
            <Link key={title} to="#" className="group rounded-card border border-black/10 p-8 transition-colors hover:border-content-primary">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-bg-neutral text-content-primary">
                <Icon name={icon} size={24} />
              </div>
              <h3 className="mb-2 flex items-center gap-2 text-xl font-semibold">
                {title}
                <Icon name="chevronRight" size={18} className="transition-transform group-hover:translate-x-1" />
              </h3>
              <p className="text-content-secondary">{text}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* PREGUNTAS POPULARES */}
      <section className="bg-bg-neutral py-16 md:py-24">
        <div className="container-wise max-w-3xl">
          <h2 className="display-h2 mb-8">Preguntas frecuentes</h2>
          <ul className="divide-y divide-black/10 rounded-card bg-white px-2">
            {popular.map((q) => (
              <li key={q}>
                <Link to="#" className="flex items-center justify-between px-5 py-5 font-semibold text-content-primary hover:text-forest">
                  {q}
                  <Icon name="chevronRight" size={18} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
