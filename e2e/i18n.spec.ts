import { expect, test, type Page } from "@playwright/test"
import { getPublishedCurrentCases } from "../lib/current-cases/catalog"
import {
  PROFILE_STORAGE_KEY,
  QUIZ_STORAGE_KEY,
  RESULT_HISTORY_STORAGE_KEY,
} from "../lib/storage-keys"
import profileStoreV5 from "../tests/fixtures/profile-store-v5.json"
import { getAtlasLitePattern } from "../lib/atlas-lite"
import { REFERENCE_PROFILE_CATALOG } from "../lib/reference-profiles/catalog"
import { getFoundationQuestionsForSet } from "../lib/quiz-schema"
import { encodePayload, resolveFoundationPayload } from "../lib/share"
import { getZhHansFoundationQuestionsForSet } from "../content/locales/zh-Hans/foundation-instrument"

const approvedPairs = [
  { en: "/about", zh: "/zh/about", heading: /看清你在外交政策问题上依赖哪些论证/ },
  { en: "/method", zh: "/zh/method", heading: "这项清单如何工作" },
  {
    en: "/privacy",
    zh: "/zh/privacy",
    heading: /原始答案与已保存的历史记录只保存在当前浏览器/,
  },
  { en: "/feedback", zh: "/zh/feedback", heading: "报告事实、隐私或安全问题。" },
  {
    en: "/beta",
    zh: "/zh/beta",
    heading: "帮助检验这项清单是否清楚、公平并具有实际用途。",
  },
  { en: "/cases", zh: "/zh/cases", heading: "近期案例" },
] as const

// Frozen tests/fixtures/profile-share-v3.json encoded with the shared codec.
const PROFILE_SHARE_V3_TOKEN =
  "eyJ2IjozLCJmIjp7InQiOjE3NTAwMDAwMDAwMDAsInAiOiJleUoySWpveUxDSmtjeUk2V3pRdU15dzFMamdzTkM0NUxEVXVNU3cwTGpjc05TNDBMRFV1TTEwc0ltWnJJam9pYVc1emRHbDBkWFJwYjI1aGJHbHpkQ0lzSW01cklqb2lZMjl1YzNSeWRXTjBhWFpwYzNRaUxDSnpiU0k2SWxKbGMzUnlZV2x1WlhJaUxDSnViU0k2SWxCc2RYSmhiR2x6ZENKOSIsImwiOiJlbiIsImN2IjoxfSwibXMiOltdLCJwdiI6MX0"

