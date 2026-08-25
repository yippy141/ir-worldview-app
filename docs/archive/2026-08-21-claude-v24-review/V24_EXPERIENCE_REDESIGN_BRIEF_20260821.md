> **HISTORICAL, SUPERSEDED, NON-EXECUTABLE.** Preserved only for provenance. Verify every claim against the current roadmap, Git state, and runtime before reuse.

# Experience Redesign Brief — Sigils, Results, Explore, Cards

> **HISTORICAL, SUPERSEDED, NON-EXECUTABLE.** The missing design artifact and alternate palette are not authorities. Use `DESIGN.md`.

**Date:** 21 August 2026
**Scope:** presentation only. No scoring, payload, archetype-resolution, bank, or calibration change, with one deliberate exception in §3.4 which removes a display, not a computation.
**Source of truth for visual decisions:** `Sigils and Result Hero.dc.html`, Claude Design turns 1–4. Where this brief and that file disagree, the file wins on composition and this brief wins on scope and constraints.

---

## 0. The governing idea

The instinct that the product should feel more alive is right. The instinct that the fix is animation is half right.

The product's real problem is that it presents **evidence in the shape of a filing cabinet**. Eleven stacked sections on the result page. Two thousand two hundred words of undifferentiated prose per Explore page. Six equal doors on the homepage. Animation applied to that structure produces an animated filing cabinet.

So the sequence is: **structure, then motion, then decoration.** Every section below is ordered that way, and motion is only specified where it carries information the static layout cannot.

Three rules hold across everything:

1. **Motion carries meaning or it does not exist.** A reveal that shows sequence, causation, or comparison earns its place. A fade-in on scroll does not.
2. **The resting state is the finished state.** Every animated element must paint complete when the animation is frozen, reduced, unstarted, printed, or shared. This is already the design file's rule and it is non-negotiable.
3. **First paint is content.** No text may depend on JavaScript to appear. The scroll layer is progressive enhancement over a complete document.

---

## 1. Foundations to fix first

These are not optional preliminaries. Doing the visual work without them means doing it twice.

### 1.1 Content out of TypeScript

`lib/explore-content.ts` (73KB), `lib/archetype-content.ts` (48KB), `lib/result-helpers.ts` (54KB) hold editorial copy as source modules. Any layout change to a page means editing a file that also contains its prose.

Move editorial copy to `content/copy/en/…` as data, loaded at build. The layout prompts then touch layout only, and copy edits stop requiring a full gate run.

Do not extract: legal and privacy text, source titles and quotations, machine identifiers, or single-word accessibility labels.

### 1.2 Token unification

Retire the repo's `#0a1322` and `#cea857`. Adopt the design spec:

| Token | Dark | Light |
|---|---|---|
| ground | `#0F1B2D` | `#F4F1EA` |
| panel | `#14243A` | `#FFFFFF` |
| rule | `#24344B` | `#D8D2C4` |
| accent | `#C9A227` | `#7A5F26` |
| text primary | `#F4F1EA` | `#16202F` |
| text secondary | `#C7D2E0` | — |
| text tertiary | `#8B9AAE` | — |
| anchor mark | `#3A4E6B` | — |

`#3A4E6B` is a mark colour only. It must never be used for text.

**Accessibility defect to close:** `#C9A227` measures 2.1:1 on `#F4F1EA`. Any brass text on a light ground currently fails WCAG AA. The light build uses `#7A5F26` at 5.3:1. Audit every current use of brass and route light-ground uses to the light token.

### 1.3 Type scale

From the spec, to be encoded as tokens rather than repeated literals:

- **Archetype name:** Newsreader 400, fixed 72px desktop, 44px mobile. Never bold, never fitted to width. The fixed size is a deliberate decision: fitting "Concert" and "Dependencia" to the same width makes them different weights of statement, which the instrument should not imply.
- **CJK:** 0.78em, raised 0.02em, own font stack. Newsreader's CJK fallback sets 勢 on a different baseline and cap height, so Latin and CJK need separate optical alignment.
- **Gloss:** Newsreader 21px / 1.5, max 54ch, two sentences.
- **Code:** Space Mono 700, 13px, 0.18em tracking.
- **Variant subtitle:** Archivo 600, 12px, 0.2em, uppercase.
- **Labels and measures:** Archivo 9.5–13px. Numerals in Space Mono.
- **Spacing steps:** 7 · 14 · 18 · 24 · 28 · 44 · 64.

### 1.4 A dependency decision, stated once

