"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Fuse from "fuse.js"
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
  excerpt?: string
  href: string
  group: string
  icon?: string
}

const navIconMap: Record<string, string> = {
  "/": "home",
  "/posts": "book",
  "/tags": "tag",
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

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const pages = React.useMemo(
    () =>
      siteConfig.nav.map((n) => ({
        id: n.href,
        title: n.label,
        href: n.href,
        group: "页面",
        icon: navIconMap[n.href],
      })),
    [],
  )

  const postItems = React.useMemo(
    () =>
      posts.map((p) => ({
        id: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        href: `/posts/${p.slug}`,
        group: "文章",
      })),
    [posts],
  )

  const items = React.useMemo(() => [...pages, ...postItems], [pages, postItems])

  const fuse = React.useMemo(
    () =>
      new Fuse(items, {
        keys: [
          { name: "title", weight: 2 },
          { name: "excerpt", weight: 1 },
        ],
        threshold: 0.4,
      }),
    [items],
  )

  const [query, setQuery] = React.useState("")

  const results = query ? fuse.search(query).map((r) => r.item) : items

  const grouped = results.reduce<Record<string, SearchItem[]>>((acc, item) => {
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
            placeholder="搜索页面和文章..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>没有找到结果。</CommandEmpty>
            {Object.entries(grouped).map(([group, groupItems]) => (
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
            ))}
          </CommandList>
        </Command>
      </div>
    </div>
  )
}