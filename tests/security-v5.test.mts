import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import golden from "@/tests/fixtures/security-v5-golden.json" with {
  type: "json",
}
import { resolveModulePayload } from "@/lib/modules/framework"
import {
  ACTOR_LENS_INSTRUCTION,
  ACTOR_LENS_RESULT_SUMMARY,
  hasPerspectiveBankCapability,
} from "@/lib/modules/perspective-bank"
import {
  CURRENT_MODULE_TUPLES,
  SECURITY_V4_TUPLE,
  SECURITY_V5_TUPLE,
  getModuleVersion,
} from "@/lib/modules/versions"
import type {
  ModuleAnswers,
  ModuleQuestion,
  ModuleResult,
} from "@/lib/modules/types"
import type { QuizMode } from "@/lib/types"
import { encodeUrlPayload } from "@/lib/url-payload"
// Node's strip-types runtime requires the explicit .mts extension.
// @ts-expect-error TypeScript's bundler resolver disallows that runtime form.
import { buildSecurityV5DiagnosticReport } from "@/scripts/diagnose-security-v5.mts"
// Node's strip-types runtime requires the explicit .mts extension.
// @ts-expect-error TypeScript's bundler resolver disallows that runtime form.
import { buildSecurityV5ValidationReport, SECURITY_V5_CALIBRATION_SHA256 } from "@/scripts/validate-security-v5.mts"

const V4_BANK = JSON.parse(
  readFileSync(
    new URL("../content/instrument/security.v4.json", import.meta.url),
    "utf8",
  ),
) as { items: ModuleQuestion[] }
const V5_BANK = JSON.parse(
  readFileSync(
    new URL("../content/instrument/security.v5.json", import.meta.url),
    "utf8",
  ),
) as { instrumentVersion: number; items: ModuleQuestion[] }
const MODULE_APP_SOURCE = readFileSync(
  new URL("../components/modules/module-app.tsx", import.meta.url),
  "utf8",
)
const MODULE_RESULT_SOURCE = readFileSync(
  new URL("../components/modules/module-result.tsx", import.meta.url),
  "utf8",
)

const V5 = getModuleVersion(
  "security",
  SECURITY_V5_TUPLE.bankVersion,
  SECURITY_V5_TUPLE.scoringVersion,
)
assert.ok(V5)

test("Security v5 is the current exact tuple with separately gated hashes", async () => {
  const report = await buildSecurityV5ValidationReport()

  assert.deepEqual(SECURITY_V5_TUPLE, golden.tuple)
  assert.deepEqual(CURRENT_MODULE_TUPLES.security, golden.tuple)
  assert.equal(V5_BANK.instrumentVersion, 5)
  assert.equal(report.bankSha256, golden.bankSha256)
  assert.equal(report.calibrationSha256, golden.calibrationSha256)
  assert.equal(SECURITY_V5_CALIBRATION_SHA256, golden.calibrationSha256)
  assert.equal(report.scoredOptionIdsAndSignalsMatchV4, true)
  assert.equal(report.specialistTermBindingsChecked, 41)
  assert.ok(report.exactSourceIds.includes("SAx"))
  assert.equal(report.exactSourceIds.includes("I11"), false)
  assert.equal(report.exactSourceIds.includes("I13"), false)
})

