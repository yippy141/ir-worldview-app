import { mkdirSync, rmSync, writeFileSync } from "node:fs"
import { dirname, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { chromium, type Browser, type Page } from "@playwright/test"
import { PROFILE_STORAGE_KEY, QUIZ_STORAGE_KEY } from "@/lib/storage-keys"
import { foundationCoreQuestions } from "@/lib/quiz-schema"
import profileStoreV4 from "@/tests/fixtures/profile-store-v4.json" with { type: "json" }

/**
 * Deterministic evidence for the development-only product re-foundation
 * prototype. It reads the running dev server, writes screenshots and one
 * measurement record, and changes no repository content outside the output
 * directory.
 *
 *   npm run prototype:refoundation:capture -- --base-url=http://127.0.0.1:3111
 */

const ROUTE = "/dev/product-refoundation"
const AREA_IDS = ["start", "cases", "field-guide", "my-record"] as const
const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const repositoryRoot = resolve(scriptDirectory, "../..")

type Options = { baseUrl: string; outputDir: string }

const options = parseOptions(process.argv.slice(2))
rmSync(options.outputDir, { recursive: true, force: true })
mkdirSync(options.outputDir, { recursive: true })

type ScreenshotRecord = {
  id: string
  path: string
  viewport: { width: number; height: number }
  state: string
  reducedMotion: "no-preference" | "reduce"
  note: string
}

const screenshots: ScreenshotRecord[] = []
const checks: Record<string, unknown> = {}
const browser = await chromium.launch({ headless: true })

try {
  checks.network = await captureNetwork(browser)
  await captureStates(browser)
  checks.geometry = await captureGeometry(browser)
  await captureSequence(browser)
  checks.keyboard = await captureKeyboard(browser)
} finally {
  await browser.close()
}

const manifest = {
  schemaVersion: 1,
  prototype: "product re-foundation",
  route: ROUTE,
  generatedAt: new Date().toISOString(),
  baseUrl: options.baseUrl,
  screenshots,
  checks,
  limitations: [
    "Captured against a development server. The route returns 404 in production by design.",
    "Returning states are constructed local fixtures, not participant data.",
  ],
}

writeFileSync(
  resolve(options.outputDir, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
)
process.stdout.write(`${JSON.stringify({ checks, screenshots: screenshots.length }, null, 2)}\n`)

// ── Fixtures ────────────────────────────────────────────────────────────────

function returningProfile() {
  return {
    ...profileStoreV4,
    aiGovernance: {
      timestamp: 1_760_000_000_000,
      payload: "local-only",
      resultPath: "/ai/results/local-only",
      archetypeLabel: "Local fixture",
      locale: "en",
    },
  }
}

function draftSession(answeredCount: number) {
  const answers = Object.fromEntries(
    foundationCoreQuestions.slice(0, answeredCount).map((question) => [question.id, 4]),
  )
  return { v: 7, orderSeed: "capture", questionSet: "core", contextAssist: false, answers }
}

// ── Captures ────────────────────────────────────────────────────────────────

async function captureNetwork(instance: Browser) {
  const context = await instance.newContext({ baseURL: options.baseUrl, serviceWorkers: "block" })
  const page = await context.newPage()
  const requests: string[] = []
  const consoleErrors: string[] = []
  page.on("request", (request) => requests.push(request.url()))
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text())
  })
  page.on("pageerror", (error) => consoleErrors.push(String(error)))

  try {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto(ROUTE, { waitUntil: "load" })
    await page.waitForTimeout(600)
    for (const id of AREA_IDS) {
      await page.locator(`[data-prototype-area="${id}"]`).click()
    }
    await page.getByRole("button", { name: "See how the project works" }).click()
    await page.waitForTimeout(200)

    return {
      totalRequests: requests.length,
      mapboxRequests: requests.filter((url) =>
        /(?:api|events|tiles)\.mapbox\.com|mapbox-gl|mapbox-runtime/iu.test(url),
      ),
      thirdPartyRequests: requests.filter((url) => !url.startsWith(options.baseUrl)),
      canvasCount: await page.locator("canvas").count(),
      consoleErrors,
    }
  } finally {
    await context.close()
  }
}

