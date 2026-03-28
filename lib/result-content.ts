import type { FamilyKey, StrategyModifier, NormativeModifier } from "@/lib/types"

// ── Quick take ─────────────────────────────────────────────────────────────────

export type QuickTake = {
  noticesFirst: string
  tendsToDiscount: string
  inPractice: string
}

export const quickTakeData: Record<FamilyKey, QuickTake> = {
  realist: {
    noticesFirst: "Who has the power, and whether the gap is growing or closing.",
    tendsToDiscount: "Rules and norms that lack an enforcer willing to pay the cost of enforcement.",
    inPractice: "You will find capability-based arguments more convincing than process-based ones, and you will be skeptical when stability is attributed to shared values rather than deterrence.",
  },
  institutionalist: {
    noticesFirst: "Whether the rules are credible, and whether monitoring makes defection costly.",
    tendsToDiscount: "The claim that states will defect whenever it is convenient, regardless of institutional context.",
    inPractice: "You will focus on institutional design, enforcement mechanisms, and whether domestic politics allow governments to honor their commitments.",
  },
  constructivist: {
    noticesFirst: "Who is defining the threat, whose identity is at stake, and what history shapes the relationship.",
    tendsToDiscount: "Purely material explanations that treat interests as fixed and independent of social context.",
    inPractice: "You will pay attention to how situations are framed, which historical analogies are being invoked, and whether legitimacy is being contested or accepted.",
  },
  criticalPoliticalEconomy: {
    noticesFirst: "Who controls the financial architecture, and which states carry structural dependence.",
    tendsToDiscount: "Claims that international institutions distribute gains broadly, regardless of who designed them.",
    inPractice: "You will ask who benefits from the current rules and who bears the adjustment costs, before accepting any account of cooperation or conflict at face value.",
  },
}

// ── Why this worldview matters ────────────────────────────────────────────────

export type WhyItMatters = {
  notices: string[]
  discounts: string[]
  persuasive: string[]
}

export const whyItMattersData: Record<FamilyKey, WhyItMatters> = {
  realist: {
    notices: [
      "Power distributions. When the balance shifts, outcomes follow.",
      "Uncertainty about rivals' intentions. Reassurance rarely resolves it structurally.",
    ],
    discounts: [
      "The independent effect of international rules, absent credible enforcement.",
      "Claims that shared values reliably constrain states under competitive pressure.",
    ],
    persuasive: [
      "Arguments anchored in deterrence, capability, and positional advantage.",
      "Analysis that tracks what states do rather than what they say.",
    ],
  },
  institutionalist: {
    notices: [
      "Whether the rules are credible and whether the monitoring is real.",
      "The domestic constraints that shape what governments can credibly commit to.",
    ],
    discounts: [
      "Claims that institutions collapse whenever the underlying power distribution shifts.",
      "Arguments that treat all multilateral frameworks as mere window dressing.",
    ],
    persuasive: [
      "Evidence that monitoring, reciprocity, and repeated interaction reduce defection.",
      "Analysis showing institutions producing compliance even among reluctant members.",
    ],
  },
  constructivist: {
    notices: [
      "Who is framing the threat, and for whom.",
      "Whether the historical relationship between states has changed what their competition means.",
    ],
    discounts: [
      "Explanations that treat state interests as fixed and externally given.",
      "Arguments that material power alone determines who wins and who loses.",
    ],
    persuasive: [
      "Analysis showing that states with identical material positions behave differently because their identities differ.",
      "Arguments that what counts as a legitimate policy option is constrained by norms.",
    ],
  },
  criticalPoliticalEconomy: {
    notices: [
      "Who controls capital flows, financial architecture, and supply chain chokepoints.",
      "Which states carry dollar dependence, and which can impose costs without military force.",
    ],
    discounts: [
      "Claims that trade openness produces shared gains across participants regardless of position.",
      "Arguments that international institutions serve general interests rather than those of dominant states.",
    ],
    persuasive: [
      "Arguments that debt, dependence, and financial access are tools of coercion.",
      "Analysis tracing diplomatic outcomes to production structures and economic hierarchy.",
    ],
  },
}

