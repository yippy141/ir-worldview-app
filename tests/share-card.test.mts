import test from "node:test"
import assert from "node:assert/strict"
import {
  buildFoundationShareCardInput,
  buildFoundationShareCardUrl,
  parseFoundationShareCardRequest,
} from "@/lib/share-card"
import { buildCanonicalFoundationResult } from "@/lib/scoring"

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
  const parsed = buildFoundationShareCardInput(result)

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
  assert.deepStrictEqual(Object.keys(parsed).sort(), [
    "archetype",
    "coordinates",
    "norm",
  ])
  assert.equal("percentiles" in parsed, false)
  assert.equal("rarity" in parsed, false)
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
