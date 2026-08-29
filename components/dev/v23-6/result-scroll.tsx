import Link from "next/link"
import { ArchetypeMatrix } from "@/components/field/archetype-matrix"
import { FoundationMark } from "@/components/archetypes/archetype-mark"
import {
  formatArchetypeCodeSpeech,
  formatArchetypeDisplayCode,
} from "@/lib/archetype-display"
import { buildFoundationNarrative } from "@/lib/narrative/foundation"
import { dimensionLabels } from "@/lib/quiz-schema"
import {
  getComparisonDimensions,
  getRunnerUpSeparation,
  getWhatWouldChangeThis,
  getWhyThisResult,
} from "@/lib/result-helpers"
import { DIMENSION_POLES, getDimensionPush } from "@/lib/results/dimension-bands"
import { buildFoundationPayoff } from "@/lib/results/foundation-payoff"
import { resolvePlacementFirmness } from "@/lib/results/placement-firmness"
import { getV2ScoringCalibration } from "@/lib/scoring"
import { traditionNounLabel } from "@/lib/worldview-config"
import type { BlendArchetype } from "@/lib/archetypes"
import { verifiedCaseLibrary } from "@/lib/content/verified-case-library"
import {
  STUDY_FOUNDATION_TOKEN,
  resolveStudyBaseline,
  resolveStudyFoundation,
} from "@/lib/v23-6/study-fixture"
import { ResultScrollLocalRecords } from "./result-scroll-local-records"
import { ScrollReveal } from "./scroll-reveal"
import styles from "./result-scroll.module.css"

const DOMINANT_PUSH_COUNT = 3

/**
 * The Foundation result read as one argument from top to bottom.
 *
 * Everything here resolves from one frozen Foundation link already registered
 * in this repository. The document contains all of its content in ordinary
 * order. Script adds a reveal transition and replaces two server-rendered
 * empty states with whatever this browser actually holds. Nothing on the page
 * depends on script to mean what it says.
 */
