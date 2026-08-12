"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

// 官方 busuanzi 脚本有 busuanziRequestSent 标记只请求一次。
// SPA 路由切换回首页时，清掉标记并重新加载官方脚本，触发重新请求与显示。
export function BusuanziRefresh() {
  const pathname = usePathname()

  React.useEffect(() => {
    ;(window as any).busuanziRequestSent = undefined

    const olds = document.querySelectorAll('script[src*="busuanzi"]')
    olds.forEach((o) => o.remove())

    const s = document.createElement("script")
    s.src = "https://cdn.busuanzi.cc/busuanzi/3.6.9/busuanzi.min.js"
    s.async = true
    document.body.appendChild(s)
  }, [pathname])

  return null
}
