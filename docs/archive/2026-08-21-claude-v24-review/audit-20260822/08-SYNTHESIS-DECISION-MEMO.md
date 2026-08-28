> **HISTORICAL, SUPERSEDED, NON-EXECUTABLE.** Preserved only for provenance. Verify every claim against the current roadmap, Git state, and runtime before reuse.

# V23.5 decision memo

> **HISTORICAL AND SUPERSEDED AS EXECUTION AUTHORITY.** Preserve this reasoning snapshot. Use the canonical V23.5 master roadmap.

**Date:** 22 August 2026. **Window:** five calendar days, Saturday 22 to Wednesday 26 August, against a Codex credit that expires ~26 Aug. **Baseline:** V23.4 on `main`, live at irworldview.jhyip.com.

---

## Answers to the open questions

### 1. Does `mapbox-gl` ship on a live route, and can it be removed?

**Yes, partly, and yes.** This closes STATE.md open decision 3.

`mapbox-gl/dist/mapbox-gl.css` ships unconditionally on `/` and `/zh-Hans`. It is a static side-effect import at `components/home/world-stage/world-stage-map.tsx:3`, extracted into the route CSS bundle at build time, served whether or not a token exists and whether or not the map ever initialises. Delete that line today. It costs nothing and buys nothing.

The ~800KB JS is a real `import()` at line 797, gated on four checks: container mounted, scene non-null, `NEXT_PUBLIC_MAPBOX_TOKEN` non-empty, WebGL available. The token is inlined at build time, so it is a per-deploy constant, not a runtime switch. **Whether it is set in production could not be determined from the staged tree.** No `.env*`, no `vercel.json`. Settle it in sixty seconds: load the production homepage and search the DOM for `© Mapbox`. That attribution block renders only when `mapReady === true`, so its presence proves the library initialised and tiles are being billed.

What mapbox uniquely provides is short: globe projection, `setFog` atmosphere, drag-rotate inertia, `easeTo` camera easing, layer-scoped feature picking. Everything else is local data. All three `addSource` calls are `type: "geojson"` fed from `lib/world-stage/map-data.ts`, which statically imports `world-countries-110m.json` on every homepage load regardless of path. All seven `addLayer` calls use no `beforeId`, so they append above every basemap layer including labels, and the country fill paints `#183c5b` at 84 to 98 percent opacity over a configured land colour of `#18344f`. You are paying for tiles and then covering them.

The SVG fallback is not a stub. `WorldStageFallbackMap` is always mounted and always rendered; when mapbox succeeds it fades to `opacity: 0.08`. Tooltips, sources, reviewed-through dates, pinning, roles, contested borders, flow colours, the legend, the filters, and the entire screen-reader surface are identical on both paths. Both canvases are `aria-hidden="true"`, so mapbox contributes nothing to accessibility. The node cap of 6 and flow cap of 4 in the fallback is an authoring choice at `map-data.ts:105-106`, not a capability limit.

Option A (delete mapbox, keep the flat equirectangular SVG) is 4 to 8 hours and loses the globe. Option B (orthographic SVG globe from the same geometry) is 25 to 40 hours, and the line that can blow the estimate is per-frame path regeneration: `WORLD_STAGE_COUNTRY_PATHS` is currently computed once at module scope because the flat projection is camera-independent. Measure the feature and coordinate count of `world-countries-110m.json` before committing to B.

### 2. What is actually in `app/globals.css`?

**Not what the sprint prompt assumes.** Colour is already fully tokenised and Tailwind is doing nothing at all.

45 hex occurrences in 11,335 lines. Every one sits in the `:root` block (lines 5 to 29, 17 occurrences) or the `@media print` token override (lines 7995 to 8120, 28 occurrences). No hex value appears in an ordinary component rule. 1,358 `var()` references, 208 `color-mix()`, 29 custom properties defined, 32 referenced.

