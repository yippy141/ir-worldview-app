import type { AiArchetypeKey } from "./ai-governance-types"

export type AiFieldGuideWorkedReading = {
  key: AiArchetypeKey
  firstQuestion?: string
  reading: string
}

export type AiFieldGuidePowerRow = {
  key: AiArchetypeKey
  inspectAndRelease: string
  restrictAndStop: string
}

export type AiFieldGuideDisagreement = {
  id: string
  a: AiArchetypeKey
  b: AiArchetypeKey
  sharedGround: string
  argument: string
}

export type AiUnderModeledPerspective = {
  id: string
  title: string
  whyItMatters: string
  currentCoverage: string
  readingQuestion: string
}

/**
 * The worked decision is the published "Who gets access?" exercise
 * (lib/decision-exercises/catalog.ts, access episode). The situation restates
 * the episode's fixed assumptions, its three options and both admission
 * arrangements. Each reading is an authored interpretation of how one approach
 * would argue the decision; more than one may favor the same option. Nothing
 * here is scored, and no reading is attached to the reader.
 */
export const aiFieldGuideWorkedDecision = {
  exerciseHref: "/decisions/who-gets-access",
  exerciseTitle: "Who gets access?",
  situation:
    "The fictional Larch Research Institute must decide how to provide access to a capable model for the next three months. Its internal tests show useful software and cyber assistance but do not establish autonomous attacks, and no misuse has been observed outside testing.",
  options: [
    "Publish downloadable weights that anyone can run or modify. Released copies cannot be recalled.",
    "Admit qualified external evaluators to a secure enclave, with general access through a monitored hosted service.",
    "Offer a monitored, rate-limited hosted service, keeping weights and deeper evaluation inside Larch.",
  ],
  originalAdmission:
    "An independent panel admits qualified teams and makes final admission decisions. Larch cannot veto a qualified applicant.",
  revisedAdmission:
    "The revised arrangement gives Larch final admission power and a veto over applicants who meet the same criteria.",
  unchanged:
    "Staffing, budget, screening criteria, wait times, research permissions and publication rights stay the same. Capability and misuse evidence, and the public-weights and hosted-service options, also stay fixed.",
  researchPermissions:
    "Qualified enclave participants may inspect and modify the model, export approved findings and publish criticism under the existing export terms. Weights remain inside the enclave.",
  uncertainty:
    "Larch does not know how much new benefit or misuse wider access would produce. No arrangement guarantees safety or useful criticism.",
} as const

export const aiFieldGuideWorkedReadings: AiFieldGuideWorkedReading[] = [
  {
    key: "precautionarySteward",
    reading:
      "Publishing the weights would let anyone run or modify the model, and Larch could not retrieve the released copies. An enclave gives qualified outsiders access without distributing those weights. A precautionary argument favors keeping that control while further testing examines the cyber risks and what would justify wider release.",
  },
  {
    key: "strategicCompetitor",
    firstQuestion: "Who else gains access?",
    reading:
      "Publishing weights would let competitors build on Larch's work. Hosted access or an enclave would keep the weights inside, while offering different opportunities for outsiders to investigate. A strategic argument asks which researchers should gain access, what they could learn, and how that knowledge might benefit a rival.",
  },
  {
    key: "coordinationArchitect",
    reading:
      "Other institutes could use comparable admission criteria and recognize one another's evaluations. The independent panel gives Larch less discretion to exclude qualified applicants. A coordination argument asks whether that arrangement could support cooperation between institutes, and how a developer veto would affect their willingness to rely on it.",
  },
  {
    key: "democraticGuardrailist",
    firstQuestion: "Who can be held to account?",
    reading:
      "Evaluators may publish criticism under both arrangements. The difference is who gets inside: an independent panel admits qualified teams in the first; Larch can veto them in the second. Public accountability raises another question: who appoints that decision-maker, oversees its choices and hears a complaint from an excluded researcher?",
  },
  {
    key: "stateCapacityBuilder",
    reading:
      "The enclave requires people to screen applicants and support their work. A state-capacity argument asks whether the responsible bodies have the staff, money and authority to do that job. Before choosing, it would need to know how much work each arrangement requires and who can deliver it.",
  },
  {
    key: "openEcosystemBuilder",
    firstQuestion: "Who is left outside the qualified group?",
    reading:
      "Publishing the weights lets researchers outside the qualified group reproduce and modify the model. An independent admission panel still leaves some researchers out. Wider access would reduce that dependence on permission, but Larch would lose the ability to recall the copies. Is access for more researchers worth giving up that control?",
  },
]

