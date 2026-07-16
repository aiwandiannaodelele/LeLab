import Link from "next/link"
import Image from "next/image"
import { siteConfig } from "@/lib/site"
import { Icon } from "@/components/icons"
import { ScheduleCard } from "@/components/schedule-card"

export function Hero() {
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

      <div className="mx-auto max-w-5xl px-5 pt-12 pb-8 sm:pt-16">
        <div className="flex flex-col items-center gap-4">
          <Image
            src={siteConfig.author.avatar}
            alt={siteConfig.author.name}
            width={56}
            height={56}
            className="size-14 rounded-full object-cover ring-2 ring-border/50"
            unoptimized
          />
          <div>
            <h1 className="font-heading text-xl font-semibold tracking-tight text-center sm:text-2xl">
              {siteConfig.author.name}
            </h1>
            <p className="mt-0.5 text-center text-sm text-muted-foreground">
              {siteConfig.author.bio}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/posts"
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-primary px-3.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            看看文章
            <Icon name="chevronRight" size={14} />
          </Link>
          <Link
            href="/about"
            className="inline-flex h-8 items-center rounded-full border border-border/70 px-3.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted"
          >
            关于我
          </Link>
        </div>

        <div className="mt-6 max-w-md mx-auto">
          <ScheduleCard />
        </div>
      </div>
    </section>
  )
}