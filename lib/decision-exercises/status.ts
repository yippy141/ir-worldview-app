import type { Decision } from "./content"

/** Escape responses describe missing decisions/reasons, never policy or rationale equality. */
export function comparisonStatus(first: Decision, second: Decision) {
  const decisions = first.option === "defer" && second.option === "defer"
    ? "Both decisions withheld"
    : first.option === "defer" ? "Original decision withheld"
      : second.option === "defer" ? "Revised decision withheld"
        : first.option === second.option ? "Arrangement unchanged" : "Arrangement changed"
  const reasons = first.reason === "none" && second.reason === "none"
    ? "Neither reason expressed by the offered choices"
    : first.reason === "none" ? "Original reason unexpressed"
      : second.reason === "none" ? "Revised reason unexpressed"
        : first.reason === second.reason ? "Same stated reason" : "Different stated reasons"
  return { decisions, reasons }
}
