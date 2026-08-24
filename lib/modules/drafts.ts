import { MODULE_DRAFT_STORAGE_KEY } from "@/lib/storage-keys"
import type {
  ModuleAnswers,
  ModuleQuestion,
  ModuleSlug,
} from "@/lib/modules/types"
import type { QuizMode } from "@/lib/types"

export const MODULE_DRAFT_MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000

export type ModuleDraftStage = "questions" | "review"

export type ModuleDraftV1 = {
  v: 1
  slug: ModuleSlug
  locale: string
  mode: QuizMode
  bankVersion: number
  scoringVersion: number
  orderSeed: string
  answers: ModuleAnswers
  currentQuestionId: string | null
  stage: ModuleDraftStage
  updatedAt: number
}

export type ModuleDraftStoreV1 = {
  v: 1
  selectedMode: Record<string, QuizMode>
  drafts: Record<string, ModuleDraftV1>
}

export type ModuleDraftContext = {
  slug: ModuleSlug
  locale: string
  mode: QuizMode
  bankVersion: number
  scoringVersion: number
  questions: readonly ModuleQuestion[]
  allowsSecondChoice: (question: ModuleQuestion) => boolean
}

type StorageReader = Pick<Storage, "getItem">
type StorageWriter = Pick<Storage, "getItem" | "setItem">

export function createEmptyModuleDraftStore(): ModuleDraftStoreV1 {
  return { v: 1, selectedMode: {}, drafts: {} }
}

export function getModuleDraftKey(context: ModuleDraftContext): string {
  return [
    context.slug,
    context.locale,
    context.mode,
    `bank-${context.bankVersion}`,
    `scorer-${context.scoringVersion}`,
  ].join(":")
}

export function getModuleModeKey(slug: ModuleSlug, locale: string): string {
  return `${slug}:${locale}`
}

export function createModuleDraft(
  context: ModuleDraftContext,
  orderSeed: string,
  now = Date.now(),
): ModuleDraftV1 {
  return {
    v: 1,
    slug: context.slug,
    locale: context.locale,
    mode: context.mode,
    bankVersion: context.bankVersion,
    scoringVersion: context.scoringVersion,
    orderSeed,
    answers: {},
    currentQuestionId: context.questions[0]?.id ?? null,
    stage: "questions",
    updatedAt: now,
  }
}

export function normalizeModuleDraft(
  value: unknown,
  context: ModuleDraftContext,
  now = Date.now(),
): ModuleDraftV1 | null {
  if (!isRecord(value)) return null
  if (
    value.v !== 1 ||
    value.slug !== context.slug ||
    value.locale !== context.locale ||
    value.mode !== context.mode ||
    value.bankVersion !== context.bankVersion ||
    value.scoringVersion !== context.scoringVersion ||
    typeof value.orderSeed !== "string" ||
    value.orderSeed.length < 1 ||
    typeof value.updatedAt !== "number" ||
    !Number.isFinite(value.updatedAt) ||
    value.updatedAt > now + 5 * 60 * 1000 ||
    now - value.updatedAt > MODULE_DRAFT_MAX_AGE_MS
  ) {
    return null
  }

  const rawAnswers = isRecord(value.answers) ? value.answers : {}
  const answers: ModuleAnswers = {}

  for (const question of context.questions) {
    const rawSelection = rawAnswers[question.id]
    if (!isRecord(rawSelection)) continue

    const validOptionIds = new Set(question.options.map((option) => option.id))
    const primary = typeof rawSelection.primary === "string" && validOptionIds.has(rawSelection.primary)
      ? rawSelection.primary
      : null
    if (!primary) continue

    const secondary =
      context.allowsSecondChoice(question) &&
      typeof rawSelection.secondary === "string" &&
      rawSelection.secondary !== primary &&
      validOptionIds.has(rawSelection.secondary)
        ? rawSelection.secondary
        : undefined

    answers[question.id] = secondary ? { primary, secondary } : { primary }
  }

  const allAnswered =
    context.questions.length > 0 &&
    context.questions.every((question) => Boolean(answers[question.id]?.primary))
  const requestedStage = value.stage === "review" ? "review" : "questions"
  const stage: ModuleDraftStage = requestedStage === "review" && allAnswered
    ? "review"
    : "questions"
  const validQuestionIds = new Set(context.questions.map((question) => question.id))
  const requestedQuestionId = typeof value.currentQuestionId === "string"
    ? value.currentQuestionId
    : null
  const firstUnanswered = context.questions.find(
    (question) => !answers[question.id]?.primary,
  )?.id
  const currentQuestionId = stage === "review"
    ? null
    : requestedQuestionId && validQuestionIds.has(requestedQuestionId)
      ? requestedQuestionId
      : firstUnanswered ?? context.questions[0]?.id ?? null

  return {
    v: 1,
    slug: context.slug,
    locale: context.locale,
    mode: context.mode,
    bankVersion: context.bankVersion,
    scoringVersion: context.scoringVersion,
    orderSeed: value.orderSeed,
    answers,
    currentQuestionId,
    stage,
    updatedAt: value.updatedAt,
  }
}

export function loadModuleDraft(
  storage: StorageReader,
  context: ModuleDraftContext,
  now = Date.now(),
): ModuleDraftV1 | null {
  const store = readStore(storage)
  return normalizeModuleDraft(store.drafts[getModuleDraftKey(context)], context, now)
}

export function loadSelectedModuleMode(
  storage: StorageReader,
  slug: ModuleSlug,
  locale: string,
): QuizMode | null {
  const selected = readStore(storage).selectedMode[getModuleModeKey(slug, locale)]
  return selected === "standard" || selected === "analyst" ? selected : null
}

export function saveModuleDraft(
  storage: StorageWriter,
  draft: ModuleDraftV1,
): boolean {
  try {
    const store = readStore(storage)
    const contextKey = [
      draft.slug,
      draft.locale,
      draft.mode,
      `bank-${draft.bankVersion}`,
      `scorer-${draft.scoringVersion}`,
    ].join(":")
    store.drafts[contextKey] = draft
    store.selectedMode[getModuleModeKey(draft.slug, draft.locale)] = draft.mode
    storage.setItem(MODULE_DRAFT_STORAGE_KEY, JSON.stringify(store))
    return true
  } catch {
    return false
  }
}

export function clearModuleDraft(
  storage: StorageWriter,
  context: ModuleDraftContext,
): boolean {
  try {
    const store = readStore(storage)
    delete store.drafts[getModuleDraftKey(context)]
    storage.setItem(MODULE_DRAFT_STORAGE_KEY, JSON.stringify(store))
    return true
  } catch {
    return false
  }
}

function readStore(storage: StorageReader): ModuleDraftStoreV1 {
  try {
    const raw = storage.getItem(MODULE_DRAFT_STORAGE_KEY)
    if (!raw) return createEmptyModuleDraftStore()
    const value = JSON.parse(raw) as unknown
    if (!isRecord(value) || value.v !== 1) return createEmptyModuleDraftStore()

    const selectedMode = isRecord(value.selectedMode)
      ? Object.fromEntries(
          Object.entries(value.selectedMode).filter(
            ([, mode]) => mode === "standard" || mode === "analyst",
          ),
        ) as Record<string, QuizMode>
      : {}
    const drafts = isRecord(value.drafts)
      ? Object.fromEntries(
          Object.entries(value.drafts).filter(([, draft]) => isRecord(draft)),
        ) as Record<string, ModuleDraftV1>
      : {}

    return { v: 1, selectedMode, drafts }
  } catch {
    return createEmptyModuleDraftStore()
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}
