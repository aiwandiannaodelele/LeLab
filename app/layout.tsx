import type { Metadata } from "next"
import { Geist, Geist_Mono, Roboto } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BackToTop } from "@/components/back-to-top"
import { CommandPalette } from "@/components/command-palette"
import { ScheduleDebug } from "@/components/schedule-debug"
import { siteConfig } from "@/lib/site"
import { getAllPosts } from "@/lib/posts"
import { cn } from "@/lib/utils"

const geistHeading = Geist({ subsets: ["latin"], variable: "--font-heading" })

const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.author.name }],
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const posts = await getAllPosts()

  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        roboto.variable,
        geistHeading.variable,
      )}
    >
      <body className="min-h-svh bg-background text-foreground">
        <link rel="preconnect" href="https://github.com" />
        <link rel="preconnect" href="https://status.lelab.cc.cd" />

        <script type="text/javascript" src="https://www.termsfeed.com/public/cookie-consent/4.2.0/cookie-consent.js" charSet="UTF-8" />
        <script type="text/javascript" charSet="UTF-8" dangerouslySetInnerHTML={{
          __html: `
document.addEventListener('DOMContentLoaded', function () {
cookieconsent.run({"notice_banner_type":"simple","consent_type":"express","palette":"light","language":"en","page_load_consent_levels":["strictly-necessary"],"notice_banner_reject_button_hide":false,"preferences_center_close_button_hide":false,"page_refresh_confirmation_buttons":false,"website_name":"LeLab","website_privacy_policy_url":"https://1l.lol/privacy"});
});
          `,
        }} />

<script type="text/plain" data-cookie-consent="tracking" src="https://cdn.busuanzi.cc/busuanzi/3.6.9/busuanzi.min.js" />

        <noscript dangerouslySetInnerHTML={{
          __html: 'Free cookie consent management tool by <a href="https://www.termsfeed.com/">TermsFeed</a>',
        }} />
        <ThemeProvider>
          <script type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: siteConfig.name,
              url: "https://1l.lol",
              description: siteConfig.description,
            })
          }} />
          <div className="flex min-h-svh flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <BackToTop />
          <ScheduleDebug />
          <CommandPalette posts={posts} />
        </ThemeProvider>
      </body>
    </html>
  )
}