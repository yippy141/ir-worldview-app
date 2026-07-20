import type { Metadata } from "next"
import { Suspense } from "react"
import { FieldExplorer } from "@/components/field/field-explorer"
import { zhHansRouteMetadata } from "@/content/locales/zh-Hans/metadata"
import { zhHansWorldviewMapUi as copy } from "@/content/locales/zh-Hans/worldview-map"
import { Link } from "@/i18n/navigation"
import { createDynamicLocalizedMetadata } from "@/i18n/metadata"
import styles from "@/app/explore/atlas/page.module.css"

export const metadata: Metadata = createDynamicLocalizedMetadata(
  "zh-Hans",
  "/explore/atlas",
  zhHansRouteMetadata.worldviewMap,
)

export default function ChineseFieldExplorerPage() {
  return (
    <div className={`wide-container ${styles.page}`}>
      <header className={styles.header}>
        <div className={styles.headerCopy}>
          <h1>{copy.page.title}</h1>
          <p>{copy.page.intro}</p>
        </div>
        <Link href="/method" className={styles.methodLink}>{copy.page.methodLink} →</Link>
      </header>

      <Suspense fallback={<div className={styles.loading}>{copy.page.loading}</div>}>
        <FieldExplorer />
      </Suspense>

      <section className={styles.trustNote} aria-labelledby="worldview-map-method-note">
        <h2 id="worldview-map-method-note">{copy.page.trustHeading}</h2>
        <p>
          {copy.page.trustNote}{" "}
          <Link href="/method">{copy.page.trustLink}。</Link>
        </p>
      </section>

      <section className={styles.actions} aria-labelledby="worldview-map-continue">
        <h2 id="worldview-map-continue">{copy.page.continueHeading}</h2>
        <div className={styles.actionLinks}>
          <Link href="/quiz">{copy.page.actions.foundation} →</Link>
          <Link href="/perspectives">{copy.page.actions.perspective} →</Link>
          <Link href="/explore/reference">{copy.page.actions.publicPositions} →</Link>
          <Link href="/profile">{copy.page.actions.profile} →</Link>
        </div>
      </section>
    </div>
  )
}
