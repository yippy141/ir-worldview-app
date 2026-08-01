import test from "node:test"
import assert from "node:assert/strict"
import { POST as postAggregateResult } from "@/app/api/aggregate/result/route"
import { FOUNDATION_INSTRUMENT_VERSION } from "@/lib/quiz-schema"
import { FOUNDATION_SCORING_VERSION, buildCanonicalFoundationResult } from "@/lib/scoring"
import { setAnalyticsOptOut } from "@/lib/analytics/adapter"
import {
  bucketItemResponseLatency,
  buildTier1Cohort,
  buildTier1AggregateResult,
  dimensionBuckets,
  submitTier1AggregateResult,
  submitTier1CompletionStep,
  validateTier1AggregateResult,
  validateTier1CompletionStep,
} from "@/lib/research/tier1-aggregate"
import type { DimensionScores } from "@/lib/types"

const scores: DimensionScores = {
  securityCompetition: 4.14,
  institutions: 4.25,
  domesticFilters: 4.36,
  normsIdentity: 4.45,
  politicalEconomy: 4.56,
  restraint: 4.65,
  orderJustice: 4.74,
}
const cohort = buildTier1Cohort("fullExtended", "en")

test("Tier 1 result payload contains only current derived scores and labels", () => {
  const aggregate = buildTier1AggregateResult(
    buildCanonicalFoundationResult(scores),
    cohort,
  )

  assert.deepEqual(Object.keys(aggregate).sort(), [
    "archetypeCode",
    "completionLocale",
    "dimensionScores",
    "family",
    "instrumentVersion",
    "itemLatencies",
    "localeCopyVersion",
    "normativeModifier",
    "questionSet",
    "scoringVersion",
    "strategyModifier",
  ])
  assert.equal(aggregate.instrumentVersion, FOUNDATION_INSTRUMENT_VERSION)
  assert.equal(aggregate.scoringVersion, FOUNDATION_SCORING_VERSION)
  assert.deepEqual(aggregate.itemLatencies, [])
  assert.equal(aggregate.questionSet, "fullExtended")
  assert.equal(aggregate.completionLocale, "en")
  assert.equal(validateTier1AggregateResult(aggregate).ok, true)
})

test("Tier 1 validation rejects raw answers and identifiers", () => {
  const aggregate = buildTier1AggregateResult(
    buildCanonicalFoundationResult(scores),
    cohort,
  )

  for (const forbiddenField of [
    "answers",
    "respondentId",
    "sessionId",
    "email",
    "ipAddress",
    "rawTimestamps",
  ]) {
    const validation = validateTier1AggregateResult({
      ...aggregate,
      [forbiddenField]: "forbidden",
    })
    assert.equal(validation.ok, false, forbiddenField)
  }
})

test("Tier 1 validation rejects labels that do not match the scores", () => {
  const aggregate = buildTier1AggregateResult(
    buildCanonicalFoundationResult(scores),
    cohort,
  )
  const validation = validateTier1AggregateResult({
    ...aggregate,
    family: aggregate.family === "realist" ? "constructivist" : "realist",
  })

  assert.equal(validation.ok, false)
})

test("item response milliseconds map to the six aggregate latency buckets", () => {
  assert.equal(bucketItemResponseLatency(0), 0)
  assert.equal(bucketItemResponseLatency(1_999), 0)
  assert.equal(bucketItemResponseLatency(2_000), 2_000)
  assert.equal(bucketItemResponseLatency(4_999), 2_000)
  assert.equal(bucketItemResponseLatency(5_000), 5_000)
  assert.equal(bucketItemResponseLatency(9_999), 5_000)
  assert.equal(bucketItemResponseLatency(10_000), 10_000)
  assert.equal(bucketItemResponseLatency(29_999), 10_000)
  assert.equal(bucketItemResponseLatency(30_000), 30_000)
  assert.equal(bucketItemResponseLatency(119_999), 30_000)
  assert.equal(bucketItemResponseLatency(120_000), 120_000)
  assert.equal(bucketItemResponseLatency(900_000), 120_000)
})

test("aggregate item latencies are canonicalized without response ordering", () => {
  const aggregate = buildTier1AggregateResult(
    buildCanonicalFoundationResult(scores),
    cohort,
    {
      oj1: 30_000,
      df1: 2_000,
      unknown_item: 5_000,
    },
  )

  assert.deepEqual(aggregate.itemLatencies, [
    { itemId: "df1", bucket: 2_000 },
    { itemId: "oj1", bucket: 30_000 },
  ])
  assert.equal(validateTier1AggregateResult(aggregate).ok, true)
})

