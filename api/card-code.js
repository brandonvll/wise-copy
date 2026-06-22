import crypto from 'node:crypto'
import nodemailer from 'nodemailer'

// Firma HMAC: el token que se devuelve al cliente NO contiene el código en claro.
const SECRET = process.env.CARD_CODE_SECRET || 'wise-card-flow-secret-2026'
const sign = (code, exp) => crypto.createHmac('sha256', SECRET).update(`${code}.${exp}`).digest('hex')

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' })
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  const { action, email, code, token } = body

  // 1) Enviar código al correo del usuario (vía SMTP de Google Workspace)
  if (action === 'send') {
    if (!email) return res.status(400).json({ error: 'no-email' })
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS
    if (!user || !pass) return res.status(500).json({ error: 'no-smtp' })

    const c = String(Math.floor(100000 + Math.random() * 900000))
    const exp = Date.now() + 10 * 60 * 1000
    const t = `${exp}.${sign(c, exp)}`

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 465,
        secure: true,
        auth: { user, pass },
      })
      await transporter.sendMail({
        from: process.env.SMTP_FROM || `Wise <${user}>`,
        to: email,
        subject: 'Tu código de seguridad — datos de la tarjeta',
        html: `<div style="font-family:Inter,Arial,sans-serif;color:#0E0F0C">
          <p>Usa este código para ver los datos de tu tarjeta:</p>
          <p style="font-size:30px;font-weight:800;letter-spacing:6px;color:#163300">${c}</p>
          <p style="color:#6b6b6b">Vence en 10 minutos. Si no fuiste tú, ignora este correo.</p></div>`,
      })
    } catch (e) {
      return res.status(502).json({ error: 'send-failed', detail: String(e?.message || e) })
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
