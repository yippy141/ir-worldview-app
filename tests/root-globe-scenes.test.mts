import test from "node:test"
import assert from "node:assert/strict"
import { EU_MEMBERS, NATO_MEMBERS, RCEP_SIGNATORIES, ROOT_GLOBE_SCENES, getRootGlobeScenes } from "@/lib/root/globe-scenes"
import countries from "@/lib/world-stage/data/world-countries-110m.json" with { type: "json" }
import points from "@/lib/world-stage/data/world-small-places-110m.json" with { type: "json" }

test("official membership sets derive three exhaustive disjoint EU/NATO groups", () => {
  assert.equal(EU_MEMBERS.length, 27)
  assert.equal(NATO_MEMBERS.length, 32)
  for (const list of [EU_MEMBERS, NATO_MEMBERS, RCEP_SIGNATORIES]) assert.equal(new Set(list).size, list.length)
  const [both, euOnly, natoOnly] = ROOT_GLOBE_SCENES.find(scene => scene.id === "eu-nato")!.groups
  assert.deepEqual([both.countries.length, euOnly.countries.length, natoOnly.countries.length], [23, 4, 9])
  assert.deepEqual(euOnly.countries, ["AUT", "CYP", "IRL", "MLT"])
  assert.deepEqual(natoOnly.countries, ["ALB", "CAN", "ISL", "MNE", "MKD", "NOR", "TUR", "GBR", "USA"])
  const grouped = [both, euOnly, natoOnly].flatMap(group => group.countries)
  assert.equal(grouped.length, new Set(grouped).size)
  assert.deepEqual([...new Set(grouped)].sort(), [...new Set([...EU_MEMBERS, ...NATO_MEMBERS])].sort())
  for (const dependency of ["GRL", "FRO", "PRI", "GUM", "NCL"]) assert.equal(grouped.includes(dependency), false)
})

test("RCEP remains the fifteen 2020 signatories, with signing distinct from implementation", () => {
  assert.equal(RCEP_SIGNATORIES.length, 15)
  assert.ok(RCEP_SIGNATORIES.includes("MMR"))
  for (const excluded of ["IND", "TLS"]) assert.equal(RCEP_SIGNATORIES.includes(excluded), false)
  const scene = ROOT_GLOBE_SCENES.find(scene => scene.id === "rcep-signing")!
  assert.equal(scene.date, "Signed: 15 Nov 2020")
  assert.match(scene.note!, /Myanmar.*does not establish implementation/)
  assert.match(scene.note!, /not simultaneous entry into force or present ASEAN membership/)
})

test("every scene has disjoint groups, geometry or points, and complete localized scope", () => {
  const geometry = new Set(countries.features.map(feature => feature.properties.iso3))
  const small = new Set(points.features.map(feature => feature.properties.iso3))
  for (const scene of ROOT_GLOBE_SCENES) {
    const grouped = scene.groups.flatMap(group => group.countries)
    assert.equal(new Set(grouped).size, grouped.length, scene.id)
    for (const code of grouped) assert.ok(geometry.has(code) || small.has(code), `${scene.id}: ${code}`)
    assert.ok(scene.sources.length && scene.question.endsWith("?"))
    if (scene.kind === "Geographic focus") { assert.equal(scene.date, undefined); assert.match(scene.note!, /geometry retrieved/) }
  }
  assert.equal(geometry.has("MLT"), false); assert.ok(small.has("MLT"))
  assert.equal(geometry.has("SGP"), false); assert.ok(small.has("SGP"))
  const chinese = getRootGlobeScenes("zh-Hans")
  assert.deepEqual(chinese.map(scene => scene.id), ROOT_GLOBE_SCENES.map(scene => scene.id))
  for (const [index, scene] of chinese.entries()) {
    assert.ok(scene.question && scene.groups.every(group => group.label))
    if (ROOT_GLOBE_SCENES[index].note) assert.ok(scene.note)
    assert.deepEqual(scene.groups.map(group => group.countries), ROOT_GLOBE_SCENES[index].groups.map(group => group.countries))
    assert.deepEqual(scene.sources, ROOT_GLOBE_SCENES[index].sources)
  }
})
