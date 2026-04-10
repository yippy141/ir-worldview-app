import { dimensionLabels } from "@/lib/quiz-schema"
import { scoreFamilies } from "@/lib/scoring"
import type { ModuleSlug } from "@/lib/modules/types"
import type { ModuleSnapshot, ProfileStore } from "@/lib/profile-store"
import type { ChoiceCardType, DimensionKey } from "@/lib/types"

export type ProfileState =
  | "lowDifferentiation"
  | "stableModeration"
  | "domainConditionedShift"
  | "trueTension"

export type ProfileAssessment = {
  state: ProfileState
  stateLabel: string
  synthesis: string
  summary: string
  changedMost: string
  panelTitle: string
  panelIntro: string
  points: string[]
}

export type ProfileSpineOverlay = {
  slug: ModuleSlug
  label: string
  value: number
}

export type ProfileSpineRow = {
  dimension: DimensionKey
  label: string
  baseline: number
  lowLabel: string
  highLabel: string
  overlays: ProfileSpineOverlay[]
}

type ModuleCardTypeScores = Partial<Record<ChoiceCardType, Record<string, number>>>

const SPINE_ENDPOINTS: Record<DimensionKey, { lowLabel: string; highLabel: string }> = {
  securityCompetition: {
    lowLabel: "Less rivalry-centered",
    highLabel: "Rivalry-centered",
  },
  institutions: {
    lowLabel: "Institutions as power mirrors",
    highLabel: "Institutions matter",
  },
  domesticFilters: {
    lowLabel: "System-pressure first",
    highLabel: "Domestic-politics aware",
  },
  normsIdentity: {
    lowLabel: "Norm-skeptical",
    highLabel: "Legitimacy-aware",
  },
  politicalEconomy: {
    lowLabel: "Security-and-diplomacy first",
    highLabel: "Political-economy attuned",
  },
  restraint: {
    lowLabel: "Maximization first",
    highLabel: "Restraint first",
  },
  orderJustice: {
    lowLabel: "Justice-sensitive",
    highLabel: "Order-first",
  },
}

const DIRECTION_PHRASES: Record<DimensionKey, { positive: string; negative: string }> = {
  securityCompetition: {
    positive: "more rivalry-centered",
    negative: "less rivalry-centered",
  },
  institutions: {
    positive: "more institution-minded",
    negative: "more institution-skeptical",
  },
  domesticFilters: {
    positive: "more domestic-politics aware",
    negative: "more system-pressure first",
  },
  normsIdentity: {
    positive: "more legitimacy-aware",
    negative: "more norm-skeptical",
  },
  politicalEconomy: {
    positive: "more political-economy attuned",
    negative: "less political-economy centered",
  },
  restraint: {
    positive: "more restraint-minded",
    negative: "more pressure-minded",
  },
  orderJustice: {
    positive: "more order-first",
    negative: "more justice-sensitive",
  },
}

export function buildIntegratedHeadline(profile: ProfileStore): string {
  const assessment = buildProfileAssessment(profile)
  return assessment.synthesis
}

export function buildCrossDomainTensions(profile: ProfileStore): string[] {
  const assessment = buildProfileAssessment(profile)
  return assessment.state === "trueTension" ? assessment.points : []
}

