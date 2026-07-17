"use client"

import Link from "next/link"
import { getPublishedCurrentCases } from "@/lib/current-cases/catalog"
import {
  describeCurrentCaseMovement,
  toCurrentCasePublicRecord,
} from "@/lib/current-cases/presentation"
import {
  getCurrentCaseDraft,
  isDraftForCurrentCase,
  isResponseForCurrentCase,
} from "@/lib/current-cases/response-store"
import type { CurrentCaseResponseStore } from "@/lib/current-cases/types"
import styles from "@/components/current-case/current-case.module.css"

export function CurrentJudgmentsSection({ store }: { store: CurrentCaseResponseStore }) {
  const records = getPublishedCurrentCases().map(toCurrentCasePublicRecord)
  const judgments = records
    .flatMap((record) =>
      (store.responses[record.id] ?? [])
        .filter((response) => isResponseForCurrentCase(response, record))
        .map((response) => ({ record, response })),
    )
    .sort((left, right) => right.response.completedAt.localeCompare(left.response.completedAt))
  const drafts = records.flatMap((record) => {
    const draft = getCurrentCaseDraft(store, record.id)
    return draft && draft.step !== "brief" && isDraftForCurrentCase(draft, record)
      ? [{ record, draft }]
      : []
  })

  return (
    <section className={styles.profileSection} aria-labelledby="current-judgments-heading">
      <div className={styles.profileSectionHeader}>
        <div>
          <p className="eyebrow">Current judgments</p>
          <h2 id="current-judgments-heading">How your calls moved in live cases</h2>
        </div>
        <Link href="/cases">Browse Current Cases</Link>
      </div>
      <p className={styles.profileSectionIntro}>
        These choices stay separate from Foundation scoring. They show how your judgment changed
        after competing readings and one assumption challenge.
      </p>

      {judgments.length === 0 && drafts.length === 0 ? (
        <p className={styles.profileEmpty}>
          No Current Case judgment is saved in this browser yet. Open a case to make a first call
          and test it against the evidence.
        </p>
      ) : (
        <ul className={styles.judgmentList}>
          {drafts.map(({ record, draft }) => (
            <li key={`draft-${record.id}`} className={styles.judgmentRow}>
              <div>
                <p className={styles.judgmentMeta}>Draft · {stepLabel(draft.step)}</p>
                <h3>{record.title}</h3>
                <p>Progress is saved on this device.</p>
              </div>
              <Link href={`/cases/${record.slug}`}>Resume →</Link>
            </li>
          ))}
          {judgments.map(({ record, response }) => (
            <li key={`${response.caseId}-${response.caseVersion}`} className={styles.judgmentRow}>
              <div>
                <p className={styles.judgmentMeta}>
                  Completed {formatCompletionDate(response.completedAt)} · case v{response.caseVersion}
                </p>
                <h3>{record.title}</h3>
                <p>{describeCurrentCaseMovement(record, response)}</p>
              </div>
              <Link href={`/cases/${record.slug}`}>Review →</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function stepLabel(step: string) {
  const labels: Record<string, string> = {
    initial: "First judgment",
    reasoning: "Reasoning",
    readings: "Worldview readings",
    challenge: "Assumption challenge",
    final: "Final judgment",
  }
  return labels[step] ?? "In progress"
}

function formatCompletionDate(timestamp: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(timestamp))
}
