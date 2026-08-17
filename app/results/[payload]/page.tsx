import Link from "next/link"
import { ScaleBar } from "@/components/visual-primitives"
import { ResultCardHeroShare } from "@/components/results/result-card-hero-share"
import { getAtlasPatternHref } from "@/lib/atlas-lite"
import { verifiedCaseLibrary } from "@/lib/content/verified-case-library"
import {
  PAYLOAD_DIMENSION_ORDER,
  resolveFoundationPayload,
} from "@/lib/share"
import {
  getClosestTraditions,
  getComparisonDimensions,
  getKeyDrivers,
  getActiveTensions,
  neighborOverlapTexts,
  dimensionOneLiners,
  suggestedReadings,
  getStrongLenses,
  getIssueAreaTilts,
  getRunnerUpSeparation,
  getFlipAnalysis,
  getWhatWouldChangeThis,
  getWhyThisResult,
  getPressureTestQuestions,
} from "@/lib/result-helpers"
import {
  dimensionBand,
  dimensionBandLabels,
  getDimensionPush,
} from "@/lib/results/dimension-bands"
import { PushChart } from "@/components/results/push-chart"
import { NearestAlternative } from "@/components/results/nearest-alternative"
import { dimensionLabels } from "@/lib/quiz-schema"
import { getV2ScoringCalibration } from "@/lib/scoring"
import { buildFoundationNarrative } from "@/lib/narrative/foundation"
import { buildFoundationPayoff } from "@/lib/results/foundation-payoff"
import { normativeModifierGloss, strategyModifierGloss } from "@/lib/copy/glosses"
import { familySlug, traditionNounLabel } from "@/lib/worldview-config"
import { DimensionFieldMap } from "@/components/results/dimension-field-map"
import { PlacementFirmnessBar } from "@/components/results/placement-firmness-bar"
import { PostureStrip } from "@/components/results/posture-strip"
import { ShareActions } from "@/components/results/share-actions"
import { HistoryCompare } from "@/components/results/history-compare"
import { FoundationProfileSync } from "@/components/profile/foundation-profile-sync"
import { ReadingPathSection } from "@/components/results/reading-path-section"
import { ResearchStatusNotice } from "@/components/research/research-status-notice"
import { localizedAlternates, publicPath } from "@/i18n/paths"
import { buildFoundationShareCardUrl } from "@/lib/share-card"
import {
  normFromNormativeModifier,
  resolveArchetype,
} from "@/lib/archetypes"
import {
  formatArchetypeReadingCode,
  formatArchetypeReadingCodeForSpeech,
} from "@/lib/archetype-display"
import { FoundationMark } from "@/components/archetypes/archetype-mark"
import { archetypeEvidencePath } from "@/lib/archetype-evidence"
import {
  getPercentile,
  getProfileRarity,
  type AggregateStats,
  type PercentileResult,
} from "@/lib/percentiles"
import { readAggregateStatsForFoundationPayload } from "@/lib/research/aggregate-stats"
import type { DimensionKey } from "@/lib/types"
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

    return buildResultMetadata(payload, title, description)
  }

  const { lowDifferentiationThreshold } = getV2ScoringCalibration(
    resolved.scoringCalibration,
  )
  const archetype = resolveArchetype(
    resolved.result,
    lowDifferentiationThreshold,
  )
  const norm = normFromNormativeModifier(
    resolved.result.normativeModifier,
  )
  const resultLabel =
    `${archetype.name} · ${formatArchetypeReadingCode(archetype.code, norm)}`
  const title = `${archetype.name} result — IR Worldview Inventory`
  const description =
    `Shared IR Worldview result: ${resultLabel}. ${archetype.gloss}`
  const cardImage = buildFoundationShareCardUrl(payload)

  return buildResultMetadata(
    payload,
    title,
    description,
    cardImage,
    `${archetype.name} Foundation profile`,
  )
}

