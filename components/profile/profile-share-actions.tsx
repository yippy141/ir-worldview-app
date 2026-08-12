"use client"

import Link from "next/link"
import { useState } from "react"
import { publicPath } from "@/i18n/paths"
import type { Locale } from "@/i18n/routing"
import { copyText } from "@/lib/clipboard"

type Props = {
  payload: string
  headline: string
  locale?: Locale
}

const profileShareCopy = {
  en: {
    copied: "Copied!",
    share: "Share profile",
    linkCopied: "Link copied!",
    copyUnavailable: "Copy unavailable",
    copyLink: "Copy link",
    compare: "Compare profiles",
    savePdf: "Save as PDF",
    fallback: "Profile share link",
    title: "IR Worldview Profile",
  },
  "zh-Hans": {
    copied: "已复制",
    share: "分享画像",
    linkCopied: "链接已复制",
    copyUnavailable: "无法自动复制",
    copyLink: "复制链接",
    compare: "比较画像（英文）",
    savePdf: "打印或存为 PDF",
    fallback: "画像分享链接",
    title: "国际关系世界观画像",
  },
} as const

export function ProfileShareActions({
  payload,
  headline,
  locale = "en",
}: Props) {
  const copy = profileShareCopy[locale]
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle")
  const sharePath = publicPath(locale, `/profile/share/${payload}`)

  const shareUrl =
    typeof window !== "undefined"
      ? new URL(sharePath, window.location.origin).toString()
      : sharePath

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
          title: copy.title,
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
        {copyState === "copied" ? copy.copied : copy.share}
      </button>
      <button
        type="button"
        className="secondary-button"
        onClick={handleCopy}
        aria-live="polite"
      >
        {copyState === "copied"
          ? copy.linkCopied
          : copyState === "error"
            ? copy.copyUnavailable
            : copy.copyLink}
      </button>
      <Link href="/compare" className="secondary-button">
        {copy.compare}
      </Link>
      <button type="button" className="secondary-button" onClick={() => window.print()}>
        {copy.savePdf}
      </button>
      {copyState === "error" ? (
        <label className="share-copy-fallback">
          {copy.fallback}
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
