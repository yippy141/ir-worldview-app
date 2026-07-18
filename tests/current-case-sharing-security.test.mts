import assert from "node:assert/strict"
import test from "node:test"
import { POST as createChallenge } from "@/app/api/current-cases/challenge/route"
import { POST as revealChallenge } from "@/app/api/current-cases/challenge/reveal/route"
import { POST as validateChallenge } from "@/app/api/current-cases/challenge/validate/route"

const routes = [
  ["create", createChallenge],
  ["validate", validateChallenge],
  ["reveal", revealChallenge],
] as const

for (const [name, post] of routes) {
  test(`legacy challenge ${name} is retired without reading answer-bearing input`, async () => {
    const request = new Request(`http://localhost/api/current-cases/challenge/${name}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        caseId: "case-security-test",
        optionId: "bounded-response",
        confidence: 4,
        token: "legacy-answer-bearing-token",
      }),
    })

    const response = await post(request)

    assert.equal(response.status, 410)
    assert.equal(response.headers.get("cache-control"), "no-store")
    assert.equal(request.bodyUsed, false)
    assert.deepEqual(await response.json(), {
      ok: false,
      disabled: true,
      reason: "answer-bearing-links-retired",
      message: "Answer-bearing Current Case challenge links are not available in V19.",
    })
  })
}
