"use client"

import { useEffect } from "react"
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

  useEffect(() => {
    const intent = consumeProfileSaveIntent("foundation", snapshot.payload)
    if (!intent) return
    const resolved = resolveFoundationPayload(snapshot.payload)
    const payloadProvenance = resolved?.provenance
    const routeProvenance = completionProvenance("foundation", locale)
    saveFoundationSnapshot({
      ...snapshot,
      ...(intent.mode ? { mode: intent.mode } : {}),
      timestamp: Date.now(),
      instrumentStructuralVersion:
        payloadProvenance?.instrumentStructuralVersion ?? 0,
      scoringVersion: payloadProvenance?.scoringVersion ?? 0,
      locale: payloadProvenance?.completionLocale ?? routeProvenance.locale,
      localeCopyVersion:
        payloadProvenance?.localeCopyVersion ?? routeProvenance.localeCopyVersion,
    })
  }, [locale, snapshot])

  return null
}
