import { Icon } from "@/components/icons"

export const metadata = {
  title: "工具",
  description: "一些有用的工具。",
}

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <header className="mb-10">
        <p className="mb-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon name="sparkles" size={14} className="text-primary" />
          TOOLS
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          工具
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          这里会放一些平时用到的工具。
        </p>
      </header>
    </div>
  )
}