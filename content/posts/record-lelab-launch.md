---
title: 记录一下我零成本建站的全过程
slug: record-lelab-launch
date: 2026-07-16
excerpt: 告别模板套皮旧站，靠重构个人网站，说说 Next.js+Serverless 这套方案
tags:
  - 记录
  - Next.js
  - Cloudflare Worker
  - LeLab
  - Serverless
cover: '#669c35'
coverImage: ''
---

大家好，欢迎光临我的新地盘 —— 乐乐 Lab！

我之前的网站就是套了个模板，bro以为改改颜色就是“自己的网站”了，现在我靠自己~~（靠AI）~~终于把网站重构了！

## **技术栈一览**

整个站，纯静态导出，没有服务器。

- 框架：Next.js 16，全静态生成
- 样式：Tailwind CSS v4 + shadcn/ui，暗色亮色都支持
- 内容：Markdown 文件，通过 Sveltia CMS 在网页上管理
- 评论：giscus，基于 GitHub Discussions
- 统计：Umami Cloud
- 域名：免费短二级域名 1l.lol，可托管 Cloudflare

## **配套服务**

由于是静态网站，所以需要搭建的子服务比较多。

- **GitHub OAuth 登录**：自己搭的 Auth Worker 做登录代理
- **Sveltia CMS**：在网页上调用 Github API 编写文章提交完自动推送构建

## 观念大反转

说实话我之前一直很不喜欢静态站，缺点明显：编辑文章麻烦，本地开项目、写 md、调试格式，写完还要手动 push 仓库等构建，一套流程还不如 WordPress，完全没有动态后台点一下发布来得轻松。
直到我挖到 Sveltia CMS，直接抹平了静态站写文发布的门槛。依托 Serverless 跑在 Cloudflare 边缘节点，加上CMLiussss大佬的 Cloudflare 优选，速度直接起飞。

现在这套站点，静态导出 + Serverless 无服务架构，安全性拉满、零运维成本，真的爽！！！！！！！
