"use client"

import { useState, useSyncExternalStore } from "react"
import { useRouter } from "next/navigation"
import { AI_GOVERNANCE_STORAGE_KEY } from "@/lib/ai-governance-schema"
import { copyText } from "@/lib/clipboard"

type Props = {
  payload: string
  archetypeLabel: string
  riskLens: string
  paceModifier: string
  geopoliticsModifier: string
}

export function AiGovernanceShareActions({
  payload,
  archetypeLabel,
  riskLens,
  paceModifier,
  geopoliticsModifier,
}: Props) {
  const router = useRouter()
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle")
  const canNativeShare = useSyncExternalStore(
    () => () => {},
    () => typeof navigator.share === "function",
    () => false,
  )

  const resultLabel = `${archetypeLabel} · ${riskLens} · ${paceModifier} · ${geopoliticsModifier}`

  function getShareUrl(): string {
    return new URL(`/ai/results/${payload}`, window.location.origin).toString()
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
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: `AI Governance Compass: ${archetypeLabel}`,
          text: `My AI governance profile: ${resultLabel}`,
          url: getShareUrl(),
        })
      } catch {
        await handleCopy()
      }
    } else {
      await handleCopy()
    }
  }

  function handleRetake() {
    window.localStorage.removeItem(AI_GOVERNANCE_STORAGE_KEY)
    router.push("/ai/quiz")
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
        Retake the AI questionnaire
      </button>
      {copyState === "error" ? (
        <label className="share-copy-fallback">
          AI Governance share link
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
