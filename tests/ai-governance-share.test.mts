import test from "node:test"
import assert from "node:assert/strict"
import {
  decodeAiPayload,
  encodeAiPayload,
  type AiSharePayload,
} from "@/lib/ai-governance-share"

const payload: AiSharePayload = {
  v: 1,
  as: [4.2, 5.1, 6, 3.8, 4.6, 2.9, 5.4, 4],
  ak: "coordinationArchitect",
  nk: "stateCapacityBuilder",
  rl: "Frontier-risk first",
  pm: "Threshold guardrails",
  gm: "Coordination-first",
}

test("AI governance share payloads roundtrip through the shared URL codec", () => {
  const encoded = encodeAiPayload(payload)

  assert.ok(!encoded.includes("="), "AI payload should strip trailing padding")
  assert.deepEqual(decodeAiPayload(encoded), payload)
})

test("AI governance malformed payloads fail safely", () => {
  const malformedPayloads = [
    "%%%bad%%%payload",
    encodeAiPayload({
      ...payload,
      as: [8, 5.1, 6, 3.8, 4.6, 2.9, 5.4, 4],
    }),
    encodeAiPayload({
      ...payload,
      ak: "bogus" as AiSharePayload["ak"],
    }),
  ]

  for (const encoded of malformedPayloads) {
    assert.equal(decodeAiPayload(encoded), null)
  }
})
