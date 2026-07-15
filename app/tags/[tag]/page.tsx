import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getAllTags, getPostsByTag } from "@/lib/posts"
import { PostCard } from "@/components/post-card"
import { Icon } from "@/components/icons"

type Params = { tag: string }

export async function generateStaticParams() {
  const tags = await getAllTags()
  return tags.map(({ tag }) => ({ tag }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { tag } = await params
  const decoded = decodeURIComponent(tag)
  return {
    title: `#${decoded}`,
    description: `标签「${decoded}」下的全部文章。`,
  }
}

export default async function TagPage({ params }: { params: Promise<Params> }) {
  const { tag } = await params
  const decoded = decodeURIComponent(tag)
  const posts = await getPostsByTag(decoded)

  if (posts.length === 0) notFound()

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <Link
        href="/tags"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <Icon name="arrowLeft" size={14} />
        全部标签
      </Link>

      <header className="mb-10">
        <p className="mb-1 text-xs text-muted-foreground">TAG</p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          #{decoded}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          共 {posts.length} 篇文章。
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}