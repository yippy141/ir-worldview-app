import type { AiArchetypeKey } from "./ai-governance-types"

export type ReadingEntry = {
  id: string
  title: string
  author: string
  year: number
  description: string
  url?: string
}

export type ReadingBuckets = {
  startHere: ReadingEntry[]
  forYourType: ReadingEntry[]
  bestCritique: ReadingEntry[]
  chinaAndGlobalLens: ReadingEntry[]
}

// ── Universal start-here entries ─────────────────────────────────────────────

const startHereEntries: ReadingEntry[] = [
  {
    id: "dafoe-2018-research-agenda",
    title: "AI Governance: A Research Agenda",
    author: "Allan Dafoe (Future of Humanity Institute)",
    year: 2018,
    description:
      "Still the clearest map of the governance problem space: value alignment, power concentration, structural risk, and institutional design. Good for orienting to what governance actually means beyond regulation.",
  },
  {
    id: "bengio-2023-managing-risks",
    title: "Managing AI Risks in an Era of Rapid Progress",
    author: "Yoshua Bengio et al.",
    year: 2023,
    description:
      "A broad-coalition statement naming specific governance concerns — concentration of power, loss of control, and inadequate oversight — alongside the capabilities case for urgency. Represents the frontier-risk mainstream position.",
    url: "https://arxiv.org/abs/2310.17688",
  },
  {
    id: "bender-2021-parrots",
    title: "On the Dangers of Stochastic Parrots: Can Language Models Be Too Big?",
    author: "Emily M. Bender, Timnit Gebru, Angelina McMillan-Major, Shmargaret Shmitchell",
    year: 2021,
    description:
      "The most influential articulation of present-harms-first concerns: environmental cost, data ethics, documentation gaps, and risks of systems deployed before their harms are understood. Counterpoint to capability-first governance.",
  },
  {
    id: "brundage-2018-malicious-use",
    title: "The Malicious Use of Artificial Intelligence: Forecasting, Prevention, and Mitigation",
    author: "Miles Brundage et al.",
    year: 2018,
    description:
      "Forecasts how AI capabilities could be misused across cyber, physical, and political domains. A useful threat-model primer that applies regardless of where you stand on deployment pace or oversight structures.",
    url: "https://arxiv.org/abs/1802.07228",
  },
]

// ── Archetype-specific: for your type ────────────────────────────────────────

