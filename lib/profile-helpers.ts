import { dimensionLabels } from "@/lib/quiz-schema"
import { assessFoundationNarrative } from "@/lib/narrative/foundation"
import type { ModuleSlug } from "@/lib/modules/types"
import type { ModuleSnapshot, ProfileStore } from "@/lib/profile-store"
import type { ChoiceCardType, DimensionKey } from "@/lib/types"

export type ProfileState =
  | "lowDifferentiation"
  | "stableModeration"
  | "sharplyDifferentiatedBaseline"
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

export type ProfileShift = {
  dimension: DimensionKey
  value: number
  moduleLabel: string
  direction: string
}

export type ProfileNarrativeSignals = {
  moduleSnapshots: ModuleSnapshot[]
  strongestShift: ProfileShift | null
  crossDomainConflicts: string[]
  cardTypeTensions: string[]
  totalTensions: string[]
  meaningfulShiftCount: number
}

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

  const foundationAssessment = assessFoundationNarrative(foundation.dimensionScores)
  const narrativeSignals = getProfileNarrativeSignals(profile)
  const {
    moduleSnapshots,
    strongestShift,
    crossDomainConflicts,
    totalTensions,
    meaningfulShiftCount,
  } = narrativeSignals

  if (moduleSnapshots.length === 0) {
    if (foundationAssessment.state === "lowDifferentiation") {
      return {
        state: "lowDifferentiation",
        stateLabel: "Overlap baseline",
        synthesis: `${foundation.familyLabel} is the closest shorthand, but the baseline still reads as overlap.`,
        summary:
          "The Foundation is not sorting this profile into one firm camp yet. The honest read is overlap, with the tradition label serving as a starting point rather than a fixed box.",
        changedMost: "No focus-area overlays yet. The Foundation remains the anchor.",
        panelTitle: "Overlap mode",
        panelIntro:
          "The main payoff here is knowing that the baseline remains relatively unsorted until a harder pressure test sharpens it, if it does at all.",
        points: [
          "The Foundation stays closest to one tradition, but the separation is narrow.",
          "No saved module overlays yet exist to tell you whether a domain-specific stress test sharpens the profile.",
          "The strongest signal right now is overlap and moderation rather than doctrinal sharpness.",
        ],
      }
    }

    if (foundationAssessment.state === "sharplyDifferentiated") {
      return {
        state: "sharplyDifferentiatedBaseline",
        stateLabel: "Sharply differentiated baseline",
        synthesis: `Your baseline already reads clearly ${foundation.familyLabel} before any module is added.`,
        summary:
          "The Foundation already produces a clearer baseline than an overlap result. Modules may complicate it later, but they are not needed to make the core read intelligible.",
        changedMost: "No focus-area overlays yet. The Foundation remains the anchor.",
        panelTitle: "Baseline mode",
        panelIntro:
          "The important point here is not that the model found a total theory of everything. It is that the Foundation is already doing substantial interpretive work before any module pressure is added.",
        points: [
          "The baseline dimensions point in a more mutually reinforcing direction than a flat profile does.",
          "The result is still shorthand, but it is a clearer shorthand than a narrow edge between traditions.",
          "Modules now matter most as pressure tests: they can reinforce, qualify, or complicate an already coherent baseline.",
        ],
      }
    }

  return {
      state: "stableModeration",
      stateLabel: "Baseline only",
      synthesis: `Your baseline is closest to ${foundation.familyLabel}, with no module pressure applied yet.`,
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

  const changedMost = strongestShift
    ? `What shifts most: ${strongestShift.moduleLabel} pushes you ${strongestShift.direction}.`
    : "What shifts most: the completed modules mostly stay close to your Foundation baseline."

  if (totalTensions.length >= 2 || crossDomainConflicts.length >= 1) {
    return {
      state: "trueTension",
      stateLabel: "True tension",
      synthesis: `Your baseline still reads ${foundation.familyLabel}, but the saved modules pull it in different directions.`,
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
      synthesis: `Your baseline stays closest to ${foundation.familyLabel}, but ${strongestModule.toLowerCase()} changes the emphasis.`,
      summary:
        "The baseline is still recognizable, but at least one module produces a consistent directional shift rather than just a little noise around the center.",
      changedMost,
      panelTitle: "Shift mode",
      panelIntro:
        "The main payoff is seeing which issue domain changes your emphasis most while still leaving the baseline recognizable.",
      points: buildShiftPoints(moduleSnapshots),
    }
  }

  if (foundationAssessment.state === "lowDifferentiation") {
    return {
      state: "lowDifferentiation",
      stateLabel: "Overlap across layers",
      synthesis: "Your profile still reads as overlap more than one settled camp.",
      summary:
        "The model is not seeing a sharply sorted profile here. The result is better read as an overlapping pattern with stable tendencies than as a crisp worldview box.",
      changedMost,
      panelTitle: "Overlap mode",
      panelIntro:
        "The honest takeaway is that your profile stays relatively unsorted even after the available overlays.",
      points: [
        "The gap between the closest Foundation traditions remains narrow.",
        "The completed module overlays do not sharply separate the profile into a cleaner box.",
        "What is stable here is moderation and overlap rather than doctrinal sharpness.",
      ],
    }
  }

  if (foundationAssessment.state === "sharplyDifferentiated") {
    return {
      state: "sharplyDifferentiatedBaseline",
      stateLabel: "Sharply differentiated baseline",
      synthesis: `Your ${foundation.familyLabel} baseline stays recognizable even after the saved modules.`,
      summary:
        "The Foundation starts from a clearer center of gravity than an overlap result, and the completed modules add texture without dissolving that baseline into a flat midpoint blend.",
      changedMost,
      panelTitle: "Baseline mode",
      panelIntro:
        "The important signal here is not that nothing changes. It is that the baseline stays recognizably itself even after domain pressure is applied.",
      points: buildStabilityPoints(moduleSnapshots),
    }
  }

  return {
    state: "stableModeration",
    stateLabel: "Broadly stable",
    synthesis: `Your ${foundation.familyLabel} baseline stays broadly steady across the saved modules.`,
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

export function getOrderedModuleSnapshots(profile: ProfileStore) {
  return Object.values(profile.modules)
    .filter((moduleSnapshot): moduleSnapshot is ModuleSnapshot => Boolean(moduleSnapshot))
    .sort((a, b) => a.timestamp - b.timestamp)
}

export function getProfileNarrativeSignals(profile: ProfileStore): ProfileNarrativeSignals {
  const moduleSnapshots = getOrderedModuleSnapshots(profile)
  const crossDomainConflicts = getCrossDomainConflictPoints(moduleSnapshots)
  const cardTypeTensions = getCardTypeTensionPoints(moduleSnapshots)

  return {
    moduleSnapshots,
    strongestShift: getStrongestShift(moduleSnapshots),
    crossDomainConflicts,
    cardTypeTensions,
    totalTensions: [...crossDomainConflicts, ...cardTypeTensions],
    meaningfulShiftCount: getMeaningfulShiftCount(moduleSnapshots),
  }
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

function getStrongestShift(moduleSnapshots: ModuleSnapshot[]): ProfileShift | null {
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
