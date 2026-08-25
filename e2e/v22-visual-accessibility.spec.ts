import { expect, test, type Locator, type Page } from "@playwright/test"
import { AI_GOVERNANCE_V22_TUPLE } from "../lib/ai-governance-versions"
import { encodeAiPayload } from "../lib/ai-governance-share"
import { encodeModulePayload } from "../lib/modules/framework"
import { MODULE_V22_TUPLE } from "../lib/modules/versions"
import {
  encodeProfileSharePayload,
  type ProfileSharePayload,
} from "../lib/profile-share"
import {
  parseProfileStore,
  serializeProfileStore,
  type ProfileStore,
} from "../lib/profile-store"
import {
  PROFILE_SAVE_INTENT_KEY,
  PROFILE_STORAGE_KEY,
} from "../lib/storage-keys"
import profileShareV3 from "../tests/fixtures/profile-share-v3.json"
import profileStoreV1 from "../tests/fixtures/profile-store-v1.json"
import profileStoreV2 from "../tests/fixtures/profile-store-v2.json"
import profileStoreV3 from "../tests/fixtures/profile-store-v3.json"
import profileStoreV5 from "../tests/fixtures/profile-store-v5.json"

const FOUNDATION_PAYLOAD = profileStoreV5.foundation.payload
const SHARED_PROFILE_PAYLOAD = encodeProfileSharePayload(
  profileShareV3 as ProfileSharePayload,
)

const SECURITY_PAYLOAD = encodeModulePayload({
  v: 3,
  bv: MODULE_V22_TUPLE.bankVersion,
  sv: MODULE_V22_TUPLE.scoringVersion,
  slug: "security",
  mode: "standard",
  answers: {},
})

const TECHNOLOGY_PAYLOAD = encodeModulePayload({
  v: 3,
  bv: MODULE_V22_TUPLE.bankVersion,
  sv: MODULE_V22_TUPLE.scoringVersion,
  slug: "technology",
  mode: "standard",
  answers: {},
})

const AI_PAYLOAD = encodeAiPayload({
  v: 2,
  bv: AI_GOVERNANCE_V22_TUPLE.bankVersion,
  sv: AI_GOVERNANCE_V22_TUPLE.scoringVersion,
  as: [4.2, 5.1, 6, 3.8, 4.6, 2.9, 5.4, 4],
  ak: "coordinationArchitect",
  nk: "stateCapacityBuilder",
  rl: "Frontier-risk first",
  pm: "Threshold guardrails",
  gm: "Coordination-first",
})

const LAYERED_PROFILE = buildLayeredProfile()

function buildLayeredProfile(): string {
  const foundationProfile = parseProfileStore(
    JSON.stringify(profileStoreV5),
    "en",
  )
  const security = parseProfileStore(
    JSON.stringify(profileStoreV1),
    "en",
  ).modules.security
  const technology = parseProfileStore(
    JSON.stringify(profileStoreV2),
    "en",
  ).modules.technology
  const aiGovernance = parseProfileStore(
    JSON.stringify(profileStoreV3),
    "en",
  ).aiGovernance

  if (!foundationProfile.foundation || !security || !technology || !aiGovernance) {
    throw new Error("Layered Profile fixtures did not hydrate.")
  }

  const profile: ProfileStore = {
    ...foundationProfile,
    modules: { security, technology },
    moduleHistory: [],
    aiGovernance,
    aiHistory: [],
  }
  return serializeProfileStore(profile)
}

async function seedLayeredProfile(page: Page) {
  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, value),
    { key: PROFILE_STORAGE_KEY, value: LAYERED_PROFILE },
  )
}

async function documentWidth(page: Page) {
  return page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    innerWidth: window.innerWidth,
  }))
}

type ContrastSample = {
  text: string
  foreground: string
  background: string
  ratio: number
}

