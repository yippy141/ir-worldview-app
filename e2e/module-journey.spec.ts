import { expect, test, type Page } from "@playwright/test"
import { moduleJourneyFixture } from "./fixtures/module-journey"
import { MODULE_DRAFT_STORAGE_KEY, PROFILE_STORAGE_KEY } from "../lib/storage-keys"
import { encodeModulePayload, resolveModulePayload } from "../lib/modules/framework"
import { buildModuleDecisiveCalls } from "../lib/modules/result-copy"
import { buildModuleInterpretation } from "../lib/results/module-interpretation"
import { SUPPORTED_MODULE_VERSIONS } from "../lib/modules/versions"
import { encodeUrlPayload } from "../lib/url-payload"
import { buildCompatibleProfileSharePayload, encodeProfileSharePayload } from "../lib/profile-share"
import { parseProfileStore } from "../lib/profile-store"
import profileStoreV5 from "../tests/fixtures/profile-store-v5.json"

const frame = (page: Page) => page.locator("section.quiz-question-frame")
const heading = (page: Page) => frame(page).getByRole("heading", { level: 2 })

async function tabTo(page: Page, target: ReturnType<Page["locator"]>) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (await target.evaluate(node => node === document.activeElement)) return
    await page.keyboard.press(test.info().project.use.browserName === "webkit" ? "Alt+Tab" : "Tab")
  }
  throw new Error("Target was not reachable by Tab")
}

async function seedReview(page: Page, fixture: ReturnType<typeof moduleJourneyFixture>) {
  // Seed away from the player so its initial save effect cannot overwrite the fixture.
  await page.goto("/method")
  fixture.draft.stage = "review"
  fixture.draft.currentQuestionId = null
  await page.evaluate(({ key, store }) => localStorage.setItem(key, JSON.stringify(store)), { key: MODULE_DRAFT_STORAGE_KEY, store: fixture.store })
  await page.goto(`/modules/${fixture.context.slug}`)
  await expect(page.getByRole("heading", { name: "Check your answers" })).toBeFocused()
}

