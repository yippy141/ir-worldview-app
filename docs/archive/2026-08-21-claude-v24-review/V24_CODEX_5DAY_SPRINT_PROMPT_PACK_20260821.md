> **HISTORICAL, SUPERSEDED, NON-EXECUTABLE.** Preserved only for provenance. Verify every claim against the current roadmap, Git state, and runtime before reuse.

# Codex 5-Day Visual Sprint — Prompt Pack

> **HISTORICAL, SUPERSEDED, NON-EXECUTABLE. DO NOT RUN THESE PROMPTS.** Use `docs/roadmap/V23_5_IMPLEMENTATION_PROMPT_PACK.md`.

**Date:** 21 August 2026
**Branch:** `v23-5-legibility` (create from merged `main` after V23.4 lands)
**Credit window:** expires ~26 August 2026
**Reasoning setting:** extra-high or ultra for every prompt in this pack.
**Governing brief:** `V24_EXPERIENCE_REDESIGN_BRIEF_20260821.md`

Seven prompts, run in strict order. Each is bounded, each ends at a stop point, each states its own gate. Do not merge anything until Checkpoint C at the end.

**If the credit runs out mid-pack:** stopping cleanly after V-3 is a good outcome. Stopping before V-3 is a failed sprint, because V-3 is where the percentile defect closes.

---

## Day plan

| Day | Prompts | Why this order |
|---|---|---|
| 1 | V-0, V-1 | Content and tokens must move before anything renders differently. V-1 is self-contained and can run while V-0's gate finishes. |
| 2 | V-2 | The hero is the highest-value single surface and carries the percentile fix. |
| 3 | V-3 | Scroll registers depend on the hero being final. |
| 4 | V-4 | Explore is independent of the result work and can absorb overrun. |
| 5 | V-5, V-6 | Homepage and share card are the cheapest and the most droppable. |

---

## Universal contract block

**Paste this at the top of every prompt in this pack.**

> Work on branch `v23-5-legibility`. Before editing, print:
>
> ```bash
> git branch --show-current
> git rev-parse HEAD
> git status --short
> git --no-pager log -5 --oneline --decorate
> ```
>
> The working tree must be clean. Do not use `git reset --hard`, `git push --force`, or `npm audit fix --force`.
>
> **Inspect before you edit.** For every behaviour this prompt requests, report whether current code already implements it as complete, partial, absent, or contradicted. Do not build a second path for an existing feature. Do not opportunistically refactor systems this prompt does not name.
>
> **Do not change any of the following.** Stop and report if a requested change appears to require it:
> - Foundation scoring, questions, archetype resolution, calibration, or payload encoding
> - `lib/scoring/**`, `lib/archetypes.ts` resolution logic, `lib/share.ts`, `lib/profile-share.ts`
> - any question bank, any bank version constant, any scoring version constant
> - module manifests, release decisions, manifest fingerprints, bridge policy
> - Tier 1 or Tier 2 flags, database code, external services
> - Decision Pattern IDs or content
> - published Chinese content, or the fail-closed locale behaviour
>
> **Do not add dependencies.** Everything in this pack is achievable with `IntersectionObserver`, CSS custom properties, CSS transitions and keyframes, `stroke-dasharray` / `stroke-dashoffset`, and `prefers-reduced-motion`. Do not install GSAP, framer-motion, ScrollMagic, Lenis, d3, or a scroll library. If you believe a dependency is unavoidable, stop and explain instead of installing it.
>
> **Universal quality gates.** Every change must hold:
> - full content present at first paint with JavaScript disabled
> - `prefers-reduced-motion: reduce` produces a complete, static, correct page
> - keyboard reachable in document order, visible focus, no trap in any pinned region
> - semantic list parity for any graphic carrying information
> - 390px viewport with no horizontal overflow; 400% reflow usable
> - print renders complete, unpinned, graphics in final state, decorative marks excluded
> - no animation loops in production
> - no layout shift after first paint
>
> **Make no claim the evidence does not support.** No validity language, no population inference, no percentile against a synthetic distribution, no distributional sentence without a named calibration record.
>
> **Gate.** Run and report the full table:
>
> ```bash
> rm -rf .next
> npm run typecheck
> npm run validate
> npm run evidence:audit:check
> npm run copy:audit:strict
> npm run lint
> npm run test
> npm run build
> npm run typecheck
> CI=1 npm run test:e2e
> git diff --check
> ```
>
> If local Playwright cannot bind in the sandbox, require a green same-head GitHub Linux Playwright run instead. Do not change application behaviour to satisfy an environment failure.
>
> **Stop after the requested scope.** Report pre-existing failures separately from ones you introduced. Do not commit until the gate passes. Do not open or merge a pull request.

