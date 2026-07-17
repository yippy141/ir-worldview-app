"use client"

import { useState, useSyncExternalStore } from "react"
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

type ChallengeCreationResponse =
  | { ok: true; token: string; expiresAt: number }
  | { ok: false; error: string }

const subscribeToNothing = () => () => {}

export function CurrentCaseResultSharing({
  record,
  response,
  selectedOption,
}: CurrentCaseResultSharingProps) {
  const [readingSelected, setReadingSelected] = useState(false)
  const [challengeUrl, setChallengeUrl] = useState("")
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")
  const [creatingChallenge, setCreatingChallenge] = useState(false)
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
    } catch (shareError) {
      if (shareError instanceof DOMException && shareError.name === "AbortError") return
      await copyReading()
    }
  }

  async function createChallenge() {
    if (!readingSelected || creatingChallenge) return
    setCreatingChallenge(true)
    setError("")
    setStatus("")

    try {
      let nextChallengeUrl = challengeUrl
      if (!nextChallengeUrl) {
        const responseFromServer = await fetch("/api/current-cases/challenge", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            caseId: record.id,
            optionId: response.selectedOptionId,
            confidence: response.confidence,
          }),
        })
        const body = (await responseFromServer.json()) as ChallengeCreationResponse
        if (!responseFromServer.ok || !body.ok) {
          throw new Error(body.ok ? "Challenge link could not be created." : body.error)
        }
        const challengeLocation = new URL(
          `/cases/${record.slug}/challenge`,
          window.location.origin,
        )
        challengeLocation.hash = body.token
        nextChallengeUrl = challengeLocation.toString()
        setChallengeUrl(nextChallengeUrl)
      }

      if (canNativeShare) {
        try {
          await navigator.share({
            title: `Challenge: ${record.title}`,
            text: "Make your own judgment before seeing mine.",
            url: nextChallengeUrl,
          })
          setStatus("Challenge shared.")
          return
        } catch (shareError) {
          if (shareError instanceof DOMException && shareError.name === "AbortError") return
        }
      }

      const copied = await copyText(nextChallengeUrl)
      if (!copied) throw new Error("Automatic copy is unavailable. Select the challenge link below.")
      setStatus("Challenge link copied.")
    } catch (challengeError) {
      setError(
        challengeError instanceof Error
          ? challengeError.message
          : "Challenge link could not be created.",
      )
    } finally {
      setCreatingChallenge(false)
    }
  }

  async function copyChallenge() {
    const copied = await copyText(challengeUrl)
    setError(copied ? "" : "Automatic copy is unavailable. Select the challenge link below.")
    setStatus(copied ? "Challenge link copied." : "")
  }

  return (
    <section className={styles.resultSharing} aria-labelledby="share-reading-heading">
      <h3 id="share-reading-heading">Share your reading</h3>
      <p>
        Nothing about your judgment is shared until you select it below. The ordinary case link
        contains no answer data.
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
          <div className={styles.challengeControl}>
            <button
              type="button"
              className={styles.secondaryButton}
              disabled={creatingChallenge}
              onClick={createChallenge}
            >
              {creatingChallenge ? "Creating challenge…" : "Challenge a friend"}
            </button>
            {challengeUrl ? (
              <button type="button" className={styles.textButton} onClick={copyChallenge}>
                Copy challenge link
              </button>
            ) : null}
          </div>
          <p className={styles.challengeNote}>
            A challenge encrypts only this case ID, final choice, confidence, issued-at and expiry
            times, and a random nonce. It expires after 30 days and cannot be revoked because no
            challenge record is stored.
          </p>
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
      {challengeUrl && error ? (
        <label className={styles.copyFallback}>
          Challenge link
          <input
            type="text"
            readOnly
            value={challengeUrl}
            onFocus={(event) => event.currentTarget.select()}
          />
        </label>
      ) : null}
    </section>
  )
}
