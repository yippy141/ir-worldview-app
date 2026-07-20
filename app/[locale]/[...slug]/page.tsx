import type { Metadata } from "next"
import { TranslationStatusNotice } from "@/components/i18n/translation-status-notice"
import { createUnavailableChineseMetadata } from "@/i18n/metadata"
import { isUnapprovedInstrumentPath } from "@/i18n/paths"

type StatusPageProps = {
  params: Promise<{ locale: string; slug: string[] }>
}

export async function generateMetadata({ params }: StatusPageProps): Promise<Metadata> {
  const { slug } = await params
  return createUnavailableChineseMetadata(`/${slug.join("/")}`)
}

export default async function ChineseTranslationStatusPage({ params }: StatusPageProps) {
  const { slug } = await params
  return <TranslationStatusNotice instrument={isUnapprovedInstrumentPath(`/${slug.join("/")}`)} />
}
