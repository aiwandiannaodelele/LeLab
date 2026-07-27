"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
  GISCUS_DARK_THEME,
  GISCUS_LIGHT_THEME,
} from "@/lib/giscus-themes"

export function GiscusConsent({ term = "general" }: { term?: string }) {
  const { resolvedTheme } = useTheme()
  const ref = React.useRef<HTMLDivElement>(null)
  const loaded = React.useRef("")

  React.useEffect(() => {
    if (!ref.current) return

    const theme =
      resolvedTheme === "dark" ? GISCUS_DARK_THEME : GISCUS_LIGHT_THEME
    const key = term + "|" + theme
    if (loaded.current === key) return
    loaded.current = key

    const parent = ref.current
    parent.innerHTML = ""

    const s = document.createElement("script")
    s.src = "https://giscus.app/client.js"
    s.setAttribute("data-repo", "aiwandiannaodelele/giscus")
    s.setAttribute("data-repo-id", "R_kgDOTY2nVw")
    s.setAttribute("data-category", "Announcements")
    s.setAttribute("data-category-id", "DIC_kwDOTY2nV84DBOPb")
    s.setAttribute("data-mapping", "specific")
    s.setAttribute("data-term", term)
    s.setAttribute("data-strict", "0")
    s.setAttribute("data-reactions-enabled", "1")
    s.setAttribute("data-emit-metadata", "0")
    s.setAttribute("data-input-position", "top")
    s.setAttribute("data-theme", theme)
    s.setAttribute("data-lang", "zh-CN")
    s.setAttribute("data-loading", "lazy")
    s.crossOrigin = "anonymous"
    s.async = true

    parent.appendChild(s)
  }, [term, resolvedTheme])

  return (
    <div className="mt-14 border-t border-border/60 pt-8">
      <div ref={ref} />
    </div>
  )
}
