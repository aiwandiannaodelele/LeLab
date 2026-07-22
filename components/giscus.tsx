"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
  GISCUS_DARK_THEME,
  GISCUS_LIGHT_THEME,
} from "@/lib/giscus-themes"

type GiscusProps = {
  repo: string
  repoId: string
  category: string
  categoryId: string
  mapping?: string
  reactionsEnabled?: boolean
  emitMetadata?: boolean
  inputPosition?: "top" | "bottom"
  lang?: string
  compact?: boolean
}

export function Giscus({
  repo,
  repoId,
  category,
  categoryId,
  mapping = "pathname",
  reactionsEnabled = true,
  emitMetadata = false,
  inputPosition = "top",
  lang = "zh-CN",
  compact = false,
}: GiscusProps) {
  const { resolvedTheme } = useTheme()
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!containerRef.current) return

    const theme =
      resolvedTheme === "dark" ? GISCUS_DARK_THEME : GISCUS_LIGHT_THEME

    const script = document.createElement("script")
    script.src = "https://giscus.app/client.js"
    script.setAttribute("data-repo", repo)
    script.setAttribute("data-repo-id", repoId)
    script.setAttribute("data-category", category)
    script.setAttribute("data-category-id", categoryId)
    script.setAttribute("data-mapping", mapping)
    script.setAttribute("data-strict", "0")
    script.setAttribute("data-reactions-enabled", reactionsEnabled ? "1" : "0")
    script.setAttribute("data-emit-metadata", emitMetadata ? "1" : "0")
    script.setAttribute("data-input-position", inputPosition)
    script.setAttribute("data-theme", theme)
    script.setAttribute("data-lang", lang)
    script.setAttribute("crossorigin", "anonymous")
    script.async = true

    const container = containerRef.current
    container.innerHTML = ""
    container.appendChild(script)

    return () => {
      container.innerHTML = ""
    }
  }, [resolvedTheme, repo, repoId, category, categoryId, mapping, reactionsEnabled, emitMetadata, inputPosition, lang])

  return (
    <div className={compact ? "" : "mt-14 pt-8 border-t border-border/60"}>
      <div ref={containerRef} />
    </div>
  )
}