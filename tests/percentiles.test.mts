import test from "node:test"
import assert from "node:assert/strict"
import {
  getAggregateCohortSize,
  getProfileRarity,
  hasPublishableAggregateCohort,
  getPercentile,
  MIN_PERCENTILE_SAMPLE_SIZE,
  type AggregateStats,
} from "@/lib/percentiles"

function stats(
  buckets: AggregateStats["buckets"],
): AggregateStats {
  return {
    instrument: "foundation",
    mode: "fullExtended",
    instrumentVersion: 2,
    scoringVersion: 2,
    questionSet: "fullExtended",
    completionLocale: "en",
    localeCopyVersion: 1,
    buckets,
    labels: [],
  }
}

test("exact aggregate cohorts remain unpublished below 100 results", () => {
  assert.equal(
    hasPublishableAggregateCohort([
      {
        archetypeCode: "P+",
        normativeModifier: "Pluralist",
        count: MIN_PERCENTILE_SAMPLE_SIZE - 1,
      },
    ]),
    false,
  )
  assert.equal(
    hasPublishableAggregateCohort([
      {
        archetypeCode: "P+",
        normativeModifier: "Pluralist",
        count: MIN_PERCENTILE_SAMPLE_SIZE,
      },
    ]),
    true,
  )
})

test("percentiles stay unavailable below 100 observations per dimension", () => {
  const result = getPercentile(
    "foundation",
    "fullExtended",
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
    "foundation",
    "fullExtended",
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
    "foundation",
    "fullExtended",
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

  assert.equal(
    getPercentile(
      "foundation",
      "fullExtended",
      "politicalEconomy",
      Number.NaN,
      distribution,
    ),
    null,
  )
  assert.equal(
    getPercentile(
      "foundation",
      "fullExtended",
      "politicalEconomy",
      Number.POSITIVE_INFINITY,
      distribution,
    ),
    null,
  )
  assert.equal(
    getPercentile(
      "foundation",
      "fullExtended",
      "politicalEconomy",
      0.9,
      distribution,
    ),
    null,
  )
  assert.equal(
    getPercentile(
      "foundation",
      "fullExtended",
      "politicalEconomy",
      8,
      distribution,
    ),
    null,
  )
})

test("percentiles reject instrument and mode tuple mismatches", () => {
  const distribution = stats([
    { dimension: "institutions", bucket: 4, count: 100 },
  ])

  assert.equal(
    getPercentile(
      "foundation",
      "core",
      "institutions",
      4,
      distribution,
    ),
    null,
  )
  assert.equal(
    getPercentile(
      "security",
      "standard",
      "activism",
      4,
      distribution,
    ),
    null,
  )
})

test("missing ties and all-tied distributions have defined midranks", () => {
  const missingTie = stats([
    { dimension: "restraint", bucket: 3.9, count: 25 },
    { dimension: "restraint", bucket: 4.1, count: 75 },
  ])
  const allTied = stats([
    { dimension: "restraint", bucket: 4, count: 100 },
  ])

  assert.deepEqual(
    getPercentile(
      "foundation",
      "fullExtended",
      "restraint",
      4,
      missingTie,
    ),
    { percentile: 25, n: 100 },
  )
  assert.deepEqual(
    getPercentile(
      "foundation",
      "fullExtended",
      "restraint",
      4,
      allTied,
    ),
    { percentile: 50, n: 100 },
  )
})

test("percentile boundaries may resolve to zero or one hundred", () => {
  const distribution = stats([
    { dimension: "orderJustice", bucket: 2, count: 100 },
  ])

  assert.deepEqual(
    getPercentile(
      "foundation",
      "fullExtended",
      "orderJustice",
      1,
      distribution,
    ),
    { percentile: 0, n: 100 },
  )
  assert.deepEqual(
    getPercentile(
      "foundation",
      "fullExtended",
      "orderJustice",
      7,
      distribution,
    ),
    { percentile: 100, n: 100 },
  )
})

test("unsafe aggregate totals do not produce percentile language", () => {
  const distribution = stats([
    {
      dimension: "securityCompetition",
      bucket: 3,
      count: Number.MAX_SAFE_INTEGER,
    },
    {
      dimension: "securityCompetition",
      bucket: 4,
      count: 1,
    },
  ])

  assert.equal(
    getPercentile(
      "foundation",
      "fullExtended",
      "securityCompetition",
      4,
      distribution,
    ),
    null,
  )
})

test("archetype rarity combines normative variants and reports cohort n", () => {
  const distribution = stats([])
  distribution.labels = [
    {
      archetypeCode: "P+",
      normativeModifier: "Pluralist",
      count: 10,
    },
    {
      archetypeCode: "P+",
      normativeModifier: "Conditional Solidarist",
      count: 15,
    },
    {
      archetypeCode: "P+",
      normativeModifier: "Universalist",
      count: 5,
    },
    {
      archetypeCode: "R-",
      normativeModifier: "Pluralist",
      count: 70,
    },
  ]

  assert.deepEqual(getProfileRarity("P+", distribution), {
    percentage: 30,
    n: 100,
  })
  assert.deepEqual(getProfileRarity("M+", distribution), {
    percentage: 0,
    n: 100,
  })
})

test("archetype rarity remains suppressed below 100 and on malformed totals", () => {
  const belowThreshold = stats([])
  belowThreshold.labels = [
    {
      archetypeCode: "P+",
      normativeModifier: "Pluralist",
      count: 99,
    },
  ]
  const negativeCount = stats([])
  negativeCount.labels = [
    {
      archetypeCode: "P+",
      normativeModifier: "Pluralist",
      count: 101,
    },
    {
      archetypeCode: "R-",
      normativeModifier: "Universalist",
      count: -1,
    },
  ]
  const unsafeTotal = stats([])
  unsafeTotal.labels = [
    {
      archetypeCode: "P+",
      normativeModifier: "Pluralist",
      count: Number.MAX_SAFE_INTEGER,
    },
    {
      archetypeCode: "R-",
      normativeModifier: "Universalist",
      count: 1,
    },
  ]

  assert.equal(getProfileRarity("P+", belowThreshold), null)
  assert.equal(getProfileRarity("P+", negativeCount), null)
  assert.equal(getProfileRarity("P+", unsafeTotal), null)
  assert.equal(getAggregateCohortSize(negativeCount.labels), null)
  assert.equal(getAggregateCohortSize(unsafeTotal.labels), null)
})
