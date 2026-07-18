"use client"

import * as React from "react"

const STATUS_API = "https://lelab.cc.cd/api/status"

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
        // 兼容旧格式 { status, battery, device } 和新格式 { devices: [...] }
        if (d.devices) {
          setDevices(d.devices)
        } else if (d.status) {
          setDevices([{ status: d.status, battery: d.battery || null, device: d.device || null }])
        } else {
          setDevices([])
        }
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
  if (devices.length === 0) return null
  for (const d of devices) {
    if (d.status) return d.status
  }
  return null
}
