"use client"

import Link from "next/link"
import { useState } from "react"
import { copyText } from "@/lib/clipboard"

type Props = {
  payload: string
  headline: string
}

export function ProfileShareActions({ payload, headline }: Props) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle")

  const shareUrl =
    typeof window !== "undefined"
      ? new URL(`/profile/share/${payload}`, window.location.origin).toString()
      : `/profile/share/${payload}`

  async function handleCopy() {
    const copied = (await copyText(shareUrl)) || (await copyText(headline))
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
        {copyState === "copied" ? "Copied!" : "Share profile"}
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
      <Link href="/compare" className="secondary-button">
        Compare profiles
      </Link>
      <button type="button" className="secondary-button" onClick={() => window.print()}>
        Save as PDF
      </button>
      {copyState === "error" ? (
        <label className="share-copy-fallback">
          Profile share link
          <input
            type="text"
            readOnly
            value={shareUrl}
            onFocus={(event) => event.currentTarget.select()}
          />
        </label>
      ) : null}
    </div>
  )
}