// ── Issue-area stances ─────────────────────────────────────────────────────────

export type IssueStance = {
  issue: string
  text: string
}

type IssueBlock = {
  issue: string
  byFamily: Record<FamilyKey, string>
  clauses?: {
    restrainer?: Partial<Record<FamilyKey, string>>
    maximizer?: Partial<Record<FamilyKey, string>>
    pluralist?: Partial<Record<FamilyKey, string>>
    universalist?: Partial<Record<FamilyKey, string>>
  }
}

const ISSUE_BLOCKS: IssueBlock[] = [
  {
    issue: "Great-power rivalry",
    byFamily: {
      realist:
        "You read great-power rivalry as structural. The distribution of capabilities determines the stakes, and uncertainty about intent is a feature of the system, not a failure of diplomacy. Deterrence and credible commitments matter more than dialogue.",
      institutionalist:
        "You take great-power competition seriously but think multilateral frameworks can reduce misperception and manage specific flashpoints. Pure deterrence without institutional guardrails is fragile. Where interests overlap, rules can hold.",
      constructivist:
        "You read great-power rivalry as partly constructed. The same distribution of power produces different rivalries depending on historical relationships and identity. Whether competition escalates depends partly on how each side frames the other's intentions.",
      criticalPoliticalEconomy:
        "You read great-power rivalry through economic competition. The contest over supply chains, financial rails, and technology access is as important as military positioning. Who controls the infrastructure of production shapes who wins strategic competition over time.",
    },
    clauses: {
      restrainer: {
        realist:
          " Your restraint score suggests you also see overextension as a real risk — that pressing advantages invites counterbalancing.",
        institutionalist:
          " Your restraint score reinforces skepticism about forward commitments that create entrapment.",
      },
      maximizer: {
        realist:
          " Your maximizer score suggests you think windows of opportunity should be pressed before the balance shifts.",
        criticalPoliticalEconomy:
          " A maximizer instinct here suggests pressing for structural advantages rather than accepting interdependence.",
      },
    },
  },
  {
    issue: "Trade, technology, and sanctions",
    byFamily: {
      realist:
        "You read trade and technology policy primarily as security instruments. Dependency is a vulnerability. Decoupling is insurance. Sanctions work when asymmetric dependence gives the sender genuine leverage.",
      institutionalist:
        "You think rules-based trade architecture lowers friction and builds durable economic interdependence. Economic coercion is more legitimate and more effective when applied through coordinated multilateral mechanisms rather than unilateral pressure.",
      constructivist:
        "You pay attention to how technology competition is framed. Whether a chip export control is framed as a security measure, a sovereignty assertion, or a development denial shapes which coalitions form and what arguments legitimize restriction.",
      criticalPoliticalEconomy:
        "You read tech and trade policy as contests over where value is captured and who sets the rules. Sanctions reflect dollar dependence and financial architecture as much as military power. Export controls tend to entrench existing hierarchies of innovation.",
    },
    clauses: {
      restrainer: {
        realist:
          " Your restraint score suggests some skepticism about economic coercion as a first instrument.",
      },
      maximizer: {
        realist:
          " Your maximizer score suggests you favor pressing economic advantages while they exist.",
      },
    },
  },
  {
    issue: "Alliances and institutions",
    byFamily: {
      realist:
        "You think alliances hold when the interests align. Formal commitment matters less than capability and will. Alliance institutions are useful for coordination, not enforcement. Burden-sharing disputes are symptoms of underlying interest divergence.",
      institutionalist:
        "You think alliances are strengthened by institutional frameworks that make commitments credible and reduce misperception. Formal structures change what governments can reliably promise. Institutional membership has independent effects on compliance.",
      constructivist:
        "You read alliances partly as identity commitments, not just capability arrangements. Shared democratic identity, or shared revisionist identity, shapes what alliance partners will actually do under pressure. The formal treaty is only part of the story.",
      criticalPoliticalEconomy:
        "You read multilateral institutions as encoding the structural power of the states that designed them. Alliances reflect economic hierarchy as much as security preference. Who writes the terms of participation determines who benefits from membership.",
    },
    clauses: {
      restrainer: {
        realist:
          " Your restraint score suggests caution about open-ended commitments that create entrapment risks.",
      },
      maximizer: {
        realist:
          " Your maximizer score suggests you favor pressing alliance partners for more, not less, when the window exists.",
      },
    },
  },
  {
    issue: "Intervention and human rights",
    byFamily: {
      realist:
        "You are skeptical of humanitarian justifications for intervention. Stated rationales rarely match actual interests. Precedents matter more than the particular case. Legitimacy claims in intervention debates often mask strategic competition.",
      institutionalist:
        "You think intervention requires multilateral authorization and clear threshold criteria. Unilateral action undermines the institutional frameworks that make legitimate intervention possible. Sovereignty is not absolute, but the bar matters.",
      constructivist:
        "You pay attention to how intervention is framed and by whom. The same action carries different legitimacy depending on historical context, regional identity, and who claims authority. Framing determines which coalitions form and which arguments prevail.",
      criticalPoliticalEconomy:
        "You are skeptical of humanitarian framing in intervention debates. You ask who benefits economically from intervention, which states shoulder the costs, and whose reconstruction contracts follow military engagement.",
    },
    clauses: {
      pluralist: {
        realist:
          " Your pluralist score reinforces that skepticism. Sovereignty deserves strong protection from external override.",
        institutionalist:
          " Your pluralist score suggests you set a high bar for sovereignty override and are skeptical of precedents that normalize external intervention.",
        constructivist:
          " Your pluralist score means you are alert to how intervention rhetoric can be weaponized by powerful states.",
      },
      universalist: {
        realist:
          " Your universalist score adds tension here. You have some openness to moral override in extreme cases, even within a realist frame.",
        institutionalist:
          " Your universalist score suggests you are willing to act when consensus authorization is unavailable but the moral case is strong.",
        constructivist:
          " Your universalist score means you take universal obligations seriously as part of how intervention is legitimized.",
        criticalPoliticalEconomy:
          " Your universalist score adds nuance: you do not dismiss the moral argument, but you hold it to a higher standard of consistency.",
      },
    },
  },
  {
    issue: "Development, debt, and finance",
    byFamily: {
      realist:
        "You read development finance as a strategic instrument. Infrastructure investment, debt, and aid reflect geopolitical competition more than altruism. Dependence creates leverage, and leverage is a security variable.",
      institutionalist:
        "You think multilateral development institutions, when well-designed, can channel capital more efficiently than bilateral finance and with better conditionality. Reform of the Bretton Woods architecture is possible and worth pursuing within existing frameworks.",
      constructivist:
        "You think development discourse shapes what is possible as much as material conditions do. The norms around what counts as good governance, sound conditionality, or legitimate debt restructuring are constructed. They can be contested and changed.",
      criticalPoliticalEconomy:
        "You see the current development finance architecture as encoding core-periphery hierarchy. Conditionality extracts structural adjustment from borrowers. Debt creates dependence. The question is not how to optimize the system but who controls it and in whose interest.",
    },
    clauses: {
      restrainer: {
        criticalPoliticalEconomy:
          " Your restraint score adds some weight to the idea that external pressure can be counterproductive, and that indigenous development paths deserve more space.",
      },
    },
  },
]

