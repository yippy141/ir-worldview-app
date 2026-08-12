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
import { getEffectiveCurrentCaseFreshnessStatus } from "@/lib/current-cases/validation"
import {
  getCurrentCaseDraft,
  getLatestCurrentCaseResponse,
  isDraftForCurrentCase,
  isResponseForCurrentCase,
  loadCurrentCaseResponseStore,
} from "@/lib/current-cases/response-store"
import type { CurrentCaseResponseStore } from "@/lib/current-cases/types"
import styles from "./current-case.module.css"

export function CurrentCaseArchive({
  records,
  activeCaseId,
  referenceDate,
}: {
  records: CurrentCasePublicRecord[]
  activeCaseId: string | null
  referenceDate: string
}) {
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
        const effectiveFreshnessStatus =
          getEffectiveCurrentCaseFreshnessStatus(record, referenceDate)
        const archiveFreshnessStatus =
          effectiveFreshnessStatus === "active" && record.id === activeCaseId
            ? "active"
            : effectiveFreshnessStatus === "active"
              ? "review-due"
              : effectiveFreshnessStatus ?? "review-due"
        const progressStatus = validResponse
          ? copy.completed(formatLocalizedDate(validResponse.completedAt, locale, "medium"))
          : validDraft
            ? copy.draft
            : null
        const freshnessStatus =
          archiveFreshnessStatus === "active"
            ? copy.current
            : archiveFreshnessStatus === "review-due"
              ? copy.reviewDue
              : archiveFreshnessStatus === "background"
                ? copy.background
                : copy.archived
        const status = progressStatus
          ? `${progressStatus} · ${freshnessStatus}`
          : freshnessStatus
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
