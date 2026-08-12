import type {
  ModuleAnalytics,
  ModuleDefinition,
  ModuleLaneSummary,
} from "@/lib/modules/types"
import {
  getModuleClassificationMode,
  standardizeModuleAxis,
} from "@/lib/modules/calibration"
import type { DimensionKey, DimensionScores, QuizMode } from "@/lib/types"
import securityBankJson from "@/content/instrument/security.v3.json" with {
  type: "json",
}

export const SECURITY_BANK_VERSION = 3
export const SECURITY_SCORING_VERSION = 2

const securityLanes: ModuleDefinition["lanes"] = [
  {
    key: "deterrence",
    label: "Deterrence and escalation",
    description: "How you handle probing, coercion, and crisis ceilings.",
    scoreKey: "activism",
    lowLabel: "Crisis-limiting",
    highLabel: "Pressure-forward",
  },
  {
    key: "alliances",
    label: "Alliances and autonomy",
    description: "How exposed partners, coalition durability, and hedging space should be read.",
    scoreKey: "alliance",
    lowLabel: "Autonomy space",
    highLabel: "Alliance-centered",
  },
  {
    key: "legitimacy",
    label: "Order, legitimacy, and protection",
    description: "How you weigh order, legal authority, civilian protection, and bounded action.",
    scoreKey: "legitimacy",
    lowLabel: "Order-first",
    highLabel: "Protection-sensitive",
  },
]


type SecurityDataItem =
  ModuleDefinition["questionsByMode"]["standard"][number] & {
    modes: Array<"standard" | "analyst">
  }

const securityDataItems =
  securityBankJson.items as unknown as SecurityDataItem[]

function loadSecurityQuestions(
  mode: "standard" | "analyst",
): ModuleDefinition["questionsByMode"]["standard"] {
  return securityDataItems.filter((item) => item.modes.includes(mode)).map((item) => {
    const { modes, ...question } = item
    void modes
    return question
  })
}

const securityQuestionsByMode: ModuleDefinition["questionsByMode"] = {
  standard: loadSecurityQuestions("standard"),
  analyst: loadSecurityQuestions("analyst"),
}