**Add nothing.** No GSAP, no framer-motion, no ScrollMagic, no Lenis, no d3 bundle. Everything in this brief is achievable with `IntersectionObserver`, CSS custom properties, CSS transitions and keyframes, `stroke-dasharray` / `stroke-dashoffset`, and `prefers-reduced-motion`. `AGENTS.md` already forbids new dependencies without an explicit ask, and the design file has already demonstrated the sigil animation in pure CSS.

Where CSS scroll-driven animations (`animation-timeline: view()`) are supported they may be used as an enhancement, with the `IntersectionObserver` path as the baseline.

**Separately, audit `mapbox-gl`.** It is roughly 800KB gzipped with a tile-service dependency, and `world-countries-110m.json` is already vendored locally at 136KB. If mapbox ships on any live route, replacing it with a precomputed SVG projection is the largest available performance win and makes the maps printable and screen-readable.

---

## 2. The sigil system

### 2.1 What already exists

Eight marks in `lib/archetype-marks.ts` as `v23-system-a-derived-1`, on a `0 0 100 100` viewBox, as typed node trees with a canonical serializer. Each mark abstracts a source form from the concept's own visual culture and is cut with that culture's tool:

| Code | Name | Culture and tool |
|---|---|---|
| P+ | Kairos | Greek, incised epigraphy |
| P− | Shi (勢) | Chinese, brush, variable width |
| R+ | Grotian | Dutch, engraved geometric |
| R− | Concert | European, engraved geometric |
| M+ | Satyagraha | South Asian, reed pen |
| M− | Musyawarah | Southeast Asian, brush |
| S+ | Dirigisme | French, rule-drawn mechanical |
| S− | Dependencia | Latin American, woodcut relief |

The design file contains the full animation system and it is correct. Implement it as specified rather than reinventing it.

### 2.2 Stroke order is the whole point

The design file's argument: drawing a brush mark as one continuous dashoffset "is the tell that no one checked." The rule per mark:

- **Shi (勢)** — 2 strokes, 力 radical order: 横折钩 to 44%, lift, 丿 from 52%
- **Musyawarah** — 4 strokes, outer strands inward, sweep last, because the line that joins them is written after the things it joins
- **Satyagraha** — 2 strokes, headline bar first, then the hanging line, as Devanagari is written
- **Dependencia** — 3 strokes, no lift, cut order with deepest first, linear timing and no easing, because a gouge does not accelerate
- **Kairos, Grotian, Concert, Dirigisme** — single continuous dashoffset. A chisel and a compass do not lift.

This is the detail that makes the set feel authored rather than generated, and it is exactly the kind of thing that gets noticed by the audience you want.

### 2.3 Timing and behaviour

- draw-on 2.4s for engraved and rule-drawn marks; 4.2s for written marks with lifts
- dot and terminal settles at 60% of the timeline
- **runs once and holds. Never loops in production.**
- frozen, unstarted, revisited, shared, printed, and reduced-motion timelines paint the finished mark
- the animation fires on **first paint of a freshly generated Foundation result only**. Nowhere else.

That last rule is the one most likely to be violated by a well-meaning implementation. The design file states the reason: "the sigil should not appear before the result, or the draw-on is spent before it pays off." Directory pages, navigation, share cards, the Map, and Explore all use static marks.

### 2.4 Two open issues to close before shipping

**Kairos and Concert are hard to tell apart below 24px.** Flagged in the design file as unresolved. Both are engraved geometric marks with circular construction. Fix before the marks enter any surface below 32px. The `ARCHETYPE_MARK_MIN_PICTORIAL_SIZE = 32` constant suggests this was anticipated; enforce it, and if a mark must appear below 32px use the code (`P+`, `R−`) rather than the mark.

**Blend presentation — Hallmark.** Primary mark at full size, runner-up as a corner assay mark. Specified in the design file, not yet implemented. This is also the natural place to express placement firmness: a blend that sits very close to its boundary should show the assay mark more prominently than one that barely qualifies.

---

## 3. The result page

### 3.1 The structural problem

Eleven `h2` sections in linear stack. The reader gets a payoff and then falls into a methods paper by section four.

### 3.2 The new shape

**Register one — the hero, one viewport, no scroll required.**

The design file's **Frontispiece** composition: identity centred above a rule, measurement in a ruled register beneath it, so the two never compete. Contents: sigil, code, variant subtitle, name, gloss, labelled 2×2 position map with posture strip, dimension measures, and the scroll cue as the last element inside the frame. Fold at 772px desktop, 844px mobile.

Mobile uses **Plate-A**: sigil ruled and inline with the code, name beside it, map and bars sharing the lower half, cue at the fold.

**Register two — the argument, three or four scroll steps.**

Each step answers one question and shows one piece of evidence. The graphic is pinned; the prose advances beside it.

