import { aiArchetypeDeepProfiles } from "./ai-governance-profile-copy"
import { getReadingBuckets, type ReadingEntry } from "./ai-governance-reading-lists"
import { aiAxisLabels } from "./ai-governance-schema"
import type { AiArchetypeKey, AiAxisKey } from "./ai-governance-types"

export type AiAtlasArchetypeId = AiArchetypeKey

export type AiAtlasArchetypeCard = {
  id: AiAtlasArchetypeId
  label: string
  shortSummary: string
  coreBelief: string
  wantsMost: string[]
  worriesMost: string[]
  closestNeighbors: AiAtlasArchetypeId[]
  likelyTensions: string[]
  internationalLens: string
}

export type AiAtlasAxisGuide = {
  key: AiAxisKey
  label: string
  explainer: string
  lowLabel: string
  highLabel: string
}

export type AiAtlasEntry = AiAtlasArchetypeCard & {
  key: AiArchetypeKey
  questionToSitWith: string
  startHere?: ReadingEntry
  critique?: ReadingEntry
  comparisonNote: string
  contrastAxes: AiAxisKey[]
}

export const AI_ATLAS_ARCHETYPES: AiAtlasArchetypeCard[] = [
  {
    id: "precautionarySteward",
    label: "Precautionary Steward",
    shortSummary:
      "Treat frontier AI as a system that may warrant slowdown, stronger thresholds, and demonstrable safety before broad deployment.",
    coreBelief:
      "The burden of proof should rise with capability, especially where loss of control, catastrophic misuse, or systemic dependence could follow.",
    wantsMost: [
      "credible thresholds and eval gates",
      "stronger deployment restraint under uncertainty",
      "institutional willingness to pause when warning signs accumulate",
    ],
    worriesMost: [
      "premature deployment becoming irreversible",
      "capabilities outrunning governance capacity",
      "elite incentives overwhelming safety warnings",
    ],
    closestNeighbors: ["democraticGuardrailist", "coordinationArchitect"],
    likelyTensions: [
      "how to prevent caution from becoming permanent centralization",
      "how to coordinate pauses across rival labs and states",
    ],
    internationalLens:
      "More open to international coordination and shared thresholds, but often skeptical that rivalry will naturally produce safe outcomes.",
  },
  {
    id: "strategicCompetitor",
    label: "Strategic Competitor",
    shortSummary:
      "Treat AI governance as something that has to function under durable geopolitical rivalry rather than idealized cooperation.",
    coreBelief:
      "Capability advantage matters, and safety measures are only serious if they survive competitive pressure.",
    wantsMost: [
      "state capacity aligned with national strategy",
      "bounded but real defense and security use",
      "controls on dangerous diffusion and adversarial acquisition",
    ],
    worriesMost: [
      "naive coordination that masks power asymmetries",
      "strategic dependency on rival ecosystems",
      "safety rules that fail the moment competition sharpens",
    ],
    closestNeighbors: ["stateCapacityBuilder", "coordinationArchitect"],
    likelyTensions: [
      "how to avoid normalizing dangerous military escalation",
      "how to preserve legitimacy when security logic dominates",
    ],
    internationalLens:
      "Usually competition-first, but can still support selective coordination where verification, incident prevention, or export controls matter.",
  },
  {
    id: "coordinationArchitect",
    label: "Coordination Architect",
    shortSummary:
      "Treat the hardest AI problems as transnational and institution-building problems rather than purely national or purely technical ones.",
    coreBelief:
      "Durable governance will require shared standards, legitimacy, and institutions that can outlast temporary advantage.",
    wantsMost: [
      "cross-border standards and verification",
      "shared incident and evaluation frameworks",
      "rules that can travel across firms and states",
    ],
    worriesMost: [
      "fragmented national rules producing race dynamics",
      "coordination failure on shared catastrophic risks",
      "legitimacy gaps between technical elites and publics",
    ],
    closestNeighbors: ["democraticGuardrailist", "strategicCompetitor"],
    likelyTensions: [
      "how to make coordination enforceable rather than aspirational",
      "how to reconcile sovereignty with durable multilateral rules",
    ],
    internationalLens:
      "Strongly oriented toward international regimes, common standards, and coordination across rival blocs, labs, and middle powers.",
  },
  {
    id: "democraticGuardrailist",
    label: "Democratic Guardrailist",
    shortSummary:
      "Treat AI governance as a legitimacy problem as much as a capability problem, with democratic oversight, rights, and accountability as the anchor.",
    coreBelief:
      "AI should not be governed only by labs, security agencies, or technical insiders; public legitimacy and rights protections have to remain visible.",
    wantsMost: [
      "public accountability and contestability",
      "stronger oversight for concentrated private power",
      "rights-conscious governance of deployment and monitoring",
    ],
    worriesMost: [
      "governance by insider cartel",
      "security and efficiency logics overwhelming rights",
      "high-capability systems entrenching unaccountable institutions",
    ],
    closestNeighbors: ["precautionarySteward", "stateCapacityBuilder"],
    likelyTensions: [
      "how to maintain democratic legitimacy under emergency pressure",
      "how to govern effectively without collapsing into proceduralism",
    ],
    internationalLens:
      "Looks for legitimacy across democratic institutions, public voice, and multilayer governance rather than only lab self-governance or pure raison d'etat.",
  },
  {
    id: "stateCapacityBuilder",
    label: "State Capacity Builder",
    shortSummary:
      "Treat the real governance bottleneck as implementation capacity: supervision, procurement, verification, compute access, and public-sector competence.",
    coreBelief:
      "The decisive divide is often between actors that can govern AI in practice and actors that become structurally dependent on those who can.",
    wantsMost: [
      "institutional competence and technical staffing",
      "audits, reporting, procurement, and enforcement capacity",
      "reduced dependence on a small number of frontier firms or foreign ecosystems",
    ],
    worriesMost: [
      "paper rules without implementation",
      "states becoming customers rather than governors",
      "middle powers and developing states being locked into dependency",
    ],
    closestNeighbors: ["strategicCompetitor", "democraticGuardrailist"],
    likelyTensions: [
      "how to build capacity without empowering brittle bureaucracy",
      "how to separate public-interest capacity from industrial favoritism",
    ],
    internationalLens:
      "Highly attentive to middle-power, developing-country, and sovereign-capacity questions, not just frontier-lab competition.",
  },
  {
    id: "openEcosystemBuilder",
    label: "Open Ecosystem Builder",
    shortSummary:
      "Treat broad access, open tools, and distributed innovation as essential safeguards against over-centralized AI power.",
    coreBelief:
      "Concentrating frontier capability and governance in a few labs or states is itself a core governance risk.",
    wantsMost: [
      "wider access to models, tools, and infrastructure",
      "checks on oligopoly and closed bottlenecks",
      "faster diffusion of beneficial applications and public-interest innovation",
    ],
    worriesMost: [
      "closed ecosystems becoming permanent gatekeepers",
      "safety arguments being used to entrench incumbents",
      "state-lab collusion around access control",
    ],
    closestNeighbors: ["stateCapacityBuilder", "coordinationArchitect"],
    likelyTensions: [
      "how to keep openness from increasing misuse and proliferation risk",
      "how to preserve decentralization without denying real asymmetries in capability",
    ],
    internationalLens:
      "Often sympathetic to open access and diffusion concerns across the Global South, while struggling with the security case for tighter control.",
  },
]