export const securityModule: ModuleDefinition = {
  slug: "security",
  defaultHeadline: "Security read: no single lane dominates",
  shortTitle: "Security",
  title: "Security, Strategy, and Statecraft",
  subtitle: "A focused read on deterrence, alliances, escalation, and the legitimacy of force",
  shorthand: "Security Pressure",
  timeEstimate: {
    standard: "8 to 10 minutes",
    analyst: "14 to 18 minutes",
  },
  description:
    "The cases examine deterrence, alliances, escalation, and legitimacy from the positions of exposed partners, rival powers, and nonaligned states.",
  measures: [
    "pressure versus crisis-limiting instincts",
    "alliance-centered versus autonomy-sensitive coalition instincts",
    "order-first versus protection-sensitive views of force and legitimacy",
    "how explanation cards differ from decision cards when the case sharpens",
  ],
  doesNotClaim: [
    "a fixed security identity that overrides the Foundation baseline",
    "a full theory of grand strategy across every theater",
    "role-play or nationality-adjusted answers",
  ],
  axes: [
    {
      key: "activism",
      label: "Force posture",
      lowLabel: "Restrained",
      highLabel: "Coercive",
    },
    {
      key: "escalation",
      label: "Escalation lens",
      lowLabel: "Escalation-averse",
      highLabel: "Credibility-first",
    },
    {
      key: "alliance",
      label: "Alliance lens",
      lowLabel: "Autonomy-sensitive",
      highLabel: "Alliance-centric",
    },
    {
      key: "legitimacy",
      label: "Legitimacy lens",
      lowLabel: "Order-first",
      highLabel: "Protection-sensitive",
    },
  ],
  lanes: securityLanes,
  questionsByMode: securityQuestionsByMode,
  interpret(analytics, context) {
    const mode = getModuleClassificationMode(analytics, context)
    const { activism, escalation, alliance, legitimacy } = analytics.scores
    const headlineContext = { kind: "headline" } as const
    const activismPosition = standardizeModuleAxis(
      "security",
      mode,
      headlineContext,
      "activism",
      activism,
    )
    const escalationPosition = standardizeModuleAxis(
      "security",
      mode,
      headlineContext,
      "escalation",
      escalation,
    )
    const alliancePosition = standardizeModuleAxis(
      "security",
      mode,
      headlineContext,
      "alliance",
      alliance,
    )
    const legitimacyPosition = standardizeModuleAxis(
      "security",
      mode,
      headlineContext,
      "legitimacy",
      legitimacy,
    )

    if (
      activismPosition.value >= activismPosition.upper &&
      escalationPosition.value >= escalationPosition.upper
    ) {
      return {
        headline: "Security read: pressure and visible deterrence",
        summary:
          "Your answers treat delay as costly and visible commitment as a way to deter further probing.",
        instincts: [
          "You worry most about what hesitation teaches an adversary.",
          "You treat credibility failures as harder to reverse than bounded overcommitment.",
          "You are comfortable with pressure when it clarifies the line rather than blurs it.",
        ],
        challenge:
          "This style can understate how quickly credibility campaigns become escalation traps or politically unsustainable commitments.",
      }
    }

    if (
      activismPosition.value <= activismPosition.lower &&
      escalationPosition.value <= escalationPosition.lower
    ) {
      return {
        headline: "Security read: restraint and crisis ceilings",
        summary:
          "You look first for ceilings, off-ramps, and ways to keep coercion from widening into a harder war than the original problem requires.",
        instincts: [
          "You are skeptical that visible toughness automatically produces better outcomes.",
          "You see overextension and mission creep as strategic dangers in their own right.",
          "You prefer bounded responses that do not quietly redefine the whole conflict.",
        ],
        challenge:
          "This style can understate how much cumulative advantage a rival can gain when caution keeps winning the first move.",
      }
    }

    if (alliancePosition.value >= alliancePosition.upper) {
      return {
        headline: "Security read: coalition-centered pressure management",
        summary:
          "Your answers put exposed-partner confidence and the coalition’s ability to sustain policy at the center of security.",
        instincts: [
          "You treat alliance cohesion as part of deterrence, not diplomatic decoration.",
          "You prefer strategies that partners can sustain together over dramatic unilateral gestures.",
          "You pay close attention to how frontline and middle-power states read outside commitments.",
        ],
        challenge:
          "This style can assume more allied durability than domestic politics will actually deliver under stress.",
      }
    }

    if (legitimacyPosition.value >= legitimacyPosition.upper) {
      return {
        headline: "Security read: protection-sensitive statecraft",
        summary:
          "Your answers favor force and deterrence only when civilian protection and defensible authority set clear bounds.",
        instincts: [
          "You keep asking what kind of precedent a response is setting.",
          "You distinguish narrow protection from open-ended license to act.",
          "You see legitimacy as part of strategic durability rather than as a separate moral clean-up step.",
        ],
        challenge:
          "This style can overestimate how much legitimacy itself constrains rivals willing to absorb reputational cost.",
      }
    }

    return {
      headline: "Security read: no single lane dominates",
      summary:
        "No single lane leads your Security result. The lane meters show your answers across the three security lanes.",
      instincts: [
        "The three lane readings remain mixed enough that this result cannot name one leading security logic.",
        "Your answers place different kinds of security costs ahead in different cases.",
        "Read each lane meter for the exact pattern.",
      ],
      challenge:
        "A case that makes the costs of immediate pressure explicit would test which lane leads.",
    }
  },
  summarizeLanes(analytics, foundation, context) {
    const mode = getModuleClassificationMode(analytics, context)
    const deterrence = analytics.laneScores.deterrence
    const alliances = analytics.laneScores.alliances
    const legitimacy = analytics.laneScores.legitimacy

    return [
      summarizeSecurityLane("deterrence", deterrence, mode, foundation),
      summarizeSecurityLane("alliances", alliances, mode, foundation),
      summarizeSecurityLane("legitimacy", legitimacy, mode, foundation),
    ]
  },
  summarizeCardTypes(analytics) {
    const explanation = analytics.cardTypeScores.explanation
    const decision = analytics.cardTypeScores.decision
    const actorLens = analytics.cardTypeScores.actorLens

    if (actorLens) {
      if (decision && decision.alliance - actorLens.alliance >= 0.65) {
        return {
          headline: "Explanation, Decision, and Actor lens",
          summary:
            "Your own decision cards lean more toward alliance management than your actor-lens cards do. From inside another state's position, autonomy and exposure become more visible.",
        }
      }

      return {
        headline: "Explanation, Decision, and Actor lens",
        summary:
          "The actor-lens cards track how security logic looks from inside another actor's position. Your decision cards stayed closer to your own line.",
      }
    }

    if (!explanation || !decision) return undefined

    if (explanation.activism - decision.activism >= 0.65) {
      return {
        headline: "Explanation and Decision",
        summary:
          "You explain security cases through harder pressure and deterrence logics than you are willing to endorse outright once the decision costs are in view.",
      }
    }

    if (decision.legitimacy - explanation.legitimacy >= 0.65) {
      return {
        headline: "Explanation and Decision",
        summary:
          "Your explanation cards read cases structurally, while your decision cards give more weight to legitimacy, civilian risk, and bounded action.",
      }
    }

    if (decision.alliance - explanation.alliance >= 0.65) {
      return {
        headline: "Explanation and Decision",
        summary:
          "Your explanation cards are not especially coalition-first, but your decision cards put much more weight on what exposed partners and alliances can actually carry together.",
      }
    }

    return {
      headline: "Explanation and Decision",
      summary:
        "Your explanation and decision cards mostly point in the same direction. The same security logic tends to survive when the question shifts from diagnosis to choice.",
    }
  },
  buildOverlayDeltas(analytics) {
    const { activism, escalation, alliance, legitimacy } = analytics.scores

    return {
      securityCompetition: compress(((activism - 4) * 0.6 + (escalation - 4) * 0.4) * 0.55),
      institutions: compress(((alliance - 4) * 0.75 + (legitimacy - 4) * 0.25) * 0.4),
      normsIdentity: compress((legitimacy - 4) * 0.22),
      restraint: compress((4 - activism) * 0.55),
      orderJustice: compress((4 - legitimacy) * 0.55),
    }
  },
  compareToFoundation(analytics, foundation) {
    const notes: string[] = []
    const { activism, alliance, legitimacy } = analytics.scores

    if (foundation.restraint >= 5.15 && activism >= 5.1) {
      notes.push("Under security pressure, you harden relative to your more restrained Foundation baseline.")
    } else if (foundation.restraint <= 3.85 && activism <= 3.8) {
      notes.push("Under security pressure, you become more bounded than your harder-edged Foundation baseline might imply.")
    }

    if (foundation.institutions >= 5.15 && alliance >= 5.2) {
      notes.push("Your institutional baseline stays visible here through coalition endurance and alliance design.")
    } else if (foundation.institutions <= 3.85 && alliance >= 5.2) {
      notes.push("Even with a more skeptical Foundation baseline, security pressure pushes you toward coalition management and exposed-partner reassurance.")
    }

    if (foundation.orderJustice >= 5.15 && legitimacy >= 5.1) {
      notes.push("Compared with the Foundation, this module makes protection and political legitimacy more active constraints.")
    } else if (foundation.orderJustice <= 3.85 && legitimacy <= 4.0) {
      notes.push("This module reinforces a more justice-sensitive baseline rather than pulling you back toward order-first caution.")
    }

    return notes.join(" ")
  },
}

