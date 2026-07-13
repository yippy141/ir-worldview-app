"use client"

import { useEffect } from "react"
import {
  saveAiGovernanceSnapshot,
  type AiGovernanceSnapshot,
} from "@/lib/profile-store"
import { consumeProfileSaveIntent } from "@/lib/profile-save-intent"

export function AiProfileSync({
  snapshot,
}: {
  snapshot: Omit<AiGovernanceSnapshot, "timestamp">
}) {
  useEffect(() => {
    if (!consumeProfileSaveIntent("ai-governance", snapshot.payload)) return
    saveAiGovernanceSnapshot({
      ...snapshot,
      timestamp: Date.now(),
    })
  }, [snapshot])

  return null
}
