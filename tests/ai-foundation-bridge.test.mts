import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { buildAiFoundationBaseline } from "@/lib/ai-foundation-baseline"
import type { FoundationSnapshot } from "@/lib/profile-store"
import { buildCanonicalFoundationResult } from "@/lib/scoring"
import {
  buildFoundationSharePayload,
  encodePayload,
} from "@/lib/share"

const frozenV2FoundationPayload =
  "eyJ2IjoyLCJkcyI6WzYuMjUsMi41LDQsMy43NSw1LjUsNC4yNSwyLjc1XSwiZmsiOiJyZWFsaXN0IiwibmsiOiJpbnN0aXR1dGlvbmFsaXN0Iiwic20iOiJIZWRnZXIiLCJubSI6IkNvbmRpdGlvbmFsIFNvbGlkYXJpc3QifQ"

function snapshot(payload: string): FoundationSnapshot {
  return {
    timestamp: 1,
    payload,
    instrumentStructuralVersion: 4,
    scoringVersion: 2,
    resultPath: `/results/${payload}`,
    familyKey: "criticalPoliticalEconomy",
    familyLabel: "Conflicting cached family",
    runnerUpKey: "constructivist",
    runnerUpLabel: "Conflicting cached runner-up",
    summary: "Conflicting cached summary",
    dimensionScores: {
      securityCompetition: 7,
      institutions: 1,
      domesticFilters: 7,
      normsIdentity: 1,
      politicalEconomy: 7,
      restraint: 1,
      orderJustice: 7,
    },
    strategyModifier: "Maximizer",
    normativeModifier: "Universalist",
    keyDrivers: [],
    strongLenses: [],
    locale: "en",
    localeCopyVersion: 1,
  }
}

test("saved Foundation archetype is the AI baseline and tradition is subordinate", () => {
  const baseline = buildAiFoundationBaseline(
    snapshot(frozenV2FoundationPayload),
  )
  assert.deepEqual(baseline, {
    status: "resolved",
    primaryLabel: "Shi (勢)",
    secondaryLabel: "Closest modeled tradition: Realism",
  })
  assert.doesNotMatch(JSON.stringify(baseline), /Conflicting cached/u)
})

test("a payload-resolved Foundation blend remains a legitimate baseline", () => {
  const result = buildCanonicalFoundationResult(
    {
      securityCompetition: 1,
      institutions: 1,
      domesticFilters: 4,
      normsIdentity: 4,
      politicalEconomy: 4,
      restraint: 4,
      orderJustice: 4,
    },
    "core",
  )
  const payload = encodePayload(buildFoundationSharePayload(result, "en", "core"))
  const baseline = buildAiFoundationBaseline(snapshot(payload))
  assert.equal(baseline.status, "resolved")
  assert.match(baseline.primaryLabel, /–/u)
  assert.match(baseline.secondaryLabel, /^Closest modeled tradition:/u)
})

test("an archived or unresolvable Foundation record degrades honestly", () => {
  assert.deepEqual(buildAiFoundationBaseline(snapshot("not-a-payload")), {
    status: "archived-unresolvable",
    primaryLabel: "Archived Foundation result",
    secondaryLabel:
      "This saved record cannot be resolved through its original payload contract.",
  })
})

test("AI landing and result copy make no relationship inference", () => {
  const component = readFileSync(
    new URL("../components/ai/ai-project-bridge.tsx", import.meta.url),
    "utf8",
  )
  const landing = readFileSync(
    new URL("../app/ai/page.tsx", import.meta.url),
    "utf8",
  )
  assert.match(component, /buildAiFoundationBaseline/u)
  assert.match(component, /Separate reads — no reviewed bridge/u)
  assert.match(component, /no relationship is inferred/u)
  assert.match(component, /does not infer alignment/u)
  assert.doesNotMatch(component, /foundation\.familyLabel/u)
  assert.doesNotMatch(component, /asks how that view travels/u)
  assert.doesNotMatch(component, /governing instincts behave/u)
  assert.match(landing, /<AiProjectBridge mode="landing" \/>/u)
})
