> **HISTORICAL, SUPERSEDED, NON-EXECUTABLE.** Preserved only for provenance. Verify every claim against the current roadmap, Git state, and runtime before reuse.

# Frozen-version duplication and the JSON migration: an audit

> **HISTORICAL AND SUPERSEDED AS EXECUTION AUTHORITY.** Preserve evidence for provenance. Do not migrate frozen banks from this report.

**Scope.** Read-only copy at `/mnt/user-data/uploads/ir-worldview-app-clean` — 58 files, 17,933 lines of `.ts`/`.tsx`/`.mjs`. Every figure below states how it was counted. Files referenced but **not staged** are listed in §7; the most consequential absences are `lib/modules/calibration.ts`, `lib/ai-governance-scoring.ts`, `lib/ai-governance-versions.ts`, and all of `content/instrument/*.json`.

---

## 0. The headline finding, up front

**The migration being proposed has already happened for the part that mattered.** Every question bank in this repo is already a JSON file under `content/instrument/`. Zero lines of item data live in any TypeScript module.

Verified: `grep` for `whyHard`, `perspectiveTags:`, `knowledgeLoad:`, `signals: {` across `lib/modules/*.ts` and `lib/ai-governance-*.ts`, excluding `types.ts`, returns **nothing**. Each module file instead carries a JSON import:

| File | Bank it loads | Line |
|---|---|---|
| `lib/modules/security-v21.ts` | `content/instrument/security.v2.json` | 7–9 |
| `lib/modules/security-v22.ts` | `content/instrument/security.v3.json` | 12–14 |
| `lib/modules/security.ts` | `security.v4.json` **and** `security.v5.json` | 14–19 |
| `lib/modules/technology-v21.ts` | `technology.v2.json` | 7–9 |
| `lib/modules/technology.ts` | `technology.v3.json` | 11–13 |
| `lib/ai-governance-schema-v21.ts` | `ai-governance.v2.json` | 7–9 |

The proposal's target path is `content/frozen/<slug>.v<N>.json`. The actual path is `content/instrument/<slug>.v<N>.json`. That is a directory rename, not a migration.

**And the second half of the proposal has a working prototype in the repo.** `lib/modules/security.ts:87` defines `createSecurityModule(bank, calibrationVersion, actorLensCopy)` and instantiates it twice — once for live bank v5, once for **frozen** bank v4 (`securityV4Module`, lines 401–408, commented "Frozen Security bank-v4 definition for exact historical payload replay"). Freezing a version there costs **9 lines**. Freezing a version the old way costs 401–516 lines. The pattern the proposal asks for is already load-bearing in the newest file; it simply was not applied retroactively.

So the real question is not "should we move data to JSON." It is **"should we back-port the factory pattern to the three older files, and what does the leftover prose cost?"** Those have very different answers, and the second one is where the proposal goes wrong.

---

## 1. What actually differs, pair by pair

Counting method: `diff -u A B | grep -c '^[+-][^+-]'` for changed lines; `comm -12` over sorted non-blank lines for identical-line overlap. Region boundaries taken from `grep -n` on declaration anchors, then line arithmetic.

### 1a. `security-v21.ts` → `security-v22.ts` — **logic change, real**

