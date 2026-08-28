> **HISTORICAL, SUPERSEDED, NON-EXECUTABLE.** Preserved only for provenance. Use current runtime fixtures and review gates.

I have everything I need. Here is the report.

---

# Moving editorial copy out of TypeScript into content JSON — scoping audit

**Repo:** `/mnt/user-data/uploads/ir-worldview-app-clean` (partial, read-only)
**Date of audit:** 2026-08-22

## Headline: the brief's premise is about 40% wrong, in a way that shrinks the job

Two things I can show from the files:

1. **The migration is already half-built, and the pattern already exists.** `lib/explore-content.ts:1` reads `import exploreHubData from "@/content/explore/hub.en.json" with { type: "json" }`, and lines 116–240 are a complete load-and-validate layer (`getExploreHubContent`, `validateExploreHubContent`, `EXPLORE_HUB_SCHEMA_VERSION = 2`, a semver `contentVersion` check, `locale === "en"`). `lib/archetype-content.ts:1-2` does the same for `@/content/archetypes.json` and `@/content/archetype-evidence.json`. **Do not design a new loader.** Copy this one.

2. **`archetype-content.ts` is not a copy file at all.** Despite being 48KB, it holds **2 exported prose constants totalling 28 words**. Its other 143 template literals are validator error messages (`` `${path}.identity must be an object.` ``). The repo already knows this: `scripts/audit-public-copy.mjs:765` reads `if (fileName === "lib/archetype-content.ts") return "operational"`, while line 766 classifies `content/archetype-evidence.json` as `"editorial-source"`. Its editorial copy left for JSON already. Budgeting it as "48KB of prose to move" would waste the largest single line item in the plan.

### How I counted

All figures come from two scripts I wrote that parse each file with the TypeScript compiler API (`ts.createSourceFile`) and walk the AST — not from grep or eyeballing.

- **"Prose string"** = a `StringLiteral` or `NoSubstitutionTemplateLiteral` that is *not* an object key, *not* inside a type/interface position, *not* an import specifier, and whose cooked text has **≥3 whitespace-separated tokens** and does not look like a slug/path (`/^[a-z0-9]+([-_][a-z0-9]+)*$/`, or a leading `/`, `#`, `.`).
- **"Words"** = whitespace-separated tokens of that cooked text, summed.
- **Byte ratios** = UTF-8 byte length of cooked prose text ÷ total file bytes. Comment bytes measured via `ts.getLeadingCommentRanges`.
- **Known undercount:** the ≥3-word threshold excludes real editorial content that is 1–2 words — author names (`"Kenneth Waltz"`), book titles (`"After Hegemony"`), subtradition names (`"Offensive realism"`), UI labels (`"Strongly modeled"`). I counted these separately as capitalised 1–2-word strings containing a space: **50 in `explore-content.ts`, 29 in `result-helpers.ts`, 1 in `result-content.ts`, 0 in the other two.** Add ~80 to any "strings that move" figure.
- Interpolated templates are counted separately (count, substitution-slot count, and literal-text word count), because their prose cannot move as a plain string.

---

## Per-file table