---

## Prompt V-0 — Content extraction and token unification

> **Goal.** Move editorial copy out of TypeScript source into loadable content, and replace the repo's colour and type literals with a single token set. No visual change should be perceptible when this prompt is done. This is groundwork; every later prompt in the pack depends on it.
>
> **Read first:** `lib/explore-content.ts`, `lib/archetype-content.ts`, `lib/result-helpers.ts`, `lib/copy/glosses.ts`, `app/globals.css`, `app/layout.tsx`, `i18n/`, `messages/`, `scripts/audit-public-copy.mjs`, and `docs/COPY_EDITING_GUIDE.md` if it exists.
>
> **Part 1 — content extraction.**
>
> Extract owner-editable editorial prose from TypeScript modules into typed JSON under:
>
> ```text
> content/copy/en/archetypes.json
> content/copy/en/explore.json
> content/copy/en/foundation-results.json
> content/copy/en/navigation.json
> ```
>
> Rules:
> - the TypeScript module keeps its exported shape and type; only the string values move
> - add a build-time loader and a validator that fails on a missing or malformed key
> - **do not extract** legal or privacy text, source titles, quotations, machine identifiers, or single-word accessibility labels
> - do not change any string's content in this prompt. Byte-identical output is the acceptance criterion
> - extend `scripts/audit-public-copy.mjs` scan roots to cover the new files
>
> If full extraction of any one module would exceed a reasonable diff, extract `content/copy/en/archetypes.json` and `content/copy/en/explore.json` only, and report exactly what remains and why.
>
> **Part 2 — tokens.**
>
> Define one token set as CSS custom properties on `:root` with a light-scheme override:
>
> | Token | Dark | Light |
> |---|---|---|
> | `--ground` | `#0F1B2D` | `#F4F1EA` |
> | `--panel` | `#14243A` | `#FFFFFF` |
> | `--rule` | `#24344B` | `#D8D2C4` |
> | `--accent` | `#C9A227` | `#7A5F26` |
> | `--text-primary` | `#F4F1EA` | `#16202F` |
> | `--text-secondary` | `#C7D2E0` | — |
> | `--text-tertiary` | `#8B9AAE` | — |
> | `--mark-anchor` | `#3A4E6B` | — |
>
> Then:
> - replace every literal use of `#0a1322` and `#cea857` with the tokens. These two values are retired.
> - `--mark-anchor` is a mark colour only. Add a lint rule or a test asserting it never appears as a `color` value.
> - **Audit and fix the contrast defect:** `#C9A227` measures 2.1:1 on `#F4F1EA` and fails WCAG AA for text. Find every use of brass as text on a light ground and route it to `--accent` resolved in light scheme (`#7A5F26`, 5.3:1). Report each site you changed.
> - add spacing-step tokens: 7, 14, 18, 24, 28, 44, 64
> - add type tokens for the scale in the brief: archetype name (Newsreader 400, 72px desktop / 44px mobile, never bold, never fitted), CJK (0.78em, raised 0.02em, own stack), gloss (Newsreader 21px/1.5, max 54ch), code (Space Mono 700, 13px, 0.18em), variant subtitle (Archivo 600, 12px, 0.2em, uppercase), labels (Archivo 9.5–13px), numerals (Space Mono)
>
> **Part 3 — report the CSS problem.** `app/globals.css` is roughly 227KB with Tailwind v4 also installed. Do not restructure it in this prompt. Produce `docs/v23.5/GLOBALS_CSS_AUDIT.md` describing: how much is dead, how much duplicates Tailwind utilities, and a proposed split. Analysis only.
>
> **Acceptance.** Zero perceptible visual change. Zero string content change. Every retired colour literal gone. Every light-ground brass text use fixed. Full gate green.
>
> **Return:** files changed, extraction coverage, the list of contrast fixes, the CSS audit, and the gate table.

---

## Prompt V-1 — Sigil animation system

