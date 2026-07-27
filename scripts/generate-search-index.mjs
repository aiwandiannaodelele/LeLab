import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

const postsDir = path.join(process.cwd(), "content", "posts")
const outFile = path.join(process.cwd(), "public", "search-index.json")

const fileNames = fs.readdirSync(postsDir).filter((n) => n.endsWith(".md"))

const index = fileNames.map((name) => {
  const raw = fs.readFileSync(path.join(postsDir, name), "utf8")
  const { data, content } = matter(raw)
  return {
    slug: data.slug || name.replace(/\.md$/, ""),
    title: data.title,
    date: new Date(data.date).toISOString(),
    excerpt: data.excerpt || content.replace(/[#>*`_\[\]]/g, "").trim().split("\n")[0],
    tags: Array.isArray(data.tags) ? data.tags : [],
    cover: data.cover || "#6366f1",
    readingMinutes: Math.max(1, Math.round((content.match(/[\u4e00-\u9fff]/g) || []).length / 400 + content.replace(/[\u4e00-\u9fff]/g, " ").split(/\s+/).filter(Boolean).length / 200)),
    content: content
      .replace(/---[\s\S]*?---/, "")
      .replace(/[#*`>_~\[\]()!-]/g, "")
      .replace(/\n+/g, " ")
      .trim(),
  }
})

fs.mkdirSync(path.dirname(outFile), { recursive: true })
fs.writeFileSync(outFile, JSON.stringify(index, null, 2), "utf8")
console.log(`Search index generated: ${index.length} posts`)
