import { expect, test, type Page } from "@playwright/test"
import { mkdirSync, writeFileSync } from "node:fs"

const evidence = process.env.DECISION_REPAIR_DIR ?? "docs/evidence/decision-exercises-release/repair"
const mobileDestinations = ["/cases", "/quiz", "/modules", "/ai", "/perspectives", "/profile", "/explore/atlas", "/explore/reference", "/explore", "/futures", "/method", "/privacy", "/references", "/feedback"]

// macOS WebKit uses Option+Tab to include links with its default keyboard setting.
const tabKey = () => test.info().project.use.browserName === "webkit" ? "Alt+Tab" : "Tab"
async function openFromKeyboard(page: Page, trigger: import("@playwright/test").Locator) {
  for (let i = 0; i < 70; i++) {
    if (await trigger.evaluate(e => e === document.activeElement)) {
      await page.keyboard.press("Enter")
      return
    }
    await page.keyboard.press(tabKey())
  }
  throw new Error("Menu trigger was not reachable through the native keyboard path")
}

async function geometry(page: Page) {
  return page.evaluate(() => ({
    viewport: innerWidth, document: document.documentElement.scrollWidth,
    elements: [".header-inner", ".site-brand-link", ".mobile-nav", ".mobile-nav-sheet", ".nav-disclosure-menu"].map(selector => {
      const element = document.querySelector<HTMLElement>(selector)!
      const css = getComputedStyle(element), rect = element.getBoundingClientRect()
      return { selector, display: css.display, width: css.width, minWidth: css.minWidth, maxWidth: css.maxWidth, position: css.position,
        left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom,
        clientWidth: element.clientWidth, scrollWidth: element.scrollWidth, clientHeight: element.clientHeight, scrollHeight: element.scrollHeight,
        containingBlock: element.offsetParent?.className ?? null }
    }),
  }))
}

