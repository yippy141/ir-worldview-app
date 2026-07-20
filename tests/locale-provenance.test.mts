import test from "node:test"
import assert from "node:assert/strict"
import {
  LEGACY_ENGLISH_PROVENANCE,
  completionProvenance,
  sameResearchEquivalenceCohort,
} from "@/lib/locale-provenance"

test("completion provenance is instrument- and locale-versioned", () => {
  assert.deepEqual(completionProvenance("foundation", "en"), {
    locale: "en",
    localeCopyVersion: 1,
  })
  assert.deepEqual(completionProvenance("foundation", "zh-Hans"), {
    locale: "zh-Hans",
    localeCopyVersion: 1,
  })
  assert.deepEqual(LEGACY_ENGLISH_PROVENANCE, {
    locale: "en",
    localeCopyVersion: 0,
  })
})

test("research-equivalence cohorts never cross locale or copy-version boundaries", () => {
  assert.equal(
    sameResearchEquivalenceCohort(
      { locale: "en", localeCopyVersion: 1 },
      { locale: "en", localeCopyVersion: 1 },
    ),
    true,
  )
  assert.equal(
    sameResearchEquivalenceCohort(
      { locale: "en", localeCopyVersion: 1 },
      { locale: "zh-Hans", localeCopyVersion: 1 },
    ),
    false,
  )
  assert.equal(
    sameResearchEquivalenceCohort(
      { locale: "en", localeCopyVersion: 0 },
      { locale: "en", localeCopyVersion: 1 },
    ),
    false,
  )
})
