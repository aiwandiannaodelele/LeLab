import Link from "next/link"
import { Icon } from "@/components/icons"
import { GithubAccelForm } from "./form"

export const metadata = {
  title: "GitHub 加速",
  description: "加速访问 GitHub 资源。",
}

export default function GithubAcceleratorPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <Link
        href="/tools"
        className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <Icon name="arrowLeft" size={14} />
        返回工具
      </Link>

      <header className="mb-8">
        <div className="mb-3 grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Icon name="github" size={24} />
        </div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          GitHub 加速
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          加速 GitHub 克隆与下载。
        </p>
      </header>

      <GithubAccelForm />
    </div>
  )
}