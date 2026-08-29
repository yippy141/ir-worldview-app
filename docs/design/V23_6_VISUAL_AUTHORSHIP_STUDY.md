# Visual authorship study: two roots, three type treatments, one result scroll

Status: bounded non-shipping study. Nothing here is a release candidate.
Branch: `v23-6-visual-authorship-study`
Base: `e1728b30478cb666cb26082a1cf07f0da8290462` (`main`, PR #45 integration)
Date: 2026-08-29

## What this is for

The owner has one decision to make: which direction the root should take. This
branch answers that with two working roots rather than another abstract review.
Both roots run the same content, the same menu labels, the same document order,
and the same interaction model. Only the central visual differs. A separate
plate holds the same composition in three typography treatments so the type
decision can be made without the visual changing under it. A fourth route reads
one frozen Foundation result as a single argument from payoff to limits.

The study changes no item bank, scorer, calibration, archetype resolution,
payload format, Profile storage contract, bridge publication status, Current
Case content, feature flag, database behavior, approved Chinese copy,
dependency, or lockfile. It does not replace the production root.

## Routes

All four fail closed with `notFound()` when `NODE_ENV` is production, using the
guard `app/learn/page.tsx` and `app/world-stage-prototype/page.tsx` already use.
No second guard system was introduced.

| Route | What it holds |
| --- | --- |
| `/dev/v23-6/root-atlas-globe` | Root prototype A. The existing globe in a quiet state. |
| `/dev/v23-6/root-armillary-atlas` | Root prototype B. A drawn armillary instrument. |
| `/dev/v23-6/type-plate` | The same composition in three type treatments at two widths. |
| `/dev/v23-6/result-scroll` | The Foundation result read top to bottom. |

Development-only view parameters, used to make screenshots reproducible:

- `?visitor=new` and `?visitor=returning` on either root force the visitor
  state instead of reading this browser. Without the parameter both roots read
  the real saved Foundation and the real unsent draft.
- `?type=a|b|c` on either root, and `?treatment=a|b|c` on the plate, force one
  typography treatment full screen.

Verified in a production build: all four routes answer `404`.

## The shared root contract

`lib/v23-6/root-menu.ts` is the single source for both roots.

Destinations, in document order:

1. **Inventory** (dominant) → `/quiz`. Foundation, Security, Technology, AI Governance.
2. **World Stage** (medium) → `/cases`.
3. **Atlas** (medium) → `/explore`.
4. **Perspective Runs** (quiet) → `/perspectives`.
5. **Profile** (quiet) → `/profile`.

**Dispatches is absent.** No public piece exists, and an empty public
destination would be a promise the site cannot keep. It is omitted from both
prototypes rather than rendered as a shell.

Hierarchy is carried by size, weight, and color, not by repeated furniture.
There is exactly one hairline in the whole list, and it marks where the quieter
group begins. No item carries an index. No item except the active one carries
prose. The four non-active destinations are label only, so no two of them share
a grammatical subtitle pattern.

Selection state drives both the explanatory panel and the central visual from
the same React state. Neither root autoplays a scene, and neither cycles.

For a new visitor Inventory is dominant. For a returning visitor the
information architecture and document order are identical, and a resume line
plus a Profile mark appear after hydration. The slot that holds them is
reserved at every breakpoint so the menu never moves.

### Two hosting notes

- `lib/site-shell.ts` now treats the four study routes as immersive, so the
  site chrome does not wrap them. That is the only edit to an existing file.
- The immersive shell floats the locale control at the top right. Both roots
  and the result page leave room for it.

## Root prototype A: Atlas Globe

Uses the existing Mapbox globe, the existing `mapbox-runtime` module, the
existing scene records, and the existing role colors.

What the root state removes: place labels, the layer panel, zoom controls,
tooltips and source inspection, the scene metadata block, scene cycling, and
globe spin. What it keeps: land geography, one selected overlay, and the
legally required attribution.

The one overlay belongs to World Stage, because World Stage is the destination
that owns the map. Selecting World Stage moves the camera to the reviewed
Pacific alliance scene and fills only the country roles that scene assigns. No
nodes and no flow network are drawn at the root. A single caption line names the
scene and its reviewed-through date. Every other destination shows land and
graticule only.

The drawn base is an orthographic SVG built from the same checked-in Natural
Earth 1:110m boundaries the World Stage fallback map already uses. It carries
the same single overlay, so the caption never names a layer that is missing.
Mapbox fades in over it when a token, a WebGL context, and a successful style
load are all present, and the attribution appears on exactly the same flag that
reveals the Mapbox canvas.

## Root prototype B: Armillary Atlas

A drawn instrument. Everything on it is graticule, one great circle, or
coastline from the same Natural Earth file. No star field, no constellations,
no neon, no glow, no telemetry, no coordinate readout, no HUD.

Exactly one ring is drawn at a time. Its half behind the sphere is kept faint so
the ring reads as encircling the globe rather than crossing it. The destination
selects which great circle is drawn and where the brass arc sits on it; the arc
is centred on the part of the ring that faces the viewer, offset per
destination, so it can never land behind the sphere.

When a saved Foundation exists, its registered archetype mark is drawn inside
the sphere at low opacity. A blend never collapses into one pictorial mark: if
the saved reading is a blend, the blend name is shown and no mark is drawn.

Motion is one slow rotation of the ring group, 240 seconds per turn. Under
`prefers-reduced-motion` the animation is `none` and the still state carries the
whole instrument.

## Result scroll prototype

Source: the frozen Foundation token already registered as the saved Foundation
of `tests/fixtures/profile-store-v5.json`. A unit test asserts the two stay
byte-identical, so the study cannot drift onto an invented result. The token
resolves to **Concert (R−)**, closest modeled tradition Liberal Institutionalist,
nearest alternative Social Constructivist, one active matrix cell.

Document order, all of it present without script:

1. **Payoff.** The registered hero mark, the archetype name, the code, the
   closest modeled tradition, one substantive interpretation, an
   ordinary-language placement statement, the categorical archetype matrix, and
   one action.
2. **Why this result.** The nearest alternative, the family-score gap against
   the threshold that would report an undifferentiated placement, the authored
   separation sentence, the two dimensions doing the separating, and what would
   move the reading.
3. **What carried the result.** All seven dimension bars. The three that moved
   furthest from the midpoint keep full contrast and show their score; the other
   four are drawn back and show no number.
4. **Decisive choices.** Answer-trace only. See below.
5. **Across the four domains.** Foundation, Security, Technology, and AI
   Governance as four separate records with their own dates. No combined score.
   No similarity inference.
6. **Where this reading may fail.** The strongest objection, the under-modeled
   coverage statement already authorized on the production result page, and one
   reviewed case that would test the reading. No motion in this section.

### Decisive choices, and why it is usually empty

A Foundation result link carries seven dimension scores and the reading they
resolve to. It carries no item answers. The frozen study token is a legacy v2
token, so the section renders the truthful unavailable state on first load, and
says why in reader language.

The section fills in only from the unsent Foundation draft in this browser, and
only when those answers recompute, through the repository's own scorer, to the
same archetype and family the page is displaying. If the draft resolves to a
different reading, the section says so and names what the draft resolves to
instead, rather than attributing choices to a result they did not produce.

When it does fill in, each entry names the scenario item, the option taken, the
strongest rival option, and the dimension on which the two options disagree most.
`artifacts/screenshots/v23-6-visual-authorship-study/result-scroll-answer-trace-1440.png`
shows that state with a draft that genuinely resolves to Concert.

### Cross-domain honesty

Module manifests carry `bridges: []`, and the authoring validator rejects any
bridge whose `publication` is not `internal`. There is therefore no authorized
reviewed bridge record to publish. The section says plainly that no combined
score and no reviewed link between a domain axis and a Foundation dimension is
published, so a similar-looking pair of results is not evidence that the two
measure the same thing.

## Typography plate

The plate renders the identical composition, with the still armillary and the
returning-visitor state forced, so the only variable is type.

### A. Corrected current stack

Newsreader for the editorial voice, Archivo for the whole interface, Space Mono
for the one saved-date stamp. No tracked uppercase. No numbered menu indices.
Display size `clamp(2.6rem, 5.4vw, 4.4rem)`.

### B. Personal-site continuity

Measured from `https://jhyip.com` on 2026-08-29:

| Role | Live value on jhyip.com |
| --- | --- |
| Serif | `Spectral`; H1 at 30.4px / 500 / `-0.025em` / 1.08 leading; wordmark 24px / 400; item titles 20px / 400; captions 14px / 400 |
| Sans | `Libre Franklin`; body 15px / 400 / 1.625; nav 15px; locale control 13px; small labels 12px |
| Mono | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`. No mono web font is loaded. |
| Tracked uppercase | None anywhere on the page |
| Display scale | H1 is about twice body |
| Palette | `--paper #f4f0e6`, `--ink #1e1a16`, `--oxblood #7e2b22`, `--tide #356b66`, with a deep near-black front door |

The relationship, not the page, is what treatment B reproduces: the serif does
more work than in the current app, carrying the wordmark, the heading, and the
menu items; the sans stays small and quiet and never grows; the display scale is
restrained; the mono is the system stack. Newsreader and Archivo stand in for
Spectral and Libre Franklin, so the study adds no font file and copies no font
file. The live site has drifted from `CONSTITUTION` §3.2, which still names IBM
Plex Sans and IBM Plex Mono; Spectral is listed there as an approved serif swap,
Libre Franklin is not listed at all.

### C. Single-family modernist

Archivo across every role. Hierarchy from a wide scale range, a 300 display
weight, whitespace, and one left alignment. No mono role exists, so the saved
date is set in the same family at a smaller size.

### Comparison

| | A. Corrected current | B. Personal-site continuity | C. Single-family modernist |
| --- | --- | --- | --- |
| Distinctiveness | Medium. It is the current identity done correctly, so it reads as this product and not as a template. | High. The serif-forward menu is unusual for an interactive and ties the product to the author. | Low to medium. Clean, and closest to the large-light-sans look many AI-assisted pages produce. |
| Readability | Highest of the three. The sans interface at 17px is the most legible menu. | Good, and the smallest. The 15px sans and the serif menu items reward a calm reader and punish a hurried one. | Good. The 300 display weight loses contrast on navy at large sizes. |
| Relation to the personal site | Weak. Different serif role, different sans, different mono. | Direct. Same relationships, different families. | None. |
| AI-template risk | Low. Newsreader plus Archivo plus a mono evidence layer is a deliberate stack. | Lowest. A serif-carried menu is not a default anything. | Highest. Large light sans, wide tracking range, one family. |
| Chinese compatibility | Unchanged. The `html:lang(zh-Hans)` rules in `app/globals.css` already swap to Songti and PingFang. | Unchanged, same mechanism. | The single-family claim does not survive. Archivo has no CJK coverage, so Chinese falls back to PingFang and the composition becomes two families anyway. |
| Implementation cost | Lowest. Token rebinding only; no new files, no new fonts. | Low. Same three bundled fonts, rebound roles, plus a system mono stack. The risk is editorial, not technical: the serif menu has to be checked against every existing surface. | Low technically. Higher in review, because every surface that currently uses the serif for editorial voice would have to be re-argued. |

No winner is selected here. The plate and these rows exist so the owner can pick.

## Evidence

All screenshots are in
`artifacts/screenshots/v23-6-visual-authorship-study/`. Captured against the
local development server at 1440, 768, and 390 CSS pixels, with the development
overlay hidden.

| Concern | Evidence |
| --- | --- |
| Root A, new visitor | `root-atlas-globe-new-{1440,768,390}.png` |
| Root A, returning visitor | `root-atlas-globe-returning-{1440,390}.png` |
| Root A, World Stage overlay | `root-atlas-globe-world-stage-selected-1440.png` |
| Root A, no Mapbox token | `root-atlas-globe-tokenless-1440.png` |
| Root A, reduced motion | `root-atlas-globe-reduced-motion-1440.png` |
| Root B, new visitor | `root-armillary-atlas-new-{1440,768,390}.png` |
| Root B, returning visitor | `root-armillary-atlas-returning-{1440,390}.png` |
| Root B, World Stage selected | `root-armillary-atlas-world-stage-selected-1440.png` |
| Root B, reduced motion | `root-armillary-atlas-reduced-motion-1440.png` |
| Result, first viewport | `result-scroll-first-view-{1440,768,390}.png` |
| Result, whole page | `result-scroll-full-{1440,768,390}.png` |
| Result, reduced motion | `result-scroll-reduced-motion-full-1440.png` |
| Result, answer trace present | `result-scroll-answer-trace-1440.png` |
| Result, print | `result-scroll-print.pdf` and `result-scroll-print-preview.png` |
| Typography plate | `type-plate-1440.png`, `type-treatment-{a,b,c}-{1440,390}.png` |

`result-scroll-reduced-motion-full-1440.png` is byte-identical to
`result-scroll-full-1440.png` (SHA-256
`581f17b3cd5ecd4b54694f7857e2d1c3285fffa0e9be1569830bc3bc8168cb07`). The
reduced-motion page is the same complete page, not a degraded one.

### Read order

Both roots present, in this order: the brand link, the `h1`, the resume slot,
the `Destinations` navigation with five links, the active panel with its
explanation and one action, the figure, the secondary navigation, and the
prototype stamp. The figure carries no accessible name on the armillary root.
On the globe root it carries only the scene caption and the attribution links.

The result page presents the eyebrow, the hero mark as `img "Concert, R minus"`,
the `h1`, the identity line, the interpretation, the placement statement, the
action, then the matrix region, then each section in the order printed above.

### Keyboard path

On either root, from a fresh load:

`Skip to content` → locale control → brand → resume link (returning visitor
only) → Inventory → World Stage → Atlas → Perspective Runs → Profile → the
active panel's action → the four footer links.

Focus selects. Moving focus onto a destination updates both the explanatory
panel and the central visual, and this was verified for all five destinations on
both roots.

### Contrast

Every color is an existing `DESIGN.md` token. Measured against `--bg #0a1322`:

| Token | Ratio |
| --- | --- |
| `--text` | 16.54:1 |
| `--text-2` | 12.15:1 |
| `--accent` | 8.29:1 |
| `--steel` | 7.77:1 |
| `--muted` | 6.05:1 |
| `--faint` | 5.38:1 |

`--accent-dim` measures 4.76:1 and is used only for a 1px underline and the
faint ring stroke, never for text. Print colors measure 18.50:1, 13.21:1, and
7.39:1 on white.

### Bundle comparison

A production build cannot serve these routes, so there is no production bundle
for them. The comparison below is the development-server measurement of route
JavaScript, warmed first so compilation does not distort it, plus the production
figure for the shared Mapbox chunk.

| Route | Scripts | Route JS | Mapbox chunk |
| --- | --- | --- | --- |
| `/dev/v23-6/root-armillary-atlas` | 21 | 5069 KiB | none |
| `/dev/v23-6/root-atlas-globe` | 25 | 8110 KiB | 3020 KiB |
| `/dev/v23-6/root-atlas-globe`, no token | 22 | 5091 KiB | none |
| `/dev/v23-6/result-scroll` | 18 | 4761 KiB | none |
| `/dev/v23-6/type-plate` | 21 | 5138 KiB | none |
| `/` (current production root) | 23 | 7265 KiB | 3020 KiB |

In the production build of `/`, route JavaScript is 2662 KiB decoded across 13
chunks and the Mapbox chunk is 1774 KiB of that, so the map is about 67 percent
of the current root's JavaScript. The armillary root does not load it at all.
The globe root loads it lazily, after hydration, only when a token and a WebGL
context are present.

### Mapbox behavior without a token

Verified by removing `NEXT_PUBLIC_MAPBOX_TOKEN` and restarting:

- The `mapbox-runtime` dynamic import is never called, so the Mapbox runtime
  chunk is not fetched.
- Zero requests reach `mapbox.com`.
- No canvas is created and `data-map-ready` stays `false`.
- No attribution is rendered, which is correct, because no Mapbox tile is drawn.
- The drawn orthographic base stays visible with land geography and graticule,
  and carries the one reviewed overlay when World Stage is selected.

Separately: the local Mapbox token is URL-restricted. It authorizes
`localhost` but rejects `127.0.0.1`, so a live map appears at
`http://localhost:3210` and fails closed to the drawn base at
`http://127.0.0.1:3210`. Both states were captured.

### Copy inventory

Newly authored prototype copy, in full:

| Where | Text |
| --- | --- |
| Orientation | Choose where to start. |
| Menu labels | Inventory. World Stage. Atlas. Perspective Runs. Profile. |
| Actions | Start the Foundation. Open recent cases. Open the Atlas. Open Perspective Runs. Open Profile. |
| Panel contents | Foundation. Security. Technology. AI Governance. Recent Cases. Traditions. Decision Patterns. Public positions. Thinkers and reading. |
| Explanations | Five, one per destination, 53 to 62 words each. Enforced at 30 to 80 words by test. |
| Resume line | Your saved Foundation reads as {name}. Saved {date}. Open your saved result. |
| Draft line | You have an unfinished Foundation with {n} answers on this device. Resume the Foundation. |
| Prototype stamp | Prototype. Not the production root. |
| Result section headings | Why this result. What carried the result. Decisive choices. Across the four domains. Where this reading may fail. |
| Result leads and empty states | Six paragraphs, listed in the source of `result-scroll.tsx` and `result-scroll-local-records.tsx`. |
| Plate | One page introduction and three treatment notes. |

Everything else on the result page is existing authored content resolved
through the existing helpers: the archetype name and gloss, the canonical
result explanation, the separation sentence, the what-would-change sentence, the
why-this-result bullets, the main tension, the rival argument, the case test,
and the under-modeled coverage statement copied verbatim from the production
result page.

The strict public-copy audit reports 0 blocking findings, and the new copy adds
zero new advisory signals: `artifacts/evidence/current-summary.md` is unchanged.
Two rewrites were made to reach that: the World Stage explanation lost a
repeated three-part list and a second use of map language, and one Atlas
contents label dropped the phrase "field guide".

## Known failure modes

1. **The panel's contents links are hard to reach with a keyboard.** Focus
   selects, so by the time Tab reaches the panel, the active destination is
   always Profile. Inventory's four contents links are reachable by pointer but
   not by a straight Tab pass. Two remedies: move destination selection to arrow
   keys with a roving tabindex so Tab leaves the menu into the matching panel,
   or drop the contents list and keep only the single action.
2. **The categorical matrix does not fit the first viewport at 390.** The
   payoff does: mark, name, code, tradition, interpretation, placement, and
   action all sit above 812px. The matrix begins immediately below the fold
   because the shared component's narrow-screen form is a single eight-entry
   list about 1500px tall. Remedies: a compact mobile form of the matrix, or a
   different first-viewport visual under 768.
3. **The shared matrix restates the reading.** `ArchetypeMatrix` renders its own
   "Your Foundation reading" block with the code, the name, the normative label,
   and the gloss. Beside a hero that already names the archetype, that is a
   duplicate. The prototype removed the gloss and the normative label from the
   hero to reduce it. A production adoption should suppress one of the two.
4. **A hover-selected menu inside a vertically centred column oscillates.** The
   first build centred the menu region; changing destination changed the panel
   height, re-centred the region, and slid a different item under a stationary
   cursor, which flipped the selection back. Fixed by anchoring the menu from
   the top and reserving a minimum panel height. Any production version that
   selects on hover must keep the menu's position independent of panel height.
5. **The reserved resume slot costs whitespace.** Reserving 136px under 420px
   and 88px above 768px keeps the menu still through hydration, and a new
   visitor sees that space empty. Reservation was chosen over movement because
   the menu is also the hover target.
6. **The live map state is environment-dependent.** With the current token, the
   globe root shows tiles at `localhost` and the drawn base at `127.0.0.1`.
   Reviewers must be told which host they are on.
7. **World Stage has no hub route.** The destination points at `/cases`. The
   reviewed map with its controls and source inspection currently lives on the
   production root, so a real adoption needs a World Stage page to move it to.
8. **`getFlipAnalysis` produces "A identity and legitimacy score…".** The
   article is wrong before a vowel. The prototype avoids that helper, and the
   defect is in `lib/result-helpers.ts` on `main`, not in this branch.

## Implementation estimate

Both estimates assume the shared root contract, the copy, and the responsive
work in this branch are reused, and exclude research and editorial review.

**Root A, Atlas Globe.** Three to five days. The map work is already done and
the quiet configuration is small. The cost is elsewhere: building a World Stage
destination to hold the controls, inspection, sources, and scene records that
the root gives up; deciding the token failure story for a root that is now the
front door; and keeping the 1774 KiB Mapbox chunk off the critical path on
mobile. Ongoing cost is a Mapbox dependency on the most-visited route.

**Root B, Armillary Atlas.** Two to four days. All geometry is pure functions
over data already in the repository, so it is unit-testable and has no runtime
dependency. The cost is authorship: the ring choice, the arc placement, and the
sigil treatment are editorial decisions that need one round of owner review each,
and the object has to stay interesting without acquiring decoration. Ongoing
cost is near zero.

**Result scroll.** Four to six days to production, dominated by the two
findings above: a mobile form of the categorical matrix, and resolving the
duplicate reading block. The answer-trace section is the largest genuine
addition and it is already gated correctly.

**Typography.** Treatment A is a token rebind, under a day. Treatment B is also
a token rebind but needs a pass over every existing surface where the serif and
sans roles would swap. Treatment C would require re-arguing the editorial voice
across the product and is the most expensive despite being the simplest CSS.

## Test results

| Check | Result |
| --- | --- |
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm run validate` | Pass, no blocking measurement failures |
| `npm run copy:audit:strict` | Pass, 0 blocking findings, 664 signals |
| `npm run evidence:audit:check` | Pass, artifacts unchanged |
| `npm run test` | Pass |
| `npm run build` | Pass |
| `npx playwright test e2e/v23-6-visual-authorship-study.spec.ts` | Pass, 25 of 25 |
| `git diff --check` | Clean |

## No production recommendation

The comparison above does not support one. The two roots differ on a tradeoff
the owner has to price: whether the front door should keep a live geographic
map, with its dependency, its token failure modes, and its bandwidth, or whether
a drawn instrument carries the same atmosphere at near-zero cost. That is a
product judgment, not a measurement, and this study exists so it can be made
against two working pages instead of a description.
