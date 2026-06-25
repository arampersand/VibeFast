"use client"

// Burbuja de mensaje. user → derecha, assistant → izquierda (DaisyUI chat).
export default function Message({ role, content }) {
  const isUser = role === "user"

  return (
    <div className={`chat ${isUser ? "chat-end" : "chat-start"}`}>
      <div
        className={`chat-bubble whitespace-pre-wrap break-words ${
          isUser ? "chat-bubble-primary" : ""
        }`}
      >
        {content || (
          <span className="loading loading-dots loading-sm align-middle" />
        )}
      </div>
    </div>
  )
}
