import test from "node:test"
import assert from "node:assert/strict"
import {
  buildRuntimeCopyFixture,
  RUNTIME_COPY_SURFACE_MANIFEST,
  type RuntimeCopySurface,
} from "@/lib/narrative/runtime-fixtures"
import type { AiAxisKey } from "@/lib/ai-governance-types"
import type { DimensionKey } from "@/lib/types"

const EXPECTED_FOUNDATION_BLOCKS = {
  en: [
    "summary",
    "family-explanation",
    "what-would-change",
    "modifier:strategy",
    "modifier:normative",
    "payoff:notice-first",
    "payoff:tension-title",
    "payoff:tension-body",
    "payoff:rival-argument",
    "payoff:case-question",
    "payoff:case-reason",
    "payoff:security-debate",
    "payoff:technology-debate",
    "payoff:issue-tilt",
    "payoff:issue-note",
    "payoff:underweight",
    "driver",
    "runner-up-separation",
    "dimension-one-liner",
    "neighbor-overlap",
    "mixed-note",
    "why-this-result",
    "flip-analysis",
    "pressure-question",
  ],
  "zh-Hans": [
    "headline",
    "summary",
    "profile-reading",
    "model-placement",
    "judgment-effect",
    "next-test",
  ],
}

const EXPECTED_DIMENSIONS: DimensionKey[] = [
  "securityCompetition",
  "institutions",
  "domesticFilters",
  "normsIdentity",
  "politicalEconomy",
  "restraint",
  "orderJustice",
]

const EXPECTED_AI_AXES: AiAxisKey[] = [
  "riskHorizon",
  "deploymentPace",
  "oversight",
  "geopolitics",
  "openness",
  "militaryRole",
  "legitimacy",
  "humanFuture",
]

function blocksForSurface(
  fixture: ReturnType<typeof buildRuntimeCopyFixture>,
  surface: RuntimeCopySurface,
) {
  return [
    ...new Set(
      fixture.rows.flatMap((row) =>
        row.occurrences
          .filter((occurrence) => occurrence.surface === surface)
          .map((occurrence) => occurrence.block),
      ),
    ),
  ].sort()
}

test("runtime copy fixture deduplicates visible text and retains every provenance", () => {
  const fixture = buildRuntimeCopyFixture()
  const texts = fixture.rows.map((row) => row.text)
  const rowIds = fixture.rows.map((row) => row.id)
  const occurrences = fixture.rows.flatMap((row) => row.occurrences)

  assert.equal(new Set(texts).size, texts.length)
  assert.equal(new Set(rowIds).size, rowIds.length)
  assert.equal(
    new Set(occurrences.map((occurrence) => occurrence.id)).size,
    occurrences.length,
  )
  assert.equal(fixture.uniqueTextCount, fixture.rows.length)
  assert.equal(fixture.occurrenceCount, occurrences.length)
  assert.ok(fixture.uniqueTextCount < fixture.occurrenceCount)
  assert.equal(fixture.reviewState, "coverage-only-needs-human-review")
  assert.match(fixture.reviewMeaning, /does not record editorial approval/u)

  for (const row of fixture.rows) {
    assert.ok(row.text.trim().length > 0, row.id)
    assert.ok(row.surfaces.length > 0, row.id)
    assert.ok(row.blocks.length > 0, row.id)
    assert.ok(row.jobs.length > 0, row.id)
    assert.ok(row.occurrences.length > 0, row.id)
    for (const occurrence of row.occurrences) {
      assert.ok(row.surfaces.includes(occurrence.surface), occurrence.id)
      assert.ok(row.blocks.includes(occurrence.block), occurrence.id)
      assert.ok(row.jobs.includes(occurrence.job), occurrence.id)
      assert.ok(occurrence.inputs.kind, occurrence.id)
    }
  }
})

test("surface manifest is explicit, unique, and exactly matches emitted blocks", () => {
  const fixture = buildRuntimeCopyFixture()
  assert.deepEqual(fixture.surfaceManifest, RUNTIME_COPY_SURFACE_MANIFEST)
  assert.equal(fixture.manifestValidation.passes, true)
  assert.deepEqual(fixture.manifestValidation.missingDeclaredBlocks, [])
  assert.deepEqual(fixture.manifestValidation.undeclaredObservedBlocks, [])
  assert.deepEqual(fixture.manifestValidation.duplicateManifestSurfaces, [])

  const surfaces = RUNTIME_COPY_SURFACE_MANIFEST.map((entry) => entry.surface)
  assert.equal(new Set(surfaces).size, surfaces.length)
  for (const manifest of RUNTIME_COPY_SURFACE_MANIFEST) {
    assert.equal(manifest.reviewState, "coverage-only-needs-human-review")
    assert.ok(manifest.coverageScope.length > 0, manifest.surface)
    assert.ok(manifest.exclusions.length > 0, manifest.surface)
    assert.deepEqual(
      blocksForSurface(fixture, manifest.surface),
      [...manifest.blocks].sort(),
      manifest.surface,
    )
  }
})