The three hexes V-0 Part 2 names as the target palette (`#0F1B2D`, `#C9A227`, `#F4F1EA`) appear **zero times** in globals.css and zero times across all five staged modules. That is correct and expected: STATE.md retires `#0a1322` and `#cea857`, which are what the code actually contains. So the palette swap really is two literal edits inside `:root`. That part is cheap.

Tailwind is 100 percent vestigial. Zero `@tailwind` directives, zero `@import "tailwindcss"`, zero `@apply`, zero `@theme`/`@config`/`@layer`. The only at-rules present are `@media` (61) and `@keyframes` (3). Zero Tailwind utility classes across the 11 staged `.tsx` files; all 14 apparent hits are false positives on names like `lobby-hero-grid` and `print-hidden`. Both packages are devDependencies. With no directives and no config, the PostCSS plugin emits nothing.

The real debt is repetition of about eight visual idioms with drifting numbers. 309 bordered-and-padded surfaces across 85 distinct padding values and 16 radii. 90 micro-labels implementing one small uppercase brass label using 13 letter-spacings and 12 font sizes. 118 distinct `font-size` values including `0.86rem` and `0.88rem`, a gap of 0.32px at a 16px root. 46 distinct spacing px values, of which the proposed 7/14/18/24/28/44/64 scale covers only 31 percent, and the three most-used values in the file (12px, 10px, 8px) are not in it. 17 radii including every integer from 1px to 10px. 26 distinct `@media` conditions. 32 duplicated focus rings that should be one `:focus-visible` rule.

Total staged CSS is 341KB across six files, and at least two more module files exist that were not staged. Component classes are 69 percent of globals.css, 1,409 rule blocks over 7,819 lines.

**One live bug.** `.ai-result-card` is declared four times at identical specificity. The unconditional rule at line 6854 (`padding: 24px 28px`) sits after the mobile override at 6637, so line 6638's `padding: 18px` is dead and the effective mobile padding comes from line 7972. This is pre-existing. Record the rendered value before anything reorders, or a "no visual regression" check will fail on something that was already broken.

### 3. Is the frozen-version JSON migration worth doing?

**The half that mattered already happened. The half the plan proposes is the wrong half.**

Every question bank is already a JSON file. Six of them, all under `content/instrument/`, all loaded through `with { type: "json" }`. Zero lines of item data live in any TypeScript module. The proposal's target path `content/frozen/<slug>.v<N>.json` versus the actual `content/instrument/<slug>.v<N>.json` is a directory rename.

The factory pattern the proposal asks for already exists and is load-bearing. `lib/modules/security.ts:87` defines `createSecurityModule(bank, calibrationVersion, actorLensCopy)` and instantiates it twice, once for live bank v5 and once for frozen bank v4 at lines 401 to 408. Freezing a version there costs 9 lines. Freezing one the old way costs 401 to 516. `security-v22.ts` shares 432 identical non-blank lines with `security.ts`, 83 percent, and the entire non-mechanical delta is five copy fields and one early return. That 516-line file could be 30 lines.

`runtime-v1.ts` versus `runtime-v2.ts` is 16 changed lines out of 236, 95 percent identical, and contains zero prose. The behavioural delta is five lines: `mode` added to the analytics object and a `classificationContext` passed into `interpret` and `summarizeLanes`. JSON is irrelevant to that pair. Leave it alone.

**Shipped bytes saved: approximately zero.** The item data is already out. `with { type: "json" }` is a static import, so moving prose from a `.ts` literal to a `.json` file relocates bytes between static chunks. And `lib/modules/versions.ts:1-31` eagerly imports every definition and both runtimes, with no dynamic `import()` anywhere in staged `lib/` or `app/`. The bundle win comes from lazy resolution of frozen definitions, which is orthogonal to file format and works equally well on today's `.ts` files. If anyone approves this work on a bundle argument, demand a `next build` output diff first.

