import type {
  ModuleAnalytics,
  ModuleDefinition,
  ModuleLaneSummary,
} from "@/lib/modules/types"
import type { DimensionKey, DimensionScores } from "@/lib/types"
import technologyBankJson from "@/content/instrument/technology.v2.json" with {
  type: "json",
}

/**
 * Immutable V21 Technology instrument: item bank v2, scorer v1.
 *
 * Historical answer-ID payloads resolve here. Current code must not import this
 * definition except through the version registry.
 */
export const TECHNOLOGY_V21_BANK_VERSION = 2
export const TECHNOLOGY_V21_SCORING_VERSION = 1

const technologyLanes: ModuleDefinition["lanes"] = [
  {
    key: "controls",
    label: "Controls and dependence",
    description: "How you read chokepoints, openness, restriction, and strategic dependence.",
    scoreKey: "control",
    lowLabel: "Open by default",
    highLabel: "Control-first",
  },
  {
    key: "capacity",
    label: "Capacity and industrial policy",
    description: "How you think durable advantage is built, financed, and distributed.",
    scoreKey: "industrial",
    lowLabel: "Market-led",
    highLabel: "State-capacity led",
  },
  {
    key: "governance",
    label: "Governance, access, and safety",
    description: "How you weigh shared rules, access gaps, deployment limits, and enforceable guardrails.",
    scoreKey: "governance",
    lowLabel: "National tools",
    highLabel: "Coordinated rules",
  },
]


type TechnologyDataItem =
  ModuleDefinition["questionsByMode"]["standard"][number] & {
    modes: Array<"standard" | "analyst">
  }

const technologyDataItems =
  technologyBankJson.items as unknown as TechnologyDataItem[]

function loadTechnologyQuestions(
  mode: "standard" | "analyst",
): ModuleDefinition["questionsByMode"]["standard"] {
  return technologyDataItems.filter((item) => item.modes.includes(mode)).map((item) => {
    const { modes, ...question } = item
    void modes
    return question
  })
}

const technologyQuestionsByMode: ModuleDefinition["questionsByMode"] = {
  standard: loadTechnologyQuestions("standard"),
  analyst: loadTechnologyQuestions("analyst"),
}

