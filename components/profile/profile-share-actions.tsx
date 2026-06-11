"use client"

import Link from "next/link"
import { useState } from "react"

type Props = {
  payload: string
  headline: string
}

export function ProfileShareActions({ payload, headline }: Props) {
  const [copied, setCopied] = useState(false)

  const shareUrl =
    typeof window !== "undefined"
      ? new URL(`/profile/share/${payload}`, window.location.origin).toString()
      : `/profile/share/${payload}`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      await navigator.clipboard.writeText(headline)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  async function handleShare() {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: "IR Worldview Profile",
          text: headline,
          url: shareUrl,
        })
        return
      } catch {
        // Fall through to copy when share is unavailable or cancelled.
      }
    }

    await handleCopy()
  }

  return (
    <div className="row gap-sm wrap print-hidden">
      <button type="button" className="primary-button" onClick={handleShare}>
        {copied ? "Copied!" : "Share profile"}
      </button>
      <button type="button" className="secondary-button" onClick={handleCopy}>
        {copied ? "Link copied!" : "Copy link"}
      </button>
      <Link href="/compare" className="secondary-button">
        Compare profiles
      </Link>
      <button type="button" className="secondary-button" onClick={() => window.print()}>
        Save as PDF
      </button>
    </div>
  )
}
