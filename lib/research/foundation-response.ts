import type { Answers } from "@/lib/types"
import {
  computeValidationScales,
  type ValidationScales,
} from "@/lib/validation-scales"

/**
 * The Foundation-specific fragment persisted alongside an opted-in research
 * response. Research intake is currently disabled, but keeping this builder at
 * the storage boundary prevents a future adapter from saving raw answers
 * without their corresponding validation means.
 */
export type FoundationResearchResponseRecord = {
  answers: Answers
  validationScales: ValidationScales
}

export function buildFoundationResearchResponseRecord(
  answers: Answers,
): FoundationResearchResponseRecord {
  return {
    answers: { ...answers },
    validationScales: computeValidationScales(answers),
  }
}
