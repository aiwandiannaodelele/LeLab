import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

const momentsDirectory = path.join(process.cwd(), "content", "moments")

export type Moment = {
  slug: string
  date: string
  content: string
}

function slugifyFileName(fileName: string): string {
  return fileName.replace(/\.md$/, "")
}

function parseMomentFile(fileName: string): Moment {
  const fullPath = path.join(momentsDirectory, fileName)
  const raw = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(raw)
  return {
    slug: (data.slug as string) || slugifyFileName(fileName),
    date: new Date(data.date).toISOString(),
    content: content.trim(),
  }
}

export async function getAllMoments(): Promise<Moment[]> {
  if (!fs.existsSync(momentsDirectory)) return []
  const fileNames = fs.readdirSync(momentsDirectory).filter((name) => name.endsWith(".md"))
  return fileNames
    .map(parseMomentFile)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
