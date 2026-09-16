import { expect, test, type Page } from "@playwright/test"
import { geoOrthographic } from "d3-geo"
import { ROOT_GLOBE_SCENES } from "../lib/root/globe-scenes"
import { ROOT_SCENE_MS } from "../lib/root/globe-types"
import { PROFILE_STORAGE_KEY } from "../lib/storage-keys"

const globeOf = (page: Page) => page.locator("[data-root-globe]")
async function ready(page: Page, route = "/") {
  await page.goto(route)
  await expect(globeOf(page)).toHaveAttribute("data-enhanced", "true")
  return globeOf(page)
}
const camera = (page: Page) => globeOf(page).evaluate(el => ["longitude", "latitude", "zoom"].map(key => el.getAttribute(`data-${key}`)))

test("Enter is immediate, reveals the one menu without remounting the globe, and Back returns there", async ({ page }) => {
  const requests: string[] = []; page.on("request", request => requests.push(request.url()))
  const globe = await ready(page)
  await expect(page.getByRole("link", { name: "Enter", exact: true })).toBeVisible()
  await expect(page.getByText("Explore your views on international politics, technology and possible futures.")).toBeVisible()
  await globe.getByRole("button", { name: "Pause", exact: true }).click()
  const before = await camera(page)
  await globe.evaluate(el => el.setAttribute("data-mount-witness", "original"))
  await page.getByRole("link", { name: "Enter", exact: true }).click()
  await expect(page).toHaveURL(/#menu$/)
  await expect(page.locator("#menu-heading")).toBeFocused()
  expect(await camera(page)).toEqual(before)
  await expect(globe).toHaveAttribute("data-mount-witness", "original")
  const nav = page.getByRole("navigation", { name: "Primary destinations" })
  await expect(nav).toBeVisible()
  await expect(nav.locator("section > h3")).toHaveText(["Questionnaires", "Futures", "Cases and exercises", "Library", "Your worldview"])
  await expect(nav.getByRole("link", { name: "Foundation", exact: true })).toHaveAttribute("href", "/quiz")
  await nav.getByRole("link", { name: "Library", exact: true }).hover()
  expect(await camera(page)).toEqual(before)
  await nav.getByRole("link", { name: "Profile", exact: true }).click()
  await expect(page).toHaveURL(/\/profile$/)
  await expect(globe).toHaveCount(0)
  await page.goBack()
  await expect(nav).toBeVisible()
  await expect(page.getByRole("link", { name: "Enter", exact: true })).toBeHidden()
  expect(requests.filter(url => /(?:api|events|tiles)\.mapbox\.com|mapbox-gl|mapbox-runtime/i.test(url))).toEqual([])
})

test("pointer capture rotates the projection, cancels cleanly and retains its last camera until Play", async ({ page }) => {
  const globe = await ready(page)
  const art = globe.getByRole("group", { name: "Rotatable globe of imagined alignments", exact: true })
  const box = (await art.boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down(); await page.mouse.move(box.x + box.width * .8, box.y + box.height * .65, { steps: 8 })
  await expect(globe).toHaveAttribute("data-paused", "true")
  expect(Number((await camera(page))[0])).toBeLessThan(0)
  expect(Number((await camera(page))[1])).toBeGreaterThan(20)
  const moved = await camera(page)
  await page.mouse.up(); await page.waitForTimeout(400)
  expect(await camera(page)).toEqual(moved)
  await page.mouse.down(); await art.dispatchEvent("pointercancel", { pointerId: 1 })
  await expect(globe).toHaveAttribute("data-dragging", "false")
  await page.mouse.move(box.x, box.y); await page.mouse.up()
  expect(await camera(page)).toEqual(moved)
  await globe.getByRole("button", { name: "Play", exact: true }).click()
  await expect.poll(async () => (await camera(page))[0]).not.toBe(moved[0])
})

test("keyboard wraps longitude, bounds poles and zoom, resets without changing story, and Tab exits", async ({ page }) => {
  const globe = await ready(page)
  const art = globe.getByRole("group", { name: "Rotatable globe of imagined alignments", exact: true })
  await art.focus(); await page.keyboard.press("Home")
  for (let i = 0; i < 12; i++) await page.keyboard.press("Shift+ArrowRight")
  expect(Number((await camera(page))[0])).toBe(-105)
  for (let i = 0; i < 12; i++) await page.keyboard.press("Shift+ArrowUp")
  expect(Number((await camera(page))[1])).toBe(89)
  for (let i = 0; i < 12; i++) await page.keyboard.press("Shift+ArrowDown")
  expect(Number((await camera(page))[1])).toBe(-89)
  for (let i = 0; i < 12; i++) await page.keyboard.press("+")
  expect(Number((await camera(page))[2])).toBe(2.4)
  await page.keyboard.press("Tab")
  await expect(globe.getByRole("button", { name: "Previous globe scene" })).toBeFocused()
  await globe.getByRole("button", { name: "Next globe scene" }).click()
  const scene = await globe.getAttribute("data-scene")
  await globe.getByRole("button", { name: "Reset view" }).click()
  expect(await camera(page)).toEqual(["15", "8", "1"])
  await expect(globe).toHaveAttribute("data-scene", scene!)
  await expect(globe.getByRole("button", { name: "Zoom globe out" })).toBeDisabled()
  await expect(globe).toHaveAttribute("data-paused", "true")
})

test("wheel zoom needs an intentionally focused globe and never captures Ctrl+wheel", async ({ page }) => {
  const globe = await ready(page)
  const art = globe.getByRole("group", { name: "Rotatable globe of imagined alignments", exact: true })
  await art.hover(); await page.mouse.wheel(0, -400)
  expect(Number((await camera(page))[2])).toBe(1)
  await art.focus(); await page.mouse.wheel(0, -400)
  await expect.poll(async () => Number((await camera(page))[2])).toBeGreaterThan(1)
  const before = await camera(page)
  await art.dispatchEvent("wheel", { deltaY: -400, ctrlKey: true })
  expect(await camera(page)).toEqual(before)
})

async function pixel(page: Page, longitude: number, latitude: number) {
  const [lon, lat, zoom] = (await camera(page)).map(Number)
  const p = geoOrthographic().translate([500, 500]).scale(445 * zoom).rotate([-lon, -lat])([longitude, latitude])!
  return globeOf(page).locator("canvas").evaluate((canvas: HTMLCanvasElement, point) => {
    const data = canvas.getContext("2d")!.getImageData(Math.round(point[0] * canvas.width / 1000), Math.round(point[1] * canvas.width / 1000), 1, 1).data
    return `#${[...data].slice(0, 3).map(v => v.toString(16).padStart(2, "0")).join("")}`
  }, p)
}

test("the deterministic sequence commits titles and actual fills together, pauses, and wraps coherently", async ({ page }) => {
  await page.clock.install({ time: new Date("2026-09-16T00:00:00Z") })
  const globe = await ready(page)
  await page.clock.pauseAt(new Date("2026-09-16T00:01:00Z"))
  for (let i = 0; i < ROOT_GLOBE_SCENES.length && await globe.getAttribute("data-scene") !== "atlantic-pacific"; i++) {
    await globe.getByRole("button", { name: "Previous globe scene" }).click()
  }
  await globe.getByRole("group", { name: "Rotatable globe of imagined alignments", exact: true }).focus(); await page.keyboard.press("Home")
  expect(await pixel(page, 10, 51)).toBe("#86abd2")
  await globe.getByRole("button", { name: "Next globe scene" }).click()
  await expect(globe.locator("h2")).toHaveText("European autonomy")
  expect(await pixel(page, 10, 51)).toBe("#cea857")
  const frozen = await camera(page)
  await page.clock.runFor(ROOT_SCENE_MS + 500)
  expect(await camera(page)).toEqual(frozen)
  await expect(globe).toHaveAttribute("data-scene", "european-autonomy")
  for (const scene of ROOT_GLOBE_SCENES.slice(2)) {
    await globe.getByRole("button", { name: "Next globe scene" }).click()
    await expect(globe).toHaveAttribute("data-scene", scene.id)
    await expect(globe.locator("h2")).toHaveText(scene.title)
    await expect(globe.getByText("Imagined alignments", { exact: true })).toBeVisible()
    expect(await camera(page)).toEqual(frozen)
  }
  await globe.getByRole("button", { name: "Play", exact: true }).click()
  await page.clock.runFor(ROOT_SCENE_MS + 32)
  await expect(globe).toHaveAttribute("data-scene", "atlantic-pacific")
  await globe.getByRole("button", { name: "Pause", exact: true }).click()
  const paused = await camera(page)
  await page.clock.runFor(ROOT_SCENE_MS + 500)
  expect(await camera(page)).toEqual(paused)
})

for (const width of [320, 390, 768, 1440]) test(`opening and menu reflow at ${width}px without hiding overflow`, async ({ page }) => {
  await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 })
  await ready(page)
  await expect(page.getByRole("link", { name: "Enter", exact: true })).toBeInViewport()
  for (const state of ["entrance", "menu"]) {
    if (state === "menu") await page.getByRole("link", { name: "Enter", exact: true }).click()
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
    expect(await page.locator("main").evaluate(el => getComputedStyle(el).overflowX)).not.toBe("hidden")
  }
})