1. **Why this and not its nearest neighbour.** The position map is pinned. The neighbour's cell illuminates, then the separating dimensions highlight in sequence, then the boundary distance resolves. This is where placement firmness becomes visible instead of footnoted.
2. **What is actually doing the work.** The dimension bars are pinned. The two or three dimensions carrying the result rise; the rest recede.
3. **Where this reading would break.** The pressure case. Static, prose-led, no motion. The contrast with the two animated steps is the point.
4. **Optional — how this applies by issue.** Security and Technology tilts, each with a link into the module.

**Register three — everything else, behind disclosure.** Dimension tables, modifier explanations, coverage, alternative families, methods. Present, complete, collapsed.

### 3.3 Scroll mechanics

- one `IntersectionObserver` with `rootMargin` tuned so a step activates when its prose block crosses the vertical centre
- the pinned graphic uses `position: sticky` inside a tall step container. No scroll hijacking, no scrolljacking, no custom scroll physics
- state transitions are CSS custom property changes on a container, so a step's visual state is one class and one variable
- **without JavaScript, every step renders in full, in order, with its graphic in its final state.** The steps become sections. Nothing is lost.
- `prefers-reduced-motion` collapses the transitions to instant state changes. The steps still advance; they just do not tween.
- print renders the full document with every graphic in its final state and no pinning

### 3.4 The percentile removal

**This is a required change and it rides in this work because it lives in these files.**

Both module manifests declare `calibration.status: "synthetic-diagnostic"`. There are no respondents. The result page currently renders ordinal percentiles — "88th," "61st," "44th" — and the design file's share card additionally renders "6% of respondents share this reading."

Ordinal percentiles are population statements. A footnote cannot outrank a numeral set in the largest type on the page.

Required:

- remove ordinal percentile generation from all new result rendering
- replace with instrument-relative bands built on `lib/results/dimension-bands.ts`
- delete the rarity line from every surface, including the share card, including the design file's composition
- keep the percentile code frozen and reachable for old payload rendering only

**Replacement copy, for the same three measures:**

> Institutions and rules · **high in this instrument's range**
> Security rivalry · **upper middle**
> Markets and dependence · **middle**

With one line beneath: *Positions are relative to the range this instrument can produce, not to a population of respondents.*

This is less impressive and it is the only version that is true. It also removes the product's single largest reputational exposure with a hiring manager or a faculty reviewer, either of whom will ask "88th of what?" within ten seconds.

---

## 4. The Explore rebuild

### 4.1 Why the current page cannot win

`/explore/realism` is roughly 2,200 words of prose, no images, no charts, no maps, no interaction. The observation that it reads like Wikipedia is correct, and the important consequence is that **you cannot out-reference Wikipedia.** Better prose loses. Animated prose loses. More prose loses worst.

### 4.2 What Wikipedia cannot do

**Show the tradition operating.** Take one Current Case with real sources. Show what each of the four traditions notices first, recommends, and accepts as the cost. Same facts, four readings, side by side.

**Show the reader where they sit.** If a Foundation result exists in local storage, highlight the reader's own tradition in the four-way comparison, and show the one question that most separates them from the nearest alternative. If no result exists, show the same question as an invitation.

**Show the disagreement, not the summary.** Wikipedia gives consensus description. A structured disagreement between four positions on one live case is a different artifact and a more useful one.

### 4.3 The new page shape

**Register one — the claim.** Tradition name, the one-sentence structural premise, and the two archetype marks with their postures. Static, dense, one viewport.

**Register two — the demonstration.** One case. A pinned four-column comparison. As the reader scrolls: the facts establish, then each tradition's reading enters in turn, then the reader's own position highlights if known. This is the only place motion is justified on this page, and it is justified because sequence is the content — the point is that four readings of identical facts diverge.

**Register three — the map, where a case is geographic.** Precomputed SVG from the vendored 110m geometry. Static, annotated, printable, with a semantic list beneath it carrying the same information for screen readers and for print. No pan, no zoom, no tiles, no mapbox.

**Register four — the reference.** The existing 2,200 words, restructured under disclosure: overview, core claims, subtraditions, emphases, underweightings, neighbours, reading list, evidence-coded references, how the Foundation models it. Unchanged content, demoted position.

**Register five — the authorial note.** Signed, dated, explicitly outside the instrument. One paragraph of actual opinion about what this tradition gets right and what it keeps missing. This is where the product acquires a voice, and it is safely quarantined from the measurement.

### 4.4 Why this is the same content, inverted

Nothing is deleted. The essay becomes the appendix and the demonstration becomes the page. The work is layout and one new component, not new writing, which is why it fits in a five-day sprint.

---

