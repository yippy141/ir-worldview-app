import type { Metadata } from "next"
import { ZhHansEditorialPage } from "@/components/i18n/zh-hans-editorial-page"
import { zhHansCorrectionsPage } from "@/content/locales/zh-Hans/editorial-pages"
import { zhHansRouteMetadata } from "@/content/locales/zh-Hans/metadata"
import { createLocalizedMetadata } from "@/i18n/metadata"

export function generateMetadata(): Metadata {
  return createLocalizedMetadata("zh-Hans", "/feedback", zhHansRouteMetadata.corrections)
}

export default function CorrectionsPage() {
  return <ZhHansEditorialPage content={zhHansCorrectionsPage} />
}
