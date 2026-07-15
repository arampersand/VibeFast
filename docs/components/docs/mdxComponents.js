import Link from "next/link"
import PromptBox from "./PromptBox"
import Callout from "./Callout"
import Checkpoint from "./Checkpoint"
import StackBadge from "./StackBadge"
import VideoLoom from "./VideoLoom"
import CodeBlock from "./CodeBlock"
import Term from "./Term"

// Componentes disponibles dentro de cualquier .mdx en docs-content/
export const mdxComponents = {
  PromptBox,
  Callout,
  Checkpoint,
  StackBadge,
  VideoLoom,
  Term,
  // Bloques de código con barra (lenguaje + copiar)
  pre: CodeBlock,
  // Links internos pasan por <Link> de Next para no recargar
  a: ({ href = "", children, ...rest }) => {
    const external = href.startsWith("http") || href.startsWith("mailto:")
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
          {children}
        </a>
      )
    }
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    )
  },
}
