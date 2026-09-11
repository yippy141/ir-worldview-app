import { buildModuleInterpretation } from "@/lib/results/module-interpretation"
import { WorkedApplication } from "@/components/results/worked-application"
import Link from "next/link"
import styles from "@/components/modules/module-result.module.css"
import { getModuleContinuation } from "@/lib/modules/continuation"
import { EvidenceControls } from "@/components/reading/evidence-controls"
import { ScaleBar } from "@/components/visual-primitives"
import { ResearchStatusNotice } from "@/components/research/research-status-notice"
import { ModuleProfileSync } from "@/components/profile/module-profile-sync"
import {
  ACTIVE_MODULE_COMPARISON_STATUS,
  type ModuleAnswers,
  type ModuleDefinition,
  type ModuleSlug,
} from "@/lib/modules/types"
import {
  buildModuleDecisiveCalls,
  formatModuleCardType,
} from "@/lib/modules/result-copy"
import type { ModuleVersion } from "@/lib/modules/versions"
import {
  ACTOR_LENS_INSTRUCTION,
  ACTOR_LENS_RESULT_SUMMARY,
  hasPerspectiveBankCapability,
} from "@/lib/modules/perspective-bank"
import type { QuizMode } from "@/lib/types"

export function ModuleResultView({
  moduleDefinition,
  runtime,
  bankVersion,
  scoringVersion,
  payload,
  mode,
  answers,
  foundationPayload,
}: {
  moduleDefinition: ModuleDefinition
  runtime: ModuleVersion["runtime"]
  bankVersion: number
  scoringVersion: number
  payload: string
  mode: QuizMode
  answers: ModuleAnswers
  foundationPayload?: string
}) {
  const slug: ModuleSlug = moduleDefinition.slug

  const result = runtime.buildModuleResult(
    moduleDefinition,
    mode,
    answers,
  )
  const analytics = runtime.buildModuleAnalytics(
    moduleDefinition,
    mode,
    answers,
  )
  const selected = runtime.getSelectedModuleOptions(
    moduleDefinition,
    mode,
    answers,
  )
  const usesPerspectiveBankPresentation = hasPerspectiveBankCapability({
    slug,
    bankVersion,
  })
  const scoredSelections = selected.filter(
    ({ question }) => question.cardType !== "actorLens",
  )
  const resultEvidenceSelections = usesPerspectiveBankPresentation
    ? scoredSelections
    : selected
  const actorLensSelections = usesPerspectiveBankPresentation
    ? selected.filter(({ question }) => question.cardType === "actorLens")
    : []
  const questionCount =
    runtime.getModuleQuestions(moduleDefinition, mode).length
  const laneLabelMap = Object.fromEntries(
    moduleDefinition.lanes.map((lane) => [lane.key, lane.label]),
  ) as Record<string, string>
  const hasActorLens = Boolean(result.cardTypeScores.actorLens)
  const resultPath = `/modules/${slug}/results/${payload}${foundationPayload ? `?foundation=${encodeURIComponent(foundationPayload)}` : ""}`
  const decisiveCalls = buildModuleDecisiveCalls({
    moduleDefinition,
    selected: resultEvidenceSelections,
    laneLabelMap,
  })
  // Every registered runtime excludes actor-lens answers from the main score.
  // Keep their historical directional analysis below, separate from the opening evidence.
  const readingCalls = buildModuleDecisiveCalls({ moduleDefinition, selected: scoredSelections, laneLabelMap })
  const availableEvidence = resultEvidenceSelections.filter(({ primary }) => primary)
  const interpretation = buildModuleInterpretation(moduleDefinition, result, scoredSelections.filter(({ primary }) => primary).length, { bankVersion, scoringVersion, mode })
  const continuation = getModuleContinuation(slug)
  const comparisonStatus = ACTIVE_MODULE_COMPARISON_STATUS
  const identityCode = [
    moduleDefinition.shorthand,
    mode === "standard" ? "Standard" : "Advanced",
    `${selected.filter(({ primary }) => primary).length} of ${questionCount} answered`,
  ]

  return (
    <div className="stack-lg">
      <article className={`result-article ${styles.result}`}>
        <ModuleProfileSync
          snapshot={{
            slug,
            title: moduleDefinition.shortTitle,
            subtitle: moduleDefinition.subtitle,
            shorthand: moduleDefinition.shorthand,
            mode,
            headline: result.headline,
            summary: result.summary,
            resultPath,
            scores: result.scores,
            instincts: result.instincts,
            challenge: result.challenge,
            measures: moduleDefinition.measures,
            doesNotClaim: moduleDefinition.doesNotClaim,
            evidence: selected.map(({ question, primary, secondary }) => ({
              question:
                usesPerspectiveBankPresentation &&
                question.cardType === "actorLens"
                  ? `${question.title} (Perspective modeling, unscored)`
                  : question.title,
              primary: primary?.title ?? "No selection",
              ...(secondary?.title ? { secondary: secondary.title } : {}),
            })),
            laneSummaries: result.laneSummaries,
            ...(result.cardTypeRead
              ? {
                  cardTypeRead: usesPerspectiveBankPresentation
                    ? {
                        headline: "Perspective modeling",
                        summary: ACTOR_LENS_RESULT_SUMMARY,
                      }
                    : result.cardTypeRead,
                }
              : {}),
            ...(Object.keys(result.cardTypeScores).length > 0
              ? { cardTypeScores: result.cardTypeScores }
              : {}),
            overlayDeltas: {},
            payload,
            ...(foundationPayload ? { foundationPayload } : {}),
            laneScores: analytics.laneScores,
            instrumentVersion: bankVersion,
          }}
        />

        {/* ── 1. Verdict ── */}
        <header className={`result-verdict ${styles.verdict}`}>
          <h1 className="result-verdict__name">{result.headline}</h1>
          <p className="result-verdict__code">
            {identityCode.map((part, index) => (
              <span key={part}>
                {index > 0 ? <span aria-hidden="true"> · </span> : null}
                <span>{part}</span>
              </span>
            ))}
          </p>
          <p className="result-verdict__gloss">{interpretation.summary}</p>
        </header>


        <p className="result-scope">{interpretation.scope}</p>
        <WorkedApplication example={interpretation.example} />

        {readingCalls.length > 0 ? (
          <section className={`result-section result-figure ${styles.evidence}`} aria-labelledby="module-choices-heading">
            <h2 id="module-choices-heading">Choices behind this reading</h2>
            <div className={styles.choices}>
              {readingCalls.slice(0, 2).map((call) => {
                const selection = availableEvidence.find(({ question }) => question.id === call.id)
                if (!selection?.primary) return null
                return (
                  <article key={call.id} className={styles.choice}>
                    <h3>{call.caseTitle}</h3>
                    <p className={styles.meta}>{call.laneLabel} · {call.cardType}</p>
                    <p><strong>{selection.primary.title}.</strong> {selection.primary.label}</p>
                    {selection.secondary ? (
                      <p><strong>Second choice: {selection.secondary.title}.</strong> {selection.secondary.label}</p>
                    ) : null}
                  </article>
                )
              })}
            </div>
            <p className={styles.selectionNote}>
              These examples illustrate selected primary answers. They are not a calculation of
              which answers contributed most to the final scores. Full analysis includes the
              recorded choices and their encoded directions.
            </p>
          </section>
        ) : (
          <p className={styles.selectionNote}>
            This link contains no scored answer selections. The reading above preserves the
            existing calculation for this record; it cannot establish a view from absent answers.
            {selected.some(({ question, primary }) => question.cardType === "actorLens" && primary)
              ? " Its perspective-modeling choices are available in Full analysis."
              : ""}
          </p>
        )}

        <section className="result-section result-next">
          <h2>What would change this</h2>
          <p className="result-next__question">{interpretation.followUp.question}</p>
          <div className={`${styles.continuation} print-hidden`}>
            <div>
              <Link href="/profile" className="cta-primary">View Profile</Link>
              <p>Open the results saved in this browser. A Foundation is optional.</p>
            </div>
            {continuation ? (
              <div>
                <Link href={continuation.href}>{continuation.title} →</Link>
                <p>{continuation.reason} This is an optional, unscored exercise.</p>
              </div>
            ) : null}
          </div>
        </section>

        {/* Lane and axis scores retain their distinct scales. */}
        <section className="result-section result-figure">
          <h2>Your lane results</h2>
          <div className="profile-module-grid">
            {result.laneSummaries.map((lane) => (
              <div key={lane.key} className="explore-card stack-sm">
                <div className="stack-xs">
                  <p className="eyebrow">{lane.label}</p>
                  <p className="module-lane-copy">{lane.summary}</p>
                </div>
                <ScaleBar
                  value={lane.score}
                  valueLabel={lane.score.toFixed(1)}
                  lowLabel={lane.lowLabel}
                  highLabel={lane.highLabel}
                  tone={slug}
                  className="module-lane-meter"
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. Axis profile ── */}
        <section className="result-section result-figure">
          <h2>{moduleDefinition.shortTitle} axes</h2>
          <div>
            {moduleDefinition.axes.map((axis) => (
              <div key={axis.key} className="dim-row">
                <ScaleBar
                  label={axis.label}
                  value={result.scores[axis.key]}
                  valueLabel={result.scores[axis.key].toFixed(1)}
                  lowLabel={axis.lowLabel}
                  highLabel={axis.highLabel}
                  tone={slug}
                  className="position-scale"
                />
                <p className="result-axis-note">{interpretation.axisReadings[axis.key]}</p>
              </div>
            ))}
          </div>
          <p className="result-figure__note">
            Each score reports a response direction within this module. The prose uses this registered form’s model; the scale midpoint is not a population average. Its endpoint labels name
            the two directions; they are not empirical bounds
            {hasActorLens
              ? usesPerspectiveBankPresentation
                ? ". Scored Explanation and Decision cards determine the main result. Actor lens cards are excluded from the headline, axes, and lane results."
                : ". Explanation and Decision cards determine the main result; Actor lens cards provide context only."
              : "."}{" "}
            <Link href="/method">Methods sets out the limits →</Link>
          </p>
        </section>

        {usesPerspectiveBankPresentation && hasActorLens ? (
          <section className="result-section result-figure">
            <h2>Perspective-modeling read</h2>
            <p className="result-prose module-prose">
              {ACTOR_LENS_RESULT_SUMMARY}
            </p>
            <p className="result-figure__note">
              {ACTOR_LENS_INSTRUCTION} The choices remain visible below as
              separate descriptive evidence and do not alter any scored{" "}
              {moduleDefinition.shortTitle} result.
            </p>
          </section>
        ) : null}

        {/* ── 4. Relation to the Foundation ── */}
        <section className="result-section result-figure">
          <h2>How this relates to the Foundation</h2>
          <p className="result-prose module-prose">
            {comparisonStatus.kind === "separate-domain-read"
              ? `Read this as a ${moduleDefinition.shortTitle.toLowerCase()}-specific result. It can sit beside your Foundation in the Profile, but it never changes the Foundation’s seven dimensions or family summary.`
              : "This result is reported independently from the Foundation."}
          </p>
        </section>

        <section className="result-section result-appendix-section stack-md">
          <div className="print-hidden"><EvidenceControls /></div>
          <h2>Full analysis</h2>
          <details className="profile-details">
            <summary>Reasoning, scope and model reading</summary>
            <div className="stack-lg result-details-body">
              {decisiveCalls.length > 0 ? (
                <section className="stack-md">
                  <h2>Directions in the selected choices</h2>
                  <div className="module-decisive-list">
                    {decisiveCalls.map((call) => (
                      <article key={call.id} className="module-decisive-call">
                        <div className="module-decisive-meta">
                          <span>{call.laneLabel}</span>
                          <span>{call.cardType}</span>
                        </div>
                        <div className="stack-xs">
                          <h3>{call.caseTitle}</h3>
                          <p className="module-decisive-framing">{call.framing}</p>
                          <p className="muted module-lane-delta">{call.implication}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

              ) : null}
              {!usesPerspectiveBankPresentation && result.cardTypeRead ? (
                <div className="stack-md">
                  <h2>{result.cardTypeRead.headline}</h2>
                  <p className="result-prose module-prose">{result.cardTypeRead.summary}</p>
                </div>
              ) : null}

              <div className="stack-md">
                <h2>Registered model reading</h2>
                <p className="result-scope">The model supplies these reference statements for its calculated reading. They cannot fill gaps in the available answers; use the recorded choices and positions to assess where they apply.</p>
                <ul className="content-list result-prose">
                  {result.instincts.map((instinct) => (
                    <li key={instinct}>{instinct}</li>
                  ))}
                </ul>
                <p>{result.challenge}</p>
              </div>

              <div className="stack-md">
                <h2>Scope</h2>
                <div className="driver-grid">
                  <div className="driver-card stack-xs">
                    <p className="eyebrow">Form</p>
                    <p className="driver-card__value">
                      {mode === "standard" ? "Standard" : "Advanced"}
                    </p>
                    <p className="muted module-lane-delta">
                      {questionCount} questions · {moduleDefinition.timeEstimate[mode]}
                    </p>
                  </div>
                  <div className="driver-card stack-xs">
                    <p className="eyebrow">What it measured</p>
                    <p className="muted module-lane-delta">
                      {moduleDefinition.measures.join("; ")}.
                    </p>
                  </div>
                  <div className="driver-card stack-xs">
                    <p className="eyebrow">What it did not claim</p>
                    <p className="muted module-lane-delta">
                      {moduleDefinition.doesNotClaim.join("; ")}.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </details>
          <details className="profile-details">
            <summary>Recorded answers and perspective choices</summary>
            <div className="stack-lg result-details-body">
              {availableEvidence.length > 0 ? (
                <div className="stack-md">
                  <h2>
                    {usesPerspectiveBankPresentation
                      ? "Scored evidence log"
                      : "Evidence log"}
                  </h2>
                  <div className="driver-grid">
                    {availableEvidence.map(({ question, primary, secondary }) => (
                      <div key={question.id} className="driver-card stack-sm">
                        <div className="stack-xs">
                          <p className="eyebrow">{question.title}</p>
                          <p className="muted module-evidence-meta">
                            {laneLabelMap[question.lane] ?? question.lane} · {formatModuleCardType(question.cardType)}
                          </p>
                          <p className="module-lane-copy">{question.prompt}</p>
                        </div>
                        <div className="stack-xs">
                          <span className="option-card-meta">Most persuasive</span>
                          <p className="driver-card__value">
                            {primary?.title ?? "No selection"}
                          </p>
                          <p className="muted module-lane-delta">
                            {primary?.label ?? "This question was not answered."}
                          </p>
                        </div>
                        {secondary ? (
                          <div className="stack-xs">
                            <span className="option-card-meta option-card-meta--secondary">Second-most persuasive</span>
                            <p className="driver-card__value">{secondary.title}</p>
                            <p className="muted module-lane-delta">{secondary.label}</p>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>

              ) : null}

              {actorLensSelections.some(({ primary }) => primary) ? (
                <div className="stack-md">
                  <div className="stack-xs">
                    <h2>Perspective-modeling choices</h2>
                    <p className="result-figure__note">
                      These selections are reported separately from your scored evidence. They did
                      not change the headline, axes, or lane results.
                    </p>
                  </div>
                  <div className="driver-grid">
                    {actorLensSelections.filter(({ primary }) => primary).map(({ question, primary, secondary }) => (
                      <div key={question.id} className="driver-card stack-sm">
                        <div className="stack-xs">
                          <p className="eyebrow">{question.title}</p>
                          <p className="muted module-evidence-meta">
                            {laneLabelMap[question.lane] ?? question.lane} · Perspective modeling
                          </p>
                          <p className="module-lane-copy">{question.prompt}</p>
                        </div>
                        <div className="stack-xs">
                          <span className="option-card-meta">Most persuasive</span>
                          <p className="driver-card__value">
                            {primary?.title ?? "No selection"}
                          </p>
                          <p className="muted module-lane-delta">
                            {primary?.label ?? "This question was not answered."}
                          </p>
                        </div>
                        {secondary ? (
                          <div className="stack-xs">
                            <span className="option-card-meta option-card-meta--secondary">
                              Second-most persuasive
                            </span>
                            <p className="driver-card__value">{secondary.title}</p>
                            <p className="muted module-lane-delta">{secondary.label}</p>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="row gap-sm wrap print-hidden">
                <Link href={`/modules/${slug}${foundationPayload ? `?foundation=${encodeURIComponent(foundationPayload)}` : ""}`} className="cta-secondary">
                  Retake this Focus Area
                </Link>
                <Link href={foundationPayload ? `/modules?foundation=${encodeURIComponent(foundationPayload)}` : "/modules"} className="cta-secondary">
                  Browse Focus Areas
                </Link>
                {foundationPayload ? <Link href={`/results/${foundationPayload}`}>Back to Foundation result</Link> : null}
              </div>

              <ResearchStatusNotice instrumentLabel={`${moduleDefinition.shortTitle} module`} />
            </div>
          </details>
        </section>
      </article>
    </div>
  )
}
