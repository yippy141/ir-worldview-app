import { dimensionLabels, getFoundationQuestions } from "@/lib/quiz-schema"
import {
  buildCanonicalFoundationResult,
  computeCoreDimensionScores,
  familyProfiles,
} from "@/lib/scoring"
import { getV2ScoringCalibration } from "@/lib/scoring"
import { resolveArchetype } from "@/lib/archetypes"
import { traditionNounLabel } from "@/lib/worldview-config"
import type {
  Answers,
  ChoiceOption,
  ChoiceQuestion,
  DimensionKey,
  FamilyKey,
  QuizMode,
  QuizSession,
} from "@/lib/types"

/**
 * Decisive choices are derived from the answer trace or they are not shown.
 *
 * A Foundation token carries dimension scores and a resolved identity. It
 * carries no item answers, so a shared or legacy result cannot support this
 * section at all. The only honest source is the unsent Foundation draft in
 * this browser, and it is used only when it recomputes to the same reading
 * the page is displaying.
 */

export type DecisiveChoice = Readonly<{
  questionId: string
  prompt: string
  selected: Readonly<{ title: string; label: string }>
  rival: Readonly<{ title: string; label: string }>
  /** The dimension on which the two logics disagree most. */
  reversalDimension: DimensionKey
  reversalDimensionLabel: string
  selectedDimensionValue: number
  rivalDimensionValue: number
}>

export type DecisiveChoiceTrace =
  | Readonly<{ status: "available"; choices: readonly DecisiveChoice[] }>
  | Readonly<{ status: "no-draft" }>
  | Readonly<{ status: "no-scenario-answers" }>
  | Readonly<{
      status: "different-reading"
      draftArchetypeName: string
      draftFamilyNoun: string
    }>

function alignment(
  signals: Partial<Record<DimensionKey, number>>,
  familyKey: FamilyKey,
): number {
  const weights = familyProfiles[familyKey]
  return Object.entries(signals).reduce((total, [dimension, value]) => {
    const weight = weights[dimension as DimensionKey] ?? 0
    return total + (Number(value) - 4) * weight
  }, 0)
}

function separatingDimension(
  selected: ChoiceOption,
  rival: ChoiceOption,
): { dimension: DimensionKey; selectedValue: number; rivalValue: number } | null {
  const dimensions = new Set<DimensionKey>([
    ...(Object.keys(selected.signals) as DimensionKey[]),
    ...(Object.keys(rival.signals) as DimensionKey[]),
  ])

  let best: {
    dimension: DimensionKey
    selectedValue: number
    rivalValue: number
    distance: number
  } | null = null

  for (const dimension of dimensions) {
    const selectedValue = selected.signals[dimension] ?? 4
    const rivalValue = rival.signals[dimension] ?? 4
    const distance = Math.abs(selectedValue - rivalValue)
    if (!best || distance > best.distance) {
      best = { dimension, selectedValue, rivalValue, distance }
    }
  }

  if (!best || best.distance < 0.5) return null
  return {
    dimension: best.dimension,
    selectedValue: best.selectedValue,
    rivalValue: best.rivalValue,
  }
}

function selectedOptionId(answer: unknown): string | null {
  if (typeof answer === "string") return answer
  if (
    typeof answer === "object" &&
    answer !== null &&
    typeof (answer as { primary?: unknown }).primary === "string"
  ) {
    return (answer as { primary: string }).primary
  }
  return null
}

function isChoiceQuestion(question: { kind: string }): question is ChoiceQuestion {
  return question.kind === "tradeoff" || question.kind === "miniCase"
}

export type DecisiveChoiceInput = Readonly<{
  session: QuizSession | null
  expectedArchetypeCode: string
  expectedFamilyKey: FamilyKey
  expectedRunnerUpKey: FamilyKey
  limit?: number
}>

export function buildDecisiveChoiceTrace({
  session,
  expectedArchetypeCode,
  expectedFamilyKey,
  expectedRunnerUpKey,
  limit = 3,
}: DecisiveChoiceInput): DecisiveChoiceTrace {
  const answers: Answers = session?.answers ?? {}
  if (!session || Object.keys(answers).length === 0) return { status: "no-draft" }

  const mode: QuizMode = session.activeMode ?? "standard"
  const dimensionScores = computeCoreDimensionScores(answers, mode)
  const result = buildCanonicalFoundationResult(dimensionScores)
  const { lowDifferentiationThreshold } = getV2ScoringCalibration("extended")
  const archetype = resolveArchetype(result, lowDifferentiationThreshold)

  if (
    archetype.code !== expectedArchetypeCode ||
    result.familyKey !== expectedFamilyKey
  ) {
    return {
      status: "different-reading",
      draftArchetypeName: archetype.name,
      draftFamilyNoun: traditionNounLabel(result.familyKey),
    }
  }

  const questions = getFoundationQuestions(mode).filter(isChoiceQuestion)
  const scored: Array<{ choice: DecisiveChoice; separation: number }> = []

  for (const question of questions) {
    const optionId = selectedOptionId(answers[question.id])
    if (!optionId) continue
    const selected = question.options.find((option) => option.id === optionId)
    if (!selected) continue

    const others = question.options.filter((option) => option.id !== optionId)
    if (others.length === 0) continue

    const rival = others.reduce((strongest, option) => {
      const optionPull =
        alignment(option.signals, expectedRunnerUpKey) -
        alignment(option.signals, expectedFamilyKey)
      const strongestPull =
        alignment(strongest.signals, expectedRunnerUpKey) -
        alignment(strongest.signals, expectedFamilyKey)
      return optionPull > strongestPull ? option : strongest
    })

    const separation =
      alignment(selected.signals, expectedFamilyKey) -
      alignment(selected.signals, expectedRunnerUpKey)
    if (separation <= 0) continue

    const reversal = separatingDimension(selected, rival)
    if (!reversal) continue

    scored.push({
      separation,
      choice: {
        questionId: question.id,
        prompt: question.prompt,
        selected: { title: selected.title, label: selected.label },
        rival: { title: rival.title, label: rival.label },
        reversalDimension: reversal.dimension,
        reversalDimensionLabel: dimensionLabels[reversal.dimension],
        selectedDimensionValue: reversal.selectedValue,
        rivalDimensionValue: reversal.rivalValue,
      },
    })
  }

  if (scored.length === 0) return { status: "no-scenario-answers" }

  return {
    status: "available",
    choices: scored
      .sort((a, b) => b.separation - a.separation)
      .slice(0, limit)
      .map(({ choice }) => choice),
  }
}