test("reduced motion is a complete still with manual input; print retains the fiction label and menu", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  const globe = await ready(page)
  const before = await camera(page)
  await page.waitForTimeout(400); expect(await camera(page)).toEqual(before)
  await expect(globe.getByRole("button", { name: "Play", exact: true })).toBeDisabled()
  await globe.getByRole("button", { name: "Next globe scene" }).click()
  await expect(globe.locator("h2")).toHaveText("European autonomy")
  await globe.getByRole("group", { name: "Rotatable globe of imagined alignments", exact: true }).focus(); await page.keyboard.press("ArrowRight")
  expect(await camera(page)).not.toEqual(before)
  await page.emulateMedia({ media: "print" })
  await expect(page.getByRole("navigation", { name: "Primary destinations" })).toBeVisible()
  await expect(globe.getByText("Imagined alignments", { exact: true })).toBeVisible()
  await expect(globe.getByRole("button", { name: "Reset view" })).toBeHidden()
})

test("no-JS root has an Enter anchor, a complete semantic menu and the labelled still", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } })
  const page = await context.newPage(); await page.goto(`${baseURL}/`)
  await page.getByRole("link", { name: "Enter", exact: true }).click()
  await expect(page).toHaveURL(/#menu$/)
  await expect(page.getByRole("navigation", { name: "Primary destinations" })).toBeInViewport()
  await expect(page.locator("[data-root-group]")).toHaveCount(5)
  await expect(page.getByText("Imagined alignments", { exact: true })).toBeVisible()
  await page.getByRole("navigation", { name: "Primary destinations" }).getByRole("link", { name: "Foundation", exact: true }).click()
  await expect(page).toHaveURL(/\/quiz$/)
  await context.close()
})

