import type { NormativeModifier, StrategyModifier } from "@/lib/types"

/**
 * Plain-language, one-line glosses for the interpretive modifier labels.
 *
 * These exist so that every modifier chip can carry a legible explanation on
 * first encounter, and so that copy edits and future translations live in a
 * single source of truth rather than being duplicated across pages.
 *
 * Phrasing describes a tendency in the reader's answers, not a fixed type.
 * Do not rename the keys: they mirror the scoring labels in `lib/types.ts`.
 */
export const strategyModifierGlosses: Record<StrategyModifier, string> = {
  Restrainer:
    "You lean toward limiting commitments and avoiding overextension rather than pressing every available advantage.",
  Hedger:
    "You keep both competition and restraint live. The strategic answer depends on the case, not a fixed rule.",
  Maximizer:
    "You are comparatively more willing to press for durable advantage when the strategic opening looks real.",
}

export const normativeModifierGlosses: Record<NormativeModifier, string> = {
  Pluralist:
    "You usually give order, sovereignty, and precedent more weight than wider moral claims when they collide.",
  "Conditional Solidarist":
    "You treat order and justice as a live tension. Neither side settles the question in advance.",
  Universalist:
    "You are more willing to let severe moral stakes override sovereignty in extreme cases.",
}

export function strategyModifierGloss(modifier: StrategyModifier): string {
  return strategyModifierGlosses[modifier]
}

export function normativeModifierGloss(modifier: NormativeModifier): string {
  return normativeModifierGlosses[modifier]
}
