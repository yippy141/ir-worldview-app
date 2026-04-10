import test from "node:test"
import assert from "node:assert/strict"
import {
  buildCrossDomainTensions,
  buildIntegratedHeadline,
} from "@/lib/profile-helpers"
import type { ProfileStore } from "@/lib/profile-store"

const profile: ProfileStore = {
  v: 1,
  foundation: {
    timestamp: 1,
    payload: "payload",
    resultPath: "/results/payload",
    familyKey: "institutionalist",
    familyLabel: "Liberal Institutionalist",
    runnerUpKey: "constructivist",
    runnerUpLabel: "Social Constructivist",
    summary: "Institutionalist-constructivist baseline.",
    dimensionScores: {
      securityCompetition: 4.3,
      institutions: 5.8,
      domesticFilters: 4.9,
      normsIdentity: 5.1,
      politicalEconomy: 4.7,
      restraint: 5.4,
      orderJustice: 5.3,
    },
    strategyModifier: "Restrainer",
    normativeModifier: "Pluralist",
    keyDrivers: [],
    strongLenses: [],
  },
  modules: {
    security: {
      timestamp: 2,
      slug: "security",
      title: "Security",
      mode: "standard",
      headline: "Security read: coalition-centered deterrence",
      summary: "Security summary",
      resultPath: "/modules/security/results/abc",
      scores: {
        activism: 5.5,
        escalation: 5.3,
        alliance: 5.8,
        legitimacy: 5.2,
      },
      instincts: [],
      comparison: "Comparison text",
      challenge: "Challenge text",
      measures: [],
      doesNotClaim: [],
      evidence: [],
    },
    technology: {
      timestamp: 3,
      slug: "technology",
      title: "Technology",
      mode: "standard",
      headline: "Technology read: control with capacity-building",
      summary: "Technology summary",
      resultPath: "/modules/technology/results/def",
      scores: {
        control: 5.8,
        governance: 4.0,
        industrial: 5.4,
        safety: 4.8,
      },
      instincts: [],
      comparison: "Comparison text",
      challenge: "Challenge text",
      measures: [],
      doesNotClaim: [],
      evidence: [],
    },
  },
}

test("integrated headline combines baseline and module overlays without a total score", () => {
  assert.equal(
    buildIntegratedHeadline(profile),
    "Liberal Institutionalist baseline with a restrained strategic style and an order-first normative style; coalition-centered in security, more control-first in technology.",
  )
})

test("cross-domain tensions surface multiple meaningful baseline-to-module shifts", () => {
  const tensions = buildCrossDomainTensions(profile)

  assert.ok(tensions.length >= 2)
  assert.ok(
    tensions.some((tension) => tension.includes("restraint")),
    "expected a restraint-related tension",
  )
  assert.ok(
    tensions.some((tension) => tension.includes("technology")),
    "expected a technology-related tension",
  )
})
