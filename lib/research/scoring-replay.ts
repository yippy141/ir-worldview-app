import {
  getScoringVersion,
  type ScoringVersionName,
} from "@/lib/scoring/versions"
import foundationScoringV1Json from "@/content/instrument/foundation.scoring.v1.json" with {
  type: "json",
}
import {
  getFoundationResultQuestions,
} from "@/lib/quiz-schema"
import * as scoringV2 from "@/lib/scoring/v2"
import type {
  AnswerValue,
  Answers,
  FamilyKey,
  FoundationQuestionSet,
  Question,
  QuizMode,
  RankedChoiceAnswer,
} from "@/lib/types"

export type ResearchAnswerRow = {
  sessionId: string
  mode: string | null
  instrumentVersion: string | number
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
  quarantinedSessions: ReplaySessionFailure[]
}

export type ReplaySessionFailure = {
  sessionId: string
  reason: string
}

export type ScoringReplayStore = {
  readRawAnswers(): Promise<ResearchAnswerRow[]>
  writeDerivedResults(rows: readonly ReplayDerivedResult[]): Promise<void>
}

type ReplaySession = {
  sessionId: string
  sourceScoringVersion: ScoringVersionName
  instrumentVersion: number
  baselineTopLabel: string | null
  answers: Answers
  form: ReplayFoundationForm
}

type ReplayQuestionDefinition =
  | {
      id: string
      kind: "likert"
    }
  | {
      id: string
      kind: "tradeoff" | "miniCase"
      allowSecondChoiceInAnalyst?: boolean
      options: Array<{ id: string }>
    }

type ReplayFoundationForm = {
  key: string
  storedMode: QuizMode
  scoringMode: QuizMode
  questions: ReplayQuestionDefinition[]
  calibration?: scoringV2.FoundationScoringCalibration
}

type V1ScoringSnapshot = {
  instrument: string
  scoringVersion: number
  items: ReplayQuestionDefinition[]
}

const V1_SCORING_SNAPSHOT =
  foundationScoringV1Json as unknown as V1ScoringSnapshot
const V1_STANDARD_QUESTIONS = V1_SCORING_SNAPSHOT.items.filter(
  (question) => !question.id.startsWith("an_"),
)
const V1_ANALYST_QUESTIONS = [...V1_SCORING_SNAPSHOT.items]
const V2_FAMILY_PAIRS: Array<readonly [FamilyKey, FamilyKey]> = [
  ["realist", "institutionalist"],
  ["realist", "constructivist"],
  ["realist", "criticalPoliticalEconomy"],
  ["institutionalist", "constructivist"],
  ["institutionalist", "criticalPoliticalEconomy"],
  ["constructivist", "criticalPoliticalEconomy"],
]
const V2_REPLAY_FORMS = [
  buildV2ReplayForm("core"),
  ...V2_FAMILY_PAIRS.map((pair) =>
    buildV2ReplayForm("targetedExtended", pair),
  ),
  buildV2ReplayForm("fullExtended"),
]

export async function replayScoring(
  scoringVersion: string,
  store: ScoringReplayStore,
): Promise<ReplayReport> {
  const scorer = getScoringVersion(scoringVersion)
  if (!scorer) {
    throw new Error(`Unknown scoring version: ${scoringVersion}.`)
  }

  const { sessions, failures } = groupResearchAnswersForReplay(
    await store.readRawAnswers(),
  )
  let changedFamilyLabels = 0
  const rows: ReplayDerivedResult[] = []

  for (const session of sessions) {
    try {
      if (session.sourceScoringVersion !== scoringVersion) {
        throw new Error(
          `Scoring ${session.sourceScoringVersion} Foundation answers with ` +
            `${scoringVersion} is unsupported without an explicit item-bank compatibility mapping.`,
        )
      }

      const result = generateReplayResult(
        scoringVersion as ScoringVersionName,
        session,
      )
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
    } catch (error) {
      failures.push({
        sessionId: session.sessionId,
        reason: replayErrorMessage(error),
      })
    }
  }

  await store.writeDerivedResults(rows)

  return {
    rescoredSessions: rows.length,
    changedFamilyLabels,
    quarantinedSessions: failures.sort((left, right) =>
      left.sessionId.localeCompare(right.sessionId),
    ),
  }
}

