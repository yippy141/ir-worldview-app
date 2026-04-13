import { assessFoundationNarrative } from "@/lib/narrative/foundation"
import {
  buildProfileAssessment,
  getProfileNarrativeSignals,
  type ProfileAssessment,
} from "@/lib/profile-helpers"
import type { ModuleSnapshot, ProfileStore } from "@/lib/profile-store"
import type { FamilyKey } from "@/lib/types"
import { familyLabel } from "@/lib/worldview-config"

export type ProfileNarrativeSection = {
  title: string
  text: string
}

export type ProfileNarrative = {
  summary: string
  sections: ProfileNarrativeSection[]
}

const PROFILE_PRACTICE_FRAMES = {
  realist:
    "The profile keeps returning to constraint, leverage, and credibility before it grants much explanatory weight to reassurance or process alone.",
  institutionalist:
    "The profile keeps returning to institutional design, credible commitment, and whether coordination changes incentives rather than merely decorating them.",
  constructivist:
    "The profile keeps returning to legitimacy, framing, and historical relationship before it treats the material facts as self-explanatory.",
  criticalPoliticalEconomy:
    "The profile keeps returning to dependence, structural advantage, and who writes the rules of the game before it accepts surface descriptions at face value.",
} as const

export function buildProfileNarrative(
  profile: ProfileStore,
  assessment: ProfileAssessment = buildProfileAssessment(profile),
): ProfileNarrative {
  const foundation = profile.foundation

  if (!foundation) {
    return {
      summary: "Complete the Foundation first to build an integrated profile.",
      sections: [],
    }
  }

  const foundationAssessment = assessFoundationNarrative(foundation.dimensionScores)
  const signals = getProfileNarrativeSignals(profile)
  const moduleSummaries = signals.moduleSnapshots.slice(0, 2).map((snapshot) =>
    buildModuleSummary(snapshot, signals.cardTypeTensions),
  )
  const strongestShiftText = signals.strongestShift
    ? `${signals.strongestShift.moduleLabel} pushes the profile ${signals.strongestShift.direction}.`
    : "No saved overlay is producing a major directional break from the baseline."

  return {
    summary: assessment.summary,
    sections: [
      {
        title: "Integrated read",
        text: buildIntegratedRead(assessment, foundation.familyLabel, foundationAssessment.state),
      },
      {
        title: "How your modules changed the picture",
        text: buildModuleChangeText(moduleSummaries, strongestShiftText),
      },
      {
        title: assessment.state === "trueTension" ? "Cross-domain tensions" : "Stable patterns",
        text: buildStabilityOrTensionText(assessment, signals.totalTensions),
      },
      {
        title: "So what this usually means",
        text: buildPracticeText(
          foundation.familyKey,
          assessment.state,
          signals.strongestShift?.moduleLabel,
        ),
      },
      {
        title: "What to probe next",
        text: buildProbeNextText(
          signals.moduleSnapshots,
          assessment,
          familyLabel(foundation.runnerUpKey),
        ),
      },
    ],
  }
}

function buildIntegratedRead(
  assessment: ProfileAssessment,
  familyLabelValue: string,
  foundationState: ReturnType<typeof assessFoundationNarrative>["state"],
) {
  if (assessment.state === "trueTension") {
    return `${familyLabelValue} still anchors the profile, but the integrated payoff is not a cleaner box. The saved overlays pull parts of the profile in meaningfully different directions, so the result now reads less like a single steady doctrine and more like a map of where your reasoning changes across domains or between explanation and decision.`
  }

  if (assessment.state === "domainConditionedShift") {
    return `${familyLabelValue} still anchors the profile, yet one focus-area overlay now changes the emphasis consistently enough to matter. The useful read is not that the Foundation was wrong. It is that the baseline travels unevenly once the questions become domain-specific.`
  }

  if (assessment.state === "lowDifferentiation") {
    return `The integrated profile is still better read as overlap than as a sharply sorted camp. Even after the saved overlays are layered in, the center of gravity remains modest and overlapping rather than tightly doctrinal. The value is in naming that overlap honestly and watching whether later pressure tests sharpen it.`
  }

  if (assessment.state === "sharplyDifferentiatedBaseline" || foundationState === "sharplyDifferentiated") {
    return `The integrated profile starts from a clearer baseline than a nearest-fit result and largely keeps that shape once the saved overlays are added. The modules matter as pressure tests and qualifiers, but they do not dissolve the core center of gravity into a flat midpoint blend.`
  }

  return `${familyLabelValue} remains the best shorthand for the integrated profile, but the profile still reads as moderate rather than doctrinally pure. The saved overlays add texture and context without changing the fact that the same broad orientation survives across the layers you have completed.`
}

function buildModuleChangeText(moduleSummaries: string[], strongestShiftText: string) {
  if (moduleSummaries.length === 0) {
    return "No focus-area module is saved yet, so the integrated picture is still mostly the Foundation viewed on its own. The next real question is not which label sounds best, but whether Security or Technology consistently sharpens, softens, or complicates the baseline."
  }

  return `${strongestShiftText} ${moduleSummaries.join(" ")}`
}