test("aggregate validation rejects raw latency values and duplicate items", () => {
  const aggregate = buildTier1AggregateResult(
    buildCanonicalFoundationResult(scores),
    cohort,
  )

  for (const itemLatencies of [
    [{ itemId: "df1", bucket: 2_314 }],
    [
      { itemId: "df1", bucket: 2_000 },
      { itemId: "df1", bucket: 5_000 },
    ],
    [{ itemId: "unknown_item", bucket: 2_000 }],
    [{ itemId: "df1", bucket: 2_000, timestamp: 42 }],
  ]) {
    assert.equal(
      validateTier1AggregateResult({ ...aggregate, itemLatencies }).ok,
      false,
    )
  }
})

test("completion validation accepts bounded steps and rejects identifiers", () => {
  assert.deepEqual(
    validateTier1CompletionStep({
      ...buildTier1Cohort("core", "en"),
      stepIndex: 0,
    }),
    {
      ok: true,
      completion: {
        ...buildTier1Cohort("core", "en"),
        stepIndex: 0,
      },
    },
  )
  assert.equal(
    validateTier1CompletionStep({
      ...buildTier1Cohort("core", "en"),
      stepIndex: 0,
      sessionId: "forbidden",
    }).ok,
    false,
  )
  assert.equal(
    validateTier1CompletionStep({
      ...buildTier1Cohort(
        "targetedExtended",
        "en",
        ["realist", "institutionalist"],
      ),
      stepIndex: 5,
    }).ok,
    false,
  )
})

test("dimension scores are rounded into one-decimal buckets", () => {
  assert.deepEqual(dimensionBuckets(scores), [
    { dimension: "securityCompetition", bucket: 4.1 },
    { dimension: "institutions", bucket: 4.3 },
    { dimension: "domesticFilters", bucket: 4.4 },
    { dimension: "normsIdentity", bucket: 4.5 },
    { dimension: "politicalEconomy", bucket: 4.6 },
    { dimension: "restraint", bucket: 4.7 },
    { dimension: "orderJustice", bucket: 4.7 },
  ])
})

test("aggregate result route no-ops successfully without DATABASE_URL", async () => {
  const aggregate = buildTier1AggregateResult(
    buildCanonicalFoundationResult(scores),
    cohort,
  )
  const response = await postAggregateResult(
    new Request("http://localhost/api/aggregate/result", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(aggregate),
    }),
  )

  assert.equal(response.status, 202)
  assert.deepEqual(await response.json(), { ok: true })
})

test("aggregate result route accepts a completion step without an identifier", async () => {
  const response = await postAggregateResult(
    new Request("http://localhost/api/aggregate/result", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...buildTier1Cohort("core", "en"),
        stepIndex: 0,
      }),
    }),
  )

  assert.equal(response.status, 202)
  assert.deepEqual(await response.json(), { ok: true })
})

test("aggregate result route rejects forbidden fields", async () => {
  const aggregate = buildTier1AggregateResult(
    buildCanonicalFoundationResult(scores),
    cohort,
  )
  const response = await postAggregateResult(
    new Request("http://localhost/api/aggregate/result", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...aggregate, answers: { sc1: 7 } }),
    }),
  )

  assert.equal(response.status, 400)
})

test("aggregate route rejects cross-site and text/plain submissions", async () => {
  const aggregate = buildTier1AggregateResult(
    buildCanonicalFoundationResult(scores),
    cohort,
  )
  const textResponse = await postAggregateResult(
    new Request("http://localhost/api/aggregate/result", {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: JSON.stringify(aggregate),
    }),
  )
  const crossSiteResponse = await postAggregateResult(
    new Request("http://localhost/api/aggregate/result", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://example.com",
        "sec-fetch-site": "cross-site",
      },
      body: JSON.stringify(aggregate),
    }),
  )

  assert.equal(textResponse.status, 415)
  assert.equal(crossSiteResponse.status, 403)
})

test("the browser opt-out suppresses result and completion submissions", async () => {
  const originalWindow = globalThis.window
  const calls: unknown[] = []
  const storage = new Map<string, string>()
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      fetch: async (...args: unknown[]) => {
        calls.push(args)
        return new Response(null, { status: 202 })
      },
      localStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
        removeItem: (key: string) => storage.delete(key),
      },
    },
  })

  try {
    setAnalyticsOptOut(true)
    await submitTier1AggregateResult(
      buildCanonicalFoundationResult(scores),
      cohort,
    )
    await submitTier1CompletionStep(cohort, 0)
    assert.equal(calls.length, 0)
  } finally {
    setAnalyticsOptOut(false)
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: originalWindow,
    })
  }
})
