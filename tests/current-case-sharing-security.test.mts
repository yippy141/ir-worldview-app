import assert from "node:assert/strict"
import test from "node:test"
import { POST as createChallenge } from "@/app/api/current-cases/challenge/route"
import { POST as validateChallenge } from "@/app/api/current-cases/challenge/validate/route"
import { getLatestPublishedCurrentCase } from "@/lib/current-cases/catalog"
import { CURRENT_CASE_CHALLENGE_LIFETIME_SECONDS } from "@/lib/current-cases/challenge"
import {
  createCurrentCaseChallengeToken,
  readCurrentCaseChallengeToken,
} from "@/lib/current-cases/challenge-token.server"

const TEST_SECRET = Buffer.alloc(32, 17).toString("base64url")
const INPUT = {
  caseId: "case-security-test",
  inviterFinalOptionId: "bounded-response",
  inviterConfidence: 4 as const,
}

test("challenge token claims are encrypted and restricted to the approved schema", () => {
  const created = createCurrentCaseChallengeToken(INPUT, {
    secret: TEST_SECRET,
    now: new Date("2026-07-17T12:00:00.000Z"),
  })
  assert.equal(created.ok, true)
  if (!created.ok) return

  assert.equal(created.token.includes(INPUT.caseId), false)
  assert.equal(created.token.includes(INPUT.inviterFinalOptionId), false)

  const read = readCurrentCaseChallengeToken(created.token, {
    secret: TEST_SECRET,
    now: new Date("2026-07-18T12:00:00.000Z"),
    expectedCaseId: INPUT.caseId,
  })
  assert.equal(read.ok, true)
  if (!read.ok) return

  assert.deepEqual(Object.keys(read.claims).sort(), [
    "caseId",
    "expiresAt",
    "inviterConfidence",
    "inviterFinalOptionId",
    "issuedAt",
    "nonce",
    "schemaVersion",
  ])
  assert.equal(read.claims.expiresAt - read.claims.issuedAt, CURRENT_CASE_CHALLENGE_LIFETIME_SECONDS)
  for (const forbidden of [
    "foundationPayload",
    "familyLabel",
    "dimensionScores",
    "email",
    "ip",
    "freeText",
  ]) {
    assert.equal(forbidden in read.claims, false)
  }
})

test("tampering with encrypted challenge data fails authentication", () => {
  const created = createCurrentCaseChallengeToken(INPUT, { secret: TEST_SECRET })
  assert.equal(created.ok, true)
  if (!created.ok) return

  const parts = created.token.split(".")
  const first = parts[2][0]
  parts[2] = `${first === "A" ? "B" : "A"}${parts[2].slice(1)}`
  const read = readCurrentCaseChallengeToken(parts.join("."), { secret: TEST_SECRET })

  assert.deepEqual(read, { ok: false, reason: "invalid" })
})

test("challenge tokens expire at thirty days", () => {
  const issued = new Date("2026-06-01T00:00:00.000Z")
  const created = createCurrentCaseChallengeToken(INPUT, {
    secret: TEST_SECRET,
    now: issued,
  })
  assert.equal(created.ok, true)
  if (!created.ok) return

  const read = readCurrentCaseChallengeToken(created.token, {
    secret: TEST_SECRET,
    now: new Date(issued.valueOf() + CURRENT_CASE_CHALLENGE_LIFETIME_SECONDS * 1000),
  })
  assert.deepEqual(read, { ok: false, reason: "expired" })
})

test("a valid token is rejected on the wrong case route", () => {
  const created = createCurrentCaseChallengeToken(INPUT, { secret: TEST_SECRET })
  assert.equal(created.ok, true)
  if (!created.ok) return

  assert.deepEqual(
    readCurrentCaseChallengeToken(created.token, {
      secret: TEST_SECRET,
      expectedCaseId: "case-other",
    }),
    { ok: false, reason: "wrong-case" },
  )
})