| File | Exported shape (abbrev.) | Prose strings / words | Prose bytes as % of file | Interpolated templates | Verdict |
|---|---|---|---|---|---|
| **`lib/explore-content.ts`** (73,806B, 1,238L) | `exploreFamilies`, `issueCompares`, `exploreGaps`, `getFamilyBySlug/ByKey`, `coverageLevelLabels`, plus an already-migrated hub layer (`getExploreHubContent`, `EXPLORE_HUB_*`) | **276 / 6,911** in top-level consts (284 / 6,951 file-wide) | **67.3%** prose, 0.4% comments, 32.2% code | 21, all validator messages (78 words) | **Clean — extract first** |
| **`lib/result-content.ts`** (20,545B, 333L) | `QuickTake`, `WhyItMatters`, `IssueStance`, `BlindSpot` types; `quickTakeData`, `whyItMattersData`, `blindSpotsData`, `pressureTestQuestions`; `buildIssueStances()`; private `ISSUE_BLOCKS` | **100 / 1,994** (all in top-level consts) | **69.4%** prose, 2.0% comments, 28.6% code | **0** | **Cleanest in the repo — extract first** |
| **`lib/result-helpers.ts`** (54,581B, 1,126L) | ~40 exports: `getSubtraditionAffinity`, `getIssueAreaTilts`, `getStrongLenses`, `getKeyDrivers`, `tensionRules`, `neighborOverlapTexts`, `suggestedReadings`, `dimensionOneLiners`, `getWhyThisResult`, … | 155 / 2,569 file-wide, of which **106 / 1,480 in top-level consts** and **49 / 1,089 inside function bodies** | **32.8%** prose, 5.8% comments, 61.3% code | 35 (944 words), incl. 24 in `separationPhrases` | **Partial — third, and only the table-shaped half** |
| **`lib/narrative/foundation.ts`** (10,452B, 290L) | `FoundationNarrative*` types, `assessFoundationNarrative()`, `buildFoundationNarrative()`; private frame tables | **28 / 262** in const tables, + 4 section titles inside `buildFoundationNarrative` | **19.2%** prose, 0% comments, 80.8% code | **16 (235 words)** — the sentence templates *are* the copy | **Partial — frame tables only; leave the sentence templates** |
| **`lib/archetype-content.ts`** (48,543B, 1,663L) | 20+ types (`Claim`, `FieldState<T>`, `SourceRecord`…), `validateArchetypeContentCatalog`, `selectArchetypeContentRecord`, `getPublishedArchetypeContent`, + 2 disclosure constants | **2 / 28** in top-level consts (15 / 88 file-wide, rest are validator strings) | **1.4%** prose, 2.4% comments, **96.2%** code | 143, all validator messages (577 words) | **Leave alone** |

---

## Per-file detail

### 1. `lib/explore-content.ts` — clean, and the biggest prize

**Shape.** Two unrelated halves in one file. Lines 1–240 are the *already-migrated* Explore hub (JSON import + `ExploreHubContent` type + validator). Lines 242–1238 are the *not-yet-migrated* editorial arrays: `exploreFamilies: ExploreFamily[]` (4 records), `issueCompares: IssueCompare[]` (3 records, 12 per-family readings), `exploreGaps: ExploreGapEntry[]` (4 records), plus `getFamilyBySlug`/`getFamilyByKey`/`coverageLevelLabels`.

**Consumers** (grep across staged `app/`, `components/`, `lib/`): `app/explore/page.tsx` uses `exploreFamilies`, `exploreGaps`, `getExploreHubContent`; `app/explore/[slug]/page.tsx` uses `getFamilyBySlug`, `getFamilyByKey`, `coverageLevelLabels`. **`issueCompares` has no consumer in the staged tree** — it may be dead, or its consumer may be one of the unstaged files. Worth confirming before moving 746 words.

**Volume.** 249 prose strings / 5,583 words in `exploreFamilies` alone; 16 / 746 in `issueCompares`; 11 / 582 in `exploreGaps`. Each family record carries `tagline`, `summary`, `coreClaims`, `subtraditions`, `emphasizes`, `underweights`, `persuasiveArguments`, `issueReadings`, `neighbors`, `readings`, `advancedReadings`, `counterReadings`, `associatedThinkers`, `quizCoverage`; `modelingNote` appears on 2 of 4.

**Hazards.**
- **Computed fields — the big one.** 8 call expressions inside `exploreFamilies`: `slug: familySlug("realist")` and `name: traditionNounLabel("realist")` at lines 293/295, 456/458, 621/623, 778/780. These resolve through `lib/worldview-config.ts`, the declared single source of truth. Freezing `"slug": "realism"` / `"name": "Realism"` into JSON duplicates identifiers that `AGENTS.md` explicitly says not to duplicate ("Centralize slug definitions in one source of truth"; "Avoid duplicating worldview labels and keys across files"). `worldview-config.ts:30` even carries the comment *"These must match the slugs defined in lib/explore-content.ts exploreFamilies."* — **keep both fields computed in TS and merge them onto the JSON record at load.**
- **Four multi-paragraph template literals** (`summary:` at L297, L460, L625, L782). Each is exactly 3 paragraphs, 4 newlines, zero leading indentation on continuation lines. `app/explore/[slug]/page.tsx:130` does `family.summary.split("\n\n")` — the blank lines are **load-bearading**. In JSON they must become literal `\n\n` escapes.
- **Typography.** 136 em dashes (U+2014) and 7 en dashes (U+2013) in prose — all 105 em-dash-bearing lines are prose, 0 are comments. One `ú` (`"Raúl Prebisch (1901–1986)"`, L927). 45 straight apostrophes (`others'`, `Waltz's`) and straight single quotes used as scare quotes (`'Win-sets'` L481, `'decoupling'` L682).
- **The 224 U+2500 box-drawing characters are comment rules** (`// ── Modeled families ──`), not prose. They do not move.
- `familyKey`, `rivalFamily`, `level: "strong"|"moderate"|"partial"` are enum identifiers, not copy.

