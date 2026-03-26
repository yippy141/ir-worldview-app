import Link from "next/link"
import { decodePayload, payloadToDimensionScores } from "@/lib/share"
import {
  buildSummary,
  familyLabelFromKey,
  familyDescriptions,
  getKeyDrivers,
  getActiveTensions,
  neighborOverlapTexts,
  dimensionOneLiners,
  glossaryTerms,
  suggestedReadings,
  getSubtraditionAffinity,
  getIssueAreaTilts,
  getRunnerUpSeparation,
  getFlipAnalysis,
  getWhyThisResult,
  getComparisonDimensions,
} from "@/lib/result-helpers"
import { dimensionLabels } from "@/lib/quiz-schema"
import { familySlug } from "@/lib/worldview-config"
import { ShareActions } from "@/components/results/share-actions"
import { HistoryCompare } from "@/components/results/history-compare"
import { scoreFamilies } from "@/lib/scoring"
import type { DimensionKey, FamilyKey } from "@/lib/types"
import type { Metadata } from "next"

export async function generateMetadata(
  { params }: { params: Promise<{ payload: string }> },
): Promise<Metadata> {
  const { payload } = await params
  const data = decodePayload(payload)
  if (!data) return { title: "Result — IR Worldview Inventory" }
  return {
    title: `${familyLabelFromKey(data.fk)} — IR Worldview Inventory`,
    description: `My IR Worldview result: ${familyLabelFromKey(data.fk)} · ${data.sm} · ${data.nm}`,
  }
}

