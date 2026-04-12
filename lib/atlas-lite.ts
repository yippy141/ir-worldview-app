import type { ModuleSlug } from "@/lib/modules/types"
import {
  assessFoundationNarrative,
  type FoundationNarrativeState,
} from "@/lib/narrative/foundation"
import type { ProfileState } from "@/lib/profile-helpers"
import type { FoundationSnapshot, ModuleSnapshot } from "@/lib/profile-store"
import type {
  DimensionKey, DimensionScores, FamilyKey, NormativeModifier, StrategyModifier,
} from "@/lib/types"

type DimensionHint = {
  min?: number
  max?: number
}

type AtlasPatternRules = {
  families?: FamilyKey[]
  runnerUps?: FamilyKey[]
  strategyModifiers?: StrategyModifier[]
  normativeModifiers?: NormativeModifier[]
  foundationStates?: FoundationNarrativeState[]
  profileStates?: ProfileState[]
  prefersModules?: ModuleSlug[]
  dimensionHints?: Partial<Record<DimensionKey, DimensionHint>>
}

export type AtlasLitePattern = {
  id: string
  name: string
  description: string
  strongestLikelyDrivers: string[]
  likelyModuleShifts: {
    security: string
    technology: string
  }
  neighborIds: string[]
  rules: AtlasPatternRules
}

export type AtlasLiteMatch = {
  nearest: AtlasLitePattern
  neighbors: AtlasLitePattern[]
}

type AtlasMatchContext = {
  familyKey: FamilyKey
  runnerUpKey: FamilyKey
  strategyModifier: StrategyModifier
  normativeModifier: NormativeModifier
  dimensionScores: DimensionScores
  foundationState: FoundationNarrativeState
  profileState?: ProfileState
  moduleSlugs?: ModuleSlug[]
}

