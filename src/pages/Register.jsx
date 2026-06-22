import { Link } from 'react-router-dom'
import AuthHeader from '../components/AuthHeader.jsx'
import Icon from '../components/Icon.jsx'

// Registro por invitación: las cuentas las crea el administrador.
// Esta página solo informa y dirige al inicio de sesión por código.
export default function Register() {
  return (
    <div className="min-h-screen bg-white">
      <AuthHeader />
      <div className="mx-auto w-full max-w-[440px] px-5 py-12 md:py-16">
        <div className="mb-6 flex justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-bright-green/30 text-forest">
            <Icon name="lock" size={30} />
          </span>
        </div>

        <h1 className="mb-3 text-center text-[1.75rem] font-bold leading-tight text-content-primary">
          El registro es por invitación
        </h1>
        <p className="mb-8 text-center text-content-secondary">
          Las cuentas las crea el administrador. Si ya tienes una cuenta creada para ti,
          entra con tu correo y te enviaremos un código para crear tu contraseña.
        </p>

        <Link to="/login" className="btn-primary flex w-full items-center justify-center py-4">
          Ir a iniciar sesión
        </Link>

        <div className="mt-6 text-center">
          <Link to="/login" className="font-semibold text-content-primary underline underline-offset-4">
            Entrar con un código
          </Link>
        </div>

        <p className="mt-8 text-center text-sm text-content-tertiary">
          ¿No tienes acceso? Solicítale al administrador que cree tu cuenta.
        </p>
      </div>
    </div>
  )
}
