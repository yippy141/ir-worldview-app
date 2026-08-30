import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const publicCohortSurfaces = [
  "app/results/[payload]/page.tsx",
  "app/[locale]/results/[payload]/page.tsx",
  "app/api/card/route.tsx",
  "lib/share-card.ts",
  "components/results/push-chart.tsx",
  "components/results/nearest-alternative.tsx",
  "components/results/posture-strip.tsx",
]

test("Foundation results and share images cannot present cohort comparisons", () => {
  for (const path of publicCohortSurfaces) {
    const source = readFileSync(path, "utf8")

    assert.doesNotMatch(
      source,
      /readAggregateStatsForFoundationPayload|getPercentile|getProfileRarity/,
      `${path} must not read or derive aggregate comparisons`,
    )
    assert.doesNotMatch(
      source,
      /percentile|rarity|completed results in this cohort|cohort n|百分位|同组样本/iu,
      `${path} must not contain public cohort-comparison presentation`,
    )
  }
})

test("public Foundation scales use raw positions and named poles, not synthetic bands", () => {
  const resultSource = readFileSync("app/results/[payload]/page.tsx", "utf8")
  const comparisonSource = readFileSync(
    "components/results/nearest-alternative.tsx",
    "utf8",
  )
  const zhResultSource = readFileSync(
    "app/[locale]/results/[payload]/page.tsx",
    "utf8",
  )
  const zhComparisonSource = readFileSync(
    "components/i18n/zh-hans-foundation-result-story.tsx",
    "utf8",
  )

  assert.match(resultSource, /lowLabel: DIMENSION_POLES\[row\.dim\]\.low/)
  assert.match(resultSource, /highLabel: DIMENSION_POLES\[row\.dim\]\.high/)
  assert.match(comparisonSource, /\{row\.lowLabel\} — \{row\.highLabel\}/)
  assert.match(
    zhResultSource,
    /lowLabel: zhHansFoundationDimensionPoles\[row\.dim\]\.low/,
  )
  assert.match(
    zhResultSource,
    /highLabel: zhHansFoundationDimensionPoles\[row\.dim\]\.high/,
  )
  assert.match(zhComparisonSource, /\{row\.lowLabel\} — \{row\.highLabel\}/)
  assert.doesNotMatch(
    `${resultSource}\n${comparisonSource}\n${zhResultSource}\n${zhComparisonSource}`,
    /dimensionBand|dimensionBandLabels/,
  )
})
