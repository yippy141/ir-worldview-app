"use client"

import { useLocale, useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { Link } from "@/i18n/navigation"
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
import type {
  CurrentCaseCategory,
  CurrentCaseResponseStore,
} from "@/lib/current-cases/types"
import styles from "./current-case.module.css"

const CATEGORY_MESSAGE_KEYS = {
  security: "security",
  "economic-statecraft": "economicStatecraft",
  "institutions-and-governance": "institutionsAndGovernance",
} as const satisfies Record<CurrentCaseCategory, string>

export function CurrentCaseArchive({ records }: { records: CurrentCasePublicRecord[] }) {
  const [store, setStore] = useState<CurrentCaseResponseStore | null>(null)
  const locale = useLocale()
  const t = useTranslations("casesArchive")

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
          ? t("completed", { date: formatCompletionDate(validResponse.completedAt, locale) })
          : validDraft
            ? t("draft")
            : record.launchRole === "launch"
              ? t("current")
              : t("archive")
        const action = validResponse ? t("review") : validDraft ? t("resume") : t("open")

        return (
          <li key={record.id} className={styles.archiveRow}>
            <p className={styles.archiveMeta}>
              {t(CATEGORY_MESSAGE_KEYS[record.category])}
              <br />
              {t("evidenceThrough", {
                date: formatEvidenceDate(record.evidenceWindow.end, locale),
              })}
              {locale === "zh-Hans" ? (
                <>
                  <br />
                  {t("englishRecord")}
                </>
              ) : null}
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

function formatCompletionDate(timestamp: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(timestamp))
}

function formatEvidenceDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`))
}
