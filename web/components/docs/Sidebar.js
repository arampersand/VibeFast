"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import * as LucideIcons from "lucide-react"
import { Check, ChevronDown } from "lucide-react"
import { useProgress } from "./ProgressProvider"

function SectionIcon({ name, className }) {
  const Cmp = LucideIcons[name] || LucideIcons.Folder
  return <Cmp className={className} />
}

function SidebarSection({ section, pathname, isOpen, onToggle, onNavigate }) {
  const { isComplete, toggleComplete } = useProgress()

  const total = section.pages.length
  const done = section.pages.filter((p) => isComplete(p.href)).length
  const pct = total ? (done / total) * 100 : 0
  const allDone = total > 0 && done === total
  const panelId = `docs-section-${section.slug}`

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition hover:bg-base-200"
      >
        <SectionIcon name={section.icon} className="size-3.5 shrink-0 text-primary" />
        <span className="min-w-0 flex-1 text-xs font-bold uppercase tracking-wider text-primary/80">
          {section.label}
        </span>
        <span
          className={
            "shrink-0 text-[10px] font-semibold tabular-nums " +
            (allDone ? "text-success" : "text-base-content/50")
          }
        >
          {done}/{total}
        </span>
        <ChevronDown
          className={
            "size-3.5 shrink-0 text-base-content/40 transition-transform " +
            (isOpen ? "rotate-180" : "")
          }
        />
      </button>

      <div
        className="mx-2 mt-1 h-1 overflow-hidden rounded-full bg-base-300"
        role="progressbar"
        aria-valuenow={done}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`Progreso de ${section.label}`}
      >
        <div
          className={
            "h-full rounded-full transition-all duration-300 " +
            (allDone ? "bg-success" : "bg-primary")
          }
          style={{ width: `${pct}%` }}
        />
      </div>

      {isOpen && (
        <ul id={panelId} className="mt-2 space-y-0.5">
          {section.pages.map((page) => {
            const isActive = page.href === pathname
            const pageDone = isComplete(page.href)
            return (
              <li key={page.href}>
                <div
                  className={
                    "flex items-start gap-2 rounded-md border-l-2 pl-2 pr-2 transition hover:translate-x-0.5 " +
                    (isActive
                      ? "border-primary bg-primary/10"
                      : "border-transparent hover:border-primary/30 hover:bg-base-200")
                  }
                >
                  {/* Fuera del <Link>: un botón dentro de un enlace es HTML inválido. */}
                  <button
                    type="button"
                    onClick={() => toggleComplete(page.href)}
                    aria-pressed={pageDone}
                    title={pageDone ? "Marcar como pendiente" : "Marcar como completada"}
                    aria-label={
                      (pageDone ? "Marcar como pendiente: " : "Marcar como completada: ") +
                      page.label
                    }
                    className="shrink-0 py-1.5"
                  >
                    <span
                      className={
                        "mt-0.5 grid size-4 place-items-center rounded-full border transition " +
                        (pageDone
                          ? "border-success bg-success text-success-content"
                          : "border-base-300 text-transparent hover:border-primary hover:bg-primary/10")
                      }
                    >
                      <Check className="size-2.5" strokeWidth={3} />
                    </span>
                  </button>

                  <Link
                    href={page.href}
                    onClick={onNavigate}
                    aria-current={isActive ? "page" : undefined}
                    className={
                      "min-w-0 flex-1 py-1.5 " +
                      (isActive
                        ? "font-semibold text-primary"
                        : "text-base-content/80 hover:text-base-content")
                    }
                  >
                    {page.label}
                  </Link>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default function Sidebar({ tree, onNavigate }) {
  const pathname = usePathname()
  const activeSlug = tree.find((s) => s.pages.some((p) => p.href === pathname))?.slug

  // Sólo el módulo que estás leyendo arranca abierto; los demás quedan plegados.
  const [open, setOpen] = useState(() => (activeSlug ? { [activeSlug]: true } : {}))

  useEffect(() => {
    if (activeSlug) setOpen((prev) => ({ ...prev, [activeSlug]: true }))
  }, [activeSlug])

  return (
    <nav className="space-y-3 text-sm">
      {tree.map((section) => (
        <SidebarSection
          key={section.slug}
          section={section}
          pathname={pathname}
          isOpen={Boolean(open[section.slug])}
          onToggle={() => setOpen((prev) => ({ ...prev, [section.slug]: !prev[section.slug] }))}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  )
}
