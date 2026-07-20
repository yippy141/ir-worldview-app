"use client"

import { useEffect } from "react"
import { useLocale } from "next-intl"
import { saveModuleSnapshot, type ModuleSnapshot } from "@/lib/profile-store"
import { consumeProfileSaveIntent } from "@/lib/profile-save-intent"
import { completionProvenance } from "@/lib/locale-provenance"
import type { Locale } from "@/i18n/routing"

export function ModuleProfileSync({
  snapshot,
}: {
  snapshot: Omit<ModuleSnapshot, "timestamp" | "locale" | "localeCopyVersion">
}) {
  const locale = useLocale() as Locale

  useEffect(() => {
    if (!consumeProfileSaveIntent("module", snapshot.resultPath)) return
    saveModuleSnapshot({
      ...snapshot,
      timestamp: Date.now(),
      ...completionProvenance("module", locale),
    })
  }, [locale, snapshot])

  return null
}
