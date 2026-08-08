"use client"

import * as React from "react"
import { createPortal } from "react-dom"

export function LightboxProvider() {
  const [src, setSrc] = React.useState<string | null>(null)
  const [alt, setAlt] = React.useState("")

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest(".lightbox-scope img")
      if (!el) return
      const img = el as HTMLImageElement
      e.preventDefault()
      e.stopPropagation()
      setSrc(img.currentSrc || img.src)
      setAlt(img.alt || "")
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSrc(null)
    }
    document.addEventListener("click", onClick, true)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("click", onClick, true)
      document.removeEventListener("keydown", onKey)
    }
  }, [])

  if (!src) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={() => setSrc(null)}
      role="dialog"
      aria-modal="true"
    >
      <img
        src={src}
        alt={alt}
        data-lightbox-img
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
      />
      <button
        type="button"
        aria-label="关闭"
        onClick={() => setSrc(null)}
        className="absolute right-5 top-5 grid size-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>,
    document.body,
  )
}
