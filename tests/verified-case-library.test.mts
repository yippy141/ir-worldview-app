import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { atlasLitePatterns, getAtlasLitePattern } from "@/lib/atlas-lite"
import { profileMentalModels } from "@/lib/content/profile-mental-models"
import {
  getReviewedCaseCoverage,
  getReviewedCasesForPattern,
  getSourceCoveredClaims,
  verifiedCaseLibrary,
} from "@/lib/content/verified-case-library"
import { buildAtlasPatternFieldItems } from "@/lib/field/items"

test("the page adapter uses all six source-verified case records", () => {
  assert.equal(verifiedCaseLibrary.cases.length, 6)
  assert.equal(
    new Set(verifiedCaseLibrary.cases.map((caseStudy) => caseStudy.caseId)).size,
    verifiedCaseLibrary.cases.length,
  )

  for (const caseStudy of verifiedCaseLibrary.cases) {
    assert.ok(caseStudy.neutralContext.trim().length > 0)
    assert.ok(caseStudy.sourceRecords.length >= 1)
    assert.ok(caseStudy.claimLedger.length >= 1)
    assert.ok(caseStudy.verifiedProfileReading.whereAnalogyBreaks.length >= 1)
  }
})

test("source records link directly and declare valid claim coverage", () => {
  for (const caseStudy of verifiedCaseLibrary.cases) {
    const claimIds = new Set(caseStudy.claimLedger.map((claim) => claim.claimId))
    const coveredClaims = new Set<string>()

    for (const source of caseStudy.sourceRecords) {
      const url = new URL(source.url)
      assert.equal(url.protocol, "https:", `${source.sourceId} must use HTTPS`)
      assert.ok(source.title.trim().length > 0)
      assert.ok(source.authorInstitution.trim().length > 0)
      assert.ok(source.claimsSupported.length > 0)

      for (const claimId of source.claimsSupported) {
        assert.ok(claimIds.has(claimId), `${source.sourceId} references unknown claim ${claimId}`)
        coveredClaims.add(claimId)
      }
    }

    assert.deepEqual(
      new Set(getSourceCoveredClaims(caseStudy).map((claim) => claim.claimId)),
      coveredClaims,
    )
  }
})

test("claim-ledger entries without explicit source coverage stay out of rendered evidence", () => {
  const withheldClaims = verifiedCaseLibrary.cases.flatMap((caseStudy) => {
    const renderedIds = new Set(
      getSourceCoveredClaims(caseStudy).map((claim) => claim.claimId),
    )
    return caseStudy.claimLedger.filter((claim) => !renderedIds.has(claim.claimId))
  })

  assert.deepEqual(withheldClaims.map((claim) => claim.claimId), ["cmc_c4"])
})

test("profile readings resolve only through stable Atlas IDs", () => {
  let placementCount = 0

  for (const caseStudy of verifiedCaseLibrary.cases) {
    const reading = caseStudy.verifiedProfileReading
    assert.ok(getAtlasLitePattern(reading.bestFitProfileId))
    assert.ok(getAtlasLitePattern(reading.strongestRivalProfileId))
    assert.notEqual(reading.bestFitProfileId, reading.strongestRivalProfileId)
    placementCount += 2
  }

  assert.equal(placementCount, 12)
  assert.equal(
    atlasLitePatterns.reduce(
      (count, pattern) => count + getReviewedCasesForPattern(pattern.id).length,
      0,
    ),
    placementCount,
  )
})

test("coverage states support several, one, and no reviewed case", () => {
  assert.deepEqual(getReviewedCaseCoverage("constraint-first-realist"), {
    level: "several",
    renderedRecordCount: 2,
    withheldRecordCount: 4,
  })
  assert.deepEqual(getReviewedCaseCoverage("coalition-pragmatist"), {
    level: "thin",
    renderedRecordCount: 1,
    withheldRecordCount: 5,
  })
  assert.deepEqual(getReviewedCaseCoverage("broad-spectrum-bridge-builder"), {
    level: "none",
    renderedRecordCount: 0,
    withheldRecordCount: 6,
  })
})

test("every Atlas profile has one labeled editorial analogy with a limit", () => {
  assert.equal(profileMentalModels.length, atlasLitePatterns.length)

  for (const pattern of atlasLitePatterns) {
    const model = profileMentalModels.find((candidate) => candidate.patternId === pattern.id)
    assert.ok(model, `${pattern.id} needs an editorial analogy`)
    assert.ok(model.analogy.trim().length > 0)
    assert.ok(model.explanation.trim().length > 0)
    assert.ok(model.whereItBreaks.trim().length > 0)
  }
})

test("public Atlas field labels preserve stable IDs and URLs", () => {
  const fieldItems = buildAtlasPatternFieldItems()

  for (const pattern of atlasLitePatterns) {
    const item = fieldItems.find((candidate) => candidate.id === pattern.id)
    assert.ok(item)
    assert.equal(item.label, pattern.publicName)
    assert.equal(item.href, `/explore/atlas/${pattern.id}`)
    assert.ok(item.searchableText?.includes(pattern.technicalDescriptor))
  }
})

test("the profile page exposes the required learning and navigation contracts", () => {
  const source = readFileSync(
    new URL("../components/worldview-profile/worldview-profile-page.tsx", import.meta.url),
    "utf8",
  )

  assert.match(source, /<h1 className=\{styles\.publicName\}>\{pattern\.publicName\}<\/h1>/)
  assert.match(source, /\{pattern\.technicalDescriptor\}/)
  assert.match(source, /See the same case through other readings\./)
  assert.match(source, /href="\/modules\/security"/)
  assert.match(source, /href="\/modules\/technology"/)
  assert.match(source, /href="\/ai"/)
  assert.match(source, /href="\/perspectives"/)
  assert.equal(source.match(/className="eyebrow"/g)?.length, 1)
})
