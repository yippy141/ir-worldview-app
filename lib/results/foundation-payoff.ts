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
  caseTest: {
    caseId: string
    question: string
    reason: string
  }
  nextStep: {
    href: string
    label: string
    reason: string
  }
}

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

export function buildFoundationPayoff(input: FoundationPayoffInput): FoundationPayoff {
  const familyFrame = familyFrames[input.familyKey]
  const primaryDimension = getStrongestDimension(input.dimensionScores)
  const tensionKey = selectTension(input, primaryDimension)

  return {
    corePattern: {
      noticeFirst: familyFrame.noticeFirst,
      distrust: familyFrame.distrust,
      underweight: familyFrame.underweight,
    },
    mainTension: buildMainTension(tensionKey, input),
    liveDebates: Object.entries(familyFrame.debateLens).map(([title, text]) => ({
      title,
      text,
    })),
    caseTest: buildCaseTest(tensionKey),
    nextStep: buildNextStep(tensionKey),
  }
}

function getStrongestDimension(scores: DimensionScores): DimensionKey {
  return (Object.entries(scores) as [DimensionKey, number][])
    .sort(([, a], [, b]) => Math.abs(b - 4) - Math.abs(a - 4))[0][0]
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
      title: "What makes you choose a lens",
      body:
        "Your baseline does not supply one default answer. It waits for the issue to reveal whether power, rules, identity, or dependence matters most.",
      rivalArgument:
        "A concrete case should force one of those logics to outrank the others.",
    }
  }

  if (tensionKey === "rules-leverage") {
    return {
      title: "Rules versus leverage",
      body:
        "You give rules real weight. The unresolved question is whether they still bite when powerful actors have both the motive and the means to defect.",
      rivalArgument: rivalArguments[input.runnerUpKey],
    }
  }

  if (tensionKey === "restraint-advantage") {
    return {
      title: "Restraint versus advantage",
      body: restraintTension(input.strategyModifier),
      rivalArgument: rivalArguments[input.runnerUpKey],
    }
  }

  if (tensionKey === "order-justice") {
    return {
      title: "Order versus justice",
      body: orderJusticeTension(input.normativeModifier),
      rivalArgument: rivalArguments[input.runnerUpKey],
    }
  }

  if (tensionKey === "legitimacy-pressure") {
    return {
      title: "Legitimacy versus material pressure",
      body:
        "You treat recognition and legitimacy as evidence, not decoration. The unresolved question is when they still change behavior as material costs rise.",
      rivalArgument: rivalArguments[input.runnerUpKey],
    }
  }

  if (tensionKey === "dependence-diplomacy") {
    return {
      title: "Dependence versus diplomacy",
      body:
        "You look behind diplomacy to who controls credit, production, and market access. The unresolved question is when those structures determine the outcome and when governments can still bargain around them.",
      rivalArgument: rivalArguments[input.runnerUpKey],
    }
  }

  return {
    title: "Rivalry versus cooperation",
    body:
      "You treat rivalry as a durable constraint. The unresolved question is when verification, bargaining, or shared costs can still contain it.",
    rivalArgument: rivalArguments[input.runnerUpKey],
  }
}

function restraintTension(modifier: StrategyModifier) {
  if (modifier === "Restrainer") {
    return "You usually put limits first. The unresolved question is which openings are important enough to justify pressing harder."
  }

  if (modifier === "Maximizer") {
    return "You are willing to press an advantage. The unresolved question is when the added gain stops being worth escalation or overextension."
  }

  return "You keep both restraint and advantage in play. The unresolved question is what evidence should make one outrank the other."
}

function orderJusticeTension(modifier: NormativeModifier) {
  if (modifier === "Pluralist") {
    return "You usually put sovereignty and precedent first. The unresolved question is what level of harm, if any, should override that rule."
  }

  if (modifier === "Universalist") {
    return "You allow severe harm to override sovereignty. The unresolved question is how much authority, control, and confidence in the aftermath that exception requires."
  }

  return "You keep sovereignty and civilian protection in tension. The unresolved question is which threshold and institutional guardrails make an exception defensible."
}

function buildCaseTest(tensionKey: TensionKey): FoundationPayoff["caseTest"] {
  if (tensionKey === "rules-leverage" || tensionKey === "rivalry-cooperation") {
    return {
      caseId: "security-arms-control-verification",
      question:
        "When a verified arms-control regime later collapses, does that show that institutions failed, or that they worked only while the political bargain held?",
      reason:
        "The case separates faith in verification from faith that rules can survive a deeper strategic break.",
    }
  }

  if (tensionKey === "restraint-advantage" || tensionKey === "low-differentiation") {
    return {
      caseId: "security-cuban-missile-escalation-ceilings",
      question:
        "Was the decisive logic in 1962 credible pressure, private reciprocity, or accepting an escalation ceiling neither side could safely cross?",
      reason:
        "The case puts leverage, bargaining, and restraint inside the same decision instead of testing them in isolation.",
    }
  }

  if (tensionKey === "order-justice" || tensionKey === "legitimacy-pressure") {
    return {
      caseId: "order-humanitarian-intervention-contested-authority",
      question:
        "When Security Council authorization is absent, should civilian protection, regional backing, or the precedent set by unauthorized force carry the most weight?",
      reason:
        "The case forces moral urgency, legal authority, and expected consequences into one judgment.",
    }
  }

  return {
    caseId: "statecraft-sanctions-finance-network-chokepoints",
    question:
      "Is the case mainly about diplomatic bargaining, control of financial networks, or the unequal ability of states and households to absorb isolation?",
    reason:
      "The case tests whether economic structure explains the outcome or sets the conditions inside which diplomacy still matters.",
  }
}

function buildNextStep(tensionKey: TensionKey): FoundationPayoff["nextStep"] {
  if (tensionKey === "low-differentiation") {
    return {
      href: "/explore/atlas",
      label: "Browse Worldview profiles",
      reason:
        "Start by comparing nearby Worldview profiles before forcing a sharper label than the baseline supports.",
    }
  }

  if (tensionKey === "rules-leverage" || tensionKey === "dependence-diplomacy") {
    return {
      href: "/modules/technology",
      label: "Compare in Technology",
      reason:
        "Technology cases make rules, dependence, chokepoints, and enforcement tradeoffs harder to avoid.",
    }
  }

  if (tensionKey === "legitimacy-pressure") {
    return {
      href: "/ai",
      label: "Try AI Governance",
      reason:
        "AI governance makes legitimacy, rule-setting, and authority under uncertainty concrete.",
    }
  }

  return {
    href: "/modules/security",
    label: "Compare in Security",
    reason:
      "Security cases make rivalry, restraint, escalation, order, and advantage show up quickly.",
  }
}
