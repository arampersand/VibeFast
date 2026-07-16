"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

const STORAGE_KEY = "vibefast:docs-progress"

const ProgressContext = createContext(null)

function readStored() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((h) => typeof h === "string") : []
  } catch {
    return []
  }
}

/**
 * Guarda qué lecciones lleva completadas el lector, en localStorage.
 * Envuelve sidebar y contenido para que ambos compartan el mismo estado.
 */
export function ProgressProvider({ children }) {
  // Arranca vacío para que el primer render del cliente coincida con el del
  // servidor; el contenido real de localStorage llega en el efecto de abajo.
  const [completed, setCompleted] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Fusiona en vez de reemplazar: los efectos de los hijos corren antes que
    // este, así que la lección actual ya pudo haberse marcado sola.
    setCompleted((pending) => [...new Set([...readStored(), ...pending])])
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completed))
    } catch {
      // Modo privado o storage lleno: el progreso sólo vive en memoria.
    }
  }, [completed, loaded])

  // Con dos pestañas abiertas en las docs, la que escribe pisaría el avance de
  // la otra. El evento `storage` sólo llega a las demás pestañas: adoptamos su
  // versión para que todas converjan.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setCompleted(readStored())
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const markComplete = useCallback((href) => {
    setCompleted((prev) => (prev.includes(href) ? prev : [...prev, href]))
  }, [])

  const toggleComplete = useCallback((href) => {
    setCompleted((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
    )
  }, [])

  const value = useMemo(
    () => ({
      isComplete: (href) => completed.includes(href),
      markComplete,
      toggleComplete,
    }),
    [completed, markComplete, toggleComplete]
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error("useProgress necesita estar dentro de <ProgressProvider>")
  return ctx
}
