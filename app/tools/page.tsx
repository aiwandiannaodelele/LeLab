import Link from "next/link"
import { Icon } from "@/components/icons"

export const metadata = {
  title: "工具",
  description: "一些有用的工具。",
}

const tools = [
  {
    title: "GitHub 加速",
    desc: "加速访问 GitHub 资源，解决下载慢、克隆慢的问题。",
    href: "/tools/github-accelerator",
    icon: "github",
  },
  {
    title: "浏览器信息",
    desc: "查看当前浏览器可获取的所有信息。",
    href: "/tools/browser-info",
    icon: "search",
  },
]

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <header className="mb-10">
        <p className="mb-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon name="settings" size={14} className="text-primary" />
          TOOLS
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          工具
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          这里会放一些平时用到的工具。
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group rounded-2xl border border-border/60 bg-card p-5 transition-all hover:-translate-y-1 hover:border-border hover:shadow-md"
          >
            <div className="mb-3 grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <Icon name={tool.icon} size={20} />
            </div>
            <h2 className="font-heading text-base font-semibold tracking-tight transition-colors group-hover:text-primary">
              {tool.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              {tool.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}