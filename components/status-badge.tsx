"use client"

import * as React from "react"

const STATUS_API = "https://1l.lol/api/status"

const statusColors: Record<string, string> = {
  "编程中": "bg-blue-500/10 text-blue-500",
  "刷题中": "bg-purple-500/10 text-purple-500",
  "游戏中": "bg-rose-500/10 text-rose-500",
}

export type DeviceData = {
  status: string | null
  battery: string | null
  device: string | null
}

export function useDevices() {
  const [devices, setDevices] = React.useState<DeviceData[]>([])

  React.useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch(STATUS_API)
        const d = await res.json()
        setDevices(d.devices || [])
      } catch {
        setDevices([])
      }
    }
    fetchStatus()
    const t = setInterval(fetchStatus, 15000)
    return () => clearInterval(t)
  }, [])

  return devices
}

export function getPrimaryStatus(devices: DeviceData[]) {
  const order = ["游戏中", "编程中", "刷题中"]
  for (const s of order) {
    if (devices.some(d => d.status === s)) return s
  }
  return null
}
