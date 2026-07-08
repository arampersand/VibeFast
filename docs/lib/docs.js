import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import GithubSlugger from "github-slugger"

// docs-content vive en la raíz del monorepo, no dentro de /web
const DOCS_DIR = path.join(process.cwd(), "..", "docs-content")

// Nombres bonitos para las secciones top-level
const SECTION_LABELS = {
  intro: "Introducción",
  fundamentos: "Fundamentos",
  setup: "Empieza aquí",
  configuracion: "Configuración",
  tutoriales: "Tutoriales por semana",
  features: "Features",
  componentes: "Componentes",
  recetas: "Recetas",
  deploy: "Deploy",
  troubleshooting: "Troubleshooting",
}

// Icono lucide por sección (se resuelve dinámicamente en el Sidebar)
const SECTION_ICONS = {
  intro: "BookOpen",
  fundamentos: "GraduationCap",
  setup: "Rocket",
  configuracion: "Settings",
  tutoriales: "CalendarDays",
  features: "Boxes",
  componentes: "Component",
  recetas: "ChefHat",
  deploy: "CloudUpload",
  troubleshooting: "LifeBuoy",
}

// Descripción corta por sección (para las cards del índice de docs)
const SECTION_DESC = {
  intro: "Qué es VibeFast y cómo usar estas docs.",
  fundamentos: "Lo básico para arrancar sin experiencia.",
  setup: "De cero a tu proyecto corriendo.",
  configuracion: "Conecta cada servicio cuando lo necesites — tus keys y variables.",
  tutoriales: "Qué construir cada semana del curso.",
  features: "Cómo funciona cada pieza del stack.",
  componentes: "Componentes y design system.",
  recetas: "Playbooks completos para casos comunes.",
  deploy: "Publica tu producto en producción.",
  troubleshooting: "Cuando algo falla, empieza aquí.",
}

function stripOrderPrefix(name) {
  // "01-intro" → "intro", "semana-1-landing" se queda como está
  return name.replace(/^(\d+)[-_]/, "")
}

function humanize(slug) {
  return slug
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function readFrontmatter(filepath) {
  const raw = fs.readFileSync(filepath, "utf8")
  const { data, content } = matter(raw)
  return { data, content }
}

/**
 * Devuelve el árbol de navegación para la sidebar de /docs.
 * Estructura: [{ slug, label, order, pages: [{ slug, label, order, href }] }]
 */
export function getDocsTree() {
  if (!fs.existsSync(DOCS_DIR)) return []

  const sections = fs
    .readdirSync(DOCS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("_") && !d.name.startsWith("."))

  return sections
    .map((dir) => {
      const sectionSlug = stripOrderPrefix(dir.name)
      const sectionDir = path.join(DOCS_DIR, dir.name)

      const files = fs
        .readdirSync(sectionDir, { withFileTypes: true })
        .filter((f) => f.isFile() && f.name.endsWith(".mdx"))

      const pages = files
        .map((f) => {
          const filepath = path.join(sectionDir, f.name)
          const { data } = readFrontmatter(filepath)
          const baseName = f.name.replace(/\.mdx$/, "")
          const pageSlug = stripOrderPrefix(baseName)
          return {
            slug: pageSlug,
            label: data.title || humanize(pageSlug),
            order: data.order ?? 999,
            description: data.description || null,
            href: `/docs/${sectionSlug}/${pageSlug}`,
          }
        })
        .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label))

      return {
        slug: sectionSlug,
        label: SECTION_LABELS[sectionSlug] || humanize(sectionSlug),
        icon: SECTION_ICONS[sectionSlug] || "Folder",
        description: SECTION_DESC[sectionSlug] || null,
        order: getSectionOrder(sectionSlug),
        pages,
      }
    })
    .sort((a, b) => a.order - b.order)
}

function getSectionOrder(slug) {
  // Orden canónico de las secciones top-level
  const ORDER = [
    "intro",
    "setup",
    "fundamentos",
    "configuracion",
    "tutoriales",
    "features",
    "componentes",
    "recetas",
    "deploy",
    "troubleshooting",
  ]
  const idx = ORDER.indexOf(slug)
  return idx === -1 ? 999 : idx
}

/**
 * Devuelve { data, content } para un slug array ["seccion", "pagina"].
 * Si la página no existe, devuelve null.
 */
export function getDocBySlug(slugArray) {
  if (!slugArray || slugArray.length === 0) return null

  const tree = getDocsTree()
  const [sectionSlug, pageSlug] = slugArray

  const section = tree.find((s) => s.slug === sectionSlug)
  if (!section) return null

  // Encuentra el archivo real en disco (puede tener prefijo de orden)
  const dirEntries = fs
    .readdirSync(DOCS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
  const realSectionDir = dirEntries.find((d) => stripOrderPrefix(d.name) === sectionSlug)
  if (!realSectionDir) return null

  const sectionPath = path.join(DOCS_DIR, realSectionDir.name)
  const files = fs.readdirSync(sectionPath).filter((f) => f.endsWith(".mdx"))
  const realFile = files.find((f) => stripOrderPrefix(f.replace(/\.mdx$/, "")) === pageSlug)
  if (!realFile) return null

  const filepath = path.join(sectionPath, realFile)
  const { data, content } = readFrontmatter(filepath)

  // Encuentra prev/next para navegación
  const allPages = tree.flatMap((s) => s.pages)
  const currentIdx = allPages.findIndex((p) => p.href === `/docs/${sectionSlug}/${pageSlug}`)
  const prev = currentIdx > 0 ? allPages[currentIdx - 1] : null
  const next = currentIdx < allPages.length - 1 ? allPages[currentIdx + 1] : null

  return {
    data,
    content,
    section: { slug: sectionSlug, label: section.label },
    page: { slug: pageSlug },
    prev,
    next,
  }
}

/**
 * Para generateStaticParams: devuelve todos los slugs como arrays [seccion, pagina]
 */
export function getAllDocSlugs() {
  return getDocsTree().flatMap((section) =>
    section.pages.map((page) => ({
      slug: [section.slug, page.slug],
    }))
  )
}

/**
 * Extrae los headings h2/h3 del MDX crudo para la tabla de contenidos.
 * Usa GithubSlugger para generar los mismos ids que rehype-slug renderiza.
 * Ignora las líneas dentro de bloques de código (```).
 */
export function getHeadings(content) {
  const slugger = new GithubSlugger()
  const headings = []
  let inFence = false

  for (const line of content.split("\n")) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    const match = /^(#{2,3})\s+(.*)$/.exec(line)
    if (!match) continue

    const level = match[1].length
    // Limpia markdown inline básico (**, *, `, [texto](url))
    const text = match[2]
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[*_`]/g, "")
      .trim()
    if (!text) continue

    headings.push({ level, text, id: slugger.slug(text) })
  }

  return headings
}

/**
 * Índice de búsqueda para el modal cmd-K: un registro por página.
 */
export function getSearchIndex() {
  const tree = getDocsTree()
  return tree.flatMap((section) =>
    section.pages.map((page) => {
      const doc = getDocBySlug([section.slug, page.slug])
      const headings = doc ? getHeadings(doc.content).map((h) => h.text) : []
      const body = doc
        ? doc.content
            .replace(/```[\s\S]*?```/g, " ")
            .replace(/[#>*_`\-|]/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 500)
        : ""
      return {
        title: page.label,
        section: section.slug,
        sectionLabel: section.label,
        href: page.href,
        description: page.description || "",
        headings,
        body,
      }
    })
  )
}
