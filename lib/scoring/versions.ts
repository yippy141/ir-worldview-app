import * as v1 from "@/lib/scoring/v1"
import * as v2 from "@/lib/scoring/v2"
import type { Answers, QuizMode } from "@/lib/types"
import type { CanonicalFoundationResult } from "@/lib/scoring/v2"

export const SCORING_VERSION_NAMES = ["v1", "v2"] as const
export type ScoringVersionName = (typeof SCORING_VERSION_NAMES)[number]

export type FoundationScoringVersion = {
  FOUNDATION_SCORING_VERSION: number
  generateResult(
    answers: Answers,
    mode?: QuizMode,
  ): CanonicalFoundationResult
}

const SCORING_VERSIONS = {
  v1,
  v2,
} as const satisfies Record<ScoringVersionName, FoundationScoringVersion>

export function getScoringVersion(
  name: string,
): FoundationScoringVersion | null {
  return isScoringVersionName(name) ? SCORING_VERSIONS[name] : null
}

export function isScoringVersionName(
  name: string,
): name is ScoringVersionName {
  return SCORING_VERSION_NAMES.some((candidate) => candidate === name)
}
