import {
  expect,
  test,
  type Page,
} from "@playwright/test"
import profileStoreV4 from "../tests/fixtures/profile-store-v4.json"
import profileStoreV5 from "../tests/fixtures/profile-store-v5.json"
import {
  buildFoundationFixtureSet,
  buildLocalEvidenceBrowserFixture,
} from "../scripts/v23-6/foundation-fixtures"
import {
  FOUNDATION_LOCAL_EVIDENCE_HANDOFF_KEY,
  FOUNDATION_LOCAL_EVIDENCE_STORAGE_KEY,
  PROFILE_STORAGE_KEY,
} from "../lib/storage-keys"
import {
  parseProfileStore,
  type FoundationSnapshot,
} from "../lib/profile-store"

const fixtures = buildFoundationFixtureSet()
const rootDestinations = [
  { id: "inventory", pathname: "/quiz" },
  { id: "world-stage", pathname: "/world-stage" },
  { id: "atlas", pathname: "/explore" },
  { id: "perspective-runs", pathname: "/perspectives" },
  { id: "profile", pathname: "/profile" },
] as const

test("root dependency requests and loaded scripts contain no Mapbox runtime", async ({ page }) => {
  const requestUrls: string[] = []
  const scriptBodies: Array<Promise<string>> = []

  page.on("request", (request) => requestUrls.push(request.url()))
  page.on("response", (response) => {
    if (response.request().resourceType() !== "script") return
    scriptBodies.push(
      response.body()
        .then((body) => body.toString("utf8"))
        .catch(() => ""),
    )
  })

  const response = await page.goto("/")
  expect(response?.status()).toBe(200)
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(250)

  await expect(page.locator("canvas")).toHaveCount(0)
  await expect(page.locator("[data-root-visual-state] svg")).toBeVisible()
  expect(
    requestUrls.filter((url) => isMapboxUrl(url)),
    "Mapbox must not be requested during a clean root load.",
  ).toEqual([])

  const loadedScriptText = (await Promise.all(scriptBodies)).join("\n")
  expect(loadedScriptText).not.toMatch(
    /mapbox-gl|mapboxgl-canvas|mapbox-runtime|api\.mapbox\.com/iu,
  )
  expect(await page.locator("body").innerText()).not.toMatch(/Mapbox token/iu)
})

test("keyboard activation reaches every primary link without diverging from the preview", async ({ page }) => {
  for (const destination of rootDestinations) {
    await page.goto("/")
    await focusRootDestination(page, destination.id)

    await expect(page.locator("[data-root-selected]"))
      .toHaveAttribute("data-root-selected", destination.id)
    await expect(page.locator("[data-root-detail-state]"))
      .toHaveAttribute("data-root-detail-state", destination.id)
    await expect(page.locator("[data-root-visual-state]"))
      .toHaveAttribute("data-root-visual-state", destination.id)
    await expect(page.locator(`[data-root-destination="${destination.id}"]`))
      .toHaveAttribute("data-selected", "true")

    await page.keyboard.press("Enter")
    await expect.poll(() => new URL(page.url()).pathname).toBe(destination.pathname)
  }
})

test("returning-state hydration preserves root menu geometry", async ({ page }) => {
  await page.goto("/")
  await expect(page.locator("[data-root-returning]"))
    .toHaveAttribute("data-root-returning", "resolved")
  const menu = page.getByRole("navigation", { name: "Primary destinations" })
  const before = await menu.boundingBox()
  expect(before).not.toBeNull()

  await page.evaluate(({ key }) => {
    window.localStorage.setItem(key, JSON.stringify({
      v: 5,
      foundation: { payload: "returning-foundation" },
      modules: { security: { resultPath: "/modules/security/results/saved" } },
      aiGovernance: null,
      perspectiveRuns: [{ id: "saved-run" }],
    }))
    window.dispatchEvent(new StorageEvent("storage", { key }))
  }, { key: PROFILE_STORAGE_KEY })

  await expect(page.getByText(/saved Foundation read/iu)).toBeVisible()
  expect(await menu.boundingBox()).toEqual(before)
})

