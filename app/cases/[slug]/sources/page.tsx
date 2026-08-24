import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import styles from "@/components/current-case/current-case.module.css"
import {
  getPublishedCurrentCaseBySlug,
  getPublishedCurrentCases,
  getSourcesForCurrentCaseClaim,
} from "@/lib/current-cases/catalog"
import {
  CURRENT_CASE_SOURCE_KIND_LABELS,
  formatCurrentCaseDate,
} from "@/lib/current-cases/presentation"

type CurrentCaseSourcesPageProps = {
  params: Promise<{ slug: string }>
}

export const metadata: Metadata = {
  title: "Current Case sources | IR Worldview Inventory",
}

export function generateStaticParams() {
  return getPublishedCurrentCases().map((record) => ({ slug: record.slug }))
}

export default async function CurrentCaseSourcesPage({ params }: CurrentCaseSourcesPageProps) {
  const { slug } = await params
  const record = getPublishedCurrentCaseBySlug(slug)
  if (!record) notFound()

  return (
    <div className={`${styles.page} ${styles.documentPage}`}>
      <header className={styles.pageHeader}>
        <div>
        <p className="eyebrow">Sources and claim coverage</p>
          <h1>{record.title}</h1>
          <p className={styles.pageDek}>
            Every factual claim below resolves to at least one recorded source. Links open the
            original publisher page.
          </p>
        </div>
        <p className={styles.pageMeta}>
          Evidence window
          <br />
          {formatCurrentCaseDate(record.evidenceWindow.start)} to{" "}
          {formatCurrentCaseDate(record.evidenceWindow.end)}
          <br />
          {record.factualClaims.length} claims · {record.sources.length} sources
        </p>
      </header>

      <ol className={styles.claimList} aria-label="Factual claims and sources">
        {record.factualClaims.map((claim) => (
          <li key={claim.id} id={`claim-${claim.id}`} className={styles.claimRow}>
            <h2>Claim {claim.id.slice(1)}</h2>
            <p>{claim.text}</p>
            <ul className={styles.claimSources}>
              {getSourcesForCurrentCaseClaim(record, claim.id).map((source) => (
                <li key={source.id}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer">
                    {source.title}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>{" "}
                  — {source.publisher}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <section aria-labelledby="source-ledger-heading">
        <h2 id="source-ledger-heading">Source ledger</h2>
        <ol className={styles.sourceList}>
          {record.sources.map((source) => (
            <li key={source.id} className={styles.sourceRow}>
              <h2>{source.id} · {CURRENT_CASE_SOURCE_KIND_LABELS[source.kind]}</h2>
              <p>
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  {source.title}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                <span className={styles.sourceMeta}>
                  {source.publisher}
                  {source.publishedAt ? ` · ${formatCurrentCaseDate(source.publishedAt)}` : ""}
                  {` · Covers ${source.claimIds.map((id) => `claim ${id.slice(1)}`).join(", ")}`}
                </span>
              </p>
            </li>
          ))}
        </ol>
      </section>

      <Link className={styles.documentBack} href={`/cases/${record.slug}`}>
        ← Return to the case
      </Link>
    </div>
  )
}
