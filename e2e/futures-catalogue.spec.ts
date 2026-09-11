import { test, expect, type Page } from "@playwright/test"
import { isAllowedFooterPrefetch, type ObservedRequest } from "../tests/fixtures/futures-network-contract"
import { mkdirSync, writeFileSync } from "node:fs"
import { featureIds } from "../lib/futures/catalogue/features"
import { futureCatalogue } from "../lib/futures/catalogue/index"
import { preferenceQuestions, requirementLabels, type PreferenceAnswers } from "../lib/futures/preferences"
import { interpretPreferences } from "../lib/futures/interpretation"
import { humanPlural, centralizedCare, lowTechnology, allConflict, preferenceFixture } from "../tests/fixtures/futures-preferences"

const artifactDir = process.env.FUTURES_EVIDENCE_DIR ?? "test-results/futures-catalogue"
async function begin(page: Page) {
  await page.goto("/futures/preferences")
  await page.getByRole("button", { name: "Begin the twelve questions" }).click()
}
async function answerQuestions(page: Page, answers: PreferenceAnswers) {
  for (const [index, q] of preferenceQuestions.entries()) {
    await page.locator(`input[name="${q.id}"][value="${answers[q.id]!.choice}"]`).check()
    if (answers[q.id]!.nonNegotiable) await page.getByRole("checkbox").check()
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(q.prompt)
    await page.getByRole("button", { name: index === 11 ? "Review all answers" : "Next question", exact: true }).click()
  }
}
async function finish(page: Page, answers: PreferenceAnswers) {
  await answerQuestions(page, answers)
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Review your preferred conditions")
  await expect(page.getByTestId("shortlist")).toHaveCount(0)
  await page.getByRole("button", { name: "Compare my preferred conditions", exact: true }).click()
}
async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
}
async function capture(page: Page, name: string, fullPage = false) {
  mkdirSync(artifactDir, { recursive: true })
  await page.evaluate(async () => {
    await document.fonts.ready
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
  })
  await page.screenshot({ path: `${artifactDir}/${name}.png`, fullPage, animations: "disabled" })
}

test("every catalogue entry, original anchor and source status; comparison accepts any two", async ({ page }) => {
  await page.goto("/futures")
  await expect(page.locator('article[data-origin="inherited"]')).toHaveCount(12)
  await expect(page.locator('article[data-origin="project"]')).toHaveCount(7)
  await expect(page.getByRole("navigation", { name: "Every published future" }).getByRole("link")).toHaveCount(19)
  await expect(page.getByRole("link", { name: "Answer the questions", exact: true })).toBeVisible()
  for (const s of futureCatalogue) {
    await page.goto(`/futures#trajectory-${s.id}`)
    await expect(page.locator(`#trajectory-${s.id}`)).toBeInViewport()
    await page.locator(`#trajectory-${s.id}`).getByRole("link", { name: "Read the scenario", exact: true }).click()
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(s.name)
    await expect(page.getByRole("heading", { name: "Origin and source status" })).toBeVisible()
    await expect(page.getByText(s.sources[0].title, { exact: true })).toHaveAttribute("href", s.sources[0].url)
    await page.getByText("All authored features used in comparison", { exact: true }).click()
    await expect(page.getByText("These are editorial descriptors", { exact: false })).toBeVisible()
    await page.getByRole("link", { name: "All futures", exact: true }).click()
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Which futures could you live with?")
  }
  await page.goto("/futures/compare?a=reversion&b=constitutional-delegation")
  await expect(page.getByLabel("First scenario")).toHaveValue("reversion")
  await expect(page.getByLabel("Second scenario")).toHaveValue("constitutional-delegation")
  for (const s of futureCatalogue) {
    await page.getByLabel("First scenario").selectOption(s.id)
    await page.getByLabel("Second scenario").selectOption(s.id === "departure" ? "descendants" : "departure")
    await expect(page.getByRole("heading", { name: "Open questions", exact: true })).toBeVisible()
  }
  await page.getByLabel("First scenario").selectOption("departure")
  await page.getByLabel("Second scenario").selectOption("departure")
  await expect(page.getByRole("status")).toContainText("two different")
  await page.goto("/futures/compare?a=not-a-world&b=reversion")
  await expect(page.getByRole("status")).toContainText("not recognized")
  const response = await page.goto("/futures/scenarios/not-a-world")
  expect(response?.status()).toBe(404)
})