**Verdict: clean extraction candidate.** 67.3% of the file is prose payload; the only real logic in the bottom half is two 3-line lookup helpers. The top half already demonstrates the target pattern.

### 2. `lib/result-content.ts` — the cleanest file in the audit

**Shape.** Four exported data tables keyed by `FamilyKey` (`quickTakeData`, `whyItMattersData`, `blindSpotsData`, `pressureTestQuestions`), one private `ISSUE_BLOCKS`, one function `buildIssueStances(fk, sm, nm)`. Consumed by `lib/result-helpers.ts` (which re-exports the types at line 26) and `lib/narrative/foundation.ts` (imports `blindSpotsData`).

**Volume.** 100 prose strings / 1,994 words. **Zero template literals, zero computed values, zero type-position strings.** 69.4% of the file is prose bytes.

**Hazards.**
- **Leading-space clause fragments.** `ISSUE_BLOCKS[].clauses.*` values all begin with a space: `" Your restraint score suggests…"` (L135, L137, L141, …). `buildIssueStances` concatenates via `text += block.clauses?.restrainer?.[fk] ?? ""` (L254–257). A JSON formatter or a `.trim()` in the loader **silently deletes the inter-sentence space**. This is the single highest-probability mechanical failure in the whole job.
- **Mixed apostrophe styles in one file.** L54 has curly `states’ actions` (U+2019); L46 has straight `rivals' intentions`; L128 has straight `other's intentions`. Exactly 1 curly and 2 straight. Any "smart quotes" normalisation breaks byte-identity in one direction or the other.
- Conditional prose selection exists but is trivial and lives entirely in `buildIssueStances` — 4 `if` statements on `StrategyModifier`/`NormativeModifier`, no numeric thresholds.
- `rivalFamily: "institutionalist"` is an identifier.
- `"Great-power rivalry"` (L121) is duplicated in `explore-content.ts` at 5 sites.

**Verdict: clean extraction candidate, and the ideal pilot.** Smallest, no interpolation, no computed fields, no calibration numbers. Prove the toolchain here.

### 3. `lib/result-helpers.ts` — partial, and the half that looks extractable mostly isn't

**Shape.** The main results-page facade: ~40 exports spanning label helpers, `getClosestTraditions`, `getStrongLenses`, `getKeyDrivers`, `getActiveTensions`, `getSubtraditionAffinity`, `getIssueAreaTilts`, `getRunnerUpSeparation`, `getFlipAnalysis`, `getWhyThisResult`, `getComparisonDimensions`, and thin passthroughs to `result-content.ts`.

**Volume.** 155 prose strings / 2,569 words file-wide. The split matters more than the total:

| Group | Strings / words | Extractable? |
|---|---|---|
| `neighborOverlapTexts`, `suggestedReadings` | 37 / 598 | Yes — plain nested `Record`s, no functions |
| `dimensionDriverLabels`, `dimensionDriverDescriptions`, `dimensionOneLiners` | 63 / 680 | Payload only — each is `Record<DimensionKey, (score: number) => string>` wrapping a `byBand(dim, s, {high, midRange, low})` call |
| `tensionRules` | 6 / 202 | Text only — each record pairs `text` with a live `condition: (d) => boolean` and 12 numeric thresholds |
| `separationPhrases` | 0 / 0 (24 interpolated templates) | **No** — 12 arrow functions, 36 numeric literals, every string embeds `${s.toFixed(1)}` |
| Prose inside standalone functions | 49 / 1,089 | **No** — gated by score thresholds |