test("World Stage retains scene selection, filters, sources, fallback, controls, and attribution", async ({ page }) => {
  await page.goto("/world-stage")

  await expect(page.locator("#world-stage-map-view")).toBeVisible()
  await expect(page.getByText(/Reviewed through/iu).first()).toBeVisible()
  await expect(page.getByRole("button", { name: "Zoom globe out" })).toBeVisible()
  await expect(page.getByRole("button", { name: "Zoom globe in" })).toBeVisible()
  const sourceLedger = page.getByRole("heading", { name: "Map details and sources" })
    .locator("..")
  await expect(sourceLedger).toBeAttached()
  await expect(sourceLedger).toContainText("Sources:")
  await expect(sourceLedger).toContainText("https://")
  await expect(page.locator("path[data-iso3]")).toHaveCount(174)

  const filters = page.getByTestId("world-stage-layer-filters")
  if (await filters.count()) {
    await filters.locator("summary").click()
    await expect(filters).toHaveAttribute("open", "")
    expect(await filters.locator("select").count()).toBeGreaterThan(0)
  }

  if (await page.locator("canvas.mapboxgl-canvas").count()) {
    await expect(page.getByText("Mapbox", { exact: true })).toBeVisible()
    await expect(page.getByText("OpenStreetMap", { exact: true })).toBeVisible()
    await expect(page.getByText("Improve this map", { exact: true })).toBeVisible()
  } else {
    await expect(page.locator('svg:has(path[data-iso3])')).toBeVisible()
  }
})

test("current core result headlines both readings while a clearer result stays pure", async ({ page }) => {
  await page.goto(`/results/${fixtures.lowDifferentiationCore}`)
  await expect(page.getByRole("heading", {
    level: 1,
    name: /^An initial Foundation read:/,
  })).toBeVisible()
  await expect(page.getByText(/Both readings remain live in the current item set/iu))
    .toBeVisible()
  await expect(page.locator('[data-foundation-mark="blend"]:visible')).toHaveCount(1)

  await page.goto(`/results/${fixtures.clearerPureCore}`)
  await expect(page.getByRole("heading", { level: 1 }))
    .toContainText("leads this Foundation read")
  await expect(page.getByText(/clearer within the current item set/iu)).toBeVisible()
  await expect(page.getByText(/does not establish a durable trait/iu)).toBeVisible()
  await expect(page.locator('[data-foundation-mark="pure"]:visible')).toHaveCount(1)
})

test("a near-boundary result renders the registered blend presentation", async ({ page }) => {
  await page.goto(`/results/${fixtures.blendCore}`)

  const blend = page.locator('[data-foundation-mark="blend"]:visible')
  await expect(blend).toHaveCount(1)
  await expect(blend).toHaveAttribute("data-foundation-mark-layout", "diptych")
  await expect(blend.locator("[data-foundation-mark-primary]")).toHaveCount(1)
  await expect(blend.locator("[data-foundation-mark-runner-up]")).toHaveCount(1)
})

for (const resultCase of [
  {
    name: "core",
    payload: fixtures.clearerPureCore,
    formText: "14-item core form",
  },
  {
    name: "targeted",
    payload: fixtures.targetedExtended,
    formText: "targeted refinement form",
  },
  {
    name: "full",
    payload: fixtures.fullExtended,
    formText: "full extended form",
  },
] as const) {
  test(`current ${resultCase.name} tuple uses its exact form contribution view`, async ({ page }) => {
    await page.goto(`/results/${resultCase.payload}`)
    await expect(page.getByText(new RegExp(resultCase.formText, "iu")).first())
      .toBeVisible()
    await expect(page.locator('[data-contribution-status="legacy-unavailable"]:visible'))
      .toHaveCount(0)
    await expect(page.locator('[aria-label*=" contribution "]:visible'))
      .toHaveCount(7)
  })
}

test("legacy and invalid result URLs fail closed without reconstructed contribution claims", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(`/results/${fixtures.legacy}`)
  await expect(page.getByRole("heading", { level: 1 }))
    .toContainText("Registered legacy Foundation read")
  await expect(page.locator('[data-contribution-status="legacy-unavailable"]:visible'))
    .toHaveCount(1)
  await expect(page.locator('[data-local-evidence-status="legacy"]:visible'))
    .toHaveCount(1)

  await page.goto("/results/not-a-valid-payload")
  await expect(page.getByText("Invalid result", { exact: true })).toBeVisible()
  await expect(page.getByRole("heading", { name: "This link could not be decoded." }))
    .toBeVisible()
})

