import test from "node:test"
import assert from "node:assert/strict"
import {
  decodeAiPayload,
  encodeAiPayload,
  type AiSharePayload,
} from "@/lib/ai-governance-share"
import {
  buildAiGovernanceResultFromSharePayload,
  getNearbyAlternativeLabel,
} from "@/lib/ai-governance-results-v2"
import { AI_GOVERNANCE_V22_TUPLE } from "@/lib/ai-governance-versions"
import { encodeUrlPayload } from "@/lib/url-payload"

const payload: AiSharePayload = {
  v: 2,
  bv: AI_GOVERNANCE_V22_TUPLE.bankVersion,
  sv: AI_GOVERNANCE_V22_TUPLE.scoringVersion,
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
    encodeUrlPayload({
      ...payload,
      as: [8, 5.1, 6, 3.8, 4.6, 2.9, 5.4, 4],
    }),
    encodeUrlPayload({
      ...payload,
      ak: "bogus" as AiSharePayload["ak"],
    }),
  ]

  for (const encoded of malformedPayloads) {
    assert.equal(decodeAiPayload(encoded), null)
  }
})

test("AI governance encoder rejects unsupported tuples", () => {
  assert.throws(
    () => encodeAiPayload({ ...payload, bv: 2, sv: 2 }),
    /unsupported AI Governance payload/,
  )
})

test("AI results always expose the nearest modeled alternative", () => {
  const result = buildAiGovernanceResultFromSharePayload(payload)

  assert.notEqual(getNearbyAlternativeLabel(result), null)
  assert.equal("clarity" in result, false)
})
