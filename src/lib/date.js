// "2026-06-22" -> "Jun 22" (mes en 3 letras + día)
export const shortDate = (d) => {
  try {
    return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } catch {
    return d
  }
}
