import assert from "node:assert/strict"
import { test } from "node:test"

import { getArchetypeMark } from "@/lib/archetype-marks"
import { archetypes, type BlendArchetype } from "@/lib/archetypes"
import {
  ARCHETYPE_MATRIX_CELLS,
  ARCHETYPE_MATRIX_LENSES,
  activeMatrixCodes,
  resolveWorldviewMapBaseline,
} from "@/lib/field/archetype-matrix"
import type { FoundationSnapshot } from "@/lib/profile-store"
import { buildCanonicalFoundationResult } from "@/lib/scoring"
import {
  buildFoundationSharePayload,
  encodePayload,
  resolveFoundationPayload,
} from "@/lib/share"
import type {
  DimensionScores,
  FoundationQuestionSet,
} from "@/lib/types"

const FROZEN_V2_FOUNDATION_PAYLOAD =
  "eyJ2IjoyLCJkcyI6WzYuMjUsMi41LDQsMy43NSw1LjUsNC4yNSwyLjc1XSwiZmsiOiJyZWFsaXN0IiwibmsiOiJpbnN0aXR1dGlvbmFsaXN0Iiwic20iOiJIZWRnZXIiLCJubSI6IkNvbmRpdGlvbmFsIFNvbGlkYXJpc3QifQ"

const CACHED_SCORES: DimensionScores = {
  securityCompetition: 1,
  institutions: 7,
  domesticFilters: 7,
  normsIdentity: 7,
  politicalEconomy: 7,
  restraint: 1,
  orderJustice: 7,
}

function snapshotWithPayload(
  payload: string,
  overrides: Partial<FoundationSnapshot> = {},
): FoundationSnapshot {
  return {
    timestamp: 1,
    payload,
    instrumentStructuralVersion: 99,
    scoringVersion: 99,
    resultPath: `/results/${payload}`,
    familyKey: "criticalPoliticalEconomy",
    familyLabel: "Conflicting cached family",
    runnerUpKey: "constructivist",
    runnerUpLabel: "Conflicting cached runner-up",
    summary: "Conflicting cached summary",
    dimensionScores: CACHED_SCORES,
    strategyModifier: "Maximizer",
    normativeModifier: "Universalist",
    keyDrivers: [],
    strongLenses: [],
    locale: "en",
    localeCopyVersion: 99,
    ...overrides,
  }
}

function currentSnapshot(
  dimensionScores: DimensionScores,
  questionSet: FoundationQuestionSet = "fullExtended",
): FoundationSnapshot {
  const calibration = questionSet === "core" ? "core" : "extended"
  const result = buildCanonicalFoundationResult(dimensionScores, calibration)
  const payload = encodePayload(
    buildFoundationSharePayload(result, "en", questionSet),
  )
  return snapshotWithPayload(payload)
}

test("the matrix is the exact canonical lens-major 4 by 2 reference structure", () => {
  assert.deepEqual(
    ARCHETYPE_MATRIX_LENSES.map(({ lens, label }) => [lens, label]),
    [
      ["P", "Power"],
      ["R", "Rules"],
      ["M", "Meaning"],
      ["S", "Structure"],
    ],
  )
  assert.deepEqual(
    ARCHETYPE_MATRIX_CELLS.map(({ archetypeCode }) => archetypeCode),
    ["P+", "P-", "R+", "R-", "M+", "M-", "S+", "S-"],
  )
  assert.deepEqual(
    ARCHETYPE_MATRIX_CELLS.map(({ postureLabel }) => postureLabel),
    [
      "Applying advantage",
      "Restraint",
      "Applying advantage",
      "Restraint",
      "Applying advantage",
      "Restraint",
      "Applying advantage",
      "Restraint",
    ],
  )
  assert.equal(ARCHETYPE_MATRIX_CELLS.length, 8)
  assert.equal(
    new Set(ARCHETYPE_MATRIX_CELLS.map(({ archetype }) => archetype.name)).size,
    8,
  )

  for (const cell of ARCHETYPE_MATRIX_CELLS) {
    assert.equal(
      cell.archetype,
      archetypes.find(({ code }) => code === cell.archetypeCode),
    )
    assert.ok(getArchetypeMark(cell.archetypeCode))
  }
})

