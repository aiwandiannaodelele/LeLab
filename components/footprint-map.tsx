"use client"

import * as React from "react"

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
]

export function FootprintMap() {
  const ref = React.useRef<HTMLDivElement>(null)
  const chartRef = React.useRef<any>(null)
  const [loaded, setLoaded] = React.useState(false)

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
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            borderColor: "rgba(255,255,255,0.1)",
            textStyle: { color: "#f8fafc", fontSize: 13 },
            formatter: (p: any) => {
              return p.value ? `<b>${p.name}</b> · 我去过 ✨` : `<b>${p.name}</b> · 还没去过`
            },
          },
          visualMap: {
            min: 0,
            max: 1,
            show: false,
            inRange: { color: ["#f1f5f9", "#34d399"] },
          },
          series: [
            {
              type: "map",
              map: "china",
              roam: true,
              label: { show: true, fontSize: 10, color: "#94a3b8" },
              itemStyle: {
                borderColor: "rgba(148,163,184,0.3)",
                borderWidth: 0.5,
                areaColor: "#f1f5f9",
              },
              emphasis: {
                label: { color: "#111827", fontWeight: 600 },
                itemStyle: {
                  areaColor: "rgba(52,211,153,0.9)",
                  borderColor: "rgba(16,185,129,0.6)",
                  borderWidth: 1,
                  shadowBlur: 15,
                  shadowColor: "rgba(52,211,153,0.4)",
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
  }, [])

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h3 className="font-heading text-base font-semibold tracking-tight">我的足迹</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            点亮 {VISITED_PROVINCES.length} 个省份
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="size-2.5 rounded-sm bg-[#f1f5f9] ring-1 ring-border/60" />
          <span>未到访</span>
          <span className="ml-2 size-2.5 rounded-sm bg-[#34d399]" />
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
