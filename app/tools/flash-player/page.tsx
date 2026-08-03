"use client"

import * as React from "react"
import Link from "next/link"
import { Icon } from "@/components/icons"

export default function FlashPlayerPage() {
  const [url, setUrl] = React.useState("")
  const [playing, setPlaying] = React.useState(false)
  const [error, setError] = React.useState("")
  const [target, setTarget] = React.useState("")
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!playing || !target) return
    if (!containerRef.current) return

    const RufflePlayer = (window as any).RufflePlayer
    if (!RufflePlayer || !RufflePlayer.newest) { setError("播放器加载失败，请刷新重试"); return }

    const player = RufflePlayer.newest().createPlayer()
    player.config = {
      autoplay: "on",
      unmuteOverlay: "hidden",
      letterbox: "on",
      splashScreen: false,
    }
    containerRef.current.appendChild(player)
    try {
      player.load(target)
    } catch (e) {
      setError("无法加载该文件，请确认是有效的 SWF 文件")
    }
  }, [playing, target])

  React.useEffect(() => {
    const loadRuffle = async () => {
      const waitFor = (fn: () => boolean, ms = 3000) =>
        new Promise<boolean>((resolve) => {
          const t0 = Date.now()
          const iv = setInterval(() => {
            if (fn()) { clearInterval(iv); resolve(true) }
            else if (Date.now() - t0 > ms) { clearInterval(iv); resolve(false) }
          }, 100)
        })
      if (!(window as any).RufflePlayer) {
        const s = document.createElement("script")
        s.src = "https://cdn.jsdelivr.net/npm/@ruffle-rs/ruffle@0.4.1/ruffle.min.js"
        document.head.appendChild(s)
        await new Promise((resolve) => { s.onload = resolve })
      }
      await waitFor(() => (window as any).RufflePlayer?.newest?.().createPlayer)
    }
    loadRuffle().catch(() => {})
  }, [])

  const playUrl = (urlToLoad: string) => {
    setError("")
    if (!urlToLoad) { setError("请输入 SWF 文件地址"); return }
    if (containerRef.current) containerRef.current.innerHTML = ""
    setTarget(urlToLoad)
    setPlaying(true)
  }

  const play = () => playUrl(url.trim())

  const onFile = (file?: File) => {
    if (!file) return
    if (!file.name.toLowerCase().endsWith(".swf") && !file.type.includes("flash") && !file.type.includes("x-shockwave")) {
      setError("请选择 .swf 格式的文件")
      return
    }
    const blob = URL.createObjectURL(file)
    setUrl(blob)
    playUrl(blob)
  }

  const stop = () => {
    if (containerRef.current) containerRef.current.innerHTML = ""
    setPlaying(false)
    setTarget("")
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <Link
        href="/tools"
        className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <Icon name="arrowLeft" size={14} />
        返回工具
      </Link>

      <header className="mb-8">
        <div className="mb-3 grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
          <FlashIcon />
        </div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Flash 播放器
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          在浏览器中直接运行老 Flash 动画，无需安装任何插件。
        </p>
      </header>

      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && play()}
            placeholder="粘贴 SWF 文件 URL..."
            className="flex-1 rounded-xl border border-border/60 bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none transition-colors focus:border-primary/40"
          />
          <div className="flex gap-2">
            <label className="inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-border/60 px-4 text-sm text-muted-foreground transition-colors hover:bg-muted sm:flex-none">
              <Icon name="arrowUp" size={14} />
              上传
              <input
                type="file"
                accept=".swf,application/x-shockwave-flash"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0])}
              />
            </label>
            <button
              type="button"
              onClick={play}
              className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 sm:flex-none"
            >
              <Icon name="arrowRight" size={14} />
              播放
            </button>
            {playing && (
              <button
                type="button"
                onClick={stop}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-border/60 px-4 text-sm text-muted-foreground transition-colors hover:bg-muted"
              >
                停止
              </button>
            )}
          </div>
        </div>

        {error && (
          <p className="mt-3 text-sm text-destructive">{error}</p>
        )}
      </div>

      <div
        className="mt-6 overflow-hidden rounded-2xl border border-border/60 bg-card"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files?.[0]) }}
      >
        {!playing && (
          <div className="grid aspect-video place-items-center">
            <div className="text-center">
              <div className="mb-3 text-4xl">🎮</div>
              <p className="text-sm text-muted-foreground">输入 SWF 地址，或点击「上传」/ 拖入文件</p>
              <p className="mt-1 text-xs text-muted-foreground/50">
                支持 .swf 格式，本地文件即刻播放
              </p>
            </div>
          </div>
        )}
        <div ref={containerRef} className={`aspect-video w-full ${playing ? "" : "hidden"}`} />
      </div>
    </div>
  )
}

function FlashIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 2l10 10-10 10V2z" />
      <path d="M7 2l6 6-6 6V2z" opacity=".4" />
    </svg>
  )
}
