import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { resolveArchetype } from "@/lib/archetypes"
import { activeMatrixCodes } from "@/lib/field/archetype-matrix"
import { getFoundationQuestions } from "@/lib/quiz-schema"
import {
  buildCanonicalFoundationResult,
  computeCoreDimensionScores,
  getV2ScoringCalibration,
} from "@/lib/scoring"
import { isImmersiveRoute } from "@/lib/site-shell"
import { buildDecisiveChoiceTrace } from "@/lib/v23-6/decisive-choices"
import {
  buildGraticulePath,
  buildLandPath,
  buildRingPaths,
  frontFacingAngle,
  projectLngLat,
  visibleRuns,
} from "@/lib/v23-6/orthographic"
import {
  ROOT_DESTINATIONS,
  countWords,
  getRootDestination,
} from "@/lib/v23-6/root-menu"
import {
  ROOT_ARMILLARY_ATLAS_ROUTE,
  ROOT_ATLAS_GLOBE_ROUTE,
  RESULT_SCROLL_ROUTE,
  STUDY_ROUTES,
  TYPE_PLATE_ROUTE,
} from "@/lib/v23-6/routes"
import {
  STUDY_FOUNDATION_TOKEN,
  buildStudyFoundationSnapshot,
  resolveStudyBaseline,
  resolveStudyFoundation,
} from "@/lib/v23-6/study-fixture"
import profileStoreV5 from "@/tests/fixtures/profile-store-v5.json" with {
  type: "json",
}
import type { Answers } from "@/lib/types"

function source(relativePath: string) {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8")
}

const STUDY_ROUTE_FILES = [
  "app/dev/v23-6/root-atlas-globe/page.tsx",
  "app/dev/v23-6/root-armillary-atlas/page.tsx",
  "app/dev/v23-6/type-plate/page.tsx",
  "app/dev/v23-6/result-scroll/page.tsx",
]

test("the study reuses the Foundation token already registered in the fixtures", () => {
  assert.equal(
    STUDY_FOUNDATION_TOKEN,
    (profileStoreV5 as { foundation: { payload: string } }).foundation.payload,
  )

  const resolved = resolveStudyFoundation()
  assert.equal(resolved.result.familyKey, "institutionalist")
  assert.equal(resolved.result.runnerUpKey, "constructivist")

  const baseline = resolveStudyBaseline()
  assert.equal(baseline.source, "exact-foundation-payload")
  assert.equal(baseline.activeCellCodes.length, 1)
  assert.equal(baseline.leadingPureCode, baseline.activeCellCodes[0])
  assert.equal(
    activeMatrixCodes(baseline.resolvedArchetype).length,
    baseline.activeCellCodes.length,
  )

  const snapshot = buildStudyFoundationSnapshot()
  assert.equal(snapshot.payload, STUDY_FOUNDATION_TOKEN)
  assert.equal(snapshot.locale, "en")
})

test("both prototype roots share one destination contract", () => {
  assert.deepEqual(
    ROOT_DESTINATIONS.map((destination) => destination.id),
    ["inventory", "world-stage", "atlas", "perspective-runs", "profile"],
  )
  assert.deepEqual(
    ROOT_DESTINATIONS.map((destination) => destination.label),
    ["Inventory", "World Stage", "Atlas", "Perspective Runs", "Profile"],
  )

  // Dispatches has no published piece, so it is absent rather than empty.
  assert.equal(
    ROOT_DESTINATIONS.some((destination) =>
      destination.label.toLowerCase().includes("dispatch"),
    ),
    false,
  )

  const weights = ROOT_DESTINATIONS.map((destination) => destination.weight)
  assert.equal(weights.filter((weight) => weight === "dominant").length, 1)
  assert.equal(weights.filter((weight) => weight === "medium").length, 2)
  assert.equal(weights.filter((weight) => weight === "quiet").length, 2)
  assert.equal(getRootDestination("inventory").weight, "dominant")

  // Only World Stage owns the map, so it is the only destination allowed to
  // select a reviewed overlay on the globe root.
  const withOverlay = ROOT_DESTINATIONS.filter(
    (destination) => destination.globe.overlaySceneId !== null,
  )
  assert.deepEqual(
    withOverlay.map((destination) => destination.id),
    ["world-stage"],
  )
})

