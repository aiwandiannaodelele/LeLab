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
      // 浏览器
      { label: "User Agent", value: n.userAgent, category: "浏览器" },
      { label: "平台", value: n.platform, category: "浏览器" },
      { label: "语言", value: n.language, category: "浏览器" },
      { label: "语言列表", value: n.languages?.join(", ") || "—", category: "浏览器" },
      { label: "在线状态", value: n.onLine ? "在线" : "离线", category: "浏览器" },
      { label: "Cookie 启用", value: n.cookieEnabled ? "是" : "否", category: "浏览器" },
      { label: "Referrer", value: d.referrer || "无", category: "浏览器" },
      { label: "Do Not Track", value: n.doNotTrack || "未设置", category: "隐私" },

      // 硬件
      { label: "CPU 核心数", value: String(n.hardwareConcurrency), category: "硬件" },
      { label: "设备内存", value: (n as any).deviceMemory ? `${(n as any).deviceMemory} GB` : "未知", category: "硬件" },
      { label: "最大触控点", value: String(n.maxTouchPoints), category: "硬件" },
      { label: "电池", value: "需用户交互后显示", category: "硬件" },

      // 屏幕
      { label: "屏幕分辨率", value: `${s.width} × ${s.height}`, category: "屏幕" },
      { label: "可用分辨率", value: `${s.availWidth} × ${s.availHeight}`, category: "屏幕" },
      { label: "色彩深度", value: `${s.colorDepth} bit`, category: "屏幕" },
      { label: "像素比", value: `${w.devicePixelRatio}x`, category: "屏幕" },
      { label: "屏幕方向", value: s.orientation?.type || "—", category: "屏幕" },
      { label: "扩展色域", value: w.matchMedia("(color-gamut: p3)").matches ? "P3" : "sRGB", category: "屏幕" },
      { label: "HDR 支持", value: w.matchMedia("(dynamic-range: high)").matches ? "是" : "否", category: "屏幕" },

      // 窗口
      { label: "视口尺寸", value: `${w.innerWidth} × ${w.innerHeight}`, category: "窗口" },
      { label: "滚动位置", value: `(${w.scrollX}, ${w.scrollY})`, category: "窗口" },

      // 页面
      { label: "页面 URL", value: l.href, category: "页面" },
      { label: "主机名", value: l.hostname, category: "页面" },
      { label: "端口", value: l.port || "默认", category: "页面" },
      { label: "协议", value: l.protocol, category: "页面" },
      { label: "路径", value: l.pathname, category: "页面" },

      // 存储
      { label: "LocalStorage", value: typeof Storage !== "undefined" ? `${Object.keys(localStorage).length} 项` : "不支持", category: "存储" },
      { label: "SessionStorage", value: typeof sessionStorage !== "undefined" ? "支持" : "不支持", category: "存储" },
      { label: "Cookies", value: d.cookie ? `${d.cookie.length} 字符` : "无", category: "存储" },

      // 网络
      { label: "连接类型", value: ((n as any).connection?.effectiveType) || "—", category: "网络" },
      { label: "下行速度", value: ((n as any).connection?.downlink) ? `${(n as any).connection.downlink} Mbps` : "—", category: "网络" },
      { label: "RTT", value: ((n as any).connection?.rtt) ? `${(n as any).connection.rtt} ms` : "—", category: "网络" },
      { label: "数据节省", value: ((n as any).connection?.saveData) ? "开启" : "关闭", category: "网络" },

      // 地区
      { label: "时区", value: Intl.DateTimeFormat().resolvedOptions().timeZone, category: "地区" },
      { label: "时区偏移", value: `UTC${new Date().getTimezoneOffset() > 0 ? "-" : "+"}${Math.abs(new Date().getTimezoneOffset() / 60)}`, category: "地区" },
      { label: "当前时间", value: new Date().toLocaleString("zh-CN"), category: "地区" },
      { label: "地区", value: Intl.DateTimeFormat().resolvedOptions().locale || "—", category: "地区" },
      { label: "数字格式", value: new Intl.NumberFormat().resolvedOptions().locale, category: "地区" },

      // 图形
      { label: "WebGL 渲染", value: getWebGLInfo(), category: "图形" },
      { label: "Canvas 指纹", value: getCanvasFingerprint(), category: "图形" },

      // 功能检测
      { label: "触控支持", value: "ontouchstart" in w ? "是" : "否", category: "功能" },
      { label: "Service Worker", value: "serviceWorker" in n ? "支持" : "不支持", category: "功能" },
      { label: "Web Worker", value: typeof Worker !== "undefined" ? "支持" : "不支持", category: "功能" },
      { label: "WebSocket", value: typeof WebSocket !== "undefined" ? "支持" : "不支持", category: "功能" },
      { label: "WebRTC", value: typeof RTCPeerConnection !== "undefined" ? "支持" : "不支持", category: "功能" },
      { label: "WebAssembly", value: typeof WebAssembly !== "undefined" ? "支持" : "不支持", category: "功能" },
      { label: "WebGL", value: getWebGLSupport(), category: "功能" },
      { label: "WebGPU", value: typeof (n as any).gpu !== "undefined" ? "支持" : "不支持", category: "功能" },
      { label: "Geolocation", value: "geolocation" in n ? "支持" : "不支持", category: "功能" },
      { label: "Notifications", value: "Notification" in w ? "支持" : "不支持", category: "功能" },
      { label: "Bluetooth", value: "bluetooth" in n ? "支持" : "不支持", category: "功能" },
      { label: "USB", value: "usb" in n ? "支持" : "不支持", category: "功能" },
      { label: "Vibration", value: "vibrate" in n ? "支持" : "不支持", category: "功能" },
      { label: "Battery", value: "getBattery" in n ? "需用户交互" : "不支持", category: "功能" },
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

function getWebGLSupport(): string {
  try {
    const c = document.createElement("canvas")
    return !!(c.getContext("webgl") || c.getContext("experimental-webgl")) ? "支持" : "不支持"
  } catch { return "不支持" }
}

function getCanvasFingerprint(): string {
  try {
    const c = document.createElement("canvas")
    c.width = 200; c.height = 50
    const ctx = c.getContext("2d")
    if (!ctx) return "—"
    ctx.textBaseline = "top"
    ctx.font = "14px Arial"
    ctx.fillStyle = "#f60"
    ctx.fillRect(125, 1, 62, 20)
    ctx.fillStyle = "#069"
    ctx.fillText("乐乐 Lab", 2, 15)
    return c.toDataURL().length + " 字节"
  } catch { return "—" }
}
