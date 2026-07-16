"use client"

import * as React from "react"
import { Icon } from "@/components/icons"
import { scheduleDebug } from "@/lib/schedule-debug"
import scheduleData from "@/lib/schedule.json"

const subjects: Record<string, string> = scheduleData.subjects
const schedule: Record<string, [string, string, string, string][]> = scheduleData.schedule as any
const weekDays = ["", "周一", "周二", "周三", "周四", "周五"]

type Period = { start: string; end: string; key: string; type: string; index: number }

function getStatus() {
  const now = new Date()
  const day = scheduleDebug.day !== null ? scheduleDebug.day : now.getDay()
  const time = scheduleDebug.time !== null ? scheduleDebug.time : now.toTimeString().slice(0, 5)
  const isWeekend = day < 1 || day > 5

  if (isWeekend) return { status: "放学", label: "周末" }

  const raw = schedule[String(day)]
  if (!raw) return { status: "放学", label: weekDays[day] }

  const periods: Period[] = raw.map(([start, end, key, type], i) => ({ start, end, key, type, index: i }))

  let current: Period | null = null
  let next: Period | null = null

  for (const p of periods) {
    if (time >= p.start && time < p.end) current = p
    if (time < p.start && !next) next = p
  }

  if (!current && !next) return { status: "放学", label: weekDays[day], detail: "今日课程已结束" }
  if (!current && next) return { status: "before", label: weekDays[day], next: subjects[next.key] || "", time: next.start }

  const c = current!

  if (c.type === "class") {
    const [endH, endM] = c.end.split(":").map(Number)
    const endDate = new Date()
    endDate.setHours(endH, endM, 0, 0)
    const diffMs = endDate.getTime() - Date.now()
    const remain = Math.max(0, Math.round(diffMs / 60000))
    return { status: "class", label: weekDays[day], subject: subjects[c.key] || "", remain, end: c.end }
  }

  if (c.type === "break") {
    let nextSubject: string | null = null
    let nextTime: string | null = null
    for (let i = c.index + 1; i < periods.length; i++) {
      if (periods[i].type === "class") {
        nextSubject = subjects[periods[i].key] || ""
        nextTime = periods[i].start
        break
      }
    }
    if (!nextSubject) return { status: "放学", label: weekDays[day], detail: "今日课程已结束" }
    return { status: "break", label: weekDays[day], next: nextSubject, time: nextTime }
  }

  return { status: "放学", label: weekDays[day], detail: "今日课程已结束" }
}

export function ScheduleCard() {
  const [status, setStatus] = React.useState(getStatus)
  React.useEffect(() => {
    const t = setInterval(() => setStatus(getStatus()), 10000)
    const unsub = scheduleDebug.subscribe(() => setStatus(getStatus()))
    return () => { clearInterval(t); unsub() }
  }, [])

  const isClass = status.status === "class"
  const isBreak = status.status === "break" || status.status === "before"
  const isDone = status.status === "放学"

  const accentColor = isClass ? "text-emerald-500" : isBreak ? "text-amber-500" : "text-muted-foreground"

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <div className="flex items-start gap-4">
        <div className={`grid size-10 shrink-0 place-items-center rounded-xl bg-muted ${accentColor}`}>
          <Icon name="calendar" size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{status.label}</span>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${isClass ? "bg-emerald-500/10 text-emerald-600" : isBreak ? "bg-amber-500/10 text-amber-600" : "bg-muted text-muted-foreground"}`}>
              {isClass ? "上课中" : isBreak ? "休息" : "已放学"}
            </span>
          </div>

          {isClass && (
            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <span className="font-heading text-xl font-semibold">{status.subject}</span>
                <span className="ml-2 text-sm text-muted-foreground">~ {status.end}</span>
              </div>
              <span className={`text-lg font-semibold tabular-nums ${accentColor}`}>
                {status.remain}<span className="text-sm font-normal text-muted-foreground"> 分钟</span>
              </span>
            </div>
          )}

          {isBreak && (
            <div className="mt-2">
              <span className="font-heading text-lg font-semibold">下一节 {status.next}</span>
              <span className="ml-2 text-sm text-muted-foreground">{status.time} 上课</span>
            </div>
          )}

          {isDone && (
            <p className="mt-2 text-sm text-muted-foreground">{status.detail}</p>
          )}
        </div>
      </div>
    </div>
  )
}