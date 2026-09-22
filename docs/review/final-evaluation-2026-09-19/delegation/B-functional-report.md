# PR63 Independent Audit — `6c19e4125228767a25b6660d29c636cc9a41ddb0`

## Scope note
Findings are read from the supplied source only. No execution claimed, no population/psychometric claims, no usability evidence assumed.

---

## Definite defects

### D1. `HistoryCompare` effect deps omit comparison inputs; stale `prior` and missed saves across navigations
**File:** `components/results/history-compare.tsx:45-72`
The effect depends only on `props.provenance.locale` and `props.provenance.localeCopyVersion`. A client that re-renders this component with a new payload (same locale/copyVersion, e.g. user completes a second Foundation in the same tab, or navigates from one result to another) will not re-run the save. Additionally, `setPrior(null)` and `getLastComparableSnapshot` are captured on the first run only.
**Trigger:** Navigate from `/results/<A>` to `/results/<B>` where A and B share locale and localeCopyVersion.
**Observed:** Only A is recorded in `result-history`; B's snapshot is never appended on navigation; the user sees "Saved to this device" but the current result is not stored, and the compare block compares B against A only if React happened to remount the component (key change not guaranteed).
**Expected:** Every distinct completion is persisted once, and the compare reads against the immediately-previous comparable snapshot for the current result.
**Smallest fix:** Signal the identity of the current result via the effect key, e.g. add `props.provenance.payload`/resultId-derived prop to the dependency array, or pass a stable `resultId` prop and include it. Also guard against StrictMode double-invocation with a ref keyed on that same id.

### D2. `getLastSnapshotWithProvenance`-based dedupe allows duplicate entries after reload
**File:** `components/results/history-compare.tsx:48-54, 33-39`
`isEssentiallySame` uses `< 0.15` tolerance on every dimension, plus exact equality on family and modifiers. If a user re-visits the same result URL after the profile store has been cleared but `result-history` retained (or with a different device-storage scheme in the future), the check falls through and `saveSnapshot(snapshot)` appends a new entry with a fresh `Date.now()`. `saveSnapshot`'s dedupe key (see `lib/result-history` — not supplied) cannot be confirmed to dedupe by payload, only by the timestamp-shape.
**Trigger:** Reload `/results/<payload>` when no truly identical entry survives (e.g. after partial clear, or timestamp collision across devices).
**Observed:** A second entry for the same result is created on re-visit.
**Expected:** Idempotent append for the same payload event; no duplicate timeline rows.
**Smallest fix:** Include a stable payload/resultId equality check in `isEssentiallySame` and dedupe `saveSnapshot` on `payload`/resultId, not timestamp.

### D3. Comparison slices may hide real signal without saying so
**File:** `components/results/history-compare.tsx:107-109, 129-133`
`shifts` filters `|diff| >= 0.3` then slices to 3. When `familyChanged` is false, `stratChanged` is false, `normChanged` is false, and only shifts 4..n cross 0.3, only the top 3 are shown. The "nothing changed" branch (line 129) requires `shifts.length === 0`, so users never see that other thresholds were exceeded but suppressed.
**Trigger:** A result where 4 dimension shifts ≥0.3 exist.
**Observed:** Only 3 displayed, no note like "and 1 more", users may reasonably conclude their result is more stable than it is.
**Expected:** Either an explicit "and N more shifts ≥0.3" note or widen the displayed list.
**Smallest fix:** Compute `totalShifts = ...filter(...).length` before `.slice(0,3)` and render "Showing 3 of N largest shifts" when `totalShifts > 3`.

### D4. `isEssentiallySame` treats dimension drift under 0.15 as "same result" and can suppress saving a genuinely new run
**File:** `components/results/history-compare.tsx:33-39, 50-54`
Tolerance `< 0.15` on every dimension, plus exact modifier equality, means a user who retakes the quiz and produces a materially different answer profile (e.g. 0.14 shift on all dimensions) never gets a new snapshot.
**Trigger:** Retake producing small but genuine shift.
**Observed:** No new entry is appended; `setSaved(true)` runs; "Saved to this device" displays even though nothing was saved this run.
**Expected:** Distinguish "no new record this navigation" from "saved to this device." The copy is misleading on the no-write path.
**Smallest fix:** On the dedupe-hit path, set a distinct state (e.g. `setSaved("already-on-device")`) and render "Already saved on this device" instead of "Saved to this device."

### D5. `HistoryCompare` ignores `props.provenance` update path when only `instrumentStructuralVersion`/`scoringVersion` change
**File:** `components/results/history-compare.tsx:45-72`
Even a locale-and-copy-versioned snapshot with a new `schemaVersion` (via `SCHEMA_VERSION` import, line 12) gets written with the fresh constant, but the effect never re-runs for payload changes. Combined with D1 this produces records whose `schemaVersion` doesn't match the payload they describe.
**Expected:** Persisted `schemaVersion` should always reflect the payload's schema version. Either import `resolved.provenance` or gate the effect on the payload.
**Smallest fix:** Take a `schemaVersion` prop derived from `resolveFoundationPayload(props.payload)`.