**Hazards.**
- **Score-gated prose.** `getSubtraditionAffinity` (L639) is a `switch` over `FamilyKey` whose branches are `if (d.restraint >= 5)`, `if (d.institutions >= 4.5)`, etc. Those literals are calibration. Encoding them as JSON predicates would move scoring constants into a file editors are invited to edit — squarely against the "no scoring/calibration changes" constraint.
- **Number formatting fused into sentences.** `separationPhrases` (L841–898): `` `Your institutions score (${s.toFixed(1)}) is relatively high…` ``. Extracting requires inventing a formatter contract, which is a behaviour change risk for zero editorial benefit.
- **Ternary inside a data literal.** `getStrongLenses` (L245–250) selects the `description` field with `orderJusticeBand === "low" ? "…" : "…"` *nested inside the object being built*.
- **Function-typed exports.** `dimensionOneLiners` is exported as `Record<DimensionKey, (score: number) => string>`. "Keep exported types identical" means these must **stay functions**; only the `{high, midRange, low}` payload moves.
- **`byBand` is not in the staged tree** (`@/lib/results/dimension-bands` is absent), so I cannot verify its band boundaries or its behaviour on ties.
- **Divergent duplicates with `explore-content.ts`.** Both files list `"The Tragedy of Great Power Politics"` / `"John Mearsheimer"` and `"Theory of International Politics"` / `"Kenneth Waltz"` — with **deliberately different notes**: `"The clearest statement of offensive realism: why major powers can never be satisfied with the status quo."` (explore) vs `"The clearest statement of offensive realism and why major powers rarely stop competing."` (helpers). 10 strings ≥12 chars are shared between the two files.

**Verdict: partial.** Take the 37 table strings and the 63 band payloads and the 6 tension texts (≈106 strings / 1,480 words, plus ~29 short labels). Leave the 49 in-function strings and all 24 `separationPhrases` templates in TypeScript.

### 4. `lib/narrative/foundation.ts` — partial; the prose *is* the logic

**Shape.** `buildFoundationNarrative()` returns `{state, summary, sections[]}` and is consumed by `app/results/[payload]/page.tsx`. Five private frame tables feed six private builder functions.

**Volume.** Only 28 prose strings / 262 words sit in the const tables (`DIMENSION_FRAMES` 14, `FAMILY_DEBATE_FRAMES` 4, `FAMILY_MEANINGS` 4, `NORMATIVE_FRAMES` 3, `STRATEGY_FRAMES` 3), plus 4 section titles inline in `buildFoundationNarrative` (L172, 176, 185, 189). The **remaining editorial content — 16 interpolated templates, 38 substitution slots, ~235 words — is sentence scaffolding inside functions.**

**Hazards.**
- **Conditional prose selection on narrative state.** `buildSummaryLine`, `buildMeaningText`, `buildWhyText`, `buildPressureTestText` each branch on `lowDifferentiation` / `sharplyDifferentiated` / fallback, returning a different template per branch.
- **Calibration numbers inline.** `assessFoundationNarrative` uses `analysis.averageDistanceFromCenter <= 1.05` (L119); `describeDimensionFrame` uses `Math.abs(score - 4) < 0.25` (L276). These must not move.
- **Dimension-identity-dependent prose.** `describeDimensionFrame` (L277–279) returns `frame.high` for `restraint`/`orderJustice` at midpoint but `frame.low` for the other five. Prose selection depends on *which* dimension it is, not only the score.
- **`joinList` (L285) hardcodes English Oxford-comma grammar** and only handles up to 3 parts.
- **`"Conditional Solidarist"` (L99) is a quoted object key**, not copy — it is a `NormativeModifier` enum value.

**Verdict: partial.** Move the 5 frame tables and the 4 section titles (~32 strings, ~282 words). **Leave every template literal.** Extracting them needs a placeholder/interpolation runtime that this codebase does not have and that `next-intl` (already a dependency, for UI strings) would be the natural home for — a much larger decision than this task.

### 5. `lib/archetype-content.ts` — leave alone