export function buildProfileAssessment(profile: ProfileStore): ProfileAssessment {
  const foundation = profile.foundation
  if (!foundation) {
    return {
      state: "stableModeration",
      stateLabel: "Foundation first",
      synthesis: "Complete the Foundation first to build your integrated profile.",
      summary: "The integrated profile needs a saved Foundation result before it can layer in module overlays.",
      changedMost: "No focus-area overlays yet. The Foundation remains the anchor.",
      panelTitle: "Profile state",
      panelIntro: "The profile state appears once the Foundation has been completed.",
      points: [],
    }
  }

  const moduleSnapshots = getOrderedModuleSnapshots(profile)
  if (moduleSnapshots.length === 0) {
    return {
      state: "stableModeration",
      stateLabel: "Baseline only",
      synthesis: `${foundation.familyLabel} baseline with no completed focus-area overlays yet.`,
      summary:
        "The Foundation is still doing the interpretive work on its own. Once modules are added, this page will show where the baseline hardens, softens, or stays steady.",
      changedMost: "No focus-area overlays yet. The Foundation remains the anchor.",
      panelTitle: "Stability mode",
      panelIntro: "With no module overlays yet, the stable takeaway is simply what the Foundation is already telling you.",
      points: [
        "Your current profile is anchored entirely in the Foundation baseline.",
        "Focus-area modules are optional overlays, not requirements for a valid result.",
      ],
    }
  }

  const nearestFitGap = getNearestFitGap(foundation.dimensionScores)
  const averageDistance = getAverageDistanceFromCenter(foundation.dimensionScores)
  const strongestShift = getStrongestShift(moduleSnapshots)
  const crossDomainConflicts = getCrossDomainConflictPoints(moduleSnapshots)
  const cardTypeTensions = getCardTypeTensionPoints(moduleSnapshots)
  const totalTensions = [...crossDomainConflicts, ...cardTypeTensions]
  const meaningfulShiftCount = getMeaningfulShiftCount(moduleSnapshots)
  const changedMost = strongestShift
    ? `What shifts most: ${strongestShift.moduleLabel} pushes you ${strongestShift.direction}.`
    : "What shifts most: the completed modules mostly stay close to your Foundation baseline."

  if (totalTensions.length >= 2 || crossDomainConflicts.length >= 1) {
    return {
      state: "trueTension",
      stateLabel: "True tension",
      synthesis: `${foundation.familyLabel} baseline with real cross-domain tension once the overlays are layered in.`,
      summary:
        "Your saved results do not just show mild variation. They pull in meaningfully different directions across issue areas or card types.",
      changedMost,
      panelTitle: "Tension mode",
      panelIntro:
        "The value here is not that the model has found a cleaner type. It is that it can name where your profile genuinely pulls in different directions.",
      points: totalTensions.slice(0, 4),
    }
  }

  if (meaningfulShiftCount > 0) {
    const strongestModule = strongestShift?.moduleLabel ?? "one module"
    return {
      state: "domainConditionedShift",
      stateLabel: "Domain-conditioned shift",
      synthesis: `${foundation.familyLabel} baseline with a clear domain-conditioned shift under ${strongestModule.toLowerCase()} pressure.`,
      summary:
        "The baseline is still recognizable, but at least one module produces a consistent directional shift rather than just a little noise around the center.",
      changedMost,
      panelTitle: "Shift mode",
      panelIntro:
        "The main payoff is seeing which issue domain changes your emphasis most while still leaving the baseline recognizable.",
      points: buildShiftPoints(moduleSnapshots),
    }
  }

  if (nearestFitGap <= 0.45 && averageDistance <= 1.05) {
    return {
      state: "lowDifferentiation",
      stateLabel: "Nearest fit",
      synthesis: `Nearest-fit ${foundation.familyLabel.toLowerCase()} baseline with only modest separation across the layers you have completed.`,
      summary:
        "The model is not seeing a sharply sorted profile here. The result is better read as a nearest fit with stable tendencies than as a crisp worldview box.",
      changedMost,
      panelTitle: "Stability mode",
      panelIntro:
        "The honest takeaway is not hidden distinctiveness. It is that your profile stays relatively unsorted even after the available overlays.",
      points: [
        "The gap between the closest Foundation traditions remains narrow.",
        "The completed module overlays do not sharply separate the profile into a cleaner box.",
        "What is stable here is moderation and overlap rather than doctrinal sharpness.",
      ],
    }
  }

  return {
    state: "stableModeration",
    stateLabel: "Broadly stable",
    synthesis: `${foundation.familyLabel} baseline that stays broadly stable across the completed module overlays.`,
    summary:
      "The completed modules add texture, but they do not overturn the overall pattern. The same broad orientation survives once pressure is applied in different domains.",
    changedMost,
    panelTitle: "Stability mode",
    panelIntro:
      "The stable payoff is not that nothing changes. It is that the same broad profile still holds once the issue domains get harder.",
    points: buildStabilityPoints(moduleSnapshots),
  }
}

