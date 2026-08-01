import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import {
  foundationCoreQuestions,
  foundationExtendedQuestions,
  getFoundationDiscriminatorIds,
  getFoundationQuestionsForSet,
} from "@/lib/quiz-schema"
import { NEUTRAL_BASELINE } from "@/lib/scoring-calibration"
import { familyProfiles } from "@/lib/scoring"
import type { DimensionKey, FamilyKey } from "@/lib/types"

type FoundationBank = {
  items: Array<{
    id: string
    kind: string
    tier: "core" | "extended"
    scoringBlock: "core" | "validation"
    dimension?: DimensionKey
    reverse?: boolean
    options?: Array<{
      signals: Partial<Record<DimensionKey, number>>
    }>
  }>
  discriminators: Record<string, string[]>
}

const bank = JSON.parse(
  await readFile(
    new URL("../content/instrument/foundation.v2.json", import.meta.url),
    "utf8",
  ),
) as FoundationBank

const dimensions: DimensionKey[] = [
  "securityCompetition",
  "institutions",
  "domesticFilters",
  "normsIdentity",
  "politicalEconomy",
  "restraint",
  "orderJustice",
]

const familyPairs: Array<[FamilyKey, FamilyKey]> = [
  ["realist", "institutionalist"],
  ["realist", "constructivist"],
  ["realist", "criticalPoliticalEconomy"],
  ["institutionalist", "constructivist"],
  ["institutionalist", "criticalPoliticalEconomy"],
  ["constructivist", "criticalPoliticalEconomy"],
]

test("every Foundation item has a tier and the core contains one item per direction per dimension", () => {
  assert.equal(bank.items.length, 68)
  assert.ok(
    bank.items.every(
      (item) => item.tier === "core" || item.tier === "extended",
    ),
  )

  const core = bank.items.filter((item) => item.tier === "core")
  assert.equal(core.length, 14)

  for (const dimension of dimensions) {
    const pair = core.filter((item) => item.dimension === dimension)
    assert.equal(pair.length, 2, dimension)
    assert.deepEqual(
      pair.map((item) => item.reverse).sort(),
      [false, true],
      dimension,
    )
  }
})

test("the selected 14-item core is stable and loads before either extension path", () => {
  assert.deepEqual(
    foundationCoreQuestions.map((question) => question.id),
    [
      "sc2",
      "v21_sc_rev_02",
      "in2",
      "v21_in_rev_03",
      "df1",
      "v21_df_rev_04",
      "ni2",
      "v21_ni_rev_05",
      "pe2",
      "v21_pe_rev_02",
      "rs2",
      "v21_rs_rev_04",
      "oj1",
      "oj2",
    ],
  )
  assert.equal(getFoundationQuestionsForSet("core").length, 14)
  assert.equal(
    getFoundationQuestionsForSet("fullExtended").length,
    foundationExtendedQuestions.length,
  )
  assert.equal(foundationExtendedQuestions.length, 54)
})

test("every unordered family pair maps symmetrically to five scored extended items", () => {
  const byId = new Map(bank.items.map((item) => [item.id, item]))
  assert.equal(Object.keys(bank.discriminators).length, familyPairs.length)

  for (const [left, right] of familyPairs) {
    const forward = getFoundationDiscriminatorIds(left, right)
    const reverse = getFoundationDiscriminatorIds(right, left)

    assert.equal(forward.length, 5, `${left}|${right}`)
    assert.equal(new Set(forward).size, 5, `${left}|${right}`)
    assert.deepEqual(reverse, forward)
    assert.deepEqual(
      getFoundationQuestionsForSet("targetedExtended", [left, right]).map(
        (question) => question.id,
      ),
      forward,
    )

    for (const itemId of forward) {
      const item = byId.get(itemId)
      assert.ok(item, itemId)
      assert.equal(item.tier, "extended", itemId)
      assert.equal(item.scoringBlock, "core", itemId)
    }
  }
})

test("each discriminator list contains the five largest projected family separations", () => {
  for (const [left, right] of familyPairs) {
    const expected = bank.items
      .filter(
        (item) =>
          item.tier === "extended" && item.scoringBlock === "core",
      )
      .map((item) => ({
        id: item.id,
        separation: projectedSeparation(item, left, right),
      }))
      .sort(
        (a, b) =>
          b.separation - a.separation || a.id.localeCompare(b.id),
      )
      .slice(0, 5)
      .map((item) => item.id)

    assert.deepEqual(getFoundationDiscriminatorIds(left, right), expected)
  }
})

function projectedSeparation(
  item: FoundationBank["items"][number],
  left: FamilyKey,
  right: FamilyKey,
) {
  const coefficientDifference = Object.fromEntries(
    dimensions.map((dimension) => [
      dimension,
      (
        (familyProfiles[left][dimension] ?? 0) -
        (familyProfiles[right][dimension] ?? 0)
      ) / NEUTRAL_BASELINE[dimension].sd,
    ]),
  ) as Record<DimensionKey, number>

  if (item.kind === "likert" && item.dimension) {
    return Math.abs(coefficientDifference[item.dimension]) * 6
  }

  const optionProjections = (item.options ?? []).map((option) =>
    Object.entries(option.signals).reduce(
      (sum, [dimension, value]) =>
        sum +
        coefficientDifference[dimension as DimensionKey] *
          (value ?? 0),
      0,
    ),
  )

  return Math.max(...optionProjections) - Math.min(...optionProjections)
}
