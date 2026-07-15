---
title: 对 Next.js 16 的一次零信任阅读
slug: next16-zero-trust-reading
date: 2026-07-14
excerpt: 忘掉你对 Next.js 的所有印象，把 v16 当成一个新框架来读文档，反而能看懂它现在到底想解决什么问题。
tags:
  - Next.js
  - 前端
cover: "#f59e0b"
---

我以前对 Next.js 的印象停留在 App Router 刚出来那阵子。这次系统重装回来，我决定先忘掉它，把 v16 当成一个全新的框架来读文档。结果反而顺畅很多。

## 反直觉的破坏性变更

`params` 现在是一个 `Promise`。第一次看到的时候我很抗拒，但读下去明白了：这是为了让请求时的一些值真正地"延迟"到被使用时才解析，而不是无条件地在第一次渲染时就被冻结。

```tsx
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // ...
}
```

乍看是"麻烦"，本质是它把"动态"和"静态"的边界划得更清楚了。

## 默认静态

App Router 里，一个页面默认就是静态的，除非你显式用了 `cookies()`、`headers()` 或者 `searchParams`。这意味着写一个博客时，你不需要专门去声明"我要 SSG"——你不碰那些动态 API，它就是静态生成的。

`generateStaticParams` 只是用来告诉构建器：这些动态路由的参数，请在构建时穷举出来。

## 一点感慨

框架的演进方向，整体是在把"什么时机发生什么事"这件事说得更明白。越明白，就越不用靠经验去猜，这对"重新回来"的人其实更友好。