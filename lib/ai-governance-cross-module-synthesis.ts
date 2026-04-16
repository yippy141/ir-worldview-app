import type { AiArchetypeKey } from "./ai-governance-types"
import type { FamilyKey } from "./types"

export type CrossModuleSynthesis = {
  title: string
  shortReadout: string
  likelyAlignment: string[]
  likelyTensions: string[]
  practicalImplication: string
}

const DEFAULT_SYNTHESIS: CrossModuleSynthesis = {
  title: "Cross-module synthesis",
  shortReadout:
    "Your IR foundation and AI profile do not collapse into one ideology. Read them as two lenses on the same strategic world.",
  likelyAlignment: [
    "Both modules point to how power, institutions, and legitimacy shape technology governance.",
  ],
  likelyTensions: [
    "One module may be more geopolitical while the other is more normative or procedural.",
  ],
  practicalImplication:
    "Use the synthesis as an interpretive map, not a master score. The useful signal is where the two modules reinforce each other and where they cross-pressure each other.",
}

const CURATED_MAP: Partial<Record<`${FamilyKey}:${AiArchetypeKey}`, CrossModuleSynthesis>> = {
  "realist:strategicCompetitor": {
    title: "Strategic realist profile",
    shortReadout:
      "You see AI as another arena in which power, rivalry, deterrence, and state capability remain stubbornly central.",
    likelyAlignment: [
      "competition is treated as durable rather than temporary noise",
      "governance is judged by whether it survives strategic pressure",
      "security institutions remain central actors rather than peripheral ones",
    ],
    likelyTensions: [
      "rights and legitimacy can get subordinated to competitive urgency",
      "multilateralism may be treated too instrumentally to build lasting trust",
    ],
    practicalImplication:
      "You are likely to support AI governance that looks hard-nosed, capacity-aware, and verification-conscious rather than rhetorically universalist.",
  },
  "realist:stateCapacityBuilder": {
    title: "Capacity-first realist profile",
    shortReadout:
      "You see power politics as real, but you think the decisive question is whether states can actually govern advanced AI rather than merely talk about it.",
    likelyAlignment: [
      "institutional competence matters as much as formal policy ambition",
      "dependency on frontier firms or foreign stacks is treated as a strategic risk",
    ],
    likelyTensions: [
      "state-building can slide into bureaucratic overconfidence",
      "capacity arguments can obscure deeper legitimacy problems",
    ],
    practicalImplication:
      "You are likely to back procurement reform, regulatory staffing, technical audit capacity, and selective industrial policy over abstract principle alone.",
  },
  "institutionalist:coordinationArchitect": {
    title: "Institutional coordinator profile",
    shortReadout:
      "You think AI becomes governable when institutions, verification, and shared rules are strong enough to outlast short-term advantage.",
    likelyAlignment: [
      "durable cooperation is treated as possible and worth designing for",
      "shared standards and multilateral legitimacy matter",
      "institutions are not just window dressing but real governance infrastructure",
    ],
    likelyTensions: [
      "institutions can be weaker in crisis than in theory",
      "coordination may fail where enforcement is thin or trust is low",
    ],
    practicalImplication:
      "You are likely to favor regimes, standards bodies, transparency frameworks, and shared evaluation systems that bind rivals where possible.",
  },
  "institutionalist:democraticGuardrailist": {
    title: "Legitimacy-first institutional profile",
    shortReadout:
      "You think AI governance has to be both effective and publicly legitimate; technical governance without visible accountability is not enough.",
    likelyAlignment: [
      "public legitimacy and institutional design are mutually reinforcing",
      "rules should be contestable, not purely expert-defined",
    ],
    likelyTensions: [
      "process-heavy legitimacy can slow urgent action",
      "democratic structures can struggle with high-speed frontier dynamics",
    ],
    practicalImplication:
      "You are likely to support oversight bodies, rights-protective rules, and more transparent public governance of frontier development.",
  },
  "constructivist:democraticGuardrailist": {
    title: "Norms-and-legitimacy profile",
    shortReadout:
      "You think AI politics is shaped not only by material capability but by the norms, narratives, and identities through which societies decide what AI is for.",
    likelyAlignment: [
      "governance is partly a contest over meaning and legitimacy",
      "language, rights, and social framing shape policy outcomes",
    ],
    likelyTensions: [
      "norm entrepreneurship can underweight brute capability realities",
      "strong normative commitments may face pressure under geopolitical shock",
    ],
    practicalImplication:
      "You are likely to notice how discourse, social trust, and institutional identity shape what kinds of AI governance become politically possible.",
  },
  "criticalPoliticalEconomy:stateCapacityBuilder": {
    title: "Political-economy capacity profile",
    shortReadout:
      "You are alert both to concentration and to the danger that weak public institutions simply become dependent customers of dominant AI firms.",
    likelyAlignment: [
      "market concentration and public weakness are mutually reinforcing",
      "capacity is not neutral; it has to serve democratic and distributive ends",
    ],
    likelyTensions: [
      "state-building can end up subsidizing incumbents rather than constraining them",
      "anti-concentration instincts can pull against national champions logic",
    ],
    practicalImplication:
      "You are likely to focus on procurement, competition, labor, infrastructure, and public-interest capacity as one connected governance problem.",
  },
  "criticalPoliticalEconomy:openEcosystemBuilder": {
    title: "Anti-concentration open profile",
    shortReadout:
      "You see concentrated control over compute, models, and deployment channels as a governance risk in its own right.",
    likelyAlignment: [
      "diffusion and plural access can check concentrated power",
      "governance questions are inseparable from ownership and control",
    ],
    likelyTensions: [
      "openness can intensify misuse and capability diffusion risks",
      "decentralization can underestimate the security case for some controls",
    ],
    practicalImplication:
      "You are likely to care about open access, anti-monopoly logic, and public-interest alternatives to highly centralized AI development.",
  },
}

