import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import {
  addAiGovernanceSnapshot,
  addFoundationSnapshot,
  addModuleSnapshot,
  addPerspectiveRunSnapshot,
  emptyProfileStore,
  loadProfileStore,
  parseProfileStore,
  removePerspectiveRunSnapshot,
  saveProfileStore,
  serializeProfileStore,
  type AiGovernanceSnapshot,
  type FoundationSnapshot,
  type ModuleSnapshot,
} from "@/lib/profile-store"
import { encodeModulePayload } from "@/lib/modules/framework"
import { MODULE_V22_TUPLE } from "@/lib/modules/versions"
import type { PerspectiveRunSnapshot } from "@/lib/perspectives/types"

function readFixture(version: 1 | 2 | 3 | 4 | 5) {
  return readFileSync(
    new URL(`./fixtures/profile-store-v${version}.json`, import.meta.url),
    "utf8",
  )
}

test("an empty profile uses the v5 canonical history shape", () => {
  assert.deepEqual(emptyProfileStore(), {
    v: 5,
    foundation: null,
    foundationHistory: [],
    modules: {},
    moduleHistory: [],
    aiGovernance: null,
    aiHistory: [],
    perspectiveRuns: [],
  })
})

test("real v1 fixture migrates its current Foundation and legacy module safely", () => {
  const profile = parseProfileStore(readFixture(1))

  assert.equal(profile.v, 5)
  assert.equal(profile.foundation?.locale, "en")
  assert.equal(profile.foundation?.localeCopyVersion, 0)
  assert.equal(profile.foundation?.payload, "legacy-foundation-v1")
  assert.deepEqual(profile.foundationHistory, [profile.foundation])
  assert.equal(profile.modules.security?.headline, "Legacy security result")
  assert.deepEqual(profile.modules.security?.laneSummaries, [])
  assert.deepEqual(profile.modules.security?.overlayDeltas, {})
  assert.deepEqual(profile.moduleHistory, [])
  assert.equal(profile.aiGovernance, null)
  assert.deepEqual(profile.aiHistory, [])
  assert.deepEqual(profile.perspectiveRuns, [])
})

test("real v2 fixture preserves current module overlay fields", () => {
  const profile = parseProfileStore(readFixture(2))

  assert.equal(profile.v, 5)
  assert.equal(profile.foundationHistory.length, 1)
  assert.equal(profile.modules.technology?.laneSummaries[0]?.key, "controls")
  assert.deepEqual(profile.modules.technology?.overlayDeltas, {
    securityCompetition: 0.4,
    politicalEconomy: 0.3,
  })
  assert.deepEqual(profile.moduleHistory, [])
})

test("real v3 fixture preserves the current AI snapshot without inventing history", () => {
  const profile = parseProfileStore(readFixture(3))

  assert.equal(profile.v, 5)
  assert.equal(profile.aiGovernance?.archetypeKey, "coordinationArchitect")
  assert.equal(profile.aiGovernance?.axisScores.oversight, 5.7)
  assert.deepEqual(profile.aiHistory, [])
})

