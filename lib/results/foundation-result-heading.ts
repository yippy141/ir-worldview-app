import type { FoundationQuestionSet, FoundationTier } from "@/lib/types"

export type FoundationResultHeadingInput = {
  resultTier: FoundationTier
  questionSet: FoundationQuestionSet | null
  legacy: boolean
  lowDifferentiation: boolean
  primaryLabel: string
  runnerUpLabel: string
}

export type FoundationResultHeading = {
  eyebrow: string
  title: string
  lead: string
}

export function buildFoundationResultHeading({
  resultTier,
  questionSet,
  legacy,
  lowDifferentiation,
  primaryLabel,
  runnerUpLabel,
}: FoundationResultHeadingInput): FoundationResultHeading {
  const formLabel = foundationFormLabel(questionSet, resultTier)

  if (legacy) {
    return {
      eyebrow: "Issued Foundation result from an earlier payload",
      title: `Registered legacy Foundation read: ${primaryLabel}`,
      lead:
        `This link preserves its issued reading. Its exact completed-form tuple is unavailable, so this page does not reconstruct calibrated contribution claims from the score summary.`,
    }
  }

  if (lowDifferentiation && resultTier === "core") {
    return {
      eyebrow: `Initial Foundation read from the ${formLabel}`,
      title: `An initial Foundation read: ${primaryLabel} and ${runnerUpLabel}`,
      lead:
        `Both readings remain live in the current item set. The registered reading below summarizes the model output while targeted follow-up items test the boundary between them.`,
    }
  }

  if (lowDifferentiation) {
    return {
      eyebrow: `Foundation result from the ${formLabel}`,
      title: `${primaryLabel} and ${runnerUpLabel} remain close`,
      lead:
        `The current item set does not give either reading a clear modeled lead. The registered reading below is an interpretive name for this nearby pair.`,
    }
  }

  return {
    eyebrow: `Foundation result from the ${formLabel}`,
    title: `${primaryLabel} leads this Foundation read`,
    lead:
      `The lead is clearer within the current item set. ${runnerUpLabel} remains the nearest alternative. This is a model result. It does not establish a durable trait.`,
  }
}

function foundationFormLabel(
  questionSet: FoundationQuestionSet | null,
  resultTier: FoundationTier,
) {
  if (questionSet === "core" || resultTier === "core") return "14-item core form"
  if (questionSet === "targetedExtended") return "targeted refinement form"
  if (questionSet === "fullExtended") return "full extended form"
  return "legacy Foundation form"
}