async function captureStates(instance: Browser) {
  const viewports = [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
  ] as const

  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    for (const viewport of viewports) {
      for (const state of ["first-time", "returning"] as const) {
        if (reducedMotion === "reduce" && state === "returning") continue
        const context = await instance.newContext({
          baseURL: options.baseUrl,
          serviceWorkers: "block",
          reducedMotion,
          viewport,
        })
        const page = await context.newPage()
        try {
          await page.goto(ROUTE, { waitUntil: "load" })
          if (state === "returning") await seedReturning(page)
          await settle(page)
          const id = `${viewport.width}-${state}${reducedMotion === "reduce" ? "-reduced-motion" : ""}`
          const note = reducedMotion === "reduce"
            ? "Reduced-motion still state. No information or control is lost."
            : state === "returning"
              ? "Locally saved First Principles result, a Security record, and an AI record."
              : "Clean browser with no saved work."
          await shoot(page, id, viewport, state, reducedMotion, note)
          if (viewport.width === 390) {
            await shoot(page, `${id}-full`, viewport, `${state}:full-page`, reducedMotion,
              `${note} Full scroll length at 390px.`, true)
          }
        } finally {
          await context.close()
        }
      }
    }
  }
}

async function captureGeometry(instance: Browser) {
  const results: Record<string, unknown> = {}

  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 320, height: 844 }]) {
    const context = await instance.newContext({ baseURL: options.baseUrl, serviceWorkers: "block", viewport })
    const page = await context.newPage()
    try {
      await page.goto(ROUTE, { waitUntil: "load" })
      await settle(page)
      const perArea: Record<string, unknown> = {}
      // Document coordinates, not viewport coordinates: clicking a low row on a
      // scrolling page moves the viewport, which is not a layout change.
      const readIndexBox = () => page.evaluate(() => {
        const box = document.querySelector('[role="tablist"]')?.getBoundingClientRect()
        return box
          ? {
              top: Math.round(box.top + window.scrollY),
              left: Math.round(box.left + window.scrollX),
              width: Math.round(box.width),
              height: Math.round(box.height),
            }
          : null
      })
      let menuBox = await readIndexBox()
      let menuStable = true
      for (const id of AREA_IDS) {
        await page.locator(`[data-prototype-area="${id}"]`).click()
        await settle(page)
        perArea[id] = await page.evaluate(() => ({
          documentHeight: document.documentElement.scrollHeight,
          panelHeight: Math.round(
            document.querySelector("#prototype-panel")?.getBoundingClientRect().height ?? 0,
          ),
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }))
        const next = await readIndexBox()
        if (JSON.stringify(next) !== JSON.stringify(menuBox)) menuStable = false
        menuBox = next
      }
      results[`${viewport.width}x${viewport.height}`] = {
        viewportHeight: viewport.height,
        perArea,
        menuGeometryStableAcrossAreas: menuStable,
        horizontalOverflow: await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
        ),
      }
    } finally {
      await context.close()
    }
  }

  return results
}

