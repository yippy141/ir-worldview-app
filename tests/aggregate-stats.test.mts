import test from "node:test"
import assert from "node:assert/strict"
import { GET as getAggregateStats } from "@/app/api/aggregate/stats/route"
import {
  db,
  type DatabaseClient,
} from "@/lib/db"
import {
  readAggregateStatsForFoundationPayload,
  readCurrentAggregateStats,
} from "@/lib/research/aggregate-stats"
import { buildTier1Cohort } from "@/lib/research/tier1-aggregate"
import {
  buildFoundationSharePayload,
  dimensionScoresToArray,
  encodePayload,
  resolveFoundationPayload,
} from "@/lib/share"
import { FOUNDATION_INSTRUMENT_VERSION } from "@/lib/quiz-schema"
import {
  buildCanonicalFoundationResult,
  FOUNDATION_SCORING_VERSION,
} from "@/lib/scoring"
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

test("stats read path suppresses every aggregate row when cohort n is below 100", async () => {
  const statements: string[] = []
  const database: DatabaseClient = {
    isConfigured: true,
    async query<Row extends Record<string, unknown>>(statement: string) {
      statements.push(statement)
      if (statement.includes("from agg_labels")) {
        return [
          {
            archetype_code: "P+",
            normative_modifier: "Pluralist",
            count: "99",
          },
        ] as unknown as Row[]
      }
      if (statement.includes("from agg_dimension_buckets")) {
        return [
          {
            dimension: "institutions",
            bucket: "4.0",
            count: "99",
          },
        ] as unknown as Row[]
      }
      throw new Error("Unexpected aggregate query.")
    },
  }

  const stats = await withTier1Database(database, () =>
    readCurrentAggregateStats(buildTier1Cohort("core", "en")),
  )

  assert.equal(statements.length, 2)
  assert.deepEqual(stats.buckets, [])
  assert.deepEqual(stats.labels, [])
})

test("stats read path suppresses each axis whose own n is below 100", async () => {
  const database: DatabaseClient = {
    isConfigured: true,
    async query<Row extends Record<string, unknown>>(statement: string) {
      if (statement.includes("from agg_labels")) {
        return [
          {
            archetype_code: "P+",
            normative_modifier: "Pluralist",
            count: "100",
          },
        ] as unknown as Row[]
      }
      if (statement.includes("from agg_dimension_buckets")) {
        return [
          {
            dimension: "institutions",
            bucket: "4.0",
            count: "99",
          },
          {
            dimension: "restraint",
            bucket: "4.0",
            count: "100",
          },
        ] as unknown as Row[]
      }
      throw new Error("Unexpected aggregate query.")
    },
  }

  const stats = await withTier1Database(database, () =>
    readCurrentAggregateStats(buildTier1Cohort("fullExtended", "en")),
  )

  assert.deepEqual(stats.buckets, [
    {
      dimension: "restraint",
      bucket: 4,
      count: 100,
    },
  ])
  assert.deepEqual(stats.labels, [
    {
      archetypeCode: "P+",
      normativeModifier: "Pluralist",
      count: 100,
    },
  ])
})

test("Foundation payload stats reader fails closed for legacy or mismatched cohorts", async () => {
  const current = resolveFoundationPayload(currentFoundationPayload())
  const legacy = resolveFoundationPayload(legacyFoundationPayload())
  assert.ok(current)
  assert.ok(legacy)

  assert.equal(
    await readAggregateStatsForFoundationPayload(legacy),
    null,
  )
  assert.equal(
    await readAggregateStatsForFoundationPayload({
      ...current,
      provenance: {
        ...current.provenance,
        instrumentVersion: current.provenance.instrumentVersion + 1,
      },
    }),
    null,
  )
  assert.equal(
    await readAggregateStatsForFoundationPayload({
      ...current,
      provenance: {
        ...current.provenance,
        localeCopyVersion: -1,
      },
    }),
    null,
  )
})

test("stats route accepts only one current Foundation payload and caches success for five minutes", async () => {
  const payload = currentFoundationPayload()
  const database: DatabaseClient = {
    isConfigured: false,
    async query() {
      throw new Error("An unconfigured stats reader must not query storage.")
    },
  }

  const response = await withTier1Database(database, () =>
    getAggregateStats(
      new Request(
        `https://example.test/api/aggregate/stats?payload=${encodeURIComponent(payload)}`,
      ),
    ),
  )
  const body = await response.json()

  assert.equal(response.status, 200)
  assert.equal(
    response.headers.get("cache-control"),
    "public, max-age=300, s-maxage=300",
  )
  assert.deepEqual(body, {
    instrument: "foundation",
    mode: "fullExtended",
    instrumentVersion: FOUNDATION_INSTRUMENT_VERSION,
    scoringVersion: FOUNDATION_SCORING_VERSION,
    questionSet: "fullExtended",
    completionLocale: "en",
    localeCopyVersion: 1,
    buckets: [],
    labels: [],
  })
})

test("stats route rejects missing, extra, duplicate, invalid, and legacy payload queries", async () => {
  const current = currentFoundationPayload()
  const legacy = legacyFoundationPayload()
  const requests = [
    "https://example.test/api/aggregate/stats",
    `https://example.test/api/aggregate/stats?payload=${encodeURIComponent(current)}&mode=core`,
    `https://example.test/api/aggregate/stats?payload=${encodeURIComponent(current)}&payload=${encodeURIComponent(current)}`,
    "https://example.test/api/aggregate/stats?payload=not-a-result",
    `https://example.test/api/aggregate/stats?payload=${encodeURIComponent(legacy)}`,
  ]

  for (const url of requests) {
    const response = await getAggregateStats(new Request(url))

    assert.equal(response.status, 400, url)
    assert.equal(response.headers.get("cache-control"), "no-store", url)
    assert.deepEqual(await response.json(), {
      ok: false,
      error: "A current Foundation result payload is required.",
    })
  }
})

function currentFoundationPayload() {
  return encodePayload(
    buildFoundationSharePayload(
      buildCanonicalFoundationResult(scores),
      "en",
      "fullExtended",
    ),
  )
}

function legacyFoundationPayload() {
  const result = buildCanonicalFoundationResult(scores)
  return encodePayload({
    v: 2,
    ds: dimensionScoresToArray(result.dimensionScores),
    fk: result.familyKey,
    nk: result.runnerUpKey,
    sm: result.strategyModifier,
    nm: result.normativeModifier,
  })
}
