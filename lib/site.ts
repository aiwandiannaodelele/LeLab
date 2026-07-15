export const siteConfig = {
  name: "乐乐的存档",
  title: "乐乐的存档 · 一块自留地",
  description:
    "爱玩电脑的乐乐的个人博客，记录关于前端、工具与生活的一些碎片。",
  author: {
    name: "爱玩电脑的乐乐",
    bio: "写点代码，想点事情。这里是一个慢慢生长的角落。",
    avatar: "https://q2.qlogo.cn/headimg_dl?dst_uin=2992025461&spec=0",
  },
  nav: [
    { label: "首页", href: "/" },
    { label: "文章", href: "/posts" },
    { label: "标签", href: "/tags" },
    { label: "关于", href: "/about" },
  ],
  socials: [
    { label: "GitHub", href: "https://github.com/aiwandiannaodelele", icon: "github" },
    { label: "Bilibili", href: "https://space.bilibili.com/520410176", icon: "bilibili" },
  ],
  postsPerPage: 6,
  giscus: {
    repo: "aiwandiannaodelele/giscus",
    repoId: "R_kgDOTY2nVw",
    category: "Announcements",
    categoryId: "DIC_kwDOTY2nV84DBOPb",
  },
} as const

export type SocialIcon = "github" | "bilibili"