Two things worth doing regardless. `scripts/audit-public-copy.mjs:767` classifies frozen files with a regex matching `runtime-v1` and `*-v21` but **not `security-v22`**, and line 768 matches only `.v2.json`, **not `security.v3.json` or `security.v4.json`. Three frozen artefacts are currently audited as live public copy and can fail `copy:audit:strict`**, creating pressure to edit files that must never change. And `archetypeSignatures` at `ai-governance-results-v2.ts:57-117` is byte-identical to `archetypeProfiles` at `ai-governance-scoring-v21.ts:30-90`, 61 lines each.

**One live defect found.** `getExpandedTensionCards` concatenates base and v2 tension rules and slices to 3. Two rules share exact conditions: `geopolitics >= 5 && legitimacy >= 5` fires both `compete-and-coordinate` and `sovereignty-vs-broad-legitimacy`; `militaryRole >= 5 && humanFuture >= 5` fires both `military-and-human-control` and `human-control-vs-defense-use`. Affected users see two near-identical cards in one list.

### 4. How big is the copy extraction, really?

**About 590 strings and 10,700 words, and the file the prompt names first is nearly empty of prose.**

`lib/archetype-content.ts` is 48KB and holds **two exported prose constants totalling 28 words**. Its other 143 template literals are validator error messages. It is 96.2 percent code. `scripts/audit-public-copy.mjs:765` already classifies it as `"operational"`. V-0's escape hatch says that if the diff gets large, extract `archetypes.json` and `explore.json` only. That instruction names the emptiest file in the set as one of two must-dos, and the resulting `content/copy/en/archetypes.json` would collide in meaning with the existing `content/archetypes.json` that `archetype-content.ts:1` already imports.

The real distribution: `explore-content.ts` is 67.3 percent prose bytes, 276 strings, 6,911 words. `result-content.ts` is 69.4 percent prose, 100 strings, 1,994 words, zero template literals, zero computed fields. `result-helpers.ts` is only 32.8 percent prose and splits into 106 extractable table strings and 49 threshold-gated strings inside functions that must not move. `narrative/foundation.ts` yields 32 strings from its five frame tables; its remaining 16 interpolated templates are the copy and cannot move without an interpolation runtime the codebase does not have.

The loader already exists. `lib/explore-content.ts:1` reads `import exploreHubData from "@/content/explore/hub.en.json" with { type: "json" }` and lines 116 to 240 are a complete validate-and-version layer with `EXPLORE_HUB_SCHEMA_VERSION = 2`. Copy that. Do not design a new one.

**Phase 0 blocker.** `scanTargets` in `audit-public-copy.mjs` does not include `content/copy`. Moving prose there silently drops roughly 10,000 words out of audit coverage while the audit keeps passing.

**The single highest-probability mechanical failure:** every value in `ISSUE_BLOCKS[].clauses.*` in `result-content.ts` begins with a leading space and is appended with `+=` at lines 254 to 257. Any JSON formatter or any `.trim()` in a loader welds two sentences together.

Other named hazards: eight `familySlug(...)` and `traditionNounLabel(...)` call sites inside `exploreFamilies` that must stay computed; four three-paragraph template literals consumed by `.split("\n\n")` at `app/explore/[slug]/page.tsx:130`; 136 em dashes and one `ú`; deliberately divergent duplicate reading notes across `explore-content.ts` and `result-helpers.ts` that an agent will "helpfully" unify; and literal-type widening on every JSON import.

**No legal or privacy copy exists in any of the five files.** All grep matches were "terms of trade" and "terms of power."

### 5. Do the proposed AI-slop detectors work?

**No. Ship two of seven, and the real finding is structural.**

Tested against 12 pre-labelled passages from the repo and a 134-paragraph corpus. AUC 0.667. Mean flags: 2.00 on good passages, 2.83 on bad. **At least one measure fires on 128 of 134 paragraphs, 96 percent of the corpus.** As a gate it flags everything.

