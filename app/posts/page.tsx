import { getAllPosts } from "@/lib/posts"
import { PostCard } from "@/components/post-card"
import { Icon } from "@/components/icons"

export const metadata = {
  title: "文章",
  description: "全部文章，按时间倒序排列。",
}

export default async function PostsPage() {
  const posts = await getAllPosts()

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <header className="mb-10">
        <p className="mb-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon name="book" size={14} className="text-primary" />
          ARCHIVE
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          文章
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          共 {posts.length} 篇，按更新顺序倒序排列。
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">这里还空空如也。</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}