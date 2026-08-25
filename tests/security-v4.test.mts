import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import test from "node:test"
import {
  buildModuleAnalytics,
  resolveModulePayload,
} from "@/lib/modules/framework"
import { SECURITY_V22_CALIBRATION } from "@/lib/modules/calibration-data-v22"
import { getSeededOptionOrder } from "@/lib/option-order"
import {
  getModuleVersion,
  MODULE_V22_TUPLE,
  SECURITY_V4_TUPLE,
} from "@/lib/modules/versions"
import {
  ACTOR_LENS_INSTRUCTION,
  ACTOR_LENS_RESULT_SUMMARY,
} from "@/lib/modules/perspective-bank"
import type {
  ModuleAnalytics,
  ModuleAnswers,
  ModuleQuestion,
  ModuleResult,
} from "@/lib/modules/types"
import { encodeUrlPayload } from "@/lib/url-payload"
// Node's strip-types runtime requires the explicit .mts extension.
// @ts-expect-error TypeScript's bundler resolver disallows that runtime form.
import { buildSecurityV4DiagnosticReport } from "@/scripts/diagnose-security-v4.mts"
// Node's strip-types runtime requires the explicit .mts extension.
// @ts-expect-error TypeScript's bundler resolver disallows that runtime form.
import { buildSecurityV4ValidationReport, SECURITY_V4_BANK_SHA256, SECURITY_V4_LEDGER_SHA256, SecurityV4ValidationError, validateSecurityV4 } from "@/scripts/validate-security-v4.mts"
import type { QuizMode } from "@/lib/types"

const SECURITY_V3_BANK_TEXT = readFileSync(
  new URL("../content/instrument/security.v3.json", import.meta.url),
  "utf8",
)
const SECURITY_V4_BANK_TEXT = readFileSync(
  new URL("../content/instrument/security.v4.json", import.meta.url),
  "utf8",
)
const SECURITY_V4_LEDGER_TEXT = readFileSync(
  new URL(
    "../docs/v23/security/V23_3_SECURITY_ACTOR_BALANCE_LEDGER.csv",
    import.meta.url,
  ),
  "utf8",
)
const MODULE_APP_SOURCE = readFileSync(
  new URL("../components/modules/module-app.tsx", import.meta.url),
  "utf8",
)
const MODULE_RESULT_SOURCE = readFileSync(
  new URL("../components/modules/module-result.tsx", import.meta.url),
  "utf8",
)

type TestBank = {
  instrument: string
  instrumentVersion: number
  items: Array<
    ModuleQuestion & {
      modes: QuizMode[]
    }
  >
}

const SECURITY_V4_BANK = JSON.parse(SECURITY_V4_BANK_TEXT) as TestBank
const SECURITY_V4 = getModuleVersion(
  "security",
  SECURITY_V4_TUPLE.bankVersion,
  SECURITY_V4_TUPLE.scoringVersion,
)
assert.ok(SECURITY_V4)

const EXPECTED_ACTOR_LENS_IDS = [
  "iran_israel_gulf_thresholds",
  "iran_mediator_navigation",
  "iran_tehran_leverage",
  "middle_power_alignment",
  "taiwan_beijing_instrument",
  "taiwan_taipei_continuity",
  "taiwan_washington_coalition",
  "ukraine_external_division_of_labor",
  "ukraine_kyiv_security_architecture",
  "ukraine_moscow_bargaining_tradeoff",
]

