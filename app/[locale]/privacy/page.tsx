import type { Metadata } from "next"
import { ChinesePrivacyPage } from "@/components/i18n/chinese-privacy-page"
import { zhHansRouteMetadata } from "@/content/locales/zh-Hans/metadata"
import { createLocalizedMetadata } from "@/i18n/metadata"

export function generateMetadata(): Metadata {
  return createLocalizedMetadata("zh-Hans", "/privacy", zhHansRouteMetadata.privacy)
}

export default function PrivacyPage() {
  return <ChinesePrivacyPage />
}
