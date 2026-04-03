import type {
  FamiliarityLevel,
  QuizMode,
  QuizSession,
} from "@/lib/types"

export const QUIZ_STORAGE_KEY = "ir-worldview-session-v3"
export const QUIZ_SESSION_EVENT = "ir-worldview-session-updated"

export function createEmptySession(): QuizSession {
  return {
    v: 3,
    contextAssist: false,
    answers: {},
  }
}

export function parseQuizSession(raw: string | null): QuizSession | null {
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as Partial<QuizSession>
    if (parsed.v !== 3 || typeof parsed !== "object" || parsed === null) {
      return null
    }

    return {
      v: 3,
      familiarity: isFamiliarityLevel(parsed.familiarity) ? parsed.familiarity : undefined,
      requestedDepth: isQuizMode(parsed.requestedDepth) ? parsed.requestedDepth : undefined,
      recommendedMode: isQuizMode(parsed.recommendedMode) ? parsed.recommendedMode : undefined,
      activeMode: isQuizMode(parsed.activeMode) ? parsed.activeMode : undefined,
      contextAssist: Boolean(parsed.contextAssist),
      answers: typeof parsed.answers === "object" && parsed.answers !== null ? parsed.answers : {},
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
