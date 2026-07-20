import type { Metadata } from "next"
import { ZhHansEditorialPage } from "@/components/i18n/zh-hans-editorial-page"
import { zhHansAboutPage } from "@/content/locales/zh-Hans/editorial-pages"
import { zhHansRouteMetadata } from "@/content/locales/zh-Hans/metadata"
import { createLocalizedMetadata } from "@/i18n/metadata"

export function generateMetadata(): Metadata {
  return createLocalizedMetadata("zh-Hans", "/about", zhHansRouteMetadata.about)
}

export default function ChineseAboutPage() {
  return <ZhHansEditorialPage content={zhHansAboutPage} />
}
