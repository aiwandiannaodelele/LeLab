"use client"

import * as React from "react"
import Link from "next/link"
import Script from "next/script"
import { Icon } from "@/components/icons"

export default function BrowserInfoPage() {
  const [info, setInfo] = React.useState<Record<string, any>>({})

  React.useEffect(() => {
    const w = window as any
    if (!w.browser) {
      // 等待脚本加载
      const check = setInterval(() => {
        if (w.browser) {
          clearInterval(check)
          loadInfo()
        }
      }, 100)
      setTimeout(() => clearInterval(check), 5000)
      return
    }
    loadInfo()

    async function loadInfo() {
      try {
        const b = w.browser
        const basic = b.parse()
        const fingerprint = await b.getFingerprint()
        const support = {
          webgl: b.isSupport("webgl"),
          nfc: b.isSupport("nfc"),
        }
        setInfo({ basic, fingerprint, support })
      } catch {}
    }
  }, [])

  const basic = info.basic || {}
  const fingerprint = info.fingerprint || {}

  // 平台检测
  const platform = basic.platform || ""
  const arch = basic.architecture || ""
  const bitness = basic.bitness ?? ""

  // 浏览器信息
  const browserName = basic.browser || "—"
  const browserVer = basic.browserVersion || "—"
  const engine = basic.engine || "—"
  const isWebview = basic.isWebview
  const isRobot = basic.isRobot

  return (
    <div className="mx-auto max-5xl px-5 py-16">
      <Script
        src="https://cdn.jsdelivr.net/npm/browser@1.3.3/dist/browser.min.js"
        strategy="afterInteractive"
      />
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
          基于 browser-tool 库，查看当前浏览器可获取的所有信息。
        </p>
      </header>

      <div className="space-y-8">
        {/* 浏览器 */}
        <Section title="浏览器">
          <Row label="名称" value={browserName} />
          <Row label="版本" value={browserVer} />
          <Row label="内核" value={engine} />
          <Row label="WebView" value={isWebview !== undefined ? (isWebview ? "是" : "否") : "—"} />
          <Row label="爬虫" value={isRobot !== undefined ? (isRobot ? "是" : "否") : "—"} />
          <Row label="User Agent" value={typeof navigator !== "undefined" ? navigator.userAgent : "—"} />
        </Section>

        {/* 操作系统 */}
        <Section title="操作系统">
          <Row label="系统" value={basic.system || "—"} />
          <Row label="版本" value={basic.systemVersion || "—"} />
          <Row label="平台" value={platform} />
          <Row label="架构" value={arch} />
          <Row label="位数" value={bitness ? `${bitness}位` : "—"} />
        </Section>

        {/* 设备 */}
        <Section title="设备">
          <Row label="设备类型" value={basic.device || "—"} />
          <Row label="像素比" value={typeof window !== "undefined" ? `${window.devicePixelRatio}x` : "—"} />
          <Row label="设备内存" value={typeof navigator !== "undefined" ? ((navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : "未知") : "—"} />
          <Row label="CPU 核心" value={typeof navigator !== "undefined" ? String(navigator.hardwareConcurrency) : "—"} />
          <Row label="最大触控" value={typeof navigator !== "undefined" ? String(navigator.maxTouchPoints) : "—"} />
        </Section>

        {/* 屏幕 */}
        <Section title="屏幕">
          <Row label="分辨率" value={typeof screen !== "undefined" ? `${screen.width} × ${screen.height}` : "—"} />
          <Row label="色彩深度" value={typeof screen !== "undefined" ? `${screen.colorDepth} bit` : "—"} />
          <Row label="方向" value={typeof screen !== "undefined" ? screen.orientation?.type || "—" : "—"} />
        </Section>

        {/* 网络 */}
        <Section title="网络">
          <Row label="在线" value={typeof navigator !== "undefined" ? (navigator.onLine ? "在线" : "离线") : "—"} />
          <Row label="连接类型" value={typeof navigator !== "undefined" ? ((navigator as any).connection?.effectiveType || "—") : "—"} />
          <Row label="下行速度" value={typeof navigator !== "undefined" ? ((navigator as any).connection?.downlink ? `${(navigator as any).connection.downlink} Mbps` : "—") : "—"} />
        </Section>

        {/* 语言和时区 */}
        <Section title="语言与时区">
          <Row label="语言" value={typeof navigator !== "undefined" ? navigator.language : "—"} />
          <Row label="时区" value={typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "—"} />
          <Row label="当前时间" value={new Date().toLocaleString("zh-CN")} />
        </Section>

        {/* 特征指纹 */}
        <Section title="浏览器指纹">
          <Row label="Canvas 指纹" value={fingerprint.canvas || "—"} />
          <Row label="WebGL 指纹" value={fingerprint.webgl || "—"} />
          <Row label="字体指纹" value={fingerprint.font || "—"} />
          <Row label="Audio 指纹" value={fingerprint.audio || "—"} />
          <Row label="MIME 指纹" value={fingerprint.mime || "—"} />
          <Row label="综合指纹" value={fingerprint.value || "—"} />
        </Section>

        {/* 功能支持 */}
        <Section title="功能支持">
          <Row label="WebGL" value={info.support?.webgl ? "支持" : "不支持"} />
          <Row label="NFC" value={info.support?.nfc ? "支持" : "不支持"} />
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
      <h2 className="mb-3 font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        {title}
      </h2>
      <div className="divide-y divide-border/60 rounded-xl border border-border/60">
        {children}
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 px-4 py-3 text-sm">
      <span className="w-28 shrink-0 text-muted-foreground">{label}</span>
      <span className="break-all text-foreground/90 font-mono text-xs leading-relaxed">
        {value || "—"}
      </span>
    </div>
  )
}
