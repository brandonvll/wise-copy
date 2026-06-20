import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { BalanceCard, Photo } from '../components/Mockups.jsx'

const features = [
  ['Recibe pagos en las divisas que necesites', 'Obtén datos de cuenta locales en USD, EUR, GBP y más para cobrar como un local en todo el mundo.', 'card'],
  ['Envía dinero en todo el mundo', 'Paga a proveedores y empleados en más de 160 países con el tipo de cambio medio del mercado.', 'globe'],
  ['Sincroniza con tu software de contabilidad', 'Conecta Wise con QuickBooks, Xero y más para automatizar tu contabilidad.', 'doc'],
  ['Controles de cuenta para los gastos del equipo', 'Da tarjetas a tu equipo y define permisos y límites de gasto fácilmente.', 'users'],
]

const solutions = [
  ['Pymes y autónomos', 'Gestiona pagos internacionales sin complicaciones ni comisiones ocultas.'],
  ['Empresas en expansión', 'Escala globalmente con datos de cuenta en múltiples divisas.'],
  ['Marketplaces y plataformas', 'Integra pagos globales con la API de Wise.'],
]

export default function Business() {
  return (
    <>
      {/* HERO */}
      <section className="bg-forest">
        <div className="container-wise grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
          <div>
            <h1 className="display-hero mb-6 text-bright-green">La cuenta empresarial para salir al mundo</h1>
            <p className="mb-8 max-w-md text-lg text-bright-green/80">
              Una sola cuenta para hacer y recibir pagos internacionales en más de 40 divisas. Únete a más de 700.000 empresas que prosperan con Wise.
            </p>
            <div className="flex flex-wrap items-center gap-5">
              <Link to="/register" className="btn-primary px-7 py-3.5 text-lg">Abre una cuenta</Link>
              <Link to="#" className="btn-link text-bright-green">Prueba la demo</Link>
            </div>
          </div>
          <div className="flex justify-center">
            <BalanceCard className="w-80" />
          </div>
        </div>
      </section>

      {/* FEATURES grid */}
      <section className="container-wise py-16 md:py-24">
        <div className="grid gap-8 md:grid-cols-2">
          {features.map(([title, text, icon]) => (
            <div key={title} className="rounded-card-lg bg-bg-neutral p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-bright-green text-forest">
                <Icon name={icon} size={24} />
              </div>
              <h3 className="mb-2 text-2xl font-semibold">{title}</h3>
              <p className="text-content-secondary">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA siguiente paso */}
      <section className="container-wise pb-8">
        <div className="rounded-card-lg bg-bright-green px-6 py-16 text-center">
          <h2 className="display-h2 mx-auto mb-6 max-w-2xl text-forest">¿Quieres dar el siguiente paso con Wise?</h2>
          <Link to="/register" className="btn-dark px-7 py-3.5">Empieza ahora</Link>
        </div>
      </section>

      {/* PROTECCIÓN */}
      <section className="container-wise grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
        <Photo src="https://images.unsplash.com/photo-1664575602554-2087b04935a5?w=800&q=80" className="aspect-[4/3] w-full" />
        <div>
          <h2 className="display-h2 mb-5">Protección financiera garantizada</h2>
          <p className="mb-6 max-w-md text-lg text-content-secondary">
            Mantenemos el dinero de tu empresa seguro en instituciones financieras reguladas y con los más altos estándares de seguridad.
          </p>
          <Link to="#" className="btn-link">Cómo protegemos tu dinero</Link>
        </div>
      </section>

      {/* SOLUCIONES */}
      <section className="bg-bg-neutral py-16 md:py-24">
        <div className="container-wise">
          <h2 className="display-h2 mb-12 text-center">Soluciones para todo tipo de negocios</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {solutions.map(([title, text]) => (
              <div key={title} className="rounded-card bg-white p-8">
                <h3 className="mb-2 text-xl font-semibold">{title}</h3>
                <p className="mb-4 text-content-secondary">{text}</p>
                <Link to="#" className="btn-link text-base">Más información</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
