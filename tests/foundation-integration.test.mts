import test from "node:test"
import assert from "node:assert/strict"
import { analyzeScoreShape, generateResult, getNeighboringFamilyKey } from "@/lib/scoring"
import { dimensionScoresToArray, encodePayload, resolveFoundationPayload } from "@/lib/share"
import type {
  Answers,
  DimensionScores,
  FamilyKey,
  NormativeModifier,
  StrategyModifier,
} from "@/lib/types"

type FoundationFixture = {
  name: string
  answers: Answers
  expected: {
    familyKey: FamilyKey
    runnerUpKey: FamilyKey
    strategyModifier: StrategyModifier
    normativeModifier: NormativeModifier
    dimensionScores: DimensionScores
    familyScores: Record<FamilyKey, number>
    nearestFitGap: number
    averageDistanceFromCenter: number
    maxDistanceFromCenter: number
    sharpDimensionCount: number
  }
}

const fixtures: FoundationFixture[] = [
  {
    name: "realist-like",
    answers: {
      sc1: 7,
      in1: 1,
      df1: 4,
      ni1: 1,
      pe1: 4,
      rs1: 1,
      oj1: 4,
      tradeoff_alliances: "power",
      sc2: 7,
      in2: 1,
      df2: 4,
      ni2: 1,
      pe2: 4,
      rs2: 1,
      oj2: 4,
      tradeoff_interdependence: "rivalry",
      tradeoff_strategy: "press",
      tradeoff_intervention: "protection",
      case_semiconductors: "edge",
      case_protection: "moral",
    },
    expected: {
      familyKey: "realist",
      runnerUpKey: "criticalPoliticalEconomy",
      strategyModifier: "Maximizer",
      normativeModifier: "Universalist",
      dimensionScores: {
        securityCompetition: 6.48,
        institutions: 2.16,
        domesticFilters: 4,
        normsIdentity: 2.9,
        politicalEconomy: 4.27,
        restraint: 2.5,
        orderJustice: 3.17,
      },
      familyScores: {
        realist: 15.21,
        institutionalist: -12.7,
        constructivist: -9.32,
        criticalPoliticalEconomy: 2.77,
      },
      nearestFitGap: 12.44,
      averageDistanceFromCenter: 1.15,
      maxDistanceFromCenter: 2.48,
      sharpDimensionCount: 3,
    },
  },
  {
    name: "institutionalist-like",
    answers: {
      sc1: 4,
      in1: 7,
      df1: 7,
      ni1: 4,
      pe1: 4,
      rs1: 7,
      oj1: 4,
      tradeoff_alliances: "rules",
      sc2: 4,
      in2: 7,
      df2: 7,
      ni2: 4,
      pe2: 4,
      rs2: 7,
      oj2: 4,
      tradeoff_interdependence: "rules",
      tradeoff_strategy: "base",
      tradeoff_intervention: "mandate",
      case_semiconductors: "coalition",
      case_protection: "bounded",
    },
    expected: {
      familyKey: "institutionalist",
      runnerUpKey: "constructivist",
      strategyModifier: "Restrainer",
      normativeModifier: "Conditional Solidarist",
      dimensionScores: {
        securityCompetition: 3.98,
        institutions: 6.39,
        domesticFilters: 6.77,
        normsIdentity: 4,
        politicalEconomy: 4.1,
        restraint: 5.44,
        orderJustice: 4.15,
      },
      familyScores: {
        realist: -6.75,
        institutionalist: 10.52,
        constructivist: -1.59,
        criticalPoliticalEconomy: -3.94,
      },
      nearestFitGap: 12.11,
      averageDistanceFromCenter: 0.98,
      maxDistanceFromCenter: 2.77,
      sharpDimensionCount: 3,
    },
  },
  {
    name: "constructivist-like",
    answers: {
      sc1: 4,
      in1: 4,
      df1: 4,
      ni1: 7,
      pe1: 4,
      rs1: 4,
      oj1: 4,
      tradeoff_alliances: "meaning",
      sc2: 4,
      in2: 4,
      df2: 4,
      ni2: 7,
      pe2: 4,
      rs2: 4,
      oj2: 4,
      tradeoff_interdependence: "rules",
      tradeoff_strategy: "base",
      tradeoff_intervention: "precedent",
      case_semiconductors: "framing",
      case_protection: "law",
    },
    expected: {
      familyKey: "constructivist",
      runnerUpKey: "institutionalist",
      strategyModifier: "Restrainer",
      normativeModifier: "Pluralist",
      dimensionScores: {
        securityCompetition: 3.63,
        institutions: 4.88,
        domesticFilters: 4.77,
        normsIdentity: 6.53,
        politicalEconomy: 4.1,
        restraint: 4.84,
        orderJustice: 5.2,
      },
      familyScores: {
        realist: -5.09,
        institutionalist: 1.45,
        constructivist: 9.8,
        criticalPoliticalEconomy: -3.18,
      },
      nearestFitGap: 8.35,
      averageDistanceFromCenter: 0.96,
      maxDistanceFromCenter: 2.53,
      sharpDimensionCount: 2,
    },
  },
  {
    name: "critical-political-economy-like",
    answers: {
      sc1: 4,
      in1: 1,
      df1: 7,
      ni1: 4,
      pe1: 7,
      rs1: 4,
      oj1: 4,
      tradeoff_alliances: "domestic",
      sc2: 4,
      in2: 1,
      df2: 7,
      ni2: 4,
      pe2: 7,
      rs2: 4,
      oj2: 4,
      tradeoff_interdependence: "structure",
      tradeoff_strategy: "industrial",
      tradeoff_intervention: "consequences",
      case_semiconductors: "dependence",
      case_protection: "prudence",
    },
    expected: {
      familyKey: "criticalPoliticalEconomy",
      runnerUpKey: "realist",
      strategyModifier: "Restrainer",
      normativeModifier: "Universalist",
      dimensionScores: {
        securityCompetition: 4.44,
        institutions: 2.6,
        domesticFilters: 5.94,
        normsIdentity: 4,
        politicalEconomy: 6.6,
        restraint: 4.87,
        orderJustice: 4.03,
      },
      familyScores: {
        realist: 3.76,
        institutionalist: -6.3,
        constructivist: -4.07,
        criticalPoliticalEconomy: 10.68,
      },
      nearestFitGap: 6.92,
      averageDistanceFromCenter: 1.04,
      maxDistanceFromCenter: 2.6,
      sharpDimensionCount: 3,
    },
  },
  {
    name: "mixed cross-pressured",
    answers: {
      sc1: 4,
      in1: 4,
      df1: 4,
      ni1: 4,
      pe1: 4,
      rs1: 4,
      oj1: 4,
      tradeoff_alliances: "domestic",
      sc2: 4,
      in2: 4,
      df2: 4,
      ni2: 4,
      pe2: 4,
      rs2: 4,
      oj2: 4,
      tradeoff_interdependence: "rules",
      tradeoff_strategy: "press",
      tradeoff_intervention: "mandate",
      case_semiconductors: "edge",
      case_protection: "bounded",
    },
    expected: {
      familyKey: "realist",
      runnerUpKey: "institutionalist",
      strategyModifier: "Maximizer",
      normativeModifier: "Conditional Solidarist",
      dimensionScores: {
        securityCompetition: 5.13,
        institutions: 4.83,
        domesticFilters: 4.77,
        normsIdentity: 4,
        politicalEconomy: 4.1,
        restraint: 4.05,
        orderJustice: 4.15,
      },
      familyScores: {
        realist: 2.75,
        institutionalist: -0.07,
        constructivist: -2.74,
        criticalPoliticalEconomy: -3.46,
      },
      nearestFitGap: 2.82,
      averageDistanceFromCenter: 0.43,
      maxDistanceFromCenter: 1.13,
      sharpDimensionCount: 0,
    },
  },
]

