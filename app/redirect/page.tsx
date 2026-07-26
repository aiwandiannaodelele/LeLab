"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

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
      <p className="mt-2 break-all text-sm text-primary underline underline-offset-4">
        {target}
      </p>
      <a
        href={target}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex h-9 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
      >
        手动跳转
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