test("Foundation fixtures cover declared live helper blocks and known branch factors", () => {
  const fixture = buildRuntimeCopyFixture()

  for (const locale of ["en", "zh-Hans"] as const) {
    const coverage = fixture.coverage.foundation.find(
      (candidate) => candidate.locale === locale,
    )
    assert.ok(coverage)
    assert.deepEqual(coverage.blocks, EXPECTED_FOUNDATION_BLOCKS[locale])
    assert.deepEqual(coverage.states.sort(), [
      "lowDifferentiation",
      "sharplyDifferentiated",
      "stableModeration",
    ])
    assert.equal(coverage.familyKeys.length, 4)
    assert.equal(coverage.runnerUpPairs.length, 4 * 3)
    assert.equal(coverage.strategyModifiers.length, 3)
    assert.equal(coverage.normativeModifiers.length, 3)
    assert.equal(coverage.appliedReadingCombinations, 4 * 3 * 3)

    for (const dimension of EXPECTED_DIMENSIONS) {
      assert.deepEqual(coverage.dimensionBands[dimension].sort(), [
        "high",
        "low",
        "middle",
      ])
    }

    assert.deepEqual(
      blocksForSurface(fixture, `foundation-result:${locale}`),
      [...EXPECTED_FOUNDATION_BLOCKS[locale]].sort(),
    )
  }
})

test("English Foundation inventory excludes dormant narrative sections", () => {
  const fixture = buildRuntimeCopyFixture()
  const englishOccurrences = fixture.rows.flatMap((row) =>
    row.occurrences.filter(
      (occurrence) => occurrence.surface === "foundation-result:en",
    ),
  )
  const dormantBlocks = [
    "profile-reading",
    "model-placement",
    "judgment-effect",
    "next-test",
  ]

  assert.ok(englishOccurrences.length > 0)
  assert.ok(
    englishOccurrences.every(
      (occurrence) => !dormantBlocks.includes(occurrence.block),
    ),
  )
  const appliedCaseIds = new Set(
    englishOccurrences.flatMap((occurrence) =>
      occurrence.inputs.kind === "foundation" &&
      occurrence.inputs.caseId.startsWith("applied:")
        ? [occurrence.inputs.caseId]
        : [],
    ),
  )
  assert.equal(appliedCaseIds.size, 4 * 3 * 3)
})

test("active module results cover every branch exposed by the bounded public oracle", () => {
  const fixture = buildRuntimeCopyFixture()
  assert.equal(fixture.coverage.modules.length, 2 * 2)

  for (const coverage of fixture.coverage.modules) {
    assert.equal(coverage.oracle, "public-callback-calibration-grid")
    assert.match(coverage.proofLimit, /too large for exhaustive enumeration/u)
    assert.ok(coverage.retainedAnswerPatterns > 0)
    assert.ok(coverage.searchCandidatesChecked >= coverage.retainedAnswerPatterns)
    assert.equal(coverage.headlineBranches.expected, 5)
    assert.equal(
      coverage.headlineBranches.observed,
      coverage.headlineBranches.expected,
    )
    assert.deepEqual(coverage.headlineBranches.uncovered, [])
    assert.equal(Object.keys(coverage.laneBranches).length, 3)

    for (const lane of Object.values(coverage.laneBranches)) {
      assert.equal(lane.expected, 3)
      assert.equal(lane.observed, lane.expected)
      assert.deepEqual(lane.uncovered, [])
    }

    const surface = `module-result:${coverage.slug}` as RuntimeCopySurface
    const modeOccurrences = fixture.rows.flatMap((row) =>
      row.occurrences.filter(
        (occurrence) =>
          occurrence.surface === surface &&
          occurrence.inputs.kind === "module" &&
          occurrence.inputs.mode === coverage.mode,
      ),
    )
    for (const block of [
      "headline",
      "summary",
      "challenge",
      "instinct",
      "lane-summary",
      "foundation-relation",
      "scope:measures",
      "scope:does-not-claim",
      "decisive:case-title",
      "decisive:framing",
      "decisive:implication",
    ]) {
      assert.ok(
        modeOccurrences.some((occurrence) => occurrence.block === block),
        `${coverage.slug}.${coverage.mode}:${block}`,
      )
    }
    assert.ok(
      modeOccurrences.every(
        (occurrence) =>
          occurrence.inputs.kind !== "module" ||
          Object.keys(occurrence.inputs.answers).length > 0,
      ),
    )
  }
})

