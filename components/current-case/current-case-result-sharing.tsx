"use client"

import { useState, useSyncExternalStore } from "react"
import { useLocale } from "next-intl"
import { currentCaseContent } from "@/content/locales/current-cases"
import { publicPath } from "@/i18n/paths"
import type { Locale } from "@/i18n/routing"
import { trackProductEvent } from "@/lib/analytics/adapter"
import { copyText } from "@/lib/clipboard"
import type {
  CompletedCurrentCaseResponse,
  CurrentCaseOption,
} from "@/lib/current-cases/types"
import styles from "./current-case.module.css"

type CurrentCaseResultSharingProps = {
  record: {
    id: string
    slug: string
    title: string
  }
  response: CompletedCurrentCaseResponse
  selectedOption: CurrentCaseOption
}

const subscribeToNothing = () => () => {}

export function CurrentCaseResultSharing({
  record,
  response,
  selectedOption,
}: CurrentCaseResultSharingProps) {
  const locale = useLocale() as Locale
  const content = currentCaseContent(locale)
  const copy = content.sharing
  const [readingSelected, setReadingSelected] = useState(false)
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")
  const canNativeShare = useSyncExternalStore(
    subscribeToNothing,
    () => typeof navigator.share === "function",
    () => false,
  )

  function caseUrl() {
    return new URL(publicPath(locale, `/cases/${record.slug}`), window.location.origin).toString()
  }

  function readingText() {
    return copy.readingText(
      record.title,
      selectedOption.label,
      response.confidence,
      content.flow.confidenceLabels[response.confidence],
    )
  }

  async function copyReading() {
    if (!readingSelected) return
    const copied = await copyText(`${readingText()}\n${caseUrl()}`)
    setError(copied ? "" : copy.automaticCopyUnavailable)
    setStatus(copied ? copy.readingCopied : "")
    if (copied) trackProductEvent("case_shared", { caseId: record.id })
  }

  async function shareReading() {
    if (!readingSelected) return
    if (!canNativeShare) {
      await copyReading()
      return
    }

    try {
      await navigator.share({
        title: copy.readingTitle(record.title),
        text: readingText(),
        url: caseUrl(),
      })
      setError("")
      setStatus(copy.readingShared)
      trackProductEvent("case_shared", { caseId: record.id })
    } catch (shareError) {
      if (shareError instanceof DOMException && shareError.name === "AbortError") return
      await copyReading()
    }
  }

  async function inviteToCase() {
    const invitation = copy.invitationText
    if (canNativeShare) {
      try {
        await navigator.share({
          title: record.title,
          text: invitation,
          url: caseUrl(),
        })
        setError("")
        setStatus(copy.invitationShared)
        trackProductEvent("case_shared", { caseId: record.id })
        return
      } catch (shareError) {
        if (shareError instanceof DOMException && shareError.name === "AbortError") return
      }
    }

    const copied = await copyText(`${invitation}\n${caseUrl()}`)
    setError(copied ? "" : copy.automaticCopyUnavailable)
    setStatus(copied ? copy.invitationCopied : "")
    if (copied) trackProductEvent("case_shared", { caseId: record.id })
  }

  return (
    <section className={styles.resultSharing} aria-labelledby="share-reading-heading">
      <h3 id="share-reading-heading">{copy.shareReading}</h3>
      <p>{copy.privacyLead}</p>
      <div className={styles.challengeControl}>
        <button type="button" className={styles.secondaryButton} onClick={inviteToCase}>
          {copy.invite}
        </button>
      </div>
      <p className={styles.challengeNote}>
        {copy.invitation}
      </p>
      <label className={styles.readingConsent}>
        <input
          type="checkbox"
          checked={readingSelected}
          onChange={(event) => {
            setReadingSelected(event.currentTarget.checked)
            setStatus("")
            setError("")
          }}
        />
        <span>
          {copy.includeChoice(selectedOption.label, response.confidence)}
        </span>
      </label>

      {readingSelected ? (
        <div className={styles.personalShareControls}>
          <div className={styles.personalShareButtons}>
            <button type="button" className={styles.primaryButton} onClick={shareReading}>
              {copy.shareMyReading}
            </button>
            <button type="button" className={styles.secondaryButton} onClick={copyReading}>
              {copy.copyMyReading}
            </button>
          </div>
        </div>
      ) : null}

      <p className={styles.shareStatus} role="status" aria-live="polite">
        {status}
      </p>
      {error ? (
        <p className={styles.shareError} role="alert">
          {error}
        </p>
      ) : null}
    </section>
  )
}
