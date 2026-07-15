"use client"

import * as React from "react"

const startDate = new Date("2026-07-14T20:00:00")

function calc() {
  const now = new Date()
  const diff = Math.max(0, now.getTime() - startDate.getTime())
  const totalMinutes = Math.floor(diff / 60000)

  const minutes = totalMinutes % 60
  const totalHours = (totalMinutes - minutes) / 60
  const hours = totalHours % 24
  const totalDays = (totalHours - hours) / 24
  const days = totalDays % 30
  const totalMonths = (totalDays - days) / 30
  const months = totalMonths % 12
  const years = (totalMonths - months) / 12

  return { years, months, days, hours }
}

export function SiteRunningTime() {
  const [elapsed, setElapsed] = React.useState(calc)

  React.useEffect(() => {
    const timer = setInterval(() => setElapsed(calc()), 60000)
    return () => clearInterval(timer)
  }, [])

  return (
    <span className="text-xs text-muted-foreground/50">
      已运行 {elapsed.years} 年 {elapsed.months} 个月 {elapsed.days} 天 {elapsed.hours} 小时
    </span>
  )
}