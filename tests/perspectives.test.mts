import test from "node:test"
import assert from "node:assert/strict"
import {
  getPerspectiveDefinition,
  PERSPECTIVE_SCENARIO_SET_VERSION,
  perspectiveCatalog,
} from "@/lib/perspectives/catalog"
import {
  buildPerspectiveResultCopy,
  buildPerspectiveRunSnapshot,
  derivePerspectiveRunBaselineScores,
  getPerspectiveShiftRows,
  perspectiveRunMatchesBaseline,
} from "@/lib/perspectives/result-helpers"
import {
  PERSPECTIVE_DIMENSIONS,
  scorePerspectiveRun,
  validatePerspectiveAnswers,
} from "@/lib/perspectives/scoring"
import {
  decodePerspectivePayload,
  encodePerspectivePayload,
  perspectiveDimensionScoresToTuple,
  resolvePerspectivePayload,
} from "@/lib/perspectives/share"
import type {
  PerspectiveAnswers,
  PerspectiveDefinition,
  PerspectiveSharePayloadV1,
} from "@/lib/perspectives/types"
import type { DimensionScores } from "@/lib/types"

const baseline: DimensionScores = {
  securityCompetition: 5.2,
  institutions: 4.6,
  domesticFilters: 3.7,
  normsIdentity: 4.3,
  politicalEconomy: 5.4,
  restraint: 3.8,
  orderJustice: 4.9,
}

function firstAnswers(perspective: PerspectiveDefinition): PerspectiveAnswers {
  return Object.fromEntries(
    perspective.scenarios.map((scenario) => [scenario.id, scenario.options[0].id]),
  )
}

function payloadFor(perspective: PerspectiveDefinition): PerspectiveSharePayloadV1 {
  return {
    v: 1,
    perspectiveId: perspective.id,
    scenarioSetVersion: perspective.scenarioSetVersion,
    baselineScores: perspectiveDimensionScoresToTuple(baseline),
    answers: firstAnswers(perspective),
  }
}

test("catalog contains the six V16 generic role packs with complete scenario context", () => {
  assert.deepEqual(
    perspectiveCatalog.map((perspective) => perspective.id),
    [
      "incumbent-great-power",
      "rising-peer-competitor",
      "exposed-ally",
      "middle-power-hedger",
      "capacity-constrained-state",
      "protection-authority",
    ],
  )

  for (const perspective of perspectiveCatalog) {
    assert.equal(perspective.scenarioSetVersion, PERSPECTIVE_SCENARIO_SET_VERSION)
    assert.equal(perspective.scenarios.length, 3)
    assert.equal(getPerspectiveDefinition(perspective.id), perspective)

    const coveredDimensions = new Set<string>()
    for (const scenario of perspective.scenarios) {
      assert.ok(scenario.actor.length > 0)
      assert.ok(scenario.objective.length > 0)
      assert.ok(scenario.constraint.length > 0)
      assert.ok(scenario.uncertainty.length > 0)
      assert.ok(scenario.task.length > 0)
      assert.ok(scenario.options.length >= 2)

      const expectedSignalKeys = Object.keys(scenario.options[0].signals).sort()
      for (const option of scenario.options) {
        assert.deepEqual(Object.keys(option.signals).sort(), expectedSignalKeys)
        for (const [dimension, signal] of Object.entries(option.signals)) {
          assert.ok(PERSPECTIVE_DIMENSIONS.includes(dimension as never))
          assert.ok(typeof signal === "number" && signal >= -3 && signal <= 3)
          assert.ok((scenario.dimensionWeights[dimension as keyof DimensionScores] ?? 0) > 0)
          coveredDimensions.add(dimension)
        }
      }
    }

    assert.deepEqual([...coveredDimensions].sort(), [...PERSPECTIVE_DIMENSIONS].sort())
  }
})

test("mirrored cases use identical dimension keys and compatible weights", () => {
  const mirrorGroups = new Map<string, typeof perspectiveCatalog[number]["scenarios"]>()

  for (const perspective of perspectiveCatalog) {
    for (const scenario of perspective.scenarios) {
      assert.ok(scenario.mirrorPairId)
      const grouped = mirrorGroups.get(scenario.mirrorPairId) ?? []
      mirrorGroups.set(scenario.mirrorPairId, [...grouped, scenario])
    }
  }

  assert.ok(mirrorGroups.size >= 3)
  for (const scenarios of mirrorGroups.values()) {
    assert.ok(scenarios.length >= 2)
    const expectedKeys = Object.keys(scenarios[0].dimensionWeights).sort()
    const expectedWeights = Object.fromEntries(
      Object.entries(scenarios[0].dimensionWeights).sort(([left], [right]) =>
        left.localeCompare(right),
      ),
    )

    for (const scenario of scenarios) {
      assert.deepEqual(Object.keys(scenario.dimensionWeights).sort(), expectedKeys)
      assert.deepEqual(
        Object.fromEntries(
          Object.entries(scenario.dimensionWeights).sort(([left], [right]) =>
            left.localeCompare(right),
          ),
        ),
        expectedWeights,
      )
      for (const option of scenario.options) {
        assert.deepEqual(Object.keys(option.signals).sort(), expectedKeys)
      }
    }
  }
})

