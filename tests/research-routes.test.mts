import test from "node:test"
import assert from "node:assert/strict"
import { POST as postDelete } from "@/app/api/research/delete/route"
import { POST as postEvent } from "@/app/api/research/event/route"
import { POST as postSubmit } from "@/app/api/research/submit/route"
import {
  validateResearchEvent,
  validateResearchSubmission,
} from "@/lib/research/validation"

const originalEnabled = process.env.RESEARCH_STORAGE_ENABLED
const originalUrl = process.env.RESEARCH_STORAGE_URL
const originalKey = process.env.RESEARCH_STORAGE_SERVICE_KEY

test.afterEach(() => {
  restoreResearchEnv()
})

test("research submit route is safely disabled without storage env", async () => {
  disableResearchEnv()

  const response = await postSubmit(jsonRequest("/api/research/submit", validSubmission()))
  const body = await response.json()

  assert.equal(response.status, 200)
  assert.equal(body.ok, false)
  assert.equal(body.disabled, true)
  assert.equal(body.reason, "flag_disabled")
})

test("research delete route is safely disabled without storage env", async () => {
  disableResearchEnv()

  const response = await postDelete(
    jsonRequest("/api/research/delete", {
      respondentId: "respondent_test_1",
      consentVersion: "v13-research-consent-2026-05-15",
    }),
  )
  const body = await response.json()

  assert.equal(response.status, 200)
  assert.equal(body.ok, false)
  assert.equal(body.disabled, true)
  assert.equal(body.reason, "flag_disabled")
})

test("research routes fail safely when enabled but storage env vars are missing", async () => {
  delete process.env.RESEARCH_STORAGE_URL
  delete process.env.RESEARCH_STORAGE_SERVICE_KEY
  process.env.RESEARCH_STORAGE_ENABLED = "true"

  const response = await postSubmit(jsonRequest("/api/research/submit", validSubmission()))
  const body = await response.json()

  assert.equal(response.status, 200)
  assert.equal(body.ok, false)
  assert.equal(body.disabled, true)
  assert.equal(body.reason, "missing_env")
})

test("research event route rejects raw answer metadata", () => {
  const result = validateResearchEvent({
    eventName: "result_viewed",
    instrument: "foundation",
    meta: { answers: [{ questionId: "rs1", primaryAnswer: "A" }] },
  })

  assert.equal(result.ok, false)
  if (!result.ok) assert.equal(result.error, "Event metadata must not include raw answers.")
})

test("research submission rejects contact fields inside answer payloads", () => {
  const result = validateResearchSubmission({
    ...validSubmission(),
    answers: [
      {
        questionId: "rs1",
        primaryAnswer: "4",
        rawJson: { contactEmail: "reader@example.com" },
      },
    ],
  })

  assert.equal(result.ok, false)
  if (!result.ok) assert.equal(result.error, "Answer records must not contain contact fields.")
})

test("research submit route rejects oversized payloads", async () => {
  disableResearchEnv()

  const response = await postSubmit(
    new Request("http://localhost/api/research/submit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...validSubmission(),
        derivedResult: { summary: "x".repeat(70 * 1024) },
      }),
    }),
  )

  assert.equal(response.status, 413)
})

function validSubmission() {
  return {
    respondentId: "respondent_test_1",
    sessionId: "session_test_1",
    instrument: "foundation",
    instrumentVersion: "v13",
    scoringVersion: "v13-current",
    consentVersion: "v13-research-consent-2026-05-15",
    startedAt: "2026-05-15T12:00:00.000Z",
    completedAt: "2026-05-15T12:10:00.000Z",
    answers: [
      {
        questionId: "rs1",
        primaryAnswer: "4",
        rawNumeric: 4,
      },
    ],
    derivedResult: {
      topLabel: "Closest modeled fit",
      dimensionScores: { securityCompetition: 4.5 },
    },
    contactEmail: "reader@example.com",
  }
}

function jsonRequest(path: string, body: unknown) {
  return new Request(`http://localhost${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  })
}

function disableResearchEnv() {
  delete process.env.RESEARCH_STORAGE_ENABLED
  delete process.env.RESEARCH_STORAGE_URL
  delete process.env.RESEARCH_STORAGE_SERVICE_KEY
}

function restoreResearchEnv() {
  setOrDeleteEnv("RESEARCH_STORAGE_ENABLED", originalEnabled)
  setOrDeleteEnv("RESEARCH_STORAGE_URL", originalUrl)
  setOrDeleteEnv("RESEARCH_STORAGE_SERVICE_KEY", originalKey)
}

function setOrDeleteEnv(key: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[key]
  } else {
    process.env[key] = value
  }
}
