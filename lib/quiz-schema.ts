import { LikertQuestion, ScenarioQuestion } from "@/lib/types"

export const SCHEMA_VERSION = 2

export const dimensionLabels = {
  securityCompetition: "Security competition",
  institutions: "Institutional efficacy",
  domesticFilters: "Domestic and transnational filters",
  normsIdentity: "Norms and identity",
  politicalEconomy: "Political economy",
  restraint: "Restraint vs maximization",
  orderJustice: "Order vs justice",
} as const

// 21 core items — 3 per dimension.
// Item IDs use the format: dimension-prefix + number (sc1, in1, etc.)
export const coreQuestions: LikertQuestion[] = [
  // ── Security competition ──────────────────────────────────────────────────
  {
    id: "sc1",
    kind: "likert",
    dimension: "securityCompetition",
    prompt: "Uncertainty about what major powers will do in the future is a lasting feature of world politics.",
    clarification: {
      whatItAsks: "Whether future intentions are hard to know in a durable way, even when present relations seem calm.",
      whatItDoesNotAsk: "This is not asking whether war is inevitable or whether cooperation never happens.",
      terms: [
        { term: "major powers", definition: "States with unusually large military, economic, or political influence." },
      ],
    },
  },
  {
    id: "sc2",
    kind: "likert",
    dimension: "securityCompetition",
    prompt: "States often fall into rivalry because they cannot safely rely on others for protection.",
    clarification: {
      whatItAsks: "Whether the lack of guaranteed protection pushes states toward self-protective behavior and rivalry.",
      whatItDoesNotAsk: "This is not saying alliances are useless or that trust never matters.",
      terms: [
        { term: "rivalry", definition: "A recurring relationship of competition, suspicion, or strategic contest." },
      ],
    },
  },
  {
    id: "sc3",
    kind: "likert",
    dimension: "securityCompetition",
    prompt: "Long periods of peace between major powers usually depend on favorable conditions that can change.",
    clarification: {
      whatItAsks: "Whether major-power peace is often contingent rather than permanently solved.",
      whatItDoesNotAsk: "This is not denying that institutions, trade, or diplomacy can help preserve peace.",
    },
  },

  // ── Institutions ──────────────────────────────────────────────────────────
  {
    id: "in1",
    kind: "likert",
    dimension: "institutions",
    prompt: "International rules and organizations can make cooperation last longer, even when no single state can enforce them.",
    clarification: {
      whatItAsks: "Whether institutions can shape behavior by setting expectations, monitoring conduct, or lowering uncertainty.",
      whatItDoesNotAsk: "This is not claiming institutions always work or that power stops mattering.",
    },
  },
  {
    id: "in2",
    kind: "likert",
    dimension: "institutions",
    prompt: "Monitoring and repeated interaction can reduce cheating in international agreements.",
    clarification: {
      whatItAsks: "Whether transparency and repeated contact can help sustain cooperation.",
      whatItDoesNotAsk: "This is not asking whether every agreement is equally credible.",
      terms: [
        { term: "monitoring", definition: "Procedures for checking whether parties are keeping their commitments." },
      ],
    },
  },
  {
    id: "in3",
    kind: "likert",
    dimension: "institutions",
    reverse: true,
    prompt: "Most international institutions do little more than reflect what powerful states already want.",
    clarification: {
      whatItAsks: "Whether institutions have little independent effect beyond the interests of the strongest actors.",
      whatItDoesNotAsk: "This is not asking whether powerful states influence institutions at all — the question is whether institutions matter independently.",
    },
  },

  // ── Domestic filters ──────────────────────────────────────────────────────
  {
    id: "df1",
    kind: "likert",
    dimension: "domesticFilters",
    prompt: "Domestic coalitions and interest groups often shape foreign policy as much as external threats do.",
    clarification: {
      whatItAsks: "Whether internal political forces help explain foreign policy choices.",
      whatItDoesNotAsk: "This is not denying that outside pressures matter.",
      terms: [
        { term: "domestic coalitions", definition: "Alliances of groups inside a country that push policy in a particular direction." },
      ],
    },
  },
  {
    id: "df2",
    kind: "likert",
    dimension: "domesticFilters",
    prompt: "States facing similar outside pressures can still act differently because their internal politics differ.",
    clarification: {
      whatItAsks: "Whether internal institutions, leadership, or social forces can filter the same external environment differently.",
      whatItDoesNotAsk: "This is not saying domestic politics always outweighs external pressure.",
    },
  },
  {
    id: "df3",
    kind: "likert",
    dimension: "domesticFilters",
    reverse: true,
    prompt: "Once the balance of power is clear, regime type and public opinion usually matter little.",
    clarification: {
      whatItAsks: "Whether external power conditions explain most behavior even after internal differences are considered.",
      whatItDoesNotAsk: "This is not asking whether public opinion is always decisive.",
      terms: [
        { term: "balance of power", definition: "The relative distribution of capabilities among major states." },
      ],
    },
  },

  // ── Norms and identity ────────────────────────────────────────────────────
  {
    id: "ni1",
    kind: "likert",
    dimension: "normsIdentity",
    prompt: "The same military move can look threatening or reassuring depending on the relationship between the states involved.",
    clarification: {
      whatItAsks: "Whether the meaning of an action depends partly on trust, status, identity, or shared expectations.",
      whatItDoesNotAsk: "This is not saying military capabilities do not matter.",
    },
  },
  {
    id: "ni2",
    kind: "likert",
    dimension: "normsIdentity",
    prompt: "State interests are shaped partly by identity, status, and recognition, not just material advantage.",
    clarification: {
      whatItAsks: "Whether interests are socially formed rather than fixed in advance.",
      whatItDoesNotAsk: "This is not denying that material interests exist.",
      terms: [
        { term: "recognition", definition: "Being treated by others as a legitimate or respected actor." },
      ],
    },
  },
  {
    id: "ni3",
    kind: "likert",
    dimension: "normsIdentity",
    reverse: true,
    prompt: "Talk about legitimacy usually matters less than material interests.",
    clarification: {
      whatItAsks: "Whether appeals to legitimacy are usually secondary to material incentives.",
      whatItDoesNotAsk: "This is not asking whether leaders use moral language sincerely or cynically in every case.",
    },
  },

  // ── Political economy ─────────────────────────────────────────────────────
  {
    id: "pe1",
    kind: "likert",
    dimension: "politicalEconomy",
    prompt: "World politics cannot be understood without looking at production, finance, and economic dependence.",
    clarification: {
      whatItAsks: "Whether economic structures are necessary for explaining international outcomes.",
      whatItDoesNotAsk: "This is not saying military or diplomatic factors are irrelevant.",
      terms: [
        { term: "economic dependence", definition: "A situation in which one actor's options are heavily shaped by access to another's capital, markets, or supply chains." },
      ],
    },
  },
  {
    id: "pe2",
    kind: "likert",
    dimension: "politicalEconomy",
    prompt: "Control over supply chains, capital, or market access can matter as much as military power.",
    clarification: {
      whatItAsks: "Whether economic leverage can be as strategically important as armed force.",
      whatItDoesNotAsk: "This is not limited to trade policy in a narrow sense.",
    },
  },
  {
    id: "pe3",
    kind: "likert",
    dimension: "politicalEconomy",
    reverse: true,
    prompt: "Security crises can usually be explained without paying much attention to economic hierarchy.",
    clarification: {
      whatItAsks: "Whether economic hierarchy is usually secondary when explaining crises.",
      whatItDoesNotAsk: "This is not asking whether every conflict is 'really about economics.'",
      terms: [
        { term: "economic hierarchy", definition: "Unequal control over wealth, production, finance, or market access across the international system." },
      ],
    },
  },

  // ── Restraint vs maximization ─────────────────────────────────────────────
  {
    id: "rs1",
    kind: "likert",
    dimension: "restraint",
    prompt: "Major powers often make themselves less secure when they chase advantages beyond what defense requires.",
    clarification: {
      whatItAsks: "Whether overextension and pursuit of excess advantage can create backlash and reduce security.",
      whatItDoesNotAsk: "This is not asking whether all power accumulation is bad.",
    },
  },
  {
    id: "rs2",
    kind: "likert",
    dimension: "restraint",
    prompt: "A safer grand strategy usually means limiting commitments rather than trying to dominate every key region.",
    clarification: {
      whatItAsks: "Whether strategic restraint is often safer than broad primacy.",
      whatItDoesNotAsk: "This is not asking whether states should become isolationist.",
      terms: [
        { term: "grand strategy", definition: "A state's broad long-term approach to security, commitments, and power." },
      ],
    },
  },
  {
    id: "rs3",
    kind: "likert",
    dimension: "restraint",
    reverse: true,
    prompt: "When an opportunity for lasting superiority appears, a major power should usually take it.",
    clarification: {
      whatItAsks: "Whether durable strategic advantage should normally be seized when available.",
      whatItDoesNotAsk: "This is not asking about short-term tactical gains or one-off battlefield decisions.",
    },
  },

  // ── Order vs justice ──────────────────────────────────────────────────────
  {
    id: "oj1",
    kind: "likert",
    dimension: "orderJustice",
    prompt: "International order is usually worth protecting even when it leaves serious injustices unresolved.",
    clarification: {
      whatItAsks: "Whether stability and order should usually take priority when they conflict with broader moral goals.",
      whatItDoesNotAsk: "This is not saying injustice is unimportant.",
    },
  },
  {
    id: "oj2",
    kind: "likert",
    dimension: "orderJustice",
    prompt: "There should be a strong presumption against intervening in another state's domestic affairs.",
    clarification: {
      whatItAsks: "Whether non-intervention should be the default rule.",
      whatItDoesNotAsk: "This is not asking whether intervention is never justified.",
    },
  },
  {
    id: "oj3",
    kind: "likert",
    dimension: "orderJustice",
    reverse: true,
    prompt: "When severe mass atrocities are underway, sovereignty should sometimes give way to outside action.",
    clarification: {
      whatItAsks: "Whether extreme moral emergencies can justify overriding non-intervention.",
      whatItDoesNotAsk: "This is not a blanket endorsement of regime change or constant intervention.",
      terms: [
        { term: "sovereignty", definition: "A state's recognized authority over its own territory and internal affairs." },
      ],
    },
  },
]

