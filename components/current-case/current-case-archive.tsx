"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  CURRENT_CASE_CATEGORY_LABELS,
  formatCurrentCaseDate,
  type CurrentCasePublicRecord,
} from "@/lib/current-cases/presentation"
import {
  getCurrentCaseDraft,
  getLatestCurrentCaseResponse,
  isDraftForCurrentCase,
  isResponseForCurrentCase,
  loadCurrentCaseResponseStore,
} from "@/lib/current-cases/response-store"
import type { CurrentCaseResponseStore } from "@/lib/current-cases/types"
import styles from "./current-case.module.css"

export function CurrentCaseArchive({ records }: { records: CurrentCasePublicRecord[] }) {
  const [store, setStore] = useState<CurrentCaseResponseStore | null>(null)

  useEffect(() => {
    const load = () => setStore(loadCurrentCaseResponseStore())
    load()
    window.addEventListener("storage", load)
    return () => window.removeEventListener("storage", load)
  }, [])

  return (
    <ol className={styles.archiveList}>
      {records.map((record) => {
        const response = store ? getLatestCurrentCaseResponse(store, record.id) : null
        const validResponse = response && isResponseForCurrentCase(response, record) ? response : null
        const draft = store ? getCurrentCaseDraft(store, record.id) : null
        const validDraft =
          draft && draft.step !== "brief" && isDraftForCurrentCase(draft, record) ? draft : null
        const status = validResponse
          ? `Completed ${formatCompletionDate(validResponse.completedAt)}`
          : validDraft
            ? "Draft saved on this device"
            : record.launchRole === "launch"
              ? "Current case"
              : "Archive case"
        const action = validResponse ? "Review judgment" : validDraft ? "Resume case" : "Open case"

        return (
          <li key={record.id} className={styles.archiveRow}>
            <p className={styles.archiveMeta}>
              {CURRENT_CASE_CATEGORY_LABELS[record.category]}
              <br />
              Evidence through {formatCurrentCaseDate(record.evidenceWindow.end)}
            </p>
            <div className={styles.archiveMain}>
              <h2>
                <Link href={`/cases/${record.slug}`}>{record.title}</Link>
              </h2>
              <p>{record.dek}</p>
            </div>
            <p className={styles.archiveStatus}>
              {status}
              <br />
              <Link href={`/cases/${record.slug}`}>{action} →</Link>
            </p>
          </li>
        )
      })}
    </ol>
  )
}

function formatCompletionDate(timestamp: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(timestamp))
}
