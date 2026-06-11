"use client"

import { useEffect } from "react"
import {
  saveAiGovernanceSnapshot,
  type AiGovernanceSnapshot,
} from "@/lib/profile-store"

export function AiProfileSync({
  snapshot,
}: {
  snapshot: Omit<AiGovernanceSnapshot, "timestamp">
}) {
  useEffect(() => {
    saveAiGovernanceSnapshot({
      ...snapshot,
      timestamp: Date.now(),
    })
  }, [snapshot])

  return null
}
