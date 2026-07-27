export const metadata = {
  title: "隐私政策",
  description: "乐乐 Lab 隐私政策",
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <header className="mb-10">
        <p className="mb-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" color="currentColor" className="text-primary"><path d="M9.5 14.5L14.5 9.49995" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"></path><path d="M16.8463 14.6095L19.4558 12C21.5147 9.94108 21.5147 6.60298 19.4558 4.54411C17.397 2.48524 14.0589 2.48524 12 4.54411L9.39045 7.15366M14.6095 16.8463L12 19.4558C9.94113 21.5147 6.60303 21.5147 4.54416 19.4558C2.48528 17.3969 2.48528 14.0588 4.54416 12L7.1537 9.39041" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"></path></svg>
          PRIVACY
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">隐私政策</h1>
        <p className="mt-2 text-sm text-muted-foreground">最后更新：2026 年 7 月</p>
      </header>

      <div className="prose-md space-y-6 text-sm leading-relaxed text-muted-foreground [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground [&_p]:my-4 [&_strong]:font-medium [&_strong]:text-foreground">
        <h2>一、信息收集</h2>
        <p>
          本网站使用第三方统计服务<strong>不蒜子</strong>（busuanzi.cc）记录页面访问次数和独立访客数。
          该服务仅收集页面 URL 和浏览器基本信息，不收集您的 IP 地址、地理位置、设备标识等个人可识别信息。
        </p>
        <p>
          本网站使用 <strong>Giscus</strong> 提供评论区功能。Giscus 基于 GitHub Discussions 构建，
          评论内容将存储在您的 GitHub 账户下，受 <a href="https://docs.github.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">GitHub 隐私政策</a> 管辖。
          当您发表评论时，您的 GitHub 头像、用户名和评论内容将对所有访客公开可见。
        </p>

        <h2>二、自动收集的信息</h2>
        <p>
          本网站的托管基础设施（Cloudflare）可能会自动记录请求日志，包括请求时间、访问的页面路径和客户端 IP 地址。
          这些日志仅用于运维和安全目的，不会用于追踪个人用户。
        </p>

        <h2>三、Cookie</h2>
        <p>
          本网站不主动设置跟踪 Cookie。主题偏好（深色/浅色模式）存储在浏览器本地存储（localStorage）中，不会发送到服务器。
          Giscus 和 GitHub 可能会设置必要的认证 Cookie，详情请参考对应服务商的隐私政策。
        </p>

        <h2>四、第三方服务</h2>
        <p>本网站集成了以下第三方服务，它们各自遵守其隐私政策：</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>不蒜子</strong> — 页面访问统计</li>
          <li><strong>Giscus / GitHub</strong> — 评论系统</li>
          <li><strong>Cloudflare</strong> — CDN 加速与流量分发</li>
          <li><strong>GitCode</strong> — 资源文件托管与下载</li>
        </ul>

        <h2>五、数据删除</h2>
        <p>
          由于本网站不存储用户个人数据，因此无需提供数据删除入口。评论区内容可自行在 GitHub Discussions 仓库中管理。
          如有其他隐私相关问题，可通过 GitHub Issues 联系我们。
        </p>

        <h2>六、政策更新</h2>
        <p>
          本隐私政策可能会不时更新。重大变更时会在网站首页公告。
        </p>
      </div>
    </div>
  )
}