const FAMILY_SHORT_READS: Record<FamilyKey, string> = {
  realist:
    "Your IR baseline keeps returning to power, rivalry, and whether rules survive strategic pressure.",
  institutionalist:
    "Your IR baseline keeps returning to rules, credible coordination, and whether institutions can change incentives.",
  constructivist:
    "Your IR baseline keeps returning to legitimacy, recognition, and how political meaning shapes behavior.",
  criticalPoliticalEconomy:
    "Your IR baseline keeps returning to dependence, concentration, and who writes the rules of the market.",
}

const AI_SHORT_READS: Record<AiArchetypeKey, string> = {
  precautionarySteward:
    "The AI result adds a pull toward thresholds, evaluation gates, and a higher burden of proof before scale.",
  strategicCompetitor:
    "The AI result adds a pull toward rivalry-aware governance, security pressure, and state capability.",
  coordinationArchitect:
    "The AI result adds a pull toward shared standards, verification, and institutions that can bind more than one state.",
  democraticGuardrailist:
    "The AI result adds a pull toward public accountability, rights, and visible legitimacy.",
  stateCapacityBuilder:
    "The AI result adds a pull toward procurement, audit capacity, and whether public institutions can actually govern the field.",
  openEcosystemBuilder:
    "The AI result adds a pull toward openness, anti-concentration, and skepticism toward closed bottlenecks.",
}

const FAMILY_ALIGNMENT_SIGNALS: Record<FamilyKey, string> = {
  realist:
    "The two modules both ask who can enforce rules when pressure rises, not just who can state good principles.",
  institutionalist:
    "The two modules both care about whether rules, standards, and monitoring can actually change behavior.",
  constructivist:
    "The two modules both treat legitimacy, framing, and political recognition as part of the cause, not just the packaging.",
  criticalPoliticalEconomy:
    "The two modules both keep attention on dependence, market structure, and who controls the bottlenecks.",
}

const AI_ALIGNMENT_SIGNALS: Record<AiArchetypeKey, string> = {
  precautionarySteward:
    "In AI, that points toward thresholds, delay under uncertainty, and a tougher burden of proof before deployment widens.",
  strategicCompetitor:
    "In AI, that points toward rivalry-aware governance and a harder view of security institutions.",
  coordinationArchitect:
    "In AI, that points toward verification, shared standards, and cross-border rule-making that can last.",
  democraticGuardrailist:
    "In AI, that points toward democratic oversight, rights protection, and more visible public accountability.",
  stateCapacityBuilder:
    "In AI, that points toward staffing, procurement, audit capacity, and the mundane machinery of implementation.",
  openEcosystemBuilder:
    "In AI, that points toward anti-concentration, plural access, and suspicion of closed control by a few firms or states.",
}

