import type {
  DimensionKey,
  DimensionScores,
  FamilyKey,
  NormativeModifier,
  StrategyModifier,
} from "@/lib/types"

export type FoundationPayoffInput = {
  dimensionScores: DimensionScores
  familyKey: FamilyKey
  familyLabel: string
  runnerUpKey: FamilyKey
  runnerUpLabel: string
  strategyModifier: StrategyModifier
  normativeModifier: NormativeModifier
}

export type FoundationPayoff = {
  corePattern: {
    noticeFirst: string
    distrust: string
    underweight: string
  }
  mainTension: {
    title: string
    body: string
    rivalArgument: string
  }
  liveDebates: Array<{
    title: string
    text: string
  }>
  nextStep: {
    href: string
    label: string
    reason: string
  }
}

type Direction = "high" | "low" | "middle"

type TensionKey =
  | "low-differentiation"
  | "rules-leverage"
  | "restraint-advantage"
  | "order-justice"
  | "legitimacy-pressure"
  | "dependence-diplomacy"
  | "rivalry-cooperation"

const familyFrames: Record<
  FamilyKey,
  {
    noticeFirst: string
    distrust: string
    underweight: string
    debateLens: Record<string, string>
  }
> = {
  realist: {
    noticeFirst: "You first ask whether power, credible threats, and rivalry will override declared intentions.",
    distrust: "You tend to distrust cooperation that depends on goodwill without leverage or enforcement.",
    underweight:
      "You may underweight cases where rules, identity, or economic dependence change what actors want in the first place.",
    debateLens: {
      "Great-power rivalry": "Look for incentives, credible costs, and escalation limits before trusting public assurances.",
      "Technology competition": "Ask where dependence creates vulnerability and who can control the key chokepoints.",
      "Sanctions and supply chains": "Watch whether pressure can actually change behavior, not only whether it signals resolve.",
      "Humanitarian crisis": "Test moral urgency against precedent, escalation risk, and the durability of any settlement.",
    },
  },
  institutionalist: {
    noticeFirst: "You first ask whether rules, monitoring, and repeated cooperation can change incentives.",
    distrust: "You tend to distrust pure power explanations that ignore institutions that make cheating costly.",
    underweight:
      "You may underweight how quickly rules weaken when powerful actors decide the bargain no longer serves them.",
    debateLens: {
      "Great-power rivalry": "Ask whether institutions can reduce misperception or lock in narrow cooperation despite rivalry.",
      "Technology competition": "Look for standards, inspections, and coalitions that make risky behavior harder to hide.",
      "Sanctions and supply chains": "Ask whether coordination spreads costs and makes pressure more legitimate.",
      "Humanitarian crisis": "Look for authorization, thresholds, and burden-sharing before trusting unilateral action.",
    },
  },
  constructivist: {
    noticeFirst: "You first ask how legitimacy, identity, and shared expectations shape what actors think is possible.",
    distrust: "You tend to distrust accounts that treat interests as fixed before the argument even begins.",
    underweight:
      "You may underweight material leverage, enforcement, and the hard limits imposed by coercive power.",
    debateLens: {
      "Great-power rivalry": "Ask how threat images, status, and historical memory shape the meaning of each move.",
      "Technology competition": "Look at which narratives make openness, control, or sovereignty seem legitimate.",
      "Sanctions and supply chains": "Ask whether pressure changes norms and identities, not only material incentives.",
      "Humanitarian crisis": "Watch how legitimacy, recognition, and responsibility are framed by the actors involved.",
    },
  },
  criticalPoliticalEconomy: {
    noticeFirst: "You first ask who benefits from the economic structure behind the policy choice.",
    distrust: "You tend to distrust neutral language that hides hierarchy, dependence, or unequal adjustment costs.",
    underweight:
      "You may underweight security fears, institutional constraints, or identity claims that are not just covers for material interest.",
    debateLens: {
      "Great-power rivalry": "Ask who profits from the rivalry frame and which dependencies it leaves untouched.",
      "Technology competition": "Look for ownership, labor, data, finance, and who captures the gains from control.",
      "Sanctions and supply chains": "Ask who absorbs the costs and who controls the chokepoints that make pressure bite.",
      "Humanitarian crisis": "Look at the political economy of vulnerability, reconstruction, debt, and outside leverage.",
    },
  },
}

const rivalArguments: Record<FamilyKey, string> = {
  realist: "The realist challenge is that power and security incentives may survive every appeal to rules or legitimacy.",
  institutionalist:
    "The institutionalist challenge is that rules can change incentives when monitoring, repetition, and costs are real.",
  constructivist:
    "The constructivist challenge is that legitimacy and identity can change what actors think their interests are.",
  criticalPoliticalEconomy:
    "The political-economy challenge is that hierarchy and dependence may be doing more work than diplomacy admits.",
}

const dimensionFrames: Record<
  DimensionKey,
  {
    high: string
    low: string
  }
> = {
  securityCompetition: {
    high: "rivalry and uncertainty",
    low: "room for cooperation beyond rivalry",
  },
  institutions: {
    high: "rules and monitoring",
    low: "power underneath institutions",
  },
  domesticFilters: {
    high: "domestic politics inside foreign policy",
    low: "external pressure over domestic variation",
  },
  normsIdentity: {
    high: "legitimacy and identity",
    low: "material incentives over norm language",
  },
  politicalEconomy: {
    high: "markets, hierarchy, and dependence",
    low: "security and diplomacy before economic structure",
  },
  restraint: {
    high: "restraint and avoiding overextension",
    low: "pressing advantage when openings appear",
  },
  orderJustice: {
    high: "order and sovereignty",
    low: "justice claims that can override sovereignty",
  },
}

