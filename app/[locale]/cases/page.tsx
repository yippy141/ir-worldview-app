import type { Metadata } from "next"
import { CurrentCaseArchive } from "@/components/current-case/current-case-archive"
import { zhHansCurrentCaseArchive } from "@/content/locales/zh-Hans/current-cases/archive"
import { zhHansCurrentCases } from "@/content/locales/zh-Hans/current-cases/index"
import { zhHansRouteMetadata } from "@/content/locales/zh-Hans/metadata"
import { createLocalizedMetadata } from "@/i18n/metadata"
import { toZhHansCurrentCasePublicRecord } from "@/lib/current-cases/zh-hans"
import styles from "@/components/current-case/current-case.module.css"

export function generateMetadata(): Metadata {
  return createLocalizedMetadata("zh-Hans", "/cases", zhHansRouteMetadata.cases)
}

export default function ChineseCurrentCasesPage() {
  const cases = zhHansCurrentCases.filter((record) => record.publicationStatus === "published")
  const content = zhHansCurrentCaseArchive

  return (
    <div className={`${styles.page} locale-cases-page`}>
      <header className={styles.pageHeader}>
        <div>
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p className={styles.archiveIntro}>{content.intro}</p>
        </div>
        <p className={styles.pageMeta}>{content.privacyNote}</p>
      </header>

      {cases.length === 0 ? (
        <section className={styles.correctionStatus} aria-labelledby="case-status-heading">
          <h2 id="case-status-heading">{content.emptyTitle}</h2>
          <p>{content.emptyBody}</p>
        </section>
      ) : (
        <CurrentCaseArchive records={cases.map(toZhHansCurrentCasePublicRecord)} />
      )}
    </div>
  )
}
