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
    { label: "首页", href: "/", icon: "home" },
    { label: "文章", href: "/posts", icon: "book" },
    { label: "项目", href: "/projects", icon: "github" },
    { label: "资源", href: "/resources", icon: "folder" },
    { label: "讨论", href: "/discussions", icon: "sparkles" },
    { label: "工具", href: "/tools", icon: "settings" },
    { label: "友链", href: "/links", icon: "link" },
    { label: "关于", href: "/about", icon: "sparkles" },
  ],
  socials: [
    { label: "GitHub", href: "https://github.com/aiwandiannaodelele", icon: "github" },
    { label: "Bilibili", href: "https://space.bilibili.com/520410176", icon: "bilibili" },
    { label: "RSS", href: "/feed.xml", icon: "rss" },
  ],
  postsPerPage: 6,
  holidayMode: true,
  giscus: {
    repo: "aiwandiannaodelele/giscus",
    repoId: "R_kgDOTY2nVw",
    category: "Announcements",
    categoryId: "DIC_kwDOTY2nV84DBOPb",
  },
} as const

export type SocialIcon = "github" | "bilibili"