"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import Sidebar from "./Sidebar"
import SearchModal from "./SearchModal"
import ThemeToggle from "./ThemeToggle"

export default function DocsShell({ tree, children }) {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Cierra el drawer al navegar a otra página.
  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  return (
    <div className="drawer mx-auto max-w-7xl lg:drawer-open">
      <input
        id="docs-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={drawerOpen}
        onChange={(e) => setDrawerOpen(e.target.checked)}
      />

      <div className="drawer-content min-w-0 px-4 py-8">
        {/* Barra superior solo en móvil: abre el menú de docs */}
        <div className="mb-4 flex items-center gap-2 lg:hidden">
          <label
            htmlFor="docs-drawer"
            className="btn btn-sm btn-ghost px-2"
            aria-label="Abrir menú de docs"
          >
            <Menu className="size-5" />
          </label>
          <span className="text-sm font-medium text-base-content/70">Documentación</span>
        </div>
        {children}
      </div>

      <div className="drawer-side z-30">
        <label htmlFor="docs-drawer" className="drawer-overlay" aria-label="Cerrar menú" />
        <aside className="min-h-full w-64 bg-base-100 p-4 lg:sticky lg:top-20 lg:min-h-0 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:bg-transparent lg:pl-0">
          <div className="mb-6 flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <SearchModal />
            </div>
            <ThemeToggle />
          </div>
          <Sidebar tree={tree} onNavigate={() => setDrawerOpen(false)} />
        </aside>
      </div>
    </div>
  )
}