test("all frozen ProfileStore generations migrate or hydrate as V5", () => {
  for (const version of [1, 2, 3, 4, 5] as const) {
    assert.equal(parseProfileStore(readFixture(version)).v, 5)
  }

  const legacyV4 = parseProfileStore(readFixture(4))
  assert.equal(legacyV4.foundation?.locale, "en")
  assert.equal(legacyV4.foundation?.localeCopyVersion, 0)
  assert.equal(legacyV4.modules.security?.legacyEnglishCopy?.headline, "V4 security interpretation")

  const canonicalV5 = parseProfileStore(readFixture(5), "zh-Hans")
  assert.equal(canonicalV5.foundation?.locale, "zh-Hans")
  assert.equal(canonicalV5.foundation?.localeCopyVersion, 1)
  assert.equal(canonicalV5.foundation?.instrumentStructuralVersion, 3)
  assert.equal(canonicalV5.foundation?.scoringVersion, 1)
  assert.match(canonicalV5.foundation?.resultPath ?? "", /^\/zh\/results\//)
})

test("new V5 persistence strips render-time display copy", () => {
  const canonicalV5 = parseProfileStore(readFixture(5), "en")
  const persisted = JSON.parse(serializeProfileStore(canonicalV5))

  assert.equal(persisted.v, 5)
  assert.equal(persisted.foundation.familyLabel, undefined)
  assert.equal(persisted.foundation.summary, undefined)
  assert.equal(persisted.foundation.resultPath, undefined)
  assert.equal(persisted.foundation.familyKey, "institutionalist")
  assert.equal(persisted.foundation.locale, "zh-Hans")
  assert.equal(persisted.foundation.instrumentStructuralVersion, 3)
  assert.equal(persisted.foundation.scoringVersion, 1)
})

test("Foundation hydration trusts the versioned payload over conflicting cached result fields", () => {
  const candidate = JSON.parse(readFixture(5))
  candidate.foundation.familyKey = "realist"
  candidate.foundation.runnerUpKey = "criticalPoliticalEconomy"
  candidate.foundation.strategyModifier = "Maximizer"
  candidate.foundation.normativeModifier = "Universalist"
  candidate.foundation.dimensionScores.institutions = 1

  const hydrated = parseProfileStore(JSON.stringify(candidate), "en")

  assert.equal(hydrated.foundation?.familyKey, "institutionalist")
  assert.equal(hydrated.foundation?.runnerUpKey, "constructivist")
  assert.equal(hydrated.foundation?.strategyModifier, "Restrainer")
  assert.equal(hydrated.foundation?.normativeModifier, "Pluralist")
  assert.equal(hydrated.foundation?.dimensionScores.institutions, 5.8)
  assert.equal(hydrated.foundation?.payload, candidate.foundation.payload)
})

test("V22 module rehydration preserves mode-specific classification cuts", () => {
  const scores = {
    activism: 4.41,
    escalation: 4.401,
    alliance: 4.2,
    legitimacy: 4.3,
  }
  const rehydrate = (mode: "standard" | "analyst") =>
    parseProfileStore(
      JSON.stringify({
        ...emptyProfileStore(),
        modules: {
          security: {
            timestamp: 1785868800000,
            slug: "security",
            mode,
            scores,
            overlayDeltas: {},
            payload: encodeModulePayload({
              v: 3,
              bv: MODULE_V22_TUPLE.bankVersion,
              sv: MODULE_V22_TUPLE.scoringVersion,
              slug: "security",
              mode,
              answers: {},
            }),
            locale: "en",
            localeCopyVersion: 1,
          },
        },
      }),
    ).modules.security

  assert.equal(
    rehydrate("standard")?.headline,
    "Security read: pressure and visible deterrence",
  )
  assert.equal(
    rehydrate("analyst")?.headline,
    "Security read: no single lane dominates",
  )
})

test("migrated non-regenerable English copy survives only in the legacy fallback", () => {
  const migrated = parseProfileStore(readFixture(1))
  const persisted = JSON.parse(serializeProfileStore(migrated))

  assert.equal(
    persisted.foundation.legacyEnglishCopy.summary,
    "Legacy Foundation snapshot",
  )
  assert.equal(
    persisted.modules.security.legacyEnglishCopy.headline,
    "Legacy security result",
  )
  assert.equal(persisted.modules.security.headline, undefined)
  assert.equal(persisted.modules.security.evidence, undefined)
})

test("invalid optional v4 histories never erase valid current snapshots", () => {
  const legacy = JSON.parse(readFixture(4))
  const parsed = parseProfileStore(
    JSON.stringify({
      ...legacy,
      foundationHistory: "corrupt",
      moduleHistory: [{ timestamp: "invalid" }],
      aiHistory: { bad: true },
      perspectiveRuns: [null, { id: "broken" }],
    }),
  )

  assert.equal(parsed.foundation?.payload, legacy.foundation.payload)
  assert.deepEqual(parsed.foundationHistory, [parsed.foundation])
  assert.equal(parsed.modules.security?.headline, "V4 security interpretation")
  assert.deepEqual(parsed.moduleHistory, [])
  assert.deepEqual(parsed.aiHistory, [])
  assert.deepEqual(parsed.perspectiveRuns, [])
})

test("v4 histories filter malformed entries independently", () => {
  const legacy = JSON.parse(readFixture(4))
  const parsed = parseProfileStore(
    JSON.stringify({
      ...legacy,
      foundationHistory: [legacy.foundation, { timestamp: "bad" }],
      moduleHistory: [legacy.modules.security, { slug: "unknown" }],
    }),
  )

  assert.equal(parsed.foundationHistory.length, 1)
  assert.equal(parsed.moduleHistory.length, 1)
  assert.equal(parsed.moduleHistory[0]?.slug, "security")
})

test("snapshot updates keep current views and append deduplicated histories", () => {
  const legacyV1 = parseProfileStore(readFixture(1))
  const oldFoundation = legacyV1.foundation as FoundationSnapshot
  const nextFoundation: FoundationSnapshot = {
    ...oldFoundation,
    timestamp: oldFoundation.timestamp + 10,
    payload: "foundation-next",
    resultPath: "/results/foundation-next",
  }
  const withFoundation = addFoundationSnapshot(legacyV1, nextFoundation)
  const duplicateFoundation = addFoundationSnapshot(withFoundation, nextFoundation)

  assert.equal(withFoundation.foundation?.payload, "foundation-next")
  assert.equal(withFoundation.foundationHistory.length, 2)
  assert.equal(duplicateFoundation.foundationHistory.length, 2)

  const oldModule = legacyV1.modules.security as ModuleSnapshot
  const nextModule: ModuleSnapshot = {
    ...oldModule,
    timestamp: oldModule.timestamp + 10,
    headline: "New security result",
    resultPath: "/modules/security/results/new",
  }
  const withModule = addModuleSnapshot(legacyV1, nextModule)
  assert.equal(withModule.modules.security?.headline, "New security result")
  assert.deepEqual(
    withModule.moduleHistory.map((snapshot) => snapshot.headline),
    ["Legacy security result", "New security result"],
  )

  const legacyV3 = parseProfileStore(readFixture(3))
  const oldAi = legacyV3.aiGovernance as AiGovernanceSnapshot
  const nextAi: AiGovernanceSnapshot = {
    ...oldAi,
    timestamp: oldAi.timestamp + 10,
    payload: "ai-next",
    resultPath: "/ai/results/ai-next",
  }
  const withAi = addAiGovernanceSnapshot(legacyV3, nextAi)
  assert.equal(withAi.aiGovernance?.payload, "ai-next")
  assert.deepEqual(
    withAi.aiHistory.map((snapshot) => snapshot.payload),
    ["legacy-ai-v1", "ai-next"],
  )
})

test("Perspective Runs append by stable id and can be removed", () => {
  const run: PerspectiveRunSnapshot = {
    locale: "en",
    localeCopyVersion: 1,
    id: "run-1",
    timestamp: 1740000000000,
    perspectiveId: "exposed-ally",
    perspectiveLabel: "Exposed ally or vulnerable small state",
    scenarioSetVersion: 1,
    dimensionScores: {
      securityCompetition: 5,
      institutions: 5,
      domesticFilters: 4,
      normsIdentity: 4,
      politicalEconomy: 4,
      restraint: 3.5,
      orderJustice: 4,
    },
    baselineDeltas: {
      securityCompetition: 1,
      institutions: 1,
      restraint: -0.5,
    },
    strongestShiftKeys: ["securityCompetition", "institutions", "restraint"],
    resultPath: "/perspectives/exposed-ally/result/example",
    payload: "example",
  }

  const added = addPerspectiveRunSnapshot(emptyProfileStore(), run)
  const replaced = addPerspectiveRunSnapshot(added, {
    ...run,
    timestamp: run.timestamp + 1,
  })

  assert.equal(replaced.perspectiveRuns.length, 1)
  assert.equal(replaced.perspectiveRuns[0]?.timestamp, run.timestamp + 1)
  assert.deepEqual(removePerspectiveRunSnapshot(replaced, run.id).perspectiveRuns, [])
})

test("unknown versions, malformed JSON, and invalid current snapshots fail safely", () => {
  assert.deepEqual(parseProfileStore("not-json"), emptyProfileStore())
  assert.deepEqual(parseProfileStore(JSON.stringify({ v: 99 })), emptyProfileStore())

  const legacy = JSON.parse(readFixture(1))
  legacy.foundation.dimensionScores.institutions = 8
  const parsed = parseProfileStore(JSON.stringify(legacy))
  assert.equal(parsed.foundation, null)
  assert.equal(parsed.modules.security?.slug, "security")

  const impossibleDate = JSON.parse(readFixture(1))
  impossibleDate.foundation.timestamp = 1e308
  const impossibleDateProfile = parseProfileStore(JSON.stringify(impossibleDate))
  assert.equal(impossibleDateProfile.foundation, null)
})

test("blocked browser storage fails safely", () => {
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window")
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      localStorage: {
        getItem() {
          throw new Error("blocked")
        },
        setItem() {
          throw new Error("blocked")
        },
      },
    },
  })

  try {
    assert.deepEqual(loadProfileStore(), emptyProfileStore())
    assert.equal(saveProfileStore(emptyProfileStore()), false)
  } finally {
    if (previousWindow) {
      Object.defineProperty(globalThis, "window", previousWindow)
    } else {
      delete (globalThis as { window?: unknown }).window
    }
  }
})
