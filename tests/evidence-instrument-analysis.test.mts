import test from "node:test"
import assert from "node:assert/strict"
import securityBank from "@/content/instrument/security.v3.json" with {
  type: "json",
}
import { evaluateDeclaredAxis } from "@/lib/instrument/measurement-gates"
// Node's strip-types runtime requires the explicit .mts extension.
// @ts-expect-error TypeScript's bundler resolver disallows that runtime form.
import { analyzeDeclaredAxisOptionGeometry, analyzeInstrumentDescriptor, EVIDENCE_BANK_SPECS, findDuplicateCompleteOptionVectors } from "@/scripts/evidence-instrument-analysis.mts"

type SyntheticOption = {
  id: string
  signals: Record<string, number>
}

test("synthetic negative control: midpoint/range gate catches identical declared-axis signals", () => {
  const options: SyntheticOption[] = [
    { id: "a", signals: { declared: 3 } },
    { id: "b", signals: { declared: 3 } },
    { id: "c", signals: { declared: 3 } },
  ]
  const geometry = analyzeDeclaredAxisOptionGeometry(
    options,
    "declared",
    4,
  )
  const gate = evaluateDeclaredAxis(geometry.signalValues, 4, 2)

  assert.equal(gate.passes, false)
  assert.equal(gate.straddles, false)
  assert.equal(gate.meetsMinimumSpread, false)
  assert.equal(geometry.distinctSignalValueCount, 1)
  assert.equal(geometry.duplicateSignalValueCount, 2)
})

test("synthetic negative control: midpoint/range gate catches a declared axis missing from every option", () => {
  const options: SyntheticOption[] = [
    { id: "a", signals: { other: -10 } },
    { id: "b", signals: { other: 10 } },
  ]
  const geometry = analyzeDeclaredAxisOptionGeometry(
    options,
    "declared",
    4,
  )
  const gate = evaluateDeclaredAxis(geometry.signalValues, 4, 2)

  assert.equal(gate.passes, false)
  assert.equal(geometry.missingSignalCount, 2)
  assert.deepEqual(geometry.signalValues, [4, 4])
})

test("synthetic negative control: midpoint/range gate deliberately does not reject duplicate complete option vectors", () => {
  const options: SyntheticOption[] = [
    { id: "a", signals: { declared: 2, other: 3 } },
    { id: "b", signals: { declared: 6, other: 5 } },
    { id: "c", signals: { declared: 6, other: 5 } },
  ]
  const geometry = analyzeDeclaredAxisOptionGeometry(
    options,
    "declared",
    4,
  )
  const gate = evaluateDeclaredAxis(geometry.signalValues, 4, 2)

  assert.equal(gate.passes, true)
  assert.deepEqual(
    findDuplicateCompleteOptionVectors(
      options,
      ["declared", "other"],
      4,
    ),
    [
      {
        optionIds: ["b", "c"],
        signals: { declared: 6, other: 5 },
      },
    ],
  )
})

test("synthetic negative control: midpoint/range gate deliberately does not impose a near-duplicate tolerance", () => {
  const options: SyntheticOption[] = [
    { id: "a", signals: { declared: 2 } },
    { id: "b", signals: { declared: 6 } },
    { id: "c", signals: { declared: 6.0000001 } },
  ]
  const geometry = analyzeDeclaredAxisOptionGeometry(
    options,
    "declared",
    4,
  )
  const gate = evaluateDeclaredAxis(geometry.signalValues, 4, 2)

  assert.equal(gate.passes, true)
  assert.equal(geometry.distinctSignalValueCount, 3)
  assert.equal(geometry.duplicateSignalValueCount, 0)
  assert.deepEqual(
    findDuplicateCompleteOptionVectors(options, ["declared"], 4),
    [],
  )
})

test("synthetic negative control: midpoint/range gate deliberately ignores substantial signals on an undeclared axis", () => {
  const options: SyntheticOption[] = [
    { id: "a", signals: { declared: 2, undeclared: -100 } },
    { id: "b", signals: { declared: 6, undeclared: 100 } },
  ]
  const geometry = analyzeDeclaredAxisOptionGeometry(
    options,
    "declared",
    4,
  )

  assert.equal(
    evaluateDeclaredAxis(geometry.signalValues, 4, 2).passes,
    true,
  )
  assert.deepEqual(geometry.signalValues, [2, 6])
})

test("synthetic negative control: midpoint/range gate deliberately permits discrimination carried primarily by one option", () => {
  const options: SyntheticOption[] = [
    { id: "a", signals: { declared: 1.9 } },
    { id: "b", signals: { declared: 4.1 } },
    { id: "c", signals: { declared: 4.1 } },
    { id: "d", signals: { declared: 4.1 } },
  ]
  const geometry = analyzeDeclaredAxisOptionGeometry(
    options,
    "declared",
    4,
  )

  assert.equal(
    evaluateDeclaredAxis(geometry.signalValues, 4, 2).passes,
    true,
  )
  assert.equal(geometry.soleMinimum, true)
  assert.equal(geometry.soleMaximum, false)
  assert.equal(geometry.duplicateSignalValueCount, 2)
})

test("synthetic aggregation control: one failed declared axis places a multi-axis item in the item failure list", () => {
  const mutatedBank = structuredClone(securityBank) as unknown as {
    items: Array<{
      id: string
      discriminatingAxes: string[]
      options: Array<{ signals: Record<string, number> }>
    }>
  }
  const target = mutatedBank.items.find(
    (item) => item.id === "taiwan_quarantine",
  )
  assert.ok(target)
  assert.ok(target.discriminatingAxes.length > 1)
  const failedAxis = target.discriminatingAxes[0]
  for (const option of target.options) {
    option.signals[failedAxis] = 4
  }

  const spec = EVIDENCE_BANK_SPECS.find(
    (candidate) => candidate.key === "security-bank-v3",
  )
  assert.ok(spec)
  const analysis = analyzeInstrumentDescriptor({
    ...spec,
    bank: mutatedBank as unknown as Record<string, unknown>,
  })
  const item = analysis.axisSeparation.items.find(
    (candidate) => candidate.itemId === target.id,
  )
  assert.ok(item)

  assert.equal(item.allDeclaredAxesPassMidpointRangeGate, false)
  assert.ok(
    item.optionSets.flatMap((set) => set.axes).some(
      (axis) =>
        axis.axis === failedAxis &&
        axis.passesMidpointRangeGate === false,
    ),
  )
  assert.ok(
    item.optionSets.flatMap((set) => set.axes).some(
      (axis) => axis.passesMidpointRangeGate === true,
    ),
    "control requires at least one other declared axis to keep passing",
  )
  assert.ok(
    analysis.axisSeparation.itemsFailingMidpointRangeGate.includes(
      target.id,
    ),
  )
})
