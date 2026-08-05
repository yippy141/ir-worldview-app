import test from "node:test"
import assert from "node:assert/strict"
import {
  buildFoundationShareCardInput,
  buildFoundationShareCardUrl,
  formatShareCardRarity,
  parseFoundationShareCardRequest,
  parseShareCardParams,
} from "@/lib/share-card"
import type { AggregateStats } from "@/lib/percentiles"
import { buildCanonicalFoundationResult } from "@/lib/scoring"

test("share-card parameters preserve validated content", () => {
  const parsed = parseShareCardParams(
    new URLSearchParams({
      code: "R/S-",
      norm: "c",
      d1: "institutions",
      p1: "88",
      d2: "politicalEconomy",
      p2: "61",
      d3: "restraint",
      p3: "44",
      x: "0.25",
      y: "-0.4",
      rarity: "6.5",
      n: "1234",
    }),
  )

  assert.ok(parsed)
  assert.equal(parsed.archetype.code, "R/S-")
  assert.equal(parsed.archetype.name, "Concert–Dependencia")
  assert.equal(parsed.norm, "c")
  assert.deepStrictEqual(
    parsed.percentiles.map(({ dimension, percentile }) => [
      dimension,
      percentile,
    ]),
    [
      ["institutions", 88],
      ["politicalEconomy", 61],
      ["restraint", 44],
    ],
  )
  assert.deepStrictEqual(parsed.coordinates, { x: 0.25, y: -0.4 })
  assert.deepStrictEqual(parsed.rarity, { percentage: 6.5, n: 1234 })
})

test("rarity is independent of percentile-bar availability", () => {
  const parsed = parseShareCardParams(
    new URLSearchParams({
      code: "P+",
      norm: "o",
      x: "0",
      y: "0",
      rarity: "12",
      n: "100",
    }),
  )

  assert.ok(parsed)
  assert.deepStrictEqual(parsed.percentiles, [])
  assert.deepStrictEqual(parsed.rarity, { percentage: 12, n: 100 })
})

test("rarity is suppressed without a publishable cohort size", () => {
  const cases: Array<Record<string, string>> = [
    { rarity: "12" },
    { rarity: "12", n: "99" },
    { rarity: "12", n: "100.5" },
    { rarity: "101", n: "100" },
  ]

  for (const params of cases) {
    const parsed = parseShareCardParams(
      new URLSearchParams({
        code: "P+",
        norm: "o",
        x: "0",
        y: "0",
        ...params,
      }),
    )

    assert.ok(parsed)
    assert.equal(parsed.rarity, null)
  }
})

test("rarity presentation states the cohort share and n", () => {
  assert.equal(
    formatShareCardRarity({ percentage: 6.5, n: 1234 }),
    "Same archetype · 6.5% of this cohort (n=1,234)",
  )
})

test("Foundation card inputs derive archetype, norm, and bounded coordinates", () => {
  const result = buildCanonicalFoundationResult({
    securityCompetition: 6.2,
    institutions: 2.5,
    domesticFilters: 3,
    normsIdentity: 2.8,
    politicalEconomy: 3.4,
    restraint: 3,
    orderJustice: 4.7,
  })
  const parsed = buildFoundationShareCardInput(result, null)

  assert.equal(parsed.archetype.code, "P+")
  assert.equal(parsed.archetype.name, "Kairos")
  assert.deepStrictEqual(parsed.archetype.analogue, {
    label: "The Melian Dialogue",
    year: "416 BC",
    href: "https://en.wikipedia.org/wiki/Melian_dialogue",
  })
  assert.equal(parsed.norm, "o")
  assert.ok(parsed.coordinates.x >= -1 && parsed.coordinates.x <= 1)
  assert.ok(parsed.coordinates.y >= -1 && parsed.coordinates.y <= 1)
  assert.deepStrictEqual(parsed.percentiles, [])
  assert.equal(parsed.rarity, null)
})

test("Foundation card rarity publishes independently of percentile bars", () => {
  const result = buildCanonicalFoundationResult({
    securityCompetition: 6.2,
    institutions: 2.5,
    domesticFilters: 3,
    normsIdentity: 2.8,
    politicalEconomy: 3.4,
    restraint: 3,
    orderJustice: 4.7,
  })
  const stats: AggregateStats = {
    instrument: "foundation",
    mode: "fullExtended",
    instrumentVersion: 2,
    scoringVersion: 2,
    questionSet: "fullExtended",
    completionLocale: "en",
    localeCopyVersion: 1,
    buckets: [],
    labels: [
      {
        archetypeCode: "P+",
        normativeModifier: "Pluralist",
        count: 25,
      },
      {
        archetypeCode: "P+",
        normativeModifier: "Universalist",
        count: 15,
      },
      {
        archetypeCode: "R-",
        normativeModifier: "Conditional Solidarist",
        count: 60,
      },
    ],
  }

  const parsed = buildFoundationShareCardInput(result, stats)

  assert.deepStrictEqual(parsed.percentiles, [])
  assert.deepStrictEqual(parsed.rarity, { percentage: 40, n: 100 })
})

test("Foundation card URLs carry only the encoded result payload", () => {
  const url = new URL(buildFoundationShareCardUrl("encoded-result"))

  assert.equal(url.searchParams.get("payload"), "encoded-result")
  assert.deepEqual([...url.searchParams.keys()], ["payload"])
})

test("the image route contract rejects caller-supplied profile and population claims", () => {
  assert.equal(
    parseFoundationShareCardRequest(
      new URLSearchParams(
        "code=P%2B&norm=o&p1=100&p2=100&p3=100&rarity=0.1&n=100",
      ),
    ),
    null,
  )
  assert.equal(
    parseFoundationShareCardRequest(
      new URLSearchParams("payload=encoded-result&p1=100"),
    ),
    null,
  )
  assert.equal(
    parseFoundationShareCardRequest(
      new URLSearchParams("payload=encoded-result"),
    ),
    "encoded-result",
  )
})

test("invalid archetype, norm, or coordinates fail closed", () => {
  for (const params of [
    { code: "H+", norm: "o", x: "0", y: "0" },
    { code: "P+", norm: "x", x: "0", y: "0" },
    { code: "P+", norm: "o", x: "2", y: "0" },
  ]) {
    assert.equal(parseShareCardParams(new URLSearchParams(params)), null)
  }
})
