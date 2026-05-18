"use client"

import { useState, useSyncExternalStore } from "react"

type Props = {
  shareUrl: string
  title: string
  text: string
}

export function ResultCardHeroShare({ shareUrl, title, text }: Props) {
  const [copied, setCopied] = useState(false)
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
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      await navigator.clipboard.writeText(text)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
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

  const label = canNativeShare
    ? "Share result"
    : copied
      ? "Link copied"
      : "Copy share link"

  return (
    <button
      type="button"
      className="result-card-hero__share print-hidden"
      onClick={handleClick}
      aria-live="polite"
    >
      {label}
    </button>
  )
}
