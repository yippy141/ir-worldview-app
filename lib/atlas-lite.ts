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

export type AtlasFingerprintKey =
  | "competition"
  | "institutions"
  | "legitimacy"
  | "politicalEconomy"
  | "restraint"

export type AtlasFingerprintLevel = "low" | "medium" | "high"

export const atlasFingerprintOrder: AtlasFingerprintKey[] = [
  "competition",
  "institutions",
  "legitimacy",
  "politicalEconomy",
  "restraint",
]

export const atlasFingerprintLabels: Record<AtlasFingerprintKey, string> = {
  competition: "Competition",
  institutions: "Institutions",
  legitimacy: "Legitimacy",
  politicalEconomy: "Political economy",
  restraint: "Restraint",
}

export type AtlasLitePattern = {
  id: string
  name: string
  cardSummary: string
  cardDrivers: string[]
  cardPressureNote: string
  detailSummary: string
  soWhat: string
  detailDrivers: string[]
  underestimates: string[]
  securitySummary: string
  technologySummary: string
  confusionNote: string
  pressureTestQuestions: string[]
  fingerprint: Record<AtlasFingerprintKey, AtlasFingerprintLevel>
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
    name: "Bridge Builder",
    cardSummary:
      "This pattern keeps several neighboring arguments in play and looks for workable overlap before it reaches for a harder camp.",
    cardDrivers: [
      "Several dimensions stay near the middle",
      "No clean break between the top traditions",
      "Order and justice both stay live",
    ],
    cardPressureNote:
      "Security often forces a clearer choice on deterrence, while Technology usually sorts views on openness and dependence faster than the baseline does.",
    detailSummary:
      "This pattern is less about indecision than about holding several lines of argument open at once. The user usually wants more evidence before settling on a single school as the default lens.",
    soWhat:
      "In practice, this pattern is slower to accept one master explanation and more likely to ask which argument still survives contact with the case.",
    detailDrivers: [
      "The strongest signals sit close together rather than stacking into one firm worldview.",
      "Rivalry, institutions, legitimacy, and political economy all retain some pull.",
      "The profile often wants a harder issue case before it accepts a sharper label.",
    ],
    underestimates: [
      "Moments when a choice really does need to be made quickly.",
      "How costly prolonged ambiguity can become when a rival is already testing the boundary.",
    ],
    securitySummary:
      "In Security, this pattern often separates into two paths: one side moves toward coalition management and restraint, while the other hardens around deterrence and visible commitment.",
    technologySummary:
      "In Technology, this pattern often sharpens around dependence, industrial policy, and the line between open exchange and strategic control.",
    confusionNote:
      "It is often confused with Coalition Pragmatist because both resist maximalism, and with Cross-Pressured Synthesizer because both can look unsettled at first glance. The difference is that Bridge Builder keeps overlap intact, while Cross-Pressured Synthesizer shows a real split between domains or question types.",
    pressureTestQuestions: [
      "When the case hardens, do you still keep several lenses open or do you settle quickly on one?",
      "Do alliance strain and escalation risk usually outrank the push for immediate advantage?",
      "Does technology policy push you toward firmer control than the baseline suggests?",
    ],
    fingerprint: {
      competition: "medium",
      institutions: "medium",
      legitimacy: "medium",
      politicalEconomy: "medium",
      restraint: "medium",
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
    cardSummary:
      "This pattern starts from rivalry and constraint, but it stays wary of overreach and looks for ceilings before it reaches for a harder line.",
    cardDrivers: [
      "Rivalry stays front and center",
      "Overextension looks costly",
      "Order usually outranks moral ambition",
    ],
    cardPressureNote:
      "Security usually reinforces bounded deterrence, while Technology can still push this pattern toward tighter controls when chokepoints look exposed.",
    detailSummary:
      "This realist pattern treats competition as durable, but it does not treat every contest as a reason to press harder. The first instinct is to preserve position without drifting into commitments that are expensive to hold or hard to reverse.",
    soWhat:
      "In practice, this pattern is likely to back deterrence and limits together: hold position, but stay alert to escalation traps and strategic drift.",
    detailDrivers: [
      "Security competition remains the starting point for reading most major-power cases.",
      "Restraint is not softness here; it is a way to protect position and avoid strategic drift.",
      "Order and precedent usually carry more weight than expansive moral ambition.",
    ],
    underestimates: [
      "Openings where sustained pressure could improve the strategic balance.",
      "How often cautious ceilings can look like passivity to allies or rivals.",
    ],
    securitySummary:
      "In Security, this pattern usually favors reinforcement, deterrence, and visible resolve, but with clear ceilings and a strong preference against open-ended escalation.",
    technologySummary:
      "In Technology, this pattern often supports targeted controls and chokepoint protection, especially when dependence looks strategically dangerous.",
    confusionNote:
      "It is often confused with Competitive Balancer because both start with rivalry, and with Coalition Pragmatist because both can accept limits. The difference is that this pattern treats strategic ceilings as a first-order concern, not as a later correction.",
    pressureTestQuestions: [
      "When a rival probes the boundary, do you look first for a firm ceiling or for a chance to push advantage?",
      "How much risk of overextension are you willing to absorb for a cleaner strategic signal?",
      "Do new technology chokepoints make you more comfortable with tighter controls than you are in other domains?",
    ],
    fingerprint: {
      competition: "high",
      institutions: "low",
      legitimacy: "low",
      politicalEconomy: "low",
      restraint: "high",
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
    cardSummary:
      "This pattern returns quickly to rivalry, leverage, and credible positioning, with more willingness to press advantage when the opening looks real.",
    cardDrivers: [
      "Rivalry organizes the case",
      "Leverage is there to be used",
      "Restraint gives way sooner",
    ],
    cardPressureNote:
      "Security usually strengthens visible pressure, and Technology often sharpens support for control over key chokepoints and dependencies.",
    detailSummary:
      "This pattern sees competition as the baseline condition of major-power politics. It is more willing than the constraint-first version to test openings, raise costs, and convert advantage into position.",
    soWhat:
      "In practice, this pattern is readier to use leverage early and to accept friction if it improves long-run position.",
    detailDrivers: [
      "Security competition is usually the strongest explanatory signal in the profile.",
      "Institutions are judged mainly by whether they help or hinder power management.",
      "The profile is readier to accept friction if it believes the strategic payoff is durable.",
    ],
    underestimates: [
      "Coalition fatigue and escalation ceilings that arrive before the payoff does.",
      "Ways institutional friction can sometimes protect a policy from strategic overreach.",
    ],
    securitySummary:
      "In Security, this pattern often backs earlier pressure, stronger deterrent signaling, and less patience with ambiguity or delay.",
    technologySummary:
      "In Technology, this pattern often favors export controls, chokepoint defense, and tighter screening of strategic dependence.",
    confusionNote:
      "It is often confused with Constraint-First Realist because both are clearly realist, and with Structural Inequality Critic because both pay close attention to leverage. The difference is that this pattern sees leverage primarily as a competitive tool, not as evidence of deeper hierarchy.",
    pressureTestQuestions: [
      "When does caution start to look like strategic drift rather than prudence?",
      "How much alliance friction would you accept if a harder line improved position?",
      "Do institutions still deserve support when they slow down a move you judge strategically sound?",
    ],
    fingerprint: {
      competition: "high",
      institutions: "low",
      legitimacy: "low",
      politicalEconomy: "medium",
      restraint: "low",
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
    cardSummary:
      "This pattern prefers workable coordination and durable partner alignment over either rigid bloc discipline or go-it-alone autonomy.",
    cardDrivers: [
      "Partners must be able to carry the policy",
      "Institutions help when they work",
      "Pressure is weighed against coalition durability",
    ],
    cardPressureNote:
      "Security usually turns this pattern toward alliance endurance, while Technology usually turns it toward coordinated controls and shared standards.",
    detailSummary:
      "This pattern is not idealistic about institutions. It trusts them most when they can hold a coalition together and keep policy usable over time.",
    soWhat:
      "In practice, this pattern is likely to judge policy by whether partners can sustain it, not just by whether it looks strategically clean on day one.",
    detailDrivers: [
      "Institutional tools are valued for coordination, signaling, and burden-sharing.",
      "Restraint is often preferred to dramatic moves that partners cannot sustain.",
      "A realist runner-up often remains close because power and pressure are never fully out of view.",
    ],
    underestimates: [
      "Moments when speed and coercive clarity outrun coalition process.",
      "How quickly partner alignment can crack once burden-sharing turns politically costly.",
    ],
    securitySummary:
      "In Security, this pattern treats alliance endurance as part of deterrence itself and pays close attention to what exposed partners can realistically bear.",
    technologySummary:
      "In Technology, this pattern usually favors trusted production networks, coordinated controls, and shared governance over unilateral closure.",
    confusionNote:
      "It is often confused with Institution Builder because both value coordination, and with Constraint-First Realist because both can resist overreach. The difference is that Coalition Pragmatist starts with partner management and policy durability, not with rules alone or strategic ceilings alone.",
    pressureTestQuestions: [
      "Would you still back the policy if key partners could not carry it for long?",
      "When coalition unity and strategic speed collide, which side usually wins?",
      "How much unilateral freedom are you willing to give up for a more durable common line?",
    ],
    fingerprint: {
      competition: "medium",
      institutions: "high",
      legitimacy: "medium",
      politicalEconomy: "medium",
      restraint: "high",
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
    cardSummary:
      "This pattern starts with rules, monitoring, and repeated cooperation as the best way to hold order together over time.",
    cardDrivers: [
      "Rules need enforcement and trust",
      "Domestic capacity shapes credible commitments",
      "Hard rivalry is not the default lens",
    ],
    cardPressureNote:
      "Security makes authorization and reassurance harder, while Technology usually strengthens support for shared governance and narrow controls.",
    detailSummary:
      "This pattern believes well-built institutions can do real work. It is more willing than Coalition Pragmatist to treat rules and monitoring as stabilizing forces in their own right, not only as tools of coalition management.",
    soWhat:
      "In practice, this pattern is likely to ask whether better rules, monitoring, and coordination can still carry the case before it gives up on the institutional route.",
    detailDrivers: [
      "Institutional design is treated as a real source of order, not just a mirror of power.",
      "Domestic politics stays in view because commitments are only credible if states can actually keep them.",
      "The profile does not need a hard rivalry frame to explain most cases.",
    ],
    underestimates: [
      "How quickly hard rivalry can hollow out rules and monitoring arrangements.",
      "How often reassurance and authorization fail once strategic distrust has set in.",
    ],
    securitySummary:
      "In Security, this pattern usually looks for authorization, reassurance, and credible monitoring before it accepts that the only answer is a harder line.",
    technologySummary:
      "In Technology, this pattern often favors standards-setting, narrow controls, and shared infrastructure over national duplication.",
    confusionNote:
      "It is often confused with Coalition Pragmatist because both trust coordinated action, and with Legitimacy Reader because both can take institutions seriously. The difference is that Institution Builder puts its faith first in rule design, monitoring, and repeated cooperation.",
    pressureTestQuestions: [
      "When do broken rules mean institutions need repair rather than abandonment?",
      "How much rivalry can a rule-based framework absorb before you stop trusting it?",
      "What evidence would convince you that coordination is no longer strong enough to carry the case?",
    ],
    fingerprint: {
      competition: "low",
      institutions: "high",
      legitimacy: "medium",
      politicalEconomy: "low",
      restraint: "medium",
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
    name: "Legitimacy Reader",
    cardSummary:
      "This pattern keeps asking how identity, recognition, and legitimacy shape the meaning of power, threat, and cooperation.",
    cardDrivers: [
      "Legitimacy is part of the causal story",
      "The meaning of a move depends on who makes it",
      "Order debates rarely feel settled",
    ],
    cardPressureNote:
      "Security often raises the legitimacy of force and the meaning of reassurance, while Technology sharpens who gets to set rules and safety baselines.",
    detailSummary:
      "This pattern does not treat material facts as self-explanatory. It keeps asking how actors read one another, which claims look legitimate, and how historical relationships shape the same move.",
    soWhat:
      "In practice, this pattern is likely to ask who is interpreting the move, how it is framed, and what claims look legitimate before jumping to raw capability alone.",
    detailDrivers: [
      "Norms and identity remain active explanatory signals rather than rhetorical decoration.",
      "The profile wants to know how the same policy looks from different historical and regional vantage points.",
      "Order and justice stay open questions rather than a settled ranking.",
    ],
    underestimates: [
      "Cases where brute capability dominates before interpretation can do much work.",
      "How long threshold choices can stay open before a policy still has to be chosen.",
    ],
    securitySummary:
      "In Security, this pattern usually asks how allies, rivals, and regional actors interpret the move, not only whether the move changes raw capability.",
    technologySummary:
      "In Technology, this pattern often focuses on governance legitimacy, access, and who gets to define acceptable risk.",
    confusionNote:
      "It is often confused with Institution Builder because both can value rules, and with Justice-Forward Solidarist because both keep legitimacy in view. The difference is that Legitimacy Reader is centered on meaning, recognition, and interpretation before it becomes a moral argument about override.",
    pressureTestQuestions: [
      "When does legitimacy change the outcome rather than simply color the story?",
      "Do you read the same move differently depending on who makes it and how they are seen?",
      "What would convince you that material pressure outweighs identity and recognition in a case?",
    ],
    fingerprint: {
      competition: "medium",
      institutions: "medium",
      legitimacy: "high",
      politicalEconomy: "medium",
      restraint: "medium",
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
    cardSummary:
      "This pattern keeps open the possibility that severe moral stakes can outweigh strict non-intervention, especially when legitimacy and protection pull together.",
    cardDrivers: [
      "Civilian protection stays visible",
      "Sovereignty is important but not absolute",
      "Legitimacy and justice are read together",
    ],
    cardPressureNote:
      "Security raises the hardest questions about bounded force, while Technology brings harms, access, and unequal protection into sharper view.",
    detailSummary:
      "This pattern gives real weight to humanitarian protection and wider moral claims. It still pays attention to authority and precedent, but it is more willing to say those guardrails should bend in extreme cases.",
    soWhat:
      "In practice, this pattern is likelier to ask who is left exposed if rules are applied too rigidly, especially in severe-harm cases.",
    detailDrivers: [
      "Justice-sensitive answers remain visible even when order and precedent are kept in view.",
      "Legitimacy is treated as part of the case for action, not only as a constraint on action.",
      "The profile is especially attentive to who is left exposed when rules are applied too rigidly.",
    ],
    underestimates: [
      "Precedent costs and the difficulty of keeping limited action limited.",
      "How unevenly moral urgency travels across institutions, coalitions, and domestic politics.",
    ],
    securitySummary:
      "In Security, this pattern often centers the tension between civilian protection, legal grounding, and the risk that bounded action turns into open-ended intervention.",
    technologySummary:
      "In Technology, this pattern often focuses on access, safety, and the distribution of harms rather than capability alone.",
    confusionNote:
      "It is often confused with Legitimacy Reader because both take legitimacy seriously, and with Bridge Builder because both can resist hard sovereignty-first conclusions. The difference is that this pattern is readier to say extreme moral stakes should alter the policy threshold.",
    pressureTestQuestions: [
      "What threshold of harm would justify bending a sovereignty-first rule?",
      "How much legal or institutional grounding do you need before acting in an extreme case?",
      "When does the moral cost of inaction outweigh the strategic cost of intervention?",
    ],
    fingerprint: {
      competition: "low",
      institutions: "medium",
      legitimacy: "high",
      politicalEconomy: "medium",
      restraint: "medium",
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
    cardSummary:
      "This pattern reads world politics through leverage, dependence, and unequal control over finance, production, and rule-setting.",
    cardDrivers: [
      "Hierarchy sits behind formal equality",
      "Institutions can carry built-in advantage",
      "Adjustment costs usually fall unevenly",
    ],
    cardPressureNote:
      "Security often raises suspicion about who bears the burden, while Technology sharpens concern about chokepoints, exclusion, and industrial lockout.",
    detailSummary:
      "This pattern is skeptical of neutral-sounding accounts of order. It looks first at who controls the terms of exchange, who absorbs the shocks, and whose dependence is being managed for someone else.",
    soWhat:
      "In practice, this pattern is likely to ask who sets the terms, who carries the cost, and whether clean institutional language is hiding hierarchy.",
    detailDrivers: [
      "Political economy is treated as a primary driver rather than a background condition.",
      "Institutions are often read as structured by hierarchy rather than as neutral problem-solvers.",
      "Domestic politics stays relevant because external dependence is transmitted through internal social and economic structures.",
    ],
    underestimates: [
      "Immediate coercive threats that do not fit neatly into the deeper hierarchy story.",
      "How much variation can still exist across different forms of coordination with stronger states.",
    ],
    securitySummary:
      "In Security, this pattern often questions sanctions, improvised hierarchy, and coalition discipline when weaker states are asked to carry the adjustment cost.",
    technologySummary:
      "In Technology, this pattern focuses on chokepoints, unequal access, and who gets shut out of industrial depth and rule-setting capacity.",
    confusionNote:
      "It is often confused with Competitive Balancer because both take leverage seriously, and with Development-Sovereignty Builder because both focus on dependence. The difference is that Structural Inequality Critic treats hierarchy itself as the core story, not only state strategy or policy room.",
    pressureTestQuestions: [
      "Who carries the hidden cost of the policy, and who gets to write the rules?",
      "Does the institution solve the problem, or does it reproduce an unequal structure under cleaner language?",
      "When does strategic coordination turn into hierarchy with a better public rationale?",
    ],
    fingerprint: {
      competition: "medium",
      institutions: "low",
      legitimacy: "medium",
      politicalEconomy: "high",
      restraint: "medium",
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
    cardSummary:
      "This pattern starts with policy room, productive depth, and the need to avoid forms of dependence that close off future choice.",
    cardDrivers: [
      "Capacity and autonomy travel together",
      "Lock-in is a strategic risk",
      "Development needs shape external choices",
    ],
    cardPressureNote:
      "Security often pushes this pattern toward hedging, while Technology usually strengthens support for public capacity, trusted infrastructure, and diversified dependence.",
    detailSummary:
      "This pattern worries less about immediate prestige than about whether a state can keep room to maneuver over time. It treats industrial depth, financing conditions, and strategic dependence as part of sovereignty itself.",
    soWhat:
      "In practice, this pattern is likely to judge policy by whether it preserves room to maneuver, build capacity, and avoid lock-in later.",
    detailDrivers: [
      "Political economy and domestic capacity move together in the profile.",
      "The main fear is lock-in: arrangements that narrow future bargaining space.",
      "The closest neighbor is often institutionalist or critical political economy rather than pure realism.",
    ],
    underestimates: [
      "Short-run alliance or deterrence demands when autonomy is under direct pressure.",
      "How often urgent exposure can force a less autonomy-preserving choice in the near term.",
    ],
    securitySummary:
      "In Security, this pattern often prefers autonomy-sensitive partnerships, middle-power hedging, and deals that protect room for maneuver.",
    technologySummary:
      "In Technology, this pattern often backs public capacity, trusted infrastructure, and diversified dependence over either full autarky or pure openness.",
    confusionNote:
      "It is often confused with Structural Inequality Critic because both focus on dependence, and with Coalition Pragmatist because both can value coordination. The difference is that Development-Sovereignty Builder is centered on state capacity and future bargaining room.",
    pressureTestQuestions: [
      "Does the policy expand room to maneuver later, or does it buy short-term relief at the cost of future dependence?",
      "Which outside commitments strengthen domestic capacity, and which ones hollow it out?",
      "How much coordination would you trade for a larger loss of policy autonomy?",
    ],
    fingerprint: {
      competition: "medium",
      institutions: "medium",
      legitimacy: "low",
      politicalEconomy: "high",
      restraint: "medium",
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
    cardSummary:
      "This pattern does not settle into one clean doctrine: different domains or question types pull the profile in materially different directions.",
    cardDrivers: [
      "Security and Technology do not point the same way",
      "Explanation and choice can diverge",
      "One summary line leaves too much out",
    ],
    cardPressureNote:
      "Security often hardens the diagnosis faster than the endorsement, while Technology can reveal a different balance between control, governance, and access.",
    detailSummary:
      "This pattern is not simple overlap. The user does sort in one direction under some conditions, then changes emphasis under others. The result is better read as a structured tension than as a fuzzy center.",
    soWhat:
      "In practice, this pattern does not give one all-purpose reflex. It tells you where your reasoning changes by domain or by the shift from diagnosis to decision.",
    detailDrivers: [
      "Saved overlays create a real domain-conditioned shift or cross-domain tension.",
      "Explanation and decision logics do not collapse neatly into one line.",
      "The baseline remains useful, but not as an all-purpose reflex.",
    ],
    underestimates: [
      "How hard it can be to state one simple line under pressure.",
      "How easily outsiders can misread a real cross-domain split as inconsistency or indecision.",
    ],
    securitySummary:
      "In Security, this pattern often explains crises in harder terms than it is willing to endorse once legitimacy and escalation costs come fully into view.",
    technologySummary:
      "In Technology, this pattern often diagnoses rivalry and dependence clearly, yet still ends in coordination, safety, or access-oriented policy choices.",
    confusionNote:
      "It is often confused with Bridge Builder because both resist a single hard label. The difference is that Bridge Builder holds several arguments open at once, while Cross-Pressured Synthesizer shows a genuine split between domains or between diagnosis and policy choice.",
    pressureTestQuestions: [
      "Which domain do you trust more when your own issue reads point in different directions?",
      "Do you explain the case in harder terms than you are willing to endorse in policy?",
      "Is the tension stable enough to treat as part of the profile rather than as noise?",
    ],
    fingerprint: {
      competition: "medium",
      institutions: "medium",
      legitimacy: "medium",
      politicalEconomy: "medium",
      restraint: "medium",
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

export function getAtlasLiteNeighbors(pattern: AtlasLitePattern) {
  return pattern.neighborIds
    .map((neighborId) => getAtlasLitePattern(neighborId))
    .filter((neighbor): neighbor is AtlasLitePattern => Boolean(neighbor))
}

export function getAtlasPatternHref(id: string) {
  return `/explore/atlas/${id}`
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
  const neighbors = getAtlasLiteNeighbors(nearest).slice(0, 2)

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