function groupResearchAnswersForReplay(
  rows: readonly ResearchAnswerRow[],
): {
  sessions: ReplaySession[]
  failures: ReplaySessionFailure[]
} {
  const rowsBySession = new Map<string, ResearchAnswerRow[]>()

  for (const row of rows) {
    const sessionRows = rowsBySession.get(row.sessionId) ?? []
    sessionRows.push(row)
    rowsBySession.set(row.sessionId, sessionRows)
  }

  const sessions: ReplaySession[] = []
  const failures: ReplaySessionFailure[] = []

  for (const sessionId of [...rowsBySession.keys()].sort()) {
    try {
      const [session] = groupResearchAnswers(
        rowsBySession.get(sessionId) ?? [],
      )
      if (session) sessions.push(session)
    } catch (error) {
      failures.push({
        sessionId,
        reason: replayErrorMessage(error),
      })
    }
  }

  return { sessions, failures }
}

export function groupResearchAnswers(
  rows: readonly ResearchAnswerRow[],
): ReplaySession[] {
  const rowsBySession = new Map<string, ResearchAnswerRow[]>()

  for (const row of rows) {
    if (row.sessionId.length === 0) {
      throw new Error("Research answer has an empty session ID.")
    }
    const sessionRows = rowsBySession.get(row.sessionId) ?? []
    sessionRows.push(row)
    rowsBySession.set(row.sessionId, sessionRows)
  }

  return [...rowsBySession.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([sessionId, sessionRows]) =>
      buildReplaySession(sessionId, sessionRows),
    )
}

function scoreSourceFamilyLabel(session: ReplaySession): string | null {
  return generateReplayResult(
    session.sourceScoringVersion,
    session,
  ).familyLabel
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
): AnswerValue {
  const hasNumeric = row.rawNumeric !== null
  const hasColumns =
    row.primaryAnswer !== null || row.secondaryAnswer !== null
  const hasJson = row.rawJson !== null && row.rawJson !== undefined
  const representationCount = Number(hasNumeric) +
    Number(hasColumns) +
    Number(hasJson)
  const answerPath = `${row.sessionId}/${row.questionId}`

  if (representationCount !== 1) {
    throw new Error(
      `Research answer ${answerPath} must use exactly one answer representation; ` +
        `received ${representationCount}.`,
    )
  }

  if (hasNumeric) {
    if (
      typeof row.rawNumeric !== "number" &&
      typeof row.rawNumeric !== "string"
    ) {
      throw new Error(
        `Research answer ${answerPath} has an invalid numeric representation.`,
      )
    }
    if (
      typeof row.rawNumeric === "string" &&
      row.rawNumeric.trim().length === 0
    ) {
      throw new Error(
        `Research answer ${answerPath} has an empty numeric representation.`,
      )
    }
    const numeric = Number(row.rawNumeric)
    if (!Number.isFinite(numeric)) {
      throw new Error(
        `Research answer ${answerPath} has an invalid numeric representation.`,
      )
    }
    return numeric
  }

  if (hasColumns) {
    if (!isNonEmptyString(row.primaryAnswer)) {
      throw new Error(
        `Research answer ${answerPath} has a secondary answer without a valid primary answer.`,
      )
    }
    if (row.secondaryAnswer === null) {
      return row.primaryAnswer
    }
    if (!isNonEmptyString(row.secondaryAnswer)) {
      throw new Error(
        `Research answer ${answerPath} has an empty secondary answer.`,
      )
    }
    return {
      primary: row.primaryAnswer,
      secondary: row.secondaryAnswer,
    }
  }

  const parsed = parseRawJsonAnswer(row.rawJson)
  if (parsed === undefined) {
    throw new Error(
      `Research answer ${answerPath} has an invalid JSON representation.`,
    )
  }
  return parsed
}

function parseRawJsonAnswer(value: unknown): AnswerValue | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (isNonEmptyString(value)) return value
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return undefined
  }

  const keys = Object.keys(value)
  if (
    keys.some((key) => key !== "primary" && key !== "secondary") ||
    !keys.includes("primary")
  ) {
    return undefined
  }

  const candidate = value as Partial<RankedChoiceAnswer>
  if (!isNonEmptyString(candidate.primary)) return undefined
  if (
    candidate.secondary !== undefined &&
    !isNonEmptyString(candidate.secondary)
  ) {
    return undefined
  }

  return {
    primary: candidate.primary,
    ...(candidate.secondary ? { secondary: candidate.secondary } : {}),
  }
}