test("local evidence is exact-bound, rejects tuple mismatch, and is deleted with local history", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const evidence = await buildLocalEvidenceBrowserFixture()
  await seedEvidence(page, evidence.localEvidenceJson, evidence.handoffJson)
  await page.goto(`/results/${evidence.payload}`)

  const visibleEvidence = page.locator("[data-local-evidence-status]:visible")
  await expect(visibleEvidence).toHaveAttribute("data-local-evidence-status", "available")
  expect(await visibleEvidence.locator("li").count()).toBeGreaterThan(0)
  expect(await visibleEvidence.locator("li").count()).toBeLessThanOrEqual(3)

  await page.evaluate(({ key }) => {
    const raw = window.localStorage.getItem(key)
    if (!raw) throw new Error("Expected a local evidence set.")
    const set = JSON.parse(raw)
    set.completions[0].binding.resolvedRunnerUp =
      set.completions[0].binding.resolvedFamily
    window.localStorage.setItem(key, JSON.stringify(set))
  }, { key: FOUNDATION_LOCAL_EVIDENCE_STORAGE_KEY })
  await page.reload()
  await expect(page.locator("[data-local-evidence-status]:visible"))
    .toHaveAttribute("data-local-evidence-status", "tuple-mismatch")

  await page.evaluate(
    ({ key, value }) => window.localStorage.setItem(key, value),
    { key: FOUNDATION_LOCAL_EVIDENCE_STORAGE_KEY, value: evidence.localEvidenceJson },
  )
  await page.reload()
  await expect(page.locator("[data-local-evidence-status]:visible"))
    .toHaveAttribute("data-local-evidence-status", "available")

  await page.goto("/privacy")
  await page.getByRole("button", { name: "Delete local history", exact: true }).click()
  await page.getByRole("button", { name: "Delete local history now", exact: true }).click()
  await expect(page.getByRole("status").filter({
    hasText: "Local results and drafts were deleted",
  })).toBeVisible()
  await page.goBack()
  await page.reload()
  await expect(page.locator("[data-local-evidence-status]:visible"))
    .toHaveAttribute("data-local-evidence-status", "deleted")
})

test("current and history Profile links restore their exact one-shot local evidence", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const currentEvidence = await buildLocalEvidenceBrowserFixture(
    "profile-current-completion",
  )
  const historyEvidence = await buildLocalEvidenceBrowserFixture(
    "profile-history-completion",
  )
  expect(historyEvidence.payload).toBe(currentEvidence.payload)

  const currentSet = JSON.parse(currentEvidence.localEvidenceJson)
  const historySet = JSON.parse(historyEvidence.localEvidenceJson)
  currentSet.completions[0].records[0].prompt = "Current completion marker"
  historySet.completions[0].records[0].prompt = "History completion marker"
  const localEvidenceJson = JSON.stringify({
    v: 1,
    completions: [
      ...currentSet.completions,
      ...historySet.completions,
    ],
  })

  const profile = parseProfileStore(JSON.stringify(profileStoreV5))
  if (!profile.foundation) throw new Error("Expected the V5 Foundation fixture.")
  const currentSnapshot: FoundationSnapshot = {
    ...profile.foundation,
    timestamp: 1_750_000_000_200,
    payload: currentEvidence.payload,
    resultPath: `/results/${currentEvidence.payload}`,
    mode: "analyst" as const,
    localEvidenceId: currentEvidence.localCompletionId,
    instrumentStructuralVersion: 4,
    scoringVersion: 2,
    locale: "en" as const,
    localeCopyVersion: 1,
  }
  const historySnapshot: FoundationSnapshot = {
    ...currentSnapshot,
    timestamp: 1_750_000_000_100,
    localEvidenceId: historyEvidence.localCompletionId,
  }
  profile.foundation = currentSnapshot
  profile.foundationHistory = [historySnapshot, currentSnapshot]

  await page.goto("/")
  await page.evaluate(
    ({ profileKey, evidenceKey, handoffKey, profileValue, evidenceValue }) => {
      window.localStorage.setItem(profileKey, JSON.stringify(profileValue))
      window.localStorage.setItem(evidenceKey, evidenceValue)
      window.sessionStorage.removeItem(handoffKey)
    },
    {
      profileKey: PROFILE_STORAGE_KEY,
      evidenceKey: FOUNDATION_LOCAL_EVIDENCE_STORAGE_KEY,
      handoffKey: FOUNDATION_LOCAL_EVIDENCE_HANDOFF_KEY,
      profileValue: profile,
      evidenceValue: localEvidenceJson,
    },
  )

  await page.goto("/profile")
  await page.getByRole("link", { name: "Open Foundation result" }).click()
  await expect(page.locator('[data-local-evidence-status="available"]:visible'))
    .toHaveCount(1)
  await expect(page.getByText("Current completion marker", { exact: true }))
    .toBeVisible()
  await expect(page.getByText("History completion marker", { exact: true }))
    .toHaveCount(0)
  expect(new URL(page.url()).search).toBe("")
  expect(page.url()).not.toContain(currentEvidence.localCompletionId)

  await page.goBack()
  await page.getByText(/^Result history/u).click()
  await page.locator(".profile-history-row")
    .filter({ hasText: "Foundation" })
    .getByRole("link", { name: "View" })
    .click()
  await expect(page.locator('[data-local-evidence-status="available"]:visible'))
    .toHaveCount(1)
  await expect(page.getByText("History completion marker", { exact: true }))
    .toBeVisible()
  await expect(page.getByText("Current completion marker", { exact: true }))
    .toHaveCount(0)

  await page.goBack()
  await page.getByRole("link", { name: "Open Foundation result" }).click()
  await expect(page.locator('[data-local-evidence-status="available"]:visible'))
    .toHaveCount(1)
  await expect(page.getByText("Current completion marker", { exact: true }))
    .toBeVisible()
})

