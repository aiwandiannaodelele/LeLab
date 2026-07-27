"use client"

import * as React from "react"
import { Icon } from "@/components/icons"

export function GiscusConsent({ term = "general" }: { term?: string }) {
  const [consented, setConsented] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  const prevTerm = React.useRef(term)

  React.useEffect(() => {
    function check() {
      const match = document.cookie.match(/(?:^|;\s*)cookie_consent_user_consent_token(?:\s*=\s*([^;]*))?\s*$/)
      if (match) setConsented(true)
    }
    check()
    window.addEventListener("cookieconsent", check)
    return () => window.removeEventListener("cookieconsent", check)
  }, [])

  React.useEffect(() => {
    if (!consented || !ref.current) return
    if (prevTerm.current === term) return
    prevTerm.current = term

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
  }, [consented, term])

  if (!consented) {
    return (
      <div className="mx-auto mt-14 max-w-md rounded-2xl border border-border/60 bg-card p-6 text-center">
        <div className="mx-auto mb-3 grid size-12 place-items-center rounded-xl bg-muted">
          <Icon name="discussion" size={20} className="text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">
          启用评论区需要接受"功能型 Cookie"
        </p>
        <a
          href="#"
          id="open_preferences_center"
          className="mt-3 inline-flex h-8 items-center rounded-full bg-primary px-3.5 text-xs font-medium text-primary-foreground"
        >
          前往设置
        </a>
      </div>
    )
  }

  return <div ref={ref} />
}
