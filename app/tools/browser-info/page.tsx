"use client"

import * as React from "react"
import Link from "next/link"
import { Icon } from "@/components/icons"

type BrowserInfo = {
  label: string
  value: string
  category: string
}

export default function BrowserInfoPage() {
  const [info, setInfo] = React.useState<BrowserInfo[]>([])

  React.useEffect(() => {
    const d = document
    const w = window
    const n = navigator
    const s = screen
    const l = location
    const items: BrowserInfo[] = [
      { label: "User Agent", value: n.userAgent, category: "浏览器" },
      { label: "平台", value: n.platform, category: "浏览器" },
      { label: "语言", value: n.language, category: "浏览器" },
      { label: "在线状态", value: n.onLine ? "在线" : "离线", category: "浏览器" },
      { label: "Cookie 启用", value: n.cookieEnabled ? "是" : "否", category: "浏览器" },
      { label: "硬件并发数", value: String(n.hardwareConcurrency), category: "硬件" },
      { label: "设备内存", value: (n as any).deviceMemory ? `${(n as any).deviceMemory} GB` : "未知", category: "硬件" },
      { label: "屏幕分辨率", value: `${s.width} × ${s.height}`, category: "屏幕" },
      { label: "可用分辨率", value: `${s.availWidth} × ${s.availHeight}`, category: "屏幕" },
      { label: "色彩深度", value: `${s.colorDepth} bit`, category: "屏幕" },
      { label: "像素比", value: `${w.devicePixelRatio}x`, category: "屏幕" },
      { label: "视口尺寸", value: `${w.innerWidth} × ${w.innerHeight}`, category: "窗口" },
      { label: "页面 URL", value: l.href, category: "页面" },
      { label: "主机名", value: l.hostname, category: "页面" },
      { label: "协议", value: l.protocol, category: "页面" },
      { label: "时区", value: Intl.DateTimeFormat().resolvedOptions().timeZone, category: "地区" },
      { label: "时区偏移", value: `UTC${new Date().getTimezoneOffset() > 0 ? "-" : "+"}${Math.abs(new Date().getTimezoneOffset() / 60)}`, category: "地区" },
      { label: "当前时间", value: new Date().toLocaleString("zh-CN"), category: "地区" },
      { label: "本地存储", value: typeof Storage !== "undefined" ? "支持" : "不支持", category: "存储" },
      { label: "Session 存储", value: typeof sessionStorage !== "undefined" ? "支持" : "不支持", category: "存储" },
      { label: "WebGL 渲染", value: getWebGLInfo(), category: "图形" },
      { label: "触控支持", value: "ontouchstart" in w ? "是" : "否", category: "输入" },
      { label: "Do Not Track", value: n.doNotTrack || "未设置", category: "隐私" },
    ]
    setInfo(items)
  }, [])

  const groups = info.reduce<Record<string, BrowserInfo[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  return (
    <div className="mx-auto max-5xl px-5 py-16">
      <Link
        href="/tools"
        className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <Icon name="arrowLeft" size={14} />
        返回工具
      </Link>

      <header className="mb-10">
        <div className="mb-3 grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Icon name="search" size={24} />
        </div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          浏览器信息
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          查看当前浏览器可获取的所有信息。
        </p>
      </header>

      <div className="space-y-8">
        {Object.entries(groups).map(([category, items]) => (
          <div key={category}>
            <h2 className="mb-3 font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {category}
            </h2>
            <div className="divide-y divide-border/60 rounded-xl border border-border/60">
              {items.map((item, i) => (
                <div key={i} className="flex items-start gap-4 px-4 py-3 text-sm">
                  <span className="w-28 shrink-0 text-muted-foreground">{item.label}</span>
                  <span className="break-all text-foreground/90 font-mono text-xs leading-relaxed">
                    {item.value || "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function getWebGLInfo(): string {
  try {
    const c = document.createElement("canvas")
    const gl = c.getContext("webgl") || c.getContext("experimental-webgl")
    if (!gl) return "不支持"
    const debugInfo = (gl as any).getExtension("WEBGL_debug_renderer_info")
    if (!debugInfo) return "支持"
    return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "支持"
  } catch {
    return "不支持"
  }
}