for (const width of [320, 390, 768]) test(`shared navigation fits ${width}px closed and expanded, with every destination reachable`, async ({ page }) => {
  mkdirSync(evidence, { recursive: true })
  await page.setViewportSize({ width, height: 844 })
  const observations = []
  for (const route of ["/cases", "/decisions", "/about", "/zh/cases", "/zh/about"]) {
    await page.goto(route)
    const mobile = width <= 720
    const disclosure = page.locator(mobile ? "details.mobile-nav" : ".header-nav .nav-disclosure")
    const trigger = disclosure.locator(":scope > summary")
    const closed = await geometry(page)
    expect(closed.document, `${route} closed`).toBeLessThanOrEqual(width + 1)
    const brand = await page.locator(".site-brand-link").boundingBox()
    expect(brand!.width).toBeGreaterThan(0)
    await openFromKeyboard(page, trigger)
    await expect(disclosure).toHaveAttribute("open", "")
    await expect(disclosure).not.toHaveAttribute("role", "dialog")
    await expect(disclosure).not.toHaveAttribute("aria-modal", "true")
    const open = await geometry(page)
    expect(open.document, `${route} open`).toBeLessThanOrEqual(width + 1)
    const panel = page.locator(mobile ? ".mobile-nav-sheet" : ".header-nav .nav-disclosure-menu")
    const box = await panel.boundingBox()
    expect(box!.x).toBeGreaterThanOrEqual(6)
    expect(box!.x + box!.width).toBeLessThanOrEqual(width - 6)
    expect(box!.y + box!.height).toBeLessThanOrEqual(844)
    expect(await panel.evaluate(e => e.scrollWidth <= e.clientWidth + 1)).toBe(true)
    const links = panel.locator("a")
    const hrefs = await links.evaluateAll(elements => elements.map(e => e.getAttribute("href")))
    if (mobile) {
      for (const href of mobileDestinations) expect(hrefs).toContain(route.startsWith("/zh") ? `/zh${href}` : href)
      await expect(panel.getByRole("link", { name: route.startsWith("/zh") ? "切换至英文" : "Switch to Simplified Chinese" })).toBeVisible()
      if (!route.startsWith("/zh")) {
        await expect(panel.getByText("Thinkers & public positions", { exact: true })).toBeVisible()
        await expect(panel.getByText("Corrections and contact", { exact: true })).toBeVisible()
      }
    }
    // Native Tab reaches every anchor, scrolling the panel and its focus ring.
    for (let i = 0; i < await links.count(); i++) {
      await page.keyboard.press(tabKey())
      await expect(links.nth(i)).toBeFocused()
      const focused = await links.nth(i).evaluate(e => {
        const r = e.getBoundingClientRect(), s = getComputedStyle(e)
        const text = document.createRange(); text.selectNodeContents(e)
        return { left: r.left, right: r.right, top: r.top, bottom: r.bottom,
          outline: parseFloat(s.outlineWidth), offset: parseFloat(s.outlineOffset), visible: e.matches(":focus-visible"),
          textRight: Math.max(...Array.from(text.getClientRects(), line => line.right)) }
      })
      expect(focused.visible).toBe(true)
      expect(focused.outline).toBeGreaterThanOrEqual(2)
      const ring = focused.outline + focused.offset
      expect(focused.left - ring).toBeGreaterThanOrEqual(box!.x)
      expect(focused.right + ring).toBeLessThanOrEqual(box!.x + box!.width)
      expect(focused.top - ring).toBeGreaterThanOrEqual(box!.y - 1)
      expect(focused.bottom + ring).toBeLessThanOrEqual(box!.y + box!.height + 1)
      expect(focused.textRight).toBeLessThanOrEqual(focused.right + 1)
    }
    await page.keyboard.press(tabKey())
    await expect(disclosure).not.toHaveAttribute("open", "") // non-modal exit
    await openFromKeyboard(page, trigger)
    await page.keyboard.press(tabKey())
    await page.keyboard.press("Escape")
    await expect(disclosure).not.toHaveAttribute("open", "")
    await expect(trigger).toBeFocused()
    await page.keyboard.press("Enter")
    if (mobile && ["/cases", "/decisions", "/zh/cases"].includes(route)) {
      await panel.evaluate(e => { e.scrollTop = 0 })
      await page.screenshot({ path: `${evidence}/after-menu-${route.slice(1).replaceAll("/", "-")}-${width}.png` })
    }
    await page.keyboard.press("Enter")
    await expect(disclosure).not.toHaveAttribute("open", "")
    await expect(trigger).toBeFocused()
    observations.push({ route, closed, open, hrefs })
  }
  writeFileSync(`${evidence}/menu-geometry-${width}.json`, JSON.stringify(observations, null, 2))
})

test("six decorative overflow witnesses fit 1440px before and after evidence expansion", async ({ page }) => {
  mkdirSync(evidence, { recursive: true })
  await page.setViewportSize({ width: 1440, height: 900 })
  const observations = []
  for (const route of ["/compare", "/explore/reference", "/futures", "/perspectives", "/references", "/zh/explore/reference"]) {
    await page.goto(route)
    const read = () => page.evaluate(() => ({ document: document.documentElement.scrollWidth,
      owners: Array.from(document.querySelectorAll(".article-header,.lobby-hero,.result-hero"), e => {
        const s = getComputedStyle(e, "::before")
        return { class: e.className, right: s.right, width: s.width, pointerEvents: s.pointerEvents }
      }) }))
    const closed = await read()
    expect(closed.document, `${route} default`).toBeLessThanOrEqual(1441)
    expect(closed.owners.length).toBeGreaterThan(0)
    expect(closed.owners.every(o => o.right === "0px" && o.pointerEvents === "none")).toBe(true)
    for (const summary of await page.locator("main details > summary").all()) await summary.click()
    const expanded = await read()
    expect(expanded.document, `${route} expanded`).toBeLessThanOrEqual(1441)
    observations.push({ route, closed, expanded })
    await page.evaluate(() => scrollTo(0, 0))
    await page.screenshot({ path: `${evidence}/after-desktop-${route.slice(1).replaceAll("/", "-")}.png` })
  }
  writeFileSync(`${evidence}/desktop-geometry.json`, JSON.stringify(observations, null, 2))
})
