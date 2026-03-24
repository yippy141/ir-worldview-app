"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { QUIZ_STORAGE_KEY } from "@/components/quiz-app"

type Props = {
  payload: string
  familyLabel: string
  strategyModifier: string
  normativeModifier: string
}

export function ShareActions({ payload, familyLabel, strategyModifier, normativeModifier }: Props) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/results/${payload}`
      : `/results/${payload}`

  const resultLabel = `${familyLabel} · ${strategyModifier} · ${normativeModifier}`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback: copy the label text
      await navigator.clipboard.writeText(resultLabel)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  async function handleShare() {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: `IR Worldview: ${familyLabel}`,
          text: `My IR worldview result: ${resultLabel}`,
          url: shareUrl,
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
    router.push("/quiz")
  }

  return (
    <div className="row gap-sm" style={{ flexWrap: "wrap" }}>
      <button type="button" className="primary-button" onClick={handleShare}>
        {typeof navigator !== "undefined" && typeof navigator.share === "function"
          ? "Share result"
          : copied
            ? "Copied!"
            : "Copy share link"}
      </button>
      <button type="button" className="secondary-button" onClick={handleCopy}>
        {copied ? "Link copied!" : "Copy link"}
      </button>
      <button type="button" className="secondary-button" onClick={handleRetake}>
        Retake the quiz
      </button>
    </div>
  )
}
