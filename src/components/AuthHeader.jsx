import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'

// Header minimal para páginas de autenticación: logo + cerrar (X → home).
export default function AuthHeader() {
  return (
    <header className="border-b border-black/10">
      <div className="mx-auto flex h-[88px] w-full max-w-[1100px] items-center justify-between px-6 sm:px-8">
        <Link to="/" aria-label="Inicio Wise">
          <Logo height={26} />
        </Link>
        <Link to="/" aria-label="Cerrar" className="text-content-primary transition-opacity hover:opacity-60">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </Link>
      </div>
    </header>
  )
}
