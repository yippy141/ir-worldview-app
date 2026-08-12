import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { CurrentCaseApp } from "@/components/current-case/current-case-app"
import { CurrentCasePageHeader } from "@/components/current-case/current-case-page-header"
import { CurrentCasePrintSummary } from "@/components/current-case/current-case-print-summary"
import styles from "@/components/current-case/current-case.module.css"
import {
  getPublishedZhHansCurrentCaseBySlug,
  getPublishedZhHansCurrentCases,
  toZhHansCurrentCasePublicRecord,
} from "@/lib/current-cases/zh-hans"
import { zhHansCurrentCaseMetadata } from "@/content/locales/zh-Hans/metadata"
import { createDynamicLocalizedMetadata } from "@/i18n/metadata"

type Props = {
  params: Promise<{ slug: string }>
}

export const revalidate = 3600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const record = getPublishedZhHansCurrentCaseBySlug(slug)
  if (!record) return { title: "当前案例未找到｜国际关系世界观清单" }
  const content = zhHansCurrentCaseMetadata[slug]
  return {
    ...createDynamicLocalizedMetadata("zh-Hans", `/cases/${slug}`, content),
    openGraph: {
      ...content.openGraph,
      publishedTime: `${record.publishedAt}T00:00:00.000Z`,
      modifiedTime: `${record.updatedAt}T00:00:00.000Z`,
    },
    twitter: {
      card: "summary_large_image",
      title: record.title,
      description: record.dek,
    },
  }
}

export function generateStaticParams() {
  return getPublishedZhHansCurrentCases().map((record) => ({
    slug: record.slug,
  }))
}

export default async function ZhHansCurrentCasePage({ params }: Props) {
  const referenceDate = new Date().toISOString().slice(0, 10)
  const { slug } = await params
  const record = getPublishedZhHansCurrentCaseBySlug(slug)
  if (!record) notFound()
  const publicRecord = toZhHansCurrentCasePublicRecord(record)

  return (
    <article className={styles.page}>
      <CurrentCasePageHeader
        record={publicRecord}
        locale="zh-Hans"
        referenceDate={referenceDate}
      />
      <CurrentCaseApp record={publicRecord} />
      <CurrentCasePrintSummary
        record={publicRecord}
        locale="zh-Hans"
        localizedSources={record.sources}
        referenceDate={referenceDate}
      />
    </article>
  )
}
