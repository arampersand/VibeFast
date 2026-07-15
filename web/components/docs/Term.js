import fs from "node:fs"
import path from "node:path"
import Link from "next/link"

// glossary-terms.json vive junto al contenido (docs-content/), igual que lib/docs.js
const TERMS_FILE = path.join(process.cwd(), "..", "docs-content", "glossary-terms.json")

let cache = null
function getTerms() {
  if (!cache) {
    cache = JSON.parse(fs.readFileSync(TERMS_FILE, "utf8"))
  }
  return cache
}

// <Term id="ruta">ruta</Term> — palabra del glosario con tooltip (definición corta)
// y link al término exacto: /docs/fundamentos/glosario#<id>. En móvil (sin hover)
// el tap navega directo al glosario.
export default function Term({ id, children }) {
  const entry = getTerms()[id]
  const href = `/docs/fundamentos/glosario#${id}`
  const className =
    "underline decoration-dotted decoration-primary/70 underline-offset-4 hover:decoration-solid hover:text-primary"

  if (!entry) {
    // id desconocido: link a la página del glosario, sin tooltip
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    )
  }

  return (
    <span
      className="tooltip before:max-w-64 before:whitespace-normal before:text-left"
      data-tip={`${entry.term}: ${entry.tip} — clic para ver en el glosario`}
    >
      <Link href={href} className={className}>
        {children}
      </Link>
    </span>
  )
}
