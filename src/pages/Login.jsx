import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')

  return (
    <section className="container-wise flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <h1 className="display-h2 mb-8 text-center text-4xl">Inicia sesión</h1>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="mb-1 block text-sm font-semibold text-content-primary">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              className="w-full rounded-xl border border-black/15 px-4 py-3 outline-none focus:border-forest"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-content-primary">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-black/15 px-4 py-3 outline-none focus:border-forest"
            />
          </div>
          <button type="submit" className="btn-primary w-full py-3.5">Inicia sesión</button>
        </form>
        <div className="mt-5 text-center">
          <Link to="#" className="btn-link text-base">¿Olvidaste tu contraseña?</Link>
        </div>
        <p className="mt-8 text-center text-content-secondary">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="font-semibold text-forest underline underline-offset-4">Regístrate</Link>
        </p>
      </div>
    </section>
  )
}
