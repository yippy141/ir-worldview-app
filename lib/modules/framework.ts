import { securityModule } from "@/lib/modules/security"
import { technologyModule } from "@/lib/modules/technology"
import {
  getModuleVersion,
  MODULE_V21_TUPLE,
  type ModuleVersion,
} from "@/lib/modules/versions"
import * as currentModuleRuntime from "@/lib/modules/runtime-v2"
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
import type { DimensionScores, QuizMode } from "@/lib/types"

export const modules: readonly ModuleDefinition[] = [securityModule, technologyModule]
export const SECOND_CHOICE_WEIGHT =
  currentModuleRuntime.SECOND_CHOICE_WEIGHT

export const MODULE_PERSPECTIVE_MATRIX = [
  {
    key: "coalitionManager",
    label: "Alliance manager / default coalition-facing logic",
    tags: ["alliance-manager", "major-power"],
  },
  {
    key: "rivalLogic",
    label: "Counterparty or rival-power logic",
    tags: ["major-power", "regional-security", "deterrence", "export-controls", "military"],
  },
  {
    key: "exposedState",
    label: "Exposed ally or vulnerable smaller state",
    tags: ["frontline-state", "small-state", "vulnerable-state", "middle-income"],
  },
  {
    key: "middlePowerHedging",
    label: "Middle-power or nonaligned hedging logic",
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
  return currentModuleRuntime.getModuleQuestions(moduleDefinition, mode)
}

export function moduleAllowsSecondChoice(question: ModuleQuestion) {
  return currentModuleRuntime.moduleAllowsSecondChoice(question)
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
  if (!resolveDecodedModulePayload(payload)) {
    throw new TypeError("Cannot encode an unsupported module payload.")
  }
  return encodeUrlPayload(payload)
}

export function decodeModulePayload(encoded: string): ModulePayload | null {
  return resolveModulePayload(encoded)?.payload ?? null
}

export type ResolvedModulePayload = ModuleVersion & {
  payload: ModulePayload
  sourcePayloadVersion: 1 | 2 | 3
}

export function resolveModulePayload(
  encoded: string,
): ResolvedModulePayload | null {
  return resolveDecodedModulePayload(decodeUrlPayload(encoded))
}

function resolveDecodedModulePayload(
  value: unknown,
): ResolvedModulePayload | null {
  if (typeof value !== "object" || value === null) return null
  const parsed = value as {
    v?: unknown
    bv?: unknown
    sv?: unknown
    slug?: unknown
    mode?: unknown
    answers?: unknown
  }
  const slug = isModuleSlug(parsed.slug) ? parsed.slug : null
  if (!slug) return null

  if (
    parsed.v === 1 &&
    typeof parsed.answers === "object" &&
    parsed.answers !== null
  ) {
    const answers = normalizeModuleAnswers(parsed.answers)
    const version = getModuleVersion(
      slug,
      MODULE_V21_TUPLE.bankVersion,
      MODULE_V21_TUPLE.scoringVersion,
    )
    if (!answers) return null
    if (
      !version ||
      !validateModuleAnswers(version, "standard", answers)
    ) {
      return null
    }

    return {
      ...version,
      sourcePayloadVersion: 1,
      payload: {
        v: 2,
        slug,
        mode: "standard",
        answers,
      },
    }
  }

  const answers = normalizeModuleAnswers(parsed.answers)
  if (!isQuizMode(parsed.mode) || !answers) return null

  if (parsed.v === 2) {
    const version = getModuleVersion(
      slug,
      MODULE_V21_TUPLE.bankVersion,
      MODULE_V21_TUPLE.scoringVersion,
    )
    if (
      !version ||
      !validateModuleAnswers(version, parsed.mode, answers)
    ) {
      return null
    }
    return {
      ...version,
      sourcePayloadVersion: 2,
      payload: {
        v: 2,
        slug,
        mode: parsed.mode,
        answers,
      },
    }
  }

  if (
    parsed.v !== 3 ||
    !Number.isInteger(parsed.bv) ||
    !Number.isInteger(parsed.sv)
  ) return null

  const version = getModuleVersion(
    slug,
    parsed.bv as number,
    parsed.sv as number,
  )
  if (
    !version ||
    !validateModuleAnswers(version, parsed.mode, answers)
  ) return null

  return {
    ...version,
    sourcePayloadVersion: 3,
    payload: {
      v: 3,
      bv: version.bankVersion,
      sv: version.scoringVersion,
      slug,
      mode: parsed.mode,
      answers,
    },
  }
}

export function countAnsweredModuleQuestions(
  moduleDefinition: ModuleDefinition,
  mode: QuizMode,
  answers: ModuleAnswers,
): number {
  return currentModuleRuntime.countAnsweredModuleQuestions(
    moduleDefinition,
    mode,
    answers,
  )
}

export function countAnsweredModuleQuestionsByLane(
  moduleDefinition: ModuleDefinition,
  mode: QuizMode,
  answers: ModuleAnswers,
) {
  return currentModuleRuntime.countAnsweredModuleQuestionsByLane(
    moduleDefinition,
    mode,
    answers,
  )
}

export function scoreModule(
  moduleDefinition: ModuleDefinition,
  mode: QuizMode,
  answers: ModuleAnswers,
): Record<string, number> {
  return currentModuleRuntime.scoreModule(moduleDefinition, mode, answers)
}

export function buildModuleAnalytics(
  moduleDefinition: ModuleDefinition,
  mode: QuizMode,
  answers: ModuleAnswers,
): ModuleAnalytics {
  return currentModuleRuntime.buildModuleAnalytics(
    moduleDefinition,
    mode,
    answers,
  )
}

export function buildModuleResult(
  moduleDefinition: ModuleDefinition,
  mode: QuizMode,
  answers: ModuleAnswers,
  foundation?: DimensionScores,
): ModuleResult {
  return currentModuleRuntime.buildModuleResult(
    moduleDefinition,
    mode,
    answers,
    foundation,
  )
}

export function getSelectedModuleOptions(
  moduleDefinition: ModuleDefinition,
  mode: QuizMode,
  answers: ModuleAnswers,
) {
  return currentModuleRuntime.getSelectedModuleOptions(
    moduleDefinition,
    mode,
    answers,
  )
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
  version: ModuleVersion,
  mode: QuizMode,
  answers: ModuleAnswers,
) {
  const questionMap = Object.fromEntries(
    version.runtime
      .getModuleQuestions(version.definition, mode)
      .map((question) => [question.id, question]),
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

function isModuleSlug(value: unknown): value is ModuleSlug {
  return value === "security" || value === "technology"
}
