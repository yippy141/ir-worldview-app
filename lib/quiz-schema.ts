import type { Question, QuizMode } from "@/lib/types"

export const SCHEMA_VERSION = 3

export const dimensionLabels = {
  securityCompetition: "Security rivalry",
  institutions: "Institutions and rules",
  domesticFilters: "Domestic politics",
  normsIdentity: "Identity and legitimacy",
  politicalEconomy: "Markets and dependence",
  restraint: "Restraint and advantage",
  orderJustice: "Order and justice",
} as const

export const standardQuestions: Question[] = [
  {
    id: "sc1",
    kind: "likert",
    dimension: "securityCompetition",
    prompt:
      "Even peaceful periods between major powers can unravel when the balance of power changes.",
    clarification: {
      whatItAsks:
        "Whether peace between major powers is usually conditional rather than permanently solved.",
      whatItDoesNotAsk:
        "This is not saying war is inevitable or that diplomacy never matters.",
    },
  },
  {
    id: "in1",
    kind: "likert",
    dimension: "institutions",
    prompt:
      "Shared rules can make cooperation last, even when no single state is in charge.",
    clarification: {
      whatItAsks:
        "Whether institutions can shape behavior by setting expectations, monitoring conduct, and lowering uncertainty.",
      whatItDoesNotAsk:
        "This is not claiming institutions always work or that power stops mattering.",
    },
  },
  {
    id: "df1",
    kind: "likert",
    dimension: "domesticFilters",
    prompt:
      "Foreign policy often reflects domestic coalitions and political pressures as much as outside threats do.",
    clarification: {
      whatItAsks:
        "Whether internal politics helps explain foreign policy choices, not just the external environment.",
      whatItDoesNotAsk:
        "This is not denying that outside pressure can still dominate in some cases.",
    },
  },
  {
    id: "ni1",
    kind: "likert",
    dimension: "normsIdentity",
    prompt:
      "The same military move can look threatening or reassuring depending on the relationship involved.",
    clarification: {
      whatItAsks:
        "Whether meaning depends partly on trust, recognition, history, and shared expectations.",
      whatItDoesNotAsk:
        "This is not saying military capabilities stop mattering.",
    },
  },
  {
    id: "pe1",
    kind: "likert",
    dimension: "politicalEconomy",
    prompt:
      "Trade, finance, and supply chains belong in the basic explanation of world politics, not in a separate box.",
    clarification: {
      whatItAsks:
        "Whether economic leverage and dependence are part of the core story, not background detail.",
      whatItDoesNotAsk:
        "This is not saying every crisis is secretly just about economics.",
    },
  },
  {
    id: "rs1",
    kind: "likert",
    dimension: "restraint",
    prompt:
      "Major powers often make themselves less secure when they chase advantages beyond what defense requires.",
    clarification: {
      whatItAsks:
        "Whether overextension and pursuit of excess advantage can generate backlash and reduce security.",
      whatItDoesNotAsk:
        "This is not asking whether every gain in power is a mistake.",
    },
  },
  {
    id: "oj1",
    kind: "likert",
    dimension: "orderJustice",
    prompt:
      "A stable international order is often worth protecting even when it leaves serious injustice unresolved.",
    clarification: {
      whatItAsks:
        "Whether stability and precedent should usually take priority when they collide with broader moral goals.",
      whatItDoesNotAsk: "This is not saying injustice is unimportant.",
    },
  },
  {
    id: "tradeoff_alliances",
    kind: "tradeoff",
    prompt: "What most often keeps alliances together under real pressure?",
    helpText:
      "Choose the logic you find most persuasive, not the sentence that sounds nicest in the abstract.",
    options: [
      {
        id: "power",
        title: "Material backing",
        label:
          "Alliances hold when members believe the leading power can and will bear the cost of defense.",
        signals: { securityCompetition: 6.3, institutions: 2.8, restraint: 3.6 },
      },
      {
        id: "rules",
        title: "Rules and routines",
        label:
          "Planning structures, standing commitments, and repeated coordination make alliance promises more credible.",
        signals: { institutions: 6.4, securityCompetition: 3.5, restraint: 4.7 },
      },
      {
        id: "domestic",
        title: "Domestic staying power",
        label:
          "Alliances endure when domestic coalitions, budgets, and public tolerance can sustain them over time.",
        signals: { domesticFilters: 6.3, institutions: 4.8, restraint: 4.5 },
      },
      {
        id: "meaning",
        title: "Political meaning",
        label:
          "Alliances hold when they are seen as legitimate and identity-consistent, not only as efficient bargains.",
        signals: { normsIdentity: 6.2, institutions: 4.9, securityCompetition: 3.4 },
      },
    ],
  },
  {
    id: "sc2",
    kind: "likert",
    dimension: "securityCompetition",
    prompt:
      "States often prepare for danger because they cannot be sure others will stay benign.",
    clarification: {
      whatItAsks:
        "Whether uncertainty about future intentions pushes states toward self-protective behavior.",
      whatItDoesNotAsk:
        "This is not saying trust never matters or that alliances are useless.",
    },
  },
  {
    id: "in2",
    kind: "likert",
    dimension: "institutions",
    prompt:
      "Monitoring and repeated contact can keep international agreements alive.",
    clarification: {
      whatItAsks:
        "Whether transparency and repeated interaction can reduce cheating and support cooperation.",
      whatItDoesNotAsk:
        "This is not asking whether every agreement is equally credible.",
    },
  },
  {
    id: "df2",
    kind: "likert",
    dimension: "domesticFilters",
    prompt:
      "States facing similar outside pressures can still act very differently because their internal politics differ.",
    clarification: {
      whatItAsks:
        "Whether institutions, elites, and social coalitions inside a state filter the same outside world differently.",
      whatItDoesNotAsk:
        "This is not saying domestic politics always outweighs external pressure.",
    },
  },
  {
    id: "ni2",
    kind: "likert",
    dimension: "normsIdentity",
    prompt:
      "Status, recognition, and legitimacy shape what states think they want, not just how they pursue fixed interests.",
    clarification: {
      whatItAsks:
        "Whether interests are partly socially formed rather than fully given in advance.",
      whatItDoesNotAsk: "This is not denying that material interests exist.",
    },
  },
  {
    id: "pe2",
    kind: "likert",
    dimension: "politicalEconomy",
    prompt:
      "Economic rules often give stronger states structural advantages that weaker states have to work around.",
    clarification: {
      whatItAsks:
        "Whether hierarchy is built into major economic arrangements, not just used tactically from case to case.",
      whatItDoesNotAsk:
        "This is not asking whether weaker states have no room to maneuver.",
    },
  },
  {
    id: "rs2",
    kind: "likert",
    dimension: "restraint",
    prompt:
      "Avoiding overextension is usually more important than pressing every opening for lasting advantage.",
    clarification: {
      whatItAsks:
        "Whether a safer grand strategy usually comes from limiting commitments rather than exploiting every opportunity.",
      whatItDoesNotAsk:
        "This is not asking whether states should withdraw from the world.",
    },
  },
  {
    id: "oj2",
    kind: "likert",
    dimension: "orderJustice",
    reverse: true,
    prompt:
      "When atrocities are severe enough, sovereignty should sometimes give way to outside action.",
    clarification: {
      whatItAsks:
        "Whether extreme moral emergencies can justify overriding non-intervention.",
      whatItDoesNotAsk:
        "This is not a blanket endorsement of regime change or constant intervention.",
    },
  },
  {
    id: "tradeoff_interdependence",
    kind: "tradeoff",
    prompt:
      "When economic interdependence becomes dangerous, what is usually the deeper problem?",
    helpText:
      "This asks what drives the vulnerability most fundamentally, not which policy tool you like most.",
    options: [
      {
        id: "rivalry",
        title: "Rivalry turns ties into leverage",
        label:
          "Interdependence becomes dangerous mainly when strategic competition sharpens and states start treating exposure as a security risk.",
        signals: { securityCompetition: 6.1, politicalEconomy: 4.8, institutions: 3.1 },
      },
      {
        id: "rules",
        title: "Rules failed to keep up",
        label:
          "The danger comes from weak guardrails. Better multilateral rules could preserve openness without so much coercive exposure.",
        signals: { institutions: 6.2, politicalEconomy: 4.3, restraint: 4.8 },
      },
      {
        id: "domestic",
        title: "Domestic dependence hardened",
        label:
          "The real weakness is political: domestic firms, regions, and interest groups become too embedded to adjust quickly when risk rises.",
        signals: { domesticFilters: 6.2, politicalEconomy: 5.2, restraint: 4.4 },
      },
      {
        id: "structure",
        title: "The structure was unequal",
        label:
          "The vulnerability is built into who controls credit, production, and chokepoints. Exposure looks mutual until coercion begins.",
        signals: { politicalEconomy: 6.5, institutions: 2.9, securityCompetition: 4.5 },
      },
    ],
  },
  {
    id: "tradeoff_strategy",
    kind: "tradeoff",
    prompt: "A rival is gaining ground. Which concern should come first?",
    options: [
      {
        id: "press",
        title: "Press the opening",
        label:
          "If a durable strategic edge is available now, failing to use it will look reckless later.",
        signals: { restraint: 2.4, securityCompetition: 6.1 },
      },
      {
        id: "limit",
        title: "Guard against overreach",
        label:
          "The first danger is self-inflicted: excessive commitments and escalation can do more damage than a narrower rival gain.",
        signals: { restraint: 6.2, securityCompetition: 4.1 },
      },
      {
        id: "base",
        title: "Start with the home front",
        label:
          "The real question is whether domestic coalitions, public tolerance, and fiscal capacity can carry the strategy at all.",
        signals: { domesticFilters: 6.3, restraint: 5.1 },
      },
      {
        id: "industrial",
        title: "Control the production base",
        label:
          "Long-run advantage turns less on tactical posturing than on who controls technology, industry, and supply chains.",
        signals: { politicalEconomy: 6.1, securityCompetition: 4.9, restraint: 4.4 },
      },
    ],
  },
  {
    id: "tradeoff_intervention",
    kind: "tradeoff",
    prompt:
      "A state is committing mass atrocities, but outside action could weaken legal restraints elsewhere. What should govern the decision?",
    options: [
      {
        id: "precedent",
        title: "Protect the precedent",
        label:
          "Without a strong presumption for order and sovereignty, later abuses of intervention will do wider damage than this case can justify.",
        signals: { orderJustice: 6.3, restraint: 5.2, institutions: 4.8 },
      },
      {
        id: "protection",
        title: "Protect the victims",
        label:
          "When harm crosses an extreme threshold, the moral case should outweigh the normal presumption against intervention.",
        signals: { orderJustice: 2.4, restraint: 3.3, normsIdentity: 4.7 },
      },
      {
        id: "mandate",
        title: "Judge the authority",
        label:
          "The decisive issue is whether a narrow, legitimate mandate exists. Emergency action is strongest when it is bounded and collectively framed.",
        signals: { institutions: 6.1, orderJustice: 4.3, restraint: 4.9 },
      },
      {
        id: "consequences",
        title: "Judge the likely outcome",
        label:
          "The first test is whether action will plausibly protect people rather than widen the war or create a larger disaster.",
        signals: { restraint: 6.1, orderJustice: 4.0, domesticFilters: 4.6 },
      },
    ],
  },
  {
    id: "case_semiconductors",
    kind: "miniCase",
    prompt:
      "A rival power is closing the gap in advanced semiconductors while your firms remain deeply tied into its supply chain. What should drive the response?",
    helpText:
      "This asks what the response should be built around, not which talking point is easiest to defend publicly.",
    options: [
      {
        id: "edge",
        title: "Preserve the strategic edge",
        label:
          "Restrict broadly now. Closing the capability gap is itself the threat, and trade costs are secondary to preserving advantage.",
        signals: { securityCompetition: 6.4, restraint: 2.8, institutions: 2.9 },
      },
      {
        id: "dependence",
        title: "Reduce structural dependence",
        label:
          "The deeper contest is over production chokepoints and dependence. Build domestic capacity and unwind one-sided exposure.",
        signals: { politicalEconomy: 6.4, securityCompetition: 4.8, institutions: 3.3 },
      },
      {
        id: "coalition",
        title: "Coordinate narrow controls",
        label:
          "Limit only the highest-risk technologies and do it with allies. Broad unilateral controls fracture the order you still need.",
        signals: { institutions: 6.2, restraint: 5.0, securityCompetition: 4.4 },
      },
      {
        id: "framing",
        title: "Avoid securitizing everything",
        label:
          "Treating every technological gap as a security emergency hardens rivalry and narrows room for future cooperation.",
        signals: { normsIdentity: 5.9, restraint: 5.7, securityCompetition: 3.1 },
      },
    ],
  },
  {
    id: "case_protection",
    kind: "miniCase",
    prompt:
      "Mass killing is underway, a UN Security Council veto blocks authorization, and a credible regional body backs limited action. What matters most?",
    helpText:
      "Focus on the principle you think should govern the response, not on whether any real-world coalition would execute it well.",
    options: [
      {
        id: "law",
        title: "Legality first",
        label:
          "Action without Security Council authorization weakens the legal framework that protects weaker states in harder cases to come.",
        signals: { orderJustice: 6.5, institutions: 5.4, restraint: 5.1 },
      },
      {
        id: "moral",
        title: "Protection first",
        label:
          "Extreme human harm can override the normal procedural objection. The scale of the abuse changes the rule of thumb.",
        signals: { orderJustice: 2.3, restraint: 3.4, normsIdentity: 4.9 },
      },
      {
        id: "bounded",
        title: "Bounded emergency legitimacy",
        label:
          "Regional backing plus a tightly limited mandate can justify emergency action without turning it into a general license.",
        signals: { institutions: 5.8, orderJustice: 4.3, restraint: 5.0 },
      },
      {
        id: "prudence",
        title: "Escalation and aftermath",
        label:
          "The first question is whether outside action would likely protect civilians rather than widen the war and leave a worse political vacuum.",
        signals: { restraint: 6.2, orderJustice: 4.1, domesticFilters: 4.8 },
      },
    ],
  },
]

