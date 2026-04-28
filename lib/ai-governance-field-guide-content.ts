export type AiFieldGuideScopeItem = {
  title: string
  body: string
}

export type AiUnderModeledPerspective = {
  id: string
  title: string
  whyItMatters: string
  currentCoverage: string
  readingQuestion: string
}

export const aiFieldGuideMeasures: AiFieldGuideScopeItem[] = [
  {
    title: "Governance instincts under pressure",
    body:
      "Whether your default answer is caution, capability, coordination, public oversight, state capacity, or openness when the AI case becomes concrete.",
  },
  {
    title: "Tradeoffs across eight axes",
    body:
      "Risk horizon, deployment pace, oversight, geopolitics, openness, military role, legitimacy, and human future.",
  },
  {
    title: "How policy logics cluster",
    body:
      "The archetype is the closest modeled family of answers, not a claim that the field has six natural camps.",
  },
]

export const aiFieldGuideLimits: AiFieldGuideScopeItem[] = [
  {
    title: "Technical expertise",
    body:
      "The Compass does not certify whether someone understands model training, eval design, security engineering, or deployment operations.",
  },
  {
    title: "Institutional feasibility",
    body:
      "It asks what kinds of governance you find persuasive; it does not prove that those institutions can be built on the needed timeline.",
  },
  {
    title: "The whole politics of AI",
    body:
      "Several important perspectives are present only at the edge of the model. They belong in the reading shelf, not hidden in fine print.",
  },
]

export const aiUnderModeledPerspectives: AiUnderModeledPerspective[] = [
  {
    id: "labor-automation",
    title: "Labor, automation, and bargaining power",
    whyItMatters:
      "AI governance is also workplace governance: who captures productivity gains, who bears displacement, and whether workers have real leverage over deployment.",
    currentCoverage:
      "The model touches present harms and human control, but it does not separately score labor politics, unions, or distributional conflict at work.",
    readingQuestion:
      "Would your AI result change if worker voice, not frontier safety or state capacity, were the starting point?",
  },
  {
    id: "surveillance-platform-power",
    title: "Surveillance and platform power",
    whyItMatters:
      "AI systems can deepen monitoring, prediction, and behavioral control by firms and states long before frontier-risk questions appear.",
    currentCoverage:
      "The Compass tracks oversight and legitimacy, but it does not fully model surveillance capitalism, policing, or platform governance as their own traditions.",
    readingQuestion:
      "Where does your result treat concentration as a safety problem, and where should it treat concentration as a political-power problem?",
  },
  {
    id: "environment-compute",
    title: "Environmental and compute externalities",
    whyItMatters:
      "Compute, data centers, water, energy, minerals, and grid demand are material constraints, not background conditions.",
    currentCoverage:
      "The current axes can register capacity and control instincts, but they do not directly score climate, energy, or extractive-infrastructure politics.",
    readingQuestion:
      "Would your threshold for deployment change if compute externalities were visible on every capability decision?",
  },
  {
    id: "global-south-sovereignty",
    title: "Global South dependence and sovereignty",
    whyItMatters:
      "Many states will meet AI through imported cloud, foreign model access, compliance costs, and infrastructure dependence rather than frontier-lab choice.",
    currentCoverage:
      "State Capacity Builder and Open Ecosystem Builder point toward this problem, but the Compass does not fully model development strategy or dependency theory.",
    readingQuestion:
      "Does your result assume the actor has the capacity to govern, or ask what happens when it does not?",
  },
  {
    id: "chinese-official-framings",
    title: "Chinese official framings",
    whyItMatters:
      "Chinese governance language combines sovereignty, development, safety, state capacity, and multilateralism in ways that do not map cleanly onto U.S. debate categories.",
    currentCoverage:
      "The reading shelf includes China and global-governance lenses, but the scored archetypes are not built from Chinese official doctrine as a separate family.",
    readingQuestion:
      "Which parts of your result are about AI governance itself, and which are about the political vocabulary you are used to reading?",
  },
  {
    id: "open-source-anti-incumbency",
    title: "Open-source and anti-incumbency politics",
    whyItMatters:
      "Open access can be a technical practice, a market strategy, a civil-liberties claim, or a challenge to state-lab concentration.",
    currentCoverage:
      "Open Ecosystem Builder carries this concern, but the model does not split open-source governance into its security, industrial, and anti-monopoly strands.",
    readingQuestion:
      "When you defend openness, are you defending innovation, accountability, sovereignty, competition, or all of them at once?",
  },
]
