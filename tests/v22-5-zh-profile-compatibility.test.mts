import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import {
  getProfileResultHref,
  getProfileResultRoute,
} from "@/lib/profile-result-routes"
import { buildLocalizedProfileShareView } from "@/lib/profile-share-locale"
import { parseProfileStore } from "@/lib/profile-store"
import type { PerspectiveRunSnapshot } from "@/lib/perspectives/types"

function readProfileFixture(version: 1 | 3 | 4 | 5) {
  return JSON.parse(
    readFileSync(
      new URL(`./fixtures/profile-store-v${version}.json`, import.meta.url),
      "utf8",
    ),
  )
}

test("Chinese Profile result routes distinguish translated and English-only destinations", () => {
  const foundation = getProfileResultRoute(
    "foundation",
    "/zh/results/foundation-token?source=profile",
  )
  const moduleRoute = getProfileResultRoute(
    "module",
    "/zh/modules/security/results/module-token?foundation=f-token",
  )
  const ai = getProfileResultRoute(
    "ai",
    "/zh/ai/results/ai-token",
  )

  assert.deepEqual(foundation, {
    availability: "translated",
    href: "/results/foundation-token?source=profile",
  })
  assert.deepEqual(moduleRoute, {
    availability: "english-only",
    href: "/modules/security/results/module-token?foundation=f-token",
  })
  assert.deepEqual(ai, {
    availability: "english-only",
    href: "/ai/results/ai-token",
  })
  assert.equal(
    getProfileResultHref(foundation, "zh-Hans"),
    "/zh/results/foundation-token?source=profile",
  )
  assert.equal(
    getProfileResultHref(moduleRoute, "zh-Hans"),
    "/modules/security/results/module-token?foundation=f-token",
  )
  assert.equal(
    getProfileResultHref(ai, "zh-Hans"),
    "/ai/results/ai-token",
  )
})

test("Chinese Profile hydration keeps only translated Foundation paths locale-prefixed", () => {
  const foundationProfile = parseProfileStore(
    JSON.stringify(readProfileFixture(5)),
    "zh-Hans",
  )
  const legacyModule = readProfileFixture(4)
  legacyModule.modules.security.resultPath =
    "/zh/modules/security/results/retired-module?foundation=legacy"
  const moduleProfile = parseProfileStore(
    JSON.stringify(legacyModule),
    "zh-Hans",
  )
  const legacyAi = readProfileFixture(3)
  legacyAi.aiGovernance.resultPath = "/zh/ai/results/legacy-ai-v1"
  const aiProfile = parseProfileStore(
    JSON.stringify(legacyAi),
    "zh-Hans",
  )

  assert.match(
    foundationProfile.foundation?.resultPath ?? "",
    /^\/zh\/results\//,
  )
  assert.equal(
    moduleProfile.modules.security?.resultPath,
    "/modules/security/results/retired-module?foundation=legacy",
  )
  assert.equal(
    aiProfile.aiGovernance?.resultPath,
    "/ai/results/legacy-ai-v1",
  )
})

test("an unresolvable Foundation keeps the localized Profile view and its other records", () => {
  const legacyProfile = parseProfileStore(
    JSON.stringify(readProfileFixture(1)),
    "zh-Hans",
  )
  const aiProfile = parseProfileStore(
    JSON.stringify(readProfileFixture(3)),
    "zh-Hans",
  )
  assert.ok(legacyProfile.foundation)
  assert.ok(aiProfile.aiGovernance)

  const perspective: PerspectiveRunSnapshot = {
    id: "legacy-perspective",
    timestamp: 1730000001000,
    perspectiveId: "exposed-ally",
    perspectiveLabel: "Exposed ally or vulnerable small state",
    scenarioSetVersion: 1,
    dimensionScores: legacyProfile.foundation.dimensionScores,
    baselineDeltas: {},
    strongestShiftKeys: [],
    resultPath:
      "/perspectives/exposed-ally/result/legacy-perspective-token",
    payload: "legacy-perspective-token",
    locale: "zh-Hans",
    localeCopyVersion: 1,
  }
  const profile = {
    ...legacyProfile,
    aiGovernance: aiProfile.aiGovernance,
    aiHistory: [aiProfile.aiGovernance],
    perspectiveRuns: [perspective],
  }

  const view = buildLocalizedProfileShareView(profile, "zh-Hans")

  assert.ok(view)
  assert.equal(view.foundation, null)
  assert.equal(view.title, "基础身份不可用")
  assert.deepEqual(
    view.modules.map((module) => module.slug),
    ["security"],
  )
  assert.equal(view.ai?.label, "协调架构者")
  assert.deepEqual(view.perspectives, [
    {
      id: "legacy-perspective",
      label: "处于暴露位置的盟友或脆弱小国",
    },
  ])
  assert.match(view.provenanceNotice ?? "", /不同语言或文案版本/)
})
