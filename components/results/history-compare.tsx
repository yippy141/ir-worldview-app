"use client"

import { useEffect, useState } from "react"
import { saveSnapshot, getLastSnapshot, type ResultSnapshot } from "@/lib/result-history"
import { dimensionLabels } from "@/lib/quiz-schema"
import type { DimensionKey, FamilyKey, StrategyModifier, NormativeModifier, DimensionScores } from "@/lib/types"
import { SCHEMA_VERSION } from "@/lib/quiz-schema"

const FAMILY_LABELS: Record<string, string> = {
  realist: "Strategic Realist",
  institutionalist: "Liberal Institutionalist",
  constructivist: "Social Constructivist",
  criticalPoliticalEconomy: "Critical Political Economist",
}

function fLabel(key: string): string {
  return FAMILY_LABELS[key] ?? key
}

type DimensionShift = {
  dim: DimensionKey
  label: string
  prev: number
  curr: number
  diff: number
}

export type HistoryCompareProps = {
  familyKey: FamilyKey
  neighborKey: FamilyKey
  strategyModifier: StrategyModifier
  normativeModifier: NormativeModifier
  dimensionScores: DimensionScores
}

function isEssentiallySame(a: ResultSnapshot, props: HistoryCompareProps): boolean {
  if (a.familyKey !== props.familyKey || a.neighborKey !== props.neighborKey) return false
  if (a.strategyModifier !== props.strategyModifier || a.normativeModifier !== props.normativeModifier) return false
  return (Object.keys(props.dimensionScores) as DimensionKey[]).every(
    (dim) => Math.abs(a.dimensionScores[dim] - props.dimensionScores[dim]) < 0.15,
  )
}

export function HistoryCompare(props: HistoryCompareProps) {
  const [prior, setPrior] = useState<ResultSnapshot | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const last = getLastSnapshot()

    if (last && isEssentiallySame(last, props)) {
      // Same result as last time — don't save again, no comparison to show
      setSaved(true)
      return
    }

    // Different result — save it and surface the prior for comparison
    if (last) setPrior(last)

    const snapshot: ResultSnapshot = {
      timestamp: Date.now(),
      schemaVersion: SCHEMA_VERSION,
      familyKey: props.familyKey,
      neighborKey: props.neighborKey,
      strategyModifier: props.strategyModifier,
      normativeModifier: props.normativeModifier,
      dimensionScores: props.dimensionScores,
    }
    saveSnapshot(snapshot)
    setSaved(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!saved) return null

  return (
    <>
      <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "8px" }}>
        Saved to this device
      </p>
      {prior && <CompareSection current={props} prior={prior} />}
    </>
  )
}

function CompareSection({
  current,
  prior,
}: {
  current: HistoryCompareProps
  prior: ResultSnapshot
}) {
  const familyChanged = current.familyKey !== prior.familyKey
  const stratChanged = current.strategyModifier !== prior.strategyModifier
  const normChanged = current.normativeModifier !== prior.normativeModifier

  const shifts: DimensionShift[] = (Object.keys(current.dimensionScores) as DimensionKey[])
    .map((dim) => ({
      dim,
      label: dimensionLabels[dim],
      prev: prior.dimensionScores[dim],
      curr: current.dimensionScores[dim],
      diff: current.dimensionScores[dim] - prior.dimensionScores[dim],
    }))
    .filter((s) => Math.abs(s.diff) >= 0.3)
    .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))
    .slice(0, 3)

  const priorDate = new Date(prior.timestamp).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  const nothingChanged = !familyChanged && !stratChanged && !normChanged && shifts.length === 0

  return (
    <div className="result-section stack-md" style={{ marginTop: "32px" }}>
      <div className="stack-xs">
        <h2>Compared with your last saved result</h2>
        <p className="muted" style={{ fontSize: "0.875rem" }}>
          From {priorDate} — {fLabel(prior.familyKey)} · {prior.strategyModifier} ·{" "}
          {prior.normativeModifier}
        </p>
      </div>

      {nothingChanged ? (
        <p className="muted" style={{ lineHeight: "1.65" }}>
          Your result is consistent with the previous one — no meaningful changes across family,
          modifiers, or dimension scores.
        </p>
      ) : (
        <div className="stack-md">
          <div>
            <p className="compare-section-label">Primary family</p>
            {familyChanged ? (
              <p style={{ lineHeight: "1.65" }}>
                Changed from{" "}
                <span style={{ fontWeight: 600 }}>{fLabel(prior.familyKey)}</span> to{" "}
                <span style={{ fontWeight: 600 }}>{fLabel(current.familyKey)}</span>.
              </p>
            ) : (
              <p style={{ lineHeight: "1.65" }}>
                Unchanged — <span style={{ fontWeight: 600 }}>{fLabel(current.familyKey)}</span>.
              </p>
            )}
          </div>

          {(stratChanged || normChanged) && (
            <div>
              <p className="compare-section-label">Modifiers</p>
              {stratChanged && (
                <p style={{ lineHeight: "1.65" }}>
                  Strategy: {prior.strategyModifier} → {current.strategyModifier}
                </p>
              )}
              {normChanged && (
                <p style={{ lineHeight: "1.65" }}>
                  Normative: {prior.normativeModifier} → {current.normativeModifier}
                </p>
              )}
            </div>
          )}

          {shifts.length > 0 && (
            <div>
              <p className="compare-section-label">Largest dimension shifts</p>
              <div>
                {shifts.map((s) => (
                  <div key={s.dim} className="history-shift-row">
                    <span style={{ fontSize: "0.875rem" }}>{s.label}</span>
                    <span className="history-shift-value">
                      {s.prev.toFixed(1)} → {s.curr.toFixed(1)}{" "}
                      <span style={{ fontSize: "0.75rem" }}>
                        ({s.diff > 0 ? "+" : ""}
                        {s.diff.toFixed(1)})
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