function buildReplaySession(
  sessionId: string,
  rows: readonly ResearchAnswerRow[],
): ReplaySession {
  const first = rows[0]
  if (!first) {
    throw new Error(`Research session ${sessionId} has no answers.`)
  }

  const mode = parseQuizMode(first.mode, sessionId)
  const sourceScoringVersion = normalizeScoringVersionName(
    first.sourceScoringVersion,
  )
  if (!sourceScoringVersion) {
    throw new Error(
      `Research session ${sessionId} has unknown source scoring version ` +
        `${JSON.stringify(first.sourceScoringVersion)}.`,
    )
  }
  const instrumentVersion = normalizeInstrumentVersion(
    first.instrumentVersion,
  )
  if (instrumentVersion === null) {
    throw new Error(
      `Research session ${sessionId} has unknown Foundation instrument version ` +
        `${JSON.stringify(first.instrumentVersion)}.`,
    )
  }
  if (
    first.baselineTopLabel !== null &&
    !isNonEmptyString(first.baselineTopLabel)
  ) {
    throw new Error(
      `Research session ${sessionId} has an invalid baseline family label.`,
    )
  }

  const answers: Answers = {}
  for (const row of rows) {
    if (
      parseQuizMode(row.mode, sessionId) !== mode ||
      normalizeScoringVersionName(row.sourceScoringVersion) !==
        sourceScoringVersion ||
      normalizeInstrumentVersion(row.instrumentVersion) !==
        instrumentVersion ||
      row.baselineTopLabel !== first.baselineTopLabel
    ) {
      throw new Error(
        `Inconsistent research session metadata for ${sessionId}.`,
      )
    }
    if (!isNonEmptyString(row.questionId)) {
      throw new Error(`Research session ${sessionId} has an empty question ID.`)
    }
    if (Object.hasOwn(answers, row.questionId)) {
      throw new Error(
        `Duplicate research answer ${sessionId}/${row.questionId}.`,
      )
    }

    answers[row.questionId] = parseResearchAnswer(row)
  }

  const form = resolveReplayForm(
    sessionId,
    sourceScoringVersion,
    instrumentVersion,
    mode,
    answers,
  )
  validateReplayAnswers(sessionId, answers, form)

  return {
    sessionId,
    sourceScoringVersion,
    instrumentVersion,
    baselineTopLabel: first.baselineTopLabel,
    answers,
    form,
  }
}

function resolveReplayForm(
  sessionId: string,
  sourceScoringVersion: ScoringVersionName,
  instrumentVersion: number,
  mode: QuizMode,
  answers: Answers,
): ReplayFoundationForm {
  const expectedInstrumentVersion =
    sourceScoringVersion === "v1" ? 1 : 2
  if (instrumentVersion !== expectedInstrumentVersion) {
    throw new Error(
      `Research session ${sessionId} pairs source scoring version ` +
        `${sourceScoringVersion} with unsupported Foundation instrument ` +
        `version ${instrumentVersion}.`,
    )
  }

  if (sourceScoringVersion === "v1") {
    const questions =
      mode === "standard" ? V1_STANDARD_QUESTIONS : V1_ANALYST_QUESTIONS
    assertExactQuestionSet(
      sessionId,
      `v1 ${mode}`,
      Object.keys(answers),
      questions.map((question) => question.id),
    )
    return {
      key: mode,
      storedMode: mode,
      scoringMode: mode,
      questions,
    }
  }

  const answerIds = Object.keys(answers)
  const matchingForms = V2_REPLAY_FORMS.filter(
    (form) =>
      form.storedMode === mode &&
      hasExactQuestionSet(
        answerIds,
        form.questions.map((question) => question.id),
      ),
  )
  if (matchingForms.length !== 1) {
    throw new Error(
      `Research session ${sessionId} does not match exactly one supported ` +
        `Foundation v2 form/mode combination (core/standard, ` +
        `targetedExtended/analyst, or fullExtended/analyst); received ` +
        `${answerIds.length} items with mode ${mode}.`,
    )
  }

  return matchingForms[0]
}

