import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import styles from "@/components/current-case/current-case.module.css"
import {
  getPublishedCurrentCaseBySlug,
  getPublishedCurrentCases,
} from "@/lib/current-cases/catalog"
import { formatCurrentCaseDate } from "@/lib/current-cases/presentation"

type CurrentCaseCorrectionsPageProps = {
  params: Promise<{ slug: string }>
}

export const metadata: Metadata = {
  title: "Current Case corrections — IR Worldview Inventory",
}

export function generateStaticParams() {
  return getPublishedCurrentCases().map((record) => ({ slug: record.slug }))
}

export default async function CurrentCaseCorrectionsPage({
  params,
}: CurrentCaseCorrectionsPageProps) {
  const { slug } = await params
  const record = getPublishedCurrentCaseBySlug(slug)
  if (!record) notFound()

  return (
    <div className={`${styles.page} ${styles.documentPage}`}>
      <header className={styles.pageHeader}>
        <div>
        <p className="eyebrow">Corrections and updates</p>
          <h1>{record.title}</h1>
          <p className={styles.pageDek}>
            This page records the public version and any reviewed correction or evidence update.
          </p>
        </div>
        <p className={styles.pageMeta}>
          Version {record.version}
          <br />
          Last editorial update {formatCurrentCaseDate(record.updatedAt)}
          <br />
          Evidence through {formatCurrentCaseDate(record.evidenceWindow.end)}
        </p>
      </header>

      <section className={styles.correctionStatus}>
        <h2>Record status</h2>
        <p>
          No public correction is recorded for this version. A later change that could affect the
          judgment or readings will receive a new record version.
        </p>
      </section>

      <p className={styles.pageDek}>
        To flag a factual problem, use the <Link href="/feedback">feedback form</Link>. Include the
        case title, claim, and supporting source.
      </p>
      <Link className={styles.documentBack} href={`/cases/${record.slug}`}>
        ← Return to the case
      </Link>
    </div>
  )
}
