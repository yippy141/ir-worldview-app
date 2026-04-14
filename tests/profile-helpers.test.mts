import test from "node:test"
import assert from "node:assert/strict"
import { buildFoundationNarrative } from "@/lib/narrative/foundation"
import { buildProfileNarrative } from "@/lib/narrative/profile"
import {
  buildCrossDomainTensions,
  buildIntegratedHeadline,
  buildProfileAssessment,
} from "@/lib/profile-helpers"
import type { ProfileStore } from "@/lib/profile-store"

const profile: ProfileStore = {
  v: 2,
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
      shorthand: "Security Pressure",
      mode: "standard",
      headline: "Security read: coalition-centered pressure management",
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
      laneSummaries: [
        {
          key: "deterrence",
          label: "Deterrence and escalation",
          summary: "Lane summary",
          score: 5.4,
          lowLabel: "Crisis-limiting",
          highLabel: "Pressure-forward",
        },
        {
          key: "alliances",
          label: "Alliances and autonomy",
          summary: "Lane summary",
          score: 5.8,
          lowLabel: "Autonomy space",
          highLabel: "Alliance-centered",
        },
        {
          key: "legitimacy",
          label: "Order, legitimacy, and protection",
          summary: "Lane summary",
          score: 5.1,
          lowLabel: "Order-first",
          highLabel: "Protection-sensitive",
        },
      ],
      overlayDeltas: {
        securityCompetition: 0.55,
        institutions: 0.42,
        restraint: -0.7,
        orderJustice: -0.48,
      },
      cardTypeScores: {
        explanation: {
          activism: 5.9,
          legitimacy: 4.4,
        },
        decision: {
          activism: 4.9,
          legitimacy: 5.3,
        },
      },
    },
    technology: {
      timestamp: 3,
      slug: "technology",
      title: "Technology",
      shorthand: "Tech Power",
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
      laneSummaries: [
        {
          key: "controls",
          label: "Controls and dependence",
          summary: "Lane summary",
          score: 5.8,
          lowLabel: "Open by default",
          highLabel: "Control-first",
        },
        {
          key: "capacity",
          label: "Capacity and industrial policy",
          summary: "Lane summary",
          score: 5.4,
          lowLabel: "Market-led",
          highLabel: "State-capacity led",
        },
        {
          key: "governance",
          label: "Governance, access, and safety",
          summary: "Lane summary",
          score: 4.0,
          lowLabel: "National tools",
          highLabel: "Coordinated rules",
        },
      ],
      overlayDeltas: {
        securityCompetition: 0.7,
        institutions: -0.6,
        politicalEconomy: 0.65,
        restraint: -0.35,
      },
      cardTypeScores: {
        explanation: {
          control: 6.0,
          governance: 4.1,
          safety: 4.4,
        },
        decision: {
          control: 5.1,
          governance: 5.0,
          safety: 5.3,
        },
      },
    },
  },
}

test("integrated headline reflects the new profile-state logic without inventing a total score", () => {
  assert.equal(
    buildIntegratedHeadline(profile),
    "Your baseline still reads Liberal Institutionalist, but the saved modules pull it in different directions.",
  )
})

test("profile assessment can classify true tension and name the strongest shift", () => {
  const assessment = buildProfileAssessment(profile)

  assert.equal(assessment.state, "trueTension")
  assert.ok(assessment.changedMost.includes("Security Pressure"))
  assert.ok(assessment.points.length >= 2)
})

test("cross-domain tensions surface both domain conflict and card-type splits", () => {
  const tensions = buildCrossDomainTensions(profile)

  assert.ok(tensions.length >= 3)
  assert.ok(
    tensions.some((tension) => tension.includes("opposite directions on institutions")),
    "expected an institutions conflict",
  )
  assert.ok(
    tensions.some((tension) => tension.includes("Technology reads the domain")),
    "expected a technology explanation-versus-decision tension",
  )
})

test("overlap foundation state surfaces honestly before modules exist", () => {
  const broadProfile: ProfileStore = {
    v: 2,
    foundation: {
      ...profile.foundation!,
      familyKey: "realist",
      familyLabel: "Strategic Realist",
      runnerUpKey: "institutionalist",
      runnerUpLabel: "Liberal Institutionalist",
      summary: "Broad-spectrum baseline",
      dimensionScores: {
        securityCompetition: 4.2,
        institutions: 4.1,
        domesticFilters: 4.0,
        normsIdentity: 3.9,
        politicalEconomy: 4.1,
        restraint: 4.0,
        orderJustice: 3.8,
      },
    },
    modules: {},
  }

  const assessment = buildProfileAssessment(broadProfile)
  const narrative = buildProfileNarrative(broadProfile, assessment)
  const foundationNarrative = buildFoundationNarrative({
    familyKey: "realist",
    runnerUpKey: "institutionalist",
    strategyModifier: broadProfile.foundation.strategyModifier,
    normativeModifier: broadProfile.foundation.normativeModifier,
    dimensionScores: broadProfile.foundation.dimensionScores,
  })

  assert.equal(assessment.state, "lowDifferentiation")
  assert.equal(foundationNarrative.state, "lowDifferentiation")
  assert.ok(narrative.sections[0]?.text.includes("overlap"))
})

test("sharply differentiated foundations can surface before modules are added", () => {
  const sharpProfile: ProfileStore = {
    v: 2,
    foundation: {
      ...profile.foundation!,
      familyKey: "realist",
      familyLabel: "Strategic Realist",
      runnerUpKey: "institutionalist",
      runnerUpLabel: "Liberal Institutionalist",
      summary: "Sharp baseline",
      dimensionScores: {
        securityCompetition: 6.2,
        institutions: 2.5,
        domesticFilters: 3.0,
        normsIdentity: 2.8,
        politicalEconomy: 3.4,
        restraint: 3.0,
        orderJustice: 4.7,
      },
    },
    modules: {},
  }

  const assessment = buildProfileAssessment(sharpProfile)
  const narrative = buildProfileNarrative(sharpProfile, assessment)

  assert.equal(assessment.state, "sharplyDifferentiatedBaseline")
  assert.ok(narrative.sections[0]?.text.includes("clear baseline"))
})

test("profile narrative builds the expected editorial blocks for true tension states", () => {
  const narrative = buildProfileNarrative(profile)

  assert.equal(narrative.sections.length, 5)
  assert.equal(narrative.sections[2]?.title, "Cross-domain tensions")
  assert.ok(narrative.sections[1]?.text.includes("Security"))
})