async function renderedContrastSamples(locator: Locator): Promise<ContrastSample[]> {
  return locator.evaluateAll((elements) => {
    type Rgba = { r: number; g: number; b: number; a: number }

    const clamp = (value: number, low: number, high: number) =>
      Math.min(high, Math.max(low, value))

    function parseAlpha(value: string | undefined) {
      if (!value) return 1
      return value.endsWith("%")
        ? clamp(Number.parseFloat(value) / 100, 0, 1)
        : clamp(Number.parseFloat(value), 0, 1)
    }

    function parseRgbChannel(value: string) {
      return value.endsWith("%")
        ? clamp(Number.parseFloat(value) * 2.55, 0, 255)
        : clamp(Number.parseFloat(value), 0, 255)
    }

    function parseColor(value: string): Rgba {
      if (value === "transparent") return { r: 0, g: 0, b: 0, a: 0 }

      if (value.startsWith("rgb(") || value.startsWith("rgba(")) {
        const body = value.slice(value.indexOf("(") + 1, -1)
        const tokens = body
          .replaceAll(",", " ")
          .replace("/", " / ")
          .trim()
          .split(/\s+/)
        const slash = tokens.indexOf("/")
        const alpha = slash >= 0 ? tokens[slash + 1] : tokens[3]
        return {
          r: parseRgbChannel(tokens[0]),
          g: parseRgbChannel(tokens[1]),
          b: parseRgbChannel(tokens[2]),
          a: parseAlpha(alpha),
        }
      }

      if (value.startsWith("color(srgb ")) {
        const body = value.slice("color(srgb ".length, -1)
        const tokens = body.replace("/", " / ").trim().split(/\s+/)
        const slash = tokens.indexOf("/")
        return {
          r: clamp(Number.parseFloat(tokens[0]) * 255, 0, 255),
          g: clamp(Number.parseFloat(tokens[1]) * 255, 0, 255),
          b: clamp(Number.parseFloat(tokens[2]) * 255, 0, 255),
          a: parseAlpha(slash >= 0 ? tokens[slash + 1] : undefined),
        }
      }

      throw new Error(`Unsupported computed color: ${value}`)
    }

    function composite(foreground: Rgba, background: Rgba): Rgba {
      const alpha = foreground.a + background.a * (1 - foreground.a)
      if (alpha === 0) return { r: 0, g: 0, b: 0, a: 0 }
      return {
        r:
          (foreground.r * foreground.a
            + background.r * background.a * (1 - foreground.a))
          / alpha,
        g:
          (foreground.g * foreground.a
            + background.g * background.a * (1 - foreground.a))
          / alpha,
        b:
          (foreground.b * foreground.a
            + background.b * background.a * (1 - foreground.a))
          / alpha,
        a: alpha,
      }
    }

    function effectiveBackground(element: Element): Rgba {
      const layers: Rgba[] = []
      let current: Element | null = element
      while (current) {
        layers.push(parseColor(getComputedStyle(current).backgroundColor))
        current = current.parentElement
      }

      return layers
        .reverse()
        .reduce(
          (background, layer) => composite(layer, background),
          { r: 255, g: 255, b: 255, a: 1 },
        )
    }

    function luminance(color: Rgba) {
      const channels = [color.r, color.g, color.b].map((channel) => {
        const normalized = channel / 255
        return normalized <= 0.04045
          ? normalized / 12.92
          : ((normalized + 0.055) / 1.055) ** 2.4
      })
      return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
    }

    return elements.map((element) => {
      const style = getComputedStyle(element)
      const background = effectiveBackground(element)
      const foreground = composite(parseColor(style.color), background)
      const light = Math.max(luminance(foreground), luminance(background))
      const dark = Math.min(luminance(foreground), luminance(background))
      return {
        text: element.textContent?.trim() ?? "",
        foreground: style.color,
        background: style.backgroundColor,
        ratio: (light + 0.05) / (dark + 0.05),
      }
    })
  })
}

