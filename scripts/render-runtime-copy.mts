import { buildRuntimeCopyFixture } from "@/lib/narrative/runtime-fixtures"

const fixture = buildRuntimeCopyFixture()
const moduleOracleGaps = fixture.coverage.modules.flatMap((module) => [
  ...module.headlineBranches.uncovered.map(
    (branch) => `${module.slug}.${module.mode}.headline:${branch}`,
  ),
  ...Object.entries(module.laneBranches).flatMap(([laneKey, coverage]) =>
    coverage.uncovered.map(
      (branch) => `${module.slug}.${module.mode}.lane:${laneKey}:${branch}`,
    ),
  ),
])
const blockingGaps = [
  ...fixture.manifestValidation.missingDeclaredBlocks.map(
    (gap) => `manifest.missing:${gap}`,
  ),
  ...fixture.manifestValidation.undeclaredObservedBlocks.map(
    (gap) => `manifest.undeclared:${gap}`,
  ),
  ...fixture.manifestValidation.duplicateManifestSurfaces.map(
    (surface) => `manifest.duplicate-surface:${surface}`,
  ),
  ...moduleOracleGaps.map((gap) => `module-oracle:${gap}`),
]

process.stdout.write(`${JSON.stringify({
  ...fixture,
  validation: {
    passes: blockingGaps.length === 0,
    blockingGaps,
    moduleOracle: {
      scope:
        "Headline and lane callbacks only. This is not a claim of exhaustive module answer-space, decisive-call, card-type, page-state, or static-copy coverage.",
      gaps: moduleOracleGaps,
    },
    editorialApproval: {
      status: "not-recorded",
      meaning:
        "A row appearing in this output means it was generated for review. It does not mean a human approved the copy.",
    },
  },
}, null, 2)}\n`)

if (blockingGaps.length > 0) {
  process.exitCode = 1
}
