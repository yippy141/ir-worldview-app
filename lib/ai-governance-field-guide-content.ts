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
    "The fictional Larch Research Institute must decide how to provide access to a capable model for the next three months. Its internal tests show useful software and cyber assistance but do not establish autonomous attacks, and no misuse has been observed outside testing. The options are downloadable weights, qualified external evaluation in a secure enclave, or a hosted service with deeper evaluation kept inside Larch. In the enclave, an independent panel admits qualified teams and Larch cannot veto a qualified applicant; a revised arrangement gives Larch the final veto. Staffing, screening criteria, wait times and publication rights stay the same under both.",
} as const

export const aiFieldGuideWorkedReadings: AiFieldGuideWorkedReading[] = [
  {
    key: "precautionarySteward",
    firstQuestion: "What would wider release enable?",
    reading:
      "The model's cyber assistance raises the question of what wider release would enable. An enclave lets outside teams investigate while the downloadable weights stay inside Larch. The argument then asks what further evidence would justify giving up the ability to recall copies. Irreversibility alone does not answer every release question.",
  },
  {
    key: "strategicCompetitor",
    firstQuestion: "Who else gains access?",
    reading:
      "Hosted access and enclave evaluation both keep the model's copies under Larch's control. Wider release could also help other actors develop the capability. So this argument weighs the value of outside scrutiny against access by teams whose strategic interests conflict with Larch's. The three-month period is a horizon for the decision, not evidence of when a rival will catch up.",
  },
  {
    key: "coordinationArchitect",
    firstQuestion: "Could other institutes adopt the same rule?",
    reading:
      "Under the original arrangement an independent panel applies an admission rule that Larch cannot override. A coordination argument asks whether other institutes could adopt comparable criteria and recognize the evaluations that result. The developer veto moves final discretion to Larch. The arrangement still has rules; what changes is who decides the hard cases and whether an excluded applicant can contest the decision.",
  },
  {
    key: "democraticGuardrailist",
    firstQuestion: "Who can be held to account?",
    reading:
      "Evaluators keep the right to publish criticism under both enclave arrangements. Accountability also depends on who gains access and who can contest an exclusion. This argument asks who appoints and oversees the admission authority. Independence from Larch does not by itself make the panel publicly accountable.",
  },
  {
    key: "stateCapacityBuilder",
    firstQuestion: "Can the responsible bodies do the work?",
    reading:
      "Screening applicants and supporting their investigations takes staff and money, and in this exercise both stay fixed. The argument asks whether the responsible bodies can perform the work they authorize, and who covers a shortfall if they cannot. It wants that answer before it treats hosted access as the only workable arrangement.",
  },
  {
    key: "openEcosystemBuilder",
    firstQuestion: "Who is left outside the qualified group?",
    reading:
      "Downloadable weights let researchers outside the qualified group reproduce and modify the model. The enclave limits who takes part even when an independent panel decides admission. This argument weighs broader investigation against copies Larch cannot revoke. Support for independent scrutiny does not by itself settle whether unrestricted release is justified.",
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
      "The Ecosystem Builder answers with access: put models and tools in more hands, so no gatekeeper decides what can be studied or built. The Architect answers with rules: cross-border standards and verification that outlast any one lab's advantage. Each sees a cost in the other's cure. Wider reproducibility comes with copies that nobody can restrict afterward, and shared rules can harden into a club of the already powerful.",
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
      "Would your result change if worker voice, and neither frontier safety nor state capacity, were the starting point?",
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
