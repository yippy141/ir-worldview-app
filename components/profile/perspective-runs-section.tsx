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
} from "@/lib/perspectives/result-helpers"
import type { PerspectiveRunSnapshot } from "@/lib/perspectives/types"
import { removePerspectiveRun } from "@/lib/profile-store"
import type { DimensionScores } from "@/lib/types"

type Props = {
  initialRuns: PerspectiveRunSnapshot[]
  baselineScores: DimensionScores
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

  const baselinePosition = toMapPosition(baselineScores)
  const latestRuns = latestRunPerPerspective(runs)

  function handleRemove(id: string) {
    if (confirmingId !== id) {
      setConfirmingId(id)
      return
    }
    removePerspectiveRun(id)
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
            Try another vantage point
          </h2>
          <p className="muted profile-section-note">
            Run a short scenario set from another actor&rsquo;s seat and compare it with your
            baseline. Contextual shifts save here beside the Foundation.
          </p>
        </div>
        <div className="row gap-sm wrap">
          <Link href="/perspectives" className="cta-secondary">Open a brief</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="result-section stack-md" aria-labelledby="perspective-runs-heading">
      <div className="stack-xs">
        <p className="eyebrow">Perspective runs</p>
        <h2 id="perspective-runs-heading" className="profile-section-title">
          How context moved your answers
        </h2>
        <p className="muted profile-section-note">
          Contextual shifts recorded beside your baseline. Each run keeps its own date and scenario
          set. The baseline stays the anchor.
        </p>
      </div>

      <div className="profile-perspective-map panel result-panel">
        <FieldMap
          ariaLabel="Field map showing saved perspective runs as open dots connected to the Foundation baseline. Each run is listed below with its date and largest shift."
          markers={[
            {
              key: "baseline",
              kind: "baseline",
              label: "Baseline",
              position: baselinePosition,
              labeled: true,
            },
            ...latestRuns.map((run) => ({
              key: run.id,
              kind: "perspective-run" as const,
              label: runShortLabel(run),
              position: toMapPosition(run.dimensionScores) as MapPosition,
              labeled: true,
            })),
          ]}
          connectors={latestRuns.map((run) => ({
            from: baselinePosition,
            to: toMapPosition(run.dimensionScores),
          }))}
          caption="Each open dot is one run, connected to your baseline. Distance shows how far that role pulled your answers."
        />
      </div>

      <ul className="profile-run-list">
        {[...runs]
          .sort((left, right) => right.timestamp - left.timestamp)
          .map((run) => {
            const shift = topShiftPhrase(run)
            return (
              <li key={run.id} className="profile-run-row">
                <div className="profile-run-row__main">
                  <p className="profile-run-row__title">
                    {run.perspectiveLabel}
                    <span className="profile-run-row__date"> · {formatFieldDate(run.timestamp)}</span>
                    {run.scenarioSetVersion > 0 ? (
                      <span className="profile-run-row__set"> · set v{run.scenarioSetVersion}</span>
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

      {mode === "local" ? (
        <div className="row gap-sm wrap">
          <Link href="/perspectives" className="cta-secondary">Try another vantage point</Link>
        </div>
      ) : null}
    </section>
  )
}
