"use client"

import * as React from "react"
import { Icon } from "@/components/icons"
import { scheduleDebug } from "@/lib/schedule-debug"

const weekDays = ["日", "一", "二", "三", "四", "五", "六"]

export function ScheduleDebug() {
  const [open, setOpen] = React.useState(false)
  const [day, setDay] = React.useState<number | null>(null)
  const [time, setTime] = React.useState("")

  if (process.env.NODE_ENV !== "development") return null

  function apply() {
    scheduleDebug.set(day, time || null)
  }

  function reset() {
    setDay(null)
    setTime("")
    scheduleDebug.reset()
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed right-5 bottom-20 z-[100] inline-flex h-9 items-center gap-1.5 rounded-full border border-border/70 bg-background px-3.5 text-sm text-muted-foreground shadow-lg hover:bg-muted hover:text-foreground"
      >
        <Icon name="settings" size={14} />
        课表调试
      </button>
      {open && (
        <div className="fixed right-5 bottom-[136px] z-[100] w-64 rounded-xl border border-border/60 bg-background p-4 shadow-xl">
          <p className="mb-3 text-xs font-medium text-muted-foreground">课表调试</p>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">星期</label>
              <select
                value={day ?? ""}
                onChange={(e) => setDay(e.target.value ? Number(e.target.value) : null)}
                className="mt-1 w-full rounded-lg border border-border/70 bg-background px-3 py-1.5 text-sm outline-none"
              >
                <option value="">实际时间</option>
                {[1, 2, 3, 4, 5, 6, 0].map((d) => (
                  <option key={d} value={d}>周{weekDays[d]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">时间</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border/70 bg-background px-3 py-1.5 text-sm outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={apply} className="flex-1 rounded-lg bg-primary py-1.5 text-sm text-primary-foreground">应用</button>
              <button type="button" onClick={reset} className="flex-1 rounded-lg border border-border/70 py-1.5 text-sm text-muted-foreground">重置</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}