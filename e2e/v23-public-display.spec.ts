import { expect, test } from "@playwright/test"
import { archetypes } from "../lib/archetypes"
import {
  formatArchetypeCodeSpeech,
  formatArchetypeDisplayCode,
  PUBLIC_LENS_LABELS,
} from "../lib/archetype-display"
import { buildCanonicalFoundationResult } from "../lib/scoring"
import {
  buildFoundationSharePayload,
  encodePayload,
} from "../lib/share"
import type { DimensionScores } from "../lib/types"
import { TRADITION_NOUN_LABELS } from "../lib/worldview-config"

function resultPayload(dimensionScores: DimensionScores): string {
  const result = buildCanonicalFoundationResult(dimensionScores)
  return encodePayload(
    buildFoundationSharePayload(result, "en", "fullExtended"),
  )
}

const PURE_RESULT_PAYLOAD = resultPayload({
  securityCompetition: 6.2,
  institutions: 2.5,
  domesticFilters: 3,
  normsIdentity: 2.8,
  politicalEconomy: 3.4,
  restraint: 3,
  orderJustice: 4.7,
})

const BLEND_RESULT_PAYLOAD = resultPayload({
  securityCompetition: 4.2,
  institutions: 4.3,
  domesticFilters: 4.2,
  normsIdentity: 4.3,
  politicalEconomy: 4.2,
  restraint: 5.6,
  orderJustice: 4.2,
})

test("archetype directory exposes concise link names and canonical public labels", async ({
  page,
}) => {
  await page.goto("/archetypes")

  const rows = page.locator("[data-archetype-directory] a[data-archetype-code]")
  await expect(rows).toHaveCount(8)
  for (const archetype of archetypes) {
    const row = page.locator(`[data-archetype-code="${archetype.code}"]`)
    await expect(row).toHaveAccessibleName(
      `Open ${archetype.name}, ${formatArchetypeCodeSpeech(archetype.code)}`,
    )
    await expect(row).toHaveAccessibleDescription(archetype.gloss)
    await expect(row.locator("[data-archetype-code-label]")).toHaveText(
      formatArchetypeDisplayCode(archetype.code),
    )
    await expect(row.getByText(archetype.gloss, { exact: true })).toBeVisible()
    const mark = row.locator(`[data-archetype-mark="${archetype.code}"]`)
    await expect(mark).toHaveCount(1)
    await expect(mark).toHaveAttribute("data-archetype-mark-render", "pictorial")
    await expect(mark).toHaveAttribute("data-archetype-mark-size", "48")
    await expect(mark).toHaveAttribute("aria-hidden", "true")
  }

  await expect(page.locator("[data-archetype-directory] svg")).toHaveCount(8)
  await expect(
    page.locator("[data-archetype-directory] section[data-lens] h2"),
  ).toHaveText(Object.values(PUBLIC_LENS_LABELS))
  for (const noun of Object.values(TRADITION_NOUN_LABELS)) {
    await expect(
      page.getByText(`Closest modeled tradition: ${noun}`, { exact: true }),
    ).toBeVisible()
  }
})

test("Explore keeps one canonical archetype directory and explains adjacent records", async ({
  page,
}) => {
  await page.goto("/explore")

  const archetypeSection = page.locator(
    '[data-explore-section="foundation-archetypes"]',
  )
  await expect(archetypeSection.locator("[data-explore-archetype-pair]")).toHaveCount(8)
  await expect(archetypeSection.locator("h3")).toHaveText(
    Object.values(PUBLIC_LENS_LABELS),
  )
  await expect(archetypeSection.locator("a")).toHaveCount(1)
  await expect(archetypeSection.locator("a")).toHaveAttribute("href", "/archetypes")
  for (const archetype of archetypes) {
    await expect(
      archetypeSection.getByText(archetype.gloss, { exact: true }),
    ).toHaveCount(0)
  }

  const contextSection = page.locator('[data-explore-section="focus-context"]')
  await expect(
    contextSection.getByText(
      "Security and Technology are Focus Area questionnaires; AI Governance is a separate domain result; Perspective Runs are role-conditioned comparisons; Current Cases are time-bounded judgment exercises.",
      { exact: true },
    ),
  ).toBeVisible()
  await expect(
    contextSection.getByText(
      "These records sit beside the Foundation. They do not rescore it.",
      { exact: true },
    ),
  ).toBeVisible()
  await expect(contextSection.locator("[data-explore-object-type]")).toHaveCount(0)
})

