"use client"

import * as React from "react"
import Link from "next/link"
import { Icon } from "@/components/icons"

export default function BrowserInfoPage() {
  const [mounted, setMounted] = React.useState(false)
  const [info, setInfo] = React.useState<Record<string, any>>({})
  const [clientUA, setClientUA] = React.useState("")

  React.useEffect(() => {
    setMounted(true)
    setClientUA(navigator.userAgent)

    const loadScript = () => {
      const w = window as any
      if (!w.browser) return
      Promise.all([
        w.browser.getInfo(),
        w.browser.getFingerprint(),
      ]).then(([info, fp]) => {
        setInfo({ ...info, ...fp })
      }).catch(() => {})
    }

    if ((window as any).browser) {
      loadScript()
    } else {
      const s = document.createElement("script")
      s.src = "https://cdn.jsdelivr.net/npm/browser-tool@1.3.3/dist/browser.min.js"
      s.onload = loadScript
      document.head.appendChild(s)
    }
  }, [])

  const browserName = info.browser || "—"
  const browserVer = info.browserVersion || "—"
  const engine = info.engine || "—"
  const isWebview = info.isWebview
  const isRobot = info.isRobot

  if (!mounted) {
    return (
      <div className="mx-auto max-5xl px-5 py-16">
        <Link href="/tools" className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary">
          <Icon name="arrowLeft" size={14} />
          返回工具
        </Link>
        <header className="mb-10">
          <div className="mb-3 grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Icon name="search" size={24} />
          </div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">浏览器信息</h1>
          <p className="mt-2 text-sm text-muted-foreground">加载中...</p>
        </header>
      </div>
    )
  }

  return (
    <div className="mx-auto max-5xl px-5 py-16">
      <Link href="/tools" className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary">
        <Icon name="arrowLeft" size={14} />
        返回工具
      </Link>

      <header className="mb-10">
        <div className="mb-3 grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Icon name="search" size={24} />
        </div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">浏览器信息</h1>
        <p className="mt-2 text-sm text-muted-foreground">基于 browser-tool 库，查看当前浏览器可获取的所有信息。</p>
      </header>

      <div className="space-y-8">
        <Section title="浏览器">
          <Row label="名称" value={browserName} />
          <Row label="版本" value={browserVer} />
          <Row label="内核" value={engine} />
          <Row label="WebView" value={isWebview !== undefined ? (isWebview ? "是" : "否") : "—"} />
          <Row label="爬虫" value={isRobot !== undefined ? (isRobot ? "是" : "否") : "—"} />
          <Row label="User Agent" value={clientUA} />
        </Section>

        <Section title="操作系统">
          <Row label="系统" value={info.system || "—"} />
          <Row label="版本" value={info.systemVersion || "—"} />
          <Row label="平台" value={info.platform || "—"} />
          <Row label="架构" value={info.architecture || "—"} />
          <Row label="位数" value={info.bitness ? `${info.bitness}位` : "—"} />
        </Section>

        <Section title="设备">
          <Row label="设备类型" value={info.device || "—"} />
          <Row label="像素比" value={`${window.devicePixelRatio}x`} />
          <Row label="设备内存" value={(navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : "未知"} />
          <Row label="CPU 核心" value={String(navigator.hardwareConcurrency)} />
          <Row label="最大触控" value={String(navigator.maxTouchPoints)} />
        </Section>

        <Section title="屏幕">
          <Row label="分辨率" value={`${screen.width} × ${screen.height}`} />
          <Row label="色彩深度" value={`${screen.colorDepth} bit`} />
          <Row label="方向" value={screen.orientation?.type || "—"} />
        </Section>

        <Section title="网络">
          <Row label="在线" value={navigator.onLine ? "在线" : "离线"} />
          <Row label="连接类型" value={(navigator as any).connection?.effectiveType || "—"} />
          <Row label="下行速度" value={(navigator as any).connection?.downlink ? `${(navigator as any).connection.downlink} Mbps` : "—"} />
        </Section>

        <Section title="语言与时区">
          <Row label="语言" value={navigator.language} />
          <Row label="时区" value={Intl.DateTimeFormat().resolvedOptions().timeZone} />
          <Row label="当前时间" value={new Date().toLocaleString("zh-CN")} suppressHydrationWarning />
        </Section>

        <Section title="浏览器指纹">
          <Row label="Canvas 指纹" value={info.canvas || "—"} />
          <Row label="WebGL 指纹" value={info.webgl || "—"} />
          <Row label="字体指纹" value={info.font || "—"} />
          <Row label="Audio 指纹" value={info.audio || "—"} />
          <Row label="MIME 指纹" value={info.mime || "—"} />
          <Row label="综合指纹" value={info.value || "—"} />
        </Section>

        <Section title="功能支持">
          <Row label="WebGL" value={typeof (window as any).WebGLRenderingContext !== "undefined" ? "支持" : "不支持"} />
          <Row label="NFC" value={typeof (window as any).NDEFReader !== "undefined" ? "支持" : "不支持"} />
          <Row label="WebSocket" value={typeof WebSocket !== "undefined" ? "支持" : "不支持"} />
          <Row label="WebAssembly" value={typeof WebAssembly !== "undefined" ? "支持" : "不支持"} />
          <Row label="Service Worker" value={"serviceWorker" in navigator ? "支持" : "不支持"} />
          <Row label="Web Worker" value={typeof Worker !== "undefined" ? "支持" : "不支持"} />
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-3 font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wider">{title}</h2>
      <div className="divide-y divide-border/60 rounded-xl border border-border/60">{children}</div>
    </div>
  )
}

function Row({ label, value, suppressHydrationWarning }: { label: string; value: string; suppressHydrationWarning?: boolean }) {
  return (
    <div className="flex items-start gap-4 px-4 py-3 text-sm">
      <span className="w-28 shrink-0 text-muted-foreground">{label}</span>
      <span className="break-all text-foreground/90 font-mono text-xs leading-relaxed" suppressHydrationWarning={suppressHydrationWarning}>
        {value || "—"}
      </span>
    </div>
  )
}
