---
title: 用 Tailwind v4 搭一套不像模板的配色
slug: tailwind-v4-color-system
date: 2026-07-03
excerpt: Tailwind v4 带来了 OKLCH 色彩空间和 @theme 指令。记录一次从零设计配色系统的过程。
tags:
  - CSS
  - 前端
cover: "#ec4899"
---

`oklch()` 是一个比 `hsl()` 更符合人眼感知的色彩空间。同样是"均匀地变亮一档"，OKLCH 之间确实感觉是均匀的，而 HSL 会出现明显的色相偏移。

## 用 @theme 把变量交给 Tailwind

Tailwind v4 的 `@theme` 指令让你直接在 CSS 里声明设计令牌：

```css
@theme inline {
  --color-primary: var(--primary);
  --color-background: var(--background);
}
```

然后在 JSX 中直接使用 `bg-primary`、`text-background`，Tailwind 会自动把这些类映射到你定义的变量上。

## 暗色模式不是反色

很多人做暗色模式只是把背景和前景对调。但好的暗色模式应该：

1. 降低纯黑的比例，改用深灰，减少对比疲劳。
2. 让强调色在暗背景下稍微"提亮"一点饱和度。
3. 边框用透明度的白，而不是固定的灰。

## 一点碎碎念

配色这种事，没有"正确答案"，只有"自洽的系统"。先规定几个语义变量（background / foreground / primary / muted），再让所有组件都只认语义，不认具体色值，整个站就会自然地随主题切换而协调。