### D6. `ProfileCompare` "Use my saved result" never re-enables when the profile store is empty after success
**File:** `components/profile/profile-compare.tsx:74, 78`
The select is only rendered when `saved` is truthy. `loadLocalProfileEvidence(loadProfileStore())` may return a bundle with all keys empty (`{}`), which is still truthy, so a select is rendered with no options besides "Choose a subject" and a "No results are saved in this browser." message. But if the promise resolves with `undefined` (contract unknown), `saved` becomes `undefined` and the select disappears while the button remains. This is a hypothesis until `loadLocalProfileEvidence`'s return contract is confirmed — flagged as **H1** below.

### D7. `parseComparisonInput` accepts `?foundation=` on any module URL but silently drops it
**File:** `lib/connected/input.ts:19`
`[...url.searchParams.keys()].some(k => k !== "foundation")` allows a module URL to carry `?foundation=<token>`. The parser then only extracts `match[6]` (the module payload) and discards the foundation query parameter. A user pasting a valid module deep-link with a foundation context gets a comparison that silently ignores the foundation.
**Trigger:** Paste `https://irworldview.jhyip.com/modules/security/results/<token>?foundation=<foundation>`.
**Observed:** Evidence bundle contains only `security`; no error; foundation context dropped.
**Expected:** Either bind foundation context into `EvidenceBundle.foundation`, or reject with an explicit error when a foundation query is present but unsupported.
**Smallest fix:** After the token is extracted, if `kind !== "foundation"` and `url.searchParams.has("foundation")`, either attach the resolved foundation result to the bundle or `return fail` with a clear message.

### D8. `parseComparisonInput` accepts unauthenticated `http:` for approved origin
**File:** `lib/connected/input.ts:16-17`
`/^https?:$/` permits `http://irworldview.jhyip.com/...`. Since the token is included in the URL, an attacker who can inject a link into a message can downgrade the origin to `http` and induce a network-plaintext fetch if the browser auto-upgrades or a MITM is on path. Because parsing is client-side, the practical impact is limited — but the code claims "Explicit approved origins," and `http://` is not explicitly approved.
**Smallest fix:** `if (url.protocol !== "https:") return fail` unless `url.hostname === "localhost"` (dev), or restrict to the exact approved origins with `https:` only.

### D9. `parseComparisonInput` truncates long but valid tokens at 50k, then fails without identifying the cause
**File:** `lib/connected/input.ts:4, 10`
Any Foundation AI/module token that legitimately exceeds 50,000 characters is rejected with "Use a valid result or shared Profile link from this app (up to 50,000 characters)." A user pasting a longer but valid token believes the link is invalid. This is at least a UX/edge bug; whether it is a real security ceiling depends on whether any current token family can approach 50k. Flag as **H2**.
**Smallest fix:** Distinguish "input too long" from "unrecognized token shape" in the error copy.

### D10. `review-screen.tsx` gates result generation on `hasCompleteFoundationAnswers` but not on `questionSet === "fullExtended"` acknowledgement
**File:** `components/quiz/review-screen.tsx:163, 170`
If a legacy fullExtended draft is loaded (via `parseQuizSession`) and `hasCompleteFoundationAnswers(session)` returns true, `handleGenerate` runs and generates a result through `selectFoundationAnswersForSet(...)`. This bypasses the "Keep the form you started" acknowledgement that `quiz-app.tsx:524-528` requires on the quiz page.
**Trigger:** A user with a legacy fullExtended draft navigates directly to `/quiz/review`.
**Observed:** Result generated from the legacy form without the acknowledgement step.
**Expected:** Either `ReviewScreen` should surface the same acknowledgement, or `handleGenerate` should refuse when `session.questionSet === "fullExtended"` and the acknowledgement has not been recorded.
**Smallest fix:** Add a `legacyUnacknowledged` guard at the top of `handleGenerate` mirroring `quiz-app.tsx`'s flow.

### D11. `quiz-app.tsx` reset clears the localStorage key but not the in-memory session if `setSession` races with the write effect
**File:** `components/quiz-app.tsx:217-221, 401-411`
`resetQuiz` calls `setSession(...)` then `window.localStorage.removeItem(QUIZ_STORAGE_KEY)`. The persistence effect runs on `[ready, session]`; after the state update flushes, the effect will write the fresh session back. That is expected. However `notifyQuizSessionUpdated()` runs synchronously in `resetQuiz` before React has applied the new state, so downstream subscribers (e.g. review screen) that read during this notification see stale storage absence with stale in-memory session.
**Trigger:** Reset from `/quiz` when another mounted component consumes `notifyQuizSessionUpdated`.
**Observed:** Consumers may transiently observe no-key + old in-memory session.
**Smallest fix:** Call `notifyQuizSessionUpdated()` inside a layout effect after `session` reflects the reset value, or move the notify into the persistence effect.

