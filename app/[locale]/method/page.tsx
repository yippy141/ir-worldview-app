import type { Metadata } from "next"
import { ChineseMethodsPage } from "@/components/i18n/chinese-methods-page"
import { zhHansRouteMetadata } from "@/content/locales/zh-Hans/metadata"
import { createLocalizedMetadata } from "@/i18n/metadata"

export function generateMetadata(): Metadata {
  return createLocalizedMetadata("zh-Hans", "/method", zhHansRouteMetadata.methods)
}

export default function MethodPage() {
  return <ChineseMethodsPage />
}
