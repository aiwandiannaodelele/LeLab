import Link from "next/link"
import { Icon } from "@/components/icons"

export const metadata = {
  title: "论坛",
  description: "乐乐 Lab 社区讨论。",
}

type Discussion = {
  title: string
  number: number
  bodyText: string
  createdAt: string
  url: string
  author?: { login: string }
  comments?: { totalCount: number }
}

async function getDiscussions(): Promise<Discussion[]> {
  try {
    const query = `{repository(owner:"aiwandiannaodelele",name:"giscus"){discussions(first:30,orderBy:{field:CREATED_AT,direction:DESC}){nodes{title number bodyText createdAt url author{login} comments{totalCount}}}}}`

    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 300 },
    })

    if (!res.ok) return []
    const json = await res.json()
    return json?.data?.repository?.discussions?.nodes || []
  } catch {
    return []
  }
}

function formatDate(date: string) {
  const d = new Date(date)
  const now = new Date()
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
  if (diff < 60) return "刚刚"
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`
  if (diff < 2592000) return `${Math.floor(diff / 86400)} 天前`
  return d.toLocaleDateString("zh-CN")
}

export default async function ForumPage() {
  const discussions = await getDiscussions()

  return (
    <div className="mx-auto max-5xl px-5 py-16">
      <header className="mb-10">
        <p className="mb-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon name="sparkles" size={14} className="text-primary" />
          FORUM
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          论坛
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          社区讨论，欢迎参与。
        </p>
      </header>

      {discussions.length === 0 ? (
        <p className="text-sm text-muted-foreground">暂无讨论。</p>
      ) : (
        <div className="divide-y divide-border/60">
          {discussions.map((d) => (
            <a
              key={d.number}
              href={d.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 py-4 transition-colors hover:bg-muted/30 -mx-5 px-5 rounded-lg"
            >
              <div className="min-w-0 flex-1">
                <h2 className="font-medium text-sm transition-colors hover:text-primary">
                  {d.title}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                  {d.bodyText}
                </p>
                <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground/70">
                  <span>{d.author?.login || "匿名"}</span>
                  <span>{formatDate(d.createdAt)}</span>
                  <span>{d.comments?.totalCount || 0} 条评论</span>
                </div>
              </div>
              <svg className="shrink-0 mt-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
