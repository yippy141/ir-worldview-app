import type { ProfileStore } from "@/lib/profile-store"

export function hasNonFoundationProfileRecords(profile: ProfileStore): boolean {
  return (
    Object.values(profile.modules).some(Boolean)
    || Boolean(profile.aiGovernance)
    || profile.perspectiveRuns.length > 0
  )
}

export function hasAnyCurrentProfileRecord(profile: ProfileStore): boolean {
  return Boolean(profile.foundation) || hasNonFoundationProfileRecords(profile)
}
