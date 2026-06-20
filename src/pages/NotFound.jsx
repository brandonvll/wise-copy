import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="container-wise flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="mb-4 font-display text-7xl font-black text-bright-green">404</p>
      <h1 className="display-h2 mb-4">Página no encontrada</h1>
      <p className="mb-8 max-w-md text-content-secondary">
        Lo sentimos, no pudimos encontrar la página que buscas. Puede que se haya movido o ya no exista.
      </p>
      <Link to="/" className="btn-primary px-7 py-3.5">Volver al inicio</Link>
    </section>
  )
}
