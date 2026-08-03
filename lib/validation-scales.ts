import { getFoundationQuestions } from "@/lib/quiz-schema"
import type {
  Answers,
  ValidationLikertQuestion,
  ValidationScaleKey,
} from "@/lib/types"

export type ValidationScales = {
  militantInternationalism: number
  cooperativeInternationalism: number
  isolationism: number
}

const VALIDATION_SCALE_KEYS: ValidationScaleKey[] = [
  "militantInternationalism",
  "cooperativeInternationalism",
  "isolationism",
]

const validationItems = getFoundationQuestions("standard").filter(
  (question): question is ValidationLikertQuestion =>
    question.kind === "likert" && question.scoringBlock === "validation",
)

/**
 * Computes research-only validation means on the published 1–7 response scale.
 * Reverse-keyed items are oriented so higher values consistently indicate more
 * of the named foreign-policy orientation.
 */
export function computeValidationScales(answers: Answers): ValidationScales {
  const valuesByScale = Object.fromEntries(
    VALIDATION_SCALE_KEYS.map((scale) => [scale, [] as number[]]),
  ) as Record<ValidationScaleKey, number[]>

  for (const item of validationItems) {
    const rawValue = answers[item.id]
    if (
      typeof rawValue !== "number" ||
      !Number.isInteger(rawValue) ||
      rawValue < 1 ||
      rawValue > 7
    ) {
      throw new Error(
        `Validation item ${item.id} requires an integer answer from 1 to 7.`,
      )
    }

    valuesByScale[item.validationScale].push(
      item.reverse ? 8 - rawValue : rawValue,
    )
  }

  return {
    militantInternationalism: meanFor(
      "militantInternationalism",
      valuesByScale,
    ),
    cooperativeInternationalism: meanFor(
      "cooperativeInternationalism",
      valuesByScale,
    ),
    isolationism: meanFor("isolationism", valuesByScale),
  }
}

function meanFor(
  scale: ValidationScaleKey,
  valuesByScale: Record<ValidationScaleKey, number[]>,
) {
  const values = valuesByScale[scale]
  if (values.length === 0) {
    throw new Error(`Validation scale ${scale} has no configured items.`)
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length
}
