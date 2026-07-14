import test from "node:test"
import assert from "node:assert/strict"
import { atlasLitePatterns, getAtlasLitePattern } from "@/lib/atlas-lite"
import {
  caseLibrary,
  getCaseReadingsForPattern,
  getCaseStudy,
} from "@/lib/content/case-library"
import { getProfileMentalModel, profileMentalModels } from "@/lib/content/profile-mental-models"

test("case library has the six approved cases with unique IDs", () => {
  assert.equal(caseLibrary.length, 6)

  const ids = new Set(caseLibrary.map((caseStudy) => caseStudy.id))
  assert.equal(ids.size, caseLibrary.length)
})

test("every case reading resolves to a real atlas pattern", () => {
  for (const caseStudy of caseLibrary) {
    for (const reading of caseStudy.readings) {
      const pattern = getAtlasLitePattern(reading.patternId)
      assert.ok(pattern, `${caseStudy.id} references unknown pattern ${reading.patternId}`)
      assert.equal(
        pattern.publicName,
        reading.profileName,
        `${caseStudy.id}: reading profileName should match the pattern's publicName`,
      )
    }
  }
})

test("readings within one case are unique per pattern", () => {
  for (const caseStudy of caseLibrary) {
    const patternIds = caseStudy.readings.map((reading) => reading.patternId)
    assert.equal(new Set(patternIds).size, patternIds.length, caseStudy.id)
  }
})

test("every atlas pattern has at least one sourced case comparison", () => {
  for (const pattern of atlasLitePatterns) {
    const readings = getCaseReadingsForPattern(pattern.id)
    assert.ok(readings.length >= 1, `${pattern.id} has no case reading`)
  }
})

test("every case keeps its evidence posture: sources, disputes, and analogy limits", () => {
  for (const caseStudy of caseLibrary) {
    assert.ok(caseStudy.context.trim().length > 0, `${caseStudy.id} context missing`)
    assert.ok(caseStudy.sources.length >= 4, `${caseStudy.id} needs at least 4 sources`)
    assert.ok(caseStudy.readings.length >= 4, `${caseStudy.id} needs at least 4 readings`)
    assert.ok(
      caseStudy.whereTheAnalogyBreaks.length >= 1,
      `${caseStudy.id} must state where the analogy breaks`,
    )
    assert.ok(
      caseStudy.sensitiveClaims.length >= 1,
      `${caseStudy.id} must keep its careful-wording notes`,
    )

    for (const reading of caseStudy.readings) {
      assert.ok(reading.noticesFirst.trim().length > 0)
      assert.ok(reading.likelyRecommendation.trim().length > 0)
      assert.ok(reading.strongestObjection.trim().length > 0)
    }
  }
})

test("getCaseStudy resolves known IDs and rejects unknown IDs", () => {
  assert.ok(getCaseStudy("cuban_missile_crisis_escalation_ceilings"))
  assert.equal(getCaseStudy("not-a-case"), null)
})

test("every atlas pattern has a mental model with a caveat", () => {
  assert.equal(profileMentalModels.length, atlasLitePatterns.length)

  for (const pattern of atlasLitePatterns) {
    const model = getProfileMentalModel(pattern.id)
    assert.ok(model, `${pattern.id} has no mental model`)
    assert.ok(model.analogy.trim().length > 0)
    assert.ok(model.body.trim().length > 0)
    assert.ok(model.caveat.trim().length > 0, `${pattern.id} mental model must carry a caveat`)
  }
})
