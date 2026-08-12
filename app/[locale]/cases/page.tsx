import type { Metadata } from "next"
import { CurrentCaseArchive } from "@/components/current-case/current-case-archive"
import { zhHansCurrentCaseArchive } from "@/content/locales/zh-Hans/current-cases/archive"
import { zhHansRouteMetadata } from "@/content/locales/zh-Hans/metadata"
import { createLocalizedMetadata } from "@/i18n/metadata"
import {
  getActivePublishedLaunchCurrentCase,
  getPublishedCurrentCases,
} from "@/lib/current-cases/catalog"
import {
  localizePublishedCurrentCases,
  toZhHansCurrentCasePublicRecord,
} from "@/lib/current-cases/zh-hans"
import styles from "@/components/current-case/current-case.module.css"

export function generateMetadata(): Metadata {
  return createLocalizedMetadata("zh-Hans", "/cases", zhHansRouteMetadata.cases)
}

export const revalidate = 3600

export default function ChineseCurrentCasesPage() {
  const referenceDate = new Date().toISOString().slice(0, 10)
  const canonicalCases = getPublishedCurrentCases()
  const cases = localizePublishedCurrentCases(canonicalCases)
  const activeCase = getActivePublishedLaunchCurrentCase(canonicalCases, {
    referenceDate,
  })
  const content = zhHansCurrentCaseArchive

  return (
    <div className={`${styles.page} locale-cases-page`}>
      <header className={styles.pageHeader}>
        <div>
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>{activeCase ? content.title : content.recentTitle}</h1>
          <p className={styles.archiveIntro}>
            {activeCase ? content.intro : content.noActiveBody}
          </p>
        </div>
        <p className={styles.pageMeta}>{content.privacyNote}</p>
      </header>

      {cases.length === 0 ? (
        <section className={styles.correctionStatus} aria-labelledby="case-status-heading">
          <h2 id="case-status-heading">{content.emptyTitle}</h2>
          <p>{content.emptyBody}</p>
        </section>
      ) : (
        <CurrentCaseArchive
          records={cases.map(toZhHansCurrentCasePublicRecord)}
          activeCaseId={activeCase?.id ?? null}
          referenceDate={referenceDate}
        />
      )}
    </div>
  )
}
