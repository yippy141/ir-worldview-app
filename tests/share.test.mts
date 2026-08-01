import test from "node:test"
import assert from "node:assert/strict"
import {
  buildFoundationSharePayload,
  decodePayload,
  encodePayload,
  resolveFoundationPayload,
} from "@/lib/share"
import { getClosestTraditions } from "@/lib/result-helpers"
import {
  buildCanonicalFoundationResult,
  getV2ScoringCalibration,
} from "@/lib/scoring"
import type { SharePayload } from "@/lib/types"

const payloads: SharePayload[] = [
  {
    v: 2,
    ds: [6.25, 2.5, 4, 3.75, 5.5, 4.25, 2.75],
    fk: "realist",
    nk: "institutionalist",
    sm: "Hedger",
    nm: "Conditional Solidarist",
  },
  {
    v: 2,
    ds: [3, 5.5, 4.75, 6, 2.5, 5.75, 4.5],
    fk: "constructivist",
    nk: "criticalPoliticalEconomy",
    sm: "Restrainer",
    nm: "Pluralist",
  },
  {
    v: 3,
    ds: [4.3, 5.8, 4.9, 5.1, 4.7, 5.4, 5.3],
    fk: "institutionalist",
    nk: "constructivist",
    sm: "Restrainer",
    nm: "Pluralist",
    iv: 3,
    sv: 1,
    cv: 1,
    cl: "zh-Hans",
  },
  {
    v: 4,
    ds: [5.2, 4.8, 4.1, 3.9, 5.4, 4.6, 4.2],
    fk: "realist",
    nk: "criticalPoliticalEconomy",
    sm: "Maximizer",
    nm: "Conditional Solidarist",
    iv: 4,
    sv: 2,
    cv: 1,
    cl: "en",
    rt: "core",
  },
]

// Captured before V16. Keeping this literal prevents a changed encoder and
// decoder from making the same incompatible mistake while tests still pass.
const PRE_V16_FOUNDATION_SHARE =
  "eyJ2IjoyLCJkcyI6WzYuMjUsMi41LDQsMy43NSw1LjUsNC4yNSwyLjc1XSwiZmsiOiJyZWFsaXN0IiwibmsiOiJpbnN0aXR1dGlvbmFsaXN0Iiwic20iOiJIZWRnZXIiLCJubSI6IkNvbmRpdGlvbmFsIFNvbGlkYXJpc3QifQ"

test("a frozen pre-V16 Foundation share still decodes", () => {
  assert.deepEqual(decodePayload(PRE_V16_FOUNDATION_SHARE), payloads[0])
})

test("legacy Foundation clarity and unknown fields are ignored during decoding", () => {
  const encoded = encodeRawPayload({
    ...payloads[0],
    clarity: 84,
    unknownLegacyField: "ignored",
  })

  assert.deepEqual(decodePayload(encoded), payloads[0])
})

test("share payloads roundtrip through URL-safe base64 encoding", () => {
  const encodedPayloads = payloads.map((payload) => ({
    payload,
    encoded: encodePayload(payload),
  }))

  assert.ok(
    encodedPayloads.some(({ encoded }) => encoded.length % 4 !== 0),
    "expected at least one encoded payload to exercise padding restoration",
  )

  for (const { payload, encoded } of encodedPayloads) {
    assert.ok(!encoded.includes("="), "encoded payload should strip trailing padding")
    assert.deepEqual(decodePayload(encoded), payload)
  }
})

test("canonical Foundation V3 records structural, scoring, copy, and completion-locale provenance", () => {
  const encoded = encodePayload(payloads[2])
  const resolved = resolveFoundationPayload(encoded)

  assert.ok(resolved)
  assert.deepEqual(resolved.provenance, {
    instrumentStructuralVersion: 3,
    instrumentVersion: 0,
    scoringVersion: 1,
    localeCopyVersion: 1,
    completionLocale: "zh-Hans",
    resultTier: "extended",
    questionSet: null,
  })
  assert.equal(Object.values(resolved.payload).some((value) => /[㐀-鿿]/u.test(String(value))), false)
})

