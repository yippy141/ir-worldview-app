import Link from "next/link"
import { FieldMap } from "@/components/field/field-map"
import { PerspectiveResultActions } from "@/components/perspectives/perspective-result-actions"
import { situationLabel } from "@/lib/perspectives/situations"
import { ResultCardHero } from "@/components/results/result-card-hero"
import { ResultCardHeroShare } from "@/components/results/result-card-hero-share"
import { ComparisonRow } from "@/components/visual-primitives"
import { toMapPosition } from "@/lib/field/position"
import { isPerspectiveId } from "@/lib/perspectives/catalog"
import {
  buildPerspectiveResultCopy,
  getPerspectiveShiftRows,
  getStrongestPerspectiveShifts,
} from "@/lib/perspectives/result-helpers"
import { resolvePerspectivePayload } from "@/lib/perspectives/share"
import type { Metadata } from "next"

export async function generateMetadata(
  { params }: { params: Promise<{ perspectiveId: string; payload: string }> },
): Promise<Metadata> {
  const { perspectiveId, payload } = await params
  const resolved = isPerspectiveId(perspectiveId)
    ? resolvePerspectivePayload(payload, perspectiveId)
    : null

  const title = resolved
    ? `${resolved.perspective.label} run — IR Worldview Inventory`
    : "Perspective run — IR Worldview Inventory"

  return {
    title,
    description:
      "A contextual shift from a short scenario set, plotted beside the Foundation baseline.",
  }
}

