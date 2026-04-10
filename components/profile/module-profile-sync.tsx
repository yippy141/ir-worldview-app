"use client"

import { useEffect } from "react"
import { saveModuleSnapshot, type ModuleSnapshot } from "@/lib/profile-store"

export function ModuleProfileSync({
  snapshot,
}: {
  snapshot: Omit<ModuleSnapshot, "timestamp">
}) {
  useEffect(() => {
    saveModuleSnapshot({
      ...snapshot,
      timestamp: Date.now(),
    })
  }, [snapshot])

  return null
}
