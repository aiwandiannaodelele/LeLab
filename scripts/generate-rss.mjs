import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { marked } from "marked"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const postsDir = path.join(__dirname, "..", "content", "posts")
const siteUrl = "https://1l.lol"
const siteName = "乐乐 Lab"

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)/)
  if (!match) return {}
  const fm = {}
  for (const line of match[1].split("\n")) {
    const sep = line.indexOf(":")
    if (sep > 0) {
      const key = line.slice(0, sep).trim()
      let val = line.slice(sep + 1).trim()
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
      // 处理列表
      if (val.startsWith("[")) {
        try { val = JSON.parse(val) } catch {}
      }
      fm[key] = val
    }
  }
  const body = match[2].trim()
  return { ...fm, _body: body }
}

function getPosts() {
  if (!fs.existsSync(postsDir)) return []
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"))
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(postsDir, file), "utf8")
      const data = parseFrontmatter(raw)
      return {
        title: data.title || file.replace(/\.md$/, ""),
        slug: data.slug || file.replace(/\.md$/, ""),
        date: data.date || "",
        excerpt: data.excerpt || "",
        body: data._body || "",
      }
    })
    .filter((p) => p.title)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

const posts = getPosts()

const items = posts
  .map((post) => {
    const html = post.body ? marked.parse(post.body, { async: false }) : ""
    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${siteUrl}/posts/${post.slug}/</link>
      <guid>${siteUrl}/posts/${post.slug}/</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <content:encoded><![CDATA[${html}]]></content:encoded>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`
  })
  .join("")

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
>
  <channel>
    <title>${siteName}</title>
    <link>${siteUrl}</link>
    <description>爱玩电脑的乐乐的个人站点</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

const outDir = path.join(__dirname, "..", "public")
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(path.join(outDir, "feed.xml"), rss, "utf8")
console.log("✓ RSS feed generated at public/feed.xml")