185 changed lines. 332 non-blank lines identical (70% of v22's 476 non-blank).

This is a genuine scorer version bump (`scoringVersion` 1 → 2), not a copy edit. v21 gates on raw thresholds:

```
if (activism >= 5.4 && escalation >= 5.1) {          // security-v21.ts:125
```

v22 gates on calibrated axis positions:

```
if (
  activismPosition.value >= activismPosition.upper &&
  escalationPosition.value >= escalationPosition.upper
) {                                                   // security-v22.ts:182-185
```

v22 adds `import { getModuleClassificationMode, standardizeModuleAxis }` from `@/lib/modules/calibration` (lines 7–10) and a local `standardizeModuleAxis` wrapper (29–44) that pins the calibration tuple. Every threshold in `interpret` and `summarizeSecurityLane` is rewritten this way. **v21 cannot be folded into v22's factory** — the numbers are not parameters of the same function, they are different functions.

The rest of the diff is editorial: `description`, five `summary` strings, three `instincts` bullets, one `challenge`, and v22 gaining `defaultHeadline` (line 99) which v21 lacks entirely.

**Split:** of 373 non-blank lines in v21 — ~26 lanes array + ~51 module-metadata header + ~7 overlay-dimension const = **84 lines declarative data (23%)**; ~145 lines counting embedded prose as data (**39%**); ~185 lines real logic (**50%**); ~44 lines imports and bank plumbing (**12%**).

### 1b. `security-v22.ts` → `security.ts` — **mechanical parameterization + copy**

159 changed lines, but **432 non-blank lines identical (83% of security.ts's 523)** — the highest overlap of any pair.

Nearly the entire diff is one of two things:

1. `standardizeModuleAxis("security", …)` → `standardizeSecurityAxis(calibrationVersion, …)`. Same call, same order, same semantics; the calibration tuple arrives as a parameter instead of a module constant. Nine call sites.
2. The object literal is wrapped in `createSecurityModule(...)` and returned.

The **only** non-mechanical differences are five copy fields and one branch:

- `timeEstimate`: `"8 to 10"` / `"14 to 18"` → `"18 to 24"` / `"24 to 30"` minutes
- `description` (one sentence)
- `measures`: v5 adds `"how stated objectives and constraints shape actor instruments…"`
- `doesNotClaim`: `"role-play or nationality-adjusted answers"` → `"endorsement, loyalty, or nationality-adjusted scoring from perspective-modeling choices"`
- `summarizeCardTypes`: v5 adds an early return when `actorLensCopy === "role-conditioned"` returning `ACTOR_LENS_RESULT_SUMMARY` (`security.ts:299-304`)

`interpret` is otherwise byte-identical between the two. **This 516-line file could be ~30 lines.**

### 1c. `technology-v21.ts` → `technology.ts` — **same shape as 1a**

174 changed lines; 322 identical (71% of technology.ts's 454 non-blank). Identical structural story: raw thresholds (`control >= 5.5 && industrial >= 5.3`, line 121 of v21) become calibrated positions, plus rewritten summary copy. Different axis names, different threshold constants, but the **same edit applied twice**.

`summarizeTechnologyLane` in the current file adds a second axis to the governance branch (`governancePosition && safetyPosition`) where v21 checked `governance >= 5.2 && safety >= 5.0` — so the branch predicate structure is preserved, only the comparison basis changed.

**Split** (technology.ts, 454 non-blank): ~145 data (32%), ~266 logic (59%), ~43 plumbing (9%).

### 1d. `runtime-v1.ts` → `runtime-v2.ts` — **100% logic, 95% identical, 0% data**

**16 changed lines out of 236.** 204 identical non-blank lines = **95% of v2**. Zero prose strings in either file (`grep` for long string literals returns 0). Of the 16 changed lines, 8 are the header comment and the `MODULE_SCORING_VERSION` constant. The **entire behavioural delta is 5 lines**:

- `mode,` added to the returned analytics object (`runtime-v2.ts:78`)
- `const classificationContext = { mode }` and passing it to `interpret(...)` and `summarizeLanes(...)` (`runtime-v2.ts:175-184`)

That is the whole difference. `scoreQuestions`, `applySignals`, `buildCardTypeScores`, `SECOND_CHOICE_WEIGHT = 0.45` — all byte-identical. **JSON is irrelevant to this pair.** There is no data to extract. The proposal, applied here, does nothing.

### 1e. `ai-governance-results.ts` → `ai-governance-results-v2.ts` — **not a version pair at all**

This is the premise error in the brief. `ai-governance-results-v2.ts:9` reads:

```
import { getActiveAiGovernanceTensions } from "@/lib/ai-governance-results"
```

**v2 imports the base file.** They are complementary layers, not frozen duplicates — the base holds axis one-liners, poles, push chart, and comparison axes; v2 holds the deep-dive layer (policy signals, tension cards, comparison card, share lead). `app/ai/results/[payload]/page.tsx` imports from **both** (lines 6–15) in the same render.

Textual overlap: **9 non-trivial lines** (>25 chars, deduped), of which 4 are import statements and 2 are type expressions. There is essentially no duplication *between these two files*.

But there is duplication elsewhere, and it is exact:

> **`archetypeSignatures` (`ai-governance-results-v2.ts:57–117`) is byte-identical to `archetypeProfiles` (`ai-governance-scoring-v21.ts:30–90`).** Verified by extracting both ranges, stripping leading whitespace, and `diff` — 61 lines each, zero differences.

Two further exact duplicates, both tension predicates:

| Base (`ai-governance-results.ts`) | v2 (`ai-governance-results-v2.ts`) | Shared condition |
|---|---|---|
| `compete-and-coordinate` (L195–197) | `sovereignty-vs-broad-legitimacy` (L161–165) | `geopolitics >= 5 && legitimacy >= 5` |
| `military-and-human-control` (L210–212) | `human-control-vs-defense-use` (L168–172) | `militaryRole >= 5 && humanFuture >= 5` |

`getExpandedTensionCards` (`ai-governance-results-v2.ts:333-356`) concatenates base tensions with the v2 extras and slices to 3. **A user scoring ≥5 on both geopolitics and legitimacy gets two near-identical tension cards in the same list** — one titled by `sentenceToTitle()` heuristics, one by the hardcoded `title`. That is a live defect, verifiable from the two files, and unrelated to version freezing.

---

## 2. Could one generic decoder serve them?

**For the data: yes, and it already does.** All six banks load through the same four-line pattern (`filter(item => item.modes.includes(mode))` then strip `modes`), duplicated verbatim in five files.

**For the definitions: no, not one decoder.** Three specific shape differences block it.

**Blocker 1 — `runtime` is a module namespace type, not data.**
`lib/modules/versions.ts:40` declares `runtime: typeof runtimeV1 | typeof runtimeV2`. A JSON file cannot express "this version dispatches to the v1 scoring runtime." Any decoder must keep a code-side registry mapping `scoringVersion → runtime module`, and both runtime files must remain compiled code. This alone caps the achievable saving.

**Blocker 2 — the scorer is genuinely different across the v1/v2 boundary, and it is not table-driven.**
`ModuleDefinition` (`lib/modules/types.ts:161–177`) declares five **function-valued** fields: `interpret`, `summarizeLanes`, `summarizeCardTypes`, `buildOverlayDeltas`, `compareToFoundation`. v21 modules implement these with inline numeric thresholds; v22+ modules implement them by calling into `lib/modules/calibration`. Serving both from one decoder means either (a) keeping two implementations and selecting by version — which is what `versions.ts` already does — or (b) inventing a threshold DSL expressive enough to encode `activismPosition.value >= activismPosition.upper` *and* `activism >= 5.4`. Option (b) is a scoring change by any reasonable reading of the hard constraint.

**Blocker 3 — the copy is interleaved with control flow, not adjacent to it.**
The prose does not sit in a block you can lift. It sits inside branch returns:

```
if (alliancePosition.value >= alliancePosition.upper) {
  return {
    headline: "Security read: coalition-centered pressure management",
    summary: "Your answers put exposed-partner confidence and …",
    instincts: [ … three strings … ],
    challenge: "This style can assume more allied durability than …",
  }
}
```

Extracting that to JSON requires minting a stable key per branch and rewriting every return site. That is not a decoder; that is a rewrite of the scoring functions.

**Where a generic decoder *does* work cleanly:** the declarative header. `slug`, `defaultHeadline`, `title`, `shortTitle`, `subtitle`, `shorthand`, `timeEstimate`, `description`, `measures`, `doesNotClaim`, `axes`, `lanes` — roughly 77 lines per file, structurally identical across all five files, already shaped like a manifest. `lib/modules/manifests.ts:34-54` (`resultCopyFromDefinition`) **already extracts exactly these fields into a `DomainModuleResultCopy` record.** The schema for the extractable half exists.

**One more shared-structure datum:** cross-module overlap between `security-v22.ts` and `technology.ts` is 229 identical non-blank lines (50%). Same skeleton, different domain. `compress()` is byte-identical across all five module files (verified by `md5sum` on the four-line function body) — five copies of the same clamp-and-round.

---

## 3. Is anything dead?

**Confirmed live** (importer cited):

- `security-v21.ts`, `technology-v21.ts`, `security-v22.ts` — all three imported by `lib/modules/versions.ts` (lines 9–28) and registered in `SUPPORTED_MODULE_VERSIONS` (68–109).
- `runtime-v1.ts` — `versions.ts:30`, reached via `version.runtime.*` in `framework.ts:349`.
- **`security-v21.ts` and `technology-v21.ts` are on the hot path for every legacy link.** `framework.ts:154-183` and `188-210` route *all* `v:1` and `v:2` payloads to `MODULE_V21_TUPLE` (bank 2, scorer 1) unconditionally. Deleting them breaks every share URL issued before the v22 release.

**Dead among staged files, with a caveat:**

- `securityOverlayDimensions` — exported from `security.ts:558`, `security-v21.ts:405`, `security-v22.ts:510`. `technologyOverlayDimensions` — `technology.ts:484`, `technology-v21.ts:394`. **Five copies of a 7-line const, zero importers** among staged files (`grep -rn "OverlayDimensions"` outside the defining files returns nothing). Related: `types.ts:141-142` marks `overlayDeltas` `@deprecated Frozen replay output only; active module saves must write an empty object`, and `types.ts:171-173` marks `buildOverlayDeltas` and `compareToFoundation` `@deprecated Frozen version replay only; excluded from the V23.4 authoring contract`. So the overlay machinery is deprecated-but-live for replay, and its *dimension list* export looks vestigial. **Cannot confirm dead** — an unstaged consumer could import it.

**Cannot determine (registry not staged):**

- `lib/ai-governance-scoring-v21.ts` — no staged importer except `ai-governance-schema-v21.ts` importing *into* it. It is almost certainly reached through `lib/ai-governance-versions.ts` (not staged), since `ai-governance-results-v2.ts:190-192` calls `resolvedVersion.scoring.scoreArchetypes` / `.archetypeLabels` / `.archetypeDescriptions`. **Infer live. Do not delete on the strength of a grep.**
- `lib/modules/manifests.ts` and `lib/modules/release-decisions.ts` — no staged importers. Both import `@/lib/modules/authoring-contract` (not staged), and `package.json` has `validate:module-authoring` pointing at `scripts/validate-module-authoring.mts` (not staged). **Infer live via the validation harness.**

**Nothing is clearly superseded-and-abandoned.** The freeze discipline appears to be working; the cost is duplication, not rot.

**One correctness question I could not close.** `ai-governance-results-v2.ts` imports live scoring from the *unversioned* `@/lib/ai-governance-scoring` (line 11–15) but hardcodes the **v21** weight table as `archetypeSignatures`. On the metadata path, `app/ai/results/[payload]/page.tsx:47` overrides it by passing `resolved.scoring.archetypeProfiles`. But `getAiGovernanceSurprisingFinding` (`ai-governance-results-v2.ts:517-543`) takes **no signatures parameter** and always uses the hardcoded v21 table at line 530. If the current `ai-governance-scoring.ts` weights have drifted from v21, the "Nearest alternative" contrast axes are computed from stale weights on that path. `lib/ai-governance-scoring.ts` is not staged, so **I cannot tell whether this is a live bug or a harmless coincidence.** It is the first thing to check.

---

## 4. Are the data portions safely extractable? Named hazards

The bank data already moved and works. These are the hazards for the **remaining** content — the prose, the metadata, and the AI-governance tables.

**H1 — Functions embedded in data.** `TensionRule.condition: (scores: AiAxisScores) => boolean` (`ai-governance-results.ts:189`) — four instances at lines 196, 201, 206, 211. `additionalTensionRules[].condition` (`ai-governance-results-v2.ts:122`) — seven instances at 128, 135, 142, 149, 156, 163, 170. `axisOneLiners: Record<AiAxisKey, (score: number) => string>` (`ai-governance-results.ts:21-70`) — eight arrow functions, each a nested ternary. JSON holds none of these. Encoding them needs a predicate DSL, which is new interpreter code on a scoring path.

**H2 — Imports referenced from data.** `security.ts:302` returns `summary: ACTOR_LENS_RESULT_SUMMARY`, imported from `@/lib/modules/perspective-bank` (line 12). A JSON file cannot reference that symbol; you would either inline the string (forking the constant) or add an indirection layer.

**H3 — Computed and shared-reference values.** `questionsByMode` is computed at module load from the JSON (`security.ts:93-96`). `lanes: securityLanes` is a **shared object reference** — the same array is both assigned to the definition and searched by `summarizeSecurityLane` via `securityLanes.find(...)` (`security.ts:417`). Serializing it produces two independent objects; harmless today, but it is exactly the kind of aliasing a mechanical port breaks silently. `versions.ts:53-61` builds `SECURITY_V4_TUPLE` / `SECURITY_V5_TUPLE` from constants imported out of `security.ts` — the version numbers are code, not content.

**H4 — Type narrowing JSON loses.** This is the most concrete hazard and the code already shows the scar tissue.

Narrow types that JSON widens to `string`/`number`:
- `ModuleSlug = "security" | "technology"` (`types.ts:5`)
- `ModuleAxisKey` — 8 literals (`types.ts:7-15`), used by `ModuleAxis.key` and `ModuleQuestion.discriminatingAxes`
- `ChoiceCardType = "explanation" | "decision" | "actorLens" | "both"` (`lib/types.ts:21`)
- `ModuleKnowledgeLoad = "low" | "medium" | "high"` (`types.ts:46`)
- `QuizMode = "standard" | "analyst"` (`lib/types.ts:12`), load-bearing in `timeEstimate: Record<QuizMode, string>` and `questionsByMode`
- `ModuleQuestion.kind?: "case" | "synthesis"` (`types.ts:50`)
- `PinnedOptionPosition` on `ModuleOption.pinned` (`types.ts:29`, from unstaged `lib/option-order`)

The existing code already pays this and papers over it with unchecked casts: `securityBankJson.items as unknown as SecurityDataItem[]` (`security-v21.ts:53-54`, `security-v22.ts:79-80`) and `bank.items as SecurityDataItem[]` (`security.ts:92`). **A double-assertion through `unknown` disables every structural check.** Each new JSON boundary adds another one. Meanwhile `release-decisions.ts:33` and `versions.ts:46,51,66,109` use `as const satisfies` to keep literal types and validate shape at compile time — **that guarantee is simply unavailable across a JSON import.**

**H5 — Optional-vs-undefined semantics.** `ModuleLaneSummary.delta?: string` is produced by a three-level nested ternary that can yield `undefined` (`security.ts:467-476`). `summarizeCardTypes` returns `ModuleCardTypeRead | undefined` and `runtime-v2.ts:195` spreads it conditionally (`...(cardTypeRead ? { cardTypeRead } : {})`) so the key is **absent**, not `undefined`. If replay output is compared by `JSON.stringify` or deep-equal, absent-vs-undefined is a real distinction, and a JSON-driven rewrite will get it wrong at least once.

**H6 — The frozen-file audit classifier is already wrong, and the migration would make it worse.** `scripts/audit-public-copy.mjs:767`:

```
if (/^lib\/modules\/(?:runtime-v1|[^/]+-v21)\.[cm]?[jt]sx?$/.test(fileName)) return "frozen"
```

matches `runtime-v1.ts`, `security-v21.ts`, `technology-v21.ts` — **but not `security-v22.ts`.** And line 768:

```
if (/^content\/instrument\/(?:security|technology|ai-governance)\.v2\.json$/.test(fileName))
```

matches only `.v2.json` — **not `security.v3.json` (frozen v22 bank) nor `security.v4.json` (frozen v4 bank).** Per line 268, "frozen" status means those strings "remain visible but cannot fail strict mode." So today, three frozen artefacts are audited as live public copy and **can fail `npm run copy:audit:strict`** — creating pressure to edit a file that must never change. Moving files to `content/frozen/` breaks both regexes for everything.

---

## 5. Migration plan, with honest difficulty ratings

Sequenced by value-per-risk. Phases 1 and 2 are worth doing. Phase 3 — the actual proposal as written — is not.

### Phase 0 — Build the replay corpus first. **Difficulty: low. Blocking.**
`package.json` already has `replay:scoring`, `validate:security-v4`, `validate:security-v5`, `calibrate:modules --check`, `diagnose`. What is missing (on staged evidence) is a fixture corpus of encoded payloads per `(slug, bankVersion, scoringVersion)` tuple with expected `ModuleResult` snapshots, deep-equal asserted.

**Branch coverage is the hard part and it is not mechanical.** In `security-v22.ts` alone: `interpret` has 5 headline branches; `summarizeSecurityLane` has 3 lanes × 3 summary branches; the `delta` ternaries have 5 reachable outcomes; `summarizeCardTypes` has 5. A corpus built only from real historical payloads will not hit them all. Someone must construct answer sets that force each branch. Do this even if the migration is cancelled — it is the only thing that makes any of the rest safe.

### Phase 1 — Fold `security-v22.ts` into `createSecurityModule`. **Difficulty: low-medium. Saves ~480 lines.**
The factory exists and already serves one frozen version. Add a `copy` parameter for the four differing fields (`timeEstimate`, `description`, `measures`, `doesNotClaim`) and pass `SECURITY_V22_CALIBRATION_VERSION` as the tuple. 516 lines → ~30. Registry entry at `versions.ts:76-81` swaps its `definition` reference.

**Risk:** `standardizeModuleAxis` lives in the unstaged `lib/modules/calibration.ts`. Whether it produces identical output for the v22 tuple when reached through `security.ts` rather than `security-v22.ts` is the one thing that must be verified before touching anything, and I could not verify it.

### Phase 2 — One shared v21 factory for both v21 modules. **Difficulty: medium. Saves ~350–400 lines.**
`security-v21.ts` (411) + `technology-v21.ts` (401) share 50%+ of their skeleton and both use raw-threshold scoring. Thresholds parameterize easily. Branch *order* and lane predicate arity do not — technology's governance lane checks two axes (`governance >= 5.2 && safety >= 5.0`), security's legitimacy lane checks one. Expect ~420 lines for the shared factory plus two thin config objects.

### Phase 3 — Prose to JSON (the proposal as written). **Difficulty: medium-high. Recommend against.**
Measured: **49 string-literal lines per module file inside the scoring functions, 5,096–5,435 bytes each, 26–35% of file bytes.** Across all five module files that is ~245 lines / ~26 KB. Doing it requires minting a stable key namespace, rewriting every branch return site in `interpret` / `summarizeLanes` / `summarizeCardTypes` / `compareToFoundation` / `summarize*Lane`, and preserving H5's absent-vs-undefined semantics. That is the highest-risk edit in the plan touching the lowest-value bytes, on files that must not change behaviour. **The cost-benefit is inverted.**

The tractable subset: the ~77-line declarative header per file (titles, `timeEstimate`, `description`, `measures`, `doesNotClaim`, `axes`, `lanes`). It is already schema'd as `DomainModuleResultCopy` in `manifests.ts:34-54`. Extracting **that** is low-risk and reuses an existing contract. **Difficulty: low-medium. Saves ~385 lines across five files** and removes the copy-drift risk between manifest and definition.

### Phase 4 — `runtime-v1` / `runtime-v2`. **Recommend: leave alone.**
95% identical, 5 behavioural lines, 0% data. JSON is irrelevant. Merging behind a flag is easy but this is the file that computes every score, and 230 lines is a cheap price for an immutable scorer. Merging buys ~215 lines and risks the one thing you cannot un-break.

### Phase 5 — AI governance cleanup. **Difficulty: low mechanically, but needs a decision.**
(a) Delete the 61-line duplicated `archetypeSignatures` and import instead — **but first answer whether `getAiGovernanceSurprisingFinding` should use v21 or current weights** (§3). That is a product call, not a refactor. (b) Remove the two duplicated tension rules so users stop seeing paired near-identical cards.

### Phase 6 — Fix `audit-public-copy.mjs:767-770` **before** any file moves. **Difficulty: trivial. Do it first.**

---

## 6. How much code actually leaves the bundle?

**Source lines:** the nine named files total **3,624 lines** (`wc -l`; 20% of the 17,933 staged). Purely-frozen TypeScript — `security-v21` 411 + `security-v22` 516 + `technology-v21` 401 + `runtime-v1` 230 + `ai-governance-schema-v21` 153 + `ai-governance-scoring-v21` 334 = **2,045 lines, 11.4% of staged code.**

Phases 1 + 2 + the Phase-3 header subset remove roughly **1,200–1,250 source lines**, about a third of the nine files.

**Shipped bytes: approximately zero, and this is the part the proposal gets wrong.**

Three reasons, each verifiable:

1. **The item data is already out.** Whatever the banks weigh, they weigh it today. No format change moves that number.
2. **`with { type: "json" }` is a static import.** Moving prose from a `.ts` string literal into a `.json` file relocates bytes from one static chunk to another. The bundler still includes them.
3. **`lib/modules/versions.ts:1-31` eagerly, statically imports every definition and both runtimes.** Any client component that reaches `getModuleVersion` pulls bank v2, v3, v4, and v5 into that bundle. I found **no dynamic `import()` anywhere** in staged `lib/` or `app/`.

**The saving the proposal wants comes from lazy resolution, not from JSON.** Making `SUPPORTED_MODULE_VERSIONS` resolve frozen definitions through `await import()` — so a live questionnaire never ships bank v2/v3/v4 — is the change that cuts shipped bytes. It is orthogonal to file format and would work equally well on today's `.ts` files. **I cannot size it**: `content/instrument/*.json` are not staged, so I have no bank byte counts, and the module questionnaire route is not staged either, so I cannot confirm whether the definitions currently cross into a client bundle at all.

Anyone approving this on a bundle-size argument should be asked for a `next build` output diff before and after. I would expect it to be near-flat.

---

## 7. Verdict: cheap model with a byte-identical test, or judgment?

**Split. Roughly half of it is mechanical; the half that carries the value is not.**

**Yes — a cheap model with a byte-identical replay test:**
- **Phase 0's harness.** Well-specified, mechanical, high value.
- **Phase 6.** Two regexes.
- **Phase 5(b).** Delete two duplicated rules.

**Yes, but supervised:**
- **Phase 1.** Closest to mechanical, and a replay test genuinely gates it. Two traps: the test must assert on **outputs**, never source, because v22's copy legitimately differs from v5's; and a diff-driven agent will be strongly tempted to "helpfully" normalize those four differing copy strings, which silently rewrites frozen editorial content. The `security.ts` factory is the worked example, so the pattern is demonstrable rather than described.

**No — needs judgment:**
- **Phase 3 as proposed.** Inventing a stable key namespace, deciding what constitutes one copy unit, and preserving H5's absent-vs-undefined semantics are design decisions. A byte-identical test constrains the output but supplies none of the design.
- **Phase 2's branch-structure differences.** Thresholds parameterize; branch order and lane arity do not.
- **Phase 5(a).** "Which weight table is correct" is a product question about scoring correctness. A refactor tool will pick whichever makes the test pass, which is exactly the wrong selection criterion.

**And the framing itself needs judgment.** A cheap model handed this brief would migrate data that is already migrated, then attempt the prose extraction — the highest-risk, lowest-value phase — because that is the only work the brief actually leaves undone. It would report success. The bundle would not shrink.

**The deeper limit on "byte-identical test":** such a test proves nothing about branches the corpus never reaches. Historical payloads cluster; the extreme branches (`activism >= 5.4 && escalation >= 5.1` simultaneously, the `delta` ternary's four-way outcome) may have no real-world instances at all. **Designing the corpus for branch coverage is the judgment call, and it sits upstream of every mechanical step.** Get that wrong and the byte-identical test becomes a rubber stamp on a silent behaviour change in exactly the code the freeze exists to protect.

**Recommendation:** approve Phases 0, 1, 6 and the Phase-3 header subset (~950 lines out, low risk, reuses an existing contract). Defer Phase 2. Reject Phase 3's prose extraction. Handle Phase 5(a) as a correctness ticket, not a refactor. And correct the bundle-size claim before it is used to justify the work.

---

## 8. Not staged — could not be checked

`lib/modules/calibration.ts` (holds `standardizeModuleAxis`, `getModuleClassificationMode`, `MODULE_CALIBRATION_VERSION` — the entire scorer-v2 basis), `lib/modules/perspective-bank.ts`, `lib/modules/authoring-contract.ts`, `lib/modules/authoring-validation.ts`, `lib/option-order.ts`, `lib/url-payload.ts`, `lib/ai-governance-{schema,scoring,types,share,versions,profile-copy}.ts`, all of `content/instrument/*.json`, the module questionnaire and module-results routes, and every file under `scripts/` except `audit-public-copy.mjs` and `tests/`.

Consequences: I cannot confirm calibration output equivalence (gates Phase 1), cannot size the banks (gates any bundle claim), cannot confirm the AI-governance weight-drift question (§3), and cannot rule out unstaged importers for the exports flagged as possibly dead (§3).