for (const slug of ["security", "technology"] as const) {
  for (const mode of ["standard", "analyst"] as const) {
    test(`${slug} ${mode}: start, keyboard, mode drafts, incomplete review and reload`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" })
      const fixture = moduleJourneyFixture(slug, mode)
      await page.goto(`/modules/${slug}`)
      await expect(page.getByRole("region", { name: "Introduction and scope" })).toBeVisible()
      await expect(frame(page)).toHaveCount(0)
      if (mode === "analyst") await page.getByRole("button", { name: /A Advanced/ }).click()
      const start = page.getByRole("button", { name: "Start questions", exact: true })
      await tabTo(page, start)
      await page.keyboard.press("Enter")
      await expect(heading(page)).toBeFocused()
      await expect(page.locator("#module-introduction")).toHaveCount(0)
      const question = fixture.questions[0]
      await expect(frame(page)).toContainText(question.scene)
      await expect(frame(page)).toContainText(question.whyHard)
      await expect(frame(page)).toContainText(question.prompt)
      for (const option of question.options) await expect(frame(page)).toContainText(option.label)
      await expect(frame(page).getByRole("button", { name: "Next", exact: true })).toBeDisabled()
      const firstOption = frame(page).locator("button.option-card").first()
      await tabTo(page, firstOption)
      await page.keyboard.press("Space")
      await expect(firstOption).toHaveAttribute("aria-pressed", "true")
      await expect(heading(page)).toHaveText(question.title)
      const modeControl = page.getByRole("combobox", { name: "Mode", exact: true })
      await modeControl.selectOption(mode === "standard" ? "analyst" : "standard")
      await expect(heading(page)).toHaveText(question.title)
      await expect(heading(page)).toBeFocused()
      await modeControl.selectOption(mode)
      await expect(heading(page)).toBeFocused()
      await expect(frame(page).locator('button.option-card[aria-pressed="true"]')).toHaveCount(1)
      const next = frame(page).getByRole("button", { name: "Next", exact: true })
      await tabTo(page, next)
      await page.keyboard.press("Enter")
      await expect(heading(page)).toHaveText(fixture.questions[1].title)
      await page.reload()
      await expect(heading(page)).toBeFocused()
      await expect(heading(page)).toHaveText(fixture.questions[1].title)

      const select = page.getByRole("combobox", { name: "Mode", exact: true })
      await select.selectOption(mode === "standard" ? "analyst" : "standard")
      await expect(heading(page)).toHaveText(question.title)
      await expect(heading(page)).toBeFocused()
      await expect(frame(page).locator('button.option-card[aria-pressed="true"]')).toHaveCount(0)
      await select.selectOption(mode)
      await expect(heading(page)).toHaveText(fixture.questions[1].title)

      await page.getByRole("button", { name: "Introduction and scope" }).click()
      await expect(page.getByRole("heading", { level: 1 })).toBeFocused()
      await page.getByRole("button", { name: "Continue questions" }).click()
      await expect(heading(page)).toBeFocused()
      await page.getByRole("button", { name: "Review answers", exact: true }).click()
      await expect(page.getByRole("heading", { name: "Check your answers" })).toBeFocused()
      await expect(page.getByRole("button", { name: /^See .* result/ })).toBeDisabled()
      await expect(page.locator("#module-incomplete")).toContainText(`${fixture.questions.length - 1} unanswered`)
      await page.reload()
      // Existing draft normalization returns an incomplete review to its first missing answer.
      await expect(heading(page)).toHaveText(fixture.questions[1].title)
      await expect(heading(page)).toBeFocused()
      await page.getByRole("button", { name: "Review answers", exact: true }).click()
      await page.getByRole("button", { name: "Answer missing questions" }).click()
      await expect(heading(page)).toHaveText(fixture.questions[1].title)
    })

    test(`${slug} ${mode}: review edit, exact result evidence, standalone Profile`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" })
      const fixture = moduleJourneyFixture(slug, mode)
      await page.goto(`/modules/${slug}`)
      await seedReview(page, fixture)
      await page.getByRole("button", { name: /^Change answer 1:/ }).click()
      await expect(heading(page)).toBeFocused()
      const replacement = fixture.questions[0].options[1]
      await frame(page).getByRole("button", { name: new RegExp(replacement.title) }).first().click()
      fixture.answers[fixture.questions[0].id] = { primary: replacement.id }
      if (mode === "analyst") {
        const secondary = fixture.questions[0].options[2]
        const secondaryButton = frame(page).locator("button.secondary-choice-button").filter({ hasText: secondary.title })
        if (await secondaryButton.count()) {
          await secondaryButton.click()
          fixture.answers[fixture.questions[0].id].secondary = secondary.id
        }
      }
      await expect.poll(() => page.evaluate(key => JSON.parse(localStorage.getItem(key)!).drafts, MODULE_DRAFT_STORAGE_KEY))
        .toMatchObject({ [Object.keys(fixture.store.drafts)[0]]: { answers: fixture.answers } })
      await page.reload()
      await expect(heading(page)).toBeFocused()
      await expect(frame(page).locator('button.option-card[aria-pressed="true"]')).toContainText(replacement.title)
      await page.getByRole("button", { name: "Review answers", exact: true }).click()
      await page.reload()
      await expect(page.getByRole("heading", { name: "Check your answers" })).toBeFocused()
      await expect(page.locator("ol li").first()).toContainText(replacement.label)
      await page.getByRole("button", { name: /^See .* result/ }).click()
      await expect(page).toHaveURL(new RegExp(`/modules/${slug}/results/`))
      const encoded = new URL(page.url()).pathname.split("/").at(-1)!
      const resolved = resolveModulePayload(encoded)!
      expect(resolved.payload.answers).toEqual(fixture.answers)
      expect([resolved.bankVersion, resolved.scoringVersion]).toEqual([fixture.version.bankVersion, fixture.version.scoringVersion])
      const result = fixture.version.runtime.buildModuleResult(fixture.version.definition, mode, fixture.answers)
      await expect(page.locator(".result-verdict__name")).toHaveText(result.headline)
      const interpretation = buildModuleInterpretation(fixture.version.definition, result, fixture.questions.filter(q => q.cardType !== "actorLens").length, { ...fixture.version, mode })
      await expect(page.locator(".result-verdict__gloss")).toHaveText(interpretation.summary)
      await expect(page.locator(".result-application")).toContainText(interpretation.example.rival)
      const selected = fixture.version.runtime.getSelectedModuleOptions(fixture.version.definition, mode, fixture.answers)
        .filter(({ question }) => question.cardType !== "actorLens")
      const calls = buildModuleDecisiveCalls({ moduleDefinition: fixture.version.definition, selected, laneLabelMap: Object.fromEntries(fixture.version.definition.lanes.map(lane => [lane.key, lane.label])) })
      const evidence = page.getByRole("region", { name: "Choices behind this reading" })
      for (const call of calls.slice(0, 2)) {
        const exact = selected.find(({ question }) => question.id === call.id)!
        await expect(evidence).toContainText(exact.primary!.title)
        await expect(evidence).toContainText(exact.primary!.label)
        if (exact.secondary) await expect(evidence).toContainText(exact.secondary.label)
      }
      expect(await page.locator(".result-article > section h2").allTextContents()).toEqual(expect.arrayContaining(["Choices behind this reading", "Your lane results", `${fixture.version.definition.shortTitle} axes`]))
      const order = await page.locator(".result-article > section > h2").allTextContents()
      expect(order.indexOf("Choices behind this reading")).toBeLessThan(order.indexOf("Your lane results"))
      await expect(page.getByRole("link", { name: "View Profile", exact: true })).toHaveCount(1)
      await expect(page.getByRole("link", { name: slug === "security" ? "Who gets to verify? →" : "Who gets access? →", exact: true })).toBeVisible()
      await expect.poll(() => page.evaluate(key => JSON.parse(localStorage.getItem(key) ?? "{}").modules, PROFILE_STORAGE_KEY))
        .toMatchObject({ [slug]: { payload: encoded, scores: result.scores } })
      await page.getByRole("link", { name: "View Profile", exact: true }).click()
      await expect(page.getByText("No Foundation read is saved", { exact: true })).toBeVisible()
      const resultLink = page.getByRole("link", { name: `Open ${fixture.version.definition.shortTitle} result`, exact: true })
      await expect(resultLink).toHaveCount(1)
      await resultLink.click()
      await expect(page.locator(".result-verdict__name")).toHaveText(result.headline)
    })
  }
}

