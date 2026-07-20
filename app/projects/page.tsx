import { Icon } from "@/components/icons"

export const metadata = {
  title: "项目",
  description: "我在 GitHub 上的一些开源项目。",
}

type Repo = {
  name: string
  description: string
  html_url: string
  stargazers_count: number
  fork: boolean
  language: string
  topics: string[]
  updated_at: string
}

const excludeRepos = new Set([
  "aiwandiannaodelele",
  "giscus",
  "Blog-Giscus",
  "FangCloud",
  "fangchatbot",
])

async function getRepos(): Promise<Repo[]> {
  try {
    const res = await fetch(
      "https://api.github.com/users/aiwandiannaodelele/repos?sort=updated&per_page=60",
      { next: { revalidate: 3600 } },
    )
    if (!res.ok) return []
    const all: Repo[] = await res.json()
    return all
      .filter((r) => !r.fork && !excludeRepos.has(r.name))
      .slice(0, 30)
  } catch {
    return []
  }
}

const langColors: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-500",
  Python: "bg-green-500",
  Go: "bg-cyan-500",
  Rust: "bg-orange-500",
  HTML: "bg-red-500",
  CSS: "bg-purple-500",
  Java: "bg-amber-700",
  C: "bg-gray-500",
  "C++": "bg-pink-500",
  Shell: "bg-emerald-600",
  Dockerfile: "bg-blue-600",
}

export default async function ProjectsPage() {
  const repos = await getRepos()

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <header className="mb-10">
        <p className="mb-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon name="sparkles" size={14} className="text-primary" />
          PROJECTS
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          项目
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          我在 GitHub 上的一些开源项目。
        </p>
      </header>

      {repos.length === 0 ? (
        <p className="text-sm text-muted-foreground">暂无项目。</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {repos.map((repo) => (
            <a
              key={repo.name}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-border/60 bg-card p-5 transition-all hover:-translate-y-1 hover:border-border hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-heading text-base font-semibold tracking-tight transition-colors group-hover:text-primary">
                  {repo.name}
                </h2>
                {repo.stargazers_count > 0 && (
                  <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                    ⭐ {repo.stargazers_count}
                  </span>
                )}
              </div>
              {repo.description && (
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {repo.description}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {repo.language && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className={`size-2.5 rounded-full ${langColors[repo.language] || "bg-muted-foreground/40"}`} />
                    {repo.language}
                  </span>
                )}
                {repo.topics?.slice(0, 3).map((t) => (
                  <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