test("complete journey without Departure; expectations, edits, reset and privacy", async ({ page, context }) => {
  await page.addInitScript(() => {
    const writes: string[] = []
    Object.defineProperty(window, "__futuresWrites", { value: writes })
    for (const method of ["setItem", "removeItem", "clear"] as const) {
      const original = Storage.prototype[method]
      Object.defineProperty(Storage.prototype, method, { value: function (...args: string[]) { writes.push(method); return Reflect.apply(original, this, args) } })
    }
  })
  await begin(page)
  await page.waitForLoadState("networkidle")
  const cookies = await context.cookies(), requests: ObservedRequest[] = []
  page.on("request", request => requests.push({ method: request.method(), url: request.url(), body: request.postData() }))
  await finish(page, humanPlural)
  const originalShortlist = await page.getByTestId("shortlist").locator("article").evaluateAll(els => els.map(el => el.getAttribute("data-scenario")))
  expect(originalShortlist).toContain("constitutional-delegation")
  await page.getByRole("button", { name: "Optional: consider what seems plausible" }).click()
  await expect(page.locator('select[aria-label^="Expectation:"]')).toHaveCount(19)
  expect(await page.locator('select[aria-label^="Expectation:"]').evaluateAll(els => els.every(el => (el as HTMLSelectElement).value === "unassessed"))).toBe(true)
  await page.getByLabel("Expectation: Conquerors", { exact: true }).selectOption("plausible")
  await page.getByLabel("Expectation: Constitutional Delegation", { exact: true }).selectOption("unlikely")
  await page.getByRole("button", { name: "Read preferences and expectations together" }).click()
  expect(await page.getByTestId("shortlist").locator("article").evaluateAll(els => els.map(el => el.getAttribute("data-scenario")))).toEqual(originalShortlist)
  await expect(page.getByTestId("expectations-readback").getByText("Unassessed", { exact: true })).toHaveCount(18 - originalShortlist.length)
  await page.getByRole("button", { name: "Edit preferred conditions", exact: true }).click()
  await page.getByRole("button", { name: /^Edit question 1:/ }).click()
  await page.locator('input[name="humanAuthority"][value="absent"]').check()
  await expect(page.getByRole("status")).toContainText("withdrawn")
  await page.getByRole("checkbox").check()
  await page.locator('input[name="humanAuthority"][value="present"]').check()
  await expect(page.getByRole("checkbox")).not.toBeChecked()
  await page.getByRole("button", { name: /^Review answers/ }).click()
  await page.getByRole("button", { name: "Compare my preferred conditions", exact: true }).click()
  await expect(page.getByTestId("expectations-readback")).toContainText("Plausible")
  await page.getByLabel("First scenario").selectOption("reversion")
  await page.getByLabel("Second scenario").selectOption("constitutional-delegation")
  await expect(page).toHaveURL(/\/futures\/preferences$/)
  // Only the unchanged shared footer may prefetch static documents; no body or answer parameter is allowed.
  expect(requests.filter(request => !isAllowedFooterPrefetch(request, new URL(page.url()).origin))).toEqual([])
  expect(await page.evaluate(() => (window as unknown as { __futuresWrites: string[] }).__futuresWrites)).toEqual([])
  expect(await page.evaluate(async () => (await indexedDB.databases()).length)).toBe(0)
  expect(await context.cookies()).toEqual(cookies)
  const consultation = page.getByRole("link", { name: "Consult Reversion sources", exact: true })
  await expect(consultation).toHaveAttribute("target", "_blank")
  const [sourcePage] = await Promise.all([context.waitForEvent("page"), consultation.click()])
  await expect(sourcePage.getByRole("heading", { level: 1 })).toHaveText("Reversion")
  await sourcePage.close()
  await expect(page.getByTestId("shortlist")).toBeVisible()
  await expect(page.getByTestId("expectations-readback")).toContainText("Plausible")
  await page.getByRole("button", { name: "Reset this exercise" }).click()
  await expect(page.getByRole("button", { name: "Keep my answers" })).toBeFocused()
  await page.keyboard.press("Escape")
  await expect(page.getByRole("button", { name: "Reset this exercise" })).toBeFocused()
  await page.getByRole("button", { name: "Reset this exercise" }).click()
  await page.getByRole("button", { name: "Clear and start again" }).click()
  await expect(page.getByRole("button", { name: "Begin the twelve questions" })).toBeVisible()
  await page.reload()
  await expect(page.getByRole("button", { name: "Begin the twelve questions" })).toBeVisible()
})

