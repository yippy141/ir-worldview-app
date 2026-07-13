"use client"

import { useEffect } from "react"
import { saveModuleSnapshot, type ModuleSnapshot } from "@/lib/profile-store"
import { consumeProfileSaveIntent } from "@/lib/profile-save-intent"

export function ModuleProfileSync({
  snapshot,
}: {
  snapshot: Omit<ModuleSnapshot, "timestamp">
}) {
  useEffect(() => {
    if (!consumeProfileSaveIntent("module", snapshot.resultPath)) return
    saveModuleSnapshot({
      ...snapshot,
      timestamp: Date.now(),
    })
  }, [snapshot])

  return null
}
