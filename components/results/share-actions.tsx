"use client"

import { useState, useSyncExternalStore } from "react"
import { useRouter } from "next/navigation"
import { copyText } from "@/lib/clipboard"
import { QUIZ_STORAGE_KEY, notifyQuizSessionUpdated } from "@/lib/quiz-session"

type Props = {
  payload: string
  familyLabel: string
  strategyModifier: string
  normativeModifier: string
}

export function ShareActions({ payload, familyLabel, strategyModifier, normativeModifier }: Props) {
  const router = useRouter()
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle")
  const canNativeShare = useSyncExternalStore(
    () => () => {},
    () => typeof navigator.share === "function",
    () => false,
  )

  const resultLabel = `${familyLabel} · ${strategyModifier} · ${normativeModifier}`

  function getShareUrl() {
    return new URL(`/results/${payload}`, window.location.origin).toString()
  }

  async function handleCopy() {
    const copied = (await copyText(getShareUrl())) || (await copyText(resultLabel))
    if (!copied) {
      setCopyState("error")
      return
    }
    setCopyState("copied")
    setTimeout(() => setCopyState("idle"), 2500)
  }

  async function handleShare() {
    if (canNativeShare) {
      try {
        await navigator.share({
          title: `IR Worldview: ${familyLabel}`,
          text: `My IR worldview result: ${resultLabel}`,
          url: getShareUrl(),
        })
      } catch {
        // User cancelled or share failed — fall back to copy.
        await handleCopy()
      }
    } else {
      await handleCopy()
    }
  }

  function handleRetake() {
    window.localStorage.removeItem(QUIZ_STORAGE_KEY)
    notifyQuizSessionUpdated()
    router.push("/quiz")
  }

  return (
    <div className="row gap-sm print-hidden wrap">
      <button type="button" className="primary-button" onClick={handleShare}>
        {copyState === "copied"
          ? "Copied!"
          : canNativeShare
          ? "Share result"
          : "Copy share link"}
      </button>
      <button
        type="button"
        className="secondary-button"
        onClick={handleCopy}
        aria-live="polite"
      >
        {copyState === "copied"
          ? "Link copied!"
          : copyState === "error"
            ? "Copy unavailable"
            : "Copy link"}
      </button>
      <button
        type="button"
        className="secondary-button"
        onClick={() => window.print()}
      >
        Save as PDF
      </button>
      <button type="button" className="secondary-button" onClick={handleRetake}>
        Retake the Foundation questionnaire
      </button>
      {copyState === "error" ? (
        <label className="share-copy-fallback">
          Foundation share link
          <input
            type="text"
            readOnly
            value={getShareUrl()}
            onFocus={(event) => event.currentTarget.select()}
          />
        </label>
      ) : null}
    </div>
  )
}
