"use client"

import { useEffect } from "react"
import {
  saveFoundationSnapshot,
  type FoundationSnapshot,
} from "@/lib/profile-store"
import { consumeProfileSaveIntent } from "@/lib/profile-save-intent"

export function FoundationProfileSync({
  snapshot,
}: {
  snapshot: Omit<FoundationSnapshot, "timestamp">
}) {
  useEffect(() => {
    const intent = consumeProfileSaveIntent("foundation", snapshot.payload)
    if (!intent) return
    saveFoundationSnapshot({
      ...snapshot,
      ...(intent.mode ? { mode: intent.mode } : {}),
      timestamp: Date.now(),
    })
  }, [snapshot])

  return null
}
