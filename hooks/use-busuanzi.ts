"use client"

import * as React from "react"

// 用 JSONP 拉取 busuanzi 站点统计并填充到元素，兼容 SPA 路由切换
export function useBusuanzi() {
  React.useEffect(() => {
    let cancelled = false
    let timer: number | undefined

    const fetchCounts = () => {
      const pvEl = document.getElementById("busuanzi_site_pv")
      const uvEl = document.getElementById("busuanzi_site_uv")
      if (!pvEl && !uvEl) return

      const cbName = "busuanzi_cb_" + Math.random().toString(36).slice(2)
      const script = document.createElement("script")
      script.src = `https://busuanzi.ibruce.info/busuanzi?jsonpCallback=${cbName}`

      ;(window as any)[cbName] = (data: any) => {
        if (cancelled) return
        if (pvEl && data.site_pv != null) pvEl.textContent = String(data.site_pv)
        if (uvEl && data.site_uv != null) uvEl.textContent = String(data.site_uv)
        delete (window as any)[cbName]
        script.remove()
      }

      script.onerror = () => {
        delete (window as any)[cbName]
        script.remove()
      }
      document.body.appendChild(script)
    }

    fetchCounts()
    timer = window.setInterval(fetchCounts, 30000)

    return () => {
      cancelled = true
      if (timer) clearInterval(timer)
    }
  }, [])
}
