"use client"

import * as React from "react"
import { Icon } from "@/components/icons"

export function GithubAccelForm() {
  const [url, setUrl] = React.useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = url.trim()
    if (!trimmed) return
    window.open(`https://ghp.lelab.cc.cd/${trimmed}`, "_blank")
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="输入 GitHub 链接或路径"
        className="flex-1 h-11 rounded-xl border border-border/70 bg-background px-4 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
      />
      <button
        type="submit"
        className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Icon name="sparkles" size={16} />
        加速
      </button>
    </form>
  )
}