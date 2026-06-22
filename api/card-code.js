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
        html: `<div style="margin:0;padding:32px 16px;background:#f0eeec;font-family:Inter,Helvetica,Arial,sans-serif">
  <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.06)">
    <div style="background:#163300;padding:20px 28px">
      <img src="https://uswiise.com/wise-icon.png" alt="Wise" width="40" height="40" style="display:block;border-radius:10px" />
    </div>
    <div style="padding:32px 28px">
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#0E0F0C">Tu código de seguridad</h1>
      <p style="margin:0 0 24px;font-size:15px;line-height:1.5;color:#454745">Úsalo para ver los datos de tu tarjeta. Vence en 10 minutos.</p>
      <div style="background:#9FE870;border-radius:16px;text-align:center;padding:22px 12px">
        <span style="font-size:40px;font-weight:800;letter-spacing:12px;color:#163300">${c}</span>
      </div>
      <p style="margin:24px 0 0;font-size:13px;line-height:1.5;color:#9a9a9a">Si no fuiste tú, ignora este correo. Nunca compartas este código con nadie.</p>
    </div>
    <div style="background:#f0eeec;padding:16px 28px;text-align:center;font-size:12px;color:#9a9a9a">Wise — Tu dinero, protegido</div>
  </div>
</div>`,
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
