import type { Metadata } from "next"
import { CurrentCaseArchive } from "@/components/current-case/current-case-archive"
import { getPublishedCurrentCases } from "@/lib/current-cases/catalog"
import { toCurrentCasePublicRecord } from "@/lib/current-cases/presentation"
import styles from "@/components/current-case/current-case.module.css"

export const metadata: Metadata = {
  title: "Current Cases — IR Worldview Inventory",
  description:
    "Make a judgment on a source-backed international-affairs case, then test it against competing worldview readings.",
}

export default function CurrentCasesPage() {
  const cases = getPublishedCurrentCases()

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
        <p className="eyebrow">Current Case</p>
          <h1>Judgment in the present</h1>
          <p className={styles.archiveIntro}>
            Make a first call on a sourced international-affairs case. Then test the call against
            competing readings and one changed assumption.
          </p>
        </div>
        <p className={styles.pageMeta}>
          Responses and in-progress drafts stay in this browser. Each record shows its evidence
          window, sources, and correction status.
        </p>
      </header>

      {cases.length === 0 ? (
        <section className={styles.correctionStatus} aria-labelledby="case-status-heading">
          <h2 id="case-status-heading">No case is published yet</h2>
          <p>
            The public catalog stays empty until a source-backed record has completed editorial
            review.
          </p>
        </section>
      ) : (
        <CurrentCaseArchive records={cases.map(toCurrentCasePublicRecord)} />
      )}
    </div>
  )
}