export function ResultScroll() {
  const resolved = resolveStudyFoundation()
  const baseline = resolveStudyBaseline()
  const archetype = baseline.resolvedArchetype
  const isBlend = baseline.activeCellCodes.length === 2
  const scores = resolved.dimensionScores
  const { familyKey, runnerUpKey, familyLabel, runnerUpLabel, nearestFitGap } =
    resolved.result

  const calibration = getV2ScoringCalibration(resolved.scoringCalibration)
  const narrative = buildFoundationNarrative({
    familyKey,
    runnerUpKey,
    strategyModifier: resolved.result.strategyModifier,
    normativeModifier: resolved.result.normativeModifier,
    dimensionScores: scores,
    scoringCalibration: resolved.scoringCalibration,
  })
  const firmness = resolvePlacementFirmness({
    nearestFitGap,
    state: narrative.state,
    runnerUpLabel,
    lowDifferentiationThreshold: calibration.lowDifferentiationThreshold,
    sharplyDifferentiatedThreshold: calibration.sharplyDifferentiatedThreshold,
  })
  const payoff = buildFoundationPayoff({
    dimensionScores: scores,
    familyKey,
    familyLabel,
    runnerUpKey,
    runnerUpLabel,
    strategyModifier: resolved.result.strategyModifier,
    normativeModifier: resolved.result.normativeModifier,
  })

  const push = getDimensionPush(scores)
  const dominantDimensions = new Set(
    push.slice(0, DOMINANT_PUSH_COUNT).map((entry) => entry.dimension),
  )
  const maxDeviation = push[0]?.deviation || 1
  const comparison = getComparisonDimensions(familyKey, runnerUpKey, scores).slice(0, 2)
  const whyThis = getWhyThisResult(familyKey, runnerUpKey, scores)
  const separation = getRunnerUpSeparation(familyKey, runnerUpKey, scores)
  const wouldChange = getWhatWouldChangeThis(familyKey, runnerUpKey, scores)
  const caseRecord = verifiedCaseLibrary.cases.find(
    (record) => record.caseId === payoff.caseTest.caseId,
  )

  return (
    <main className={styles.page} id="site-main">
      <ScrollReveal />

      <section className={styles.payoff} data-scroll-section="payoff">
        <div className={styles.payoffPrimary}>
          <p className={styles.eyebrow}>Foundation result</p>
          <div className={styles.identity}>
            {isBlend ? (
              <FoundationMark
                code={archetype.code as BlendArchetype["code"]}
                primaryCode={baseline.leadingPureCode}
                presentation="hero"
              />
            ) : (
              <FoundationMark
                code={baseline.leadingPureCode}
                presentation="hero"
                decorative={false}
                label={`${archetype.name}, ${formatArchetypeCodeSpeech(archetype.code)}`}
              />
            )}
            <div>
              <h1 className={styles.archetypeName}>{archetype.name}</h1>
              <p className={styles.identityMeta}>
                <span aria-label={formatArchetypeCodeSpeech(archetype.code)}>
                  {formatArchetypeDisplayCode(archetype.code)}
                </span>
                <span>Closest modeled tradition: {familyLabel}</span>
              </p>
            </div>
          </div>

          <p className={styles.interpretation}>{resolved.result.explanation}</p>

          <p className={styles.placement}>
            {isBlend
              ? "Two reference cells are marked because the scores sit close enough that one cell would overstate the placement."
              : "One reference cell is marked, so this reading is a single archetype rather than a blend."}{" "}
            {firmness.reading}
          </p>

          <Link className={styles.action} href={`/results/${STUDY_FOUNDATION_TOKEN}`}>
            Open the full result
          </Link>
        </div>

        <div className={styles.payoffVisual}>
          <ArchetypeMatrix baseline={baseline} />
        </div>
      </section>

      <section
        className={styles.section}
        data-scroll-section="why"
        aria-labelledby="scroll-why"
      >
        <div className={styles.sectionHead}>
          <h2 id="scroll-why">Why this result</h2>
          <p className={styles.sectionLead}>
            The nearest alternative is {traditionNounLabel(runnerUpKey)}. The
            family scores separate the two by {nearestFitGap.toFixed(2)} on the
            scale the model uses to rank families, which is wider than the
            threshold below which the reading would be reported as an
            undifferentiated placement.
          </p>
        </div>

        <div className={styles.sectionBody}>
          <p className={styles.prose}>{separation}</p>
          <h3 className={styles.subhead}>The two dimensions doing the separating</h3>
          <ul className={styles.separationList}>
            {comparison.map((dimension) => (
              <li key={dimension.dim}>
                <strong>{dimension.label}</strong>
                <span>
                  {familyLabel} reference reads {dimension.primaryExpected}.{" "}
                  {runnerUpLabel} reference reads {dimension.runnerUpExpected}.
                </span>
              </li>
            ))}
          </ul>
          <p className={styles.prose}>{wouldChange}</p>
        </div>
      </section>

      <section
        className={styles.section}
        data-scroll-section="carried"
        aria-labelledby="scroll-carried"
      >
        <div className={styles.sectionHead}>
          <h2 id="scroll-carried">What carried the result</h2>
          <p className={styles.sectionLead}>
            All seven dimensions are shown. The three that moved furthest from
            the midpoint are held at full contrast, and the remaining four are
            drawn back because they did less work here.
          </p>
        </div>

        <div className={styles.sectionBody}>
          <ul className={styles.pushList}>
            {push.map((entry) => {
              const dominant = dominantDimensions.has(entry.dimension)
              return (
                <li
                  className={styles.pushRow}
                  data-dominant={dominant ? "true" : "false"}
                  key={entry.dimension}
                >
                  <span className={styles.pushLabel}>
                    {dimensionLabels[entry.dimension]}
                  </span>
                  <span className={styles.pushTrack}>
                    <span
                      className={styles.pushFill}
                      style={{
                        width: `${Math.max(4, (entry.deviation / maxDeviation) * 100)}%`,
                      }}
                    />
                  </span>
                  <span className={styles.pushPole}>
                    {dominant ? (
                      <>
                        <span>{entry.pole}</span>
                        <span className={styles.pushScore}>{entry.score.toFixed(1)}</span>
                      </>
                    ) : null}
                  </span>
                </li>
              )
            })}
          </ul>
          <ul className={styles.whyList}>
            {whyThis.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className={styles.footnote}>
            The poles name the direction each dimension leans, from{" "}
            {DIMENSION_POLES[push[0].dimension].low} to{" "}
            {DIMENSION_POLES[push[0].dimension].high} on the strongest one.
          </p>
        </div>
      </section>

      <ResultScrollLocalRecords
        expectedArchetypeCode={archetype.code}
        expectedFamilyKey={familyKey}
        expectedRunnerUpKey={runnerUpKey}
      />

      <section
        className={styles.section}
        data-scroll-section="limits"
        aria-labelledby="scroll-limits"
      >
        <div className={styles.sectionHead}>
          <h2 id="scroll-limits">Where this reading may fail</h2>
          <p className={styles.sectionLead}>{payoff.mainTension.body}</p>
        </div>

        <div className={styles.sectionBody}>
          <h3 className={styles.subhead}>The strongest objection</h3>
          <p className={styles.prose}>{payoff.mainTension.rivalArgument}</p>

          <h3 className={styles.subhead}>What the instrument does not model</h3>
          <p className={styles.prose}>
            Feminist, postcolonial or decolonial, green, and English School
            approaches are under-modeled here. The inventory may place those
            instincts near one of its four scored families without naming them
            directly.
          </p>
          <p className={styles.prose}>
            <Link href="/method">Read methods and coverage limits</Link>
          </p>

          <h3 className={styles.subhead}>A case that would test it</h3>
          <p className={styles.prose}>{payoff.caseTest.question}</p>
          <p className={styles.prose}>{payoff.caseTest.reason}</p>
          {caseRecord ? (
            <p className={styles.footnote}>
              {caseRecord.title}. {caseRecord.neutralContext}
            </p>
          ) : null}
        </div>
      </section>
    </main>
  )
}
