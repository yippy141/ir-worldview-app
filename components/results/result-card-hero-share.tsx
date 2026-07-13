"use client"

import { useState, useSyncExternalStore } from "react"
import { copyText } from "@/lib/clipboard"

type Props = {
  shareUrl: string
  title: string
  text: string
}

export function ResultCardHeroShare({ shareUrl, title, text }: Props) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle")
  const canNativeShare = useSyncExternalStore(
    () => () => {},
    () => typeof navigator.share === "function",
    () => false,
  )

  function resolveUrl(): string {
    if (typeof window === "undefined") return shareUrl
    if (/^https?:\/\//i.test(shareUrl)) return shareUrl
    return new URL(shareUrl, window.location.origin).toString()
  }

  async function copyLink() {
    const url = resolveUrl()
    const copied = (await copyText(url)) || (await copyText(text))
    if (!copied) {
      setCopyState("error")
      return
    }
    setCopyState("copied")
    setTimeout(() => setCopyState("idle"), 2500)
  }

  async function handleClick() {
    if (canNativeShare) {
      try {
        await navigator.share({ title, text, url: resolveUrl() })
        return
      } catch {
        // fall through to copy
      }
    }
    await copyLink()
  }

  const label = copyState === "copied"
    ? "Link copied"
    : copyState === "error"
      ? "Copy unavailable"
      : canNativeShare
        ? "Share result"
        : "Copy share link"

  return (
    <div className="share-copy-control print-hidden">
      <button
        type="button"
        className="result-card-hero__share"
        onClick={handleClick}
        aria-live="polite"
      >
        {label}
      </button>
      {copyState === "error" ? (
        <label className="share-copy-fallback">
          Share link
          <input
            type="text"
            readOnly
            value={resolveUrl()}
            onFocus={(event) => event.currentTarget.select()}
          />
        </label>
      ) : null}
    </div>
  )
}
