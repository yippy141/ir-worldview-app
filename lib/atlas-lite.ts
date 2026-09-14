import type { FamilyKey } from "@/lib/types"

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
  publicName: string
  technicalDescriptor: string
  decisionRule: string
  primaryFamily: FamilyKey
  secondaryFamilies?: FamilyKey[]
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
}

// Authored reasoning approaches for comparison. Each record describes how an
// argument would be applied, under a stated condition. Nothing here describes a
// measured population, and no pattern is assigned to a user.
export const atlasLitePatterns: AtlasLitePattern[] = [
  {
    id: "broad-spectrum-bridge-builder",
    name: "Bridge Builder",
    publicName: "Several Lenses",
    technicalDescriptor: "Bridge Builder",
    decisionRule: "Hold several explanations open until the case clearly favors one.",
    primaryFamily: "institutionalist",
    secondaryFamilies: ["constructivist", "realist"],
    cardSummary:
      "This pattern holds several neighboring arguments open at once and looks for the overlap between them before it commits to a harder camp.",
    cardDrivers: [
      "Several dimensions stay near the middle",
      "No clean break between the leading traditions",
      "Order and justice both stay live",
    ],
    cardPressureNote:
      "A deterrence question forces this pattern to pick a side sooner than it would like. A question about dependence sorts its views on openness and control faster than the broad questions did.",
    detailSummary:
      "This pattern is slow to crown one explanation. Faced with a case, it asks what rivalry explains, what rules explain, and what legitimacy explains, and it waits for the evidence to separate them before it treats a single school as the default.",
    soWhat:
      "Given a hard case, this pattern asks which argument still survives contact with the facts, and treats an early verdict as a cost.",
    detailDrivers: [
      "The strongest signals sit close together instead of stacking into one firm worldview.",
      "Rivalry, institutions, legitimacy, and political economy all keep some pull.",
      "A harder case is the usual way this pattern reaches a sharper conclusion.",
    ],
    underestimates: [
      "Moments when a choice has to be made before the evidence separates the arguments.",
      "How expensive open questions become once a rival is already testing the boundary.",
    ],
    securitySummary:
      "If an exposed ally asks for troops on its border, this pattern separates into two paths. One weighs coalition strain and escalation risk and favors restraint; the other reads the request as a test of commitment and hardens around deterrence. Which path it takes depends on which cost the case makes visible first.",
    technologySummary:
      "If a ministry must choose between a cheap foreign digital stack and a costlier allied one, this pattern stops hedging. Dependence on a rival's infrastructure is the kind of fact that makes it choose control over open exchange.",
    confusionNote:
      "It is easy to mistake for Coalition Pragmatist, because both resist maximalism, and for Cross-Pressured Synthesizer, because both can look unsettled. The difference: Bridge Builder keeps the overlap between arguments intact, while Cross-Pressured Synthesizer shows a real split between domains or between diagnosis and decision.",
    pressureTestQuestions: [
      "When the case hardens, do you still hold several explanations open, or do you settle quickly on one?",
      "Do alliance strain and escalation risk usually outrank the chance of immediate advantage?",
      "Does technology policy push you toward firmer control than your general reading suggests?",
    ],
    fingerprint: {
      competition: "medium",
      institutions: "medium",
      legitimacy: "medium",
      politicalEconomy: "medium",
      restraint: "medium",
    },
    neighborIds: ["coalition-pragmatist", "cross-pressured-synthesizer"],
  },
  {
    id: "constraint-first-realist",
    name: "Constraint-First Realist",
    publicName: "Power with Limits",
    technicalDescriptor: "Constraint-First Realist",
    decisionRule: "Protect strategic position while setting firm limits on escalation and overreach.",
    primaryFamily: "realist",
    cardSummary:
      "This pattern starts from rivalry and constraint. It stays wary of overreach and looks for the ceiling on a commitment before it decides how hard to press.",
    cardDrivers: [
      "Rivalry stays front and center",
      "Overextension looks costly",
      "Order outranks moral ambition",
    ],
    cardPressureNote:
      "Ask it about deterrence and this pattern reinforces bounded deterrence. Ask it about an exposed chokepoint and it accepts tighter controls than its caution elsewhere would predict.",
    detailSummary:
      "This realist pattern treats competition as lasting and treats every contest as a place where a state can overreach. Its first move is to hold position without taking on commitments that are expensive to keep or hard to reverse.",
    soWhat:
      "Given a rival probing the boundary, this pattern backs deterrence and a ceiling together: hold the line, name the limit, and watch for the escalation trap.",
    detailDrivers: [
      "Security competition is the starting point for reading most major-power cases.",
      "Restraint here is a way to protect position and avoid strategic drift, and no sign of softness.",
      "Order and precedent carry more weight than expansive moral ambition.",
    ],
    underestimates: [
      "Openings where sustained pressure would improve the strategic balance.",
      "How a cautious ceiling can look like passivity to allies and to rivals.",
    ],
    securitySummary:
      "If a NATO ministerial is choosing an eastern-flank posture, this pattern favors reinforcement, visible resolve, and a stated ceiling. It reads open-ended escalation as the risk to plan against, so it prefers a posture allies can hold for years to one that signals most in the first month.",
    technologySummary:
      "If a supplier that is also a rival controls a chokepoint, this pattern supports targeted export controls and protection of the chokepoint. It applies the same test it applies to force: is the control worth the dependence it creates elsewhere, and can it be held?",
    confusionNote:
      "It is easy to mistake for Competitive Balancer, because both start from rivalry, and for Coalition Pragmatist, because both accept limits. The difference: this pattern treats the strategic ceiling as the first question, and Competitive Balancer treats it as a later correction.",
    pressureTestQuestions: [
      "When a rival probes the boundary, do you look first for a firm ceiling or for a chance to press advantage?",
      "How much risk of overextension would you absorb for a cleaner strategic signal?",
      "Do technology chokepoints make you readier to accept tight controls than you are in other domains?",
    ],
    fingerprint: {
      competition: "high",
      institutions: "low",
      legitimacy: "low",
      politicalEconomy: "low",
      restraint: "high",
    },
    neighborIds: ["competitive-balancer", "coalition-pragmatist"],
  },
  {
    id: "competitive-balancer",
    name: "Competitive Balancer",
    publicName: "Power and Leverage",
    technicalDescriptor: "Competitive Balancer",
    decisionRule: "Use credible pressure when it can convert advantage into lasting position.",
    primaryFamily: "realist",
    cardSummary:
      "This pattern returns quickly to rivalry, leverage, and credible positioning, and it presses an advantage when the opening looks real.",
    cardDrivers: [
      "Rivalry organizes the case",
      "Leverage is there to be used",
      "Restraint gives way sooner",
    ],
    cardPressureNote:
      "On deterrence, this pattern strengthens visible pressure. On chokepoints and dependence, it supports control over them.",
    detailSummary:
      "This pattern sees competition as the ground condition of major-power politics. Where the constraint-first version looks for the ceiling, this one tests openings, raises costs for the rival, and converts advantage into position while it can.",
    soWhat:
      "Given a real opening, this pattern uses leverage early and accepts friction, on the argument that a better long-run position pays for the trouble now.",
    detailDrivers: [
      "Security competition is the strongest explanatory signal in the pattern.",
      "Institutions are judged by whether they help or hinder the management of power.",
      "Friction is acceptable when the strategic payoff looks likely to last.",
    ],
    underestimates: [
      "Coalition fatigue and escalation ceilings that arrive before the payoff does.",
      "Ways institutional friction can protect a policy from its own overreach.",
    ],
    securitySummary:
      "If a monitoring team watches a ceasefire fray, this pattern reads delay as an invitation to the other side. It backs earlier pressure and a stronger deterrent signal, and it has little patience with ambiguity once the violations start to accumulate.",
    technologySummary:
      "If a rival is catching up in advanced semiconductors, this pattern favors export controls, defense of the chokepoint, and tighter screening of strategic dependence. Control of the technology is leverage, and leverage unused is leverage wasted.",
    confusionNote:
      "It is easy to mistake for Constraint-First Realist, because both are plainly realist, and for Structural Inequality Critic, because both pay close attention to leverage. The difference: this pattern sees leverage as a competitive tool, and Structural Inequality Critic sees it as evidence of a deeper hierarchy.",
    pressureTestQuestions: [
      "When does caution start to look like strategic drift instead of prudence?",
      "How much alliance friction would you accept if a harder line improved your position?",
      "Do institutions still deserve support when they slow a move you judge strategically sound?",
    ],
    fingerprint: {
      competition: "high",
      institutions: "low",
      legitimacy: "low",
      politicalEconomy: "medium",
      restraint: "low",
    },
    neighborIds: ["constraint-first-realist", "structural-inequality-critic"],
  },
  {
    id: "coalition-pragmatist",
    name: "Coalition Pragmatist",
    publicName: "Coalitions First",
    technicalDescriptor: "Coalition Pragmatist",
    decisionRule: "Choose the course that partners can sustain together over time.",
    primaryFamily: "institutionalist",
    secondaryFamilies: ["realist", "constructivist"],
    cardSummary:
      "This pattern prefers coordination that works and partner alignment that lasts. It distrusts rigid bloc discipline and go-it-alone autonomy in equal measure.",
    cardDrivers: [
      "Partners must be able to carry the policy",
      "Institutions help when they work",
      "Pressure is weighed against what the coalition can bear",
    ],
    cardPressureNote:
      "Faced with a deterrence question, this pattern turns toward what the alliance can endure. Faced with technology controls, it turns toward coordination and shared standards.",
    detailSummary:
      "This pattern has no illusions about institutions. It trusts them when they hold a coalition together and keep a policy usable over time, and it judges every course by whether the partners can still be carrying it in two years.",
    soWhat:
      "Given a proposal, this pattern asks first whether partners can sustain it. A course that looks neat on day one and splits the coalition by month six fails the test.",
    detailDrivers: [
      "Institutions are valued for coordination, signaling, and sharing the burden.",
      "Restraint is preferred to dramatic moves that partners cannot sustain.",
      "Power and pressure stay in view, which keeps the realist family nearby.",
    ],
    underestimates: [
      "Moments when speed and coercive clarity outrun the coalition process.",
      "How fast partner alignment cracks once burden-sharing turns politically costly at home.",
    ],
    securitySummary:
      "If a coastal state must decide whose help to accept, this pattern asks which partners can carry the commitment for years, and treats alliance endurance as part of deterrence itself. A guarantee the guarantor's public will not fund is read as no guarantee.",
    technologySummary:
      "If a coalition is debating export controls and shared standards, this pattern favors trusted production networks, coordinated controls, and shared governance over unilateral closure, because a control only one partner enforces leaks.",
    confusionNote:
      "It is easy to mistake for Institution Builder, because both value coordination, and for Constraint-First Realist, because both resist overreach. The difference: Coalition Pragmatist starts with partner management and whether a policy can last, and neither with rules alone nor with strategic ceilings alone.",
    pressureTestQuestions: [
      "Would you still back the policy if key partners could not carry it for long?",
      "When coalition unity and strategic speed collide, which usually wins?",
      "How much unilateral freedom would you give up for a common line that lasts?",
    ],
    fingerprint: {
      competition: "medium",
      institutions: "high",
      legitimacy: "medium",
      politicalEconomy: "medium",
      restraint: "high",
    },
    neighborIds: ["institution-builder", "constraint-first-realist"],
  },
  {
    id: "institution-builder",
    name: "Institution Builder",
    publicName: "Rules and Cooperation",
    technicalDescriptor: "Institution Builder",
    decisionRule: "Try rules, monitoring, and repeated cooperation before abandoning the institutional route.",
    primaryFamily: "institutionalist",
    secondaryFamilies: ["constructivist"],
    cardSummary:
      "This pattern starts with rules, monitoring, and repeated cooperation as the best way to hold an order together over time.",
    cardDrivers: [
      "Rules need enforcement and trust",
      "Domestic capacity shapes credible commitments",
      "Hard rivalry is no default explanation",
    ],
    cardPressureNote:
      "Where force is at issue, this pattern finds authorization and reassurance harder to arrange. Where technology governance is at issue, it finds shared standards and narrow controls easier to defend.",
    detailSummary:
      "This pattern believes well-built institutions do real work. It credits rules and monitoring with a stabilizing force of their own, while keeping coalition management in view because rules without partners do not hold.",
    soWhat:
      "Given a case where cooperation is failing, this pattern asks whether better rules, monitoring, and coordination could still carry it before it gives up on the institutional route.",
    detailDrivers: [
      "Institutional design is treated as a source of order in its own right, and no mere mirror of power.",
      "Domestic politics stays in view because a commitment is credible only if the state can keep it.",
      "The pattern can explain a case without reaching for a hard rivalry frame.",
    ],
    underestimates: [
      "How fast hard rivalry hollows out rules and monitoring arrangements.",
      "How often reassurance and authorization fail once strategic distrust has set in.",
    ],
    securitySummary:
      "If a monitoring team watches a ceasefire fray, this pattern asks whether the monitoring can be repaired: more access, a clearer authorization, a credible reporting line. It accepts that only a harder line remains when those repairs have failed, and it wants that failure shown.",
    technologySummary:
      "If a research board must decide how far to open a capable model, this pattern favors standards-setting, narrow controls, and shared infrastructure over each state duplicating the work, because a shared rule can be verified and a national one can only be asserted.",
    confusionNote:
      "It is easy to mistake for Coalition Pragmatist, because both trust coordinated action, and for Legitimacy Reader, because both can take institutions seriously. The difference: Institution Builder puts its faith first in rule design, monitoring, and repeated cooperation.",
    pressureTestQuestions: [
      "When do broken rules mean the institution needs repair, and when do they mean it should be abandoned?",
      "How much rivalry can a rule-based arrangement absorb before you stop trusting it?",
      "What evidence would convince you that coordination can no longer carry the case?",
    ],
    fingerprint: {
      competition: "low",
      institutions: "high",
      legitimacy: "medium",
      politicalEconomy: "low",
      restraint: "medium",
    },
    neighborIds: ["coalition-pragmatist", "legitimacy-attuned-reader"],
  },
  {
    id: "legitimacy-attuned-reader",
    name: "Legitimacy Reader",
    publicName: "Meaning and Legitimacy",
    technicalDescriptor: "Legitimacy Reader",
    decisionRule: "Judge a move by how identity, history, and legitimacy shape its meaning.",
    primaryFamily: "constructivist",
    secondaryFamilies: ["institutionalist"],
    cardSummary:
      "This pattern keeps asking how identity, recognition, and legitimacy decide what a show of power, a threat, or an offer of cooperation means to the people receiving it.",
    cardDrivers: [
      "Legitimacy is part of the causal story",
      "The meaning of a move depends on who makes it",
      "Order debates rarely feel settled",
    ],
    cardPressureNote:
      "When force is proposed, this pattern asks whether it will be seen as legitimate and whether reassurance will be believed. When a technology rule is proposed, it asks who gets to set the rule and the safety threshold.",
    detailSummary:
      "This pattern refuses to treat material facts as self-explanatory. Given the same deployment, it asks how each audience reads it, which claims about it look legitimate, and how the history between the parties changes what the move means.",
    soWhat:
      "Given a move by another state, this pattern asks who is interpreting it, how it is framed, and which claims about it look legitimate before it judges the raw capability behind it.",
    detailDrivers: [
      "Norms and identity are treated as explanatory signals in their own right, and no mere decoration.",
      "The same policy is read from more than one historical and regional vantage point.",
      "Order and justice stay open questions instead of a settled ranking.",
    ],
    underestimates: [
      "Cases where brute capability decides the outcome before interpretation can do any work.",
      "How long a threshold can stay open before a policy still has to be chosen.",
    ],
    securitySummary:
      "If an ally asks for public backing after staging risky probes in disputed waters, this pattern asks how the ally, the rival, and the region will read the backing before it asks what the backing adds to capability. Support that the region reads as provocation may cost more than it deters.",
    technologySummary:
      "If a research board must decide how far to open a capable model, this pattern asks who is entitled to define acceptable risk and whether the outside world will treat that definition as legitimate, and it weighs access as a question of standing as much as of safety.",
    confusionNote:
      "It is easy to mistake for Institution Builder, because both can value rules, and for Justice-Forward Solidarist, because both keep legitimacy in view. The difference: Legitimacy Reader is centered on meaning, recognition, and interpretation, and stops short of a moral argument for overriding sovereignty.",
    pressureTestQuestions: [
      "When does legitimacy change the outcome, and when does it only color the story?",
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
  },
  {
    id: "justice-forward-solidarist",
    name: "Justice-Forward Solidarist",
    publicName: "Justice and Protection",
    technicalDescriptor: "Justice-Forward Solidarist",
    decisionRule: "Let severe risks to people outweigh sovereignty only when legitimacy and limits support action.",
    primaryFamily: "constructivist",
    secondaryFamilies: ["institutionalist"],
    cardSummary:
      "This pattern keeps open the possibility that severe moral stakes can outweigh strict non-intervention, above all when legitimacy and protection point the same way.",
    cardDrivers: [
      "Civilian protection stays visible",
      "Sovereignty counts, but it is not absolute",
      "Legitimacy and justice are read together",
    ],
    cardPressureNote:
      "Force is this pattern's hardest test: whether bounded action can stay bounded. Technology brings harms, access, and unequal protection into view.",
    detailSummary:
      "This pattern gives humanitarian protection and wider moral claims serious weight. It still attends to authority and precedent, and it is willing to say that those guardrails should bend in an extreme case, provided the action has legitimacy and a limit.",
    soWhat:
      "Given a severe-harm case, this pattern asks who is left exposed if the rules are applied to the letter, and whether an authorized and limited action could protect them.",
    detailDrivers: [
      "Justice-sensitive answers stay visible even when order and precedent are kept in view.",
      "Legitimacy is treated as part of the case for action, and as more than a constraint on it.",
      "The pattern watches for who is left exposed when rules are applied too rigidly.",
    ],
    underestimates: [
      "The cost in precedent, and the difficulty of keeping a limited action limited.",
      "How unevenly moral urgency travels across institutions, coalitions, and domestic politics.",
    ],
    securitySummary:
      "If mass killing is under way and a veto blocks authorization, this pattern weighs civilian protection, the legal grounding available, and the risk that a bounded action becomes an open-ended intervention. It will act without full authorization only when the limit can be shown as well as the need.",
    technologySummary:
      "If a government must decide how far to open a capable model, this pattern asks who is harmed, who gets access, and who is protected, and treats capability as the smaller part of the question.",
    confusionNote:
      "It is easy to mistake for Legitimacy Reader, because both take legitimacy seriously, and for Bridge Builder, because both resist a sovereignty-first conclusion. The difference: this pattern is readier to say that extreme moral stakes should change the threshold for action.",
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
  },
  {
    id: "structural-inequality-critic",
    name: "Structural Inequality Critic",
    publicName: "Power Behind the Rules",
    technicalDescriptor: "Structural Inequality Critic",
    decisionRule: "Ask who sets the terms, who benefits, and who bears the cost behind formal rules.",
    primaryFamily: "criticalPoliticalEconomy",
    cardSummary:
      "This pattern reads world politics through leverage, dependence, and unequal control over finance, production, and the writing of rules.",
    cardDrivers: [
      "Hierarchy sits behind formal equality",
      "Institutions can carry built-in advantage",
      "Adjustment costs fall unevenly",
    ],
    cardPressureNote:
      "Sanctions and coalition discipline make this pattern ask who bears the burden. Technology makes it ask who is shut out by chokepoints, exclusion, and industrial lockout.",
    detailSummary:
      "This pattern distrusts neutral-sounding accounts of order. Given an arrangement described as fair, it looks first at who controls the terms of exchange, who absorbs the shocks, and whose dependence is being managed for someone else's benefit.",
    soWhat:
      "Given a proposal in the language of shared rules, this pattern asks who set the terms, who carries the cost, and whether the clean institutional language is covering a hierarchy.",
    detailDrivers: [
      "Political economy is treated as a primary driver, and as more than a background condition.",
      "Institutions are read as structured by hierarchy before they are read as neutral problem-solvers.",
      "Domestic politics stays relevant because external dependence is transmitted through internal social and economic structures.",
    ],
    underestimates: [
      "Immediate coercive threats that do not fit the deeper hierarchy story.",
      "How much variation remains across the ways a weaker state can coordinate with a stronger one.",
    ],
    securitySummary:
      "If a nonaligned state that depends on the aggressor for energy is pressed to join sanctions, this pattern asks who is being asked to carry the adjustment cost, and reads coalition discipline that falls hardest on the weakest member as hierarchy under another name.",
    technologySummary:
      "If a ministry is signing for data-centre capacity it cannot build itself, this pattern asks who controls the chokepoints, who is excluded from industrial depth, and who will write the rules once the dependence is locked in.",
    confusionNote:
      "It is easy to mistake for Competitive Balancer, because both take leverage seriously, and for Development-Sovereignty Builder, because both focus on dependence. The difference: Structural Inequality Critic treats the hierarchy itself as the story, where the others see state strategy or policy room.",
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
  },
  {
    id: "development-sovereignty-builder",
    name: "Development-Sovereignty Builder",
    publicName: "Capacity and Autonomy",
    technicalDescriptor: "Development-Sovereignty Builder",
    decisionRule: "Favor choices that build capacity and preserve future room to maneuver.",
    primaryFamily: "criticalPoliticalEconomy",
    secondaryFamilies: ["institutionalist"],
    cardSummary:
      "This pattern starts with policy room, productive depth, and the need to avoid the kinds of dependence that close off future choice.",
    cardDrivers: [
      "Capacity and autonomy travel together",
      "Lock-in is a strategic risk",
      "Development needs shape external choices",
    ],
    cardPressureNote:
      "Pressed to align, this pattern hedges. Asked about infrastructure, it backs public capacity, trusted suppliers, and diversified dependence.",
    detailSummary:
      "This pattern worries less about prestige today than about whether a state can still choose tomorrow. It treats industrial depth, financing terms, and strategic dependence as parts of sovereignty itself, and judges an offer by what it leaves open.",
    soWhat:
      "Given an offer of help, this pattern asks whether it widens the state's room to maneuver later or buys relief now at the price of dependence, and whether it builds capacity the state keeps.",
    detailDrivers: [
      "Political economy and domestic capacity move together in the pattern.",
      "The main fear is lock-in: arrangements that narrow future bargaining space.",
      "The nearest neighbor is an institutionalist or a critical political economy reading, and only rarely pure realism.",
    ],
    underestimates: [
      "Short-run alliance or deterrence demands when autonomy is under direct pressure.",
      "How an urgent exposure can force a choice that costs autonomy in the near term.",
    ],
    securitySummary:
      "If a middle power relies on one bloc for security and the other for trade, this pattern prefers partnerships that respect its autonomy, hedging between the blocs, and deals that keep room to maneuver, and it reads a demand to choose sides as a cost in itself.",
    technologySummary:
      "If a cabinet is deciding whether to build a sovereign cloud, this pattern backs public capacity, trusted infrastructure, and diversified suppliers, and it rejects both full self-sufficiency and pure openness on the same ground: each narrows future choice.",
    confusionNote:
      "It is easy to mistake for Structural Inequality Critic, because both focus on dependence, and for Coalition Pragmatist, because both can value coordination. The difference: Development-Sovereignty Builder is centered on state capacity and future bargaining room.",
    pressureTestQuestions: [
      "Does the policy expand room to maneuver later, or does it buy short-term relief at the price of future dependence?",
      "Which outside commitments strengthen domestic capacity, and which hollow it out?",
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
  },
  {
    id: "cross-pressured-synthesizer",
    name: "Cross-Pressured Synthesizer",
    publicName: "Different by Domain",
    technicalDescriptor: "Cross-Pressured Synthesizer",
    decisionRule: "Use the logic that fits the domain instead of forcing one rule across every case.",
    primaryFamily: "institutionalist",
    secondaryFamilies: ["constructivist", "criticalPoliticalEconomy"],
    cardSummary:
      "This pattern never settles into one doctrine. Different domains, or different kinds of question, pull its logic in different directions, and it lets them.",
    cardDrivers: [
      "Security and Technology do not point the same way",
      "Explanation and choice can diverge",
      "One summary line leaves too much out",
    ],
    cardPressureNote:
      "In a crisis, this pattern hardens its diagnosis faster than its endorsement. In a technology case, it can show a different balance between control, governance, and access.",
    detailSummary:
      "This pattern is no simple overlap. Its logic sorts one way under some conditions and changes emphasis under others. Read it as a structured tension between domains, or between diagnosis and decision, and it makes sense; read it as a fuzzy center and it does not.",
    soWhat:
      "Given two cases from different domains, this pattern applies different logics on purpose, and given one case, it may explain the crisis in harder terms than the policy it is willing to endorse.",
    detailDrivers: [
      "Domain comparisons show a real shift or a cross-domain tension.",
      "Explanation and decision follow different logics that do not collapse into one line.",
      "No single reflex is treated as an all-purpose answer.",
    ],
    underestimates: [
      "How hard it can be to state one simple line under pressure.",
      "How easily outsiders misread a real cross-domain split as inconsistency or indecision.",
    ],
    securitySummary:
      "If a crisis is escalating, this pattern explains it in harder terms than it is willing to endorse once legitimacy and escalation costs come into view: a realist diagnosis, an institutionalist prescription.",
    technologySummary:
      "If a rival is racing ahead in a strategic technology, this pattern diagnoses the rivalry and the dependence clearly, and still ends in a policy built on coordination, safety, or access, because the domain rewards different instincts than force does.",
    confusionNote:
      "It is easy to mistake for Bridge Builder, because both resist a single hard label. The difference: Bridge Builder holds several arguments open at once, while Cross-Pressured Synthesizer shows a real split between domains, or between diagnosis and choice.",
    pressureTestQuestions: [
      "Which domain should carry more weight when the readings point in different directions?",
      "Does your diagnosis read harder than the policy you would endorse?",
      "Is the tension stable enough to count as part of the pattern, or is it noise?",
    ],
    fingerprint: {
      competition: "medium",
      institutions: "medium",
      legitimacy: "medium",
      politicalEconomy: "medium",
      restraint: "medium",
    },
    neighborIds: ["broad-spectrum-bridge-builder", "legitimacy-attuned-reader"],
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