test("a shared result has no local evidence binding", async ({ browser }) => {
  const context = await browser.newContext({
    baseURL: "http://127.0.0.1:3000",
    viewport: { width: 390, height: 844 },
  })
  const page = await context.newPage()
  try {
    await page.goto(`/results/${fixtures.clearerPureCore}`)
    await expect(page.locator("[data-local-evidence-status]:visible"))
      .toHaveAttribute("data-local-evidence-status", "no-local-binding")
    await expect(
      page.locator("[data-local-evidence-status]:visible")
        .getByText(/Shared links carry the result/iu),
    ).toBeVisible()
  } finally {
    await context.close()
  }
})

test("desktop has one sticky visual region and mobile remains a complete linear document", async ({ browser, page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto(`/results/${fixtures.clearerPureCore}`)
  const sticky = page.locator("[data-foundation-sticky-region]")
  await expect(sticky).toHaveCount(1)
  await expect(sticky).toBeVisible()
  const chapterVisuals = sticky.locator("[data-foundation-chapter-visual]")
  await expect(chapterVisuals).toHaveCount(7)
  expect(await chapterVisuals.evaluateAll((elements) => elements.every(
    (element) => getComputedStyle(element).position === "sticky",
  ))).toBe(true)
  expect(await sticky.evaluate((element) => element.querySelectorAll(
    "[data-foundation-story-chapter] > [data-foundation-chapter-visual]",
  ).length)).toBe(7)

  const noJs = await browser.newContext({
    baseURL: "http://127.0.0.1:3000",
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  })
  const noJsPage = await noJs.newPage()
  try {
    await noJsPage.goto(`/results/${fixtures.clearerPureCore}`)
    await expect(noJsPage.locator("[data-foundation-story-chapter]")).toHaveCount(7)
    await expect(noJsPage.locator("[data-foundation-sticky-region]")).toBeVisible()
    await expect(noJsPage.locator("[data-foundation-chapter-visual]")).toHaveCount(7)
    await expect(noJsPage.locator(
      '[role="region"][aria-label="Registered Foundation reading matrix"]:visible',
    ))
      .toBeVisible()
    expect(await noJsPage.evaluate(() => document.documentElement.scrollWidth))
      .toBeLessThanOrEqual(390)
  } finally {
    await noJs.close()
  }
})

for (const width of [320, 390, 768, 1440] as const) {
  test(`result story fits ${width}px and retains its first insight`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 })
    await page.goto(`/results/${fixtures.clearerPureCore}`)
    await expect(page.getByRole("heading", {
      name: /^Why .+ rather than .+$/,
    })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth))
      .toBeLessThanOrEqual(width)

    const visualPosition = await page.locator("[data-foundation-chapter-visual]")
      .first()
      .evaluate((element) => getComputedStyle(element).position)
    if (width < 768) expect(visualPosition).toBe("static")
    else expect(visualPosition).toBe("sticky")
  })
}

test("reduced motion keeps every chapter and its visible state available", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto(`/results/${fixtures.clearerPureCore}`)

  await expect(page.locator("[data-foundation-story-chapter]")).toHaveCount(7)
  await expect(page.locator("[data-foundation-chapter-visual]"))
    .toHaveCount(7)
  const motion = await page.locator("[data-foundation-result-story]").evaluate((story) => {
    const sample = story.querySelector<HTMLElement>("[data-foundation-story-chapter]")
    if (!sample) return null
    const style = getComputedStyle(sample)
    return {
      animationDuration: style.animationDuration,
      transitionDuration: style.transitionDuration,
    }
  })
  expect(motion).not.toBeNull()
  expect(parseCssSeconds(motion?.animationDuration ?? "1s")).toBeLessThanOrEqual(0.000_01)
  expect(parseCssSeconds(motion?.transitionDuration ?? "1s")).toBeLessThanOrEqual(0.000_01)
})

