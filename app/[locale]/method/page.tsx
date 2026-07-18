import type { Metadata } from "next"
import { ChineseMethodsPage } from "@/components/i18n/chinese-methods-page"
import { chineseShellContent } from "@/content/locales"
import { createLocalizedMetadata } from "@/i18n/metadata"

export function generateMetadata(): Metadata {
  return createLocalizedMetadata("zh-Hans", "/method", chineseShellContent.methods.metadata)
}

export default function MethodPage() {
  return <ChineseMethodsPage />
}
