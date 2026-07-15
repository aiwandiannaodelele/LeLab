import Link from "next/link"
import { siteConfig } from "@/lib/site"
import { Icon } from "@/components/icons"

export function Hero({ postsCount, tagsCount }: { postsCount: number; tagsCount: number }) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-24 left-1/2 size-[420px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px] dark:bg-primary/25" />
        <div className="absolute -top-10 right-6 size-[280px] rounded-full bg-pink-400/20 blur-[100px] dark:bg-pink-500/20" />
        <div className="absolute -left-10 top-24 size-[260px] rounded-full bg-emerald-400/15 blur-[100px] dark:bg-emerald-500/15" />
      </div>

      <div className="mx-auto max-w-5xl px-5 pt-16 pb-10 sm:pt-24">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Icon name="sparkles" size={14} className="text-primary" />
            慢慢生长的个人站点
          </span>

          <h1 className="font-heading text-4xl font-semibold tracking-tight leading-[1.1] sm:text-6xl">
            {siteConfig.author.bio}
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
            这里是 {siteConfig.author.name} 的一块自留地，记一些前端、工具与日常的碎片。
            内容会一点点被填进来。
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href="/posts"
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              看看文章
              <Icon name="chevronRight" size={16} />
            </Link>
            <Link
              href="/about"
              className="inline-flex h-9 items-center rounded-full border border-border/70 px-4 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted"
            >
              关于我
            </Link>
          </div>

          <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
            <Stat value={postsCount} label="篇文章" />
            <span className="h-3 w-px bg-border" />
            <Stat value={tagsCount} label="个标签" />
            <span className="h-3 w-px bg-border" />
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
              在更新中
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="font-heading text-lg font-semibold text-foreground tabular-nums">
        {value}
      </span>
      {label}
    </span>
  )
}