export const technologyV21Module: ModuleDefinition = {
  slug: "technology",
  shortTitle: "Technology",
  title: "Technology, AI, and Geoeconomics",
  subtitle: "A focused read on chokepoints, industrial policy, AI governance, and strategic dependence",
  shorthand: "Tech Power",
  timeEstimate: {
    standard: "8 to 10 minutes",
    analyst: "14 to 18 minutes",
  },
  description:
    "Most cases start from familiar debates about chokepoints, industrial policy, AI governance, and strategic dependence. A smaller set of pressure tests shifts to sanctioned, middle-power, and nonaligned perspectives when the vantage point changes the policy read.",
  measures: [
    "openness versus control",
    "market adaptation versus state-capacity building",
    "national tools versus coordinated governance",
    "how explanation cards differ from decision cards when the technology case sharpens",
  ],
  doesNotClaim: [
    "a stable technology identity that overrides the Foundation baseline",
    "a single answer for semiconductors, AI governance, and digital development alike",
    "a measure of technical expertise rather than issue instincts",
  ],
  axes: [
    {
      key: "control",
      label: "Control posture",
      lowLabel: "Open",
      highLabel: "Control-first",
    },
    {
      key: "governance",
      label: "Governance lens",
      lowLabel: "National",
      highLabel: "Coordinated",
    },
    {
      key: "industrial",
      label: "Industrial lens",
      lowLabel: "Market-led",
      highLabel: "State-capacity led",
    },
    {
      key: "safety",
      label: "AI risk lens",
      lowLabel: "Innovation-first",
      highLabel: "Safety-constrained",
    },
  ],
  lanes: technologyLanes,
  questionsByMode: technologyQuestionsByMode,
  interpret(analytics) {
    const { control, governance, industrial, safety } = analytics.scores

    if (control >= 5.5 && industrial >= 5.3) {
      return {
        headline: "Technology read: control with capacity-building",
        summary:
          "You generally believe technological advantage depends on guarding chokepoints, building productive depth, and treating dependence as an exposure to manage.",
        instincts: [
          "You are comfortable using control and industrial policy together.",
          "You treat productive capacity as a strategic asset, not just an economic one.",
          "You are skeptical that open markets alone will preserve a favorable balance.",
        ],
        challenge:
          "This style can normalize broad control measures faster than partners and institutions can absorb them.",
      }
    }

    if (governance >= 5.5) {
      return {
        headline: "Technology read: coordinated governance",
        summary:
          "You generally favor a coordinated technology strategy: shared standards, narrow controls, and durable alignment among capable partners.",
        instincts: [
          "You prefer tools that partners can actually implement together.",
          "You treat governance capacity as part of strategic power, not a soft add-on.",
          "You look for ways to preserve access selectively rather than abandon it wholesale.",
        ],
        challenge:
          "This style can assume more allied cohesion than actually exists once commercial interests and security priorities split.",
      }
    }

    if (safety >= 5.8) {
      return {
        headline: "Technology read: safety-first constraint",
        summary:
          "You are comparatively willing to slow, gate, or channel frontier systems when safety and security risks begin to outrun existing guardrails.",
        instincts: [
          "You do not treat frontier risk as a side issue to capability growth.",
          "You are skeptical that voluntary norms alone will keep pace with the field.",
          "You prefer enforceable thresholds to vague hope that actors will self-police.",
        ],
        challenge:
          "This style can become too comfortable with central control and understate the innovation cost of broad gating regimes.",
      }
    }

    if (control <= 3.7 && industrial <= 4.0) {
      return {
        headline: "Technology read: openness with targeted safeguards",
        summary:
          "You generally believe over-securitizing technology can do more long-run damage than the risks it is meant to solve, especially when it hardens the field too early.",
        instincts: [
          "You default toward openness with targeted safeguards rather than broad control.",
          "You trust competitive adaptation more than heavy industrial direction.",
          "You worry about regulation entrenching incumbents and shrinking useful experimentation.",
        ],
        challenge:
          "This style can understate how quickly strategic rivals exploit asymmetric openness in critical sectors.",
      }
    }

    return {
      headline: "Technology read: no single tool dominates",
      summary:
        "Your answers sit between control, capacity-building, and coordinated rules without any one of them pulling clear. On the current question set most answer patterns land here, so treat this as an unsettled position and read the lane meters for the detail.",
      instincts: [
        "No axis in this module separated far enough from the others to lead the read.",
        "Chokepoint control, industrial capacity, and coordination each stayed live across your answers.",
        "The lane meters carry more information than this headline does.",
      ],
      challenge:
        "Your threshold for harder control or broader openness is still unspecified. A case that forces one tool ahead of the others would settle it.",
    }
  },
  summarizeLanes(analytics, foundation) {
    return [
      summarizeTechnologyLane("controls", analytics.laneScores.controls, foundation),
      summarizeTechnologyLane("capacity", analytics.laneScores.capacity, foundation),
      summarizeTechnologyLane("governance", analytics.laneScores.governance, foundation),
    ]
  },
  summarizeCardTypes(analytics) {
    const explanation = analytics.cardTypeScores.explanation
    const decision = analytics.cardTypeScores.decision
    const actorLens = analytics.cardTypeScores.actorLens

    if (actorLens) {
      if (decision && actorLens.control - decision.control >= 0.65) {
        return {
          headline: "Explanation, Decision, and Actor lens",
          summary:
            "Your actor-lens cards make dependency and bargaining room look sharper than your own policy choices do.",
        }
      }

      return {
        headline: "Explanation, Decision, and Actor lens",
        summary:
          "The actor-lens cards show how technology politics looks from inside another state's position. Your decision cards stayed closer to your own line.",
      }
    }

    if (!explanation || !decision) return undefined

    if (explanation.control - decision.control >= 0.65) {
      return {
        headline: "Explanation and Decision",
        summary:
          "You explain technology cases through rivalry and dependence more than you endorse maximal closure once the policy tradeoffs are directly on the table.",
      }
    }

    if (decision.governance - explanation.governance >= 0.65) {
      return {
        headline: "Explanation and Decision",
        summary:
          "You often diagnose the field in strategic terms, but your decision cards still put more weight on coordinated rules and shared standards.",
      }
    }

    if (decision.safety - explanation.safety >= 0.65) {
      return {
        headline: "Explanation and Decision",
        summary:
          "You do not always explain the field through safety first, but your decision cards become much more willing to slow or gate deployment when the consequences sharpen.",
      }
    }

    return {
      headline: "Explanation and Decision",
      summary:
        "Your explanation and decision cards mostly move together. The same technology logic tends to survive when the question shifts from diagnosis to policy choice.",
    }
  },
  buildOverlayDeltas(analytics) {
    const { control, governance, industrial, safety } = analytics.scores

    return {
      securityCompetition: compress((control - 4) * 0.45),
      institutions: compress((governance - 4) * 0.55),
      domesticFilters: compress((industrial - 4) * 0.2),
      politicalEconomy: compress((((control - 4) * 0.45) + ((industrial - 4) * 0.55)) * 0.6),
      restraint: compress((4 - control) * 0.22),
      normsIdentity: compress((((governance - 4) * 0.35) + ((safety - 4) * 0.25)) * 0.25),
    }
  },
  compareToFoundation(analytics, foundation) {
    const notes: string[] = []
    const { control, governance, industrial } = analytics.scores

    if (foundation.politicalEconomy >= 5.15 && industrial >= 5.2) {
      notes.push("This module reinforces a baseline that already treats production, dependence, and economic leverage as strategically central.")
    } else if (foundation.politicalEconomy <= 3.85 && industrial >= 5.2) {
      notes.push("Compared with the Foundation, this module pulls you toward capacity-building and production depth.")
    }

    if (foundation.institutions >= 5.15 && governance <= 4.2) {
      notes.push("Compared with your Foundation profile, this module makes you more comfortable with national tools than coordinated rules.")
    } else if (foundation.institutions < 5 && governance >= 5.4) {
      notes.push("Compared with your Foundation profile, this module pulls you toward shared standards and coordinated governance.")
    }

    if (foundation.restraint >= 5.15 && control >= 5.3) {
      notes.push("Even with a more restrained baseline, technology pressure makes you noticeably more control-oriented.")
    }

    return notes.join(" ")
  },
}

