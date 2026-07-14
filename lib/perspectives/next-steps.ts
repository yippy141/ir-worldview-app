import { getPerspectiveDefinition } from "@/lib/perspectives/catalog"
import type { PerspectiveDefinition, PerspectiveId } from "@/lib/perspectives/types"
import type { ModuleSlug } from "@/lib/modules/types"
import type { FamilyKey } from "@/lib/types"

/**
 * Editorial next-step recommendations: which Perspective Run seats are most
 * useful to try after a given result. Pure navigation guidance — these
 * mappings never touch scoring, matching, or stored payloads.
 */

export type PerspectiveNextStep = {
  perspective: PerspectiveDefinition
  /** One line on why this seat pressure-tests the result. */
  reason: string
}

/**
 * Foundation result → three seats chosen to pressure the baseline family's
 * typical blind spots rather than confirm them.
 */
const FOUNDATION_SEATS: Record<FamilyKey, readonly { id: PerspectiveId; reason: string }[]> = {
  realist: [
    {
      id: "exposed-ally",
      reason: "Dependence looks different from the exposed side of a security guarantee.",
    },
    {
      id: "protection-authority",
      reason: "Tests how far power logic travels when authority and protection set the terms.",
    },
    {
      id: "capacity-constrained-state",
      reason: "Leverage reads differently when capacity, not position, is the binding constraint.",
    },
  ],
  institutionalist: [
    {
      id: "rising-peer-competitor",
      reason: "Tests whether rules still persuade when the counterparty is probing them.",
    },
    {
      id: "incumbent-great-power",
      reason: "Coordination costs look different from the seat that pays most of them.",
    },
    {
      id: "middle-power-hedger",
      reason: "Asks what institutions are worth to a state keeping its options open.",
    },
  ],
  constructivist: [
    {
      id: "incumbent-great-power",
      reason: "Tests how legitimacy reads when hard commitments and force posture are yours to move.",
    },
    {
      id: "rising-peer-competitor",
      reason: "The same claims of meaning and recognition look different from the revisionist seat.",
    },
    {
      id: "exposed-ally",
      reason: "Asks what interpretation is worth when the immediate risk is concrete.",
    },
  ],
  criticalPoliticalEconomy: [
    {
      id: "incumbent-great-power",
      reason: "Tests the hierarchy reading from the seat that runs the infrastructure.",
    },
    {
      id: "exposed-ally",
      reason: "Asks whether dependence still reads as structure when protection is urgent.",
    },
    {
      id: "protection-authority",
      reason: "Tests whether rules are only power in disguise when you hold the mandate.",
    },
  ],
}

/**
 * Module result → domain seat packs from the V17 pack:
 * Security → exposed ally, rising competitor, incumbent power.
 * Technology → developmental state, middle power, institution.
 */
const MODULE_SEATS: Record<ModuleSlug, readonly { id: PerspectiveId; reason: string }[]> = {
  security: [
    {
      id: "exposed-ally",
      reason: "Frontline exposure turns deterrence debates into survival arithmetic.",
    },
    {
      id: "rising-peer-competitor",
      reason: "The same red lines look like containment from the other side of them.",
    },
    {
      id: "incumbent-great-power",
      reason: "Commitments span theaters; every reassurance somewhere is a risk somewhere else.",
    },
  ],
  technology: [
    {
      id: "capacity-constrained-state",
      reason: "Technology controls read as development ceilings from a capacity-constrained seat.",
    },
    {
      id: "middle-power-hedger",
      reason: "Chokepoint politics look different when you sit between the blocs.",
    },
    {
      id: "protection-authority",
      reason: "Tests who can actually govern a technology once it crosses borders.",
    },
  ],
}

function resolveSeats(
  seats: readonly { id: PerspectiveId; reason: string }[],
): PerspectiveNextStep[] {
  return seats.flatMap((seat) => {
    const perspective = getPerspectiveDefinition(seat.id)
    return perspective ? [{ perspective, reason: seat.reason }] : []
  })
}

export function getFoundationPerspectiveNextSteps(familyKey: FamilyKey): PerspectiveNextStep[] {
  return resolveSeats(FOUNDATION_SEATS[familyKey])
}

export function getModulePerspectiveNextSteps(slug: ModuleSlug): PerspectiveNextStep[] {
  return resolveSeats(MODULE_SEATS[slug])
}