const axisPoleLabels: Record<AiAxisKey, { lowLabel: string; highLabel: string }> = {
  riskHorizon: {
    lowLabel: "Present harms first",
    highLabel: "Frontier risks first",
  },
  deploymentPace: {
    lowLabel: "Iterate through use",
    highLabel: "Slow at thresholds",
  },
  oversight: {
    lowLabel: "Lab-led governance",
    highLabel: "Public authority",
  },
  geopolitics: {
    lowLabel: "Coordination first",
    highLabel: "Competition first",
  },
  openness: {
    lowLabel: "Broader access",
    highLabel: "Controlled access",
  },
  militaryRole: {
    lowLabel: "Civilian restraint",
    highLabel: "Bounded defense use",
  },
  legitimacy: {
    lowLabel: "Technocratic discretion",
    highLabel: "Public legitimacy",
  },
  humanFuture: {
    lowLabel: "Transformative futures",
    highLabel: "Human control",
  },
}

const atlasAxisExplainers: Array<{
  key: AiAxisKey
  label: string
  explainer: string
}> = [
  {
    key: "riskHorizon",
    label: "Risk horizon",
    explainer:
      "Do you prioritize current harms first, frontier catastrophic risk first, or insist on holding both in view?",
  },
  {
    key: "deploymentPace",
    label: "Deployment pace",
    explainer:
      "Do you learn through release and iteration, rely on threshold guardrails, or favor stronger precaution before deployment?",
  },
  {
    key: "oversight",
    label: "Public oversight",
    explainer:
      "Should labs mostly govern themselves, or should states and public institutions supervise more directly?",
  },
  {
    key: "geopolitics",
    label: "Competition vs coordination",
    explainer:
      "Do you see rivalry as the binding constraint, or coordination as the only durable answer?",
  },
  {
    key: "openness",
    label: "Openness vs control",
    explainer:
      "Should advanced systems diffuse widely, or should access remain controlled and staged?",
  },
  {
    key: "militaryRole",
    label: "Military role",
    explainer:
      "How bounded or how extensive should defense and military uses of frontier AI be?",
  },
  {
    key: "legitimacy",
    label: "Legitimacy and rule-setting",
    explainer:
      "Who should decide: technical insiders, governments, publics, or multilateral institutions?",
  },
  {
    key: "humanFuture",
    label: "Human future",
    explainer:
      "Do you treat transformative AI futures as promising, dangerous, constrained, or morally ambiguous?",
  },
]