// ── Scenario questions (unchanged from v1) ────────────────────────────────────

export const scenarioQuestions: Record<string, ScenarioQuestion> = {
  strategicTechnology: {
    id: "strategicTechnology",
    kind: "scenario",
    prompt:
      "A rival great power is closing the gap in advanced chips through open supply chains. What is the best response?",
    options: [
      {
        id: "A",
        label: "Keep markets open. Aggregate gains and innovation matter most.",
        weights: { institutions: 0.6, restraint: 0.4, securityCompetition: -0.5 },
      },
      {
        id: "B",
        label: "Restrict narrowly and multilaterally in clearly strategic technologies.",
        weights: { securityCompetition: 0.4, institutions: 0.3, restraint: 0.3 },
        followUpId: "allyTrade",
      },
      {
        id: "C",
        label: "Restrict aggressively and seek durable technological primacy.",
        weights: { securityCompetition: 0.8, restraint: -0.7, institutions: -0.3 },
        followUpId: "allyTrade",
      },
    ],
  },
  allyTrade: {
    id: "allyTrade",
    kind: "scenario",
    prompt:
      "An ally benefits more from a trade agreement, but both sides still gain substantially. What matters most?",
    options: [
      {
        id: "A",
        label: "Accept it — absolute gains and alliance solidarity outweigh relative gain concerns; declining a mutually beneficial deal is strategically self-defeating.",
        weights: { institutions: 0.5, restraint: 0.2, securityCompetition: -0.4 },
      },
      {
        id: "B",
        label: "Decline it — in a competitive environment, consistently allowing an ally to gain relative advantage accumulates into a structural problem, even when absolute gains are positive.",
        weights: { securityCompetition: 0.7, restraint: -0.4, institutions: -0.4 },
      },
      {
        id: "C",
        label: "Use it as leverage — ratify, but make it conditional on renegotiating arrangements in strategically sensitive sectors first.",
        weights: { securityCompetition: 0.3, institutions: 0.1, politicalEconomy: 0.3 },
      },
    ],
  },
  institutionalCapture: {
    id: "institutionalCapture",
    kind: "scenario",
    prompt:
      "A global institution is technically effective, but one great power heavily shapes its agenda through funding and veto leverage. What should others do?",
    options: [
      {
        id: "A",
        label: "Reform its governance — the capture problem is real but fixable; abandoning the institution trades a correctable flaw for the larger cost of building something new.",
        weights: { institutions: 0.7, domesticFilters: 0.2 },
        followUpId: "sanctionsBody",
      },
      {
        id: "B",
        label: "Reject its authority on key issues — working within a dominant-power-shaped institution confers legitimacy it has not earned; the institution's independence is the fiction, not the capture.",
        weights: { institutions: -0.6, securityCompetition: 0.3 },
      },
      {
        id: "C",
        label: "Build coalitions outside it — selective bypass preserves the institution for areas where it still functions while avoiding captured processes on others.",
        weights: { institutions: -0.2, securityCompetition: 0.2, restraint: -0.1 },
      },
    ],
  },
  sanctionsBody: {
    id: "sanctionsBody",
    kind: "scenario",
    prompt:
      "A sanctions-monitoring body is credible on paper but is distrusted by the target state. Which problem matters more?",
    options: [
      {
        id: "A",
        label: "Distrust of the institution itself is the real obstacle.",
        weights: { institutions: -0.2, normsIdentity: 0.2 },
      },
      {
        id: "B",
        label: "The target may still distrust the process, but credible enforcement can help.",
        weights: { institutions: 0.4, restraint: 0.1 },
      },
      {
        id: "C",
        label: "Only underlying power shifts matter; the monitor adds little.",
        weights: { institutions: -0.5, securityCompetition: 0.3 },
      },
    ],
  },
  humanitarianIntervention: {
    id: "humanitarianIntervention",
    kind: "scenario",
    prompt:
      "Mass killing is underway, but a UN Security Council veto blocks authorization. A regional body supports action. What is the best response?",
    options: [
      {
        id: "A",
        label: "Legality first — coercive action without UNSC authorization damages the normative order more than any single atrocity outcome it might prevent.",
        weights: { orderJustice: 0.8, restraint: 0.2 },
      },
      {
        id: "B",
        label: "Moral primacy — when mass killing is underway, sovereignty cannot be the binding constraint; the scale of harm sets the threshold, not the politics of the Security Council.",
        weights: { orderJustice: -0.8, restraint: -0.1 },
        followUpId: "atrocityThreshold",
      },
      {
        id: "C",
        label: "Regional legitimacy, narrow mandate — limited action can be justified without UNSC authorization if the threshold is extreme, the mandate strictly limited, and a credible regional body endorses it.",
        weights: { orderJustice: 0.2, restraint: 0.3 },
        followUpId: "atrocityThreshold",
      },
    ],
  },
  atrocityThreshold: {
    id: "atrocityThreshold",
    kind: "scenario",
    prompt: "Which threshold most justifies breaching sovereignty?",
    options: [
      {
        id: "A",
        label: "Only genocide or comparably systematic mass killing.",
        weights: { orderJustice: 0.5 },
      },
      {
        id: "B",
        label: "Large-scale atrocities, even if they fall short of genocide.",
        weights: { orderJustice: 0 },
      },
      {
        id: "C",
        label: "Serious repression or recurring war crimes should often be enough.",
        weights: { orderJustice: -0.5 },
      },
    ],
  },
  financialCrisis: {
    id: "financialCrisis",
    kind: "scenario",
    prompt:
      "A middle-income state faces collapse after capital flight and external financing pressure. What is the best diagnosis?",
    options: [
      {
        id: "A",
        label: "The main problem is domestic mismanagement; orthodox adjustment is the answer.",
        weights: { politicalEconomy: -0.6, domesticFilters: 0.2 },
      },
      {
        id: "B",
        label: "The problem is both domestic and structural; use temporary controls and renegotiate.",
        weights: { politicalEconomy: 0.5, domesticFilters: 0.4, restraint: 0.1 },
        followUpId: "capitalControls",
      },
      {
        id: "C",
        label: "The problem is chiefly external domination; reject the existing financial architecture.",
        weights: { politicalEconomy: 0.9, institutions: -0.2, restraint: -0.1 },
        followUpId: "capitalControls",
      },
    ],
  },
  capitalControls: {
    id: "capitalControls",
    kind: "scenario",
    prompt: "Which policy bundle is most prudent in that crisis?",
    options: [
      {
        id: "A",
        label: "Rapid liberalization and confidence signaling.",
        weights: { politicalEconomy: -0.3, institutions: 0.1 },
      },
      {
        id: "B",
        label: "Temporary controls, targeted relief, and renegotiation.",
        weights: { politicalEconomy: 0.4, domesticFilters: 0.2, restraint: 0.1 },
      },
      {
        id: "C",
        label: "Long-run exit from dependent financial structures.",
        weights: { politicalEconomy: 0.7, institutions: -0.2 },
      },
    ],
  },
  formerRivalTransforms: {
    id: "formerRivalTransforms",
    kind: "scenario",
    prompt:
      "A long-time rival democratizes, joins institutions, and changes its elite discourse. How much should the threat assessment change?",
    options: [
      {
        id: "A",
        label: "Update significantly — the combination of democratic accountability, institutional integration, and elite socialization changes what this state will do; that transformation is threat-relevant information.",
        weights: { normsIdentity: 0.8, securityCompetition: -0.4 },
      },
      {
        id: "B",
        label: "Update minimally — capabilities and structural incentives are what drive behavior; regime change and discourse shifts are often strategic signals, not durable transformations.",
        weights: { normsIdentity: -0.7, securityCompetition: 0.5 },
      },
      {
        id: "C",
        label: "Update conditionally — democratization and institutional membership reduce some risks but preserve others; the threat assessment should track the specific issue areas, not assume either continuity or transformation.",
        weights: { normsIdentity: 0.1, securityCompetition: 0.1, restraint: 0.1 },
      },
    ],
  },
}

export const rootScenarioOrder = [
  "strategicTechnology",
  "institutionalCapture",
  "humanitarianIntervention",
  "financialCrisis",
  "formerRivalTransforms",
] as const

export const likertScale = [1, 2, 3, 4, 5, 6, 7] as const
