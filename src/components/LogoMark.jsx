// Símbolo de marca de Wise (la "bandera"/flecha), sin la palabra wise.
export default function LogoMark({ className = '', color = '#163300', height = 20 }) {
  const width = Math.round((height * 21) / 20)
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Wise">
      <path fill={color} d="M5.5255 6.1532 0 12.6107h9.8661l1.1086-3.0449H6.747l2.5832-2.9868.0083-.0792L7.6588 3.6085h7.5569l-5.8579 16.1179h4.0087L20.4402.2989H2.166L5.5255 6.1532Z" />
    </svg>
  )
}