const forYourTypeByArchetype: Record<AiArchetypeKey, ReadingEntry[]> = {
  precautionarySteward: [
    {
      id: "russell-2019-human-compatible",
      title: "Human Compatible: Artificial Intelligence and the Problem of Control",
      author: "Stuart Russell",
      year: 2019,
      description:
        "The technical and philosophical case for why advanced AI requires fundamentally different design principles — corrigibility, uncertainty about human preferences, and the ability to be corrected. Argues control is not a secondary concern.",
    },
    {
      id: "hendrycks-2023-catastrophic-risks",
      title: "An Overview of Catastrophic AI Risks",
      author: "Dan Hendrycks, Mantas Mazeika, Thomas Woodside",
      year: 2023,
      description:
        "A systematic survey of AI risk categories — misuse, misalignment, and structural risks — that argues precautionary governance is warranted even under deep uncertainty. A reference for the frontier-risk case.",
      url: "https://arxiv.org/abs/2306.12001",
    },
    {
      id: "ord-2020-precipice",
      title: "The Precipice: Existential Risk and the Future of Humanity",
      author: "Toby Ord",
      year: 2020,
      description:
        "Situates AI risk in the broader context of catastrophic and existential risk. Makes the case for taking severe low-probability scenarios seriously as a governance priority — and for why urgency is rational under uncertainty.",
    },
  ],

  strategicCompetitor: [
    {
      id: "nscai-2021-final-report",
      title: "Final Report: National Security Commission on Artificial Intelligence",
      author: "Eric Schmidt, Robert Work et al. (NSCAI)",
      year: 2021,
      description:
        "The U.S. government's most comprehensive assessment of AI and national security. Argues competition with China is a structural feature of the AI era and that democratic governments must maintain capability leadership.",
    },
    {
      id: "kania-2017-battlefield-singularity",
      title: "Battlefield Singularity: Artificial Intelligence, Military Revolution, and China's Future Military Power",
      author: "Elsa Kania (Center for a New American Security)",
      year: 2017,
      description:
        "Early influential analysis of China's military AI strategy. Argues that AI will reshape military competition and that capability gaps compound over time. Shaped subsequent U.S. strategic thinking on the domain.",
    },
    {
      id: "aschenbrenner-2024-situational-awareness",
      title: "Situational Awareness: The Decade Ahead",
      author: "Leopold Aschenbrenner",
      year: 2024,
      description:
        "A provocation arguing that AGI timelines are short, that strategic competition will intensify as capabilities grow, and that leading democracies must treat frontier AI as a matter of national security.",
    },
  ],

  coordinationArchitect: [
    {
      id: "cihon-2020-centralised-governance",
      title: "Should Artificial Intelligence Governance Be Centralised?",
      author: "Peter Cihon, Matthijs Maas, Luke Kemp",
      year: 2020,
      description:
        "Analyzes the case for centralized versus polycentric AI governance. Finds benefits to centralization for managing concentrated risks but warns of fragility and institutional capture. Useful for thinking through the institutional-design tradeoffs.",
    },
    {
      id: "hadfield-2017-rules-flat-world",
      title: "Rules for a Flat World: Why Humans Invented Law and How to Reinvent It for a Complex Global Economy",
      author: "Gillian Hadfield",
      year: 2017,
      description:
        "Makes the case for adaptive, distributed, and privately supplied legal infrastructure. Relevant to AI governance debates about whether traditional state-based regulatory institutions are the right vehicle for fast-moving technology.",
    },
    {
      id: "brundage-2020-verifiable-claims",
      title: "Toward Trustworthy AI Development: Mechanisms for Supporting Verifiable Claims",
      author: "Miles Brundage et al.",
      year: 2020,
      description:
        "Proposes technical and institutional mechanisms — audit, certification, red-teaming — that would let coordination commitments become credible rather than merely declaratory. A constructive complement to coordination-optimism.",
      url: "https://arxiv.org/abs/2004.07213",
    },
  ],

  democraticGuardrailist: [
    {
      id: "crawford-2021-atlas",
      title: "Atlas of AI: Power, Politics, and the Planetary Costs of Artificial Intelligence",
      author: "Kate Crawford",
      year: 2021,
      description:
        "Maps AI as a material and political infrastructure. Argues that governance must address power asymmetries between developers and affected communities, not only technical safety. Required reading for accountability-first positions.",
    },
    {
      id: "raji-2020-closing-gap",
      title: "Closing the AI Accountability Gap: Defining an End-to-End Framework for Internal Algorithmic Auditing",
      author: "Inioluwa Deborah Raji et al.",
      year: 2020,
      description:
        "Proposes internal audit frameworks for AI systems that foreground social harm rather than only technical performance. Influential for accountability-first governance approaches that want mechanisms, not just principles.",
    },
    {
      id: "ai-now-2023",
      title: "AI Now Report 2023",
      author: "AI Now Institute",
      year: 2023,
      description:
        "Annual survey of AI's social and political implications. Argues for public regulation, worker protections, and civil society oversight. Represents the democratic-accountability wing of the governance debate.",
    },
  ],

  stateCapacityBuilder: [
    {
      id: "doshi-2021-long-game",
      title: "The Long Game: China's Grand Strategy to Displace American Order",
      author: "Rush Doshi",
      year: 2021,
      description:
        "Reconstructs China's strategy across economic, military, and political domains. Shows how state capacity — not just intent — determines whether governance commitments can be credibly made and enforced.",
    },
    {
      id: "cset-2020-strengthening",
      title: "Strengthening and Democratizing the U.S. Artificial Intelligence Innovation Ecosystem",
      author: "Center for Security and Emerging Technology (CSET)",
      year: 2020,
      description:
        "Policy analysis of gaps in U.S. AI procurement, workforce, and regulatory capacity. Argues that the critical bottleneck is not rules but the ability to implement them — technical staff, institutional knowledge, and agency competence.",
    },
    {
      id: "engstrom-2020-government-by-algorithm",
      title: "Government by Algorithm: Artificial Intelligence in Federal Administrative Agencies",
      author: "David Freeman Engstrom et al.",
      year: 2020,
      description:
        "Surveys how federal agencies already use AI and finds that capacity gaps — not lack of rules — are the primary barrier to accountable algorithmic governance. Grounds the state-capacity argument in current administrative practice.",
    },
  ],

  openEcosystemBuilder: [
    {
      id: "solaiman-2019-release-strategies",
      title: "Release Strategies and the Social Impacts of Language Models",
      author: "Irene Solaiman et al.",
      year: 2019,
      description:
        "Evaluates open, staged, and closed release postures and their social tradeoffs. An early systematic treatment of openness as a governance variable rather than a binary choice.",
    },
    {
      id: "bommasani-2021-foundation-models",
      title: "On the Opportunities and Risks of Foundation Models",
      author: "Rishi Bommasani et al. (Stanford CRFM)",
      year: 2021,
      description:
        "Comprehensive survey of large foundation models documenting both the broad benefits of accessible general-purpose AI and the governance challenges concentration creates. Grounds the open-ecosystem case in empirical analysis.",
      url: "https://arxiv.org/abs/2108.07258",
    },
    {
      id: "raffel-2023-building-open",
      title: "Building Open-Source AI",
      author: "Colin Raffel",
      year: 2023,
      description:
        "Makes the case that open-source AI development produces better safety properties through distributed scrutiny, rather than worse ones. Argues for openness as a positive safety strategy rather than a concession to speed.",
    },
  ],
}