export const aiAtlasAxisGuide: AiAtlasAxisGuide[] = atlasAxisExplainers.map((axis) => ({
  ...axis,
  ...axisPoleLabels[axis.key],
}))

const aiAtlasComparisonNotes: Record<
  AiArchetypeKey,
  {
    comparisonNote: string
    contrastAxes: AiAxisKey[]
  }
> = {
  precautionarySteward: {
    comparisonNote:
      "This archetype often sits near other cautious, rule-building positions. The main split is whether the center of gravity should be severe frontier risk, public accountability, or transnational coordination.",
    contrastAxes: ["riskHorizon", "legitimacy", "geopolitics"],
  },
  strategicCompetitor: {
    comparisonNote:
      "These comparison points share a seriousness about pressure and enforcement, but they part ways on what the real constraint is: rivalry, state competence, or the possibility of dangerous capability surprise.",
    contrastAxes: ["geopolitics", "militaryRole", "deploymentPace"],
  },
  coordinationArchitect: {
    comparisonNote:
      "This position can resemble other rule-oriented families until the authority question gets sharper. The break usually comes over whether legitimacy should be mainly multilateral, domestic-public, or grounded in danger containment first.",
    contrastAxes: ["geopolitics", "legitimacy", "riskHorizon"],
  },
  democraticGuardrailist: {
    comparisonNote:
      "This family often overlaps with other cautious profiles until the argument turns to who should rule. The key difference is the insistence that governance stay publicly answerable rather than only technically sound or internationally elegant.",
    contrastAxes: ["legitimacy", "oversight", "riskHorizon"],
  },
  stateCapacityBuilder: {
    comparisonNote:
      "This archetype shares some institutional seriousness with both neighbors, but the divide is practical: it asks first who can actually supervise, procure, verify, and implement rather than which abstract rule system sounds best.",
    contrastAxes: ["oversight", "geopolitics", "legitimacy"],
  },
  openEcosystemBuilder: {
    comparisonNote:
      "This family is easiest to compare against positions that also worry about concentration and dependence. The split is whether the answer is stronger public machinery, broader coordination, or keeping the frontier more open than closure-oriented camps prefer.",
    contrastAxes: ["openness", "deploymentPace", "oversight"],
  },
}

export const aiAtlasKeys = AI_ATLAS_ARCHETYPES.map((card) => card.id)

export function getAiAtlasEntries(): AiAtlasEntry[] {
  return AI_ATLAS_ARCHETYPES.map((card) => {
    const profile = aiArchetypeDeepProfiles[card.id]
    const readings = getReadingBuckets(card.id)
    const comparison = aiAtlasComparisonNotes[card.id]

    return {
      ...card,
      key: card.id,
      questionToSitWith: profile.questionToSitWith,
      startHere: readings.forYourType[0],
      critique: readings.bestCritique[0],
      comparisonNote: comparison.comparisonNote,
      contrastAxes: comparison.contrastAxes,
    }
  })
}

export function getAiAtlasSharedReadings() {
  return getReadingBuckets(aiAtlasKeys[0]).startHere.slice(0, 4)
}

export function getAiAtlasLabel(id: AiAtlasArchetypeId) {
  return AI_ATLAS_ARCHETYPES.find((card) => card.id === id)?.label ?? id
}

export function getAiAxisLabel(axis: AiAxisKey) {
  return aiAxisLabels[axis]
}
