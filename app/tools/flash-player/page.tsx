"use client"

import * as React from "react"
import { Icon } from "@/components/icons"

export default function FlashPlayerPage() {
  const [url, setUrl] = React.useState("")
  const [playing, setPlaying] = React.useState(false)
  const [error, setError] = React.useState("")
  const containerRef = React.useRef<HTMLDivElement>(null)

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
        s.src = "https://unpkg.com/@ruffle-rs/ruffle"
        document.head.appendChild(s)
        await new Promise((resolve) => { s.onload = resolve })
      }
      await waitFor(() => (window as any).RufflePlayer?.newest?.().createPlayer)
    }
    loadRuffle().catch(() => {})
  }, [])

  const play = () => {
    setError("")
    if (!url.trim()) { setError("请输入 SWF 文件地址"); return }
    if (!containerRef.current) return

    containerRef.current.innerHTML = ""
    const RufflePlayer = (window as any).RufflePlayer
    if (!RufflePlayer || !RufflePlayer.newest) { setError("Ruffle 加载失败，请刷新重试"); return }

    const player = RufflePlayer.newest().createPlayer()
    player.config = { autoplay: "on", unmuteOverlay: "hidden" }
    containerRef.current.appendChild(player)
    try {
      player.load(url.trim())
      setPlaying(true)
    } catch (e) {
      setError("无法加载该文件，请确认是有效的 SWF 文件")
    }
  }

  const stop = () => {
    if (containerRef.current) containerRef.current.innerHTML = ""
    setPlaying(false)
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <header className="mb-10">
        <p className="mb-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon name="star" size={14} className="text-primary" />
          FLASH PLAYER
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Flash 播放器</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          使用 Ruffle 在浏览器中运行老 Flash 动画，无需安装任何插件。
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

      <div className="mt-6">
        {!playing && (
          <div className="grid place-items-center rounded-2xl border border-dashed border-border/60 bg-muted/30 py-24 text-center">
            <div className="text-4xl mb-3">🎮</div>
            <p className="text-sm text-muted-foreground">输入 SWF 地址开始播放</p>
            <p className="mt-1 text-xs text-muted-foreground/50">
              也可以直接拖入 / 粘贴文件链接，支持 .swf 格式
            </p>
          </div>
        )}
        <div ref={containerRef} className="rounded-2xl overflow-hidden bg-black/5 dark:bg-black/30" />
      </div>

      <div className="mt-8 rounded-2xl border border-border/60 bg-card p-5 text-sm text-muted-foreground leading-relaxed">
        <p className="mb-1 font-medium text-foreground">说明</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Ruffle 是开源 Flash 模拟器，在浏览器中运行 SWF</li>
          <li>部分复杂 Flash 可能无法完美运行</li>
          <li>支持本地文件？暂时仅支持在线 URL</li>
        </ul>
      </div>
    </div>
  )
}