// ── Archetype-specific: best critique ────────────────────────────────────────

const bestCritiqueByArchetype: Record<AiArchetypeKey, ReadingEntry[]> = {
  precautionarySteward: [
    {
      id: "lecun-2022-autonomous-machine",
      title: "A Path Towards Autonomous Machine Intelligence",
      author: "Yann LeCun",
      year: 2022,
      description:
        "Argues that current deep learning architectures do not lead to the kind of agency or strategic autonomy that catastrophic-risk scenarios require. Challenges the technical premises of frontier-risk governance from inside the field.",
    },
    {
      id: "marcus-2019-rebooting-ai",
      title: "Rebooting AI: Building Artificial Intelligence We Can Trust",
      author: "Gary Marcus, Ernest Davis",
      year: 2019,
      description:
        "Argues that current AI capabilities are substantially overstated and that governance organized around catastrophic frontier risk may be addressing the wrong problem. Useful for stress-testing precautionary assumptions.",
    },
  ],

  strategicCompetitor: [
    {
      id: "horowitz-2019-speed-kills",
      title: "When Speed Kills: Lethal Autonomous Weapon Systems and the Dangers of Rushing to Weaponize AI",
      author: "Michael Horowitz",
      year: 2019,
      description:
        "Argues that competitive dynamics in military AI create pressure to deploy systems before they are ready, increasing catastrophic failure risk. Challenges the assumption that competitive urgency improves national security outcomes.",
    },
    {
      id: "saran-2022-global-governance",
      title: "Towards a Global AI Governance Architecture",
      author: "Samir Saran, Akhil Deo (Observer Research Foundation)",
      year: 2022,
      description:
        "Argues that governance built on U.S.-China competition will fail to include the Global South and will undermine long-term legitimacy. Challenges competition-first governance as insufficient for durable global stability.",
    },
  ],

  coordinationArchitect: [
    {
      id: "mearsheimer-2001-tragedy",
      title: "The Tragedy of Great Power Politics",
      author: "John Mearsheimer",
      year: 2001,
      description:
        "The foundational text for offensive realism. Argues that international institutions are largely epiphenomenal and that major powers will defect from cooperative arrangements when vital interests conflict. The sharpest test of coordination-optimism.",
    },
    {
      id: "doshi-2021-long-game-coord-critique",
      title: "The Long Game: China's Grand Strategy to Displace American Order",
      author: "Rush Doshi",
      year: 2021,
      description:
        "Read as a critique: documents how China uses multilateral institutions strategically to advance competitive goals rather than build durable cooperation. Challenges the assumption that coordination frameworks will bind leading powers symmetrically.",
    },
  ],

  democraticGuardrailist: [
    {
      id: "hadfield-2019-incompleteness",
      title: "Incompleteness: A Regulatory Design Challenge for AI",
      author: "Gillian Hadfield",
      year: 2019,
      description:
        "Argues that traditional democratic regulatory institutions — legislation, agencies, courts — are structurally poorly suited to the speed and complexity of AI. Challenges the assumption that more democratic accountability automatically yields better governance.",
    },
    {
      id: "coglianese-2019-regulating-by-robot",
      title: "Regulating by Robot: Administrative Decision Making in the Machine-Learning Era",
      author: "Cary Coglianese, David Lehr",
      year: 2019,
      description:
        "Analyzes when algorithmic decision-making can be compatible with existing legal accountability standards and when it challenges them. Pushes back on blanket democratic-oversight arguments by showing where they apply and where they don't.",
    },
  ],

  stateCapacityBuilder: [
    {
      id: "acemoglu-2021-harms",
      title: "Harms of AI",
      author: "Daron Acemoglu",
      year: 2021,
      description:
        "Argues that AI's economic and political harms are partly enabled by excessive state subsidies and incumbency protection for large AI developers. Challenges state-capacity arguments by questioning whether more government investment in AI is straightforwardly beneficial.",
      url: "https://arxiv.org/abs/2102.04828",
    },
    {
      id: "birhane-2021-values",
      title: "The Values Encoded in Machine Learning Research",
      author: "Abeba Birhane et al.",
      year: 2021,
      description:
        "Finds that institutional actors deploying AI systems tend to encode narrow performance and efficiency values over equity. Challenges state-capacity arguments by asking: capacity to do what, in whose interest?",
    },
  ],

  openEcosystemBuilder: [
    {
      id: "seger-2023-open-sourcing",
      title: "Open-Sourcing Highly Capable Foundation Models",
      author: "Elizabeth Seger et al. (Centre for the Governance of AI)",
      year: 2023,
      description:
        "A detailed assessment concluding that for highly capable models, open-weights release shifts risk substantially and that openness objectives can often be achieved through less risky mechanisms. The most systematic case against unrestricted open release.",
    },
    {
      id: "widder-2023-open-for-business",
      title: "Open (for Business): Big Tech, Concentrated Power, and the Political Economy of Open AI",
      author: "David Gray Widder, Sarah West, Meredith Whittaker",
      year: 2023,
      description:
        "A critical analysis distinguishing genuine openness from strategic use of open-source framing by incumbents. Argues that openness alone does not address concentration — and may entrench it under some conditions.",
    },
  ],
}

