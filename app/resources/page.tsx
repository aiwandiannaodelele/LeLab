"use client"

import * as React from "react"
import { Icon } from "@/components/icons"

export default function ResourcesPage() {
  const [releases, setReleases] = React.useState<Release[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch("https://api.gitcode.com/api/v5/repos/aiwandiannaodelele/lelabfiles/releases")
      .then(r => r.json())
      .then(data => { setReleases(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <header className="mb-10">
        <p className="mb-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon name="sparkles" size={14} className="text-primary" />
          RESOURCES
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">资源</h1>
        <p className="mt-2 text-sm text-muted-foreground">一些资源下载。</p>
      </header>

      {loading ? (
        <p className="text-sm text-muted-foreground">加载中...</p>
      ) : releases.length === 0 ? (
        <p className="text-sm text-muted-foreground">暂无资源。</p>
      ) : (
        <div className="space-y-6">
          {releases.map((release) => (
            <div key={release.tag_name} className="rounded-2xl border border-border/60 bg-card p-6">
              <h2 className="font-heading text-xl font-semibold tracking-tight">{release.name}</h2>
              {release.body && (
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{release.body}</p>
              )}
              {release.assets.length > 0 && (
                <div className="mt-5 space-y-2">
                  {release.assets.map((asset) => (
                    <a
                      key={asset.name}
                      href={asset.browser_download_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-xl border border-border/60 px-4 py-3 transition-colors hover:bg-muted/60"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                          <ArrowDown />
                        </span>
                        <span className="text-sm font-medium truncate transition-colors group-hover:text-primary">
                          {asset.name || "下载"}
                        </span>
                      </div>
                      <span className="shrink-0 ml-3 rounded-full bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground">
                        {formatExt(asset.browser_download_url)}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

type Asset = { name: string; browser_download_url: string; type: string }
type Release = { tag_name: string; name: string; body: string; assets: Asset[] }

function formatExt(url: string) {
  const ext = url.split(".").pop()?.toLowerCase() || ""
  const map: Record<string, string> = { exe: "可执行文件", zip: "ZIP", tar: "TAR", gz: "GZip", bz2: "BZip2", "7z": "7z" }
  return map[ext] || ext.toUpperCase()
}

function ArrowDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M19 12l-7 7-7-7"/>
    </svg>
  )
}
