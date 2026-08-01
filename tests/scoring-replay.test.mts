import test from "node:test"
import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import foundationScoringV1 from "@/content/instrument/foundation.scoring.v1.json" with {
  type: "json",
}
import {
  getFoundationQuestions,
  selectFoundationAnswersForSet,
} from "@/lib/quiz-schema"
import * as currentScoring from "@/lib/scoring"
import * as scoringV1 from "@/lib/scoring/v1"
import * as scoringV2 from "@/lib/scoring/v2"
import {
  replayScoring,
  type ReplayDerivedResult,
  type ResearchAnswerRow,
  type ScoringReplayStore,
} from "@/lib/research/scoring-replay"
// Node's strip-types test runtime requires the explicit .mts extension.
// @ts-expect-error TypeScript's bundler resolver disallows that runtime form.
import * as replayCli from "@/scripts/replay-scoring.mts"
import type {
  Answers,
  QuizMode,
} from "@/lib/types"

const {
  enforceReplayQuarantinePolicy,
  parseReplayCliArguments,
  SELECT_RESEARCH_ANSWERS,
} = replayCli

type SyntheticSession = {
  sessionId: string
  mode: QuizMode
  instrumentVersion: 1 | 2
  sourceScoringVersion: "v1" | "v2"
  answers: Answers
  baselineTopLabel: string | null
}

const V1_GOLDEN_SESSION_ID =
  "00000000-0000-4000-8000-000000000010"
const V1_GOLDEN_ANSWERS: Answers = {
  sc1: 7,
  in1: 1,
  df1: 6,
  ni1: 2,
  pe1: 5,
  rs1: 3,
  oj1: 7,
  sc2: 2,
  in2: 6,
  df2: 3,
  ni2: 5,
  pe2: 1,
  rs2: 6,
  oj2: 2,
}
const V1_GOLDEN_RESULT = {
  familyKey: "realist",
  familyLabel: "Strategic Realist",
  strategyModifier: "Hedger",
  normativeModifier: "Pluralist",
  dimensionScores: {
    securityCompetition: 4.5,
    institutions: 3.5,
    domesticFilters: 4.5,
    normsIdentity: 3.5,
    politicalEconomy: 3,
    restraint: 4.5,
    orderJustice: 6.5,
  },
  familyScores: {
    realist: 1.1,
    institutionalist: -0.05,
    constructivist: -0.18,
    criticalPoliticalEconomy: -0.9,
  },
  explanation:
    "You treat uncertainty, rivalry, and positional advantage as durable constraints, and you are comparatively skeptical that institutions or norms can fully tame them.",
  neighboringFamily: "Liberal Institutionalist",
  runnerUpKey: "institutionalist",
  runnerUpLabel: "Liberal Institutionalist",
  nearestFitGap: 1.1500000000000001,
} as const

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

test("v1 replay uses an immutable scoring-item snapshot", () => {
  const digest = createHash("sha256")
    .update(JSON.stringify(foundationScoringV1))
    .digest("hex")

  assert.equal(foundationScoringV1.instrument, "foundation")
  assert.equal(foundationScoringV1.scoringVersion, 1)
  assert.equal(foundationScoringV1.items.length, 44)
  assert.equal(
    digest,
    "fafe46175aba1ef1426ee0cdfe95bc679ed32780f1a17d9d3839e6352955ab68",
  )
})

test("v1 scoring stays pinned to the legacy golden fixture", () => {
  assert.deepEqual(
    scoringV1.generateResult(V1_GOLDEN_ANSWERS, "standard"),
    V1_GOLDEN_RESULT,
  )
  assert.equal(
    scoringV1.getNeighboringFamilyKey(
      V1_GOLDEN_RESULT.familyKey,
      V1_GOLDEN_RESULT.familyScores,
    ),
    V1_GOLDEN_RESULT.runnerUpKey,
  )
})