test("Security v4 bank and reviewed balance ledger are exact CI-gated records", async () => {
  const report = await buildSecurityV4ValidationReport()

  assert.deepEqual(report.versions, { bank: 4, scoring: 2 })
  assert.equal(report.bankSha256, SECURITY_V4_BANK_SHA256)
  assert.equal(report.ledgerSha256, SECURITY_V4_LEDGER_SHA256)
  assert.equal(report.itemCount, 23)
  assert.equal(report.optionCount, 92)
  assert.equal(report.ledgerRowCount, 42)
  assert.deepEqual(report.actorLensItemIds, EXPECTED_ACTOR_LENS_IDS)
  assert.deepEqual(
    {
      standard: {
        total: report.modes.standard.total,
        main: report.modes.standard.mainScored,
        actorLens: report.modes.standard.actorLens,
        axes: report.modes.standard.byDeclaredAxisMainScored,
        lanes: report.modes.standard.byLaneMainScored,
        cards: report.modes.standard.byCardType,
      },
      analyst: {
        total: report.modes.analyst.total,
        main: report.modes.analyst.mainScored,
        actorLens: report.modes.analyst.actorLens,
        axes: report.modes.analyst.byDeclaredAxisMainScored,
        lanes: report.modes.analyst.byLaneMainScored,
        cards: report.modes.analyst.byCardType,
      },
    },
    {
      standard: {
        total: 19,
        main: 9,
        actorLens: 10,
        axes: { activism: 7, alliance: 4, escalation: 5, legitimacy: 5 },
        lanes: { alliances: 2, deterrence: 4, legitimacy: 3 },
        cards: { actorLens: 10, decision: 4, explanation: 5 },
      },
      analyst: {
        total: 23,
        main: 13,
        actorLens: 10,
        axes: { activism: 7, alliance: 8, escalation: 6, legitimacy: 7 },
        lanes: { alliances: 4, deterrence: 4, legitimacy: 5 },
        cards: { actorLens: 10, decision: 6, explanation: 7 },
      },
    },
  )

  assert.ok(report.theaterShares.length > 0)
  for (const share of report.theaterShares) {
    assert.equal(share.passes, true)
    assert.ok(share.primaryShare <= 1 / 3 + 1e-6)
    assert.ok(share.maxSecondaryShare <= 1 / 3 + 1e-6)
  }
  assert.equal(
    Math.max(...report.theaterShares.map((share) => share.maxSecondaryShare)),
    2 / 9,
  )
  assert.deepEqual(report.mechanismCost, {
    checkedOptions: 92,
    malformedOptions: [],
  })
  assert.deepEqual(report.moralValence.findings, [])
})

test("Security v4 validator fails closed on weight, theater-cap, and row-mapping drift", () => {
  const badActorWeight = mutateLedgerRows(
    SECURITY_V4_LEDGER_TEXT,
    (row) =>
      row.mode === "standard" && row.item_id === "middle_power_alignment",
    (row) => {
      row.item_primary_weight_per_axis = "1"
      row.item_max_weight_per_axis = "1"
    },
  )
  assertValidationFailure(
    badActorWeight,
    /middle_power_alignment item_(?:primary|max)_weight_per_axis/u,
  )

  const overCap = mutateLedgerRows(
    SECURITY_V4_LEDGER_TEXT,
    (row) =>
      row.mode === "standard" &&
      ["taiwan_inspection_regime_core", "iran_ceasefire_core"].includes(
        row.item_id,
      ),
    (row) => {
      row.theater_family = "euro_atlantic"
    },
  )
  assertValidationFailure(overCap, /exceeds one-third scored-axis weight/u)

  const swappedActors = mutateLedgerRows(
    SECURITY_V4_LEDGER_TEXT,
    (row) =>
      ["taiwan_beijing_instrument", "taiwan_taipei_continuity"].includes(
        row.item_id,
      ),
    (row) => {
      row.actor_label =
        row.actor_label === "Beijing" ? "Taipei" : "Beijing"
    },
  )
  assertValidationFailure(swappedActors, /ledger SHA-256 drifted/u)
})

test("all actor-lens choices leave Security v4 main, lane, and headline reads invariant", () => {
  for (const mode of ["standard", "analyst"] as const) {
    const questions: ModuleQuestion[] = SECURITY_V4.runtime.getModuleQuestions(
      SECURITY_V4.definition,
      mode,
    )
    const baseline = buildLensVariantAnswers(questions, mode, "first")
    const variant = buildLensVariantAnswers(questions, mode, "last")
    const baselineAnalytics: ModuleAnalytics = SECURITY_V4.runtime.buildModuleAnalytics(
      SECURITY_V4.definition,
      mode,
      baseline,
    )
    const variantAnalytics: ModuleAnalytics = SECURITY_V4.runtime.buildModuleAnalytics(
      SECURITY_V4.definition,
      mode,
      variant,
    )
    const baselineResult: ModuleResult = SECURITY_V4.runtime.buildModuleResult(
      SECURITY_V4.definition,
      mode,
      baseline,
    )
    const variantResult: ModuleResult = SECURITY_V4.runtime.buildModuleResult(
      SECURITY_V4.definition,
      mode,
      variant,
    )

    assert.equal(
      questions.filter((question) => question.cardType === "actorLens").length,
      10,
    )
    assert.deepEqual(variantAnalytics.scores, baselineAnalytics.scores)
    assert.deepEqual(variantAnalytics.laneScores, baselineAnalytics.laneScores)
    assert.equal(variantResult.headline, baselineResult.headline)
    assert.deepEqual(variantResult.laneSummaries, baselineResult.laneSummaries)
    assert.deepEqual(variantResult.overlayDeltas, baselineResult.overlayDeltas)
    assert.notDeepEqual(
      variantAnalytics.cardTypeScores.actorLens,
      baselineAnalytics.cardTypeScores.actorLens,
    )
    assert.deepEqual(
      variantResult.cardTypeScores.actorLens,
      variantAnalytics.cardTypeScores.actorLens,
    )
  }
})

