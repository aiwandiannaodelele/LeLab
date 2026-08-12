"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

// 与 busuanzi 官方脚本相同的 POST 计数方式，兼容 SPA 路由切换
export function useBusuanzi() {
  const pathname = usePathname()

  React.useEffect(() => {
    let cancelled = false

    const fill = (data: Record<string, any>) => {
      if (cancelled) return
      const targets: [string, string][] = [
        ["busuanzi_site_pv", "busuanzi_site_pv"],
        ["busuanzi_site_uv", "busuanzi_site_uv"],
      ]
      for (const [key, elId] of targets) {
        const el = document.getElementById(elId)
        if (el && data[key] != null) el.textContent = String(data[key])
      }
    }

    fetch("https://cdn.busuanzi.cc/api.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: location.href, referrer: document.referrer }),
      credentials: "include",
    })
      .then((r) => r.json())
      .then(fill)
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [pathname])
}
