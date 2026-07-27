export const metadata = {
  title: "用户协议",
  description: "乐乐 Lab 用户协议",
}

export default function TosPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <header className="mb-10">
        <p className="mb-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" color="currentColor" className="text-primary"><path d="M9.5 14.5L14.5 9.49995" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"></path><path d="M16.8463 14.6095L19.4558 12C21.5147 9.94108 21.5147 6.60298 19.4558 4.54411C17.397 2.48524 14.0589 2.48524 12 4.54411L9.39045 7.15366M14.6095 16.8463L12 19.4558C9.94113 21.5147 6.60303 21.5147 4.54416 19.4558C2.48528 17.3969 2.48528 14.0588 4.54416 12L7.1537 9.39041" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"></path></svg>
          TERMS
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">用户协议</h1>
        <p className="mt-2 text-sm text-muted-foreground">最后更新：2026 年 7 月</p>
      </header>

      <div className="prose-md space-y-6 text-sm leading-relaxed text-muted-foreground [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground [&_p]:my-4 [&_strong]:font-medium [&_strong]:text-foreground">
        <h2>一、协议的接受</h2>
        <p>
          当您访问或使用本网站（以下简称"本站"）时，即表示您已阅读、理解并同意受本用户协议（以下简称"协议"）的约束。
          如果您不同意本协议的任何条款，请立即停止访问和使用本站。
        </p>

        <h2>二、内容版权</h2>
        <p>
          本站所有原创文章、代码、图片及其他内容，除特别注明外，版权均归作者所有。
          未经作者书面许可，禁止任何形式的转载、摘编、改写或商业使用。
        </p>
        <p>
          博客文章下方的「本文链接」即为规范的转载出处。个人学习、非商业引用时，请保留原文链接并注明作者。
        </p>

        <h2>三、用户行为</h2>
        <p>使用本站服务时，您同意不会：</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>利用评论区或讨论功能发布违法、色情、暴力、骚扰或侵犯他人权益的内容</li>
          <li>尝试攻击、渗透或破坏本站基础设施</li>
          <li>批量抓取、爬取本站内容用于商业目的</li>
          <li>滥用资源下载功能（如批量下载、恶意请求）</li>
        </ul>

        <h2>四、免责声明</h2>
        <p>
          本站内容仅供学习和参考。作者不对内容的完整性、准确性和时效性作任何明示或暗示的保证。
        </p>
        <p>
          本站提供的资源下载链接来自第三方平台，作者不对资源的可用性和安全性负责。
          下载和使用资源所产生的风险由用户自行承担。
        </p>
        <p>
          本站可能因维护、升级或不可抗力因素导致服务中断，作者不对此承担责任。
        </p>

        <h2>五、第三方链接</h2>
        <p>
          本站可能包含指向第三方网站的链接。这些链接仅为方便用户而提供，不代表作者对第三方内容的认可或担保。
          访问第三方链接所产生的风险由用户自行承担。
        </p>

        <h2>六、协议变更</h2>
        <p>
          作者有权随时修改本协议。修改后的协议一经发布即生效。
          建议您定期查阅本页面以了解最新条款。重大变更将通过站内公告通知。
        </p>

        <h2>七、联系方式</h2>
        <p>
          如有任何疑问或建议，可通过 <a href="https://github.com/aiwandiannaodelele" target="_blank" rel="noopener noreferrer" className="text-primary underline">GitHub</a> 联系作者。
        </p>
      </div>
    </div>
  )
}
