import { HugeiconsIcon } from "@hugeicons/react"
import {
  Github01Icon,
  Mail01Icon,
  TwitterIcon,
  Home01Icon,
  Tag01Icon,
  Calendar03Icon,
  Clock01Icon,
  ChevronRightIcon,
  ArrowLeft02Icon,
  ArrowRight02Icon,
  ArrowUp02Icon,
  Menu02Icon,
  Cancel01Icon,
  Sun02Icon,
  Moon02Icon,
  SparklesIcon,
  Book02Icon,
} from "@hugeicons/core-free-icons"

import type { ComponentProps } from "react"

type IconProps = ComponentProps<typeof HugeiconsIcon>

export function Icon({
  name,
  ...props
}: { name: string } & Omit<IconProps, "icon">) {
  const map: Record<string, IconProps["icon"]> = {
    github: Github01Icon,
    mail: Mail01Icon,
    twitter: TwitterIcon,
    home: Home01Icon,
    tag: Tag01Icon,
    calendar: Calendar03Icon,
    clock: Clock01Icon,
    chevronRight: ChevronRightIcon,
    arrowLeft: ArrowLeft02Icon,
    arrowRight: ArrowRight02Icon,
    arrowUp: ArrowUp02Icon,
    menu: Menu02Icon,
    cancel: Cancel01Icon,
    sun: Sun02Icon,
    moon: Moon02Icon,
    sparkles: SparklesIcon,
    book: Book02Icon,
  }
  return <HugeiconsIcon icon={map[name] ?? SparklesIcon} {...props} />
}