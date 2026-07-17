import { matchAtlasLiteFoundation } from "@/lib/atlas-lite"
import { isResponseForCurrentCase } from "@/lib/current-cases/response-store"
import type {
  CompletedCurrentCaseResponse,
  CurrentCase,
  CurrentCaseFoundationConnection,
} from "@/lib/current-cases/types"
import { assessFoundationNarrative } from "@/lib/narrative/foundation"
import type { FoundationSnapshot } from "@/lib/profile-store"
import { getTopDimensions } from "@/lib/result-helpers"

/**
 * Makes an editorial connection to the existing Foundation projection. It
 * does not rescore the Foundation, modify the snapshot, or infer a new family.
 */
export function compareCompletedCaseWithFoundation(
  record: Pick<CurrentCase, "id" | "slug" | "version" | "decision" | "worldviewReadings">,
  response: CompletedCurrentCaseResponse,
  foundation: FoundationSnapshot | null,
): CurrentCaseFoundationConnection {
  const unavailable: CurrentCaseFoundationConnection = {
    kind: "unavailable",
    selectedOptionId: response.selectedOptionId,
    foundationPatternId: null,
    foundationPatternLabel: null,
    readingProfileId: null,
    dimensions: [],
    summary:
      "Complete the Foundation to compare this judgment with your saved baseline.",
  }

  if (!foundation || !isResponseForCurrentCase(response, record)) return unavailable

  const foundationAssessment = assessFoundationNarrative(foundation.dimensionScores)
  const match = matchAtlasLiteFoundation({
    familyKey: foundation.familyKey,
    runnerUpKey: foundation.runnerUpKey,
    strategyModifier: foundation.strategyModifier,
    normativeModifier: foundation.normativeModifier,
    dimensionScores: foundation.dimensionScores,
    foundationState: foundationAssessment.state,
  })
  const reading = record.worldviewReadings.find(
    (candidate) => candidate.profileId === match.nearest.id,
  )
  const dimensions = getTopDimensions(foundation.dimensionScores, 3)

  if (!reading) {
    return {
      kind: "not-covered",
      selectedOptionId: response.selectedOptionId,
      foundationPatternId: match.nearest.id,
      foundationPatternLabel: match.nearest.publicName,
      readingProfileId: null,
      dimensions,
      summary:
        "The profile nearest your Foundation falls outside this case’s selected readings. This case cannot make a baseline comparison for that pattern.",
    }
  }

  const consistent = reading.recommendedOptionIds.includes(response.selectedOptionId)
  return {
    kind: consistent ? "consistent" : "tension",
    selectedOptionId: response.selectedOptionId,
    foundationPatternId: match.nearest.id,
    foundationPatternLabel: match.nearest.publicName,
    readingProfileId: reading.profileId,
    dimensions,
    summary: consistent
      ? `Your decision aligns with the ${match.nearest.publicName} reading included in this case. This contextual comparison leaves your Foundation score unchanged.`
      : `Your decision differs from the ${match.nearest.publicName} reading included in this case. The difference shows where this context pulls against your saved baseline.`,
  }
}
