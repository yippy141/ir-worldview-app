import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs"
import { extname, join, resolve } from "node:path"
import test from "node:test"

const projectRoot = process.cwd()
const source = (path: string) =>
  readFileSync(resolve(projectRoot, path), "utf8")

const GEOMETRY_DIGEST =
  "0c02d05b8bdbb814f64cb4633ba26ff467976ff8ad8fc71de630ae6fa1d7a6fe"
const ARTIFACT_DIGEST =
  "8f8328d17caf6e289240fcc0ae97c1bb5c3e7daa289d7f5bec8d2cb5681b00f2"
const SYSTEM_A_MANIFEST_DIGEST =
  "0f84bc56ccb84f51f6c045bf403472cd52617484c7cf7a947e3acea44baa12ff"
const ARCHIVE_DIRECTORY =
  "docs/v23/design-history/rejected-sigil-geometry-v1"
const ARCHIVED_ARTIFACT =
  `${ARCHIVE_DIRECTORY}/V23_1_SIGIL_GEOMETRY_V1_CONTACT_SHEET.svg`
const ARCHIVED_REVIEW =
  `${ARCHIVE_DIRECTORY}/V23_1_SIGIL_GEOMETRY_V1_COLLISION_REVIEW.md`

function sourceFilesUnder(path: string): string[] {
  const absolutePath = resolve(projectRoot, path)
  if (!existsSync(absolutePath)) return []

  return readdirSync(absolutePath).flatMap((entry) => {
    const child = join(absolutePath, entry)
    if (statSync(child).isDirectory()) {
      return sourceFilesUnder(child.slice(projectRoot.length + 1))
    }
    return [".js", ".jsx", ".mjs", ".mts", ".ts", ".tsx"].includes(
      extname(child),
    )
      ? [child]
      : []
  })
}

test("geometry v1 stays retired while the System A production core is isolated", () => {
  for (const retiredPath of [
    "lib/archetype-sigils.ts",
    "components/archetypes/archetype-sigil.tsx",
    "scripts/render-archetype-sigil-contact-sheet.mts",
    "artifacts/v23/V23_1_SIGIL_CONTACT_SHEET.svg",
    "tests/archetype-sigils.test.mts",
    "tests/v23-sigil-contact-sheet.test.mts",
  ]) {
    assert.equal(existsSync(resolve(projectRoot, retiredPath)), false, retiredPath)
  }

  for (const systemAPath of [
    "docs/v23/assets/V23_SYSTEM_A_DERIVED_SIGILS_MANIFEST.json",
    "lib/archetype-marks.ts",
    "components/archetypes/archetype-mark.tsx",
    "tests/archetype-marks.test.mts",
  ]) {
    assert.equal(existsSync(resolve(projectRoot, systemAPath)), true, systemAPath)
  }

  const productionFiles = ["app", "components", "lib"].flatMap(sourceFilesUnder)
  for (const file of productionFiles) {
    const contents = readFileSync(file, "utf8")
    assert.doesNotMatch(
      contents,
      /(?:archetype-sigil|archetype-sigils|V23_1_SIGIL_CONTACT_SHEET)/,
      file.slice(projectRoot.length + 1),
    )
  }

})

test("geometry v1 remains byte-bound only as rejected design history", () => {
  const artifact = source(ARCHIVED_ARTIFACT)
  const review = source(ARCHIVED_REVIEW)

  assert.equal(
    createHash("sha256").update(artifact, "utf8").digest("hex"),
    ARTIFACT_DIGEST,
  )
  assert.match(review, new RegExp(GEOMETRY_DIGEST))
  assert.match(review, new RegExp(ARTIFACT_DIGEST))
  assert.match(review, /Outcome: `blocked`/)
  assert.match(review, /cannot ship/)
  assert.match(review, /Claude design review/)
  assert.match(review, /not universal cultural\s+clearance/i)
  assert.doesNotMatch(review, /Outcome: `approved`/)
})

test("the active collision record separates blocked v1 from owner-selected System A", () => {
  const review = source("docs/v23/V23_1_SIGIL_COLLISION_REVIEW.md")
  const manifest = source(
    "docs/v23/assets/V23_SYSTEM_A_DERIVED_SIGILS_MANIFEST.json",
  )

  assert.equal(
    createHash("sha256").update(manifest, "utf8").digest("hex"),
    SYSTEM_A_MANIFEST_DIGEST,
  )
  assert.match(review, new RegExp(GEOMETRY_DIGEST))
  assert.match(review, new RegExp(SYSTEM_A_MANIFEST_DIGEST))
  assert.match(review, /geometry v1[\s\S]*blocked/i)
  assert.match(review, /System A[\s\S]*owner[- ]selected/i)
  assert.match(review, /automated (?:collision )?review completed/i)
  assert.match(
    review,
    /owner[\s\S]*accepts[\s\S]*bounded(?: residual)? cultural risk/i,
  )
  assert.match(review, /does not claim universal cultural clearance/i)
  assert.doesNotMatch(
    review,
    /universal cultural clearance (?:is|was|has been) (?:granted|completed)/i,
  )
})
