import { expect, test, type Page } from "@playwright/test"
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { PROFILE_STORAGE_KEY, QUIZ_STORAGE_KEY } from "../../lib/storage-keys"

const route = "/dev/product-refoundation"
const labels = ["Start", "Cases", "Field Guide", "My Record"]
const output = path.resolve("docs/prototypes/product-refoundation-v1")
const fixture = (version: number) => JSON.parse(readFileSync(path.resolve(`tests/fixtures/profile-store-v${version}.json`), "utf8"))
const profile = fixture(4)
profile.modules.technology = fixture(2).modules.technology
profile.aiGovernance = fixture(3).aiGovernance
const bank = JSON.parse(readFileSync(path.resolve("content/instrument/foundation.v2.json"), "utf8"))
const answers = Object.fromEntries(bank.items.filter((item: { tier: string }) => item.tier === "core").slice(0, 8).map((item: { id: string }) => [item.id, 4]))

async function returning(page: Page) {
  await page.addInitScript(({ profileKey, sessionKey, savedProfile, draftAnswers }) => {
    localStorage.setItem(profileKey, JSON.stringify(savedProfile))
    localStorage.setItem(sessionKey, JSON.stringify({ v: 7, questionSet: "core", orderSeed: "refoundation-evidence", answers: draftAnswers }))
  }, { profileKey: PROFILE_STORAGE_KEY, sessionKey: QUIZ_STORAGE_KEY, savedProfile: profile, draftAnswers: answers })
}

async function ready(page: Page) {
  await page.goto(route)
  await expect(page.locator("main")).toHaveAttribute("data-prototype-local", "ready")
  await page.evaluate(() => document.fonts.ready)
  // Hide only the framework's dev-tools badge, not any product UI.
  await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" })
}

test("development renders, production fails closed with an actual 404", async ({ page, request }) => {
  const dev = await page.goto(route)
  expect(dev?.status()).toBe(200)
  const prod = await request.get(`http://127.0.0.1:3218${route}`)
  expect(prod.status()).toBe(404)
  expect(await prod.text()).not.toContain("How do you explain")
})

for (const width of [1440, 390, 320, 768]) {
  test(`${width}px layout, first-screen navigation, touch targets and no overflow`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 })
    await ready(page)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    const names = await page.getByRole("tab").evaluateAll((tabs) => tabs.map((tab) => tab.getAttribute("aria-label")))
    expect(names).toEqual(labels)
    const sizes = await page.getByRole("tab").evaluateAll((tabs) => tabs.map((tab) => tab.getBoundingClientRect().height))
    expect(sizes.every((height) => height >= 44)).toBe(true)
    if (width === 390) {
      const last = await page.getByRole("tab", { name: "My Record", exact: true }).boundingBox()
      expect(last!.y + last!.height).toBeLessThanOrEqual(844)
    }
  })
}

test("arrow keys select each area; Tab reaches every entry without changing selection", async ({ page }) => {
  await returning(page)
  await ready(page)
  await page.getByRole("tab", { name: "Start", exact: true }).focus()
  const globe = await page.locator("[data-prototype-globe]").innerHTML()
  const geometry = await page.getByRole("tablist").boundingBox()
  const entries = ["Enter Start", "Enter Cases", "Open Field Guide", "Open My Record"]
  mkdirSync(output, { recursive: true })
  for (let index = 0; index < labels.length; index++) {
    if (index) {
      await page.getByRole("tab", { name: labels[index - 1], exact: true }).focus()
      await page.keyboard.press("ArrowDown")
    }
    await expect(page.getByRole("tab", { name: labels[index], exact: true })).toBeFocused()
    await expect(page.getByRole("tabpanel")).toHaveAccessibleName(labels[index])
    expect(await page.getByRole("tablist").boundingBox()).toEqual(geometry)
    expect(await page.locator("[data-prototype-globe]").innerHTML()).toEqual(globe)
    await page.screenshot({ path: path.join(output, `sequence-${index + 1}-${labels[index].toLowerCase().replaceAll(" ", "-")}.png`) })
    for (let step = 0; step < 16; step++) {
      await page.keyboard.press("Tab")
      if (await page.getByRole("link", { name: entries[index], exact: true }).evaluate((element) => element === document.activeElement)) break
    }
    await expect(page.getByRole("link", { name: entries[index], exact: true })).toBeFocused()
    await expect(page.getByRole("tabpanel")).toHaveAccessibleName(labels[index])
    await page.screenshot({ path: path.join(output, `sequence-${index + 1}-entry-focus.png`) })
  }
  await page.getByRole("tab", { name: "Start", exact: true }).click()
  await expect(page.getByRole("tabpanel")).toHaveAccessibleName("Start")
  await page.getByRole("tab", { name: "Cases", exact: true }).click()
  await expect(page.getByRole("tabpanel")).toHaveAccessibleName("Cases")
  expect(page.url()).toBe(`http://127.0.0.1:3217${route}`)
})

