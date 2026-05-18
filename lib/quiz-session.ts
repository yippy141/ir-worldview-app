import type {
  AnswerValue,
  Answers,
  FamiliarityLevel,
  QuizMode,
  QuizSession,
} from "@/lib/types"

export const QUIZ_STORAGE_KEY = "ir-worldview-session-v3"
export const QUIZ_SESSION_EVENT = "ir-worldview-session-updated"

export function createEmptySession(): QuizSession {
  return {
    v: 4,
    contextAssist: false,
    answers: {},
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
    }
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      (parsed.v !== 3 && parsed.v !== 4)
    ) {
      return null
    }

    const midpointAcknowledged = (parsed as { midpointAcknowledged?: unknown }).midpointAcknowledged

    return {
      v: 4,
      familiarity: isFamiliarityLevel(parsed.familiarity) ? parsed.familiarity : undefined,
      requestedDepth: isQuizMode(parsed.requestedDepth) ? parsed.requestedDepth : undefined,
      recommendedMode: isQuizMode(parsed.recommendedMode) ? parsed.recommendedMode : undefined,
      activeMode: isQuizMode(parsed.activeMode) ? parsed.activeMode : undefined,
      contextAssist: Boolean(parsed.contextAssist),
      answers: normalizeAnswers(parsed.answers),
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
