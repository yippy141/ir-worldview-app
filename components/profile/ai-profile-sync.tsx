"use client"

import { bindAiCompletionToSnapshot } from "@/lib/results/ai-completion-evidence"
import { useEffect } from "react"
import { useLocale } from "next-intl"
import {
  saveAiGovernanceSnapshot,
  type AiGovernanceSnapshot,
} from "@/lib/profile-store"
import { consumeProfileSaveIntent } from "@/lib/profile-save-intent"
import { completionProvenance } from "@/lib/locale-provenance"
import type { Locale } from "@/i18n/routing"

export function AiProfileSync({
  snapshot,
}: {
  snapshot: Omit<
    AiGovernanceSnapshot,
    "timestamp" | "locale" | "localeCopyVersion"
  >
}) {
  const locale = useLocale() as Locale

  useEffect(() => {
    if (!consumeProfileSaveIntent("ai-governance", snapshot.payload)) return
    const timestamp = Date.now()
    bindAiCompletionToSnapshot(snapshot.payload, timestamp)
    saveAiGovernanceSnapshot({
      ...snapshot,
      timestamp,
      ...completionProvenance("aiGovernance", locale),
    })
  }, [locale, snapshot])

  return null
}