> **Goal.** Implement the stroke-order draw-on system for the eight archetype marks, exactly as specified in the Claude Design artifact, and resolve the two open issues in that artifact.
>
> **Read first:** `lib/archetype-marks.ts`, every component that renders a mark, `app/globals.css`, and the animation and stroke-order sections of the supplied design artifact.
>
> **Part 1 — the draw-on.**
>
> Extend `ArchetypeMarkDefinition` with per-node animation metadata. Do not change any existing `d` value, `viewBox`, `code`, or the output of `serializeArchetypeMarkBody`. Existing serialization tests must pass unchanged.
>
> Add per-mark stroke order and timing:
>
> | Mark | Strokes | Rule |
> |---|---|---|
> | Shi (勢) P− | 2 | 力 order: 横折钩 to 44%, lift, 丿 from 52% |
> | Musyawarah M− | 4 | outer strands inward, sweep written last |
> | Satyagraha M+ | 2 | headline bar first, then the hanging line |
> | Dependencia S− | 3 | cut order, deepest first, no lift, **linear timing with no easing** |
> | Kairos P+, Grotian R+, Concert R−, Dirigisme S+ | 1 | single continuous dashoffset. A chisel and a compass do not lift. |
>
> Timing: 2.4s for the single-stroke engraved and rule-drawn marks; 4.2s for the written marks with lifts. Terminal dots and settles resolve at 60% of the timeline.
>
> **Part 2 — the behaviour rules. These are binding.**
>
> - **Runs once and holds. Never loops.**
> - The resting state is the finished mark. Frozen, unstarted, revisited, shared, printed, and `prefers-reduced-motion` all paint drawn.
> - The animation fires on **first paint of a freshly generated Foundation result only.** Implement a single explicit prop or context flag for this. Directory pages, `/archetypes`, `/explore`, the Worldview Map, navigation, and share cards all render static.
> - Fill-based marks (P−, M−, S−) cannot use `stroke-dashoffset` on their fills. Use a clip or mask reveal that follows the same stroke order and the same timing.
>
> **Part 3 — the two open issues.**
>
> - **Kairos (P+) and Concert (R−) are hard to distinguish below 24px.** Both are circular engraved constructions. Adjust one or both marks to separate them at small sizes without breaking the System A construction logic. Then enforce `ARCHETYPE_MARK_MIN_PICTORIAL_SIZE = 32`: below 32px, render the archetype code (`P+`, `R−`) rather than the mark. Produce a contact sheet at 16 / 20 / 24 / 32 / 48 / 96px showing the separation.
> - **Blend presentation — Hallmark.** Primary mark full size, runner-up as a corner assay mark. Implement it. Where placement firmness data is available, the assay mark is more prominent for a blend closer to its boundary. Do not invent a firmness value if one is not available; render the neutral form.
>
> **Part 4 — artifacts.** Produce, in a declared artifact folder:
> - a contact sheet of all eight marks at 16 / 20 / 24 / 32 / 48 / 96px and watermark size
> - dark, light, black, and print contexts
> - a geometry digest
> - a draft collision-review record. **Do not mark collision review `approved`.**
>
> **Acceptance.** All eight marks animate in correct stroke order. Nothing loops. Reduced motion paints drawn. Static everywhere except a fresh Foundation result. Kairos and Concert are distinguishable at 24px. Existing serialization tests unchanged.
>
> **Return:** the contact sheet, the geometry digest, the collision-review draft, a description of the Kairos/Concert change, and the gate table.

---

## Prompt V-2 — Result hero, and the percentile removal