test("AI v3 inventory covers declared result, metadata, and share blocks", () => {
  const fixture = buildRuntimeCopyFixture()
  const coverage = fixture.coverage.aiV3

  assert.equal(coverage.bankVersion, 3)
  assert.equal(coverage.scoringVersion, 2)
  assert.equal(coverage.archetypes.length, 6)
  assert.deepEqual(coverage.riskLenses.sort(), [
    "Frontier-risk first",
    "Mixed risk lens",
    "Present-harms first",
  ])
  assert.deepEqual(coverage.paceModifiers.sort(), [
    "Deployment-first",
    "Precaution-first",
    "Threshold guardrails",
  ])
  assert.deepEqual(coverage.geopoliticsModifiers.sort(), [
    "Competition-first",
    "Competitive hedger",
    "Coordination-first",
  ])
  assert.deepEqual(coverage.strongestAxes.sort(), [...EXPECTED_AI_AXES].sort())
  assert.equal(coverage.strongestAxisPairs.length, (8 * 7) / 2)

  const aiOccurrences = fixture.rows.flatMap((row) =>
    row.occurrences.filter(
      (occurrence) => occurrence.surface === "ai-governance-result:en",
    ),
  )
  assert.equal(
    new Set(
      aiOccurrences.flatMap((occurrence) =>
        occurrence.inputs.kind === "ai-governance"
          ? [occurrence.inputs.archetypeKey]
          : [],
      ),
    ).size,
    6,
  )
  for (const block of [
    "archetype-label",
    "summary",
    "governing-instinct",
    "payoff-debate:question",
    "payoff-debate:text",
    "payoff-main-tension:text",
    "comparison:nearest",
    "strongest-critique",
    "axis-description",
  ]) {
    assert.ok(
      aiOccurrences.some((occurrence) => occurrence.block === block),
      block,
    )
  }
  assert.deepEqual(blocksForSurface(fixture, "ai-governance-open-graph:en"), [
    "description",
    "title",
  ])
  assert.deepEqual(blocksForSurface(fixture, "ai-governance-share:en"), [
    "text",
    "title",
  ])
})

test("social fixtures use canonical Foundation composers", () => {
  const fixture = buildRuntimeCopyFixture()
  const expectedSurfaces = [
    "foundation-open-graph:en",
    "foundation-open-graph:zh-Hans",
    "foundation-share-card:en",
    "profile-open-graph:en",
  ] as const

  assert.deepEqual(fixture.coverage.social.surfaces, expectedSurfaces)
  for (const surface of expectedSurfaces) {
    assert.ok(blocksForSurface(fixture, surface).length > 0, surface)
  }

  assert.deepEqual(blocksForSurface(fixture, "foundation-share-card:en"), [
    "gloss",
    "name",
    "reading-code",
  ])
})

test("Profile records reused saved-layer copy without faking combinations", () => {
  const fixture = buildRuntimeCopyFixture()
  const coverage = fixture.coverage.profile
  assert.equal(coverage.instantiatedStateCombinations, 0)
  assert.equal(coverage.declaredStates.length, 10)
  assert.match(coverage.compositionRule, /does not synthesize new prose/u)
  assert.match(coverage.stateLimit, /require component tests and human review/u)
  assert.deepEqual(blocksForSurface(fixture, "profile:en"), [
    "saved-ai:archetype-label",
    "saved-ai:summary",
    "saved-foundation:gloss",
    "saved-foundation:name",
    "saved-foundation:reading-code",
    "saved-module:does-not-claim",
    "saved-module:headline",
    "saved-module:lane-summary",
    "saved-module:measures",
    "saved-module:subtitle",
    "saved-module:summary",
    "saved-module:title",
  ])

  const profileOccurrences = fixture.rows.flatMap((row) =>
    row.occurrences.filter((occurrence) => occurrence.surface === "profile:en"),
  )
  assert.deepEqual(
    [
      ...new Set(
        profileOccurrences.map((occurrence) => occurrence.inputs.kind),
      ),
    ].sort(),
    ["ai-governance", "foundation", "module"],
  )
  assert.ok(
    profileOccurrences.every(
      (occurrence) =>
        !occurrence.block.includes("challenge") &&
        !occurrence.block.includes("decisive") &&
        !occurrence.block.includes("tension"),
    ),
  )
})
