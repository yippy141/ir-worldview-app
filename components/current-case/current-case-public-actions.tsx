"use client"

import { useState, useSyncExternalStore } from "react"
import { trackProductEvent } from "@/lib/analytics/adapter"
import { copyText } from "@/lib/clipboard"
import styles from "./current-case.module.css"

type CurrentCasePublicActionsProps = {
  caseId: string
  title: string
  dek: string
  slug: string
}

const subscribeToNothing = () => () => {}

export function CurrentCasePublicActions({
  caseId,
  title,
  dek,
  slug,
}: CurrentCasePublicActionsProps) {
  const [status, setStatus] = useState("")
  const [copyFailed, setCopyFailed] = useState(false)
  const canNativeShare = useSyncExternalStore(
    subscribeToNothing,
    () => typeof navigator.share === "function",
    () => false,
  )

  function caseUrl() {
    return new URL(`/cases/${slug}`, window.location.origin).toString()
  }

  async function copyCaseLink() {
    const copied = await copyText(caseUrl())
    setCopyFailed(!copied)
    setStatus(copied ? "Case link copied." : "Automatic copy is unavailable. Select the link below.")
    if (copied) trackProductEvent("case_shared", { caseId })
  }

  async function shareCase() {
    if (!canNativeShare) {
      await copyCaseLink()
      return
    }

    try {
      await navigator.share({ title, text: dek, url: caseUrl() })
      setStatus("Case shared.")
      trackProductEvent("case_shared", { caseId })
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return
      await copyCaseLink()
    }
  }

  return (
    <div className={`${styles.publicActions} print-hidden`}>
      <div className={styles.publicActionButtons}>
        <button type="button" className={styles.utilityButton} onClick={shareCase}>
          Share this case
        </button>
        <button type="button" className={styles.utilityButton} onClick={copyCaseLink}>
          Copy link
        </button>
        <button
          type="button"
          className={styles.utilityButton}
          onClick={() => window.print()}
        >
          Print / save PDF
        </button>
      </div>
      <p className={styles.shareStatus} role="status" aria-live="polite">
        {status}
      </p>
      {copyFailed ? (
        <label className={styles.copyFallback}>
          Case link
          <input
            type="text"
            readOnly
            value={caseUrl()}
            onFocus={(event) => event.currentTarget.select()}
          />
        </label>
      ) : null}
    </div>
  )
}
