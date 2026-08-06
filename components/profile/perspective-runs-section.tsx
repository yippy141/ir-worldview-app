"use client"

import Link from "next/link"
import { useState } from "react"
import { FieldMap } from "@/components/field/field-map"
import { formatFieldDate, latestRunPerPerspective } from "@/lib/field/items"
import { toMapPosition, type MapPosition } from "@/lib/field/position"
import { getPerspectiveDefinition, isPerspectiveId } from "@/lib/perspectives/catalog"
import {
  getPerspectiveShiftDirection,
  perspectiveDimensionLabels,
  perspectiveRunMatchesBaseline,
} from "@/lib/perspectives/result-helpers"
import type { PerspectiveRunSnapshot } from "@/lib/perspectives/types"
import { removePerspectiveRun } from "@/lib/profile-store"
import type { DimensionScores } from "@/lib/types"

type Props = {
  initialRuns: PerspectiveRunSnapshot[]
  baselineScores: DimensionScores | null
  mode: "local" | "shared"
}

function runShortLabel(run: PerspectiveRunSnapshot): string {
  if (isPerspectiveId(run.perspectiveId)) {
    return getPerspectiveDefinition(run.perspectiveId)?.shortLabel ?? run.perspectiveLabel
  }
  return run.perspectiveLabel
}

function topShiftPhrase(run: PerspectiveRunSnapshot): string | null {
  const dimension = run.strongestShiftKeys[0]
  if (!dimension) return null
  const delta = run.baselineDeltas[dimension] ?? 0
  if (Math.abs(delta) < 0.01) return null
  return `${perspectiveDimensionLabels[dimension]}: ${getPerspectiveShiftDirection(dimension, delta)}`
}

export function PerspectiveRunsSection({ initialRuns, baselineScores, mode }: Props) {
  const [runs, setRuns] = useState(initialRuns)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const [storageError, setStorageError] = useState(false)

  const baselinePosition = baselineScores
    ? toMapPosition(baselineScores)
    : null
  const latestRuns = latestRunPerPerspective(runs)
  const latestRunsWithBaseline = latestRuns.map((run) => ({
    run,
    matchesCurrentBaseline: baselineScores
      ? perspectiveRunMatchesBaseline(run, baselineScores)
      : false,
  }))

  function handleRemove(id: string) {
    if (confirmingId !== id) {
      setConfirmingId(id)
      return
    }
    if (!removePerspectiveRun(id)) {
      setStorageError(true)
      return
    }
    setRuns((current) => current.filter((run) => run.id !== id))
    setConfirmingId(null)
  }

  if (runs.length === 0) {
    if (mode !== "local") return null
    return (
      <section className="result-section stack-sm" aria-labelledby="perspective-runs-heading">
        <div className="stack-xs">
          <p className="eyebrow">Perspective runs</p>
          <h2 id="perspective-runs-heading" className="profile-section-title">
            {baselineScores
              ? "Try another vantage point"
              : "Complete the current Foundation first"}
          </h2>
          <p className="muted profile-section-note">
            {baselineScores
              ? (
                  <>
                    Run a short scenario set from another actor&rsquo;s seat and
                    compare it with your baseline. Contextual shifts save here
                    beside the Foundation.
                  </>
                )
              : "A resolvable Foundation result is required before a new contextual comparison can be created."}
          </p>
        </div>
        <div className="row gap-sm wrap">
          <Link
            href={baselineScores ? "/perspectives" : "/quiz"}
            className="cta-secondary"
          >
            {baselineScores ? "Open a brief" : "Start the Foundation"}
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="result-section stack-md" aria-labelledby="perspective-runs-heading">
      <div className="stack-xs">
        <p className="eyebrow">Perspective runs</p>
        <h2 id="perspective-runs-heading" className="profile-section-title">
          {baselineScores
            ? "How context moved your answers"
            : "Saved perspective runs"}
        </h2>
        <p className="muted profile-section-note">
          {baselineScores
            ? "Each run keeps the Foundation baseline it was generated from."
            : "These saved runs remain available, but the current Foundation token cannot be resolved, so no current-baseline comparison is shown."}
        </p>
      </div>

      {baselinePosition ? (
        <div className="profile-perspective-map panel result-panel">
          <FieldMap
            ariaLabel="Field map showing the current Foundation baseline and the latest saved Perspective runs. A line links a run only when it was generated from the current baseline. Each run is listed below."
            markers={[
              {
                key: "baseline",
                kind: "baseline",
                label: "Baseline",
                position: baselinePosition,
                labeled: true,
              },
              ...latestRunsWithBaseline.map(({ run }) => ({
                key: run.id,
                kind: "perspective-run" as const,
                label: runShortLabel(run),
                position: toMapPosition(run.dimensionScores) as MapPosition,
                labeled: true,
              })),
            ]}
            connectors={latestRunsWithBaseline
              .filter(({ matchesCurrentBaseline }) => matchesCurrentBaseline)
              .map(({ run }) => ({
                from: baselinePosition,
                to: toMapPosition(run.dimensionScores),
              }))}
            caption="Each open dot is the latest saved run for a brief. A line marks a shared current Foundation baseline; it is not a measured quantity."
          />
        </div>
      ) : null}

      <ul className="profile-run-list">
        {[...runs]
          .sort((left, right) => right.timestamp - left.timestamp)
          .map((run) => {
            const shift = topShiftPhrase(run)
            const matchesCurrentBaseline = baselineScores
              ? perspectiveRunMatchesBaseline(run, baselineScores)
              : false
            return (
              <li key={run.id} className="profile-run-row">
                <div className="profile-run-row__main">
                  <p className="profile-run-row__title">
                    {run.perspectiveLabel}
                    <span className="profile-run-row__date"> · {formatFieldDate(run.timestamp)}</span>
                    {!baselineScores ? (
                      <span className="profile-run-row__set"> · baseline unavailable</span>
                    ) : !matchesCurrentBaseline ? (
                      <span className="profile-run-row__set"> · earlier baseline</span>
                    ) : null}
                  </p>
                  <p className="muted profile-run-row__shift">
                    {shift ?? "Stayed close to the baseline across all seven dimensions."}
                  </p>
                </div>
                <div className="profile-run-row__actions">
                  <Link href={run.resultPath} className="profile-run-row__view">
                    View result
                  </Link>
                  {mode === "local" ? (
                    <button
                      type="button"
                      className="profile-run-row__remove"
                      onClick={() => handleRemove(run.id)}
                      onBlur={() => setConfirmingId((current) => (current === run.id ? null : current))}
                    >
                      {confirmingId === run.id ? "Confirm remove" : "Remove"}
                    </button>
                  ) : null}
                </div>
              </li>
            )
          })}
      </ul>

      {storageError ? (
        <p className="muted result-note-snug" role="alert">
          This browser could not update local profile storage. The saved run remains in place.
        </p>
      ) : null}

      {mode === "local" ? (
        <div className="row gap-sm wrap">
          <Link href="/perspectives" className="cta-secondary">Try another vantage point</Link>
        </div>
      ) : null}
    </section>
  )
}
