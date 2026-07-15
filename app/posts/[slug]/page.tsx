import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getAllPosts, getAdjacentPosts, getPost } from "@/lib/posts"
import { formatDate } from "@/lib/posts"
import { Icon } from "@/components/icons"
import { siteConfig } from "@/lib/site"
import { Giscus } from "@/components/giscus"

type Params = { slug: string }

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
    },
  }
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const { prev, next } = await getAdjacentPosts(slug)

  return (
    <article className="mx-auto max-w-3xl px-5 py-10 sm:py-16">
      <Link
        href="/posts"
        className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <Icon name="arrowLeft" size={14} />
        返回文章
      </Link>

      <header className="mb-8">
        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Icon name="calendar" size={13} />
            {formatDate(post.date)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Icon name="clock" size={13} />
            {post.readingMinutes} 分钟阅读
          </span>
        </div>

        <h1 className="font-heading text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {post.title}
        </h1>

        {post.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              >
                <Icon name="tag" size={11} />
                {tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {siteConfig.giscus.category && (
        <Giscus
          repo={siteConfig.giscus.repo}
          repoId={siteConfig.giscus.repoId}
          category={siteConfig.giscus.category}
          categoryId={siteConfig.giscus.categoryId}
        />
      )}

      <div className="mt-14 grid gap-4 border-t border-border/60 pt-8 sm:grid-cols-2">
        {prev ? (
          <AdjacentCard label="较新一篇" post={prev} />
        ) : (
          <span className="hidden sm:block" />
        )}
        {next ? (
          <AdjacentCard label="较旧一篇" post={next} align="right" />
        ) : (
          <span className="hidden sm:block" />
        )}
      </div>
    </article>
  )
}

function AdjacentCard({
  label,
  post,
  align = "left",
}: {
  label: string
  post: { slug: string; title: string }
  align?: "left" | "right"
}) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group flex flex-col gap-1 rounded-2xl border border-border/60 p-4 transition-colors hover:border-primary/40 hover:bg-muted/40"
    >
      <span
        className={[
          "inline-flex items-center gap-1 text-xs text-muted-foreground",
          align === "right" ? "sm:flex-row-reverse sm:text-right" : "",
        ].join(" ")}
      >
        <Icon name={align === "right" ? "arrowRight" : "arrowLeft"} size={12} />
        {label}
      </span>
      <span
        className={[
          "font-medium text-foreground transition-colors group-hover:text-primary",
          align === "right" ? "sm:text-right" : "",
        ].join(" ")}
      >
        {post.title}
      </span>
    </Link>
  )
}