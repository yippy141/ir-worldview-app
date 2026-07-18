import Link from "next/link"
import type { CurrentCasePublicRecord } from "@/lib/current-cases/presentation"
import styles from "./current-case.module.css"

export function CurrentCaseChallengeGate({
  record,
}: {
  record: CurrentCasePublicRecord
}) {
  return (
    <section className={styles.recoveryPanel} aria-labelledby="challenge-recovery-heading">
      <p className={`${styles.recoveryEyebrow} eyebrow`}>Current Case invitation</p>
      <h1 id="challenge-recovery-heading">Answer-bearing challenge links have been retired.</h1>
      <p>
        This legacy link may contain an encrypted judgment from another reader. The site does not
        read, validate, or reveal it. You can still complete the same case and compare judgments
        directly.
      </p>
      <div className={styles.recoveryActions}>
        <Link href={`/cases/${record.slug}`} className={styles.primaryLink}>
          Open the ordinary case
        </Link>
        <Link href="/cases" className={styles.secondaryLink}>
          Browse Current Cases
        </Link>
      </div>
    </section>
  )
}
