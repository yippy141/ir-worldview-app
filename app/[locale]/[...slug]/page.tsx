import type { Metadata } from "next"
import { TranslationStatusNotice } from "@/components/i18n/translation-status-notice"
import { createUnavailableChineseMetadata } from "@/i18n/metadata"

type StatusPageProps = {
  params: Promise<{ locale: string; slug: string[] }>
}

export async function generateMetadata({ params }: StatusPageProps): Promise<Metadata> {
  const { slug } = await params
  return createUnavailableChineseMetadata(`/${slug.join("/")}`)
}

export default function ChineseTranslationStatusPage() {
  return <TranslationStatusNotice />
}
