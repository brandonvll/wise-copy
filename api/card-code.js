import crypto from 'node:crypto'

// Firma HMAC: el token que se devuelve al cliente NO contiene el código en claro.
const SECRET = process.env.CARD_CODE_SECRET || 'wise-card-flow-secret-2026'
const sign = (code, exp) => crypto.createHmac('sha256', SECRET).update(`${code}.${exp}`).digest('hex')

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' })
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  const { action, email, code, token } = body

  // 1) Enviar código al correo del usuario (vía Resend)
  if (action === 'send') {
    if (!email) return res.status(400).json({ error: 'no-email' })
    const key = process.env.RESEND_API_KEY
    if (!key) return res.status(500).json({ error: 'no-resend-key' })
    const c = String(Math.floor(100000 + Math.random() * 900000))
    const exp = Date.now() + 10 * 60 * 1000
    const t = `${exp}.${sign(c, exp)}`
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || 'Wise <noreply@uswiise.com>',
        to: [email],
        subject: 'Tu código de seguridad — datos de la tarjeta',
        html: `<div style="font-family:Inter,Arial,sans-serif;color:#0E0F0C">
          <p>Usa este código para ver los datos de tu tarjeta:</p>
          <p style="font-size:30px;font-weight:800;letter-spacing:6px;color:#163300">${c}</p>
          <p style="color:#6b6b6b">Vence en 10 minutos. Si no fuiste tú, ignora este correo.</p></div>`,
      }),
    })
    if (!r.ok) {
      const detail = await r.text().catch(() => '')
      return res.status(502).json({ error: 'send-failed', detail })
    }
    return res.status(200).json({ token: t })
  }

  // 2) Verificar el código
  if (action === 'verify') {
    if (!code || !token) return res.status(400).json({ error: 'missing' })
    const [exp, sig] = String(token).split('.')
    if (!exp || !sig) return res.status(400).json({ ok: false, error: 'bad-token' })
    if (Date.now() > Number(exp)) return res.status(200).json({ ok: false, error: 'expired' })
    const ok = sign(String(code).trim(), Number(exp)) === sig
    return res.status(200).json({ ok })
  }

  return res.status(400).json({ error: 'bad-action' })
}
