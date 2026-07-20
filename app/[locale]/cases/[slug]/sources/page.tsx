import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import styles from "@/components/current-case/current-case.module.css"
import {
  zhHansCurrentCaseArchive,
} from "@/content/locales/zh-Hans/current-cases/archive"
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
  const copy = zhHansCurrentCaseArchive.sourcePage
  return createDynamicLocalizedMetadata("zh-Hans", `/cases/${slug}/sources`, {
    title: record ? copy.metadataTitle(record.title) : copy.metadataFallbackTitle,
    description: record?.dek ?? copy.metadataFallbackDescription,
  })
}

export function generateStaticParams() {
  return zhHansCurrentCases.map((record) => ({ slug: record.slug }))
}

export default async function ZhHansCurrentCaseSourcesPage({ params }: Props) {
  const { slug } = await params
  const record = zhHansCurrentCaseBySlug[slug]
  if (!record || record.publicationStatus !== "published") notFound()
  const copy = zhHansCurrentCaseArchive.sourcePage

  return (
    <div className={`${styles.page} ${styles.documentPage} zh-hans-source-ledger`}>
      <header className={styles.pageHeader}>
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{record.title}</h1>
          <p className={styles.pageDek}>{copy.intro}</p>
        </div>
        <p className={styles.pageMeta}>
          {copy.evidenceWindow}
          <br />
          {formatLocalizedDate(record.evidenceWindow.start, "zh-Hans")}至
          {formatLocalizedDate(record.evidenceWindow.end, "zh-Hans")}
          <br />
          {copy.claimAndSourceCount(record.factualClaims.length, record.sources.length)}
        </p>
      </header>

      <ol className={styles.claimList} aria-label={copy.claimsAria}>
        {record.factualClaims.map((claim) => (
          <li key={claim.id} id={`claim-${claim.id}`} className={styles.claimRow}>
            <h2>{copy.claim(claim.id)}</h2>
            <p>{claim.text}</p>
            <ul className={styles.claimSources}>
              {record.sources.filter((source) => source.claimIds.includes(claim.id)).map((source) => (
                <li key={source.id}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer">
                    {source.displayTitle}
                    <span className="sr-only">（{copy.opensInNewTab}）</span>
                  </a>{" "}
                  — {source.publisher}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <section aria-labelledby="source-ledger-heading">
        <h2 id="source-ledger-heading">{copy.sourceLedger}</h2>
        <ol className={styles.sourceList}>
          {record.sources.map((source) => (
            <li key={source.id} className={styles.sourceRow}>
              <h2>{source.id} · {copy.sourceKinds[source.kind]}</h2>
              <p>
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  <span>{source.displayTitle}</span>
                  <span className="sr-only">（{copy.opensInNewTab}）</span>
                </a>
                <span className="source-original-title" lang="en">
                  {copy.originalTitle}：{source.originalTitle}
                </span>
                <span className={styles.sourceMeta}>
                  {source.publisher}
                  {source.publishedAt
                    ? ` · ${formatLocalizedDate(source.publishedAt, "zh-Hans")}`
                    : ""}
                  {` · ${copy.coversClaims(source.claimIds)}`}
                </span>
              </p>
            </li>
          ))}
        </ol>
      </section>

      <Link className={styles.documentBack} href={`/cases/${record.slug}`}>
        ← {copy.back}
      </Link>
    </div>
  )
}
