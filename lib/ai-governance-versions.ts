import * as v21Schema from "@/lib/ai-governance-schema-v21"
import * as v21Scoring from "@/lib/ai-governance-scoring-v21"
import * as v22Schema from "@/lib/ai-governance-schema"
import * as v22Scoring from "@/lib/ai-governance-scoring"

export type AiGovernanceVersionTuple = {
  bankVersion: number
  scoringVersion: number
}

export type AiGovernanceVersion = AiGovernanceVersionTuple & {
  schema: typeof v21Schema | typeof v22Schema
  scoring: typeof v21Scoring | typeof v22Scoring
}

export const AI_GOVERNANCE_V21_TUPLE = {
  bankVersion: 2,
  scoringVersion: 1,
} as const satisfies AiGovernanceVersionTuple

export const AI_GOVERNANCE_V22_TUPLE = {
  bankVersion: 3,
  scoringVersion: 2,
} as const satisfies AiGovernanceVersionTuple

export const SUPPORTED_AI_GOVERNANCE_VERSIONS = [
  {
    bankVersion: v21Schema.AI_GOVERNANCE_BANK_VERSION,
    scoringVersion: v21Scoring.AI_GOVERNANCE_SCORING_VERSION,
    schema: v21Schema,
    scoring: v21Scoring,
  },
  {
    bankVersion: v22Schema.AI_GOVERNANCE_BANK_VERSION,
    scoringVersion: v22Scoring.AI_GOVERNANCE_SCORING_VERSION,
    schema: v22Schema,
    scoring: v22Scoring,
  },
] as const satisfies readonly AiGovernanceVersion[]

export function getAiGovernanceVersion(
  bankVersion: number,
  scoringVersion: number,
): AiGovernanceVersion | null {
  return (
    SUPPORTED_AI_GOVERNANCE_VERSIONS.find(
      (candidate) =>
        candidate.bankVersion === bankVersion &&
        candidate.scoringVersion === scoringVersion,
    ) ?? null
  )
}

export function getCurrentAiGovernanceVersion(): AiGovernanceVersion {
  const version = getAiGovernanceVersion(
    AI_GOVERNANCE_V22_TUPLE.bankVersion,
    AI_GOVERNANCE_V22_TUPLE.scoringVersion,
  )
  if (!version) {
    throw new Error("Missing current AI Governance version.")
  }
  return version
}
