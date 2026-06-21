import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import Icon from './Icon.jsx'
import { Photo } from './Mockups.jsx'

const menus = {
  Personal: {
    to: '/co/account/',
    featured: {
      img: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80',
      title: 'Cuenta Wise',
      desc: 'La cuenta internacional para enviar, gastar y convertir dinero como un local.',
      to: '/co/account/',
    },
    columns: [
      {
        title: 'Funciones',
        items: [
          { icon: 'arrowUp', label: 'Envía dinero', to: '/send-money/send-money-to-spain' },
          { icon: 'arrowUpRight', label: 'Envía cantidades grandes', to: '/co/account/' },
          { icon: 'arrowDown', label: 'Recibe dinero', to: '/send-money/send-money-to-colombia' },
        ],
      },
      {
        title: 'Precios',
        items: [{ label: 'Precios para clientes personales', to: '/co/account/' }],
      },
    ],
  },
  Empresa: {
    to: '/co/business/',
    featured: {
      img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
      title: 'Wise para Empresas',
      desc: 'La única cuenta que tu empresa emergente o en expansión necesita para prosperar a nivel internacional.',
      to: '/co/business/',
    },
    columns: [
      {
        title: 'Funciones',
        items: [
          { icon: 'card', label: 'Cuenta de empresa', to: '/co/business/' },
          { icon: 'globe', label: 'Datos de cuenta global', to: '/co/business/' },
          { icon: 'users', label: 'Tarjetas de gasto', to: '/co/business/' },
          { icon: 'doc', label: 'Pagos por lotes', to: '/co/business/' },
        ],
      },
      {
        title: 'Precios',
        items: [{ label: 'Precios para empresas', to: '/co/business/' }],
      },
    ],
  },
  Plataforma: {
    to: '/platform/',
    featured: {
      img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
      title: 'Wise Platform',
      desc: 'Donde bancos, instituciones financieras y empresas pueden conectarse a nuestra red.',
      to: '/platform/',
    },
    columns: [
      {
        title: 'Soluciones',
        items: [
          { icon: 'bank', label: 'Para bancos', to: '/platform/' },
          { icon: 'briefcase', label: 'Para empresas', to: '/platform/' },
          { icon: 'globe', label: 'Casos de éxito', to: '/platform/' },
        ],
      },
      {
        title: 'Desarrolladores',
        items: [{ label: 'Documentación de la API', to: '/platform/' }],
      },
    ],
  },
}

function MegaContent({ data, onNavigate }) {
  return (
    <div className="container-wise grid grid-cols-1 gap-8 py-8 md:grid-cols-12">
      {/* Tarjeta destacada */}
      <Link
        to={data.featured.to}
        onClick={onNavigate}
        className="group overflow-hidden rounded-2xl border border-black/10 transition-shadow hover:shadow-lg md:col-span-3"
      >
        <Photo src={data.featured.img} className="aspect-[4/3] w-full !rounded-none" rounded="" />
        <div className="p-5">
          <h3 className="mb-2 font-display text-2xl font-black uppercase leading-tight text-content-primary">
            {data.featured.title}
          </h3>
          <p className="mb-4 text-sm text-content-secondary">{data.featured.desc}</p>
          <span className="inline-flex items-center gap-1 font-semibold text-content-primary group-hover:text-forest">
            Explorar <Icon name="arrowRight" size={18} className="transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>

      {/* Columnas */}
      {data.columns.map((col) => (
        <div key={col.title} className="md:col-span-3">
          <p className="mb-4 border-b border-black/10 pb-3 text-content-tertiary">{col.title}</p>
          <ul className="space-y-1">
            {col.items.map((it) => (
              <li key={it.label}>
                <Link
                  to={it.to}
                  onClick={onNavigate}
                  className="flex items-center gap-3 rounded-lg py-2 text-content-primary hover:text-forest"
                >
                  {it.icon && (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bright-green/30 text-forest">
                      <Icon name={it.icon} size={18} />
                    </span>
                  )}
                  <span className="font-semibold">{it.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false) // menú móvil
  const [active, setActive] = useState(null) // megamenú activo (desktop)

  return (
    <header
      className="sticky top-0 z-50 bg-white"
      onMouseLeave={() => setActive(null)}
    >
      <nav className="container-wise flex h-[72px] items-center justify-between gap-6">
        {/* Izquierda */}
        <div className="flex items-center gap-8">
          <Link to="/" aria-label="Inicio Wise" onMouseEnter={() => setActive(null)}>
            <Logo />
          </Link>
          <ul className="hidden items-center gap-1 lg:flex">
            {Object.entries(menus).map(([label, data]) => (
              <li key={label}>
                <Link
                  to={data.to}
                  onMouseEnter={() => setActive(label)}
                  onClick={() => setActive(null)}
                  className={`flex items-center rounded-pill px-4 py-2 font-semibold transition-colors ${
                    active === label
                      ? 'bg-bright-green/40 text-forest'
                      : 'text-content-primary hover:bg-bg-neutral'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Derecha */}
        <div className="hidden items-center gap-2 lg:flex" onMouseEnter={() => setActive(null)}>
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

      {/* Megamenú full-width (desktop) */}
      {active && menus[active] && (
        <div
          className="absolute left-0 right-0 top-full hidden border-t border-black/5 bg-white shadow-xl lg:block"
          style={{ animation: 'megaIn 0.15s ease-out' }}
        >
          <MegaContent data={menus[active]} onNavigate={() => setActive(null)} />
        </div>
      )}

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