function summarizeSecurityLane(
  laneKey: string,
  scores: Record<string, number>,
  mode: QuizMode,
  foundation?: DimensionScores,
): ModuleLaneSummary {
  const lane = securityLanes.find((candidate) => candidate.key === laneKey)
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

  if (laneKey === "deterrence") {
    const activism = scores.activism ?? 4
    const escalation = scores.escalation ?? 4
    const laneContext = { kind: "lane", laneKey } as const
    const activismPosition = standardizeModuleAxis(
      "security",
      mode,
      laneContext,
      "activism",
      activism,
    )
    const escalationPosition = standardizeModuleAxis(
      "security",
      mode,
      laneContext,
      "escalation",
      escalation,
    )
    let summary = "Your deterrence answers give similar weight to visible pressure and crisis limitation."

    if (
      activismPosition.value >= activismPosition.upper &&
      escalationPosition.value >= escalationPosition.upper
    ) {
      summary =
        "This lane leans toward visible deterrence and earlier pressure when ambiguity itself starts to reward probing."
    } else if (activismPosition.value <= activismPosition.lower) {
      summary =
        "This lane looks first for ceilings, route protection, resilience, and ways to keep coercion from widening into a larger war."
    }

    return {
      key: lane.key,
      label: lane.label,
      summary,
      score: activism,
      lowLabel: lane.lowLabel,
      highLabel: lane.highLabel,
      delta:
        foundation && Math.abs(foundation.restraint - 4) > 0.4
          ? activismPosition.value >= activismPosition.upper &&
            foundation.restraint >= 5.15
            ? "Harder-edged than your baseline restraint score."
            : activismPosition.value <= activismPosition.lower &&
                foundation.restraint <= 3.85
              ? "More crisis-limiting than your baseline strategic style."
              : undefined
          : undefined,
    }
  }

  if (laneKey === "alliances") {
    const alliance = scores.alliance ?? 4
    const alliancePosition = standardizeModuleAxis(
      "security",
      mode,
      { kind: "lane", laneKey },
      "alliance",
      alliance,
    )
    let summary = "Your alliance answers give similar weight to coalition management and partner autonomy."

    if (alliancePosition.value >= alliancePosition.upper) {
      summary =
        "This lane becomes coalition-centered. Exposed allies, reassurance, and partner endurance are part of the security answer itself."
    } else if (alliancePosition.value <= alliancePosition.lower) {
      summary =
        "This lane is autonomy-sensitive. It gives smaller and middle powers more room to hedge, diversify, and resist bloc compression."
    }

    return {
      key: lane.key,
      label: lane.label,
      summary,
      score: alliance,
      lowLabel: lane.lowLabel,
      highLabel: lane.highLabel,
      delta:
        foundation &&
        alliancePosition.value >= alliancePosition.upper &&
        foundation.institutions <= 3.85
          ? "More coalition-centered than your baseline institutions score."
          : undefined,
    }
  }

  const legitimacyScore = scores.legitimacy ?? 4
  const legitimacyPosition = standardizeModuleAxis(
    "security",
    mode,
    { kind: "lane", laneKey },
    "legitimacy",
    legitimacyScore,
  )
  let summary = "Your legitimacy answers give similar weight to order-first caution and civilian protection."

  if (legitimacyPosition.value >= legitimacyPosition.upper) {
    summary =
      "This lane is protection-sensitive. It keeps civilian risk, regional backing, and defensible authority active even when harder action is on the table."
  } else if (legitimacyPosition.value <= legitimacyPosition.lower) {
    summary =
      "This lane stays order-first. It sets a higher bar for force when legal authority and precedent are weak."
  }

  return {
    key: lane.key,
    label: lane.label,
    summary,
    score: legitimacyScore,
    lowLabel: lane.lowLabel,
    highLabel: lane.highLabel,
    delta:
      foundation &&
      legitimacyPosition.value >= legitimacyPosition.upper &&
      foundation.orderJustice >= 5.15
        ? "More protection-sensitive than your order-first Foundation baseline."
        : foundation &&
            legitimacyPosition.value <= legitimacyPosition.lower &&
            foundation.orderJustice <= 3.85
          ? "More order-first than your justice-sensitive Foundation baseline."
          : undefined,
  }
}

function compress(value: number) {
  const bounded = Math.max(-1.2, Math.min(1.2, value))
  return Number(bounded.toFixed(2))
}

export const securityOverlayDimensions: readonly DimensionKey[] = [
  "securityCompetition",
  "institutions",
  "normsIdentity",
  "restraint",
  "orderJustice",
] as const
