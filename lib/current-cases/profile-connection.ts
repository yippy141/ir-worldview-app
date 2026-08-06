import type {
  CompletedCurrentCaseResponse,
  CurrentCase,
  CurrentCaseFoundationConnection,
} from "@/lib/current-cases/types"
import type { FoundationSnapshot } from "@/lib/profile-store"

/**
 * Current Case records do not yet carry a reviewed, versioned mapping to the
 * Foundation. Keep the existing function boundary for a future authored
 * contract, but do not infer a connection from the legacy Atlas matcher.
 */
export function compareCompletedCaseWithFoundation(
  _record: Pick<
    CurrentCase,
    "id" | "slug" | "version" | "decision" | "worldviewReadings" | "reasoningTags"
  >,
  response: CompletedCurrentCaseResponse,
  _foundation: FoundationSnapshot | null,
): CurrentCaseFoundationConnection {
  return {
    kind: "unavailable",
    unavailableReason: "missing-authored-mapping",
    selectedOptionId: response.selectedOptionId,
  }
}
