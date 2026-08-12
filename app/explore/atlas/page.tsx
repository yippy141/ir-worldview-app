import Link from "next/link"
import { Suspense } from "react"
import { FieldExplorer } from "@/components/field/field-explorer"
import { WORLDVIEW_MAP_LABEL } from "@/lib/field/layers"
import type { Metadata } from "next"
import styles from "./page.module.css"

export const metadata: Metadata = {
  title: `${WORLDVIEW_MAP_LABEL} — IR Worldview Inventory`,
  description:
    "Compare your baseline, editorial Decision Patterns, perspective shifts, and evidence-coded public positions on one shared projection.",
}

export default function FieldExplorerPage() {
  return (
    <div className={`wide-container ${styles.page}`}>
      <header className={styles.header}>
        <div className={styles.headerCopy}>
          <h1>{WORLDVIEW_MAP_LABEL}</h1>
          <p>
            Locate your baseline, compare editorial Decision Patterns, and examine how context or
            public positions shift the same underlying judgments.
          </p>
        </div>
        <Link href="/method" className={styles.methodLink}>How the map works →</Link>
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
          Decision Patterns are authored reading aids, not results assigned to a user or population
          types. Public positions are evidence-coded snapshots, and some traditions remain
          under-modeled. Coordinates use the same Foundation projection throughout; spacing is not
          a calibrated measure of difference.{" "}
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
