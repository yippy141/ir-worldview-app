/**
 * Immutable V21 module scoring runtime.
 *
 * This file owns the historical weighting, aggregation, and result assembly
 * used by bank-v2/scorer-v1 module payloads.
 */
import type {
  ModuleAnalytics,
  ModuleAnswers,
  ModuleDefinition,
  ModuleQuestion,
  ModuleResult,
} from "@/lib/modules/types"
import type { ChoiceCardType, DimensionScores, QuizMode } from "@/lib/types"

export const MODULE_SCORING_VERSION = 1
export const SECOND_CHOICE_WEIGHT = 0.45

export function getModuleQuestions(
  moduleDefinition: ModuleDefinition,
  mode: QuizMode,
) {
  return moduleDefinition.questionsByMode[mode]
}

export function moduleAllowsSecondChoice(question: ModuleQuestion) {
  return Boolean(question.allowSecondChoiceInAnalyst)
}

export function countAnsweredModuleQuestions(
  moduleDefinition: ModuleDefinition,
  mode: QuizMode,
  answers: ModuleAnswers,
): number {
  return getModuleQuestions(moduleDefinition, mode).filter(
    (question) => answers[question.id]?.primary !== undefined,
  ).length
}

export function countAnsweredModuleQuestionsByLane(
  moduleDefinition: ModuleDefinition,
  mode: QuizMode,
  answers: ModuleAnswers,
) {
  return Object.fromEntries(
    moduleDefinition.lanes.map((lane) => [
      lane.key,
      getModuleQuestions(moduleDefinition, mode).filter(
        (question) =>
          question.lane === lane.key &&
          answers[question.id]?.primary !== undefined,
      ).length,
    ]),
  ) as Record<string, number>
}

export function scoreModule(
  moduleDefinition: ModuleDefinition,
  mode: QuizMode,
  answers: ModuleAnswers,
): Record<string, number> {
  return buildModuleAnalytics(moduleDefinition, mode, answers).scores
}

export function buildModuleAnalytics(
  moduleDefinition: ModuleDefinition,
  mode: QuizMode,
  answers: ModuleAnswers,
): ModuleAnalytics {
  const questions = getModuleQuestions(moduleDefinition, mode)
  const scoredQuestions = questions.filter(
    (question) => question.cardType !== "actorLens",
  )

  return {
    scores: scoreQuestions(moduleDefinition, scoredQuestions, answers),
    laneScores: Object.fromEntries(
      moduleDefinition.lanes.map((lane) => [
        lane.key,
        scoreQuestions(
          moduleDefinition,
          scoredQuestions.filter((question) => question.lane === lane.key),
          answers,
        ),
      ]),
    ),
    cardTypeScores: buildCardTypeScores(
      moduleDefinition,
      questions,
      answers,
    ),
  }
}

function scoreQuestions(
  moduleDefinition: ModuleDefinition,
  questions: ModuleQuestion[],
  answers: ModuleAnswers,
) {
  const sums = Object.fromEntries(
    moduleDefinition.axes.map((axis) => [axis.key, 0]),
  )
  const weights = Object.fromEntries(
    moduleDefinition.axes.map((axis) => [axis.key, 0]),
  )

  for (const question of questions) {
    const answer = answers[question.id]
    if (!answer?.primary) continue

    applySignals(question, answer.primary, 1, sums, weights)

    if (
      moduleAllowsSecondChoice(question) &&
      answer.secondary &&
      answer.secondary !== answer.primary
    ) {
      applySignals(
        question,
        answer.secondary,
        SECOND_CHOICE_WEIGHT,
        sums,
        weights,
      )
    }
  }

  return Object.fromEntries(
    moduleDefinition.axes.map((axis) => {
      const totalWeight = weights[axis.key] ?? 0
      const score = totalWeight > 0 ? (sums[axis.key] ?? 0) / totalWeight : 4
      return [axis.key, Number(score.toFixed(2))]
    }),
  )
}

function buildCardTypeScores(
  moduleDefinition: ModuleDefinition,
  questions: ModuleQuestion[],
  answers: ModuleAnswers,
) {
  const cardTypes: ChoiceCardType[] = [
    "explanation",
    "decision",
    "actorLens",
    "both",
  ]
  const scores: Partial<
    Record<ChoiceCardType, Record<string, number>>
  > = {}

  for (const cardType of cardTypes) {
    const filtered = questions.filter(
      (question) => question.cardType === cardType,
    )
    if (filtered.length === 0) continue
    scores[cardType] = scoreQuestions(
      moduleDefinition,
      filtered,
      answers,
    )
  }

  return scores
}

export function buildModuleResult(
  moduleDefinition: ModuleDefinition,
  mode: QuizMode,
  answers: ModuleAnswers,
  foundation?: DimensionScores,
): ModuleResult {
  const analytics = buildModuleAnalytics(moduleDefinition, mode, answers)
  const interpretation = moduleDefinition.interpret(analytics)
  const laneSummaries = moduleDefinition.summarizeLanes(
    analytics,
    foundation,
  )
  const cardTypeRead = moduleDefinition.summarizeCardTypes?.(analytics)
  const comparison =
    foundation && moduleDefinition.compareToFoundation
      ? moduleDefinition.compareToFoundation(analytics, foundation)
      : undefined

  return {
    ...interpretation,
    scores: analytics.scores,
    laneSummaries,
    ...(cardTypeRead ? { cardTypeRead } : {}),
    cardTypeScores: analytics.cardTypeScores,
    overlayDeltas: moduleDefinition.buildOverlayDeltas(analytics),
    comparison: comparison || undefined,
  }
}

export function getSelectedModuleOptions(
  moduleDefinition: ModuleDefinition,
  mode: QuizMode,
  answers: ModuleAnswers,
) {
  return getModuleQuestions(moduleDefinition, mode).map((question) => ({
    question,
    primary:
      question.options.find(
        (option) => option.id === answers[question.id]?.primary,
      ) ?? null,
    secondary:
      question.options.find(
        (option) => option.id === answers[question.id]?.secondary,
      ) ?? null,
  }))
}

function applySignals(
  question: ModuleQuestion,
  optionId: string,
  weight: number,
  sums: Record<string, number>,
  weights: Record<string, number>,
) {
  const option = question.options.find(
    (candidate) => candidate.id === optionId,
  )
  if (!option) return

  for (const [axisKey, value] of Object.entries(option.signals)) {
    sums[axisKey] = (sums[axisKey] ?? 0) + value * weight
    weights[axisKey] = (weights[axisKey] ?? 0) + weight
  }
}