> **Goal.** Rebuild the Foundation result hero as the Frontispiece composition, and remove ordinal percentiles from all new result rendering.
>
> **Read first:** `app/results/[payload]/page.tsx`, `lib/results/dimension-bands.ts`, `lib/results/placement-firmness.ts`, `lib/results/position.ts`, `lib/results/foundation-payoff.ts`, `lib/percentiles.ts`, `components/results/**`, and the turn-2 and turn-3 hero compositions in the design artifact.
>
> **Part 1 — the percentile removal. This is the priority of this prompt.**
>
> Both module manifests declare `calibration.status: "synthetic-diagnostic"`. There is no respondent population. The result page currently renders ordinal percentiles through `buildDimensionPercentiles`, `formatOrdinal`, `DimensionScoreValue`, and `PercentileFootnote`.
>
> An ordinal percentile is a statement about a population. Rendering "88th" in the largest numerals on the page and qualifying it in a footnote is a display the footnote cannot win.
>
> Required:
> - stop generating ordinal percentile displays in all new result rendering
> - replace with instrument-relative bands built on `lib/results/dimension-bands.ts`
> - keep `lib/percentiles.ts` and the existing display path reachable and frozen for legacy payload rendering only. Do not delete it. Do not change what it computes.
> - add a test asserting no new result render emits an ordinal suffix (`st`, `nd`, `rd`, `th`) adjacent to a dimension value
> - **search the entire codebase and content for any sentence of the form "N% of respondents" and remove every instance.** There are no respondents. Report every site found.
>
> Replacement copy, same three measures:
>
> ```text
> Institutions and rules · high in this instrument's range
> Security rivalry · upper middle
> Markets and dependence · middle
> ```
>
> With one line beneath: *Positions are relative to the range this instrument can produce, not to a population of respondents.*
>
> **Part 2 — the Frontispiece hero.**
>
> One viewport, no scroll required. Identity centred above a rule; measurement in a ruled register beneath it, so the two never compete. Order never inverts.
>
> Contents: sigil (animated per V-1 on a fresh result, static otherwise), archetype code, variant subtitle, name at fixed 72px desktop / 44px mobile, gloss at max 54ch, labelled 2×2 position map with posture strip and four corner labels with `nowrap`, dimension bands, and the scroll cue as the last element inside the frame. Fold at 772px desktop, 844px mobile.
>
> Mobile uses Plate-A: sigil ruled and inline with the code, name beside it, map and bands sharing the lower half, cue at the fold.
>
> **Part 3 — placement firmness in the hero.**
>
> `lib/results/placement-firmness.ts` already exists. Promote firmness from footnote to hero element. The position map renders a dot with a resolved region: a firm placement is a small region, a near-boundary placement is a large region that visibly reaches the neighbouring cell. Add a plain-language line: *"clearly separated from its neighbours"* or *"close to the Kairos boundary."*
>
> Do not change how firmness is computed.
>
> **Part 4 — what stays.** Every existing section below the hero remains present and reachable. This prompt restructures the top of the page and does not delete content. V-3 handles what happens below.
>
> **Acceptance.** No ordinal percentile in any new render. No "N% of respondents" anywhere. Hero fits one viewport at 390px and 1440px. Firmness visible without opening a disclosure. Legacy payloads still render their original meaning.
>
> **Return:** screenshots at 390 / 768 / 1440 and print, for a pure result, a blend result, a near-boundary result, and a legacy payload. Plus the list of removed percentile and rarity sites, and the gate table.

---

## Prompt V-3 — Result page scroll registers

> **Goal.** Restructure everything below the hero into three registers, with a pinned-graphic scroll sequence in register two.
>
> **Read first:** the V-2 output, `app/results/[payload]/page.tsx`, and every component it renders.
>
> **The structure.**
>
> **Register two — the argument.** Three steps, each answering one question, each showing one graphic. The graphic is `position: sticky` inside a tall step container; the prose advances beside it.
>
> 1. **Why this and not its nearest neighbour.** Position map pinned. The neighbour's cell illuminates, then the separating dimensions highlight in sequence, then the boundary distance resolves.
> 2. **What is actually doing the work.** Dimension bands pinned. The two or three dimensions carrying the result rise; the rest recede.
> 3. **Where this reading would break.** The pressure case. Static, prose-led, **no motion.** The contrast with the two animated steps is the point.
>
> Optionally a fourth: how this applies by issue, with the Security and Technology tilts and links into each module.
>
> **Register three — everything else, behind disclosure.** Dimension tables, modifier explanations, alternative families, coverage, questions that could change the reading, methods. Present, complete, collapsed. Use native `<details>` unless there is a specific reason not to.
>
> **Mechanics. These are binding.**
>
> - one `IntersectionObserver`, `rootMargin` tuned so a step activates when its prose crosses the vertical centre
> - `position: sticky` for pinning. **No scroll hijacking. No custom scroll physics. No `scrollTo` interception.**
> - step state is one class and one CSS custom property on a container. Transitions are CSS.
> - **without JavaScript, every step renders in full, in order, with its graphic in final state.** The steps become plain sections. Nothing is lost.
> - `prefers-reduced-motion` collapses transitions to instant state changes. Steps still advance.
> - print renders the full document, unpinned, graphics in final state
> - no `IntersectionObserver` callback may write layout-affecting styles. Class toggles only.
>
> **Acceptance.** Reading the page with JS disabled produces the complete result. Reading it with reduced motion produces the complete result. Reading it on a 390px screen produces the complete result with no horizontal overflow. Printing produces the complete result.
>
> **Return:** a video or frame sequence of the three steps at 1440px, the JS-disabled render, the reduced-motion render, the 390px render, the print render, and the gate table.