export default async function ResultPage(
  { params }: { params: Promise<{ payload: string }> },
) {
  const { payload } = await params
  const data = decodePayload(payload)

  if (!data) {
    return (
      <div className="container stack-lg" style={{ paddingTop: "48px" }}>
        <div className="panel stack-md">
          <p className="eyebrow">Invalid result</p>
          <h1>This link could not be decoded.</h1>
          <p className="muted" style={{ lineHeight: "1.65" }}>
            The result URL may be incomplete, corrupted, or from an older version of the inventory.
          </p>
          <div className="row gap-sm" style={{ flexWrap: "wrap" }}>
            <Link href="/quiz" className="cta-primary">Take the quiz</Link>
            <Link href="/explore" className="cta-secondary">Explore the perspectives</Link>
            <Link href="/method" className="cta-secondary">Methods</Link>
          </div>
        </div>
      </div>
    )
  }

  const dimensionScores = payloadToDimensionScores(data)
  const familyScores = scoreFamilies(dimensionScores)
  const familyLabel = familyLabelFromKey(data.fk)
  const neighborLabel = familyLabelFromKey(data.nk)
  const summary = buildSummary(data.fk, dimensionScores)
  const explanation = familyDescriptions[data.fk]
  const keyDrivers = getKeyDrivers(dimensionScores)
  const tensions = getActiveTensions(dimensionScores)
  const neighborText = neighborOverlapTexts[data.fk]?.[data.nk] ?? ""
  const readings = suggestedReadings[data.fk]
  const neighborReadings = suggestedReadings[data.nk]
  const subtraditionAffinity = getSubtraditionAffinity(data.fk, dimensionScores)
  const issueAreaTilts = getIssueAreaTilts(data.fk, dimensionScores)
  const runnerUpSeparation = getRunnerUpSeparation(data.fk, data.nk, dimensionScores)
  const flipAnalysis = getFlipAnalysis(data.fk, data.nk, dimensionScores)
  const whyThisResult = getWhyThisResult(data.fk, data.nk, dimensionScores)
  const comparisonDims = getComparisonDimensions(data.fk, data.nk, dimensionScores)

  return (
    <div className="wide-container">
      <article className="result-article">
        {/* 1. Hero */}
        <div className="result-hero">
          <p className="eyebrow">Your worldview profile</p>
          <h1 style={{ marginTop: "8px" }}>{familyLabel}</h1>
          <p style={{ fontSize: "1.05rem", color: "var(--muted)", marginTop: "8px" }}>
            {data.sm} · {data.nm}
          </p>
          <p
            className="muted"
            style={{
              fontSize: "0.8rem",
              fontStyle: "italic",
              marginTop: "20px",
              paddingTop: "16px",
              borderTop: "1px solid var(--border)",
              lineHeight: "1.55",
            }}
          >
            Prototype classification — not a validated psychometric diagnosis. Treat this as a
            starting point for reflection.
          </p>
        </div>

        {/* 2. Plain-English summary */}
        <div className="result-section stack-sm">
          <p className="eyebrow">In plain English</p>
          <p style={{ fontSize: "1.05rem", lineHeight: "1.75" }}>{summary}</p>
          <p className="muted" style={{ lineHeight: "1.65" }}>{explanation}</p>
        </div>

        {/* 3. Key drivers */}
        <div className="result-section stack-md">
          <h2>What most drove your result</h2>
          <div className="driver-grid">
            {keyDrivers.map((driver) => (
              <div key={driver.dimension} className="driver-card stack-xs">
                <p className="eyebrow">{driver.type}</p>
                <p style={{ fontWeight: 600, fontFamily: "Georgia, serif", marginTop: "6px" }}>
                  {driver.label}
                </p>
                <p className="muted" style={{ fontSize: "0.85rem", lineHeight: "1.55", marginTop: "6px" }}>
                  {driver.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Subtradition affinity */}
        {subtraditionAffinity ? (
          <div className="result-section stack-sm">
            <p className="eyebrow">Within your primary family</p>
            <p style={{ fontWeight: 600, fontFamily: "Georgia, serif", fontSize: "1rem", marginTop: "4px" }}>
              {subtraditionAffinity.name}
            </p>
            <p className="muted" style={{ lineHeight: "1.65" }}>
              {subtraditionAffinity.note}
            </p>
          </div>
        ) : null}

        {/* 5. Why this result won */}
        <div className="result-section stack-md">
          <h2>Why this result won</h2>
          <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
            The dimensions that most clearly distinguished your primary result from the runner-up.
          </p>
          <ul className="content-list">
            {whyThisResult.map((bullet, i) => (
              <li key={i}>{bullet}</li>
            ))}
          </ul>
        </div>

        {/* 6. Tensions */}
        <div className="result-section stack-md">
          <h2>Where you are mixed</h2>
          {tensions.length > 0 ? (
            <div className="stack-sm">
              {tensions.map((tension) => (
                <div key={tension.key} className="tension-item">
                  <p style={{ lineHeight: "1.65" }}>{tension.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted" style={{ lineHeight: "1.65" }}>
              Your profile shows relatively consistent views across dimensions without strong internal
              tensions — your theoretical instincts appear well-integrated.
            </p>
          )}
        </div>

        {/* 7. Issue-area tilts */}
        {issueAreaTilts.length > 0 ? (
          <div className="result-section stack-md">
            <h2>Where your instincts cross boundaries</h2>
            <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
              Issue areas where your dimension scores suggest a different instinct than your primary
              classification would predict on its own.
            </p>
            <div>
              {issueAreaTilts.map((tilt) => (
                <div key={tilt.issue} className="issue-tilt-row">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px", flexWrap: "wrap", marginBottom: "6px" }}>
                    <p style={{ fontWeight: 600, fontFamily: "Georgia, serif" }}>{tilt.issue}</p>
                    <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--accent-light)", textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0 }}>
                      {tilt.tilt}
                    </p>
                  </div>
                  <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
                    {tilt.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* 8. Dimension profile */}
        <div className="result-section stack-md">
          <div className="stack-xs">
            <h2>Dimension profile</h2>
            <p className="muted" style={{ fontSize: "0.875rem" }}>
              Scores run from 1 to 7. These reflect your positions within this model — not population
              percentiles or validated measurements.
            </p>
          </div>
          <div>
            {(Object.entries(dimensionScores) as [DimensionKey, number][]).map(([dim, value]) => (
              <div key={dim} className="dim-row">
                <div className="progress-meta">
                  <span style={{ fontWeight: 600, color: "var(--text)" }}>
                    {dimensionLabels[dim]}
                  </span>
                  <span>{value.toFixed(1)} / 7</span>
                </div>
                <div className="score-bar" style={{ margin: "6px 0" }} aria-hidden="true">
                  <div className="score-fill" style={{ width: `${(value / 7) * 100}%` }} />
                </div>
                <p className="muted" style={{ fontSize: "0.8rem", lineHeight: "1.5" }}>
                  {dimensionOneLiners[dim](value)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 9. Worldview fit */}
        <div className="result-section stack-md">
          <div className="stack-xs">
            <h2>Worldview fit</h2>
            <p className="muted" style={{ fontSize: "0.875rem" }}>
              Relative fit within this result — not population percentiles or absolute scores.
            </p>
          </div>
          <div className="family-fit-bars">
            {(Object.entries(familyScores) as [FamilyKey, number][])
              .sort((a, b) => b[1] - a[1])
              .map(([key, score], index) => {
                const allScores = Object.values(familyScores)
                const min = Math.min(...allScores)
                const max = Math.max(...allScores)
                const range = max - min
                const normalized = range > 0 ? ((score - min) / range) * 100 : 50
                const isPrimary = key === data.fk
                return (
                  <div
                    key={key}
                    className={`family-fit-row${isPrimary ? " family-fit-primary" : ""}`}
                  >
                    <span className="family-fit-label">{familyLabelFromKey(key)}</span>
                    <div className="family-fit-bar" aria-hidden="true">
                      <div
                        className="family-fit-fill"
                        style={{ width: `${normalized}%` }}
                      />
                    </div>
                    {index === 0 && <span className="family-fit-badge">Primary</span>}
                  </div>
                )
              })}
          </div>
        </div>

        {/* 10. Closest neighbor */}
        <div className="result-section stack-md">
          <h2>Closest neighboring worldview</h2>
          <div className="neighbor-columns">
            <div className="stack-xs">
              <p className="eyebrow">Primary family</p>
              <p
                style={{
                  fontWeight: 700,
                  fontFamily: "Georgia, serif",
                  fontSize: "1.1rem",
                  marginTop: "6px",
                }}
              >
                {familyLabel}
              </p>
            </div>
            <div className="stack-xs">
              <p className="eyebrow">Runner-up</p>
              <p
                style={{
                  fontWeight: 700,
                  fontFamily: "Georgia, serif",
                  fontSize: "1.1rem",
                  marginTop: "6px",
                }}
              >
                {neighborLabel}
              </p>
            </div>
          </div>
          {neighborText ? (
            <p className="muted" style={{ lineHeight: "1.65" }}>{neighborText}</p>
          ) : null}
          {runnerUpSeparation ? (
            <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
              {runnerUpSeparation}
            </p>
          ) : null}
          {flipAnalysis ? (
            <div className="flip-note">
              <p style={{ fontSize: "0.875rem", lineHeight: "1.65" }}>{flipAnalysis}</p>
            </div>
          ) : null}
          <p style={{ fontSize: "0.875rem" }}>
            <Link href={`/explore/${familySlug(data.nk)}`} style={{ color: "var(--accent)" }}>
              Learn more about {neighborLabel} →
            </Link>
          </p>
        </div>

        {/* 10. Primary vs runner-up comparison strip */}
        <div className="result-section stack-md">
          <h2>Where you diverge from your runner-up</h2>
          <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
            The three dimensions where {familyLabel} and {neighborLabel} expect the most different
            answers — and where your scores landed.
          </p>
          <div className="comparison-strip">
            <div className="comparison-header">
              <span className="comparison-label" />
              <span className="comparison-family">{familyLabel}</span>
              <span className="comparison-score-head">Your score</span>
              <span className="comparison-family">{neighborLabel}</span>
            </div>
            {comparisonDims.map((cd) => (
              <div key={cd.dim} className="comparison-row">
                <span className="comparison-label">{cd.label}</span>
                <span
                  className={`comparison-expected comparison-expected--${cd.primaryExpected}`}
                >
                  {cd.primaryExpected === "high"
                    ? "Higher"
                    : cd.primaryExpected === "low"
                      ? "Lower"
                      : "Neutral"}
                </span>
                <span className="comparison-score">{cd.userScore.toFixed(1)}</span>
                <span
                  className={`comparison-expected comparison-expected--${cd.runnerUpExpected}`}
                >
                  {cd.runnerUpExpected === "high"
                    ? "Higher"
                    : cd.runnerUpExpected === "low"
                      ? "Lower"
                      : "Neutral"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 12. Glossary */}
        <div className="result-section stack-md">
          <div className="stack-xs">
            <h2>Glossary</h2>
            <p className="muted" style={{ fontSize: "0.875rem" }}>
              Key terms used in your result, defined without assuming prior IR knowledge.
            </p>
          </div>
          <div>
            {glossaryTerms.map((term) => (
              <div key={term.term} className="definition-item">
                <p style={{ fontWeight: 600, marginBottom: "4px" }}>{term.term}</p>
                <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
                  {term.definition}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 13. Suggested reading — primary */}
        <div className="result-section stack-md">
          <div className="stack-xs">
            <h2>Suggested reading</h2>
            <p className="muted" style={{ fontSize: "0.875rem" }}>
              Three starting points matched to your primary worldview family.
            </p>
          </div>
          <div>
            {readings.map((item) => (
              <div key={item.title} className="reading-bib">
                <p style={{ fontWeight: 600 }}>{item.title}</p>
                <p className="muted" style={{ fontSize: "0.875rem", marginTop: "2px" }}>
                  {item.author}
                </p>
                <p style={{ fontSize: "0.875rem", lineHeight: "1.55", marginTop: "6px" }}>
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 14. Runner-up reading */}
        <div className="result-section stack-md">
          <div className="stack-xs">
            <h2>Reading for your runner-up</h2>
            <p className="muted" style={{ fontSize: "0.875rem" }}>
              Starting points for {neighborLabel} — the tradition that came closest to your primary
              result.
            </p>
          </div>
          <div>
            {neighborReadings.slice(0, 2).map((item) => (
              <div key={item.title} className="reading-bib">
                <p style={{ fontWeight: 600 }}>{item.title}</p>
                <p className="muted" style={{ fontSize: "0.875rem", marginTop: "2px" }}>
                  {item.author}
                </p>
                <p style={{ fontSize: "0.875rem", lineHeight: "1.55", marginTop: "6px" }}>
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 15. How to read this result */}
        <div className="result-section stack-md">
          <h2>How to read this result</h2>
          <ul className="content-list">
            <li>
              <strong>What this says about your instincts.</strong> Your result reflects which
              theoretical tradition best matches your pattern of responses — not which one you
              consciously endorse. The dimension scores show where you lean, and how strongly.
            </li>
            <li>
              <strong>What this does not mean.</strong> A classification is not a verdict. It does
              not measure expertise, knowledge, or moral standing. Most serious analysts draw on more
              than one tradition, and the runner-up family often matters as much as the primary one.
            </li>
            <li>
              <strong>Where you may be conditional rather than fixed.</strong> The issue-area tilts
              section above flags places where your instincts cross the boundaries your primary
              classification would predict. Those are worth reading carefully — they often reflect
              more considered views than the general pattern does.
            </li>
          </ul>
          <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.875rem" }}>
            If you retake this inventory in a year and get a different result, that can reflect real
            change in your thinking — or better self-understanding the second time. Both are useful.
          </p>
        </div>

        {/* 16. Methods note + share */}
        <div className="result-section stack-md">
          <div className="callout stack-xs">
            <p style={{ fontWeight: 600 }}>About this classification</p>
            <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.875rem" }}>
              This is a prototype, not a validated psychometric instrument. Branching logic is
              heuristic. Scores are comparative within this model and are not population percentiles.
              This is not a measure of knowledge, expertise, or moral correctness.{" "}
              <Link href="/method" style={{ color: "var(--accent)" }}>
                Read the full methods note →
              </Link>
            </p>
          </div>

          <p>
            <Link href={`/explore/${familySlug(data.fk)}`} style={{ color: "var(--accent)" }}>
              Explore {familyLabel} in depth →
            </Link>
          </p>

          <p>
            <Link href={`/feedback?result=${payload}`} style={{ color: "var(--accent)" }}>
              Share feedback on this inventory →
            </Link>
          </p>

          {/* Client component for share buttons + history compare */}
          <ShareActions
            payload={payload}
            familyLabel={familyLabel}
            strategyModifier={data.sm}
            normativeModifier={data.nm}
          />

          <HistoryCompare
            familyKey={data.fk}
            neighborKey={data.nk}
            strategyModifier={data.sm}
            normativeModifier={data.nm}
            dimensionScores={dimensionScores}
          />
        </div>
      </article>
    </div>
  )
}