const FOUNDATION_SHARE_V3_TOKEN = encodePayload({
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

async function settleVisualSnapshot(page: Page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        caret-color: transparent !important;
        transition: none !important;
      }
      nextjs-portal { display: none !important; }
    `,
  })
  await page.evaluate(async () => {
    await document.fonts.ready
    window.scrollTo(0, 0)
  })
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
}

test("approved English and Simplified Chinese route pairs remain distinct", async ({ page }) => {
  await page.goto("/")
  await expect(page.locator("html")).toHaveAttribute("lang", "en")
  await expect(page.getByRole("link", { name: "Switch to Simplified Chinese" })).toBeVisible()

  await page.goto("/zh")
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans")
  await expect(page.getByRole("heading", { name: "选择一个起点。" })).toBeVisible()

  for (const pair of approvedPairs) {
    const englishResponse = await page.goto(pair.en)
    expect(englishResponse?.status(), pair.en).toBe(200)
    await expect(page.locator("html")).toHaveAttribute("lang", "en")

    const chineseResponse = await page.goto(pair.zh)
    expect(chineseResponse?.status(), pair.zh).toBe(200)
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans")
    await expect(page.getByRole("heading", { name: pair.heading })).toBeVisible()
  }

  await page.goto("/en/about")
  await expect(page).toHaveURL(/\/about$/)
})

test("internal zh-Hans paths redirect to the canonical public Chinese surface", async ({
  page,
}) => {
  await page.goto("/zh-Hans/explore/atlas?q=rules")
  const atlasUrl = new URL(page.url())
  expect(atlasUrl.pathname).toBe("/zh/explore/atlas")
  expect(atlasUrl.searchParams.get("q")).toBe("rules")
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans")
  await expect(
    page.getByRole("heading", { name: "世界观地图", exact: true }),
  ).toBeVisible()
  await expect(page.locator("[data-archetype-matrix]")).toHaveCount(0)
  await expect(page.getByRole("heading", { name: "Worldview Map", exact: true }))
    .toHaveCount(0)

  await page.goto("/zh-Hans/archetypes")
  await expect(page).toHaveURL(/\/zh\/archetypes$/)
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans")
  await expect(page.getByRole("status")).toBeVisible()
  await expect(page.locator("[data-archetype-mark]")).toHaveCount(0)
})

test("remaining unapproved Chinese instrument routes preserve opaque segments and show the questionnaire notice", async ({ page }) => {
  const paths = [
    "/zh/ai/results/ai_A-b.9_payload",
    "/zh/modules/security/results/module_A-b.9_payload?foundation=f_123",
    "/zh/perspectives/exposed-ally/result/run_A-b.9_payload",
  ]

  for (const pathname of paths) {
    await page.goto(pathname)
    expect(page.url()).toContain(pathname)
    await expect(page.getByRole("heading", {
      name: "中文版问卷正在校对。",
    })).toBeVisible()
    await expect(page.getByText("You may continue to the English questionnaire.")).toBeVisible()
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans")
  }

  await page.goto("/zh/ai/results/switch_A-b.9?source=share#reading-path")
  await page.getByRole("link", { name: "切换至英文" }).last().click()
  await expect(page).toHaveURL(/\/ai\/results\/switch_A-b\.9\?source=share#reading-path$/)
})

test("Chinese Foundation route uses localized item copy with the shared structure", async ({ page }) => {
  const canonical = getFoundationQuestionsForSet("core")[0]
  const localized = getZhHansFoundationQuestionsForSet("core")[0]

  await page.goto("/zh/quiz")
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans")
  await expect(page.getByRole("heading", { name: "基础问卷", exact: true })).toBeVisible()
  await expect(page.getByRole("heading", { name: localized.prompt })).toBeVisible()
  await expect(page.getByText(canonical.prompt, { exact: true })).toHaveCount(0)
  await expect(page.getByText("简体中文改编测试版", { exact: true })).toBeVisible()
})

test("Chinese Foundation review records canonical version and completion-locale provenance", async ({ page }) => {
  const questions = getFoundationQuestionsForSet("core")
  const answers = Object.fromEntries(questions.map((question) => [
    question.id,
    question.kind === "likert" ? 4 : question.options[0].id,
  ]))
  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, value),
    {
      key: QUIZ_STORAGE_KEY,
      value: JSON.stringify({
        v: 4,
        activeMode: "standard",
        contextAssist: false,
        answers,
      }),
    },
  )

  await page.goto("/zh/quiz/review")
  await expect(page.getByRole("heading", { name: "复核你的基础问卷答案" })).toBeVisible()
  await expect(page.getByText(questions[0].prompt, { exact: true })).toHaveCount(0)
  await page.getByRole("button", { name: "生成我的结果 →" }).click()
  await expect(page).toHaveURL(/\/zh\/results\/[A-Za-z0-9_-]+$/)
  await expect(page.getByRole("heading", { name: "简体中文改编测试版完成记录" })).toBeVisible()

  const payload = decodeURIComponent(new URL(page.url()).pathname.split("/").at(-1) ?? "")
  const resolved = resolveFoundationPayload(payload)
  expect(resolved?.provenance).toEqual({
    instrumentStructuralVersion: 4,
    instrumentVersion: 2,
    scoringVersion: 2,
    localeCopyVersion: 1,
    completionLocale: "zh-Hans",
    resultTier: "core",
    questionSet: "core",
  })
})

test("one canonical Foundation result payload renders in English and Chinese", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: () => false,
    })
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (value: string) => {
          const testWindow = window as typeof window & { __foundationShareLink?: string }
          testWindow.__foundationShareLink = value
        },
      },
    })
  })
  const englishPath = `/results/${FOUNDATION_SHARE_V3_TOKEN}`
  const chinesePath = `/zh${englishPath}`

  await page.goto(englishPath)
  await expect(page.locator("html")).toHaveAttribute("lang", "en")
  await expect(
    page.getByText("Closest modeled tradition: Institutionalism", { exact: true }),
  ).toBeVisible()
  await expect(page.locator('link[rel="alternate"][hreflang="zh-Hans"]')).toHaveAttribute(
    "href",
    new RegExp(`${chinesePath}$`),
  )

  await page.goto(chinesePath)
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans")
  await expect(page.getByRole("heading", { name: "Concert" })).toBeVisible()
  await expect(
    page.getByText("最相邻传统：自由制度主义", { exact: true }),
  ).toBeVisible()
  await expect(page.getByText(/原型专名沿用基础模型的规范名称/)).toBeVisible()
  await expect(page.getByText("结构版本 3 · 计分版本 1 · 文案版本 1")).toBeVisible()
  await expect(page.getByText("You first ask whether", { exact: false })).toHaveCount(0)
  await page.getByRole("button", { name: "复制分享链接" }).click()
  await expect(page.getByRole("button", { name: "已复制", exact: true })).toBeVisible()
  const copiedShare = await page.evaluate(() => ({
    link: (window as typeof window & { __foundationShareLink?: string }).__foundationShareLink,
    origin: window.location.origin,
  }))
  expect(copiedShare.link).toBe(`${copiedShare.origin}${chinesePath}`)

  await page.getByRole("link", { name: "切换至英文" }).last().click()
  await expect(page).toHaveURL(new RegExp(`${englishPath}$`))
})

test("Foundation history follows payload provenance rather than the viewing locale", async ({ page }) => {
  const resolved = resolveFoundationPayload(FOUNDATION_SHARE_V3_TOKEN)
  expect(resolved).not.toBeNull()
  if (!resolved) return

  const englishSnapshot = {
    timestamp: 1,
    schemaVersion: 3,
    familyKey: resolved.result.familyKey,
    neighborKey: resolved.result.runnerUpKey,
    strategyModifier: resolved.result.strategyModifier,
    normativeModifier: resolved.result.normativeModifier,
    dimensionScores: resolved.dimensionScores,
    locale: "en",
    localeCopyVersion: 1,
  }
  await page.addInitScript(
    ({ key, snapshot }) => localStorage.setItem(key, JSON.stringify([snapshot])),
    { key: RESULT_HISTORY_STORAGE_KEY, snapshot: englishSnapshot },
  )

  await page.goto(`/results/${FOUNDATION_SHARE_V3_TOKEN}`)
  await expect.poll(async () => page.evaluate((key) => {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw).length : 0
  }, RESULT_HISTORY_STORAGE_KEY)).toBe(2)

  const history = await page.evaluate((key) =>
    JSON.parse(localStorage.getItem(key) ?? "[]"), RESULT_HISTORY_STORAGE_KEY)
  expect(history[0]).toMatchObject({ locale: "zh-Hans", localeCopyVersion: 1 })
  expect(history[1]).toMatchObject({ locale: "en", localeCopyVersion: 1 })
})

test("one canonical Profile Share V3 payload renders in English and Chinese", async ({ page }) => {
  const englishPath = `/profile/share/${PROFILE_SHARE_V3_TOKEN}`
  const chinesePath = `/zh${englishPath}`

  await page.goto(englishPath)
  await expect(page.locator("html")).toHaveAttribute("lang", "en")
  await expect(page.getByRole("heading", { name: "Concert" })).toBeVisible()
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${englishPath}$`))
  await expect(page.locator('link[rel="alternate"][hreflang="zh-Hans"]')).toHaveAttribute(
    "href",
    new RegExp(`${chinesePath}$`),
  )

  await page.goto(`${chinesePath}?source=shared-profile#foundation`)
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans")
  await expect(page.getByRole("heading", { name: "Concert" })).toBeVisible()
  await expect(page.getByText(/原型专名/).first()).toBeVisible()
  await expect(page.getByText("5.80")).toBeVisible()
  await page.getByRole("link", { name: "切换至英文" }).last().click()
  await expect(page).toHaveURL(
    new RegExp(`${englishPath}\\?source=shared-profile#foundation$`),
  )
})

