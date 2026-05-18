"use client"

import { useState, useSyncExternalStore } from "react"
import { useRouter } from "next/navigation"
import { AI_GOVERNANCE_STORAGE_KEY } from "@/lib/ai-governance-schema"

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
  const [copied, setCopied] = useState(false)
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
    const shareUrl = getShareUrl()
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      await navigator.clipboard.writeText(resultLabel)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
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
    <div className="row gap-sm print-hidden" style={{ flexWrap: "wrap" }}>
      <button type="button" className="primary-button" onClick={handleShare}>
        {canNativeShare ? "Share result" : copied ? "Copied!" : "Copy share link"}
      </button>
      <button type="button" className="secondary-button" onClick={handleCopy}>
        {copied ? "Link copied!" : "Copy link"}
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
    </div>
  )
}