---

## Prompt V-4 — Explore tradition pages as demonstration

> **Goal.** Invert the Explore tradition page so the demonstration is the page and the reference essay is the appendix. Same content, new order, one new component.
>
> **Read first:** `app/explore/[slug]/page.tsx`, `lib/explore-content.ts` (or the extracted `content/copy/en/explore.json` from V-0), `lib/current-cases/**`, `content/current-cases/**`, `lib/world-stage/data/world-countries-110m.json`, `lib/field/position.ts`.
>
> **Why.** `/explore/realism` is roughly 2,200 words of prose with no images, charts, or maps. It competes with Wikipedia and cannot win that comparison. What Wikipedia cannot do is show a tradition operating on a live case and show the reader where they sit relative to it.
>
> **The new page shape.**
>
> **Register one — the claim.** Tradition name, one-sentence structural premise, and the two archetype marks with their postures. Static, dense, one viewport.
>
> **Register two — the demonstration.** One reviewed Current Case. A pinned four-column comparison: what each of the four modeled traditions notices first, recommends, and accepts as the cost. Same facts, four readings. On scroll: facts establish, then each tradition's reading enters in turn, then the reader's own tradition highlights if a Foundation result exists in local storage.
>
> This is the only place motion is justified on this page, and it is justified because sequence is the content.
>
> **Source the four readings from reviewed Current Case data.** Do not generate them. If a case does not carry all four readings, use a case that does, or render the readings that exist and state which are absent. Do not fabricate a tradition's reading to fill the layout.
>
> **Register three — the map, where the case is geographic.** Precomputed SVG from the vendored 110m geometry. Static, annotated, printable. A semantic list beneath carries the same information. **No pan, no zoom, no tiles, no mapbox.**
>
> **Register four — the reference.** The existing prose, restructured under disclosure. Content unchanged.
>
> **Register five — the authorial note.** A signed, dated slot rendered from content, explicitly labelled as outside the instrument. Build the component and the content key. Leave the copy empty or a single placeholder the owner will replace; **do not write the opinion.**
>
> **Also in this prompt:** audit whether `mapbox-gl` ships on any live route. Report which routes import it and what the bundle cost is. Do not remove it in this prompt.
>
> **Acceptance.** Every tradition page leads with a demonstration. No fabricated readings. Map is SVG with list parity. Prose content unchanged and still reachable. Reader's own position highlights only when a result exists, and its absence is not an error state.
>
> **Return:** screenshots of all four tradition pages at 390 and 1440, the mapbox audit, and the gate table.

---

## Prompt V-5 — Homepage and card consolidation

> **Goal.** One primary door. Three card patterns. Fix the stale lead case.
>
> **Read first:** `app/page.tsx` and whatever it renders, `app/ai/page.tsx`, `app/modules/page.tsx`, `app/explore/page.tsx`, `lib/current-cases/catalog.ts`, `lib/current-cases/validation.ts`, `app/globals.css`.
>
> **Part 1 — the homepage.**
>
> Current state: six equal-weight `Open X →` actions under "Choose a starting point," with a Current Case in the hero slot.
>
> New state:
> - above the fold: what this is, what it does, how long it takes, **one button — the Foundation**
> - below, in descending weight: the current case, then focus areas, then Map and Explore
> - Perspective Runs and the AI Compass move into navigation
>
> **Part 2 — the freshness defect.**
>
> The lead case is currently marked reviewed through 14 July 2026, which is 38 days old, and it is still presented as the lead. V22.5 Prompt G specified freshness enforcement. Determine whether the machinery exists and is not wired to the homepage, or exists and is not failing correctly, or does not exist. Fix so a case past its review-due date cannot occupy the lead slot. Render an honest "recent cases" or no-active-case state instead. Add a test.
>
> **Part 3 — card consolidation.**
>
> Audit every card pattern in use: `explore-card`, `atlas-pattern-grid`, `resource-list-link`, `signal-list-item`, `lobby-related-grid`, `option-card`, and the inline-styled variants in `app/ai/page.tsx` that set `fontFamily`, `fontSize`, and `fontWeight` directly in JSX.
>
> Consolidate to three and delete the rest:
> - **Entry card** — a thing you can start. Title, one line, time estimate, one action.
> - **Reference card** — a thing you can read. Title, one line, no action styling.
> - **Result card** — a thing you have. Mark, label, date, state.
>
> **Remove every inline style object from JSX** across the routes you touch. They belong in tokens.
>
> **Part 4 — naming consistency.** The UI says "Advanced," the code says `analyst`, and module copy uses both. Pick one public label, apply it everywhere, and leave the internal `analyst` key untouched for compatibility.
>
> **Acceptance.** One primary action above the fold. No stale case in the lead slot, enforced by a test. Three card components. No inline style objects in touched routes. One mode label.
>
> **Return:** before and after screenshots at 390 and 1440, the freshness diagnosis and fix, the card consolidation map, and the gate table.

