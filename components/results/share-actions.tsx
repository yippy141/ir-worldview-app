"use client"

import { useState, useSyncExternalStore } from "react"
import { useRouter } from "next/navigation"
import { publicPath } from "@/i18n/paths"
import type { Locale } from "@/i18n/routing"
import { copyText } from "@/lib/clipboard"
import { QUIZ_STORAGE_KEY, notifyQuizSessionUpdated } from "@/lib/quiz-session"

type Props = {
  payload: string
  familyLabel: string
  strategyModifier: string
  normativeModifier: string
  displayLabel?: string
  locale?: Locale
}

const shareCopy = {
  en: {
    copied: "Copied!",
    share: "Share result",
    copyShare: "Copy share link",
    linkCopied: "Link copied!",
    copyUnavailable: "Copy unavailable",
    copyLink: "Copy link",
    savePdf: "Save as PDF",
    retake: "Retake the Foundation questionnaire",
    fallback: "Foundation share link",
    title: (family: string) => `IR Worldview: ${family}`,
    text: (result: string) => `My IR worldview result: ${result}`,
  },
  "zh-Hans": {
    copied: "已复制",
    share: "分享结果",
    copyShare: "复制分享链接",
    linkCopied: "链接已复制",
    copyUnavailable: "无法自动复制",
    copyLink: "复制链接",
    savePdf: "打印或存为 PDF",
    retake: "重新完成基础问卷",
    fallback: "基础结果分享链接",
    title: (family: string) => `国际关系世界观画像：${family}`,
    text: (result: string) => `我的国际关系世界观结果：${result}`,
  },
} as const

export function ShareActions({
  payload,
  familyLabel,
  strategyModifier,
  normativeModifier,
  displayLabel,
  locale = "en",
}: Props) {
  const router = useRouter()
  const copy = shareCopy[locale]
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle")
  const canNativeShare = useSyncExternalStore(
    () => () => {},
    () => typeof navigator.share === "function",
    () => false,
  )

  const resultLabel =
    displayLabel ??
    `${familyLabel} · ${strategyModifier} · ${normativeModifier}`

  function getShareUrl() {
    return new URL(publicPath(locale, `/results/${payload}`), window.location.origin).toString()
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
          title: copy.title(displayLabel ?? familyLabel),
          text: copy.text(resultLabel),
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
    router.push(publicPath(locale, "/quiz"))
  }

  return (
    <div className="row gap-sm print-hidden wrap">
      <button
        type="button"
        className="primary-button"
        onClick={handleShare}
        aria-live="polite"
      >
        {copyState === "copied"
          ? copy.copied
          : copyState === "error" && !canNativeShare
            ? copy.copyUnavailable
          : canNativeShare
            ? copy.share
            : copy.copyShare}
      </button>
      {canNativeShare ? (
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
      ) : null}
      <button
        type="button"
        className="secondary-button"
        onClick={() => window.print()}
      >
        {copy.savePdf}
      </button>
      <button type="button" className="secondary-button" onClick={handleRetake}>
        {copy.retake}
      </button>
      {copyState === "error" ? (
        <label className="share-copy-fallback">
          {copy.fallback}
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
