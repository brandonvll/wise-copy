// Número de cuenta por defecto: 15 dígitos estables derivados del id del usuario.
// Es solo un valor inicial; el admin puede editarlo (se guarda en accounts.account_number).
export const accountNumberFor = (id = '') => {
  const s = String(id)
  let out = ''
  for (let i = 0; i < (s.length || 1); i++) out += String(s.charCodeAt(i) || 0)
  out = out.replace(/\D/g, '')
  while (out.length < 15) out += out
  return out.slice(0, 15)
}