test("only the active destination carries an explanation, inside the authored range", () => {
  const banned = [
    /—/u,
    /\bnot (?:just|only|simply|merely)\b[^.!?]*\bbut\b/iu,
    /\b(?:lens|layer|signal|ecosystem|journey|unlock)\b/iu,
  ]

  for (const destination of ROOT_DESTINATIONS) {
    const words = countWords(destination.explanation)
    assert.ok(
      words >= 30 && words <= 80,
      `${destination.id} explanation is ${words} words`,
    )
    for (const pattern of banned) {
      assert.doesNotMatch(destination.explanation, pattern, destination.id)
    }
    assert.ok(destination.action.label.length <= 32, destination.id)
    assert.ok(destination.label.split(" ").length <= 2, destination.id)
  }
})

test("study routes fail closed in production and stay out of search results", () => {
  assert.deepEqual(STUDY_ROUTES, [
    ROOT_ATLAS_GLOBE_ROUTE,
    ROOT_ARMILLARY_ATLAS_ROUTE,
    TYPE_PLATE_ROUTE,
    RESULT_SCROLL_ROUTE,
  ])
  assert.equal(ROOT_ATLAS_GLOBE_ROUTE, "/dev/v23-6/root-atlas-globe")
  assert.equal(RESULT_SCROLL_ROUTE, "/dev/v23-6/result-scroll")

  for (const route of STUDY_ROUTE_FILES) {
    const routeSource = source(route)
    assert.match(routeSource, /process\.env\.NODE_ENV === "production"/)
    assert.match(routeSource, /notFound\(\)/)
    assert.match(routeSource, /robots:\s*\{ index: false, follow: false \}/)
  }

  for (const route of STUDY_ROUTES) {
    assert.equal(isImmersiveRoute(route), true)
  }
})