test("Perspective scoring is pure and reports baseline-relative movement", () => {
  const perspective = perspectiveCatalog[0]
  const answers = firstAnswers(perspective)
  const baselineBefore = structuredClone(baseline)
  const answersBefore = structuredClone(answers)

  const result = scorePerspectiveRun(perspective, baseline, answers)

  assert.deepEqual(baseline, baselineBefore)
  assert.deepEqual(answers, answersBefore)
  assert.notEqual(result.baselineScores, baseline)
  assert.equal(result.perspectiveId, perspective.id)
  assert.equal(result.scenarioSetVersion, perspective.scenarioSetVersion)
  assert.equal(result.scenarioMovements.length, perspective.scenarios.length)
  assert.ok(result.largestMovement)
  assert.equal(
    result.largestMovement.movement,
    Math.max(...result.scenarioMovements.map((movement) => movement.movement)),
  )

  for (const dimension of PERSPECTIVE_DIMENSIONS) {
    assert.ok(result.dimensionScores[dimension] >= 1)
    assert.ok(result.dimensionScores[dimension] <= 7)
    assert.equal(
      result.baselineDeltas[dimension],
      Number((result.dimensionScores[dimension] - baseline[dimension]).toFixed(2)),
    )
  }

  for (let index = 1; index < result.strongestShiftKeys.length; index += 1) {
    assert.ok(
      Math.abs(result.baselineDeltas[result.strongestShiftKeys[index - 1]]) >=
        Math.abs(result.baselineDeltas[result.strongestShiftKeys[index]]),
    )
  }
})

test("flat directional signals preserve any valid Foundation baseline", () => {
  const flatPerspective: PerspectiveDefinition = {
    id: "exposed-ally",
    label: "Flat test pack",
    shortLabel: "Flat pack",
    description: "Fixture for neutral directional signals.",
    scenarioSetVersion: 99,
    scenarios: [
      {
        id: "flat-case",
        actor: "A test actor",
        objective: "Exercise the scorer.",
        constraint: "The fixture is deliberately small.",
        uncertainty: "The selected option carries zero movement.",
        task: "Choose a test response.",
        dimensionWeights: Object.fromEntries(
          PERSPECTIVE_DIMENSIONS.map((dimension) => [dimension, 1]),
        ),
        options: [
          {
            id: "flat-a",
            title: "Flat A",
            response: "Preserve every baseline score.",
            signals: Object.fromEntries(
              PERSPECTIVE_DIMENSIONS.map((dimension) => [dimension, 0]),
            ),
          },
          {
            id: "flat-b",
            title: "Flat B",
            response: "Provide a second valid response.",
            signals: Object.fromEntries(
              PERSPECTIVE_DIMENSIONS.map((dimension) => [dimension, 0]),
            ),
          },
        ],
      },
    ],
  }

  const result = scorePerspectiveRun(flatPerspective, baseline, { "flat-case": "flat-a" })

  assert.deepEqual(result.dimensionScores, baseline)
  assert.deepEqual(
    result.baselineDeltas,
    Object.fromEntries(PERSPECTIVE_DIMENSIONS.map((dimension) => [dimension, 0])),
  )
  assert.deepEqual(result.strongestShiftKeys, [])
  assert.deepEqual(result.stableDimensionKeys, PERSPECTIVE_DIMENSIONS)
  assert.equal(result.largestMovement?.movement, 0)
})

test("invalid or incomplete Perspective answers are rejected", () => {
  const perspective = perspectiveCatalog[0]
  const complete = firstAnswers(perspective)
  const partial = { ...complete }
  delete partial[perspective.scenarios[0].id]

  assert.equal(validatePerspectiveAnswers(perspective, partial), false)
  assert.equal(
    validatePerspectiveAnswers(perspective, { ...complete, extra: "unknown" }),
    false,
  )
  assert.equal(
    validatePerspectiveAnswers(perspective, {
      ...complete,
      [perspective.scenarios[0].id]: "unknown-option",
    }),
    false,
  )
  assert.throws(() => scorePerspectiveRun(perspective, baseline, partial))
})

