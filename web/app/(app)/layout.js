import Link from "next/link"
import { redirect } from "next/navigation"
import { LayoutDashboard, MessageSquare, Bot } from "lucide-react"
import config from "@/config"
import { getUser } from "@/lib/supabase/server"
import UserMenu from "@/components/auth/UserMenu"

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/agent", label: "Agente", icon: Bot },
]

// Layout de la zona privada. El middleware ya bloquea sin sesión,
// pero revalidamos aquí para tener el `user` y proteger por si acaso.
export default async function AppLayout({ children }) {
  const user = await getUser()
  if (!user) redirect(config.auth.loginUrl)

  return (
    <div className="flex min-h-screen flex-col bg-base-200">
      <header className="sticky top-0 z-40 border-b border-base-200 bg-base-100">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold">
            <span className="inline-block size-7 rounded-lg bg-primary" aria-hidden />
            {config.brand.logoText}
          </Link>
          <UserMenu user={user} />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-4 py-6">
        <aside className="hidden w-52 shrink-0 md:block">
          <nav className="menu rounded-box bg-base-100 p-2">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-base-200"
              >
                <Icon className="size-4" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
