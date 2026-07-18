import type { Metadata } from "next"
import { CurrentCaseArchive } from "@/components/current-case/current-case-archive"
import { chineseShellContent } from "@/content/locales"
import { createLocalizedMetadata } from "@/i18n/metadata"
import { getPublishedCurrentCases } from "@/lib/current-cases/catalog"
import { toCurrentCasePublicRecord } from "@/lib/current-cases/presentation"
import styles from "@/components/current-case/current-case.module.css"

export function generateMetadata(): Metadata {
  return createLocalizedMetadata("zh-Hans", "/cases", chineseShellContent.cases.metadata)
}

export default function ChineseCurrentCasesPage() {
  const cases = getPublishedCurrentCases()
  const content = chineseShellContent.cases

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

      <aside className="translation-scope-note" aria-label="中文内容范围">
        {content.englishContentNotice}
      </aside>

      {cases.length === 0 ? (
        <section className={styles.correctionStatus} aria-labelledby="case-status-heading">
          <h2 id="case-status-heading">{content.emptyTitle}</h2>
          <p>{content.emptyBody}</p>
        </section>
      ) : (
        <CurrentCaseArchive records={cases.map(toCurrentCasePublicRecord)} />
      )}
    </div>
  )
}
