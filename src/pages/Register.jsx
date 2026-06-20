import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'

const perks = [
  'Cuenta gratis, sin cuotas de mantenimiento',
  'Tipo de cambio medio del mercado',
  'Envía a más de 160 países',
  'Datos de cuenta en varias divisas',
]

export default function Register() {
  return (
    <section className="bg-bright-green">
      <div className="container-wise grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
        {/* Beneficios */}
        <div>
          <h1 className="display-hero mb-6 text-forest">Crea tu cuenta Wise</h1>
          <p className="mb-8 max-w-md text-lg text-forest/80">
            Únete a más de 16 millones de personas y empresas que ya mueven su dinero con Wise.
          </p>
          <ul className="space-y-4">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-3 text-forest">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest text-bright-green">
                  <Icon name="check" size={14} stroke={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* Formulario */}
        <div className="rounded-card-lg bg-white p-8 shadow-xl">
          <h2 className="mb-6 text-2xl font-semibold">Empieza gratis</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="mb-1 block text-sm font-semibold text-content-primary">Correo electrónico</label>
              <input type="email" placeholder="tucorreo@ejemplo.com" className="w-full rounded-xl border border-black/15 px-4 py-3 outline-none focus:border-forest" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-content-primary">Crea una contraseña</label>
              <input type="password" placeholder="••••••••" className="w-full rounded-xl border border-black/15 px-4 py-3 outline-none focus:border-forest" />
            </div>
            <button type="submit" className="btn-primary w-full py-3.5">Crea tu cuenta</button>
          </form>
          <p className="mt-6 text-center text-content-secondary">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-semibold text-forest underline underline-offset-4">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
