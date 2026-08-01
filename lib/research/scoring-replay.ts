import {
  getScoringVersion,
  type ScoringVersionName,
} from "@/lib/scoring/versions"
import type {
  AnswerValue,
  Answers,
  QuizMode,
  RankedChoiceAnswer,
} from "@/lib/types"

export type ResearchAnswerRow = {
  sessionId: string
  mode: string | null
  sourceScoringVersion: string
  baselineTopLabel: string | null
  questionId: string
  primaryAnswer: string | null
  secondaryAnswer: string | null
  rawNumeric: string | number | null
  rawJson: unknown
}

export type ReplayDerivedResult = {
  sessionId: string
  scoringVersion: ScoringVersionName
  topLabel: string
  runnerUp: string
  familyScores: Record<string, number>
  dimensionScores: Record<string, number>
  modifiers: {
    strategy: string
    normative: string
  }
  summary: string
}

export type ReplayReport = {
  rescoredSessions: number
  changedFamilyLabels: number
}

export type ScoringReplayStore = {
  readRawAnswers(): Promise<ResearchAnswerRow[]>
  writeDerivedResults(rows: readonly ReplayDerivedResult[]): Promise<void>
}

type ReplaySession = {
  sessionId: string
  mode: QuizMode
  sourceScoringVersion: string
  baselineTopLabel: string | null
  answers: Answers
}

export async function replayScoring(
  scoringVersion: string,
  store: ScoringReplayStore,
): Promise<ReplayReport> {
  const scorer = getScoringVersion(scoringVersion)
  if (!scorer) {
    throw new Error(`Unknown scoring version: ${scoringVersion}.`)
  }

  const sessions = groupResearchAnswers(await store.readRawAnswers())
  let changedFamilyLabels = 0
  const rows: ReplayDerivedResult[] = []

  for (const session of sessions) {
    const result = scorer.generateResult(session.answers, session.mode)
    const baselineTopLabel =
      session.baselineTopLabel ??
      scoreSourceFamilyLabel(session)

    if (
      baselineTopLabel !== null &&
      baselineTopLabel !== result.familyLabel
    ) {
      changedFamilyLabels += 1
    }

    rows.push({
      sessionId: session.sessionId,
      scoringVersion: scoringVersion as ScoringVersionName,
      topLabel: result.familyLabel,
      runnerUp: result.runnerUpLabel,
      familyScores: { ...result.familyScores },
      dimensionScores: { ...result.dimensionScores },
      modifiers: {
        strategy: result.strategyModifier,
        normative: result.normativeModifier,
      },
      summary: result.explanation,
    })
  }

  await store.writeDerivedResults(rows)

  return {
    rescoredSessions: rows.length,
    changedFamilyLabels,
  }
}

export function groupResearchAnswers(
  rows: readonly ResearchAnswerRow[],
): ReplaySession[] {
  const sessions = new Map<string, ReplaySession>()

  for (const row of rows) {
    const existing = sessions.get(row.sessionId)
    const session = existing ?? {
      sessionId: row.sessionId,
      mode: row.mode === "analyst" ? "analyst" : "standard",
      sourceScoringVersion: row.sourceScoringVersion,
      baselineTopLabel: row.baselineTopLabel,
      answers: {},
    }

    if (
      session.sourceScoringVersion !== row.sourceScoringVersion ||
      session.baselineTopLabel !== row.baselineTopLabel
    ) {
      throw new Error(
        `Inconsistent research session metadata for ${row.sessionId}.`,
      )
    }
    if (Object.hasOwn(session.answers, row.questionId)) {
      throw new Error(
        `Duplicate research answer ${row.sessionId}/${row.questionId}.`,
      )
    }

    const answer = parseResearchAnswer(row)
    if (answer === undefined) {
      throw new Error(
        `Research answer ${row.sessionId}/${row.questionId} is empty or invalid.`,
      )
    }

    session.answers[row.questionId] = answer
    sessions.set(row.sessionId, session)
  }

  return [...sessions.values()].sort((left, right) =>
    left.sessionId.localeCompare(right.sessionId),
  )
}

function scoreSourceFamilyLabel(session: ReplaySession): string | null {
  const sourceVersion = normalizeScoringVersionName(
    session.sourceScoringVersion,
  )
  if (!sourceVersion) return null

  return getScoringVersion(sourceVersion)?.generateResult(
    session.answers,
    session.mode,
  ).familyLabel ?? null
}

export function normalizeScoringVersionName(
  value: string,
): ScoringVersionName | null {
  const normalized = value.trim().toLowerCase()
  if (normalized === "1" || normalized === "v1") return "v1"
  if (normalized === "2" || normalized === "v2") return "v2"
  return null
}

function parseResearchAnswer(
  row: ResearchAnswerRow,
): AnswerValue | undefined {
  if (row.rawNumeric !== null) {
    const numeric = Number(row.rawNumeric)
    return Number.isFinite(numeric) ? numeric : undefined
  }

  if (row.primaryAnswer !== null) {
    return row.secondaryAnswer
      ? {
          primary: row.primaryAnswer,
          secondary: row.secondaryAnswer,
        }
      : row.primaryAnswer
  }

  return parseRawJsonAnswer(row.rawJson)
}

function parseRawJsonAnswer(value: unknown): AnswerValue | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string" && value.length > 0) return value
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return undefined
  }

  const candidate = value as Partial<RankedChoiceAnswer>
  if (typeof candidate.primary !== "string") return undefined
  if (
    candidate.secondary !== undefined &&
    typeof candidate.secondary !== "string"
  ) {
    return undefined
  }

  return {
    primary: candidate.primary,
    ...(candidate.secondary ? { secondary: candidate.secondary } : {}),
  }
}
