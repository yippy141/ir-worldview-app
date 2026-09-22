// tests/diagnostics/read-only-probes.mts
// Read-only diagnostic probes. No writes, no network, no assertions of expected outcomes.
import { consumeProfileSaveIntent, markProfileSaveIntent } from "@/lib/profile-save-intent"
import { resolveFoundationPayload } from "@/lib/share"
import { parseComparisonInput } from "@/lib/connected/input"
import { encodeUrlPayload } from "@/lib/url-payload"
import { PROFILE_SAVE_INTENT_KEY } from "@/lib/storage-keys"

type Store = { data: Map<string, string>; getItem(k: string): string | null; setItem(k: string, v: string): void; removeItem(k: string): void; clear(): void }
function makeStore(): Store {
  const data = new Map<string, string>()
  return {
    data,
    getItem: (k) => (data.has(k) ? data.get(k)! : null),
    setItem: (k, v) => { data.set(k, v) },
    removeItem: (k) => { data.delete(k) },
    clear: () => { data.clear() },
  }
}
const local = makeStore()
const session = makeStore()
;(globalThis as any).window = { localStorage: local, sessionStorage: session }

const out: Record<string, unknown> = {}

// --- Probe 1: consumeProfileSaveIntent exact-match and once-only ---
markProfileSaveIntent("foundation", "RESULT-A")
markProfileSaveIntent("foundation", "RESULT-B")
const consumeMismatch = consumeProfileSaveIntent("foundation", "RESULT-C")
const consumeMatch = consumeProfileSaveIntent("foundation", "RESULT-B")
const consumeSecond = consumeProfileSaveIntent("foundation", "RESULT-B")
const sessionAfter = session.getItem(PROFILE_SAVE_INTENT_KEY)
out.profileSaveIntent = {
  consumeMismatch,
  consumeMatch,
  consumeSecond,
  remainingRaw: sessionAfter,
}

// --- Probe 2: v3 payload with contradictory labels vs ds ---
// ds chosen to look like a different family than fk/nk fields suggest.
const dsV3: [number, number, number, number, number, number, number] = [6.5, 6.2, 5.9, 2.1, 2.4, 2.0, 2.2]
const v3 = { v: 3 as const, ds: dsV3, fk: "constructivist" as const, nk: "realist" as const, sm: "Maximizer" as const, nm: "Universalist" as const, iv: 4, sv: 2, cv: 2, cl: "en" as const }
const v3encoded = encodeUrlPayload(v3 as any)
const v3resolved = resolveFoundationPayload(v3encoded)
out.v3Contradictory = {
  encoded: v3encoded,
  resolved: v3resolved && {
    resultFamilyKey: v3resolved.result.familyKey,
    resultRunnerUpKey: v3resolved.result.runnerUpKey,
    resultStrategy: v3resolved.result.strategyModifier,
    resultNormative: v3resolved.result.normativeModifier,
    payloadFamilyKey: v3resolved.payload.fk,
    payloadRunnerUp: v3resolved.payload.nk,
    scoringVersion: v3resolved.provenance.scoringVersion,
    questionSet: v3resolved.questionSet,
    resultTier: v3resolved.resultTier,
    targetedFamilyPair: v3resolved.targetedFamilyPair ?? null,
  },
}

// --- Probe 3: v5 with qs core and bv2 (mismatched instrument version) ---
const v5 = { v: 5 as const, ds: dsV3, fk: "realist" as const, nk: "institutionalist" as const, sm: "Hedger" as const, nm: "Pluralist" as const, iv: 4, bv: 2, sv: 2, cv: 2, cl: "en" as const, qs: "core" as const }
const v5encoded = encodeUrlPayload(v5 as any)
const v5resolved = resolveFoundationPayload(v5encoded)
out.v5CoreBv2 = {
  encoded: v5encoded,
  resolved: v5resolved && {
    payloadV: v5resolved.payload.v,
    payloadQs: v5resolved.payload.v === 5 ? v5resolved.payload.qs : null,
    payloadBv: v5resolved.payload.v === 5 ? v5resolved.payload.bv : null,
    resultFamilyKey: v5resolved.result.familyKey,
    resultRunnerUpKey: v5resolved.result.runnerUpKey,
    resultStrategy: v5resolved.result.strategyModifier,
    resultNormative: v5resolved.result.normativeModifier,
    scoringCalibration: v5resolved.scoringCalibration,
    questionSet: v5resolved.questionSet,
    resultTier: v5resolved.resultTier,
  },
}

// --- Probe 4: parseComparisonInput origin and length handling ---
const approvedOrigin = "https://irworldview.jhyip.com"
const approved = parseComparisonInput(`${approvedOrigin}/results/${v5encoded}`, approvedOrigin)
const httpOrigin = parseComparisonInput(`http://irworldview.jhyip.com/results/${v5encoded}`, approvedOrigin)
const evilOrigin = parseComparisonInput(`https://evil.example.com/results/${v5encoded}`, approvedOrigin)
const oversized = parseComparisonInput("a".repeat(50_001), approvedOrigin)
const malformed = parseComparisonInput("not-a-valid-token!!!", approvedOrigin)
out.parseComparisonInput = {
  approved: { ok: approved.ok, error: approved.ok ? null : approved.error, families: approved.ok ? Object.keys(approved.evidence) : null },
  httpOrigin: { ok: httpOrigin.ok, error: httpOrigin.ok ? null : httpOrigin.error },
  evilOrigin: { ok: evilOrigin.ok, error: evilOrigin.ok ? null : evilOrigin.error },
  oversized: { ok: oversized.ok, error: oversized.ok ? null : oversized.error },
  malformed: { ok: malformed.ok, error: malformed.ok ? null : malformed.error },
}

console.log(JSON.stringify(out, null, 2))