## 5. Cards and the homepage

### 5.1 The card audit

There are at least these card patterns in use: `explore-card`, `atlas-pattern-grid`, `resource-list-link`, `signal-list-item`, `lobby-related-grid`, `option-card`, plus inline-styled variants in `app/ai/page.tsx` that set `fontFamily`, `fontSize`, and `fontWeight` directly in JSX.

Inline styles in JSX are the tell that the card system has run out. Consolidate to three cards and delete the rest:

- **Entry card** — a thing you can start. Title, one line, time estimate, one action.
- **Reference card** — a thing you can read. Title, one line, no action styling.
- **Result card** — a thing you have. Mark, label, date, state.

### 5.2 The homepage

Currently six equal `Open X →` actions under "Choose a starting point," with a Current Case in the hero slot reviewed through 14 July 2026 and now 38 days old.

**One primary door.** The Foundation. Above the fold: what this is, what it does, how long it takes, one button.

Below that, in descending weight: the current case, then focus areas, then map and Explore. Perspective Runs and the AI Compass move into navigation until the AI rework lands, at which point the AI Compass earns a promotion because the Transfer Test gives it a reason to exist on the front page.

**Fix the freshness enforcement.** A case past its review date must not remain the lead. The V22.5 Prompt G machinery was specified for this. Either it is not wired to the homepage or the case has not been rotated. Both are one-line problems and both are visible to every visitor.

---

## 6. The Worldview Map

Not a rebuild. Three additions that make it worth looking at:

1. **Placement firmness as geometry.** The dot becomes a dot with a resolved region. A firm placement is a small region; a near-boundary placement is a large one that visibly touches the neighbouring cell. This is more honest than the current dot and it is a better picture.
2. **Blend connectors carry weight.** A blend already highlights two same-row cells with a connector. The connector's weight should reflect how close the two lenses actually were.
3. **One entry transition.** On arrival, the matrix rules draw and the reader's cell resolves. Once, 800ms, never on revisit, and the static state is fully rendered from first paint.

Everything else in the V23.2 contract holds unchanged: matrix by default, continuous projection secondary and explicit about its limits, normative state as annotation rather than position, no jitter, semantic list parity, contextual overlays off by default, legacy query compatibility.

---

## 7. Share cards

The design file has already solved this and the work is implementation.

- 1200 × 630, which is 1.905:1, so a 1.91 crop takes nothing off the height. Everything inside a 64px margin; a dashed guide marks the 4% platforms may shave.
- Every readable line at 30px or larger so nothing falls below 10px at a 400px timeline render. The URL is the single exception, since it is a destination rather than a reading.
- Tested against forced fallback stacks — Georgia, Arial, Courier New — because a mail client or a cold render will use them. No line is set to fit its box.
- At 400px the map drops its four anchor labels and the posture strip, and the gloss goes to `#F4F1EA` because `#C7D2E0` at 12px on a timeline is too quiet.
- **The rarity line is removed.** Its place in the composition goes to the archetype code and variant, or to nothing.

`app/api/card/route.tsx` already exists and generates cards. This is a rewrite of that composition to match the hero, not a new system.

---

## 8. Accessibility and quality gates

Every change in this brief must hold:

- full content at first paint with JavaScript disabled
- `prefers-reduced-motion: reduce` produces a complete, static, correct page
- keyboard reachable in document order, visible focus, no keyboard trap in any pinned region
- semantic list parity for every graphic that carries information
- 390px viewport with no horizontal overflow; 400% reflow
- print renders complete, unpinned, with graphics in final state and decorative marks excluded
- contrast: no brass text on light ground; `#3A4E6B` never used for text
- no animation loops in production
- no layout shift after first paint

---

## 9. What this is not

- not a rebrand. The navy, brass, off-white, and serif identity stays.
- not a rewrite of the archetype content. The eight pages keep their copy.
- not a scoring change. `resolveArchetype`, the scorers, the banks, the calibration, and every payload contract are untouched.
- not new modules.
- not the AI rearchitecture, which is a separate document and a separate release.
- not a percentile *computation* change. The computation stays frozen for legacy payloads. Only the new display changes.

---

## 10. Sequence within the sprint

Strict order, because each depends on the last:

1. content extraction and token unification
2. sigil animation system, including the Kairos/Concert fix
3. result hero, including the percentile replacement
4. result scroll registers
5. Explore demonstration register
6. homepage single door and card consolidation
7. share card regeneration

If the sprint runs out at step 5, that is a good outcome. Steps 6 and 7 are worth less than steps 1 through 4 and can land afterwards. If it runs out before step 3, the sprint failed, because step 3 is where the percentile defect gets closed.
