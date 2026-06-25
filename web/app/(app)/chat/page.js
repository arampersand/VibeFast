import config from "@/config"
import Chat from "@/components/ai/Chat"

export const metadata = { title: "Chat" }

export default function ChatPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Chat con {config.app.name}
        </h1>
        <p className="mt-1 text-sm text-base-content/70">
          Conversa con el asistente AI. Las respuestas llegan en streaming.
        </p>
      </div>

      <Chat />
    </div>
  )
}
