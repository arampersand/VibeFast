"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { searchDocs } from "@/lib/searchFilter"

export default function SearchModal() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [index, setIndex] = useState([])
  const [query, setQuery] = useState("")
  const [activeIdx, setActiveIdx] = useState(0)
  // Arranca en false para que el render del servidor coincida con el primero
  // del cliente; en Mac se corrige al montar.
  const [isMac, setIsMac] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const platform = navigator.userAgentData?.platform || navigator.platform || ""
    setIsMac(/mac|iphone|ipad|ipod/i.test(platform))
  }, [])

  const results = searchDocs(index, query)

  const close = useCallback(() => {
    setOpen(false)
    setQuery("")
    setActiveIdx(0)
  }, [])

  // Carga el índice una vez, al abrir por primera vez.
  useEffect(() => {
    if (!open || index.length > 0) return
    fetch("/docs-search")
      .then((r) => r.json())
      .then(setIndex)
      .catch(() => setIndex([]))
  }, [open, index.length])

  // Atajo global cmd/ctrl+K + Escape.
  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((v) => !v)
      } else if (e.key === "Escape") {
        close()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [close])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 0)
  }, [open])

  useEffect(() => {
    setActiveIdx(0)
  }, [query])

  function go(href) {
    close()
    router.push(href)
  }

  function onInputKey(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter" && results[activeIdx]) {
      e.preventDefault()
      go(results[activeIdx].href)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-lg border border-base-200 bg-base-100 px-3 py-2 text-sm text-base-content/50 transition hover:border-base-300"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">Buscar…</span>
        <kbd className="kbd kbd-sm">{isMac ? "⌘K" : "Ctrl+K"}</kbd>
      </button>

      {open &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[60] flex items-start justify-center bg-black/40 p-4 pt-[10vh]"
            onClick={close}
          >
          <div
            className="docs-search-panel w-full max-w-lg overflow-hidden rounded-2xl border border-base-200 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-base-200 px-4">
              <Search className="size-4 text-base-content/50" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Buscar en las docs…"
                className="w-full bg-transparent py-3 text-sm outline-none"
              />
              <kbd className="kbd kbd-sm">esc</kbd>
            </div>

            <ul className="max-h-80 overflow-y-auto p-2">
              {query && results.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-base-content/50">
                  Sin resultados para “{query}”.
                </li>
              )}
              {results.map((doc, i) => (
                <li key={doc.href}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIdx(i)}
                    onClick={() => go(doc.href)}
                    className={
                      "block w-full rounded-lg px-3 py-2 text-left transition " +
                      (i === activeIdx ? "bg-primary/10" : "hover:bg-base-200")
                    }
                  >
                    <p className="text-sm font-medium">{doc.title}</p>
                    <p className="text-xs text-base-content/50">
                      {doc.sectionLabel}
                      {doc.description ? ` · ${doc.description}` : ""}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>,
          document.body
        )}
    </>
  )
}
