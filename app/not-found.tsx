import Link from "next/link"
import { Icon } from "@/components/icons"

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-28 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-muted text-3xl">
        🧭
      </span>
      <h1 className="mt-6 font-heading text-3xl font-semibold tracking-tight">
        走到岔路了
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        这里好像没有什么内容，也许它还没被写出来。
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
      >
        <Icon name="arrowLeft" size={16} />
        回到首页
      </Link>
    </div>
  )
}