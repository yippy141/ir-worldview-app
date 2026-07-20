"use client"

import { useLocale } from "next-intl"
import { useEffect, useState } from "react"
import { Link } from "@/i18n/navigation"
import { currentCaseContent } from "@/content/locales/current-cases"
import { formatLocalizedDate } from "@/i18n/format"
import type { Locale } from "@/i18n/routing"
import {
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
  const locale = useLocale() as Locale
  const copy = currentCaseContent(locale).archive

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
          ? copy.completed(formatLocalizedDate(validResponse.completedAt, locale, "medium"))
          : validDraft
            ? copy.draft
            : record.launchRole === "launch"
              ? copy.current
              : copy.archive
        const action = validResponse ? copy.review : validDraft ? copy.resume : copy.open

        return (
          <li key={record.id} className={styles.archiveRow}>
            <p className={styles.archiveMeta}>
              {copy.categories[record.category]}
              <br />
              {copy.evidenceThrough(formatLocalizedDate(record.evidenceWindow.end, locale))}
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
