import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { CurrentCaseApp } from "@/components/current-case/current-case-app"
import { CurrentCasePageHeader } from "@/components/current-case/current-case-page-header"
import { CurrentCasePrintSummary } from "@/components/current-case/current-case-print-summary"
import styles from "@/components/current-case/current-case.module.css"
import {
  zhHansCurrentCaseBySlug,
  zhHansCurrentCases,
} from "@/content/locales/zh-Hans/current-cases/index"
import { zhHansCurrentCaseMetadata } from "@/content/locales/zh-Hans/metadata"
import { createDynamicLocalizedMetadata } from "@/i18n/metadata"
import { toZhHansCurrentCasePublicRecord } from "@/lib/current-cases/zh-hans"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const record = zhHansCurrentCaseBySlug[slug]
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
  return zhHansCurrentCases.map((record) => ({ slug: record.slug }))
}

export default async function ZhHansCurrentCasePage({ params }: Props) {
  const { slug } = await params
  const record = zhHansCurrentCaseBySlug[slug]
  if (!record || record.publicationStatus !== "published") notFound()
  const publicRecord = toZhHansCurrentCasePublicRecord(record)

  return (
    <article className={styles.page}>
      <CurrentCasePageHeader record={publicRecord} locale="zh-Hans" />
      <CurrentCaseApp record={publicRecord} />
      <CurrentCasePrintSummary
        record={publicRecord}
        locale="zh-Hans"
        localizedSources={record.sources}
      />
    </article>
  )
}
