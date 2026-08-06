import assert from "node:assert/strict"
import { existsSync, readFileSync, readdirSync } from "node:fs"
import path from "node:path"
import test from "node:test"
import ts from "typescript"
import {
  getAtlasLitePattern,
  getAtlasLitePatterns,
  getAtlasPatternHref,
} from "@/lib/atlas-lite"
import { resolveArchetype } from "@/lib/archetypes"
import { resolveFoundationArchetypeFromSnapshot } from "@/lib/profile-foundation-identity"
import type { FoundationSnapshot } from "@/lib/profile-store"
import {
  buildCanonicalFoundationResult,
  getV2ScoringCalibration,
} from "@/lib/scoring"
import {
  buildFoundationSharePayload,
  encodePayload,
  resolveFoundationPayload,
} from "@/lib/share"

const repositoryRoot = process.cwd()

const legacyDecisionPatternIds = [
  "broad-spectrum-bridge-builder",
  "constraint-first-realist",
  "competitive-balancer",
  "coalition-pragmatist",
  "institution-builder",
  "legitimacy-attuned-reader",
  "justice-forward-solidarist",
  "structural-inequality-critic",
  "development-sovereignty-builder",
  "cross-pressured-synthesizer",
] as const

// Captured before the current Foundation payload contract. This literal
// ensures the identity helper exercises compatibility dispatch instead of
// round-tripping through the current encoder.
const frozenV2FoundationPayload =
  "eyJ2IjoyLCJkcyI6WzYuMjUsMi41LDQsMy43NSw1LjUsNC4yNSwyLjc1XSwiZmsiOiJyZWFsaXN0IiwibmsiOiJpbnN0aXR1dGlvbmFsaXN0Iiwic20iOiJIZWRnZXIiLCJubSI6IkNvbmRpdGlvbmFsIFNvbGlkYXJpc3QifQ"

function snapshotWithPayload(
  payload: string,
  overrides: Partial<FoundationSnapshot> = {},
): FoundationSnapshot {
  return {
    timestamp: 1,
    payload,
    instrumentStructuralVersion: 4,
    scoringVersion: 2,
    resultPath: `/results/${payload}`,
    familyKey: "realist",
    familyLabel: "Conflicting cached family",
    runnerUpKey: "institutionalist",
    runnerUpLabel: "Conflicting cached runner-up",
    summary: "Conflicting cached summary",
    dimensionScores: {
      securityCompetition: 7,
      institutions: 1,
      domesticFilters: 7,
      normsIdentity: 1,
      politicalEconomy: 7,
      restraint: 1,
      orderJustice: 7,
    },
    strategyModifier: "Maximizer",
    normativeModifier: "Universalist",
    keyDrivers: [],
    strongLenses: [],
    locale: "en",
    localeCopyVersion: 1,
    ...overrides,
  }
}

test("Profile Foundation identity uses the exact payload and its form calibration", () => {
  const coreResult = buildCanonicalFoundationResult(
    {
      securityCompetition: 1,
      institutions: 1,
      domesticFilters: 4,
      normsIdentity: 4,
      politicalEconomy: 4,
      restraint: 4,
      orderJustice: 4,
    },
    "core",
  )
  const payload = encodePayload(
    buildFoundationSharePayload(coreResult, "en", "core"),
  )
  const resolved = resolveFoundationPayload(payload)

  assert.ok(resolved)
  assert.equal(resolved.scoringCalibration, "core")
  assert.equal(
    getV2ScoringCalibration("core").lowDifferentiationThreshold,
    0.3675,
    "fixture guard: this result depends on the registered core threshold",
  )
  assert.equal(
    resolveArchetype(resolved.result).code,
    "S+",
    "fixture guard: the generic threshold would incorrectly return a pure identity",
  )

  const identity = resolveFoundationArchetypeFromSnapshot(
    snapshotWithPayload(payload),
  )

  assert.equal(identity?.code, "M/S+")
  assert.equal(
    identity?.name,
    resolveArchetype(
      resolved.result,
      getV2ScoringCalibration(resolved.scoringCalibration)
        .lowDifferentiationThreshold,
    ).name,
  )
})

test("Profile Foundation identity preserves legacy encoded identity and never infers from cached fields", () => {
  const identity = resolveFoundationArchetypeFromSnapshot(
    snapshotWithPayload(frozenV2FoundationPayload, {
      familyKey: "criticalPoliticalEconomy",
      runnerUpKey: "constructivist",
      strategyModifier: "Maximizer",
    }),
  )

  assert.equal(identity?.code, "P-")
  assert.equal(identity?.familyKey, "realist")
  assert.equal(
    resolveFoundationArchetypeFromSnapshot(
      snapshotWithPayload("not-a-foundation-payload"),
    ),
    null,
    "an invalid payload must not fall back to cached snapshot labels or scores",
  )
})

