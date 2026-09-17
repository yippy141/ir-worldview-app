import type { FoundationContributionRow } from "@/lib/results/foundation-contributions"
import type { DimensionKey } from "@/lib/types"

/** Contribution terms closer than this are reported as equal. */
export const CONTRIBUTION_TIE_EPSILON = 1e-6

export type FoundationContributionCopyInput = {
  rows: FoundationContributionRow[]
  /** True when the link predates the dimension-by-dimension comparison. */
  legacy: boolean
  /** True when the gap between the two rounded family scores is under the calibrated threshold. */
  lowDifferentiation: boolean
  primaryLabel: string
  runnerUpLabel: string
  dimensionLabel: (dimension: DimensionKey) => string
}

export type FoundationContributionCopyState =
  | "legacy"
  | "unavailable"
  | "leading"
  | "tied-leading"
  | "no-positive"
  | "no-advantage"

export type FoundationContributionCopy = {
  state: FoundationContributionCopyState
  /** The first paragraph of chapter 02. */
  lead: string
  /** The note shown in place of the rows when they cannot be shown. */
  unavailableNote: string | null
}

export function joinDimensionLabels(labels: string[]): string {
  if (labels.length <= 1) return labels[0] ?? ""
  return `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`
}

/**
 * Chapter 02 copy for the Foundation result. Every sentence follows the rows:
 * a signed term is this dimension's share of the primary-minus-runner-up
 * comparison (standardized position times the difference in family weights).
 * A positive term means the answers on that dimension counted for the primary
 * reading more than for the runner-up. It says nothing about the raw answer,
 * about the scale midpoint, or about which beliefs the reader holds.
 */
export function buildFoundationContributionCopy(
  input: FoundationContributionCopyInput,
): FoundationContributionCopy {
  const { rows, primaryLabel, runnerUpLabel, dimensionLabel } = input

  if (input.legacy) {
    return {
      state: "legacy",
      lead: "This link predates the dimension-by-dimension comparison, so those terms cannot be shown. The positions above still apply.",
      unavailableNote: "The dimension-by-dimension terms cannot be shown for this link. The positions above still apply.",
    }
  }

  if (rows.length === 0) {
    return {
      state: "unavailable",
      lead: "The dimension-by-dimension terms are not available for this result. The positions above still apply.",
      unavailableNote: "The dimension-by-dimension terms are not available for this result.",
    }
  }

  const contributions = rows.map((row) => row.signedContribution)
  const maxContribution = Math.max(...contributions)
  const minContribution = Math.min(...contributions)
  const lowest = rows.filter((row) => Math.abs(row.signedContribution - minContribution) < CONTRIBUTION_TIE_EPSILON)

  // Depends on a negative row; names where the runner-up gets its support.
  // The closeness clause depends on lowDifferentiation.
  const opposing = minContribution < 0
    ? ` On ${joinDimensionLabels(lowest.map(row => dimensionLabel(row.dimension)))} they made the largest opposing ${lowest.length > 1 ? "contributions" : "contribution"}; that is where ${runnerUpLabel} gets its support${input.lowDifferentiation ? ", and why it stayed close" : ""}.`
    : ""

  if (maxContribution <= 0 && minContribution >= 0) {
    // Every term is zero. The rows say nothing about where the answers sat.
    return {
      state: "no-advantage",
      lead: "These dimension terms give neither reading an advantage.",
      unavailableNote: null,
    }
  }

  if (maxContribution <= 0) {
    // Nothing counted for the primary reading. The rows alone do not show
    // why it leads, so the copy says only what they show.
    return {
      state: "no-positive",
      lead: `No dimension counted for ${primaryLabel} over ${runnerUpLabel}.${opposing}`,
      unavailableNote: null,
    }
  }

  const leading = rows.filter(
    (row) => Math.abs(row.signedContribution - maxContribution) < CONTRIBUTION_TIE_EPSILON,
  )
  if (leading.length > 1) {
    return {
      state: "tied-leading",
      lead: `Your answers on ${joinDimensionLabels(leading.map((row) => dimensionLabel(row.dimension)))} made the largest positive contributions, in equal measure: there they counted for ${primaryLabel} more than for ${runnerUpLabel}.${opposing}`,
      unavailableNote: null,
    }
  }

  return {
    state: "leading",
    lead: `Your answers on ${dimensionLabel(leading[0].dimension)} made the largest positive contribution: there they counted for ${primaryLabel} more than for ${runnerUpLabel}.${opposing}`,
    unavailableNote: null,
  }
}
