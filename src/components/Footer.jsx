import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'

const columns = [
  {
    title: 'Productos',
    links: [
      ['Wise Personal', '/co/account/'],
      ['Wise para Empresas', '/co/business/'],
      ['Wise Platform', '/platform/'],
    ],
    sub: {
      title: 'Wise Personal',
      links: [
        ['Cuenta Wise', '/co/account/'],
        ['Transferencia internacional de dinero', '/send-money/send-money-to-spain'],
        ['Transferencia de gran cantidad', '/co/account/'],
        ['Recibe dinero', '/send-money/send-money-to-colombia'],
      ],
    },
  },
  {
    title: 'Recursos',
    links: [
      ['Conversor de divisas', '#'],
      ['Etiqueta de cotización internacional', '#'],
      ['Códigos Swift/BIC', '#'],
      ['Códigos IBAN', '#'],
      ['Alertas del tipo de cambio', '#'],
      ['Compara los tipos de cambio', '#'],
      ['Disponibilidad de funciones', '#'],
    ],
  },
  {
    title: 'Empresa y equipo',
    links: [
      ['Empresa y equipo', '#'],
      ['Noticias y blog', '#'],
      ['Seguridad', '#'],
      ['Prensa', '#'],
      ['Empleo', '#'],
      ['Relaciones con inversores', '#'],
      ['Nuestra misión', '#'],
      ['Socios y afiliados', '#'],
      ['Reseñas', '#'],
    ],
  },
  {
    title: 'Ayuda',
    links: [
      ['Sección de ayuda', '/help'],
      ['Estado del servicio', '#'],
    ],
  },
]

const socials = [
  ['Facebook', 'M14 9h3l.5-3H14V4.5c0-.9.3-1.5 1.6-1.5H18V.2C17.6.1 16.5 0 15.3 0 12.6 0 11 1.5 11 4.3V6H8v3h3v9h3V9z'],
  ['X', 'M13.8 10.5 21 2h-1.7l-6.2 7.3L8.2 2H2l7.5 11L2 22h1.7l6.6-7.7L15.8 22H22l-8.2-11.5zM5 3.3h2.6l11.4 16.4h-2.6L5 3.3z'],
  ['Instagram', 'M12 2c2.7 0 3 0 4.1.1 1 .1 1.6.2 2 .4.5.2.9.4 1.3.8.4.4.6.8.8 1.3.2.4.3 1 .4 2C20.7 7.7 20.7 8 20.7 12s0 4.3-.1 5.4c-.1 1-.2 1.6-.4 2-.2.5-.4.9-.8 1.3-.4.4-.8.6-1.3.8-.4.2-1 .3-2 .4-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-1-.1-1.6-.2-2-.4a3.4 3.4 0 0 1-1.3-.8 3.4 3.4 0 0 1-.8-1.3c-.2-.4-.3-1-.4-2C3.3 16.3 3.3 16 3.3 12s0-4.3.1-5.4c.1-1 .2-1.6.4-2 .2-.5.4-.9.8-1.3.4-.4.8-.6 1.3-.8.4-.2 1-.3 2-.4C9 2 9.3 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zm5.2-8.4a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z'],
  ['YouTube', 'M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 4 12 4 12 4s-7.5 0-9.4.4A3 3 0 0 0 .5 6.5 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.5 3 3 0 0 0 2.1 2.1C4.5 20 12 20 12 20s7.5 0 9.4-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.5zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z'],
]

export default function Footer() {
  return (
    <footer className="bg-bg-neutral">
      <div className="container-wise py-16">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-base font-semibold text-content-primary">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map(([label, to]) => (
                  <li key={label}>
                    {to.startsWith('/') ? (
                      <Link to={to} className="text-content-secondary hover:text-content-primary hover:underline">
                        {label}
                      </Link>
                    ) : (
                      <a href={to} className="text-content-secondary hover:text-content-primary hover:underline">
                        {label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
              {col.sub && (
                <div className="mt-8">
                  <h4 className="mb-4 text-base font-semibold text-content-primary">{col.sub.title}</h4>
                  <ul className="space-y-3">
                    {col.sub.links.map(([label, to]) => (
                      <li key={label}>
                        <Link to={to} className="text-content-secondary hover:text-content-primary hover:underline">
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        <hr className="my-10 border-black/10" />

        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <Link to="/" aria-label="Inicio Wise">
            <Logo height={30} />
          </Link>
          <div className="flex items-center gap-5">
            {socials.map(([label, d]) => (
              <a key={label} href="#" aria-label={label} className="text-forest hover:opacity-70">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={d} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 space-y-4 text-sm leading-relaxed text-content-tertiary">
          <p>© Wise Payments Limited 2026</p>
          <p>
            Wise está autorizado por la Financial Conduct Authority del Reino Unido según las regulaciones de dinero
            electrónico de 2011, bajo número de referencia 900507 para la emisión de dinero electrónico.
          </p>
          <p>
            Este clon es un proyecto educativo/de práctica sin afiliación con Wise Payments Limited.
          </p>
        </div>
      </div>
    </footer>
  )
}