test("keyboard selection, mandatory review, reduced motion and returning routes", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await begin(page)
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused()
  await expect(page.locator("details[open]")).toHaveCount(0)
  await expect(page.getByRole("button", { name: "Next question", exact: true })).toBeDisabled()
  const first = page.getByRole("radio").first()
  await first.focus(); await page.keyboard.press("Space"); await page.keyboard.press("ArrowDown")
  await expect(page.locator('input[value="absent"]')).toBeChecked()
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(preferenceQuestions[0].prompt)
  await page.getByRole("button", { name: "Next question", exact: true }).click()
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused()
  await page.getByRole("button", { name: "Back", exact: true }).click()
  await expect(page.locator('input[value="absent"]')).toBeChecked()
  await page.getByRole("button", { name: /^Review answers/ }).click()
  await expect(page.getByRole("button", { name: "Compare my preferred conditions", exact: true })).toBeDisabled()
  expect(await page.locator('article[lang="en"]').evaluate(el => el.getAnimations({ subtree: true }).filter(a => a.playState === "running").length)).toBe(0)
  await page.getByRole("link", { name: "All futures", exact: true }).click()
  await page.getByRole("link", { name: "Answer the questions", exact: true }).click()
  await expect(page.getByRole("button", { name: "Begin the twelve questions" })).toBeVisible()
  await page.goto("/ai")
  await expect(page.getByRole("link", { name: /Futures catalogue/ })).toHaveAttribute("href", "/futures")
  await page.goto("/ai/field-guide#futures")
  await expect(page.getByRole("link", { name: "Browse the whole Futures catalogue", exact: true })).toHaveAttribute("href", "/futures")
})

test("catalogue, questions, varied results and any-two comparison reflow and synthetic captures", async ({ page }) => {
  test.setTimeout(120_000)
  const measurements: { width: number; state: string; overflow: boolean }[] = []
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto("/futures")
    await page.evaluate(() => window.scrollTo(0, 0))
    await noOverflow(page)
    await capture(page, `collection-${width}`)
    if (width === 1440 || width === 390) {
      await capture(page, `collection-full-${width}`, true)
      for (const index of [0, 4, 8, 12, 16, 18]) {
        await page.locator(`#trajectory-${futureCatalogue[index].id}`).scrollIntoViewIfNeeded()
        await capture(page, `catalogue-entries-${index}-${width}`)
      }
      await page.goto("/futures/scenarios/departure")
      await capture(page, `departure-peer-${width}`)
    }
    await begin(page)
    await noOverflow(page)
    await page.locator('input[name="humanAuthority"][value="present"]').check()
    await expect(page.getByRole("checkbox", { name: requirementLabels.humanAuthority.present, exact: true })).toBeVisible()
    await page.getByRole("checkbox").check()
    await capture(page, `question-requirement-${width}`)
    await page.getByRole("checkbox").uncheck()
    await finish(page, humanPlural)
    await noOverflow(page)
    await capture(page, `result-human-${width}`)
    await page.goto("/futures/compare?a=reversion&b=constitutional-delegation")
    await noOverflow(page)
    await capture(page, `compare-${width}`)
    measurements.push({ width, state: "collection/question/result/comparison", overflow: false })
  }
  for (const [name, answers] of [["unresolved", { ...humanPlural, personalExit: { choice: "present", nonNegotiable: true } }], ["centralized", centralizedCare], ["low-tech", lowTechnology], ["uncertain", preferenceFixture()], ["conflicts", allConflict]] as const) {
    await begin(page); await finish(page, answers)
    if (name === "uncertain" || name === "conflicts") await expect(page.getByRole("heading", { level: 1 })).toHaveText(interpretPreferences(answers).title)
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 })
      await noOverflow(page)
      await capture(page, `result-${name}-${width}`)
      if (name === "unresolved") {
        await page.getByTestId("unconfirmed-requirements").evaluate(el => el.scrollIntoView({ block: "center" }))
        await capture(page, `unresolved-condition-${width}`)
      }
    }
  }
  await begin(page); await finish(page, humanPlural)
  await page.getByRole("button", { name: "Optional: consider what seems plausible" }).click()
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 })
    await capture(page, `expectations-${width}`)
  }
  const absent = preferenceFixture(Object.fromEntries(featureIds.map(id => [id, "absent"])))
  await begin(page); await finish(page, absent)
  await expect(page.getByTestId("shortlist").locator('[data-scenario="self-destruction"]')).toHaveCount(0)
  await expect(page.getByTestId("shortlist").locator('[data-scenario="conquerors"]')).toHaveCount(0)
  await page.getByText("Inspect all 19 entries against your conditions", { exact: true }).click()
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 })
    const endpoint = page.locator("details article").filter({ has: page.getByRole("heading", { name: "Self-destruction", exact: true }) })
    await expect(endpoint).not.toContainText("No directional conditions were supplied for comparison.")
    await endpoint.evaluate(el => el.scrollIntoView({ block: "start" }))
    await capture(page, `catastrophic-absence-${width}`)
    const comparator = page.getByText("Scenario and source links below open in a new tab, keeping this exercise available.", { exact: true })
    await comparator.evaluate(el => el.scrollIntoView({ block: "center" }))
    await capture(page, `embedded-consultation-${width}`)
  }
  writeFileSync(`${artifactDir}/measurements.json`, JSON.stringify({ evidence: "Synthetic browser fixtures only; capture is not visual inspection or human validation.", measurements }, null, 2) + "\n")
})