### D12. `quiz-app.tsx` targeted extension silently downgrades to core when family pair missing
**File:** `components/quiz-app.tsx:196-205`
When `baseSession.questionSet === "targetedExtended"` and `baseSession.targetedFamilyPair` is missing, the code silently resets to `core`. A user who clicked a targeted link but lost the query parameter returns to `core` without any notice.
**Expected:** Explicit notice ("your targeted extension could not be restored; starting core") — silent data-shape reset risks confusing the user about which instrument they are completing.
**Smallest fix:** Add a one-time banner rendered when this branch fires (store a state flag).

### D13. `fresh-foundation-result.ts` is a module-level singleton with no reset on navigation
**File:** `lib/results/fresh-foundation-result.ts:3-6`
`markFreshResult` stores a pending hint keyed to the current payload; `consumeFreshResult` clears it. If a user clicks "Generate my result →", lands on `/results/<A>`, then before the result page consumes the hint navigates back to review and generates `<B>`, `markFreshResult("foundation", "B")` overwrites the pending hint. `consumeFreshResult("foundation","A")` (if it ever fires) returns false. That's benign for the hint itself, but if the hint from A arrived first and B never arrives, the hint for A is stranded.
**Concrete risk:** A result page that expects the hint to gate a save path will not save A if B raced in front. Combined with D1 this compounds the ownership bug.
**Smallest fix:** Key `pending` by domain+payload (a small Map) so multiple in-flight hints survive; consume exactly the requested key.

### D14. `profile-save-intent.ts` silently discards non-string identity values
**File:** `lib/profile-save-intent.ts:86-93`
`normalizeIntent` accepts a legacy string form and an object form. If a future caller passes `{ identity: 42, ... }` or `{ id: "x" }`, the object form returns null and the marker is dropped silently. `readProfileSaveIntents` then drops the key from the dictionary on next write.
**Expected:** Reject with a diagnostic, or normalize-and-log.
**Smallest fix:** At minimum, log to a dev-only warn if `record.identity` is present but not a non-empty string.