test("missing or malformed encryption secrets fail closed", () => {
  assert.deepEqual(createCurrentCaseChallengeToken(INPUT, { secret: "" }), {
    ok: false,
    reason: "missing-secret",
  })
  assert.deepEqual(readCurrentCaseChallengeToken("cc1.a.b.c", { secret: "" }), {
    ok: false,
    reason: "missing-secret",
  })
  assert.deepEqual(createCurrentCaseChallengeToken(INPUT, { secret: "too-short" }), {
    ok: false,
    reason: "missing-secret",
  })
})

test("malformed challenge tokens recover without throwing", () => {
  for (const token of ["", "not-a-token", "cc1.a.b.c", "cc2.a.b.c", "cc1...."] ) {
    const read = readCurrentCaseChallengeToken(token, { secret: TEST_SECRET })
    assert.equal(read.ok, false)
    if (!read.ok) assert.equal(["malformed", "invalid"].includes(read.reason), true)
  }
})

test("the challenge creation route fails safely when its secret is missing", async () => {
  const originalSecret = process.env.CURRENT_CASE_CHALLENGE_SECRET
  delete process.env.CURRENT_CASE_CHALLENGE_SECRET
  try {
    const response = await createChallenge(challengeRequest("198.51.100.201"))
    const body = await response.json()
    assert.equal(response.status, 503)
    assert.deepEqual(body, {
      ok: false,
      error: "Challenge links are temporarily unavailable.",
    })
  } finally {
    restoreSecret(originalSecret)
  }
})

test("pre-completion validation never returns the inviter answer", async () => {
  const record = getLatestPublishedCurrentCase()
  assert.ok(record)
  const created = createCurrentCaseChallengeToken(
    {
      caseId: record.id,
      inviterFinalOptionId: record.decision.options[1].id,
      inviterConfidence: 4,
    },
    { secret: TEST_SECRET },
  )
  assert.equal(created.ok, true)
  if (!created.ok) return

  const originalSecret = process.env.CURRENT_CASE_CHALLENGE_SECRET
  process.env.CURRENT_CASE_CHALLENGE_SECRET = TEST_SECRET
  try {
    const response = await validateChallenge(
      new Request("http://localhost/api/current-cases/challenge/validate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": "198.51.100.203",
        },
        body: JSON.stringify({ token: created.token, caseId: record.id }),
      }),
    )
    const body = await response.json()
    assert.equal(response.status, 200)
    assert.deepEqual(Object.keys(body).sort(), ["expiresAt", "ok"])
    assert.equal(body.inviterFinalOptionId, undefined)
    assert.equal(body.inviterConfidence, undefined)
  } finally {
    restoreSecret(originalSecret)
  }
})

test("the challenge creation route returns a rate-limit recovery path", async () => {
  const originalSecret = process.env.CURRENT_CASE_CHALLENGE_SECRET
  process.env.CURRENT_CASE_CHALLENGE_SECRET = TEST_SECRET
  try {
    const responses: Response[] = []
    for (let index = 0; index < 6; index += 1) {
      responses.push(await createChallenge(challengeRequest("198.51.100.202")))
    }

    assert.deepEqual(responses.slice(0, 5).map((response) => response.status), [201, 201, 201, 201, 201])
    assert.equal(responses[5].status, 429)
    assert.equal(responses[5].headers.get("retry-after"), "60")
    assert.equal(responses[5].headers.get("cache-control"), "no-store")
    assert.deepEqual(await responses[5].json(), {
      ok: false,
      error: "Too many challenge links were requested. Try again shortly.",
    })
  } finally {
    restoreSecret(originalSecret)
  }
})

function challengeRequest(forwardedFor: string) {
  const record = getLatestPublishedCurrentCase()
  assert.ok(record)
  return new Request("http://localhost/api/current-cases/challenge", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": forwardedFor,
    },
    body: JSON.stringify({
      caseId: record.id,
      optionId: record.decision.options[0].id,
      confidence: 3,
    }),
  })
}

function restoreSecret(value: string | undefined) {
  if (value === undefined) {
    delete process.env.CURRENT_CASE_CHALLENGE_SECRET
  } else {
    process.env.CURRENT_CASE_CHALLENGE_SECRET = value
  }
}
