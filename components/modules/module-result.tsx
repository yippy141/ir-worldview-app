import Link from "next/link"
import {
  buildModuleResult,
  getModuleDefinition,
  getModuleQuestions,
  getSelectedModuleOptions,
} from "@/lib/modules/framework"
import { ModuleProfileSync } from "@/components/profile/module-profile-sync"
import type { ModuleAnswers, ModuleSlug } from "@/lib/modules/types"
import type { DimensionScores, QuizMode } from "@/lib/types"

export function ModuleResultView({
  slug,
  payload,
  mode,
  answers,
  foundation,
  foundationPayload,
}: {
  slug: ModuleSlug
  payload: string
  mode: QuizMode
  answers: ModuleAnswers
  foundation?: DimensionScores
  foundationPayload?: string
}) {
  const moduleDefinition = getModuleDefinition(slug)
  if (!moduleDefinition) return null

  const result = buildModuleResult(moduleDefinition, mode, answers, foundation)
  const selected = getSelectedModuleOptions(moduleDefinition, mode, answers)
  const questionCount = getModuleQuestions(moduleDefinition, mode).length
  const isStandard = mode === "standard"
  const laneLabelMap = Object.fromEntries(
    moduleDefinition.lanes.map((lane) => [lane.key, lane.label]),
  ) as Record<string, string>
  const hasActorLens = Boolean(result.cardTypeScores.actorLens)
  const resultPath = `/modules/${slug}/results/${payload}${foundationPayload ? `?foundation=${encodeURIComponent(foundationPayload)}` : ""}`

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
            comparison: result.comparison,
            challenge: result.challenge,
            measures: moduleDefinition.measures,
            doesNotClaim: moduleDefinition.doesNotClaim,
            evidence: selected.map(({ question, primary, secondary }) => ({
              question: question.title,
              primary: primary?.title ?? "No selection",
              ...(secondary?.title ? { secondary: secondary.title } : {}),
            })),
            laneSummaries: result.laneSummaries,
            ...(result.cardTypeRead ? { cardTypeRead: result.cardTypeRead } : {}),
            ...(Object.keys(result.cardTypeScores).length > 0
              ? { cardTypeScores: result.cardTypeScores }
              : {}),
            overlayDeltas: result.overlayDeltas,
          }}
        />

        <section className="result-section stack-md">
          <p className="eyebrow">Focus-area result</p>
          <h1>{result.headline}</h1>
          <p className="muted" style={{ lineHeight: "1.75", maxWidth: "760px" }}>
            {result.summary}
          </p>
          <div className="profile-module-grid">
            {result.laneSummaries.map((lane) => (
              <div key={lane.key} className="explore-card stack-sm">
                <div className="stack-xs">
                  <p className="eyebrow">{lane.label}</p>
                  <p style={{ lineHeight: "1.65", fontSize: "0.92rem" }}>{lane.summary}</p>
                </div>
                <div className="module-lane-meter stack-xs">
                  <div className="progress-meta">
                    <span>{lane.lowLabel}</span>
                    <span>{lane.score.toFixed(1)} / 7</span>
                  </div>
                  <div className="score-bar" aria-hidden="true">
                    <div className="score-fill" style={{ width: `${(lane.score / 7) * 100}%` }} />
                  </div>
                  <div className="progress-meta">
                    <span>{lane.lowLabel}</span>
                    <span>{lane.highLabel}</span>
                  </div>
                </div>
                {lane.delta ? (
                  <p className="muted" style={{ fontSize: "0.84rem", lineHeight: "1.55" }}>
                    <strong>Relative to Foundation:</strong> {lane.delta}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
          {result.comparison ? (
            <div className="callout stack-xs">
              <p style={{ fontWeight: 600 }}>How this differs from your Foundation</p>
              <p style={{ lineHeight: "1.65", fontSize: "0.92rem" }}>{result.comparison}</p>
            </div>
          ) : null}
          <div className="callout stack-xs">
            <p style={{ fontWeight: 600 }}>What this still does not settle</p>
            <p style={{ lineHeight: "1.65", fontSize: "0.92rem" }}>{result.challenge}</p>
          </div>
        </section>

        {result.cardTypeRead ? (
          <section className="result-section stack-md">
            <div className="stack-xs">
              <h2>{result.cardTypeRead.headline}</h2>
              <p className="muted" style={{ fontSize: "0.875rem", lineHeight: "1.65" }}>
                {hasActorLens
                  ? "Actor-lens cards are tracked separately so perspective-modeling does not overwrite your own issue read."
                  : "How the module changes when the question shifts from diagnosis to choice."}
              </p>
            </div>
            <p className="result-prose" style={{ lineHeight: "1.7" }}>
              {result.cardTypeRead.summary}
            </p>
          </section>
        ) : null}

        <section className="result-section stack-md">
          <h2>Recurring instincts</h2>
          <ul className="content-list result-prose">
            {result.instincts.map((instinct) => (
              <li key={instinct}>{instinct}</li>
            ))}
          </ul>
        </section>

        <section className="result-section stack-md">
          <h2>Tensions and caveats</h2>
          <p className="result-prose" style={{ lineHeight: "1.7" }}>{result.challenge}</p>
        </section>

        <section className="result-section stack-md">
          <div className="stack-xs">
            <h2>How to read this module</h2>
            <p className="muted" style={{ fontSize: "0.875rem" }}>
              Lower-level framing and scope notes kept below the main issue read.
            </p>
          </div>
          <details className="profile-details" open={!isStandard}>
            <summary>{isStandard ? "Open framing and scope notes" : "Framing and scope notes"}</summary>
            <div className="driver-grid" style={{ marginTop: "16px" }}>
              <div className="driver-card stack-xs">
                <p className="eyebrow">Mode</p>
                <p style={{ fontWeight: 600, fontFamily: "Georgia, serif" }}>
                  {mode === "standard" ? "Standard" : "Advanced"}
                </p>
                <p className="muted" style={{ fontSize: "0.86rem", lineHeight: "1.6" }}>
                  {questionCount} questions · {moduleDefinition.timeEstimate[mode]}
                </p>
              </div>
              <div className="driver-card stack-xs">
                <p className="eyebrow">In-flow shorthand</p>
                <p style={{ fontWeight: 600, fontFamily: "Georgia, serif" }}>
                  {moduleDefinition.shorthand}
                </p>
                <p className="muted" style={{ fontSize: "0.88rem", lineHeight: "1.65" }}>
                  This is an issue read, not a replacement for the Foundation baseline.
                </p>
              </div>
              <div className="driver-card stack-xs">
                <p className="eyebrow">What it measured</p>
                <p className="muted" style={{ fontSize: "0.88rem", lineHeight: "1.65" }}>
                  {moduleDefinition.measures.join("; ")}.
                </p>
              </div>
              <div className="driver-card stack-xs">
                <p className="eyebrow">What it did not claim</p>
                <p className="muted" style={{ fontSize: "0.88rem", lineHeight: "1.65" }}>
                  {moduleDefinition.doesNotClaim.join("; ")}.
                </p>
              </div>
            </div>
          </details>
        </section>

        <section className="result-section stack-md">
          <div className="stack-xs">
            <h2>Module profile</h2>
            <p className="muted" style={{ fontSize: "0.875rem" }}>
              Scores run from 1 to 7 inside this module. The labels below are qualitative poles,
              not population percentiles{hasActorLens ? ", and the main lane read is built from Explanation and Decision cards rather than Actor lens cards." : "."}
            </p>
          </div>

          <div>
            {moduleDefinition.axes.map((axis) => (
              <div key={axis.key} className="dim-row">
                <div className="progress-meta">
                  <span style={{ fontWeight: 600, color: "var(--text)" }}>{axis.label}</span>
                  <span>{result.scores[axis.key].toFixed(1)} / 7</span>
                </div>
                <div className="score-bar" style={{ margin: "6px 0" }} aria-hidden="true">
                  <div className="score-fill" style={{ width: `${(result.scores[axis.key] / 7) * 100}%` }} />
                </div>
                <div className="row gap-sm wrap" style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                  <span>{axis.lowLabel}</span>
                  <span>↔</span>
                  <span>{axis.highLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="result-section stack-md">
          <div className="stack-xs">
            <h2>Evidence log</h2>
            <p className="muted" style={{ fontSize: "0.875rem" }}>
              Lower-level recall of the framings you selected in this module.
            </p>
          </div>
          <details className="profile-details" open={!isStandard}>
            <summary>Selected framings</summary>
            <div className="driver-grid" style={{ marginTop: "16px" }}>
              {selected.map(({ question, primary, secondary }) => (
                <div key={question.id} className="driver-card stack-sm">
                  <div className="stack-xs">
                    <p className="eyebrow">{question.title}</p>
                    <p className="muted" style={{ fontSize: "0.8rem", lineHeight: "1.55" }}>
                      {laneLabelMap[question.lane] ?? question.lane} · {formatCardType(question.cardType)}
                    </p>
                    <p style={{ lineHeight: "1.6", fontSize: "0.9rem" }}>{question.prompt}</p>
                  </div>
                  <div className="stack-xs">
                    <span className="option-card-meta">Most persuasive</span>
                    <p style={{ fontWeight: 600, fontFamily: "Georgia, serif" }}>
                      {primary?.title ?? "No selection"}
                    </p>
                    <p className="muted" style={{ fontSize: "0.875rem", lineHeight: "1.6" }}>
                      {primary?.label ?? "This question was not answered."}
                    </p>
                  </div>
                  {secondary ? (
                    <div className="stack-xs">
                      <span className="option-card-meta option-card-meta--secondary">Second-most persuasive</span>
                      <p style={{ fontWeight: 600, fontFamily: "Georgia, serif" }}>{secondary.title}</p>
                      <p className="muted" style={{ fontSize: "0.85rem", lineHeight: "1.6" }}>
                        {secondary.label}
                      </p>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </details>
        </section>

        <section className="result-section stack-md">
          <div className="row gap-sm wrap">
            <Link
              href={foundationPayload ? `/modules?foundation=${encodeURIComponent(foundationPayload)}` : "/modules"}
              className="cta-primary"
            >
              Try another focus-area module
            </Link>
            <Link href={`/modules/${slug}${foundationPayload ? `?foundation=${encodeURIComponent(foundationPayload)}` : ""}`} className="cta-secondary">
              Retake this module
            </Link>
            {foundationPayload ? (
              <Link href={`/results/${foundationPayload}`} className="cta-secondary">
                Back to Foundation result
              </Link>
            ) : null}
            <Link href="/profile" className="cta-secondary">
              View profile
            </Link>
          </div>
        </section>
      </article>
    </div>
  )
}

function formatCardType(cardType: "explanation" | "decision" | "actorLens" | "both") {
  if (cardType === "explanation") return "Explanation"
  if (cardType === "decision") return "Decision"
  if (cardType === "actorLens") return "Actor lens"
  return "Both"
}
