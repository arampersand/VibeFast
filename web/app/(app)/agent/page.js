import config from "@/config"
import AgentRun from "@/components/ai/AgentRun"

export const metadata = { title: "Agente" }

export default function AgentPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Agente de {config.app.name}
        </h1>
        <p className="mt-1 text-sm text-base-content/70">
          El agente decide qué herramientas usar y muestra su razonamiento.
        </p>
      </div>

      <AgentRun />
    </div>
  )
}