test("Chinese Profile derives display labels from canonical saved records", async ({ page }) => {
  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, value),
    { key: PROFILE_STORAGE_KEY, value: JSON.stringify(profileStoreV5) },
  )
  await page.goto("/zh/profile")
  await expect(page.getByRole("heading", { name: "Concert" })).toBeVisible()
  await expect(page.getByRole("heading", {
    name: "最相邻的模型传统：自由制度主义",
  })).toBeVisible()
  await expect(page.getByText("第二相邻参照：社会建构主义")).toBeVisible()
  await expect(page.getByText("制度与规则")).toBeVisible()
  await expect(page.getByText("Liberal Institutionalist")).toHaveCount(0)
})

test("approved Chinese long-form routes never silently render unapproved English prose", async ({ page }) => {
  const current = getPublishedCurrentCases()[0] ?? null
  expect(current).not.toBeNull()
  if (current) {
    await page.goto(`/zh/cases/${current.slug}`)
    await expect(page.getByText(current.briefing, { exact: true })).toHaveCount(0)
  }

  const pattern = getAtlasLitePattern("institution-builder")
  expect(pattern).not.toBeNull()
  if (pattern) {
    await page.goto(`/zh/explore/atlas/${pattern.id}`)
    await expect(page.getByText(pattern.detailSummary, { exact: true })).toHaveCount(0)
    await expect(page.getByText(pattern.cardPressureNote, { exact: true })).toHaveCount(0)
  }

  const reference = REFERENCE_PROFILE_CATALOG.profiles.find((profile) => profile.id === "john-mearsheimer")
  expect(reference).toBeDefined()
  if (reference) {
    await page.goto(`/zh/explore/reference/${reference.id}`)
    await expect(page.getByText(reference.summary, { exact: true })).toHaveCount(0)
    await expect(page.getByText(reference.scopeNote, { exact: true })).toHaveCount(0)
    if (reference.scope !== "ai-governance") {
      for (const estimate of Object.values(reference.dimensionEstimates)) {
        if (estimate) await expect(page.getByText(estimate.note, { exact: true })).toHaveCount(0)
      }
    }
  }
})

