export const siteConfig = {
  name: "lele",
  title: "lele · 一块自留地",
  description:
    "lele 的个人博客，记录关于前端、工具与生活的一些碎片。静态生成，慢慢生长。",
  author: {
    name: "lele",
    bio: "写点代码，想点事情。这里是一个慢慢生长的角落。",
    avatar: "🌴",
  },
  nav: [
    { label: "首页", href: "/" },
    { label: "文章", href: "/posts" },
    { label: "标签", href: "/tags" },
    { label: "关于", href: "/about" },
  ],
  socials: [
    { label: "GitHub", href: "https://github.com", icon: "github" },
    { label: "Mail", href: "mailto:hello@example.com", icon: "mail" },
    { label: "Twitter", href: "https://twitter.com", icon: "twitter" },
  ],
  postsPerPage: 6,
} as const

export type SocialIcon = "github" | "mail" | "twitter"