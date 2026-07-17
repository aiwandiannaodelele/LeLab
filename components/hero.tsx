"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Icon } from "@/components/icons"
import { scheduleDebug } from "@/lib/schedule-debug"
import { siteConfig } from "@/lib/site"
import scheduleData from "@/lib/schedule.json"

const subjects: Record<string, string> = scheduleData.subjects
const schedule: Record<string, [string, string, string, string][]> = scheduleData.schedule as any
const weekDays = ["", "周一", "周二", "周三", "周四", "周五"]

function getStatus() {
  const now = new Date()
  const day = scheduleDebug.day !== null ? scheduleDebug.day : now.getDay()
  const time = scheduleDebug.time !== null ? scheduleDebug.time : now.toTimeString().slice(0, 5)
  const isWeekend = day < 1 || day > 5

  function getCurrentMs() {
    if (scheduleDebug.time !== null) {
      const [h, m] = scheduleDebug.time.split(":").map(Number)
      const d = new Date()
      d.setHours(h, m, 0, 0)
      return d.getTime()
    }
    return Date.now()
  }

  if (isWeekend) return { type: "weekend" as const, label: "周末" }

  const raw = schedule[String(day)]
  if (!raw) return { type: "done" as const, label: weekDays[day] }

  let current: { start: string; end: string; key: string; type: string; index: number } | null = null
  let next: { start: string; end: string; key: string; type: string; index: number } | null = null

  for (let i = 0; i < raw.length; i++) {
    const [start, end, key, type] = raw[i]
    if (time >= start && time < end) current = { start, end, key, type, index: i }
    if (time < start && !next) next = { start, end, key, type, index: i }
  }

  if (!current && !next) return { type: "done" as const, label: weekDays[day] }
  if (!current && next) return { type: "before" as const, label: weekDays[day], next: subjects[next.key] || "", time: next.start }

  const c = current!

  if (c.type === "class") {
    const [h, m] = c.end.split(":").map(Number)
    const endDate = new Date()
    endDate.setHours(h, m, 0, 0)
    const remain = Math.max(0, Math.round((endDate.getTime() - getCurrentMs()) / 60000))
    return { type: "class" as const, label: weekDays[day], subject: subjects[c.key] || "", remain, end: c.end }
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
    if (!nextSubject) return { type: "done" as const, label: weekDays[day] }
    return { type: "break" as const, label: weekDays[day], next: nextSubject, time: nextTime }
  }

  return { type: "done" as const, label: weekDays[day] }
}

export function Hero() {
  const [status, setStatus] = React.useState(getStatus)
  const [hover, setHover] = React.useState(false)

  React.useEffect(() => {
    const t = setInterval(() => setStatus(getStatus()), 10000)
    const unsub = scheduleDebug.subscribe(() => setStatus(getStatus()))
    return () => { clearInterval(t); unsub() }
  }, [])

  const isClass = status.type === "class"
  const isActive = status.type === "class" || status.type === "break" || status.type === "before"
  const indicatorColor = isClass ? "bg-emerald-500" : isActive ? "bg-amber-500" : "bg-muted-foreground/40"

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 size-[420px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px] dark:bg-primary/25" />
        <div className="absolute -top-10 right-6 size-[280px] rounded-full bg-pink-400/20 blur-[100px] dark:bg-pink-500/20" />
        <div className="absolute -left-10 top-24 size-[260px] rounded-full bg-emerald-400/15 blur-[100px] dark:bg-emerald-500/15" />
      </div>

      <div className="mx-auto max-w-5xl px-5 pt-12 pb-8 sm:pt-16">
        <div className="flex flex-col items-center gap-4">
          <div
            className="relative"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <Image
                  src={siteConfig.author.avatar}
                  alt={siteConfig.author.name}
                  width={56}
                  height={56}
                  className="size-14 rounded-full object-cover ring-2 ring-border/50"
                  unoptimized
                />
                <span className={`absolute -top-0.5 -right-0.5 size-3.5 rounded-full border-2 border-background ${indicatorColor} transition-colors duration-500`} />
              </div>

              <div
                className={`transition-all duration-300 ease-out origin-left ${
                  hover
                    ? "opacity-100 scale-100 max-w-[320px]"
                    : "opacity-0 scale-95 max-w-0 pointer-events-none"
                }`}
              >
                <div className="w-[300px] rounded-2xl border border-border/60 bg-card p-4 shadow-lg">
                  <div className="flex items-start gap-3">
                    <div className={`grid size-9 shrink-0 place-items-center rounded-xl bg-muted ${isClass ? "text-emerald-500" : isActive ? "text-amber-500" : "text-muted-foreground"}`}>
                      <Icon name="calendar" size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{status.label}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${isClass ? "bg-emerald-500/10 text-emerald-600" : isActive ? "bg-amber-500/10 text-amber-600" : "bg-muted text-muted-foreground"}`}>
                          {status.type === "class" ? "上课中" : status.type === "break" || status.type === "before" ? "休息" : "已放学"}
                        </span>
                      </div>

                      {status.type === "class" && (
                        <div className="mt-1.5 flex items-baseline justify-between gap-2">
                          <span className="font-heading text-base font-semibold">{status.subject}</span>
                          <span className="text-sm font-semibold tabular-nums text-emerald-500">
                            {status.remain}<span className="text-xs font-normal text-muted-foreground"> 分钟</span>
                          </span>
                        </div>
                      )}

                      {(status.type === "break" || status.type === "before") && (
                        <p className="mt-1.5 text-sm">
                          <span className="font-medium">下一节 {status.next}</span>
                          <span className="ml-1.5 text-xs text-muted-foreground">{status.time} 上课</span>
                        </p>
                      )}

                      {status.type === "done" || status.type === "weekend" ? (
                        <p className="mt-1.5 text-sm text-muted-foreground">今日课程已结束</p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h1 className="font-heading text-xl font-semibold tracking-tight text-center sm:text-2xl">
              {siteConfig.author.name}
            </h1>
            <p className="mt-0.5 text-center text-sm text-muted-foreground">
              {siteConfig.author.bio}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/posts"
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-primary px-3.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            看看文章
            <Icon name="chevronRight" size={14} />
          </Link>
          <Link
            href="/about"
            className="inline-flex h-8 items-center rounded-full border border-border/70 px-3.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted"
          >
            关于我
          </Link>
        </div>
      </div>
    </section>
  )
}