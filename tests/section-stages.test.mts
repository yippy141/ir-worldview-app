import test from "node:test"
import assert from "node:assert/strict"
import { isValidWorldStageIso3Key } from "@/lib/world-stage/scenes"
import {
  SECTION_STAGE_IDS,
  getSectionStage,
  sectionStages,
  validateSectionStages,
  type SectionStageDefinition,
} from "@/lib/world-stage/section-stages"
import { getFoundationPerspectiveNextSteps, getModulePerspectiveNextSteps } from "@/lib/perspectives/next-steps"
import { isPerspectiveId } from "@/lib/perspectives/catalog"
import type { FamilyKey } from "@/lib/types"

test("shipped section stages validate cleanly", () => {
  const result = validateSectionStages()
  assert.equal(result.ok, true, JSON.stringify(result.errors))
})

test("every declared section stage ID resolves", () => {
  for (const id of SECTION_STAGE_IDS) {
    const stage = getSectionStage(id)
    assert.equal(stage.id, id)
    assert.ok(stage.qualification.trim().length > 0)
    assert.ok(stage.groups.length >= 1)
  }
})

test("section stage nodes stay inside the reviewed ISO-3 allowlist", () => {
  for (const stage of sectionStages) {
    for (const group of stage.groups) {
      for (const node of group.nodes) {
        assert.ok(
          isValidWorldStageIso3Key(node.iso3Key),
          `${stage.id}/${group.id}: ${node.iso3Key} is not reviewed`,
        )
      }
    }
  }
})

test("the focus-areas stage carries the two live theatres", () => {
  const stage = getSectionStage("focus-areas")
  const groupIds = stage.groups.map((group) => group.id)
  assert.deepEqual(groupIds, ["security", "technology"])
})

test("validator flags unreviewed ISO-3 keys and dangling route endpoints", () => {
  const invalid: SectionStageDefinition[] = [
    {
      id: "focus-areas",
      lens: "Test lens",
      qualification: "Test qualification",
      groups: [
        {
          id: "broken",
          label: "Broken group",
          tone: "brass",
          nodes: [{ id: "n1", iso3Key: "ZZZ", label: "Nowhere" }],
          routes: [{ id: "r1", fromNodeId: "n1", toNodeId: "n2", label: "Dangling" }],
        },
      ],
    },
  ]

  const result = validateSectionStages(invalid)
  assert.equal(result.ok, false)
  const codes = new Set(result.errors.map((error) => error.code))
  assert.ok(codes.has("node.iso3.invalid"))
  assert.ok(codes.has("route.endpoint.missing"))
})

test("foundation next-step seats: three unique valid seats per family", () => {
  const familyKeys: FamilyKey[] = [
    "realist",
    "institutionalist",
    "constructivist",
    "criticalPoliticalEconomy",
  ]

  for (const familyKey of familyKeys) {
    const seats = getFoundationPerspectiveNextSteps(familyKey)
    assert.equal(seats.length, 3, `${familyKey} should recommend three seats`)

    const ids = seats.map((seat) => seat.perspective.id)
    assert.equal(new Set(ids).size, ids.length, `${familyKey} seats must be unique`)

    for (const seat of seats) {
      assert.ok(isPerspectiveId(seat.perspective.id))
      assert.ok(seat.reason.trim().length > 0)
    }
  }
})

test("module next-step seats follow the V17 domain packs", () => {
  const security = getModulePerspectiveNextSteps("security").map((seat) => seat.perspective.id)
  assert.deepEqual(security, ["exposed-ally", "rising-peer-competitor", "incumbent-great-power"])

  const technology = getModulePerspectiveNextSteps("technology").map((seat) => seat.perspective.id)
  assert.deepEqual(technology, [
    "capacity-constrained-state",
    "middle-power-hedger",
    "protection-authority",
  ])
})
