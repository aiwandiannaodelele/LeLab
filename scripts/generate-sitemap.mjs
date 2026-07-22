import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const postsDir = path.join(__dirname, "..", "content", "posts")
const siteUrl = "https://1l.lol"

function getPosts() {
  if (!fs.existsSync(postsDir)) return []
  return fs.readdirSync(postsDir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(postsDir, file), "utf8")
      const fm = raw.match(/^---\n([\s\S]*?)\n---/)?.[1] || ""
      const slug = fm.match(/slug:\s*(.+)/)?.[1] || file.replace(/\.md$/, "")
      const date = fm.match(/date:\s*(.+)/)?.[1] || new Date().toISOString()
      return { slug, date }
    })
}

const posts = getPosts()

const urls = [
  { loc: "/", prio: "1.0" },
  { loc: "/posts/", prio: "0.9" },
  { loc: "/tags/", prio: "0.7" },
  { loc: "/tools/", prio: "0.6" },
  { loc: "/links/", prio: "0.5" },
  { loc: "/about/", prio: "0.8" },
  ...posts.map((p) => ({ loc: `/posts/${p.slug}/`, prio: "0.8", lastmod: p.date })),
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${siteUrl}${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString()}</lastmod>` : ""}
    <changefreq>weekly</changefreq>
    <priority>${u.prio}</priority>
  </url>`).join("\n")}
</urlset>`

const outDir = path.join(__dirname, "..", "public")
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemap, "utf8")
console.log("✓ Sitemap generated at public/sitemap.xml")
