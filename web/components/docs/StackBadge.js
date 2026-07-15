import * as LucideIcons from "lucide-react"

const TECH_LABELS = {
  next: "Next.js",
  react: "React",
  tailwind: "Tailwind",
  daisyui: "DaisyUI",
  supabase: "Supabase",
  postgres: "Postgres",
  pgvector: "pgvector",
  auth: "Auth",
  openai: "OpenAI",
  langgraph: "LangGraph",
  mcp: "MCP",
  resend: "Resend",
  posthog: "PostHog",
  vercel: "Vercel",
  yarn: "yarn",
  cursor: "Cursor",
  github: "GitHub",
  esp: "ESP-Claw",
}

// Icono lucide por tecnología (aproximados; lucide no trae todos los brands).
const TECH_ICONS = {
  next: "Triangle",
  react: "Atom",
  tailwind: "Wind",
  daisyui: "Flower2",
  supabase: "Database",
  postgres: "Database",
  pgvector: "Boxes",
  auth: "KeyRound",
  openai: "Sparkles",
  langgraph: "Workflow",
  mcp: "Plug",
  resend: "Mail",
  posthog: "BarChart3",
  vercel: "Triangle",
  yarn: "Package",
  cursor: "MousePointer2",
  github: "Github",
  esp: "Cpu",
}

function TechIcon({ name, className }) {
  const Cmp = LucideIcons[name] || LucideIcons.Box
  return <Cmp className={className} />
}

export default function StackBadge({ tech = [] }) {
  if (!tech || tech.length === 0) return null
  return (
    <div className="my-4 flex flex-wrap gap-1.5">
      {tech.map((t) => (
        <span
          key={t}
          className="inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-primary/5 px-2 py-0.5 text-xs font-semibold text-base-content/80"
        >
          <TechIcon name={TECH_ICONS[t] || "Box"} className="size-3.5 text-primary" />
          {TECH_LABELS[t] || t}
        </span>
      ))}
    </div>
  )
}