test("no Mapbox request, console error or client-side prefetch while opening all areas", async ({ page }) => {
  const requests: string[] = []
  const errors: string[] = []
  page.on("request", (request) => requests.push(request.url()))
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()) })
  await ready(page)
  for (const label of labels) await page.getByRole("tab", { name: label, exact: true }).click()
  expect(requests.filter((url) => /mapbox|tiles\.map|events\.map/iu.test(url))).toEqual([])
  expect(requests.filter((url) => /[?&]_rsc=/u.test(url))).toEqual([])
  expect(errors).toEqual([])
  expect(await page.locator("canvas").count()).toBe(0)
  mkdirSync(output, { recursive: true })
  writeFileSync(path.join(output, "network-check.json"), JSON.stringify({ requests, errors, mapboxRequests: 0 }, null, 2))
})

test("returning state is read-only, shows saved areas, and does not move the index", async ({ page }) => {
  await ready(page)
  const before = await page.getByRole("tablist").boundingBox()
  await page.evaluate(({ key, data }) => {
    localStorage.setItem(key, JSON.stringify(data))
    window.dispatchEvent(new StorageEvent("storage", { key }))
  }, { key: PROFILE_STORAGE_KEY, data: profile })
  await expect(page.getByText(/Latest result:/u)).toBeVisible()
  expect(await page.getByRole("tablist").boundingBox()).toEqual(before)
  await page.getByRole("tab", { name: "My Record", exact: true }).click()
  await expect(page.getByText("Also saved: Security, Technology, AI Governance.")).toBeVisible()
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), PROFILE_STORAGE_KEY)).toEqual(profile)
})

for (const width of [1440, 390]) {
  for (const state of ["first-time", "returning", "reduced-motion"]) {
    test(`capture ${width} ${state}`, async ({ page }) => {
      await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 })
      if (state === "returning") await returning(page)
      if (state === "reduced-motion") await page.emulateMedia({ reducedMotion: "reduce" })
      await ready(page)
      if (state === "returning") await expect(page.getByText("Continue First Principles · 8 of 14", { exact: true })).toBeVisible()
      if (state === "reduced-motion") {
        const motion = await page.locator("[data-prototype-globe]").evaluate((element) => ({ animation: getComputedStyle(element).animationName, transition: getComputedStyle(element).transitionDuration }))
        expect(motion).toEqual({ animation: "none", transition: "0s" })
      }
      mkdirSync(output, { recursive: true })
      await page.screenshot({ path: path.join(output, `${width}-${state}.png`) })
    })
  }
}

test("the compact explanation opens in-page, without routing into Method", async ({ page }) => {
  await ready(page)
  await page.getByText("See how the project works", { exact: true }).click()
  await expect(page.getByText("The broad starting point.", { exact: true })).toBeVisible()
  expect(page.url()).toBe(`http://127.0.0.1:3217${route}`)
})
