import { Link } from "@/i18n/navigation"
import { CurrentCasePublicActions } from "@/components/current-case/current-case-public-actions"
import { currentCaseContent } from "@/content/locales/current-cases"
import { formatLocalizedDate } from "@/i18n/format"
import type { Locale } from "@/i18n/routing"
import styles from "@/components/current-case/current-case.module.css"
import {
  type CurrentCasePublicRecord,
} from "@/lib/current-cases/presentation"
import { getEffectiveCurrentCaseFreshnessStatus } from "@/lib/current-cases/validation"

export function CurrentCasePageHeader({
  record,
  locale = "en",
  referenceDate = new Date(),
}: {
  record: CurrentCasePublicRecord
  locale?: Locale
  referenceDate?: string | Date
}) {
  const copy = currentCaseContent(locale).archive
  const effectiveFreshnessStatus =
    getEffectiveCurrentCaseFreshnessStatus(record, referenceDate) ?? "review-due"
  const freshnessLabel =
    effectiveFreshnessStatus === "active"
      ? copy.current
      : effectiveFreshnessStatus === "review-due"
        ? copy.reviewDue
        : effectiveFreshnessStatus === "background"
          ? copy.background
          : copy.archived

  return (
    <header className={styles.pageHeader}>
      <div>
        <p className="eyebrow">
          {copy.eyebrow} · {copy.categories[record.category]}
        </p>
        <h1>{record.title}</h1>
        <p className={styles.pageDek}>{record.dek}</p>
      </div>
      <div className={styles.pageUtilities}>
        <p className={styles.pageMeta}>
          {copy.recordHeader.published} {formatLocalizedDate(record.publishedAt as string, locale)}
          <br />
          {copy.recordHeader.evidenceThrough} {formatLocalizedDate(record.evidenceWindow.end, locale)}
          <br />
          {copy.recordHeader.reviewDue} {formatLocalizedDate(record.reviewDueAt, locale)}
          <br />
          {copy.recordHeader.status} {freshnessLabel}
          <br />
          {copy.recordHeader.version} {record.version} ·{" "}
          <Link href={`/cases/${record.slug}/sources`}>
            {copy.recordHeader.directSources(record.sources.length)}
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
