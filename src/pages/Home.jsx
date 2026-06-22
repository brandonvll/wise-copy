import { Link } from 'react-router-dom'
import Calculator from '../components/Calculator.jsx'
import Icon from '../components/Icon.jsx'
import { BalanceCard } from '../components/Mockups.jsx'
import AnimatedPhone from '../components/AnimatedPhone.jsx'
import ReelColumn from '../components/ReelColumn.jsx'
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

// Badge Wise: círculo forest con la bandera del logo.
const WiseBadge = () => (
  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest">
    <svg width="16" height="15" viewBox="0 0 21 20" fill="none" aria-hidden="true">
      <path d="M5.5255 6.1532 0 12.6107h9.8661l1.1086-3.0449H6.747l2.5832-2.9868.0083-.0792L7.6588 3.6085h7.5569l-5.8579 16.1179h4.0087L20.4402.2989H2.166L5.5255 6.1532Z" fill="#9FE870" />
    </svg>
  </span>
)

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="container-wise grid items-center gap-10 py-10 lg:grid-cols-2 lg:gap-20 lg:py-24">
        {/* Columna de texto — solo desktop */}
        <div className="hidden lg:block">
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

        <div className="flex flex-col items-center gap-8 lg:justify-end">
          {/* Hero verde — solo móvil y tablet */}
          <div className="w-full max-w-md overflow-hidden rounded-card-lg bg-gradient-to-b from-[#1c4010] to-forest p-7 text-white lg:hidden">
            <h2 className="text-center font-display text-[2rem] font-black uppercase leading-[0.95] text-bright-green">Envía de forma segura a más de 140 países</h2>
            <p className="mt-5 text-center text-white/90">Consulta nuestras comisiones y tiempos de envío a:</p>
            <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3">
              <span className="flex items-center gap-3">
                <img src="https://flagcdn.com/w80/de.png" alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
                <span className="text-lg font-bold text-content-primary">Alemania</span>
              </span>
              <button className="shrink-0 rounded-pill bg-bright-green px-5 py-2 font-semibold text-forest">Cambiar</button>
            </div>
          </div>

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

      {/* COMISIONES OCULTAS (verde) — ocupa toda la pantalla */}
      <section className="flex min-h-screen flex-col items-center justify-center bg-bright-green py-16">
        <div className="container-wise text-center">
          <h2
            className="mx-auto mb-6 font-display font-black uppercase leading-[1.05] tracking-[-0.01em] text-forest"
            style={{ fontSize: 'clamp(1.5rem, 4.6vw, 4rem)' }}
          >
            No vuelvas a pagar comisiones ocultas
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-forest/80">
            Los bancos y otros proveedores inflan los tipos de cambio para que pagues más. Nosotros, no: te invitamos a que lo compruebes.
          </p>
          <div className="mb-12 flex flex-wrap items-center justify-center gap-5">
            <Link to="/register" className="btn-dark px-7 py-3.5">Envía dinero ahora</Link>
            <Link to="/send-money/send-money-to-spain" className="btn-link text-forest">Descubre cómo enviar dinero</Link>
          </div>

          {/* Widget comparador */}
          <div className="mx-auto max-w-[1120px] rounded-card-lg bg-white p-6 text-left shadow-sm md:p-8">
            {/* Inputs */}
            <div className="mb-5 grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-content-primary">Cantidad</label>
                <input
                  type="text"
                  defaultValue="1000"
                  className="w-full rounded-xl border border-black/15 px-4 py-3 font-medium text-content-primary outline-none focus:border-forest"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-content-primary">De</label>
                <div className="flex items-center gap-2 rounded-xl border border-black/15 px-3 py-3">
                  <span className="h-6 w-6 shrink-0 overflow-hidden rounded-full">
                    <img src="https://flagcdn.com/w80/us.png" alt="" className="h-full w-full object-cover" />
                  </span>
                  <span className="font-semibold text-content-primary">USD</span>
                  <span className="truncate text-sm text-content-tertiary">Dólar estadounidense</span>
                  <Icon name="chevronDown" size={18} className="ml-auto shrink-0 text-content-primary" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-content-primary">A</label>
                <div className="flex items-center gap-2 rounded-xl border border-black/15 px-3 py-3">
                  <span className="h-6 w-6 shrink-0 overflow-hidden rounded-full">
                    <img src="https://flagcdn.com/w80/eu.png" alt="" className="h-full w-full object-cover" />
                  </span>
                  <span className="font-semibold text-content-primary">EUR</span>
                  <span className="truncate text-sm text-content-tertiary">Euro</span>
                  <Icon name="chevronDown" size={18} className="ml-auto shrink-0 text-content-primary" />
                </div>
              </div>
            </div>

            {/* Barra informativa */}
            <div className="mb-6 flex items-center gap-3 rounded-xl bg-bg-neutral px-4 py-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest text-xs font-bold text-white">i</span>
              <p className="text-sm text-content-secondary">
                No disponemos de información comparativa para el importe o la ruta monetaria seleccionados.
              </p>
            </div>

            {/* Comparación Wise vs Competidores */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-bright-green/40 p-8 text-center">
                <div className="mb-4 flex items-center justify-center gap-2">
                  <WiseBadge />
                  <span className="font-semibold text-content-primary">Wise</span>
                </div>
                <hr className="mb-5 border-forest/20" />
                <p className="text-content-secondary">
                  Wise siempre te da el tipo de cambio medio del mercado. Sin precios inflados, sin beneficios ocultos. La tarifa más justa, siempre.
                </p>
              </div>
              <div className="rounded-2xl p-8 text-center">
                <div className="mb-4 flex items-center justify-center gap-2">
                  <Icon name="bank" size={24} className="text-content-secondary" />
                  <span className="font-semibold text-content-primary">Competidores</span>
                </div>
                <hr className="mb-5 border-black/10" />
                <p className="text-content-secondary">
                  La mayoría de los proveedores ocultan sus comisiones en el tipo de cambio. Compara su tarifa con la de Wise, ¿hay alguna diferencia? Ese es su margen de beneficio.
                </p>
              </div>
            </div>
          </div>

          {/* Pie */}
          <p className="mx-auto mt-6 text-sm text-forest/80">
            Usamos el tipo de cambio medio y real del mercado sin inflar los precios para ocultar las comisiones.{' '}
            <a href="#" className="font-semibold underline underline-offset-2">Más información</a>
          </p>
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
        <div className="order-2 md:order-1">
          <AnimatedPhone />
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
        <ReelColumn />
      </section>

      {/* TESTIMONIOS */}
      <Testimonials />

      {/* DINERO SIN FRONTERAS */}
      <section className="container-wise pb-16 pt-32 md:pb-20 md:pt-44">
        <div className="relative">
          {/* Tarjeta verde oscuro */}
          <div className="relative flex min-h-[640px] flex-col items-center justify-center overflow-hidden rounded-card-lg bg-forest px-6 pb-24 pt-40 text-center md:min-h-[760px]">
            <h2
              className="mx-auto mb-6 max-w-[640px] font-display font-black uppercase leading-[0.98] tracking-[-0.01em] text-bright-green"
              style={{ fontSize: 'clamp(3rem, 8.5vw, 6.5rem)' }}
            >
              Descubre el dinero sin fronteras
            </h2>
            <p className="mx-auto mb-9 max-w-xl text-lg text-white/80">
              Estamos creando la mejor manera de mover y administrar el dinero del mundo. Menos comisiones. Más fácil. Más rápido.
            </p>
            <Link to="#" className="btn-primary px-8 py-4 text-lg">Conoce nuestra misión</Link>
          </div>

          {/* Globo sobresaliendo por el borde superior */}
          <img
            src="/globe-large@2x.webp"
            alt=""
            className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-[42%]"
            style={{ width: 'clamp(240px, 30vw, 440px)' }}
          />
        </div>
      </section>

      {/* DESCARGA LA APP */}
      <section
        className="py-10 md:py-16"
        style={{
          background:
            'radial-gradient(circle at 12% 28%, #f7c2e2 0%, transparent 42%), radial-gradient(circle at 88% 22%, #aec6ff 0%, transparent 42%), radial-gradient(circle at 78% 82%, #f3aed4 0%, transparent 48%), radial-gradient(circle at 22% 85%, #c7b6f3 0%, transparent 45%), linear-gradient(135deg, #f4cfe6, #cdd6ff)',
        }}
      >
        <div className="container-wise">
          <div className="rounded-[2rem] bg-white px-6 py-16 text-center md:px-12 md:py-24">
            {/* Ratings */}
            <div className="mb-10 flex flex-col items-center justify-center gap-3 text-sm sm:flex-row sm:gap-10">
              <Rating icon={<AppStoreIcon />} score="4,8" store="App Store" reviews="152 mil reseñas" />
              <Rating icon={<GooglePlayIcon />} score="4,8" store="Google Play" reviews="1,3 M reseñas" />
            </div>

            {/* Título */}
            <h2
              className="mx-auto mb-12 max-w-[820px] font-display font-black uppercase leading-[0.98] tracking-[-0.01em] text-content-primary"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              Descarga la app para gestionar tu dinero estés donde estés
            </h2>

            {/* Caja de escaneo QR */}
            <div className="mx-auto mb-10 flex w-max items-center gap-5 rounded-2xl border border-black/15 p-5">
              <span className="text-left text-lg font-semibold leading-tight text-content-primary">
                Escanea<br />para<br />obtener<br />Wise
              </span>
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https%3A%2F%2Fwise.com&margin=2"
                alt="QR para obtener Wise"
                className="h-28 w-28"
              />
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="#" className="inline-flex items-center gap-3 rounded-xl bg-black px-5 py-2.5 text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.05 12.5c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.1-2.01-3.77-2.04-1.6-.16-3.13.94-3.94.94-.81 0-2.07-.92-3.4-.9-1.75.03-3.36 1.02-4.26 2.58-1.82 3.16-.47 7.83 1.3 10.4.86 1.25 1.89 2.66 3.23 2.61 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.38.81 1.4-.02 2.28-1.27 3.13-2.53.99-1.45 1.4-2.86 1.42-2.93-.03-.01-2.72-1.05-2.75-4.16zM14.6 4.84c.72-.87 1.2-2.08 1.07-3.28-1.03.04-2.28.69-3.02 1.55-.66.77-1.24 2-1.08 3.18 1.15.09 2.32-.58 3.03-1.45z" />
                </svg>
                <span className="text-left text-[11px] leading-tight">Consíguelo en el<br /><span className="text-lg font-semibold">App Store</span></span>
              </a>
              <a href="#" className="inline-flex items-center gap-3 rounded-xl bg-black px-5 py-2.5 text-white">
                <GooglePlayIcon />
                <span className="text-left text-[11px] leading-tight">DISPONIBLE EN<br /><span className="text-lg font-semibold">Google Play</span></span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PAÍSES */}
      <CountriesSection />
    </>
  )
}
