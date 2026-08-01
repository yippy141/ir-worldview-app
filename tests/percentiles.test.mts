import test from "node:test"
import assert from "node:assert/strict"
import {
  getPercentile,
  MIN_PERCENTILE_SAMPLE_SIZE,
  type AggregateStats,
} from "@/lib/percentiles"

function stats(
  buckets: AggregateStats["buckets"],
): AggregateStats {
  return {
    instrumentVersion: 2,
    scoringVersion: 2,
    buckets,
  }
}

test("percentiles stay unavailable below 100 observations per dimension", () => {
  const result = getPercentile(
    "institutions",
    4,
    stats([
      {
        dimension: "institutions",
        bucket: 4,
        count: MIN_PERCENTILE_SAMPLE_SIZE - 1,
      },
      {
        dimension: "restraint",
        bucket: 4,
        count: 500,
      },
    ]),
  )

  assert.equal(result, null)
})

test("percentiles use the midrank of the score's one-decimal bucket", () => {
  const result = getPercentile(
    "institutions",
    4.04,
    stats([
      { dimension: "institutions", bucket: 3, count: 20 },
      { dimension: "institutions", bucket: 4, count: 30 },
      { dimension: "institutions", bucket: 5, count: 50 },
      { dimension: "restraint", bucket: 3, count: 900 },
    ]),
  )

  assert.deepEqual(result, {
    percentile: 35,
    n: 100,
  })
})

test("percentile n and rank use only valid buckets for the requested dimension", () => {
  const result = getPercentile(
    "normsIdentity",
    5.21,
    stats([
      { dimension: "normsIdentity", bucket: 4.8, count: 80 },
      { dimension: "normsIdentity", bucket: 5.2, count: 40 },
      { dimension: "normsIdentity", bucket: 8, count: 1_000 },
      { dimension: "normsIdentity", bucket: 5.3, count: -1 },
    ]),
  )

  assert.deepEqual(result, {
    percentile: 83,
    n: 120,
  })
})

test("invalid scores do not produce percentile language", () => {
  const distribution = stats([
    { dimension: "politicalEconomy", bucket: 4, count: 100 },
  ])

  assert.equal(getPercentile("politicalEconomy", Number.NaN, distribution), null)
  assert.equal(getPercentile("politicalEconomy", 8, distribution), null)
})
