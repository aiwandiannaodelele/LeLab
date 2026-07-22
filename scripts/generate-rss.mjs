import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const postsDir = path.join(__dirname, "..", "content", "posts")
const siteUrl = "https://1l.lol"
const siteName = "乐乐 Lab"

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")
}

function getPosts() {
  if (!fs.existsSync(postsDir)) return []
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"))
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(postsDir, file), "utf8")
    const frontmatter = raw.match(/^---\n([\s\S]*?)\n---/)?.[1] || ""
    const title = frontmatter.match(/title:\s*(.+)/)?.[1] || file.replace(/\.md$/, "")
    const slug = frontmatter.match(/slug:\s*(.+)/)?.[1] || file.replace(/\.md$/, "")
    const date = frontmatter.match(/date:\s*(.+)/)?.[1] || ""
    const excerpt = frontmatter.match(/excerpt:\s*(.+)/)?.[1] || ""
    return { title, slug, date, excerpt }
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

const posts = getPosts()

const items = posts.map(
  (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${siteUrl}/posts/${post.slug}/</link>
      <guid>${siteUrl}/posts/${post.slug}/</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`,
).join("")

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
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
