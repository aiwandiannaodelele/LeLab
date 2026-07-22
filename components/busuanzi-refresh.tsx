"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

export function BusuanziRefresh() {
  const pathname = usePathname()

  React.useEffect(() => {
    // 重新加载不蒜子脚本（模拟页面刷新）
    const oldScript = document.querySelector('script[src*="busuanzi"]')
    if (oldScript) {
      const newScript = document.createElement("script")
      newScript.src = "https://cdn.busuanzi.cc/busuanzi/3.6.9/busuanzi.min.js"
      newScript.defer = true
      document.head.appendChild(newScript)
    }
    // 兜底：2秒后如果还是 - 就显示空
    const timer = setTimeout(() => {
      document.querySelectorAll("#busuanzi_site_pv, #busuanzi_site_uv").forEach((el) => {
        if (el.textContent === "-" || el.textContent === "") {
          el.textContent = "…"
        }
      })
    }, 2000)
    return () => clearTimeout(timer)
  }, [pathname])

  return null
}
