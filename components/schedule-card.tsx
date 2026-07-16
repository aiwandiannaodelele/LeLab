"use client"

import * as React from "react"
import { Icon } from "@/components/icons"
import { scheduleDebug } from "@/lib/schedule-debug"
import scheduleData from "@/lib/schedule.json"

const subjects: Record<string, string> = scheduleData.subjects
const schedule: Record<string, [string, string, string, string][]> = scheduleData.schedule as any
const weekDays = ["", "周一", "周二", "周三", "周四", "周五"]

function getStatus() {
  const now = new Date()
  const day = scheduleDebug.day !== null ? scheduleDebug.day : now.getDay()
  const time = scheduleDebug.time !== null ? scheduleDebug.time : now.toTimeString().slice(0, 5)
  const isWeekend = day < 1 || day > 5

  if (isWeekend) return { status: "放学", label: "周末" }

  const raw = schedule[String(day)]
  if (!raw) return { status: "放学", label: weekDays[day] }

  let current: ({ start: string; end: string; key: string; type: string; index: number }) | null = null
  let next: ({ start: string; end: string; key: string; type: string; index: number }) | null = null

  for (let i = 0; i < raw.length; i++) {
    const [start, end, key, type] = raw[i]
    if (time >= start && time < end) current = { start, end, key, type, index: i }
    if (time < start && !next) next = { start, end, key, type, index: i }
  }

  if (!current && !next) return { status: "放学", label: weekDays[day], detail: "今日课程已结束" }
  if (!current && next) return { status: "before", label: weekDays[day], next: subjects[next.key] || "", time: next.start }

  const c = current!

  if (c.type === "class") {
    const [h, m] = c.end.split(":").map(Number)
    const endDate = new Date()
    endDate.setHours(h, m, 0, 0)
    const remain = Math.max(0, Math.round((endDate.getTime() - Date.now()) / 60000))
    return { status: "class", label: weekDays[day], subject: subjects[c.key] || "", remain, end: c.end }
  }

  if (c.type === "break") {
    let nextSubject: string | null = null
    let nextTime: string | null = null
    for (let i = c.index + 1; i < raw.length; i++) {
      if (raw[i][3] === "class") {
        nextSubject = subjects[raw[i][2]] || ""
        nextTime = raw[i][0]
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