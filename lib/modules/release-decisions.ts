import type { DomainReleaseDecisionReference } from "@/lib/modules/authoring-contract"

export type RecognizedModuleReleaseDecision =
  DomainReleaseDecisionReference & {
    slug: string
  }

export const RECOGNIZED_MODULE_RELEASE_DECISIONS = [
  {
    slug: "security",
    decisionId: "security-v5-public-beta-2026-08-21",
    decisionPath:
      "docs/v23/security/V23_3_SECURITY_V5_BETA_RELEASE_DECISION.md",
    approvedQuestionBankVersion: 5,
    approvedScoringVersion: 2,
    approvedResultCopyVersion: 2,
    approvedManifestVersion: 2,
    decisionStatus: "approved-public-beta",
    reviewDueAt: "2026-11-21T00:00:00Z",
  },
  {
    slug: "technology",
    decisionId: "technology-v3-public-beta-2026-08-21",
    decisionPath:
      "docs/v23/V23_4_TECHNOLOGY_V3_BETA_RELEASE_DECISION.md",
    approvedQuestionBankVersion: 3,
    approvedScoringVersion: 2,
    approvedResultCopyVersion: 1,
    approvedManifestVersion: 2,
    decisionStatus: "approved-public-beta",
    reviewDueAt: "2026-11-21T00:00:00Z",
  },
] as const satisfies readonly RecognizedModuleReleaseDecision[]

export function getRecognizedModuleReleaseDecision(
  decisionId: string,
): RecognizedModuleReleaseDecision | null {
  return (
    RECOGNIZED_MODULE_RELEASE_DECISIONS.find(
      (decision) => decision.decisionId === decisionId,
    ) ?? null
  )
}
