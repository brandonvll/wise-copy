import { Link } from 'react-router-dom'
import Calculator from '../components/Calculator.jsx'
import Icon from '../components/Icon.jsx'
import { BalanceCard, PhoneMock, Photo } from '../components/Mockups.jsx'
import Testimonials from '../sections/Testimonials.jsx'
import CountriesSection from '../sections/CountriesSection.jsx'
import FlagStrip from '../sections/FlagStrip.jsx'

const trust = [
  { icon: 'users', title: 'Con la confianza de millones que mueven millones', text: 'Movemos 12 mil millones de GBP en todo el mundo cada mes.' },
  { icon: 'star', title: 'Calificación excelente en Trustpilot', text: 'Wise tiene una calificación media de 4,3 estrellas en más de 293 mil reseñas.' },
  { icon: 'headset', title: 'Atención al cliente especializada', text: 'Obtén ayuda de nuestros expertos por teléfono, correo electrónico o chat.' },
]

const security = [
  { icon: 'lock', text: 'Nuestros equipos de fraude y seguridad trabajan para que tu dinero esté seguro' },
  { icon: 'key', text: 'Utilizamos la autenticación de 2 factores para proteger tu cuenta' },
  { icon: 'bank', text: 'Mantenemos tu dinero en instituciones financieras establecidas' },
]

// Ícono App Store (cuadrado azul + "A" blanca).
const AppStoreIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
    <rect width="24" height="24" rx="6" fill="#0D96F6" />
    <path d="M7 17l5-9 5 9M9.3 14h5.4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
)

// Ícono Google Play (triángulo de 4 colores).
const GooglePlayIcon = () => (
  <svg width="20" height="22" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
    <polygon points="3.5,2 3.5,12 13.5,12" fill="#00C3FF" />
    <polygon points="3.5,12 3.5,22 13.5,12" fill="#00E676" />
    <polygon points="3.5,2 13.5,12 20.5,8" fill="#FFCE00" />
    <polygon points="3.5,22 13.5,12 20.5,16" fill="#FF4257" />
  </svg>
)

