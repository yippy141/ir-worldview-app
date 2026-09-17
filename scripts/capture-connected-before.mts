import { chromium } from "@playwright/test"
import { mkdir } from "node:fs/promises"
import { syntheticProfile } from "@/tests/connected-fixtures"
import { serializeProfileStore } from "@/lib/profile-store"
import { buildCompatibleProfileSharePayload, encodeProfileSharePayload } from "@/lib/profile-share"
import { PROFILE_STORAGE_KEY } from "@/lib/storage-keys"
const folder = 'docs/review/connected-profile/before'
await mkdir(folder, { recursive: true })
const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
await context.route('**/*', route => ['GET','HEAD'].includes(route.request().method()) ? route.continue() : route.abort())
const page = await context.newPage()
const profile = syntheticProfile().profile
await page.goto('http://127.0.0.1:3252/profile', { timeout: 120000 })
await page.evaluate(({ key, value }) => localStorage.setItem(key,value), { key: PROFILE_STORAGE_KEY, value: serializeProfileStore(profile) })
await page.reload()
await page.locator('.profile-saved-index').waitFor()
await page.screenshot({ path: `${folder}/profile-1440.png`, fullPage: true })
const token = encodeProfileSharePayload(buildCompatibleProfileSharePayload(profile)!)
await page.goto(`http://127.0.0.1:3252/compare?left=${token}&right=${token}`, { timeout: 120000 })
await page.locator('.compare-argument-card').waitFor()
await page.locator('.compare-argument-card').screenshot({ path: `${folder}/identical-pair-1440.png` })
await browser.close()
