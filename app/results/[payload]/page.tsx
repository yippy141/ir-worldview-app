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
  getQuickTake,
  getWhyItMatters,
  getHowYouReadTheWorld,
  getBlindSpots,
  getPressureTestQuestions,
  getWhatCouldShift,
} from "@/lib/result-helpers"
import { dimensionLabels } from "@/lib/quiz-schema"
import { familySlug, familyTraditionClass } from "@/lib/worldview-config"
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

const TRADITION_COLOR: Record<FamilyKey, string> = {
  realist: "var(--t-realist)",
  institutionalist: "var(--t-institutionalist)",
  constructivist: "var(--t-constructivist)",
  criticalPoliticalEconomy: "var(--t-cpe)",
}

const TRADITION_RULE_CLASS: Record<FamilyKey, string> = {
  realist: "result-hero-rule--realist",
  institutionalist: "result-hero-rule--institutionalist",
  constructivist: "result-hero-rule--constructivist",
  criticalPoliticalEconomy: "result-hero-rule--cpe",
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
  const traditionClass = familyTraditionClass(data.fk)
  const traditionColor = TRADITION_COLOR[data.fk]
  const ruleClass = TRADITION_RULE_CLASS[data.fk]

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

  const quickTake = getQuickTake(data.fk)
  const whyItMatters = getWhyItMatters(data.fk)
  const issueStances = getHowYouReadTheWorld(data.fk, data.sm, data.nm)
  const blindSpots = getBlindSpots(data.fk)
  const pressureQuestions = getPressureTestQuestions(data.fk)
  const whatCouldShift = getWhatCouldShift(data.fk, data.nk, dimensionScores, data.sm, data.nm)

  return (
    <div className="wide-container">
      <article className="result-article">

        {/* ── 1. Hero ── */}
        <div className="result-hero">
          <div className={`result-hero-rule ${ruleClass}`} />
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
            <span className={`tradition-chip ${traditionClass}`}>{familyLabel}</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em", marginBottom: "8px" }}>
            {familyLabel}
          </h1>
          <p style={{ fontSize: "0.9rem", color: "var(--muted)", marginBottom: "16px" }}>
            {data.sm} · {data.nm}
          </p>
          <p style={{ fontSize: "1rem", lineHeight: "1.75", maxWidth: "580px", marginBottom: "10px" }}>
            {summary}
          </p>
          <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.65", maxWidth: "580px" }}>
            {explanation}
          </p>
          <p style={{
            fontSize: "0.78rem",
            fontStyle: "italic",
            color: "var(--muted)",
            marginTop: "20px",
            paddingTop: "16px",
            borderTop: "1px solid var(--border)",
            lineHeight: "1.5",
          }}>
            Prototype classification. Not a validated instrument. Use as a starting point.
          </p>
        </div>

        {/* ── 2. Quick take ── */}
        <div className="result-section stack-sm">
          <p className="eyebrow">Quick take</p>
          <div className="quick-take-grid">
            <div className="quick-take-item">
              <p className="quick-take-label">Notices first</p>
              <p className="quick-take-text">{quickTake.noticesFirst}</p>
            </div>
            <div className="quick-take-item">
              <p className="quick-take-label">Tends to discount</p>
              <p className="quick-take-text">{quickTake.tendsToDiscount}</p>
            </div>
            <div className="quick-take-item">
              <p className="quick-take-label">In practice</p>
              <p className="quick-take-text">{quickTake.inPractice}</p>
            </div>
          </div>
        </div>

        {/* ── 3. Why this matters ── */}
        <div className="result-section stack-md">
          <div className="stack-xs">
            <h2>What this worldview notices, discounts, and finds persuasive</h2>
          </div>
          <div className="result-prose">
            <div className="wtm-group">
              <p className="wtm-label">Notices first</p>
              <ul className="wtm-list">
                {whyItMatters.notices.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div className="wtm-group">
              <p className="wtm-label">Tends to discount</p>
              <ul className="wtm-list">
                {whyItMatters.discounts.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div className="wtm-group">
              <p className="wtm-label">Arguments likely to persuade</p>
              <ul className="wtm-list">
                {whyItMatters.persuasive.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* ── 4. How you'd likely read the world ── */}
        <div className="result-section stack-md">
          <div className="stack-xs">
            <h2>How you would likely read the world</h2>
            <p className="muted" style={{ fontSize: "0.85rem" }}>
              Five issue areas. Generated from your primary family, runner-up, strategy modifier,
              and normative modifier. Not derived from raw answer data.
            </p>
          </div>
          <div className="result-prose">
            {issueStances.map((stance) => (
              <div key={stance.issue} className="issue-module">
                <p className="issue-module-title">{stance.issue}</p>
                <p className="issue-module-text">{stance.text}</p>
              </div>
            ))}
          </div>
          {issueAreaTilts.length > 0 && (
            <div className="result-prose" style={{ marginTop: "8px" }}>
              <p className="muted" style={{ fontSize: "0.8rem", fontStyle: "italic", marginBottom: "12px" }}>
                Where your scores suggest a different instinct than your primary classification would
                predict:
              </p>
              <div>
                {issueAreaTilts.map((tilt) => (
                  <div key={tilt.issue} className="issue-tilt-row">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px", flexWrap: "wrap", marginBottom: "4px" }}>
                      <p style={{ fontWeight: 600, fontFamily: "Georgia, serif", fontSize: "0.875rem" }}>
                        {tilt.issue}
                      </p>
                      <p style={{ fontSize: "0.68rem", fontWeight: 600, color: traditionColor, textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0 }}>
                        {tilt.tilt}
                      </p>
                    </div>
                    <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.85rem" }}>
                      {tilt.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── 5. Blind spots ── */}
        <div className="result-section stack-md">
          <h2>Blind spots and counterarguments</h2>
          <div className="result-prose">
            <div className="blind-item">
              <p className="blind-item-label">Explains well</p>
              <p className="blind-item-text">{blindSpots.explainsWell}</p>
            </div>
            <div className="blind-item">
              <p className="blind-item-label">Tends to miss</p>
              <p className="blind-item-text">{blindSpots.tendsMiss}</p>
            </div>
            <div className="blind-item">
              <p className="blind-item-label">
                Rival argument — from {familyLabelFromKey(blindSpots.rivalFamily)}
              </p>
              <p className="blind-item-text rival">{blindSpots.rivalArgument}</p>
            </div>
          </div>
        </div>

        {/* ── 6. What could shift your result ── */}
        <div className="result-section stack-md">
          <h2>What could shift your result</h2>
          <ul className="content-list result-prose">
            {whatCouldShift.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>

        {/* ── 7. Key drivers ── */}
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
          {subtraditionAffinity && (
            <div className="result-prose" style={{ marginTop: "4px" }}>
              <p style={{ fontWeight: 600, fontFamily: "Georgia, serif", fontSize: "0.95rem" }}>
                {subtraditionAffinity.name}
              </p>
              <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.875rem", marginTop: "6px" }}>
                {subtraditionAffinity.note}
              </p>
            </div>
          )}
          <div className="result-prose">
            <p className="muted" style={{ fontSize: "0.85rem", marginBottom: "8px" }}>
              Why this result won over the runner-up:
            </p>
            <ul className="content-list">
              {whyThisResult.map((bullet, i) => <li key={i}>{bullet}</li>)}
            </ul>
          </div>
        </div>

        {/* ── 8. Dimension profile ── */}
        <div className="result-section stack-md">
          <div className="stack-xs">
            <h2>Dimension profile</h2>
            <p className="muted" style={{ fontSize: "0.875rem" }}>
              Scores from 1 to 7. Positions within this model, not population percentiles.
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

        {/* ── 9. Worldview fit ── */}
        <div className="result-section stack-md">
          <div className="stack-xs">
            <h2>Worldview fit</h2>
            <p className="muted" style={{ fontSize: "0.875rem" }}>
              Relative fit within this result. Not population percentiles.
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
                        style={{
                          width: `${normalized}%`,
                          background: isPrimary ? traditionColor : undefined,
                        }}
                      />
                    </div>
                    {index === 0 && (
                      <span className="family-fit-badge" style={{ color: traditionColor }}>
                        Primary
                      </span>
                    )}
                  </div>
                )
              })}
          </div>
        </div>

        {/* ── 10. Tensions ── */}
        <div className="result-section stack-md">
          <h2>Where you are mixed</h2>
          <div className="result-prose">
            {tensions.length > 0 ? (
              <div className="stack-sm">
                {tensions.map((tension) => (
                  <div key={tension.key} className="tension-item">
                    <p style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>{tension.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted" style={{ lineHeight: "1.65" }}>
                Your profile shows consistent views across dimensions without strong internal tensions.
              </p>
            )}
          </div>
        </div>

        {/* ── 11. Pressure-test ── */}
        <div className="result-section stack-md">
          <div className="stack-xs">
            <h2>Pressure-test your worldview</h2>
            <p className="muted" style={{ fontSize: "0.875rem" }}>
              Three questions designed to probe the limits of this framework.
            </p>
          </div>
          <ol className="pressure-list result-prose">
            {pressureQuestions.map((q, i) => (
              <li key={i} className="pressure-q">
                <p>{q}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* ── 12. Neighbor overlap ── */}
        <div className="result-section stack-md">
          <h2>Closest neighboring worldview</h2>
          <div className="neighbor-columns">
            <div className="stack-xs">
              <p className="eyebrow">Primary</p>
              <p style={{ fontWeight: 700, fontFamily: "Georgia, serif", fontSize: "1.05rem", marginTop: "6px" }}>
                {familyLabel}
              </p>
            </div>
            <div className="stack-xs">
              <p className="eyebrow">Runner-up</p>
              <p style={{ fontWeight: 700, fontFamily: "Georgia, serif", fontSize: "1.05rem", marginTop: "6px" }}>
                {neighborLabel}
              </p>
            </div>
          </div>
          <div className="result-prose stack-md">
            {neighborText && (
              <p className="muted" style={{ lineHeight: "1.65" }}>{neighborText}</p>
            )}
            {runnerUpSeparation && (
              <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
                {runnerUpSeparation}
              </p>
            )}
            {flipAnalysis && (
              <div className="flip-note">
                <p style={{ fontSize: "0.875rem", lineHeight: "1.65" }}>{flipAnalysis}</p>
              </div>
            )}
          </div>
          <div style={{ marginTop: "20px" }}>
            <p className="muted" style={{ fontSize: "0.85rem", marginBottom: "10px" }}>
              Dimensions where {familyLabel} and {neighborLabel} diverge most:
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
                  <span className={`comparison-expected comparison-expected--${cd.primaryExpected}`}>
                    {cd.primaryExpected === "high" ? "Higher" : cd.primaryExpected === "low" ? "Lower" : "Neutral"}
                  </span>
                  <span className="comparison-score">{cd.userScore.toFixed(1)}</span>
                  <span className={`comparison-expected comparison-expected--${cd.runnerUpExpected}`}>
                    {cd.runnerUpExpected === "high" ? "Higher" : cd.runnerUpExpected === "low" ? "Lower" : "Neutral"}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p style={{ fontSize: "0.875rem", marginTop: "16px" }}>
            <Link href={`/explore/${familySlug(data.nk)}`} style={{ color: "var(--accent)" }}>
              Learn more about {neighborLabel} →
            </Link>
          </p>
        </div>

        {/* ── 13. Suggested reading ── */}
        <div className="result-section stack-md">
          <div className="stack-xs">
            <h2>Suggested reading</h2>
            <p className="muted" style={{ fontSize: "0.875rem" }}>
              Three starting points for your primary worldview. Two for the runner-up.
            </p>
          </div>
          <div>
            {readings.map((item) => (
              <div key={item.title} className="reading-bib">
                <p style={{ fontWeight: 600 }}>{item.title}</p>
                <p className="muted" style={{ fontSize: "0.875rem", marginTop: "2px" }}>{item.author}</p>
                <p style={{ fontSize: "0.875rem", lineHeight: "1.55", marginTop: "6px" }}>{item.note}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="muted" style={{ fontSize: "0.875rem", marginBottom: "8px" }}>
              Also worth reading — {neighborLabel}:
            </p>
            {neighborReadings.slice(0, 2).map((item) => (
              <div key={item.title} className="reading-bib">
                <p style={{ fontWeight: 600 }}>{item.title}</p>
                <p className="muted" style={{ fontSize: "0.875rem", marginTop: "2px" }}>{item.author}</p>
                <p style={{ fontSize: "0.875rem", lineHeight: "1.55", marginTop: "6px" }}>{item.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 14. Glossary ── */}
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

        {/* ── 15. Methods note + share ── */}
        <div className="result-section stack-md">
          <div className="callout stack-xs">
            <p style={{ fontWeight: 600 }}>About this classification</p>
            <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.875rem" }}>
              Prototype, not a validated psychometric instrument. Branching logic is heuristic.
              Scores are comparative within this model, not population percentiles.{" "}
              <Link href="/method" style={{ color: "var(--accent)" }}>
                Full methods note →
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
