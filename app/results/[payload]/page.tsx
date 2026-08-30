import Link from "next/link"
import { FoundationProfileSync } from "@/components/profile/foundation-profile-sync"
import { ResearchStatusNotice } from "@/components/research/research-status-notice"
import {
  FoundationResultStory,
} from "@/components/results/foundation-result-story"
import { HistoryCompare } from "@/components/results/history-compare"
import { ResultCardHeroShare } from "@/components/results/result-card-hero-share"
import { ShareActions } from "@/components/results/share-actions"
import { localizedAlternates, publicPath } from "@/i18n/paths"
import { getAtlasPatternHref } from "@/lib/atlas-lite"
import {
  explainArchetypeReadingCode,
  formatArchetypeReadingCode,
  formatArchetypeReadingCodeForSpeech,
} from "@/lib/archetype-display"
import {
  normFromNormativeModifier,
  resolveArchetype,
} from "@/lib/archetypes"
import { verifiedCaseLibrary } from "@/lib/content/verified-case-library"
import { buildEnglishFoundationResultSocialCopy } from "@/lib/foundation-social-copy"
import { buildFoundationNarrative } from "@/lib/narrative/foundation"
import {
  getComparisonDimensions,
  getKeyDrivers,
  getStrongLenses,
} from "@/lib/result-helpers"
import { decomposeFoundationFamilyDifference } from "@/lib/results/foundation-contributions"
import { DIMENSION_POLES } from "@/lib/results/dimension-bands"
import { buildFoundationPayoff } from "@/lib/results/foundation-payoff"
import { getV2ScoringCalibration } from "@/lib/scoring"
import { resolveFoundationPayload } from "@/lib/share"
import { buildFoundationShareCardUrl } from "@/lib/share-card"
import { traditionNounLabel } from "@/lib/worldview-config"
import type { Metadata } from "next"