test("rendered interpretation changes with same-candidate counterexamples and shows requirement qualifications", async ({ page }) => {
  const nonhuman = { ...humanPlural, humanAuthority: { choice: "absent" as const, nonNegotiable: false } }
  const durable = { ...humanPlural, revisablePower: { choice: "absent" as const, nonNegotiable: false } }
  for (const answers of [humanPlural, nonhuman, durable]) {
    await begin(page); await finish(page, answers)
    await expect(page.getByTestId("shortlist").locator('[data-scenario="constitutional-delegation"]')).toHaveCount(1)
    for (const paragraph of interpretPreferences(answers).paragraphs) await expect(page.getByTestId("futures-interpretation").getByText(paragraph, { exact: true })).toBeVisible()
  }
  const required = { ...humanPlural, personalExit: { choice: "present" as const, nonNegotiable: true } }
  await begin(page); await finish(page, required)
  await expect(page.getByTestId("unconfirmed-requirements")).toContainText("Constitutional Delegation: a usable right to leave")
  await expect(page.getByTestId("descriptor-equivalence")).toContainText("does not ask whether ecosystems should have representation")
  await page.getByTestId("requirement-conflicts").getByText(/Confirmed requirements exclude/).click()
  await expect(page.getByTestId("requirement-conflicts")).toContainText("Zookeeper")
})


test("read revised capability requirement and uninstantiated Reversion institutions", async ({ page }) => {
  await begin(page)
  await page.getByRole("button", { name: /^Review answers/ }).click()
  await page.getByRole("button", { name: /^Edit question 10:/ }).click()
  await page.locator('input[name="capabilityLimits"][value="present"]').check()
  await page.getByRole("checkbox", { name: requirementLabels.capabilityLimits.present, exact: true }).check()
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.getByRole("heading", { level: 1 }).evaluate(el => el.scrollIntoView({ block: "start" }))
    await noOverflow(page)
    await capture(page, `ceiling-requirement-${width}`)
  }
  await page.goto("/futures/scenarios/reversion")
  await page.getByText("All authored features used in comparison", { exact: true }).click()
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 })
    const feature = page.locator("dl > div").filter({ has: page.getByText("Standing for artificial persons", { exact: true }) })
    await feature.evaluate(el => el.scrollIntoView({ block: "center" }))
    await expect(feature).toContainText("not a policy of excluding persons")
    await noOverflow(page)
    await capture(page, `reversion-institutions-${width}`)
  }
})


test("human-only standing remains distinct from nonhuman governing authority in the rendered reading", async ({ page }) => {
  const answers = preferenceFixture({ humanAuthority: "absent", biologicalContinuity: "present", digitalStanding: "absent", transparentPower: "absent" })
  await begin(page); await finish(page, answers)
  await expect(page.getByTestId("futures-interpretation")).toContainText("does not by itself determine who has final governing authority")
  await expect(page.getByTestId("futures-interpretation")).not.toContainText("preserve human institutional control")
  await expect(page.getByTestId("shortlist").locator('[data-scenario="protector"]')).toContainText("nonhuman final authority")
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.getByRole("heading", { level: 1 }).evaluate(el => el.scrollIntoView({ block: "start" }))
    await noOverflow(page)
    await capture(page, `standing-without-control-${width}`)
  }
})