test("Foundation result keeps the archetype H1 above closest-tradition metadata", async ({
  page,
}) => {
  await page.goto(`/results/${FOUNDATION_PAYLOAD}`)

  await expect(
    page.getByRole("heading", { level: 1, name: "Concert", exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText(
      "Closest modeled tradition: Institutionalism",
      { exact: true },
    ),
  ).toBeVisible()
  await expect(page.locator("article.result-article h1")).toHaveCount(1)

  const hierarchy = await page
    .locator(
      "#foundation-result-heading, .foundation-result-tradition, .foundation-result-lede .result-lead",
    )
    .evaluateAll((elements) =>
      elements.map((element) =>
        element.id || Array.from(element.classList).find((name) =>
          name === "foundation-result-tradition" || name === "result-lead",
        ),
      ),
    )
  expect(hierarchy).toEqual([
    "foundation-result-heading",
    "foundation-result-tradition",
    "result-lead",
  ])
})

test("dark-theme result-label chips meet WCAG AA across result and Profile surfaces", async ({
  page,
}) => {
  await seedLayeredProfile(page)
  const surfaces = [
    {
      label: "Chinese Foundation result",
      path: `/zh/results/${FOUNDATION_PAYLOAD}`,
      selector: ".atlas-tag",
    },
    {
      label: "local Profile",
      path: "/profile",
      selector: ".result-card-hero__chip",
    },
    {
      label: "Chinese local Profile",
      path: "/zh/profile",
      selector: ".atlas-tag",
    },
    {
      label: "shared Profile",
      path: `/profile/share/${SHARED_PROFILE_PAYLOAD}`,
      selector: ".result-card-hero__chip",
    },
    {
      label: "Chinese shared Profile",
      path: `/zh/profile/share/${SHARED_PROFILE_PAYLOAD}`,
      selector: ".atlas-tag",
    },
  ] as const

  for (const surface of surfaces) {
    await page.goto(surface.path)
    const chips = page.locator(surface.selector)
    await expect(chips.first(), surface.label).toBeVisible()
    const samples = await renderedContrastSamples(chips)
    expect(samples.length, surface.label).toBeGreaterThan(0)
    for (const sample of samples) {
      expect(
        sample.ratio,
        `${surface.label}: ${sample.text} (${sample.foreground} on ${sample.background})`,
      ).toBeGreaterThanOrEqual(4.5)
    }
  }
})

test("a four-record Profile preserves its Foundation identity after a module save", async ({
  page,
}) => {
  await page.goto("/")
  await page.evaluate(
    ({ key, value }) => window.localStorage.setItem(key, value),
    { key: PROFILE_STORAGE_KEY, value: LAYERED_PROFILE },
  )
  await page.goto("/profile")

  const assertLayeredProfile = async () => {
    await expect(
      page.getByRole("heading", { level: 1, name: "Concert", exact: true }),
    ).toBeVisible()
    await expect(
      page.locator(".result-card-hero__chip").getByText(
        "Closest tradition: Institutionalism",
        { exact: true },
      ),
    ).toBeVisible()
    await expect(page.getByRole("heading", {
      level: 1,
      name: "Several Lenses",
      exact: true,
    })).toHaveCount(0)

    const records = page.locator("article.profile-domain-record")
    await expect(records).toHaveCount(4)
    await expect(records.filter({
      has: page.getByRole("heading", { name: "Foundation record", exact: true }),
    }).getByText("Core record", { exact: true })).toBeVisible()

    for (const title of ["Security", "Technology", "AI Governance"] as const) {
      const record = records.filter({
        has: page.getByRole("heading", { name: `${title} record`, exact: true }),
      })
      await expect(record).toBeVisible()
      await expect(
        record.getByText("Separate issue record", { exact: true }),
      ).toBeVisible()
    }
  }

  await assertLayeredProfile()
  const foundationBefore = await page.evaluate((key) => {
    const stored = window.localStorage.getItem(key)
    return stored ? JSON.parse(stored).foundation.payload : null
  }, PROFILE_STORAGE_KEY)

  const resultPath =
    `/modules/security/results/${SECURITY_PAYLOAD}`
    + `?foundation=${encodeURIComponent(FOUNDATION_PAYLOAD)}`
  await page.evaluate(
    ({ key, identity }) => {
      window.sessionStorage.setItem(
        key,
        JSON.stringify({ module: { identity, mode: "standard" } }),
      )
    },
    { key: PROFILE_SAVE_INTENT_KEY, identity: resultPath },
  )
  await page.goto(resultPath)
  await expect(page.locator(".result-verdict__name")).toBeVisible()
  await expect.poll(() => page.evaluate(
    ({ key }) => {
      const stored = window.localStorage.getItem(key)
      if (!stored) return null
      const parsed = JSON.parse(stored)
      return {
        foundation: parsed.foundation?.payload,
        security: parsed.modules?.security?.payload,
      }
    },
    { key: PROFILE_STORAGE_KEY },
  )).toEqual({
    foundation: foundationBefore,
    security: SECURITY_PAYLOAD,
  })

  await page.goto("/profile")
  await assertLayeredProfile()
  const foundationAfter = await page.evaluate((key) => {
    const stored = window.localStorage.getItem(key)
    return stored ? JSON.parse(stored).foundation.payload : null
  }, PROFILE_STORAGE_KEY)
  expect(foundationAfter).toBe(foundationBefore)
})

test.describe("390px result tables", () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test("AI and Foundation nearest alternatives preserve semantic tables without page overflow", async ({
    page,
  }) => {
    await page.goto(`/ai/results/${AI_PAYLOAD}`)
    const aiWrapper = page.locator(".alt-compare-scroll")
    await expect(aiWrapper).toBeVisible()
    await expect(aiWrapper).toHaveAttribute("role", "region")
    await expect(aiWrapper).toHaveAttribute("aria-label", /comparison table$/)
    await expect(aiWrapper.locator("table.alt-compare")).toBeVisible()
    let width = await documentWidth(page)
    expect(width.scrollWidth).toBeLessThanOrEqual(width.innerWidth + 1)

    await page.goto(`/results/${FOUNDATION_PAYLOAD}`)
    const analysis = page.locator(".result-appendix-section details.profile-details")
    await analysis.locator("summary").click()
    const foundationWrapper = analysis.locator(".alt-compare-scroll")
    await expect(foundationWrapper).toBeVisible()
    await expect(foundationWrapper).toHaveAttribute("role", "region")
    await expect(foundationWrapper).toHaveAttribute("aria-label", /comparison table$/)
    await expect(foundationWrapper.locator("table.alt-compare")).toBeVisible()
    width = await documentWidth(page)
    expect(width.scrollWidth).toBeLessThanOrEqual(width.innerWidth + 1)
  })
})

test("domain-result hero actions stay in the first viewport at 390px and 1440px", async ({
  page,
}) => {
  const surfaces = [
    {
      label: "Security with Foundation",
      path:
        `/modules/security/results/${SECURITY_PAYLOAD}`
        + `?foundation=${encodeURIComponent(FOUNDATION_PAYLOAD)}`,
      action: "View Profile",
    },
    {
      label: "Security without Foundation",
      path: `/modules/security/results/${SECURITY_PAYLOAD}`,
      action: "Take the IR Foundation",
    },
    {
      label: "Technology with Foundation",
      path:
        `/modules/technology/results/${TECHNOLOGY_PAYLOAD}`
        + `?foundation=${encodeURIComponent(FOUNDATION_PAYLOAD)}`,
      action: "View Profile",
    },
    {
      label: "Technology without Foundation",
      path: `/modules/technology/results/${TECHNOLOGY_PAYLOAD}`,
      action: "Take the IR Foundation",
    },
    {
      label: "AI Governance",
      path: `/ai/results/${AI_PAYLOAD}`,
      action: "Take the IR Foundation",
    },
  ] as const

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport)
    for (const surface of surfaces) {
      await page.goto(surface.path)
      const action = page
        .locator(".result-verdict__actions")
        .getByRole("link", { name: surface.action, exact: true })
      await expect(action, `${surface.label} at ${viewport.width}px`).toBeVisible()
      const placement = await action.evaluate((element) => {
        const rect = element.getBoundingClientRect()
        return {
          top: rect.top,
          bottom: rect.bottom,
          viewportHeight: window.innerHeight,
          scrollY: window.scrollY,
        }
      })
      expect(placement.scrollY, surface.label).toBe(0)
      expect(placement.top, surface.label).toBeGreaterThanOrEqual(0)
      expect(placement.bottom, surface.label).toBeLessThanOrEqual(
        placement.viewportHeight + 1,
      )
    }
  }
})

