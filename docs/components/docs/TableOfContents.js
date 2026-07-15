"use client"

import { useEffect, useState } from "react"

export default function TableOfContents({ headings }) {
  const [activeId, setActiveId] = useState(null)

  useEffect(() => {
    if (!headings || headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    )

    for (const h of headings) {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [headings])

  if (!headings || headings.length === 0) return null

  return (
    <nav className="text-sm">
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-primary/80">
        En esta página
      </p>
      <ul className="space-y-1 border-l border-base-200">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? "pl-4" : ""}>
            <a
              href={`#${h.id}`}
              className={
                "-ml-px block border-l-2 py-1 pl-3 transition " +
                (activeId === h.id
                  ? "border-primary font-semibold text-primary"
                  : "border-transparent text-base-content/70 hover:border-primary/30 hover:text-base-content")
              }
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
