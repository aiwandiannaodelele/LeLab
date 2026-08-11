"use client"

import * as React from "react"
import { Icon } from "@/components/icons"

const SECTIONS = [
  { id: "moments", label: "动态", icon: "sparkles" },
  { id: "posts", label: "随笔", icon: "book" },
  { id: "tags", label: "标签", icon: "tag" },
  { id: "footprint", label: "足迹", icon: "star" },
]
export function HomeNav() {
  const [active, setActive] = React.useState("")
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 200)
      let current = ""
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top <= 160) current = s.id
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <nav
      className={`fixed right-5 top-1/2 z-40 -translate-y-1/2 flex-col items-center gap-1.5 rounded-2xl border border-border/60 bg-background/70 p-1.5 shadow-lg backdrop-blur-xl transition-all duration-300 ${
        visible ? "flex opacity-100" : "pointer-events-none hidden opacity-0"
      }`}
    >
      {SECTIONS.map((s) => (
        <button
          key={s.id}
          type="button"
          aria-label={s.label}
          title={s.label}
          onClick={() => scrollTo(s.id)}
          className={`group relative grid size-9 place-items-center rounded-xl transition-colors ${
            active === s.id
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Icon name={s.icon} size={16} />
          <span className="pointer-events-none absolute right-full mr-2 whitespace-nowrap rounded-md border border-border/60 bg-background px-2 py-1 text-xs text-muted-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
            {s.label}
          </span>
        </button>
      ))}
    </nav>
  )
}
