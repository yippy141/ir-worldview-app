import Link from "next/link"
import {
  buildModuleResult,
  getModuleDefinition,
  getModuleQuestions,
  getSelectedModuleOptions,
} from "@/lib/modules/framework"
import type { ModuleAnswers, ModuleSlug } from "@/lib/modules/types"
import type { DimensionScores, QuizMode } from "@/lib/types"

export function ModuleResultView({
  slug,
  mode,
  answers,
  foundation,
  foundationPayload,
}: {
  slug: ModuleSlug
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

  return (
    <div className="stack-lg">
      <article className="result-article">
        <section className="result-section stack-md">
          <p className="eyebrow">Module result</p>
          <h1>{result.headline}</h1>
          <p className="muted" style={{ lineHeight: "1.75", maxWidth: "760px" }}>
            {result.summary}
          </p>
          <div className="driver-grid">
            <div className="driver-card stack-xs">
              <p className="eyebrow">Mode</p>
              <p style={{ fontWeight: 600, fontFamily: "Georgia, serif" }}>
                {mode === "standard" ? "Standard" : "Analyst"}
              </p>
              <p className="muted" style={{ fontSize: "0.86rem", lineHeight: "1.6" }}>
                {questionCount} questions · {moduleDefinition.timeEstimate[mode]}
              </p>
            </div>
            <div className="driver-card stack-xs">
              <p className="eyebrow">Reading this result</p>
              <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.65" }}>
                This is a domain-specific read on {moduleDefinition.shortTitle.toLowerCase()}. It
                can compare back to the foundation when available, but it does not replace that
                profile.
              </p>
            </div>
          </div>
        </section>

        <section className="result-section stack-md">
          <div className="stack-xs">
            <h2>Module profile</h2>
            <p className="muted" style={{ fontSize: "0.875rem" }}>
              Scores run from 1 to 7 inside this module. The labels below are qualitative poles,
              not population percentiles.
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
          <h2>Recurring instincts</h2>
          <ul className="content-list result-prose">
            {result.instincts.map((instinct) => (
              <li key={instinct}>{instinct}</li>
            ))}
          </ul>
        </section>

        {result.comparison ? (
          <section className="result-section stack-md">
            <h2>How this compares to your foundation</h2>
            <div className="callout">
              <p style={{ lineHeight: "1.65", fontSize: "0.92rem" }}>{result.comparison}</p>
            </div>
          </section>
        ) : null}

        <section className="result-section stack-md">
          <h2>Selected framings</h2>
          <div className="driver-grid">
            {selected.map(({ question, primary, secondary }) => (
              <div key={question.id} className="driver-card stack-sm">
                <div className="stack-xs">
                  <p className="eyebrow">{question.title}</p>
                  <p className="muted" style={{ fontSize: "0.85rem", lineHeight: "1.6" }}>
                    {question.prompt}
                  </p>
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
                    <span className="option-card-meta option-card-meta--secondary">Second choice</span>
                    <p style={{ fontWeight: 600, fontFamily: "Georgia, serif" }}>{secondary.title}</p>
                    <p className="muted" style={{ fontSize: "0.85rem", lineHeight: "1.6" }}>
                      {secondary.label}
                    </p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="result-section stack-md">
          <h2>What might challenge this module view</h2>
          <p className="result-prose" style={{ lineHeight: "1.7" }}>{result.challenge}</p>
        </section>

        <section className="result-section stack-md">
          <div className="row gap-sm wrap">
            <Link
              href={foundationPayload ? `/modules?foundation=${encodeURIComponent(foundationPayload)}` : "/modules"}
              className="cta-primary"
            >
              Try another module
            </Link>
            <Link href={`/modules/${slug}${foundationPayload ? `?foundation=${encodeURIComponent(foundationPayload)}` : ""}`} className="cta-secondary">
              Retake this module
            </Link>
            {foundationPayload ? (
              <Link href={`/results/${foundationPayload}`} className="cta-secondary">
                Back to foundation result
              </Link>
            ) : null}
          </div>
        </section>
      </article>
    </div>
  )
}
