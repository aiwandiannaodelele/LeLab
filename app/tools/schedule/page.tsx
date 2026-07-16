"use client"

import * as React from "react"
import scheduleData from "@/lib/schedule.json"

const subjects: Record<string, string> = scheduleData.subjects
const schedule: Record<string, [string, string, string, string][]> = scheduleData.schedule as any

const weekDays = ["", "周一", "周二", "周三", "周四", "周五"]

type Period = {
  start: string; end: string; key: string; type: string; index: number
}

function getStatus() {
  const now = new Date()
  const day = now.getDay()
  const time = now.toTimeString().slice(0, 5)

  if (day < 1 || day > 5) return { status: "放学" }

  const raw = schedule[String(day)] as [string, string, string, string][]
  if (!raw) return { status: "放学" }

  const periods: Period[] = raw.map(([start, end, key, type], i) => ({
    start, end, key, type, index: i,
  }))

  let current: Period | null = null
  let next: Period | null = null

  for (let i = 0; i < periods.length; i++) {
    const p = periods[i]
    if (time >= p.start && time < p.end) current = p
    if (time < p.start && !next) next = p
  }

  if (!current && !next) return { status: "放学" }

  if (!current && next) {
    const target = new Date()
    const [h, m] = next.start.split(":").map(Number)
    target.setHours(h, m, 0, 0)
    const diffMs = target.getTime() - Date.now()
    const diffMin = Math.floor(diffMs / 60000)
    const diffSec = Math.floor((diffMs % 60000) / 1000)
    const subjectName = subjects[next.key] || ""
    return { status: "休息", nextSubject: subjectName, nextTime: next.start, countdown: `${diffMin}分${diffSec}秒` }
  }

  const c = current!

  if (c.type === "class") {
    const endTime = new Date()
    const [h, m] = c.end.split(":").map(Number)
    endTime.setHours(h, m, 0, 0)
    const remainMs = endTime.getTime() - Date.now()
    const remainMin = Math.floor(remainMs / 60000)
    const remainSec = Math.floor((remainMs % 60000) / 1000)

    let nextSubject: string | null = null
    let nextTime: string | null = null
    for (let i = c.index + 1; i < periods.length; i++) {
      if (periods[i].type === "class") {
        nextSubject = subjects[periods[i].key] || ""
        nextTime = periods[i].start
        break
      }
    }

    return {
      status: "上课",
      subject: subjects[c.key] || "",
      endTime: c.end,
      remain: `${remainMin}分${remainSec}秒`,
      nextSubject,
      nextTime,
    }
  }

  if (c.type === "break") {
    const target = new Date()
    const [h, m] = c.end.split(":").map(Number)
    target.setHours(h, m, 0, 0)
    const diffMs = target.getTime() - Date.now()
    const diffMin = Math.floor(diffMs / 60000)
    const diffSec = Math.floor((diffMs % 60000) / 1000)

    let nextSubject: string | null = null
    let nextTime: string | null = null
    for (let i = c.index + 1; i < periods.length; i++) {
      if (periods[i].type === "class") {
        nextSubject = subjects[periods[i].key] || ""
        nextTime = periods[i].start
        break
      }
    }

    if (!nextSubject) return { status: "放学" }
    return { status: "休息", nextSubject, nextTime, countdown: `${diffMin}分${diffSec}秒` }
  }

  return { status: "放学" }
}

export default function SchedulePage() {
  const [status, setStatus] = React.useState(getStatus)

  React.useEffect(() => {
    const timer = setInterval(() => setStatus(getStatus()), 1000)
    return () => clearInterval(timer)
  }, [])

  const day = new Date().getDay()
  const raw = day >= 1 && day <= 5 ? schedule[String(day)] : []
  const periods: Period[] = (raw as [string, string, string, string][]).map(
    ([start, end, key, type], i) => ({ start, end, key, type, index: i })
  )

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <header className="mb-8">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          课表
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {day >= 1 && day <= 5 ? weekDays[day] : "周末"}
        </p>
      </header>

      <StatusCard status={status} />

      <div className="mt-8 space-y-1">
        {periods.map((p, i) => (
          <PeriodRow key={i} period={p} index={i} />
        ))}
      </div>
    </div>
  )
}

function StatusCard({ status }: { status: ReturnType<typeof getStatus> }) {
  const colors: Record<string, string> = {
    上课: "border-emerald-500/40 bg-emerald-500/5",
    休息: "border-amber-500/40 bg-amber-500/5",
    放学: "border-blue-500/40 bg-blue-500/5",
  }

  return (
    <div className={`rounded-2xl border p-6 ${colors[status.status] || ""}`}>
      <div className="flex items-baseline gap-3">
        <span className="font-heading text-3xl font-semibold">{status.status}</span>
        {status.status === "上课" && "subject" in status && (
          <span className="text-lg text-muted-foreground">{status.subject}</span>
        )}
      </div>
      {"remain" in status && status.status === "上课" && (
        <p className="mt-2 text-sm text-muted-foreground">
          距下课 {status.remain}
          {status.nextSubject && (
            <> · 下一节 {status.nextSubject} {status.nextTime}</>
          )}
        </p>
      )}
      {"countdown" in status && status.status === "休息" && (
        <p className="mt-2 text-sm text-muted-foreground">
          距上课 {status.countdown} · {status.nextSubject} {status.nextTime}
        </p>
      )}
    </div>
  )
}

function PeriodRow({ period, index }: { period: Period; index: number }) {
  const { start, end, key, type } = period
  const label = type === "class" ? (subjects[key] || key) : ""

  return (
    <div className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors hover:bg-muted/40">
      <span className="w-8 text-right text-xs text-muted-foreground tabular-nums">{index + 1}</span>
      <span className="w-24 text-xs text-muted-foreground tabular-nums">{start}–{end}</span>
      <span className={`flex-1 font-medium ${type === "break" ? "text-muted-foreground/60" : ""}`}>
        {label || "休息"}
      </span>
      {type === "class" && (
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary">上课</span>
      )}
    </div>
  )
}