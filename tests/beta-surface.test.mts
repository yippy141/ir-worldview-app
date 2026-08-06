import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { englishBetaPage } from "@/content/locales/en/beta"
import { zhHansBetaPage } from "@/content/locales/zh-Hans/beta"
import {
  betaNavigationEnabled,
  getBetaNavigationItem,
  getBetaParticipationUrl,
} from "@/lib/beta-config"

function source(relativePath: string) {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8")
}

test("controlled-beta participation accepts only credential-free HTTPS URLs", () => {
  for (const value of [
    undefined,
    "",
    "   ",
    "not a URL",
    "/feedback",
    "http://example.com/form",
    "javascript:alert(1)",
    "https://user:secret@example.com/form",
  ]) {
    assert.equal(getBetaParticipationUrl(value), null, String(value))
  }

  assert.equal(
    getBetaParticipationUrl(" https://example.com/interview?source=inventory "),
    "https://example.com/interview?source=inventory",
  )
})

test("controlled-beta navigation is hidden unless the exact flag is enabled", () => {
  for (const value of [undefined, "", "false", "1", "yes", "enabled"]) {
    assert.equal(betaNavigationEnabled(value), false, String(value))
  }

  assert.equal(betaNavigationEnabled("true"), true)
  assert.equal(betaNavigationEnabled(" TRUE "), true)
  assert.equal(getBetaNavigationItem(false), null)
  assert.deepEqual(getBetaNavigationItem(true), {
    href: "/beta",
    labelKey: "nav.beta",
  })
})

test("English and Simplified Chinese beta copy share the safety contract", () => {
  for (const content of [englishBetaPage, zhHansBetaPage]) {
    assert.equal(content.testingItems.length, 3)
    assert.equal(content.prohibitedItems.length, 4)
    assert.ok(content.title.length > 0)
    assert.ok(content.metadata.title.length > 0)
    assert.ok(content.metadata.description.length > 0)
    assert.ok(content.optionalNote.length > 0)
    assert.ok(content.linkUnavailable.length > 0)
    assert.ok(content.productFeedbackBody.length > 0)
    assert.ok(content.tier1Body.length > 0)
    assert.ok(content.externalDataBody.length > 0)
  }

  assert.match(englishBetaPage.testingItems.join(" "), /Comprehension/)
  assert.match(englishBetaPage.testingItems.join(" "), /Fairness/)
  assert.match(englishBetaPage.testingItems.join(" "), /Usefulness/)
  assert.match(englishBetaPage.prohibitedItems.join(" "), /quiz answers/)
  assert.match(englishBetaPage.prohibitedItems.join(" "), /result URLs/)
  assert.match(englishBetaPage.prohibitedItems.join(" "), /employer or school/)
  assert.match(englishBetaPage.prohibitedItems.join(" "), /another person/)

  assert.match(zhHansBetaPage.testingItems.join(" "), /理解/)
  assert.match(zhHansBetaPage.testingItems.join(" "), /公平/)
  assert.match(zhHansBetaPage.testingItems.join(" "), /用途/)
  assert.match(zhHansBetaPage.prohibitedItems.join(" "), /问卷答案/)
  assert.match(zhHansBetaPage.prohibitedItems.join(" "), /结果网址/)
  assert.match(zhHansBetaPage.prohibitedItems.join(" "), /雇主或学校/)
  assert.match(zhHansBetaPage.prohibitedItems.join(" "), /其他人的信息/)
})

test("beta routes render an accessible outbound link but no in-app collection surface", () => {
  const component = source("components/beta/controlled-beta-page.tsx")
  const routeSources = [
    component,
    source("app/beta/page.tsx"),
    source("app/[locale]/beta/page.tsx"),
  ].join("\n")

  assert.match(component, /target="_blank"/)
  assert.match(component, /rel="noopener noreferrer"/)
  assert.match(component, /aria-describedby="beta-external-service-note"/)
  assert.match(component, /className="sr-only"/)
  assert.match(component, /participationUrl \?/)

  assert.doesNotMatch(routeSources, /<form\b/i)
  assert.doesNotMatch(routeSources, /\bfetch\s*\(/)
  assert.doesNotMatch(routeSources, /\/api\//)
  assert.doesNotMatch(routeSources, /@\/lib\/(?:db|tier1\/store)/)
})

test("the factual-correction route remains separate from beta recruitment", () => {
  const feedbackSource = source("app/feedback/page.tsx")

  assert.match(feedbackSource, /factual correction/i)
  assert.match(feedbackSource, /privacy question/i)
  assert.match(feedbackSource, /security report/i)
  assert.doesNotMatch(feedbackSource, /interview scheduler/i)
  assert.doesNotMatch(feedbackSource, /beta participation/i)
})