test("deep links bypass the opening; local saved work and direct locale menu entries remain available", async ({ page }) => {
  for (const route of ["/quiz", "/results/invalid", "/futures/scenarios/gatekeeper", "/explore/realism"]) {
    await page.goto(route); await expect(globeOf(page)).toHaveCount(0)
  }
  await page.evaluate(key => localStorage.setItem(key, JSON.stringify({ v: 5, foundation: { payload: "local-only" } })), PROFILE_STORAGE_KEY)
  await page.goto("/")
  await expect(page.locator("main")).toHaveAttribute("data-root-mode", "menu")
  await expect(page.getByText("A Foundation result is saved on this device.", { exact: true })).toBeVisible()
  await page.goto("/zh#menu")
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans")
  await expect(page.getByRole("navigation", { name: "主要入口" })).toBeVisible()
  expect(await page.locator('[data-root-group="questionnaires"] a').evaluateAll(links => links.map(link => link.getAttribute("href")))).toEqual(["/zh/quiz", "/zh/modules/security", "/zh/modules/technology", "/zh/ai"])
  await page.locator(".language-switcher").click()
  await expect(page).toHaveURL(/\/#menu$/)
})

test("documented EU/NATO and RCEP records retain their sources and never enter the fictional interface", async ({ page }) => {
  await page.goto("/world-stage#membership-maps")
  const globe = page.locator("[data-documented-globe]")
  await expect(globe).toHaveAttribute("data-enhanced", "true")
  await expect(globe).toHaveAttribute("data-scene", "eu-nato")
  await expect(globe.getByText("Membership snapshot: 16 Sep 2026", { exact: true })).toBeVisible()
  await globe.locator("summary").click()
  await expect(globe.getByRole("link", { name: /NATO member countries/ })).toBeVisible()
  const before = await globe.getAttribute("data-longitude")
  await page.waitForTimeout(250); await expect(globe).toHaveAttribute("data-longitude", before!)
  await globe.getByRole("button", { name: "Next globe scene" }).click()
  await expect(globe).toHaveAttribute("data-scene", "rcep-signing")
  await expect(globe.getByText("Signed: 15 Nov 2020", { exact: true })).toBeVisible()
  await expect(globe.getByRole("link", { name: /Australian Border Force/ })).toBeVisible()
  await expect(globeOf(page)).toHaveCount(0)
  await expect(page.locator("#world-stage-map-view")).toBeAttached()
  await expect(page.locator("path[data-iso3]")).toHaveCount(174)
  await page.goto("/")
  await expect(page.locator("[data-documented-globe]")).toHaveCount(0)
  await expect(globeOf(page).getByText("Source", { exact: true })).toHaveCount(0)
})

test("touch rotation yields vertical page scrolling and releases capture on browser cancellation", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 600 }, hasTouch: true, isMobile: true })
  const page = await context.newPage(); const globe = await ready(page, `${baseURL}/`)
  const art = globe.getByRole("group", { name: "Rotatable globe of imagined alignments", exact: true }); const box = (await art.boundingBox())!
  const cdp = await context.newCDPSession(page)
  const x = box.x + box.width / 2, y = box.y + box.height / 2
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] })
  await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x + 70, y }] })
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] })
  await expect(globe).toHaveAttribute("data-paused", "true")
  const rotated = await camera(page)
  expect(Number(rotated[0])).toBeLessThan(0)
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] })
  await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: y - 110 }] })
  await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: y - 170 }] })
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] })
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0)
  await expect(globe).toHaveAttribute("data-dragging", "false")
  await context.close()
})

