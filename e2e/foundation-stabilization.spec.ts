import { expect, test } from "@playwright/test"
import { syntheticAnswers } from "../tests/decision-exercises/fixtures"
import { foundationCoreQuestions, getFoundationQuestionsForSet, questionCountsBySet } from "../lib/quiz-schema"
import { generateResult } from "../lib/scoring"
import { buildFoundationSharePayload, encodePayload } from "../lib/share"
import { buildCompatibleProfileSharePayload, encodeProfileSharePayload } from "../lib/profile-share"
import { parseProfileStore } from "../lib/profile-store"
import { PROFILE_STORAGE_KEY, QUIZ_STORAGE_KEY } from "../lib/storage-keys"
import profileFixture from "../tests/fixtures/profile-store-v5.json"

const flatAnswers = Object.fromEntries(foundationCoreQuestions.map(q => [q.id,4]))
const flat = encodePayload(buildFoundationSharePayload(generateResult(flatAnswers,"analyst","core"),"en","core"))
const multi = encodePayload(buildFoundationSharePayload(generateResult(syntheticAnswers(25282,"core"),"analyst","core"),"en","core"))
const clear = encodePayload(buildFoundationSharePayload(generateResult(syntheticAnswers(3,"core"),"analyst","core"),"en","core"))
const two = encodePayload(buildFoundationSharePayload(generateResult(syntheticAnswers(1,"core"),"analyst","core"),"en","core"))

for (const prefix of ["", "/zh"]) {
  test(`${prefix || "English"} flat and multiway results suppress arbitrary pairs and use the general extension`, async ({ page, request }) => {
    await page.setViewportSize(prefix ? {width:390,height:844} : {width:1440,height:1000})
    for (const [payload,kind] of [[flat,"flat"],[multi,"multiway-tie"]]) {
      await page.goto(`${prefix}/results/${payload}`)
      await expect(page.locator("[data-foundation-presentation]")).toHaveAttribute("data-foundation-presentation",kind)
      await expect(page.locator("[data-foundation-mark]")).toHaveCount(0)
      await expect(page.locator("[data-foundation-dimensions] li")).toHaveCount(7)
      await expect(page.locator('a[href*="extension=targeted"]')).toHaveCount(0)
      await expect(page.locator('a[href*="extension=full"]').first()).toContainText(String(questionCountsBySet.baselineExtended))
      await expect(page.locator('#nearest, #matrix, #contribution, #worked-case')).toHaveCount(0)
      await expect(page.locator('meta[property="og:title"]')).not.toHaveAttribute("content", /Kairos|Grotian|Mētis|Kautilya/)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
    }
    await page.screenshot({path:`/private/tmp/package-b-${prefix ? "zh-mobile" : "en-desktop"}.png`})
    const response = await request.get(`/api/card?payload=${multi}`)
    expect(response.status()).toBe(200)
    expect(response.headers()["content-type"]).toContain("image/png")
    if (!prefix) {
      const fs = await import("node:fs/promises")
      await fs.writeFile("/private/tmp/package-b-multi-card.png",await response.body())
    }
  })
}

test("clear and exact two-way results retain marks; worked case follows personal evidence and matrix", async ({ page }) => {
  for (const prefix of ["", "/zh"]) {
    await page.goto(`${prefix}/results/${clear}`)
    await expect(page.locator('[data-foundation-mark]')).toHaveCount(1)
    await expect(page.locator('[data-contribution-endpoints] > span')).toHaveCount(2)
    const ids = await page.locator('[data-foundation-story-chapter], [data-zh-foundation-story-chapter]').evaluateAll(elements => elements.map(el => el.id))
    for (const id of ["contribution","matrix","evidence"]) expect(ids.indexOf(id)).toBeLessThan(ids.indexOf("worked-case"))
    await expect(page.locator('#worked-case')).toContainText(prefix ? "不计分" : "unscored")
    await page.goto(`${prefix}/results/${two}`)
    await expect(page.locator('[data-foundation-presentation]')).toHaveAttribute("data-foundation-presentation","two-way-tie")
    await expect(page.locator('[data-foundation-mark="blend"]')).toHaveCount(1)
    await expect(page.locator('a[href*="extension=targeted"]').first()).toBeVisible()
  }
})

test("local and shared Profiles use the neutral title without changing the saved snapshot", async ({ page }) => {
  const profile = parseProfileStore(JSON.stringify(profileFixture),"en")
  profile.foundation = {...profile.foundation!,payload:multi,resultPath:`/results/${multi}`}
  const saved = JSON.stringify(profile)
  const shared = encodeProfileSharePayload(buildCompatibleProfileSharePayload(profile)!)
  await page.addInitScript(({key,value}) => localStorage.setItem(key,value),{key:PROFILE_STORAGE_KEY,value:saved})
  for (const prefix of ["", "/zh"]) {
    for (const route of [`${prefix}/profile`,`${prefix}/profile/share/${shared}`]) {
      await page.goto(route)
      await expect(page.locator('[data-foundation-dimensions]')).toBeVisible()
      await expect(page.locator('main')).toContainText(prefix ? "3 种传统并列领先" : "3 traditions tied at the top")
    }
  }
  expect(await page.evaluate(key => localStorage.getItem(key),PROFILE_STORAGE_KEY)).toBe(saved)
})

test("manually requested targeted extension cannot select a pair for a tied core; help stays collapsed", async ({ page }) => {
  await page.addInitScript(({key,answers}) => localStorage.setItem(key,JSON.stringify({v:7,questionSet:"core",activeMode:"analyst",orderSeed:"b",answers,contextAssist:false,itemLatencyBuckets:{},foundationCopy:{status:"single-copy",locale:"en",version:1}})),{key:QUIZ_STORAGE_KEY,answers:flatAnswers})
  await page.goto('/quiz?extension=targeted&first=realist&second=institutionalist')
  await expect(page.getByText(`${questionCountsBySet.baselineExtended} additional questions`,{exact:false})).toBeVisible()
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).questionSet,QUIZ_STORAGE_KEY)).toBe("baselineExtended")
  const questions = getFoundationQuestionsForSet("baselineExtended")
  // Keep the resulting draft and inspect the actual supplemental help panels.
  for (const [id,term] of [["case_protection","General license"],["v21_rs_rev_05","Forward presence"]]) {
    const index = questions.findIndex(q => q.id === id)
    expect(index).toBeGreaterThanOrEqual(0)
    await page.goto(`/quiz?extension=full&q=${index}`)
    const toggle = page.getByRole('button',{name:/Plain-language explanation|Quick explainer/})
    await expect(toggle).toHaveAttribute("aria-expanded","false")
    await expect(page.getByText(`${term}:`,{exact:true})).toHaveCount(0)
    await toggle.click()
    await expect(page.getByText(`${term}:`,{exact:true})).toBeVisible()
  }
})
