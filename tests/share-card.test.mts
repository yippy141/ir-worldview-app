import test from "node:test"
import assert from "node:assert/strict"
import {
  buildFoundationShareCardUrl,
  parseShareCardParams,
} from "@/lib/share-card"
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
  assert.equal(parsed.rarityPercentage, 6.5)
})

test("missing percentile data omits both bars and rarity", () => {
  const parsed = parseShareCardParams(
    new URLSearchParams({
      code: "P+",
      norm: "o",
      x: "0",
      y: "0",
      rarity: "12",
    }),
  )

  assert.ok(parsed)
  assert.deepStrictEqual(parsed.percentiles, [])
  assert.equal(parsed.rarityPercentage, null)
})

test("Foundation card URLs derive archetype, norm, and bounded coordinates", () => {
  const result = buildCanonicalFoundationResult({
    securityCompetition: 6.2,
    institutions: 2.5,
    domesticFilters: 3,
    normsIdentity: 2.8,
    politicalEconomy: 3.4,
    restraint: 3,
    orderJustice: 4.7,
  })
  const url = new URL(buildFoundationShareCardUrl(result, null))
  const parsed = parseShareCardParams(url.searchParams)

  assert.ok(parsed)
  assert.equal(parsed.archetype.code, "P+")
  assert.equal(parsed.norm, "o")
  assert.ok(parsed.coordinates.x >= -1 && parsed.coordinates.x <= 1)
  assert.ok(parsed.coordinates.y >= -1 && parsed.coordinates.y <= 1)
  assert.deepStrictEqual(parsed.percentiles, [])
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
