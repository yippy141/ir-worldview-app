import { dimensionLabels } from "@/lib/quiz-schema"
import type { AiArchetypeKey } from "@/lib/ai-governance-types"
import { assessFoundationNarrative } from "@/lib/narrative/foundation"
import type { ModuleSlug } from "@/lib/modules/types"
import type { ModuleSnapshot, ProfileStore } from "@/lib/profile-store"
import type { ChoiceCardType, DimensionKey, FamilyKey } from "@/lib/types"

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

export type ProfileSynthesisLayer = {
  key: "foundation" | "security" | "technology" | "ai"
  label: string
  present: boolean
}

export type ProfileSynthesisLite = {
  layers: ProfileSynthesisLayer[]
  stableAcross: string
  shiftsUnderPressure: string
  reasoningStyle: string
}

export type ProfileTriad = {
  steady: string
  shifted: string
  tension: string | null
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

const MOSAIC_ANCHOR_LINES: Record<FamilyKey, string> = {
  realist:
    "Across the saved layers, you keep coming back to power, leverage, and whether commitments hold under pressure.",
  institutionalist:
    "Across the saved layers, you keep coming back to rules, coordination, and whether institutions can change behavior.",
  constructivist:
    "Across the saved layers, you keep coming back to legitimacy, framing, and how actors interpret the situation.",
  criticalPoliticalEconomy:
    "Across the saved layers, you keep coming back to dependence, concentration, and who gets to set the terms.",
}

const REASONING_STYLE_LINES: Record<FamilyKey, string> = {
  realist:
    "You usually start with leverage, constraint, and whether commitments survive real pressure.",
  institutionalist:
    "You usually start with rules, incentives, and whether coordination can survive stress.",
  constructivist:
    "You usually start with legitimacy, framing, and how actors define what the case means.",
  criticalPoliticalEconomy:
    "You usually start with dependence, concentration, and who absorbs the costs.",
}

const ASSESSMENT_STYLE_LINES: Record<ProfileState, string> = {
  lowDifferentiation:
    "You keep neighboring arguments live and sort between them case by case.",
  stableModeration:
    "You stay steady across domains without pretending every issue is identical.",
  sharplyDifferentiatedBaseline:
    "You use a clear anchor across issues and treat exceptions as real but limited.",
  domainConditionedShift:
    "You reason from a clear baseline, but you change emphasis when the case becomes more concrete.",
  trueTension:
    "You do not force one doctrine across every issue. You keep the baseline, then revise it when domain pressure bites.",
}

const AI_STABLE_LINES: Record<AiArchetypeKey, string> = {
  precautionarySteward:
    "In AI, that same thread shows up in a preference for thresholds, evaluation gates, and slower scaling under uncertainty.",
  strategicCompetitor:
    "In AI, that same thread shows up in a focus on rivalry, enforcement, and state capability.",
  coordinationArchitect:
    "In AI, that same thread shows up in a focus on shared standards, verification, and rules that can last.",
  democraticGuardrailist:
    "In AI, that same thread shows up in a focus on public legitimacy, rights, and visible accountability.",
  stateCapacityBuilder:
    "In AI, that same thread shows up in a focus on public capacity, procurement, and whether institutions can actually govern.",
  openEcosystemBuilder:
    "In AI, that same thread shows up in a focus on openness, anti-concentration, and plural access.",
}

const AI_PRESSURE_LINES: Record<AiArchetypeKey, string> = {
  precautionarySteward:
    "The AI layer adds pressure toward caution and a higher burden of proof before deployment widens.",
  strategicCompetitor:
    "The AI layer adds pressure toward rivalry, security institutions, and harder state tools.",
  coordinationArchitect:
    "The AI layer adds pressure toward verification and shared rules, even where rivalry makes them hard to sustain.",
  democraticGuardrailist:
    "The AI layer adds pressure toward public legitimacy and rights when speed or secrecy starts to dominate.",
  stateCapacityBuilder:
    "The AI layer adds pressure toward state capacity and implementation, not just cleaner principle statements.",
  openEcosystemBuilder:
    "The AI layer adds pressure toward openness and anti-concentration, even where control instincts stay strong.",
}

const AI_REASONING_STYLE_LINES: Record<AiArchetypeKey, string> = {
  precautionarySteward:
    "When the stakes look hard to reverse, you raise the burden of proof.",
  strategicCompetitor:
    "When a field looks strategic, you move quickly to capacity and advantage.",
  coordinationArchitect:
    "When unilateral control looks thin, you look for shared rules that can stick.",
  democraticGuardrailist:
    "When power expands quickly, you ask how it stays publicly accountable.",
  stateCapacityBuilder:
    "When a policy sounds good on paper, you ask whether institutions can carry it out.",
  openEcosystemBuilder:
    "When control concentrates, you ask who gets excluded and who sets the terms.",
}

export function buildIntegratedHeadline(profile: ProfileStore): string {
  const assessment = buildProfileAssessment(profile)
  return assessment.synthesis
}

export function buildCrossDomainTensions(profile: ProfileStore): string[] {
  const assessment = buildProfileAssessment(profile)
  return assessment.state === "trueTension" ? assessment.points : []
}

export function buildProfileSynthesisLite(profile: ProfileStore): ProfileSynthesisLite {
  const foundation = profile.foundation
  const moduleSnapshots = getOrderedModuleSnapshots(profile)
  const aiSnapshot = profile.aiGovernance ?? null
  const layers: ProfileSynthesisLayer[] = [
    { key: "foundation", label: "Foundation", present: Boolean(foundation) },
    {
      key: "security",
      label: "Security",
      present: moduleSnapshots.some((snapshot) => snapshot.slug === "security"),
    },
    {
      key: "technology",
      label: "Technology",
      present: moduleSnapshots.some((snapshot) => snapshot.slug === "technology"),
    },
    { key: "ai", label: "AI", present: Boolean(aiSnapshot) },
  ]

  if (!foundation) {
    return {
      layers,
      stableAcross:
        "Complete the Foundation first. That baseline is what lets the profile read the other layers without collapsing them into one score.",
      shiftsUnderPressure:
        "Pressure shifts only become legible once the Foundation and at least one overlay are saved.",
      reasoningStyle:
        "The profile is designed to name a pattern of reasoning, not to infer one before the core baseline exists.",
    }
  }

  const assessment = buildProfileAssessment(profile)
  const signals = getProfileNarrativeSignals(profile)

  return {
    layers,
    stableAcross: joinProfileSentences(
      MOSAIC_ANCHOR_LINES[foundation.familyKey],
      getModuleContinuityLine(assessment, moduleSnapshots),
      aiSnapshot
        ? AI_STABLE_LINES[aiSnapshot.archetypeKey]
        : "The AI layer is not saved yet, so the governance side of the mosaic is still open.",
    ),
    shiftsUnderPressure: buildPressureShiftText(assessment, signals, aiSnapshot?.archetypeKey),
    reasoningStyle: joinProfileSentences(
      REASONING_STYLE_LINES[foundation.familyKey],
      ASSESSMENT_STYLE_LINES[assessment.state],
      aiSnapshot ? AI_REASONING_STYLE_LINES[aiSnapshot.archetypeKey] : "",
    ),
  }
}

export function buildProfileTriad(profile: ProfileStore): ProfileTriad {
  const foundation = profile.foundation
  if (!foundation) {
    return {
      steady:
        "Complete the Foundation first so the profile has a baseline to read against.",
      shifted:
        "Pressure shifts only appear once the Foundation and at least one overlay are saved.",
      tension: null,
    }
  }

  const assessment = buildProfileAssessment(profile)
  const signals = getProfileNarrativeSignals(profile)

  const steady = MOSAIC_ANCHOR_LINES[foundation.familyKey]

  let shifted: string
  if (signals.strongestShift) {
    shifted = `${signals.strongestShift.moduleLabel} pushes the profile ${signals.strongestShift.direction}.`
  } else if (signals.moduleSnapshots.length > 0) {
    shifted =
      "The saved overlays move the baseline more in texture than in direction."
  } else {
    shifted =
      "No focus-area overlay is saved yet, so the Foundation is still doing the interpretive work on its own."
  }

  let tension: string | null = null
  if (signals.totalTensions.length > 0) {
    tension = signals.totalTensions[0] ?? null
  } else if (assessment.state === "lowDifferentiation" && signals.moduleSnapshots.length > 0) {
    tension =
      "The closest traditions still sit close together. The label is a starting point, not a fixed box."
  } else if (assessment.state === "domainConditionedShift" && signals.strongestShift) {
    tension = `One domain — ${signals.strongestShift.moduleLabel.toLowerCase()} — changes which costs you weight first while the baseline stays recognizable.`
  }

  return { steady, shifted, tension }
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

function getModuleContinuityLine(
  assessment: ProfileAssessment,
  moduleSnapshots: ModuleSnapshot[],
) {
  const hasSecurity = moduleSnapshots.some((snapshot) => snapshot.slug === "security")
  const hasTechnology = moduleSnapshots.some((snapshot) => snapshot.slug === "technology")

  if (!hasSecurity && !hasTechnology) {
    return "No focus-area overlay is saved yet, so the Foundation still carries most of the weight."
  }

  if (hasSecurity && hasTechnology) {
    if (assessment.state === "trueTension") {
      return "Security and Technology do not erase that anchor, but they carry it into different tradeoffs."
    }

    if (assessment.state === "domainConditionedShift") {
      return "Security and Technology both keep the baseline in view, even where one domain pulls harder."
    }

    return "Security and Technology mostly reinforce that same baseline rather than replacing it."
  }

  const savedModule = moduleSnapshots[0]
  return `${savedModule.title} works more like a pressure test of the baseline than a separate worldview.`
}

function buildPressureShiftText(
  assessment: ProfileAssessment,
  signals: ProfileNarrativeSignals,
  aiArchetypeKey: AiArchetypeKey | null | undefined,
) {
  const parts: string[] = []

  if (signals.strongestShift) {
    parts.push(
      `${signals.strongestShift.moduleLabel} is the clearest pressure point. It pushes you ${signals.strongestShift.direction}.`,
    )
  } else if (signals.moduleSnapshots.length > 0) {
    parts.push("No saved IR overlay creates one dominant break from the Foundation.")
  } else {
    parts.push("No strong IR pressure shift is visible yet because the focus-area overlays are still missing.")
  }

  if (assessment.state === "trueTension") {
    parts.push("Security and Technology do not pull the same way once the cases get harder.")
  } else if (assessment.state === "domainConditionedShift") {
    parts.push("The baseline survives, but one issue domain clearly changes which cost you weight first.")
  } else if (assessment.state === "lowDifferentiation") {
    parts.push("Even under pressure, the profile stays more mixed than fixed.")
  } else if (signals.moduleSnapshots.length > 0) {
    parts.push("The saved IR overlays change emphasis more than they change direction.")
  }

  if (aiArchetypeKey) {
    parts.push(AI_PRESSURE_LINES[aiArchetypeKey])
  }

  return joinProfileSentences(...parts)
}

function joinProfileSentences(...parts: string[]) {
  return parts
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ")
}
