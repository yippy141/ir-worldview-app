"use client"

import { useEffect } from "react"
import { useLocale } from "next-intl"
import {
  saveFoundationSnapshot,
  type FoundationSnapshot,
} from "@/lib/profile-store"
import { consumeProfileSaveIntent } from "@/lib/profile-save-intent"
import { completionProvenance } from "@/lib/locale-provenance"
import type { Locale } from "@/i18n/routing"

export function FoundationProfileSync({
  snapshot,
}: {
  snapshot: Omit<FoundationSnapshot, "timestamp" | "locale" | "localeCopyVersion">
}) {
  const locale = useLocale() as Locale

  useEffect(() => {
    const intent = consumeProfileSaveIntent("foundation", snapshot.payload)
    if (!intent) return
    saveFoundationSnapshot({
      ...snapshot,
      ...(intent.mode ? { mode: intent.mode } : {}),
      timestamp: Date.now(),
      ...completionProvenance("foundation", locale),
    })
  }, [locale, snapshot])

  return null
}
