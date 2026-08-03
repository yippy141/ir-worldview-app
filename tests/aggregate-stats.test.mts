import test from "node:test"
import assert from "node:assert/strict"
import {
  db,
  type DatabaseClient,
} from "@/lib/db"
import { readCurrentAggregateStats } from "@/lib/research/aggregate-stats"
import { buildTier1Cohort } from "@/lib/research/tier1-aggregate"

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