// ── Universal China and global lens entries ───────────────────────────────────

const chinaAndGlobalLensEntries: ReadingEntry[] = [
  {
    id: "roberts-2021-chinese-approach",
    title: "Governing Artificial Intelligence in China and the United States",
    author: "Huw Roberts et al.",
    year: 2021,
    description:
      "Compares Chinese and U.S. approaches to AI governance, finding more convergence on high-level principles than is commonly assumed but significant divergence on implementation, rights, and surveillance. An antidote to pure competition framing.",
  },
  {
    id: "UNESCO-2021-recommendation",
    title: "Recommendation on the Ethics of Artificial Intelligence",
    author: "UNESCO",
    year: 2021,
    description:
      "The first global normative framework on AI ethics, adopted by 193 member states. Establishes human rights, dignity, and environmental sustainability as governance anchors. Represents the multilateral rather than great-power governance vision.",
  },
  {
    id: "couldry-mejias-2019-costs",
    title: "The Costs of Connection: How Data Is Colonizing Human Life",
    author: "Nick Couldry, Ulises A. Mejias",
    year: 2019,
    description:
      "Argues that the data economy replicates colonial extraction patterns. Relevant for Global South AI governance: questions whether current frameworks address the asymmetric costs borne by countries outside the frontier.",
  },
  {
    id: "calo-2017-primer",
    title: "Artificial Intelligence Policy: A Primer and Roadmap",
    author: "Ryan Calo",
    year: 2017,
    description:
      "A foundational legal overview of the AI policy space that identifies challenges no single national framework can solve alone. Sets up the case for why governance must operate at multiple jurisdictional levels.",
  },
]

// ── Public API ────────────────────────────────────────────────────────────────

export function getReadingBuckets(archetypeKey: AiArchetypeKey): ReadingBuckets {
  return {
    startHere: startHereEntries,
    forYourType: forYourTypeByArchetype[archetypeKey],
    bestCritique: bestCritiqueByArchetype[archetypeKey],
    chinaAndGlobalLens: chinaAndGlobalLensEntries,
  }
}
