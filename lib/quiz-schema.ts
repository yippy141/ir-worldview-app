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
      "Long periods of peace between major powers can unravel when the balance of power changes.",
    clarification: {
      whatItAsks:
        "Whether peace between major powers is usually conditional rather than permanently solved.",
      whatItDoesNotAsk:
        "This is not saying war is inevitable or that diplomacy never matters.",
      terms: [
        {
          term: "Balance of power",
          definition: "How military, economic, and strategic capability is distributed among the strongest states.",
        },
      ],
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
      "Changes in leaders and domestic coalitions often shift foreign policy more than slow changes in the external balance do.",
    clarification: {
      whatItAsks:
        "Whether foreign policy change is explained more by domestic political turnover than by gradual structural pressure from outside.",
      whatItDoesNotAsk:
        "This is not denying that outside pressure can still dominate in some cases.",
    },
  },
  {
    id: "ni1",
    kind: "likert",
    dimension: "normsIdentity",
    prompt:
      "The same military move can look threatening in one relationship and reassuring in another.",
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
      "Trade, finance, and supply chains belong in the main explanation of world politics, not in a separate box.",
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
      "Major powers often make themselves less secure when they push for advantages beyond what defense requires.",
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
      "A stable international order is often worth preserving even when serious injustice remains unresolved.",
    clarification: {
      whatItAsks:
        "Whether stability and precedent should usually take priority when they collide with broader moral goals.",
      whatItDoesNotAsk: "This is not saying injustice is unimportant.",
    },
  },
  {
    id: "tradeoff_alliances",
    kind: "tradeoff",
    cardType: "explanation",
    allowSecondChoiceInAnalyst: true,
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
      "Monitoring and repeated contact can keep international agreements alive even when trust is thin.",
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
      "States facing similar outside pressure can still act very differently because their internal politics differ.",
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
      "Status, recognition, and legitimacy help shape what states want, not just how they pursue fixed interests.",
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
      "Economic rules often give stronger states lasting structural advantages that weaker states must work around.",
    clarification: {
      whatItAsks:
        "Whether hierarchy is built into major economic arrangements, not just used tactically from case to case.",
      whatItDoesNotAsk:
        "This is not asking whether weaker states have no room to maneuver.",
      terms: [
        {
          term: "Structural advantage",
          definition: "A built-in benefit created by rules or institutions, not just a one-off bargaining win.",
        },
      ],
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
      "When mass atrocities become severe enough, outside powers can justifiably override a state's sovereignty to stop them.",
    clarification: {
      whatItAsks:
        "Whether sovereignty should remain a near-absolute barrier or whether extreme civilian harm creates a legitimate exception.",
      whatItDoesNotAsk:
        "This is not a blanket endorsement of regime change or constant intervention.",
      terms: [
        {
          term: "Sovereignty",
          definition: "The principle that a state normally controls what happens within its own territory.",
        },
      ],
    },
  },
  {
    id: "tradeoff_interdependence",
    kind: "tradeoff",
    cardType: "explanation",
    allowSecondChoiceInAnalyst: true,
    prompt:
      "When economic interdependence becomes dangerous, what is usually the deeper problem?",
    helpText:
      "This asks what makes the ties dangerous at the deepest level, not which policy tool you like most.",
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
    cardType: "decision",
    allowSecondChoiceInAnalyst: true,
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
    cardType: "decision",
    allowSecondChoiceInAnalyst: true,
    prompt:
      "A state is committing mass atrocities, but outside action could weaken legal restraints in other cases. What should govern the decision?",
    clarification: {
      whatItAsks:
        "Whether legality, civilian protection, legitimate authority, or likely consequences should carry the most weight when they point in different directions.",
      whatItDoesNotAsk:
        "This is not assuming intervention is easy, clean, or automatically more moral than restraint.",
      terms: [
        {
          term: "Mandate",
          definition: "A limited and publicly stated authorization that defines what an intervention is allowed to do.",
        },
      ],
    },
    options: [
      {
        id: "precedent",
        title: "Protect the precedent",
        label:
          "If the barrier against intervention erodes too easily, later abuses will do wider damage than this case can justify.",
        signals: { orderJustice: 6.3, restraint: 5.2, institutions: 4.8 },
      },
      {
        id: "protection",
        title: "Protect the victims",
        label:
          "When civilian harm crosses an extreme threshold, the moral case can outweigh the usual presumption against intervention.",
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
    cardType: "decision",
    allowSecondChoiceInAnalyst: true,
    prompt:
      "A rival power is catching up in advanced semiconductors while your firms stay deeply tied to its supply chain. What should drive the response?",
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
    cardType: "decision",
    allowSecondChoiceInAnalyst: true,
    prompt:
      "Mass killing is underway. A UN Security Council veto blocks authorization, but a credible regional body backs limited action. What matters most?",
    helpText:
      "Focus on the principle you think should govern the response, not on whether any real-world coalition would execute it well.",
    clarification: {
      whatItAsks:
        "Whether legal authorization, civilian protection, bounded regional legitimacy, or prudential consequences should carry the most weight in an emergency.",
      whatItDoesNotAsk:
        "This is not saying regional backing is the same thing as universal legal approval.",
      terms: [
        {
          term: "Authorization",
          definition: "Formal approval through an institution such as the UN Security Council.",
        },
      ],
    },
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
      "Long periods of peace among major powers usually depend on conditions that can change.",
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
      "Many international institutions mostly reflect what powerful states already want.",
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
      "You can understand most international crises without looking much at who controls credit, production, or market access.",
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
      "There should usually be a strong default rule against outside intervention in another state's internal affairs.",
    clarification: {
      whatItAsks:
        "Whether non-intervention should usually be the baseline even in morally difficult cases.",
      whatItDoesNotAsk:
        "This is not asking whether intervention is never justified.",
      terms: [
        {
          term: "Non-intervention",
          definition: "The principle that outside states should usually not use force or coercion inside another state's territory.",
        },
      ],
    },
  },
  {
    id: "an_df3",
    kind: "likert",
    dimension: "domesticFilters",
    prompt:
      "At the margin, foreign policy usually shifts faster when ruling coalitions change than when the external balance moves gradually.",
    clarification: {
      whatItAsks:
        "Whether foreign policy change comes more from domestic political turnover than from structural pressure in the international system.",
      whatItDoesNotAsk:
        "This is not saying domestic politics always overrides severe outside pressure.",
    },
  },
  {
    id: "an_sc4",
    kind: "likert",
    dimension: "securityCompetition",
    prompt:
      "When what states say and what they deploy point in different directions, deployments are usually the safer guide.",
    clarification: {
      whatItAsks:
        "What evidence should carry more weight when verbal signals and material moves conflict.",
      whatItDoesNotAsk:
        "This is not saying rhetoric and diplomacy never reveal anything real.",
    },
  },
  {
    id: "an_ni3",
    kind: "likert",
    dimension: "normsIdentity",
    prompt:
      "Status claims and recognition disputes can reveal something real about a rival's future conduct, not just decorate the rhetoric.",
    clarification: {
      whatItAsks:
        "Whether status language and recognition fights can reveal real motives and likely behavior.",
      whatItDoesNotAsk:
        "This is not saying rhetoric should outweigh capabilities in every case.",
    },
  },
  {
    id: "an_pe4",
    kind: "likert",
    dimension: "politicalEconomy",
    prompt:
      "Control over data, standards, and digital infrastructure belongs near the center of geopolitical analysis.",
    clarification: {
      whatItAsks:
        "Whether technology systems and market control now shape power in ways IR analysis should treat as central.",
      whatItDoesNotAsk:
        "This is not saying military power or territorial issues stopped mattering.",
    },
  },
  {
    id: "an_in4",
    kind: "likert",
    dimension: "institutions",
    prompt:
      "Global rules last longer when middle powers and lower-income states help write them rather than just follow them.",
    clarification: {
      whatItAsks:
        "Whether broader authorship makes institutions more durable and more widely accepted.",
      whatItDoesNotAsk:
        "This is not asking whether every institution can represent every state equally in every decision.",
    },
  },
  {
    id: "an_tradeoff_legitimacy",
    kind: "tradeoff",
    cardType: "explanation",
    allowSecondChoiceInAnalyst: true,
    prompt:
      "A global institution works technically but is losing legitimacy among rising powers. What is the deeper problem?",
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
    cardType: "both",
    allowSecondChoiceInAnalyst: true,
    prompt:
      "A long-time rival democratizes, joins institutions, and speaks more cooperatively. How much should the threat assessment change?",
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
    cardType: "explanation",
    allowSecondChoiceInAnalyst: true,
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
    cardType: "decision",
    allowSecondChoiceInAnalyst: true,
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
  {
    id: "an_tradeoff_evidence",
    kind: "tradeoff",
    cardType: "both",
    allowSecondChoiceInAnalyst: true,
    prompt:
      "In a crisis with mixed signals, what evidence deserves the most weight?",
    helpText:
      "Pick the signal you would trust first, not the one you think should matter in an ideal world.",
    options: [
      {
        id: "capabilities",
        title: "Capabilities and posture",
        label:
          "Deployments, force posture, and hard capability shifts should outweigh softer signals when they point in different directions.",
        signals: { securityCompetition: 6.3, normsIdentity: 3.0 },
      },
      {
        id: "commitments",
        title: "Institutions and commitments",
        label:
          "Treaty behavior, inspections, and crisis rules tell you more because they change incentives and raise the cost of bluffing.",
        signals: { institutions: 6.1, securityCompetition: 3.6, restraint: 4.8 },
      },
      {
        id: "coalitions",
        title: "Domestic staying power",
        label:
          "The best clue is whether leaders have the coalition, budget, and public room to sustain the line they are taking.",
        signals: { domesticFilters: 6.4, institutions: 4.3, restraint: 4.9 },
      },
      {
        id: "status",
        title: "Status and relationship signals",
        label:
          "Changes in status claims, recognition disputes, and political language can shift what behavior means before capabilities do.",
        signals: { normsIdentity: 6.3, securityCompetition: 3.2, institutions: 4.4 },
      },
    ],
  },
  {
    id: "an_tradeoff_tech_order",
    kind: "tradeoff",
    cardType: "explanation",
    allowSecondChoiceInAnalyst: true,
    prompt:
      "A coalition wants export controls, investment screening, and standards clubs in key technologies. What is the deeper issue?",
    helpText:
      "This asks what makes the push most intelligible, not whether any one tool is well designed.",
    clarification: {
      whatItAsks:
        "Whether the push is best explained by strategic rivalry, control over chokepoints, bounded security coordination, or the risk of hardening hierarchy.",
      whatItDoesNotAsk:
        "This is not assuming all three tools work equally well or have the same political purpose.",
      terms: [
        {
          term: "Export controls",
          definition: "Rules that restrict the sale of sensitive goods or technologies to certain foreign buyers.",
        },
        {
          term: "Investment screening",
          definition: "Government review of foreign investments that may create security or strategic risks.",
        },
        {
          term: "Standards clubs",
          definition: "Groups of states or firms that coordinate technical rules among themselves rather than universally.",
        },
      ],
    },
    options: [
      {
        id: "edge",
        title: "Preserve the edge",
        label:
          "The point is to slow a rival's climb in sectors that feed military and industrial power.",
        signals: { securityCompetition: 6.2, politicalEconomy: 4.7, restraint: 3.4 },
      },
      {
        id: "chokepoints",
        title: "Control the chokepoints",
        label:
          "What matters most is who controls the bottlenecks, data, and standards others cannot easily replace.",
        signals: { politicalEconomy: 6.5, securityCompetition: 4.7, institutions: 3.4 },
      },
      {
        id: "narrow",
        title: "Keep controls narrow",
        label:
          "The best route is limited allied rules that protect security without breaking the wider system.",
        signals: { institutions: 6.2, restraint: 5.0, securityCompetition: 4.3 },
      },
      {
        id: "hierarchy",
        title: "Do not harden hierarchy",
        label:
          "Tech clubs can harden a world where leading states write the rules and others mainly absorb the costs.",
        signals: { politicalEconomy: 5.9, normsIdentity: 4.9, orderJustice: 3.1 },
      },
    ],
  },
  {
    id: "an_case_middle_power",
    kind: "miniCase",
    cardType: "actorLens",
    allowSecondChoiceInAnalyst: true,
    prompt:
      "A middle power relies on one bloc for security and the other for trade. Which logic looks strongest from its side?",
    helpText:
      "Answer from the middle power's own position. Do not answer as either major bloc would prefer.",
    options: [
      {
        id: "shield",
        title: "Lock in the security shield",
        label:
          "Choose the security provider clearly before a crisis forces the decision under worse conditions.",
        signals: { securityCompetition: 5.9, institutions: 4.2, restraint: 3.7 },
      },
      {
        id: "hedge",
        title: "Hedge and diversify",
        label:
          "Preserve room to maneuver by spreading risk across markets, partners, and supply lines.",
        signals: { restraint: 5.9, politicalEconomy: 5.2, institutions: 4.7 },
      },
      {
        id: "peers",
        title: "Write rules with peers",
        label:
          "Coalition-building with other middle powers is the best way to widen bargaining room and resist bloc pressure.",
        signals: { institutions: 6.0, normsIdentity: 5.1, politicalEconomy: 4.6 },
      },
      {
        id: "extract",
        title: "Exploit the squeeze",
        label:
          "Use the country's pivotal position to extract concessions from both sides rather than declare a camp early.",
        signals: { domesticFilters: 5.4, politicalEconomy: 5.6, restraint: 4.4 },
      },
    ],
  },
  {
    id: "an_case_green_finance",
    kind: "miniCase",
    cardType: "actorLens",
    allowSecondChoiceInAnalyst: true,
    prompt:
      "A lower-income state is offered green-finance money tied to procurement and reform rules. Which logic looks strongest from its side?",
    helpText:
      "Answer from the borrowing state's vantage point, not from the donors' preferred narrative.",
    options: [
      {
        id: "stabilize",
        title: "Stabilize first",
        label:
          "Access to finance and policy credibility come first. Bargaining room is thin when fiscal stress is high.",
        signals: { institutions: 5.8, domesticFilters: 4.9, politicalEconomy: 3.4 },
      },
      {
        id: "space",
        title: "Protect policy space",
        label:
          "The key issue is whether the deal locks the country into dependence and weakens local industry.",
        signals: { politicalEconomy: 6.5, domesticFilters: 4.8, orderJustice: 3.6 },
      },
      {
        id: "bloc",
        title: "Bargain with peers",
        label:
          "The best leverage comes from negotiating with peers that face the same terms rather than one by one.",
        signals: { institutions: 5.7, normsIdentity: 5.2, politicalEconomy: 5.0 },
      },
      {
        id: "home",
        title: "Watch the home coalition",
        label:
          "Even a fair external package fails if domestic winners and losers make it politically unsustainable.",
        signals: { domesticFilters: 6.4, politicalEconomy: 4.9, institutions: 4.3 },
      },
    ],
  },
  {
    id: "an_case_maritime_crisis",
    kind: "miniCase",
    cardType: "decision",
    allowSecondChoiceInAnalyst: true,
    prompt:
      "An ally stages risky probes in disputed waters and asks for public backing. What should weigh most?",
    helpText:
      "Focus on the governing priority, not on which side seems more sympathetic in the abstract.",
    options: [
      {
        id: "deter",
        title: "Hold the line on deterrence",
        label:
          "Public backing matters because hesitation invites more testing by the rival.",
        signals: { securityCompetition: 6.3, restraint: 3.3, institutions: 3.8 },
      },
      {
        id: "entrapment",
        title: "Avoid entrapment",
        label:
          "The bigger danger is being pulled into an escalation spiral by an ally's local gambles.",
        signals: { restraint: 6.3, securityCompetition: 4.2, institutions: 4.0 },
      },
      {
        id: "offramp",
        title: "Build an off-ramp",
        label:
          "The priority is monitoring, crisis rules, and quiet bargaining that let both sides step back.",
        signals: { institutions: 6.1, restraint: 5.2, securityCompetition: 4.0 },
      },
      {
        id: "ally_politics",
        title: "Read the ally's politics",
        label:
          "Before backing the move, ask whether the probe is being driven by domestic weakness or elite competition at home.",
        signals: { domesticFilters: 6.2, restraint: 4.8, securityCompetition: 4.1 },
      },
    ],
  },
  {
    id: "an_case_digital_stack",
    kind: "miniCase",
    cardType: "decision",
    allowSecondChoiceInAnalyst: true,
    prompt:
      "A government must choose between a cheap foreign digital stack and a costlier allied alternative. What should drive the choice?",
    helpText:
      "Think about what kind of exposure matters most over time, not only the immediate sticker price.",
    clarification: {
      whatItAsks:
        "Whether security exposure, long-run dependence, coordination with partners, or room for autonomy should carry the most weight in a high-stakes technology choice.",
      whatItDoesNotAsk:
        "This is not asking whether the cheaper option is always careless or the allied option is always wise.",
      terms: [
        {
          term: "Digital stack",
          definition: "The combined hardware, software, cloud services, and technical standards a digital system runs on.",
        },
        {
          term: "Interoperability",
          definition: "The ability of systems from different countries or firms to work together reliably.",
        },
      ],
    },
    options: [
      {
        id: "security",
        title: "Security exposure",
        label:
          "Choose the costlier stack if it lowers the risk that a rival can coerce or disable critical systems later.",
        signals: { securityCompetition: 6.0, politicalEconomy: 4.9, restraint: 3.7 },
      },
      {
        id: "dependence",
        title: "Dependency and standards control",
        label:
          "The central issue is who controls the standards, maintenance, and chokepoints once the system becomes hard to replace.",
        signals: { politicalEconomy: 6.4, securityCompetition: 4.4, institutions: 3.8 },
      },
      {
        id: "interoperability",
        title: "Interoperability with partners",
        label:
          "The best choice is the one that fits shared rules and technical coordination across trusted partners.",
        signals: { institutions: 6.1, politicalEconomy: 4.6, restraint: 4.8 },
      },
      {
        id: "autonomy",
        title: "Avoid bloc lock-in",
        label:
          "Turning every digital choice into a camp marker can narrow autonomy and harden a divided order.",
        signals: { normsIdentity: 5.7, restraint: 5.4, securityCompetition: 3.3 },
      },
    ],
  },
  {
    id: "an_tradeoff_parallel_order",
    kind: "tradeoff",
    cardType: "explanation",
    allowSecondChoiceInAnalyst: true,
    prompt:
      "Rising powers start building parallel banks, payment rails, and development forums. What is the deeper issue?",
    helpText:
      "Choose the logic that best explains why alternative institutions become attractive, not the reform plan you personally prefer.",
    options: [
      {
        id: "reform",
        title: "Old governance stopped adjusting",
        label:
          "The main problem is that existing institutions no longer give rising states enough voice, protection, or agenda-setting power.",
        signals: { institutions: 6.3, domesticFilters: 4.6, normsIdentity: 4.5 },
      },
      {
        id: "power",
        title: "Power shifted first",
        label:
          "Institutional conflict is downstream from changing material power. The argument over rules reflects a harder strategic transition.",
        signals: { securityCompetition: 6.1, institutions: 3.0, politicalEconomy: 4.7 },
      },
      {
        id: "hierarchy",
        title: "States want room from hierarchy",
        label:
          "Parallel institutions matter because they create space from credit, payment, and lending systems others already dominate.",
        signals: { politicalEconomy: 6.4, institutions: 4.0, orderJustice: 3.6 },
      },
      {
        id: "legitimation",
        title: "Leaders need proof of autonomy",
        label:
          "Alternative institutions also help ruling coalitions show they are not permanently trapped inside someone else's order.",
        signals: { domesticFilters: 6.2, normsIdentity: 5.0, institutions: 4.1 },
      },
    ],
  },
  {
    id: "an_case_sanctions_alignment",
    kind: "miniCase",
    cardType: "actorLens",
    allowSecondChoiceInAnalyst: true,
    prompt:
      "A nonaligned state condemns aggression but relies on the aggressor for cheap energy and fertilizer. Which logic looks strongest from its side?",
    helpText:
      "Answer from the state's own position, not from what either camp wants it to say in public.",
    options: [
      {
        id: "norm",
        title: "Defend the rule despite the cost",
        label:
          "Absorbing real pain may be necessary if the state wants to defend the rule against conquest credibly.",
        signals: { institutions: 5.8, orderJustice: 5.9, restraint: 3.8 },
      },
      {
        id: "stability",
        title: "Protect domestic stability first",
        label:
          "Energy, food, and coalition stability at home matter first because a line the government cannot sustain will quickly collapse.",
        signals: { domesticFilters: 6.4, restraint: 5.1, politicalEconomy: 4.9 },
      },
      {
        id: "diversify",
        title: "Use the crisis to diversify",
        label:
          "The stronger answer is to reduce structural dependence over time rather than swing instantly into a new dependency.",
        signals: { politicalEconomy: 6.3, restraint: 5.4, institutions: 4.3 },
      },
      {
        id: "hedge",
        title: "Condemn, but keep room to hedge",
        label:
          "The state should oppose the breach without turning itself into an enforcement arm for someone else's wider strategy.",
        signals: { restraint: 6.0, normsIdentity: 4.8, institutions: 4.2 },
      },
    ],
  },
  {
    id: "an_case_intervention_memory",
    kind: "miniCase",
    cardType: "actorLens",
    allowSecondChoiceInAnalyst: true,
    prompt:
      "A post-colonial government sees calls for intervention next door after severe repression. Which logic looks strongest from its side?",
    helpText:
      "Answer from that government's vantage point, not from the outside coalition calling for action.",
    options: [
      {
        id: "shield",
        title: "Keep the sovereignty bar high",
        label:
          "Force is applied selectively enough that weaker states cannot treat intervention as a neutral rule.",
        signals: { orderJustice: 6.3, restraint: 5.4, normsIdentity: 4.8 },
      },
      {
        id: "threshold",
        title: "Extreme harm can still justify action",
        label:
          "Even from a sovereignty-sensitive position, mass killing can create a real exception when the harm is overwhelming.",
        signals: { orderJustice: 2.7, restraint: 3.8, normsIdentity: 4.9 },
      },
      {
        id: "regional",
        title: "Regional ownership is the key test",
        label:
          "The most defensible exception is one bounded by nearby political ownership rather than distant moral language alone.",
        signals: { institutions: 6.0, orderJustice: 4.2, restraint: 5.0 },
      },
      {
        id: "aftermath",
        title: "Judge the aftermath first",
        label:
          "The deciding issue is whether outside force will actually protect people rather than deepen collapse and external control.",
        signals: { restraint: 6.2, domesticFilters: 4.8, orderJustice: 4.3 },
      },
    ],
  },
  {
    id: "an_case_rising_power_voice",
    kind: "miniCase",
    cardType: "explanation",
    allowSecondChoiceInAnalyst: true,
    prompt:
      "A rising power demands more voice in global rules while expanding military reach. What is the most persuasive reading?",
    helpText:
      "Pick the logic that best explains the pattern, not the response you would recommend.",
    options: [
      {
        id: "security_transition",
        title: "It is mainly a power transition",
        label:
          "As power shifts, the rising state pushes harder both militarily and institutionally because the old order serves it less well.",
        signals: { securityCompetition: 6.1, institutions: 3.5, normsIdentity: 3.8 },
      },
      {
        id: "status_recognition",
        title: "Recognition is the core issue",
        label:
          "The state wants material room, but it also wants its status and authority claims treated as legitimate.",
        signals: { normsIdentity: 6.3, securityCompetition: 3.4, institutions: 4.4 },
      },
      {
        id: "representation",
        title: "Representation is lagging",
        label:
          "The sharper problem is that existing rules and leadership structures have not adjusted enough to absorb the new weight.",
        signals: { institutions: 6.2, domesticFilters: 4.6, normsIdentity: 4.5 },
      },
      {
        id: "hierarchy_contest",
        title: "It is contesting hierarchy",
        label:
          "The dispute is not only over voice. It is also over who controls finance, technology, and agenda-setting across the wider order.",
        signals: { politicalEconomy: 6.2, securityCompetition: 4.6, normsIdentity: 4.7 },
      },
    ],
  },
  {
    id: "an_tradeoff_energy_alignment",
    kind: "tradeoff",
    cardType: "decision",
    allowSecondChoiceInAnalyst: true,
    prompt:
      "A government condemns aggression abroad, but breaking economic ties quickly would cause severe price shocks at home. What should govern its line?",
    helpText:
      "This asks what should come first in the decision, not what sounds most principled in a speech.",
    options: [
      {
        id: "defend_rule",
        title: "Defend the rule fast",
        label:
          "Absorbing real cost is part of making aggression and territorial seizure harder to normalize.",
        signals: { orderJustice: 6.1, institutions: 5.6, restraint: 3.7 },
      },
      {
        id: "protect_home",
        title: "Protect domestic stability",
        label:
          "A foreign policy that breaks the home coalition quickly will not stay credible for long.",
        signals: { domesticFilters: 6.4, restraint: 5.3, politicalEconomy: 4.7 },
      },
      {
        id: "phase_reduction",
        title: "Reduce exposure in phases",
        label:
          "The stronger line is to cut dependence over time while avoiding a shock that strengthens hard-liners at home.",
        signals: { politicalEconomy: 5.9, restraint: 5.8, domesticFilters: 5.1 },
      },
      {
        id: "hedge_diplomatically",
        title: "Keep diplomatic room",
        label:
          "Condemn the breach, but avoid turning economic pain into automatic alignment with someone else's larger strategy.",
        signals: { restraint: 5.7, normsIdentity: 4.8, institutions: 4.2 },
      },
    ],
  },
  {
    id: "an_tradeoff_ceasefire_settlement",
    kind: "tradeoff",
    cardType: "both",
    allowSecondChoiceInAnalyst: true,
    prompt:
      "A brutal war may end only if outside powers delay accountability and accept an unequal settlement. What is the deeper issue?",
    helpText:
      "Choose the logic that best captures the hard tradeoff, not the outcome that feels most satisfying on paper.",
    options: [
      {
        id: "stop_harm_now",
        title: "Stop the harm now",
        label:
          "An imperfect peace can still be defensible if it sharply reduces killing and buys time for political repair.",
        signals: { restraint: 5.9, orderJustice: 3.1, institutions: 4.8 },
      },
      {
        id: "hold_accountability_line",
        title: "Hold the accountability line",
        label:
          "If the hardest wars always suspend justice, the norm weakens exactly where future offenders are watching.",
        signals: { orderJustice: 6.2, institutions: 5.1, restraint: 4.1 },
      },
      {
        id: "sequence_peace_and_justice",
        title: "Sequence peace and justice",
        label:
          "The strongest answer is a monitored settlement that stops the war now but keeps a credible path to later accountability.",
        signals: { institutions: 6.1, restraint: 5.2, orderJustice: 4.4 },
      },
      {
        id: "read_the_power_distribution",
        title: "Read the power behind the terms",
        label:
          "The real issue is who has leverage to define both peace and justice. The settlement language follows that imbalance.",
        signals: { politicalEconomy: 5.9, domesticFilters: 4.8, orderJustice: 4.0 },
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
