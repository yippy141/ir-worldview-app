import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import {
  hasAnyCurrentProfileRecord,
  hasNonFoundationProfileRecords,
} from "@/components/profile/profile-record-presence"
import { emptyProfileStore, type ProfileStore } from "@/lib/profile-store"

function source(relativePath: string) {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8")
}

test("domain-only and Perspective-only profiles bypass the Foundation empty state", () => {
  const empty = emptyProfileStore()
  const domainOnly: ProfileStore = {
    ...empty,
    modules: {
      security: {} as ProfileStore["modules"]["security"],
    },
  }
  const perspectiveOnly: ProfileStore = {
    ...empty,
    perspectiveRuns: [{} as ProfileStore["perspectiveRuns"][number]],
  }

  assert.equal(hasAnyCurrentProfileRecord(empty), false)
  assert.equal(hasNonFoundationProfileRecords(empty), false)
  assert.equal(hasAnyCurrentProfileRecord(domainOnly), true)
  assert.equal(hasNonFoundationProfileRecords(domainOnly), true)
  assert.equal(hasAnyCurrentProfileRecord(perspectiveOnly), true)
  assert.equal(hasNonFoundationProfileRecords(perspectiveOnly), true)
})

test("Profile answers the five production questions in the required order", () => {
  const report = source("components/profile/profile-report.tsx")
  const orderedMarkers = [
    "Saved Foundation read",
    "Separate domain records",
    "<PerspectiveRunsSection",
    "Reviewed cross-domain relations",
    "What to open next",
  ]

  let previous = -1
  for (const marker of orderedMarkers) {
    const index = report.indexOf(marker)
    assert.ok(index > previous, `${marker} must follow the preceding Profile section`)
    previous = index
  }

  assert.match(report, /No reviewed cross-domain relation is available\./u)
  assert.match(report, /does not infer a relationship from[\s\S]*similar labels or numbers/u)
  assert.doesNotMatch(report, /overlayDeltas|buildProfileAssessment|buildIntegratedHeadline/u)
  assert.doesNotMatch(report, /laneSummaries|keyDrivers|strongLenses/u)
})

test("English and Simplified Chinese Profile dashboards share the non-Foundation record gate", () => {
  const english = source("components/profile/profile-dashboard.tsx")
  const chinese = source("components/profile/zh-hans-profile-dashboard.tsx")
  const chineseCopy = source("content/locales/zh-Hans/profile-records.ts")

  assert.match(english, /if \(!hasAnyCurrentProfileRecord\(profile\)\)/u)
  assert.match(chinese, /if \(!hasAnyCurrentProfileRecord\(profile\)\)/u)
  assert.match(
    chinese,
    /preserveUnavailableFoundation:\s*true/u,
  )
  assert.match(chineseCopy, /目前没有经过审校、可在此展示的跨领域关系。/u)
  assert.match(chineseCopy, /本页不会因为标签或数值相近而自行推断/u)
  assert.doesNotMatch(chinese, /view\.foundation\.dimensions/u)
  assert.doesNotMatch(chinese, /ACTIVE_MODULE_COMPARISON_STATUS/u)
})
