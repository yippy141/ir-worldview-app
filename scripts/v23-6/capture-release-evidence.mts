import { execFileSync } from "node:child_process"
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs"
import { homedir } from "node:os"
import { dirname, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { chromium, type Browser, type BrowserContext, type Page } from "@playwright/test"
import {
  buildFoundationFixtureSet,
  buildLocalEvidenceBrowserFixture,
  foundationContractVersions,
} from "@/scripts/v23-6/foundation-fixtures"
import {
  FOUNDATION_LOCAL_EVIDENCE_HANDOFF_KEY,
  FOUNDATION_LOCAL_EVIDENCE_STORAGE_KEY,
  PROFILE_STORAGE_KEY,
} from "@/lib/storage-keys"

type CaptureOptions = {
  baseUrl: string
  baselineUrl: string | null
  outputDir: string
  baselineSha: string | null
}

type ArtifactRecord = {
  id: string
  kind: "screenshot" | "pdf" | "har" | "json"
  path: string
  route: string
  locale?: "en" | "zh-Hans"
  viewport?: { width: number; height: number }
  state?: string
  note: string
}

type NetworkRecord = {
  requestId: string
  url: string
  type: string
  mimeType: string
  status: number
  encodedDataLength: number
  fromDiskCache: boolean
  fromServiceWorker: boolean
}

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const repositoryRoot = resolve(scriptDirectory, "../..")
const options = parseOptions(process.argv.slice(2))
prepareOutputDirectory(options.outputDir)

const fixtures = buildFoundationFixtureSet()
const evidenceFixture = await buildLocalEvidenceBrowserFixture(
  "v23-6-release-capture",
)
const profileWithoutDomains = readJson("tests/fixtures/profile-store-v5.json")
const profileWithDomains = readJson("tests/fixtures/profile-store-v4.json")
const artifacts: ArtifactRecord[] = []
const checks: Record<string, unknown> = {}
const browser = await chromium.launch({ headless: true })

try {
  if (options.baselineUrl) {
    await captureRootScreenshots({
      browser,
      baseUrl: options.baselineUrl,
      outputDir: options.outputDir,
      label: "before",
      artifacts,
    })
    checks.baselineRootNetwork = await captureRootNetwork({
      browser,
      baseUrl: options.baselineUrl,
      outputDir: options.outputDir,
      fileStem: "baseline-root-clean",
      artifacts,
      enforceNoMapbox: false,
    })
  }

  await captureRootScreenshots({
    browser,
    baseUrl: options.baseUrl,
    outputDir: options.outputDir,
    label: "after-new",
    artifacts,
  })
  await captureReturningRootScreenshots(browser, options, artifacts)
  checks.candidateRootNetwork = await captureRootNetwork({
    browser,
    baseUrl: options.baseUrl,
    outputDir: options.outputDir,
    fileStem: "root-clean",
    artifacts,
    enforceNoMapbox: true,
  })

  await captureWorldStage(browser, options, artifacts)
  await captureResultStates(browser, options, artifacts)
  await captureLocalEvidenceStates(browser, options, artifacts)
  await captureProfiles(browser, options, artifacts)
  await captureChineseParity(browser, options, artifacts)
  checks.accessibility = await captureMotionAndReadOrder(
    browser,
    options,
    artifacts,
  )
  checks.print = await capturePrintReport(browser, options, artifacts)
} finally {
  await browser.close()
}

const manifest = {
  schemaVersion: 1,
  release: "V23.6 production conversion",
  generatedAt: new Date().toISOString(),
  candidate: {
    url: options.baseUrl,
    captureParentSha: gitValue(["rev-parse", "HEAD"]),
    branch: gitValue(["branch", "--show-current"]),
    workingTreeDirty: gitLines(["status", "--porcelain=v1"]).length > 0,
    changedFilesAtCapture: gitLines(["status", "--porcelain=v1"]),
    finalHeadSha: null,
  },
  baseline: options.baselineUrl
    ? {
        url: options.baselineUrl,
        sha: options.baselineSha,
      }
    : null,
  contractVersions: foundationContractVersions,
  fixtureRoutes: {
    lowDifferentiationCore: `/results/${fixtures.lowDifferentiationCore}`,
    clearerPureCore: `/results/${fixtures.clearerPureCore}`,
    blendCore: `/results/${fixtures.blendCore}`,
    targetedExtended: `/results/${fixtures.targetedExtended}`,
    fullExtended: `/results/${fixtures.fullExtended}`,
    legacy: `/results/${fixtures.legacy}`,
    chineseCore: `/zh/results/${fixtures.chineseCore}`,
    localEvidence: `/results/${evidenceFixture.payload}`,
  },
  artifacts,
  checks,
  limitations: [
    ...(options.baselineUrl
      ? []
      : ["No baseline URL was supplied, so before-root captures and network deltas are absent."]),
    "Mapbox attribution is recorded only when a valid build-time token allows the live canvas to initialize; the local fallback remains captured otherwise.",
    "The script uses deterministic constructed result fixtures and does not represent human participant data.",
  ],
}

writeJson(resolve(options.outputDir, "manifest.json"), manifest)
process.stdout.write(`${JSON.stringify(manifest, null, 2)}\n`)

async function captureRootScreenshots({
  browser,
  baseUrl,
  outputDir,
  label,
  artifacts,
}: {
  browser: Browser
  baseUrl: string
  outputDir: string
  label: "before" | "after-new"
  artifacts: ArtifactRecord[]
}) {
  const context = await browser.newContext({
    baseURL: baseUrl,
    reducedMotion: "reduce",
    serviceWorkers: "block",
  })
  const page = await context.newPage()
  try {
    for (const width of [390, 768, 1440]) {
      const viewport = { width, height: width === 390 ? 844 : 1000 }
      await page.setViewportSize(viewport)
      await page.goto("/", { waitUntil: "load" })
      await settle(page)
      const path = resolve(outputDir, `root/${label}-${width}.png`)
      await screenshot(page, path)
      artifacts.push({
        id: `root-${label}-${width}`,
        kind: "screenshot",
        path: relative(outputDir, path),
        route: "/",
        locale: "en",
        viewport,
        state: label,
        note: label === "before"
          ? "Baseline production root before V23.6 conversion."
          : "V23.6 root in a clean browser state.",
      })
    }
  } finally {
    await context.close()
  }
}

async function captureReturningRootScreenshots(
  browser: Browser,
  captureOptions: CaptureOptions,
  outputArtifacts: ArtifactRecord[],
) {
  const context = await browser.newContext({
    baseURL: captureOptions.baseUrl,
    reducedMotion: "reduce",
    serviceWorkers: "block",
  })
  const page = await context.newPage()
  try {
    await page.goto("/", { waitUntil: "load" })
    await page.evaluate(
      ({ key, profile }) => window.localStorage.setItem(key, JSON.stringify(profile)),
      { key: PROFILE_STORAGE_KEY, profile: profileWithDomains },
    )

    for (const width of [390, 1440]) {
      const viewport = { width, height: width === 390 ? 844 : 1000 }
      await page.setViewportSize(viewport)
      await page.reload({ waitUntil: "load" })
      await settle(page)
      const path = resolve(
        captureOptions.outputDir,
        `root/after-returning-${width}.png`,
      )
      await screenshot(page, path)
      outputArtifacts.push({
        id: `root-after-returning-${width}`,
        kind: "screenshot",
        path: relative(captureOptions.outputDir, path),
        route: "/",
        locale: "en",
        viewport,
        state: "returning",
        note: "V23.6 root with locally saved result state; menu geometry is unchanged.",
      })
    }
  } finally {
    await context.close()
  }
}

async function captureRootNetwork({
  browser,
  baseUrl,
  outputDir,
  fileStem,
  artifacts,
  enforceNoMapbox,
}: {
  browser: Browser
  baseUrl: string
  outputDir: string
  fileStem: string
  artifacts: ArtifactRecord[]
  enforceNoMapbox: boolean
}) {
  const harPath = resolve(outputDir, `network/${fileStem}.har`)
  mkdirSync(dirname(harPath), { recursive: true })
  const context = await browser.newContext({
    baseURL: baseUrl,
    reducedMotion: "reduce",
    serviceWorkers: "block",
    recordHar: {
      path: harPath,
      mode: "full",
      content: "omit",
    },
  })
  const page = await context.newPage()
  const cdp = await context.newCDPSession(page)
  const records = new Map<string, NetworkRecord>()

  cdp.on("Network.responseReceived", (event) => {
    records.set(event.requestId, {
      requestId: event.requestId,
      url: event.response.url,
      type: event.type,
      mimeType: event.response.mimeType,
      status: event.response.status,
      encodedDataLength: 0,
      fromDiskCache: event.response.fromDiskCache ?? false,
      fromServiceWorker: event.response.fromServiceWorker ?? false,
    })
  })
  cdp.on("Network.loadingFinished", (event) => {
    const record = records.get(event.requestId)
    if (record) record.encodedDataLength = event.encodedDataLength
  })
  await cdp.send("Network.enable")
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true })

  try {
    await page.goto("/", { waitUntil: "load" })
    await settle(page)
    await page.waitForTimeout(500)

    const browserTiming = await page.evaluate(() => {
      const inspectRenderedFont = (element: HTMLElement) => {
        const familyStack = getComputedStyle(element).fontFamily
        const primaryFamily = familyStack.split(",")[0]?.trim().replace(/^['"]|['"]$/gu, "") ?? ""
        const normalize = (value: string) => value.replace(/^['"]|['"]$/gu, "").toLowerCase()
        const registeredFaces = Array.from(document.fonts).filter(
          (face) => normalize(face.family) === normalize(primaryFamily),
        )
        return {
          familyStack,
          primaryFamily,
          registeredFaceCount: registeredFaces.length,
          loadedFaceCount: registeredFaces.filter((face) => face.status === "loaded").length,
          fontFaceSetCheck: primaryFamily.length > 0
            && document.fonts.check(`16px ${JSON.stringify(primaryFamily)}`),
          renderedWithRegisteredFace: registeredFaces.length > 0
            && registeredFaces.some((face) => face.status === "loaded"),
        }
      }
      const bodyFont = inspectRenderedFont(document.body)
      const brandFont = inspectRenderedFont(
        document.querySelector<HTMLElement>('header a[aria-label]') ?? document.body,
      )
      const activeMenuFont = inspectRenderedFont(
        document.querySelector<HTMLElement>('[data-root-destination][data-selected="true"]')
          ?? document.body,
      )
      return ({
      navigation: globalThis.performance.getEntriesByType("navigation").map((entry: PerformanceEntry) => {
        const value = entry as PerformanceNavigationTiming
        return {
          name: value.name,
          transferSize: value.transferSize,
          encodedBodySize: value.encodedBodySize,
          decodedBodySize: value.decodedBodySize,
          domContentLoadedMs: value.domContentLoadedEventEnd,
          loadMs: value.loadEventEnd,
        }
      }),
      resources: globalThis.performance.getEntriesByType("resource").map((entry: PerformanceEntry) => {
        const value = entry as PerformanceResourceTiming
        return {
          name: value.name,
          initiatorType: value.initiatorType,
          transferSize: value.transferSize,
          encodedBodySize: value.encodedBodySize,
          decodedBodySize: value.decodedBodySize,
          durationMs: value.duration,
        }
      }),
      fonts: {
        spectralLoaded: brandFont.renderedWithRegisteredFace
          && activeMenuFont.renderedWithRegisteredFace,
        libreFranklinLoaded: bodyFont.renderedWithRegisteredFace,
        body: bodyFont,
        brand: brandFont,
        activeMenu: activeMenuFont,
      },
      canvasCount: document.querySelectorAll("canvas").length,
      rootVisualCount: document.querySelectorAll("[data-root-visual-state] svg").length,
      scriptSources: Array.from(document.scripts)
        .map((script) => script.src)
        .filter(Boolean),
      })
    })

    const requests = [...records.values()].sort((left, right) =>
      left.url.localeCompare(right.url))
    const mapboxRequests = requests.filter((record) => isMapboxUrl(record.url))
    const summary = {
      url: baseUrl,
      cleanLoad: true,
      cacheDisabled: true,
      serviceWorkersBlocked: true,
      requests,
      transfer: summarizeNetwork(records.values()),
      performance: browserTiming,
      mapboxRequests,
      assertions: {
        noMapboxRequest: mapboxRequests.length === 0,
        noCanvas: browserTiming.canvasCount === 0,
        geographicSvgPresent: browserTiming.rootVisualCount === 1,
        spectralLoaded: browserTiming.fonts.spectralLoaded,
        libreFranklinLoaded: browserTiming.fonts.libreFranklinLoaded,
      },
    }
    if (
      enforceNoMapbox
      && (!summary.assertions.noMapboxRequest
        || !summary.assertions.noCanvas
        || !summary.assertions.geographicSvgPresent)
    ) {
      throw new Error(
        `Root isolation failed: ${JSON.stringify(summary.assertions)}`,
      )
    }

    const jsonPath = resolve(outputDir, `network/${fileStem}.json`)
    writeJson(jsonPath, summary)
    artifacts.push(
      {
        id: fileStem,
        kind: "json",
        path: relative(outputDir, jsonPath),
        route: "/",
        state: "clean-load",
        note: "CDP and Resource Timing transfer metrics with cache disabled.",
      },
      {
        id: `${fileStem}-har`,
        kind: "har",
        path: relative(outputDir, harPath),
        route: "/",
        state: "clean-load",
        note: "Full browser HAR for the isolated root navigation.",
      },
    )
    return summary
  } finally {
    await context.close()
  }
}

async function captureWorldStage(
  browser: Browser,
  captureOptions: CaptureOptions,
  outputArtifacts: ArtifactRecord[],
) {
  const context = await browser.newContext({
    baseURL: captureOptions.baseUrl,
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
    serviceWorkers: "block",
  })
  const page = await context.newPage()
  try {
    await page.goto("/world-stage", { waitUntil: "load" })
    await page.locator("#world-stage-map-view").waitFor()
    await settle(page)
    const path = resolve(captureOptions.outputDir, "world-stage/world-stage-1440.png")
    await screenshot(page, path)
    outputArtifacts.push({
      id: "world-stage-1440",
      kind: "screenshot",
      path: relative(captureOptions.outputDir, path),
      route: "/world-stage",
      locale: "en",
      viewport: { width: 1440, height: 1000 },
      state: await page.locator("canvas.mapboxgl-canvas").count()
        ? "mapbox-canvas"
        : "local-svg-fallback",
      note: "World Stage scene selector, controls, reviewed date, filters, and geographic display.",
    })
  } finally {
    await context.close()
  }
}

async function captureResultStates(
  browser: Browser,
  captureOptions: CaptureOptions,
  outputArtifacts: ArtifactRecord[],
) {
  const context = await browser.newContext({
    baseURL: captureOptions.baseUrl,
    viewport: { width: 1440, height: 1000 },
    serviceWorkers: "block",
  })
  const page = await context.newPage()
  const states = [
    {
      id: "low-differentiation-core",
      payload: fixtures.lowDifferentiationCore,
      note: "Core initial read with both live readings in the headline.",
    },
    {
      id: "clearer-pure",
      payload: fixtures.clearerPureCore,
      note: "Clearer modeled lead with a pure registered mark and retained runner-up.",
    },
    {
      id: "blend",
      payload: fixtures.blendCore,
      note: "Near-boundary blend shown as a two-mark registered reading.",
    },
  ] as const

  try {
    for (const state of states) {
      const route = `/results/${state.payload}`
      await page.goto(route, { waitUntil: "load" })
      await page.locator("[data-foundation-result-story]").waitFor()
      await settle(page)
      const path = resolve(captureOptions.outputDir, `results/${state.id}-1440.png`)
      await screenshot(page, path)
      outputArtifacts.push({
        id: `result-${state.id}`,
        kind: "screenshot",
        path: relative(captureOptions.outputDir, path),
        route,
        locale: "en",
        viewport: { width: 1440, height: 1000 },
        state: state.id,
        note: state.note,
      })
    }
  } finally {
    await context.close()
  }
}

async function captureLocalEvidenceStates(
  browser: Browser,
  captureOptions: CaptureOptions,
  outputArtifacts: ArtifactRecord[],
) {
  const sharedContext = await browser.newContext({
    baseURL: captureOptions.baseUrl,
    viewport: { width: 700, height: 900 },
    reducedMotion: "reduce",
    serviceWorkers: "block",
  })
  const sharedPage = await sharedContext.newPage()
  try {
    const route = `/results/${fixtures.clearerPureCore}`
    await sharedPage.goto(route, { waitUntil: "load" })
    const unavailable = sharedPage.locator("[data-local-evidence-status]:visible")
    await unavailable.waitFor()
    await unavailable.scrollIntoViewIfNeeded()
    const path = resolve(
      captureOptions.outputDir,
      "results/shared-evidence-unavailable.png",
    )
    await locatorScreenshot(unavailable, path)
    outputArtifacts.push({
      id: "result-shared-evidence-unavailable",
      kind: "screenshot",
      path: relative(captureOptions.outputDir, path),
      route,
      locale: "en",
      viewport: { width: 700, height: 900 },
      state: await unavailable.getAttribute("data-local-evidence-status") ?? "unavailable",
      note: "Shared result truthfully reports that no exact local completion binding is present.",
    })
  } finally {
    await sharedContext.close()
  }

  const localContext = await browser.newContext({
    baseURL: captureOptions.baseUrl,
    viewport: { width: 700, height: 1000 },
    reducedMotion: "reduce",
    serviceWorkers: "block",
  })
  const localPage = await localContext.newPage()
  try {
    await localPage.goto("/", { waitUntil: "load" })
    await localPage.evaluate(
      ({ localKey, handoffKey, localValue, handoffValue }) => {
        window.localStorage.setItem(localKey, localValue)
        window.sessionStorage.setItem(handoffKey, handoffValue)
      },
      {
        localKey: FOUNDATION_LOCAL_EVIDENCE_STORAGE_KEY,
        handoffKey: FOUNDATION_LOCAL_EVIDENCE_HANDOFF_KEY,
        localValue: evidenceFixture.localEvidenceJson,
        handoffValue: evidenceFixture.handoffJson,
      },
    )
    const route = `/results/${evidenceFixture.payload}`
    await localPage.goto(route, { waitUntil: "load" })
    const available = localPage.locator('[data-local-evidence-status="available"]:visible')
    await available.waitFor()
    await available.scrollIntoViewIfNeeded()
    const path = resolve(
      captureOptions.outputDir,
      "results/local-evidence-present.png",
    )
    await locatorScreenshot(available, path)
    outputArtifacts.push({
      id: "result-local-evidence-present",
      kind: "screenshot",
      path: relative(captureOptions.outputDir, path),
      route,
      locale: "en",
      viewport: { width: 700, height: 1000 },
      state: "available",
      note: "Up to three exact, local-only records bound to the completed result tuple.",
    })
  } finally {
    await localContext.close()
  }
}

async function captureProfiles(
  browser: Browser,
  captureOptions: CaptureOptions,
  outputArtifacts: ArtifactRecord[],
) {
  const context = await browser.newContext({
    baseURL: captureOptions.baseUrl,
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
    serviceWorkers: "block",
  })
  const page = await context.newPage()
  try {
    for (const state of [
      {
        id: "without-domain-records",
        profile: profileWithoutDomains,
        note: "Saved Foundation read with all three domain record slots still unsaved.",
      },
      {
        id: "with-domain-records",
        profile: profileWithDomains,
        note: "Saved Foundation read with a separate Security domain record.",
      },
    ] as const) {
      await page.goto("/", { waitUntil: "load" })
      await page.evaluate(
        ({ key, profile }) => window.localStorage.setItem(key, JSON.stringify(profile)),
        { key: PROFILE_STORAGE_KEY, profile: state.profile },
      )
      await page.goto("/profile", { waitUntil: "load" })
      await page.getByRole("heading", { name: "Separate domain records" }).waitFor()
      await settle(page)
      const path = resolve(captureOptions.outputDir, `profile/${state.id}-1440.png`)
      await screenshot(page, path, true)
      outputArtifacts.push({
        id: `profile-${state.id}`,
        kind: "screenshot",
        path: relative(captureOptions.outputDir, path),
        route: "/profile",
        locale: "en",
        viewport: { width: 1440, height: 1000 },
        state: state.id,
        note: state.note,
      })
    }
  } finally {
    await context.close()
  }
}

async function captureChineseParity(
  browser: Browser,
  captureOptions: CaptureOptions,
  outputArtifacts: ArtifactRecord[],
) {
  const context = await browser.newContext({
    baseURL: captureOptions.baseUrl,
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
    serviceWorkers: "block",
  })
  const page = await context.newPage()
  try {
    await page.goto("/zh", { waitUntil: "load" })
    await settle(page)
    const rootPath = resolve(captureOptions.outputDir, "zh/root-390.png")
    await screenshot(page, rootPath)
    outputArtifacts.push({
      id: "zh-root-390",
      kind: "screenshot",
      path: relative(captureOptions.outputDir, rootPath),
      route: "/zh",
      locale: "zh-Hans",
      viewport: { width: 390, height: 844 },
      state: "new",
      note: "Natural Simplified Chinese root chrome at 390 pixels.",
    })

    const route = `/zh/results/${fixtures.chineseCore}`
    await page.goto(route, { waitUntil: "load" })
    await page.locator("#zh-foundation-result-heading").waitFor()
    await settle(page)
    const resultPath = resolve(captureOptions.outputDir, "zh/result-390.png")
    await screenshot(page, resultPath, true)
    outputArtifacts.push({
      id: "zh-result-390",
      kind: "screenshot",
      path: relative(captureOptions.outputDir, resultPath),
      route,
      locale: "zh-Hans",
      viewport: { width: 390, height: 844 },
      state: "current-core",
      note: "Approved Simplified Chinese result surface without English substitution.",
    })
  } finally {
    await context.close()
  }
}

async function captureMotionAndReadOrder(
  browser: Browser,
  captureOptions: CaptureOptions,
  outputArtifacts: ArtifactRecord[],
) {
  const context = await browser.newContext({
    baseURL: captureOptions.baseUrl,
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
    serviceWorkers: "block",
  })
  const page = await context.newPage()
  try {
    const route = `/results/${fixtures.clearerPureCore}`
    await page.goto(route, { waitUntil: "load" })
    await page.locator("[data-foundation-result-story]").waitFor()
    await settle(page)
    const imagePath = resolve(
      captureOptions.outputDir,
      "motion/reduced-motion-result-1440.png",
    )
    await screenshot(page, imagePath)
    outputArtifacts.push({
      id: "reduced-motion-result-1440",
      kind: "screenshot",
      path: relative(captureOptions.outputDir, imagePath),
      route,
      locale: "en",
      viewport: { width: 1440, height: 1000 },
      state: "prefers-reduced-motion",
      note: "Complete result state with operating-system reduced motion enabled.",
    })

    const resultReadOrder = await page.evaluate(() => ({
      lang: document.documentElement.lang,
      headings: Array.from(document.querySelectorAll("h1, h2, h3")).map(
        (heading) => ({
          level: heading.tagName.toLowerCase(),
          text: heading.textContent?.trim() ?? "",
        }),
      ),
      chapterOrder: Array.from(
        document.querySelectorAll<HTMLElement>("[data-foundation-story-chapter]"),
      ).map((chapter) => chapter.dataset.foundationStoryChapter),
      stickyRegionCount: document.querySelectorAll("[data-foundation-sticky-region]").length,
      chapterVisualCount: document.querySelectorAll(
        "[data-foundation-story-chapter] > [data-foundation-chapter-visual]",
      ).length,
      stickyChapterVisualCount: Array.from(
        document.querySelectorAll<HTMLElement>("[data-foundation-chapter-visual]"),
      ).filter((visual) => getComputedStyle(visual).position === "sticky").length,
      transitionDurations: Array.from(
        document.querySelectorAll<HTMLElement>("[data-foundation-story-chapter]"),
      ).map((chapter) => getComputedStyle(chapter).transitionDuration),
      horizontalOverflow: document.documentElement.scrollWidth
        - document.documentElement.clientWidth,
    }))

    await page.goto("/", { waitUntil: "load" })
    await settle(page)
    const rootReadOrder = await page.evaluate(() => ({
      lang: document.documentElement.lang,
      primaryLinks: Array.from(
        document.querySelectorAll<HTMLAnchorElement>("[data-root-destination]"),
      ).map((link) => ({
        id: link.dataset.rootDestination,
        label: link.textContent?.trim() ?? "",
        href: link.getAttribute("href"),
      })),
      tabRoles: document.querySelectorAll('[role="tab"], [aria-selected]').length,
      detailInteractiveCount: document.querySelectorAll(
        "[data-root-detail-state] a, [data-root-detail-state] button",
      ).length,
    }))

    const notes = {
      reducedMotionMedia: true,
      resultReadOrder,
      rootReadOrder,
      assertions: {
        sevenOrderedChapters: resultReadOrder.chapterOrder.length === 7,
        oneStickyRegion: resultReadOrder.stickyRegionCount === 1,
        sevenChapterLocalVisuals: resultReadOrder.chapterVisualCount === 7,
        sevenStickyChapterVisuals: resultReadOrder.stickyChapterVisualCount === 7,
        noHorizontalOverflow: resultReadOrder.horizontalOverflow <= 0,
        fiveOrdinaryRootLinks: rootReadOrder.primaryLinks.length === 5,
        noTabSemantics: rootReadOrder.tabRoles === 0,
        nonInteractiveDetail: rootReadOrder.detailInteractiveCount === 0,
      },
    }
    const jsonPath = resolve(
      captureOptions.outputDir,
      "accessibility/read-order.json",
    )
    writeJson(jsonPath, notes)
    outputArtifacts.push({
      id: "accessibility-read-order",
      kind: "json",
      path: relative(captureOptions.outputDir, jsonPath),
      route: "/ and /results/:payload",
      state: "reduced-motion",
      note: "DOM heading, chapter, navigation-link, sticky-region, and overflow notes.",
    })
    return notes
  } finally {
    await context.close()
  }
}

async function capturePrintReport(
  browser: Browser,
  captureOptions: CaptureOptions,
  outputArtifacts: ArtifactRecord[],
) {
  const context = await browser.newContext({
    baseURL: captureOptions.baseUrl,
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
    serviceWorkers: "block",
  })
  const page = await context.newPage()
  try {
    const route = `/results/${fixtures.clearerPureCore}`
    await page.goto(route, { waitUntil: "load" })
    await page.locator("[data-foundation-result-story]").waitFor()
    await page.emulateMedia({ media: "print", reducedMotion: "reduce" })
    await settle(page)
    const pdfPath = resolve(
      captureOptions.outputDir,
      "print/foundation-result.pdf",
    )
    mkdirSync(dirname(pdfPath), { recursive: true })
    const pdf = await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    })
    const pageCount = countPdfPages(pdf)
    outputArtifacts.push({
      id: "foundation-result-print",
      kind: "pdf",
      path: relative(captureOptions.outputDir, pdfPath),
      route,
      locale: "en",
      state: "print",
      note: `Compact Foundation report; detected page count: ${pageCount}.`,
    })
    return {
      pageCount,
      expectedPageRange: [3, 4],
      compact: pageCount >= 3 && pageCount <= 4,
      bytes: pdf.byteLength,
    }
  } finally {
    await context.close()
  }
}

async function settle(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready
    await new Promise<void>((resolveFrame) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolveFrame())))
  })
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-delay: 0s !important;
        animation-duration: 0s !important;
        caret-color: transparent !important;
        transition-duration: 0s !important;
      }
      nextjs-portal { display: none !important; }
    `,
  })
}

async function screenshot(page: Page, path: string, fullPage = false) {
  mkdirSync(dirname(path), { recursive: true })
  await page.screenshot({ path, fullPage, animations: "disabled" })
}

async function locatorScreenshot(
  locator: ReturnType<Page["locator"]>,
  path: string,
) {
  mkdirSync(dirname(path), { recursive: true })
  await locator.screenshot({ path, animations: "disabled" })
}

function summarizeNetwork(records: Iterable<NetworkRecord>) {
  const groups = {
    all: emptyTransferGroup(),
    document: emptyTransferGroup(),
    javascript: emptyTransferGroup(),
    css: emptyTransferGroup(),
    fonts: emptyTransferGroup(),
    images: emptyTransferGroup(),
    other: emptyTransferGroup(),
  }
  for (const record of records) {
    const group = classifyNetworkRecord(record)
    addTransfer(groups.all, record.encodedDataLength)
    addTransfer(groups[group], record.encodedDataLength)
  }
  return groups
}

function emptyTransferGroup() {
  return { requests: 0, browserTransferBytes: 0 }
}

function addTransfer(group: ReturnType<typeof emptyTransferGroup>, bytes: number) {
  group.requests += 1
  group.browserTransferBytes += bytes
}

function classifyNetworkRecord(
  record: NetworkRecord,
): Exclude<keyof ReturnType<typeof summarizeNetwork>, "all"> {
  const value = `${record.type} ${record.mimeType} ${record.url}`.toLowerCase()
  if (value.includes("document")) return "document"
  if (value.includes("javascript") || /\.m?js(?:\?|$)/u.test(value)) return "javascript"
  if (value.includes("css")) return "css"
  if (value.includes("font") || /\.(?:woff2?|ttf|otf)(?:\?|$)/u.test(value)) return "fonts"
  if (value.includes("image") || /\.(?:png|jpe?g|webp|svg)(?:\?|$)/u.test(value)) return "images"
  return "other"
}

function countPdfPages(buffer: Buffer) {
  const text = buffer.toString("latin1")
  return text.match(/\/Type\s*\/Page\b/gu)?.length ?? 0
}

function parseOptions(args: string[]): CaptureOptions {
  const values = new Map<string, string>()
  for (let index = 0; index < args.length; index += 1) {
    const key = args[index]
    const value = args[index + 1]
    if (!key?.startsWith("--") || !value || value.startsWith("--")) {
      throw new Error(`Expected --name value arguments; received ${key ?? "nothing"}.`)
    }
    values.set(key, value)
    index += 1
  }

  const baseUrl = requireHttpUrl(values.get("--base-url"), "--base-url")
  const output = values.get("--output-dir")
  if (!output) throw new Error("--output-dir is required and must be explicit.")
  const outputDir = resolve(output)
  const baseline = values.get("--baseline-url")

  return {
    baseUrl,
    baselineUrl: baseline ? requireHttpUrl(baseline, "--baseline-url") : null,
    outputDir,
    baselineSha: values.get("--baseline-sha") ?? null,
  }
}

function requireHttpUrl(value: string | undefined, argument: string) {
  if (!value) throw new Error(`${argument} is required.`)
  const url = new URL(value)
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`${argument} must use http or https.`)
  }
  return url.origin
}

function prepareOutputDirectory(outputDir: string) {
  const forbidden = new Set([
    resolve("/"),
    resolve(repositoryRoot),
    resolve(homedir()),
  ])
  if (forbidden.has(outputDir)) {
    throw new Error(`Refusing broad output directory: ${outputDir}`)
  }
  if (existsSync(outputDir) && readdirSync(outputDir).length > 0) {
    throw new Error(
      `Output directory must be new or empty; refusing to overwrite ${outputDir}.`,
    )
  }
  mkdirSync(outputDir, { recursive: true })
}

function readJson(path: string) {
  return JSON.parse(readFileSync(resolve(repositoryRoot, path), "utf8")) as unknown
}

function writeJson(path: string, value: unknown) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8")
}

function gitValue(args: string[]) {
  return execFileSync("git", args, {
    cwd: repositoryRoot,
    encoding: "utf8",
  }).trim()
}

function gitLines(args: string[]) {
  const value = gitValue(args)
  return value ? value.split("\n") : []
}

function isMapboxUrl(url: string) {
  return /(?:api|events|tiles)\.mapbox\.com|mapbox-gl|mapbox-runtime/iu.test(url)
}
