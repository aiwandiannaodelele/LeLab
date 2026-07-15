import Link from "next/link"
import Image from "next/image"
import { siteConfig } from "@/lib/site"
import { Icon } from "@/components/icons"

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/60">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 py-10 sm:flex-row">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Image
            src={siteConfig.author.avatar}
            alt={siteConfig.name}
            width={28}
            height={28}
            className="size-7 rounded-lg object-cover"
            unoptimized
          />
          <span>
            © {new Date().getFullYear()} {siteConfig.name}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {siteConfig.socials.map((social) => (
            <Link
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Icon name={social.icon} size={18} />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}