import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import rehypeSlug from "rehype-slug"
import rehypePrettyCode from "rehype-pretty-code"
import remarkGfm from "remark-gfm"
import { mdxComponents } from "@/components/docs/mdxComponents"
import PrevNext from "@/components/docs/PrevNext"
import TableOfContents from "@/components/docs/TableOfContents"
import { getDocBySlug, getAllDocSlugs, getHeadings } from "@/lib/docs"

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: { light: "github-light", dark: "github-dark" },
          keepBackground: false,
        },
      ],
    ],
  },
}

export async function generateStaticParams() {
  return getAllDocSlugs()
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  if (!slug || slug.length === 0) return {}
  const doc = getDocBySlug(slug)
  if (!doc) return {}
  return {
    title: doc.data.title,
    description: doc.data.description || undefined,
  }
}

export default async function DocPage({ params }) {
  const { slug } = await params

  // /docs/ raíz se maneja en /docs/page.js — este catch-all sólo aplica con slug
  if (!slug || slug.length === 0) notFound()
  if (slug.length !== 2) notFound()

  const doc = getDocBySlug(slug)
  if (!doc) notFound()

  const headings = getHeadings(doc.content)

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_200px]">
      <article className="prose-vf min-w-0 max-w-2xl">
        <header className="not-prose mb-12">
          <p className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            {doc.section.label}
          </p>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-base-content">
            {doc.data.title}
          </h1>
          {doc.data.description && (
            <p className="mt-4 text-lg leading-relaxed text-base-content/60">
              {doc.data.description}
            </p>
          )}
        </header>
        <MDXRemote source={doc.content} components={mdxComponents} options={mdxOptions} />
        <PrevNext prev={doc.prev} next={doc.next} />
      </article>

      <aside className="hidden lg:block">
        <div className="sticky top-20">
          <TableOfContents headings={headings} />
        </div>
      </aside>
    </div>
  )
}