export default async function PerspectiveResultPage(
  { params }: { params: Promise<{ perspectiveId: string; payload: string }> },
) {
  const { perspectiveId, payload } = await params
  const resolved = isPerspectiveId(perspectiveId)
    ? resolvePerspectivePayload(payload, perspectiveId)
    : null

  if (!resolved) {
    return (
      <div className="container stack-lg result-invalid">
        <div className="panel stack-md">
          <p className="eyebrow">Invalid run link</p>
          <h1>This link could not be decoded.</h1>
          <p className="muted history-line">
            The run URL may be incomplete, corrupted, or from an older scenario set.
          </p>
          <div className="row gap-sm wrap">
            <Link href="/perspectives" className="cta-primary">Browse the briefs</Link>
            <Link href="/quiz" className="cta-secondary">Take the Foundation</Link>
            <Link href="/method" className="cta-secondary">Methods</Link>
          </div>
        </div>
      </div>
    )
  }

  const { perspective, result } = resolved
  const copy = buildPerspectiveResultCopy(result)
  const strongestShifts = getStrongestPerspectiveShifts(result, 3)
  const allShiftRows = getPerspectiveShiftRows(result)
  const resultPath = `/perspectives/${perspective.id}/result/${payload}`

  const baselinePosition = toMapPosition(result.baselineScores)
  const runPosition = toMapPosition(result.dimensionScores)

  const movement = result.largestMovement
  const largestMovementScenario = movement
    ? perspective.scenarios.find((scenario) => scenario.id === movement.scenarioId) ?? null
    : null
  const largestMovementOption = largestMovementScenario
    ? largestMovementScenario.options.find((option) => option.id === movement?.optionId) ?? null
    : null
  const hasLargestMovement = Boolean(
    movement && largestMovementScenario && largestMovementOption && movement.movement >= 0.01,
  )

  return (
    <div className="wide-container">
      <article className="result-article">
        <ResultCardHero
          eyebrow={`Perspective run · ${perspective.label}`}
          label={copy.headline}
          accent="profile"
          summary={`${copy.summary} Your Foundation baseline stays saved and unchanged.`}
          finding={{ label: "Largest modeled movement", text: copy.largestMovement }}
          actions={
            <>
              <PerspectiveResultActions result={result} resultPath={resultPath} />
              <ResultCardHeroShare
                shareUrl={resultPath}
                title={`Perspective run: ${perspective.label}`}
                text={`My ${perspective.label} perspective run beside my IR Worldview baseline.`}
              />
            </>
          }
        />

        <section className="result-section stack-md" aria-labelledby="perspective-map-heading">
          <div className="stack-xs">
            <p className="eyebrow">Comparison</p>
            <h2 id="perspective-map-heading">Where this run landed</h2>
          </div>
          <div className="perspective-result-map panel result-panel stack-md">
            <FieldMap
              ariaLabel={`Field map comparing the Foundation baseline with the ${perspective.label} run. A line links the two authored placements.`}
              markers={[
                {
                  key: "baseline",
                  kind: "baseline",
                  label: "Baseline",
                  position: baselinePosition,
                  labeled: true,
                },
                {
                  key: "run",
                  kind: "perspective-run",
                  label: perspective.shortLabel,
                  position: runPosition,
                  labeled: true,
                },
              ]}
              connectors={[{ from: baselinePosition, to: runPosition }]}
              caption="The solid dot is your baseline. The open dot is this run. The line links their authored placements; its length is not a calibrated distance."
            />
          </div>
        </section>

        <section className="result-section stack-md" aria-labelledby="perspective-shifts-heading">
          <div className="stack-xs">
            <p className="eyebrow">Largest shifts</p>
            <h2 id="perspective-shifts-heading">
              {strongestShifts.length > 0
                ? "Where your answers moved"
                : "Your answers held close to the baseline"}
            </h2>
          </div>

          {strongestShifts.length > 0 ? (
            <div className="perspective-shift-list stack-md">
              {strongestShifts.map((row, index) => (
                <div key={row.dimension} className="perspective-shift-row stack-xs">
                  <ComparisonRow
                    label={row.label}
                    baseline={{
                      id: "baseline",
                      label: "Baseline",
                      value: row.baseline,
                      tone: "baseline",
                      shape: "bar",
                    }}
                    overlays={[
                      {
                        id: "run",
                        label: perspective.shortLabel,
                        value: row.contextual,
                        tone: "default",
                        shape: "circle",
                      },
                    ]}
                    showLegend={index === 0}
                  />
                  <p className="muted perspective-shift-row__read">
                    {row.direction}. Read the amount as a modeled indication, not a measured gap.
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted result-note">
              This run stayed close to your baseline on every modeled dimension.
            </p>
          )}

          <details className="profile-details profile-details--secondary">
            <summary>All seven dimensions</summary>
            <div className="profile-collapsed-detail stack-md">
              {allShiftRows.map((row) => (
                <div key={row.dimension} className="stack-xs">
                  <ComparisonRow
                    label={row.label}
                    baseline={{
                      id: "baseline",
                      label: "Baseline",
                      value: row.baseline,
                      tone: "baseline",
                      shape: "bar",
                    }}
                    overlays={[
                      {
                        id: "run",
                        label: perspective.shortLabel,
                        value: row.contextual,
                        tone: "default",
                        shape: "circle",
                      },
                    ]}
                    showLegend={false}
                  />
                </div>
              ))}
            </div>
          </details>
        </section>

        <section className="result-section stack-md">
          <div className="driver-grid">
            <article className="driver-card stack-xs">
              <p className="eyebrow">What held steady</p>
              <p className="result-emphasis">{copy.stableThread}</p>
              <p className="muted result-note-snug">
                Held dimensions carry as much information as moved ones. They mark judgments the
                role could not shake.
              </p>
            </article>

            <article className="driver-card stack-xs">
              <p className="eyebrow">Scenario behind the largest modeled movement</p>
              {hasLargestMovement && largestMovementScenario && largestMovementOption ? (
                <>
                  <p className="result-emphasis">{situationLabel(largestMovementScenario)}</p>
                  <p className="muted result-note-snug">{largestMovementScenario.task}</p>
                  <p className="perspective-decisive__choice">
                    Your call: {largestMovementOption.title}
                  </p>
                  <p className="muted result-note-snug">{largestMovementOption.response}</p>
                </>
              ) : (
                <p className="muted result-note-snug">{copy.largestMovement}</p>
              )}
            </article>
          </div>
        </section>

        <section className="result-section stack-sm">
          <p className="muted perspective-result-note">
            This run scores {perspective.scenarios.length} scenarios. It reads as a contextual
            overlay beside your baseline. Read small movements lightly.{" "}
            <Link href="/method">Read methods</Link>
          </p>
        </section>
      </article>
    </div>
  )
}
