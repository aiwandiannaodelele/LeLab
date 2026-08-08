import { marked, type Tokens } from "marked"

const renderer = new marked.Renderer()

renderer.image = ({ href, title, text }: { href: string; title?: string | null; text: string }) => {
  return `<img src="${href}" alt="${text || ""}" title="${title || ""}" style="max-width:160px;max-height:160px;width:auto;height:auto;border-radius:0.75rem;object-fit:cover;display:inline-block;vertical-align:top;border:1px solid rgba(128,128,128,0.25);" />`
}

// 段落内如果是纯图片（多张），包成横向 flex 容器
renderer.paragraph = function ({ tokens }: Tokens.Paragraph) {
  const html = this.parser?.parseInline(tokens) ?? ""
  if ((html.match(/<img/g) || []).length > 0) {
    return `<div class="moment-images">${html}</div>`
  }
  return `<p>${html}</p>`
}

export function renderMoment(md: string): string {
  return marked.parse(md, { async: false, renderer }) as string
}

// 合并相邻的纯图片容器为一行，处理图片之间有空行的情况
export function renderMomentLines(md: string): string {
  const html = renderMoment(md)
  return html.replace(/<\/div>\s*<div class="moment-images">/g, "")
}
