import type { AiArchetypeKey } from "./ai-governance-types"

export type AiFieldGuideWorkedReading = {
  key: AiArchetypeKey
  firstQuestion: string
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
 * (lib/decision-exercises/catalog.ts): the fictional Larch Research Institute
 * chooses between publishing model weights, admitting qualified outside
 * evaluators to a secure enclave, and a monitored hosted service. Each reading
 * is an authored illustration of that approach's first question. Nothing here
 * is scored, and no reading is attached to the reader.
 */
export const aiFieldGuideWorkedDecision = {
  exerciseHref: "/decisions/who-gets-access",
  exerciseTitle: "Who gets access?",
  situation:
    "The fictional Larch Research Institute holds a model that improves software research and can assist offensive cyber work. Its own tests show useful assistance and no autonomous attacks. It must choose access for the next three months: publish the weights, admit qualified outside evaluators to a secure enclave with the weights kept inside, or run a monitored hosted service and keep evaluation in house.",
} as const

export const aiFieldGuideWorkedReadings: AiFieldGuideWorkedReading[] = [
  {
    key: "precautionarySteward",
    firstQuestion: "What can the model do?",
    reading:
      "The cyber-assistance finding puts the burden on release to prove itself. The enclave keeps outside testing possible and a pause available if the picture worsens. Published weights cannot be recalled, and for this approach that settles it.",
  },
  {
    key: "strategicCompetitor",
    firstQuestion: "Who else gains?",
    reading:
      "Published weights hand the capability to rivals and to anyone building on it. The hosted service or the enclave keeps the edge and the chokepoint. The enclave is acceptable only if screening keeps adversarial teams out, and the three-month window is a reason to decide fast, before the capability is matched elsewhere.",
  },
  {
    key: "coordinationArchitect",
    firstQuestion: "Which choice could other labs and states adopt as a rule?",
    reading:
      "An enclave run under published criteria, with findings that travel, can be copied across borders. A lone decision to publish or withhold sets no standard. This approach wants the independent admission panel, because a rule the developer can veto is not a rule.",
  },
  {
    key: "democraticGuardrailist",
    firstQuestion: "Who can hold Larch to account?",
    reading:
      "The enclave is worth having only if evaluators can publish criticism Larch cannot veto. The hosted service leaves the public dependent on the developer's word. The capability ceiling matters less here than whether an outside body has standing to say no.",
  },
  {
    key: "stateCapacityBuilder",
    firstQuestion: "Who could run the enclave?",
    reading:
      "Screening staff, budget, and wait times are fixed. A scheme the institute cannot staff will fail in practice whatever it promises on paper. If the evaluation capacity is missing, the hosted service is the honest option, and building that capacity is the real decision.",
  },
  {
    key: "openEcosystemBuilder",
    firstQuestion: "Who is shut out?",
    reading:
      "The enclave and the hosted service both make Larch the gatekeeper of what can be studied. Publishing the weights lets researchers outside the screened circle reproduce and contest the findings. The misuse evidence is a reason for wider scrutiny, and this approach doubts that scrutiny can be delegated to a gatekeeper.",
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
      "Export controls and limits on diffusion to rivals. A stop counts only if it survives competitive pressure, so a unilateral pause is suspect.",
  },
  {
    key: "coordinationArchitect",
    inspectAndRelease:
      "Shared verification and evaluation frameworks that cross borders. Release under rules that travel between firms and states.",
    restrictAndStop:
      "Common standards and incident mechanisms agreed across rival blocs. A stop by one state or one lab sets no rule.",
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
      "The same bodies, where they exist. Where the state cannot enforce, a paper restriction restricts no one.",
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
      "The Competitor asks what keeps a capability edge under rivalry and reads institutions as instruments of that contest. The Capacity Builder asks who can supervise, procure, and verify in practice, and reads the edge as worthless to a state that has become a customer of the firms it should govern.",
  },
  {
    id: "concentration",
    a: "openEcosystemBuilder",
    b: "coordinationArchitect",
    sharedGround:
      "Both worry that frontier capability is concentrating in a few labs and a few states.",
    argument:
      "The Ecosystem Builder answers with access: put models and tools in more hands, so no gatekeeper decides what can be studied or built. The Architect answers with rules: cross-border standards and verification that outlast any one lab's advantage. Each sees the other's cure as the disease. Open weights defeat verification; shared rules can become a club of the already powerful.",
  },
  {
    id: "legitimacy",
    a: "coordinationArchitect",
    b: "democraticGuardrailist",
    sharedGround:
      "Both want enforceable rules and distrust voluntary self-governance by labs.",
    argument:
      "The Architect looks outward: legitimacy comes from standards and verification that rival states accept. The Guardrailist looks inward: legitimacy comes from domestic institutions the public can hold to account. When a multilateral body and a national legislature disagree about a model, the two take opposite sides.",
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
      "Would your result change if worker voice, and neither frontier safety nor state capacity, were the starting point?",
  },
  {
    id: "surveillance-platform-power",
    title: "Surveillance and platform power",
    whyItMatters:
      "AI systems deepen monitoring, prediction, and behavioral control by firms and states long before any frontier-risk question arises.",
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