test("v1 replay accepts only a complete historical form", async () => {
  const answers = buildSyntheticAnswers(2, 1, "v1", "standard")
  const expected = scoringV1.generateResult(answers, "standard")
  const store = new FixtureReplayStore(
    toResearchAnswerRows({
      sessionId: V1_GOLDEN_SESSION_ID,
      mode: "standard",
      instrumentVersion: 1,
      sourceScoringVersion: "v1",
      answers,
      baselineTopLabel: expected.familyLabel,
    }),
  )

  const report = await replayScoring("v1", store)

  assert.deepEqual(report, {
    rescoredSessions: 1,
    changedFamilyLabels: 0,
    quarantinedSessions: [],
  })
  assert.deepEqual(sortedDerivedRows(store), [
    {
      sessionId: V1_GOLDEN_SESSION_ID,
      scoringVersion: "v1",
      topLabel: expected.familyLabel,
      runnerUp: expected.runnerUpLabel,
      familyScores: expected.familyScores,
      dimensionScores: expected.dimensionScores,
      modifiers: {
        strategy: expected.strategyModifier,
        normative: expected.normativeModifier,
      },
      summary: expected.explanation,
    },
  ])
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
    quarantinedSessions: [],
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

test("replay quarantines a malformed session without aborting valid sessions", async () => {
  const validAnswers = buildSyntheticAnswers(2, 1, "v1", "standard")
  const validResult = scoringV1.generateResult(validAnswers, "standard")
  const validRows = toResearchAnswerRows({
    sessionId: V1_GOLDEN_SESSION_ID,
    mode: "standard",
    instrumentVersion: 1,
    sourceScoringVersion: "v1",
    answers: validAnswers,
    baselineTopLabel: validResult.familyLabel,
  })
  const malformedSessionId =
    "00000000-0000-4000-8000-000000000011"
  const malformedRows = structuredClone(validRows).map((row) => ({
    ...row,
    sessionId: malformedSessionId,
    ...(row.questionId === "sc1" ? { rawNumeric: 9 } : {}),
  }))
  const store = new FixtureReplayStore([...validRows, ...malformedRows])

  const report = await replayScoring("v1", store)

  assert.deepEqual(report, {
    rescoredSessions: 1,
    changedFamilyLabels: 0,
    quarantinedSessions: [
      {
        sessionId: malformedSessionId,
        reason:
          `Research answer ${malformedSessionId}/sc1 must be an integer from 1 to 7.`,
      },
    ],
  })
  assert.deepEqual(
    sortedDerivedRows(store).map((row) => row.sessionId),
    [V1_GOLDEN_SESSION_ID],
  )
})

test("v2 replay recognizes exact core and targeted forms with their form calibration", async () => {
  const allAnswers = buildSyntheticAnswers(3, 2, "v2", "analyst")
  const targetedPair = [
    "realist",
    "institutionalist",
  ] as const
  const coreAnswers = selectFoundationAnswersForSet(allAnswers, "core")
  const targetedAnswers = selectFoundationAnswersForSet(
    allAnswers,
    "targetedExtended",
    targetedPair,
  )
  const coreExpected = scoringV2.generateResult(
    coreAnswers,
    "analyst",
    "core",
  )
  const targetedCalibration =
    scoringV2.foundationScoringCalibrationForForm(
      "targetedExtended",
      targetedPair,
    )
  assert.ok(targetedCalibration)
  const targetedExpected = scoringV2.generateResult(
    targetedAnswers,
    "analyst",
    targetedCalibration,
  )
  const store = new FixtureReplayStore([
    ...toResearchAnswerRows({
      sessionId: "00000000-0000-4000-8000-000000000020",
      mode: "standard",
      instrumentVersion: 2,
      sourceScoringVersion: "v2",
      answers: coreAnswers,
      baselineTopLabel: null,
    }),
    ...toResearchAnswerRows({
      sessionId: "00000000-0000-4000-8000-000000000021",
      mode: "analyst",
      instrumentVersion: 2,
      sourceScoringVersion: "v2",
      answers: targetedAnswers,
      baselineTopLabel: null,
    }),
  ])

  const report = await replayScoring("v2", store)

  assert.equal(report.rescoredSessions, 2)
  assert.deepEqual(report.quarantinedSessions, [])
  const [coreRow, targetedRow] = sortedDerivedRows(store)
  assert.deepEqual(coreRow.familyScores, coreExpected.familyScores)
  assert.equal(coreRow.topLabel, coreExpected.familyLabel)
  assert.deepEqual(
    targetedRow.familyScores,
    targetedExpected.familyScores,
  )
  assert.equal(targetedRow.topLabel, targetedExpected.familyLabel)
})

test("replay rejects unknown mode, source version, instrument mismatch, and cross-bank scoring", async () => {
  const baseRows = toResearchAnswerRows({
    sessionId: "00000000-0000-4000-8000-000000000030",
    mode: "standard",
    instrumentVersion: 1,
    sourceScoringVersion: "v1",
    answers: buildSyntheticAnswers(2, 2, "v1", "standard"),
    baselineTopLabel: null,
  })
  const cases = [
    {
      name: "unknown mode",
      target: "v1",
      rows: baseRows.map((row) => ({ ...row, mode: "expert" })),
      reason: /unknown mode "expert"/,
    },
    {
      name: "unknown source version",
      target: "v1",
      rows: baseRows.map((row) => ({
        ...row,
        sourceScoringVersion: "v99",
      })),
      reason: /unknown source scoring version "v99"/,
    },
    {
      name: "instrument mismatch",
      target: "v1",
      rows: baseRows.map((row) => ({
        ...row,
        instrumentVersion: 2,
      })),
      reason: /unsupported Foundation instrument version 2/,
    },
    {
      name: "cross-bank scoring",
      target: "v2",
      rows: baseRows,
      reason: /unsupported without an explicit item-bank compatibility mapping/,
    },
  ] as const

  for (const scenario of cases) {
    const store = new FixtureReplayStore([...scenario.rows])
    const report = await replayScoring(scenario.target, store)
    assert.equal(
      report.rescoredSessions,
      0,
      `${scenario.name} must not be rescored`,
    )
    assert.match(
      report.quarantinedSessions[0]?.reason ?? "",
      scenario.reason,
    )
    assert.equal(store.derivedResults.size, 0)
  }
})

test("v2 replay enforces form-mode provenance instead of changing scoring mode silently", async () => {
  const fullRows = toResearchAnswerRows({
    sessionId: "00000000-0000-4000-8000-000000000031",
    mode: "analyst",
    instrumentVersion: 2,
    sourceScoringVersion: "v2",
    answers: buildSyntheticAnswers(4, 1, "v2", "analyst"),
    baselineTopLabel: null,
  }).map((row) => ({ ...row, mode: "standard" }))
  const store = new FixtureReplayStore(fullRows)

  const report = await replayScoring("v2", store)

  assert.equal(report.rescoredSessions, 0)
  assert.match(
    report.quarantinedSessions[0]?.reason ?? "",
    /form\/mode combination/,
  )
  assert.equal(store.derivedResults.size, 0)
})

test("replay rejects incomplete forms and ambiguous or invalid answer representations", async () => {
  const sessionId = "00000000-0000-4000-8000-000000000040"
  const baseRows = toResearchAnswerRows({
    sessionId,
    mode: "standard",
    instrumentVersion: 1,
    sourceScoringVersion: "v1",
    answers: buildSyntheticAnswers(3, 2, "v1", "standard"),
    baselineTopLabel: null,
  })
  const sc1Index = baseRows.findIndex((row) => row.questionId === "sc1")
  const tradeoffIndex = baseRows.findIndex(
    (row) => row.questionId === "tradeoff_alliances",
  )
  assert.notEqual(sc1Index, -1)
  assert.notEqual(tradeoffIndex, -1)

  const cases = [
    {
      name: "incomplete exact form",
      rows: baseRows.filter((row) => row.questionId !== "sc1"),
      reason: /exact Foundation v1 standard item set; missing \[sc1\]/,
    },
    {
      name: "multiple representations",
      rows: baseRows.map((row, index) =>
        index === sc1Index ? { ...row, rawJson: 3 } : row,
      ),
      reason: /must use exactly one answer representation; received 2/,
    },
    {
      name: "unknown option",
      rows: baseRows.map((row, index) =>
        index === tradeoffIndex
          ? { ...row, primaryAnswer: "not-an-option" }
          : row,
      ),
      reason: /has an unknown primary option/,
    },
  ]

  for (const scenario of cases) {
    const store = new FixtureReplayStore(scenario.rows)
    const rawSnapshot = structuredClone(store.rawAnswers)
    const report = await replayScoring("v1", store)
    assert.equal(
      report.rescoredSessions,
      0,
      `${scenario.name} must not be rescored`,
    )
    assert.match(
      report.quarantinedSessions[0]?.reason ?? "",
      scenario.reason,
    )
    assert.equal(store.derivedResults.size, 0)
    assert.deepEqual(store.rawAnswers, rawSnapshot)
  }
})

test("database replay query requires a matching explicit respondent consent receipt", () => {
  const normalizedSql = SELECT_RESEARCH_ANSWERS.replace(/\s+/g, " ")

  assert.match(
    normalizedSql,
    /join research_respondents as respondents on respondents\.respondent_id = sessions\.respondent_id/,
  )
  assert.match(normalizedSql, /respondents\.research_consent is true/)
  assert.match(
    normalizedSql,
    /sessions\.consent_version = respondents\.consent_version/,
  )
  assert.match(
    normalizedSql,
    /respondents\.consent_version is not null/,
  )
})

test("CLI quarantine handling fails closed unless the explicit override is supplied", () => {
  assert.deepEqual(parseReplayCliArguments(["v2"]), {
    scoringVersion: "v2",
    allowQuarantinedSessions: false,
  })
  assert.deepEqual(
    parseReplayCliArguments([
      "--allow-quarantined-sessions",
      "v2",
    ]),
    {
      scoringVersion: "v2",
      allowQuarantinedSessions: true,
    },
  )
  assert.throws(
    () => parseReplayCliArguments(["v2", "--unknown"]),
    /Unknown scoring replay flag/,
  )
  assert.throws(
    () =>
      enforceReplayQuarantinePolicy(
        { quarantinedSessions: [{}] },
        false,
      ),
    /--allow-quarantined-sessions/,
  )
  assert.doesNotThrow(() =>
    enforceReplayQuarantinePolicy(
      { quarantinedSessions: [{}] },
      true,
    ),
  )
})

function buildSyntheticSessions(): SyntheticSession[] {
  const answerSets = [
    buildSyntheticAnswers(1, 3, "v2", "analyst"),
    buildSyntheticAnswers(4, 1, "v2", "analyst"),
    buildSyntheticAnswers(6, 1, "v2", "analyst"),
  ]
  const baselineLabels = answerSets.map(
    (answers) =>
      scoringV2.generateResult(
        answers,
        "analyst",
        "extended",
      ).familyLabel,
  )

  return [
    {
      sessionId: "00000000-0000-4000-8000-000000000001",
      mode: "analyst",
      instrumentVersion: 2,
      sourceScoringVersion: "v2",
      answers: answerSets[0],
      baselineTopLabel: baselineLabels[0],
    },
    {
      sessionId: "00000000-0000-4000-8000-000000000002",
      mode: "analyst",
      instrumentVersion: 2,
      sourceScoringVersion: "v2",
      answers: answerSets[1],
      baselineTopLabel: differentFamilyLabel(baselineLabels[1]),
    },
    {
      sessionId: "00000000-0000-4000-8000-000000000003",
      mode: "analyst",
      instrumentVersion: 2,
      sourceScoringVersion: "v2",
      answers: answerSets[2],
      baselineTopLabel: differentFamilyLabel(baselineLabels[2]),
    },
  ]
}

function buildSyntheticAnswers(
  likertStart: number,
  optionOffset: number,
  instrumentVersion: "v1" | "v2" = "v2",
  mode: QuizMode = "analyst",
): Answers {
  const answers: Answers = {}

  for (const [index, question] of getFoundationQuestions(mode).entries()) {
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
    if (mode !== "analyst" || !question.allowSecondChoiceInAnalyst) {
      answers[question.id] = primary.id
      continue
    }
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
      instrumentVersion: session.instrumentVersion,
      sourceScoringVersion: session.sourceScoringVersion,
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

function differentFamilyLabel(label: string): string {
  return label === "Strategic Realist"
    ? "Liberal Institutionalist"
    : "Strategic Realist"
}
