"use client"

import * as React from "react"

export function GiscusConsent({ term = "general" }: { term?: string }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const loaded = React.useRef("")

  React.useEffect(() => {
    if (!ref.current || loaded.current === term) return
    loaded.current = term

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
    s.setAttribute("data-theme", "preferred_color_scheme")
    s.setAttribute("data-lang", "zh-CN")
    s.setAttribute("data-loading", "lazy")
    s.crossOrigin = "anonymous"
    s.async = true

    parent.appendChild(s)
  }, [term])

  return <div ref={ref} className="mt-14" />
}
