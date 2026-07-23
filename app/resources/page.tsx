"use client"

import * as React from "react"
import { marked } from "marked"
import { Icon } from "@/components/icons"
import { Giscus } from "@/components/giscus"
import { siteConfig } from "@/lib/site"

export default function ResourcesPage() {
  const [releases, setReleases] = React.useState<Release[]>([])
  const [loading, setLoading] = React.useState(true)
  const [showTip, setShowTip] = React.useState(false)

  React.useEffect(() => {
    setShowTip(true)
    fetch("https://api.gitcode.com/api/v5/repos/aiwandiannaodelele/lelabfiles/releases")
      .then(r => r.json())
      .then(data => { setReleases(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <header className="mb-10">
        <p className="mb-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon name="folder" size={14} className="text-primary" />
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
                <div
                  className="mt-2 text-sm text-muted-foreground leading-relaxed [&_a]:text-primary [&_a]:underline"
                  dangerouslySetInnerHTML={{ __html: marked.parse(release.body, { async: false }) as string }}
                />
              )}
              {release.assets.filter(a => a.type === "attach").length > 0 && (
                <div className="mt-5 space-y-2">
                  {release.assets.filter(a => a.type === "attach").map((asset) => (
                    <a
                      key={asset.name}
                      href={asset.browser_download_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-xl border border-border/60 px-4 py-3 transition-colors hover:bg-muted/60"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                          <DownloadIcon />
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

      <div className="mt-14">
        <Giscus
          repo={siteConfig.giscus.repo}
          repoId={siteConfig.giscus.repoId}
          category={siteConfig.giscus.category}
          categoryId={siteConfig.giscus.categoryId}
        />
      </div>

      {showTip && (
        <div className="fixed bottom-5 right-5 z-50 w-72 max-w-[calc(100vw-2.5rem)] rounded-2xl border border-border/60 bg-card p-4 shadow-lg">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm leading-relaxed text-muted-foreground">
              本网站使用 Cloudflare 加速节点，若您需要在校园网等“dddd”的环境访问，可使用此网址：
              <a
                href="https://vlink.cc/fnd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
              >
vlink.cc/fnd
              </a>
            </p>
            <button
              type="button"
              aria-label="关闭"
              onClick={() => setShowTip(false)}
              className="shrink-0 rounded-md text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
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

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  )
}
