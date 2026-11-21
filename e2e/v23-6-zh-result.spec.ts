import { expect, test } from "@playwright/test"
import {
  buildCanonicalFoundationResult,
} from "../lib/scoring"
import {
  buildFoundationSharePayload,
  encodePayload,
  resolveFoundationPayload,
} from "../lib/share"
import { buildZhHansFoundationNarrative } from "../lib/narrative/foundation-zh-hans"
import type { DimensionScores, FoundationQuestionSet } from "../lib/types"

function currentPayload(
  scores: DimensionScores,
  questionSet: FoundationQuestionSet,
) {
  return encodePayload(
    buildFoundationSharePayload(
      buildCanonicalFoundationResult(scores),
      "zh-Hans",
      questionSet,
    ),
  )
}

const LOW_DIFFERENTIATION_CORE = currentPayload(
  {
    securityCompetition: 4,
    institutions: 4,
    domesticFilters: 4,
    normsIdentity: 4,
    politicalEconomy: 4,
    restraint: 4,
    orderJustice: 4,
  },
  "core",
)

const CLEAR_PURE_FULL = currentPayload(
  {
    securityCompetition: 6.2,
    institutions: 2.5,
    domesticFilters: 3,
    normsIdentity: 2.8,
    politicalEconomy: 3.4,
    restraint: 3,
    orderJustice: 4.7,
  },
  "fullExtended",
)

const CLOSE_BLEND_FULL = currentPayload(
  {
    securityCompetition: 4.2,
    institutions: 4.3,
    domesticFilters: 4.2,
    normsIdentity: 4.3,
    politicalEconomy: 4.2,
    restraint: 5.6,
    orderJustice: 4.2,
  },
  "fullExtended",
)

const LEGACY_RESULT = encodePayload({
  v: 3,
  ds: [4.3, 5.8, 4.9, 5.1, 4.7, 5.4, 5.3],
  fk: "institutionalist",
  nk: "constructivist",
  sm: "Restrainer",
  nm: "Pluralist",
  iv: 3,
  sv: 1,
  cv: 1,
  cl: "zh-Hans",
})

function labelsFor(payload: string) {
  const resolved = resolveFoundationPayload(payload)
  if (!resolved) throw new Error("Expected a resolvable Foundation payload.")
  const narrative = buildZhHansFoundationNarrative({
    familyKey: resolved.result.familyKey,
    runnerUpKey: resolved.result.runnerUpKey,
    strategyModifier: resolved.result.strategyModifier,
    normativeModifier: resolved.result.normativeModifier,
    dimensionScores: resolved.dimensionScores,
    scoringCalibration: resolved.scoringCalibration,
  })
  return {
    primary: narrative.familyLabel,
    runnerUp: narrative.runnerUpLabel,
  }
}

test.describe("V23.6 Simplified Chinese Foundation result at 390px", () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test("flat core keeps all seven dimensions and offers the general extension", async ({ page }) => {
    await page.goto(`/zh/results/${LOW_DIFFERENTIATION_CORE}`)
    await expect(page.locator("h1")).toHaveText("各维度均处于中点")
    await expect(page.locator("[data-foundation-mark]")).toHaveCount(0)
    await expect(page.locator("[data-foundation-dimensions] li")).toHaveCount(7)
    await expect(page.locator('a[href*="extension=full"]').first()).toBeVisible()

    const width = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }))
    expect(width.scrollWidth).toBeLessThanOrEqual(width.clientWidth)

    const body = await page.locator("main").innerText()
    expect(body).not.toContain("Chapter 01")
    expect(body).not.toContain("Registered reading")
    expect(body).not.toContain("Exact local evidence is unavailable")
    expect(body).not.toContain("Your other results on this device")
  })

  test("clear pure and close blend results keep their distinct model status", async ({ page }) => {
    const pureLabels = labelsFor(CLEAR_PURE_FULL)
    await page.goto(`/zh/results/${CLEAR_PURE_FULL}`)
    await expect(page.getByText(`${pureLabels.primary}在这次基础解释中领先`,{exact:true})).toBeVisible()
    await expect(page.getByText(
      `${pureLabels.runnerUp}仍是最近的替代解释`,
      { exact: false },
    )).toBeVisible()
    await expect(page.locator('[data-foundation-mark="pure"]')).toHaveCount(1)
    await expect(page.locator(
      '[data-zh-foundation-story-chapter="contribution"] [data-contribution-status="current-v5"] ol > li',
    ))
      .toHaveCount(7)

    const blendLabels = labelsFor(CLOSE_BLEND_FULL)
    await page.goto(`/zh/results/${CLOSE_BLEND_FULL}`)
    await expect(page.getByText(`${blendLabels.primary}与${blendLabels.runnerUp}仍然接近`,{exact:true})).toBeVisible()
    await expect(page.locator('[data-foundation-mark="blend"]')).toHaveCount(1)
    await expect(page.locator(
      '[data-zh-foundation-story-chapter="contribution"] [data-contribution-status="current-v5"] ol > li',
    ))
      .toHaveCount(7)
  })

  test("legacy and invalid links fail closed in Chinese", async ({ page }) => {
    const legacyLabels = labelsFor(LEGACY_RESULT)
    await page.goto(`/zh/results/${LEGACY_RESULT}`)
    await expect(page.getByText(`较早版本的基础解释：${legacyLabels.primary}`,{exact:true})).toBeVisible()
    await expect(page.locator(
      '[data-zh-foundation-story-chapter="contribution"] [data-contribution-status="legacy-unavailable"]',
    ))
      .toContainText("无法显示精确分类贡献")

    await page.goto("/zh/results/not-a-foundation-payload")
    await expect(page.getByRole("heading", {
      level: 1,
      name: "这个链接无法解码",
    })).toBeVisible()
    await expect(page.locator("[data-zh-foundation-result-story]"))
      .toHaveCount(0)
  })
})