export async function generateMetadata(
  { params }: { params: Promise<{ payload: string }> },
): Promise<Metadata> {
  const { payload } = await params
  const resolved = resolveFoundationPayload(payload)
  if (!resolved) {
    const title = "Shared IR result | IR Worldview Inventory"
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
  const socialCopy = buildEnglishFoundationResultSocialCopy(archetype, norm)
  const cardImage = buildFoundationShareCardUrl(payload)

  return buildResultMetadata(
    payload,
    socialCopy.title,
    socialCopy.description,
    cardImage,
    socialCopy.cardAlt,
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
            The result URL may be incomplete, corrupted, or from an older
            version of the inventory.
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
  const calibration = getV2ScoringCalibration(resolved.scoringCalibration)
  const lowDifferentiation =
    result.nearestFitGap < calibration.lowDifferentiationThreshold
  const currentPayload = resolved.payload.v === 5
  const primaryLabel = traditionNounLabel(result.familyKey)
  const runnerUpLabel = traditionNounLabel(result.runnerUpKey)
  const comparisonRows = getComparisonDimensions(
    result.familyKey,
    result.runnerUpKey,
    dimensionScores,
  ).map((row) => ({
    key: row.dim,
    label: row.label,
    lowLabel: DIMENSION_POLES[row.dim].low,
    highLabel: DIMENSION_POLES[row.dim].high,
    userScore: row.userScore,
    primaryExpected: row.primaryExpected,
    runnerUpExpected: row.runnerUpExpected,
  }))
  const contribution = currentPayload
    ? decomposeFoundationFamilyDifference({
        dimensionScores,
        calibration: resolved.scoringCalibration,
        primaryFamily: result.familyKey,
        runnerUpFamily: result.runnerUpKey,
      })
    : null
  const payoff = buildFoundationPayoff({
    dimensionScores,
    familyKey: result.familyKey,
    familyLabel: primaryLabel,
    runnerUpKey: result.runnerUpKey,
    runnerUpLabel,
    strategyModifier: result.strategyModifier,
    normativeModifier: result.normativeModifier,
  })
  const narrative = buildFoundationNarrative({
    familyKey: result.familyKey,
    runnerUpKey: result.runnerUpKey,
    strategyModifier: result.strategyModifier,
    normativeModifier: result.normativeModifier,
    dimensionScores,
    scoringCalibration: resolved.scoringCalibration,
  })
  const keyDrivers = getKeyDrivers(dimensionScores)
  const strongLenses = getStrongLenses(dimensionScores)
  const pressureCase = verifiedCaseLibrary.cases.find(
    (caseStudy) => caseStudy.caseId === payoff.caseTest.caseId,
  ) ?? null
  const pressureCaseHref = pressureCase
    ? `${getAtlasPatternHref(pressureCase.verifiedProfileReading.bestFitProfileId)}#case-${pressureCase.caseId}`
    : null
  const archetype = resolveArchetype(
    result,
    calibration.lowDifferentiationThreshold,
  )
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
  const targetedExtensionHref =
    `/quiz?extension=targeted&first=${result.familyKey}&second=${result.runnerUpKey}`
  const nextAction = resultTier === "core"
    ? {
        href: currentPayload && lowDifferentiation
          ? targetedExtensionHref
          : "/quiz?extension=full",
        label: currentPayload && lowDifferentiation
          ? "Answer 5 targeted items"
          : "Take the full extended set",
        reason: currentPayload && lowDifferentiation
          ? `${primaryLabel} and ${runnerUpLabel} remain close. Five follow-up items target the distinctions between them.`
          : "The extended set adds more item evidence to the provisional core reading.",
      }
    : {
        href: withFoundationPayload(payoff.nextStep.href, payload),
        label: payoff.nextStep.label,
        reason: payoff.nextStep.reason,
      }

  return (
    <div className="wide-container">
      <FoundationProfileSync
        snapshot={{
          payload,
          resultPath: `/results/${payload}`,
          familyKey: result.familyKey,
          familyLabel: result.familyLabel,
          runnerUpKey: result.runnerUpKey,
          runnerUpLabel: result.runnerUpLabel,
          summary: narrative.summary,
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

      <FoundationResultStory
        payload={payload}
        resultTier={resultTier}
        questionSet={resolved.questionSet}
        legacy={!currentPayload}
        lowDifferentiation={lowDifferentiation}
        primaryFamily={result.familyKey}
        primaryLabel={primaryLabel}
        runnerUpFamily={result.runnerUpKey}
        runnerUpLabel={runnerUpLabel}
        archetype={archetype}
        archetypeCode={archetypeCode}
        archetypeCodeSpeech={archetypeCodeSpeech}
        archetypeCodeKey={explainArchetypeReadingCode(archetype.code, normativeSuffix)}
        comparisonRows={comparisonRows}
        contributionRows={contribution?.rows ?? []}
        payoff={payoff}
        pressureCase={pressureCase ? {
          title: pressureCase.title,
          theme: pressureCase.theme,
          question: payoff.caseTest.question,
          reason: payoff.caseTest.reason,
          href: pressureCaseHref,
        } : null}
        nextAction={nextAction}
        utility={
          <>
            <p>
              <Link href="/feedback">Report a factual problem</Link>
            </p>
            <ResearchStatusNotice instrumentLabel="Foundation" />
            <ShareActions
              payload={payload}
              familyLabel={primaryLabel}
              strategyModifier={result.strategyModifier}
              normativeModifier={result.normativeModifier}
              displayLabel={archetypeShareLabel}
            />
            <HistoryCompare
              familyKey={result.familyKey}
              neighborKey={result.runnerUpKey}
              strategyModifier={result.strategyModifier}
              normativeModifier={result.normativeModifier}
              dimensionScores={dimensionScores}
              provenance={{
                locale: resolved.provenance.completionLocale,
                localeCopyVersion: resolved.provenance.localeCopyVersion,
              }}
            />
            <div className="row gap-sm wrap print-hidden">
              <ResultCardHeroShare
                shareUrl={`/results/${payload}`}
                title={`IR Worldview: ${archetype.name}`}
                text={`My IR worldview result: ${archetypeShareLabel}`}
              />
            </div>
          </>
        }
      />
    </div>
  )
}

function withFoundationPayload(href: string, payload: string) {
  if (!href.startsWith("/modules/")) return href

  return `${href}?foundation=${encodeURIComponent(payload)}`
}
