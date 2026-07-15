export const siteConfig = {
  name: "乐乐 Lab",
  title: "乐乐 Lab · 一块自留地",
  description:
    "爱玩电脑的乐乐的个人站点，写点代码，想点事情。",
  author: {
    name: "爱玩电脑的乐乐",
    bio: "写点代码，想点事情。",
    avatar: "/avatar.jpg",
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