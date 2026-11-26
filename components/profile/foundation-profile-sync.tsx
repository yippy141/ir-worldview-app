"use client"

import { useEffect, useState } from "react"
import { useLocale } from "next-intl"
import {
  saveFoundationSnapshot,
  type FoundationSnapshot,
} from "@/lib/profile-store"
import { consumeProfileSaveIntent } from "@/lib/profile-save-intent"
import { completionProvenance } from "@/lib/locale-provenance"
import { resolveFoundationPayload } from "@/lib/share"
import type { Locale } from "@/i18n/routing"

export function FoundationProfileSync({
  snapshot,
}: {
  snapshot: Omit<
    FoundationSnapshot,
    | "timestamp"
    | "locale"
    | "localeCopyVersion"
    | "instrumentStructuralVersion"
    | "scoringVersion"
  >
}) {
  const locale = useLocale() as Locale
  const [saveStatus, setSaveStatus] = useState<{ payload: string; saved: boolean } | null>(null)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const intent = consumeProfileSaveIntent("foundation", snapshot.payload, () => {
        setSaveStatus({ payload: snapshot.payload, saved: false })
      })
      if (!intent) return
      const resolved = resolveFoundationPayload(snapshot.payload)
      const payloadProvenance = resolved?.provenance
      const routeProvenance = completionProvenance("foundation", locale)
      const saved = saveFoundationSnapshot({
        ...snapshot,
        ...(intent.mode ? { mode: intent.mode } : {}),
        ...(intent.localEvidenceId
          ? { localEvidenceId: intent.localEvidenceId }
          : {}),
        timestamp: Date.now(),
        instrumentStructuralVersion:
          payloadProvenance?.instrumentStructuralVersion ?? 0,
        scoringVersion: payloadProvenance?.scoringVersion ?? 0,
        locale: payloadProvenance?.completionLocale ?? routeProvenance.locale,
        localeCopyVersion:
          payloadProvenance?.localeCopyVersion ?? routeProvenance.localeCopyVersion,
      })
      setSaveStatus({ payload: snapshot.payload, saved })
    }, 0)
    return () => window.clearTimeout(timeout)
  }, [locale, snapshot])

  if (!saveStatus || saveStatus.payload !== snapshot.payload) return null
  return (
    <p role="status" className="muted" data-foundation-save-status={saveStatus.saved ? "saved" : "failed"}>
      {locale === "zh-Hans"
        ? saveStatus.saved
          ? "基础结果已保存到此浏览器的“我的画像”。"
          : "基础结果未能保存到此浏览器的“我的画像”。你仍可查看结果，并复制链接以便日后访问。"
        : saveStatus.saved
          ? "Foundation result saved to Profile in this browser."
          : "Foundation result could not be saved to Profile in this browser. You can still view it and copy its link to keep it."}
    </p>
  )
}
