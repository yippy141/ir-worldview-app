import type { Metadata } from "next"
import { ChinesePrivacyPage } from "@/components/i18n/chinese-privacy-page"
import { chineseShellContent } from "@/content/locales"
import { createLocalizedMetadata } from "@/i18n/metadata"

export function generateMetadata(): Metadata {
  return createLocalizedMetadata("zh-Hans", "/privacy", chineseShellContent.privacy.metadata)
}

export default function PrivacyPage() {
  return <ChinesePrivacyPage />
}