test("Security v4 tuple dispatch and authored-order results stay golden", () => {
  assert.deepEqual(SECURITY_V4_TUPLE, { bankVersion: 4, scoringVersion: 2 })
  assert.equal(SECURITY_V4.runtime.MODULE_SCORING_VERSION, 2)

  const expectedByMode = {
    standard: {
      headline: "Security read: pressure and visible deterrence",
      scores: {
        activism: 4.6,
        escalation: 4.53,
        alliance: 4.68,
        legitimacy: 4.54,
      },
      lanes: { deterrence: 4.52, alliances: 6.25, legitimacy: 4.9 },
      actorLens: {
        activism: 4.27,
        escalation: 4.25,
        alliance: 4.26,
        legitimacy: 4.06,
      },
    },
    analyst: {
      headline: "Security read: pressure and visible deterrence",
      scores: {
        activism: 4.63,
        escalation: 4.56,
        alliance: 4.77,
        legitimacy: 4.46,
      },
      lanes: { deterrence: 4.76, alliances: 5.61, legitimacy: 4.7 },
      actorLens: {
        activism: 4.3,
        escalation: 4.25,
        alliance: 4.49,
        legitimacy: 4.1,
      },
    },
  } as const

  for (const mode of ["standard", "analyst"] as const) {
    const questions = SECURITY_V4.runtime.getModuleQuestions(
      SECURITY_V4.definition,
      mode,
    )
    const answers = authoredOrderAnswers(questions, mode)
    const resolved = resolveModulePayload(
      encodeUrlPayload({
        v: 3,
        bv: 4,
        sv: 2,
        slug: "security",
        mode,
        answers,
      }),
    )
    assert.ok(resolved)
    const result = resolved.runtime.buildModuleResult(
      resolved.definition,
      mode,
      resolved.payload.answers,
    )
    assert.deepEqual(
      {
        headline: result.headline,
        scores: result.scores,
        lanes: Object.fromEntries(
          result.laneSummaries.map((lane) => [lane.key, lane.score]),
        ),
        actorLens: result.cardTypeScores.actorLens,
      },
      expectedByMode[mode],
    )
  }

  for (const [bankVersion, scoringVersion] of [
    [4, 1],
    [4, 3],
    [5, 1],
    [5, 3],
  ]) {
    assert.equal(
      resolveModulePayload(
        encodeUrlPayload({
          v: 3,
          bv: bankVersion,
          sv: scoringVersion,
          slug: "security",
          mode: "standard",
          answers: {
            taiwan_inspection_regime_core: {
              primary: "normalize_inspection_regime",
            },
          },
        }),
      ),
      null,
    )
  }
})

test("Security v3 raw bank and payload replay remain frozen and readable", () => {
  assert.equal(
    sha256(SECURITY_V3_BANK_TEXT),
    "4ada4a5625952dcdce6113414e5796295625939d2ad18341d8451898a6b923ea",
  )
  assert.equal(
    sha256(JSON.stringify(SECURITY_V22_CALIBRATION)),
    "9161a4f8e0ea267b217760bacf6a7eed983c07b2d6207786acfbed8fe62abbbf",
  )
  const resolved = resolveModulePayload(
    encodeUrlPayload({
      v: 3,
      bv: MODULE_V22_TUPLE.bankVersion,
      sv: MODULE_V22_TUPLE.scoringVersion,
      slug: "security",
      mode: "standard",
      answers: {
        taiwan_quarantine: { primary: "clarify_response" },
        gray_zone_sabotage: { primary: "coalition_probe" },
      },
    }),
  )
  assert.ok(resolved)
  const replay = resolved.runtime.buildModuleResult(
    resolved.definition,
    resolved.payload.mode,
    resolved.payload.answers,
  )
  assert.deepEqual(
    {
      tuple: {
        bankVersion: resolved.bankVersion,
        scoringVersion: resolved.scoringVersion,
      },
      headline: replay.headline,
      scores: replay.scores,
      overlayDeltas: replay.overlayDeltas,
    },
    {
      tuple: { bankVersion: 3, scoringVersion: 2 },
      headline: "Security read: pressure and visible deterrence",
      scores: {
        activism: 5.45,
        escalation: 5.4,
        alliance: 4.5,
        legitimacy: 4,
      },
      overlayDeltas: {
        securityCompetition: 0.79,
        institutions: 0.15,
        normsIdentity: 0,
        restraint: -0.8,
        orderJustice: 0,
      },
    },
  )
})