test("Profile hero identity is the payload-resolved Foundation archetype", () => {
  const source = readFileSync(
    path.join(repositoryRoot, "components/profile/profile-report.tsx"),
    "utf8",
  )

  assert.match(
    source,
    /resolveFoundationIdentityFromSnapshot\s*\(\s*foundation\s*\)/,
  )
  assert.match(source, /label=\{foundationArchetype\.name\}/)
  assert.match(source, /summary=\{foundationArchetype\.gloss\}/)
  assert.match(
    source,
    /accent=\{FAMILY_ACCENT\[foundationIdentity\.result\.familyKey\]\}/,
  )
  assert.doesNotMatch(source, /\b(?:atlasMatch|matchAtlasLiteProfile)\b/)
  assert.doesNotMatch(source, /label=\{assessment\.synthesis\}/)
})

test("Profile metadata and sharing use the Foundation archetype rather than an integrated identity", () => {
  for (const relativePath of [
    "components/profile/profile-dashboard.tsx",
    "app/profile/share/[payload]/page.tsx",
  ]) {
    const source = readFileSync(
      path.join(repositoryRoot, relativePath),
      "utf8",
    )
    assert.match(source, /resolveFoundationArchetypeFromSnapshot/)
    assert.doesNotMatch(source, /buildIntegratedHeadline/)
  }
})

test("current Foundation results present the Foundation archetype, not a Decision Pattern assignment", () => {
  const source = readFileSync(
    path.join(repositoryRoot, "app/results/[payload]/page.tsx"),
    "utf8",
  )

  assert.match(
    source,
    /<h1\b[^>]*id="foundation-result-heading"[^>]*>\s*\{archetype\.name\}\s*<\/h1>/s,
  )
  assert.doesNotMatch(
    source,
    /\b(?:atlasMatch|matchAtlasLiteFoundation|matchAtlasLiteProfile)\b/,
  )
  assert.doesNotMatch(
    source,
    /\.(?:nearest|neighbors|publicName|technicalDescriptor|fingerprint)\b/,
  )
})

test("production code has no Atlas assignment matcher references", () => {
  const forbiddenIdentifiers = new Set([
    "matchAtlasLiteFoundation",
    "matchAtlasLiteProfile",
  ])
  const findings: string[] = []

  for (const root of ["app", "components", "lib"]) {
    for (const filePath of sourceFilesUnder(path.join(repositoryRoot, root))) {
      const source = readFileSync(filePath, "utf8")
      const sourceFile = ts.createSourceFile(
        filePath,
        source,
        ts.ScriptTarget.Latest,
        true,
        filePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
      )

      visit(sourceFile, (node) => {
        if (
          ts.isIdentifier(node) &&
          forbiddenIdentifiers.has(node.text)
        ) {
          const { line } = sourceFile.getLineAndCharacterOfPosition(
            node.getStart(sourceFile),
          )
          findings.push(
            `${path.relative(repositoryRoot, filePath)}:${line + 1} (${node.text})`,
          )
        }
      })
    }
  }

  assert.deepEqual(
    findings,
    [],
    `Atlas assignment matchers remain in production:\n${findings.join("\n")}`,
  )
})

test("all legacy Decision Pattern IDs and routes remain resolvable as static editorial content", () => {
  assert.deepEqual(
    getAtlasLitePatterns().map(({ id }) => id),
    legacyDecisionPatternIds,
  )

  for (const id of legacyDecisionPatternIds) {
    assert.equal(getAtlasLitePattern(id)?.id, id)
    assert.equal(getAtlasPatternHref(id), `/explore/atlas/${id}`)
  }

  for (const routePath of [
    "app/explore/atlas/page.tsx",
    "app/explore/atlas/[id]/page.tsx",
    "app/[locale]/explore/atlas/page.tsx",
    "app/[locale]/explore/atlas/[id]/page.tsx",
  ]) {
    assert.equal(
      existsSync(path.join(repositoryRoot, routePath)),
      true,
      `${routePath} must remain available for legacy links`,
    )
  }

  for (const routePath of [
    "app/explore/atlas/[id]/page.tsx",
    "app/[locale]/explore/atlas/[id]/page.tsx",
  ]) {
    const source = readFileSync(path.join(repositoryRoot, routePath), "utf8")
    assert.match(source, /\bgetAtlasLitePattern\s*\(\s*id\s*\)/)
    assert.match(source, /\bgetAtlasLitePatterns\s*\(\s*\)/)
  }
})

function sourceFilesUnder(directory: string): string[] {
  const files: string[] = []

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...sourceFilesUnder(entryPath))
    } else if (/\.(?:ts|tsx)$/.test(entry.name)) {
      files.push(entryPath)
    }
  }

  return files
}

function visit(node: ts.Node, callback: (node: ts.Node) => void): void {
  callback(node)
  node.forEachChild((child) => visit(child, callback))
}
