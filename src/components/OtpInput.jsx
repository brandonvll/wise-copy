import { useRef } from 'react'

// Campo de código de N dígitos (cuadritos) con auto-avance y pegado.
export default function OtpInput({ value, onChange, length = 6 }) {
  const refs = useRef([])

  const setDigit = (i, v) => {
    const d = v.replace(/\D/g, '').slice(-1)
    const arr = value.split('')
    arr[i] = d
    onChange(arr.join('').slice(0, length))
    if (d && i < length - 1) refs.current[i + 1]?.focus()
  }
  const onKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) refs.current[i - 1]?.focus()
  }
  const onPaste = (e) => {
    const t = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (t) {
      onChange(t)
      refs.current[Math.min(t.length, length - 1)]?.focus()
      e.preventDefault()
    }
  }

  return (
    <div className="flex justify-center gap-2 sm:gap-3" onPaste={onPaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={value[i] || ''}
          onChange={(e) => setDigit(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          autoFocus={i === 0}
          aria-label={`Dígito ${i + 1}`}
          className="h-14 w-11 rounded-xl border-2 border-black/15 text-center text-2xl font-bold text-content-primary outline-none transition-colors focus:border-forest sm:w-12"
        />
      ))}
    </div>
  )
}