test("Security v4 payloads enforce Analyst-only, distinct, allowed secondary choices", () => {
  const analystQuestion = SECURITY_V4.definition.questionsByMode.analyst.find(
    (question) => question.id === "taiwan_inspection_regime_core",
  )
  const standardQuestion = SECURITY_V4.definition.questionsByMode.standard.find(
    (question) => question.id === "taiwan_inspection_regime_core",
  )
  assert.ok(analystQuestion)
  assert.ok(standardQuestion)
  const [primary, secondary] = analystQuestion.options
  assert.ok(primary)
  assert.ok(secondary)

  assert.ok(
    resolveV4Selection("analyst", analystQuestion.id, {
      primary: primary.id,
      secondary: secondary.id,
    }),
  )
  assert.equal(
    resolveV4Selection("standard", standardQuestion.id, {
      primary: primary.id,
      secondary: secondary.id,
    }),
    null,
  )
  assert.equal(
    resolveV4Selection("analyst", analystQuestion.id, {
      primary: primary.id,
      secondary: primary.id,
    }),
    null,
  )
  assert.equal(
    resolveV4Selection("analyst", analystQuestion.id, {
      primary: primary.id,
      secondary: "not_an_option",
    }),
    null,
  )

  const originalPermission = analystQuestion.allowSecondChoiceInAnalyst
  analystQuestion.allowSecondChoiceInAnalyst = false
  try {
    assert.equal(
      resolveV4Selection("analyst", analystQuestion.id, {
        primary: primary.id,
        secondary: secondary.id,
      }),
      null,
    )
  } finally {
    analystQuestion.allowSecondChoiceInAnalyst = originalPermission
  }

  const v3 = getModuleVersion("security", 3, 2)
  assert.ok(v3)
  const legacyQuestion = v3.definition.questionsByMode.standard.find(
    (question) => question.id === "taiwan_quarantine",
  )
  assert.ok(legacyQuestion)
  assert.ok(
    resolveModulePayload(
      encodeUrlPayload({
        v: 3,
        bv: 3,
        sv: 2,
        slug: "security",
        mode: "standard",
        answers: {
          [legacyQuestion.id]: {
            primary: legacyQuestion.options[0].id,
            secondary: legacyQuestion.options[1].id,
          },
        },
      }),
    ),
    "the v4 contract must not make a formerly readable v3 payload invalid",
  )
})

test("Security v4 option order is seeded, non-mutating, and score-invariant", () => {
  const questions = SECURITY_V4.definition.questionsByMode.analyst
  const canonical = questions.map((question) =>
    question.options.map((option) => option.id),
  )
  const first = semanticAnswersThroughOrder(questions, "security-v4-seed-a")
  const resumed = semanticAnswersThroughOrder(questions, "security-v4-seed-a")
  const second = semanticAnswersThroughOrder(questions, "security-v4-seed-b")

  assert.deepEqual(resumed.answers, first.answers)
  assert.deepEqual(second.answers, first.answers)
  assert.ok(
    first.orders.some(
      (order, index) => order.join(",") !== second.orders[index].join(","),
    ),
  )
  assert.deepEqual(
    questions.map((question) => question.options.map((option) => option.id)),
    canonical,
  )
  assert.deepEqual(
    buildModuleAnalytics(SECURITY_V4.definition, "analyst", second.answers),
    buildModuleAnalytics(SECURITY_V4.definition, "analyst", first.answers),
  )
  for (const selection of Object.values(first.answers)) {
    assert.ok(selection.secondary)
    assert.notEqual(selection.secondary, selection.primary)
  }
})