export function buildProfileSpineRows(profile: ProfileStore): ProfileSpineRow[] {
  const foundation = profile.foundation
  if (!foundation) return []

  const overlays = getOrderedModuleSnapshots(profile).slice(0, 2)

  return (Object.keys(foundation.dimensionScores) as DimensionKey[]).map((dimension) => ({
    dimension,
    label: dimensionLabels[dimension],
    baseline: foundation.dimensionScores[dimension],
    lowLabel: SPINE_ENDPOINTS[dimension].lowLabel,
    highLabel: SPINE_ENDPOINTS[dimension].highLabel,
    overlays: overlays
      .filter((moduleSnapshot) => {
        const delta = moduleSnapshot.overlayDeltas[dimension]
        return typeof delta === "number" && Math.abs(delta) >= 0.18
      })
      .map((moduleSnapshot) => ({
        slug: moduleSnapshot.slug,
        label: moduleSnapshot.shorthand ?? moduleSnapshot.title,
        value: clamp(foundation.dimensionScores[dimension] + (moduleSnapshot.overlayDeltas[dimension] ?? 0)),
      })),
  }))
}

function buildShiftPoints(moduleSnapshots: ModuleSnapshot[]) {
  const strongestShift = getStrongestShift(moduleSnapshots)
  const points: string[] = []

  if (strongestShift) {
    points.push(`${strongestShift.moduleLabel} is the clearest pressure test. It pushes you ${strongestShift.direction}.`)
  }

  for (const snapshot of moduleSnapshots) {
    const dominantLane = (snapshot.laneSummaries ?? [])
      .slice()
      .sort((a, b) => Math.abs(a.score - 4) - Math.abs(b.score - 4))
      .reverse()[0]

    if (dominantLane) {
      points.push(`${snapshot.title} is sharpest in ${dominantLane.label.toLowerCase()}. ${dominantLane.summary}`)
    }
  }

  return uniqueStrings(points).slice(0, 3)
}

function buildStabilityPoints(moduleSnapshots: ModuleSnapshot[]) {
  const points = moduleSnapshots.map((snapshot) => {
    const alignedLane = (snapshot.laneSummaries ?? [])
      .slice()
      .sort((a, b) => Math.abs(a.score - 4) - Math.abs(b.score - 4))[0]

    if (alignedLane) {
      return `${snapshot.title} adds texture without overturning the baseline. ${alignedLane.label} stays comparatively measured.`
    }

    return `${snapshot.title} layers onto the baseline without producing a major directional break.`
  })

  return uniqueStrings(points).slice(0, 3)
}

function getNearestFitGap(dimensionScores: Record<DimensionKey, number>) {
  const orderedScores = Object.values(scoreFamilies(dimensionScores)).sort((a, b) => b - a)
  return orderedScores[0] - orderedScores[1]
}

function getAverageDistanceFromCenter(dimensionScores: Record<DimensionKey, number>) {
  const distances = Object.values(dimensionScores).map((score) => Math.abs(score - 4))
  const total = distances.reduce((sum, value) => sum + value, 0)
  return total / distances.length
}

function getOrderedModuleSnapshots(profile: ProfileStore) {
  return Object.values(profile.modules)
    .filter((moduleSnapshot): moduleSnapshot is ModuleSnapshot => Boolean(moduleSnapshot))
    .sort((a, b) => a.timestamp - b.timestamp)
}