export const analystQuestions: Question[] = [
  {
    id: "an_sc3",
    kind: "likert",
    dimension: "securityCompetition",
    prompt:
      "Long periods of major-power peace usually rest on favorable conditions that can change.",
    clarification: {
      whatItAsks:
        "Whether durable peace is often contingent rather than fully solved.",
      whatItDoesNotAsk:
        "This is not denying that diplomacy, trade, or institutions can help preserve peace.",
    },
  },
  {
    id: "an_in3",
    kind: "likert",
    dimension: "institutions",
    reverse: true,
    prompt:
      "Many international institutions do little more than reflect what powerful states already want.",
    clarification: {
      whatItAsks:
        "Whether institutions have little independent effect beyond the preferences of the strongest actors.",
      whatItDoesNotAsk:
        "This is not asking whether powerful states influence institutions at all.",
    },
  },
  {
    id: "an_pe3",
    kind: "likert",
    dimension: "politicalEconomy",
    reverse: true,
    prompt:
      "Most international crises can be understood without looking much at who controls credit, production, or market access.",
    clarification: {
      whatItAsks:
        "Whether deeper patterns of leverage and dependence are usually secondary when crises unfold.",
      whatItDoesNotAsk:
        "This is not claiming every crisis is reducible to economics.",
    },
  },
  {
    id: "an_oj3",
    kind: "likert",
    dimension: "orderJustice",
    prompt:
      "There should be a strong default rule against intervening in another state's domestic affairs.",
    clarification: {
      whatItAsks:
        "Whether non-intervention should usually be the baseline even in morally difficult cases.",
      whatItDoesNotAsk:
        "This is not asking whether intervention is never justified.",
    },
  },
  {
    id: "an_tradeoff_legitimacy",
    kind: "tradeoff",
    prompt:
      "A technically effective global institution faces a legitimacy crisis among rising powers. What is the deeper problem?",
    options: [
      {
        id: "governance",
        title: "Its governance is outdated",
        label:
          "Voting weights, leadership access, and transparency rules have not adjusted enough to keep the institution credible.",
        signals: { institutions: 6.2, domesticFilters: 4.6, normsIdentity: 4.4 },
      },
      {
        id: "exclusion",
        title: "Its social foundations are contested",
        label:
          "The institution reflects particular norms and voices that others never fully accepted as neutral or universal.",
        signals: { normsIdentity: 6.4, institutions: 4.6, domesticFilters: 4.8 },
      },
      {
        id: "power",
        title: "Power shifted beneath it",
        label:
          "States invoke legitimacy language when the institution serves them less well than before. The real story is changing power.",
        signals: { securityCompetition: 6.0, institutions: 3.0, normsIdentity: 3.1 },
      },
      {
        id: "hierarchy",
        title: "Its structure was unequal from the start",
        label:
          "The institution sits inside a broader hierarchy of finance, production, and agenda-setting that procedural reform alone cannot fix.",
        signals: { politicalEconomy: 6.3, institutions: 3.1, normsIdentity: 4.7 },
      },
    ],
  },
  {
    id: "an_tradeoff_rival",
    kind: "tradeoff",
    prompt:
      "A long-time rival democratizes, joins institutions, and speaks in more cooperative terms. How much should the threat assessment change?",
    options: [
      {
        id: "update",
        title: "Update it substantially",
        label:
          "Changes in regime type, elite discourse, and relationship history provide real evidence about future behavior.",
        signals: { normsIdentity: 6.2, securityCompetition: 2.9, institutions: 4.7 },
      },
      {
        id: "minimal",
        title: "Update it only cautiously",
        label:
          "Capabilities and structural incentives still do most of the work. Political signals can reverse quickly.",
        signals: { securityCompetition: 6.3, normsIdentity: 2.8 },
      },
      {
        id: "integration",
        title: "Watch institutional integration",
        label:
          "Membership in shared institutions matters more than declared values because it changes incentives and raises the cost of aggression.",
        signals: { institutions: 6.1, securityCompetition: 3.6, normsIdentity: 4.5 },
      },
      {
        id: "durability",
        title: "Watch domestic durability",
        label:
          "The critical question is whether the new course is rooted in domestic coalitions strong enough to last beyond one leadership cycle.",
        signals: { domesticFilters: 6.3, normsIdentity: 4.8, institutions: 4.4 },
      },
    ],
  },
  {
    id: "an_case_finance",
    kind: "miniCase",
    prompt:
      "A middle-income country faces collapse after capital flight and creditor pressure for austerity. What is the most persuasive reading?",
    helpText:
      "Answer this as an argument about the crisis, not as a guess about what international markets would currently reward.",
    options: [
      {
        id: "credibility",
        title: "Domestic credibility failure",
        label:
          "External pressure exposed internal weakness. Restoring credibility is the first condition for recovery.",
        signals: { politicalEconomy: 2.9, domesticFilters: 4.8, institutions: 4.3 },
      },
      {
        id: "pragmatic",
        title: "Mixed crisis, mixed repair",
        label:
          "The crisis is both domestic and structural. Use temporary controls and renegotiation, but stay inside the broader system.",
        signals: { politicalEconomy: 5.1, domesticFilters: 5.2, institutions: 5.1, restraint: 4.8 },
      },
      {
        id: "dependence",
        title: "Structural dependence exposed",
        label:
          "The crisis reflects dependence on external capital and creditor leverage. It will recur unless that structure changes.",
        signals: { politicalEconomy: 6.5, institutions: 2.8, domesticFilters: 4.8 },
      },
      {
        id: "coalitions",
        title: "Domestic distributional conflict",
        label:
          "The real fight is over who inside the country absorbs the adjustment. Financial pressure matters, but politics decides the path.",
        signals: { domesticFilters: 6.4, politicalEconomy: 5.2, institutions: 4.3 },
      },
    ],
  },
  {
    id: "an_case_burdens",
    kind: "miniCase",
    prompt:
      "A major ally keeps underspending on defense while relying on your guarantees. What is the most persuasive response?",
    helpText:
      "Treat this as a question about alliance politics under stress, not about whether you personally like the ally.",
    options: [
      {
        id: "credibility",
        title: "Free-riding corrodes credibility",
        label:
          "Unequal burden undercuts collective defense and eventually weakens deterrence itself.",
        signals: { securityCompetition: 6.0, restraint: 3.4, institutions: 3.6 },
      },
      {
        id: "capacity",
        title: "Measure shared capacity, not just shares",
        label:
          "The real question is whether the alliance still delivers usable capability and coordination, not whether every member pays the same proportion.",
        signals: { institutions: 6.1, securityCompetition: 4.1, restraint: 4.8 },
      },
      {
        id: "purpose",
        title: "The purpose is contested",
        label:
          "Burden fights usually reflect a deeper disagreement about what the alliance is for and whose strategy it serves.",
        signals: { normsIdentity: 5.8, domesticFilters: 5.4, institutions: 4.5 },
      },
      {
        id: "rebalance",
        title: "The guarantor is overextended",
        label:
          "The first correction is to narrow commitments. An alliance that depends on unsustainable guarantees is badly designed.",
        signals: { restraint: 6.3, securityCompetition: 4.6, institutions: 3.6 },
      },
    ],
  },
]

export function getFoundationQuestions(mode: QuizMode): Question[] {
  return mode === "analyst"
    ? [...standardQuestions, ...analystQuestions]
    : standardQuestions
}

export const questionCountsByMode = {
  standard: standardQuestions.length,
  analyst: standardQuestions.length + analystQuestions.length,
} as const

export const likertScale = [1, 2, 3, 4, 5, 6, 7] as const