test("Security v4 copy separates perspective from endorsement and stays domain-scoped", () => {
  assert.equal(sha256(SECURITY_V4_BANK_TEXT), SECURITY_V4_BANK_SHA256)
  assert.equal(SECURITY_V4_BANK.instrument, "security")
  assert.equal(SECURITY_V4_BANK.instrumentVersion, 4)

  const options = SECURITY_V4_BANK.items.flatMap((item) =>
    item.options.map((option) => ({ item, option })),
  )
  assert.equal(options.length, 92)
  for (const { item, option } of options) {
    const parts = option.label.split(" Accepted cost: ")
    assert.equal(
      parts.length,
      2,
      `${item.id}.${option.id} must contain one mechanism/cost delimiter`,
    )
    assert.ok(parts[0].trim().length > 0)
    assert.ok(parts[1].trim().length > 0)
  }

  assert.match(
    MODULE_APP_SOURCE,
    /ACTOR_LENS_INSTRUCTION/u,
  )
  assert.match(
    MODULE_RESULT_SOURCE,
    /ACTOR_LENS_INSTRUCTION/u,
  )
  assert.match(
    MODULE_RESULT_SOURCE,
    /Actor lens cards are excluded from the headline, axes, and lane results\./u,
  )
  assert.match(
    MODULE_RESULT_SOURCE,
    /it never changes the Foundation’s seven dimensions or family summary\./u,
  )
  assert.match(ACTOR_LENS_INSTRUCTION, /does not imply endorsement/u)
  assert.match(ACTOR_LENS_RESULT_SUMMARY, /No cross-actor average/u)

  for (const theater of ["taiwan", "iran"] as const) {
    const prefix = `${theater}_`
    const core = SECURITY_V4_BANK.items.filter(
      (item) => item.id.startsWith(prefix) && item.cardType !== "actorLens",
    )
    const lenses = SECURITY_V4_BANK.items.filter(
      (item) => item.id.startsWith(prefix) && item.cardType === "actorLens",
    )
    assert.equal(core.length, 1)
    assert.equal(lenses.length, 3)
  }

  const result = SECURITY_V4.runtime.buildModuleResult(
    SECURITY_V4.definition,
    "standard",
    authoredOrderAnswers(
      SECURITY_V4.definition.questionsByMode.standard,
      "standard",
    ),
  )
  const domainNarrative = JSON.stringify({
    headline: result.headline,
    summary: result.summary,
    instincts: result.instincts,
    challenge: result.challenge,
    lanes: result.laneSummaries,
    cardTypeRead: result.cardTypeRead,
  })
  assert.doesNotMatch(
    domainNarrative,
    /foundation profile|worldview family|archetype|master score/iu,
  )
})

test("Security v4 deterministic diagnostics stay reproducible and golden", async () => {
  const first = await buildSecurityV4DiagnosticReport()
  const repeated = await buildSecurityV4DiagnosticReport()
  assert.deepEqual(repeated, first)

  assert.deepEqual(first.versions.v4, {
    bankVersion: 4,
    scoringVersion: 2,
    runtimeVersion: 2,
    rawBankSha256: SECURITY_V4_BANK_SHA256,
    balanceLedgerSha256: SECURITY_V4_LEDGER_SHA256,
  })
  assert.deepEqual(first.versions.v3, {
    bankVersion: 3,
    scoringVersion: 2,
    runtimeVersion: 2,
    rawBankSha256:
      "4ada4a5625952dcdce6113414e5796295625939d2ad18341d8451898a6b923ea",
    deterministicReplayDigest:
      "85b5577ca5a809b709fa50e6522366eff5e1d35745d3620c29a8a342745a607a",
  })
  assert.equal(first.calibration.length, 16)
  assert.equal(
    sha256(JSON.stringify(first.calibration)),
    "f4e5834854a46475657e61b5adf794fbb77fda5b632a4d0d0088cad4a56e6790",
  )
  assert.deepEqual(first.attainableRanges, {
    standard: {
      activism: { minimum: 3.17, maximum: 5.54 },
      escalation: { minimum: 3.44, maximum: 5.32 },
      alliance: { minimum: 3.61, maximum: 4.86 },
      legitimacy: { minimum: 3.43, maximum: 5.12 },
    },
    analyst: {
      activism: { minimum: 3.32, maximum: 5.4 },
      escalation: { minimum: 3.53, maximum: 5.22 },
      alliance: { minimum: 3.44, maximum: 5.18 },
      legitimacy: { minimum: 3.45, maximum: 5.11 },
    },
  })
  assert.deepEqual(first.primaryOnly.standard.headlineCounts, {
    "Security read: coalition-centered pressure management": 92,
    "Security read: no single lane dominates": 94,
    "Security read: pressure and visible deterrence": 120,
    "Security read: protection-sensitive statecraft": 63,
    "Security read: restraint and crisis ceilings": 131,
  })
  assert.deepEqual(first.primaryOnly.analyst.headlineCounts, {
    "Security read: coalition-centered pressure management": 84,
    "Security read: no single lane dominates": 98,
    "Security read: pressure and visible deterrence": 147,
    "Security read: protection-sensitive statecraft": 60,
    "Security read: restraint and crisis ceilings": 111,
  })
  assert.equal(first.analystSecondarySensitivity.changedHeadlineCount, 178)
  assert.deepEqual(first.actorLensExclusion, {
    standard: {
      lensCount: 10,
      mainScoresEqual: true,
      laneScoresEqual: true,
      headlineEqual: true,
      laneSummariesEqual: true,
      actorLensAnalyticsChanged: true,
    },
    analyst: {
      lensCount: 10,
      mainScoresEqual: true,
      laneScoresEqual: true,
      headlineEqual: true,
      laneSummariesEqual: true,
      actorLensAnalyticsChanged: true,
    },
  })
})

