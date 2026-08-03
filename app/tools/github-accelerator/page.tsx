import Link from "next/link"
import { Icon } from "@/components/icons"
import { GithubAccelForm } from "./form"

export const metadata = {
  title: "GitHub 加速",
  description: "加速访问 GitHub 资源。",
}

export default function GithubAcceleratorPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <header className="mb-8 flex items-center gap-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Icon name="github" size={24} />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            GitHub 加速
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            加速 GitHub 克隆与下载。
          </p>
        </div>
        <Link
          href="/tools"
          className="inline-flex shrink-0 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <Icon name="arrowLeft" size={14} />
          返回工具
        </Link>
      </header>

      <GithubAccelForm />
    </div>
  )
}