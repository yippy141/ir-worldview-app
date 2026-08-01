import test from "node:test"
import assert from "node:assert/strict"
import { POST as postAggregateResult } from "@/app/api/aggregate/result/route"
import {
  createDatabaseClient,
  db,
  type DatabaseClient,
} from "@/lib/db"
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

function aggregateRequest(body: unknown): Request {
  return new Request("http://localhost/api/aggregate/result", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  })
}

function configuredDatabase(
  query: (
    statement: string,
    parameters: unknown[],
  ) => Promise<Record<string, unknown>[]>,
): DatabaseClient {
  return {
    isConfigured: true,
    async query<Row extends Record<string, unknown>>(
      statement: string,
      parameters: unknown[] = [],
    ) {
      return await query(statement, parameters) as Row[]
    },
  }
}

async function withTier1Database<T>(
  database: DatabaseClient,
  run: () => Promise<T>,
): Promise<T> {
  const enabled = process.env.TIER1_AGGREGATES_ENABLED
  const originalIsConfigured = db.isConfigured
  const originalQuery = db.query

  process.env.TIER1_AGGREGATES_ENABLED = "true"
  Object.defineProperty(db, "isConfigured", {
    configurable: true,
    value: database.isConfigured,
  })
  Object.defineProperty(db, "query", {
    configurable: true,
    value: database.query.bind(database),
  })

  try {
    return await run()
  } finally {
    if (enabled === undefined) {
      delete process.env.TIER1_AGGREGATES_ENABLED
    } else {
      process.env.TIER1_AGGREGATES_ENABLED = enabled
    }
    Object.defineProperty(db, "isConfigured", {
      configurable: true,
      value: originalIsConfigured,
    })
    Object.defineProperty(db, "query", {
      configurable: true,
      value: originalQuery,
    })
  }
}

function insertedColumnSets(statement: string): Record<string, string[]> {
  return Object.fromEntries(
    [...statement.matchAll(/insert\s+into\s+([a-z_]+)\s*\(([^)]+)\)/gi)]
      .map((match) => [
        match[1],
        match[2]
          .split(",")
          .map((column) => column.trim())
          .sort(),
      ]),
  )
}

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

test("result route writes only the exact aggregate counter columns", async () => {
  const aggregate = buildTier1AggregateResult(
    buildCanonicalFoundationResult(scores),
    cohort,
    { df1: 2_000 },
  )
  const queries: Array<{ statement: string; parameters: unknown[] }> = []
  const database = configuredDatabase(async (statement, parameters) => {
    queries.push({ statement, parameters })
    return []
  })

  const response = await withTier1Database(database, () =>
    postAggregateResult(aggregateRequest(aggregate)),
  )

  assert.equal(response.status, 202)
  assert.deepEqual(await response.json(), { ok: true })
  assert.equal(queries.length, 1)
  assert.deepEqual(insertedColumnSets(queries[0].statement), {
    agg_dimension_buckets: [
      "bucket",
      "completion_locale",
      "count",
      "dimension",
      "form_key",
      "instrument_version",
      "locale_copy_version",
      "scoring_version",
    ],
    agg_item_latency: [
      "completion_locale",
      "count",
      "form_key",
      "instrument_version",
      "item_id",
      "latency_bucket_ms",
      "locale_copy_version",
    ],
    agg_labels: [
      "archetype_code",
      "completion_locale",
      "count",
      "family",
      "form_key",
      "instrument_version",
      "locale_copy_version",
      "normative_modifier",
      "scoring_version",
      "strategy_modifier",
    ],
  })
  assert.equal(queries[0].parameters.length, 11)
  const insertedColumns = Object.values(
    insertedColumnSets(queries[0].statement),
  ).flat()
  assert.doesNotMatch(
    insertedColumns.join(" "),
    /respondent|session|email|ip|user_agent|timestamp|created_at/i,
  )
})

test("completion route writes only the exact aggregate counter columns", async () => {
  const queries: Array<{ statement: string; parameters: unknown[] }> = []
  const database = configuredDatabase(async (statement, parameters) => {
    queries.push({ statement, parameters })
    return []
  })
  const completion = {
    ...buildTier1Cohort("core", "en"),
    stepIndex: 0,
  }

  const response = await withTier1Database(database, () =>
    postAggregateResult(aggregateRequest(completion)),
  )

  assert.equal(response.status, 202)
  assert.deepEqual(await response.json(), { ok: true })
  assert.equal(queries.length, 1)
  assert.deepEqual(insertedColumnSets(queries[0].statement), {
    agg_completion: [
      "completion_locale",
      "count",
      "form_key",
      "instrument_version",
      "locale_copy_version",
      "step_index",
      "tier",
    ],
  })
  assert.equal(queries[0].parameters.length, 6)
})

for (const [name, database] of [
  [
    "database unavailable",
    configuredDatabase(async () => {
      throw new TypeError("fetch failed")
    }),
  ],
  [
    "malformed connection string",
    createDatabaseClient("not-a-postgres-url"),
  ],
  [
    "write timeout",
    configuredDatabase(async () => {
      throw new DOMException("The operation timed out.", "TimeoutError")
    }),
  ],
] as const) {
  test(`result storage failure is silent when ${name}`, async () => {
    const aggregate = buildTier1AggregateResult(
      buildCanonicalFoundationResult(scores),
      cohort,
    )
    const errors: unknown[][] = []
    const originalConsoleError = console.error
    console.error = (...args: unknown[]) => {
      errors.push(args)
    }

    try {
      let response: Response | undefined
      await assert.doesNotReject(async () => {
        response = await withTier1Database(database, () =>
          postAggregateResult(aggregateRequest(aggregate)),
        )
      })
      await new Promise<void>((resolve) => setImmediate(resolve))

      assert.equal(response?.status, 202)
      assert.deepEqual(await response?.json(), { ok: true })
      assert.equal(errors.length, 1)
    } finally {
      console.error = originalConsoleError
    }
  })
}

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
    await assert.doesNotReject(
      submitTier1AggregateResult(
        buildCanonicalFoundationResult(scores),
        cohort,
      ),
    )
    await assert.doesNotReject(submitTier1CompletionStep(cohort, 0))
    assert.equal(calls.length, 0)
  } finally {
    setAnalyticsOptOut(false)
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: originalWindow,
    })
  }
})

test("browser submission contains rejected fetches without an unhandled rejection", async () => {
  const originalWindow = globalThis.window
  const calls: unknown[] = []
  const unhandledRejections: unknown[] = []
  const storage = new Map<string, string>()
  const recordUnhandledRejection = (reason: unknown) => {
    unhandledRejections.push(reason)
  }
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      fetch: async (...args: unknown[]) => {
        calls.push(args)
        throw new TypeError("network unavailable")
      },
      localStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
        removeItem: (key: string) => storage.delete(key),
      },
    },
  })

  try {
    process.on("unhandledRejection", recordUnhandledRejection)
    void submitTier1AggregateResult(
      buildCanonicalFoundationResult(scores),
      cohort,
    )
    void submitTier1CompletionStep(cohort, 0)
    await new Promise<void>((resolve) => setImmediate(resolve))
    assert.equal(calls.length, 2)
    assert.deepEqual(unhandledRejections, [])
  } finally {
    process.off("unhandledRejection", recordUnhandledRejection)
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: originalWindow,
    })
  }
})
