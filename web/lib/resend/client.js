// ============================================================
// Resend · cliente
// ------------------------------------------------------------
// Devuelve un cliente de Resend, o null si el email no está
// configurado (features.resend === false o falta RESEND_API_KEY).
// Los helpers de send.js usan esto para hacer no-op silencioso
// en desarrollo cuando no hay key, sin romper el flujo.
// ============================================================

import { Resend } from "resend"
import config from "@/config"

let cached = null

export function getResend() {
  if (!config.features.resend) return null
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  if (!cached) cached = new Resend(key)
  return cached
}
