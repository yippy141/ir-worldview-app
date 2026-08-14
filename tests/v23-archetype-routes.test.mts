import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import test from "node:test"
import {
  getPublishedArchetypeContent,
  getPublishedArchetypeStatus,
} from "@/lib/archetype-content"
import {
  archetypeEvidence,
  archetypeEvidencePath,
  parseArchetypeEvidenceReturnPath,
} from "@/lib/archetype-evidence"
import { archetypes, getArchetypePath } from "@/lib/archetypes"

const projectRoot = process.cwd()
const source = (path: string) => readFileSync(resolve(projectRoot, path), "utf8")

test("the English archetype directory derives exactly eight links from the canonical catalog", () => {
  assert.equal(archetypes.length, 8)
  assert.deepEqual(
    archetypes.map(({ code }) => getArchetypePath(code)),
    [
      "/archetypes/p-plus",
      "/archetypes/p-minus",
      "/archetypes/r-plus",
      "/archetypes/r-minus",
      "/archetypes/m-plus",
      "/archetypes/m-minus",
      "/archetypes/s-plus",
      "/archetypes/s-minus",
    ],
  )

  const indexSource = source("app/archetypes/page.tsx")
  assert.match(indexSource, /archetypes\.filter/)
  assert.match(indexSource, /getArchetypePath\(archetype\.code\)/)
  assert.match(indexSource, /data-archetype-code=\{archetype\.code\}/)
  assert.match(indexSource, /Order-first/)
  assert.match(indexSource, /Conditional/)
  assert.match(indexSource, /Justice-first/)
  assert.match(indexSource, /href="\/method"/)
  assert.doesNotMatch(indexSource, /<main\b/)
  assert.doesNotMatch(indexSource, /use client/)
  assert.doesNotMatch(indexSource, /(?:eight|8) types/iu)
})

test("all eight detail routes retain legacy paths and resolve approved public content", () => {
  assert.equal(archetypeEvidence.length, 8)
  for (const archetype of archetypes) {
    assert.equal(archetypeEvidencePath(archetype.code), getArchetypePath(archetype.code))
    assert.ok(getPublishedArchetypeContent(archetype.code), archetype.code)
    assert.deepEqual(getPublishedArchetypeStatus(archetype.code), {
      reviewerId: "product-owner",
      reviewedAt: "2026-08-14",
      evidenceStatus: "legacy-v1-provisional",
    })
  }

  const detailSource = source("app/archetypes/[slug]/page.tsx")
  assert.match(detailSource, /generateStaticParams/)
  assert.match(detailSource, /getPublishedArchetypeContent\(identity\.code\)/)
  assert.match(detailSource, /getArchetypeEvidenceBySlug\(slug\)/)
  assert.match(detailSource, /parseArchetypeEvidenceReturnPath\(from\)/)
  assert.match(detailSource, /Why this comparison fits/)
  assert.match(detailSource, /Where the comparison breaks/)
  assert.match(detailSource, /A note on the name/)
  assert.match(detailSource, /Provisional source/)
  assert.match(detailSource, /No completed human/)
  assert.match(detailSource, /Historical evidence/)
  assert.match(detailSource, /publicationStatus\.reviewedAt/)
  assert.doesNotMatch(detailSource, /<main\b/)
  assert.doesNotMatch(detailSource, /getArchetypeContentDraft/)
  assert.doesNotMatch(detailSource, /use client/)

  const routeStyles = source("components/archetypes/archetypes.module.css")
  assert.match(routeStyles, /\.sourceLedger a\[href\^="http"\]::after/)
  assert.match(routeStyles, /content:\s*" \(" attr\(href\) "\)"/)
})

test("unsafe archetype return paths fail closed", () => {
  assert.equal(
    parseArchetypeEvidenceReturnPath("/results/opaque_A-b9"),
    "/results/opaque_A-b9",
  )
  for (const candidate of [
    "https://evil.example/results/token",
    "//evil.example/results/token",
    "/results/token?next=/profile",
    "/zh/results/token",
    "/profile",
  ]) {
    assert.equal(parseArchetypeEvidenceReturnPath(candidate), null, candidate)
  }
})

test("tradition routes publish the two posture links and no unsourced thinker cards", () => {
  for (const familyKey of new Set(archetypes.map(({ familyKey }) => familyKey))) {
    assert.deepEqual(
      archetypes
        .filter((archetype) => archetype.familyKey === familyKey)
        .map(({ posture }) => posture),
      ["+", "-"],
    )
  }

  const traditionSource = source("app/explore/[slug]/page.tsx")
  assert.match(traditionSource, /Supporting tradition, not assigned identity/)
  assert.match(traditionSource, /data-tradition-archetype=\{archetype\.code\}/)
  assert.match(traditionSource, /href="\/explore\/reference"/)
  assert.doesNotMatch(traditionSource, /associatedThinkers/)
  assert.doesNotMatch(traditionSource, /Associated thinkers/)
})

test("unapproved Chinese status routing never imports English archetype content or sigils", () => {
  const statusRoute = source("app/[locale]/[...slug]/page.tsx")
  assert.match(statusRoute, /TranslationStatusNotice/)
  assert.doesNotMatch(statusRoute, /archetype-content|archetype-sigil|hub\.en/)
})