test("English and Chinese /current routes preserve locale when no launch case is active", async ({ page }) => {
  await page.goto("/current")
  await expect(page).toHaveURL(/\/cases$/)
  await expect(page.getByRole("heading", { name: "Recent cases" })).toBeVisible()
  await expect(page.locator("li").getByText("Current case", { exact: true })).toHaveCount(0)

  await page.goto("/zh/current")
  await expect(page).toHaveURL(/\/zh\/cases$/)
  await expect(page.getByRole("heading", { name: "近期案例" })).toBeVisible()
  await expect(page.locator("li").getByText("当前案例", { exact: true })).toHaveCount(0)
  await expect(page.locator("li").first()).toContainText("待复核")
  await expect(page.locator("li").last()).toContainText("背景案例")
})

test("Current Case keeps its locale-neutral draft IDs and step across language switching", async ({ page }) => {
  const current = getPublishedCurrentCases()[0] ?? null
  expect(current).not.toBeNull()
  if (!current) return

  await page.goto(`/zh/cases/${current.slug}`)
  await page.getByRole("button", { name: "作出初步判断" }).click()
  await page.locator('input[name="initial-option"]').first().check()
  await page.locator('input[name="initial-confidence"][value="3"]').check()
  await page.getByRole("button", { name: "继续", exact: true }).click()
  await page.locator('input[type="checkbox"]').first().check()

  await page.getByRole("link", { name: "切换至英文" }).first().click()
  await expect(page).toHaveURL(new RegExp(`/cases/${current.slug}$`))
  await expect(
    page.getByRole("heading", { name: "Which reasons shaped your first judgment?" }),
  ).toBeVisible()
  await expect(page.locator('input[type="checkbox"]').first()).toBeChecked()

  await page.getByRole("link", { name: "Switch to Simplified Chinese" }).first().click()
  await expect(page).toHaveURL(new RegExp(`/zh/cases/${current.slug}$`))
  await expect(page.getByRole("heading", { name: "哪些理由影响了你的初步判断？" })).toBeVisible()
  await expect(page.locator('input[type="checkbox"]').first()).toBeChecked()
})

