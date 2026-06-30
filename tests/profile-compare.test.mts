import test from "node:test"
import assert from "node:assert/strict"
import { buildProfileComparison } from "@/lib/profile-compare"
import type { ProfileStore } from "@/lib/profile-store"

const leftProfile: ProfileStore = {
  v: 2,
  foundation: {
    timestamp: 1,
    payload: "left",
    resultPath: "/results/left",
    familyKey: "institutionalist",
    familyLabel: "Liberal Institutionalist",
    runnerUpKey: "constructivist",
    runnerUpLabel: "Social Constructivist",
    summary: "Left summary",
    dimensionScores: {
      securityCompetition: 4.4,
      institutions: 5.8,
      domesticFilters: 4.9,
      normsIdentity: 5.1,
      politicalEconomy: 4.5,
      restraint: 5.2,
      orderJustice: 5.1,
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
      headline: "headline",
      summary: "summary",
      resultPath: "",
      scores: {},
      instincts: [],
      challenge: "",
      measures: [],
      doesNotClaim: [],
      evidence: [],
      laneSummaries: [
        {
          key: "deterrence",
          label: "Deterrence and escalation",
          summary: "summary",
          score: 5.6,
          lowLabel: "Crisis-limiting",
          highLabel: "Pressure-forward",
        },
        {
          key: "alliances",
          label: "Alliances and autonomy",
          summary: "summary",
          score: 5.7,
          lowLabel: "Autonomy space",
          highLabel: "Alliance-centered",
        },
      ],
      overlayDeltas: {},
    },
    technology: {
      timestamp: 3,
      slug: "technology",
      title: "Technology",
      mode: "standard",
      headline: "headline",
      summary: "summary",
      resultPath: "",
      scores: {},
      instincts: [],
      challenge: "",
      measures: [],
      doesNotClaim: [],
      evidence: [],
      laneSummaries: [
        {
          key: "controls",
          label: "Controls and dependence",
          summary: "summary",
          score: 5.8,
          lowLabel: "Open by default",
          highLabel: "Control-first",
        },
      ],
      overlayDeltas: {},
    },
  },
  aiGovernance: null,
}

const rightProfile: ProfileStore = {
  v: 2,
  foundation: {
    timestamp: 1,
    payload: "right",
    resultPath: "/results/right",
    familyKey: "realist",
    familyLabel: "Strategic Realist",
    runnerUpKey: "institutionalist",
    runnerUpLabel: "Liberal Institutionalist",
    summary: "Right summary",
    dimensionScores: {
      securityCompetition: 6.1,
      institutions: 2.9,
      domesticFilters: 3.5,
      normsIdentity: 3.2,
      politicalEconomy: 3.8,
      restraint: 3.4,
      orderJustice: 4.8,
    },
    strategyModifier: "Maximizer",
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
      headline: "headline",
      summary: "summary",
      resultPath: "",
      scores: {},
      instincts: [],
      challenge: "",
      measures: [],
      doesNotClaim: [],
      evidence: [],
      laneSummaries: [
        {
          key: "deterrence",
          label: "Deterrence and escalation",
          summary: "summary",
          score: 4.4,
          lowLabel: "Crisis-limiting",
          highLabel: "Pressure-forward",
        },
        {
          key: "alliances",
          label: "Alliances and autonomy",
          summary: "summary",
          score: 3.4,
          lowLabel: "Autonomy space",
          highLabel: "Alliance-centered",
        },
      ],
      overlayDeltas: {},
    },
    technology: {
      timestamp: 3,
      slug: "technology",
      title: "Technology",
      mode: "standard",
      headline: "headline",
      summary: "summary",
      resultPath: "",
      scores: {},
      instincts: [],
      challenge: "",
      measures: [],
      doesNotClaim: [],
      evidence: [],
      laneSummaries: [
        {
          key: "controls",
          label: "Controls and dependence",
          summary: "summary",
          score: 3.7,
          lowLabel: "Open by default",
          highLabel: "Control-first",
        },
      ],
      overlayDeltas: {},
    },
  },
  aiGovernance: null,
}

test("profile comparison derives stable overlap and the clearest divergences without a composite score", () => {
  const comparison = buildProfileComparison(leftProfile, rightProfile)

  assert.equal(comparison.foundationRows.length, 7)
  assert.equal(comparison.probableArgument.dimension, "institutions")
  assert.match(comparison.probableArgument.summary, /institutions and rules/i)
  assert.match(comparison.probableArgument.leftStartsFrom, /rules, monitoring/i)
  assert.match(comparison.probableArgument.rightStartsFrom, /power and interests/i)
  assert.match(comparison.probableArgument.caseThatExposesSplit, /defect from a bargain/i)
  assert.match(comparison.sharedStableTrait, /order|sovereignty/i)
  assert.match(comparison.biggestDivergence, /Institutions/i)
  assert.equal(comparison.biggestSecurityDifference?.laneKey, "alliances")
  assert.equal(comparison.biggestTechnologyDifference?.laneKey, "controls")
})
