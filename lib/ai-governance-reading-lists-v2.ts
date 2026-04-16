import type { AiArchetypeKey } from "./ai-governance-types"

export type ReadingBucketKey =
  | "startHere"
  | "practiceNow"
  | "bestCritique"
  | "chinaAndGlobalLens"

export type ReadingEntry = {
  id: string
  title: string
  author: string
  year: string
  whyItMatters: string
  url?: string
}

export type ResultReadingMap = Record<ReadingBucketKey, ReadingEntry[]>

const BASELINE: ResultReadingMap = {
  startHere: [
    {
      id: "dafoe-2018-research-agenda",
      title: "AI Governance: A Research Agenda",
      author: "Allan Dafoe",
      year: "2018",
      whyItMatters:
        "Still one of the clearest maps of the field: alignment, concentration, institutional design, misuse, and global governance.",
    },
    {
      id: "iasr-2025",
      title: "International AI Safety Report 2025",
      author: "Independent international expert group",
      year: "2025",
      whyItMatters:
        "Useful as a shared scientific baseline for advanced-AI safety debates across countries rather than a single camp's framing.",
    },
    {
      id: "oecd-ai-principles",
      title: "OECD AI Principles",
      author: "OECD",
      year: "2019 / updated 2023",
      whyItMatters:
        "A high-level intergovernmental baseline for trustworthy AI, rights, robustness, and accountability.",
    },
    {
      id: "nist-ai-rmf-genai-profile",
      title: "NIST AI RMF: Generative AI Profile",
      author: "NIST",
      year: "2024",
      whyItMatters:
        "Shows how governance looks when translated into operational risk-management language.",
    },
  ],
  practiceNow: [
    {
      id: "metr-common-elements-frontier-ai-safety-policies",
      title: "Common Elements of Frontier AI Safety Policies",
      author: "METR",
      year: "2025 / 2026 site updates",
      whyItMatters:
        "Synthesizes what labs are actually doing around thresholds, model evaluations, weight security, and deployment mitigations.",
    },
    {
      id: "anthropic-responsible-scaling-policy",
      title: "Responsible Scaling Policy",
      author: "Anthropic",
      year: "2026 update",
      whyItMatters:
        "A living example of how a frontier lab publicly structures capability thresholds and safeguards.",
    },
    {
      id: "openai-updated-preparedness-framework",
      title: "Updated Preparedness Framework",
      author: "OpenAI",
      year: "2025",
      whyItMatters:
        "Useful for comparing another frontier-lab approach to severe-risk measurement and mitigation.",
    },
    {
      id: "aisi-safety-cases",
      title: "Safety Cases at AISI",
      author: "AI Security Institute",
      year: "2026",
      whyItMatters:
        "Pushes the debate from generic principles toward structured arguments that a system is safe in a given context.",
    },
  ],
  bestCritique: [
    {
      id: "bender-2021-stochastic-parrots",
      title: "On the Dangers of Stochastic Parrots",
      author:
        "Emily M. Bender, Timnit Gebru, Angelina McMillan-Major, Shmargaret Shmitchell",
      year: "2021",
      whyItMatters:
        "The canonical present-harms critique of scale-first language-model development.",
    },
    {
      id: "acemoglu-2021-harms-of-ai",
      title: "Harms of AI",
      author: "Daron Acemoglu",
      year: "2021",
      whyItMatters:
        "A strong challenge to governance approaches that assume more AI or more state support is obviously beneficial.",
    },
    {
      id: "crawford-2021-atlas-of-ai",
      title: "Atlas of AI",
      author: "Kate Crawford",
      year: "2021",
      whyItMatters:
        "A material critique of AI as an extractive infrastructure, not just a software or safety problem.",
    },
    {
      id: "seger-2023-open-sourcing-highly-capable-models",
      title: "Open-Sourcing Highly Capable Foundation Models",
      author: "Elizabeth Seger et al.",
      year: "2023",
      whyItMatters:
        "Useful when testing openness-first instincts against the strongest misuse and proliferation critique.",
    },
  ],
  chinaAndGlobalLens: [
    {
      id: "concordia-state-of-ai-safety-in-china",
      title: "State of AI Safety in China",
      author: "Concordia AI",
      year: "2025",
      whyItMatters:
        "The best single English-language guide to the diversity and maturation of Chinese AI safety discourse.",
    },
    {
      id: "prc-global-ai-governance-initiative",
      title: "Global AI Governance Initiative",
      author: "Ministry of Foreign Affairs of the PRC",
      year: "2023",
      whyItMatters:
        "Essential for understanding China's official framing around sovereignty, development, safety, and multilateral governance.",
    },
    {
      id: "waic-global-ai-governance-action-plan",
      title: "Global AI Governance Action Plan",
      author: "2025 World AI Conference and High-Level Meeting on Global AI Governance",
      year: "2025",
      whyItMatters:
        "A current official text on cooperation, development, and global-governance architecture beyond a U.S.-centric frame.",
    },
    {
      id: "unesco-ethics-of-ai-recommendation",
      title: "Recommendation on the Ethics of Artificial Intelligence",
      author: "UNESCO",
      year: "2021",
      whyItMatters:
        "Useful for human-rights, dignity, and global ethics framing that extends beyond frontier-lab discourse.",
    },
  ],
}

