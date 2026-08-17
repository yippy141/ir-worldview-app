import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import test from "node:test"
import {
  getPublishedArchetypeContent,
  getPublishedArchetypeStatus,
  OWNER_AUTHORIZED_BETA_PUBLICATION,
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
  assert.match(indexSource, /formatArchetypeDisplayCode\(archetype\.code\)/)
  assert.match(indexSource, /formatArchetypeCodeSpeech\(archetype\.code\)/)
  assert.match(indexSource, /aria-label=\{`Open \$\{archetype\.name\}/)
  assert.match(indexSource, /aria-describedby=\{glossId\}/)
  assert.match(indexSource, /id=\{glossId\}/)
  assert.match(indexSource, /<ArchetypeMark/)
  assert.match(indexSource, /size=\{48\}/)
  assert.match(indexSource, /traditionNounLabel\(entries\[0\]\.familyKey\)/)
  assert.match(indexSource, /Order-first/)
  assert.match(indexSource, /Conditional/)
  assert.match(indexSource, /Justice-first/)
  assert.match(indexSource, /href="\/method"/)
  assert.doesNotMatch(indexSource, /<main\b/)
  assert.doesNotMatch(indexSource, /use client/)
  assert.doesNotMatch(indexSource, /ArchetypeSigil|archetype-sigil/)
  assert.doesNotMatch(indexSource, /(?:eight|8) types/iu)
})

test("all eight detail routes retain legacy paths and expose qualified partial content", () => {
  assert.equal(archetypeEvidence.length, 8)
  for (const archetype of archetypes) {
    assert.equal(archetypeEvidencePath(archetype.code), getArchetypePath(archetype.code))
    assert.ok(getPublishedArchetypeContent(archetype.code), archetype.code)
    assert.deepEqual(getPublishedArchetypeStatus(archetype.code), {
      publicationStatus: "owner-authorized-beta",
      reviewStatus: "pending-human-editorial-review",
      publicationAuthorization: OWNER_AUTHORIZED_BETA_PUBLICATION,
      reviewerId: null,
      reviewedAt: null,
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
  assert.match(
    detailSource,
    /Automated checks are[\s\S]*not editorial, expert, or methodological validation/,
  )
  assert.match(detailSource, /Historical evidence/)
  assert.match(detailSource, /Owner-authorized AI-assisted English beta copy/)
  assert.match(detailSource, /pending human[\s\S]*editorial review/)
  assert.match(detailSource, /No external expert review or validation/)
  assert.match(
    detailSource,
    /data-content-publication-status=\{publicationStatus\?\.publicationStatus\}/,
  )
  assert.match(
    detailSource,
    /data-content-review-status=\{publicationStatus\?\.reviewStatus\}/,
  )
  assert.match(detailSource, /data-archetype-research-status/)
  assert.equal(
    (detailSource.match(/data-archetype-research-status/g) ?? []).length,
    1,
  )
  assert.match(detailSource, /<FoundationMark/)
  assert.match(detailSource, /presentation="hero"/)
  assert.match(detailSource, /About the mark/)
  assert.match(detailSource, /contemporary mark is editorial artwork/)
  assert.match(detailSource, /not an authentic historical emblem/)
  assert.match(detailSource, /cultural classification/)
  assert.match(detailSource, /endorsement/)
  assert.match(detailSource, /visible code and name carry the meaning/)
  assert.match(detailSource, /not another[\s\S]*Foundation result/)
  assert.match(detailSource, /formatArchetypeDisplayCode\(identity\.code\)/)
  assert.match(detailSource, /formatArchetypeCodeSpeech\(identity\.code\)/)
  assert.match(detailSource, /traditionNounLabel\(identity\.familyKey\)/)
  assert.ok(
    detailSource.indexOf("Three equal-weight orientations") <
      detailSource.indexOf("Historical comparison"),
  )
  assert.ok(
    detailSource.indexOf("Historical comparison") <
      detailSource.indexOf("Research and publication status"),
  )
  assert.equal((detailSource.match(/<details\b/g) ?? []).length, 1)
  const researchStatusSource = detailSource.slice(
    detailSource.indexOf("<details"),
    detailSource.indexOf("</details>") + "</details>".length,
  )
  assert.doesNotMatch(researchStatusSource, /<dl\b|<dt\b|<dd\b/)
  assert.match(researchStatusSource, /Neighbor analysis still requires research/)
  assert.match(researchStatusSource, /empty sections are omitted/)
  const methodFooterSource = detailSource.slice(
    detailSource.indexOf("<footer className={styles.methodFooter}"),
    detailSource.indexOf("</footer>") + "</footer>".length,
  )
  assert.doesNotMatch(methodFooterSource, /<dl\b|data-content-review-status/)
  assert.doesNotMatch(detailSource, /id="neighbors"|id="blends"|id="domain-expressions"/)
  assert.doesNotMatch(detailSource, /id="related-records"/)
  assert.doesNotMatch(detailSource, /ArchetypeSigil|archetype-sigil|data-archetype-sigil-frame/)
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
  assert.match(traditionSource, /Supporting tradition, not a Foundation result/)
  assert.match(traditionSource, /data-tradition-archetype=\{archetype\.code\}/)
  assert.match(traditionSource, /data-archetype-code-label/)
  assert.match(traditionSource, /href="\/explore\/reference"/)
  assert.doesNotMatch(traditionSource, /associatedThinkers/)
  assert.doesNotMatch(traditionSource, /Associated thinkers/)
  assert.doesNotMatch(traditionSource, /ArchetypeSigil|archetype-sigil/)
})

test("unapproved Chinese status routing never imports English archetype content or sigils", () => {
  const statusRoute = source("app/[locale]/[...slug]/page.tsx")
  assert.match(statusRoute, /TranslationStatusNotice/)
  assert.doesNotMatch(
    statusRoute,
    /archetype-content|archetype-(?:mark|marks|sigil)|hub\.en/,
  )
})