export const atlasLitePatterns: AtlasLitePattern[] = [
  {
    id: "broad-spectrum-bridge-builder",
    name: "Broad-Spectrum Bridge Builder",
    description:
      "Several neighboring traditions remain live, so the best read is an overlapping profile rather than a sharply sorted camp.",
    strongestLikelyDrivers: [
      "Most dimensions stay relatively close to the midpoint.",
      "The nearest-fit gap between traditions stays narrow.",
      "Restraint and order-justice judgments remain genuinely mixed.",
    ],
    likelyModuleShifts: {
      security:
        "Security is the cleaner pressure test: it often reveals whether coalition management, crisis ceilings, or harder deterrence actually comes first.",
      technology:
        "Technology often reveals whether openness, dependence, and public capacity sort more sharply than the baseline does.",
    },
    neighborIds: ["coalition-pragmatist", "cross-pressured-synthesizer"],
    rules: {
      foundationStates: ["lowDifferentiation"],
      profileStates: ["lowDifferentiation", "stableModeration"],
      dimensionHints: {
        securityCompetition: { min: 3.2, max: 4.8 },
        institutions: { min: 3.2, max: 5.0 },
        restraint: { min: 3.1, max: 4.9 },
        orderJustice: { min: 3.1, max: 4.9 },
      },
    },
  },
  {
    id: "constraint-first-realist",
    name: "Constraint-First Realist",
    description:
      "Competition is taken seriously, but the strategic emphasis falls on limits, ceilings, and the costs of overextension.",
    strongestLikelyDrivers: [
      "High security-competition scores keep rivalry and uncertainty active.",
      "A high restraint score tempers the realist baseline.",
      "Order and precedent usually matter more than expansive moral claims.",
    ],
    likelyModuleShifts: {
      security:
        "Security often sharpens the preference for bounded posture, reinforcement depth, and crisis-limiting responses.",
      technology:
        "Technology may still push this pattern toward narrower controls when chokepoints look strategically exposed.",
    },
    neighborIds: ["competitive-balancer", "coalition-pragmatist"],
    rules: {
      families: ["realist"],
      strategyModifiers: ["Restrainer"],
      dimensionHints: {
        securityCompetition: { min: 5.0 },
        restraint: { min: 5.0 },
        orderJustice: { min: 4.3 },
      },
    },
  },
  {
    id: "competitive-balancer",
    name: "Competitive Balancer",
    description:
      "The profile returns first to rivalry, leverage, and credible positioning, with more willingness to press advantage when the opening looks real.",
    strongestLikelyDrivers: [
      "Security competition is a dominant explanatory signal.",
      "Restraint is lower or more conditional than in a restraint-first profile.",
      "Institutions are usually read through power rather than as independent anchors.",
    ],
    likelyModuleShifts: {
      security:
        "Security tends to reinforce visible deterrence, resolve signaling, and earlier pressure under ambiguity.",
      technology:
        "Technology often reinforces chokepoint protection and dependence management, especially in semiconductors or export controls.",
    },
    neighborIds: ["constraint-first-realist", "structural-inequality-critic"],
    rules: {
      families: ["realist"],
      strategyModifiers: ["Hedger", "Maximizer"],
      dimensionHints: {
        securityCompetition: { min: 5.0 },
        restraint: { max: 4.2 },
      },
    },
  },
  {
    id: "coalition-pragmatist",
    name: "Coalition Pragmatist",
    description:
      "The profile favors workable coordination, durable partner alignment, and issue-specific cooperation over either pure bloc discipline or pure autonomy.",
    strongestLikelyDrivers: [
      "Institutions matter, but mostly when they can carry real coordination.",
      "Restraint is moderate to high rather than power-maximizing.",
      "The runner-up often remains realist, reflecting awareness of pressure and capture.",
    ],
    likelyModuleShifts: {
      security:
        "Security often becomes alliance-centered, with exposed partners and coalition endurance treated as part of deterrence itself.",
      technology:
        "Technology usually leans toward coordinated controls, shared standards, and trusted production networks over unilateral closure.",
    },
    neighborIds: ["institution-builder", "constraint-first-realist"],
    rules: {
      families: ["institutionalist"],
      runnerUps: ["realist", "constructivist"],
      strategyModifiers: ["Restrainer", "Hedger"],
      dimensionHints: {
        institutions: { min: 5.0 },
        restraint: { min: 4.1 },
        securityCompetition: { min: 3.8, max: 5.5 },
      },
    },
  },
  {
    id: "institution-builder",
    name: "Institution Builder",
    description:
      "The profile sees rules, monitoring, and repeated interaction as the strongest route to durable cooperation, even under pressure.",
    strongestLikelyDrivers: [
      "Institutions are clearly above the midpoint and often among the top signals.",
      "Domestic filters often matter as part of what states can credibly commit to.",
      "The baseline does not require a hard rivalry frame to make sense of most cases.",
    ],
    likelyModuleShifts: {
      security:
        "Security often keeps the coalition lens active while forcing harder choices about reassurance, authorization, and ceilings.",
      technology:
        "Technology usually favors coordinated governance, narrow controls, and shared infrastructure over national duplication.",
    },
    neighborIds: ["coalition-pragmatist", "legitimacy-attuned-reader"],
    rules: {
      families: ["institutionalist"],
      strategyModifiers: ["Restrainer", "Hedger"],
      dimensionHints: {
        institutions: { min: 5.4 },
        domesticFilters: { min: 4.4 },
        securityCompetition: { max: 4.9 },
      },
    },
  },
  {
    id: "legitimacy-attuned-reader",
    name: "Legitimacy-Attuned Reader",
    description:
      "The profile treats identity, framing, and recognition as causally real, while still keeping live questions about order and political durability.",
    strongestLikelyDrivers: [
      "Norms and identity are among the strongest explanatory signals.",
      "The order-justice dimension is rarely treated as already settled.",
      "The runner-up often remains institutionalist or realist, reflecting practical guardrails around the constructivist baseline.",
    ],
    likelyModuleShifts: {
      security:
        "Security often raises the salience of regional legitimacy, bounded action, and the meaning partners assign to the same move.",
      technology:
        "Technology tends to sharpen questions of governance legitimacy, access, and who gets to define safety baselines.",
    },
    neighborIds: ["justice-forward-solidarist", "institution-builder"],
    rules: {
      families: ["constructivist"],
      dimensionHints: {
        normsIdentity: { min: 5.2 },
        institutions: { min: 3.8, max: 5.6 },
      },
    },
  },
  {
    id: "justice-forward-solidarist",
    name: "Justice-Forward Solidarist",
    description:
      "The profile keeps open the possibility that severe moral stakes can override sovereignty, especially when legitimacy and human protection remain active together.",
    strongestLikelyDrivers: [
      "Order-justice scores are justice-sensitive rather than order-first.",
      "Norms and legitimacy remain high rather than rhetorical.",
      "Universalist or conditional-solidarist instincts stay visible in the baseline.",
    ],
    likelyModuleShifts: {
      security:
        "Security often sharpens the tension between civilian protection, legal grounding, and the risk of open-ended intervention.",
      technology:
        "Technology usually surfaces concern for access, safety, and the distribution of harms rather than capability alone.",
    },
    neighborIds: ["legitimacy-attuned-reader", "cross-pressured-synthesizer"],
    rules: {
      families: ["constructivist", "institutionalist"],
      normativeModifiers: ["Universalist", "Conditional Solidarist"],
      dimensionHints: {
        normsIdentity: { min: 5.0 },
        orderJustice: { max: 3.9 },
      },
    },
  },
  {
    id: "structural-inequality-critic",
    name: "Structural Inequality Critic",
    description:
      "The profile reads world politics through leverage, dependence, and unequal control over production, finance, and rule-setting.",
    strongestLikelyDrivers: [
      "Political economy is a primary rather than secondary signal.",
      "Institutions are often read as structured by hierarchy rather than neutral problem-solvers.",
      "Domestic filters frequently matter because external dependence is transmitted through internal political economy.",
    ],
    likelyModuleShifts: {
      security:
        "Security often surfaces skepticism toward sanctions, improvised hierarchy, and bloc discipline when weaker states bear the adjustment costs.",
      technology:
        "Technology usually sharpens concern about chokepoints, unequal access, and who gets locked out of industrial depth.",
    },
    neighborIds: ["development-sovereignty-builder", "competitive-balancer"],
    rules: {
      families: ["criticalPoliticalEconomy"],
      dimensionHints: {
        politicalEconomy: { min: 5.2 },
        domesticFilters: { min: 4.2 },
      },
    },
  },
  {
    id: "development-sovereignty-builder",
    name: "Development-Sovereignty Builder",
    description:
      "The profile is preoccupied with policy room, productive depth, and avoiding forms of dependence that close off future bargaining space.",
    strongestLikelyDrivers: [
      "Political economy and domestic capacity matter together.",
      "The profile worries about lock-in, not just immediate rivalry.",
      "The nearest neighbor is often institutionalist or critical political economy rather than pure realism.",
    ],
    likelyModuleShifts: {
      security:
        "Security often leans toward autonomy-sensitive or middle-power hedging logic rather than rigid bloc alignment.",
      technology:
        "Technology tends to sharpen support for public capacity, trusted infrastructure, and diversified dependence rather than either full autarky or pure openness.",
    },
    neighborIds: ["structural-inequality-critic", "coalition-pragmatist"],
    rules: {
      families: ["criticalPoliticalEconomy", "institutionalist"],
      runnerUps: ["criticalPoliticalEconomy", "institutionalist"],
      dimensionHints: {
        politicalEconomy: { min: 4.8 },
        domesticFilters: { min: 4.8 },
      },
    },
  },
  {
    id: "cross-pressured-synthesizer",
    name: "Cross-Pressured Synthesizer",
    description:
      "The most useful read is not a single stable doctrine. Different domains or card types pull the profile in materially different directions.",
    strongestLikelyDrivers: [
      "Saved overlays create a real domain-conditioned shift or cross-domain tension.",
      "Explanation and decision logics do not collapse neatly into one line.",
      "The baseline remains useful, but not as a domain-invariant reflex.",
    ],
    likelyModuleShifts: {
      security:
        "Security often reveals whether the profile explains crises in harder terms than it is willing to endorse once legitimacy and escalation costs are explicit.",
      technology:
        "Technology often reveals whether strategic diagnoses still end in coordination, safety, or access-oriented policy choices.",
    },
    neighborIds: ["broad-spectrum-bridge-builder", "legitimacy-attuned-reader"],
    rules: {
      profileStates: ["trueTension", "domainConditionedShift"],
    },
  },
]

