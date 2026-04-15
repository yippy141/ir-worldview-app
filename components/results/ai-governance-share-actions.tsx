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

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/ai/results/${payload}`
      : `/ai/results/${payload}`

  const resultLabel = `${archetypeLabel} · ${riskLens} · ${paceModifier} · ${geopoliticsModifier}`

  async function handleCopy() {
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
          url: shareUrl,
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
    router.push("/ai")
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
        Retake the inventory
      </button>
    </div>
  )
}