test("legacy, partial and answer-absent shared results preserve their exact banks without saving", async ({ page }) => {
  test.setTimeout(90_000)
  for (const slug of ["security", "technology"] as const) {
    for (const version of SUPPORTED_MODULE_VERSIONS[slug]) {
      const question = version.runtime.getModuleQuestions(version.definition, "standard")[0]
      for (const answers of [{ [question.id]: { primary: question.options[0].id } }, {}]) {
        const payload = { v: 3 as const, bv: version.bankVersion, sv: version.scoringVersion, slug, mode: "standard" as const, answers }
        const path = `/modules/${slug}/results/${encodeModulePayload(payload)}`
        await page.goto(path)
        await expect(page.locator(".result-verdict__name")).toHaveText(version.runtime.buildModuleResult(version.definition, "standard", answers).headline)
        if (Object.keys(answers).length) {
          await expect(page.getByRole("region", { name: "Choices behind this reading" })).toContainText(question.options[0].label)
        } else {
          await expect(page.getByText(/This link contains no scored answer selections/)).toBeVisible()
          await expect(page.getByRole("region", { name: "Choices behind this reading" })).toHaveCount(0)
        }
        expect(await page.evaluate(key => localStorage.getItem(key), PROFILE_STORAGE_KEY)).toBeNull()
      }
    }
    // The unversioned-bank wire formats dispatch to the registered historical bank.
    const legacy = SUPPORTED_MODULE_VERSIONS[slug][0]
    const question = legacy.definition.questionsByMode.standard[0]
    for (const v of [1, 2]) {
      await page.goto(`/modules/${slug}/results/${encodeUrlPayload({ v, slug, ...(v === 2 ? { mode: "standard" } : {}), answers: { [question.id]: { primary: question.options[0].id } } })}`)
      await expect(page.getByRole("region", { name: "Choices behind this reading" })).toContainText(question.options[0].label)
    }
  }
  await page.getByRole("link", { name: "View Profile", exact: true }).click()
  await expect(page.getByRole("heading", { name: "No Profile records are saved yet." })).toBeVisible()
})

test("actor-only records keep their existing result without posing as scored-answer evidence", async ({ page }) => {
  for (const slug of ["security", "technology"] as const) {
    const fixture = moduleJourneyFixture(slug, "analyst")
    const actor = fixture.questions.find(question => question.cardType === "actorLens")!
    const answers = { [actor.id]: { primary: actor.options[0].id } }
    const payload = encodeModulePayload({ v: 3, bv: fixture.version.bankVersion, sv: fixture.version.scoringVersion, slug, mode: "analyst", answers })
    await page.goto(`/modules/${slug}/results/${payload}`)
    await expect(page.locator(".result-verdict__name")).toHaveText(fixture.version.runtime.buildModuleResult(fixture.version.definition, "analyst", answers).headline)
    await expect(page.getByText(/This link contains no scored answer selections/)).toBeVisible()
    await expect(page.getByRole("region", { name: "Choices behind this reading" })).toHaveCount(0)
    await page.locator("summary").filter({ hasText: "Recorded answers and perspective choices" }).click()
    await expect(page.locator("details[open] .result-details-body")).toContainText(actor.options[0].label)
    expect(await page.evaluate(key => localStorage.getItem(key), PROFILE_STORAGE_KEY)).toBeNull()
  }
})

