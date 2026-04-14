import Link from "next/link"
import { decodeAiPayload, aiPayloadToAxisScores } from "@/lib/ai-governance-share"
import {
  archetypeLabelFromKey,
  archetypeDescriptions,
  buildAiGovernanceSummary,
  getAxisCards,
} from "@/lib/ai-governance-results"
import {
  buildAiGovernanceResultFromSharePayload,
  getClarityLabel,
  getHybridLabel,
} from "@/lib/ai-governance-results-v2"
import { AiGovernanceProfileSections } from "@/components/results/ai-governance-profile-sections"
import { AiGovernanceShareActions } from "@/components/results/ai-governance-share-actions"
import type { Metadata } from "next"

export async function generateMetadata(
  { params }: { params: Promise<{ payload: string }> },
): Promise<Metadata> {
  const { payload } = await params
  const decoded = decodeAiPayload(payload)
  if (!decoded) return { title: "Result — AI Governance Compass" }

  const label = archetypeLabelFromKey(decoded.ak)
  return {
    title: `${label} — AI Governance Compass`,
    description: `My AI governance profile: ${label} · ${decoded.rl} · ${decoded.pm}`,
  }
}

export default async function AiResultPage(
  { params }: { params: Promise<{ payload: string }> },
) {
  const { payload } = await params
  const decoded = decodeAiPayload(payload)

  if (!decoded) {
    return (
      <div className="container stack-lg" style={{ paddingTop: "48px" }}>
        <div className="panel stack-md">
          <p className="eyebrow">Invalid result</p>
          <h1>This link could not be decoded.</h1>
          <p className="muted" style={{ lineHeight: "1.65" }}>
            The result URL may be incomplete, corrupted, or from an older version of the compass.
          </p>
          <div className="row gap-sm" style={{ flexWrap: "wrap" }}>
            <Link href="/ai" className="cta-primary">Take the inventory</Link>
          </div>
        </div>
      </div>
    )
  }

  const axisScores = aiPayloadToAxisScores(decoded)
  const archetypeLabel = archetypeLabelFromKey(decoded.ak)
  const explanation = archetypeDescriptions[decoded.ak]
  const summary = buildAiGovernanceSummary(decoded.ak, axisScores, decoded.rl, decoded.pm)
  const axisCards = getAxisCards(axisScores)
  const profileResult = buildAiGovernanceResultFromSharePayload(decoded)
  const clarityLabel = getClarityLabel(profileResult.clarity)
  const hybridLabel = getHybridLabel(profileResult)

  return (
    <div className="wide-container">
      <article className="result-article">

        {/* ── 1. Hero ── */}
        <div className="result-hero">
          <div className="result-hero-rule" />
          <div
            style={{
              display: "grid",
              gap: "24px",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              alignItems: "start",
            }}
          >
            <div>
              <p className="eyebrow">AI Governance Compass</p>
              <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em", marginBottom: "12px" }}>
                {archetypeLabel}
              </h1>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
                <ModifierChip label={decoded.rl} />
                <ModifierChip label={decoded.pm} />
                <ModifierChip label={decoded.gm} />
              </div>

              <p style={{ fontSize: "1rem", lineHeight: "1.75", maxWidth: "720px", margin: 0 }}>
                {summary}
              </p>
            </div>

            <div className="callout stack-xs" style={{ maxWidth: "320px" }}>
              <p className="eyebrow">Profile clarity</p>
              <div>
                <p
                  style={{
                    fontSize: "2rem",
                    lineHeight: "1",
                    fontWeight: 700,
                    margin: 0,
                    color: "var(--text)",
                  }}
                >
                  {profileResult.clarity} / 100
                </p>
                <p className="muted" style={{ fontSize: "0.82rem", lineHeight: "1.6", margin: "8px 0 0" }}>
                  {clarityLabel}
                </p>
              </div>
              {hybridLabel ? (
                <div>
                  <p className="eyebrow" style={{ marginBottom: "6px" }}>Hybrid signal</p>
                  <p style={{ margin: 0, lineHeight: "1.6" }}>{hybridLabel}</p>
                </div>
              ) : null}
              <p className="muted" style={{ fontSize: "0.82rem", lineHeight: "1.65", margin: 0 }}>
                A higher score means your top archetype pulled more clearly ahead. Lower clarity means the result should be read as a more mixed profile.
              </p>
            </div>
          </div>
        </div>

        {/* ── 2. Explanation ── */}
        <div className="result-section stack-md">
          <div className="stack-xs">
            <h2>What this archetype means</h2>
          </div>
          <p style={{ lineHeight: "1.75", maxWidth: "680px" }}>{explanation}</p>
        </div>

        {/* ── 3. Axis profile ── */}
        <div className="result-section stack-md">
          <div className="stack-xs">
            <h2>Axis profile</h2>
            <p className="muted" style={{ fontSize: "0.875rem", lineHeight: "1.6" }}>
              Scores run from 1 to 7 inside this model. They are positions on each axis, not
              population percentiles.
            </p>
          </div>
          <div>
            {axisCards.map((card) => (
              <div key={card.axis} className="dim-row">
                <div className="progress-meta">
                  <span style={{ fontWeight: 600, color: "var(--text)" }}>{card.label}</span>
                  <span>{card.score.toFixed(1)} / 7</span>
                </div>
                <div className="score-bar" style={{ margin: "6px 0" }} aria-hidden="true">
                  <div className="score-fill" style={{ width: `${(card.score / 7) * 100}%` }} />
                </div>
                <p className="muted" style={{ fontSize: "0.8rem", lineHeight: "1.5" }}>
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <AiGovernanceProfileSections result={profileResult} />

        {/* ── 4. Methods note + share ── */}
        <div className="result-section stack-md">
          <div className="callout stack-xs">
            <p style={{ fontWeight: 600 }}>About this profile</p>
            <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.875rem" }}>
              Archetype labels are shorthand summaries, not verdicts. Scores measure positions
              inside this model and are not population percentiles. This is an early-stage
              inventory covering a defined set of AI governance debates — not the full field.
            </p>
          </div>

          <AiGovernanceShareActions
            payload={payload}
            archetypeLabel={archetypeLabel}
            riskLens={decoded.rl}
            paceModifier={decoded.pm}
            geopoliticsModifier={decoded.gm}
          />
        </div>

      </article>
    </div>
  )
}

function ModifierChip({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        fontSize: "0.75rem",
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        border: "1px solid var(--border)",
        borderRadius: "3px",
        color: "var(--muted)",
        background: "var(--panel-2)",
      }}
    >
      {label}
    </span>
  )
}
