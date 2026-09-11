import { featureIds } from "@/lib/futures/catalogue/features"
import type { Preference, PreferenceAnswers } from "@/lib/futures/preferences"
// Authored synthetic conditions for regression checks; no respondent data.
export function preferenceFixture(overrides: Partial<Record<(typeof featureIds)[number], Preference>> = {}): PreferenceAnswers {
  return Object.fromEntries(featureIds.map(id => [id, { choice: overrides[id] ?? "uncertain", nonNegotiable: false }]))
}
export const humanPlural = preferenceFixture({ humanAuthority: "present", revisablePower: "present", personalExit: "present", pluralPolities: "present", sharedBenefits: "present", biologicalContinuity: "present", transparentPower: "present", technicalIndependence: "present" })
export const centralizedCare = preferenceFixture({ humanAuthority: "absent", revisablePower: "absent", pluralPolities: "absent", sharedBenefits: "present", biologicalContinuity: "present", transparentPower: "present", technicalIndependence: "absent" })
export const lowTechnology = preferenceFixture({ humanAuthority: "present", biologicalContinuity: "present", voluntaryTransformation: "absent", digitalStanding: "absent", capabilityLimits: "present", technicalIndependence: "present" })
export const allConflict = preferenceFixture({ humanAuthority: "present", biologicalContinuity: "absent", capabilityLimits: "present" })
allConflict.humanAuthority!.nonNegotiable = true
allConflict.biologicalContinuity!.nonNegotiable = true
