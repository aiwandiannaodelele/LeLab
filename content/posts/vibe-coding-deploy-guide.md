---
title: Vibe Coding 出一个超强的网页？怎么公开发布？
slug: vibe-coding-deploy-guide
date: 2026-07-23
excerpt: 用 AI 写完网页本地运行完美，却卡在部署上线，这正是 Vibe Coding 最大的短板。
tags:
  - Vibe Coding
  - AI
  - Serverless
  - CI/CD
  - Cloud Deployment
  - Git
cover: '#3b82f6'
coverImage: ''
---

# Vibe Coding 出的网站，怎么从零上线

写那些用 AI 写代码、但没怎么碰过运维的人。不用学服务器，不用配 nginx，看完就能把网站挂到公网上。

## 先搞清楚你做的是哪种站

Vibe Coding 出来的东西，基本就两类。

**纯静态站点**，新手走这条。Next.js 静态导出、原生 HTML/CSS/JS、Vue 打包后的静态页都算。没有数据库，没有后端接口，说白了就是一堆文件扔到 CDN 上。好处是几乎所有平台都免费托管，个人主页、作品集、工具 Demo、博客全都能搞定。我这个站就是纯静态的。

**带后端的动态站**，SSR、接口、数据库都要持续跑着。得管服务器、环境变量、数据库连接，还有额外开销。新手别急着碰这个，先把静态站玩明白。

说句实在的：如果你只是做个页面 Demo，直接让 AI 生成能静态导出的项目，别搞什么持续运行的后端服务器，给自己找麻烦。

## 部署就两种方式

**Git 仓库部署**：代码推到 GitHub，托管平台自动拉取、自动构建、自动更新。适合长期维护的项目，配好之后每次 `git push` 就完事了。

**直接上传**：把打包好的静态文件拖上去就行，不用建仓库。临时演示用这个最快。

## 域名这事

没域名的网站就像人没名字，IP 地址谁记得住，而且看着也不专业。

不想花钱？Cloudflare Pages、Vercel、Netlify 都会免费送一个子域名，比如 `你的项目名.pages.dev`，临时演示完全够用。

想正经搞一个？去 Spaceship、Porkbun 或者 Namesilo 买，`.com` 一年大概 60 块。想省钱可以搞 `1l.lol` 这种冷门顶级域，一年才 7 块，我自己用的就是这个。

绑定流程也不复杂：买域名，把 DNS 解析指向托管平台，在托管平台里设置自定义域名，等生效。唯一要注意的是 DNS 生效可能要几分钟到几小时，别一直刷新以为自己配错了。

## 托管平台选哪个

直接上 Serverless，别买 VPS。证书、端口、防火墙、防攻击这些破事平台全帮你搞定了，你只需要关心代码。

我自己用 Cloudflare Pages/Workers，这个站就跑在上面。几个主流平台的免费额度对一下：

表格

| **平台** | **免费额度** | **特点** |
| --- | --- | --- |
| Cloudflare Pages/Workers | 无限带宽，每月 3000 分钟构建 | 国内访问快，自带 CDN，SSL 自动配 |
| Vercel | 100GB 带宽 | 跟 Next.js 一家亲，集成最丝滑 |
| Netlify | 100GB 带宽，300 构建分钟 | 老牌，稳定 |

怎么选？你用的框架跟哪家关系好就选哪家。Next.js 选 Vercel 或 Cloudflare 都行，纯 HTML 随便挑。

如果是带后端的动态站，看看 Zeabur、Railway、Fly.io，月费 5 到 20 刀起步。还是那句话，新手先别碰。

## 其实可以更懒

Cloudflare 把域名注册、DNS、Pages/Workers 部署、SSL、自定义域名全做了，理论上一条龙。

你让 AI 装个 MCP，读这份文档：

[https://developers.cloudflare.com/agent-setup/prompt.md](https://link.wtturl.cn/?target=https%3A%2F%2Fdevelopers.cloudflare.com%2Fagent-setup%2Fprompt.md&scene=im&aid=497858&lang=zh "autolink")

读完 AI 就知道怎么操作 Cloudflare 了。域名、DNS、部署、证书、绑定，你只需要说一句 "帮我把这个网站部署上去"。

动态站也不是没办法，让 AI 把后端迁到 Cloudflare Workers 生态里，D1 当数据库、KV 当缓存、Workers 当服务器，照样零服务器自动部署。

## 拿我这个站举例

完整链路是这样的：

写代码 → `git push` → Cloudflare 检测到推送 → 自动拉代码 → `npm run build` → 生成静态文件 → 同步到全球 CDN → 访问 [https://1l.lol](https://link.wtturl.cn/?target=https%3A%2F%2F1l.lol&scene=im&aid=497858&lang=zh "autolink")

具体步骤：

1. 代码传到 GitHub 仓库（私有公开都行）
2. Cloudflare Pages 里关联这个仓库
3. 选框架预设（Next.js 就选 Next.js，构建命令填 `npm run build`，输出目录填 `out`）
4. 之后每次 `git push`，Cloudflare 自动收到通知
5. 拉最新代码，在边缘节点上构建，产物分发到全球 CDN
6. 几十秒后刷新，已经在线了

说一下原理：这不是 "把文件传到服务器上"，而是 Git 触发的一条自动化流水线（CI/CD）。你 push 代码，平台帮你执行构建命令，构建产物分发到 CDN 边缘节点。用户访问时从最近的节点拉取，根本不用管物理服务器在哪。

我第一次配的时候输出目录填错了，构建成功但页面 404，查了半天才发现是 `out` 没填对。所以这一步别学我，看清楚框架预设给的默认值。

跟传统部署对比一下就知道差别有多大：

表格

|  | **传统部署** | **Serverless（本站）** |
| --- | --- | --- |
| 服务器 | 自己买 VPS 或云服务器 | 不需要，平台管 |
| SSL 证书 | 手动申请、续期 | 自动配置 |
| 防火墙 / 端口 | 手动配置 | 不用管 |
| 防攻击 | 自己装 WAF 或买高防 | 平台自带 |
| 上线流程 | 装环境 → 传文件 → 配 nginx | push 完事 |
| 扩展性 | 流量大了手动加机器 | 自动扩容 |

所以我为什么推荐 Serverless？你只需要写代码，剩下的交给平台。Vibe Coding 出一个网站，push 到 GitHub，Cloudflare 自动搞定一切。第一次配置花点时间，之后每次更新就一条命令的事。

## 最后说两句

Vibe Coding 做出来的网站，上线门槛真的不高。静态站找个免费托管平台加买个域名就完事了，动态站麻烦一点，但新手完全可以先用静态站练手。

别想着一步到位。先挂上去，能访问了，再慢慢改。
