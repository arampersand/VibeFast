import { NextResponse, after } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendWelcome } from "@/lib/resend/send"

// En el primer login, created_at y last_sign_in_at quedan casi idénticos.
// Si difieren en menos de este margen, lo tratamos como alta nueva.
const FIRST_LOGIN_WINDOW_MS = 10_000

// Callback de OAuth. Supabase redirige aquí con un `code` que
// intercambiamos por una sesión (cookies). Luego mandamos al
// usuario a `next` (o /dashboard por default).
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Bienvenida solo en el primer login. Best-effort, post-respuesta.
      after(async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user?.email) return
        const created = new Date(user.created_at).getTime()
        const lastSignIn = new Date(
          user.last_sign_in_at || user.created_at
        ).getTime()
        if (Math.abs(lastSignIn - created) < FIRST_LOGIN_WINDOW_MS) {
          const meta = user.user_metadata || {}
          await sendWelcome(user.email, meta.full_name || meta.name || "")
        }
      })

      // En prod detrás de proxy (Vercel), respeta el host reenviado.
      const forwardedHost = request.headers.get("x-forwarded-host")
      const isLocal = process.env.NODE_ENV === "development"
      if (isLocal) return NextResponse.redirect(`${origin}${next}`)
      if (forwardedHost) return NextResponse.redirect(`https://${forwardedHost}${next}`)
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