test("multiple standalone modules retain direct links; shared Profile does not import records", async ({ page, browser }) => {
  test.setTimeout(60_000)
  const fixtures = [moduleJourneyFixture("security", "standard"), moduleJourneyFixture("technology", "analyst")]
  for (const fixture of fixtures) {
    await page.goto(`/modules/${fixture.context.slug}`)
    await seedReview(page, fixture)
    await page.getByRole("button", { name: /^See .* result/ }).click()
    await expect(page.locator(".result-verdict__name")).toBeVisible()
    await expect.poll(() => page.evaluate(({ key, slug }) => Boolean(JSON.parse(localStorage.getItem(key) ?? "{}").modules?.[slug]), { key: PROFILE_STORAGE_KEY, slug: fixture.context.slug })).toBe(true)
  }
  await page.getByRole("link", { name: "View Profile", exact: true }).click()
  for (const fixture of fixtures) await expect(page.getByRole("link", { name: `Open ${fixture.version.definition.shortTitle} result`, exact: true })).toHaveAttribute("href", fixture.resultPath)
  const raw = await page.evaluate(key => localStorage.getItem(key), PROFILE_STORAGE_KEY)
  const profile = parseProfileStore(raw)
  expect(profile.foundation).toBeNull()
  expect(buildCompatibleProfileSharePayload(profile)).toBeNull()
  // Sharing still requires a Foundation; reuse the existing synthetic baseline fixture.
  const sharedProfile = parseProfileStore(JSON.stringify(profileStoreV5))
  sharedProfile.modules = profile.modules
  const share = buildCompatibleProfileSharePayload(sharedProfile)!
  const context = await browser.newContext()
  const shared = await context.newPage()
  await shared.goto(new URL(`/profile/share/${encodeProfileSharePayload(share)}`, page.url()).href)
  await expect(shared.getByText("Security record", { exact: true })).toBeVisible()
  await expect(shared.getByText("Technology record", { exact: true })).toBeVisible()
  expect(await shared.evaluate(key => localStorage.getItem(key), PROFILE_STORAGE_KEY)).toBeNull()
  await context.close()
})

test("320/390/768/1440 reflow, reduced motion, print and no-JS boundaries", async ({ page, browser }) => {
  test.setTimeout(90_000)
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: "reduce" })
    for (const slug of ["security", "technology"] as const) {
      const fixture = moduleJourneyFixture(slug, "analyst")
      await page.goto(`/modules/${slug}`)
      await seedReview(page, fixture)
      await expect(page.getByRole("region", { name: "Introduction and scope" })).toHaveCount(0)
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
      await page.getByRole("button", { name: /^Change answer 1:/ }).click()
      await expect(heading(page)).toBeFocused()
      expect(await frame(page).evaluate(node => getComputedStyle(node).animationName)).toBe("none")
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
      const box = await heading(page).boundingBox()
      const header = await page.locator(".quiz-shell-header").boundingBox()
      expect(box!.y).toBeGreaterThanOrEqual(header!.height)
      await page.goto(fixture.resultPath)
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
    }
  }
  // Browser printing fires this event; media emulation alone does not.
  await expect(page.getByRole("button", { name: "Print this reading" })).toBeVisible()
  await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")))
  await page.emulateMedia({ media: "print" })
  await expect(page.getByRole("link", { name: "View Profile", exact: true })).not.toBeVisible()
  await expect(page.getByRole("heading", { name: "Evidence log", exact: true })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Technology axes", exact: true })).toBeVisible()
  await page.evaluate(() => window.dispatchEvent(new Event("afterprint")))
  await page.emulateMedia({ media: "screen" })
  await expect(page.locator("details").filter({ has: page.locator("summary", { hasText: "Recorded answers and perspective choices" }) })).not.toHaveAttribute("open")
  const context = await browser.newContext({ javaScriptEnabled: false })
  const noJS = await context.newPage()
  await noJS.goto(new URL("/modules/security", page.url()).href, { waitUntil: "networkidle" })
  await expect(noJS.getByText("Enable JavaScript to answer questions or resume a draft on this device.")).toBeVisible()
  await expect(noJS.getByText("Loading your draft…")).not.toBeVisible()
  await noJS.goto(new URL(moduleJourneyFixture("security", "standard").resultPath, page.url()).href)
  await expect(noJS.getByRole("region", { name: "Choices behind this reading" })).toBeVisible()
  await noJS.locator("summary").filter({ hasText: "Recorded answers and perspective choices" }).click()
  await expect(noJS.getByRole("heading", { name: "Scored evidence log" })).toBeVisible()
  await context.close()
})
