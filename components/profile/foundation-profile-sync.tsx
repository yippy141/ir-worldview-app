"use client"

import { useEffect } from "react"
import {
  saveFoundationSnapshot,
  type FoundationSnapshot,
} from "@/lib/profile-store"

export function FoundationProfileSync({
  snapshot,
}: {
  snapshot: Omit<FoundationSnapshot, "timestamp">
}) {
  useEffect(() => {
    saveFoundationSnapshot({
      ...snapshot,
      timestamp: Date.now(),
    })
  }, [snapshot])

  return null
}