test("language switching preserves pathname, query, and hash without a locale cookie", async ({ page, context }) => {
  await page.goto("/about?source=language-test#limits")
  await page.getByRole("link", { name: "Switch to Simplified Chinese" }).click()
  await expect(page).toHaveURL(/\/zh\/about\?source=language-test#limits$/)
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans")

  await page.getByRole("link", { name: "切换至英文" }).first().click()
  await expect(page).toHaveURL(/\/about\?source=language-test#limits$/)
  await expect(page.locator("html")).toHaveAttribute("lang", "en")

  const localeCookies = (await context.cookies()).filter((cookie) =>
    cookie.name.toLowerCase().includes("locale"),
  )
  expect(localeCookies).toEqual([])
})

test("approved route metadata exposes canonical and reciprocal language alternates", async ({ page }) => {
  for (const pathname of ["/about", "/zh/about"] as const) {
    await page.goto(pathname)
    const expectedCanonical = pathname.startsWith("/zh") ? "/zh/about" : "/about"
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      new RegExp(`${expectedCanonical.replaceAll("/", "\\/")}$`),
    )
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      "href",
      /\/about$/,
    )
    await expect(page.locator('link[rel="alternate"][hreflang="zh-Hans"]')).toHaveAttribute(
      "href",
      /\/zh\/about$/,
    )
  }
})

test("Chinese continuation links stay in locale and preserve review-status handoffs", async ({ page }) => {
  await page.goto("/zh/explore/atlas")
  await expect(page.getByRole("link", { name: "完成基础问卷 →" })).toHaveAttribute(
    "href",
    "/zh/quiz",
  )
  await expect(page.getByRole("link", { name: "尝试另一种战略处境 →" })).toHaveAttribute(
    "href",
    "/zh/perspectives",
  )

  await page.goto("/zh/profile")
  await expect(page.getByRole("link", { name: "开始简体中文基础问卷" })).toHaveAttribute(
    "href",
    "/zh/quiz",
  )
})

test("Chinese Worldview Map never double-prefixes a localized saved result", async ({ page }) => {
  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, value),
    { key: PROFILE_STORAGE_KEY, value: JSON.stringify(profileStoreV5) },
  )
  await page.goto("/zh/explore/atlas?layers=my-profile,atlas-patterns&view=list")

  const savedResultLink = page.locator('a[href*="/results/"]').filter({ hasText: "打开" }).first()
  await expect(savedResultLink).toHaveAttribute("href", /^\/zh\/results\//)
  await expect(savedResultLink).not.toHaveAttribute("href", /\/zh\/zh\//)
})

test("Chinese Current Case and profile routes expose localized Open Graph metadata", async ({ page, request }) => {
  const current = getPublishedCurrentCases()[0] ?? null
  expect(current).not.toBeNull()
  if (!current) return

  await page.goto(`/zh/cases/${current.slug}`)
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /[\u3400-\u9fff]/u)
  const imageUrl = await page.locator('meta[property="og:image"]').getAttribute("content")
  expect(imageUrl).toBeTruthy()
  if (imageUrl) {
    const imageResponse = await request.get(imageUrl)
    expect(imageResponse.status()).toBe(200)
    expect(imageResponse.headers()["content-type"]).toContain("image/png")
    expect((await imageResponse.body()).byteLength).toBeGreaterThan(10_000)
  }

  await page.goto("/zh/explore/atlas/institution-builder")
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "规则与合作｜决策模式")
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", /这种决策模式/u)
})

