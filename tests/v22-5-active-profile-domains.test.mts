import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

function readSource(relativePath: string) {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8")
}

test("active Profile renders independent domain records without frozen movement arithmetic", () => {
  const source = readSource("components/profile/profile-report.tsx")

  assert.match(source, /Foundation and issue records/)
  assert.match(
    source,
    /Issue results sit beside the Foundation and do not rescore it\./,
  )
  assert.match(source, /ACTIVE_MODULE_COMPARISON_STATUS/)
  assert.match(source, /\(\["security", "technology"\] as const\)\.map/)
  assert.match(
    source,
    /const title = slug === "security" \? "Security" : "Technology"/,
  )
  assert.match(source, /<h3>\{title\} record<\/h3>/)
  assert.match(source, /AI Governance record/)

  for (const forbidden of [
    "overlayDeltas",
    "moduleSnapshot.comparison",
    "buildProfileAssessment",
    "buildProfileNarrative",
    "buildProfileSpineRows",
    "buildProfileTriad",
    "ProfileAnchoredSpread",
    "What stayed steady, what shifted",
    "Biggest shift",
    "Directional read",
  ]) {
    assert.equal(
      source.includes(forbidden),
      false,
      `active Profile must not render ${forbidden}`,
    )
  }
})

test("Profile hydration no longer reconstructs a module-to-Foundation comparison", () => {
  const source = readSource("lib/profile-store.ts")
  const start = source.indexOf("function buildModuleDisplay")
  const end = source.indexOf("function extractModuleResultTokens", start)

  assert.notEqual(start, -1)
  assert.notEqual(end, -1)

  const displayBuilder = source.slice(start, end)
  assert.match(
    displayBuilder,
    /definition\.summarizeLanes\(\s*analytics,\s*undefined,/,
  )
  assert.doesNotMatch(displayBuilder, /definition\.compareToFoundation/)
  assert.match(displayBuilder, /fallback\?\.comparison/)
})

test("active Profile sharing prefers the canonical separate-domain payload", () => {
  const dashboard = readSource("components/profile/profile-dashboard.tsx")
  const writer = readSource("lib/profile-share.ts")

  assert.match(dashboard, /buildCompatibleProfileSharePayload\(profile\)/)
  assert.doesNotMatch(dashboard, /buildProfileSharePayloadV1\(profile\)/)
  assert.match(writer, /hasLegacyModule/)
  assert.match(writer, /hasUnavailableFoundation/)
  assert.match(writer, /buildProfileSharePayloadV2\(profile\)/)
  assert.match(writer, /buildProfileSharePayload\(profile\)/)
  assert.doesNotMatch(writer, /return buildProfileSharePayloadV1\(profile\)/)
  assert.match(writer, /display-only legacy module has no canonical token/)
  assert.match(writer, /keeps AI[\s*]+Governance and Perspective Runs/)
})
