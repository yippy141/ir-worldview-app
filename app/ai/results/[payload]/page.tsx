import Link from "next/link"
import { decodeAiPayload, aiPayloadToAxisScores } from "@/lib/ai-governance-share"
import {
  archetypeLabelFromKey,
  archetypeDescriptions,
  buildAiGovernanceSummary,
  getAxisCards,
  getActiveAiGovernanceTensions,
} from "@/lib/ai-governance-results"
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
  const neighborLabel = archetypeLabelFromKey(decoded.nk)
  const explanation = archetypeDescriptions[decoded.ak]
  const neighborExplanation = archetypeDescriptions[decoded.nk]
  const summary = buildAiGovernanceSummary(decoded.ak, axisScores, decoded.rl, decoded.pm)
  const axisCards = getAxisCards(axisScores)
  const tensions = getActiveAiGovernanceTensions(axisScores)

  return (
    <div className="wide-container">
      <article className="result-article">

        {/* ── 1. Hero ── */}
        <div className="result-hero">
          <div className="result-hero-rule" />
          <p className="eyebrow">AI Governance Compass</p>
          <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em", marginBottom: "12px" }}>
            {archetypeLabel}
          </h1>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
            <ModifierChip label={decoded.rl} />
            <ModifierChip label={decoded.pm} />
            <ModifierChip label={decoded.gm} />
          </div>

          <p style={{ fontSize: "1rem", lineHeight: "1.75", maxWidth: "720px" }}>
            {summary}
          </p>
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

        {/* ── 4. Tensions ── */}
        {tensions.length > 0 ? (
          <div className="result-section stack-md">
            <div className="stack-xs">
              <h2>Internal tensions</h2>
              <p className="muted" style={{ fontSize: "0.875rem", lineHeight: "1.6" }}>
                These are places where your scores pull in directions that are coherent but require
                deliberate resolution in practice.
              </p>
            </div>
            <div className="stack-sm">
              {tensions.map((tension) => (
                <div key={tension.key} className="callout">
                  <p style={{ lineHeight: "1.7", fontSize: "0.9rem" }}>{tension.text}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* ── 5. Neighboring archetype ── */}
        <div className="result-section stack-md">
          <div className="stack-xs">
            <h2>Closest neighboring archetype</h2>
            <p className="muted" style={{ fontSize: "0.875rem", lineHeight: "1.6" }}>
              The runner-up in the scoring. The gap between your primary and this archetype is part
              of the result, not noise.
            </p>
          </div>
          <div className="driver-card stack-xs" style={{ maxWidth: "640px" }}>
            <p className="eyebrow">Runner-up</p>
            <p style={{ fontWeight: 700, fontFamily: "Georgia, serif", fontSize: "1.05rem", marginTop: "6px" }}>
              {neighborLabel}
            </p>
            <p className="muted" style={{ fontSize: "0.875rem", lineHeight: "1.65", marginTop: "8px" }}>
              {neighborExplanation}
            </p>
          </div>
        </div>

        {/* ── 6. Methods note + share ── */}
        <div className="result-section stack-md">
          <div className="callout stack-xs">
            <p style={{ fontWeight: 600 }}>About this profile</p>
            <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.875rem" }}>
              This is a prototype compass for structured reflection, not a validated psychometric
              instrument. Archetype labels are shorthand summaries of a multidimensional axis
              profile. Scores are positions inside this model and are not population percentiles.
              The inventory covers a curated subset of AI governance debates and does not claim
              exhaustive coverage.
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
