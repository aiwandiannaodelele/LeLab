import Link from "next/link"
import type { PostMeta } from "@/lib/posts"
import { formatDate } from "@/lib/posts"
import { Icon } from "@/components/icons"
import { cn } from "@/lib/utils"

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-lg sm:rounded-3xl"
    >
      <Cover cover={post.cover} title={post.title} />

      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Icon name="calendar" size={13} />
            {formatDate(post.date)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Icon name="clock" size={13} />
            {post.readingMinutes} 分钟
          </span>
        </div>

        <h2 className="font-heading text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary">
          {post.title}
        </h2>

        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>

        {post.tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary"
              >
                <Icon name="tag" size={11} />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

function Cover({ cover, title }: { cover: string; title: string }) {
  return (
    <div
      className="relative aspect-[16/7] w-full overflow-hidden"
      style={{ backgroundColor: cover }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-70 mix-blend-soft-light"
        style={{
          backgroundImage:
            "radial-gradient(at 80% 0%, rgba(255,255,255,0.6) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(0,0,0,0.35) 0px, transparent 50%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 [mask-image:linear-gradient(to_top,black,transparent)]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.25) 0px, rgba(255,255,255,0.25) 1px, transparent 1px, transparent 9px)",
        }}
      />
      <span
        className={cn(
          "absolute bottom-3 left-4 right-4 font-heading text-lg font-semibold text-white drop-shadow-sm",
        )}
      >
        {title}
      </span>
    </div>
  )
}