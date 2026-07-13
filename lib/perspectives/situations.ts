import type { PerspectiveScenario } from "@/lib/perspectives/types"

// Every pack mirrors the same three situations. These labels name the shared
// situation family so run screens and results can reference it consistently.
const SITUATION_LABELS: Record<string, string> = {
  "abrupt-security-shock": "Security shock",
  "public-authority-under-pressure": "Public authority under pressure",
  "strategic-economic-exposure": "Economic exposure",
}

export function situationLabel(scenario: PerspectiveScenario): string {
  return SITUATION_LABELS[scenario.mirrorPairId ?? ""] ?? "Scenario"
}
