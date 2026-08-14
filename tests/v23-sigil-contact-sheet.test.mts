import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import test from "node:test"
import { archetypes } from "@/lib/archetypes"
import {
  archetypeSigils,
  getArchetypeSigil,
  SIGIL_GEOMETRY_DIGEST_INPUT,
} from "@/lib/archetype-sigils"
// Node's strip-types test runtime requires the explicit .mts extension.
// @ts-expect-error TypeScript's bundler resolver disallows that runtime form.
import * as contactSheet from "@/scripts/render-archetype-sigil-contact-sheet.mts"

const {
  renderArchetypeSigilContactSheet,
  sha256,
  SIGIL_CONTACT_SHEET_GEOMETRY_DIGEST,
  SIGIL_CONTACT_SHEET_MODES,
  SIGIL_CONTACT_SHEET_SIZES,
  SIGIL_CONTACT_SHEET_WATERMARK_SIZE,
} = contactSheet

const ARTIFACT_URL = new URL(
  "../artifacts/v23/V23_1_SIGIL_CONTACT_SHEET.svg",
  import.meta.url,
)
const REVIEW_URL = new URL(
  "../docs/v23/V23_1_SIGIL_COLLISION_REVIEW.md",
  import.meta.url,
)
const EXPECTED_GEOMETRY_DIGEST =
  "0c02d05b8bdbb814f64cb4633ba26ff467976ff8ad8fc71de630ae6fa1d7a6fe"
const EXPECTED_ARTIFACT_DIGEST =
  "8f8328d17caf6e289240fcc0ae97c1bb5c3e7daa289d7f5bec8d2cb5681b00f2"

const artifact = readFileSync(ARTIFACT_URL, "utf8")
const review = readFileSync(REVIEW_URL, "utf8")

function panelForMode(mode: string): string {
  const start = artifact.indexOf(`    <g data-mode="${mode}"`)
  assert.notEqual(start, -1, `missing ${mode} panel`)
  const laterStarts = SIGIL_CONTACT_SHEET_MODES.map(({ id }) =>
    artifact.indexOf(`    <g data-mode="${id}"`, start + 1),
  ).filter((position) => position > start)
  const end = laterStarts.length > 0 ? Math.min(...laterStarts) : artifact.length
  return artifact.slice(start, end)
}

test("contact sheet is a deterministic render of the production sigil manifest", () => {
  assert.equal(archetypeSigils.length, 8)
  assert.equal(artifact, renderArchetypeSigilContactSheet())
  assert.equal(sha256(SIGIL_GEOMETRY_DIGEST_INPUT), EXPECTED_GEOMETRY_DIGEST)
  assert.equal(SIGIL_CONTACT_SHEET_GEOMETRY_DIGEST, EXPECTED_GEOMETRY_DIGEST)
  assert.equal(
    createHash("sha256").update(artifact, "utf8").digest("hex"),
    EXPECTED_ARTIFACT_DIGEST,
  )
})

test("all eight frozen codes and names render at every required size in every mode", () => {
  assert.deepEqual(SIGIL_CONTACT_SHEET_SIZES, [24, 48, 96])
  assert.equal(SIGIL_CONTACT_SHEET_WATERMARK_SIZE, 160)
  assert.deepEqual(
    SIGIL_CONTACT_SHEET_MODES.map(({ id }) => id),
    ["default-dark", "black-on-white", "white-on-black", "print"],
  )

  for (const { id } of SIGIL_CONTACT_SHEET_MODES) {
    const panel = panelForMode(id)
    for (const archetype of archetypes) {
      assert.match(panel, new RegExp(`data-archetype-row="${archetype.code.replace("+", "\\+")}"`))
      assert.ok(panel.includes(`>${archetype.name}</text>`), `${id}: ${archetype.name}`)
      for (const size of SIGIL_CONTACT_SHEET_SIZES) {
        assert.ok(
          panel.includes(
            `data-sigil-code="${archetype.code}" data-scale="${size}" data-size="${size}"`,
          ),
          `${id}: ${archetype.code} at ${size}px`,
        )
      }
      assert.ok(
        panel.includes(
          `data-sigil-code="${archetype.code}" data-scale="watermark" data-size="160"`,
        ),
        `${id}: ${archetype.code} watermark`,
      )
    }
  }

  assert.match(
    panelForMode("print"),
    /data-mode="print" data-print-specimen="true"/,
  )
})

test("each specimen inlines only its production line and path geometry", () => {
  const specimens = [...artifact.matchAll(
    /<svg data-sigil-code="([PRMS][+-])" data-scale="(24|48|96|watermark)" data-size="(24|48|96|160)"[\s\S]*?>([\s\S]*?)<\/svg>/g,
  )]
  assert.equal(specimens.length, 4 * 8 * 4)

  for (const specimen of specimens) {
    const [markup, code, scale, size, body] = specimen
    const definition = getArchetypeSigil(code)
    assert.ok(definition, code)
    assert.match(markup, /viewBox="0 0 24 24"/)
    assert.match(markup, /fill="none"/)
    assert.match(markup, /stroke="currentColor"/)
    assert.match(markup, /stroke-width="1.75"/)
    assert.match(markup, /stroke-linecap="round"/)
    assert.match(markup, /stroke-linejoin="round"/)
    assert.equal(
      [...body.matchAll(/<(?:line|path)\b/g)].length,
      definition.primitives.length,
      `${code} ${scale} ${size}`,
    )
    assert.doesNotMatch(body, /<(?!line\b|path\b)/)
  }
})

test("contact sheet has no external, active, referenced, or effect-based SVG content", () => {
  const forbidden = [
    /<use\b/i,
    /\bhref\s*=/i,
    /<image\b/i,
    /<script\b/i,
    /<animate\b/i,
    /<set\b/i,
    /<foreignObject\b/i,
    /<filter\b/i,
    /<mask\b/i,
    /<(?:linear|radial)Gradient\b/i,
    /@keyframes/i,
    /url\s*\(/i,
  ]
  for (const pattern of forbidden) {
    assert.doesNotMatch(artifact, pattern)
  }
  assert.doesNotMatch(artifact, /https?:\/\/(?!www\.w3\.org\/2000\/svg)/i)
})

test("collision record binds both digests and remains pending with blank reviewers", () => {
  assert.match(review, /Outcome: `pending`/)
  assert.doesNotMatch(review, /Outcome(?::|\s*\|)[^\n]*`(?:approved|blocked)`/i)
  assert.match(review, new RegExp(EXPECTED_GEOMETRY_DIGEST))
  assert.match(review, new RegExp(EXPECTED_ARTIFACT_DIGEST))
  assert.match(review, /artifacts\/v23\/V23_1_SIGIL_CONTACT_SHEET\.svg/)
  assert.match(review, /\| Component commit \|  \|/)
  assert.match(review, /\| 1 \|  \|  \|  \|  \|/)
  assert.match(review, /\| 2 \|  \|  \|  \|  \|/)

  for (const requiredCheck of [
    "Religious symbols",
    "National, ethnic, or culturally proprietary symbols",
    "Occult symbols",
    "Political-party marks",
    "Military, police, extremist, or state-security insignia",
    "Major corporate or product logos",
    "Common certification, compliance, or quality marks",
    "literal `+`/`-` dominance",
    "Collision between any two of the eight marks at 24px",
    "watermark scale or cropping",
    "black-and-white print",
    "200% optical zoom",
  ]) {
    assert.ok(review.includes(requiredCheck), requiredCheck)
  }
})
