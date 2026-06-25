// ============================================================
// Auditoría de tool use
// ------------------------------------------------------------
// logToolCall() registra una invocación de tool en la tabla
// tool_calls (migration 005). Lo usan las sesiones de tool use
// (B) y agentes (D) para dejar rastro de qué hizo el agente y
// por qué — base para evals y debugging.
//
// Server-only: usa el cliente de Supabase con la cookie de sesión.
// Best-effort: nunca lanza. Si no hay usuario devuelve { skipped },
// si la inserción falla devuelve { ok:false, error }.
//
// Contrato:
//   logToolCall({ toolName: string, args: object, result?: any,
//                 reasoning?: string, conversationId?: string })
//     → { ok:true, id } | { skipped:true } | { ok:false, error }
// ============================================================

import { createClient } from "@/lib/supabase/server"

export async function logToolCall({
  toolName,
  args,
  result = null,
  reasoning = null,
  conversationId = null,
}) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { skipped: true }

    const { data, error } = await supabase
      .from("tool_calls")
      .insert({
        user_id: user.id,
        conversation_id: conversationId,
        tool_name: toolName,
        arguments: args ?? {},
        result,
        reasoning,
      })
      .select("id")
      .single()

    if (error) {
      console.error("[audit] logToolCall:", error.message)
      return { ok: false, error: error.message }
    }
    return { ok: true, id: data.id }
  } catch (err) {
    console.error("[audit] logToolCall:", err?.message)
    return { ok: false, error: err?.message ?? "error desconocido" }
  }
}
