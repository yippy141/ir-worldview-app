# Whole-product review, 12 September 2026

Reviewer: Claude Fable 5.1, working inside the repository at `9fde9f3` (main after PR #58).
Scope: every public route family, all four live question banks, the data path, the globe and mark code, navigation, naming, repository state, and the workflow that produced them.
What this is not: a live-browser audit of every page state. I rendered the root, AI hub, Focus Areas, and Explore in a browser; everything else is read from source.

---

## 0. The diagnosis in eight sentences

The product reads as machine-made for one main reason: it narrates itself. Almost every page explains what it is, what it is not, where it is stored, and what it does not claim, before or instead of giving the reader something. That habit is not a writing tic you can fix with a word list. It is baked into the data model (`doesNotClaim` fields, "separate record" chapters, qualification strings on every archetype sentence) and into the briefs that asked for "honest boundaries" on every surface. Second, one page template is reused everywhere, down to identical three-column headings on the AI hub and the Focus Areas hub. Third, the product has two different information architectures, three things called "Atlas", and three names for the Foundation questionnaire. Fourth, the experience has no moment of arrival: no completion reveal, a static globe, six AI marks that share one motif. The methodology is more defensible than the writing suggests, but four AI reverse-coded pairs are not opposites, four of the six Standard AI scenarios use the exact intensity-ladder structure your own AGENTS.md forbids, and thirty-one option texts across Foundation and Technology open with a phrase that tells the reader which answer is the clever one.

The good news: the engineering underneath is sound (709 unit tests pass, lint is clean, versioned banks and decoders work), the geography and scene data you need for the globe already exist in the repo, the completion handoffs the reveal needs already exist, and the copy-audit tool already flags 692 of the problems. Nobody has been asked to fix them page by page. That is the job.

---

## 1. Evidence boundary

| Checked | How |
| --- | --- |
| 70 page routes under `app/` | Listed and classified; read the page files for every hub, result, and reference family |
| All four live banks: `foundation.v2` (68 items), `ai-governance.v3` (37), `security.v5` (23), `technology.v3` (15) | Dumped every stem, option, and clarification to text and read them all |
| Writing patterns | Ran the existing `npm run copy:audit` (692 advisory findings) and my own 70-pattern sweep over `app`, `components`, `lib`, `content`, `messages` (English sources only) |
| Data path | Read `lib/db.ts`, `lib/analytics/adapter.ts`, all `app/api/*` routes, `db/migrations/*`, the Tier 1 activation record, and the V19 measurement doc |
| Globe and marks | Read `lib/root/orthographic.ts`, `components/home/root/root-home.tsx`, `lib/world-stage/*`, `lib/archetype-marks.ts`, `components/results/ai-archetype-mark.tsx`, the completion handoffs |
| Navigation | Read `components/layout/site-chrome.tsx`, `lib/quiz-chrome.ts`, `content/root.ts`, and grepped every deep page for parent links |
| Repository | `gh repo view` (public, 0 forks, no LICENSE file), open PRs, `npm audit --omit=dev`, lint, typecheck, full unit suite |
| Live site | Screenshots of `/`, `/ai`, `/modules`, `/explore` at irworldview.jhyip.com |

Not checked: Playwright e2e (not run), the Chinese copy in depth, the three Current Case JSON records, the Vercel production SHA.

---

## 2. Why it reads as AI-made: four causes, ranked

### Cause 1. The product narrates its own compliance

Examples, all reader-facing:

- Foundation result, chapter 02 (`components/results/foundation-result-story.tsx`): "This calculation uses the calibration registered for the exact completed form. It does not treat distance from the raw scale midpoint as classification evidence."
- Foundation result, chapter 04: "Shared, legacy, deleted, and tuple-mismatched records remain unavailable."
- Foundation result, chapter 05 is titled "Domain inventories remain separate records."
- AI result (`app/ai/results/[payload]/page.tsx`): "The saved name is preserved. These rounded coordinates do not reproduce it as a leading model score; use the positions below as the supported reading." And: "Each term is the recorded axis position minus 4, multiplied by the difference between these two frozen model weights."
- Explore hub (`content/explore/hub.en.json`): "The inventory uses a deliberate hierarchy so that supporting evidence never competes with the Foundation result."
- Futures hub (`app/futures/page.tsx`): "English editorial draft · 19 catalogue entries" and "Earlier unsupported current-development and community-attribution claims remain withheld."
- Every archetype sentence in `content/archetypes.json` carries the qualification "Owner-authorized AI-assisted English beta copy; pending human editorial review; no external expert review; no validation claim."
- The AI hub and the Focus Areas hub both have a literal heading "What it does not claim" (`app/ai/page.tsx:60`, `app/modules/page.tsx:117`), and the module definitions carry a `doesNotClaim` array that renders on every card.

A reader does not need to know about calibration registration, tuple mismatches, or frozen weights. Those sentences exist because a brief asked for them. They should live in Method, once.

### Cause 2. One template for every page

The pattern: kicker → serif h1 → muted lead → three-column "signal list" → sections → "resource list" of onward links. `/ai` and `/modules` share the exact three headings "What it covers / How long it takes / What it does not claim". Result pages share verdict → "positions furthest from the midpoint" → nearest alternative → "what would change this" → bridge → Futures invitation. The Field Guide uses §1 to §7 numbered sections with a rail. Nothing is wrong with any single instance. The sameness is what reads as generated.

### Cause 3. Vocabulary

Counts from my sweep over English public-copy sources (JSON scoring keys excluded where I could):

| Pattern | Hits | Where it concentrates |
| --- | --- | --- |
| "rather than" | 204 | `lib/explore-content.ts` (22), `lib/atlas-lite.ts` (11), AI atlas content (9), reading lists (8) |
| "lens / lenses" | 248 | archetype matrix, explore hub, modules copy, field guide |
| "baseline" | 364 | profile helpers (39), perspectives, cross-module synthesis |
| "posture" | 188 | posture strip, archetypes, field matrix |
| "durable" | 100 | inside question text (Foundation, AI gp1), atlas content, explore, method |
| "does not claim / imply / mean…" | 97 | everywhere |
| "not just / only / merely" | 57 | explore content, banks |
| em dashes | 55 | despite the hard rule in CONSTITUTION |
| "sharpen(s)" | 23 | atlas-lite, module copy, narrative |
| "The real / deeper / sharper / first / decisive question is…" inside answer options | 31 | 21 in `foundation.v2.json`, 10 in `technology.v3.json` |
| "This is not asking…" inside clarifications | 21 | `ai-governance.v3.json` (every Likert item) |
| "Accepted cost:" as a fixed suffix | 92 | every option of every Security card |

Internal objects used as sentence subjects: "issue read", "domain record", "saved layers", "Foundation read", "registered matrix", "the live scorer". These are the words of the person who built it, not the person using it.

### Cause 4. Two information architectures

- The root menu (`content/root.ts`) says: Inventory · World Stage · Atlas · Perspective Runs · Profile.
- The header (`components/layout/site-chrome.tsx`) says: Cases · Foundation · Focus Areas · AI Governance · My Profile, plus a "More" menu with Perspective Runs, Worldview Map, Explore, Futures, Methods, Privacy, References, Corrections and contact.
- "Atlas" means three things: the root "Atlas" item goes to `/explore`; `/explore/atlas` is the Worldview Map; `/ai/atlas` is the six AI approaches.
- The Foundation questionnaire is "Inventory" on the root, "Foundation" in the header, and "Foundation Questionnaire" in the quiz chrome. The AI questionnaire is "AI Governance", "AI Governance Compass", "the AI Compass", and "AI Questionnaire" depending on the button.
- Deep pages with no parent link in the page file: `/explore/reference/[id]`, `/explore/atlas/[id]`, `/cases/[slug]`, `/decisions/[slug]` (Futures scenario pages do have "All futures").

---

## 3. Route-by-route findings

Status key: **rewrite** (prose and structure), **trim** (remove sections), **fix** (defect), **fine** (leave), **delete**.

| Route | Finding | Action |
| --- | --- | --- |
| `/` | Static globe with decorative rings that jump on hover. Menu labels do not match the header. "Inventory" explanation is decent prose but uses "domain inventories", "separate records". | rewrite labels; globe is its own task (§6) |
| `/quiz`, `/quiz/review` | Copy is mostly bank clarifications. Public default is the 14-item core form; the 12 US-specific validation items only appear in the saved "full extension" form, and a "baseline extension" without them already exists. Options are shuffled per draft (`lib/option-order.ts`). | fine structurally; bank text in §4 |
| `/results/[payload]` | Seven chapters. 01, 03, 06 are for the reader. 02, 04, 05, 07 narrate the system. | trim to four chapters; rewrite 02 (Appendix A) |
| `/ai` | Template page; "Compass"; three-up "does not claim"; route grid duplicates the CTA; eight-link resource list. | rewrite (Appendix A) |
| `/ai/quiz`, `/ai/review` | Every Likert item carries "This is not asking…". Four of six Standard scenarios are three-step intensity ladders. | bank changes in §4 |
| `/ai/results/[payload]` | "The saved name is preserved…", the "minus 4, multiplied by" sentence, tie-handling copy in the hero. The midpoint section is now honestly titled ("Positions furthest from the midpoint"), so Astra's "What is doing the work" objection is already addressed. | rewrite hero and figure notes |
| `/ai/atlas`, `/ai/atlas/[id]` | Content is substantive. "durable" 6, "rather than" 9, "lean" 6 in `lib/ai-governance-atlas-content.ts`. Label "Atlas" collides. | rename label; vocabulary pass |
| `/ai/field-guide` | Stale. Three hardcoded future vignettes beside a 19-entry catalogue; "The translation is uneven on purpose"; "real instruments matter more than rhetoric"; "Compass" five times; the security-dilemma sentence in the cross-read is a textbook gloss with no source. | rewrite substantively (§8) |
| `/modules` | Template page; "Add a focused issue read beside the Foundation"; "How to read this layer"; ten planned modules occupy more space than the two live ones. | rewrite (Appendix A); delete planned block |
| `/modules/[slug]`, `…/results/[payload]` | Result copy in `lib/results/module-interpretation.ts` opens adjacent records with the same "The strongest objection is…" (the audit flags this). No mark. | vary openings; add domain marks (§7) |
| `/perspectives` | "Advise from a different seat." is the best hub sentence in the product. Keep. Minor "baseline" density. | fine |
| `/profile`, `/profile/share` | "Saved Foundation read", "Separate domain records", "does not infer a replacement reading". | rewrite labels |
| `/explore` | Nine sections, most are link lists. The hero and the "how-labels-fit" section are system narration. | trim to four sections |
| `/explore/[slug]` | `lib/explore-content.ts` is 1,238 lines: "shape" 33, "rather than" 22, "modeled" 12, "framework" 11, "not just" 7, "genuinely" 7. Heaviest single prose file. | vocabulary and paragraph rewrite |
| `/explore/reference` | Four entries (Mearsheimer, Keohane, Wendt, Strange). The introductions in `content/reading/reference-introductions.ts` are good writing. The page title promises "public positions" and delivers four thinkers. | retitle "Four thinkers" until there are more; keep the prose |
| `/explore/atlas` | `lib/atlas-lite.ts` has the most audit findings (62). Decision Pattern names ("Several Lenses", "Power with Limits") are fine; the rules read well. | vocabulary pass |
| `/archetypes`, `/archetypes/[slug]` | Every record repeats "provisional" and "reviewed" status. `archetype-evidence.json` has "provisional" 42 times. | move status to one line at the foot |
| `/cases`, `/cases/[slug]` | Archive page is clean. Case detail has no parent link in the page file. Three cases. | add parent link |
| `/decisions`, `/decisions/[slug]` | Minimal and clear. Detail has no parent link. | add parent link |
| `/futures/*` | Dense one-paragraph headers; status labels ("English editorial draft") and withheld-claim sentences on the public page. | trim status text to the source section |
| `/world-stage` | Full Mapbox globe with scene ledger and roles. Requires a token. | keep; reuse its scene model for `/` |
| `/method` | 97 pattern hits; links to GitHub docs at `app/method/page.tsx:442` (breaks if the repo goes private). | rewrite; move link |
| `/about` | Thin and abstract ("locating your judgments across recurring international-relations tradeoffs"). | rewrite as the one page where you say who made this |
| `/privacy` | Necessary and mostly clear. "app-owned persistent IP records" is jargon. | light edit |
| `/feedback` | "The site does not accept general product submissions" is odd. | light edit |
| `/references` | Real bibliography with useful notes. | fine |
| `/learn` | Leftover starter-template text ("This starter keeps the quiz logic in a small schema file"). Dev-only, but dead. | delete |
| `/beta`, `/compare` | Not reviewed in depth. | review in the sweep |
| Chinese routes | Root, quiz, results, profile, cases, Worldview Map, thinkers, method, about, privacy, feedback, world-stage. AI, Focus Areas, Perspectives, Futures, Decisions, archetypes are English-only. | launch English-first and say so on the language switch |

---

## 4. Every question bank, reviewed

### Foundation v2 (68 items; public default is the 14-item core)

What works: single-clause Likert propositions with a one-line clarification; four-option tradeoffs and mini-cases where each option is a different logic, not a different intensity; options shuffled per draft.

What does not:

1. **Ranking openers inside options.** 21 options begin "The real question is…", "The deeper contest is…", "The sharper problem is…", "The first test is…", "The decisive issue is…", "The critical question is…". These tell the reader which answer sounds most sophisticated, which is the exact thing AGENTS.md forbids in clarifications. Strip the opener; keep the claim. Example in Appendix A.
2. **Clarifications restate the stem.** "Major-power peace remains fragile when the balance of power is shifting." → "Does a shift in power make a peaceful relationship harder to maintain?" That is the same sentence as a question. A clarification should add scope or define a term, or not exist.
3. **"durable" appears in three stems** (`v21_sc_rev_01`, `tradeoff_strategy`, `tradeoff_alliances`). Fine once; it is now a house word.
4. The 12 `val_*` items ("The United States should take all steps including the use of force…") are correctly out of the public core form. Keep them out. If you want the Wittkopf comparison for research, that is a Tier 2 study, not a public form.

### AI Governance v3 (28 Likert + 9 scenarios)

1. **Four reverse-coded pairs are not opposites.** The scorer averages the forward item with `8 − reverse` (`lib/ai-governance-scoring-v21.ts:121`). That only works when the two statements are contradictory. They are not:
   - gp1 "rivalry is a durable feature" vs gp2 "coordination should outrank advantage": a person can agree with both. Score: 4, same as disagreeing with both.
   - ov1 "mandatory external oversight" vs ov2 "governments lack competence": wanting oversight while doubting current capacity is a common, specific position. Score: midpoint.
   - hf1 "preserve meaningful human control" vs hf2 "leave room for radical transformation": compatible.
   - mr1 "bounded military use with human control" vs mr2 "routine use erodes restraint, so restraint should be default": compatible.
   rh, dp, op pairs are close enough to opposites to keep.
2. **Four of six Standard scenarios are intensity ladders.** `capabilityThreshold` (pause / contain / continue), `rivalBreakthrough` (stabilize / hedge / accelerate), `openWeights` (closed / instrumented / open), `militaryIntegration` (keep out / bounded / integrate). Option B will attract the median reader. The Advanced four-option scenarios (`auditIncidentRegime`, `computeGovernance`, `criticalInfrastructure`) are distinct logics and are better. `multilateralVerification` and `futureSociety` are fine.
3. **Every Likert clarification has a "This is not asking…" line.** Twenty-one of them. Keep the two or three that change scope (dp1, mr1, hf3); delete the rest.
4. **Clamp order.** Scenario increments clamp to [1, 7] after each update (`lines 216, 230`). Near the boundary, the order of scenarios changes the result. Apply all increments, then clamp once.
5. House words inside stems: "durable feature of the landscape" (gp1), "meaningful" three times.

### Security v5 (23 cases, four options each)

1. **"Accepted cost:" is appended to all 92 options.** The costs themselves are the best-written part of the bank. The fixed label is what reads as generated. Write the cost into the option as a second sentence with no label, or put it under a per-option disclosure.
2. **`gray_zone_sabotage` is tagged `explanation` but its options are policies** ("Publish a threshold…", "Create a joint attribution cell…", "Prioritize repair…"). A reader who believes the rival is testing resolve and still recommends repair cannot say so. Split it into one explanation card and one decision card, or retag it.
3. Explanation cards that ask "which mechanism" (`ceasefire_accountability`, `taiwan_inspection_regime_core`, `iran_ceasefire_core`, `ukraine_ceasefire_stall`) are the strongest items in the whole product. The "Accepted cost" formula had to be contorted for them ("Prioritizing this mechanism can overstate…"). Dropping the label fixes that too.
4. The scenes are good: named forum, named decision, terms defined inline. Keep them.

### Technology v3 (15 cases)

1. Ten ranking openers ("The stronger model is…", "The better answer is…", "The practical answer is…", "The strongest path is…"). Strip them.
2. Otherwise the options are four distinct logics (national control, allied sharing, capacity building, market skepticism). A pattern-reader will learn the four lanes after three cards; shuffling helps, and the lane labels should never appear on the question screen.

### What to version

Old payloads must still decode. The copy fixes (openers, clarifications, cost labels) are copy versions with the same scoring. The AI pair rewrite, ladder replacement, and clamp change are a new bank and scorer (v4 / scorer 2). Proposed wording is in Appendix C.

---

## 5. Data collection: what exists, what it can tell you

**Supabase was never built.** It appears only in July planning documents under `docs/v13/`. There is no Supabase code, key, or table. Neon is the only database, reached through `lib/db.ts` with a three-second timeout.

Three layers exist today:

| Layer | What it sends | Where | Status |
| --- | --- | --- | --- |
| Vercel Web Analytics custom events | 11 named events (case viewed, foundation started, profile viewed…) with coarse route, device, referrer category, return-age bucket. No pageviews, no answers, browser opt-out. | Vercel, via `/api/analytics/event` | On when the provider is configured |
| Tier 1 aggregate counters | On Foundation result generation: per-dimension score buckets, the label combination, per-item response-latency buckets, and completion step reached. Counts only, keyed by instrument version, form, and locale. No answers, no identifiers, no timestamps. Percentiles are suppressed below n=100. | Neon, four `agg_*` tables, via `/api/aggregate/result` | Off unless `TIER1_AGGREGATES_ENABLED=true`. Per the activation record it was enabled only on the Vercel Preview environment on 5 August. Production is presumably off. |
| Tier 2 respondent-level research | Tables exist from migration 002 (`research_respondents`, `research_sessions`, `research_answers`, `research_derived_results`). | Neon | Dormant. `/api/research/submit` returns "unavailable". No consent flow exists. |

**What Tier 1 can answer:** where people drop off (step counters), what results people get by form and language (label counts), whether any dimension distribution is lopsided (bucket counts), which items take longest (latency buckets). That is what you need to run the product.

**What Tier 1 cannot answer:** whether the same people who scored high on rivalry also chose Strategic Competitor (no linkage), whether an item discriminates (no answer-level data), anything about individuals. Astra is right about this.

**One cheap addition that would make Tier 1 useful for instrument work:** a fifth counter, `agg_option_counts (instrument, form, locale, item_id, option_id, count)`. Aggregate, no identifiers, same privacy posture. It would tell you directly whether the AI ladder scenarios pull answers to the middle option, and whether any Security card has an option nobody picks. That is instrument evidence you can collect at launch without a consent flow.

**Recommendation:** turn Tier 1 on in production at launch (it is gated, tested, and already described on the Privacy page), add the option counter, and leave Tier 2 dormant until you have one written research question and a consent page. Remove Supabase from your mental model entirely.

---

## 6. The globe

### What exists

- `lib/root/orthographic.ts` projects the checked-in Natural Earth 1:110m countries (`lib/world-stage/data/world-countries-110m.json`, public domain, 177 features) into one aggregate land path on the server. It cannot color countries and does not rotate.
- `/world-stage` already has the thing you described in a heavier form: a Mapbox globe, a scene ledger in `research/world-stage/scene-ledger.json` with per-country roles (focus, partner, competitor, hedging, exposed, contested), sources per role, and a palette in `lib/world-stage/map-config.ts` (focus gold, partner blue, competitor red, hedging amber). It rotates at 240 s per revolution and changes scene every 8 s. It needs a Mapbox token.

Your blue / red / yellow instinct is already the World Stage grammar: partner, competitor, hedging. The home globe should be that country layer, without nodes and flows, rendered without Mapbox.

### The idea that makes it yours

Make every scene a question, and print the question as the caption. This is the product's thesis, on the front door: the same countries look different depending on what you ask.

- "Who is bound by treaty to defend whom?" NATO in blue, US Pacific treaty allies in amber, the United States gold.
- "Who trades most with China?" China gold; countries whose largest goods trading partner is China in blue (UN Comtrade, dated). This is where China turns from red to gold legitimately.
- "Who is in RCEP?" Japan, Korea, Australia, China, ASEAN share one color. Same countries as the security scene, different question.
- "Who is in the EU, and who is in NATO but not the EU?" EU blue, NATO-only amber.
- "Who voted to condemn the invasion of Ukraine, and who abstained?" UNGA ES-11/1, 2 March 2022. Abstentions in amber are the hedgers you wanted to show, with a source and a date instead of a mood.
- "Who has signed a Belt and Road memorandum?" (dated list).
- "Who is in BRICS, and who is a partner country?" members blue, partners amber.
- "Who has ratified the African Continental Free Trade Area?" signed amber, ratified blue.
- "Who is in the Arab League, and who is in the Gulf Cooperation Council?"
- "Who is in SAARC? Who is in IORA?" South Asia and the Indian Ocean.
- "Who is in Mercosur? Who is in the Pacific Alliance?"
- "Who is in the Pacific Islands Forum?" Small islands drawn deliberately large enough to see.
- "Who has ratified the Treaty on the Prohibition of Nuclear Weapons?" A clean global split with an official UN list.

Twelve to fourteen scenes, one region always visible, every fill traceable to a membership list with a date. What I would not do, and here I agree with Astra: color Canada or the EU yellow to mean "growing wariness of the United States". A fill on a map reads as fact. The abstention scene gives you the same visual story with a source.

### Motion

Starting values to tune by eye: one revolution in 120 to 150 s; scene dwell 10 s; 1 s crossfade; the scene clock aligned so the scene's region is facing the viewer; the caption changes 400 ms before the fills do. No rings, no orbits, no camera moves on hover or focus. Pause/Play beside the globe controls both rotation and scene changes. Reduced motion: one static scene with manual next/previous. Offscreen: stop the animation frame.

### Implementation note

The current server-side projection has no proper horizon clipping, so polygons that cross the limb will tear when rotating. The clean path is `d3-geo` (about 30 KB minified, no other dependencies) for `geoOrthographic`, `geoPath`, and clipping, drawing to a Canvas at 30 fps with the existing static SVG as the no-JS fallback. AGENTS.md says no new dependencies unless asked, so this needs your yes. It is the one dependency worth adding.

The scene data record should reuse the World Stage shape: id, question caption, as-of date, groups (color, meaning, ISO3 list), sources. Validate at build time that every ISO3 exists in the geometry file.

---

## 7. The result reveal and the marks

### What exists

- No completion animation on any path. The only motion is a 150 ms question fade.
- The one-use handoffs already exist: `lib/results/fresh-foundation-result.ts` (`markFreshFoundationResult` / `consumeFreshFoundationResult`) and `lib/results/ai-completion-evidence.ts` (`handoffAiCompletion` / `takeAiCompletion`). Modules have no handoff; `lib/modules/continuation.ts` is about next-step links.
- Foundation: eight System A marks in `lib/archetype-marks.ts`, a mix of stroked and filled shapes. AI: six stroke-only marks in `components/results/ai-archetype-mark.tsx`. Modules: no mark at all.

### The reveal, specified

1. The page arrives complete. Name and first paragraph are readable at t=0. Nothing fades in from opacity 0.
2. 0.2 s to 1.6 s: the mark draws itself. Stroked paths use `stroke-dasharray` / `stroke-dashoffset` in an authored order with a 120 ms stagger. Filled shapes (Foundation P− and others) reveal through a growing `clipPath` circle. Compound paths are split into drawable segments in the mark definition, not at runtime.
3. 1.6 s to 2.0 s: the brass rule under the title extends from zero; the reading code's letter-spacing settles from wide to normal.
4. End state is pixel-identical to a direct load.
5. Reduced motion, no JS, print, shared links, reloads, browser Back: final state immediately. A small "Replay" control in the hero, hidden in print.
6. Same duration and care for every result. Cautious results do not look weak; mixed results do not look unfinished. A Foundation blend draws both marks in the existing blend composition.

For a Civilization feel without Civilization assets: dark field, brass line drawing itself, the name typeset in Spectral settling into place. That is enough. No "analysing" delay, no counters climbing, no confetti.

Per-family difference, without moving controls: stroke order and one faint background motif in the hero only. Foundation: the orientation matrix at low contrast. AI: a single axis ring. Security: a chevron field. Technology: a lattice. Everything below the hero keeps the shared layout.

Modules need two domain marks (Security, Technology) in the same family as the AI six. Two marks is a small job.

### The AI marks

Astra's reading matches mine: Coordination Architect, Democratic Guardrailist, and Open Ecosystem Builder all sit on a central square with things around it, and read as chip or network icons. Precautionary Steward's arcs are abstract. Strategic Competitor's arrows and State Capacity Builder's columns are the two that work.

Directions for one redesigned family of six, each with a silhouette that survives 24 px and monochrome:

| Mark | Concept | Shape direction |
| --- | --- | --- |
| Precautionary Steward | A threshold | A gate or bar across a path, one line held back |
| Strategic Competitor | Two opposed vectors | Keep the current opposing arrows, simplify |
| Coordination Architect | Reciprocal structure | Two interlocking brackets or a lattice that only stands because both halves hold |
| Democratic Guardrailist | Accountable boundary | A bounded field with an opening: rules that can be entered and appealed |
| State Capacity Builder | Institution | Keep the columns |
| Open Ecosystem Builder | Access | Radiating lines from an open center, no square |

Canonical keys and scoring do not change. This is a visual version bump. I can produce a contact sheet at 24, 48, and hero size with the design skill if you want to spend credits there; that is a better use of them than another prose memo.

---

## 8. Navigation and naming inside the product

One structure, used identically on the root menu, the header, the mobile sheet, and the footer:

| Top level | Contains |
| --- | --- |
| **Start** | Foundation · AI Governance · Security · Technology |
| **Cases** | Current cases · Decision exercises · World Stage |
| **Library** | Traditions (`/explore`) · Foundation readings (`/archetypes`) · Worldview Map · Thinkers · Futures · References |
| **Perspectives** | Perspective Runs |
| **Profile** | Saved results, compare |
| utility | About · Method · Privacy · Contact |

Rules:

- One word per questionnaire, everywhere: Foundation, AI Governance, Security, Technology. Retire "Compass" as a name, "Inventory" as a quiz name, "Focus Area", "issue read", "domain record", "domain inventory".
- Retire the word "Atlas" from labels. `/ai/atlas` becomes "The six approaches". The root "Atlas" item becomes "Library".
- Every non-root page shows its path in one line under the header: "Library › Thinkers › Susan Strange". That is the parent link. No `history.back()`. Quiz "Previous" stays a different control from leaving.
- URLs do not change. Legacy links keep working.
- The header nav should be the same five items as the root menu. Today the header has five different items plus a nine-item "More" menu.

### The AI Field Guide

Rewrite it as a guide, structured by questions a reader has:

1. Why do these six approaches disagree? One concrete decision (a lab reports a threshold crossing) worked through six ways.
2. Who should be able to inspect a model, release it, restrict it, or stop it? A short table: approach × who holds each power.
3. When do access, oversight, coordination, and capability limits point in different directions? The four "part ways" pairs, rewritten as arguments rather than "shared / split" cells.
4. What the model leaves out (the six under-modeled perspectives; the copy there is already decent).
5. Where to read next, drawn from the reading lists.
6. Futures: one paragraph and a link to the catalogue. Delete the three vignettes.

Delete: "The translation is uneven on purpose", "real instruments matter more than rhetoric", the "What this page is / An explainer. No score…" rail legend, every "Compass". Source the security-dilemma sentence (Jervis 1978 is the obvious citation) or cut it.

---

## 9. Product name

Naming is not the blocker and should not delay the sprints below. But you asked, so here is a view.

The design authority in `DESIGN.md` already calls the identity **Astrolabe**: an instrument for finding your own position from fixed reference points. That is exactly what the product does, it matches the brass-on-navy visual system you already have, and it is a real word people half-know, which makes it memorable. "Astrolabe. Where do you stand on world politics?" Weaknesses: three syllables, and a handful of small companies use it. Check collisions before committing.

Other candidates, in my order:

| Name | Why | Reservation |
| --- | --- | --- |
| **Astrolabe** | Already your design identity; means "locate yourself"; visual | Some small-company collisions |
| **Vantage** | Short; Perspective Runs are literally vantage points | Common word, many uses |
| **Terms of Power** (Astra) | Editorial, serious, links statecraft and AI | Reads as a book title; heavy for a menu |
| **Bearings** (Astra) | "Get your bearings"; fits the globe | Domain availability likely poor |

Keep "IR Worldview Inventory" as the descriptive subtitle for a while so search and old links still make sense. Brand on the current domain first; a domain move is a data migration because saved results live in origin-scoped localStorage.

---

## 10. Repository, personal presence, security patch

### Going private

State today: public, 0 forks, no LICENSE file (GitHub reports "Other"; `LICENSE_DECISION.md` says all rights reserved), open PRs #50 (draft, parked), #6 and #5 (June, stale). Zero forks means no fork will stay public after the switch. Cloned copies cannot be known.

Before the switch:

1. Move the three GitHub documentation links (`app/method/page.tsx:442`, the Chinese mirrors in `components/i18n/zh-hans-foundation-result-story.tsx:660` and `content/locales/zh-Hans/editorial-pages.ts:174`) to an in-app route, or publish that one diagnostic to a small public methods repository.
2. Add a `LICENSE` file that says what `LICENSE_DECISION.md` says.
3. Close #5 and #6; they are superseded.
4. Confirm Vercel is connected to your personal account (private personal repos deploy on Hobby).

Then flip visibility. It takes a minute. It does not hide the questions, the JavaScript, or the SVGs from anyone who opens the site, and moving scoring to a server for obfuscation would cost you the privacy story. Do not do that.

The repo also carries 162 MB across 879 files in `docs/` and 34 MB in `artifacts/`. Move recordings and screenshots out of the main tree (a separate evidence repo or LFS) so clones and Codex contexts stay small.

### Personal presence

Keep your name and one email on About and Contact. Remove from the footer: the byline, LinkedIn, Substack, and the `newsletter_clicked` event. The result card route printing the domain is fine. Do not invent an institute; "made by JinHua Yip" on About is more credible than an anonymous product.

### Security patch (before any promotion)

`npm audit --omit=dev`: five findings (one critical, three high, one moderate) in `next`, `sharp`, `nanoid`, `baseline-browser-mapping`. `package.json` pins `next` at exactly `16.2.11`. The fix is one PR: `next@16.3.5`, `eslint-config-next@16.3.5`, bump the overrides for `sharp` to `0.35.4` and `nanoid` to `3.3.18`, `npm audit fix` for the moderate one, then build and run the smoke e2e. Also `rm -rf .next`: the typecheck currently reports two errors from a stale cache referencing a deleted dev page.

---

## 11. The demo film

Agree with Astra's storyboard with two changes. First, do not shoot until the globe and the reveal exist; a film of the current product sells the current product. Second, the 15-second cut is the one that matters for Instagram, X, and LinkedIn, and it should be: globe with one question caption (3 s) → one Security scene and its four options, long enough to read the prompt (5 s) → submit, mark draws (3 s) → the result's first paragraph and the nearest rival (3 s) → name and URL (1 s). Muted, captioned, portrait and landscape from separate captures, synthetic answers, no music in the first cut. Reddit: post as the creator, in a community whose rules allow it, with the method page linked.

---

## 12. Workflow and subscriptions

Where the usage went: the briefs. Each packet asks for route coverage tables, continuous recordings, evidence records, witnesses, and a 228-cell audit. The repository now has 25,000 lines of unit tests and 879 documentation files for 74,000 lines of application code. Codex spent its allowance producing proof of work, and the experience stayed where it was. Astra's packet is better than the old ones, but files 03 and 04 still carry that acceptance load.

What I would do instead:

- **One PM per sprint, not two.** Use the other model for a single 30-minute review of the rendered build at the end.
- **Three acceptance artifacts per task, no more:** tests pass; a before/after copy file for changed prose; one screen recording per changed journey.
- **Prose goes to whoever writes best, directly in the repo.** I have now read every page and every question. Rewriting the twelve surfaces in Appendix A and the Field Guide here, as commits on this branch, costs a fraction of re-briefing another model with this document. If you want that, say which surfaces and I will do them.
- **Codex takes the engineering:** the single navigation registry, the globe, the reveal, the two module marks, the security patch, the Tier 1 option counter. These are well-specified and testable, which is where it is strong.
- **ChatGPT takes the research:** the globe scene membership lists with dates and URLs, and the Field Guide sources. Cheap on Pro, and it is the right tool.
- **Cheaper models: not yet.** Your binding constraint is tokens spent on scaffolding, not price per token. Fix the briefs first. If Codex still runs out after that, give a Chinese model the fully mechanical jobs (applying a finished word list across 40 files) with a diff as the only deliverable.
- **The copy audit is an asset.** After the rewrite, promote the P1 template rules to strict so the patterns cannot return, and add the sweep patterns from §2 as advisory rules.

---

## 13. The order of work

| Sprint | Contents | Who |
| --- | --- | --- |
| **A. Words and doors** | Rewrite the twelve surfaces in Appendix A plus the Field Guide. One navigation registry and path line on every page. Delete `/learn`, the planned-modules block, the footer promotion, result chapters 04 and 05. Security patch. Move GitHub links, add LICENSE, close stale PRs, go private. | Fable prose; Codex plumbing |
| **B. Globe and reveal** | ChatGPT sources the scene lists. Codex implements the Canvas globe with `d3-geo`, pause, reduced motion, static fallback. Reveal on all four result paths. Two module marks. AI mark contact sheet for your approval. | ChatGPT research; Codex build; Fable or Claude Design for marks |
| **C. Instruments** | AI v4 bank and scorer (pairs, ladders, clamp). Foundation copy v3 (openers, clarifications). Security v6 (explanation split, cost phrasing). Technology copy. All versioned; old links decode. Tier 1 option counter. | Fable drafts wording; Codex versions and tests |
| **D. Launch** | Name decision, brand on the current domain. Tier 1 on in production. Demo film. Posts. | You |

Gate for release: a stranger, in sixty seconds, understands what to do, does it, and gets a result they would screenshot.

---

## Appendix A. Before and after

### A1. Focus Areas hub (`app/modules/page.tsx`)

**Before**

> Focus Areas
> **Add a focused issue read beside the Foundation**
> Use Security and Technology to examine concrete policy judgments. Each result remains a separate domain record and leaves the Foundation unchanged.
> *How to read this layer.* Broad priors and issue instincts are related, but not identical. The point here is to read the issue on its own terms when the case becomes specific.
> What Focus Areas cover · How long it takes · What it does not claim
> [ten planned modules]

**After**

> **Security and Technology**
> Two shorter questionnaires built from cases. An ally asks for troops on its border. A ministry decides whether to fund public compute. You choose, and the result shows which logic you kept returning to. Each questionnaire gives its own result and leaves your Foundation result alone.
>
> **Security** · {n} cases · about {m} minutes
> Deterrence, alliances, sanctions, and the use of force, each set at a real table: a NATO ministerial, a cabinet under pressure at sea, a ceasefire monitoring team.
> [Start Security]
>
> **Technology** · {n} cases · about {m} minutes
> Export controls, chips, open models, sovereign clouds, and who writes the rules for AI. You set budgets and access, then see what you protected first.
> [Start Technology]
>
> Already have results? [Open Profile]

(The page already computes the counts; keep them live.)

### A2. AI Governance hub (`app/ai/page.tsx`)

**Before**

> AI Governance Compass
> **Compare your judgments on frontier AI governance**
> 22 questions. Around 8 minutes.
> The questions cover eight axes: risk horizon, deployment pace, oversight, geopolitics, openness, military use, legitimacy, and human future.
> [Take the AI Compass] [Browse the AI Atlas →]
> What it covers · How long it takes · What it does not claim
> Choose your route: Standard / Advanced (two more cards)
> Where the AI Compass connects to the rest of the project (eight links)

**After**

> **Who should be allowed to build, release, and stop powerful AI?**
> Twenty-two questions, about eight minutes. You take positions on release, oversight, military use, and rivalry between states. The result shows which of six governing approaches your answers came nearest, and where the closest rival approach would have decided differently.
> [Start] · Standard, 22 questions | Advanced, 37 questions: adds compute, audits, incident reporting
>
> *Example result.* Coordination Architect: "You accepted rivalry as a fact and still put verification ahead of advantage. The nearest alternative, Strategic Competitor, would have kept the compute lever national."
>
> Also here: The six approaches · Who gets access? (a ten-minute decision exercise, no questionnaire needed) · Futures · Field Guide

### A3. Foundation result, chapter 02

**Before**

> **The exact terms in the family comparison**
> The largest positive term comes from {dimension}. This is where the recorded pattern most supports {A} relative to {B}. Each row is one term in the live scorer's {A} minus {B} comparison. A positive term adds to the first reading's score relative to the second. A negative term subtracts from it.
> This calculation uses the calibration registered for the exact completed form. It does not treat distance from the raw scale midpoint as classification evidence.

**After**

> **Why {A}, and not {B}**
> Your answers on {dimension} did most of the work: there you sided with {A}'s reading. On {dimension 2} you leaned the other way, which is why {B} stayed close. Each row shows how far one dimension pulled toward one reading or the other.
> ▸ How this is calculated (one sentence, link to Method)

### A4. Foundation result, chapter 05

**Before:** a chapter titled "Domain inventories remain separate records" with two paragraphs about scales and master scores.

**After:** delete the chapter. If a Security or Technology result is saved on the device, one line at the foot of the result: "You also have a Security result on this device. [Open it]".

### A5. Root menu, first item (`content/root.ts`)

**Before**

> Inventory
> Start with the Foundation when the site is new to you. It asks fourteen broad questions about recurring disputes in international politics. Security, Technology and AI Governance then test whether the same habits hold once the policy problem becomes more specific.

**After**

> Start
> Begin with the Foundation: fourteen questions about the arguments people reach for when world politics gets hard. Then, if you want, take Security, Technology, or AI Governance, which put the same questions to you inside one policy field.

### A6. AI result hero note

**Before**

> The saved name is preserved. These rounded coordinates do not reproduce it as a leading model score; use the positions below as the supported reading.

**After**

> This link was saved with an earlier version of the scoring. The name is the one you were given; the positions below are recalculated from the saved scores.

(Only shown in the rare case where it applies.)

### A7. A Foundation tradeoff, openers removed (`tradeoff_strategy`)

**Before**

> - If a durable strategic edge is available now, failing to use it will look reckless later.
> - The first danger is self-inflicted: excessive commitments and escalation can do more damage than a narrower rival gain.
> - The real question is whether domestic coalitions, public tolerance, and fiscal capacity can carry the strategy at all.
> - Long-run advantage turns less on tactical posturing than on who controls technology, industry, and supply chains.

**After**

> - If a lasting edge is available now, failing to use it will look reckless later.
> - Excessive commitments and escalation can do more damage than a narrower rival gain.
> - Whether domestic coalitions, public tolerance, and fiscal capacity can carry the strategy at all.
> - Long-run advantage depends on who controls technology, industry, and supply chains.

### A8. A Security option, cost label removed (`eastern_flank`, option 1)

**Before**

> Station a standing multinational unit under a joint command so an attack immediately implicates several allies. Accepted cost: This reduces crisis flexibility and makes a local incident more likely to implicate the whole alliance.

**After**

> Station a standing multinational unit under joint command, so any attack immediately involves several allies. That buys deterrence at the price of flexibility: a local incident can pull in the whole alliance.

### A9. Explore hub hero

**Before**

> **Ways of reading world politics**
> Explore what different traditions notice, what they explain, and where their arguments come apart. Start with a name, a thinker, or a decision.
> Decision Patterns and evidence-coded public positions are reading aids. They never become your Foundation result.

**After**

> **Library**
> Four traditions, eight Foundation readings, four thinkers, nineteen possible futures. Start with a name you were given, a thinker you have heard of, or a decision you would have made differently.

### A10. Profile labels

"Saved Foundation read" → "Your Foundation result". "Separate domain records" → "Your other results". "Records saved on this device" → "Saved on this device".

### A11. Method page opening

Keep "This is not a validated psychometric instrument." It is necessary and it is clear. Cut the surrounding repetition; say it once at the top of Method and nowhere else in the product.

### A12. About page

**After**

> **About**
> [Product name] asks how you read world politics, and shows you the logic you used. It was built by JinHua Yip, who works in political risk and trained at SAIS in technology, security, and governance. The questions, cases, and readings are authored and sourced; the scoring is a set of authored weights, described in full in Method, and not a validated test. AI tools were used in drafting; every public claim was checked against a source or is labelled as interpretation.
> Corrections, privacy questions, and security reports: [email]. Nothing you answer is sent with that message.

---

## Appendix B. Sweep counts by file (top 20, English public sources)

| Hits | File | Leading patterns |
| --- | --- | --- |
| 156 | `content/instrument/foundation.v2.json` | shape 15, tradeoff 12, rather than 7, not just 6, durable 3 |
| 144 | `lib/result-helpers.ts` | tilt 21, lean 20, lens 14, tension 12, reflect 12 |
| 142 | `lib/explore-content.ts` | shape 33, rather than 22, modeled 12, framework 11, not just 7, genuinely 7 |
| 120 | `content/archetypes.json` | provisional 26, instinct 24, reviewed 16 |
| 115 | `lib/profile-helpers.ts` | baseline 39, layer 18, tension 9 |
| 97 | `app/method/page.tsx` | layer 8, inventory 8, robust 7, lean 6 |
| 75 | `lib/archetypes.ts` | lens 18, posture 12 |
| 73 | `lib/atlas-lite.ts` | rather than 11, durable 5, sharpen 4 |
| 65 | `lib/perspectives/catalog.ts` | framework 5, durable 2 |
| 59 | `lib/archetype-content.ts` | reviewed 24, provisional 8, lens 6, posture 6 |
| 56 | `components/results/foundation-result-story.tsx` | posture 10, payoff 8, modeled 4, reviewed 4 |
| 49 | `lib/ai-governance-cross-module-synthesis.ts` | baseline 11, pull 7, rather than 5, durable 4 |
| 48 | `content/archetype-evidence.json` | provisional 42 |
| 46 | `components/results/posture-strip.tsx` | posture 34 |
| 46 | `content/explore/hub.en.json` | lens 7, modeled 7, shape 5 |
| 45 | `lib/futures/trajectories.ts` | whether/or 6, rather than 5, meaningful 3 |
| 43 | `app/modules/page.tsx` | lens 8, "read" as noun 6, does not claim 2 |
| 35 | `lib/ai-governance-atlas-content.ts` | rather than 9, durable 6, lean 6 |
| 34 | `app/ai/field-guide/page.tsx` | modeled 5, Compass 5, lens 3 |
| 33 | `app/ai/results/[payload]/page.tsx` | Compass 8, payoff 5, does not claim 2 |

The existing `npm run copy:audit` reports 692 advisory findings; the worst files are `lib/atlas-lite.ts` (62), `lib/profile-helpers.ts` (57), `lib/ai-governance-cross-module-synthesis.ts` (27), `app/method/page.tsx` (16).

---

## Appendix C. Proposed versioned instrument changes

### AI Governance v4 (new bank, scorer 2)

Reverse items rewritten as true opposites of their forward items:

| Axis | Forward (keep, edited) | Reverse (new) |
| --- | --- | --- |
| geopolitics | Advanced AI should be governed on the assumption that rivalry between major powers will not go away. | Rivalry between major powers is mostly a choice; with the right agreements it can be set aside for AI. |
| oversight | Frontier labs should face mandatory external oversight, not only voluntary internal frameworks. | Voluntary frameworks run by the labs themselves are enough to keep frontier development safe. |
| humanFuture | The first aim of AI governance should be to keep humans in control of systems that could reshape society. | Keeping humans in control matters less than letting advanced systems improve life at scale. |
| militaryRole | Militaries should be able to use frontier AI in bounded ways under human control and audit. | Militaries should keep frontier AI out of their systems until civilian governance is far stronger. |

The displaced propositions ("coordination should outrank advantage", "governments lack competence", "room for transformation", "routine use erodes restraint") are good items. Keep them as forward items on the axis they actually measure (coordination → legitimacy or a new "coordination" axis; competence → oversight, forward; transformation → humanFuture, forward), or drop them if the axis has enough coverage.

Standard scenarios: replace the four ladders with four-option distinct-logic versions. For `capabilityThreshold`: (a) pause until outside testers confirm; (b) keep it in supervised channels and gather evidence; (c) report it to a regulator and let the regulator decide the channel; (d) continue limited deployment because delay has its own costs. Four logics: precaution, containment, public authority, cost of delay.

Scorer: apply all scenario increments, then clamp once.

Clarifications: keep `whatItAsks` where it adds scope; drop `whatItDoesNotAsk` except on dp1, mr1, hf3.

### Foundation copy v3 (same scoring)

Remove the 21 ranking openers. Rewrite clarifications that restate the stem as term definitions or delete them. Replace "durable" in the three stems with "lasting" or restructure.

### Security v6

Split `gray_zone_sabotage` into an explanation card (what is the rival testing: resolve, cohesion, resilience, patience) and a decision card (what to do first). Drop the "Accepted cost:" label; write each cost as the option's second sentence. Same signals.

### Technology copy v2 (same scoring)

Remove the 10 ranking openers.
