"use client"

import * as React from "react"

const STATUS_API = "https://status.lelab.cc.cd/api/status"

const statusColors: Record<string, string> = {
  "编程中": "bg-blue-500/10 text-blue-500 border-blue-500/30",
  "刷题中": "bg-purple-500/10 text-purple-500 border-purple-500/30",
  "游戏中": "bg-rose-500/10 text-rose-500 border-rose-500/30",
}

export function StatusBadge() {
  const [status, setStatus] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch(STATUS_API)
        const data = await res.json()
        setStatus(data.status)
      } catch {
        setStatus(null)
      }
    }
    fetchStatus()
    const t = setInterval(fetchStatus, 30000)
    return () => clearInterval(t)
  }, [])

  if (!status) return null

  const colors = statusColors[status] || "bg-muted text-muted-foreground border-border/60"

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors}`}>
      <span className="relative flex size-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 bg-current" />
        <span className="relative inline-flex size-2 rounded-full bg-current" />
      </span>
      {status}
    </div>
  )
}