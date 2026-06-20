import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import Icon from './Icon.jsx'

const menus = {
  Personal: {
    to: '/co/account/',
    sections: [
      {
        title: 'Cuenta',
        items: [
          ['Cuenta Wise', '/co/account/'],
          ['Tarjeta Wise', '/co/account/'],
          ['Recibe dinero', '/send-money/send-money-to-colombia'],
        ],
      },
      {
        title: 'Envía dinero',
        items: [
          ['Transferencia internacional', '/send-money/send-money-to-spain'],
          ['Transferencia de gran cantidad', '/co/account/'],
          ['Conversor de divisas', '/co/account/'],
        ],
      },
    ],
  },
  Empresa: {
    to: '/co/business/',
    sections: [
      {
        title: 'Wise para Empresas',
        items: [
          ['Cuenta de empresa', '/co/business/'],
          ['Datos de cuenta global', '/co/business/'],
          ['Tarjetas de gasto', '/co/business/'],
        ],
      },
      {
        title: 'Herramientas',
        items: [
          ['Pagos por lotes', '/co/business/'],
          ['API de Wise', '/co/business/'],
          ['Integraciones contables', '/co/business/'],
        ],
      },
    ],
  },
  Plataforma: {
    to: '/platform/',
    sections: [
      {
        title: 'Wise Platform',
        items: [
          ['Para bancos', '/platform/'],
          ['Para empresas', '/platform/'],
          ['Casos de éxito', '/platform/'],
        ],
      },
    ],
  },
}

function MegaMenu({ data }) {
  return (
    <div className="invisible absolute left-1/2 top-full z-50 w-max -translate-x-1/2 pt-4 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
      <div className="grid grid-cols-2 gap-8 rounded-card-lg bg-white p-8 shadow-2xl ring-1 ring-black/5">
        {data.sections.map((sec) => (
          <div key={sec.title} className="min-w-[200px]">
            <p className="mb-3 text-sm font-semibold text-content-tertiary">{sec.title}</p>
            <ul className="space-y-2">
              {sec.items.map(([label, to]) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="block rounded-lg px-2 py-1.5 text-content-primary hover:bg-bg-neutral"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white">
      <nav className="container-wise flex h-[72px] items-center justify-between gap-6">
        {/* Izquierda */}
        <div className="flex items-center gap-8">
          <Link to="/" aria-label="Inicio Wise">
            <Logo />
          </Link>
          <ul className="hidden items-center gap-1 lg:flex">
            {Object.entries(menus).map(([label, data]) => (
              <li key={label} className="group relative">
                <Link
                  to={data.to}
                  className="flex items-center gap-1 rounded-lg px-3 py-2 font-semibold text-content-primary hover:bg-bg-neutral"
                >
                  {label}
                  <Icon name="chevronDown" size={16} className="transition-transform group-hover:rotate-180" />
                </Link>
                <MegaMenu data={data} />
              </li>
            ))}
          </ul>
        </div>

        {/* Derecha */}
        <div className="hidden items-center gap-2 lg:flex">
          <button className="flex items-center gap-1.5 rounded-lg px-3 py-2 font-semibold text-content-primary hover:bg-bg-neutral">
            <span className="inline-block h-4 w-4 overflow-hidden rounded-full">
              <img src="https://flagcdn.com/w40/co.png" alt="" className="h-full w-full object-cover" />
            </span>
            ES
          </button>
          <Link to="/help" className="rounded-lg px-3 py-2 font-semibold text-content-primary hover:bg-bg-neutral">
            Ayuda
          </Link>
          <Link to="/login" className="rounded-lg px-3 py-2 font-semibold text-content-primary hover:bg-bg-neutral">
            Inicia sesión
          </Link>
          <Link to="/register" className="btn-primary px-4 py-2">
            Regístrate
          </Link>
        </div>

        {/* Botón móvil */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-content-primary hover:bg-bg-neutral lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </nav>

      {/* Menú móvil */}
      {open && (
        <div className="border-t border-black/5 bg-white px-5 pb-6 pt-2 lg:hidden">
          <ul className="flex flex-col">
            {Object.entries(menus).map(([label, data]) => (
              <li key={label}>
                <Link
                  to={data.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between border-b border-black/5 py-4 font-semibold text-content-primary"
                >
                  {label}
                  <Icon name="chevronRight" size={18} />
                </Link>
              </li>
            ))}
            <li>
              <Link to="/help" onClick={() => setOpen(false)} className="flex items-center justify-between border-b border-black/5 py-4 font-semibold">
                Ayuda
              </Link>
            </li>
          </ul>
          <div className="mt-6 flex flex-col gap-3">
            <Link to="/login" onClick={() => setOpen(false)} className="btn-outline w-full">
              Inicia sesión
            </Link>
            <Link to="/register" onClick={() => setOpen(false)} className="btn-primary w-full">
              Regístrate
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