test("English and Chinese share routes are private and no-store", async ({ request }) => {
  test.skip(!process.env.CI, "Next dev intentionally replaces page cache headers with no-cache.")

  for (const pathname of [
    "/results/cache-test-payload",
    "/zh/results/cache-test-payload",
    "/profile/share/cache-test-payload",
    "/zh/profile/share/cache-test-payload",
  ]) {
    const response = await request.get(pathname)
    expect(response.headers()["cache-control"], pathname).toBe("private, no-store, max-age=0")
  }
})

test("World Stage sends only its origin to the restricted Mapbox token", async ({ request }) => {
  for (const pathname of ["/", "/zh"]) {
    const response = await request.get(pathname)
    expect(response.headers()["referrer-policy"], pathname).toBe(
      "strict-origin-when-cross-origin",
    )
  }

  const privateResponse = await request.get("/results/referrer-policy-test")
  expect(privateResponse.headers()["referrer-policy"]).toBe("no-referrer")
})

test.describe("390px Simplified Chinese shell", () => {
  test.use({ viewport: { width: 390, height: 844 } })

  const current = getPublishedCurrentCases()[0] ?? null
  const dynamicPaths = current
    ? [`/zh/cases/${current.slug}`, `/zh/cases/${current.slug}/sources`]
    : []

  for (const pathname of [
    "/zh",
    "/zh/method",
    "/zh/quiz",
    "/zh/results/mobile_payload",
    `/zh/results/${FOUNDATION_SHARE_V3_TOKEN}`,
    `/zh/profile/share/${PROFILE_SHARE_V3_TOKEN}`,
    "/zh/profile",
    "/zh/explore/atlas",
    "/zh/explore/atlas/institution-builder",
    "/zh/explore/reference",
    "/zh/explore/reference/john-mearsheimer",
    ...dynamicPaths,
  ] as const) {
    test(`${pathname} stays within the viewport`, async ({ page }) => {
      await page.goto(pathname)
      const dimensions = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }))
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth)
      await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans")
    })
  }

  test("approved Chinese editorial and source-ledger snapshots", async ({ page }) => {
    await page.goto("/zh/method")
    await expect(page.getByRole("heading", { name: "这项清单如何工作" })).toBeVisible()
    await settleVisualSnapshot(page)
    await expect(page).toHaveScreenshot("zh-method-390.png")

    await page.goto("/zh/quiz")
    await expect(page.getByRole("heading", {
      name: getZhHansFoundationQuestionsForSet("core")[0].prompt,
    })).toBeVisible()
    await settleVisualSnapshot(page)
    await expect(page).toHaveScreenshot("zh-foundation-quiz-390.png")

    await page.goto(`/zh/results/${FOUNDATION_SHARE_V3_TOKEN}`)
    await expect(page.locator("main h1")).toBeVisible()
    await settleVisualSnapshot(page)
    await expect(page).toHaveScreenshot("zh-foundation-result-390.png")

    if (current) {
      await page.goto(`/zh/cases/${current.slug}/sources`)
      await expect(page.locator("main h1")).toBeVisible()
      await settleVisualSnapshot(page)
      await expect(page).toHaveScreenshot("zh-current-case-sources-390.png")
    }
  })

  test("Chinese Foundation result remains stable under the Windows CJK font stack", async ({ page }) => {
    await page.goto(`/zh/results/${FOUNDATION_SHARE_V3_TOKEN}`)
    await page.addStyleTag({
      content: `
        html:lang(zh-Hans) {
          --font-serif: "Microsoft YaHei", "SimSun", "Noto Serif CJK SC", serif;
          --font-sans: "Microsoft YaHei", "Noto Sans CJK SC", sans-serif;
        }
      `,
    })
    await expect(page.locator("main h1")).toBeVisible()
    await settleVisualSnapshot(page)
    await expect(page).toHaveScreenshot("zh-foundation-result-windows-font-390.png")
  })
})

