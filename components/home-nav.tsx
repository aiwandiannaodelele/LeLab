"use client"

import * as React from "react"

const SECTIONS = [
  { id: "footprint", label: "足迹" },
  { id: "moments", label: "动态" },
  { id: "posts", label: "随笔" },
  { id: "tags", label: "标签" },
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
        if (el && el.getBoundingClientRect().top <= 120) current = s.id
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
      className={`fixed left-1/2 top-20 z-40 -translate-x-1/2 rounded-full border border-border/60 bg-background/70 px-1.5 py-1.5 shadow-lg backdrop-blur-xl transition-all duration-300 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="flex items-center gap-0.5">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollTo(s.id)}
            className={`rounded-full px-3.5 py-1.5 text-xs transition-colors ${
              active === s.id
                ? "bg-primary/10 font-medium text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
