import type { ModuleSlug } from "@/lib/modules/types"

export const SECURITY_PERSPECTIVE_BANK_MIN_VERSION = 4

export const ACTOR_LENS_INSTRUCTION =
  "Assess the options from the named actor's stated constraints. Understanding the logic does not imply endorsement of the actor, objective, legal claim, or action."

export const ACTOR_LENS_RESULT_SUMMARY =
  "Actor-lens selections are excluded from the main Security score. They record how you modeled each named actor's constraints and should be inspected as separate role-conditioned judgments. No cross-actor average is interpreted as a coherent worldview vector."

export type PerspectiveBankTuple = {
  slug: ModuleSlug
  bankVersion: number
}

/**
 * One capability predicate owns every Security perspective-bank presentation
 * and payload rule. Security v3 predates the contract; v4 and later support it.
 */
export function hasPerspectiveBankCapability(
  tuple: PerspectiveBankTuple,
): boolean {
  return (
    tuple.slug === "security" &&
    tuple.bankVersion >= SECURITY_PERSPECTIVE_BANK_MIN_VERSION
  )
}
