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
} from "@/lib/result-helpers"
import { dimensionLabels } from "@/lib/quiz-schema"
import { familySlug } from "@/lib/worldview-config"
import { ShareActions } from "@/components/results/share-actions"
import { DimensionKey } from "@/lib/types"
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

        {/* 5. Tensions */}
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

        {/* 6. Issue-area tilts */}
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

        {/* 7. Dimension profile */}
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

        {/* 8. Closest neighbor */}
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

        {/* 9. Glossary */}
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

        {/* 10. Suggested reading — primary */}
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

        {/* 11. Runner-up reading */}
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

        {/* 12. Methods note + share */}
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

          {/* Client component for share buttons */}
          <ShareActions
            payload={payload}
            familyLabel={familyLabel}
            strategyModifier={data.sm}
            normativeModifier={data.nm}
          />
        </div>
      </article>
    </div>
  )
}