**Shape.** A validation and selection layer over two already-external JSON catalogues. 20+ exported types (`FieldState<T>`, `Claim`, `ClaimValue`, `SourceRecord`, `ReviewRecord`, `ArchetypeRichContent`, …), ~10 exported functions (`validateArchetypeContentCatalog`, `selectArchetypeContentRecord`, `getPublishedArchetypeContent`, `countArchetypeContentStatuses`, …), ~25 private validators.

**Volume.** 96.2% of the file is code. Its 2 exported prose constants are provenance disclosures:
- `LEGACY_COMPARISON_QUALIFICATION` (L14): *"This historical comparison uses provisional source metadata and remains pending research review."*
- `OWNER_AUTHORIZED_BETA_QUALIFICATION` (L17): *"Owner-authorized AI-assisted English beta copy; pending human editorial review; no external expert review; no validation claim."*

**Hazards.** These two strings are the closest thing in the five files to legal text — they are disclosure/compliance claims, and `scripts/audit-public-copy.mjs` imports `isContractedArchetypeBetaReference` from `public-copy-contracts.mjs` (unstaged), meaning their wording is under an enforced contract. `OWNER_AUTHORIZED_BETA_PUBLICATION`'s values (`"owner-authorized"`, `"pending"`, `"none"`) are enum identifiers typed `as const` and feeding `ArchetypePublicationAuthorization` — moving them to JSON would erase the literal types.

**Verdict: leave alone.** Moving 28 words would cost the type-level guarantees and touch contract-enforced disclosure text.

### 6. Explicit finding on legal/privacy text

I grepped all five files for `privacy|consent|cookie|gdpr|liability|disclaimer|terms of|copyright|licen[cs]e`. **All 5 matches are false positives** — `"terms of trade"`, `"terms of power"`, `"the rules of the global economy"`. **There is no legal or privacy copy in any of these five files.** The only compliance-adjacent strings are the two disclosure constants above.

---

## Overall recommendation

### Extraction order

**Phase 0 — no extraction, one line of config (do this first).**
`scripts/audit-public-copy.mjs:10-22` defines `scanTargets` as `["app","components","lib","content/instrument","content/current-cases","content/archetypes.json","content/archetype-evidence.json","content/explore","content/locales","messages","i18n"]`. **`content/copy` is not in that list.** Moving prose to `content/copy/en/*.json` would silently drop ~10,000 words out of the public-copy audit's coverage — the audit would keep passing while no longer checking anything. Either add `"content/copy"` to `scanTargets`, or put the files under the already-scanned `content/explore/`. Decide before writing any JSON.

**Phase 1 — `result-content.ts`.** 101 strings, ~1,994 words. No interpolation, no computed fields, no calibration numbers, one concatenation function. Smallest blast radius, proves the loader and the byte-identity harness.

**Phase 2 — `explore-content.ts` (bottom half only).** ~326 strings, ~6,911 words. Highest value (67% of a 73KB file). Reuse the hub loader already in the same file's top half. Keep `slug` and `name` computed.

**Phase 3 — `narrative/foundation.ts` frame tables + section titles.** ~32 strings, ~282 words. Small, but it unblocks editors from touching the five frame tables.

**Phase 4 — `result-helpers.ts`, table-shaped subset only.** ~135 strings, ~1,480 words: `neighborOverlapTexts`, `suggestedReadings`, the three `byBand` payload sets, `tensionRules[].text`.

**Never:** `archetype-content.ts`; `separationPhrases`; all validator error messages; the 49 threshold-gated strings inside `result-helpers.ts` functions; the 16 sentence templates in `foundation.ts`.

### How many strings move

| Phase | Prose strings (≥3 words) | + short labels (1–2 words) | Words |
|---|---|---|---|
| 1. `result-content.ts` | 100 | 1 | 1,994 |
| 2. `explore-content.ts` | 276 | 50 | 6,911 |
| 3. `narrative/foundation.ts` | 32 | 0 | 282 |
| 4. `result-helpers.ts` (subset) | 106 | 29 | 1,480 |
| **Total moved** | **514** | **80** | **≈10,667** |
| Deliberately left in TS | ~91 prose strings + ~218 validator/interpolated templates | — | ≈2,200 |

**Plan for ~590 discrete string values carrying ~10,700 words.** Phases 1–2 alone are 427 strings / 8,905 words — 83% of the value for roughly half the risk.

