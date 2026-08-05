import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const RESULT_SCORE_SOURCES = [
  "app/results/[payload]/page.tsx",
  "app/[locale]/results/[payload]/page.tsx",
  "app/ai/results/[payload]/page.tsx",
  "components/modules/module-result.tsx",
  "components/results/nearest-alternative.tsx",
  "components/results/posture-strip.tsx",
  "components/results/push-chart.tsx",
  "components/visual-primitives.tsx",
  "app/[locale]/profile/share/[payload]/page.tsx",
  "content/locales/zh-Hans/profile-records.ts",
] as const

test("result score surfaces never print a nominal seven-point denominator", () => {
  for (const relativePath of RESULT_SCORE_SOURCES) {
    const source = readFileSync(
      new URL(`../${relativePath}`, import.meta.url),
      "utf8",
    )

    assert.doesNotMatch(
      source,
      /(?:\/\s*7\b|\b(?:out of|of)\s+7\b)/i,
      relativePath,
    )
  }
})