test("Foundation results render pure marks and blend Diptychs without inventing a blend mark", async ({
  page,
}) => {
  await page.goto(`/results/${PURE_RESULT_PAYLOAD}`)

  const pureMark = page.locator(
    '[data-foundation-mark="pure"][data-foundation-mark-presentation="hero"]',
  )
  await expect(pureMark).toHaveCount(1)
  await expect(pureMark.locator('[data-archetype-mark="P+"]')).toHaveAttribute(
    "data-archetype-mark-size",
    "112",
  )
  await expect(pureMark.locator("svg")).toHaveAttribute("aria-hidden", "true")
  await expect(page.getByRole("heading", {
    level: 1,
    name: "Realism leads this Foundation read",
  })).toBeVisible()
  await expect(
    page.getByRole("complementary", { name: "Registered reading" })
      .getByText("Kairos", { exact: true }),
  ).toBeVisible()

  await page.goto(`/results/${BLEND_RESULT_PAYLOAD}`)

  const blendMark = page.locator(
    '[data-foundation-mark="blend"][data-foundation-mark-layout="diptych"]',
  )
  await expect(blendMark).toHaveCount(1)
  await expect(blendMark).toHaveAttribute("data-foundation-mark-code", "R/M-")
  await expect(blendMark.locator('[data-archetype-mark="M-"]')).toHaveCount(1)
  await expect(blendMark.locator('[data-archetype-mark="R-"]')).toHaveCount(1)
  await expect(blendMark.locator('[data-archetype-mark="R/M-"]')).toHaveCount(0)
  await expect(blendMark.locator("svg")).toHaveCount(2)
  expect(
    await blendMark.locator("svg").evaluateAll((marks) =>
      marks.map((mark) => mark.getAttribute("data-archetype-mark-size")),
    ),
  ).toEqual(["112", "112"])
  await expect(blendMark.locator("[data-foundation-mark-visual]")).toHaveAttribute(
    "aria-hidden",
    "true",
  )
  await expect(blendMark.locator("[data-foundation-mark-code-label]")).toHaveText(
    "R/M−",
  )
  await expect(blendMark.locator('[data-foundation-mark-name="M-"]')).toHaveText(
    "Musyawarah",
  )
  await expect(blendMark.locator('[data-foundation-mark-name="R-"]')).toHaveText(
    "Concert",
  )
  await expect(page.getByRole("heading", {
    level: 1,
    name: "Constructivism and Institutionalism remain close",
  })).toBeVisible()
  await expect(
    page.getByRole("complementary", { name: "Registered reading" })
      .getByText("Concert–Musyawarah", { exact: true }),
  ).toBeVisible()

  const panelSizes = await blendMark
    .locator(".foundation-mark__panel")
    .evaluateAll((panels) =>
      panels.map((panel) => {
        const rect = panel.getBoundingClientRect()
        return { width: rect.width, height: rect.height }
      }),
    )
  expect(panelSizes).toEqual([
    { width: 112, height: 112 },
    { width: 112, height: 112 },
  ])
})

test("System A blend artwork holds currentColor, 200% containment, and print", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto(`/results/${BLEND_RESULT_PAYLOAD}`)

  const blendMark = page.locator('[data-foundation-mark="blend"]')
  await blendMark.evaluate((element) => {
    const mark = element as HTMLElement
    mark.style.color = "rgb(248, 248, 244)"
    mark.style.backgroundColor = "rgb(17, 17, 17)"
  })
  const reversed = await blendMark.locator("svg").evaluateAll((marks) => ({
    colors: marks.map((mark) => getComputedStyle(mark).color),
    animations: marks.flatMap((mark) => mark.getAnimations()),
  }))
  expect(reversed.colors).toEqual([
    "rgb(248, 248, 244)",
    "rgb(248, 248, 244)",
  ])
  expect(reversed.animations).toHaveLength(0)

  await page.evaluate(() => {
    document.documentElement.style.zoom = "200%"
  })
  const zoomed = await blendMark.evaluate((element) => {
    const visual = element.querySelector<HTMLElement>(
      "[data-foundation-mark-visual]",
    )
    const identity = element.closest<HTMLElement>('[aria-label="Registered reading"]')
    if (!visual || !identity) return null
    const visualRect = visual.getBoundingClientRect()
    const identityRect = identity.getBoundingClientRect()
    return {
      contained:
        visualRect.left >= identityRect.left - 1 &&
        visualRect.right <= identityRect.right + 1,
      visibleWidth: visualRect.width,
      identityWidth: identityRect.width,
    }
  })
  expect(zoomed).not.toBeNull()
  expect(zoomed?.contained).toBe(true)
  expect(zoomed?.visibleWidth).toBeLessThanOrEqual((zoomed?.identityWidth ?? 0) + 1)

  await page.evaluate(() => {
    document.documentElement.style.zoom = "100%"
  })
  await blendMark.evaluate((element) => {
    const mark = element as HTMLElement
    mark.style.removeProperty("color")
    mark.style.removeProperty("background-color")
  })
  await page.emulateMedia({ media: "print" })
  const printedBlend = await blendMark.evaluate((element) => {
    const rect = element.getBoundingClientRect()
    return {
      color: getComputedStyle(element).color,
      clipped:
        rect.width <= 0 ||
        rect.height <= 0 ||
        rect.left < -1 ||
        rect.right > document.documentElement.clientWidth + 1,
    }
  })
  expect(printedBlend.color).toBe("rgb(17, 17, 17)")
  expect(printedBlend.clipped).toBe(false)

  await page.goto("/archetypes")
  const directoryMarks = page.locator(
    '[data-archetype-directory] [data-archetype-mark-render="pictorial"]',
  )
  await expect(directoryMarks).toHaveCount(8)
  const printDirectory = await directoryMarks.evaluateAll((marks) =>
    marks.map((mark) => {
      const rect = mark.getBoundingClientRect()
      return {
        size: mark.getAttribute("data-archetype-mark-size"),
        color: getComputedStyle(mark).color,
        clipped:
          rect.width <= 0 ||
          rect.height <= 0 ||
          rect.left < -1 ||
          rect.right > document.documentElement.clientWidth + 1,
      }
    }),
  )
  expect(printDirectory.every(({ size }) => size === "48")).toBe(true)
  expect(printDirectory.every(({ color }) => color === "rgb(17, 17, 17)")).toBe(true)
  expect(printDirectory.every(({ clipped }) => !clipped)).toBe(true)
})