export function buildFoundationPayoff(input: FoundationPayoffInput): FoundationPayoff {
  const familyFrame = familyFrames[input.familyKey]
  const primaryDimension = getStrongestDimension(input.dimensionScores)
  const primaryFrame = describeDimension(primaryDimension, input.dimensionScores[primaryDimension])
  const tensionKey = selectTension(input, primaryDimension)

  return {
    corePattern: {
      noticeFirst: `${familyFrame.noticeFirst} In this result, the strongest pull is around ${primaryFrame}.`,
      distrust: familyFrame.distrust,
      underweight: `${familyFrame.underweight} ${input.runnerUpLabel} is the nearest comparison point.`,
    },
    mainTension: buildMainTension(tensionKey, input),
    liveDebates: Object.entries(familyFrame.debateLens).map(([title, text]) => ({
      title,
      text,
    })),
    nextStep: buildNextStep(tensionKey),
  }
}

function getStrongestDimension(scores: DimensionScores): DimensionKey {
  return (Object.entries(scores) as [DimensionKey, number][])
    .sort(([, a], [, b]) => Math.abs(b - 4) - Math.abs(a - 4))[0][0]
}

function getDirection(score: number): Direction {
  if (score >= 4.75) return "high"
  if (score <= 3.25) return "low"
  return "middle"
}

function describeDimension(dimension: DimensionKey, score: number) {
  const direction = getDirection(score)

  if (direction === "middle") {
    return `a still-open tradeoff around ${dimensionFrames[dimension].high}`
  }

  return dimensionFrames[dimension][direction]
}

function selectTension(
  input: FoundationPayoffInput,
  primaryDimension: DimensionKey,
): TensionKey {
  const maxDistance = Math.max(...Object.values(input.dimensionScores).map((score) => Math.abs(score - 4)))

  if (maxDistance < 0.75) return "low-differentiation"

  if (primaryDimension === "institutions") return "rules-leverage"
  if (primaryDimension === "securityCompetition") return "rivalry-cooperation"
  if (primaryDimension === "restraint") return "restraint-advantage"
  if (primaryDimension === "orderJustice") return "order-justice"
  if (primaryDimension === "normsIdentity" || input.runnerUpKey === "constructivist") {
    return "legitimacy-pressure"
  }
  if (primaryDimension === "politicalEconomy" || input.runnerUpKey === "criticalPoliticalEconomy") {
    return "dependence-diplomacy"
  }

  return "rivalry-cooperation"
}

function buildMainTension(
  tensionKey: TensionKey,
  input: FoundationPayoffInput,
): FoundationPayoff["mainTension"] {
  if (tensionKey === "low-differentiation") {
    return {
      title: "A broad map, not a hard center",
      body:
        "No single question dominates the result. The useful signal is the mix: several arguments stay available when the scenario gets harder.",
      rivalArgument:
        "The pressure test is whether a concrete issue forces a clearer tradeoff than the baseline did.",
    }
  }

  if (tensionKey === "rules-leverage") {
    return {
      title: "Rules versus leverage",
      body:
        "You give rules real weight, but the question is whether they still bite when powerful actors have reasons to defect.",
      rivalArgument: rivalArguments[input.runnerUpKey],
    }
  }

  if (tensionKey === "restraint-advantage") {
    return {
      title: "Restraint versus advantage",
      body:
        `${input.strategyModifier} means the result turns on when to limit commitments and when to press an opening.`,
      rivalArgument: rivalArguments[input.runnerUpKey],
    }
  }

  if (tensionKey === "order-justice") {
    return {
      title: "Order versus justice",
      body:
        `${input.normativeModifier} means sovereignty and wider moral claims are both live considerations, not settled slogans.`,
      rivalArgument: rivalArguments[input.runnerUpKey],
    }
  }

  if (tensionKey === "legitimacy-pressure") {
    return {
      title: "Legitimacy versus material pressure",
      body:
        "You attend to how actors justify choices, but the test is whether legitimacy changes behavior when costs rise.",
      rivalArgument: rivalArguments[input.runnerUpKey],
    }
  }

  if (tensionKey === "dependence-diplomacy") {
    return {
      title: "Dependence versus diplomacy",
      body:
        "You are pulled toward the economic structure behind policy, especially who can absorb costs and who controls chokepoints.",
      rivalArgument: rivalArguments[input.runnerUpKey],
    }
  }

  return {
    title: "Rivalry versus cooperation",
    body:
      "You treat rivalry as hard to wish away, but the result still asks when cooperation can survive strategic pressure.",
    rivalArgument: rivalArguments[input.runnerUpKey],
  }
}

function buildNextStep(tensionKey: TensionKey): FoundationPayoff["nextStep"] {
  if (tensionKey === "low-differentiation") {
    return {
      href: "/explore/atlas",
      label: "Browse Atlas patterns",
      reason:
        "Start by comparing nearby profile patterns before forcing a sharper label than the baseline supports.",
    }
  }

  if (tensionKey === "rules-leverage" || tensionKey === "dependence-diplomacy") {
    return {
      href: "/modules/technology",
      label: "Pressure-test in Technology",
      reason:
        "Technology cases make rules, dependence, chokepoints, and enforcement tradeoffs harder to avoid.",
    }
  }

  if (tensionKey === "legitimacy-pressure") {
    return {
      href: "/ai",
      label: "Try AI Governance",
      reason:
        "AI governance is a useful stress test for legitimacy, rule-setting, and authority under uncertainty.",
    }
  }

  return {
    href: "/modules/security",
    label: "Pressure-test in Security",
    reason:
      "Security cases make rivalry, restraint, escalation, order, and advantage show up quickly.",
  }
}