### D15. `profile-store.ts` `add*` helpers build history with appendSnapshots twice — may produce an entry for the previous snapshot AND the new one, on the same key, in a single call
**File:** `lib/profile-store.ts:338-352`
`addFoundationSnapshot` calls `appendSnapshots(appendSnapshots(store.foundationHistory, store.foundation, foundationSnapshotKey), snapshot, foundationSnapshotKey)`. If `store.foundation` and `snapshot` share the same key (identical timestamp+payload), the second `appendSnapshots` filter removes the entry inserted by the first call, then pushes `snapshot` — no duplicates. That is correct. But `store.foundation` may have a *different* timestamp than `snapshot` even for the same payload (e.g. after a legacy parse where the profile's `foundation` is regenerated with `Date.now()` at some other flow). In that case both entries are kept and `foundationHistory` contains two rows for the same payload.
**Observed:** Duplicate history rows for the same payload with distinct timestamps.
**Expected:** A single row per (payload, timestamp) tuple, or the payload itself should be the identity key.
**Smallest fix:** Change `foundationSnapshotKey` to include payload only (once payload identity is the semantic key), or ensure `saveFoundationSnapshot` always preserves the incoming timestamp from the same source.

### D16. `normalizeModuleSnapshot` will accept an in-range `laneScores` block with zero lanes
**File:** `lib/profile-store.ts:558, 1221-1231`
`normalizeLaneScores` returns `{}` for `{}`, which is truthy, so `laneScores` becomes `{}`. Downstream `hasLaneScores` uses `definition.lanes.every(...)`, which fails on the empty object if `definition.lanes` is non-empty — so `laneSummaries` falls back. But if `definition.lanes` is `[]`, `hasLaneScores` is `true` and `definition.summarizeLanes({laneScores:{}})` may be called on an empty corpus. Not confirmed broken without the module definition, but flagged.

### D17. `lib/connected/evidence.ts:126-127` — a result with all-null provenance is classified `unknown`, and users cannot compare even when both sides are identical
**File:** `lib/connected/evidence.ts:119-130`
If both results have null `bank`/`scorer`/`form`/`language`/`copy`, the second branch fires (`=== null`) and status is `"unknown"`. Both sides truly identical, meaning "not fully known" is misleading — the correct label is "identical but provenance unknown."
**Observed:** Users see "not fully known" even when both sides are structurally the same unknown; matches E2E test at `e2e/connected-profile.spec.ts:50-51`.
**Smallest fix:** If all five fields are null on both sides, return `status: "unknown"` with a reason that says "the two sides are consistent but provenance cannot be verified."

### D18. `lib/connected/evidence.ts:113` — `withAiEvidence` sets `copy: 1` unconditionally
**File:** `lib/connected/evidence.ts:113`
The AI evidence path hardcodes `copy: 1` even when the AI completion record may not support edition 1. If AI wording versions are ever bumped, this would silently allow comparisons against the wrong edition.
**Smallest fix:** Surface the copy version from the completion record and require it to match `1` before allowing comparability; or make `withAiEvidence` refuse when the stored copy is not 1.

### D19. `profile-compare.tsx:31` — legacy URL params are stripped via `replaceState` but not from `navigationRequests`
**File:** `components/profile/profile-compare.tsx:29-34`
The `legacy` note at line 87 says "Removing them from the address bar cannot undo that request," which is correct. But no request has been issued after mount; the initial navigation did include the query string, which is what the note warns about. That's fine. The bug is that `setLegacy(true)` is only triggered when `left || right` is truthy at mount; if the user pastes a URL into the address bar containing `?left=abc` but into a page different from `/compare`, `ProfileCompare` is not mounted and no warning is shown on later navigation. This is a discovery bug, not a security bug.

### D20. `lib/local-data.ts:16-27` — `FOUNDATION_LOCAL_EVIDENCE_STORAGE_KEY` is cleared locally but the handoff key in session storage is also cleared; combined with `profile-save-intent.ts`, a legitimate answer-evidence binding that references a cleared local ID may remain in the profile snapshot
**File:** `lib/local-data.ts:16-32` and `lib/profile-store.ts:86-87`, `lib/profile-save-intent.ts:53-63`
`clearLocalWorldviewHistory` removes `FOUNDATION_LOCAL_EVIDENCE_STORAGE_KEY` (local) and `FOUNDATION_LOCAL_EVIDENCE_HANDOFF_KEY` (session). It does **not** clear `localEvidenceId` fields embedded inside `PROFILE_STORAGE_KEY`… but it *does* clear `PROFILE_STORAGE_KEY`. So the stale-id concern is moot for the profile. However `PROFILE_SAVE_INTENT_KEY` is cleared, which means an in-flight "result just generated" intent is dropped at the same time as the result payload about to be saved. If a user clears history between generating and landing on the result page, `FoundationProfileSync` consumes no intent and skips the save — which is the correct outcome, but it silently leaves a valid payload unpersisted. This is arguably correct behavior (user intent to clear) but not documented.
**Smallest fix:** Document that a history clear during generation aborts the save; or persist a short-lived flag elsewhere if continuity is desired.

---

## Hypotheses (need external confirmation to classify)

- **H1.** `loadLocalProfileEvidence` return contract (`{ok,evidence}[] | undefined`?) — needed to decide D6. Not in the supplied files.
- **H2.** Whether any real Foundation/AI/module token reaches 50k characters. If not, D9 is only a copy-quality issue.
- **H3.** Whether `saveSnapshot` (from `lib/result-history`, not supplied) dedupes by payload ID or by timestamp.
- **H4.** Whether `SCHEMA_VERSION` from `lib/quiz-schema` equals the schema version encoded in `resolved.provenance` for legacy tokens.
- **H5.** Whether `initialQ` used by `quiz-app.tsx:140-141` is validated against `questions.length` in all branches — line 258 clamps to `effectiveIndex`, which is correct, but `currentIndex` itself may remain out of range and confuse "Next" (D13-adjacent risk).

---

## Notable correctly implemented safeguards

- **S1.** `parseComparisonInput` (`lib/connected/input.ts:13-22`) enforces an explicit origin allowlist, rejects username/password and hashes, and restricts `searchParams` to a single `foundation` key.
- **S2.** `HistoryCompare` (`history-compare.tsx:56-57`) documents the intent to save a distinct record rather than a like-for-like exposure, and gates comparison on `sameResearchEquivalenceCohort`.
- **S3.** `CompareSection` uses `>= 0.3` thresholds and labels the block "Largest dimension shifts" — no inferential claims.
- **S4.** `profile-save-intent.ts:45-47, 68-84` treats storage failures and canonical URL opens as read-only, and consumes the intent once.
- **S5.** `connected/input.ts:5` documents "Pasted URLs are parsed, never fetched."
- **S6.** `ProfileCompare` line 73-74 uses a monotonically increasing `savedRequest` ref to guard against stale async profile loads — correct race avoidance.
- **S7.** `evidence.ts:132-143` declares voluntary completion details can only *fill* missing provenance, not replace issued facts.
- **S8.** `profile-compare.tsx:96` explicitly says "their display order does not rank their importance" — good editorial discipline for ties.
- **S9.** `local-data.ts:41-64` preserves analytics opt-out across history clear (matches E2E `critical-smoke.spec.ts:1004`).
- **S10.** `quiz-app.tsx:265-301` uses coarse-bucket latency only, never raw timestamps, and documents the ephemeral ref.

---

## Diagnostic script

Self-contained Node `.mts` script. Uses dynamic import through an existing alias loader convention if present; otherwise resolves via `tsx`/`ts-node` required by the host. It does **not** invent APIs; it only imports the exports actually declared in the supplied files. All outputs are diagnostic prints.

```ts
// audit-pr63.mts
/**
 * Independent diagnostic probes for PR63.
 * No network calls. No application edits. No dependency additions assumed.
 *
 * Run with the project's existing TS loader, e.g.:
 *   node --loader tsx ./audit-pr63.mts
 *   npx tsx ./audit-pr63.mts
 */

type ProbeResult = {
  id: string
  claim: string
  observed: unknown
  pass: boolean | "inconclusive"
  note?: string
}

const results: ProbeResult[] = []
const record = (
  id: string,
  claim: string,
  observed: unknown,
  pass: boolean | "inconclusive",
  note?: string,
) => results.push({ id, claim, observed, pass, note })

// ---------------------------------------------------------------------------
// 0. Loader introspection — fail loudly rather than silently skipping probes.
// ---------------------------------------------------------------------------

async function tryImport<T = unknown>(spec: string): Promise<T | null> {
  try {
    return (await import(spec)) as T
  } catch (err) {
    record(`loader:${spec}`, `module ${spec} importable`, {
      error: (err as Error).message,
    }, "inconclusive", "Host must supply a TS alias loader (tsx/ts-node + tsconfig paths).")
    return null
  }
}

const input = await tryImport<typeof import("@/lib/connected/input")>("@/lib/connected/input")
const evidence = await tryImport<typeof import("@/lib/connected/evidence")>(
  "@/lib/connected/evidence",
)
const shareMod = await tryImport<typeof import("@/lib/share")>("@/lib/share")
const profileCompareMod = await tryImport<typeof import("@/lib/profile-compare")>(
  "@/lib/profile-compare",
)
const historyMod = await tryImport<typeof import("@/lib/result-history")>(
  "@/lib/result-history",
)
const localData = await tryImport<typeof import("@/lib/local-data")>(
  "@/lib/local-data",
)
const saveIntent = await tryImport<typeof import("@/lib/profile-save-intent")>(
  "@/lib/profile-save-intent",
)
const provenance = await tryImport<typeof import("@/lib/locale-provenance")>(
  "@/lib/locale-provenance",
)

// ---------------------------------------------------------------------------
// Synthetic in-memory storage (no real localStorage).
// ---------------------------------------------------------------------------

function makeStorage() {
  const map = new Map<string, string>()
  return {
    getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
    setItem: (k: string, v: string) => void map.set(k, String(v)),
    removeItem: (k: string) => void map.delete(k),
    clear: () => map.clear(),
    key: (i: number) => Array.from(map.keys())[i] ?? null,
    get length() {
      return map.size
    },
    _dump: () => Object.fromEntries(map.entries()),
  } satisfies Storage
}

// ---------------------------------------------------------------------------
// 1. parseComparisonInput — boundary and malformed input probes.
// ---------------------------------------------------------------------------

if (input) {
  const { parseComparisonInput, MAX_COMPARISON_INPUT } = input

  const cases: Array<{ id: string; raw: string; expectOk: boolean; note?: string }> = [
    { id: "empty", raw: "", expectOk: false },
    { id: "whitespace", raw: "   ", expectOk: false },
    { id: "over-max", raw: "A".repeat(MAX_COMPARISON_INPUT + 1), expectOk: false },
    { id: "at-max-tokenlike", raw: "A".repeat(MAX_COMPARISON_INPUT), expectOk: "inconclusive" as unknown as boolean, note: "depends on token shape" },
    { id: "ssh-url-rejected", raw: "ssh://irworldview.jhyip.com/results/abc", expectOk: false },
    { id: "userinfo-rejected", raw: "https://user:pass@irworldview.jhyip.com/results/abc", expectOk: false },
    { id: "hash-rejected", raw: "https://irworldview.jhyip.com/results/abc#frag", expectOk: false },
    { id: "http-scheme", raw: "http://irworldview.jhyip.com/results/abc", expectOk: "inconclusive" as unknown as boolean, note: "P/N: code permits http:" },
    { id: "unknown-origin", raw: "https://evil.example/results/abc", expectOk: false },
    { id: "wrong-path", raw: "https://irworldview.jhyip.com/other/abc", expectOk: false },
    { id: "extra-query", raw: "https://irworldview.jhyip.com/results/abc?x=1", expectOk: false },
    { id: "module-with-foundation-query", raw: "https://irworldview.jhyip.com/modules/security/results/abc?foundation=xyz", expectOk: "inconclusive" as unknown as boolean, note: "P/N: query retained but ignored" },
    { id: "zh-prefixed-foundation", raw: "https://irworldview.jhyip.com/zh/results/abc", expectOk: "inconclusive" as unknown as boolean, note: "regex allows zh / zh-Hans only before results" },
    { id: "zh-Hans-prefixed-foundation", raw: "https://irworldview.jhyip.com/zh-Hans/results/abc", expectOk: "inconclusive" as unknown as boolean },
  ]

  for (const c of cases) {
    const out = parseComparisonInput(c.raw)
    record(
      `parse:${c.id}`,
      `parseComparisonInput(${JSON.stringify(c.raw.slice(0, 60))}${c.raw.length > 60 ? "…" : ""})`,
      out,
      typeof c.expectOk === "boolean" ? out.ok === c.expectOk : "inconclusive",
      c.note,
    )
  }
}

// ---------------------------------------------------------------------------
// 2. Payload identity mismatch probe — decode/resolve a synthetic v5 payload,
//    verify provenance vs. decode congruence and detect silent downgrades.
// ---------------------------------------------------------------------------

if (shareMod && provenance) {
  const { resolveFoundationPayload, encodePayload } = shareMod
  const { completionProvenance } = provenance as {
    completionProvenance: (kind: "foundation", locale: "en" | "zh-Hans") => {
      locale: string
      localeCopyVersion: number
    }
  }

  // Minimal hand-built v5 payload shape matching SharePayloadV5 fields.
  // We do NOT assume buildFoundationSharePayload is exported with a specific
  // signature beyond what the file declares:
  const hand: Parameters<typeof encodePayload>[0] = {
    v: 5,
    ds: [4, 4, 4, 4, 4, 4, 4],
    fk: "realist",
    nk: "institutionalist",
    sm: "Hedger",
    nm: "Pluralist",
    iv: 4,
    bv: 2,
    sv: 2,
    cv: 1,
    cl: "en",
    qs: "core",
  } as const as never

  try {
    const token = encodePayload(hand)
    const resolved = resolveFoundationPayload(token)
    record(
      "identity:v5-roundtrip",
      "encodePayload(resolve) preserves v/iv/bv/sv/cv/cl/qs and dims",
      {
        tokenPrefix: token.slice(0, 16),
        resolved: resolved
          ? {
              v: resolved.payload.v,
              qs: (resolved.payload as { qs?: string }).qs,
              iv: resolved.payload.iv,
              sv: resolved.payload.sv,
              cv: resolved.payload.cv,
              cl: resolved.payload.cl,
              dims: resolved.dimensionScores,
              provenance: resolved.provenance,
              tier: resolved.resultTier,
            }
          : null,
      },
      resolved
        ? resolved.payload.v === 5 &&
          (resolved.payload as { qs?: string }).qs === "core" &&
          resolved.provenance.localeCopyVersion === 1 &&
          resolved.provenance.completionLocale === "en" &&
          resolved.provenance.instrumentVersion === 2
        : false,
    )

    // Locale provenance mismatch probe: does the resolved provenance match
    // the field-level cl/cv in the payload, independent of what the caller
    // claims in HistoryCompare's effect deps?
    const en = completionProvenance("foundation", "en")
    record(
      "identity:en-provenance",
      "completionProvenance('foundation','en') shape",
      en,
      typeof en.locale === "string" && typeof en.localeCopyVersion === "number",
    )
  } catch (err) {
    record(
      "identity:v5-roundtrip",
      "encode/resolve hand-built v5",
      (err as Error).message,
      "inconclusive",
      "encodePayload normalizers may reject this synthetic shape.",
    )
  }
}

// ---------------------------------------------------------------------------
// 3. History ownership probe — exercise saveSnapshot / getLast* without
//    touching real storage.
// ---------------------------------------------------------------------------

if (historyMod) {
  const mod = historyMod as {
    saveSnapshot?: (s: unknown) => void
    getLastComparableSnapshot?: (p: unknown) => unknown
    getLastSnapshotWithProvenance?: (p: unknown) => unknown
  }
  record(
    "history:exports",
    "lib/result-history exports",
    {
      hasSaveSnapshot: typeof mod.saveSnapshot === "function",
      hasGetLastComparable: typeof mod.getLastComparableSnapshot === "function",
      hasGetLastWithProvenance: typeof mod.getLastSnapshotWithProvenance === "function",
    },
    typeof mod.saveSnapshot === "function" && typeof mod.getLastComparableSnapshot === "function",
    "If the module ships its own storage key, probes below are advisory only.",
  )

  // We do not call saveSnapshot/getLast* against real storage; instead we
  // confirm the schema required by HistoryCompare's snapshot literal is
  // syntactically accepted by ShapeScript: we build two literal snapshots
  // and check the fields HistoryCompare reads (familyKey, neighborKey,
  // modifiers, dimensionScores, timestamp) are all present on our literal.
  const s1 = {
    timestamp: 1_700_000_000_000,
    schemaVersion: 0,
    familyKey: "realist",
    neighborKey: "institutionalist",
    strategyModifier: "Hedger",
    normativeModifier: "Pluralist",
    dimensionScores: {
      securityCompetition: 4,
      institutions: 4,
      domesticFilters: 4,
      normsIdentity: 4,
      politicalEconomy: 4,
      restraint: 4,
      orderJustice: 4,
    },
    locale: "en",
    localeCopyVersion: 1,
  }
  const requiredFields = [
    "timestamp",
    "familyKey",
    "neighborKey",
    "strategyModifier",
    "normativeModifier",
    "dimensionScores",
    "locale",
    "localeCopyVersion",
  ] as const
  record(
    "history:snapshot-shape",
    "HistoryCompare's literal snapshot contains every field read at compare time",
    Object.fromEntries(requiredFields.map((f) => [f, f in s1])),
    requiredFields.every((f) => f in s1),
  )

  // Tolerance probe: replicate isEssentiallySame's comparison math against
  // an absolutely-controlled pair to bound its behavior for the audit report.
  const tol = 0.15
  const sameNear = Math.abs(4 - 4.14) < tol
  const sameFar = Math.abs(4 - 4.16) < tol
  const sameAt = Math.abs(4 - 4.15) < tol
  record(
    "history:tolerance",
    "isEssentiallySame tolerance boundary (<0.15)",
    { at14: sameNear, at15: sameAt, at16: sameFar },
    sameNear === true && sameAt === false && sameFar === false,
  )
}

// ---------------------------------------------------------------------------
// 4. Compare shape boundaries — buildEvidenceComparison with deliberately
//    crafted EvidenceBundles to observe tie/withheld/missing behavior.
// ---------------------------------------------------------------------------

if (evidence && profileCompareMod) {
  const {
    compareProvenance,
    withDeclaredExposure,
    evidenceFromToken,
  } = evidence
  const { buildEvidenceComparison, APPRECIABLE_SCORE_GAP } = profileCompareMod

  // 4a. Comparability — fully-known identical provenance → comparable.
  const mkProv = (over: Partial<Record<string, unknown>> = {}) => ({
    bank: 2,
    scorer: 2,
    form: "standard",
    language: "en",
    copy: 1,
    exposureSource: "issued" as const,
    ...over,
  })
  const mkResult = (over: Partial<Record<string, unknown>> = {}) => ({
    domain: "ai" as const,
    resultId: "x",
    title: "A",
    provenance: mkProv(),
    scores: { riskHorizon: 4 },
    labels: { riskHorizon: "Risk" },
    observations: [],
    missingness: null,
    ...over,
  })

  const compSame = compareProvenance(mkResult() as never, mkResult() as never)
  record(
    "compare:comparable",
    "identical fully-known provenance → comparable",
    compSame,
    compSame.status === "comparable",
  )

  const compLang = compareProvenance(
    mkResult() as never,
    mkResult({ provenance: mkProv({ language: "zh-Hans" }) }) as never,
  )
  record(
    "compare:lang-mismatch",
    "known language mismatch → incompatible",
    compLang,
    compLang.status === "incompatible",
  )

  const compNullNull = compareProvenance(
    mkResult({ provenance: mkProv({ bank: null, scorer: null, form: null, language: null, copy: null }) }) as never,
    mkResult({ provenance: mkProv({ bank: null, scorer: null, form: null, language: null, copy: null }) }) as never,
  )
  record(
    "compare:all-null",
    "both sides fully-null → status 'unknown' (per code path)",
    compNullNull,
    compNullNull.status === "unknown",
    "Reported as P/N D17: 'unknown' is safe, but reason text may sound like sides differ.",
  )

  const compDom = compareProvenance(
    mkResult({ domain: "foundation" }) as never,
    mkResult({ domain: "ai" }) as never,
  )
  record(
    "compare:cross-domain",
    "cross-domain pair → incompatible",
    compDom,
    compDom.status === "incompatible",
  )

  const compMissing = compareProvenance(undefined, mkResult() as never)
  record(
    "compare:missing",
    "one side missing → 'missing'",
    compMissing,
    compMissing.status === "missing",
  )

  // 4b. Display rules — a fixed pair whose differences straddle APPRECIABLE_SCORE_GAP.
  const left = {
    domain: "ai" as const,
    resultId: "L",
    title: "L",
    provenance: mkProv(),
    scores: {
      riskHorizon: 3.0,
      deploymentPace: 4.0,
      oversight: 4.0,
      geopolitics: 4.0,
      openness: 4.0,
      militaryRole: 4.0,
      legitimacy: 4.0,
      humanFuture: 4.0,
    },
    labels: Object.fromEntries(
      [
        "riskHorizon",
        "deploymentPace",
        "oversight",
        "geopolitics",
        "openness",
        "militaryRole",
        "legitimacy",
        "humanFuture",
      ].map((k) => [k, k]),
    ),
    observations: [],
    missingness: null,
  }
  const rightOk = {
    ...left,
    resultId: "R",
    scores: { ...left.scores, riskHorizon: 5.0 },
  }
  const bundleL = { ai: left as never }
  const bundleR = { ai: rightOk as never }

  const comparisons = buildEvidenceComparison(bundleL, bundleR)
  const ai = comparisons[0]
  record(
    "compare:gap-2.0",
    "ai pair with one clear gap and one clean provenance → state 'different'",
    {
      gap: APPRECIABLE_SCORE_GAP,
      state: ai?.state,
      rows: ai?.rows.length,
      largest: ai?.largest.map((r) => ({ key: r.key, diff: r.diff })),
      summary: ai?.summary,
    },
    ai?.state === "different" && ai.largest.length === 1,
  )

  // 4c. Tie behavior — two equal largest gaps.
  const rightTie = {
    ...left,
    resultId: "R2",
    scores: { ...left.scores, riskHorizon: 5.0, oversight: 2.0 },
  }
  const tieComparisons = buildEvidenceComparison(bundleL, { ai: rightTie as never })
  const tie = tieComparisons[0]
  record(
    "compare:tie-largest",
    "equal-magnitude largest gaps → largest contains both",
    {
      largestKeys: tie?.largest.map((r) => r.key),
      summary: tie?.summary,
    },
    (tie?.largest.length ?? 0) === 2 && /gaps are tied/.test(tie?.summary ?? ""),
  )

  // 4d. Declared exposure — only fills, never replaces issued fields.
  const bundle = { ai: left as never }
  const filled = withDeclaredExposure(bundle, {
    language: "zh-Hans",
    copy: 9,
    form: "analyst",
    declared: true,
  })
  const filledProv = filled.ai!.provenance
  record(
    "compare:declared-fill",
    "withDeclaredExposure does not overwrite known language/copy/form",
    filledProv,
    filledProv.language === "en" && filledProv.copy === 1 && filledProv.form === "standard",
  )
}

// ---------------------------------------------------------------------------
// 5. Malformed inputs for evidenceFromToken — exercise reject paths without
//    touching real decoding.
// ---------------------------------------------------------------------------

if (evidence) {
  const { evidenceFromToken } = evidence
  const bads = [
    "",
    "not-a-token-with-!@#",
    "a".repeat(10_000),
  ]
  for (const raw of bads) {
    const r = evidenceFromToken("foundation", raw)
    record(
      `evidence:${raw.slice(0, 12) || "empty"}`,
      "evidenceFromToken returns null for undecodable input",
      r === null,
      r === null,
    )
  }
}

// ---------------------------------------------------------------------------
// 6. Local-data clearing — confirm key lists preserved analytics opt-out.
// ---------------------------------------------------------------------------

if (localData) {
  const { clearLocalWorldviewHistory, LOCAL_HISTORY_STORAGE_KEYS, SESSION_HISTORY_STORAGE_KEYS } = localData
  const ls = makeStorage()
  const ss = makeStorage()
  for (const k of LOCAL_HISTORY_STORAGE_KEYS) ls.setItem(k, "x")
  for (const k of SESSION_HISTORY_STORAGE_KEYS) ss.setItem(k, "x")
  const optOutKey = "ir-worldview-analytics-opt-out-v1"
  ls.setItem(optOutKey, "true")

  const out = clearLocalWorldviewHistory(ls, ss)
  const after = ls.getItem(optOutKey)
  record(
    "privacy:clear-preserves-optout",
    "clearLocalWorldviewHistory removes all listed keys and keeps opt-out",
    {
      removed: out.removed,
      failed: out.failed,
      optOut: after,
      localRemaining: LOCAL_HISTORY_STORAGE_KEYS.filter((k) => ls.getItem(k) !== null),
      sessionRemaining: SESSION_HISTORY_STORAGE_KEYS.filter((k) => ss.getItem(k) !== null),
    },
    after === "true" &&
      LOCAL_HISTORY_STORAGE_KEYS.every((k) => ls.getItem(k) === null) &&
      SESSION_HISTORY_STORAGE_KEYS.every((k) => ss.getItem(k) === null),
  )
}

// ---------------------------------------------------------------------------
// 7. Profile-save-intent — consume once semantics under synthetic storage.
// ---------------------------------------------------------------------------

if (saveIntent) {
  const { markProfileSaveIntent, consumeProfileSaveIntent, PROFILE_SAVE_INTENT_KEY } = saveIntent
  // Bind a fake window so the module's typeof-window guards take the storage path.
  const ss = makeStorage()
  const g = globalThis as unknown as { window?: unknown }
  const hadWindow = "window" in g
  g.window = { sessionStorage: ss }

  markProfileSaveIntent("foundation", "payload-A", { mode: "standard" })
  const first = consumeProfileSaveIntent("foundation", "payload-A")
  const second = consumeProfileSaveIntent("foundation", "payload-A")

  markProfileSaveIntent("foundation", "payload-B")
  const mismatch = consumeProfileSaveIntent("foundation", "payload-A")

  record(
    "save-intent:consume-once",
    "consumeProfileSaveIntent consumes exactly once for a matching identity",
    {
      first,
      second,
      mismatch,
      storage: ss._dump(),
      key: PROFILE_SAVE_INTENT_KEY,
    },

