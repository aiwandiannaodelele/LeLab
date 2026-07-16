import Image from "next/image"
import { Icon } from "@/components/icons"

export const metadata = {
  title: "友链",
  description: "朋友们。",
}

const friends = [
  {
    name: "二叉树树",
    url: "https://2x.nz",
    avatar: "https://q2.qlogo.cn/headimg_dl?dst_uin=2726730791&spec=0",
    desc: "Protect What You Love.",
  },
]

export default function LinksPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <header className="mb-10">
        <p className="mb-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon name="sparkles" size={14} className="text-primary" />
          LINKS
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          友链
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          一些朋友们。
        </p>
      </header>

      {friends.length === 0 ? (
        <p className="text-sm text-muted-foreground">还没有友链。</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {friends.map((f) => (
            <a
              key={f.url}
              href={f.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-border/60 bg-card p-5 transition-all hover:-translate-y-1 hover:border-border hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                {f.avatar ? (
                  <Image
                    src={f.avatar}
                    alt={f.name}
                    width={40}
                    height={40}
                    className="size-10 rounded-full object-cover ring-2 ring-border/50"
                    unoptimized
                  />
                ) : (
                  <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {f.name[0]}
                  </span>
                )}
                <div>
                  <h2 className="font-heading text-base font-semibold tracking-tight transition-colors group-hover:text-primary">
                    {f.name}
                  </h2>
                  {f.desc && (
                    <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">
                      {f.desc}
                    </p>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}