const Rating = ({ icon, score, store, reviews }) => (
  <span className="flex items-center gap-2">
    {icon}
    <span className="inline-flex items-center gap-1 font-bold text-content-primary">
      {score} <Icon name="star" size={13} filled /> en {store}
    </span>
    <span className="text-content-secondary">{reviews}</span>
  </span>
)

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="container-wise grid items-center gap-12 py-16 md:grid-cols-2 md:py-24 lg:gap-20">
        <div>
          <div className="mb-8 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:gap-x-8 sm:gap-y-2">
            <Rating icon={<AppStoreIcon />} score="4,8" store="App Store" reviews="152 mil reseñas" />
            <Rating icon={<GooglePlayIcon />} score="4,8" store="Google Play" reviews="1,3 M reseñas" />
          </div>
          <h1 className="display-hero mb-6" style={{ fontSize: 'clamp(2.25rem, 3.8vw, 3.75rem)' }}>Envía dinero globalmente por menos</h1>
          <p className="mb-8 max-w-md text-lg text-content-secondary">
            Mueve tu dinero a donde importa. Ahorra en transferencias internacionales y gasta dinero en todo el mundo, sin comisiones ocultas.
          </p>
          <Link to="/register" className="btn-primary px-8 py-4 text-lg">Abre una cuenta</Link>
        </div>
        <div className="flex justify-center md:justify-end">
          <Calculator />
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="container-wise border-t border-black/5 py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-3">
          {trust.map((t) => (
            <div key={t.title}>
              <Icon name={t.icon} size={28} className="mb-4 text-content-primary" />
              <h4 className="mb-2 text-lg font-semibold">{t.title}</h4>
              <p className="text-content-secondary">{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMISIONES OCULTAS (verde) */}
      <section className="bg-bright-green py-20 md:py-32">
        <div className="container-wise text-center">
          <h2 className="display-h2-caps mx-auto mb-5 max-w-4xl text-forest">No vuelvas a pagar comisiones ocultas</h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-forest/80">
            Los bancos y otros proveedores inflan los tipos de cambio para que pagues más. Nosotros, no: te invitamos a que lo compruebes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link to="/register" className="btn-dark px-7 py-3.5">Envía dinero ahora</Link>
            <Link to="/send-money/send-money-to-spain" className="btn-link text-forest">Descubre cómo enviar dinero</Link>
          </div>

          {/* Comparativa Wise vs competidores */}
          <div className="mx-auto mt-12 grid max-w-4xl gap-px overflow-hidden rounded-card-lg bg-black/10 text-left md:grid-cols-2">
            <div className="bg-bright-green p-8">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest text-bright-green font-black">w</span>
                <span className="font-semibold text-forest">Wise</span>
              </div>
              <p className="text-forest/90">
                Wise siempre te da el tipo de cambio medio del mercado. Sin precios inflados, sin beneficios ocultos. La tarifa más justa, siempre.
              </p>
            </div>
            <div className="bg-[#eaf7df] p-8">
              <div className="mb-4 flex items-center gap-2">
                <Icon name="bank" size={24} className="text-content-secondary" />
                <span className="font-semibold text-content-primary">Competidores</span>
              </div>
              <p className="text-content-secondary">
                La mayoría de los proveedores ocultan sus comisiones en el tipo de cambio. Compara su tarifa con la de Wise, ¿hay alguna diferencia? Ese es su margen de beneficio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HAZ MÁS CON WISE */}
      <section className="bg-bg-neutral py-20 md:py-32">
        <div className="container-wise text-center">
          <h2 className="display-h2 mb-4">Haz más con Wise en Colombia</h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-content-secondary">
            Puedes usar Wise para mucho más que enviar dinero. Tienes estas opciones, dependiendo de dónde vivas.
          </p>
          <Link to="/register" className="btn-primary px-7 py-3.5">Abre una cuenta</Link>

          <div className="mx-auto mt-12 max-w-lg rounded-card-lg bg-white p-10 text-center shadow-sm">
            <div className="mb-8 flex justify-center">
              <BalanceCard className="w-64" />
            </div>
            <h3 className="display-h2 mb-3 text-3xl">Recibe dinero rápidamente</h3>
            <p className="mx-auto mb-5 max-w-sm text-content-secondary">
              Recibe pagos fácilmente en otras divisas con los datos de cuenta global.
            </p>
            <div className="mb-6 flex items-center justify-center gap-2 font-semibold text-content-primary">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-forest text-bright-green">
                <Icon name="check" size={12} stroke={3} />
              </span>
              <Link to="/send-money/send-money-to-colombia" className="underline underline-offset-4">22 divisas</Link>
            </div>
            <Link to="/send-money/send-money-to-colombia" className="btn-outline">Descubre cómo recibir pagos</Link>
          </div>
        </div>
      </section>

      {/* PENSADO PARA EMPRESAS (dark) */}
      <section className="container-wise py-20 md:py-32">
        <div className="rounded-card-lg bg-forest px-6 py-16 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-forest-dark/40 text-bright-green">
            <Icon name="briefcase" size={26} />
          </div>
          <h2 className="display-h2-caps mx-auto mb-5 max-w-3xl text-bright-green">Pensado también para empresas</h2>
          <p className="mx-auto mb-8 max-w-xl text-bright-green/80">
            Hazte global con nuestra cuenta de empresa internacional. Haz pagos y recibe pagos en más de 40 divisas. Únete a más de 700.000 empresas que prosperan con Wise.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link to="/co/business/" className="btn-primary px-7 py-3.5">Prueba la demo</Link>
            <Link to="/co/business/" className="btn-link text-bright-green">Más información</Link>
          </div>
        </div>
      </section>

      {/* PROTÉGETE CONTRA LAS ESTAFAS */}
      <section className="container-wise py-12 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="display-h2 mb-5">Protégete contra las estafas</h2>
            <p className="mb-6 max-w-md text-lg text-content-secondary">
              Cada mes, millones de nuestros clientes personales y de empresa confían en nosotros para transferir más de 12 mil millones de GBP.
            </p>
            <Link to="#" className="btn-primary px-6 py-3">Cómo protegemos tu dinero</Link>
          </div>
          <img
            src="/lock-large@2x.webp"
            alt="Ilustración con el bloqueo de acceso"
            className="mx-auto w-full max-w-md"
          />
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
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

      {/* Tira de banderas con animación al scroll */}
      <FlagStrip />

      {/* MUEVE TU DINERO POR TODO EL MUNDO */}
      <section className="container-wise grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
        <div className="order-2 flex justify-center md:order-1">
          <PhoneMock />
        </div>
        <div className="order-1 md:order-2">
          <h2 className="display-h2 mb-5">Mueve tu dinero por todo el mundo</h2>
          <p className="mb-8 max-w-md text-lg text-content-secondary">
            Ahorra dinero al enviar, gastar y recibir pagos en diferentes divisas. Todo lo que necesitas, en una sola cuenta, siempre que lo necesites.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Link to="/register" className="btn-primary px-7 py-3.5">Empieza</Link>
            <Link to="/co/account/" className="btn-link">Explora la cuenta Wise</Link>
          </div>
        </div>
      </section>

      {/* RECIBE PAGOS EN DIFERENTES DIVISAS */}
      <section className="container-wise grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
        <div>
          <h2 className="display-h2 mb-5">Recibe pagos en diferentes divisas rápidamente</h2>
          <p className="mb-8 max-w-md text-lg text-content-secondary">
            Solicita y recibe dinero directamente con Wise, y recibe pagos fácilmente con datos de cuenta en las principales divisas. Es aún más fácil cuando sincronizas tus contactos.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Link to="/register" className="btn-primary px-7 py-3.5">Empieza</Link>
            <Link to="/send-money/send-money-to-colombia" className="btn-link">Más información sobre recibir dinero</Link>
          </div>
        </div>
        <Photo src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80" alt="Recibe pagos" className="aspect-square w-full" />
      </section>

      {/* TESTIMONIOS */}
      <Testimonials />

      {/* DINERO SIN FRONTERAS */}
      <section className="container-wise py-20 text-center md:py-32">
        <img
          src="/globe-large@2x.webp"
          alt=""
          className="mx-auto mb-10 w-full max-w-2xl"
        />
        <h2 className="display-h2 mx-auto mb-6 max-w-2xl">Descubre el dinero sin fronteras</h2>
        <Link to="#" className="btn-outline">Conoce nuestra misión</Link>
      </section>

      {/* DESCARGA LA APP */}
      <section className="bg-forest py-20 md:py-32">
        <div className="container-wise grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="display-h2-caps mb-6 text-bright-green">Descarga la app para gestionar tu dinero estés donde estés</h2>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="inline-flex items-center gap-3 rounded-xl bg-black px-5 py-3 text-white">
                <span className="text-2xl"></span>
                <span className="text-left text-sm leading-tight">Descárgala en el<br /><span className="text-lg font-semibold">App Store</span></span>
              </a>
              <a href="#" className="inline-flex items-center gap-3 rounded-xl bg-black px-5 py-3 text-white">
                <span className="text-2xl">▶</span>
                <span className="text-left text-sm leading-tight">Disponible en<br /><span className="text-lg font-semibold">Google Play</span></span>
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <PhoneMock className="!border-bright-green/20" />
          </div>
        </div>
      </section>

      {/* PAÍSES */}
      <CountriesSection />
    </>
  )
}
