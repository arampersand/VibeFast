import { sendEmail } from "@/lib/resend/send"

// Tool de ejemplo: enviar email vía Resend (lib/resend/send.js).
// Si Resend no está configurado (features.resend off o sin
// RESEND_API_KEY), devuelve skipped sin romper el flujo del agente.
export const enviarEmail = {
  name: "enviar_email",
  description: "Envía un email transaccional al destinatario indicado.",
  parameters: {
    type: "object",
    properties: {
      to: { type: "string", description: "Correo del destinatario." },
      subject: { type: "string", description: "Asunto del email." },
      body: { type: "string", description: "Cuerpo del mensaje." },
    },
    required: ["to", "subject", "body"],
    additionalProperties: false,
  },
  async execute({ to, subject, body }) {
    const result = await sendEmail({ to, subject, body })
    if (result.skipped) {
      return { ok: false, reason: "Resend no está configurado." }
    }
    if (!result.ok) throw new Error(result.error || "No se pudo enviar el email.")
    return { ok: true }
  },
}
