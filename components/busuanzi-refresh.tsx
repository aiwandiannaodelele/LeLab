"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

export function BusuanziRefresh() {
  const pathname = usePathname()

  React.useEffect(() => {
    const old = document.querySelector('script[src*="busuanzi"]')
    if (old) {
      old.remove()
      const s = document.createElement("script")
      s.src = "https://cdn.busuanzi.cc/busuanzi/3.6.9/busuanzi.min.js"
      s.async = true
      document.body.appendChild(s)
    }
  }, [pathname])

  return null
}
