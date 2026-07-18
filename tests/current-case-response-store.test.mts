import test from "node:test"
import assert from "node:assert/strict"
import { PROFILE_STORAGE_KEY } from "@/lib/profile-store"
import {
  addCompletedCurrentCaseResponse,
  clearCurrentCaseDraft,
  emptyCurrentCaseResponseStore,
  getCurrentCaseDraft,
  getLatestCurrentCaseResponse,
  isDraftForCurrentCase,
  isResponseForCurrentCase,
  parseCurrentCaseResponseStore,
  saveCurrentCaseDraft,
} from "@/lib/current-cases/response-store"
import {
  CURRENT_CASE_RESPONSE_STORAGE_KEY,
  type CompletedCurrentCaseResponse,
  type CurrentCaseDraft,
  type CurrentCase,
} from "@/lib/current-cases/types"

const response: CompletedCurrentCaseResponse = {
  caseId: "case-001",
  caseSlug: "tested-strategic-choice",
  caseVersion: 1,
  initialOptionId: "coordinate",
  initialConfidence: 2,
  selectedOptionId: "coordinate",
  confidence: 3,
  reasoningTags: ["institutions", "institutions"],
  challengeResponseId: "priority",
  openedReadingProfileIds: ["institution-builder", "institution-builder"],
  completedAt: "2026-07-17T10:00:00.000Z",
}

test("the response store is versioned and separate from ProfileStore v4", () => {
  assert.notEqual(CURRENT_CASE_RESPONSE_STORAGE_KEY, PROFILE_STORAGE_KEY)
  assert.deepEqual(emptyCurrentCaseResponseStore(), { v: 1, drafts: {}, responses: {} })
})

test("unknown, future, unversioned, and malformed stores fail closed", () => {
  assert.deepEqual(parseCurrentCaseResponseStore(null), { v: 1, drafts: {}, responses: {} })
  assert.deepEqual(parseCurrentCaseResponseStore("{}"), { v: 1, drafts: {}, responses: {} })
  assert.deepEqual(parseCurrentCaseResponseStore('{"v":2,"responses":{}}'), {
    v: 1,
    drafts: {},
    responses: {},
  })
  assert.deepEqual(parseCurrentCaseResponseStore("not-json"), {
    v: 1,
    drafts: {},
    responses: {},
  })
})

test("drafts save resumable progress separately and can be cleared on completion", () => {
  const draft: CurrentCaseDraft = {
    caseId: "case-001",
    caseSlug: "tested-strategic-choice",
    caseVersion: 1,
    step: "readings",
    initialOptionId: "coordinate",
    initialConfidence: 2,
    reasoningTags: ["institutions", "institutions"],
    openedReadingProfileIds: ["institution-builder"],
    updatedAt: "2026-07-17T09:00:00.000Z",
  }
  const record = {
    id: "case-001",
    slug: "tested-strategic-choice",
    version: 1,
    decision: { options: [{ id: "coordinate" }] },
    worldviewReadings: [{ profileId: "institution-builder" }],
    reasoningTags: ["institutions"],
  } as CurrentCase

  let store = saveCurrentCaseDraft(emptyCurrentCaseResponseStore(), draft)
  assert.deepEqual(getCurrentCaseDraft(store, "case-001")?.reasoningTags, ["institutions"])
  assert.equal(isDraftForCurrentCase(draft, record), true)
  store = clearCurrentCaseDraft(store, "case-001")
  assert.equal(getCurrentCaseDraft(store, "case-001"), null)
})

test("parsing keeps valid histories, drops cross-key records, and normalizes repeated tags", () => {
  const parsed = parseCurrentCaseResponseStore(
    JSON.stringify({
      v: 1,
      responses: {
        "case-001": [response],
        "wrong-key": [response],
        malformed: [{ ...response, confidence: 8 }],
      },
    }),
  )

  assert.deepEqual(Object.keys(parsed.responses), ["case-001"])
  assert.deepEqual(parsed.responses["case-001"][0].reasoningTags, ["institutions"])
  assert.deepEqual(parsed.responses["case-001"][0].openedReadingProfileIds, [
    "institution-builder",
  ])
})

test("adding responses preserves content versions and replaces only the same version", () => {
  const v1Later = { ...response, completedAt: "2026-07-18T10:00:00.000Z", confidence: 4 as const }
  const v2 = {
    ...response,
    caseVersion: 2,
    completedAt: "2026-07-19T10:00:00.000Z",
    selectedOptionId: "signal",
  }

  let store = addCompletedCurrentCaseResponse(emptyCurrentCaseResponseStore(), response)
  store = addCompletedCurrentCaseResponse(store, v1Later)
  store = addCompletedCurrentCaseResponse(store, v2)

  assert.equal(store.responses["case-001"].length, 2)
  assert.equal(store.responses["case-001"][0].confidence, 4)
  assert.equal(getLatestCurrentCaseResponse(store, "case-001")?.caseVersion, 2)
})

test("a response must match the exact published case version and its option/readings", () => {
  const record = {
    id: "case-001",
    slug: "tested-strategic-choice",
    version: 1,
    decision: { options: [{ id: "coordinate" }] },
    worldviewReadings: [{ profileId: "institution-builder" }],
  } as CurrentCase

  assert.equal(isResponseForCurrentCase(response, record), true)
  assert.equal(isResponseForCurrentCase({ ...response, caseVersion: 2 }, record), false)
  assert.equal(isResponseForCurrentCase({ ...response, selectedOptionId: "missing" }, record), false)
})
