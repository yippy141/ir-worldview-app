import { getFamilyByKey } from "@/lib/explore-content"
import { MODELED_FAMILY_KEYS } from "@/lib/worldview-config"
import test from "node:test"
import assert from "node:assert/strict"
import { archetypes } from "@/lib/archetypes"
import { buildFoundationHero } from "@/lib/results/foundation-interpretation"
import { aiAxisReading, interpretAiPositions } from "@/lib/results/ai-interpretation"
import { readingUrl } from "@/lib/reading-links"
import { getAiReadingList } from "@/lib/ai-governance-reading-lists-v2"
import type { AiArchetypeKey, AiAxisScores } from "@/lib/ai-governance-types"

const keys: AiArchetypeKey[] = ["precautionarySteward", "strategicCompetitor", "coordinationArchitect", "democraticGuardrailist", "stateCapacityBuilder", "openEcosystemBuilder"]
test("all Foundation heroes define the archetype before connecting domestic politics", () => {
  const scores = { securityCompetition: 4, institutions: 4, domesticFilters: 7, normsIdentity: 4, politicalEconomy: 4, restraint: 4, orderJustice: 4 }
  const heroes = archetypes.map(a => buildFoundationHero(scores, a.code))
  assert.equal(new Set(heroes).size, 8)
  for (const hero of heroes) {
    assert.match(hero, /^You .*\. You .*\. Within that approach, .*domestic coalitions/)
    assert.equal(hero.match(/\./g)?.length, 3)
    assert.doesNotMatch(hero, /cannot|do not settle|does not/)
  }
})
test("AI heroes and axes speak directly without repeating sentences", () => {
  for (const value of [1, 4, 7]) {
    const scores: AiAxisScores = { riskHorizon: value, deploymentPace: value, oversight: value, geopolitics: value, openness: value, militaryRole: value, legitimacy: value, humanFuture: value }
    const hero = interpretAiPositions(scores).summary
    assert.match(hero, /^You /)
    for (const axis of Object.keys(scores) as (keyof AiAxisScores)[]) {
      const blurb = aiAxisReading(axis, value)
      assert.match(blurb, /^You /)
      assert.ok(!hero.includes(blurb))
    }
  }
})
test("every AI reading has a valid external destination with a complete Scholar query fallback", () => {
  for (const key of keys) for (const bucket of Object.values(getAiReadingList(key))) for (const entry of bucket) {
    const url = new URL(readingUrl(entry))
    assert.equal(url.protocol, "https:")
    if (!entry.url) assert.equal(url.searchParams.get("q"), `${entry.title} ${entry.author}`)
  }
  assert.equal(readingUrl({ title: "A & B?", url: "https://doi.org/10.1234/example" }), "https://doi.org/10.1234/example")
})

test("every Library reading tier has a valid title-and-author destination", () => {
  for (const key of MODELED_FAMILY_KEYS) {
    const family = getFamilyByKey(key)!
    for (const entry of [...family.readings, ...(family.advancedReadings ?? []), ...(family.counterReadings ?? [])]) {
      const url = new URL(readingUrl(entry))
      assert.equal(url.protocol, "https:")
      assert.equal(url.searchParams.get("q"), `${entry.title} ${entry.author}`)
    }
  }
})
