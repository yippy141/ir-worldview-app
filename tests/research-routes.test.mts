import test from "node:test"
import assert from "node:assert/strict"
import { POST as postDelete } from "@/app/api/research/delete/route"
import { POST as postEvent } from "@/app/api/research/event/route"
import { POST as postSubmit } from "@/app/api/research/submit/route"

const routes = [
  ["submit", postSubmit],
  ["event", postEvent],
  ["delete", postDelete],
] as const

for (const [name, post] of routes) {
  test(`research ${name} is a body-blind V19 tombstone`, async () => {
    const request = new Request(`http://localhost/api/research/${name}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        respondentId: "persistent-id-must-not-be-read",
        summary: "arbitrary free text must not be read",
        contactEmail: "reader@example.com",
      }),
    })

    const response = await post(request)
    const body = await response.json()

    assert.equal(response.status, 410)
    assert.equal(response.headers.get("cache-control"), "no-store")
    assert.equal(request.bodyUsed, false)
    assert.deepEqual(body, {
      ok: false,
      disabled: true,
      reason: "privacy-review-required",
      message: "Research-response collection is not available in this release.",
    })
  })
}

test("research collection cannot be activated with legacy environment flags", async () => {
  const original = {
    enabled: process.env.RESEARCH_STORAGE_ENABLED,
    url: process.env.RESEARCH_STORAGE_URL,
    key: process.env.RESEARCH_STORAGE_SERVICE_KEY,
  }
  process.env.RESEARCH_STORAGE_ENABLED = "true"
  process.env.RESEARCH_STORAGE_URL = "https://storage.invalid"
  process.env.RESEARCH_STORAGE_SERVICE_KEY = "not-used"

  try {
    const request = new Request("http://localhost/api/research/submit", {
      method: "POST",
      body: "this body is intentionally not parsed",
    })
    const response = await postSubmit(request)

    assert.equal(response.status, 410)
    assert.equal(request.bodyUsed, false)
  } finally {
    restore("RESEARCH_STORAGE_ENABLED", original.enabled)
    restore("RESEARCH_STORAGE_URL", original.url)
    restore("RESEARCH_STORAGE_SERVICE_KEY", original.key)
  }
})

function restore(key: string, value: string | undefined) {
  if (value === undefined) delete process.env[key]
  else process.env[key] = value
}