function summarizeTechnologyLane(
  laneKey: string,
  scores: Record<string, number>,
  foundation?: DimensionScores,
): ModuleLaneSummary {
  const lane = technologyLanes.find((candidate) => candidate.key === laneKey)
  if (!lane) {
    return {
      key: laneKey,
      label: laneKey,
      summary: "This lane does not yet have a defined summary.",
      score: 4,
      lowLabel: "Lower",
      highLabel: "Higher",
    }
  }

  if (laneKey === "controls") {
    const control = scores.control ?? 4
    let summary = "This lane sits between chokepoint control and open exchange; neither pulled clear."

    if (control >= 5.2) {
      summary =
        "This lane hardens toward chokepoint protection and dependence management. Openness looks fragile when strategic leverage is at stake."
    } else if (control <= 3.8) {
      summary =
        "This lane stays more open by default. It resists treating every technology gap as a reason for broad restriction."
    }

    return {
      key: lane.key,
      label: lane.label,
      summary,
      score: control,
      lowLabel: lane.lowLabel,
      highLabel: lane.highLabel,
      delta:
        foundation && control >= 5.2 && foundation.restraint >= 5.15
          ? "More control-first than your baseline strategic restraint."
          : undefined,
    }
  }

  if (laneKey === "capacity") {
    const industrial = scores.industrial ?? 4
    let summary = "This lane sits between market adaptation and state-led capacity; neither pulled clear."

    if (industrial >= 5.2) {
      summary =
        "This lane is capacity-led. It treats public investment, productive depth, and shared infrastructure as strategic necessities rather than optional economic policy."
    } else if (industrial <= 3.8) {
      summary =
        "This lane is more market-led. It worries that heavy planning can freeze the field around political guesses."
    }

    return {
      key: lane.key,
      label: lane.label,
      summary,
      score: industrial,
      lowLabel: lane.lowLabel,
      highLabel: lane.highLabel,
      delta:
        foundation && industrial >= 5.2 && foundation.politicalEconomy <= 3.85
          ? "More capacity-led than your Foundation's lighter political-economy read."
          : undefined,
    }
  }

  const governance = scores.governance ?? 4
  const safety = scores.safety ?? 4
  let summary = "This lane sits between national discretion and coordinated rules; neither pulled clear."

  if (governance >= 5.2 && safety >= 5.0) {
    summary =
      "This lane favors shared rules and enforceable guardrails. Access should stay open enough to matter, but not so open that governance becomes ceremonial."
  } else if (governance <= 3.8) {
    summary =
      "This lane is more national and tool-specific. It doubts that slow or weak coordination can keep pace with the field."
  }

  return {
    key: lane.key,
    label: lane.label,
    summary,
    score: governance,
    lowLabel: lane.lowLabel,
    highLabel: lane.highLabel,
    delta:
      foundation && governance >= 5.2 && foundation.institutions <= 3.85
        ? "More coordination-minded than your more skeptical Foundation baseline."
        : undefined,
  }
}

function compress(value: number) {
  const bounded = Math.max(-1.2, Math.min(1.2, value))
  return Number(bounded.toFixed(2))
}

export const technologyOverlayDimensions: readonly DimensionKey[] = [
  "securityCompetition",
  "institutions",
  "domesticFilters",
  "politicalEconomy",
  "restraint",
  "normsIdentity",
] as const