test("a pure legacy result resolves one cell and ignores conflicting snapshot fields", () => {
  const baseline = resolveWorldviewMapBaseline(
    snapshotWithPayload(FROZEN_V2_FOUNDATION_PAYLOAD),
  )

  assert.ok(baseline)
  assert.equal(baseline.source, "exact-foundation-payload")
  assert.equal(baseline.payloadVersion, 2)
  assert.equal(baseline.scoringCalibration, "extended")
  assert.equal(baseline.resolvedArchetype.code, "P-")
  assert.deepEqual(baseline.activeCellCodes, ["P-"])
  assert.deepEqual(activeMatrixCodes(baseline.resolvedArchetype), ["P-"])
  assert.equal(baseline.leadingPureCode, "P-")
  assert.equal(baseline.normativeState.persistedState, "Conditional Solidarist")
  assert.equal(baseline.normativeState.suffix, "c")
  assert.equal(baseline.normativeState.publicLabel, "Conditional")
  assert.notDeepEqual(baseline.dimensionScores, CACHED_SCORES)
})

test("a blend activates two canonical same-row cells and exposes only a presentation lead", () => {
  const snapshot = currentSnapshot(
    {
      securityCompetition: 1,
      institutions: 1,
      domesticFilters: 4,
      normsIdentity: 4,
      politicalEconomy: 4,
      restraint: 4,
      orderJustice: 4,
    },
    "core",
  )
  const baseline = resolveWorldviewMapBaseline(snapshot)
  const payload = resolveFoundationPayload(snapshot.payload)

  assert.ok(baseline && payload)
  assert.equal(baseline.resolvedArchetype.code, "M/S+")
  assert.ok("archetypes" in baseline.resolvedArchetype)
  assert.deepEqual(baseline.activeCellCodes, ["M+", "S+"])
  assert.equal(
    new Set(baseline.activeCellCodes.map((code) => code.at(-1))).size,
    1,
  )
  assert.ok(baseline.activeCellCodes.includes(baseline.leadingPureCode))
  assert.equal(
    baseline.resolvedArchetype.archetypes.find(
      ({ code }) => code === baseline.leadingPureCode,
    )?.familyKey,
    payload.result.familyKey,
  )

  const [plusPower, minusRules] = [
    archetypes.find(({ code }) => code === "P+"),
    archetypes.find(({ code }) => code === "R-"),
  ]
  assert.ok(plusPower && minusRules)
  const malformed = {
    ...baseline.resolvedArchetype,
    posture: "+",
    archetypes: [plusPower, minusRules],
  } as BlendArchetype
  assert.throws(
    () => activeMatrixCodes(malformed),
    /does not occupy one matrix row/u,
  )
})

test("an invalid payload fails closed instead of selecting from cached fields", () => {
  assert.equal(
    resolveWorldviewMapBaseline(snapshotWithPayload("not-a-foundation-payload")),
    null,
  )
  assert.equal(resolveWorldviewMapBaseline(null), null)
  assert.deepEqual(activeMatrixCodes(null), [])
})

test("continuous projection v1 is posture-blind while the matrix changes row", () => {
  const sharedShape = {
    securityCompetition: 6.8,
    institutions: 2.1,
    domesticFilters: 3.1,
    normsIdentity: 2.5,
    politicalEconomy: 3.3,
    orderJustice: 4.8,
  }
  const advantage = resolveWorldviewMapBaseline(
    currentSnapshot({ ...sharedShape, restraint: 2 }),
  )
  const restraint = resolveWorldviewMapBaseline(
    currentSnapshot({ ...sharedShape, restraint: 6 }),
  )

  assert.ok(advantage && restraint)
  assert.deepEqual(advantage.activeCellCodes, ["P+"])
  assert.deepEqual(restraint.activeCellCodes, ["P-"])
  assert.equal(advantage.continuousProjection.version, 1)
  assert.equal(
    advantage.continuousProjection.limitation,
    "posture-not-represented",
  )
  assert.deepEqual(
    {
      x: advantage.continuousProjection.x,
      y: advantage.continuousProjection.y,
    },
    {
      x: restraint.continuousProjection.x,
      y: restraint.continuousProjection.y,
    },
  )
})
