import Link from "next/link"
import { getAllTags } from "@/lib/posts"
import { Icon } from "@/components/icons"

export const metadata = {
  title: "标签",
  description: "按标签浏览文章。",
}

export default async function TagsPage() {
  const tags = await getAllTags()

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <header className="mb-10">
        <p className="mb-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon name="tag" size={14} className="text-primary" />
          TAGS
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          标签
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          共 {tags.length} 个标签。
        </p>
      </header>

      {tags.length === 0 ? (
        <p className="text-muted-foreground">还没有标签。</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/tags/${tag}`}
              className="group inline-flex items-center gap-2 rounded-2xl border border-border/60 px-4 py-2.5 text-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
            >
              <Icon name="tag" size={14} />
              <span className="font-medium">{tag}</span>
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground tabular-nums group-hover:bg-primary/10 group-hover:text-primary">
                {count}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}