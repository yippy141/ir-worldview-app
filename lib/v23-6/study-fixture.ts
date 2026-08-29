import { resolveFoundationPayload } from "@/lib/share"
import { resolveWorldviewMapBaseline } from "@/lib/field/archetype-matrix"
import type { FoundationSnapshot } from "@/lib/profile-store"

/**
 * One frozen Foundation token, already registered in this repository as the
 * saved Foundation of `tests/fixtures/profile-store-v5.json`. A unit test
 * asserts that the two stay byte-identical, so the study cannot drift onto an
 * invented result.
 *
 * The token predates the versioned payload shapes. It carries dimension
 * scores and a resolved identity, and it carries no item answers. That is the
 * point: the study needs a case where the answer trace is genuinely
 * unavailable, so the prototype has to show the honest empty state.
 */
export const STUDY_FOUNDATION_TOKEN =
  "eyJ2IjoyLCJkcyI6WzQuMyw1LjgsNC45LDUuMSw0LjcsNS40LDUuM10sImZrIjoiaW5zdGl0dXRpb25hbGlzdCIsIm5rIjoiY29uc3RydWN0aXZpc3QiLCJzbSI6IlJlc3RyYWluZXIiLCJubSI6IlBsdXJhbGlzdCJ9"

/** Matches the fixture's recorded completion time. */
export const STUDY_FOUNDATION_TIMESTAMP = 1_750_000_000_000

export function resolveStudyFoundation() {
  const resolved = resolveFoundationPayload(STUDY_FOUNDATION_TOKEN)
  if (!resolved) {
    throw new Error("The frozen study Foundation token no longer resolves.")
  }
  return resolved
}

export function buildStudyFoundationSnapshot(): FoundationSnapshot {
  const resolved = resolveStudyFoundation()

  return {
    timestamp: STUDY_FOUNDATION_TIMESTAMP,
    mode: "standard",
    payload: STUDY_FOUNDATION_TOKEN,
    instrumentStructuralVersion: resolved.provenance.instrumentStructuralVersion,
    scoringVersion: resolved.provenance.scoringVersion,
    resultPath: `/results/${STUDY_FOUNDATION_TOKEN}`,
    familyKey: resolved.result.familyKey,
    familyLabel: resolved.result.familyLabel,
    runnerUpKey: resolved.result.runnerUpKey,
    runnerUpLabel: resolved.result.runnerUpLabel,
    summary: resolved.result.explanation,
    dimensionScores: resolved.dimensionScores,
    strategyModifier: resolved.result.strategyModifier,
    normativeModifier: resolved.result.normativeModifier,
    keyDrivers: [],
    strongLenses: [],
    locale: "en",
    localeCopyVersion: resolved.provenance.localeCopyVersion,
  }
}

export function resolveStudyBaseline() {
  const baseline = resolveWorldviewMapBaseline(buildStudyFoundationSnapshot())
  if (!baseline) {
    throw new Error("The frozen study Foundation token no longer resolves a baseline.")
  }
  return baseline
}
