import Link from "next/link"
import { marked } from "marked"
import { getAllPosts, getAllTags } from "@/lib/posts"
import { getAllMoments } from "@/lib/moments"
import { Hero } from "@/components/hero"
import { PostCard } from "@/components/post-card"
import { Icon } from "@/components/icons"
import { siteConfig } from "@/lib/site"

export default async function HomePage() {
  const [posts, tags, moments] = await Promise.all([getAllPosts(), getAllTags(), getAllMoments()])
  const latest = posts.slice(0, siteConfig.postsPerPage)
  const latestMoment = moments[0]

  return (
    <>
      <Hero />

      <div className="mx-auto max-w-5xl px-5 pt-6">
        {latestMoment && (
          <section className="mb-14">
            <SectionTitle title="动态" href="/moments" action="全部动态" />
            <Link
              href="/moments"
              className="group block rounded-2xl border border-border/60 bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-md"
            >
              <p className="mb-2 text-xs text-muted-foreground/70">{formatMomentDate(latestMoment.date)}</p>
              <div
                className="text-sm leading-relaxed text-foreground/90 [&_a]:text-primary [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: marked.parse(latestMoment.content, { async: false }) as string }}
              />
              <p className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors group-hover:text-primary">
                查看全部动态
                <Icon name="chevronRight" size={12} />
              </p>
            </Link>
          </section>
        )}

        <SectionTitle title="随笔" href="/posts" action="查看全部" />

        {latest.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {latest.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}

        {tags.length > 0 && (
          <section className="mt-16">
            <SectionTitle title="按标签逛逛" href="/tags" action="全部标签" />
            <div className="flex flex-wrap gap-2.5">
              {tags.map(({ tag, count }) => (
                <Link
                  key={tag}
                  href={`/tags/${tag}`}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3.5 py-1.5 text-sm text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                >
                  <Icon name="tag" size={13} />
                  {tag}
                  <span className="text-xs text-muted-foreground/70 tabular-nums">
                    {count}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}

function SectionTitle({
  title,
  href,
  action,
}: {
  title: string
  href?: string
  action?: string
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
        {title}
      </h2>
      {href && action && (
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          {action}
          <Icon name="chevronRight" size={14} />
        </Link>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border/70 p-12 text-center text-muted-foreground">
      还没有文章，去 <code className="rounded bg-muted px-1.5 py-0.5">content/posts/</code> 放几篇吧。
    </div>
  )
}

function formatMomentDate(iso: string) {
  return new Date(iso).toLocaleString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}