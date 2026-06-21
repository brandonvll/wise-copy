// QR flotante fijo (abajo a la derecha) sobre toda la página.
// Decorativo por ahora: no navega a ningún lado.
export default function FloatingQR() {
  // Oculto por ahora (a pedido). Para reactivar: quitar este return null.
  return null

  // eslint-disable-next-line no-unreachable
  return (
    <div
      className="fixed bottom-5 right-5 z-40 hidden select-none items-center gap-3 rounded-2xl bg-forest p-3 shadow-xl md:flex"
      aria-hidden="true"
    >
      <img
        src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https%3A%2F%2Fwise.com&color=9FE870&bgcolor=163300&margin=4"
        alt=""
        className="h-16 w-16 rounded-lg"
        draggable="false"
      />
      <span className="pr-1 text-sm font-semibold leading-tight text-bright-green">
        Descarga la<br />app de Wise
      </span>
    </div>
  )
}
