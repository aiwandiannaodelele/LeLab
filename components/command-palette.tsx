"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Fuse from "fuse.js"
import { pinyin } from "pinyin-pro"
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import { Icon } from "@/components/icons"
import { siteConfig } from "@/lib/site"

type SearchItem = {
  id: string
  title: string
  titlePy: string
  excerpt?: string
  excerptPy?: string
  tags?: string
  href: string
  group: string
  icon?: string
}

const navIconMap: Record<string, string> = {
  "/": "home",
  "/posts": "book",
  "/projects": "github",
  "/tags": "tag",
  "/resources": "folder",
  "/discussions/general": "discussion",
  "/tools": "settings",
  "/links": "link",
  "/about": "sparkles",
}

export function CommandPalette({
  posts,
}: {
  posts: { slug: string; title: string; excerpt: string }[]
}) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [fullIndex, setFullIndex] = React.useState<
    { slug: string; title: string; excerpt: string; tags: string[]; content: string }[]
  >([])

  React.useEffect(() => {
    fetch("/search-index.json")
      .then((r) => r.json())
      .then((data) => setFullIndex(data))
  }, [])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    const onOpen = () => setOpen(true)
    document.addEventListener("keydown", down)
    window.addEventListener("open-command-palette", onOpen)
    return () => {
      document.removeEventListener("keydown", down)
      window.removeEventListener("open-command-palette", onOpen)
    }
  }, [])

  const pages = React.useMemo(
    () =>
      siteConfig.nav.map((n) => ({
        id: n.href,
        title: n.label,
        titlePy: pinyin(n.label, { toneType: "none", separator: "", type: "string" }),
        href: n.href,
        group: "页面",
        icon: navIconMap[n.href] || n.icon,
      })),
    [],
  )

  const postItems = React.useMemo(
    () =>
      posts.map((p) => ({
        id: p.slug,
        title: p.title,
        titlePy: pinyin(p.title, { toneType: "none", separator: "", type: "string" }),
        excerpt: p.excerpt,
        excerptPy: p.excerpt
          ? pinyin(p.excerpt, { toneType: "none", separator: "", type: "string" })
          : undefined,
        href: `/posts/${p.slug}`,
        group: "文章",
      })),
    [posts],
  )

  const toolItems: SearchItem[] = [
    {
      id: "github-accelerator",
      title: "GitHub 加速",
      titlePy: "githubjiasu",
      href: "/tools/github-accelerator",
      group: "工具",
      icon: "github",
    },
    {
      id: "browser-info",
      title: "浏览器信息",
      titlePy: "liulanqixinxi",
      href: "/tools/browser-info",
      group: "工具",
      icon: "search",
    },
  ]

  const items = React.useMemo(
    () => [...pages, ...toolItems, ...postItems],
    [pages, postItems],
  )

  const fuse = React.useMemo(
    () =>
      new Fuse(items, {
        keys: [
          { name: "title", weight: 3 },
          { name: "titlePy", weight: 3 },
          { name: "excerpt", weight: 1 },
          { name: "excerptPy", weight: 1 },
        ],
        threshold: 0.4,
      }),
    [items],
  )

  const fullFuse = React.useMemo(
    () =>
      new Fuse(fullIndex, {
        keys: [
          { name: "title", weight: 2 },
          { name: "tags", weight: 1.5 },
          { name: "excerpt", weight: 1 },
        ],
        threshold: 0.5,
      }),
    [fullIndex],
  )

  const [query, setQuery] = React.useState("")

  const navResults = query ? fuse.search(query).map((r) => r.item) : items
  const fullResults = query ? fullFuse.search(query).slice(0, 5).map((r) => r.item) : []

  const grouped = navResults.reduce<Record<string, SearchItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = []
    acc[item.group].push(item)
    return acc
  }, {})

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="absolute left-1/2 top-[15%] z-50 w-full max-w-xl -translate-x-1/2 rounded-2xl border border-border/60 bg-background shadow-2xl shadow-black/10">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="搜索页面、文章、全文..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>
              {fullResults.length > 0 ? null : "没有找到结果。"}
            </CommandEmpty>
            {Object.entries(grouped).map(([group, groupItems]) => (
              groupItems.length > 0 && (
                <CommandGroup key={group} heading={group}>
                  {groupItems.map((item) => (
                    <CommandItem
                      key={item.id}
                      onSelect={() => {
                        setOpen(false)
                        router.push(item.href)
                      }}
                      className="group"
                    >
                      {item.icon ? (
                        <span className="flex size-6 items-center justify-center rounded-md bg-muted text-muted-foreground group-aria-selected:bg-primary/10 group-aria-selected:text-primary">
                          <Icon name={item.icon} size={14} />
                        </span>
                      ) : (
                        <span className="flex size-6 items-center justify-center rounded-md bg-muted text-muted-foreground">
                          <Icon name="book" size={14} />
                        </span>
                      )}
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <span className="font-medium truncate">{item.title}</span>
                        {item.excerpt && (
                          <span className="hidden truncate text-xs text-muted-foreground sm:inline">
                            {item.excerpt}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )
            ))}
            {fullResults.length > 0 && (
              <CommandGroup heading="全文搜索">
                {fullResults.map((item) => (
                  <CommandItem
                    key={item.slug}
                    onSelect={() => {
                      setOpen(false)
                      router.push(`/posts/${item.slug}`)
                    }}
                    className="group"
                  >
                    <span className="flex size-6 items-center justify-center rounded-md bg-muted text-muted-foreground group-aria-selected:bg-primary/10 group-aria-selected:text-primary">
                      <Icon name="search" size={14} />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="font-medium truncate">{item.title}</span>
                      <span className="truncate text-xs text-muted-foreground/60">
                        {matchExcerpt(item.content, query)}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </div>
    </div>
  )
}

function matchExcerpt(content: string, query: string) {
  if (!query.trim() || !content) return content?.slice(0, 80) || ""
  try {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const re = new RegExp(`(${escaped})`, "gi")
    const sentences = content.split(/[。！？\n]/).filter((s) => s.trim().length > 0)

    for (const sentence of sentences) {
      if (re.test(sentence)) {
        const trimmed = sentence.trim()
        if (trimmed.length <= 120) {
          const parts = trimmed.split(re)
          return parts.map((part, i) =>
            part.toLowerCase() === query.toLowerCase()
              ? <mark key={i} className="rounded-sm bg-amber-500/20 font-medium text-foreground px-0.5">{part}</mark>
              : part,
          )
        }
        const idx = trimmed.toLowerCase().indexOf(query.toLowerCase())
        const start = Math.max(0, idx - 20)
        const snippet = (start > 0 ? "…" : "") + trimmed.slice(start, start + 120)
        const parts = snippet.split(re)
        return parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase()
            ? <mark key={i} className="rounded-sm bg-amber-500/20 font-medium text-foreground px-0.5">{part}</mark>
            : part,
        )
      }
    }
  } catch { }
  return content.slice(0, 120) + "…"
}