const FAMILY_TENSION_SIGNALS: Record<FamilyKey, string> = {
  realist:
    "A rivalry-first IR baseline will keep pressing on whether legitimacy-heavy or openness-heavy AI governance can hold once strategic pressure sharpens.",
  institutionalist:
    "An institution-first IR baseline will keep pressing on whether AI governance can stay durable when enforcement is thin or major powers defect.",
  constructivist:
    "A legitimacy-first IR baseline will keep pressing on whether hard capability and enforcement constraints are getting enough weight.",
  criticalPoliticalEconomy:
    "A political-economy IR baseline will keep pressing on whether safety or capacity arguments are quietly hardening hierarchy or incumbent power.",
}

const AI_TENSION_SIGNALS: Record<AiArchetypeKey, string> = {
  precautionarySteward:
    "High caution in AI can clash with any IR baseline that expects hard competition or wants wider diffusion to remain possible.",
  strategicCompetitor:
    "Competitive urgency in AI can crowd out legitimacy, restraint, or coalition-building that the IR baseline may still care about.",
  coordinationArchitect:
    "Coordination-first AI governance can outrun what a harder IR baseline expects real rivals to accept.",
  democraticGuardrailist:
    "Legitimacy-first AI governance can slow action just where crisis politics rewards speed, secrecy, or narrow coalitions.",
  stateCapacityBuilder:
    "Capacity talk in AI can overstate what states can implement and understate who benefits once capacity is built.",
  openEcosystemBuilder:
    "Openness in AI can collide with security, threshold, and enforcement instincts that look more compelling under real geopolitical stress.",
}

const PRACTICAL_FAMILY_FOCUSES: Record<FamilyKey, string> = {
  realist: "credible enforcement and strategic durability",
  institutionalist: "rules, monitoring, and durable coordination",
  constructivist: "legitimacy, framing, and political consent",
  criticalPoliticalEconomy: "concentration, dependence, and who absorbs the costs",
}

const PRACTICAL_AI_FOCUSES: Record<AiArchetypeKey, string> = {
  precautionarySteward: "thresholds, evals, and deployment restraint",
  strategicCompetitor: "state capability and rivalry-aware controls",
  coordinationArchitect: "shared standards and verification",
  democraticGuardrailist: "public accountability and rights-protective governance",
  stateCapacityBuilder: "procurement, audit, and implementation capacity",
  openEcosystemBuilder: "anti-concentration and broader access",
}

function buildGenericSynthesis(
  foundationKey: FamilyKey,
  aiArchetypeKey: AiArchetypeKey,
): CrossModuleSynthesis {
  return {
    title: "Cross-module synthesis",
    shortReadout: `${FAMILY_SHORT_READS[foundationKey]} ${AI_SHORT_READS[aiArchetypeKey]}`,
    likelyAlignment: [
      FAMILY_ALIGNMENT_SIGNALS[foundationKey],
      AI_ALIGNMENT_SIGNALS[aiArchetypeKey],
    ],
    likelyTensions: [
      FAMILY_TENSION_SIGNALS[foundationKey],
      AI_TENSION_SIGNALS[aiArchetypeKey],
    ],
    practicalImplication:
      `In practice, you are likely to judge AI policy through both ${PRACTICAL_FAMILY_FOCUSES[foundationKey]} and ${PRACTICAL_AI_FOCUSES[aiArchetypeKey]}. The hard part is saying which one should win when those priorities point in different directions.`,
  }
}

export function getCrossModuleSynthesis(
  foundationKey?: FamilyKey | null,
  aiArchetypeKey?: AiArchetypeKey | null,
): CrossModuleSynthesis {
  if (!foundationKey || !aiArchetypeKey) {
    return DEFAULT_SYNTHESIS
  }

  return (
    CURATED_MAP[`${foundationKey}:${aiArchetypeKey}`] ??
    buildGenericSynthesis(foundationKey, aiArchetypeKey)
  )
}
