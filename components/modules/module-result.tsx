import Link from "next/link"
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
  payload,
  mode,
  answers,
  foundationPayload,
}: {
  moduleDefinition: ModuleDefinition
  runtime: ModuleVersion["runtime"]
  bankVersion: number
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
  const comparisonStatus = ACTIVE_MODULE_COMPARISON_STATUS
  const identityCode = [
    moduleDefinition.shorthand,
    mode === "standard" ? "Standard" : "Advanced",
    `${questionCount} questions`,
  ]

  return (
    <div className="stack-lg">
      <article className="result-article">
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
        <header className="result-verdict">
          <p className="eyebrow">{moduleDefinition.shortTitle} result</p>
          <h1 className="result-verdict__name">{result.headline}</h1>
          <p className="result-verdict__code">
            {identityCode.map((part, index) => (
              <span key={part}>
                {index > 0 ? <span aria-hidden="true"> · </span> : null}
                <span>{part}</span>
              </span>
            ))}
          </p>
          <p className="result-verdict__gloss">{result.summary}</p>
          <div className="result-verdict__actions print-hidden">
            <Link
              href={foundationPayload ? "/profile" : "/quiz"}
              className="cta-primary"
            >
              {foundationPayload ? "View Profile" : "Take the IR Foundation"}
            </Link>
          </div>
        </header>

        {/* ── 2. Lane meters ── */}
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
                />
              </div>
            ))}
          </div>
          <p className="result-figure__note">
            Each score reports a response direction within this module. Its endpoint labels name
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

        {/* ── 5. Decisive calls ── */}
        <section className="result-section result-figure">
          <h2>Answers that most shaped this result</h2>
          <div className="module-decisive-list">
            {decisiveCalls.map((call, index) => (
              <article key={call.id} className="module-decisive-call">
                <div className="module-decisive-meta">
                  <span>{String(index + 1).padStart(2, "0")}</span>
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

        {/* ── 6. What would change this ── */}
        <section className="result-section result-next">
          <h2>What would change this</h2>
          <p className="result-next__question">{result.challenge}</p>
          <div className="row gap-sm wrap">
            <Link
              href={foundationPayload ? `/modules?foundation=${encodeURIComponent(foundationPayload)}` : "/modules"}
              className="cta-primary"
            >
              Try another Focus Area
            </Link>
            <Link href={`/modules/${slug}${foundationPayload ? `?foundation=${encodeURIComponent(foundationPayload)}` : ""}`} className="cta-secondary">
              Retake this Focus Area
            </Link>
            {foundationPayload ? (
              <Link href={`/results/${foundationPayload}`} className="cta-secondary">
                Back to Foundation result
              </Link>
            ) : null}
            <Link href="/profile" className="cta-secondary">
              View your Profile
            </Link>
          </div>
        </section>

        <section className="result-section result-appendix-section stack-md">
          <details className="profile-details">
            <summary>Full analysis</summary>
            <div className="stack-lg result-details-body">
              {!usesPerspectiveBankPresentation && result.cardTypeRead ? (
                <div className="stack-md">
                  <h2>{result.cardTypeRead.headline}</h2>
                  <p className="result-prose module-prose">{result.cardTypeRead.summary}</p>
                </div>
              ) : null}

              <div className="stack-md">
                <h2>Judgments reflected in your answers</h2>
                <ul className="content-list result-prose">
                  {result.instincts.map((instinct) => (
                    <li key={instinct}>{instinct}</li>
                  ))}
                </ul>
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

              <div className="stack-md">
                <h2>
                  {usesPerspectiveBankPresentation
                    ? "Scored evidence log"
                    : "Evidence log"}
                </h2>
                <div className="driver-grid">
                  {resultEvidenceSelections.map(({ question, primary, secondary }) => (
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

              {actorLensSelections.length > 0 ? (
                <div className="stack-md">
                  <div className="stack-xs">
                    <h2>Perspective-modeling choices</h2>
                    <p className="result-figure__note">
                      These selections are reported separately from your scored evidence. They did
                      not change the headline, axes, or lane results.
                    </p>
                  </div>
                  <div className="driver-grid">
                    {actorLensSelections.map(({ question, primary, secondary }) => (
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

              <ResearchStatusNotice instrumentLabel={`${moduleDefinition.shortTitle} module`} />
            </div>
          </details>
        </section>
      </article>
    </div>
  )
}