test("Profile distinguishes an unsaved domain set from a saved domain record", async ({ page }) => {
  await setProfile(page, profileStoreV5)
  await page.goto("/profile")
  await expect(page.getByRole("heading", { name: "Separate domain records" })).toBeVisible()
  await expect(page.locator(".profile-domain-record__result")).toHaveText([
    "Not saved",
    "Not saved",
    "Not saved",
  ])
  await expect(page.getByText("No reviewed cross-domain relation is available.", {
    exact: true,
  })).toBeVisible()
  await expect(page.getByRole("heading", { name: "What to open next" })).toBeVisible()

  await page.evaluate(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: PROFILE_STORAGE_KEY, value: profileStoreV4 },
  )
  await page.reload()
  await expect(page.getByText("V4 security interpretation", { exact: true })).toBeVisible()
  await expect(page.getByText("No reviewed cross-domain relation is available.", {
    exact: true,
  })).toBeVisible()
})

test("Simplified Chinese root and result remain Chinese-only at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/zh")
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans")
  await expect(page.locator("[data-root-destination]")).toHaveText([
    "问卷",
    "世界舞台",
    "图谱",
    "情境推演",
    "档案",
  ])
  expect(await page.evaluate(() => document.documentElement.scrollWidth))
    .toBeLessThanOrEqual(390)

  await page.goto(`/zh/results/${fixtures.chineseCore}`)
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans")
  await expect(page.locator("#zh-foundation-result-heading")).toBeVisible()
  await expect(page.getByText("An initial Foundation read", { exact: false }))
    .toHaveCount(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth))
    .toBeLessThanOrEqual(390)
})

test("print mode is static, complete, and produces a compact three- or four-page report", async ({ context, page }) => {
  await page.goto(`/results/${fixtures.clearerPureCore}`)
  await page.emulateMedia({ media: "print", reducedMotion: "reduce" })

  await expect(page.locator("[data-foundation-story-chapter]")).toHaveCount(7)
  await expect(page.locator("[data-foundation-sticky-region]")).toBeVisible()
  await expect(page.locator("[data-foundation-chapter-visual]")).toHaveCount(7)
  const printVisualPositions = await page
    .locator("[data-foundation-chapter-visual]")
    .evaluateAll((visuals) => visuals.map((visual) =>
      window.getComputedStyle(visual).position))
  expect(printVisualPositions).toEqual(Array(7).fill("static"))
  await expect(page.locator(
    '[role="region"][aria-label="Registered Foundation reading matrix"]:visible',
  ))
    .toBeVisible()

  const session = await context.newCDPSession(page)
  const { data } = await session.send("Page.printToPDF", {
    printBackground: true,
    preferCSSPageSize: true,
    paperWidth: 8.27,
    paperHeight: 11.69,
  })
  const pdfText = Buffer.from(data, "base64").toString("latin1")
  const pageCount = pdfText.match(/\/Type\s*\/Page\b/gu)?.length ?? 0
  expect(pageCount).toBeGreaterThanOrEqual(3)
  expect(pageCount).toBeLessThanOrEqual(4)
})

async function focusRootDestination(
  page: Page,
  destinationId: typeof rootDestinations[number]["id"],
) {
  for (let press = 0; press < 20; press += 1) {
    await page.keyboard.press("Tab")
    const focused = await page.evaluate(() =>
      document.activeElement?.getAttribute("data-root-destination") ?? null)
    if (focused === destinationId) return
  }
  throw new Error(`Tab did not reach root destination ${destinationId}.`)
}

async function seedEvidence(
  page: Page,
  localEvidenceJson: string,
  handoffJson: string,
) {
  await page.goto("/")
  await page.evaluate(
    ({ localKey, handoffKey, localValue, handoffValue }) => {
      window.localStorage.setItem(localKey, localValue)
      window.sessionStorage.setItem(handoffKey, handoffValue)
    },
    {
      localKey: FOUNDATION_LOCAL_EVIDENCE_STORAGE_KEY,
      handoffKey: FOUNDATION_LOCAL_EVIDENCE_HANDOFF_KEY,
      localValue: localEvidenceJson,
      handoffValue: handoffJson,
    },
  )
}

async function setProfile(page: Page, profile: unknown) {
  await page.goto("/")
  await page.evaluate(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: PROFILE_STORAGE_KEY, value: profile },
  )
}

function isMapboxUrl(url: string) {
  return /(?:api|events|tiles)\.mapbox\.com|mapbox-gl|mapbox-runtime/iu.test(url)
}

function parseCssSeconds(value: string) {
  const first = value.split(",", 1)[0]?.trim() ?? ""
  if (first.endsWith("ms")) return Number.parseFloat(first) / 1_000
  if (first.endsWith("s")) return Number.parseFloat(first)
  return Number.POSITIVE_INFINITY
}
