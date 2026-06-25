"use client"

import { useEffect, useRef, useState } from "react"
import { AlertCircle, Brain } from "lucide-react"
import Message from "./Message"
import ChatInput from "./ChatInput"
import ToolCallCard from "./ToolCallCard"

// Corre el agente y muestra su timeline: razonamiento, tool calls y la
// respuesta final. Lee SSE de POST /api/ai/agent — líneas `data: {json}\n\n`
// con json.type ∈ {reasoning, tool_call, token, done}.
//
// timeline: lista de items que se renderizan en orden:
//   { kind: "user", content }
//   { kind: "reasoning", text }
//   { kind: "tool", name, args, result }
//   { kind: "answer", text }   ← acumula los eventos `token`
export default function AgentRun() {
  const [timeline, setTimeline] = useState([])
  const [running, setRunning] = useState(false)
  const [error, setError] = useState(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [timeline])

  // Acumula tokens en el último item "answer"; si no hay, crea uno.
  function appendToken(text) {
    setTimeline((prev) => {
      const next = [...prev]
      const last = next[next.length - 1]
      if (last?.kind === "answer") {
        next[next.length - 1] = { ...last, text: last.text + text }
      } else {
        next.push({ kind: "answer", text })
      }
      return next
    })
  }

  function handleEvent(rawEvent) {
    // Un evento SSE puede traer varias líneas; nos quedamos con las `data:`.
    const data = rawEvent
      .split("\n")
      .filter((l) => l.startsWith("data:"))
      .map((l) => l.slice(5).trim())
      .join("")
    if (!data || data === "[DONE]") return

    let evt
    try {
      evt = JSON.parse(data)
    } catch {
      return // ignoramos líneas que no sean JSON válido
    }

    switch (evt.type) {
      case "reasoning":
        setTimeline((prev) => [...prev, { kind: "reasoning", text: evt.text }])
        break
      case "tool_call":
        setTimeline((prev) => [
          ...prev,
          { kind: "tool", name: evt.name, args: evt.args, result: evt.result },
        ])
        break
      case "token":
        appendToken(evt.text || "")
        break
      case "done":
      default:
        break
    }
  }

  async function handleSubmit(text) {
    setError(null)

    const withUser = [...timeline, { kind: "user", content: text }]
    setTimeline(withUser)
    setRunning(true)

    // Reconstruimos el historial para el backend a partir de la timeline:
    // solo mensajes de usuario y respuestas finales.
    const messages = withUser
      .filter((i) => i.kind === "user" || i.kind === "answer")
      .map((i) =>
        i.kind === "user"
          ? { role: "user", content: i.content }
          : { role: "assistant", content: i.text }
      )

    try {
      const res = await fetch("/api/ai/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      })

      if (!res.ok || !res.body) {
        throw new Error(`El servidor respondió ${res.status}`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        let idx
        while ((idx = buffer.indexOf("\n\n")) !== -1) {
          handleEvent(buffer.slice(0, idx))
          buffer = buffer.slice(idx + 2)
        }
      }
      // Procesa un último evento si quedó sin el `\n\n` de cierre.
      if (buffer.trim()) handleEvent(buffer)
    } catch (err) {
      setError(
        err?.message
          ? `No pudimos completar la ejecución del agente: ${err.message}`
          : "Algo salió mal al contactar al agente. Intenta de nuevo."
      )
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="flex h-[72vh] flex-col rounded-box border border-base-200 bg-base-100">
      <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto p-4">
        {timeline.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center text-sm text-base-content/60">
            Pídele algo al agente. Verás su razonamiento y las herramientas que
            usa.
          </div>
        ) : (
          timeline.map((item, i) => {
            if (item.kind === "user") {
              return <Message key={i} role="user" content={item.content} />
            }
            if (item.kind === "answer") {
              return <Message key={i} role="assistant" content={item.text} />
            }
            if (item.kind === "reasoning") {
              return (
                <div
                  key={i}
                  className="flex items-start gap-2 px-1 text-sm italic text-base-content/60"
                >
                  <Brain className="mt-0.5 size-4 shrink-0" />
                  <span className="whitespace-pre-wrap">{item.text}</span>
                </div>
              )
            }
            if (item.kind === "tool") {
              return (
                <ToolCallCard
                  key={i}
                  name={item.name}
                  args={item.args}
                  result={item.result}
                />
              )
            }
            return null
          })
        )}

        {error && (
          <div role="alert" className="alert alert-error">
            <AlertCircle className="size-5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="border-t border-base-200 p-4">
        <ChatInput onSubmit={handleSubmit} disabled={running} />
      </div>
    </div>
  )
}
