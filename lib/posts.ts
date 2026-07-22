import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"
import rehypeSlug from "rehype-slug"
import rehypeRaw from "rehype-raw"
import rehypeStringify from "rehype-stringify"

const postsDirectory = path.join(process.cwd(), "content", "posts")

export type Post = {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  cover: string
  coverImage?: string
  readingMinutes: number
  content: string
}

export type PostMeta = Omit<Post, "content">

function slugifyFilename(fileName: string): string {
  return fileName.replace(/\.md$/, "")
}

function computeReadingTime(text: string): number {
  const words = text
    .replace(/[#>*`_\-!\[\]()]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}

async function renderMarkdown(source: string): Promise<string> {
  // 预处理删除线：~~text~~ → <del>text</del>（解决中文无空格时 GFM 不识别的问题）
  const processed = source.replace(/~~(.+?)~~/g, "<del>$1</del>")
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(processed)
  return String(file)
}

async function parsePostFile(
  fileName: string,
  withContent: boolean,
): Promise<Post | PostMeta> {
  const fullPath = path.join(postsDirectory, fileName)
  const raw = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(raw)

  const slug = (data.slug as string) || slugifyFilename(fileName)
  const date = new Date(data.date).toISOString()
  const tags = Array.isArray(data.tags) ? (data.tags as string[]) : []
  const cover = (data.cover as string) || "#6366f1"
  const coverImage = data.coverImage as string | undefined

  const readingMinutes = computeReadingTime(content)

  const base = {
    slug,
    title: data.title ?? slug,
    date,
    excerpt:
      (data.excerpt as string) ??
      content.replace(/[#>*`_]/g, "").trim().split("\n").slice(0, 2).join(" "),
    tags,
    cover,
    coverImage,
    readingMinutes,
  }

  if (withContent) {
    const html = await renderMarkdown(content)
    return { ...base, content: html }
  }

  return base
}

export async function getAllPosts(withContent = false): Promise<Post[]> {
  if (!fs.existsSync(postsDirectory)) return []
  const fileNames = fs
    .readdirSync(postsDirectory)
    .filter((name) => name.endsWith(".md"))

  const posts = await Promise.all(
    fileNames.map((name) => parsePostFile(name, withContent)),
  )

  return (posts as Post[]).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}

export async function getPost(slug: string): Promise<Post | null> {
  const target = `${slug}.md`
  try {
    return (await parsePostFile(target, true)) as Post
  } catch {
    return null
  }
}

export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const posts = await getAllPosts()
  const map = new Map<string, number>()
  for (const post of posts) {
    for (const tag of post.tags) {
      map.set(tag, (map.get(tag) ?? 0) + 1)
    }
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

export async function getPostsByTag(tag: string): Promise<PostMeta[]> {
  const posts = await getAllPosts()
  return posts.filter((post) => post.tags.includes(tag))
}

export async function getAdjacentPosts(
  slug: string,
): Promise<{ prev: PostMeta | null; next: PostMeta | null }> {
  const posts = await getAllPosts()
  const index = posts.findIndex((post) => post.slug === slug)
  if (index === -1) return { prev: null, next: null }
  return {
    prev: index > 0 ? posts[index - 1] : null,
    next: index < posts.length - 1 ? posts[index + 1] : null,
  }
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}