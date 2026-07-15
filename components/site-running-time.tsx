"use client"

import * as React from "react"

const startDate = new Date("2026-07-15")

function calc() {
  const now = new Date()
  let years = now.getFullYear() - startDate.getFullYear()
  let months = now.getMonth() - startDate.getMonth()
  let days = now.getDate() - startDate.getDate()

  if (days < 0) {
    months--
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    days += prevMonth.getDate()
  }
  if (months < 0) {
    years--
    months += 12
  }

  return { years, months, days }
}

export function SiteRunningTime() {
  const [elapsed, setElapsed] = React.useState(calc)

  React.useEffect(() => {
    const timer = setInterval(() => setElapsed(calc()), 60000)
    return () => clearInterval(timer)
  }, [])

  return (
    <span className="text-xs text-muted-foreground/50">
      已运行 {elapsed.years} 年 {elapsed.months} 个月 {elapsed.days} 天
    </span>
  )
}