function authoredOrderAnswers(
  questions: readonly ModuleQuestion[],
  mode: QuizMode,
): ModuleAnswers {
  return Object.fromEntries(
    questions.map((question) => [
      question.id,
      {
        primary: question.options[0].id,
        ...(mode === "analyst" &&
        question.allowSecondChoiceInAnalyst &&
        question.options[1]
          ? { secondary: question.options[1].id }
          : {}),
      },
    ]),
  )
}

function buildLensVariantAnswers(
  questions: readonly ModuleQuestion[],
  mode: QuizMode,
  variant: "first" | "last",
): ModuleAnswers {
  return Object.fromEntries(
    questions.map((question) => {
      const isLens = question.cardType === "actorLens"
      const primaryIndex = isLens && variant === "last" ? 3 : 0
      const secondaryIndex = isLens && variant === "last" ? 2 : 1
      return [
        question.id,
        {
          primary: question.options[primaryIndex].id,
          ...(mode === "analyst" && question.allowSecondChoiceInAnalyst
            ? { secondary: question.options[secondaryIndex].id }
            : {}),
        },
      ]
    }),
  )
}

function resolveV4Selection(
  mode: QuizMode,
  questionId: string,
  selection: { primary: string; secondary?: string },
) {
  return resolveModulePayload(
    encodeUrlPayload({
      v: 3,
      bv: 4,
      sv: 2,
      slug: "security",
      mode,
      answers: { [questionId]: selection },
    }),
  )
}

function semanticAnswersThroughOrder(
  questions: readonly ModuleQuestion[],
  seed: string,
) {
  const answers: ModuleAnswers = {}
  const orders: string[][] = []
  for (const [index, question] of questions.entries()) {
    const canonicalPrimary = question.options[index % question.options.length]
    const canonicalSecondary =
      question.options[(index + 1) % question.options.length]
    const presented = getSeededOptionOrder(question.options, seed, question.id)
    orders.push(presented.map((option) => option.id))
    const primary = presented.find(
      (option) => option.id === canonicalPrimary.id,
    )
    const secondary = presented.find(
      (option) => option.id === canonicalSecondary.id,
    )
    assert.ok(primary)
    assert.ok(secondary)
    answers[question.id] = {
      primary: primary.id,
      secondary: secondary.id,
    }
  }
  return { answers, orders }
}

function mutateLedgerRows(
  csv: string,
  predicate: (row: Record<string, string>) => boolean,
  mutate: (row: Record<string, string>) => void,
) {
  const [headerLine, ...lines] = csv.trimEnd().split("\n")
  const headers = headerLine.split(",")
  const nextLines = lines.map((line) => {
    const fields = line.split(",")
    const row = Object.fromEntries(
      headers.map((header, index) => [header, fields[index]]),
    )
    if (predicate(row)) mutate(row)
    return headers.map((header) => row[header]).join(",")
  })
  return [headerLine, ...nextLines].join("\n") + "\n"
}

function assertValidationFailure(ledger: string, expected: RegExp) {
  assert.throws(
    () =>
      validateSecurityV4(
        JSON.parse(SECURITY_V4_BANK_TEXT),
        ledger,
        SECURITY_V4_BANK_TEXT,
      ),
    (error: unknown) => {
      assert.ok(error instanceof SecurityV4ValidationError)
      assert.match(error.message, expected)
      return true
    },
  )
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex")
}
