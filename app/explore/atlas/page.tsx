import Link from "next/link"
import { Suspense } from "react"
import { FieldExplorer } from "@/components/field/field-explorer"
import { WORLDVIEW_MAP_LABEL } from "@/lib/field/layers"
import type { Metadata } from "next"
import styles from "./page.module.css"

export const metadata: Metadata = {
  title: `${WORLDVIEW_MAP_LABEL} — IR Worldview Inventory`,
  description:
    "Locate a Foundation result in the eight-archetype matrix, then compare optional contextual positions in the continuous view.",
}

export default function FieldExplorerPage() {
  return (
    <div className={`wide-container ${styles.page}`}>
      <header className={styles.header}>
        <div className={styles.headerCopy}>
          <h1 id="worldview-map-page-heading" tabIndex={-1}>{WORLDVIEW_MAP_LABEL}</h1>
          <p>
            Four lenses, two strategic postures, and the eight Foundation archetypes they form. A
            saved result marks one cell—or two cells when the reading is blended.
          </p>
        </div>
        <Link href="/method" className={styles.methodLink}>Methods and limits →</Link>
      </header>

      <Suspense
        fallback={
          <div className={styles.loading}>Loading the worldview map…</div>
        }
      >
        <FieldExplorer />
      </Suspense>

      <section className={styles.trustNote} aria-labelledby="worldview-map-method-note">
        <h2 id="worldview-map-method-note">What this map can show</h2>
        <p>
          The matrix explains the categorical Foundation reading. The continuous view compares
          positions derived from the seven Foundation dimensions, but it does not encode applying
          advantage or restraint. Decision Patterns are reading aids, not assigned results. Public
          positions are dated evidence snapshots, and spacing is not a calibrated measure of
          difference.{" "}
          <Link href="/method">Read the methods and limits.</Link>
        </p>
      </section>

      <section className={styles.actions} aria-labelledby="worldview-map-continue">
        <h2 id="worldview-map-continue">Compare another pattern or posture</h2>
        <div className={styles.actionLinks}>
          <Link href="/quiz">Take the Foundation →</Link>
          <Link href="/perspectives">Try another vantage point →</Link>
          <Link href="/explore/reference">Browse thinkers &amp; public positions →</Link>
          <Link href="/profile">View profile →</Link>
        </div>
      </section>
    </div>
  )
}
