import test from "node:test"
import assert from "node:assert/strict"
import { decodePayload, encodePayload } from "@/lib/share"
import type { SharePayload } from "@/lib/types"

const payloads: SharePayload[] = [
  {
    v: 2,
    ds: [6.25, 2.5, 4, 3.75, 5.5, 4.25, 2.75],
    fk: "realist",
    nk: "institutionalist",
    sm: "Hedger",
    nm: "Conditional Solidarist",
  },
  {
    v: 2,
    ds: [3, 5.5, 4.75, 6, 2.5, 5.75, 4.5],
    fk: "constructivist",
    nk: "criticalPoliticalEconomy",
    sm: "Restrainer",
    nm: "Pluralist",
  },
]

test("share payloads roundtrip through URL-safe base64 encoding", () => {
  const encodedPayloads = payloads.map((payload) => ({
    payload,
    encoded: encodePayload(payload),
  }))

  assert.ok(
    encodedPayloads.some(({ encoded }) => encoded.length % 4 !== 0),
    "expected at least one encoded payload to exercise padding restoration",
  )

  for (const { payload, encoded } of encodedPayloads) {
    assert.ok(!encoded.includes("="), "encoded payload should strip trailing padding")
    assert.deepEqual(decodePayload(encoded), payload)
  }
})

test("malformed payloads fail safely instead of decoding to a fabricated result", () => {
  const malformedPayloads = [
    "%%%bad%%%payload",
    encodeRawPayload({
      ...payloads[0],
      ds: [6.25, 2.5, 4, 3.75, 5.5, 4.25],
    }),
    encodeRawPayload({
      ...payloads[0],
      ds: [8, 2.5, 4, 3.75, 5.5, 4.25, 2.75],
    }),
    encodeRawPayload({
      ...payloads[0],
      fk: "bogus",
    }),
    encodeRawPayload({
      ...payloads[0],
      sm: "Balancer",
    }),
  ]

  for (const payload of malformedPayloads) {
    assert.equal(decodePayload(payload), null)
  }
})

function encodeRawPayload(payload: unknown) {
  return btoa(JSON.stringify(payload)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}