test("Perspective v1 payloads roundtrip and resolve through the current scenario version", () => {
  for (const perspective of perspectiveCatalog) {
    const payload = payloadFor(perspective)
    const encoded = encodePerspectivePayload(payload)

    assert.ok(!encoded.includes("="))
    assert.deepEqual(decodePerspectivePayload(encoded), payload)

    const resolved = resolvePerspectivePayload(encoded, perspective.id)
    assert.ok(resolved)
    assert.equal(resolved.perspective, perspective)
    assert.deepEqual(
      resolved.result,
      scorePerspectiveRun(perspective, baseline, payload.answers),
    )
  }
})

test("malformed Perspective payloads fail safely", () => {
  const perspective = perspectiveCatalog[0]
  const valid = payloadFor(perspective)
  const scenarioId = perspective.scenarios[0].id
  const malformed = [
    "%%%bad%%%payload",
    encodeRaw({ ...valid, v: 2 }),
    encodeRaw({ ...valid, perspectiveId: "named-country-pack" }),
    encodeRaw({ ...valid, scenarioSetVersion: valid.scenarioSetVersion + 1 }),
    encodeRaw({ ...valid, baselineScores: valid.baselineScores.slice(0, 6) }),
    encodeRaw({ ...valid, baselineScores: [8, ...valid.baselineScores.slice(1)] }),
    encodeRaw({ ...valid, answers: { [scenarioId]: valid.answers[scenarioId] } }),
    encodeRaw({
      ...valid,
      answers: { ...valid.answers, [scenarioId]: "unknown-option" },
    }),
    encodeRaw({ ...valid, unexpected: true }),
  ]

  for (const encoded of malformed) {
    assert.equal(decodePerspectivePayload(encoded), null)
    assert.equal(resolvePerspectivePayload(encoded), null)
  }

  const encoded = encodePerspectivePayload(valid)
  assert.equal(resolvePerspectivePayload(encoded, "exposed-ally"), null)
  assert.throws(() => encodePerspectivePayload({ ...valid, scenarioSetVersion: 17 }))
})

test("result helpers expose comparison rows, editorial copy, and a detached snapshot", () => {
  const perspective = perspectiveCatalog[2]
  const result = scorePerspectiveRun(perspective, baseline, firstAnswers(perspective))
  const rows = getPerspectiveShiftRows(result)
  const copy = buildPerspectiveResultCopy(result)
  const snapshot = buildPerspectiveRunSnapshot(result, {
    id: "run-demo",
    timestamp: 1_786_000_000_000,
    resultPath: "/perspectives/exposed-ally/result/demo",
    payload: "demo",
    locale: "en",
    localeCopyVersion: 1,
  })

  assert.equal(rows.length, PERSPECTIVE_DIMENSIONS.length)
  assert.ok(copy.headline.length > 0)
  assert.ok(copy.summary.length > 0)
  assert.ok(copy.stableThread.length > 0)
  assert.ok(copy.largestMovement.length > 0)
  assert.deepEqual(snapshot, {
    id: "run-demo",
    timestamp: 1_786_000_000_000,
    perspectiveId: perspective.id,
    perspectiveLabel: perspective.label,
    scenarioSetVersion: perspective.scenarioSetVersion,
    dimensionScores: result.dimensionScores,
    baselineDeltas: result.baselineDeltas,
    strongestShiftKeys: result.strongestShiftKeys,
    resultPath: "/perspectives/exposed-ally/result/demo",
    payload: "demo",
    locale: "en",
    localeCopyVersion: 1,
  })

  snapshot.dimensionScores.securityCompetition = 1
  snapshot.strongestShiftKeys.length = 0
  assert.notEqual(result.dimensionScores.securityCompetition, 1)
  assert.ok(result.strongestShiftKeys.length > 0)
})

test("saved Perspective runs retain and match only their original Foundation baseline", () => {
  const perspective = perspectiveCatalog[1]
  const result = scorePerspectiveRun(perspective, baseline, firstAnswers(perspective))
  const snapshot = buildPerspectiveRunSnapshot(result, {
    id: "run-baseline-contract",
    timestamp: 1_786_000_000_000,
    resultPath: "/perspectives/rising-peer-competitor/result/demo",
    payload: "demo",
    locale: "en",
    localeCopyVersion: 1,
  })

  assert.deepEqual(derivePerspectiveRunBaselineScores(snapshot), baseline)
  assert.equal(perspectiveRunMatchesBaseline(snapshot, baseline), true)
  assert.equal(
    perspectiveRunMatchesBaseline(snapshot, {
      ...baseline,
      institutions: baseline.institutions + 0.02,
    }),
    false,
  )

  const incompleteSnapshot = structuredClone(snapshot)
  delete incompleteSnapshot.baselineDeltas.restraint
  assert.equal(derivePerspectiveRunBaselineScores(incompleteSnapshot), null)
  assert.equal(perspectiveRunMatchesBaseline(incompleteSnapshot, baseline), false)
})

function encodeRaw(value: unknown) {
  return btoa(JSON.stringify(value))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "")
}
