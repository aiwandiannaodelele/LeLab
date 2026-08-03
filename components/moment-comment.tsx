"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { Icon } from "@/components/icons"
import { Giscus } from "@/components/giscus"
import { siteConfig } from "@/lib/site"

export function MomentCommentButton({ term }: { term: string }) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <button
        type="button"
        aria-label="评论"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen(true)
        }}
        className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
      >
        <Icon name="discussion" size={15} />
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-[8vh] backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-2xl border border-border/60 bg-background shadow-2xl">
              <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
                <span className="text-sm font-medium">评论</span>
                <button
                  type="button"
                  aria-label="关闭"
                  onClick={() => setOpen(false)}
                  className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon name="cancel" size={18} />
                </button>
              </div>
              <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
                <Giscus
                  repo={siteConfig.giscus.repo}
                  repoId={siteConfig.giscus.repoId}
                  category={siteConfig.giscus.category}
                  categoryId={siteConfig.giscus.categoryId}
                  mapping="specific"
                  term={term}
                  compact
                />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
