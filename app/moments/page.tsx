import { getAllMoments } from "@/lib/moments"
import { renderMoment } from "@/lib/moment-render"
import { Icon } from "@/components/icons"
import { MomentCommentButton } from "@/components/moment-comment"

export const metadata = {
  title: "动态",
  description: "随便记录一些日常。",
}

export default async function MomentsPage() {
  const moments = await getAllMoments()

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <header className="mb-10">
        <p className="mb-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon name="star" size={14} className="text-primary" />
          MOMENTS
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">动态</h1>
        <p className="mt-2 text-sm text-muted-foreground">随便记录一些日常。</p>
      </header>

      {moments.length === 0 ? (
        <p className="text-sm text-muted-foreground">还没有动态。</p>
      ) : (
        <div className="relative space-y-8 border-l-2 border-border/60 pl-6">
          {moments.map((m) => (
            <div key={m.slug} className="relative">
              <span className="absolute -left-[31px] top-1 grid size-4 place-items-center rounded-full bg-primary ring-4 ring-background">
                <span className="size-1.5 rounded-full bg-primary-foreground" />
              </span>
              <div className="rounded-2xl border border-border/60 bg-card p-5">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground/70">{formatDate(m.date)}</p>
                  <MomentCommentButton term={m.slug} />
                </div>
                <div
                  className="moment-content text-sm leading-relaxed text-foreground/90 [&_a]:text-primary [&_a]:underline"
                  dangerouslySetInnerHTML={{ __html: renderMoment(m.content) }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}