function validateReplayAnswers(
  sessionId: string,
  answers: Answers,
  form: ReplayFoundationForm,
) {
  const questions = new Map(
    form.questions.map((question) => [question.id, question]),
  )

  for (const [questionId, answer] of Object.entries(answers)) {
    const question = questions.get(questionId)
    if (!question) {
      throw new Error(
        `Research answer ${sessionId}/${questionId} is not part of form ${form.key}.`,
      )
    }

    if (question.kind === "likert") {
      if (
        typeof answer !== "number" ||
        !Number.isInteger(answer) ||
        answer < 1 ||
        answer > 7
      ) {
        throw new Error(
          `Research answer ${sessionId}/${questionId} must be an integer from 1 to 7.`,
        )
      }
      continue
    }

    if (typeof answer === "number") {
      throw new Error(
        `Research answer ${sessionId}/${questionId} must identify a choice option.`,
      )
    }
    const rankedAnswer =
      typeof answer === "string" ? { primary: answer } : answer
    const optionIds = new Set(question.options.map((option) => option.id))
    if (!optionIds.has(rankedAnswer.primary)) {
      throw new Error(
        `Research answer ${sessionId}/${questionId} has an unknown primary option.`,
      )
    }
    if (rankedAnswer.secondary !== undefined) {
      if (
        form.scoringMode !== "analyst" ||
        !question.allowSecondChoiceInAnalyst
      ) {
        throw new Error(
          `Research answer ${sessionId}/${questionId} includes a secondary option where none is permitted.`,
        )
      }
      if (
        rankedAnswer.secondary === rankedAnswer.primary ||
        !optionIds.has(rankedAnswer.secondary)
      ) {
        throw new Error(
          `Research answer ${sessionId}/${questionId} has an invalid secondary option.`,
        )
      }
    }
  }
}

function generateReplayResult(
  scoringVersion: ScoringVersionName,
  session: ReplaySession,
) {
  if (scoringVersion === "v2") {
    if (!session.form.calibration) {
      throw new Error(
        `Foundation v2 replay form ${session.form.key} has no calibration.`,
      )
    }
    return scoringV2.generateResult(
      session.answers,
      session.form.scoringMode,
      session.form.calibration,
    )
  }

  const scorer = getScoringVersion(scoringVersion)
  if (!scorer) {
    throw new Error(`Unknown scoring version: ${scoringVersion}.`)
  }
  return scorer.generateResult(session.answers, session.form.scoringMode)
}

function buildV2ReplayForm(
  questionSet: FoundationQuestionSet,
  targetedFamilyPair?: readonly [FamilyKey, FamilyKey],
): ReplayFoundationForm {
  const calibration = scoringV2.foundationScoringCalibrationForForm(
    questionSet,
    targetedFamilyPair,
  )
  if (!calibration) {
    throw new Error(
      `Foundation replay form ${questionSet} has no scoring calibration.`,
    )
  }

  const key =
    questionSet === "targetedExtended" && targetedFamilyPair
      ? `${questionSet}:${targetedFamilyPair.join("|")}`
      : questionSet
  return {
    key,
    storedMode: questionSet === "core" ? "standard" : "analyst",
    scoringMode: "analyst",
    questions: getFoundationResultQuestions(
      questionSet,
      targetedFamilyPair,
    ).map(toReplayQuestionDefinition),
    calibration,
  }
}

function toReplayQuestionDefinition(
  question: Question,
): ReplayQuestionDefinition {
  if (question.kind === "likert") {
    return { id: question.id, kind: question.kind }
  }
  return {
    id: question.id,
    kind: question.kind,
    allowSecondChoiceInAnalyst: question.allowSecondChoiceInAnalyst,
    options: question.options.map((option) => ({ id: option.id })),
  }
}

function parseQuizMode(value: string | null, sessionId: string): QuizMode {
  if (value === "standard" || value === "analyst") return value
  throw new Error(
    `Research session ${sessionId} has unknown mode ${JSON.stringify(value)}.`,
  )
}

function normalizeInstrumentVersion(
  value: string | number,
): number | null {
  if (value === 1 || value === "1" || value === "v1") return 1
  if (value === 2 || value === "2" || value === "v2") return 2
  return null
}

function assertExactQuestionSet(
  sessionId: string,
  formKey: string,
  actualIds: readonly string[],
  expectedIds: readonly string[],
) {
  if (hasExactQuestionSet(actualIds, expectedIds)) return

  const actual = new Set(actualIds)
  const expected = new Set(expectedIds)
  const missing = [...expected].filter((id) => !actual.has(id)).sort()
  const unexpected = [...actual].filter((id) => !expected.has(id)).sort()
  throw new Error(
    `Research session ${sessionId} does not match the exact Foundation ` +
      `${formKey} item set; missing [${missing.join(", ")}], ` +
      `unexpected [${unexpected.join(", ")}].`,
  )
}

function hasExactQuestionSet(
  actualIds: readonly string[],
  expectedIds: readonly string[],
): boolean {
  if (actualIds.length !== expectedIds.length) return false
  const expected = new Set(expectedIds)
  return actualIds.every((id) => expected.has(id))
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

function replayErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
