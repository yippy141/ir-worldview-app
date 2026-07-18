import type { Metadata } from "next"
import { LocaleEditorialPageView } from "@/components/i18n/locale-editorial-page"
import { chineseShellContent } from "@/content/locales"
import { createLocalizedMetadata } from "@/i18n/metadata"

export function generateMetadata(): Metadata {
  return createLocalizedMetadata("zh-Hans", "/", chineseShellContent.home.metadata)
}

export default function ChineseHomePage() {
  return (
    <main id="site-main" className="locale-home">
      <LocaleEditorialPageView content={chineseShellContent.home} className="locale-home-page" />
    </main>
  )
}