/**
 * Summarized from each approach's atlas card (lib/ai-governance-atlas-content.ts):
 * what it wants most, what it worries about, and its core belief.
 */
export const aiFieldGuidePowerRows: AiFieldGuidePowerRow[] = [
  {
    key: "precautionarySteward",
    inspectAndRelease:
      "Outside evaluators test for dangerous capability before release. Release is staged and gated on those tests.",
    restrictAndStop:
      "The bodies that set the thresholds narrow access or pause when warning signs accumulate, even at commercial or geopolitical cost.",
  },
  {
    key: "strategicCompetitor",
    inspectAndRelease:
      "National security agencies and the state's own technical staff. Release follows what keeps a capability edge under rivalry.",
    restrictAndStop:
      "Export controls and limits on diffusion to rivals. A pause by one lab or state does not show that rivals will pause too, so this approach asks what the edge costs while they do not.",
  },
  {
    key: "coordinationArchitect",
    inspectAndRelease:
      "Shared verification and evaluation frameworks that cross borders. Release under rules that travel between firms and states.",
    restrictAndStop:
      "Common standards and incident mechanisms agreed across rival blocs. A stop by one state or one lab does not by itself create a shared rule that others recognize.",
  },
  {
    key: "democraticGuardrailist",
    inspectAndRelease:
      "Publicly answerable bodies with standing to audit. Release through a process the public can contest.",
    restrictAndStop:
      "Accountable institutions, with rights protections on deployment and monitoring. Labs, security agencies, and technical insiders do not get the last word.",
  },
  {
    key: "stateCapacityBuilder",
    inspectAndRelease:
      "Staffed regulators with audit, reporting, and procurement powers. Release depends on whether the state can supervise what it approves.",
    restrictAndStop:
      "The same bodies, where they exist. A restriction the state cannot enforce has an uncertain effect, and this approach asks who would carry it out before counting on it.",
  },
  {
    key: "openEcosystemBuilder",
    inspectAndRelease:
      "Anyone with access. Broad release lets many parties examine and reproduce the work.",
    restrictAndStop:
      "Checks on gatekeepers and closed bottlenecks. A stop imposed by incumbents on safety grounds is a claim to be tested.",
  },
]

export const aiFieldGuideDisagreements: AiFieldGuideDisagreement[] = [
  {
    id: "check",
    a: "democraticGuardrailist",
    b: "precautionarySteward",
    sharedGround:
      "Both want a stronger check before broad deployment than a lab's own safety case.",
    argument:
      "They disagree about what the check answers to. The Steward binds it to the capability itself: cross a threshold and the burden of proof rises, whoever is in charge. The Guardrailist binds it to public oversight: a check the public cannot contest is a private arrangement, however cautious.",
  },
  {
    id: "state",
    a: "strategicCompetitor",
    b: "stateCapacityBuilder",
    sharedGround:
      "Both treat AI governance as a problem for states, and both distrust rules that exist only on paper.",
    argument:
      "The Competitor asks what keeps a capability edge under rivalry and reads institutions as instruments of that contest. The Capacity Builder asks who can supervise, procure, and verify in practice, and what an edge is worth to a state that depends on the firms it is supposed to govern.",
  },
  {
    id: "concentration",
    a: "openEcosystemBuilder",
    b: "coordinationArchitect",
    sharedGround:
      "Both worry that frontier capability is concentrating in a few labs and a few states.",
    argument:
      "The Ecosystem Builder answers with access: put models and tools in more hands, so no gatekeeper decides what can be studied or built. The Architect answers with rules: cross-border standards and verification that outlast any one lab's advantage. Each sees a cost in the other's cure. Wider access allows more researchers to reproduce the work, while Larch loses the ability to recall released copies. Shared rules raise a different concern: whether the participating firms and states would exclude others.",
  },
  {
    id: "legitimacy",
    a: "coordinationArchitect",
    b: "democraticGuardrailist",
    sharedGround:
      "Both want enforceable rules and distrust voluntary self-governance by labs.",
    argument:
      "The Architect looks outward: legitimacy comes from standards and verification that rival states accept. The Guardrailist looks inward: legitimacy comes from domestic institutions the public can hold to account. They may back the same rule for a model. They part over what makes it legitimate, a standard agreed among states or a decision a domestic public can contest.",
  },
]

