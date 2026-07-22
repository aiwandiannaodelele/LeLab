import { notFound } from "next/navigation"
import { Giscus } from "@/components/giscus"
import { Icon } from "@/components/icons"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"
import Link from "next/link"

const tabs = [
  { id: "general", label: "综合讨论", desc: "随便聊聊" },
  { id: "tech", label: "技术交流", desc: "前端、后端、DevOps" },
  { id: "help", label: "问题求助", desc: "遇到问题？来这里问问" },
  { id: "share", label: "分享展示", desc: "分享你的作品和发现" },
  { id: "chill", label: "休闲茶水", desc: "摸鱼、日常、闲谈" },
]

export async function generateStaticParams() {
  return tabs.map((t) => ({ tab: t.id }))
}

export default async function DiscussionTabPage({
  params,
}: {
  params: Promise<{ tab: string }>
}) {
  const { tab } = await params
  const current = tabs.find((t) => t.id === tab)
  if (!current) notFound()

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <header className="mb-10">
        <p className="mb-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon name="sparkles" size={14} className="text-primary" />
          DISCUSSIONS
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">讨论</h1>
        <p className="mt-2 text-sm text-muted-foreground">社区讨论，欢迎参与。</p>
      </header>

      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <aside className="w-full shrink-0 md:w-56 md:sticky md:top-20">
          <nav className="flex flex-col gap-1">
            {tabs.map((t) => (
              <Link
                key={t.id}
                href={`/discussions/${t.id}`}
                className={cn(
                  "flex flex-col rounded-xl px-4 py-3 text-left text-sm transition-colors",
                  t.id === tab
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                <span className="font-medium">{t.label}</span>
                <span className="text-xs text-muted-foreground/70 mt-0.5">{t.desc}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <Giscus
            repo={siteConfig.giscus.repo}
            repoId={siteConfig.giscus.repoId}
            category={siteConfig.giscus.category}
            categoryId={siteConfig.giscus.categoryId}
            compact
          />
        </div>
      </div>
    </div>
  )
}
