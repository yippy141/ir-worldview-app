import { securityModule } from "@/lib/modules/security"
import { technologyModule } from "@/lib/modules/technology"
import { decodeUrlPayload, encodeUrlPayload } from "@/lib/url-payload"
import type {
  ModuleAnalytics,
  ModuleAnswers,
  ModuleDefinition,
  ModulePayload,
  ModuleQuestion,
  ModuleResult,
  ModuleSelection,
  ModuleSlug,
} from "@/lib/modules/types"
import type { ChoiceCardType, DimensionScores, QuizMode } from "@/lib/types"

export const modules: readonly ModuleDefinition[] = [securityModule, technologyModule]
export const SECOND_CHOICE_WEIGHT = 0.45

export const MODULE_PERSPECTIVE_MATRIX = [
  {
    key: "coalitionManager",
    label: "Alliance manager / status quo coalition actor",
    tags: ["alliance-manager", "major-power"],
  },
  {
    key: "rivalLogic",
    label: "Rival or rising-power logic",
    tags: ["major-power", "regional-security", "deterrence", "export-controls", "military"],
  },
  {
    key: "exposedState",
    label: "Exposed ally or vulnerable smaller state",
    tags: ["frontline-state", "small-state", "vulnerable-state", "middle-income"],
  },
  {
    key: "middlePowerHedging",
    label: "Nonaligned or middle-power hedging logic",
    tags: ["middle-power", "nonaligned", "hedging"],
  },
  {
    key: "developmental",
    label: "Developmental / dependency / capacity-constrained actor",
    tags: ["developmental", "dependency", "state-capacity", "middle-income", "supply-chain"],
  },
  {
    key: "protectionAuthority",
    label: "Legality / protection / authority logic",
    tags: [
      "humanitarian",
      "civilian-protection",
      "post-conflict",
      "regional-order",
      "ai-governance",
      "safety",
      "regulation",
      "incident-response",
    ],
  },
] as const

export type ModulePerspectiveCoverage = {
  key: (typeof MODULE_PERSPECTIVE_MATRIX)[number]["key"]
  label: string
  count: number
}

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

export function moduleAllowsSecondChoice(question: ModuleQuestion) {
  return Boolean(question.allowSecondChoiceInAnalyst)
}

export function getModulePerspectiveCoverage(
  moduleDefinition: ModuleDefinition,
  mode: QuizMode = "analyst",
): ModulePerspectiveCoverage[] {
  const questions = getModuleQuestions(moduleDefinition, mode)

  return MODULE_PERSPECTIVE_MATRIX.map((role) => ({
    key: role.key,
    label: role.label,
    count: questions.filter((question) =>
      question.perspectiveTags.some((tag) => role.tags.some((roleTag) => roleTag === tag))
    ).length,
  }))
}

export function hasCompleteModulePerspectiveCoverage(
  moduleDefinition: ModuleDefinition,
  mode: QuizMode = "analyst",
) {
  return getModulePerspectiveCoverage(moduleDefinition, mode).every((role) => role.count > 0)
}

export function encodeModulePayload(payload: ModulePayload): string {
  return encodeUrlPayload(payload)
}

export function decodeModulePayload(encoded: string): ModulePayload | null {
  const parsed = decodeUrlPayload(encoded) as
    | Partial<ModulePayload>
    | {
        v?: 1
        slug?: string
        answers?: Record<string, string>
      }
    | null

  if (!parsed) {
    return null
  }

  if (
    parsed.v === 1 &&
    typeof parsed.slug === "string" &&
    getModuleDefinition(parsed.slug) &&
    typeof parsed.answers === "object" &&
    parsed.answers !== null
  ) {
    const answers = normalizeModuleAnswers(parsed.answers)
    const moduleDefinition = getModuleDefinition(parsed.slug)
    if (!answers) return null
    if (!moduleDefinition || !validateModuleAnswers(moduleDefinition, "standard", answers)) {
      return null
    }

    return {
      v: 2,
      slug: parsed.slug as ModuleSlug,
      mode: "standard",
      answers,
    }
  }

  const answers = normalizeModuleAnswers(parsed.answers)
  const moduleDefinition =
    typeof parsed.slug === "string" ? getModuleDefinition(parsed.slug) : null

  if (
    parsed.v !== 2 ||
    typeof parsed.slug !== "string" ||
    !moduleDefinition ||
    !isQuizMode(parsed.mode) ||
    !answers ||
    !validateModuleAnswers(moduleDefinition, parsed.mode, answers)
  ) {
    return null
  }

  return {
    v: 2,
    slug: parsed.slug as ModuleSlug,
    mode: parsed.mode,
    answers,
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

export function countAnsweredModuleQuestionsByLane(
  moduleDefinition: ModuleDefinition,
  mode: QuizMode,
  answers: ModuleAnswers,
) {
  return Object.fromEntries(
    moduleDefinition.lanes.map((lane) => [
      lane.key,
      getModuleQuestions(moduleDefinition, mode).filter(
        (question) => question.lane === lane.key && answers[question.id]?.primary !== undefined,
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

  return {
    scores: scoreQuestions(moduleDefinition, questions, answers, mode),
    laneScores: Object.fromEntries(
      moduleDefinition.lanes.map((lane) => [
        lane.key,
        scoreQuestions(
          moduleDefinition,
          questions.filter((question) => question.lane === lane.key),
          answers,
          mode,
        ),
      ]),
    ),
    cardTypeScores: buildCardTypeScores(moduleDefinition, questions, answers, mode),
  }
}

function scoreQuestions(
  moduleDefinition: ModuleDefinition,
  questions: ModuleQuestion[],
  answers: ModuleAnswers,
  mode: QuizMode,
) {
  const sums = Object.fromEntries(moduleDefinition.axes.map((axis) => [axis.key, 0]))
  const weights = Object.fromEntries(moduleDefinition.axes.map((axis) => [axis.key, 0]))

  for (const question of questions) {
    const answer = answers[question.id]
    if (!answer?.primary) continue

    applySignals(question, answer.primary, 1, sums, weights)

    if (
      moduleAllowsSecondChoice(question) &&
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

function buildCardTypeScores(
  moduleDefinition: ModuleDefinition,
  questions: ModuleQuestion[],
  answers: ModuleAnswers,
  mode: QuizMode,
) {
  const cardTypes: ChoiceCardType[] = ["explanation", "decision", "both"]
  const scores: Partial<Record<ChoiceCardType, Record<string, number>>> = {}

  for (const cardType of cardTypes) {
    const filtered = questions.filter((question) => question.cardType === cardType)
    if (filtered.length === 0) continue
    scores[cardType] = scoreQuestions(moduleDefinition, filtered, answers, mode)
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
  const laneSummaries = moduleDefinition.summarizeLanes(analytics, foundation)
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

function validateModuleAnswers(
  moduleDefinition: ModuleDefinition,
  mode: QuizMode,
  answers: ModuleAnswers,
) {
  const questionMap = Object.fromEntries(
    getModuleQuestions(moduleDefinition, mode).map((question) => [question.id, question]),
  ) as Record<string, ModuleQuestion>

  for (const [questionId, selection] of Object.entries(answers)) {
    const question = questionMap[questionId]
    if (!question) return false

    const optionIds = new Set(question.options.map((option) => option.id))
    if (!optionIds.has(selection.primary)) return false
    if (selection.secondary && !optionIds.has(selection.secondary)) return false
  }

  return true
}

function isQuizMode(value: unknown): value is QuizMode {
  return value === "standard" || value === "analyst"
}
