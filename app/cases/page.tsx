import type { Metadata } from "next"
import { CurrentCaseArchive } from "@/components/current-case/current-case-archive"
import { createEnglishApprovedMetadata } from "@/i18n/metadata"
import {
  getActivePublishedLaunchCurrentCase,
  getPublishedCurrentCases,
} from "@/lib/current-cases/catalog"
import { toCurrentCasePublicRecord } from "@/lib/current-cases/presentation"
import styles from "@/components/current-case/current-case.module.css"

export const metadata: Metadata = createEnglishApprovedMetadata("/cases", {
  title: "Current Cases | IR Worldview Inventory",
  description:
    "Make a judgment on a source-backed international-affairs case, then test it against competing worldview readings.",
})

export const revalidate = 3600

export default function CurrentCasesPage() {
  const referenceDate = new Date().toISOString().slice(0, 10)
  const cases = getPublishedCurrentCases()
  const activeCase = getActivePublishedLaunchCurrentCase(cases, {
    referenceDate,
  })

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
        <p className="eyebrow">Current Case</p>
          <h1>{activeCase ? "Assess a current case" : "Recent cases"}</h1>
          <p className={styles.archiveIntro}>
            {activeCase
              ? "Read a sourced international-affairs case and make a first decision. Then compare your reasoning with alternative readings and a changed assumption."
              : "No Current Case is inside its active editorial review window. Recent records remain available below with their evidence dates and status."}
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
        <CurrentCaseArchive
          records={cases.map(toCurrentCasePublicRecord)}
          activeCaseId={activeCase?.id ?? null}
          referenceDate={referenceDate}
        />
      )}
    </div>
  )
}
