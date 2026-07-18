import { expect, test } from "@playwright/test"
import { getLatestPublishedCurrentCase } from "../lib/current-cases/catalog"

const approvedPairs = [
  { en: "/about", zh: "/zh/about", heading: /辨认你反复依赖的外交政策论证/ },
  { en: "/method", zh: "/zh/method", heading: "这项清单如何工作" },
  { en: "/privacy", zh: "/zh/privacy", heading: /结果只保存在当前浏览器/ },
  { en: "/feedback", zh: "/zh/feedback", heading: "报告事实、隐私或安全问题。" },
  { en: "/cases", zh: "/zh/cases", heading: "在正在发生的事务中作出判断" },
] as const

// Frozen tests/fixtures/profile-share-v3.json encoded with the shared codec.
const PROFILE_SHARE_V3_TOKEN =
  "eyJ2IjozLCJmIjp7InQiOjE3NTAwMDAwMDAwMDAsInAiOiJleUoySWpveUxDSmtjeUk2V3pRdU15dzFMamdzTkM0NUxEVXVNU3cwTGpjc05TNDBMRFV1TTEwc0ltWnJJam9pYVc1emRHbDBkWFJwYjI1aGJHbHpkQ0lzSW01cklqb2lZMjl1YzNSeWRXTjBhWFpwYzNRaUxDSnpiU0k2SWxKbGMzUnlZV2x1WlhJaUxDSnViU0k2SWxCc2RYSmhiR2x6ZENKOSIsImwiOiJlbiIsImN2IjoxfSwibXMiOltdLCJwdiI6MX0"

test("approved English and Simplified Chinese route pairs remain distinct", async ({ page }) => {
  await page.goto("/")
  await expect(page.locator("html")).toHaveAttribute("lang", "en")
  await expect(page.getByRole("link", { name: "Switch to Simplified Chinese" })).toBeVisible()

  await page.goto("/zh")
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans")
  await expect(page.getByRole("heading", { name: "看清你在世界政治问题上依赖哪些论证。" })).toBeVisible()

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

test("unapproved Chinese payload routes preserve opaque segments and show the status notice", async ({ page }) => {
  const paths = [
    "/zh/results/v2_A-b.9_payload",
    "/zh/ai/results/ai_A-b.9_payload",
    "/zh/modules/security/results/module_A-b.9_payload?foundation=f_123",
    "/zh/perspectives/exposed-ally/result/run_A-b.9_payload",
  ]

  for (const pathname of paths) {
    await page.goto(pathname)
    expect(page.url()).toContain(pathname)
    await expect(page.getByRole("heading", {
      name: "此页面的简体中文内容尚未通过编辑审校。",
    })).toBeVisible()
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans")
  }

  await page.goto("/zh/results/switch_A-b.9?source=share#reading-path")
  await page.getByRole("link", { name: "切换至英文" }).last().click()
  await expect(page).toHaveURL(/\/results\/switch_A-b\.9\?source=share#reading-path$/)
})

test("one canonical Profile Share V3 payload renders in English and Chinese", async ({ page }) => {
  const englishPath = `/profile/share/${PROFILE_SHARE_V3_TOKEN}`
  const chinesePath = `/zh${englishPath}`

  await page.goto(englishPath)
  await expect(page.locator("html")).toHaveAttribute("lang", "en")
  await expect(page.getByRole("heading", {
    name: /clearly Liberal Institutionalist/,
  })).toBeVisible()
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${englishPath}$`))
  await expect(page.locator('link[rel="alternate"][hreflang="zh-Hans"]')).toHaveAttribute(
    "href",
    new RegExp(`${chinesePath}$`),
  )

  await page.goto(`${chinesePath}?source=shared-profile#foundation`)
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans")
  await expect(page.getByRole("heading", { name: "自由制度主义：一份连续画像" })).toBeVisible()
  await expect(page.getByText("5.80 / 7")).toBeVisible()
  await page.getByRole("link", { name: "切换至英文" }).last().click()
  await expect(page).toHaveURL(
    new RegExp(`${englishPath}\\?source=shared-profile#foundation$`),
  )
})

test("English and Chinese /current redirects preserve route slugs and locale", async ({ page }) => {
  const current = getLatestPublishedCurrentCase()
  expect(current).not.toBeNull()
  if (!current) return

  await page.goto("/current")
  await expect(page).toHaveURL(new RegExp(`/cases/${current.slug}$`))

  await page.goto("/zh/current")
  await expect(page).toHaveURL(new RegExp(`/zh/cases/${current.slug}$`))
  await expect(page.getByRole("heading", {
    name: "此页面的简体中文内容尚未通过编辑审校。",
  })).toBeVisible()
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

test.describe("390px Simplified Chinese shell", () => {
  test.use({ viewport: { width: 390, height: 844 } })

  for (const pathname of [
    "/zh",
    "/zh/method",
    "/zh/results/mobile_payload",
    `/zh/profile/share/${PROFILE_SHARE_V3_TOKEN}`,
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
})
