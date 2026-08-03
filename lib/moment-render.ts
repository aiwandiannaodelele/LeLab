import { marked } from "marked"

const renderer = new marked.Renderer()

renderer.image = ({ href, title, text }: { href: string; title?: string | null; text: string }) => {
  return `<img src="${href}" alt="${text || ""}" title="${title || ""}" style="max-width:160px;max-height:160px;width:auto;height:auto;border-radius:0.75rem;margin:0.5rem 0.5rem 0 0;object-fit:cover;display:inline-block;vertical-align:top;border:1px solid rgba(128,128,128,0.25);" />`
}

export function renderMoment(md: string): string {
  return marked.parse(md, { async: false, renderer }) as string
}
