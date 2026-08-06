import test from "node:test"
import assert from "node:assert/strict"
import { currentCaseCatalog } from "@/lib/current-cases/catalog"
import { getCurrentCaseDestination } from "@/lib/current-cases/routes"

test("/current resolves to Recent Cases when no published launch case is active", () => {
  assert.equal(getCurrentCaseDestination("en"), "/cases")
})

test("/zh/current keeps the locale when no published launch case is active", () => {
  assert.equal(getCurrentCaseDestination("zh-Hans"), "/zh/cases")
})

test("/current resolves an active launch through its deadline day, then returns to Recent Cases", () => {
  const active = structuredClone(currentCaseCatalog[0])
  active.launchRole = "launch"
  active.freshnessStatus = "active"
  active.reviewDueAt = "2026-08-06"

  assert.equal(
    getCurrentCaseDestination("en", [active], {
      referenceDate: "2026-08-06",
    }),
    `/cases/${active.slug}`,
  )
  assert.equal(
    getCurrentCaseDestination("en", [active], {
      referenceDate: "2026-08-07",
    }),
    "/cases",
  )
})
