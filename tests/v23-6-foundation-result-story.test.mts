import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import path from "node:path"
import test from "node:test"
import { buildFoundationResultHeading } from "@/lib/results/foundation-result-heading"

const repositoryRoot = process.cwd()

test("low-differentiation core headlines both live readings and keeps the register secondary", () => {
  const heading = buildFoundationResultHeading({
    resultTier: "core",
    questionSet: "core",
    legacy: false,
    lowDifferentiation: true,
    primaryLabel: "Realism",
    runnerUpLabel: "Institutionalism",
  })

  assert.equal(
    heading.title,
    "An initial Foundation read: Realism and Institutionalism",
  )
  assert.match(heading.eyebrow, /14-item core form/u)
  assert.match(heading.lead, /Both readings remain live/u)
  assert.match(heading.lead, /targeted follow-up items/u)
})

test("clearer core, targeted, and full forms retain the runner-up and model limit", () => {
  for (const fixture of [
    { resultTier: "core" as const, questionSet: "core" as const, form: "14-item core form" },
    { resultTier: "extended" as const, questionSet: "targetedExtended" as const, form: "targeted refinement form" },
    { resultTier: "extended" as const, questionSet: "fullExtended" as const, form: "full extended form" },
  ]) {
    const heading = buildFoundationResultHeading({
      ...fixture,
      legacy: false,
      lowDifferentiation: false,
      primaryLabel: "Constructivism",
      runnerUpLabel: "Realism",
    })

    assert.match(heading.eyebrow, new RegExp(fixture.form, "u"))
    assert.equal(heading.title, "Constructivism leads this Foundation read")
    assert.match(heading.lead, /clearer within the current item set/u)
    assert.match(heading.lead, /Realism remains the nearest alternative/u)
    assert.match(heading.lead, /does not establish a durable trait/u)
  }
})

test("legacy heading fails closed on exact-form contribution claims", () => {
  const heading = buildFoundationResultHeading({
    resultTier: "extended",
    questionSet: null,
    legacy: true,
    lowDifferentiation: false,
    primaryLabel: "Realism",
    runnerUpLabel: "Institutionalism",
  })

  assert.equal(heading.title, "Registered legacy Foundation read: Realism")
  assert.match(heading.lead, /exact completed-form tuple is unavailable/u)
  assert.doesNotMatch(heading.lead, /leads this Foundation read/u)
})

test("result story has one enhanced sticky rail and a fail-open linear document", () => {
  const storySource = readFileSync(
    path.join(repositoryRoot, "components/results/foundation-result-story.tsx"),
    "utf8",
  )
  const stylesSource = readFileSync(
    path.join(repositoryRoot, "components/results/foundation-result-story.module.css"),
    "utf8",
  )

  assert.equal(
    (storySource.match(/data-foundation-sticky-region/g) ?? []).length,
    1,
    "The desktop story must expose one sticky visual region.",
  )
  assert.match(storySource, /typeof IntersectionObserver === "undefined"/u)
  assert.ok(
    storySource.indexOf("typeof IntersectionObserver") <
      storySource.indexOf('setAttribute("data-enhanced", "true")'),
    "Enhancement must stay off when IntersectionObserver is unavailable.",
  )
  assert.match(stylesSource, /\.stickyRegion\s*\{[\s\S]*?display:\s*none/u)
  assert.match(stylesSource, /@media \(min-width: 768px\)/u)
  assert.match(stylesSource, /@media \(max-width: 767px\)/u)
  assert.match(stylesSource, /@media \(prefers-reduced-motion: reduce\)/u)
  assert.match(stylesSource, /@media print/u)
  assert.match(stylesSource, /\.inlineVisual\s*\{[\s\S]*?display:\s*block !important/u)
})

test("result route uses exact contribution math and local-only evidence without midpoint causality", () => {
  const routeSource = readFileSync(
    path.join(repositoryRoot, "app/results/[payload]/page.tsx"),
    "utf8",
  )
  const storySource = readFileSync(
    path.join(repositoryRoot, "components/results/foundation-result-story.tsx"),
    "utf8",
  )
  const combined = `${routeSource}\n${storySource}`

  assert.match(routeSource, /decomposeFoundationFamilyDifference/u)
  assert.match(storySource, /FoundationLocalEvidence payload=\{props\.payload\}/u)
  assert.match(storySource, /FoundationDomainRecords/u)
  assert.doesNotMatch(combined, /getDimensionPush|PlacementFirmnessBar|nearestFitGap\.toFixed/u)
  assert.doesNotMatch(combined, /Firmly fixed|stable enough to argue from|high confidence|validated|reliable/u)
})
