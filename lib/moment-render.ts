import { marked, type Tokens } from "marked"

const renderer = new marked.Renderer()

renderer.image = ({ href, title, text }: { href: string; title?: string | null; text: string }) => {
  return `<img src="${href}" alt="${text || ""}" title="${title || ""}" style="max-width:160px;max-height:160px;width:auto;height:auto;border-radius:0.75rem;object-fit:cover;display:inline-block;vertical-align:top;border:1px solid rgba(128,128,128,0.25);" />`
}

// 段落内如果是纯图片（多张），包成横向 flex 容器
renderer.paragraph = ({ tokens }: Tokens.Paragraph) => {
  const text = tokens.map((t) => ("raw" in t ? t.raw : "")).join("")
  if ((text.match(/<img/g) || []).length > 0) {
    return `<div class="moment-images">${text}</div>`
  }
  return `<p>${text}</p>`
}

export function renderMoment(md: string): string {
  return marked.parse(md, { async: false, renderer }) as string
}
