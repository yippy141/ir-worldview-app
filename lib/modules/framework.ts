import { securityModule } from "@/lib/modules/security"
import { technologyModule } from "@/lib/modules/technology"
import type {
  ModuleAnswers,
  ModuleDefinition,
  ModulePayload,
  ModuleQuestion,
  ModuleResult,
  ModuleSelection,
  ModuleSlug,
} from "@/lib/modules/types"
import type { DimensionScores, QuizMode } from "@/lib/types"

export const modules: readonly ModuleDefinition[] = [securityModule, technologyModule]
export const SECOND_CHOICE_WEIGHT = 0.45

const MODULE_MAP = Object.fromEntries(
  modules.map((moduleDefinition) => [moduleDefinition.slug, moduleDefinition]),
) as Record<ModuleSlug, ModuleDefinition>

export function getModuleDefinition(slug: string): ModuleDefinition | null {
  return slug in MODULE_MAP ? MODULE_MAP[slug as ModuleSlug] : null
}

export function getModuleQuestions(
  moduleDefinition: ModuleDefinition,
  mode: QuizMode,
) {
  return moduleDefinition.questionsByMode[mode]
}

export function encodeModulePayload(payload: ModulePayload): string {
  const json = JSON.stringify(payload)
  return btoa(json).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

export function decodeModulePayload(encoded: string): ModulePayload | null {
  try {
    const normalized = encoded.replace(/-/g, "+").replace(/_/g, "/")
    const paddingLength = (4 - (normalized.length % 4)) % 4
    const json = atob(`${normalized}${"=".repeat(paddingLength)}`)
    const parsed = JSON.parse(json) as
      | Partial<ModulePayload>
      | {
          v?: 1
          slug?: string
          answers?: Record<string, string>
        }

    if (
      parsed.v === 1 &&
      typeof parsed.slug === "string" &&
      getModuleDefinition(parsed.slug) &&
      typeof parsed.answers === "object" &&
      parsed.answers !== null
    ) {
      const answers = normalizeModuleAnswers(parsed.answers)
      if (!answers) return null

      return {
        v: 2,
        slug: parsed.slug as ModuleSlug,
        mode: "standard",
        answers,
      }
    }

    const answers = normalizeModuleAnswers(parsed.answers)

    if (
      parsed.v !== 2 ||
      typeof parsed.slug !== "string" ||
      !getModuleDefinition(parsed.slug) ||
      !isQuizMode(parsed.mode) ||
      !answers
    ) {
      return null
    }

    return {
      v: 2,
      slug: parsed.slug as ModuleSlug,
      mode: parsed.mode,
      answers,
    }
  } catch {
    return null
  }
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

export function scoreModule(
  moduleDefinition: ModuleDefinition,
  mode: QuizMode,
  answers: ModuleAnswers,
): Record<string, number> {
  const sums = Object.fromEntries(moduleDefinition.axes.map((axis) => [axis.key, 0]))
  const weights = Object.fromEntries(moduleDefinition.axes.map((axis) => [axis.key, 0]))

  for (const question of getModuleQuestions(moduleDefinition, mode)) {
    const answer = answers[question.id]
    if (!answer?.primary) continue

    applySignals(question, answer.primary, 1, sums, weights)

    if (
      mode === "analyst" &&
      question.allowSecondChoiceInAnalyst &&
      answer.secondary &&
      answer.secondary !== answer.primary
    ) {
      applySignals(question, answer.secondary, SECOND_CHOICE_WEIGHT, sums, weights)
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

export function buildModuleResult(
  moduleDefinition: ModuleDefinition,
  mode: QuizMode,
  answers: ModuleAnswers,
  foundation?: DimensionScores,
): ModuleResult {
  const scores = scoreModule(moduleDefinition, mode, answers)
  const interpretation = moduleDefinition.interpret(scores)
  const comparison =
    foundation && moduleDefinition.compareToFoundation
      ? moduleDefinition.compareToFoundation(scores, foundation)
      : undefined

  return {
    ...interpretation,
    scores,
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
      question.options.find((option) => option.id === answers[question.id]?.primary) ?? null,
    secondary:
      question.options.find((option) => option.id === answers[question.id]?.secondary) ?? null,
  }))
}

function applySignals(
  question: ModuleQuestion,
  optionId: string,
  weight: number,
  sums: Record<string, number>,
  weights: Record<string, number>,
) {
  const option = question.options.find((candidate) => candidate.id === optionId)
  if (!option) return

  for (const [axisKey, value] of Object.entries(option.signals)) {
    sums[axisKey] = (sums[axisKey] ?? 0) + value * weight
    weights[axisKey] = (weights[axisKey] ?? 0) + weight
  }
}

function normalizeModuleAnswers(value: unknown): ModuleAnswers | null {
  if (typeof value !== "object" || value === null) return null

  const normalized: ModuleAnswers = {}

  for (const [questionId, rawSelection] of Object.entries(value)) {
    const selection = normalizeModuleSelection(rawSelection)
    if (!selection) return null
    normalized[questionId] = selection
  }

  return normalized
}

function normalizeModuleSelection(value: unknown): ModuleSelection | null {
  if (typeof value === "string") {
    return { primary: value }
  }

  if (typeof value !== "object" || value === null) return null

  const parsed = value as Partial<ModuleSelection>
  if (typeof parsed.primary !== "string") return null
  if (parsed.secondary !== undefined && typeof parsed.secondary !== "string") return null

  return {
    primary: parsed.primary,
    ...(parsed.secondary ? { secondary: parsed.secondary } : {}),
  }
}

function isQuizMode(value: unknown): value is QuizMode {
  return value === "standard" || value === "analyst"
}
