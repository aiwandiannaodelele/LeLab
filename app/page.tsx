import Link from "next/link"
import { getAllPosts, getAllTags } from "@/lib/posts"
import { Hero } from "@/components/hero"
import { PostCard } from "@/components/post-card"
import { Icon } from "@/components/icons"
import { siteConfig } from "@/lib/site"

export default async function HomePage() {
  const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()])
  const latest = posts.slice(0, siteConfig.postsPerPage)

  return (
    <>
      <Hero postsCount={posts.length} tagsCount={tags.length} />

      <div className="mx-auto max-w-5xl px-5">
        <SectionTitle title="最近写的东西" href="/posts" action="查看全部" />

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