"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { buildPerspectiveRunSnapshot } from "@/lib/perspectives/result-helpers"
import type { PerspectiveRunResult } from "@/lib/perspectives/types"
import {
  loadProfileStore,
  removePerspectiveRun,
  savePerspectiveRunSnapshot,
} from "@/lib/profile-store"

type Props = {
  result: PerspectiveRunResult
  resultPath: string
}

type SavedState = "loading" | "saved" | "unsaved"

function makeRunId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return `run-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export function PerspectiveResultActions({ result, resultPath }: Props) {
  const [saved, setSaved] = useState<SavedState>("loading")

  useEffect(() => {
    const load = () => {
      const store = loadProfileStore()
      setSaved(
        store.perspectiveRuns.some((run) => run.resultPath === resultPath)
          ? "saved"
          : "unsaved",
      )
    }

    load()
    window.addEventListener("storage", load)
    return () => window.removeEventListener("storage", load)
  }, [resultPath])

  function handleSave() {
    const snapshot = buildPerspectiveRunSnapshot(result, {
      id: makeRunId(),
      timestamp: Date.now(),
      resultPath,
    })
    savePerspectiveRunSnapshot(snapshot)
    setSaved("saved")
  }

  function handleRemove() {
    const store = loadProfileStore()
    for (const run of store.perspectiveRuns) {
      if (run.resultPath === resultPath) {
        removePerspectiveRun(run.id)
      }
    }
    setSaved("unsaved")
  }

  return (
    <div className="row gap-sm wrap perspective-result-actions" aria-live="polite">
      {saved === "saved" ? (
        <>
          <Link href="/profile" className="cta-primary">Saved to profile</Link>
          <button type="button" className="secondary-button" onClick={handleRemove}>
            Remove from profile
          </button>
        </>
      ) : (
        <button
          type="button"
          className="primary-button"
          onClick={handleSave}
          disabled={saved === "loading"}
        >
          Save this run to your profile
        </button>
      )}
      <Link href="/perspectives" className="cta-secondary">Try another brief</Link>
    </div>
  )
}