export const AI_ARCHETYPE_READING_NOTES: Record<
  AiArchetypeKey,
  Partial<ResultReadingMap>
> = {
  precautionarySteward: {
    practiceNow: [
      {
        id: "metr-frontier-ai-safety-policies",
        title: "Frontier AI Safety Policies",
        author: "METR",
        year: "2026",
        whyItMatters:
          "Useful for comparing how concrete threshold and mitigation regimes differ across frontier actors.",
      },
      {
        id: "bengio-2023-managing-ai-risks",
        title: "Managing AI Risks in an Era of Rapid Progress",
        author: "Yoshua Bengio et al.",
        year: "2023",
        whyItMatters:
          "A broad coalition statement capturing the frontier-risk mainstream case for stronger governance.",
      },
    ],
  },
  strategicCompetitor: {
    practiceNow: [
      {
        id: "iaps-research-database",
        title: "Research Database",
        author: "Institute for AI Policy and Strategy",
        year: "2026",
        whyItMatters:
          "Tracks national-security, compute-governance, and frontier-policy work in a more strategically oriented register.",
      },
      {
        id: "nscai-final-report",
        title: "Final Report",
        author: "National Security Commission on Artificial Intelligence",
        year: "2021",
        whyItMatters:
          "Still the clearest U.S. state-side baseline for AI, strategic competition, and national capability.",
      },
    ],
  },
  coordinationArchitect: {
    practiceNow: [
      {
        id: "iasr-2025-coordination",
        title: "International AI Safety Report 2025",
        author: "Independent international expert group",
        year: "2025",
        whyItMatters:
          "A useful example of cross-national synthesis and a model for shared evidence baselines.",
      },
      {
        id: "oecd-ai-principles-coordination",
        title: "AI Principles",
        author: "OECD",
        year: "2019 / updated 2023",
        whyItMatters:
          "Illustrates how intergovernmental coordination becomes concrete through common principles and policy observatories.",
      },
    ],
  },
  democraticGuardrailist: {
    bestCritique: [
      {
        id: "horowitz-2019-when-speed-kills",
        title:
          "When Speed Kills: Lethal Autonomous Weapon Systems and the Dangers of Rushing to Weaponize AI",
        author: "Michael Horowitz",
        year: "2019",
        whyItMatters:
          "A strong security-focused critique of governance that ignores the pace pressures created by military competition.",
      },
      {
        id: "hadfield-2019-incompleteness",
        title: "Incompleteness: A Regulatory Design Challenge for AI",
        author: "Gillian Hadfield",
        year: "2019",
        whyItMatters:
          "A useful challenge to the idea that more democratic procedure automatically yields governance that can keep up with fast-moving systems.",
      },
    ],
  },
  stateCapacityBuilder: {
    practiceNow: [
      {
        id: "oecd-governing-with-ai",
        title: "Governing with Artificial Intelligence",
        author: "OECD",
        year: "2025 / 2026",
        whyItMatters:
          "Useful for turning abstract governance talk into procurement, implementation, and administrative practice questions.",
      },
      {
        id: "engstrom-2020-government-by-algorithm",
        title:
          "Government by Algorithm: Artificial Intelligence in Federal Administrative Agencies",
        author: "David Freeman Engstrom et al.",
        year: "2020",
        whyItMatters:
          "Shows how capacity constraints shape real public-sector AI governance.",
      },
    ],
  },
  openEcosystemBuilder: {
    bestCritique: [
      {
        id: "widder-2023-open-for-business",
        title: "Open (for Business): Big Tech, Concentrated Power, and the Political Economy of Open AI",
        author: "David Gray Widder, Sarah West, Meredith Whittaker",
        year: "2023",
        whyItMatters:
          "A good check on the idea that openness by itself solves concentration, access, or power asymmetry.",
      },
    ],
    practiceNow: [
      {
        id: "bommasani-2021-foundation-models",
        title: "On the Opportunities and Risks of Foundation Models",
        author: "Rishi Bommasani et al.",
        year: "2021",
        whyItMatters:
          "Still one of the strongest maps of how open access, concentration, and downstream use pull against each other.",
      },
    ],
  },
}

function mergeEntries(
  custom: ReadingEntry[] | undefined,
  baseline: ReadingEntry[],
): ReadingEntry[] {
  const seen = new Set<string>()

  return [...(custom ?? []), ...baseline].filter((entry) => {
    if (seen.has(entry.id)) return false
    seen.add(entry.id)
    return true
  })
}

export function getAiReadingList(
  archetypeKey?: AiArchetypeKey | null,
): ResultReadingMap {
  const custom = archetypeKey ? AI_ARCHETYPE_READING_NOTES[archetypeKey] : undefined

  return {
    startHere: mergeEntries(custom?.startHere, BASELINE.startHere),
    practiceNow: mergeEntries(custom?.practiceNow, BASELINE.practiceNow),
    bestCritique: mergeEntries(custom?.bestCritique, BASELINE.bestCritique),
    chinaAndGlobalLens: mergeEntries(
      custom?.chinaAndGlobalLens,
      BASELINE.chinaAndGlobalLens,
    ),
  }
}
