"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Icon } from "@/components/icons"

function RedirectInner() {
  const params = useSearchParams()
  const target = params.get("url") || params.get("link") || params.get("to") || ""
  const [count, setCount] = React.useState(3)

  React.useEffect(() => {
    if (!/^https?:\/\//i.test(target)) return
    if (count <= 0) { location.href = target; return }
    const t = setTimeout(() => setCount(count - 1), 800)
    return () => clearTimeout(t)
  }, [count, target])

  if (!target) {
    return (
      <div className="mx-auto max-w-md px-5 py-28 text-center">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">缺少链接参数</h1>
        <p className="mt-2 text-sm text-muted-foreground">用法: ?url=https://example.com</p>
      </div>
    )
  }

  const valid = /^https?:\/\//i.test(target)

  return (
    <div className="mx-auto max-w-md px-5 py-28 text-center">
      {valid && (
        <div className="mx-auto mb-6 size-7 animate-spin rounded-full border-[3px] border-border border-t-primary" />
      )}
      <h1 className="font-heading text-2xl font-semibold tracking-tight">
        {valid ? `即将跳转 (${count})` : "链接格式不正确"}
      </h1>
      <p className="mt-3 break-all text-sm text-primary underline underline-offset-4">
        {target}
      </p>

      <div className="mx-auto mt-8 max-w-xs space-y-2 rounded-2xl border border-border/60 bg-muted/50 p-4 text-left text-xs text-muted-foreground">
        <p className="inline-flex items-center gap-1.5">
          <Icon name="star" size={14} className="text-amber-500" />
          请确认链接来源可靠，避免访问陌生网站
        </p>
        {valid && (
          <p className="inline-flex items-center gap-1.5">
            <Icon name="clock" size={14} className="text-muted-foreground" />
            倒计时结束后将自动跳转，你也可以直接点击下方按钮
          </p>
        )}
      </div>

      <a
        href={target}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-transform"
      >
        手动跳转
        <Icon name="arrowRight" size={14} />
      </a>
    </div>
  )
}

export default function RedirectPage() {
  return (
    <Suspense>
      <RedirectInner />
    </Suspense>
  )
}
