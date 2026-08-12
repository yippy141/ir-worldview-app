import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { CurrentCaseApp } from "@/components/current-case/current-case-app"
import { CurrentCasePageHeader } from "@/components/current-case/current-case-page-header"
import { CurrentCasePrintSummary } from "@/components/current-case/current-case-print-summary"
import styles from "@/components/current-case/current-case.module.css"
import {
  getPublishedCurrentCaseBySlug,
  getPublishedCurrentCases,
} from "@/lib/current-cases/catalog"
import { toCurrentCasePublicRecord } from "@/lib/current-cases/presentation"

type CurrentCasePageProps = {
  params: Promise<{ slug: string }>
}

export const revalidate = 3600

export async function generateMetadata({ params }: CurrentCasePageProps): Promise<Metadata> {
  const { slug } = await params
  const record = getPublishedCurrentCaseBySlug(slug)
  if (!record) return { title: "Current Case not found — IR Worldview Inventory" }
  return {
    title: `${record.title} — Current Case`,
    description: record.dek,
    alternates: { canonical: `/cases/${record.slug}` },
    openGraph: {
      type: "article",
      title: record.title,
      description: record.dek,
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
  return getPublishedCurrentCases().map((record) => ({ slug: record.slug }))
}

export default async function CurrentCasePage({ params }: CurrentCasePageProps) {
  const referenceDate = new Date().toISOString().slice(0, 10)
  const { slug } = await params
  const record = getPublishedCurrentCaseBySlug(slug)
  if (!record) notFound()
  const publicRecord = toCurrentCasePublicRecord(record)

  return (
    <article className={styles.page}>
      <CurrentCasePageHeader
        record={publicRecord}
        referenceDate={referenceDate}
      />
      <CurrentCaseApp record={publicRecord} />
      <CurrentCasePrintSummary
        record={publicRecord}
        referenceDate={referenceDate}
      />
    </article>
  )
}