const ATLAS_PATTERN_MAP = Object.fromEntries(
  atlasLitePatterns.map((pattern) => [pattern.id, pattern]),
) as Record<string, AtlasLitePattern>

export function getAtlasLitePattern(id: string) {
  return ATLAS_PATTERN_MAP[id] ?? null
}

export function getAtlasLitePatterns() {
  return atlasLitePatterns
}

export function matchAtlasLiteFoundation(input: {
  familyKey: FamilyKey
  runnerUpKey: FamilyKey
  strategyModifier: StrategyModifier
  normativeModifier: NormativeModifier
  dimensionScores: DimensionScores
  foundationState: FoundationNarrativeState
}): AtlasLiteMatch {
  return matchAtlasLite({
    ...input,
  })
}

export function matchAtlasLiteProfile(input: {
  foundation: FoundationSnapshot
  profileState: ProfileState
  moduleSnapshots: ModuleSnapshot[]
}): AtlasLiteMatch {
  return matchAtlasLite({
    familyKey: input.foundation.familyKey,
    runnerUpKey: input.foundation.runnerUpKey,
    strategyModifier: input.foundation.strategyModifier,
    normativeModifier: input.foundation.normativeModifier,
    dimensionScores: input.foundation.dimensionScores,
    foundationState: assessFoundationNarrative(input.foundation.dimensionScores).state,
    profileState: input.profileState,
    moduleSlugs: input.moduleSnapshots.map((snapshot) => snapshot.slug),
  })
}

