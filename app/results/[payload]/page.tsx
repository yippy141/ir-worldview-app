import Link from "next/link"
import { AtlasFingerprint } from "@/components/atlas/atlas-fingerprint"
import { AtlasPatternFamily } from "@/components/atlas/atlas-pattern-family"
import { ScaleBar } from "@/components/visual-primitives"
import { ResultCardHeroShare } from "@/components/results/result-card-hero-share"
import { getAtlasPatternHref, matchAtlasLiteFoundation } from "@/lib/atlas-lite"
import { resolveFoundationPayload } from "@/lib/share"
import {
  buildProfileTitle,
  familyLabelFromKey,
  getClosestTraditions,
  getKeyDrivers,
  getActiveTensions,
  getFoundationSurprisingFinding,
  neighborOverlapTexts,
  dimensionOneLiners,
  glossaryTerms,
  suggestedReadings,
  getStrongLenses,
  getSubtraditionAffinity,
  getIssueAreaTilts,
  getRunnerUpSeparation,
  getFlipAnalysis,
  getWhyThisResult,
  getComparisonDimensions,
  getHowYouReadTheWorld,
  getPressureTestQuestions,
} from "@/lib/result-helpers"
import { dimensionLabels } from "@/lib/quiz-schema"
import { buildFoundationNarrative } from "@/lib/narrative/foundation"
import { buildFoundationPayoff } from "@/lib/results/foundation-payoff"
import { familySlug } from "@/lib/worldview-config"
import { ShareActions } from "@/components/results/share-actions"
import { HistoryCompare } from "@/components/results/history-compare"
import { FoundationProfileSync } from "@/components/profile/foundation-profile-sync"
import { ReadingPathSection } from "@/components/results/reading-path-section"
import { ResearchOptIn } from "@/components/research/research-opt-in"
import { modules } from "@/lib/modules/framework"
import type { DimensionKey, FamilyKey } from "@/lib/types"
import type { Metadata } from "next"

export async function generateMetadata(
  { params }: { params: Promise<{ payload: string }> },
): Promise<Metadata> {
  const { payload } = await params
  const resolved = resolveFoundationPayload(payload)
  if (!resolved) {
    const title = "Shared IR result — IR Worldview Inventory"
    const description =
      "Open a shared IR Worldview Inventory result, or take the Foundation questionnaire to generate your own profile."

    return buildResultMetadata(title, description)
  }

  const familyLabel = resolved.result.familyLabel
  const resultLabel = `${familyLabel} · ${resolved.result.strategyModifier} · ${resolved.result.normativeModifier}`
  const title = `${familyLabel} result — IR Worldview Inventory`
  const description =
    `Shared IR Worldview result: ${resultLabel}. See the closest modeled tradition, modifiers, and dimension profile.`

  return buildResultMetadata(title, description)
}

function buildResultMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  }
}

const TRADITION_COLOR: Record<FamilyKey, string> = {
  realist: "var(--t-realist)",
  institutionalist: "var(--t-institutionalist)",
  constructivist: "var(--t-constructivist)",
  criticalPoliticalEconomy: "var(--t-cpe)",
}

const FAMILY_ACCENT: Record<FamilyKey, "realist" | "institutionalist" | "constructivist" | "cpe"> = {
  realist: "realist",
  institutionalist: "institutionalist",
  constructivist: "constructivist",
  criticalPoliticalEconomy: "cpe",
}

const STRATEGY_STYLE_NOTES = {
  Restrainer:
    "You lean toward limiting commitments and avoiding overextension rather than pressing every available advantage.",
  Hedger:
    "You keep both competition and restraint live. The strategic answer depends on the case, not a fixed rule.",
  Maximizer:
    "You are comparatively more willing to press for durable advantage when the strategic opening looks real.",
} as const

const NORMATIVE_STYLE_NOTES = {
  Pluralist:
    "You usually give order, sovereignty, and precedent more weight than wider moral claims when they collide.",
  "Conditional Solidarist":
    "You treat order and justice as a live tension. Neither side settles the question in advance.",
  Universalist:
    "You are more willing to let severe moral stakes override sovereignty in extreme cases.",
} as const

