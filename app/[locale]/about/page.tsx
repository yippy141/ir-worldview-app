import type { Metadata } from "next"
import { LocaleEditorialPageView } from "@/components/i18n/locale-editorial-page"
import { chineseShellContent } from "@/content/locales"
import { createLocalizedMetadata } from "@/i18n/metadata"

export function generateMetadata(): Metadata {
  return createLocalizedMetadata("zh-Hans", "/about", chineseShellContent.about.metadata)
}

export default function ChineseAboutPage() {
  return <LocaleEditorialPageView content={chineseShellContent.about} />
}