test("Security v5 authored-order results are golden in both modes", () => {
  for (const mode of ["standard", "analyst"] as const) {
    const questions = V5.runtime.getModuleQuestions(V5.definition, mode)
    const answers = authoredOrderAnswers(questions, mode)
    const resolved = resolveModulePayload(
      encodeUrlPayload({
        v: 3,
        bv: SECURITY_V5_TUPLE.bankVersion,
        sv: SECURITY_V5_TUPLE.scoringVersion,
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
      },
      golden[mode],
    )
  }
})

test("Security perspective capability is one predicate for v4 and v5 only", () => {
  assert.equal(
    hasPerspectiveBankCapability({ slug: "security", bankVersion: 3 }),
    false,
  )
  assert.equal(
    hasPerspectiveBankCapability({ slug: "security", bankVersion: 4 }),
    true,
  )
  assert.equal(
    hasPerspectiveBankCapability({ slug: "security", bankVersion: 5 }),
    true,
  )
  assert.equal(
    hasPerspectiveBankCapability({ slug: "technology", bankVersion: 5 }),
    false,
  )
  assert.match(MODULE_APP_SOURCE, /hasPerspectiveBankCapability/u)
  assert.match(MODULE_RESULT_SOURCE, /hasPerspectiveBankCapability/u)
  assert.doesNotMatch(MODULE_APP_SOURCE, /bankVersion === 4/u)
  assert.doesNotMatch(MODULE_RESULT_SOURCE, /bankVersion === 4/u)
})

test("every v4 and v5 actor lens receives the same endorsement boundary", () => {
  for (const tuple of [SECURITY_V4_TUPLE, SECURITY_V5_TUPLE]) {
    const version = getModuleVersion(
      "security",
      tuple.bankVersion,
      tuple.scoringVersion,
    )
    assert.ok(version)
    const lenses = version.definition.questionsByMode.standard.filter(
      (question) => question.cardType === "actorLens",
    )
    assert.equal(lenses.length, 10)
  }
  assert.match(MODULE_APP_SOURCE, /ACTOR_LENS_INSTRUCTION/u)
  assert.match(MODULE_RESULT_SOURCE, /ACTOR_LENS_INSTRUCTION/u)

  const beijing = V5_BANK.items.find(
    (item) => item.id === "taiwan_beijing_instrument",
  )
  assert.ok(beijing)
  assert.doesNotMatch(beijing.scene, /not an endorsement/iu)
})

test("v5 actor-lens changes cannot alter headline, main axes, lanes, or overlays", () => {
  for (const mode of ["standard", "analyst"] as const) {
    const questions = V5.runtime.getModuleQuestions(V5.definition, mode)
    const first = buildLensVariantAnswers(questions, mode, "first")
    const last = buildLensVariantAnswers(questions, mode, "last")
    const firstResult: ModuleResult = V5.runtime.buildModuleResult(
      V5.definition,
      mode,
      first,
    )
    const lastResult: ModuleResult = V5.runtime.buildModuleResult(
      V5.definition,
      mode,
      last,
    )
    assert.equal(lastResult.headline, firstResult.headline)
    assert.deepEqual(lastResult.scores, firstResult.scores)
    assert.deepEqual(lastResult.laneSummaries, firstResult.laneSummaries)
    assert.deepEqual(lastResult.overlayDeltas, firstResult.overlayDeltas)
    assert.notDeepEqual(
      lastResult.cardTypeScores.actorLens,
      firstResult.cardTypeScores.actorLens,
    )
  }
})

test("active v5 copy makes no pooled cross-actor inference", () => {
  const result: ModuleResult = V5.runtime.buildModuleResult(
    V5.definition,
    "standard",
    authoredOrderAnswers(V5.definition.questionsByMode.standard, "standard"),
  )
  assert.equal(result.cardTypeRead?.summary, ACTOR_LENS_RESULT_SUMMARY)
  assert.match(
    result.cardTypeRead?.summary ?? "",
    /separate role-conditioned judgments/u,
  )
  assert.match(result.cardTypeRead?.summary ?? "", /No cross-actor average/u)
  assert.doesNotMatch(
    JSON.stringify({
      cardTypeRead: result.cardTypeRead,
      moduleApp: MODULE_APP_SOURCE,
      moduleResult: MODULE_RESULT_SOURCE,
    }),
    /how readily you can separate another state's position|pooled perspective|On balance, your perspective-modeling/iu,
  )
})

test("Ukraine v5 costs describe analytic mechanism limits without score drift", () => {
  const v4 = V4_BANK.items.find(
    (item) => item.id === "ukraine_ceasefire_stall",
  )
  const v5 = V5_BANK.items.find(
    (item) => item.id === "ukraine_ceasefire_stall",
  )
  assert.ok(v4)
  assert.ok(v5)
  assert.deepEqual(
    v5.options.map(({ id, signals }) => ({ id, signals })),
    v4.options.map(({ id, signals }) => ({ id, signals })),
  )
  for (const option of v5.options) {
    assert.match(
      option.label,
      /Accepted cost: Prioritizing this mechanism can (?:understate|overstate) /u,
    )
    assert.doesNotMatch(
      option.label,
      /civilian|death|fatalit|casualt|lives|human cost|suffering/iu,
    )
  }
})

test("Security v5 diagnostics remain deterministic and retain v4 replay context", async () => {
  const first = await buildSecurityV5DiagnosticReport()
  const second = await buildSecurityV5DiagnosticReport()
  assert.deepEqual(second, first)
  assert.deepEqual(first.versions.frozenV4, {
    bankVersion: 4,
    scoringVersion: 2,
    runtimeVersion: 2,
  })
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
      return [
        question.id,
        {
          primary: question.options[isLens && variant === "last" ? 3 : 0].id,
          ...(mode === "analyst" && question.allowSecondChoiceInAnalyst
            ? {
                secondary:
                  question.options[isLens && variant === "last" ? 2 : 1].id,
              }
            : {}),
        },
      ]
    }),
  )
}