test("V23.1B routes reflow at 320, 390, 768, and 1440 CSS pixels", async ({
  page,
}) => {
  const routes = ["/archetypes", "/archetypes/p-minus", "/explore"]
  for (const viewport of [
    { width: 320, height: 844 },
    { width: 390, height: 844 },
    { width: 768, height: 900 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport)
    for (const route of routes) {
      await page.goto(route)
      await page.evaluate(() => document.fonts.ready)
      const width = await documentWidth(page)
      expect(
        width.scrollWidth,
        `${route} at ${viewport.width}px`,
      ).toBeLessThanOrEqual(width.clientWidth + 1)
    }
  }
})

test("V23.1B editorial measure, targets, focus, and contrast remain legible", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/explore")
  await page.evaluate(() => document.fonts.ready)

  const sectionIntros = page.locator(
    "[data-explore-section] > header > div > p",
  )
  const paragraph = sectionIntros.first()
  await expect(paragraph).toBeVisible()
  const paragraphMetrics = await paragraph.evaluate((element) => {
    const style = getComputedStyle(element)
    const probe = document.createElement("span")
    probe.style.position = "absolute"
    probe.style.visibility = "hidden"
    probe.style.display = "block"
    probe.style.fontFamily = style.fontFamily
    probe.style.fontSize = style.fontSize
    probe.style.fontWeight = style.fontWeight
    document.body.append(probe)
    probe.style.width = "65ch"
    const lowerBound = probe.getBoundingClientRect().width
    probe.style.width = "72ch"
    const upperBound = probe.getBoundingClientRect().width
    probe.remove()
    return {
      width: element.getBoundingClientRect().width,
      lowerBound,
      upperBound,
    }
  })
  expect(paragraphMetrics.width).toBeGreaterThanOrEqual(paragraphMetrics.lowerBound - 1)
  expect(paragraphMetrics.width).toBeLessThanOrEqual(paragraphMetrics.upperBound + 1)

  const contrast = await renderedContrastSamples(sectionIntros)
  expect(contrast.length).toBe(9)
  for (const sample of contrast) {
    expect(sample.ratio, sample.text).toBeGreaterThanOrEqual(4.5)
  }

  const objectTypeContrast = await renderedContrastSamples(
    page.locator("[data-explore-object-type]"),
  )
  expect(objectTypeContrast.length).toBeGreaterThan(0)
  for (const sample of objectTypeContrast) {
    expect(sample.ratio, sample.text).toBeGreaterThanOrEqual(4.5)
  }

  await page.setViewportSize({ width: 320, height: 844 })
  await page.goto("/archetypes")
  const rows = page.locator("[data-archetype-directory] a[data-archetype-code]")
  await expect(rows).toHaveCount(8)
  for (const height of await rows.evaluateAll((elements) =>
    elements.map((element) => element.getBoundingClientRect().height),
  )) {
    expect(height).toBeGreaterThanOrEqual(44)
  }

  for (let index = 0; index < 20; index += 1) {
    await page.keyboard.press("Tab")
    if (await page.evaluate(() => Boolean(document.activeElement?.hasAttribute("data-archetype-code")))) {
      break
    }
  }
  const focusedRow = page.locator("[data-archetype-code]:focus")
  await expect(focusedRow).toHaveCount(1)
  const focusStyle = await focusedRow.evaluate((element) => {
    const style = getComputedStyle(element)
    return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth) }
  })
  expect(focusStyle.style).not.toBe("none")
  expect(focusStyle.width).toBeGreaterThanOrEqual(2)

  await expect(page.locator("[data-archetype-row-action]").first()).toBeVisible()

  await page.goto("/archetypes/p-minus")
  const codeFallback = page.locator(
    "[data-archetype-detail] [data-archetype-code-label]",
  )
  await expect(codeFallback).toBeVisible()
  await expect(codeFallback).toHaveText("P−")
  const codeContainment = await codeFallback.evaluate((element) => {
    const rect = element.getBoundingClientRect()
    return {
      contained:
        rect.width > 0 &&
        rect.height > 0 &&
        rect.left >= -1 &&
        rect.right <= document.documentElement.clientWidth + 1,
    }
  })
  expect(codeContainment.contained).toBe(true)
  const mobileHeroMark = page.locator(
    '[data-archetype-detail] [data-archetype-mark="P-"]',
  )
  await expect(mobileHeroMark).toBeVisible()
  await expect(mobileHeroMark).toHaveAttribute("data-archetype-mark-size", "112")
  await expect(mobileHeroMark).toHaveAttribute("aria-hidden", "true")
  await expect(page.locator("[data-archetype-detail] svg")).toHaveCount(1)
  await expect(page.locator("[data-archetype-sigil-frame]")).toHaveCount(0)

  await page.goto("/explore")
  const mobileJumpNav = page.getByRole("navigation", { name: "On this page" })
  await expect(mobileJumpNav).toBeHidden()
})

