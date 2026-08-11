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

function readVar(name: string, fallback: string) {
  if (typeof document === "undefined") return fallback
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fallback
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

        const data = VISITED_PROVINCES.map((name) => ({ name, value: 1 }))

        chart.setOption({
          tooltip: {
            trigger: "item",
            backgroundColor: readVar("--popover", "#ffffff"),
            borderColor: readVar("--border", "#e5e5e5"),
            borderWidth: 1,
            padding: [8, 12],
            textStyle: {
              color: readVar("--popover-foreground", "#171717"),
              fontSize: 12,
              fontFamily: "var(--font-sans)",
            },
            formatter: (p: any) => {
              return p.value
                ? `<b>${p.name}</b><br/><span style="color:${readVar("--muted-foreground", "#737373")}">我来过这里 ✨</span>`
                : `<b>${p.name}</b><br/><span style="color:${readVar("--muted-foreground", "#737373")}">还没去过</span>`
            },
          },
          visualMap: {
            min: 0,
            max: 1,
            show: false,
            inRange: {
              color: [
                readVar("--muted", isDark ? "#1a1a1a" : "#f0f0f0"),
                isDark ? "oklch(0.72 0.15 162.48)" : "oklch(0.72 0.15 162.48)",
              ],
            },
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
                color: readVar("--muted-foreground", "#a3a3a3"),
              },
              itemStyle: {
                borderColor: readVar("--border", "#e5e5e5"),
                borderWidth: 0.6,
                areaColor: readVar("--muted", "#f0f0f0"),
              },
              emphasis: {
                label: { color: readVar("--foreground", "#171717"), fontWeight: 600 },
                itemStyle: {
                  areaColor: isDark
                    ? "oklch(0.72 0.15 162.48)"
                    : "oklch(0.8 0.14 162.48)",
                  borderColor: isDark ? "oklch(0.62 0.13 162.48)" : "oklch(0.62 0.13 162.48)",
                  borderWidth: 1,
                  shadowBlur: 12,
                  shadowColor: "rgba(52,211,153,0.35)",
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
          <span className="ml-2 size-2.5 rounded-sm bg-emerald-500" />
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
