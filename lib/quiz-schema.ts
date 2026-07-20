import type { Question, QuizMode } from "@/lib/types"

export const SCHEMA_VERSION = 3
export const FOUNDATION_STRUCTURAL_VERSION = SCHEMA_VERSION

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
    prompt: "Major-power peace remains fragile when the balance of power is shifting.",
    clarification: {
      whatItAsks:
        "Does a shift in power make a peaceful relationship harder to maintain?",
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
      "Even without a world government, shared rules can make cooperation last.",
    clarification: {
      whatItAsks:
        "Can shared rules help states cooperate when no higher authority can enforce them?",
    },
  },
  {
    id: "df1",
    kind: "likert",
    dimension: "domesticFilters",
    prompt:
      "Changes in who governs and whom they answer to often shift foreign policy as much as outside threats do.",
    clarification: {
      whatItAsks:
        "Can elections, leadership changes, and domestic coalitions shift foreign policy as much as events abroad?",
    },
  },
  {
    id: "ni1",
    kind: "likert",
    dimension: "normsIdentity",
    prompt:
      "The meaning of a military buildup depends more on the states' history and mutual trust than on the size of the force.",
    clarification: {
      whatItAsks:
        "When states judge a military move, do past relations and trust tell us more than the size of the force?",
    },
  },
  {
    id: "pe1",
    kind: "likert",
    dimension: "politicalEconomy",
    prompt:
      "In a crisis, control over credit, production, and supply-chain chokepoints shapes state choices more than military capability alone.",
    clarification: {
      whatItAsks:
        "Do finance and supply-chain dependence constrain states more than military differences do?",
    },
  },
  {
    id: "rs1",
    kind: "likert",
    dimension: "restraint",
    prompt:
      "When a state keeps pushing for gains beyond what it needs for defense, rivals and bystanders often respond in ways that leave it less secure.",
    clarification: {
      whatItAsks:
        "Does seeking gains beyond defense usually trigger resistance and leave a state less secure?",
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
        "When stability and justice conflict, should preserving order usually come first?",
    },
  },
  {
    id: "tradeoff_alliances",
    kind: "tradeoff",
    cardType: "explanation",
    allowSecondChoiceInAnalyst: true,
    prompt: "What most often keeps alliances together under real pressure?",
    helpText: "Choose the explanation you would use first.",
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
        "Does uncertainty about another state's future behavior push states to prepare for conflict?",
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
        "Can monitoring and regular contact keep an agreement working when the parties do not trust each other?",
    },
  },
  {
    id: "tradeoff_interdependence",
    kind: "tradeoff",
    cardType: "explanation",
    allowSecondChoiceInAnalyst: true,
    prompt:
      "When economic interdependence becomes dangerous, what is usually the deeper problem?",
    helpText: "Choose the cause, not a policy response.",
    options: [
      {
        id: "rivalry",
        title: "Rivalry turns ties into leverage",
        label:
          "Interdependence becomes dangerous mainly when strategic competition grows and states start treating economic exposure as a security risk.",
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
    id: "df2",
    kind: "likert",
    dimension: "domesticFilters",
    prompt:
      "States facing similar outside pressure can still act very differently because their internal politics differ.",
    clarification: {
      whatItAsks:
        "Do different political systems and coalitions lead states facing the same pressure to respond differently?",
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
        "Are a state's interests shaped partly by status, identity, and recognition?",
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
        "Do global economic rules give some states built-in advantages over others?",
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
        "Is it usually safer to limit commitments than to take every chance for advantage?",
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
        "Can extreme harm to civilians justify military action without the government's consent?",
      whatItDoesNotAsk:
        "This is about extreme emergency cases, not ordinary intervention or open-ended regime change.",
      terms: [
        {
          term: "Sovereignty",
          definition: "The principle that a state normally controls what happens within its own territory.",
        },
      ],
    },
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
      "A government is committing mass atrocities. Military action could save lives but weaken legal restraints on future interventions. What should govern the decision?",
    clarification: {
      whatItAsks:
        "Which should guide the choice when law, civilian protection, authority, and likely outcomes point in different directions?",
      whatItDoesNotAsk:
        "This is limited to severe mass atrocities, not ordinary disputes or open-ended regime change.",
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
      "A rival is catching up in advanced semiconductors while your firms depend on its supply chain. What should guide the response?",
    helpText: "Choose the main goal of the response.",
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
      "Mass killing is underway. A Security Council veto blocks UN authorization, but a regional body backs limited action. What should guide the response?",
    helpText: "Choose the principle that should guide the response.",
    clarification: {
      whatItAsks:
        "Which should carry most weight: UN authorization, stopping the killing, regional backing, or the risk of making things worse?",
      whatItDoesNotAsk:
        "Regional backing is not the same as UN authorization.",
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
      "Long stretches of peace among major powers usually depend on conditions that can weaken or disappear.",
    clarification: {
      whatItAsks:
        "Does peace last only while the conditions supporting it remain in place?",
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
        "Do international institutions shape behavior on their own, or mainly reflect what powerful states want?",
    },
  },
  {
    id: "an_pe3",
    kind: "likert",
    dimension: "politicalEconomy",
    reverse: true,
    prompt:
      "For most international crises, who controls credit, production, or market access is secondary to the immediate security and diplomatic facts.",
    clarification: {
      whatItAsks:
        "In a fast-moving crisis, do security and diplomacy usually explain more than economic dependence?",
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
        "Should non-intervention be the usual rule, including in morally difficult cases?",
      terms: [
        {
          term: "Non-intervention",
          definition: "The principle that outside states should usually not use force or coercion inside another state's territory.",
        },
      ],
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
        "When words and military deployments conflict, which is more reliable?",
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
        "Can disputes over status and recognition help predict how a rival will act?",
    },
  },
  {
    id: "an_pe4",
    kind: "likert",
    dimension: "politicalEconomy",
    prompt:
      "Control over technical standards, platforms, and data will shape geopolitical power more deeply than military or territorial contests alone.",
    clarification: {
      whatItAsks:
        "Will control of standards, platforms, and data shape power more deeply than territory and military force?",
    },
  },
  {
    id: "an_in4",
    kind: "likert",
    dimension: "institutions",
    prompt:
      "Institutions lose legitimacy faster when a few powerful states write rules for everyone else.",
    clarification: {
      whatItAsks:
        "Do institutions weaken faster when most states must follow rules they had little role in writing?",
    },
  },
  {
    id: "an_tradeoff_legitimacy",
    kind: "tradeoff",
    cardType: "explanation",
    allowSecondChoiceInAnalyst: true,
    prompt:
      "A global institution seems to work reasonably well, but rising powers increasingly reject its legitimacy. What best explains the problem?",
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
      "A long-time rival democratizes, joins major institutions, and starts talking more cooperatively. How much should your threat assessment change?",
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
          "Membership in shared institutions gives stronger evidence than declared values because it changes incentives and raises the cost of aggression.",
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
    helpText: "Choose the best explanation of the crisis.",
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
          "Financial pressure sets the constraint, but domestic politics decides who absorbs the adjustment.",
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
    helpText: "Choose the response regardless of how you feel about the ally.",
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
    helpText: "Choose the signal you would trust first.",
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
      "A coalition is debating export controls, investment screening, and shared technology standards against a rival. What is the main issue behind that push?",
    helpText: "Choose what best explains the package as a whole.",
    clarification: {
      whatItAsks:
        "Which best explains the package: slowing a rival, controlling chokepoints, limiting security rules, or preventing a new hierarchy?",
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
          term: "Shared standards groups",
          definition: "Groups of states or firms that coordinate technical rules among themselves instead of waiting for universal agreement.",
        },
      ],
    },
    options: [
      {
        id: "edge",
        title: "Slow a rival's climb",
        label:
          "The package is mainly about slowing a rival in sectors that feed military and industrial power.",
        signals: { securityCompetition: 6.2, politicalEconomy: 4.7, restraint: 3.4 },
      },
      {
        id: "chokepoints",
        title: "Control the chokepoints",
        label:
          "The deeper issue is who controls the bottlenecks, data, and standards others cannot easily replace.",
        signals: { politicalEconomy: 6.5, securityCompetition: 4.7, institutions: 3.4 },
      },
      {
        id: "narrow",
        title: "Keep the rules limited",
        label:
          "The better case is for narrow allied rules that protect security without breaking the wider system.",
        signals: { institutions: 6.2, restraint: 5.0, securityCompetition: 4.3 },
      },
      {
        id: "hierarchy",
        title: "Do not create a new hierarchy",
        label:
          "The risk is a system where a few leading states write the rules and everyone else mainly absorbs the costs.",
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
    helpText: "Answer from the middle power's position.",
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
    helpText: "Answer from the borrowing state's position.",
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
    helpText: "Choose the priority that should guide the response.",
    options: [
      {
        id: "deter",
        title: "Hold the line on deterrence",
        label:
          "Public backing deters more testing by the rival.",
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
    helpText: "Consider long-term exposure, not only the upfront price.",
    clarification: {
      whatItAsks:
        "Which risk should lead: security exposure, long-term dependence, coordination with allies, or loss of autonomy?",
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
      "Rising powers start building alternative banks, payment systems, and development forums. What is the deeper issue?",
    helpText: "Choose why the alternatives are attractive, not your preferred reform.",
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
        title: "States want room outside hierarchy",
        label:
          "Alternative institutions give states options beyond credit, payment, and lending systems controlled by others.",
        signals: { politicalEconomy: 6.4, institutions: 4.0, orderJustice: 3.6 },
      },
      {
        id: "legitimation",
        title: "Leaders want visible autonomy",
        label:
          "Alternative institutions also help leaders show domestic audiences and partners that they are not permanently trapped inside systems dominated by others.",
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
    helpText: "Answer from the nonaligned state's position.",
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
          "Protect energy, food, and coalition stability at home; the government cannot sustain a line that breaks its domestic base.",
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
      "A post-colonial government sees calls for military intervention next door after severe repression. Which line looks strongest from its side?",
    helpText: "Answer from that government's position.",
    options: [
      {
        id: "shield",
        title: "Keep the bar for intervention high",
        label:
          "Because intervention is applied selectively, weaker states cannot treat it as a neutral rule.",
        signals: { orderJustice: 6.3, restraint: 5.4, normsIdentity: 4.8 },
      },
      {
        id: "threshold",
        title: "Extreme harm can still justify action",
        label:
          "Even a government that is very protective of sovereignty may accept a real exception when mass killing becomes overwhelming.",
        signals: { orderJustice: 2.7, restraint: 3.8, normsIdentity: 4.9 },
      },
      {
        id: "regional",
        title: "Regional backing is the key test",
        label:
          "An exception is most defensible when nearby states define the aim and limits, not when distant powers frame it alone.",
        signals: { institutions: 6.0, orderJustice: 4.2, restraint: 5.0 },
      },
      {
        id: "aftermath",
        title: "Ask what follows after intervention",
        label:
          "The main question is whether outside force will truly protect people or instead deepen collapse and outside control.",
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
    helpText: "Choose the explanation, not your preferred policy response.",
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
    helpText: "Choose the priority, not the most defensible public message.",
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
    helpText: "Choose the central tradeoff, not your preferred outcome.",
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

// ── Foundation Standard sections (V14 friction reduction) ────────────────────
// Section markers shown to the user during the Standard quiz flow. Each entry
// lists the question IDs in display order — the standardQuestions array above
// is ordered to match these section boundaries.

export type FoundationSection = {
  index: number
  title: string
  questionIds: string[]
}

export const foundationStandardSections: FoundationSection[] = [
  {
    index: 1,
    title: "Your IR baseline",
    questionIds: ["sc1", "in1", "df1", "ni1", "pe1", "rs1", "oj1"],
  },
  {
    index: 2,
    title: "Alliances and interdependence",
    questionIds: ["tradeoff_alliances", "sc2", "in2", "tradeoff_interdependence"],
  },
  {
    index: 3,
    title: "Domestic politics and identity",
    questionIds: ["df2", "ni2", "pe2"],
  },
  {
    index: 4,
    title: "Strategy and values",
    questionIds: ["rs2", "oj2", "tradeoff_strategy", "tradeoff_intervention"],
  },
  {
    index: 5,
    title: "Applied cases",
    questionIds: ["case_semiconductors", "case_protection"],
  },
]

export const foundationSectionTotal = foundationStandardSections.length

export function getFoundationSectionForQuestionId(
  questionId: string,
): FoundationSection | undefined {
  return foundationStandardSections.find((section) =>
    section.questionIds.includes(questionId),
  )
}

// Index (0-based) of the last question in section 1 — used to trigger the
// midpoint preview interstitial after the user finishes the IR baseline block.
export const foundationMidpointQuestionIndex =
  foundationStandardSections[0].questionIds.length - 1
