// Run against the final production build and the accepted main build.
import { chromium } from "@playwright/test"
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { gzipSync } from "node:zlib"
import { resolve } from "node:path"

const output = resolve("artifacts/futures-departure")
mkdirSync(output, { recursive: true })
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
const baselineBuild = process.env.DEPARTURE_BASELINE_BUILD
if (!baselineBuild) throw new Error("Set DEPARTURE_BASELINE_BUILD to the verified main build directory.")
const measurements = []
for (const [label, origin, build, route] of [
  ["baseline", "http://127.0.0.1:3108", baselineBuild, "/futures"],
  ["candidate", "http://127.0.0.1:3107", resolve(".next"), "/futures"],
  ["candidate", "http://127.0.0.1:3107", resolve(".next"), "/futures/departure"],
]) {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(origin + route)
  await page.waitForLoadState("networkidle")
  const urls = await page.evaluate(() => performance.getEntriesByType("resource").map(item => item.name).filter(url => new URL(url).pathname.endsWith(".js")))
  const files = [...new Set(urls)].filter(url => url.startsWith(origin)).map(url => {
    const path = new URL(url).pathname.replace("/_next/", "")
    const data = readFileSync(resolve(build, path))
    return { path, bytes: data.byteLength, gzipBytes: gzipSync(data).byteLength }
  })
  measurements.push({ label, route, method: "Browser-requested JavaScript, unique same-origin resources; gzip computed per file", bytes: files.reduce((sum, file) => sum + file.bytes, 0), gzipBytes: files.reduce((sum, file) => sum + file.gzipBytes, 0), files })
  if (label === "baseline") {
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.screenshot({ path: `${output}/before-${width}.png`, fullPage: true })
    }
  }
}
const tokens = await page.evaluate(() => {
  const style = getComputedStyle(document.documentElement)
  return Object.fromEntries(["--bg", "--panel", "--text", "--text-2", "--muted", "--accent"].map(name => [name, style.getPropertyValue(name).trim()]))
})
function luminance(hex) {
  const rgb = hex.replace("#", "").match(/../g).map(value => parseInt(value, 16) / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4)
  return .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2]
}
const contrast = ["--bg", "--panel"].flatMap(bg => ["--text", "--text-2", "--muted", "--accent"].map(fg => {
  const l = [luminance(tokens[bg]), luminance(tokens[fg])].sort((a, b) => b - a)
  return { foreground: fg, background: bg, ratio: Number(((l[0] + .05) / (l[1] + .05)).toFixed(2)) }
}))
writeFileSync(`${output}/measurements.json`, JSON.stringify({ tokens, contrast, measurements }, null, 2) + "\n")
for (const width of [390, 1440]) {
  await page.setViewportSize({ width, height: 900 })
  await page.goto("http://127.0.0.1:3107/futures/departure")
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: `${output}/opening-viewport-${width}.png` })
}
await page.getByText("Source ledger and scientific assumptions", { exact: true }).click()
await page.emulateMedia({ media: "print" })
await page.pdf({ path: `${output}/opening-and-sources.pdf`, format: "A4", printBackground: false })
await browser.close()

const scenes = [
  ["opening", "Read the invitation", "The story starts with achievements as fictional givens, unknown return terms and a personal or policy framing."],
  ["invitation", "A · Consider unknown return terms", "Desired conditions, credibility, personal choice and another adult’s freedom remain distinct."],
  ["return", "B · Reconsider a revised offer", "Only the preference question stipulates a working return service. Credibility and the decision preserve uncertainty."],
  ["authority", "C · Decide what power remains", "A public mandate, monitoring access and intervention power are answered separately."],
  ["review", "Review before submitting", "Every choice is visible and editable. Changing an earlier answer clears later responses."],
  ["reading", "Read what the conditions change", "This example stays initially, allows others to leave and accepts the revised journey. It receives an account of those choices, without a score."],
]
writeFileSync(`${output}/walkthrough.html`, `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>The Departure · Visual walkthrough</title><style>
body{margin:0;background:#0a1322;color:#eef2f7;font:16px/1.6 system-ui,sans-serif}main{max-width:1100px;margin:auto;padding:32px 20px}h1{font:44px/1.15 Georgia,serif}a{color:#cea857}nav{display:flex;gap:12px;flex-wrap:wrap;margin:24px 0}button,select{font:inherit;padding:10px;background:#122139;border:1px solid #304563;color:#eef2f7;cursor:pointer}button[aria-current=true]{border-color:#cea857;color:#cea857}button:focus-visible,select:focus-visible{outline:2px solid #cea857;outline-offset:4px}#shot{display:block;width:100%;height:auto;border:1px solid #304563}#shot[data-width="390"]{max-width:390px}#description{max-width:70ch}small{color:#c7d2e0}</style><main><h1>The Departure</h1><p>A visual walkthrough of the English draft. These are captured screens, not an interactive copy of the exercise.</p><p><a href="http://127.0.0.1:3107/futures/departure">Open the playable local draft</a></p><label>Screen width <select id="width"><option value="1440">Desktop · 1440 pixels</option><option value="390">Mobile · 390 pixels</option></select></label><nav aria-label="Walkthrough scenes">${scenes.map((scene, i) => `<button type="button" data-scene="${i}" aria-current="${i === 0}">${scene[1]}</button>`).join("")}</nav><h2 id="title"></h2><p id="description"></p><img id="shot" alt=""><p><small>Draft departure-0.1-draft · 11 September 2026. Full-width captures include the independently browsable comparison shelf and sources.</small></p></main><script>
const scenes=${JSON.stringify(scenes)};let index=0;const width=document.querySelector('#width');function show(){const scene=scenes[index];document.querySelector('#title').textContent=scene[1];document.querySelector('#description').textContent=scene[2];const shot=document.querySelector('#shot');shot.src=scene[0]+'-'+width.value+'.png';shot.alt=scene[1]+' at '+width.value+' pixels';shot.dataset.width=width.value;document.querySelectorAll('[data-scene]').forEach(button=>button.setAttribute('aria-current',String(Number(button.dataset.scene)===index)))}document.querySelectorAll('[data-scene]').forEach(button=>button.addEventListener('click',()=>{index=Number(button.dataset.scene);show()}));width.addEventListener('change',show);show();</script></html>`)
console.log(JSON.stringify({ measurements: measurements.map(({ files, ...rest }) => rest), contrast, output }, null, 2))
