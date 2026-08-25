import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import test from "node:test"
import {
  formatArchetypeCodeSpeech,
  formatArchetypeDisplayCode,
  formatArchetypeReadingCode,
  formatArchetypeReadingCodeForSpeech,
  explainArchetypeReadingCode,
  NORMATIVE_DISPLAY_ALIASES,
  PUBLIC_LENS_LABELS,
} from "@/lib/archetype-display"
import { archetypes } from "@/lib/archetypes"
import { exploreFamilies } from "@/lib/explore-content"
import {
  FAMILY_LABELS,
  MODELED_FAMILY_KEYS,
  TRADITION_NOUN_LABELS,
  traditionNounLabel,
} from "@/lib/worldview-config"

test("public lens and tradition nouns have one exact canonical mapping", () => {
  assert.deepEqual(PUBLIC_LENS_LABELS, {
    P: "Power",
    R: "Rules",
    M: "Meaning",
    S: "Structure",
  })
  assert.deepEqual(TRADITION_NOUN_LABELS, {
    realist: "Realism",
    institutionalist: "Institutionalism",
    constructivist: "Constructivism",
    criticalPoliticalEconomy: "Critical political economy",
  })
  assert.deepEqual(
    exploreFamilies.map(({ familyKey, name }) => [familyKey, name]),
    MODELED_FAMILY_KEYS.map((familyKey) => [
      familyKey,
      traditionNounLabel(familyKey),
    ]),
  )

  assert.deepEqual(FAMILY_LABELS, {
    realist: "Strategic Realist",
    institutionalist: "Liberal Institutionalist",
    constructivist: "Social Constructivist",
    criticalPoliticalEconomy: "Critical Political Economist",
  })
})

test("public code formatters preserve ASCII internals and speak every sign", () => {
  assert.equal(formatArchetypeDisplayCode("P+"), "P+")
  assert.equal(formatArchetypeDisplayCode("P-"), "P−")
  assert.equal(formatArchetypeDisplayCode("P/R+"), "P/R+")
  assert.equal(formatArchetypeDisplayCode("P/R-"), "P/R−")
  assert.equal(formatArchetypeCodeSpeech("P+"), "P plus")
  assert.equal(formatArchetypeCodeSpeech("P-"), "P minus")
  assert.equal(formatArchetypeCodeSpeech("P/R+"), "P slash R plus")
  assert.equal(formatArchetypeCodeSpeech("P/R-"), "P slash R minus")
  assert.equal(archetypes.find(({ name }) => name === "Shi (勢)")?.code, "P-")
})

test("public reading codes expand normative suffixes instead of exposing them", () => {
  assert.deepEqual(NORMATIVE_DISPLAY_ALIASES, {
    o: "Order-first",
    c: "Conditional",
    j: "Justice-first",
  })
  assert.equal(formatArchetypeReadingCode("P+", "j"), "P+ · Justice-first")
  assert.equal(
    formatArchetypeReadingCodeForSpeech("P-", "o"),
    "P minus, Order-first",
  )
})

test("first-contact code explanations define lenses, posture signs, and normative labels", () => {
  assert.equal(
    explainArchetypeReadingCode("P+", "j"),
    "Power names the leading explanatory lens; the plus sign marks applying advantage; Justice-first names the result’s order-and-justice posture.",
  )
  assert.equal(
    explainArchetypeReadingCode("R/M-", "c"),
    "Rules and Meaning name the two leading explanatory lenses; the minus sign marks restraint; Conditional names the result’s order-and-justice posture.",
  )
})

test("owned public routes use display helpers and contain no raw normative suffix", () => {
  const source = [
    "app/archetypes/page.tsx",
    "app/explore/page.tsx",
    "app/explore/[slug]/page.tsx",
  ].map((path) => readFileSync(resolve(process.cwd(), path), "utf8")).join("\n")

  assert.match(source, /formatArchetypeDisplayCode/)
  assert.match(source, /formatArchetypeCodeSpeech/)
  assert.doesNotMatch(source, />\s*[PRMS](?:\/[PRMS])?[+-]\s*\/\s*[ocj]\s*</u)
  assert.doesNotMatch(source, /ArchetypeSigil|archetype-sigil/u)
})

test("result, profile, share-card, posture, and locale surfaces use the shared formatter", () => {
  const expectedHelpers: Record<string, RegExp[]> = {
    "app/archetypes/[slug]/page.tsx": [
      /formatArchetypeDisplayCode/,
      /formatArchetypeCodeSpeech/,
    ],
    "app/results/[payload]/page.tsx": [
      /formatArchetypeReadingCode/,
      /formatArchetypeReadingCodeForSpeech/,
    ],
    "app/api/card/route.tsx": [/buildFoundationCardCopy/],
    "lib/foundation-social-copy.ts": [/formatArchetypeReadingCode/],
    "components/profile/profile-compare.tsx": [
      /formatArchetypeReadingCode/,
      /formatArchetypeReadingCodeForSpeech/,
    ],
    "components/profile/profile-report.tsx": [
      /formatArchetypeReadingCode/,
      /formatArchetypeReadingCodeForSpeech/,
    ],
    "components/results/posture-strip.tsx": [
      /formatArchetypeDisplayCode/,
      /formatArchetypeCodeSpeech/,
    ],
    "app/[locale]/results/[payload]/page.tsx": [
      /formatArchetypeDisplayCode/,
    ],
    "lib/profile-share-locale.ts": [/formatArchetypeDisplayCode/],
  }

  for (const [path, patterns] of Object.entries(expectedHelpers)) {
    const routeSource = readFileSync(resolve(process.cwd(), path), "utf8")
    for (const pattern of patterns) assert.match(routeSource, pattern, path)
  }
})