test("V23.1B code labels, marks, and sources remain legible in print", async ({
  page,
}) => {
  test.skip(!process.env.CI, "Print regressions run against the production server.")
  await page.setViewportSize({ width: 768, height: 900 })
  await page.goto("/archetypes/p-minus")
  const codeFallback = page.locator(
    "[data-archetype-detail] [data-archetype-code-label]",
  )
  await expect(codeFallback).toBeVisible()
  await expect(codeFallback).toHaveText("P−")
  const heroMark = page.locator(
    '[data-archetype-detail] [data-archetype-mark="P-"]',
  )
  await expect(heroMark).toBeVisible()
  await expect(heroMark).toHaveAttribute("data-archetype-mark-render", "pictorial")
  await expect(heroMark).toHaveAttribute("data-archetype-mark-size", "112")
  await expect(page.locator("[data-archetype-detail] svg")).toHaveCount(1)

  await page.emulateMedia({ media: "print" })
  const printState = await codeFallback.evaluate((element) => {
    const rect = element.getBoundingClientRect()
    return {
      text: element.textContent,
      bodyBackground: getComputedStyle(document.body).backgroundColor,
      clipped:
        rect.width <= 0 ||
        rect.height <= 0 ||
        rect.left < -1 ||
        rect.right > document.documentElement.clientWidth + 1,
      width: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }
  })
  expect(printState.text).toBe("P−")
  expect(printState.bodyBackground).toBe("rgb(255, 255, 255)")
  expect(printState.clipped).toBe(false)
  expect(printState.width).toBeLessThanOrEqual(printState.clientWidth + 1)
  const codeContrast = await renderedContrastSamples(codeFallback)
  expect(codeContrast).toHaveLength(1)
  expect(codeContrast[0].ratio).toBeGreaterThanOrEqual(4.5)

  const printMarkState = await heroMark.evaluate((element) => {
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
  expect(printMarkState.color).toBe("rgb(17, 17, 17)")
  expect(printMarkState.clipped).toBe(false)

  const printedSourceUrl = await page
    .locator("[data-archetype-source-ledger] a[href^='http']")
    .first()
    .evaluate((element) => getComputedStyle(element, "::after").content)
  expect(printedSourceUrl).toContain("http")

  await page.goto("/explore")
  const disclosures = page.locator("[data-explore-section] details")
  await expect(disclosures).toHaveCount(3)
  const disclosureState = await disclosures.evaluateAll((elements) =>
    elements.map((element) => {
      const body = element.querySelector(":scope > :not(summary)")
      return {
        bodyDisplay: body ? getComputedStyle(body).display : null,
        bodyHeight: body?.getBoundingClientRect().height ?? 0,
      }
    }),
  )
  for (const disclosure of disclosureState) {
    expect(disclosure.bodyDisplay).not.toBe("none")
    expect(disclosure.bodyHeight).toBeGreaterThan(0)
  }
  const explorePrintWidth = await documentWidth(page)
  expect(explorePrintWidth.scrollWidth).toBeLessThanOrEqual(
    explorePrintWidth.clientWidth + 1,
  )
})

test("AI hero renders the archetype once and retains exactly three scoped modifiers", async ({
  page,
}) => {
  await page.goto(`/ai/results/${AI_PAYLOAD}`)
  const hero = page.locator(".result-verdict")
  await expect(
    hero.getByText("Coordination Architect", { exact: true }),
  ).toHaveCount(1)
  const code = hero.locator(".result-verdict__code")
  await expect(code).not.toContainText("Coordination Architect")
  await expect(code.locator(":scope > span")).toHaveCount(3)
  await expect(code).toContainText("Frontier-risk first")
  await expect(code).toContainText("Threshold guardrails")
  await expect(code).toContainText("Coordination-first")
})

for (const nativeShare of [false, true] as const) {
  test(`Foundation share actions render the ${nativeShare ? "native-share" : "copy-fallback"} capability state`, async ({
    page,
  }) => {
    await page.addInitScript((supported) => {
      Object.defineProperty(window.navigator, "share", {
        configurable: true,
        value: supported ? async () => undefined : undefined,
      })
      if (!supported) {
        Object.defineProperty(document, "execCommand", {
          configurable: true,
          value: () => false,
        })
        Object.defineProperty(window.navigator, "clipboard", {
          configurable: true,
          value: {
            writeText: async () => {
              throw new Error("Clipboard unavailable in capability-state test.")
            },
          },
        })
      }
    }, nativeShare)
    await page.goto(`/results/${FOUNDATION_PAYLOAD}`)
    const disclosure = page.locator(
      ".result-appendix-section details.profile-details",
    )
    await disclosure.locator("summary").click()
    const actions = disclosure.locator(".result-details-body")

    if (nativeShare) {
      await expect(
        actions.getByRole("button", { name: "Share result", exact: true }),
      ).toBeVisible()
      await expect(
        actions.getByRole("button", { name: "Copy link", exact: true }),
      ).toBeVisible()
    } else {
      await expect(
        actions.getByRole("button", { name: "Copy share link", exact: true }),
      ).toBeVisible()
      await expect(
        actions.getByRole("button", { name: "Copy link", exact: true }),
      ).toHaveCount(0)
      const primaryCopy = actions.getByRole("button", {
        name: "Copy share link",
        exact: true,
      })
      await expect(primaryCopy).toHaveAttribute("aria-live", "polite")
      await primaryCopy.click()
      await expect(
        actions.getByRole("button", { name: "Copy unavailable", exact: true }),
      ).toBeVisible()
      const fallback = actions.getByLabel("Foundation share link")
      await expect(fallback).toBeVisible()
      await expect(fallback).toHaveValue(page.url())
    }

    await expect(
      actions.getByRole("button", { name: "Save as PDF", exact: true }),
    ).toBeVisible()
    await expect(
      actions.getByRole("button", {
        name: "Retake the Foundation questionnaire",
        exact: true,
      }),
    ).toBeVisible()
  })
}

test("production print expands closed Foundation analysis and restores screen collapse", async ({
  page,
}) => {
  test.skip(!process.env.CI, "Print regressions run against the production server.")
  await page.goto(`/results/${FOUNDATION_PAYLOAD}`)
  const disclosure = page.locator(".result-appendix-section details.profile-details")
  const summary = disclosure.locator("summary")
  const body = disclosure.locator(".result-details-body")

  await expect(disclosure).not.toHaveAttribute("open", "")
  await expect(body).toBeHidden()
  const collapsedHeaderHeight = await summary.evaluate(
    (element) => element.getBoundingClientRect().height,
  )

  await page.emulateMedia({ media: "print" })
  await expect(disclosure).not.toHaveAttribute("open", "")
  await expect(body).toBeVisible()
  const printMetrics = await disclosure.evaluate((element) => {
    const content = element.querySelector<HTMLElement>(".result-details-body")
    const pseudo = getComputedStyle(element, "::details-content")
    return {
      detailsHeight: element.getBoundingClientRect().height,
      bodyHeight: content?.getBoundingClientRect().height ?? 0,
      pseudoBlockSize: pseudo.blockSize,
      pseudoHeight: pseudo.height,
      pseudoOverflow: pseudo.overflow,
      pseudoContentVisibility: pseudo.contentVisibility,
    }
  })
  expect(printMetrics.bodyHeight).toBeGreaterThan(collapsedHeaderHeight * 3)
  expect(printMetrics.detailsHeight).toBeGreaterThan(collapsedHeaderHeight * 3)
  expect(printMetrics.detailsHeight).toBeGreaterThanOrEqual(
    printMetrics.bodyHeight - 1,
  )
  expect(printMetrics.pseudoBlockSize).not.toBe("0px")
  expect(printMetrics.pseudoHeight).not.toBe("0px")
  expect(printMetrics.pseudoOverflow).toBe("visible")
  expect(printMetrics.pseudoContentVisibility).toBe("visible")

  await page.emulateMedia({ media: "screen" })
  await expect(disclosure).not.toHaveAttribute("open", "")
  await expect(body).toBeHidden()
})

test("production print renders Profile detail bodies instead of empty bordered bars", async ({
  page,
}) => {
  test.skip(!process.env.CI, "Print regressions run against the production server.")
  await seedLayeredProfile(page)
  await page.goto("/profile")
  const aiDisclosure = page.locator("details.profile-details").filter({
    has: page.getByText("AI result details", { exact: true }),
  })
  const aiBody = aiDisclosure.locator(".profile-collapsed-detail")
  await expect(aiDisclosure).not.toHaveAttribute("open", "")
  await expect(aiBody).toBeHidden()

  await page.emulateMedia({ media: "print" })
  await expect(aiBody).toBeVisible()
  const details = await page.locator("details.profile-details").evaluateAll(
    (elements) => elements.map((element) => {
      const summary = element.querySelector(":scope > summary")
      const content = Array.from(element.children).filter(
        (child) => child.tagName !== "SUMMARY",
      )
      return {
        totalHeight: element.getBoundingClientRect().height,
        summaryHeight: summary?.getBoundingClientRect().height ?? 0,
        contentHeight: content.reduce(
          (height, child) => height + child.getBoundingClientRect().height,
          0,
        ),
      }
    }),
  )
  expect(details.length).toBeGreaterThanOrEqual(3)
  for (const detail of details) {
    expect(detail.contentHeight).toBeGreaterThan(20)
    expect(detail.totalHeight).toBeGreaterThan(detail.summaryHeight + 20)
  }

  await page.emulateMedia({ media: "screen" })
  await expect(aiDisclosure).not.toHaveAttribute("open", "")
  await expect(aiBody).toBeHidden()
})