test("Chinese Current Case print keeps the source ledger and CJK print stack", async ({ page }) => {
  const current = getPublishedCurrentCases()[0] ?? null
  expect(current).not.toBeNull()
  if (!current) return

  await page.goto(`/zh/cases/${current.slug}`)
  await page.emulateMedia({ media: "print" })
  const summary = page.locator('[aria-label="可打印的当前案例摘要"]')
  await expect(summary).toBeVisible()
  await expect(page.getByRole("heading", { name: current.title })).toBeHidden()
  const printState = await summary.evaluate((element) => ({
    fontFamily: getComputedStyle(element).fontFamily,
    metadataFontFamily: getComputedStyle(element.querySelector("dt")!).fontFamily,
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
    hasOriginalTitle: element.textContent?.includes("原文标题：") ?? false,
  }))
  expect(printState.fontFamily).toMatch(/Songti|STSong|SimSun|Noto Serif CJK/)
  expect(printState.metadataFontFamily).toMatch(/PingFang|Hiragino|Microsoft YaHei|Noto Sans CJK/)
  expect(printState.metadataFontFamily).not.toMatch(/Arial/)
  expect(printState.documentWidth).toBeLessThanOrEqual(printState.viewportWidth)
  expect(printState.hasOriginalTitle).toBe(true)
})

test("approved Chinese routes have renderable CJK glyphs", async ({ page }) => {
  const current = getPublishedCurrentCases()[0] ?? null
  const paths = [
    "/zh",
    "/zh/method",
    "/zh/quiz",
    `/zh/results/${FOUNDATION_SHARE_V3_TOKEN}`,
    "/zh/explore/atlas",
    "/zh/explore/atlas/institution-builder",
    "/zh/explore/reference/john-mearsheimer",
    ...(current ? [`/zh/cases/${current.slug}/sources`] : []),
  ]

  for (const pathname of paths) {
    await page.goto(pathname)
    const missing = await page.evaluate(() => {
      const visible = Array.from(document.querySelectorAll<HTMLElement>("body *"))
        .filter((element) => {
          const style = getComputedStyle(element)
          const rect = element.getBoundingClientRect()
          return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0
        })
      const samples = new Map<string, { char: string; family: string }>()
      for (const element of visible) {
        const family = getComputedStyle(element).fontFamily
        for (const char of (element.textContent ?? "").match(/[\u3400-\u9fff\uf900-\ufaff]/gu) ?? []) {
          samples.set(`${family}\u0000${char}`, { char, family })
        }
      }

      const canvas = document.createElement("canvas")
      canvas.width = 64
      canvas.height = 64
      const context = canvas.getContext("2d", { willReadFrequently: true })
      if (!context) return ["Canvas 2D unavailable"]
      const fingerprint = (char: string, family: string) => {
        context.clearRect(0, 0, 64, 64)
        context.font = `40px ${family}`
        context.fillStyle = "#000"
        context.textBaseline = "top"
        context.fillText(char, 4, 4)
        const pixels = context.getImageData(0, 0, 64, 64).data
        let hash = 2166136261
        let ink = 0
        for (let index = 3; index < pixels.length; index += 4) {
          const alpha = pixels[index]
          if (alpha) ink += 1
          hash = Math.imul(hash ^ alpha, 16777619)
        }
        return `${ink}:${hash >>> 0}`
      }

      const failures: string[] = []
      for (const { char, family } of samples.values()) {
        const actual = fingerprint(char, family)
        const replacement = fingerprint("�", family)
        const unassigned = fingerprint("\uffff", family)
        if (actual.startsWith("0:") || actual === replacement || actual === unassigned) {
          failures.push(`${char} (${family})`)
        }
      }
      return failures.slice(0, 20)
    })
    expect(missing, pathname).toEqual([])
  }
})