M8 (em-dash and parenthetical density) is anti-correlated with quality. Balanced accuracy 0.42, worse than a coin flip. It flagged three of six good passages and two of six bad, because it penalises the definitional appositive that is the best device in the house style. M2 (proper-noun floor) flagged five of six good passages and gave credit to two bad ones for capitalising "English School" and "IR". M3's threshold of 0.35 sits on the corpus median of 0.34, and 84 percent of paragraphs have three sentences or fewer, so it computes a coefficient of variation over two observations. M4 fires on 1 percent of the corpus. M1 is 39 percent domain contamination: 188 of 485 hits are `security`, `intervention`, `competition`, `realism`, `identity` and the tradition names.

The three worst passages in the corpus each scored exactly two flags, fewer than two of the best passages scored.

**The structural finding matters more than any measure.** The worst copy does not exist as a string anywhere. It is assembled at runtime in `lib/narrative/foundation.ts` from `FAMILY_DEBATE_FRAMES` + `STRATEGY_FRAMES` + `NORMATIVE_FRAMES` concatenated at line 182, plus template literals in `buildMeaningText`, `buildWhyText`, `buildSummaryLine`, and `buildPressureTestText`. Each fragment reads acceptably alone. A sweep reading source sees fragments. A user sees the paragraph. Nothing is coming back; that copy has never been reviewed in the form the reader gets it.

The enumerable space is small. 4 family frames × 3 strategy modifiers × 3 normative modifiers = 36 paragraphs for "How this affects the reading," plus 3 states × 4 families = 12 for `buildMeaningText`, plus 3 branches each for two more builders. Roughly 54 paragraphs.

The best signal found is **instrument-as-subject**: sentences whose grammatical subject is the reading, the result, the dimension results, the strategy modifier, the model, the midpoint, or a tradition in the passive. Per 100 words, good passages ranged 0.00 to 0.95 and bad ranged 4.62 to 8.82, with no overlap. But across the full corpus it fires on 11 of 134 paragraphs, and those 11 are exactly the "product describes itself" genre, which contains defensible copy alongside the bad. **It is a router, not a gate.** It cuts review surface 12× and targets the genre the sweeps keep missing. That is what it is good for.

Also worth noting: the existing filler blocklist works. Its terms appear 2 times in 355 strings. The residue is the contrastive-antithesis construction (`not just`, `rather than`, `, not a`), 42 occurrences across 40 strings.

---

## What the red team got right

**The abort rule names the wrong prompt, and it is in the file verbatim.** Line 11 of the pack: "Stopping before V-3 is a failed sprint, because V-3 is where the percentile defect closes." Line 20 of the same file: "V-2 ... carries the percentile fix." V-3 is scrollytelling and contains no percentile work. Checkpoint B, called "the checkpoint that matters," is also placed after V-3. **Change:** renumber. Percentile work closes at V-2 and moves to day one as its own prompt. Checkpoint B moves with it.

**"Do not merge anything until Checkpoint C" makes the default outcome ship nothing.** Line 9 of the pack, restated at Checkpoint C. Combined with a five-day window and a credit expiry, the modal result is an unreviewed branch and percentiles still live. **Change:** delete the rule. Merge each green prompt.

**V-0 is five tasks with contradictory acceptance criteria in one prompt.** Content extraction, a build-time loader and validator (an architecture decision, not mechanical), a token migration, a per-site contrast audit, and a 227KB CSS audit document. Acceptance says "zero perceptible visual change" and also "every light-ground brass text use fixed." Routing brass from `#C9A227` to `#7A5F26` **is** a perceptible visual change. **Change:** split. Part 1 leaves the sprint. Part 2 stays, reduced. Part 4 becomes its own prompt with per-site before/after screenshots. Part 3 is deleted, because that audit already exists at higher quality than an in-sprint agent would produce.

**"Byte-identical output is the acceptance criterion" is unverifiable, because no such test exists.** No harness in the repo captures rendered output for diffing, and byte-identity of what (source strings or rendered HTML) is never specified. An agent will assert it and you will believe it. **Change:** write `scripts/copy-fingerprint.mjs` first, emitting a canonical serialisation of every affected export that preserves key order, distinguishes absent keys from `undefined`, serialises function-valued fields via `toString()`, and escapes every codepoint above 127. Commit the pre-change fingerprint. Thirty minutes, and it converts the task from faith to `cmp`.

