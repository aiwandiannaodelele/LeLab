"use client"

import * as React from "react"
import { useTheme } from "next-themes"

// ========== 在这里改！把你要点亮的省份写这里 ==========
const VISITED_PROVINCES = [
  "新疆",
  "西藏",
  "青海",
  "甘肃",
  "宁夏",
  "内蒙古",
  "河南",
  "北京",
  "陕西",
  "广西",
  "广东",
  "福建",
  "香港",
  "澳门",
  "四川",
  "云南",
  "贵州",
  "海南",
  "上海",
  "重庆",
  "山东",
  "天津",
  "浙江",
]

// oklch → hex，ECharts canvas 不支持 oklch
function oklchToHex(oklchStr: string): string {
  const m = oklchStr.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*[\d.]+)?\)/)
  if (!m) return oklchStr
  const [L, C, H] = [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])]

  // oklch → oklab
  const l = L
  const a = C * Math.cos((H * Math.PI) / 180)
  const b = C * Math.sin((H * Math.PI) / 180)

  // oklab → linear sRGB
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b
  const s_ = l - 0.0894841775 * a - 1.291485548 * b

  const toLinear = (x: number) => {
    return x > 0.0031308 ? 1.055 * Math.pow(x, 1 / 3) - 0.055 : 12.92 * x
  }
  const r = Math.round(toLinear(l_) * 255)
  const g = Math.round(toLinear(m_) * 255)
  const bl = Math.round(toLinear(s_) * 255)
  const clamp = (x: number) => Math.max(0, Math.min(255, x))
  const toHex = (x: number) => clamp(x).toString(16).padStart(2, "0")
  return `#${toHex(r)}${toHex(g)}${toHex(bl)}`
}

// 读取 CSS 变量并转为 hex
function readVar(name: string, fallback: string): string {
  if (typeof document === "undefined") return fallback
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  if (!v) return fallback
  if (v.startsWith("oklch")) return oklchToHex(v)
  return v
}

export function FootprintMap() {
  const ref = React.useRef<HTMLDivElement>(null)
  const chartRef = React.useRef<any>(null)
  const [loaded, setLoaded] = React.useState(false)
  const { resolvedTheme } = useTheme()

  const isDark = resolvedTheme === "dark"

  React.useEffect(() => {
    let cancelled = false

    async function load() {
      const loadScript = (src: string) =>
        new Promise<void>((resolve, reject) => {
          const s = document.createElement("script")
          s.src = src
          s.onload = () => resolve()
          s.onerror = () => reject()
          document.head.appendChild(s)
        })

      try {
        if (!(window as any).echarts) await loadScript("https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js")
        if (!(window as any).echarts?.getMap?.("china")) {
          await loadScript("https://cdn.jsdelivr.net/npm/echarts/map/js/china.js")
        }
        if (cancelled) return

        const el = ref.current
        if (!el) return
        const echarts = (window as any).echarts
        const chart = echarts.init(el)
        chartRef.current = chart

        // 把简称映射为 ECharts 地图中的全称
        const mapGeo = echarts.getMap("china")
        const fullNames = new Set<string>()
        mapGeo?.geoJson?.features?.forEach((f: any) => {
          const nm = f?.properties?.name
          if (nm) fullNames.add(nm)
        })

        const resolveName = (short: string) => {
          if (fullNames.has(short)) return short
          for (const full of fullNames) {
            if (full.includes(short) || short.includes(full)) return full
          }
          return short
        }

        const data = VISITED_PROVINCES.map((name) => ({ name: resolveName(name), value: 1 }))

        // 直接使用品牌色
        const primary = "#007595" // 品牌色
        const muted = isDark ? "#1e293b" : "#f1f5f9" // 未到访颜色
        const border = isDark ? "#334155" : "#e2e8f0"
        const bg = isDark ? "#0f172a" : "#ffffff"
        const fg = isDark ? "#f8fafc" : "#0f172a"
        const mutedFg = isDark ? "#94a3b8" : "#64748b"

        chart.setOption({
          tooltip: {
            trigger: "item",
            backgroundColor: bg,
            borderColor: border,
            borderWidth: 1,
            padding: [8, 12],
            textStyle: { color: fg, fontSize: 12, fontFamily: "var(--font-sans)" },
            formatter: (p: any) => {
              return p.value
                ? `<b>${p.name}</b><br/><span style="color:${mutedFg}">我来过这里 ✨</span>`
                : `<b>${p.name}</b><br/><span style="color:${mutedFg}">还没去过</span>`
            },
          },
          visualMap: {
            min: 0,
            max: 1,
            show: false,
            inRange: { color: [muted, primary] },
          },
          series: [
            {
              type: "map",
              map: "china",
              roam: true,
              zoom: 1.05,
              label: {
                show: true,
                fontSize: 9,
                color: mutedFg,
              },
              itemStyle: {
                borderColor: border,
                borderWidth: 0.6,
                areaColor: muted,
              },
              emphasis: {
                label: { color: fg, fontWeight: 600 },
                itemStyle: {
                  areaColor: primary,
                  borderColor: primary,
                  borderWidth: 1,
                  shadowBlur: 14,
                  shadowColor: "rgba(0,117,149,0.4)",
                },
              },
              data,
            },
          ],
        })

        const onResize = () => chart.resize()
        window.addEventListener("resize", onResize)
        setLoaded(true)
        return () => window.removeEventListener("resize", onResize)
      } catch {
        if (!cancelled) setLoaded(true)
      }
    }

    load()
    return () => {
      cancelled = true
      chartRef.current?.dispose?.()
    }
  }, [isDark])

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h3 className="font-heading text-base font-semibold tracking-tight">我的足迹</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            点亮 {VISITED_PROVINCES.length} 个省份
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="size-2.5 rounded-sm bg-muted ring-1 ring-border/60" />
          <span>未到访</span>
          <span className="ml-2 size-2.5 rounded-sm bg-primary" />
          <span>到访</span>
        </div>
      </div>
      <div ref={ref} className="h-[420px] w-full" />
      {!loaded && (
        <div className="grid h-[420px] -mt-[420px] place-items-center">
          <p className="text-sm text-muted-foreground animate-pulse">加载地图...</p>
        </div>
      )}
    </div>
  )
}
