"use client"

import * as React from "react"

const STATUS_API = "https://status.lelab.cc.cd/api/status"

const statusColors: Record<string, string> = {
  "编程中": "bg-blue-500/10 text-blue-500",
  "刷题中": "bg-purple-500/10 text-purple-500",
  "游戏中": "bg-rose-500/10 text-rose-500",
}

export function useStatus() {
  const [data, setData] = React.useState<{ status: string | null; battery: string | null }>({
    status: null,
    battery: null,
  })

  React.useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch(STATUS_API)
        const d = await res.json()
        setData({ status: d.status || null, battery: d.battery || null })
      } catch {
        setData({ status: null, battery: null })
      }
    }
    fetchStatus()
    const t = setInterval(fetchStatus, 15000)
    return () => clearInterval(t)
  }, [])

  return data
}