import type {
  AnswerValue,
  Answers,
  FamiliarityLevel,
  FamilyKey,
  FoundationQuestionSet,
  ItemLatencyBucketMs,
  ItemLatencyBuckets,
  QuizMode,
  QuizSession,
} from "@/lib/types"
import { createOptionOrderSeed } from "@/lib/option-order"

export { QUIZ_STORAGE_KEY } from "@/lib/storage-keys"
export const QUIZ_SESSION_EVENT = "ir-worldview-session-updated"

export function createEmptySession(): QuizSession {
  return {
    v: 7,
    orderSeed: createOptionOrderSeed(),
    questionSet: "core",
    contextAssist: false,
    answers: {},
    itemLatencyBuckets: {},
  }
}

export function parseQuizSession(raw: string | null): QuizSession | null {
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as {
      v?: unknown
      familiarity?: unknown
      requestedDepth?: unknown
      recommendedMode?: unknown
      activeMode?: unknown
      contextAssist?: unknown
      answers?: unknown
      itemLatencyBuckets?: unknown
      orderSeed?: unknown
    }
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      (
        parsed.v !== 3 &&
        parsed.v !== 4 &&
        parsed.v !== 5 &&
        parsed.v !== 6 &&
        parsed.v !== 7
      )
    ) {
      return null
    }

    const midpointAcknowledged = (parsed as { midpointAcknowledged?: unknown }).midpointAcknowledged
    const questionSet = isFoundationQuestionSet(
      (parsed as { questionSet?: unknown }).questionSet,
    )
      ? (parsed as { questionSet: FoundationQuestionSet }).questionSet
      : "core"
    const targetedFamilyPair = normalizeFamilyPair(
      (parsed as { targetedFamilyPair?: unknown }).targetedFamilyPair,
    )

    return {
      v: 7,
      orderSeed:
        typeof parsed.orderSeed === "string" && parsed.orderSeed.length > 0
          ? parsed.orderSeed
          : createOptionOrderSeed(),
      familiarity: isFamiliarityLevel(parsed.familiarity) ? parsed.familiarity : undefined,
      requestedDepth: isQuizMode(parsed.requestedDepth) ? parsed.requestedDepth : undefined,
      recommendedMode: isQuizMode(parsed.recommendedMode) ? parsed.recommendedMode : undefined,
      activeMode: isQuizMode(parsed.activeMode) ? parsed.activeMode : undefined,
      questionSet,
      targetedFamilyPair:
        questionSet === "targetedExtended" ? targetedFamilyPair : undefined,
      contextAssist: Boolean(parsed.contextAssist),
      answers: normalizeAnswers(parsed.answers),
      itemLatencyBuckets: normalizeItemLatencyBuckets(parsed.itemLatencyBuckets),
      midpointAcknowledged: midpointAcknowledged === true ? true : undefined,
    }
  } catch {
    return null
  }
}

export function getRecommendedMode(
  familiarity?: FamiliarityLevel,
  requestedDepth?: QuizMode,
): QuizMode {
  if (requestedDepth === "analyst" || familiarity === "very") {
    return "analyst"
  }

  return "standard"
}

export function countAnsweredQuestions(session: QuizSession): number {
  return Object.keys(session.answers).length
}

export function notifyQuizSessionUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(QUIZ_SESSION_EVENT))
  }
}

function isQuizMode(value: unknown): value is QuizMode {
  return value === "standard" || value === "analyst"
}

function isFamiliarityLevel(value: unknown): value is FamiliarityLevel {
  return value === "new" || value === "some" || value === "very"
}

function isFoundationQuestionSet(value: unknown): value is FoundationQuestionSet {
  return (
    value === "core" ||
    value === "targetedExtended" ||
    value === "fullExtended"
  )
}

function normalizeFamilyPair(value: unknown): [FamilyKey, FamilyKey] | undefined {
  if (
    !Array.isArray(value) ||
    value.length !== 2 ||
    !isFamilyKey(value[0]) ||
    !isFamilyKey(value[1]) ||
    value[0] === value[1]
  ) {
    return undefined
  }

  return [value[0], value[1]]
}

function isFamilyKey(value: unknown): value is FamilyKey {
  return (
    value === "realist" ||
    value === "institutionalist" ||
    value === "constructivist" ||
    value === "criticalPoliticalEconomy"
  )
}

function normalizeAnswers(value: unknown): Answers {
  if (typeof value !== "object" || value === null) {
    return {}
  }

  const normalized: Answers = {}

  for (const [questionId, answer] of Object.entries(value)) {
    const parsed = normalizeAnswerValue(answer)
    if (parsed !== undefined) {
      normalized[questionId] = parsed
    }
  }

  return normalized
}

function normalizeAnswerValue(value: unknown): AnswerValue | undefined {
  if (typeof value === "number" || typeof value === "string") {
    return value
  }

  if (typeof value !== "object" || value === null) {
    return undefined
  }

  const parsed = value as { primary?: unknown; secondary?: unknown }
  if (typeof parsed.primary !== "string") {
    return undefined
  }

  if (parsed.secondary !== undefined && typeof parsed.secondary !== "string") {
    return undefined
  }

  return {
    primary: parsed.primary,
    ...(parsed.secondary ? { secondary: parsed.secondary } : {}),
  }
}

function normalizeItemLatencyBuckets(value: unknown): ItemLatencyBuckets {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return {}
  }

  const normalized: ItemLatencyBuckets = {}
  for (const [itemId, bucket] of Object.entries(value)) {
    if (
      itemId.length > 0 &&
      itemId.length <= 100 &&
      isItemLatencyBucket(bucket)
    ) {
      normalized[itemId] = bucket
    }
  }

  return normalized
}

function isItemLatencyBucket(value: unknown): value is ItemLatencyBucketMs {
  return (
    value === 0 ||
    value === 2_000 ||
    value === 5_000 ||
    value === 10_000 ||
    value === 30_000 ||
    value === 120_000
  )
}