**The legacy percentile branch cannot be implemented.** The evaluation §1.1 says "Keep the percentile machinery frozen for old payload rendering." Payload encoding is on the forbidden list, so there is no version discriminator. A payload from yesterday and one from tomorrow are structurally identical. This contradicts the original recommendation directly. **Change:** all payloads render bands. An old link showing "88th" is exactly the thing being removed, so that path should not be reachable.

**Third-party OG caches keep serving the old card.** X, LinkedIn, Slack, and Facebook cache scraped images for weeks. Rewriting the generator does not touch cards already in the wild. Nobody mentioned this. **Change:** bump the OG image path so new shares re-scrape.

**The share card is scheduled last and marked most droppable.** The rarity line lives on the surface seen by everyone who never clicks. The current abort ordering ships an honest result page and a dishonest share card. **Change:** the share card is part of the percentile prompt, not V-6.

**The design file is a reinfection vector, and its location is never stated.** `Sigils and Result Hero.dc.html` is declared source of truth for visual decisions and contains the rarity line. Four prompts reference "the design artifact" as if attached. **Change:** commit it to `docs/v24/design/` on day 0 with the rarity line struck out by hand.

**Sticky will fail inside an overflow container, and the sprint's own requirement is the likely cause.** `position: sticky` silently does nothing under any ancestor whose `overflow` is not `visible`, and `overflow-x: hidden` computes `overflow-y` to `auto`. The 390px no-horizontal-overflow requirement is exactly what produces `overflow-x: hidden` on a layout wrapper, and in 341KB of legacy CSS one almost certainly exists. **Change:** run a computed-style ancestor walk on `/results/[payload]` before V-3 is written. Ten minutes.

**Register two has no mobile design.** The brief specifies mobile for the hero and says nothing about the pinned graphic at 390px, where "beside" does not exist. V-6 exists to drive social traffic, which is majority mobile. **Change:** decide in writing that register two does not pin below 768px and falls back to the JS-disabled section stack that V-3 already requires. One sentence, free.

**"Fires on a freshly generated result only" is unsolvable client-side.** A reload of `/results/[payload]` is server-indistinguishable from a first visit, forcing a choice between a visible flash of the finished mark and violating "unstarted paints drawn." **Change:** make freshness server-visible. The generation navigation adds `?new=1`, stripped after mount.

**There is no visual regression testing in a sprint whose entire purpose is visual change.** Playwright is installed and ships `toHaveScreenshot()`. **Change:** capture baselines on day 0 at 390/768/1440 in both schemes.

**Nobody timed the gate.** Ten commands including `rm -rf .next`, a cold Next 16 build, two full typechecks, and CI e2e. **Change:** measure it once. If it exceeds eight minutes, define a fast inner loop and run the full gate once per prompt at the stop point.

**Checkpoint A gates the must-ship prompt behind a subjective design approval.** "Do not carry an unresolved collision into the hero." **Change:** drop the Kairos/Concert geometry change. Enforce `ARCHETYPE_MARK_MIN_PICTORIAL_SIZE = 32` and render the code below it. That also removes V-1's internal contradiction between "do not change any existing `d` value" and "adjust one or both marks."

**The Transfer Test's safety vocabulary is the lens set relabelled.** `TransferLogic` at line 162 of the AI document: `capability-and-position` is P, `binding-commitment` is R, `legitimacy-and-consent` is M, `structure-and-dependence` carries the S lens's name and the S archetype's name in one string, and the remaining two are lifted from the proposed AI axes. Line 171 asserts that a flatter vocabulary "keeps this legal and honest." §1.4 of the companion document attacks relabelled bijections as fake independence. **Change:** either strip the surface to two verbatim chosen option texts with no classifying vocabulary, no predicate over the pair, and no count, or concede this is a construct claim and pay for schema v2 with inter-rater review.

