import type { CurrentCaseConfidence } from "@/lib/current-cases/types"

export const CURRENT_CASE_CHALLENGE_SCHEMA_VERSION = 1 as const
export const CURRENT_CASE_CHALLENGE_LIFETIME_SECONDS = 30 * 24 * 60 * 60

export type CurrentCaseChallengeClaims = {
  schemaVersion: typeof CURRENT_CASE_CHALLENGE_SCHEMA_VERSION
  caseId: string
  inviterFinalOptionId: string
  inviterConfidence: CurrentCaseConfidence
  issuedAt: number
  expiresAt: number
  nonce: string
}

export type CurrentCaseChallengeContext = {
  token: string
  expiresAt: number
}

export type CurrentCaseChallengeReveal = {
  inviterFinalOptionId: string
  inviterConfidence: CurrentCaseConfidence
}

export type CurrentCaseChallengeFailureReason =
  | "malformed"
  | "invalid"
  | "expired"
  | "wrong-case"
  | "missing-secret"
