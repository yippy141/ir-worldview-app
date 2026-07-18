import test from "node:test"
import assert from "node:assert/strict"
import { POST as postAnalyticsEvent } from "@/app/api/analytics/event/route"
import {
  ANALYTICS_PROPERTY_KEYS,
  categorizeDevice,
  categorizeReferrer,
  categorizeRoute,
  createAnalyticsAdapter,
  validateAnalyticsEvent,
} from "@/lib/analytics/adapter"

test("the analytics property allowlist is exact", () => {
  assert.deepEqual(ANALYTICS_PROPERTY_KEYS, [
    "caseId",
    "routeCategory",
    "deviceClass",
    "referrerCategory",
    "returningAgeBucket",
  ])
})

test("valid coarse events pass runtime validation", () => {
  const result = validateAnalyticsEvent(validCaseEvent())

  assert.equal(result.ok, true)
})

test("forbidden properties are rejected before the provider is called", async () => {
  const forbiddenProperties = [
    "answerIds",
    "confidence",
    "reasoningTags",
    "profileFamily",
    "dimensionScores",
    "payload",
    "url",
    "email",
    "freeText",
    "ipAddress",
  ]

  for (const property of forbiddenProperties) {
    let providerCalls = 0
    const adapter = createAnalyticsAdapter(() => {
      providerCalls += 1
    })
    const result = await adapter.track({
      ...validCaseEvent(),
      properties: {
        ...validCaseEvent().properties,
        [property]: "forbidden",
      },
    })

    assert.equal(result.accepted, false, property)
    assert.equal(providerCalls, 0, property)
  }
})

test("full URLs cannot be smuggled through caseId", () => {
  const result = validateAnalyticsEvent({
    ...validCaseEvent(),
    properties: {
      ...validCaseEvent().properties,
      caseId: "https://example.com/cases/one?payload=secret",
    },
  })

  assert.equal(result.ok, false)
})

test("the server rejects formatted but unpublished Current Case IDs", async () => {
  const response = await postAnalyticsEvent(
    new Request("http://localhost/api/analytics/event", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...validCaseEvent(),
        properties: {
          ...validCaseEvent().properties,
          caseId: "invented-case-id",
        },
      }),
    }),
  )

  assert.equal(response.status, 400)
  assert.deepEqual(await response.json(), {
    ok: false,
    error: "Unknown Current Case ID.",
  })
})

test("caseId is required only for Current Case events", () => {
  const missingCaseId = validateAnalyticsEvent({
    ...validCaseEvent(),
    properties: {
      routeCategory: "current-case",
      deviceClass: "mobile",
      referrerCategory: "direct",
      returningAgeBucket: "under-1-day",
    },
  })
  const leakedCaseId = validateAnalyticsEvent({
    name: "profile_viewed",
    properties: validCaseEvent().properties,
  })

  assert.equal(missingCaseId.ok, false)
  assert.equal(leakedCaseId.ok, false)
})

test("missing providers degrade to an accepted no-op", async () => {
  const result = await createAnalyticsAdapter().track(validCaseEvent())

  assert.deepEqual(result, {
    accepted: true,
    delivered: false,
    reason: "provider-unavailable",
  })
})

test("route, device, and referrer inputs are reduced to coarse categories", () => {
  assert.equal(categorizeRoute("/cases/example/challenge"), "current-case")
  assert.equal(categorizeRoute("/results/private-payload"), "foundation")
  assert.equal(categorizeDevice(390), "mobile")
  assert.equal(categorizeDevice(820), "tablet")
  assert.equal(categorizeDevice(1440), "desktop")
  assert.equal(categorizeReferrer("https://www.google.com/search?q=ir", "example.com"), "search")
  assert.equal(categorizeReferrer("https://substack.com/inbox/post/1", "example.com"), "newsletter")
  assert.equal(categorizeReferrer("https://example.com/private/path", "example.com"), "internal")
})

function validCaseEvent() {
  return {
    name: "current_case_viewed",
    properties: {
      caseId: "security-example-2026-07",
      routeCategory: "current-case",
      deviceClass: "mobile",
      referrerCategory: "direct",
      returningAgeBucket: "under-1-day",
    },
  }
}
