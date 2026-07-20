"use client"

import { useState, useSyncExternalStore } from "react"
import { useLocale } from "next-intl"
import { currentCaseContent } from "@/content/locales/current-cases"
import { publicPath } from "@/i18n/paths"
import type { Locale } from "@/i18n/routing"
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
  const locale = useLocale() as Locale
  const copy = currentCaseContent(locale).sharing
  const [status, setStatus] = useState("")
  const [copyFailed, setCopyFailed] = useState(false)
  const canNativeShare = useSyncExternalStore(
    subscribeToNothing,
    () => typeof navigator.share === "function",
    () => false,
  )

  function caseUrl() {
    return new URL(publicPath(locale, `/cases/${slug}`), window.location.origin).toString()
  }

  async function copyCaseLink() {
    const copied = await copyText(caseUrl())
    setCopyFailed(!copied)
    setStatus(copied ? copy.caseLinkCopied : copy.automaticCopyUnavailable)
    if (copied) trackProductEvent("case_shared", { caseId })
  }

  async function shareCase() {
    if (!canNativeShare) {
      await copyCaseLink()
      return
    }

    try {
      await navigator.share({ title, text: dek, url: caseUrl() })
      setStatus(copy.caseShared)
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
          {copy.shareCase}
        </button>
        <button type="button" className={styles.utilityButton} onClick={copyCaseLink}>
          {copy.copyLink}
        </button>
        <button
          type="button"
          className={styles.utilityButton}
          onClick={() => window.print()}
        >
          {copy.printOrSavePdf}
        </button>
      </div>
      <p className={styles.shareStatus} role="status" aria-live="polite">
        {status}
      </p>
      {copyFailed ? (
        <label className={styles.copyFallback}>
          {copy.caseLink}
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
