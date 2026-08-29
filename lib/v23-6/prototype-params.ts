import type { RootTypeTreatment, RootVisitorMode } from "@/components/dev/v23-6/root-shell"

/**
 * Development-only view switches.
 *
 * The prototypes read real browser state by default. These parameters exist so
 * a screenshot of the returning-visitor state or of a single typography
 * treatment is deterministic and reproducible.
 */
export function readVisitorMode(value: string | string[] | undefined): RootVisitorMode {
  const first = Array.isArray(value) ? value[0] : value
  if (first === "new" || first === "returning") return first
  return "auto"
}

export function readTypeTreatment(
  value: string | string[] | undefined,
): RootTypeTreatment {
  const first = Array.isArray(value) ? value[0] : value
  if (first === "b" || first === "c") return first
  return "a"
}