export const aiUnderModeledPerspectives: AiUnderModeledPerspective[] = [
  {
    id: "labor-automation",
    title: "Labor, automation, and bargaining power",
    whyItMatters:
      "AI governance is also workplace governance. Who captures the productivity gains, who is displaced, and whether workers have any say over deployment are governance questions before they are economic ones.",
    currentCoverage:
      "The questions touch present harms and human control. They do not ask about unions, labor law, or distributional conflict at work.",
    readingQuestion:
      "How would you judge workplace AI if workers' bargaining power were your main concern?",
  },
  {
    id: "surveillance-platform-power",
    title: "Surveillance and platform power",
    whyItMatters:
      "AI systems can deepen monitoring, prediction, and behavioral control by firms and states long before any frontier-risk question arises.",
    currentCoverage:
      "The questions cover oversight and legitimacy. They do not treat surveillance, policing, or platform governance as traditions with their own answers.",
    readingQuestion:
      "Where does your result treat concentration as a safety problem, and where should it treat concentration as a problem of political power?",
  },
  {
    id: "environment-compute",
    title: "Environmental and compute externalities",
    whyItMatters:
      "Compute, data centers, water, energy, minerals, and grid demand are material constraints on what can be built and where.",
    currentCoverage:
      "The questions register capacity and control instincts. They do not ask about climate, energy, or the politics of extraction.",
    readingQuestion:
      "Would your threshold for deployment move if the compute cost were visible on every capability decision?",
  },
  {
    id: "global-south-sovereignty",
    title: "Global South dependence and sovereignty",
    whyItMatters:
      "Most states will meet advanced AI through imported cloud, foreign model access, compliance costs, and infrastructure they do not own. Few will ever choose a frontier lab's release policy.",
    currentCoverage:
      "State Capacity Builder and Open Ecosystem Builder point at this problem. The questions do not ask about development strategy or dependency.",
    readingQuestion:
      "Does your result assume the actor has the capacity to govern, or ask what happens when it does not?",
  },
  {
    id: "chinese-official-framings",
    title: "Chinese official framings",
    whyItMatters:
      "Chinese governance language combines sovereignty, development, safety, state capacity, and multilateralism in ways that do not map onto the categories of the U.S. debate.",
    currentCoverage:
      "The reading lists include Chinese and global-governance sources. None of the six approaches is built from Chinese official doctrine.",
    readingQuestion:
      "Which parts of your result are about governing AI, and which are about the political vocabulary you are used to reading?",
  },
  {
    id: "open-source-anti-incumbency",
    title: "Open-source and anti-incumbency politics",
    whyItMatters:
      "Open access can be a technical practice, a market strategy, a civil-liberties claim, or a challenge to concentration in a few labs and states.",
    currentCoverage:
      "Open Ecosystem Builder carries this concern as one position. The questions do not separate its security, industrial, and anti-monopoly strands.",
    readingQuestion:
      "When you defend openness, are you defending innovation, accountability, sovereignty, competition, or all of them at once?",
  },
]
