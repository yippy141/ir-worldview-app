import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { AREAS, INTRO } from "@/app/dev/product-refoundation/content"
import { readLocalRecord } from "@/app/dev/product-refoundation/local-record"
import { foundationCoreQuestions } from "@/lib/quiz-schema"
import { PROFILE_STORAGE_KEY, QUIZ_STORAGE_KEY } from "@/lib/storage-keys"

const storage = (values: Record<string, string> = {}) => ({ getItem: (key: string) => values[key] ?? null })
const fixture = (version: number) => JSON.parse(readFileSync(new URL(`./fixtures/profile-store-v${version}.json`, import.meta.url), "utf8"))

test("prototype has four literal public areas and a 45–85 word introduction", () => {
  assert.deepEqual(AREAS.map((area) => area.label), ["Start", "Cases", "Field Guide", "My Record"])
  assert.ok(INTRO.split(/\s+/u).length >= 45 && INTRO.split(/\s+/u).length <= 85)
})

test("prototype reads saved identity and all domain presence through existing parsers", () => {
  const profile = fixture(4)
  profile.modules.technology = fixture(2).modules.technology
  profile.aiGovernance = fixture(3).aiGovernance
  const raw = JSON.stringify(profile)
  const values = { [PROFILE_STORAGE_KEY]: raw }
  const result = readLocalRecord(storage(values))
  assert.ok(result.foundationName)
  assert.deepEqual(result.savedAreas, ["Security", "Technology", "AI Governance"])
  assert.equal(result.hasSavedWork, true)
  assert.equal(values[PROFILE_STORAGE_KEY], raw)
})

test("prototype continuation ignores unknown and invalid Foundation answers", () => {
  const answers = Object.fromEntries(foundationCoreQuestions.slice(0, 8).map((question) => [question.id, 4]))
  const result = readLocalRecord(storage({ [QUIZ_STORAGE_KEY]: JSON.stringify({ v: 7, questionSet: "core", orderSeed: "fixture", answers: { ...answers, unknown: 5, [foundationCoreQuestions[9].id]: 100 } }) }))
  assert.deepEqual(result.continuation, { label: "Continue First Principles · 8 of 14", href: "/quiz?q=8" })
})

test("a fully answered draft still offers review rather than silently disappearing", () => {
  const answers = Object.fromEntries(foundationCoreQuestions.map((question) => [question.id, 4]))
  const result = readLocalRecord(storage({ [QUIZ_STORAGE_KEY]: JSON.stringify({ v: 7, questionSet: "core", orderSeed: "fixture", answers }) }))
  assert.equal(result.continuation?.href, "/quiz/review")
})

test("empty, malformed, and blocked local storage fail safely without writes", () => {
  assert.equal(readLocalRecord(storage()).hasSavedWork, false)
  assert.equal(readLocalRecord(storage({ [PROFILE_STORAGE_KEY]: "{broken", [QUIZ_STORAGE_KEY]: "null" })).hasSavedWork, false)
  assert.equal(readLocalRecord({ getItem: () => { throw new Error("blocked") } }).unavailable, true)
})

test("development boundary does not change the production immersive routes", () => {
  const page = readFileSync(new URL("../app/dev/product-refoundation/page.tsx", import.meta.url), "utf8")
  assert.match(page, /if \(process\.env\.NODE_ENV === "production"\) notFound\(\)/u)
  assert.ok(page.indexOf("notFound()") < page.indexOf('import("./prototype")'))
  const shell = readFileSync(new URL("../lib/site-shell.ts", import.meta.url), "utf8")
  assert.match(shell, /process\.env\.NODE_ENV === "development" && pathname === "\/dev\/product-refoundation"/u)
})
