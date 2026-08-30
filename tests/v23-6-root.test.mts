import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { ROOT_COPY_BY_LOCALE } from "@/content/root"
import {
  ROOT_DESTINATIONS,
  ROOT_DESTINATION_IDS,
} from "@/lib/root/destinations"
import { readRootLocalStatus } from "@/lib/root/local-status"
import { ROOT_GLOBE_VISUAL } from "@/lib/root/orthographic"
import { PROFILE_STORAGE_KEY, QUIZ_STORAGE_KEY } from "@/lib/storage-keys"

function source(relativePath: string) {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8")
}

function importSpecifiers(contents: string) {
  return Array.from(
    contents.matchAll(/(?:from\s+|import\s+)["']([^"']+)["']/gu),
    (match) => match[1],
  )
}

test("the production root has five literal destinations and exhaustive bilingual copy", () => {
  assert.deepEqual(ROOT_DESTINATION_IDS, [
    "inventory",
    "world-stage",
    "atlas",
    "perspective-runs",
    "profile",
  ])
  assert.deepEqual(
    ROOT_DESTINATIONS.map(({ id, href }) => ({ id, href })),
    [
      { id: "inventory", href: "/quiz" },
      { id: "world-stage", href: "/world-stage" },
      { id: "atlas", href: "/explore" },
      { id: "perspective-runs", href: "/perspectives" },
      { id: "profile", href: "/profile" },
    ],
  )

  for (const copy of Object.values(ROOT_COPY_BY_LOCALE)) {
    assert.deepEqual(Object.keys(copy.destinationCopy), [...ROOT_DESTINATION_IDS])
    for (const id of ROOT_DESTINATION_IDS) {
      assert.ok(copy.destinationCopy[id].label.length > 0)
      assert.ok(copy.destinationCopy[id].explanation.length > 35)
    }
  }
})

test("one root selection drives menu, explanation, and geographic visual state", () => {
  const component = source("components/home/root/root-home.tsx")
  assert.match(component, /useState<RootDestinationId>/)
  assert.match(component, /data-selected=\{selected \? "true" : "false"\}/)
  assert.match(component, /data-root-detail-state=\{selectedId\}/)
  assert.match(component, /<RootGlobe activeId=\{selectedId\}/)
  assert.match(component, /onFocus=\{\(\) => setSelectedId\(destination\.id\)\}/)
  assert.match(component, /onPointerEnter=\{\(\) => setSelectedId\(destination\.id\)\}/)
  assert.match(component, /prefetch=\{false\}/)
  assert.doesNotMatch(component, /role="tab"|aria-selected|aria-current/)

  const detailStart = component.indexOf("className={styles.detailRegion}")
  const detailEnd = component.indexOf("<RootGlobe", detailStart)
  const detail = component.slice(detailStart, detailEnd)
  assert.doesNotMatch(detail, /<Link|<button|<a\s/u)
})

test("the root route graph has no Mapbox import and uses checked-in geography", () => {
  const routeFiles = [
    "app/page.tsx",
    "app/[locale]/page.tsx",
    "components/home/root/root-home.tsx",
    "content/root.ts",
    "lib/root/destinations.ts",
    "lib/root/local-status.ts",
    "lib/root/orthographic.ts",
    "lib/storage-keys.ts",
  ]

  const specifiers = routeFiles.flatMap((file) => importSpecifiers(source(file)))
  assert.equal(specifiers.some((specifier) => /mapbox/iu.test(specifier)), false)
  assert.ok(
    specifiers.includes("@/lib/world-stage/data/world-countries-110m.json"),
  )
  assert.equal(source("app/page.tsx").includes("WorldStageHome"), false)
  assert.equal(source("app/page.tsx").includes("map-config"), false)
})

test("the checked-in geographic globe has a distinct restrained ring for every destination", () => {
  assert.ok(ROOT_GLOBE_VISUAL.land.length > 10_000)
  assert.ok(ROOT_GLOBE_VISUAL.graticule.length > 1_000)
  const states = ROOT_DESTINATION_IDS.map((id) => ROOT_GLOBE_VISUAL.states[id])
  assert.equal(new Set(states.map((state) => `${state.front}|${state.back}`)).size, 5)
  for (const state of states) {
    assert.ok(state.front.length > 100)
    assert.ok(state.back.length > 100)
  }
})

test("returning-state parsing reads counts without returning answer content", () => {
  const values = new Map<string, string>([
    [
      PROFILE_STORAGE_KEY,
      JSON.stringify({
        v: 5,
        foundation: { payload: "opaque" },
        modules: { security: { resultPath: "/modules/security/results/opaque" } },
        aiGovernance: { payload: "opaque-ai" },
        perspectiveRuns: [{ id: "run-1" }],
      }),
    ],
    [QUIZ_STORAGE_KEY, JSON.stringify({ v: 7, answers: { one: 2, two: "option" } })],
  ])
  const status = readRootLocalStatus({
    getItem: (key) => values.get(key) ?? null,
  })

  assert.deepEqual(status, {
    foundation: true,
    domains: 2,
    perspectives: 1,
    draft: 2,
  })
  assert.equal(JSON.stringify(status).includes("option"), false)
})

test("World Stage reuses the production map, controls, sources, fallback, and attribution", () => {
  for (const route of [
    "app/world-stage/page.tsx",
    "app/[locale]/world-stage/page.tsx",
  ]) {
    assert.match(source(route), /WorldStageHome/)
  }

  const home = source("components/home/world-stage/world-stage-home.tsx")
  const map = source("components/home/world-stage/world-stage-map.tsx")
  assert.match(home, /WorldStageMap/)
  assert.match(home, /sceneOptions/)
  assert.match(home, /mapFilters/)
  assert.match(map, /import\("\.\/mapbox-runtime"\)/)
  assert.match(map, /fallback/iu)
  assert.match(map, /Mapbox/)
  assert.match(map, /OpenStreetMap/)
  assert.match(map, /source/iu)
})
