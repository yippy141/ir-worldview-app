"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useLocale } from "next-intl"
import {
  buildPerspectiveRunSnapshot,
  perspectiveBaselineScoresMatch,
} from "@/lib/perspectives/result-helpers"
import type { PerspectiveRunResult } from "@/lib/perspectives/types"
import {
  loadProfileStore,
  removePerspectiveRun,
  savePerspectiveRunSnapshot,
} from "@/lib/profile-store"
import { completionProvenance } from "@/lib/locale-provenance"
import type { Locale } from "@/i18n/routing"

type Props = {
  result: PerspectiveRunResult
  resultPath: string
  payload: string
}

type SavedState =
  | "loading"
  | "saved"
  | "eligible"
  | "missing-baseline"
  | "baseline-mismatch"
  | "storage-error"

function makeRunId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return `run-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export function PerspectiveResultActions({ result, resultPath, payload }: Props) {
  const locale = useLocale() as Locale
  const [saved, setSaved] = useState<SavedState>("loading")

  useEffect(() => {
    const load = () => {
      setSaved(getSavedState(result, resultPath, locale))
    }

    load()
    window.addEventListener("storage", load)
    return () => window.removeEventListener("storage", load)
  }, [locale, result, resultPath])

  function handleSave() {
    const currentState = getSavedState(result, resultPath, locale)
    if (currentState !== "eligible") {
      setSaved(currentState)
      return
    }

    try {
      const snapshot = buildPerspectiveRunSnapshot(result, {
        id: makeRunId(),
        timestamp: Date.now(),
        resultPath,
        payload,
        ...completionProvenance("perspective", locale),
      })
      if (!savePerspectiveRunSnapshot(snapshot)) {
        setSaved("storage-error")
        return
      }
      setSaved("saved")
    } catch {
      setSaved("storage-error")
    }
  }

  function handleRemove() {
    try {
      const store = loadProfileStore(locale)
      let removed = true
      for (const run of store.perspectiveRuns) {
        if (run.resultPath === resultPath) {
          removed = removePerspectiveRun(run.id) && removed
        }
      }
      if (!removed) {
        setSaved("storage-error")
        return
      }
      setSaved(getSavedState(result, resultPath, locale))
    } catch {
      setSaved("storage-error")
    }
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
      ) : saved === "eligible" || saved === "loading" ? (
        <button
          type="button"
          className="primary-button"
          onClick={handleSave}
          disabled={saved === "loading"}
        >
          Save this run to your profile
        </button>
      ) : saved === "missing-baseline" ? (
        <>
          <p className="muted result-note-snug">
            Save is available after you create a Foundation baseline on this device.
          </p>
          <Link href="/quiz" className="cta-secondary">Take the Foundation</Link>
        </>
      ) : saved === "baseline-mismatch" ? (
        <p className="muted result-note-snug">
          This run used a different Foundation baseline. It remains readable here, but it cannot
          be attached to your current profile.
        </p>
      ) : (
        <p className="muted result-note-snug" role="alert">
          Profile storage is unavailable in this browser. The result remains available at this
          link.
        </p>
      )}
      <Link href="/perspectives" className="cta-secondary">Try another brief</Link>
    </div>
  )
}

function getSavedState(
  result: PerspectiveRunResult,
  resultPath: string,
  locale: Locale,
): SavedState {
  try {
    const store = loadProfileStore(locale)
    if (store.perspectiveRuns.some((run) => run.resultPath === resultPath)) {
      return "saved"
    }
    if (!store.foundation) return "missing-baseline"
    return perspectiveBaselineScoresMatch(
      result.baselineScores,
      store.foundation.dimensionScores,
    )
      ? "eligible"
      : "baseline-mismatch"
  } catch {
    return "storage-error"
  }
}
