import type { LikertQuestion, ScenarioQuestion } from "@/lib/types"

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
    prompt: "What a state wants depends partly on identity, status, and recognition — not just material advantage.",
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
    prompt: "To explain world politics, you usually need to look at trade, finance, and economic dependence as well as military power.",
    clarification: {
      whatItAsks: "Whether economic leverage and exposure belong in the basic explanation, not just in a few special cases.",
      whatItDoesNotAsk: "This is not saying military or diplomatic factors stop mattering.",
      terms: [
        { term: "economic dependence", definition: "A situation in which one actor's options are heavily shaped by access to another's capital, markets, or supply chains." },
      ],
    },
  },
  {
    id: "pe2",
    kind: "likert",
    dimension: "politicalEconomy",
    prompt: "Global markets and financial rules often lock weaker states into patterns that mainly serve stronger ones.",
    clarification: {
      whatItAsks: "Whether hierarchy is built into major economic arrangements, not just used tactically from case to case.",
      whatItDoesNotAsk: "This is not asking whether weaker states have no room to maneuver at all.",
      terms: [
        { term: "financial rules", definition: "The lending, payment, and market rules that shape who can borrow, invest, or trade on workable terms." },
      ],
    },
  },
  {
    id: "pe3",
    kind: "likert",
    dimension: "politicalEconomy",
    reverse: true,
    prompt: "Most international crises can be understood without looking much at who controls credit, production, or market access.",
    clarification: {
      whatItAsks: "Whether deeper patterns of leverage and dependence are usually secondary when a crisis unfolds.",
      whatItDoesNotAsk: "This is not asking whether every crisis is secretly just about economics.",
      terms: [
        { term: "market access", definition: "Reliable access to buyers, suppliers, credit, or investment on workable terms." },
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

// ── Scenario questions (Phase 3C) ─────────────────────────────────────────────
// Each option represents a distinct theoretical logic, not a temperature scale.
// All three options in each scenario should be defensible — none is the "obvious" answer.

export const scenarioQuestions: Record<string, ScenarioQuestion> = {
  strategicTechnology: {
    id: "strategicTechnology",
    kind: "scenario",
    prompt:
      "A rival great power is closing the gap in advanced semiconductors. Your firms are intertwined with theirs through global supply chains. What should drive the response?",
    options: [
      {
        id: "A",
        label:
          "Closing the capability gap is itself the threat. Restrict exports across key categories now — the cost to trade is secondary to preserving the structural advantage.",
        weights: { securityCompetition: 0.7, restraint: -0.5, institutions: -0.3 },
      },
      {
        id: "B",
        label:
          "The real contest is over who controls production standards and supply-chain dependencies. Invest in domestic capacity and reduce one-sided dependence — broad export controls miss the underlying competitive problem.",
        weights: { politicalEconomy: 0.7, securityCompetition: 0.2, institutions: -0.1 },
      },
      {
        id: "C",
        label:
          "Restrict only genuinely dual-use items through coordinated multilateral agreements. Broad unilateral controls fracture the open economic order that sustains allied cohesion and long-run competitiveness.",
        weights: { institutions: 0.6, securityCompetition: 0.1, restraint: 0.3 },
      },
    ],
  },
  allyBurdenSharing: {
    id: "allyBurdenSharing",
    kind: "scenario",
    prompt:
      "A major ally spends significantly below agreed targets, relying on extended deterrence from your state. How should the alliance respond?",
    options: [
      {
        id: "A",
        label:
          "Sustained free-riding undermines collective defense credibility. Unequal burden means unequal leverage — allies that depend on extended deterrence become clients rather than partners.",
        weights: { securityCompetition: 0.6, restraint: -0.3, institutions: -0.2 },
      },
      {
        id: "B",
        label:
          "Allies that invest in shared capabilities are investing in the alliance's collective capacity, not just their own defense. The concern is whether the alliance delivers on shared commitments — not relative contributions within it.",
        weights: { institutions: 0.6, securityCompetition: -0.2, restraint: 0.2 },
      },
      {
        id: "C",
        label:
          "The burden-sharing dispute often masks a deeper disagreement about who defines the alliance's purpose. Demanding higher outlays without addressing that underlying conflict typically fails.",
        weights: { normsIdentity: 0.5, domesticFilters: 0.3, institutions: 0.1 },
      },
    ],
  },
  institutionalCapture: {
    id: "institutionalCapture",
    kind: "scenario",
    prompt:
      "A global institution is technically effective, but one great power heavily shapes its agenda through funding and veto leverage. What should be done?",
    options: [
      {
        id: "A",
        label:
          "Reform its governance — voting weights, budget diversification, transparency rules. The capture is correctable, and abandoning the institution trades a fixable flaw for the larger cost of rebuilding cooperation from scratch.",
        weights: { institutions: 0.8, restraint: 0.2 },
        followUpId: "sanctionsBody",
      },
      {
        id: "B",
        label:
          "Reject its authority on contested issues. A captured institution does not generate legitimate obligations — it launders dominant-power preferences as neutral rules. Working within it confers legitimacy it has not earned.",
        weights: { institutions: -0.6, securityCompetition: 0.5, restraint: -0.2 },
      },
      {
        id: "C",
        label:
          "Build alternative coalitions outside it. The capture reflects deep inequalities that procedural fixes cannot reach. The priority is building weight and voice in alternative forums.",
        weights: { politicalEconomy: 0.5, institutions: -0.3, securityCompetition: 0.1 },
      },
    ],
  },
  sanctionsBody: {
    id: "sanctionsBody",
    kind: "scenario",
    prompt:
      "A sanctions-monitoring body has credible procedures, but the target state regards it as politically motivated. Which is more accurate?",
    options: [
      {
        id: "A",
        label:
          "The institution's procedural credibility is what matters. Distrust reflects the target's interest in avoiding scrutiny, not a genuine legitimacy deficit.",
        weights: { institutions: 0.4, restraint: 0.1 },
      },
      {
        id: "B",
        label:
          "Both matter. An institution cannot enforce effectively if the target has no reason to regard it as impartial — procedural credibility and perceived legitimacy are not separable.",
        weights: { institutions: 0.1, normsIdentity: 0.3 },
      },
      {
        id: "C",
        label:
          "The underlying power relationships determine whether monitoring changes behavior. Procedural credibility adds little when the target can absorb the cost of non-compliance.",
        weights: { institutions: -0.4, securityCompetition: 0.3 },
      },
    ],
  },
  humanitarianIntervention: {
    id: "humanitarianIntervention",
    kind: "scenario",
    prompt:
      "Mass killing is underway, but a UN Security Council veto blocks authorization. A credible regional body endorses limited action. What is the right response?",
    options: [
      {
        id: "A",
        label:
          "Legality first. Coercive action without Security Council authorization sets a precedent that will be used for far less defensible purposes — the damage to the international legal framework outweighs the case at hand.",
        weights: { orderJustice: 0.8, restraint: 0.2 },
      },
      {
        id: "B",
        label:
          "The moral case overrides the procedural objection. When mass killing is happening, sovereignty cannot be the main constraint. The scale of harm sets the bar — not who sits on the Security Council.",
        weights: { orderJustice: -0.8, restraint: -0.1 },
        followUpId: "atrocityThreshold",
      },
      {
        id: "C",
        label:
          "Regional endorsement plus a strictly limited mandate provides sufficient legitimacy for emergency action. This is not a general license for regime change — it distinguishes emergency protection from unilateral intervention.",
        weights: { orderJustice: 0.2, restraint: 0.3, institutions: 0.2 },
        followUpId: "atrocityThreshold",
      },
    ],
  },
  atrocityThreshold: {
    id: "atrocityThreshold",
    kind: "scenario",
    prompt: "Which threshold most clearly justifies breaching sovereignty against the will of the target state?",
    options: [
      {
        id: "A",
        label: "Only genocide or comparably systematic mass killing meets the bar.",
        weights: { orderJustice: 0.5 },
      },
      {
        id: "B",
        label: "Large-scale atrocities, even if they fall short of a legal genocide standard.",
        weights: { orderJustice: 0 },
      },
      {
        id: "C",
        label: "Serious and sustained repression or recurring war crimes should often be enough.",
        weights: { orderJustice: -0.5 },
      },
    ],
  },
  financialCrisis: {
    id: "financialCrisis",
    kind: "scenario",
    prompt:
      "A middle-income country faces economic collapse after a sudden reversal of capital flows and creditor pressure to adopt austerity. What is the right explanation?",
    options: [
      {
        id: "A",
        label:
          "The crisis reflects domestic fiscal problems and weak credibility that external pressure has exposed, not created. Fiscal consolidation restores market access.",
        weights: { politicalEconomy: -0.6, domesticFilters: 0.2 },
      },
      {
        id: "B",
        label:
          "The crisis has both domestic and structural dimensions. Temporary capital controls, selective restructuring, and renegotiated conditionality — not rejection of the international system — is the pragmatic path.",
        weights: { politicalEconomy: 0.4, domesticFilters: 0.3, institutions: 0.2 },
        followUpId: "capitalControls",
      },
      {
        id: "C",
        label:
          "Capital flight and creditor leverage are features of structural financial vulnerability, not accidents of policy. The crisis will recur unless the state reduces its dependence on external capital and builds regional financing alternatives.",
        weights: { politicalEconomy: 0.9, institutions: -0.3 },
        followUpId: "capitalControls",
      },
    ],
  },
  capitalControls: {
    id: "capitalControls",
    kind: "scenario",
    prompt: "Which policy stance is most defensible in that crisis?",
    options: [
      {
        id: "A",
        label:
          "Rapid liberalization and credible fiscal commitment — controls delay adjustment and send the wrong signal to markets.",
        weights: { politicalEconomy: -0.3, institutions: 0.1 },
      },
      {
        id: "B",
        label:
          "Temporary controls, targeted relief, and renegotiation of conditionality terms while remaining within the international financial architecture.",
        weights: { politicalEconomy: 0.4, domesticFilters: 0.2, restraint: 0.1 },
      },
      {
        id: "C",
        label:
          "Long-run restructuring away from dependent financial relationships — temporary controls are the floor, not the ceiling.",
        weights: { politicalEconomy: 0.7, institutions: -0.2 },
      },
    ],
  },
  formerRivalTransforms: {
    id: "formerRivalTransforms",
    kind: "scenario",
    prompt:
      "A long-time rival democratizes, joins multilateral institutions, and shifts its elite discourse toward cooperative norms. How much should the threat assessment change?",
    options: [
      {
        id: "A",
        label:
          "Update significantly. Democratic accountability, institutional ties, and a shift in elite thinking change what a state will do. Dismissing this as strategic signaling discards threat-relevant evidence.",
        weights: { normsIdentity: 0.8, securityCompetition: -0.4 },
      },
      {
        id: "B",
        label:
          "Update minimally. Capabilities and structural incentives drive behavior. Regime change and discourse shifts are often tactical rather than durable — the interests that produced rivalry have not been transformed.",
        weights: { normsIdentity: -0.7, securityCompetition: 0.5 },
      },
      {
        id: "C",
        label:
          "Focus on institutional integration more than identity change. Membership in shared institutions raises the cost of aggression and builds domestic constituencies for stable relations — regardless of whether values have genuinely converged.",
        weights: { institutions: 0.6, normsIdentity: 0.1, securityCompetition: -0.3 },
      },
    ],
  },
  economicCoercion: {
    id: "economicCoercion",
    kind: "scenario",
    prompt:
      "A rival state uses trade and investment restrictions as deliberate political pressure. How should you understand and respond?",
    options: [
      {
        id: "A",
        label:
          "Economic coercion is power politics and should be met with matching pressure. Leaving leverage unanswered signals vulnerability — the logic of deterrence applies to economic instruments as much as military ones.",
        weights: { securityCompetition: 0.6, politicalEconomy: 0.2, restraint: -0.3 },
      },
      {
        id: "B",
        label:
          "The lever exists because of structural dependence. Ad hoc retaliation does not remove it. The strategic response is long-run: diversify supply chains, build alternative financing, reduce the dependence that makes coercion possible.",
        weights: { politicalEconomy: 0.8, securityCompetition: 0.1, institutions: -0.1 },
      },
      {
        id: "C",
        label:
          "The right response is multilateral dispute mechanisms and binding trade rules. Ad hoc retaliation normalizes economic statecraft as a coercive tool. The goal is binding the coercer into rules — not matching leverage for leverage.",
        weights: { institutions: 0.7, politicalEconomy: -0.1, restraint: 0.2 },
      },
    ],
  },
  institutionalLegitimacy: {
    id: "institutionalLegitimacy",
    kind: "scenario",
    prompt:
      "A major international organization faces a legitimacy crisis, with rising-power members questioning whose norms and interests it represents. What is the right explanation?",
    options: [
      {
        id: "A",
        label:
          "The crisis is a governance problem. More inclusive voting weights, broader representation in leadership, and better transparency procedures can restore confidence. The institution's track record is the asset worth protecting.",
        weights: { institutions: 0.7, normsIdentity: 0.1, domesticFilters: 0.2 },
      },
      {
        id: "B",
        label:
          "The crisis reflects whose knowledge, norms, and interests the institution was built to serve. Procedural fixes rarely address that deeper exclusion. Legitimacy requires addressing whose voices were excluded when the institution was built.",
        weights: { normsIdentity: 0.8, institutions: 0.1, domesticFilters: 0.2 },
      },
      {
        id: "C",
        label:
          "States invoke legitimacy when existing institutions no longer serve their interests as well as before. The 'crisis' tracks the underlying power shift — not a principled deficit. Treating legitimacy arguments as neutral diagnoses misreads the political incentives.",
        weights: { securityCompetition: 0.5, institutions: -0.3, normsIdentity: -0.2 },
      },
    ],
  },
}

// Tie-breaker selection clusters used by scoring.ts selectTieBreakerIds.
// Each cluster maps a close family-score pair to the scenario IDs that best
// discriminate between those two traditions.
export type TieBreakerCluster = {
  pair: [string, string]
  scenarioIds: string[]
}

export const tieBreakerClusters: TieBreakerCluster[] = [
  { pair: ["realist", "institutionalist"], scenarioIds: ["strategicTechnology", "institutionalCapture"] },
  { pair: ["institutionalist", "constructivist"], scenarioIds: ["institutionalLegitimacy", "formerRivalTransforms"] },
  { pair: ["realist", "criticalPoliticalEconomy"], scenarioIds: ["financialCrisis", "economicCoercion"] },
  { pair: ["constructivist", "criticalPoliticalEconomy"], scenarioIds: ["economicCoercion", "institutionalLegitimacy"] },
  { pair: ["institutionalist", "criticalPoliticalEconomy"], scenarioIds: ["financialCrisis", "allyBurdenSharing"] },
]

export const FALLBACK_SCENARIO_IDS = [
  "strategicTechnology",
  "humanitarianIntervention",
  "formerRivalTransforms",
]

export const likertScale = [1, 2, 3, 4, 5, 6, 7] as const