export function buildIssueStances(
  fk: FamilyKey,
  sm: StrategyModifier,
  nm: NormativeModifier,
): IssueStance[] {
  return ISSUE_BLOCKS.map((block) => {
    let text = block.byFamily[fk]
    if (sm === "Restrainer") text += block.clauses?.restrainer?.[fk] ?? ""
    if (sm === "Maximizer") text += block.clauses?.maximizer?.[fk] ?? ""
    if (nm === "Pluralist") text += block.clauses?.pluralist?.[fk] ?? ""
    if (nm === "Universalist") text += block.clauses?.universalist?.[fk] ?? ""
    return { issue: block.issue, text }
  })
}

// ── Blind spots and counterarguments ──────────────────────────────────────────

export type BlindSpot = {
  explainsWell: string
  tendsMiss: string
  rivalArgument: string
  rivalFamily: FamilyKey
}

export const blindSpotsData: Record<FamilyKey, BlindSpot> = {
  realist: {
    explainsWell:
      "It explains why states arm even when they distrust arms races, and why cooperation is harder to sustain as power distributions shift.",
    tendsMiss:
      "It has difficulty explaining durable cooperation where material incentives for defection are present and defection still does not happen.",
    rivalArgument:
      "The institutionalist argument: monitoring and transparency can reduce defection even among rivals, because the shadow of the future changes the calculus in ways pure capability accounting misses.",
    rivalFamily: "institutionalist",
  },
  institutionalist: {
    explainsWell:
      "It explains why trade liberalization and institutional membership sustain cooperation across large numbers of states with divergent short-term interests.",
    tendsMiss:
      "It struggles to explain why states sometimes exit well-functioning institutions when power shifts, and why those institutions cannot prevent it.",
    rivalArgument:
      "The realist argument: institutions reflect the preferences of the powerful, and are abandoned when those preferences change. The architecture is not self-sustaining.",
    rivalFamily: "realist",
  },
  constructivist: {
    explainsWell:
      "It explains why two states facing identical material conditions can reach completely different foreign policy outcomes, because their identities and historical relationships differ.",
    tendsMiss:
      "It is harder to apply when material constraints are severe. It can underspecify which identities or norms prevail when survival is actually at stake.",
    rivalArgument:
      "The critical PE argument: the identities and norms constructivists treat as primary are themselves shaped by structural economic interests and production hierarchies.",
    rivalFamily: "criticalPoliticalEconomy",
  },
  criticalPoliticalEconomy: {
    explainsWell:
      "It explains why the same international institutions consistently advantage the same states, across decades and regardless of formal membership rules.",
    tendsMiss:
      "It can underspecify short-term political dynamics. In specific crises, leadership decisions and security competition matter more than structural economic position.",
    rivalArgument:
      "The institutionalist argument: even imperfect multilateral institutions have delivered real gains in some contexts, and reform from within is not foreclosed by structural analysis alone.",
    rivalFamily: "institutionalist",
  },
}