async function captureSequence(instance: Browser) {
  const viewport = { width: 1440, height: 1000 }
  const context = await instance.newContext({ baseURL: options.baseUrl, serviceWorkers: "block", viewport })
  const page = await context.newPage()
  try {
    await page.goto(ROUTE, { waitUntil: "load" })
    await settle(page)

    for (const id of AREA_IDS) {
      await page.locator(`[data-prototype-area="${id}"]`).click()
      await settle(page)
      await shoot(page, `sequence-area-${id}`, viewport, `area:${id}`, "no-preference",
        `Detail region showing ${id}. The globe and the index do not move.`)
    }

    await page.getByRole("button", { name: "See how the project works" }).click()
    await settle(page)
    await shoot(page, "sequence-how-it-works", viewport, "works-open", "no-preference",
      "Expanded detail state with the four public labels and the four statements.", true)

    await page.getByRole("button", { name: "Hide how the project works" }).click()

    await seedReturning(page)
    await page.locator('[data-prototype-area="my-record"]').click()
    await settle(page)
    await shoot(page, "sequence-returning-my-record", viewport, "returning:my-record", "no-preference",
      "My Record with a saved result, one saved domain record, and one domain not started.")

    await page.evaluate(
      ({ key, session }) => window.localStorage.setItem(key, JSON.stringify(session)),
      { key: QUIZ_STORAGE_KEY, session: draftSession(8) },
    )
    await page.reload({ waitUntil: "load" })
    await page.locator('[data-prototype-area="my-record"]').click()
    await settle(page)
    await shoot(page, "sequence-returning-draft", viewport, "returning-draft", "no-preference",
      "Unfinished draft continuation line beside the primary action, and the draft row in My Record.")
  } finally {
    await context.close()
  }
}

async function captureKeyboard(instance: Browser) {
  const viewport = { width: 1440, height: 1000 }
  const context = await instance.newContext({ baseURL: options.baseUrl, serviceWorkers: "block", viewport })
  const page = await context.newPage()
  const reached: Array<{ area: string; entryLink: string | null }> = []
  try {
    await page.goto(ROUTE, { waitUntil: "load" })
    await settle(page)
    await page.locator('[data-prototype-area="start"]').focus()

    for (let step = 0; step < AREA_IDS.length; step += 1) {
      const area = await page.evaluate(
        () => document.activeElement?.getAttribute("data-prototype-area") ?? null,
      )
      await page.keyboard.press("Tab")
      const entryLink = await page.evaluate(() => {
        const active = document.activeElement
        return active && active.closest("#prototype-panel") ? active.textContent : null
      })
      await shoot(page, `keyboard-${step + 1}-${area ?? "unknown"}`, viewport, `keyboard:${area}`,
        "no-preference", `Keyboard path: tablist on ${area}, then the panel entry link.`)
      reached.push({ area: area ?? "unknown", entryLink })
      await page.keyboard.press("Shift+Tab")
      await page.keyboard.press("ArrowDown")
    }
  } finally {
    await context.close()
  }
  return { path: reached }
}

// ── Helpers ─────────────────────────────────────────────────────────────────

async function seedReturning(page: Page) {
  await page.evaluate(
    ({ key, profile }) => window.localStorage.setItem(key, JSON.stringify(profile)),
    { key: PROFILE_STORAGE_KEY, profile: returningProfile() },
  )
  await page.reload({ waitUntil: "load" })
}

async function settle(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready
    await new Promise<void>((done) =>
      requestAnimationFrame(() => requestAnimationFrame(() => done())))
  })
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        caret-color: transparent !important;
      }
      nextjs-portal { display: none !important; }
    `,
  })
}

async function shoot(
  page: Page,
  id: string,
  viewport: { width: number; height: number },
  state: string,
  reducedMotion: "no-preference" | "reduce",
  note: string,
  fullPage = false,
) {
  const path = resolve(options.outputDir, `${id}.png`)
  mkdirSync(dirname(path), { recursive: true })
  await page.screenshot({ path, fullPage, animations: "disabled" })
  screenshots.push({
    id,
    path: relative(repositoryRoot, path),
    viewport,
    state,
    reducedMotion,
    note,
  })
}

function parseOptions(argv: string[]): Options {
  let baseUrl = "http://127.0.0.1:3111"
  let outputDir = resolve(repositoryRoot, "artifacts/screenshots/prototype-product-refoundation")

  for (const argument of argv) {
    if (argument.startsWith("--base-url=")) baseUrl = argument.slice("--base-url=".length)
    else if (argument.startsWith("--out=")) outputDir = resolve(repositoryRoot, argument.slice("--out=".length))
  }

  return { baseUrl: baseUrl.replace(/\/$/u, ""), outputDir }
}