export default async function ResultPage(
  { params }: { params: Promise<{ payload: string }> },
) {
  const { payload } = await params
  const resolved = resolveFoundationPayload(payload)

  if (!resolved) {
    return (
      <div className="container stack-lg" style={{ paddingTop: "48px" }}>
        <div className="panel stack-md">
          <p className="eyebrow">Invalid result</p>
          <h1>This link could not be decoded.</h1>
          <p className="muted" style={{ lineHeight: "1.65" }}>
            The result URL may be incomplete, corrupted, or from an older version of the inventory.
          </p>
          <div className="row gap-sm" style={{ flexWrap: "wrap" }}>
            <Link href="/quiz" className="cta-primary">Take the Foundation</Link>
            <Link href="/explore" className="cta-secondary">Explore the perspectives</Link>
            <Link href="/method" className="cta-secondary">Methods</Link>
          </div>
        </div>
      </div>
    )
  }

  const { dimensionScores, result } = resolved
  const familyScores = result.familyScores
  const closestTraditions = getClosestTraditions(familyScores)
  const familyLabel = result.familyLabel
  const neighborKey = result.runnerUpKey
  const neighborLabel = result.runnerUpLabel
  const traditionColor = TRADITION_COLOR[result.familyKey]
  const accentVariant = FAMILY_ACCENT[result.familyKey]

  const profileTitle = buildProfileTitle(dimensionScores)
  const explanation = result.explanation
  const keyDrivers = getKeyDrivers(dimensionScores)
  const topDimensions = getTopDimensionScores(dimensionScores)
  const strongLenses = getStrongLenses(dimensionScores)
  const tensions = getActiveTensions(dimensionScores)
  const surprisingFinding = getFoundationSurprisingFinding(
    result.familyKey,
    neighborKey,
    dimensionScores,
  )
  const neighborText = neighborOverlapTexts[result.familyKey]?.[neighborKey] ?? ""
  const readings = suggestedReadings[result.familyKey]
  const neighborReadings = suggestedReadings[neighborKey]
  const subtraditionAffinity = getSubtraditionAffinity(result.familyKey, dimensionScores)
  const issueAreaTilts = getIssueAreaTilts(result.familyKey, dimensionScores)
  const runnerUpSeparation = getRunnerUpSeparation(result.familyKey, neighborKey, dimensionScores)
  const flipAnalysis = getFlipAnalysis(result.familyKey, neighborKey, dimensionScores)
  const whyThisResult = getWhyThisResult(result.familyKey, neighborKey, dimensionScores)
  const comparisonDims = getComparisonDimensions(result.familyKey, neighborKey, dimensionScores)
  const foundationNarrative = buildFoundationNarrative({
    familyKey: result.familyKey,
    runnerUpKey: neighborKey,
    strategyModifier: result.strategyModifier,
    normativeModifier: result.normativeModifier,
    dimensionScores,
  })
  const summary = foundationNarrative.summary

  const issueStances = getHowYouReadTheWorld(
    result.familyKey,
    result.strategyModifier,
    result.normativeModifier,
  )
  const foundationPayoff = buildFoundationPayoff({
    dimensionScores,
    familyKey: result.familyKey,
    familyLabel,
    runnerUpKey: neighborKey,
    runnerUpLabel: neighborLabel,
    strategyModifier: result.strategyModifier,
    normativeModifier: result.normativeModifier,
  })
  const pressureQuestions = getPressureTestQuestions(result.familyKey)
  const mixedNote = tensions[0]?.text ?? getFallbackMixedNote(foundationNarrative.state, closestTraditions.note)
  const deepFoundationSections = foundationNarrative.sections
  const atlasMatch = matchAtlasLiteFoundation({
    familyKey: result.familyKey,
    runnerUpKey: neighborKey,
    strategyModifier: result.strategyModifier,
    normativeModifier: result.normativeModifier,
    dimensionScores,
    foundationState: foundationNarrative.state,
  })
  const readingPaths = [
    {
      key: "start-here",
      heading: "Start here",
      subheading:
        "Read the modeled tradition page first, then begin with one anchor text before you widen the frame.",
      entries: readings.slice(0, 1).map((item) => ({
        id: `${result.familyKey}-${item.title}`,
        title: item.title,
        author: item.author,
        note: item.note,
      })),
      links: [
        {
          href: `/explore/${familySlug(result.familyKey)}`,
          label: `Read ${familyLabel}`,
          text: "See the tradition guide, issue readings, and critique shelf in one place.",
        },
      ],
    },
    {
      key: "go-deeper",
      heading: "Go deeper",
      subheading:
        "Stay with the nearest fit long enough to see its internal variation, methods, and adjacent debates.",
      entries: readings.slice(1).map((item) => ({
        id: `${result.familyKey}-${item.title}`,
        title: item.title,
        author: item.author,
        note: item.note,
      })),
      links: [
        {
          href: "/references",
          label: "Browse references",
          text: "Use the wider bibliography when you want more than the result-page shelf.",
        },
        {
          href: "/method",
          label: "Read methods",
          text: "See the model limits, terminology choices, and why the labels stay interpretive.",
        },
      ],
    },
    {
      key: "challenge-your-view",
      heading: "Challenge your view",
      subheading:
        `Read the nearest runner-up and test the profile in harder issue settings rather than treating the top label as closed.`,
      entries: neighborReadings.slice(0, 2).map((item) => ({
        id: `${neighborKey}-${item.title}`,
        title: item.title,
        author: item.author,
        note: item.note,
      })),
      links: [
        {
          href: `/explore/${familySlug(neighborKey)}`,
          label: `Read ${neighborLabel}`,
          text: "Read the closest alternative tradition and compare its issue logic directly.",
        },
        {
          href: `/modules?foundation=${encodeURIComponent(payload)}`,
          label: "Add a focus-area overlay",
          text: "Pressure-test the baseline in Security or Technology before treating it as settled.",
        },
      ],
    },
  ]

  return (
    <div className="wide-container">
      <article className="result-article">
        <FoundationProfileSync
          snapshot={{
            payload,
            resultPath: `/results/${payload}`,
            familyKey: result.familyKey,
            familyLabel,
            runnerUpKey: neighborKey,
            runnerUpLabel: neighborLabel,
            summary,
            dimensionScores,
            strategyModifier: result.strategyModifier,
            normativeModifier: result.normativeModifier,
            keyDrivers: keyDrivers.map((driver) => ({
              type: driver.type,
              label: driver.label,
              description: driver.description,
            })),
            strongLenses: strongLenses.map((lens) => ({
              label: lens.label,
              description: lens.description,
            })),
          }}
        />

        <section className="result-section stack-lg" aria-labelledby="foundation-result-heading">
          <div className="stack-md">
            <p className="eyebrow">Foundation result</p>
            <h1
              id="foundation-result-heading"
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(2.1rem, 5vw, 4.8rem)",
                lineHeight: 1.02,
                letterSpacing: "-0.045em",
                maxWidth: "980px",
              }}
            >
              {foundationNarrative.state === "lowDifferentiation"
                ? "Your answers keep several ways of reading world politics in play."
                : foundationPayoff.corePattern.noticeFirst}
            </h1>
            <p className="muted" style={{ maxWidth: "760px", fontSize: "1.05rem", lineHeight: "1.7" }}>
              {foundationNarrative.state === "lowDifferentiation"
                ? "The reward here is not a tidy identity. It is a map of the questions that remain open when the scenarios get harder."
                : foundationPayoff.mainTension.body}
            </p>
            <div className="row gap-sm wrap" aria-label="Technical result labels">
              <span className="atlas-tag">{familyLabel}</span>
              <span className="atlas-tag">{result.strategyModifier}</span>
              <span className="atlas-tag">{result.normativeModifier}</span>
              <span className="atlas-tag">Nearest overlap: {neighborLabel}</span>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.25fr) minmax(280px, 0.75fr)",
              gap: "24px",
              alignItems: "stretch",
            }}
          >
            <div className="panel stack-md" style={{ padding: "24px" }}>
              <div className="stack-xs">
                <p className="eyebrow">Dimension map</p>
                <h2 style={{ margin: 0 }}>The shape behind the sentence</h2>
                <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.65" }}>
                  This is the one dominant visual for the result. It uses your actual Foundation
                  dimension scores and shows model positions, not population percentiles.
                </p>
              </div>
              <FoundationDimensionRadar dimensionScores={dimensionScores} />
            </div>

            <aside className="panel stack-md" style={{ padding: "24px" }} aria-label="Trust and coverage">
              <div className="stack-xs">
                <p className="eyebrow">Where this may be wrong</p>
                <p style={{ fontWeight: 700, fontFamily: "Georgia, serif", fontSize: "1.1rem" }}>
                  Closest modeled fit, not a final identity.
                </p>
                <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
                  If your strongest instincts come from feminist, postcolonial or decolonial,
                  green, or English School IR, this inventory will place you near one of its four
                  modeled families rather than name that orientation directly.
                </p>
                <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
                  {foundationNarrative.state === "lowDifferentiation"
                    ? "Your answers also do not form a sharp center in this model, so the family label should be read especially lightly."
                    : "Use the label as shorthand for the dimension pattern, then test it against concrete issue areas."}
                </p>
                <Link href="/method" style={{ color: "var(--accent)", fontWeight: 600 }}>
                  Read methods and coverage limits →
                </Link>
              </div>
            </aside>
          </div>
        </section>

        <section className="result-section stack-md" aria-labelledby="foundation-payoff-heading">
          <div className="stack-xs">
            <p className="eyebrow">Payoff</p>
            <h2 id="foundation-payoff-heading">What to do with this result</h2>
          </div>
          <div className="driver-grid">
            <article className="driver-card stack-xs">
              <p className="eyebrow">What would change this</p>
              <p style={{ fontWeight: 700, fontFamily: "Georgia, serif" }}>{foundationPayoff.mainTension.title}</p>
              <p className="muted" style={{ lineHeight: "1.6", fontSize: "0.9rem" }}>
                {foundationPayoff.mainTension.rivalArgument}
              </p>
              <p className="muted" style={{ lineHeight: "1.6", fontSize: "0.9rem" }}>
                {foundationNarrative.state === "lowDifferentiation"
                  ? "A focused module may reveal which tradeoff actually matters once the issue is specific."
                  : foundationPayoff.corePattern.underweight}
              </p>
            </article>

            <article className="driver-card stack-xs">
              <p className="eyebrow">Nearest Atlas pattern</p>
              <p style={{ fontWeight: 700, fontFamily: "Georgia, serif" }}>{atlasMatch.nearest.name}</p>
              <AtlasPatternFamily pattern={atlasMatch.nearest} compact />
              <p className="muted" style={{ lineHeight: "1.6", fontSize: "0.9rem" }}>
                {atlasMatch.nearest.cardSummary}
              </p>
              <p>
                <Link href={getAtlasPatternHref(atlasMatch.nearest.id)} style={{ color: "var(--accent)", fontWeight: 600 }}>
                  Read this pattern →
                </Link>
              </p>
            </article>
          </div>

          <div className="row gap-sm wrap">
            <Link href={`/modules?foundation=${encodeURIComponent(payload)}`} className="cta-primary">
              Add a focus-area module
            </Link>
            <Link href="/profile" className="cta-secondary">Save to Profile</Link>
            <ResultCardHeroShare
              shareUrl={`/results/${payload}`}
              title={`IR Worldview: ${familyLabel}`}
              text={`My IR worldview result: ${familyLabel} · ${result.strategyModifier} · ${result.normativeModifier}`}
            />
          </div>
        </section>

        <section className="result-section stack-md">
          <details className="profile-details">
            <summary>Read full analysis</summary>
            <div className="stack-lg" style={{ marginTop: "18px" }}>
              <div className="stack-md">
                <h2>Dimension profile</h2>
                <div>
                  {(Object.entries(dimensionScores) as [DimensionKey, number][]).map(([dim, value]) => (
                    <div key={dim} className="dim-row">
                      <ScaleBar label={dimensionLabels[dim]} value={value} tone="baseline" />
                      <p className="muted" style={{ fontSize: "0.8rem", lineHeight: "1.5" }}>
                        {dimensionOneLiners[dim](value)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <ResultSignaturePanel
                familyLabel={familyLabel}
                strategyModifier={result.strategyModifier}
                normativeModifier={result.normativeModifier}
                neighborLabel={neighborLabel}
                topDimensions={topDimensions}
              />

              <div className="result-prose stack-md">
                <p>{explanation}</p>
                {neighborText ? <p className="muted">{neighborText}</p> : null}
                <p className="muted">{mixedNote}</p>
                <ul className="content-list" style={{ margin: 0 }}>
                  {whyThisResult.map((bullet, index) => <li key={index}>{bullet}</li>)}
                </ul>
              </div>

              <div className="stack-md">
                <h2>Pressure-test questions</h2>
                <ol className="pressure-list result-prose">
                  {pressureQuestions.map((question, index) => (
                    <li key={index} className="pressure-q"><p>{question}</p></li>
                  ))}
                </ol>
              </div>
            </div>
          </details>
        </section>

        <ReadingPathSection
          title="Where to go next"
          intro="These readings help you deepen this result, test it against its nearest rival, and keep exploring across the project."
          paths={readingPaths}
        />

        <div className="result-section stack-md">
          <div className="stack-xs">
            <h2>Glossary</h2>
            <p className="muted" style={{ fontSize: "0.875rem", lineHeight: "1.65" }}>
              Short definitions for the recurring terms on this page.
            </p>
          </div>
          <details className="profile-details">
            <summary>Read glossary</summary>
            <div style={{ marginTop: "16px" }}>
              {glossaryTerms.map((term) => (
                <div key={term.term} className="definition-item">
                  <p style={{ fontWeight: 600, marginBottom: "4px" }}>{term.term}</p>
                  <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
                    {term.definition}
                  </p>
                </div>
              ))}
            </div>
          </details>
        </div>

        <div className="result-section stack-md">
          <div className="callout stack-xs">
            <p style={{ fontWeight: 600 }}>About this classification</p>
            <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.875rem" }}>
              Structured thought exercise, not a validated scientific diagnostic. Tradition labels
              are shorthand for a multidimensional profile, and case-based readings stay separate
              from the foundation result. Scores are comparative within this model, not population
              percentiles.{" "}
              <Link href="/method" style={{ color: "var(--accent)" }}>
                Full methods note →
              </Link>
            </p>
          </div>
          <p>
            <Link href="/profile" style={{ color: "var(--accent)" }}>
              View your Profile →
            </Link>
          </p>
          <p>
            <Link href={`/feedback?result=${payload}`} style={{ color: "var(--accent)" }}>
              Share feedback on this inventory →
            </Link>
          </p>
          <ResearchOptIn instrumentLabel="Foundation" />
          <ShareActions
            payload={payload}
            familyLabel={familyLabel}
            strategyModifier={result.strategyModifier}
            normativeModifier={result.normativeModifier}
          />
          <HistoryCompare
            familyKey={result.familyKey}
            neighborKey={neighborKey}
            strategyModifier={result.strategyModifier}
            normativeModifier={result.normativeModifier}
            dimensionScores={dimensionScores}
          />
        </div>

      </article>
    </div>
  )
}

function FoundationDimensionRadar({
  dimensionScores,
}: {
  dimensionScores: Record<DimensionKey, number>
}) {
  const dimensions = Object.entries(dimensionScores) as [DimensionKey, number][]
  const size = 420
  const center = size / 2
  const maxRadius = 150
  const rings = [1, 2, 3]
  const points = dimensions.map(([dimension, score], index) => {
    const angle = (Math.PI * 2 * index) / dimensions.length - Math.PI / 2
    const radius = (score / 7) * maxRadius

    return {
      dimension,
      score,
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
      labelX: center + Math.cos(angle) * (maxRadius + 34),
      labelY: center + Math.sin(angle) * (maxRadius + 34),
    }
  })
  const polygonPoints = points.map((point) => `${point.x},${point.y}`).join(" ")

  return (
    <div style={{ overflowX: "auto" }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label="Radar chart of Foundation dimension scores"
        style={{ width: "100%", minWidth: "340px", maxWidth: "560px", display: "block", margin: "0 auto" }}
      >
        {rings.map((ring) => {
          const radius = (ring / rings.length) * maxRadius
          const ringPoints = dimensions.map((_, index) => {
            const angle = (Math.PI * 2 * index) / dimensions.length - Math.PI / 2
            return `${center + Math.cos(angle) * radius},${center + Math.sin(angle) * radius}`
          })

          return (
            <polygon
              key={ring}
              points={ringPoints.join(" ")}
              fill="none"
              stroke="var(--border)"
              strokeWidth={1}
            />
          )
        })}
        {points.map((point) => (
          <line
            key={point.dimension}
            x1={center}
            y1={center}
            x2={point.labelX - (point.labelX > center ? 22 : -22)}
            y2={point.labelY - (point.labelY > center ? 12 : -12)}
            stroke="var(--border)"
            strokeWidth={1}
          />
        ))}
        <polygon
          points={polygonPoints}
          fill="rgba(122, 42, 30, 0.16)"
          stroke="var(--accent)"
          strokeWidth={2}
        />
        {points.map((point) => (
          <g key={`${point.dimension}-point`}>
            <circle cx={point.x} cy={point.y} r={4} fill="var(--accent)" />
            <text
              x={point.labelX}
              y={point.labelY}
              textAnchor={point.labelX > center + 12 ? "start" : point.labelX < center - 12 ? "end" : "middle"}
              dominantBaseline="middle"
              style={{ fontSize: "11px", fill: "var(--muted)", fontFamily: "var(--font-sans, system-ui)" }}
            >
              {dimensionLabels[point.dimension]} · {point.score.toFixed(1)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

function getFallbackMixedNote(
  state: "lowDifferentiation" | "stableModeration" | "sharplyDifferentiated",
  closestTraditionsNote: string,
) {
  if (state === "lowDifferentiation") {
    return closestTraditionsNote
  }

  if (state === "sharplyDifferentiated") {
    return "The baseline is comparatively consistent across dimensions. The main test now is whether it still holds under issue-specific pressure."
  }

  return "The baseline is clear, but a nearby runner-up still stays live in harder cases. That overlap is part of the result, not noise to be scrubbed out."
}

function getTopDimensionScores(dimensionScores: Record<DimensionKey, number>) {
  return (Object.entries(dimensionScores) as [DimensionKey, number][])
    .sort(([, a], [, b]) => Math.abs(b - 4) - Math.abs(a - 4))
    .slice(0, 3)
}

function ResultSignaturePanel({
  familyLabel,
  strategyModifier,
  normativeModifier,
  neighborLabel,
  topDimensions,
}: {
  familyLabel: string
  strategyModifier: string
  normativeModifier: string
  neighborLabel: string
  topDimensions: [DimensionKey, number][]
}) {
  return (
    <aside className="result-signature-panel stack-sm" aria-label="Result signature">
      <div className="stack-xs">
        <p className="eyebrow">Result signature</p>
        <p className="muted" style={{ margin: 0, fontSize: "0.9rem", lineHeight: "1.65" }}>
          A compact read of the strongest dimension pulls and modifiers shaping this Foundation result.
        </p>
      </div>

      <div className="result-signature-scales">
        {topDimensions.map(([dimension, score]) => (
          <ScaleBar
            key={dimension}
            label={dimensionLabels[dimension]}
            value={score}
            tone="baseline"
          />
        ))}
      </div>

      <dl className="result-signature-meta">
        <div>
          <dt>Family</dt>
          <dd>{familyLabel}</dd>
        </div>
        <div>
          <dt>Strategy</dt>
          <dd>{strategyModifier}</dd>
        </div>
        <div>
          <dt>Norms</dt>
          <dd>{normativeModifier}</dd>
        </div>
        <div>
          <dt>Nearest overlap</dt>
          <dd>{neighborLabel}</dd>
        </div>
      </dl>
    </aside>
  )
}