// ── Pressure-test questions ───────────────────────────────────────────────────

export const pressureTestQuestions: Record<FamilyKey, string[]> = {
  realist: [
    "A great power offers a binding mutual disarmament treaty with verification mechanisms your government considers reliable. Do you accept? If not, what exactly remains uncertain?",
    "Two rivals develop dense economic interdependence over a generation. Does that change your prediction of conflict between them? What is driving your answer?",
    "A war begins that most international lawyers consider unjustified. Major powers stay out because the costs are high. Is their restraint a form of stability, or a failure of commitment?",
  ],
  institutionalist: [
    "An institution you rely on is captured by a coalition using it to advance narrow interests. Do you work to reform it from within? What does your answer imply about your theory of institutional compliance?",
    "Two states cooperate through multilateral rules while competing aggressively outside them. Is that cooperation real? What makes it more than a coincidence of interests?",
    "A rising power refuses to join the institutional architecture that its main rival designed. How does your framework explain that refusal, and what would change it?",
  ],
  constructivist: [
    "Two states share a strong alliance identity but face a crisis where their material interests diverge sharply. Which wins? Does your answer hold if one government is under domestic pressure?",
    "A norm you consider legitimate is being invoked by a powerful state to justify action that also serves its strategic interests. Does that undermine the norm, or just this application of it?",
    "A government radically shifts its foreign policy after an election, without any change in the material environment. What drove that change in your account, and is that a strength or a limit of the explanation?",
  ],
  criticalPoliticalEconomy: [
    "A multilateral institution proposes a reform that would redistribute voting power toward lower-income states. Wealthy member states accept it. Does your framework predict that outcome? If not, what explains the exception?",
    "A country achieves rapid development within the current global economic architecture, without structural transformation. Is that evidence against your view, or a special case explained by its position in the hierarchy?",
    "Great-power competition is framed publicly in security terms, but most analysts believe it is primarily about technology supply chains. Does that distinction between framing and substance matter for how you analyze the conflict?",
  ],
}