function buildResultMetadata(
  payload: string,
  title: string,
  description: string,
  cardImage?: string,
  cardAlt?: string,
): Metadata {
  const socialImage = cardImage
    ? {
        url: cardImage,
        width: 1200,
        height: 630,
        alt: cardAlt ?? "IR Worldview Inventory Foundation profile",
      }
    : null

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: publicPath("en", `/results/${payload}`),
      images: socialImage ? [socialImage] : undefined,
    },
    twitter: {
      card: socialImage ? "summary_large_image" : "summary",
      title,
      description,
      images: socialImage ? [socialImage] : undefined,
    },
    alternates: {
      canonical: publicPath("en", `/results/${payload}`),
      languages: localizedAlternates(`/results/${payload}`),
    },
  }
}

export default async function ResultPage(
  { params }: { params: Promise<{ payload: string }> },
) {
  const { payload } = await params
  const resolved = resolveFoundationPayload(payload)

  if (!resolved) {
    return (
      <div className="container stack-lg result-invalid">
        <div className="panel stack-md">
          <p className="eyebrow">Invalid result</p>
          <h1>This link could not be decoded.</h1>
          <p className="muted history-line">
            The result URL may be incomplete, corrupted, or from an older version of the inventory.
          </p>
          <div className="row gap-sm wrap">
            <Link href="/quiz" className="cta-primary">Take the Foundation</Link>
            <Link href="/explore" className="cta-secondary">Explore the perspectives</Link>
            <Link href="/method" className="cta-secondary">Methods</Link>
          </div>
        </div>
      </div>
    )
  }

  const { dimensionScores, result, resultTier } = resolved
  const {
    lowDifferentiationThreshold,
    sharplyDifferentiatedThreshold,
  } = getV2ScoringCalibration(resolved.scoringCalibration)
  const aggregateStats = await readAggregateStatsForFoundationPayload(resolved)
  const dimensionPercentiles = buildDimensionPercentiles(dimensionScores, aggregateStats)
  const hasPercentiles = PAYLOAD_DIMENSION_ORDER.some(
    (dimension) => dimensionPercentiles[dimension] !== null,
  )
  const familyScores = result.familyScores
  const closestTraditions = getClosestTraditions(familyScores, {
    familyKey: result.familyKey,
    runnerUpKey: result.runnerUpKey,
    nearestFitGap: result.nearestFitGap,
    lowDifferentiationThreshold,
  })
  const familyLabel = traditionNounLabel(result.familyKey)
  const neighborKey = result.runnerUpKey
  const neighborLabel = traditionNounLabel(neighborKey)

  const explanation = result.explanation
  const keyDrivers = getKeyDrivers(dimensionScores)
  const topDimensions = getTopDimensionScores(dimensionScores)
  const strongLenses = getStrongLenses(dimensionScores)
  const tensions = getActiveTensions(dimensionScores)
  const neighborText = neighborOverlapTexts[result.familyKey]?.[neighborKey] ?? ""
  const readings = suggestedReadings[result.familyKey]
  const neighborReadings = suggestedReadings[neighborKey]
  const issueAreaTilts = getIssueAreaTilts(result.familyKey, dimensionScores)
  const runnerUpSeparation = getRunnerUpSeparation(result.familyKey, neighborKey, dimensionScores)
  const flipAnalysis = getFlipAnalysis(result.familyKey, neighborKey, dimensionScores)
  const whatWouldChangeThis = getWhatWouldChangeThis(
    result.familyKey,
    neighborKey,
    dimensionScores,
  )
  const whyThisResult = getWhyThisResult(result.familyKey, neighborKey, dimensionScores)
  const comparisonDimensions = getComparisonDimensions(
    result.familyKey,
    neighborKey,
    dimensionScores,
  )
  const foundationNarrative = buildFoundationNarrative({
    familyKey: result.familyKey,
    runnerUpKey: neighborKey,
    strategyModifier: result.strategyModifier,
    normativeModifier: result.normativeModifier,
    dimensionScores,
    scoringCalibration: resolved.scoringCalibration,
  })
  const summary = foundationNarrative.summary
  const lowDifferentiation = foundationNarrative.state === "lowDifferentiation"
  const nearestFitGap = result.nearestFitGap
  const familiesStayClose =
    nearestFitGap < lowDifferentiationThreshold
  const targetedExtensionHref =
    `/quiz?extension=targeted&first=${result.familyKey}&second=${result.runnerUpKey}`
  const fullExtensionHref = "/quiz?extension=full"

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
  const pressureCase = verifiedCaseLibrary.cases.find(
    (caseStudy) => caseStudy.caseId === foundationPayoff.caseTest.caseId,
  ) ?? null
  const pressureCaseHref = pressureCase
    ? `${getAtlasPatternHref(pressureCase.verifiedProfileReading.bestFitProfileId)}#case-${pressureCase.caseId}`
    : null
  const nextStepHref = withFoundationPayload(foundationPayoff.nextStep.href, payload)
  const archetype = resolveArchetype(
    result,
    lowDifferentiationThreshold,
  )
  const primaryArchetypeComponent = "archetypes" in archetype
    ? archetype.archetypes.find(
        ({ familyKey }) => familyKey === result.familyKey,
      ) ?? null
    : null
  const normativeSuffix = normFromNormativeModifier(result.normativeModifier)
  const archetypeCode = formatArchetypeReadingCode(
    archetype.code,
    normativeSuffix,
  )
  const archetypeCodeSpeech = formatArchetypeReadingCodeForSpeech(
    archetype.code,
    normativeSuffix,
  )
  const archetypeShareLabel = `${archetype.name} · ${archetypeCode}`
  const archetypeRarity = aggregateStats
    ? getProfileRarity(archetype.code, aggregateStats)
    : null
  const analoguePath = archetype.analogue
    ? archetypeEvidencePath(archetype.code)
    : null
  const analogueHref = analoguePath
    ? `${analoguePath}?from=${encodeURIComponent(`/results/${payload}`)}`
    : null

  // A core-set result is provisional, so the single next action is to extend it.
  // Once the extended set is in, the action becomes the issue module that puts
  // the profile under the most pressure.
  const nextAction = resultTier === "core"
    ? {
        href: familiesStayClose ? targetedExtensionHref : fullExtensionHref,
        label: familiesStayClose ? "Answer 5 targeted items" : "Take the full extended set",
        reason: familiesStayClose
          ? `${familyLabel} and ${neighborLabel} are still close. Five follow-up items target the distinctions that separate them.`
          : "The core set gives a provisional reading. The extended set widens the evidence behind it.",
      }
    : {
        href: nextStepHref,
        label: foundationPayoff.nextStep.label,
        reason: foundationPayoff.nextStep.reason,
      }

  const readingPaths = [
    {
      key: "start-here",
      heading: "Read the closest tradition",
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
          label: "Add a focus-area record",
          text: "Read Security or Technology on its own domain scale beside this Foundation.",
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
            familyLabel: result.familyLabel,
            runnerUpKey: neighborKey,
            runnerUpLabel: result.runnerUpLabel,
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

        <header
          className="result-section foundation-result-lede"
          aria-labelledby="foundation-result-heading"
        >
          <div className="foundation-result-lede__copy stack-lg">
            <div className="stack-sm">
              <p className="eyebrow">
                {resultTier === "core" ? "Provisional Foundation result" : "Foundation result"}
              </p>
              {"archetypes" in archetype && primaryArchetypeComponent ? (
                <FoundationMark
                  code={archetype.code}
                  primaryCode={primaryArchetypeComponent.code}
                  presentation="hero"
                  className="foundation-result-mark"
                />
              ) : "archetypes" in archetype ? null : (
                <FoundationMark
                  code={archetype.code}
                  presentation="hero"
                  className="foundation-result-mark"
                />
              )}
              <h1 id="foundation-result-heading" className="result-hero-title">
                {archetype.name}
              </h1>
              <p
                className="foundation-result-code"
                aria-label={archetypeCodeSpeech}
              >
                {archetypeCode}
              </p>
              <p className="foundation-result-tradition">
                Closest modeled tradition: {traditionNounLabel(result.familyKey)}
              </p>
              <p className="result-lead">{archetype.gloss}</p>
              {archetype.analogue && analogueHref ? (
                <p className="foundation-result-analogue">
                  Historical analogue:{" "}
                  <Link href={analogueHref}>
                    {archetype.analogue.label} · {archetype.analogue.year}
                  </Link>
                </p>
              ) : null}
              {archetypeRarity ? (
                <div className="stack-xs">
                  <p>
                    Same archetype:{" "}
                    {formatPercentage(archetypeRarity.percentage)}% of completed
                    results in this cohort.
                  </p>
                  <p className="muted result-note-xs" role="note">
                    Archetype cohort n=
                    {archetypeRarity.n.toLocaleString("en-US")}.
                  </p>
                </div>
              ) : null}
            </div>

            <div className="foundation-result-bands stack-sm">
              <h2 className="foundation-result-subhead">Strongest three dimensions</h2>
              {topDimensions.map(([dimension, score]) => (
                <div key={dimension} className="foundation-result-band">
                  <ScaleBar
                    label={dimensionLabels[dimension]}
                    value={score}
                    valueLabel={formatDimensionScore(score, dimensionPercentiles[dimension])}
                    tone="baseline"
                    className="foundation-percentile-scale"
                  />
                  {dimensionPercentiles[dimension] ? null : (
                    <span
                      className="foundation-result-band__tag"
                      data-band={dimensionBand(dimension, score)}
                    >
                      {dimensionBandLabels[dimensionBand(dimension, score)]}
                    </span>
                  )}
                </div>
              ))}
              <PercentileFootnote
                dimensions={topDimensions.map(([dimension]) => dimension)}
                percentiles={dimensionPercentiles}
              />
            </div>

            <p className="foundation-result-change">{whatWouldChangeThis}</p>

            <div className="foundation-result-action print-hidden">
              <Link href={nextAction.href} className="cta-primary">
                {nextAction.label}
              </Link>
              <p>{nextAction.reason}</p>
            </div>
          </div>

          <div className="foundation-result-lede__map">
            <DimensionFieldMap
              dimensionScores={dimensionScores}
              lowDifferentiation={lowDifferentiation}
            />
            <PlacementFirmnessBar
              nearestFitGap={nearestFitGap}
              state={foundationNarrative.state}
              runnerUpLabel={neighborLabel}
              lowDifferentiationThreshold={lowDifferentiationThreshold}
              sharplyDifferentiatedThreshold={sharplyDifferentiatedThreshold}
            />
            <PostureStrip
              result={result}
              lowDifferentiationThreshold={lowDifferentiationThreshold}
              percentile={dimensionPercentiles.restraint}
            />
          </div>
        </header>

        <section className="result-section result-appendix-section stack-lg">
          <p className="foundation-result-methods-line muted">
            {hasPercentiles
              ? "Percentiles describe the current completed-result sample, and the family name is a nearby label for the pattern. "
              : "Scores are positions within this model, and the family name is a nearby label for the pattern. "}
            <Link href="/method">How this is built, and where it stops →</Link>
          </p>

          <details className="profile-details">
            <summary>Full analysis</summary>
            <div className="stack-lg result-details-body">
              {resultTier === "core" ? (
                <section className="stack-md" aria-labelledby="foundation-extension-heading">
                  <h2 id="foundation-extension-heading">
                    {familiesStayClose
                      ? `Test the boundary between ${familyLabel} and ${neighborLabel}`
                      : "Add the extended set"}
                  </h2>
                  <p className="muted result-note">
                    This reading comes from the 14-item core set. The extended set holds the
                    remaining items.
                  </p>
                  <div className="row gap-sm wrap print-hidden">
                    {familiesStayClose ? (
                      <Link href={targetedExtensionHref} className="cta-secondary">
                        Answer 5 targeted items
                      </Link>
                    ) : null}
                    <Link href={fullExtensionHref} className="cta-secondary">
                      Take the full extended set
                    </Link>
                  </div>
                </section>
              ) : null}

              <section className="stack-lg" aria-labelledby="foundation-payoff-heading">
                <h2 id="foundation-payoff-heading">How your logic hangs together</h2>
                <div className="foundation-result-reading-grid">
                  <article className="foundation-result-reading stack-xs">
                    <p className="foundation-result-reading__label">Starts with</p>
                    <h3>Your first question</h3>
                    <p>{foundationPayoff.corePattern.noticeFirst}</p>
                  </article>
                  <article className="foundation-result-reading stack-xs">
                    <p className="foundation-result-reading__label">Leaves open</p>
                    <h3>{foundationPayoff.mainTension.title}</h3>
                    <p>{foundationPayoff.mainTension.body}</p>
                  </article>
                  <article className="foundation-result-reading stack-xs">
                    <p className="foundation-result-reading__label">Nearest challenge</p>
                    <h3>Why {neighborLabel} remains nearby</h3>
                    <p>{foundationPayoff.mainTension.rivalArgument}</p>
                  </article>
                </div>
              </section>

              <section className="stack-md" aria-labelledby="foundation-modifiers-heading">
                <h2 id="foundation-modifiers-heading">What the modifiers mean</h2>
                <dl className="modifier-glosses">
                  <div className="modifier-gloss">
                    <dt>{result.strategyModifier}</dt>
                    <dd>{strategyModifierGloss(result.strategyModifier)}</dd>
                  </div>
                  <div className="modifier-gloss">
                    <dt>{result.normativeModifier}</dt>
                    <dd>{normativeModifierGloss(result.normativeModifier)}</dd>
                  </div>
                </dl>
              </section>

              {pressureCase ? (
                <section className="stack-md" aria-labelledby="foundation-case-heading">
                  <h2 id="foundation-case-heading">Put the profile against a real case</h2>
                  <div className="foundation-case-test">
                    <div className="foundation-case-test__identity stack-xs">
                      <p>Reviewed historical case</p>
                      <h3>{pressureCase.title}</h3>
                      <span>{pressureCase.theme}</span>
                    </div>
                    <div className="foundation-case-test__question stack-sm">
                      <p>{foundationPayoff.caseTest.question}</p>
                      <p className="muted">{foundationPayoff.caseTest.reason}</p>
                      {pressureCaseHref ? (
                        <Link href={pressureCaseHref} className="result-strong">
                          Read the case, sources, and rival interpretation →
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </section>
              ) : null}

              <section className="stack-md" aria-labelledby="foundation-domain-heading">
                <h2 id="foundation-domain-heading">How to apply this Foundation by issue</h2>
                <div className="foundation-domain-grid">
                  <article className="foundation-domain-note stack-xs">
                    <h3>Security</h3>
                    <p>
                      {foundationPayoff.liveDebates.find(
                        (debate) => debate.title === "Great-power rivalry",
                      )?.text}
                    </p>
                  </article>
                  <article className="foundation-domain-note stack-xs">
                    <h3>Technology</h3>
                    <p>
                      {foundationPayoff.liveDebates.find(
                        (debate) => debate.title === "Technology competition",
                      )?.text}
                    </p>
                  </article>
                  <article className="foundation-domain-note stack-xs">
                    <h3>{issueAreaTilts[0]?.issue ?? "What may change the reading"}</h3>
                    {issueAreaTilts[0] ? (
                      <>
                        <p className="foundation-domain-note__tilt">{issueAreaTilts[0].tilt}</p>
                        <p>{issueAreaTilts[0].note}</p>
                      </>
                    ) : (
                      <p>{foundationPayoff.corePattern.underweight}</p>
                    )}
                  </article>
                </div>
              </section>

              <section className="stack-md" aria-labelledby="foundation-signals-heading">
                <h2 id="foundation-signals-heading">What is doing the work</h2>
                <PushChart
                  rows={getDimensionPush(dimensionScores).map((row) => ({
                    key: row.dimension,
                    label: dimensionLabels[row.dimension],
                    deviation: row.deviation,
                    score: row.score,
                    percentile: dimensionPercentiles[row.dimension],
                    pole: row.pole,
                  }))}
                  lowCaption="Toward the low pole"
                  centreCaption="Centre of the observed range"
                  highCaption="Toward the high pole"
                />
                <PercentileFootnote
                  dimensions={PAYLOAD_DIMENSION_ORDER}
                  percentiles={dimensionPercentiles}
                />
                <p className="muted result-note">
                  Each bar is the distance from the centre of the range this instrument
                  produces on that dimension, scaled by that dimension&rsquo;s own spread so the
                  seven are comparable. Long bars moved the result; short bars did not.
                </p>
                <ul className="foundation-signal-legend">
                  {keyDrivers.map((driver) => (
                    <li key={driver.dimension} className="foundation-signal-legend__row">
                      <p>
                        <strong>{driver.label}.</strong> {driver.description}
                      </p>
                      <DimensionScoreValue
                        score={dimensionScores[driver.dimension]}
                        percentile={dimensionPercentiles[driver.dimension]}
                      />
                    </li>
                  ))}
                </ul>
                <PercentileFootnote
                  dimensions={keyDrivers.map((driver) => driver.dimension)}
                  percentiles={dimensionPercentiles}
                />
              </section>

              <section className="stack-md" aria-labelledby="foundation-alt-heading">
                <h2 id="foundation-alt-heading">Nearest alternative: {neighborLabel}</h2>
                <NearestAlternative
                  primaryLabel={familyLabel}
                  runnerUpLabel={neighborLabel}
                  rows={comparisonDimensions.map((row) => ({
                    key: row.dim,
                    label: row.label,
                    userScore: row.userScore,
                    userPercentile:
                      dimensionPercentiles[row.dim]?.percentile ?? null,
                    primaryExpected: row.primaryExpected,
                    runnerUpExpected: row.runnerUpExpected,
                  }))}
                />
                <PercentileFootnote
                  dimensions={comparisonDimensions.map((row) => row.dim)}
                  percentiles={dimensionPercentiles}
                />
                {runnerUpSeparation ? (
                  <p className="muted result-note">{runnerUpSeparation}</p>
                ) : null}
              </section>

              <section className="stack-md" aria-labelledby="foundation-dimensions-heading">
                <h2 id="foundation-dimensions-heading">Dimension profile</h2>
                <div>
                  {PAYLOAD_DIMENSION_ORDER.map((dim) => (
                    <div key={dim} className="dim-row">
                      <ScaleBar
                        label={dimensionLabels[dim]}
                        value={dimensionScores[dim]}
                        valueLabel={formatDimensionScore(
                          dimensionScores[dim],
                          dimensionPercentiles[dim],
                        )}
                        tone="baseline"
                        className="foundation-percentile-scale"
                      />
                      <p className="muted result-note-xs">
                        {dimensionOneLiners[dim](dimensionScores[dim])}
                      </p>
                    </div>
                  ))}
                </div>
                <PercentileFootnote
                  dimensions={PAYLOAD_DIMENSION_ORDER}
                  percentiles={dimensionPercentiles}
                />
              </section>

              <div className="result-prose stack-md">
                <p>{explanation}</p>
                {neighborText ? <p className="muted">{neighborText}</p> : null}
                <p className="muted">{mixedNote}</p>
                <ul className="content-list">
                  {whyThisResult.map((bullet, index) => <li key={index}>{bullet}</li>)}
                </ul>
                {flipAnalysis ? <p className="muted">{flipAnalysis}</p> : null}
              </div>

              <section className="stack-md" aria-labelledby="foundation-questions-heading">
                <h2 id="foundation-questions-heading">Questions that could change this reading</h2>
                <ol className="pressure-list result-prose">
                  {pressureQuestions.map((question, index) => (
                    <li key={index} className="pressure-q"><p>{question}</p></li>
                  ))}
                </ol>
              </section>

              <section className="stack-md" aria-labelledby="foundation-coverage-heading">
                <h2 id="foundation-coverage-heading">Closest fit among four scored families</h2>
                <p className="muted result-note">
                  Feminist, postcolonial or decolonial, green, and English School approaches are
                  under-modeled here. The inventory may place those instincts near one of its four
                  scored families without naming them directly.
                </p>
                <p>
                  <Link href="/method" className="result-strong">
                    Read methods and coverage limits →
                  </Link>
                </p>
              </section>

              <ReadingPathSection
                title="Read the result from another angle"
                paths={readingPaths}
              />

              <div className="stack-md">
                <p>
                  <Link href="/feedback">
                    Report a factual or interface problem →
                  </Link>
                </p>
                <ResearchStatusNotice instrumentLabel="Foundation" />
                <ShareActions
                  payload={payload}
                  familyLabel={familyLabel}
                  strategyModifier={result.strategyModifier}
                  normativeModifier={result.normativeModifier}
                  displayLabel={archetypeShareLabel}
                />
                <HistoryCompare
                  familyKey={result.familyKey}
                  neighborKey={neighborKey}
                  strategyModifier={result.strategyModifier}
                  normativeModifier={result.normativeModifier}
                  dimensionScores={dimensionScores}
                  provenance={{
                    locale: resolved.provenance.completionLocale,
                    localeCopyVersion: resolved.provenance.localeCopyVersion,
                  }}
                />
              </div>
            </div>
          </details>

          <div className="row gap-sm wrap print-hidden">
            <Link href="/perspectives" className="cta-secondary">Advise from another vantage point</Link>
            <Link href="/profile" className="cta-secondary">View Profile</Link>
            <ResultCardHeroShare
              shareUrl={`/results/${payload}`}
              title={`IR Worldview: ${archetype.name}`}
              text={`My IR worldview result: ${archetypeShareLabel}`}
            />
          </div>
        </section>
      </article>
    </div>
  )
}

function buildDimensionPercentiles(
  dimensionScores: Record<DimensionKey, number>,
  stats: AggregateStats | null,
): Record<DimensionKey, PercentileResult | null> {
  return Object.fromEntries(
    PAYLOAD_DIMENSION_ORDER.map((dimension) => [
      dimension,
      stats
        ? getPercentile(
            "foundation",
            stats.mode,
            dimension,
            dimensionScores[dimension],
            stats,
          )
        : null,
    ]),
  ) as Record<DimensionKey, PercentileResult | null>
}

function DimensionScoreValue({
  score,
  percentile,
}: {
  score: number
  percentile: PercentileResult | null
}) {
  return (
    <span className="foundation-signal-row__score">
      <strong>
        {percentile ? `${formatOrdinal(percentile.percentile)} percentile` : score.toFixed(2)}
      </strong>
      {percentile ? <span>Raw score {score.toFixed(2)}</span> : null}
    </span>
  )
}

function PercentileFootnote({
  dimensions,
  percentiles,
}: {
  dimensions: readonly DimensionKey[]
  percentiles: Record<DimensionKey, PercentileResult | null>
}) {
  const sampleSizes = dimensions.flatMap((dimension) => {
    const result = percentiles[dimension]
    return result
      ? [`${dimensionLabels[dimension]} n=${result.n.toLocaleString("en-US")}`]
      : []
  })
  if (sampleSizes.length === 0) return null

  return (
    <p className="muted result-note-xs" role="note">
      Percentile sample: {sampleSizes.join("; ")}. Midrank percentiles use
      current completed Foundation results.
    </p>
  )
}

// The scorer cannot reach the ends of the response scale, so no score is
// printed with a nominal-scale denominator.
function formatDimensionScore(score: number, percentile: PercentileResult | null) {
  return percentile
    ? `${formatOrdinal(percentile.percentile)} percentile · raw score ${score.toFixed(2)}`
    : score.toFixed(2)
}

function formatOrdinal(value: number) {
  const mod100 = value % 100
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`

  if (value % 10 === 1) return `${value}st`
  if (value % 10 === 2) return `${value}nd`
  if (value % 10 === 3) return `${value}rd`
  return `${value}th`
}

function formatPercentage(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

function getFallbackMixedNote(
  state: "lowDifferentiation" | "stableModeration" | "sharplyDifferentiated",
  closestTraditionsNote: string,
) {
  if (state === "lowDifferentiation") {
    return closestTraditionsNote
  }

  if (state === "sharplyDifferentiated") {
    return "Cross-dimension consistency makes this baseline comparatively clear. The main test now is whether it still holds under issue-specific pressure."
  }

  return "A nearby runner-up remains relevant in harder cases even though the baseline is clear. That overlap is part of the result."
}

function withFoundationPayload(href: string, payload: string) {
  if (!href.startsWith("/modules/")) return href

  return `${href}?foundation=${encodeURIComponent(payload)}`
}

function getTopDimensionScores(dimensionScores: Record<DimensionKey, number>) {
  return (Object.entries(dimensionScores) as [DimensionKey, number][])
    .sort(([, a], [, b]) => Math.abs(b - 4) - Math.abs(a - 4))
    .slice(0, 3)
}
