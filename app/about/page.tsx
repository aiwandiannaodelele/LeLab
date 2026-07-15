import { siteConfig } from "@/lib/site"
import { Icon } from "@/components/icons"

export const metadata = {
  title: "关于",
  description: siteConfig.description,
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <header className="mb-10">
        <p className="mb-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon name="sparkles" size={14} className="text-primary" />
          ABOUT
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          关于
        </h1>
      </header>

      <div className="prose">
        <p>
          你好，我是 {siteConfig.author.name}，这里是 {siteConfig.name} ——
          一块属于我自己的、慢慢生长的自留地。
        </p>
        <p>
          这个站点没有后台、没有数据库，所有页面在构建时就被渲染成静态的
          HTML。写文章就是在 <code>content/posts/</code> 里放一个 Markdown
          文件，剩下的交给构建链。简单，但足够。
        </p>
        <h2>会写些什么</h2>
        <p>
          一些前端杂记、工具折腾、记录少许生活里值得留下来的碎片。
          不会追求更新频率，但希望每一篇都对得起自己。
        </p>
        <h2>关于这个站点本身</h2>
        <ul>
          <li>框架：Next.js 16，App Router，全静态生成</li>
          <li>样式：Tailwind CSS v4 + shadcn/ui 语义配色</li>
          <li>内容：本地 Markdown 文件，构建时解析渲染</li>
        </ul>
        <p>
          如果你想联系我，底部的那些图标门后都通向我。慢慢逛。
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-3 border-t border-border/60 pt-8">
        {siteConfig.socials.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-full border border-border/70 px-4 text-sm transition-colors hover:bg-muted"
          >
            <Icon name={social.icon} size={16} />
            {social.label}
          </a>
        ))}
      </div>
    </div>
  )
}