### The exact acceptance test

Byte-identical *rendered output* is the right goal, but a raw `next build` diff will not work: Next embeds build IDs and content hashes, and `.next/` layout is unverifiable from the staged tree. Use a two-layer test instead. Both layers must pass.

**Layer A — export-identity snapshot.** Add `scripts/snapshot-copy.mts`, run under the repo's existing loader (`node --experimental-strip-types --import ./tests/register-alias-loader.mjs`, the pattern every `validate:*` script already uses). It emits a canonical serialization, in fixed declaration order, of every affected export. The serializer must:
- preserve object key insertion order;
- distinguish `undefined` from an absent key (`modelingNote`, `advancedReadings`, `counterReadings`, `associatedThinkers` are optional on `ExploreFamily` — plain `JSON.stringify` erases the difference, and that difference is observable in `app/explore/[slug]/page.tsx`);
- serialize function-valued fields via `Function.prototype.toString()` (`tensionRules[].condition`, `dimensionOneLiners`, `dimensionDriverLabels`, `dimensionDriverDescriptions`);
- emit strings with explicit `\uXXXX` escaping for every codepoint > 127, so an em-dash → hyphen substitution cannot hide inside a UTF-8 diff.

**Layer B — evaluated-output over the frozen corpus.** Static snapshots miss everything score-gated. For each payload in the corpus already used by `npm run replay:scoring`, call every prose-producing export and append the results to the same snapshot: `buildFoundationNarrative`, `buildIssueStances`, `buildProfileTitle`, `buildSummary`, `getClosestTraditions`, `getStrongLenses`, `getKeyDrivers`, `getActiveTensions`, `getSubtraditionAffinity`, `getIssueAreaTilts`, `getRunnerUpSeparation`, `getWhatWouldChangeThis`, `getFlipAnalysis`, `getWhyThisResult`, `getComparisonDimensions`, `getWhatCouldShift`, `getQuickTake`, `getWhyItMatters`, `getBlindSpots`, `getPressureTestQuestions`. This is what proves the frozen-replay constraint held.

**The command:**

```bash
git worktree add /tmp/before HEAD          # pre-change tree
(cd /tmp/before && npm ci && node --experimental-strip-types \
   --import ./tests/register-alias-loader.mjs scripts/snapshot-copy.mts > /tmp/copy.before.txt)
node --experimental-strip-types \
   --import ./tests/register-alias-loader.mjs scripts/snapshot-copy.mts > /tmp/copy.after.txt
cmp /tmp/copy.before.txt /tmp/copy.after.txt     # MUST be byte-identical; cmp, not diff
```

**Plus, all four must hold:**
1. `cmp` exits 0.
2. `npm run typecheck` passes — this is what enforces "exported shapes and types identical". A JSON import widens literal types to `string`, so every migrated export needs an explicit type annotation or a `satisfies` clause, or `ExploreHubSectionId`-style literal unions silently degrade.
3. `npm run copy:audit:strict` produces an **identical finding set** before and after — after Phase 0 has put the new path in `scanTargets`. Note that `classifyAudience` keys off file path, so findings' `audience` field will change even when the text does not; compare on text and rule id, not the raw JSON.
4. `npm run test` and `npm run build` pass (per `AGENTS.md`).

### Warning list — what a mechanical agent will get wrong

