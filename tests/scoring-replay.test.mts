import test from "node:test"
import assert from "node:assert/strict"
import { getFoundationQuestions } from "@/lib/quiz-schema"
import * as currentScoring from "@/lib/scoring"
import * as scoringV1 from "@/lib/scoring/v1"
import * as scoringV2 from "@/lib/scoring/v2"
import {
  replayScoring,
  type ReplayDerivedResult,
  type ResearchAnswerRow,
  type ScoringReplayStore,
} from "@/lib/research/scoring-replay"
import type { Answers, QuizMode } from "@/lib/types"

type SyntheticSession = {
  sessionId: string
  mode: QuizMode
  answers: Answers
  baselineTopLabel: string
}

class FixtureReplayStore implements ScoringReplayStore {
  readonly rawAnswers: ResearchAnswerRow[]
  readonly derivedResults = new Map<string, ReplayDerivedResult>()

  constructor(rows: ResearchAnswerRow[]) {
    this.rawAnswers = structuredClone(rows)
  }

  async readRawAnswers() {
    return structuredClone(this.rawAnswers)
  }

  async writeDerivedResults(rows: readonly ReplayDerivedResult[]) {
    for (const row of rows) {
      this.derivedResults.set(
        `${row.sessionId}:${row.scoringVersion}`,
        structuredClone(row),
      )
    }
  }
}

test("version modules preserve v2 as the current scoring surface", () => {
  const answers = buildSyntheticAnswers(3, 1)

  assert.equal(scoringV1.FOUNDATION_SCORING_VERSION, 1)
  assert.equal(scoringV2.FOUNDATION_SCORING_VERSION, 2)
  assert.equal(currentScoring.FOUNDATION_SCORING_VERSION, 2)
  assert.deepEqual(
    currentScoring.generateResult(answers, "analyst"),
    scoringV2.generateResult(answers, "analyst"),
  )
})

test("three stored sessions replay idempotently without mutating raw answers", async () => {
  const sessions = buildSyntheticSessions()
  const fixtureRows = sessions.flatMap(toResearchAnswerRows)
  const fixtureSnapshot = structuredClone(fixtureRows)
  const store = new FixtureReplayStore(fixtureRows)

  const firstReport = await replayScoring("v2", store)
  const firstDerivedRows = sortedDerivedRows(store)
  const secondReport = await replayScoring("v2", store)
  const secondDerivedRows = sortedDerivedRows(store)

  assert.deepEqual(firstReport, {
    rescoredSessions: 3,
    changedFamilyLabels: 2,
  })
  assert.deepEqual(secondReport, firstReport)
  assert.equal(store.derivedResults.size, 3)
  assert.deepEqual(secondDerivedRows, firstDerivedRows)
  assert.deepEqual(fixtureRows, fixtureSnapshot)
  assert.deepEqual(store.rawAnswers, fixtureSnapshot)
  assert.ok(
    secondDerivedRows.every((row) => row.scoringVersion === "v2"),
  )
})

function buildSyntheticSessions(): SyntheticSession[] {
  const answerSets = [
    buildSyntheticAnswers(1, 3, "v1"),
    buildSyntheticAnswers(4, 1, "v1"),
    buildSyntheticAnswers(6, 1, "v1"),
  ]
  const baselineLabels = answerSets.map(
    (answers) => scoringV1.generateResult(answers, "analyst").familyLabel,
  )

  return [
    {
      sessionId: "00000000-0000-4000-8000-000000000001",
      mode: "analyst",
      answers: answerSets[0],
      baselineTopLabel: baselineLabels[0],
    },
    {
      sessionId: "00000000-0000-4000-8000-000000000002",
      mode: "analyst",
      answers: answerSets[1],
      baselineTopLabel: baselineLabels[1],
    },
    {
      sessionId: "00000000-0000-4000-8000-000000000003",
      mode: "analyst",
      answers: answerSets[2],
      baselineTopLabel: baselineLabels[2],
    },
  ]
}

function buildSyntheticAnswers(
  likertStart: number,
  optionOffset: number,
  instrumentVersion: "v1" | "v2" = "v2",
): Answers {
  const answers: Answers = {}

  for (const [index, question] of getFoundationQuestions("analyst").entries()) {
    if (
      instrumentVersion === "v1" &&
      (question.id.startsWith("val_") || question.id.startsWith("v21_"))
    ) {
      continue
    }

    if (question.kind === "likert") {
      answers[question.id] = ((likertStart + index - 1) % 7) + 1
      continue
    }

    const primary = question.options[
      (index + optionOffset) % question.options.length
    ]
    const secondary = question.options[
      (index + optionOffset + 1) % question.options.length
    ]
    answers[question.id] = {
      primary: primary.id,
      ...(secondary.id !== primary.id ? { secondary: secondary.id } : {}),
    }
  }

  return answers
}

function toResearchAnswerRows(
  session: SyntheticSession,
): ResearchAnswerRow[] {
  return Object.entries(session.answers).map(([questionId, answer]) => {
    const base = {
      sessionId: session.sessionId,
      mode: session.mode,
      sourceScoringVersion: "v1",
      baselineTopLabel: session.baselineTopLabel,
      questionId,
      primaryAnswer: null,
      secondaryAnswer: null,
      rawNumeric: null,
      rawJson: null,
    } satisfies ResearchAnswerRow

    if (typeof answer === "number") {
      return { ...base, rawNumeric: answer }
    }
    if (typeof answer === "string") {
      return { ...base, primaryAnswer: answer }
    }
    return {
      ...base,
      primaryAnswer: answer.primary,
      secondaryAnswer: answer.secondary ?? null,
    }
  })
}

function sortedDerivedRows(store: FixtureReplayStore) {
  return [...store.derivedResults.values()].sort((left, right) =>
    left.sessionId.localeCompare(right.sessionId),
  )
}
