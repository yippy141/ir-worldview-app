import Link from "next/link"
import { CurrentCasePublicActions } from "@/components/current-case/current-case-public-actions"
import styles from "@/components/current-case/current-case.module.css"
import {
  CURRENT_CASE_CATEGORY_LABELS,
  formatCurrentCaseDate,
  type CurrentCasePublicRecord,
} from "@/lib/current-cases/presentation"

export function CurrentCasePageHeader({ record }: { record: CurrentCasePublicRecord }) {
  return (
    <header className={styles.pageHeader}>
      <div>
        <p className="eyebrow">
          Current Case · {CURRENT_CASE_CATEGORY_LABELS[record.category]}
        </p>
        <h1>{record.title}</h1>
        <p className={styles.pageDek}>{record.dek}</p>
      </div>
      <div className={styles.pageUtilities}>
        <p className={styles.pageMeta}>
          Published {formatCurrentCaseDate(record.publishedAt as string)}
          <br />
          Evidence through {formatCurrentCaseDate(record.evidenceWindow.end)}
          <br />
          Version {record.version} ·{" "}
          <Link href={`/cases/${record.slug}/sources`}>
            {record.sources.length} direct sources
          </Link>
        </p>
        <CurrentCasePublicActions
          caseId={record.id}
          title={record.title}
          dek={record.dek}
          slug={record.slug}
        />
      </div>
    </header>
  )
}