---

## Prompt V-6 — Share card regeneration

> **Goal.** Rebuild the generated share card to match the new hero, per the design artifact's turn-4 specification, with the rarity line removed.
>
> **Read first:** `app/api/card/route.tsx`, `lib/share-card.ts`, `app/cases/[slug]/opengraph-image.tsx`, and the turn-4 share card specification in the design artifact.
>
> **Specification, from the design file.**
>
> - 1200 × 630, which is 1.905:1, so a 1.91 crop takes nothing off the height
> - everything inside a 64px margin; a dashed guide marks the 4% platforms may shave, and no content crosses it
> - every readable line at 30px or larger, so nothing falls below 10px at a 400px timeline render. The URL is the single exception, since it is a destination rather than a reading
> - **test against forced fallback stacks** — Georgia, Arial, Courier New — because a mail client or a cold render will use them. No line may be set to fit its box
> - at 400px the map drops its four anchor labels and the posture strip, and the gloss goes to `#F4F1EA` because `#C7D2E0` at 12px on a timeline is too quiet
>
> **Removed from the composition:** the line "6% of respondents share this reading" and any percentile. There are no respondents. Its place goes to the archetype code and variant, or to nothing.
>
> **Included:** sigil static, archetype code, variant subtitle, name, gloss, 2×2 position map, `irworldview.jhyip.com`.
>
> **Acceptance.** Renders correctly at 1200×630 and legibly at 400px wide. Renders correctly with webfonts forced off. No percentile, no rarity line. Old share links still resolve.
>
> **Return:** rendered cards at full size, 400px, and 400px with fallback stacks, for a pure result and a blend result. Plus the gate table.

---

## Checkpoints

### Checkpoint A — after V-1

Return before starting V-2:
1. branch and HEAD
2. the sigil contact sheet at all sizes
3. the geometry digest and draft collision-review record
4. a description of the Kairos/Concert separation change
5. `git diff --stat`
6. the gate table

This is where the marks are approved or sent back. Do not carry an unresolved collision into the hero.

### Checkpoint B — after V-3

Return before starting V-4:
1. branch and HEAD
2. screenshots: fresh result, blend result, near-boundary result, legacy payload, at 390 / 768 / 1440 and print
3. the JS-disabled and reduced-motion renders
4. **the complete list of removed percentile and "N% of respondents" sites**
5. `git diff --stat`
6. the gate table

This is the checkpoint that matters. If the percentile removal is incomplete, nothing else in the sprint counts.

### Checkpoint C — end of sprint

1. branch and HEAD
2. full changed-file list
3. every screenshot set
4. the `globals.css` audit and the mapbox audit
5. exact-head GitHub CI and Vercel status
6. remaining known defects
7. **an explicit statement that no scoring, payload, bank, calibration, manifest, or bridge behaviour changed**

Open a draft PR titled `V23.5 — legibility, sigil motion, and honest measurement display`. Do not merge before this checkpoint is reviewed.

---

## What to do if Codex proposes something outside scope

Three things it is likely to reach for. All three are refusals:

1. **Installing an animation library.** Refuse. The design artifact already proves the animation works in pure CSS.
2. **"Improving" the percentile display instead of removing it.** Refuse. Better footnotes do not fix a population claim made without a population.
3. **Refactoring `globals.css` mid-sprint.** Refuse. V-0 produces an audit; the restructure is separate work with its own gate.

---

## A note on what this sprint does not buy

This sprint makes the product legible and honest. It does not add a single new item, module, or piece of evidence. That is deliberate: the visual rebuild is the right use of a large expiring coding credit precisely because it is mechanical, bounded, and carries low methodological risk.

The work that actually advances the argument — the Transfer Test, the AI bank source pack, the closed trial — is in the other documents and does not want a coding agent.