function getStrongestShift(moduleSnapshots: ModuleSnapshot[]) {
  const shifts = moduleSnapshots.flatMap((moduleSnapshot) =>
    Object.entries(moduleSnapshot.overlayDeltas ?? {})
      .filter((entry): entry is [DimensionKey, number] => typeof entry[1] === "number")
      .map(([dimension, value]) => ({
        dimension,
        value,
        moduleLabel: moduleSnapshot.shorthand ?? moduleSnapshot.title,
      })),
  )

  const strongest = shifts.sort((a, b) => Math.abs(b.value) - Math.abs(a.value))[0]
  if (!strongest || Math.abs(strongest.value) < 0.25) {
    return null
  }

  return {
    ...strongest,
    direction:
      strongest.value >= 0
        ? DIRECTION_PHRASES[strongest.dimension].positive
        : DIRECTION_PHRASES[strongest.dimension].negative,
  }
}

function getMeaningfulShiftCount(moduleSnapshots: ModuleSnapshot[]) {
  return moduleSnapshots
    .flatMap((moduleSnapshot) => Object.values(moduleSnapshot.overlayDeltas ?? {}))
    .filter((value): value is number => typeof value === "number" && Math.abs(value) >= 0.55).length
}

function getCrossDomainConflictPoints(moduleSnapshots: ModuleSnapshot[]) {
  const security = moduleSnapshots.find((snapshot) => snapshot.slug === "security")
  const technology = moduleSnapshots.find((snapshot) => snapshot.slug === "technology")
  if (!security || !technology) return []

  const points: string[] = []

  for (const dimension of Object.keys(DIRECTION_PHRASES) as DimensionKey[]) {
    const securityDelta = security.overlayDeltas?.[dimension]
    const technologyDelta = technology.overlayDeltas?.[dimension]

    if (
      typeof securityDelta === "number" &&
      typeof technologyDelta === "number" &&
      Math.sign(securityDelta) !== Math.sign(technologyDelta) &&
      Math.abs(securityDelta) >= 0.35 &&
      Math.abs(technologyDelta) >= 0.35
    ) {
      points.push(
        `Security and technology pull you in opposite directions on ${dimensionLabels[dimension].toLowerCase()}: ${security.shorthand ?? security.title} pushes ${phraseForDelta(dimension, securityDelta)}, while ${technology.shorthand ?? technology.title} pushes ${phraseForDelta(dimension, technologyDelta)}.`,
      )
    }
  }

  return uniqueStrings(points)
}

function getCardTypeTensionPoints(moduleSnapshots: ModuleSnapshot[]) {
  const points: string[] = []

  for (const snapshot of moduleSnapshots) {
    const cardTypeScores = snapshot.cardTypeScores as ModuleCardTypeScores | undefined
    const explanation = cardTypeScores?.explanation
    const decision = cardTypeScores?.decision
    if (!explanation || !decision) continue

    if (snapshot.slug === "security") {
      if (explanation.activism - decision.activism >= 0.75) {
        points.push(
          `${snapshot.title} explains cases through harder pressure than you endorse once the decision costs are explicit.`,
        )
      }

      if (decision.legitimacy - explanation.legitimacy >= 0.75) {
        points.push(
          `${snapshot.title} becomes more legitimacy-sensitive when the question shifts from diagnosis to decision.`,
        )
      }
    }

    if (snapshot.slug === "technology") {
      if (explanation.control - decision.control >= 0.75) {
        points.push(
          `${snapshot.title} reads the domain in more control-heavy terms than you ultimately endorse when choosing policy.`,
        )
      }

      if (decision.governance - explanation.governance >= 0.75) {
        points.push(
          `${snapshot.title} becomes more coordination-minded when the question turns from explanation to policy choice.`,
        )
      }

      if (decision.safety - explanation.safety >= 0.75) {
        points.push(
          `${snapshot.title} becomes more safety-constrained on decision cards than on explanation cards.`,
        )
      }
    }
  }

  return uniqueStrings(points)
}

function phraseForDelta(dimension: DimensionKey, value: number) {
  return value >= 0 ? DIRECTION_PHRASES[dimension].positive : DIRECTION_PHRASES[dimension].negative
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values))
}

function clamp(value: number) {
  return Math.max(1, Math.min(7, Number(value.toFixed(2))))
}