1. **Trimming the leading space off `ISSUE_BLOCKS[].clauses.*`.** Every clause starts with `" "` and is appended with `+=`. Most JSON writers and any `.trim()` in a loader will eat it, welding two sentences together. Highest-probability failure in the job.
2. **Freezing `familySlug(...)` / `traditionNounLabel(...)` results into JSON.** 8 sites. Produces correct output *today* and violates the single-source-of-truth guardrail permanently. These fields must stay computed and be merged at load.
3. **Normalising quotes.** `result-content.ts` genuinely mixes one U+2019 (L54) with two straight apostrophes (L46, L128). Any smart-quote pass breaks byte-identity in one direction. Same risk for the 136 em dashes and 7 en dashes in `explore-content.ts` and the `ú` in `"Raúl Prebisch (1901–1986)"`.
4. **Reflowing the `summary` template literals.** Four of them, 3 paragraphs each, consumed by `.split("\n\n")` at `app/explore/[slug]/page.tsx:130`. Pretty-printing, wrapping, or converting `\n\n` to `\n` changes the rendered paragraph count.
5. **De-duplicating across files.** `"The Tragedy of Great Power Politics"` and `"Theory of International Politics"` appear in both `explore-content.ts` and `result-helpers.ts` with **intentionally different notes**; `"Great-power rivalry"` appears 6 times across two files. An agent that "helpfully" unifies them changes output.
6. **Extracting validator error messages as copy.** 143 templates in `archetype-content.ts`, 21 in `explore-content.ts` are `` `${path}.identity must be an object.` `` — operational strings that must not enter a translator-facing file. `audit-public-copy.mjs:765` already classifies that file as `"operational"`; respect it.
7. **Serialising `condition` predicates.** `tensionRules[].condition` is a live function with 12 numeric thresholds. Encoding it as a JSON expression string plus an evaluator is a scoring change wearing a content-migration costume. Split the record: `text` to JSON keyed by `key`, `condition` stays in TS, zip at load.
8. **Moving `byBand` thresholds or the `>= 5` / `>= 4.5` / `1.05` / `0.25` / `4` literals.** These are calibration. They appear in `getSubtraditionAffinity`, `getStrongLenses`, `assessFoundationNarrative`, `describeDimensionFrame`, `tensionRules`.
9. **Treating quoted object keys as copy.** `"Conditional Solidarist"` (`foundation.ts:99`) is a `NormativeModifier` enum value. So are `familyKey`, `rivalFamily`, `level: "strong"|"moderate"|"partial"`, and every `OWNER_AUTHORIZED_BETA_PUBLICATION` value.
10. **Confusing comment rules with prose.** 1,398 U+2500 box-drawing characters in `result-helpers.ts`, 273 in `result-content.ts`, 224 in `explore-content.ts` are all `// ── Section ──` separators. A naive "non-ASCII = editorial" heuristic mis-flags them.
11. **Losing optional-key absence.** `ExploreFamily` has 5 optional fields; `modelingNote` is present on only 2 of 4 records. `JSON.stringify` cannot distinguish `undefined` from missing.
12. **Widening literal types.** `EXPLORE_HUB_SECTION_ORDER`, `href: "/method"`, `locale: "en"`, `as const satisfies` clauses. JSON imports type as `string`; without re-annotation `npm run typecheck` degrades silently rather than failing.
13. **Adding a dependency.** No JSON-schema library, no i18n-interpolation library. `AGENTS.md`: *"Do not add new dependencies unless explicitly asked."* The hand-written validator in `explore-content.ts:129-240` is the sanctioned pattern.
14. **Forgetting `content/copy` is unscanned** — see Phase 0.

---

## What I could not determine

- **The `content/` directory is entirely absent** from the staged copy. I cannot see `content/explore/hub.en.json`, `content/archetypes.json`, or `content/archetype-evidence.json`, so I cannot report how much copy has already moved, what the existing JSON conventions look like (indentation, key order, `contentVersion` values), or whether a `content/copy/` tree already exists.
- **`lib/results/dimension-bands` is not staged**, so `byBand`, `dimensionBand`, `dimensionHighCut`, `dimensionLowCut`, and `OBSERVED_DIMENSION_RANGES` are unverifiable. Also missing: `lib/scoring`, `lib/scoring-calibration`, `lib/quiz-schema`.
- **`tests/` is absent**, including `tests/register-alias-loader.mjs` and whatever corpus `scripts/replay-scoring.mts` uses. I inferred both from `package.json` scripts; I could not confirm the corpus exists or how many payloads it holds.
- **`scripts/public-copy-contracts.mjs` and `scripts/code-unit-order.mjs` are absent**, so I cannot see what `isContractedArchetypeBetaReference` actually enforces on the two disclosure strings.
- **`components/` is almost entirely CSS modules** in this copy, so my consumer map is partial. `issueCompares` shows no consumer, but I cannot conclude it is dead code.
- **I could not run `npm run build`, `typecheck`, `test`, or `copy:audit`** — dependencies are not installed and required source files are missing. Every figure above comes from static AST analysis of the five files as staged.
