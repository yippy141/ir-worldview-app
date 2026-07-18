"use client"

import { useState, useSyncExternalStore } from "react"
import { trackProductEvent } from "@/lib/analytics/adapter"
import { copyText } from "@/lib/clipboard"
import { CURRENT_CASE_CONFIDENCE_LABELS } from "@/lib/current-cases/presentation"
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
  const [readingSelected, setReadingSelected] = useState(false)
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")
  const canNativeShare = useSyncExternalStore(
    subscribeToNothing,
    () => typeof navigator.share === "function",
    () => false,
  )

  function caseUrl() {
    return new URL(`/cases/${record.slug}`, window.location.origin).toString()
  }

  function readingText() {
    return `My reading of “${record.title}”: ${selectedOption.label} Confidence ${response.confidence}/5 (${CURRENT_CASE_CONFIDENCE_LABELS[response.confidence]}).`
  }

  async function copyReading() {
    if (!readingSelected) return
    const copied = await copyText(`${readingText()}\n${caseUrl()}`)
    setError(copied ? "" : "Automatic copy is unavailable. Use your browser’s share controls.")
    setStatus(copied ? "Reading and case link copied." : "")
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
        title: `My reading: ${record.title}`,
        text: readingText(),
        url: caseUrl(),
      })
      setError("")
      setStatus("Reading shared.")
      trackProductEvent("case_shared", { caseId: record.id })
    } catch (shareError) {
      if (shareError instanceof DOMException && shareError.name === "AbortError") return
      await copyReading()
    }
  }

  async function inviteToCase() {
    const invitation = "Make your own judgment on this Current Case, then compare with me directly."
    if (canNativeShare) {
      try {
        await navigator.share({
          title: record.title,
          text: invitation,
          url: caseUrl(),
        })
        setError("")
        setStatus("Case invitation shared.")
        trackProductEvent("case_shared", { caseId: record.id })
        return
      } catch (shareError) {
        if (shareError instanceof DOMException && shareError.name === "AbortError") return
      }
    }

    const copied = await copyText(`${invitation}\n${caseUrl()}`)
    setError(copied ? "" : "Automatic copy is unavailable. Use your browser’s share controls.")
    setStatus(copied ? "Case invitation copied." : "")
    if (copied) trackProductEvent("case_shared", { caseId: record.id })
  }

  return (
    <section className={styles.resultSharing} aria-labelledby="share-reading-heading">
      <h3 id="share-reading-heading">Share your reading</h3>
      <p>
        Nothing about your judgment is shared until you select it below. The ordinary case link
        contains no answer data.
      </p>
      <div className={styles.challengeControl}>
        <button type="button" className={styles.secondaryButton} onClick={inviteToCase}>
          Invite someone to this case
        </button>
      </div>
      <p className={styles.challengeNote}>
        This sends the ordinary case link only. Compare judgments directly after both of you finish;
        the service does not hold either person’s answer for the comparison.
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
          Include my final choice — “{selectedOption.label}” — and confidence of{" "}
          {response.confidence}/5 in sharing controls.
        </span>
      </label>

      {readingSelected ? (
        <div className={styles.personalShareControls}>
          <div className={styles.personalShareButtons}>
            <button type="button" className={styles.primaryButton} onClick={shareReading}>
              Share my reading
            </button>
            <button type="button" className={styles.secondaryButton} onClick={copyReading}>
              Copy my reading
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
