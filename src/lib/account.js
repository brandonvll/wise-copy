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

// Valores por defecto de los datos bancarios (editables por el admin por usuario).
export const ACCOUNT_DEFAULTS = {
  account_type: 'Deposit',
  routing_number: '084009519',
  address: 'Wise US Inc, 108 W 13th St, Wilmington, DE, 19801, United States',
  swift_bic: 'TRWIUS35XXX',
  card_last4: '1043',
  card_number: '',
  card_exp: '09/29',
  card_cvv: '123',
  contact_email: '',
  modal_message: 'Por tu seguridad, esta operación requiere verificación. Comunícate con tu asesor para completarla.',
}

// Construye el objeto de cuenta para el estado, con defaults cuando falta el dato.
export const buildAccount = (a, uid) => ({
  id: a?.id || null,
  currency: a?.currency || 'USD',
  balance: a?.balance ?? 0,
  account_number: a?.account_number || accountNumberFor(uid),
  account_type: a?.account_type || ACCOUNT_DEFAULTS.account_type,
  routing_number: a?.routing_number || ACCOUNT_DEFAULTS.routing_number,
  address: a?.address || ACCOUNT_DEFAULTS.address,
  swift_bic: a?.swift_bic || ACCOUNT_DEFAULTS.swift_bic,
  card_last4: a?.card_last4 || ACCOUNT_DEFAULTS.card_last4,
  card_number: a?.card_number || '',
  card_exp: a?.card_exp || ACCOUNT_DEFAULTS.card_exp,
  card_cvv: a?.card_cvv || ACCOUNT_DEFAULTS.card_cvv,
  contact_email: a?.contact_email || '',
  modal_message: a?.modal_message || ACCOUNT_DEFAULTS.modal_message,
})

// Últimos 4 dígitos: del número completo si existe, si no del campo card_last4.
export const last4Of = (acct) => {
  const digits = String(acct?.card_number || acct?.card_last4 || '1043').replace(/\D/g, '')
  return digits.slice(-4) || '1043'
}

// Formatea el número de tarjeta en grupos de 4: "4234 5678 9012 1043"
export const formatCardNumber = (num) => String(num || '').replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim()