test("offscreen and hidden views suspend the camera and scene without consuming elapsed time", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 600 })
  const globe = await ready(page)
  await page.getByRole("link", { name: "Enter", exact: true }).click()
  await page.evaluate(() => scrollTo(0, 0))
  await expect(globe).toHaveAttribute("data-paused", "true")
  const before = await camera(page)
  await page.waitForTimeout(400); expect(await camera(page)).toEqual(before)
  await globe.getByRole("group", { name: "Rotatable globe of imagined alignments", exact: true }).scrollIntoViewIfNeeded()
  await expect(globe).toHaveAttribute("data-paused", "false")
  await page.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, value: true }); document.dispatchEvent(new Event("visibilitychange")) })
  const hidden = await camera(page)
  await page.waitForTimeout(400); expect(await camera(page)).toEqual(hidden)
  await page.evaluate(() => { delete (document as unknown as { hidden?: boolean }).hidden; document.dispatchEvent(new Event("visibilitychange")) })
  await expect.poll(async () => (await camera(page))[0]).not.toBe(hidden[0])
})

test("reading introductions align with their prose and preserve a comfortable measure without the hero glow", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  for (const route of ["/explore/realism", "/explore/institutionalism", "/explore/constructivism", "/explore/critical-political-economy"]) {
    await page.goto(route)
    const geometry = await page.locator(".atlas-body").evaluate(el => {
      const body = el.getBoundingClientRect(), header = el.querySelector(".article-header")!, parent = el.querySelector(".reading-parent")!
      return { x: body.x, width: body.width, headerX: header.getBoundingClientRect().x, parentX: parent.getBoundingClientRect().x, glow: getComputedStyle(header, "::before").backgroundImage, padding: getComputedStyle(header).paddingTop }
    })
    expect(geometry.headerX, route).toBe(geometry.x); expect(geometry.parentX, route).toBe(geometry.x)
    expect(geometry.width).toBeLessThanOrEqual(760); expect(geometry.glow).toBe("none"); expect(parseFloat(geometry.padding)).toBeLessThanOrEqual(20)
  }
  for (const route of ["/explore/reference/susan-strange", "/ai/atlas/precautionarySteward", "/ai/field-guide", "/modules"]) {
    await page.goto(route)
    const glows = await page.locator(".article-header,.lobby-hero,.result-hero").evaluateAll(elements => elements.map(el => getComputedStyle(el, "::before").backgroundImage))
    expect(glows.every(value => value === "none"), route).toBe(true)
    expect(await page.locator("h1").first().isVisible()).toBe(true)
  }
})

for (const storage of ["fresh", "blocked"]) test(`direct English and Chinese menu map inspection preserves the menu with ${storage} storage`, async ({ browser, baseURL }) => {
  const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 1000 } })
  if (storage === "blocked") await context.addInitScript(() => {
    for (const key of ["localStorage", "sessionStorage"]) Object.defineProperty(window, key, { get: () => { throw new DOMException("Blocked", "SecurityError") } })
  })
  const page = await context.newPage()
  for (const [prefix, label] of [["", "Explore the map"], ["/zh", "探索地图"]]) {
    await page.goto(`${baseURL}${prefix}/#menu`)
    await page.getByRole("link", { name: label, exact: true }).click()
    await expect(page.locator("main")).toHaveAttribute("data-root-mode", "menu")
    await expect(page.locator("#menu")).toBeVisible()
    await expect(page.locator("#map-details")).toHaveAttribute("open", "")
  }
  await context.close()
})
