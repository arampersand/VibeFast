"use client"

import { useEffect, useRef } from "react"
import { useProgress } from "./ProgressProvider"

/**
 * Centinela invisible al final del artículo: marca la lección como completada
 * cuando el lector llega hasta abajo. No pinta nada.
 *
 * Se desconecta al primer disparo, así que si luego la desmarcas a mano desde
 * la sidebar no se vuelve a marcar sola mientras sigas en la página.
 */
export default function MarkOnScroll({ href }) {
  const ref = useRef(null)
  const { markComplete } = useProgress()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        markComplete(href)
        observer.disconnect()
      }
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [href, markComplete])

  return <div ref={ref} aria-hidden="true" className="h-px" />
}