**Every mechanism producing divergence pushes toward the headline finding.** Domain-specific reasoning, knowledge load causing satisficing, differential social desirability, option wording at equal option logic, order and fatigue from taking AI second, and a v2 bank authored before the current landscape. Six confounds, all one direction, and divergence is the result. **Change:** add a per-pair knowledge self-report on the AI side so the confound is measured.

**The free-text field ships on the open web this week while §9 of the same document promises no special-category data.** The prompt also presupposes an omission, and "missed" collapses four causes: an unmodeled tradition, a modeled tradition under an unrecognised archetype name, an item-writing failure, and disagreement with the result. Reading a naming failure as a coverage gap adds archetypes when the problem is labels. **Change:** four closed-ended options with optional free text, inside the trial, behind consent.

**The lens/tradition collapse optimises for a constraint with a published expiry.** STATE.md locks eight archetypes through V25. The bijection holds only at four traditions; English School, Feminist IR, Postcolonial, and Green IR each break it. §2.3 says the transfer question is the product's real contribution, and transfer is a claim about mechanism, which is the lens and only the lens. **Change:** keep both layers, document lens as mechanism and tradition as lineage, and fix the presentational complaint by choosing one display vocabulary.

---

## What the red team got wrong

**The Tailwind cascade-layer trap does not exist.** Report 7 warns that Tailwind v4 emits into `@layer` and that unlayered legacy CSS will silently override every utility. Measured: zero directives, zero `@apply`, zero `@theme`, zero `@layer`, no config file, and zero utility classes across the staged `.tsx` files. Both packages are devDependencies. Tailwind emits nothing. Following the advice and wrapping 341KB in `@layer legacy` would be a real cascade change made to fix a problem that is not there.

**"Cut V-3" contradicts its own fixes.** The same report supplies three cheap remedies (no pinning below 768px, `?new=1` for freshness, an ancestor overflow walk) that between them retire most of what it lists as fatal. V-3 needs three written decisions and about an hour of instrumentation. Deleting a full day of the plan is a larger cut than the evidence supports.

**The archetype noun is not the same error as the rarity line.** Report 6 argues that "You are Concert" asserts membership in a partition of a population and is therefore no better licensed than "6% of respondents." It is not. The rarity line states a fact about a respondent pool that does not exist. The archetype names a position in the instrument's own space, which is exactly what a band does, and report 6 endorses bands. Followed to its conclusion the objection leaves no result page. The narrow version survives: change the verb and define the archetype in-page as a position rather than a kind. STATE.md locks the archetype as canonical identity, and this objection is not a written reason to reopen it.

**"The honest copy does not fit 390px" is over-called.** True that "high in this instrument's range" is 31 characters against 4, and true that the hero is already carrying a sigil, a 44px name, a gloss, a 2×2 map with four `nowrap` corner labels, a posture strip, and a scroll cue. But per-dimension position was never hero content. Move the bands to the dimension strip below the fold, where V-2 Part 4 already leaves the existing sections in place. The conflict is a placement decision and it costs nothing.

**One near-miss worth correcting rather than dismissing.** Report 7's contrast trap (`#7A5F26` on `#0F1B2D` is 2.87:1, worse than the 7.14:1 it replaces) is arithmetically correct and the hazard is real, but it applies only if the fix is implemented as a literal swap rather than a per-scheme token. The prompt's own numbers check out: `#C9A227` on `#F4F1EA` is 1.99:1, and `#7A5F26` on `#F4F1EA` is 5.33:1. What nobody has done is count the sites. Given that every hex in globals.css lives in `:root` or the print override, and the print block already routes accent to `#222222`, the light-ground brass set may be close to empty until V-0 Part 2 introduces the light scheme that creates it. Enumerate the target set before running the prompt. Five minutes decides whether Part 4 is an hour or a day.

---

## Revised plan

Five days, part time, roughly 20 available hours against 60 to 100 hours of original scope. Everything below is sized to fit. Merge each green prompt to `main` behind a Vercel preview check.

