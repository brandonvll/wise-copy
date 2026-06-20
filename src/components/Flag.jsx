import { flagUrl } from '../data/countries.js'

// Bandera circular al estilo Wise.
export default function Flag({ iso, size = 40, className = '' }) {
  return (
    <span
      className={`inline-block overflow-hidden rounded-full bg-bg-neutral ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={flagUrl(iso)}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover"
      />
    </span>
  )
}
