"use client"

import * as React from "react"
import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Giscus } from "@/components/giscus"
import { Icon } from "@/components/icons"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/site"

const tabs = [
  { id: "general", label: "💬 综合讨论", desc: "随便聊聊" },
  { id: "tech", label: "💻 技术交流", desc: "前端、后端、DevOps" },
  { id: "help", label: "❓ 问题求助", desc: "遇到问题？来这里问问" },
  { id: "share", label: "✨ 分享展示", desc: "分享你的作品和发现" },
  { id: "chill", label: "☕ 休闲茶水", desc: "摸鱼、日常、闲谈" },
]

function DiscussionsInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const current = tabs.find((t) => t.id === searchParams.get("tab")) || tabs[0]

  const [key, setKey] = React.useState(0)

  function switchTab(tab: string) {
    router.replace(`/discussions?tab=${tab}`, { scroll: false })
    setKey((k) => k + 1)
  }

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-start">
      <aside className="w-full shrink-0 md:w-56">
        <nav className="flex flex-col gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={cn(
                "flex flex-col rounded-xl px-4 py-3 text-left text-sm transition-colors",
                current.id === tab.id
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <span className="font-medium">{tab.label}</span>
              <span className="text-xs text-muted-foreground/70 mt-0.5">{tab.desc}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mb-4">
          <h2 className="font-heading text-lg font-semibold">{current.label}</h2>
          <p className="text-sm text-muted-foreground">{current.desc}</p>
        </div>
        <div key={key}>
          <Giscus
            repo={siteConfig.giscus.repo}
            repoId={siteConfig.giscus.repoId}
            category={siteConfig.giscus.category}
            categoryId={siteConfig.giscus.categoryId}
          />
        </div>
      </div>
    </div>
  )
}

export default function DiscussionsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <header className="mb-10">
        <p className="mb-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon name="sparkles" size={14} className="text-primary" />
          DISCUSSIONS
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">讨论</h1>
        <p className="mt-2 text-sm text-muted-foreground">社区讨论，欢迎参与。</p>
      </header>
      <Suspense fallback={<div className="text-sm text-muted-foreground">加载中...</div>}>
        <DiscussionsInner />
      </Suspense>
    </div>
  )
}