function matchAtlasLite(context: AtlasMatchContext): AtlasLiteMatch {
  const ordered = atlasLitePatterns
    .map((pattern) => ({
      pattern,
      score: scorePattern(pattern, context),
    }))
    .sort((a, b) => b.score - a.score)

  const nearest = ordered[0]?.pattern ?? atlasLitePatterns[0]
  const neighbors = nearest.neighborIds
    .map((neighborId) => getAtlasLitePattern(neighborId))
    .filter((pattern): pattern is AtlasLitePattern => Boolean(pattern))
    .slice(0, 2)

  return {
    nearest,
    neighbors,
  }
}

function scorePattern(pattern: AtlasLitePattern, context: AtlasMatchContext) {
  let score = 0

  score += scoreMembership(pattern.rules.families, context.familyKey, 2.4)
  score += scoreMembership(pattern.rules.runnerUps, context.runnerUpKey, 0.8)
  score += scoreMembership(pattern.rules.strategyModifiers, context.strategyModifier, 1.15)
  score += scoreMembership(pattern.rules.normativeModifiers, context.normativeModifier, 1.15)
  score += scoreMembership(pattern.rules.foundationStates, context.foundationState, 3.2)

  if (pattern.rules.profileStates) {
    score += context.profileState
      ? scoreMembership(pattern.rules.profileStates, context.profileState, 9.2)
      : pattern.rules.foundationStates
        ? 0
        : -1.2
  }

  if (pattern.rules.prefersModules && context.moduleSlugs) {
    for (const slug of pattern.rules.prefersModules) {
      if (context.moduleSlugs.includes(slug)) {
        score += 0.4
      }
    }
  }

  if (pattern.rules.dimensionHints) {
    for (const [dimension, hint] of Object.entries(pattern.rules.dimensionHints) as [
      DimensionKey,
      DimensionHint,
    ][]) {
      score += scoreDimensionHint(context.dimensionScores[dimension], hint)
    }
  }

  return Number(score.toFixed(2))
}

function scoreMembership<T extends string>(values: T[] | undefined, current: T, weight: number) {
  if (!values || values.length === 0) return 0
  return values.includes(current) ? weight : 0
}

function scoreDimensionHint(value: number, hint: DimensionHint) {
  let score = 0

  if (hint.min !== undefined) {
    if (value >= hint.min) {
      score += 0.65
    } else if (hint.min - value <= 0.35) {
      score += 0.18
    }
  }

  if (hint.max !== undefined) {
    if (value <= hint.max) {
      score += 0.65
    } else if (value - hint.max <= 0.35) {
      score += 0.18
    }
  }

  return score
}
