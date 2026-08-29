import type { Metadata } from "next"
import { RootHome } from "@/components/home/root/root-home"
import { getRootCopy } from "@/content/root"
import { zhHansRouteMetadata } from "@/content/locales/zh-Hans/metadata"
import { createLocalizedMetadata } from "@/i18n/metadata"
import { ROOT_GLOBE_VISUAL } from "@/lib/root/orthographic"

export function generateMetadata(): Metadata {
  return createLocalizedMetadata("zh-Hans", "/", zhHansRouteMetadata.home)
}

export default function ChineseHomePage() {
  return (
    <RootHome
      locale="zh-Hans"
      copy={getRootCopy("zh-Hans")}
      visual={ROOT_GLOBE_VISUAL}
    />
  )
}
