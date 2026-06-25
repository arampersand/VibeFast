"use client"

import { Wrench } from "lucide-react"

// Formatea args/result que pueden venir como objeto o string.
function format(value) {
  if (value == null) return ""
  if (typeof value === "string") return value
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

// Card de una herramienta ejecutada por el agente: nombre + args + result.
// Visualmente distinta a una burbuja de mensaje (acento, icono, monoespaciado).
export default function ToolCallCard({ name, args, result }) {
  const argsText = format(args)
  const resultText = format(result)

  return (
    <div className="rounded-box border border-base-300 bg-base-200/60 p-3 text-sm">
      <div className="mb-2 flex items-center gap-2">
        <Wrench className="size-4 text-base-content/60" />
        <span className="badge badge-neutral badge-sm font-mono">{name}</span>
      </div>

      {argsText && (
        <div className="mb-2">
          <p className="mb-1 text-xs font-medium text-base-content/60">
            Argumentos
          </p>
          <pre className="overflow-x-auto rounded-lg bg-base-300/50 p-2 text-xs">
            {argsText}
          </pre>
        </div>
      )}

      {resultText && (
        <div className="collapse-arrow collapse bg-base-300/40">
          <input type="checkbox" defaultChecked />
          <div className="collapse-title min-h-0 px-2 py-1 text-xs font-medium text-base-content/60">
            Resultado
          </div>
          <div className="collapse-content px-2">
            <pre className="overflow-x-auto rounded-lg bg-base-300/50 p-2 text-xs">
              {resultText}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