function buildStabilityOrTensionText(
  assessment: ProfileAssessment,
  totalTensions: string[],
) {
  if (assessment.state === "trueTension") {
    const firstExample = totalTensions[0] ?? assessment.points[0]
    const secondExample = totalTensions[1]
    const exampleText = secondExample ? `${firstExample} ${secondExample}` : firstExample
    return `The integrated profile is most useful when it names the points that do not collapse into one neat line. ${exampleText} That does not mean the model has failed. It means the domains are surfacing a substantive tension that a single summary label would hide.`
  }

  if (assessment.state === "domainConditionedShift") {
    return `${assessment.changedMost} The baseline remains recognizable, but the completed overlays show that one issue domain predictably changes the weighting of the profile. That is more informative than minor noise around the midpoint because it tells you where your baseline is most contingent.`
  }

  if (assessment.state === "lowDifferentiation") {
    return "The stable pattern here is not doctrinal sharpness. It is that the profile remains overlapping even after the saved overlays are added. The completed layers provide context, but they do not yet force a cleaner split between neighboring traditions."
  }

  if (assessment.state === "sharplyDifferentiatedBaseline") {
    return "The stable pattern here is that the baseline keeps its shape under pressure. The saved overlays still matter, but they mostly reinforce or qualify the existing center of gravity rather than pushing the profile into a qualitatively different mode."
  }

  return "The stable pattern here is that the same broad orientation keeps surviving once pressure is applied in different domains. The completed overlays add detail and emphasis, but they do not generate the kind of sharp conflict that would require a different integrated read."
}

function buildPracticeText(
  familyKey: FamilyKey,
  state: ProfileAssessment["state"],
  strongestModuleLabel?: string,
) {
  const practiceFrame = PROFILE_PRACTICE_FRAMES[familyKey]

  if (state === "trueTension" && strongestModuleLabel) {
    return `${practiceFrame} The main practical complication is that ${strongestModuleLabel} changes that read enough to create a real exception by domain. In other words, the profile is still patterned, but not in a way that should be flattened into a single all-purpose reflex.`
  }

  if (state === "domainConditionedShift" && strongestModuleLabel) {
    return `${practiceFrame} The clearest exception appears under ${strongestModuleLabel} pressure, which means the baseline is still useful but should not be treated as domain-invariant. The profile remains anchored, yet not every issue gets read through the same balance of considerations.`
  }

  if (state === "lowDifferentiation") {
    return `${practiceFrame} The practical upshot is not that one theory crowds out the others. It is that the profile keeps several neighboring arguments live at once and then sorts between them issue by issue.`
  }

  if (state === "sharplyDifferentiatedBaseline") {
    return `${practiceFrame} Compared with a flatter profile, this one is more likely to keep returning to the same core set of considerations across issues unless a later stress test creates a real contradiction.`
  }

  return `${practiceFrame} The practical upshot is a stable but not rigid baseline: one that gives you a clear first read without pretending that every issue reduces to exactly the same logic.`
}

function buildProbeNextText(
  moduleSnapshots: ModuleSnapshot[],
  assessment: ProfileAssessment,
  runnerUpLabel: string,
) {
  if (moduleSnapshots.length === 0) {
    return "The next useful probe is a focus-area module. Security is the sharper test of coercion, alliances, and legitimacy under pressure. Technology is the sharper test of control, dependence, and governance. Either one can show whether the baseline sharpens or keeps its overlap once the issue domain gets harder."
  }

  if (moduleSnapshots.length === 1) {
    return "The next useful probe is the remaining focus-area module. One domain can show a meaningful shift, but it cannot yet tell you whether that shift generalizes or whether the profile changes direction once a different issue structure is applied."
  }

  if (assessment.state === "trueTension") {
    return "The next probe is not to smooth the tension away. It is to inspect which domain logic you trust when the saved overlays disagree, then compare that judgment against the evidence logs rather than against the desire for a cleaner label."
  }

  if (assessment.state === "lowDifferentiation") {
    return `The next probe is whether a harder Foundation retake or a fresh issue case consistently breaks the overlap. If not, overlapping reasoning may simply be the honest result. If it does, ${runnerUpLabel} is the most useful neighboring profile to compare against.`
  }

  return `The next probe is a neighboring comparison in your own head rather than a new taxonomy feature: ask what would have to change for ${runnerUpLabel} to become the better shorthand. That question is usually more informative than trying to force extra certainty out of a result that is already working as a profile.`
}

function buildModuleSummary(snapshot: ModuleSnapshot, cardTypeTensions: string[]) {
  const dominantLane = snapshot.laneSummaries
    .slice()
    .sort((a, b) => Math.abs(b.score - 4) - Math.abs(a.score - 4))[0]
  const cardTypeTension = cardTypeTensions.find((point) => point.startsWith(snapshot.title))

  if (!dominantLane) {
    return `${snapshot.title} has been completed, but the current read is less about one dominant lane than about the overall issue overlay.`
  }

  const cardTypeSentence = cardTypeTension
    ? " It also shows a real explanation-versus-decision split rather than a single undifferentiated instinct."
    : ""

  return `${snapshot.title} pulls hardest through ${dominantLane.label.toLowerCase()}. ${dominantLane.summary}${cardTypeSentence}`
}