test("Foundation payload generation changes provenance by locale without changing canonical results", () => {
  const result = buildCanonicalFoundationResult({
    securityCompetition: 4.3,
    institutions: 5.8,
    domesticFilters: 4.9,
    normsIdentity: 5.1,
    politicalEconomy: 4.7,
    restraint: 5.4,
    orderJustice: 5.3,
  })
  const english = buildFoundationSharePayload(result, "en", "core")
  const chinese = buildFoundationSharePayload(result, "zh-Hans", "core")

  assert.deepEqual(
    { ...chinese, cl: english.cl, cv: english.cv },
    english,
  )
  assert.equal(english.cl, "en")
  assert.equal(chinese.cl, "zh-Hans")
  assert.equal(english.v, 5)
  assert.equal(english.iv, 4)
  assert.equal(chinese.sv, 2)
  assert.equal(english.qs, "core")
})

test("V5 records the exact targeted item form", () => {
  const result = buildCanonicalFoundationResult({
    securityCompetition: 4.3,
    institutions: 5.8,
    domesticFilters: 4.9,
    normsIdentity: 5.1,
    politicalEconomy: 4.7,
    restraint: 5.4,
    orderJustice: 5.3,
  })
  const payload = buildFoundationSharePayload(
    result,
    "en",
    "targetedExtended",
    ["institutionalist", "realist"],
  )
  const resolved = resolveFoundationPayload(encodePayload(payload))

  assert.equal(payload.qs, "targetedExtended")
  assert.deepEqual(payload.tp, ["realist", "institutionalist"])
  assert.ok(resolved)
  assert.equal(resolved.questionSet, "targetedExtended")
  assert.deepEqual(resolved.targetedFamilyPair, [
    "realist",
    "institutionalist",
  ])
})

test("legacy links preserve their encoded identity while keeping decoded scores", () => {
  const resolved = resolveFoundationPayload(PRE_V16_FOUNDATION_SHARE)

  assert.ok(resolved)
  assert.equal(resolved.result.familyKey, "realist")
  assert.equal(resolved.result.runnerUpKey, "institutionalist")
  assert.equal(resolved.result.strategyModifier, "Hedger")
  assert.equal(resolved.result.normativeModifier, "Conditional Solidarist")

  const closest = getClosestTraditions(resolved.result.familyScores, {
    familyKey: resolved.result.familyKey,
    runnerUpKey: resolved.result.runnerUpKey,
    nearestFitGap: resolved.result.nearestFitGap,
    lowDifferentiationThreshold:
      getV2ScoringCalibration(resolved.scoringCalibration)
        .lowDifferentiationThreshold,
  })
  assert.equal(closest.primary.key, "realist")
  assert.equal(closest.secondary.key, "institutionalist")
})

test("malformed payloads fail safely instead of decoding to a fabricated result", () => {
  const currentV5 = buildFoundationSharePayload(
    buildCanonicalFoundationResult({
      securityCompetition: 4,
      institutions: 4,
      domesticFilters: 4,
      normsIdentity: 4,
      politicalEconomy: 4,
      restraint: 4,
      orderJustice: 4,
    }),
    "en",
    "targetedExtended",
    ["realist", "institutionalist"],
  )
  const malformedPayloads = [
    "%%%bad%%%payload",
    encodeRawPayload({
      ...payloads[0],
      ds: [6.25, 2.5, 4, 3.75, 5.5, 4.25],
    }),
    encodeRawPayload({
      ...payloads[0],
      ds: [8, 2.5, 4, 3.75, 5.5, 4.25, 2.75],
    }),
    encodeRawPayload({
      ...payloads[0],
      fk: "bogus",
    }),
    encodeRawPayload({
      ...payloads[0],
      sm: "Balancer",
    }),
    encodeRawPayload({
      ...payloads[2],
      sv: 0,
    }),
    encodeRawPayload({
      ...payloads[2],
      cl: "zh",
    }),
    encodeRawPayload({
      ...payloads[3],
      rt: "provisional",
    }),
    encodeRawPayload({
      ...currentV5,
      tp: undefined,
    }),
    encodeRawPayload({ ...currentV5, iv: 99 }),
    encodeRawPayload({ ...currentV5, bv: 99 }),
    encodeRawPayload({ ...currentV5, sv: 99 }),
  ]

  for (const payload of malformedPayloads) {
    assert.equal(decodePayload(payload), null)
  }
})

function encodeRawPayload(payload: unknown) {
  return btoa(JSON.stringify(payload)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}
