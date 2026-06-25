import { NextResponse } from "next/server"
import { Webhook } from "svix"

// ============================================================
// Webhook de Resend (eventos de email: delivered, bounced, etc.)
// ------------------------------------------------------------
// Resend firma los webhooks con Svix. Si configuras
// RESEND_WEBHOOK_SECRET, verificamos la firma; si no, en dev
// aceptamos el payload sin verificar (con un warning).
//
// Configúralo en resend.com → Webhooks, apuntando a:
//   https://TU-DOMINIO/api/webhooks/resend
// ============================================================

export async function POST(request) {
  const payload = await request.text()
  const secret = process.env.RESEND_WEBHOOK_SECRET

  let event
  if (secret) {
    try {
      const wh = new Webhook(secret)
      const headers = {
        "svix-id": request.headers.get("svix-id"),
        "svix-timestamp": request.headers.get("svix-timestamp"),
        "svix-signature": request.headers.get("svix-signature"),
      }
      event = wh.verify(payload, headers)
    } catch (err) {
      console.error("[resend webhook] firma inválida:", err.message)
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }
  } else {
    console.warn(
      "[resend webhook] RESEND_WEBHOOK_SECRET no configurado — aceptando sin verificar (solo dev)."
    )
    event = JSON.parse(payload)
  }

  // event.type: "email.sent" | "email.delivered" | "email.bounced" | ...
  console.log("[resend webhook]", event.type, event.data?.email_id || "")

  // TODO: persistir el evento si lo necesitas (tabla events / analytics).
  return NextResponse.json({ ok: true })
}
