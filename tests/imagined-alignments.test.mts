import test from "node:test"
import assert from "node:assert/strict"
import { AUTHORED_ALIGNMENTS, ROOT_GLOBE_SCENES, SUPPORTED_PLACES, getRootGlobeScenes } from "@/lib/root/globe-scenes"
import { DOCUMENTED_GLOBE_SCENES } from "@/lib/world-stage/documented-globe-scenes"
import { ROOT_SCENE_MS, ROOT_REVOLUTION_MS } from "@/lib/root/globe-types"
import { DEFAULT_CAMERA, dragCamera, rotateCamera, zoomCamera } from "@/lib/root/globe-camera"

test("fiction states are complete, disjoint, deterministic and separate from evidence records", () => {
  const codes = SUPPORTED_PLACES.map(place => place.code).sort()
  for (const scene of AUTHORED_ALIGNMENTS) {
    const assigned = scene.groups.flatMap(group => group.countries)
    assert.equal(new Set(assigned).size, assigned.length, scene.id)
    assert.deepEqual(assigned.sort(), codes, scene.id)
    assert.equal(scene.kind, "imagined")
    assert.ok(scene.rationale.length > 50)
    assert.ok(!scene.title.includes("?"))
  }
  assert.deepEqual(getRootGlobeScenes("en"), ROOT_GLOBE_SCENES)
  for (const scene of ROOT_GLOBE_SCENES) {
    assert.equal("rationale" in scene, false)
    assert.equal("sources" in scene, false)
    assert.equal("date" in scene, false)
    assert.ok(!DOCUMENTED_GLOBE_SCENES.some(record => record.id === scene.id))
  }
  assert.deepEqual(getRootGlobeScenes("zh-Hans").map(scene => scene.groups.map(({ id, color, countries }) => ({ id, color, countries }))), ROOT_GLOBE_SCENES.map(scene => scene.groups.map(({ id, color, countries }) => ({ id, color, countries }))))
  assert.ok(getRootGlobeScenes("zh-Hans").every(scene => /[\u4e00-\u9fff]/.test(scene.title)))
})
const group = (id: string, code: string) => ROOT_GLOBE_SCENES.find(scene => scene.id === id)!.groups.find(group => group.countries.includes(code))!.color

test("the authored story contains staged European, Turkish, Pacific and middle-power changes", () => {
  assert.equal(group("european-autonomy", "CAN"), "gold")
  assert.equal(group("european-autonomy", "FRA"), "gold")
  assert.equal(group("european-autonomy", "GBR"), "red")
  assert.equal(group("british-reassessment", "GBR"), "gold")
  assert.equal(group("continental-pivot", "TUR"), "blue")
  assert.equal(group("turkish-realignment", "TUR"), "red")
  assert.equal(group("pacific-compact", "CHN"), "blue")
  assert.equal(group("pacific-compact", "USA"), "red")
  assert.equal(group("pacific-compact", "JPN"), "gold")
  for (const code of ["IND", "KEN", "ZAF", "BRA"]) assert.equal(group("middle-power-arrangements", code), "blue")
  for (const code of ["PAK", "ETH", "PER"]) assert.equal(group("middle-power-arrangements", code), "red")
  for (const code of ["MLT", "SGP", "WSM", "TON"]) assert.ok(SUPPORTED_PLACES.some(place => place.code === code))
})

test("projection camera wraps longitude, bounds poles and zoom, and never mutates its origin", () => {
  assert.equal(rotateCamera({ ...DEFAULT_CAMERA, longitude: 179 }, 5, 0).longitude, -176)
  assert.equal(rotateCamera({ ...DEFAULT_CAMERA, longitude: -179 }, -5, 0).longitude, 176)
  const start = { ...DEFAULT_CAMERA }
  const moved = dragCamera(start, 2400, 2000, 400)
  assert.ok(moved.longitude >= -180 && moved.longitude < 180)
  assert.equal(moved.latitude, 89)
  assert.equal(dragCamera(start, -2400, -2000, 400).latitude, -89)
  assert.deepEqual(start, DEFAULT_CAMERA)
  assert.equal(zoomCamera(moved, 10).zoom, 2.4)
  assert.equal(zoomCamera(moved, -10).zoom, 1)
  assert.equal(rotateCamera(moved, 0, 0).longitude, moved.longitude)
})


test("fifteen 5.5-second scenes separate arrangement identity from paint and include one worldwide authority", () => {
  assert.equal(ROOT_SCENE_MS, 5500)
  assert.equal(ROOT_REVOLUTION_MS, 140000)
  assert.equal(ROOT_GLOBE_SCENES.length, 15)
  const first = ROOT_GLOBE_SCENES[0].groups.find(group => group.countries.includes("RUS"))!
  const early = ROOT_GLOBE_SCENES[1].groups.find(group => group.countries.includes("RUS"))!
  assert.equal(first.id, early.id)
  assert.equal(first.label, early.label)
  assert.deepEqual(first.countries, early.countries)
  assert.notEqual(first.color, early.color)
  const earth = ROOT_GLOBE_SCENES[2]
  assert.equal(earth.id, "one-earth")
  assert.equal(earth.internalBorders, "faint")
  assert.equal(earth.groups.length, 1)
  assert.equal(earth.groups[0].id, "worldwide-authority")
  assert.equal(earth.groups[0].countries.length, SUPPORTED_PLACES.length)
  for (const code of ["CHN", "RUS"]) assert.ok(ROOT_GLOBE_SCENES.filter(scene => scene.id !== "one-earth" && scene.groups.some(group => group.color === "blue" && group.countries.includes(code))).length >= 3)
  for (const scene of ROOT_GLOBE_SCENES) {
    assert.equal(new Set(scene.groups.map(group => group.id)).size, scene.groups.length)
    assert.ok(scene.groups.every(group => group.label && !/^Blue|^Red/.test(group.label)))
  }
})
