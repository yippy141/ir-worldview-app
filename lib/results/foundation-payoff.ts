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
    noticeFirst: "Power and rivalry take priority when declared intentions lack credible constraints.",
    distrust: "Cooperation based on goodwill alone receives little weight without leverage or enforcement.",
    underweight:
      "Rules or identity can sometimes change what actors want as well as constrain them.",
    debateLens: {
      "Great-power rivalry": "Look for credible costs and escalation limits before trusting public assurances.",
      "Technology competition": "Ask where dependence creates vulnerability and who can control the key chokepoints.",
      "Sanctions and supply chains": "Watch whether pressure can change behavior. A signal of resolve alone is insufficient.",
      "Humanitarian crisis": "Test moral urgency against the precedent set and whether a settlement can last.",
    },
  },
  institutionalist: {
    noticeFirst: "Rules matter when monitoring and repeated cooperation change incentives.",
    distrust: "Pure power explanations are incomplete when institutions make cheating costly.",
    underweight:
      "Powerful actors can abandon rules when the bargain no longer serves them.",
    debateLens: {
      "Great-power rivalry": "Ask whether institutions can reduce misperception or lock in narrow cooperation despite rivalry.",
      "Technology competition": "Look for standards and inspections that make risky behavior harder to hide.",
      "Sanctions and supply chains": "Ask whether coordination spreads costs and makes pressure more legitimate.",
      "Humanitarian crisis": "Require authorization and credible burden-sharing before trusting unilateral action.",
    },
  },
  constructivist: {
    noticeFirst: "Legitimacy and identity shape what actors believe is possible.",
    distrust: "Accounts that assume fixed interests leave out how actors define them.",
    underweight:
      "Material leverage and coercive power can set limits that interpretation cannot remove.",
    debateLens: {
      "Great-power rivalry": "Ask how historical memory shapes the threat image behind each move.",
      "Technology competition": "Which narrative makes a policy of openness or control legitimate?",
      "Sanctions and supply chains": "Ask whether pressure changes norms and identities as well as material incentives.",
      "Humanitarian crisis": "Watch how the actors frame legitimacy and responsibility.",
    },
  },
  criticalPoliticalEconomy: {
    noticeFirst: "The starting question is who benefits from the economic structure behind the policy choice.",
    distrust: "Neutral language can conceal hierarchy, dependence, and unequal adjustment costs.",
    underweight:
      "Security fears, institutional constraints, and identity claims may have force beyond material interests.",
    debateLens: {
      "Great-power rivalry": "Ask who profits from the rivalry frame and which dependencies it leaves untouched.",
      "Technology competition": "Ask who owns the infrastructure and captures the gains from control.",
      "Sanctions and supply chains": "Ask who absorbs the costs and who controls the chokepoints that make pressure bite.",
      "Humanitarian crisis": "Trace how reconstruction and debt distribute outside leverage.",
    },
  },
}

const rivalArguments: Record<FamilyKey, string> = {
  realist: "The realist challenge is that power and security incentives may survive every appeal to rules or legitimacy.",
  institutionalist:
    "The institutionalist challenge is that rules can change incentives when compliance is observable and violations carry costs.",
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
      title: "What decides the case",
      body:
        "Your baseline does not supply one default answer. The issue determines whether you give priority to power, rules, identity, or dependence.",
      rivalArgument:
        "A concrete case should reveal which consideration outranks the others.",
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
        "You look behind diplomacy to control over financial and productive resources. The unresolved question is when those structures determine the outcome and when governments can still bargain around them.",
      rivalArgument: rivalArguments[input.runnerUpKey],
    }
  }

  return {
    title: "Rivalry versus cooperation",
    body:
      "You treat rivalry as a durable constraint. The unresolved question is when verification or shared costs can still contain it.",
    rivalArgument: rivalArguments[input.runnerUpKey],
  }
}

function restraintTension(modifier: StrategyModifier) {
  if (modifier === "Restrainer") {
    return "Limits come first in this result. The unresolved question is which openings are important enough to justify pressing harder."
  }

  if (modifier === "Maximizer") {
    return "You are willing to press an advantage. The unresolved question is when the added gain stops being worth escalation or overextension."
  }

  return "Your answers balance restraint against advantage. The unresolved question is what evidence should make one outrank the other."
}

function orderJusticeTension(modifier: NormativeModifier) {
  if (modifier === "Pluralist") {
    return "Sovereignty and precedent come first in this result. The unresolved question is what level of harm, if any, should override that rule."
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
      label: "Browse Decision Patterns",
      reason:
        "Use the editorial Decision Patterns as comparisons without treating one as an assigned result.",
    }
  }

  if (tensionKey === "rules-leverage" || tensionKey === "dependence-diplomacy") {
    return {
      href: "/modules/technology",
      label: "Read the Technology domain",
      reason:
        "Technology cases make dependence and enforcement tradeoffs concrete.",
    }
  }

  if (tensionKey === "legitimacy-pressure") {
    return {
      href: "/ai",
      label: "Try AI Governance",
      reason:
        "AI governance makes authority under uncertainty concrete.",
    }
  }

  return {
    href: "/modules/security",
    label: "Read the Security domain",
    reason:
      "Security cases make the tradeoff between rivalry and restraint concrete.",
  }
}