**Day 0 work, first two hours of Saturday. Instrumentation and written decisions before any agent runs.**

- Time the gate once. Define a fast inner loop if it exceeds eight minutes.
- Capture Playwright `toHaveScreenshot()` baselines at 390/768/1440, both schemes, on the result, explore, and home routes. One hour.
- Run a computed-style ancestor walk on `/results/[payload]` and report every non-`visible` overflow.
- Commit `Sigils and Result Hero.dc.html` to `docs/v24/design/` with the rarity line struck out.
- Fix `audit-public-copy.mjs:767-770`: add `-v22` to the frozen file regex, add `.v3` and `.v4` to the bank regex. Add `"content/copy"` to `scanTargets` on the current tree and resolve whatever `copy:audit:strict` flags as its own commit.
- Delete `import "mapbox-gl/dist/mapbox-gl.css"` from `world-stage-map.tsx:3`.
- Open the production homepage and search the DOM for `© Mapbox`. Record the answer in STATE.md.
- Write three decisions down: register two does not pin below 768px; freshness is `?new=1`; all payloads render bands with no legacy percentile path.

**Day 1 (Sat). Prompt V-P, new, first, merged.** Percentile and rarity removal across all seven surfaces in one prompt: the result hero, the dimension tables below it, `app/results/[payload]/opengraph-image.tsx`, `app/cases/[slug]/opengraph-image.tsx`, the committed design file, the prose paraphrases ("rarer than," "most people," "only one in six"), and a permanent `copy:audit:strict` rule so it cannot return. Bump the OG image path to force re-scrape. Keep `lib/percentiles.ts` only because tests reference it. Half a day, merged the same day.

**Day 2 (Sun). Tokens, then sigils.** V-0 Part 2 reduced: define the token set, replace `#0a1322` and `#cea857`, add the `--mark-anchor` lint assertion, add the spacing and type tokens. Then V-1 with the Kairos/Concert geometry change dropped and `ARCHETYPE_MARK_MIN_PICTORIAL_SIZE = 32` enforced instead. Checkpoint A becomes informational. Merge both.

**Day 3 (Mon). V-2, the hero.** Now a pure layout prompt, because the percentile work is already merged. Bands live in the dimension strip, not the hero. Screenshot diff against day 0 baselines.

**Day 4 (Tue). V-3, scroll registers.** Runs against the three pre-made decisions and the overflow report. Add one Playwright test with a `PerformanceObserver` on `layout-shift` and a hard threshold, or delete the CLS requirement from the gate. Twenty minutes on a real iPhone against the Vercel preview.

**Day 5 (Wed). Ninety minutes of owner copy, then V-6 visual, then stop.** The authorial note slot, the Advanced/analyst label, and the new band copy are owner-only and currently have no scheduled time. V-6 is now visual regeneration only, since the rarity line left on day one.

**Cut, and why:**

- **V-0 Part 1, content extraction.** 590 strings, 10,700 words, 14 named mechanical failure modes, no verification harness in the repo, and a guaranteed day-one deadlock against the auditor. The claimed dependency is asserted, not real: V-2 through V-6 rewrite components, not prose. Next quarter, with the fingerprint test written first.
- **V-0 Part 3, the CSS audit document.** The deliverable already exists, with verified line spans, a 19-file mechanical split, and a byte-identical concatenation gate. Do not pay an agent to produce a worse version.
- **The mapbox audit at Checkpoint C.** Same reason. Already done.
- **The Kairos/Concert geometry change.** The only subjective approval on the critical path.
- **`animation-timeline: view()` as a progressive enhancement.** Two systems driving one custom property means writing the state machine twice.
- **V-4 and V-5.** Explore and homepage absorb the overrun that will happen. They are also the surfaces most likely to be rebuilt again once the AI module's shape is settled.
- **Mapbox Option B.** 25 to 40 hours. Not sprint work.

---

## Decisions the owner has to make