test("the globe root initializes Mapbox only behind the token and a WebGL context", () => {
  const visual = source("components/dev/v23-6/atlas-globe-visual.tsx")
  assert.match(
    visual,
    /if \(!host \|\| !WORLD_STAGE_MAPBOX_TOKEN \|\| !hasWebGlSupport\(\)\) return/,
  )
  assert.match(visual, /void import\("@\/components\/home\/world-stage\/mapbox-runtime"\)/)
  // Attribution is tied to the same flag that reveals the Mapbox canvas.
  assert.match(visual, /\{mapReady \? \(\s*<span className=\{styles\.attribution\}>/)
  assert.match(visual, /openstreetmap\.org\/copyright/)
  // No root controls, inspection, or scene cycling.
  for (const banned of [
    /setInterval/,
    /zoomIn/,
    /addControl/,
    /NavigationControl/,
    /mapTooltip/,
  ]) {
    assert.doesNotMatch(visual, banned)
  }
  assert.match(visual, /interactive: false/)
  assert.match(visual, /showPlaceLabels: false/)
})

test("orthographic geometry stays on the sphere and clips at the horizon", () => {
  const view = { rotation: 12, centerLatitude: 16 }

  const centre = projectLngLat(view.rotation, view.centerLatitude, view)
  assert.equal(centre.visible, true)
  assert.ok(Math.abs(centre.x - 500) < 0.001)
  assert.ok(Math.abs(centre.y - 500) < 0.001)

  const antipode = projectLngLat(view.rotation + 180, -view.centerLatitude, view)
  assert.equal(antipode.visible, false)

  assert.deepEqual(
    visibleRuns([
      { x: 0, y: 0, visible: true },
      { x: 1, y: 1, visible: true },
      { x: 2, y: 2, visible: false },
      { x: 3, y: 3, visible: true },
      { x: 4, y: 4, visible: true },
    ]).map((run) => run.length),
    [2, 2],
  )

  assert.ok(buildLandPath(view).startsWith("M"))
  assert.ok(buildGraticulePath(view).startsWith("M"))

  for (const ring of ["equator", "ecliptic", "meridian", "polar"] as const) {
    const paths = buildRingPaths(ring, view)
    assert.ok(paths.front.length > 0, ring)
    assert.ok(paths.back.length > 0, ring)
    const angle = frontFacingAngle(ring, view)
    assert.ok(angle >= 0 && angle < 360, ring)
  }
})

function buildLikertAnswers(value: number): Answers {
  const answers: Answers = {}
  for (const question of getFoundationQuestions("standard")) {
    if (question.kind === "likert") {
      answers[question.id] = value
      continue
    }
    answers[question.id] = question.options[0].id
  }
  return answers
}

test("decisive choices come from the answer trace or are reported as unavailable", () => {
  const baseline = resolveStudyBaseline()
  const expected = {
    expectedArchetypeCode: baseline.resolvedArchetype.code,
    expectedFamilyKey: "institutionalist" as const,
    expectedRunnerUpKey: "constructivist" as const,
  }

  assert.deepEqual(
    buildDecisiveChoiceTrace({ session: null, ...expected }),
    { status: "no-draft" },
  )

  const answers = buildLikertAnswers(6)
  const session = {
    v: 7 as const,
    orderSeed: "study",
    questionSet: "core" as const,
    contextAssist: false,
    activeMode: "standard" as const,
    answers,
    itemLatencyBuckets: {},
  }

  const scores = computeCoreDimensionScores(answers, "standard")
  const result = buildCanonicalFoundationResult(scores)
  const { lowDifferentiationThreshold } = getV2ScoringCalibration("extended")
  const draftArchetype = resolveArchetype(result, lowDifferentiationThreshold)

  const matching = buildDecisiveChoiceTrace({
    session,
    expectedArchetypeCode: draftArchetype.code,
    expectedFamilyKey: result.familyKey,
    expectedRunnerUpKey: result.runnerUpKey,
  })
  assert.equal(matching.status, "available")
  if (matching.status !== "available") return
  assert.ok(matching.choices.length > 0)
  assert.ok(matching.choices.length <= 3)
  for (const choice of matching.choices) {
    assert.ok(choice.prompt.length > 0)
    assert.notEqual(choice.selected.title, choice.rival.title)
    assert.notEqual(
      choice.selectedDimensionValue,
      choice.rivalDimensionValue,
    )
  }

  const mismatched = buildDecisiveChoiceTrace({
    session,
    ...expected,
    expectedArchetypeCode:
      draftArchetype.code === "P+" ? "S-" : "P+",
  })
  assert.equal(mismatched.status, "different-reading")
})

test("the result prototype keeps its content in the document and its motion optional", () => {
  const scroll = source("components/dev/v23-6/result-scroll.tsx")
  const reveal = source("components/dev/v23-6/scroll-reveal.tsx")
  const styles = source("components/dev/v23-6/result-scroll.module.css")

  for (const section of [
    "payoff",
    "why",
    "carried",
    "limits",
  ]) {
    assert.match(scroll, new RegExp(`data-scroll-section="${section}"`))
  }
  const records = source("components/dev/v23-6/result-scroll-local-records.tsx")
  assert.match(records, /data-scroll-section="choices"/)
  assert.match(records, /data-scroll-section="domains"/)

  // The reveal is an enhancement. It only hides content after script runs and
  // never runs under a reduced-motion preference.
  assert.match(reveal, /prefers-reduced-motion: reduce/)
  assert.match(reveal, /section\.dataset\.reveal = "pending"/)
  assert.doesNotMatch(reveal, /scrollTo|preventDefault|wheel/)

  assert.match(styles, /@media print/)
  assert.match(styles, /position: static/)
  assert.match(styles, /@media \(min-width: 1024px\)/)

  // No combined score and no similarity inference across domains.
  assert.match(records, /No combined score is published across these four\./)
  assert.doesNotMatch(records, /overall score|composite|master score/i)
})
