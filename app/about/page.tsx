import Image from "next/image"
import Link from "next/link"
import { siteConfig } from "@/lib/site"
import { getAllPosts, getAllTags } from "@/lib/posts"
import { Icon } from "@/components/icons"

export const metadata = {
  title: "关于",
  description: siteConfig.description,
}

const tagsList = [
  "bash", "cloud deployment", "agent", "OI", "sqlite", "node.js",
  "rustdesk", "automation", "NAS", "CI/CD", "ipv6", "react",
  "version control", "vmware", "vibe coding", "docker", "ai",
  "fullstack development", "static site", "algorithm", "c++", "linux",
  "ddns", "frontend development", "git", "serverless", "homeassistant",
  "cloud computing", "edge deployment", "python", "nginx", "skills",
  "typescript", "remote desktop", "containerization", "api development",
]

export default async function AboutPage() {
  const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()])

  return (
    <div className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px] dark:bg-primary/20" />
        <div className="absolute -top-16 right-0 size-[380px] rounded-full bg-pink-400/15 blur-[120px] dark:bg-pink-500/15" />
        <div className="absolute -left-16 top-32 size-[360px] rounded-full bg-emerald-400/10 blur-[120px] dark:bg-emerald-500/10" />
      </div>

      <div className="mx-auto max-w-2xl px-5 pt-8 pb-8 sm:pt-12">
        <div className="flex flex-col items-center gap-6">
          <Image
            src={siteConfig.author.avatar}
            alt={siteConfig.author.name}
            width={100}
            height={100}
            className="size-24 rounded-full object-cover ring-4 ring-border/50 sm:size-28"
            unoptimized
          />

          <div className="text-center">
            <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              {siteConfig.author.name}
            </h1>
            <p className="mt-2 text-base text-muted-foreground">
              {siteConfig.author.bio}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {siteConfig.socials.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="inline-flex size-10 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Icon name={s.icon} size={20} />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-4">
          <StatCard label="文章" value={posts.length} />
          <StatCard label="标签" value={tags.length} />
          <StatCard label="上次更新" value={new Date().toLocaleDateString("zh-CN", { month: "short", day: "numeric" })} />
        </div>

      <div className="mx-auto max-w-2xl px-5 pb-14 sm:pb-18">
        <div className="flex flex-wrap justify-center gap-2">
          {tagsList.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border border-border/60 bg-background/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border border-border/60 bg-background/50 px-4 py-5 backdrop-blur-sm">
      <span className="font-heading text-2xl font-semibold tabular-nums">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}