**1. Legacy payload rendering.** Options: keep a frozen percentile path for old payloads, or render bands for everything. **Render bands for everything.** There is no version discriminator and payload encoding is forbidden, so the frozen path is not implementable, and an old link showing "88th" is the exact thing being removed.

**2. Who owns the band cuts in `lib/results/dimension-bands.ts`, and does the definition get versioned.** Options: version the cut definition like a bank, ship it unversioned, or make within-respondent ordering the primary display with magnitude secondary. **Version it and put the referent inside the rendered string.** "High for this instrument" in the text, never a bare "HIGH" with a footnote, because the footnote lost that argument once already.

**3. Does register two pin below 768px.** Options: pin with a mobile design nobody has drawn, or fall back to the section stack V-3 already builds. **Fall back below 768px.** The flagship interaction has no mobile design and social traffic is majority mobile.

**4. How freshness is signalled.** Options: client-only detection, or a server-visible `?new=1` stripped after mount. **`?new=1`.** Client-only forces a choice between a visible flash of the finished mark and violating the rule that an unstarted mark paints drawn.

**5. Mapbox.** Options: A, delete it and keep the flat SVG, 4 to 8 hours. B, build an orthographic SVG globe, 25 to 40 hours. C, keep it. **Delete the CSS import today regardless, then take A now and reassess B next quarter.** The globe is the only thing mapbox uniquely gives a product whose homepage argument is the world as a contested whole, but B is not sprint work and its cost hinges on a geometry measurement nobody has taken.

**6. Content extraction: this quarter or next, and where the JSON lives.** Options: `content/copy/en/` plus extended scan roots, or `content/explore/` which is already scanned. **Next quarter, under `content/copy/en/`, with `scanTargets` extended on the current tree first as its own commit.** Extending the scan roots inside the extraction prompt is what deadlocks day one, because the auditor then flags pre-existing prose that the same prompt forbids changing.

**7. Transfer Test shape.** Options: ship as designed against `TransferLogic`, strip to two verbatim option texts with no vocabulary and no count, or pay for schema v2 with inter-rater review. **Strip to verbatim this quarter.** The current design has the cost structure of the cheap option and the claim structure of the expensive one, and it will be caught by the first reviewer who reads both documents in one sitting.

**8. Transfer Test against AI bank v2 or v3.** This is STATE.md open decision 4, current lean v2. **Wait for v3, or state the stale-bank confound on the surface itself.** A v2 bank authored before the current fault lines is one of six mechanisms that all push divergence in the direction of the headline finding.

**9. The six-axis AI bank.** Options: author 42 items against six axes, or write the discriminant hypotheses first and pre-commit to a collapse rule. **Write the discriminant hypotheses for (axis 1, axis 5) and (axes 2, 3, 6) first, author two adversarial items per suspect pair, and pre-register the collapse to four axes.** Once 42 items exist the collapse becomes relitigable, and the jurisdiction cap has not been checked against axis 2, which is substantially a US federalism dispute.

**10. The free-text field.** Options: open web this week as scoped, or four closed-ended causes plus optional free text inside the consented trial. **Closed-ended, inside the trial.** §1.5 and §9 of the same document contradict each other and §1.5 ships first, and an unweighted convenience sample entering a formal expansion gate will look like evidence in the release-decision record.

**11. Tailwind.** Options: remove both devDependencies, adopt it properly with `@import "tailwindcss"` and a `@theme` block, or leave it. **Remove it.** It emits nothing, and it has already cost one audit's framing and one red team objection based on a cascade that does not exist.

**12. Slop detection.** Options: ship M1 through M8 as specified, ship the instrument-as-subject router plus fixture review, or do nothing. **Router plus fixture review.** The measures as specified fire on 96 percent of the corpus, and the worst copy in the repository is roughly 54 runtime-assembled paragraphs from `lib/narrative/foundation.ts` that no sweep has ever seen in the form a reader gets. Render them to a fixture and read them. That is an afternoon.
