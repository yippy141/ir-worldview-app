import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import styles from "@/components/current-case/current-case.module.css"
import { zhHansCurrentCaseArchive } from "@/content/locales/zh-Hans/current-cases/archive"
import {
  zhHansCurrentCaseBySlug,
  zhHansCurrentCases,
} from "@/content/locales/zh-Hans/current-cases/index"
import { createDynamicLocalizedMetadata } from "@/i18n/metadata"
import { formatLocalizedDate } from "@/i18n/format"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const record = zhHansCurrentCaseBySlug[slug]
  const copy = zhHansCurrentCaseArchive.correctionsPage
  return createDynamicLocalizedMetadata("zh-Hans", `/cases/${slug}/corrections`, {
    title: record ? copy.metadataTitle(record.title) : copy.metadataFallbackTitle,
    description: copy.metadataDescription,
  })
}

export function generateStaticParams() {
  return zhHansCurrentCases.map((record) => ({ slug: record.slug }))
}

export default async function ZhHansCurrentCaseCorrectionsPage({ params }: Props) {
  const { slug } = await params
  const record = zhHansCurrentCaseBySlug[slug]
  if (!record || record.publicationStatus !== "published") notFound()
  const copy = zhHansCurrentCaseArchive.correctionsPage

  return (
    <div className={`${styles.page} ${styles.documentPage}`}>
      <header className={styles.pageHeader}>
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{record.title}</h1>
          <p className={styles.pageDek}>{copy.intro}</p>
        </div>
        <p className={styles.pageMeta}>
          {copy.lastEditorialUpdate} {formatLocalizedDate(record.correctionHistory.lastEditorialUpdate, "zh-Hans")}
          <br />
          {copy.evidenceThrough} {formatLocalizedDate(record.correctionHistory.evidenceThrough, "zh-Hans")}
        </p>
      </header>

      <section className={styles.correctionStatus}>
        <h2>{copy.recordStatus}</h2>
        <p>{record.correctionHistory.statusCopy}</p>
      </section>

      <p className={styles.pageDek}>
        {copy.report}{" "}
        <Link href="/feedback">{copy.reportLink}</Link>
      </p>
      <Link className={styles.documentBack} href={`/cases/${record.slug}`}>
        ← {copy.back}
      </Link>
    </div>
  )
}