for (const fixture of fixtures) {
  test(`Foundation answer fixture generates stable result contract: ${fixture.name}`, () => {
    const generated = generateResult(fixture.answers, "standard")
    const payload = encodePayload({
      v: 2,
      ds: dimensionScoresToArray(generated.dimensionScores),
      fk: generated.familyKey,
      nk: getNeighboringFamilyKey(generated.familyKey, generated.familyScores),
      sm: generated.strategyModifier,
      nm: generated.normativeModifier,
    })
    const resolved = resolveFoundationPayload(payload)

    assert.ok(resolved, `Expected ${fixture.name} payload to resolve.`)
    assert.equal(resolved.result.familyKey, fixture.expected.familyKey)
    assert.equal(resolved.result.runnerUpKey, fixture.expected.runnerUpKey)
    assert.equal(resolved.result.strategyModifier, fixture.expected.strategyModifier)
    assert.equal(resolved.result.normativeModifier, fixture.expected.normativeModifier)
    assert.deepEqual(resolved.dimensionScores, fixture.expected.dimensionScores)
    assert.deepEqual(resolved.result.familyScores, fixture.expected.familyScores)

    const shape = analyzeScoreShape(resolved.dimensionScores)
    assert.equal(shape.orderedFamilies[0][0], fixture.expected.familyKey)
    assert.equal(Number(shape.nearestFitGap.toFixed(2)), fixture.expected.nearestFitGap)
    assert.equal(
      Number(shape.averageDistanceFromCenter.toFixed(2)),
      fixture.expected.averageDistanceFromCenter,
    )
    assert.equal(
      Number(shape.maxDistanceFromCenter.toFixed(2)),
      fixture.expected.maxDistanceFromCenter,
    )
    assert.equal(shape.sharpDimensionCount, fixture.expected.sharpDimensionCount)
  })
}
