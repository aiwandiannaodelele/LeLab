"use client"

import * as React from "react"
import Link from "next/link"
import Fuse from "fuse.js"
import { Icon } from "@/components/icons"

type PostEntry = {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  cover: string
  readingMinutes: number
  content: string
}

export default function SearchPage() {
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<PostEntry[]>([])
  const [index, setIndex] = React.useState<PostEntry[]>([])
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    fetch("/search-index.json")
      .then((r) => r.json())
      .then((data) => setIndex(data))
  }, [])

  React.useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const fuse = new Fuse(index, {
      keys: [
        { name: "title", weight: 2 },
        { name: "tags", weight: 1.5 },
        { name: "excerpt", weight: 1 },
        { name: "content", weight: 0.5 },
      ],
      threshold: 0.4,
      includeScore: true,
    })
    setResults(fuse.search(query).slice(0, 20).map((r) => r.item))
  }, [query, index])

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <header className="mb-10">
        <p className="mb-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon name="search" size={14} className="text-primary" />
          SEARCH
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">搜索</h1>
        <p className="mt-2 text-sm text-muted-foreground">全站文章全文检索。</p>
      </header>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Icon name="search" size={16} className="text-muted-foreground" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="输入关键词搜索文章..."
          className="w-full rounded-2xl border border-border/60 bg-card py-3.5 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
          autoFocus
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(""); inputRef.current?.focus() }}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Icon name="cancel" size={16} />
          </button>
        )}
      </div>

      {query && results.length === 0 && (
        <div className="mt-16 text-center">
          <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-muted">
            <Icon name="search" size={22} className="text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">未找到匹配结果</p>
          <p className="mt-1 text-xs text-muted-foreground/50">试试其他关键词</p>
        </div>
      )}

      {results.length > 0 && (
        <p className="mt-4 text-xs text-muted-foreground/50">
          找到 {results.length} 篇相关文章
        </p>
      )}

      <div className="mt-4 space-y-3">
        {results.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}/`}
            className="group block rounded-2xl border border-border/60 bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div
                className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl text-lg"
                style={{ backgroundColor: post.cover + "20" }}
              >
                <span style={{ color: post.cover }}>
                  <Icon name="book" size={16} />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-heading text-base font-semibold tracking-tight transition-colors group-hover:text-primary">
                  {highlight(post.title, query)}
                </h2>
                <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {highlight(post.excerpt, query)}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground/70">
                  <span className="inline-flex items-center gap-1">
                    <Icon name="calendar" size={12} />
                    {formatDate(post.date)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Icon name="clock" size={12} />
                    {post.readingMinutes} 分钟
                  </span>
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-2 py-0.5 text-[11px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function highlight(text: string, query: string) {
  if (!query.trim()) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const parts = text.split(new RegExp(`(${escaped})`, "gi"))
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="rounded bg-primary/15 text-foreground px-0.5">{part}</mark>
      : part,
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })
}
