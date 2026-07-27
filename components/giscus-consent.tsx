"use client"

import * as React from "react"
import { Icon } from "@/components/icons"

export function GiscusConsent({ term = "general" }: { term?: string }) {
  const [consented, setConsented] = React.useState(false)

  React.useEffect(() => {
    function check() {
      const match = document.cookie.match(/(?:^|;\s*)cookie_consent_user_consent_token(?:\s*=\s*([^;]*))?\s*$/)
      if (match) setConsented(true)
    }
    check()
    window.addEventListener("cookieconsent", check)
    return () => window.removeEventListener("cookieconsent", check)
  }, [])

  if (!consented) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-6 text-center">
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

  return (
    <div id="giscus-comments">
      <script
        src="https://giscus.app/client.js"
        data-repo="aiwandiannaodelele/giscus"
        data-repo-id="R_kgDOTY2nVw"
        data-category="Announcements"
        data-category-id="DIC_kwDOTY2nV84DBOPb"
        data-mapping="specific"
        data-term={term}
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="top"
        data-theme="preferred_color_scheme"
        data-lang="zh-CN"
        data-loading="lazy"
        crossOrigin="anonymous"
        async
      />
    </div>
  )
}
