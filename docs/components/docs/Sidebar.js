"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as LucideIcons from "lucide-react"

function SectionIcon({ name, className }) {
  const Cmp = LucideIcons[name] || LucideIcons.Folder
  return <Cmp className={className} />
}

export default function Sidebar({ tree, onNavigate }) {
  const pathname = usePathname()

  return (
    <nav className="space-y-6 text-sm">
      {tree.map((section) => (
        <div key={section.slug}>
          <p className="mb-2 flex items-center gap-2 px-2 text-xs font-bold uppercase tracking-wider text-primary/80">
            <SectionIcon name={section.icon} className="size-3.5 text-primary" />
            {section.label}
          </p>
          <ul className="space-y-0.5">
            {section.pages.map((page) => {
              const isActive = page.href === pathname
              return (
                <li key={page.href}>
                  <Link
                    href={page.href}
                    onClick={onNavigate}
                    aria-current={isActive ? "page" : undefined}
                    className={
                      "block rounded-md border-l-2 px-2 py-1.5 transition hover:translate-x-0.5 " +
                      (isActive
                        ? "border-primary bg-primary/10 font-semibold text-primary"
                        : "border-transparent text-base-content/80 hover:border-primary/30 hover:bg-base-200 hover:text-base-content")
                    }
                  >
                    {page.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
