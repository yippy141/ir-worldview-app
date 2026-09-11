# Product re-foundation prototype V1

Status: non-shipping development prototype. Production routes and public
behavior are unchanged.
Route: `/dev/product-refoundation` (returns 404 in production)
Authority it answers to: `docs/roadmap/POST_V23_6_PRODUCT_RESET_STATUS.md`
section 9.

## 1. Commits

| Fact | Value |
| --- | --- |
| Base SHA (`origin/main` at dispatch) | `c3e74edbe32e921b7a346d00e12afe45073cd956` |
| Prototype implementation SHA | `a3d640bb809f535eae77807037d56980aa5ac1b5` |
| Branch | `prototype/product-refoundation` |

The branch head is the commit that adds this file. The implementation SHA above
is the commit that contains the route, the component, the copy, the tests, and
the screenshots.

## 2. Screenshots

All under `artifacts/screenshots/prototype-product-refoundation/`, regenerated
by `npm run prototype:refoundation:capture` with `manifest.json` recording
viewport, state, and reduced-motion setting for each file.

| File | What it shows |
| --- | --- |
| `1440-first-time.png` | 1440 x 1000, clean browser |
| `1440-returning.png` | 1440 x 1000, saved result and domain records |
| `390-first-time.png`, `390-first-time-full.png` | 390 x 844 viewport and full scroll |
| `390-returning.png`, `390-returning-full.png` | 390 x 844 returning |
| `1440-first-time-reduced-motion.png` | reduced-motion still state |
| `390-first-time-reduced-motion.png`, `-full.png` | reduced-motion at 390 |
| `sequence-area-*.png` (4) | the detail region for each area |
| `sequence-how-it-works.png` | expanded state |
| `sequence-returning-my-record.png` | My Record with saved work |
| `sequence-returning-draft.png` | unfinished draft continuation |
| `keyboard-1..4-*.png` | keyboard path through the four areas |

## 3. Public-name hypothesis

Rendered public name: **Worldview Atlas**, with the descriptor
`World politics · strategy · technology · AI`. `IR Worldview Inventory` and the
word `Inventory` appear nowhere in the prototype. No metadata, route, stored
record, share card, or production title was migrated.

## 4. Public architecture implemented

Four areas, one taxonomy, three places:

| Area | Holds | Entry route used |
| --- | --- | --- |
| Start | First Principles, Security, Technology, AI Governance | `/quiz` |
| Cases | live case label, historical case, From Another Seat, Futures, Map | live case destination |
| Field Guide | readings, traditions, thinkers, AI approaches, methods | `/explore` |
| My Record | saved result, domain records, unfinished draft | `/profile` |

The same four labels appear in the first screen index, the persistent
navigation, and the expanded state. `Inventory`, `World Stage`, `Atlas`,
`Perspective Runs`, and `Profile` do not appear as public nouns.

## 5. First-use flow

Brand and descriptor, then the headline `How do you explain world politics?`,
then one paragraph of 73 words, then `Begin First Principles` with
`14 questions · about 5 minutes`, then `Open a case`, then
`See how the project works`. The four-area index and one detail region sit
below, inside the first viewport at 1440 x 1000 (measured document height is
exactly 1000 for all four areas).

`Begin First Principles` links to `/quiz`. `Open a case` links to whatever
`getCurrentCaseDestination` returns, so it follows the live editorial window.
`See how the project works` expands a prototype-only region with the four
statements and one line about My Record.

## 6. First-time and returning behavior

One DOM, one order, one page. The continuation slot is always rendered and
reserves a single line, so hydration fills it without moving the index. The
Playwright suite asserts the index bounding box is identical before and after
the returning state resolves.

- Unfinished draft: `Continue First Principles · 8 of 14`.
- Saved result and no draft: `Latest result: Liberal Institutionalist · Open My Record`.
- Nothing saved: the slot stays empty and My Record reads
  `Nothing saved on this device yet.`

My Record shows the saved result name, `Saved` or `Not started` for Security,
Technology, and AI Governance, and the draft row. No scorer codes, no
relation disclaimers.

## 7. Globe behavior

The checked-in Natural Earth orthographic SVG from `lib/root/orthographic.ts`,
reused unchanged. No Mapbox import, no network request, no canvas, no country
labels, no controls, no scene carousel, no coordinates, no data points.

The prototype uses **one static brass great circle**, the equator, for every
state. Selecting an area does not move the globe. There is no rotation and no
pointer response, so the reduced-motion state is byte-identical to the default
state. At 1440 the sphere bleeds off the right edge and crosses the horizontal
rule. At 390 it crops to a dome rather than shrinking to a small full circle.

## 8. Copy inventory

All prototype prose is in `content/prototypes/product-refoundation.ts`. Nothing
is duplicated in the component. New strings: brand, descriptor, headline, the
intro paragraph, three action labels and one support line, four area labels,
four area lead lines, eighteen item labels with one line each, five My Record
labels, four works statements, one frame sentence, one device line, one
prototype note, and four continuation templates.

## 9. Production work reused

`lib/root/orthographic.ts` (globe geometry), `lib/current-cases/catalog.ts` and
`routes.ts` (live availability and destination), the live World Stage menu
labels and descriptions for the case row, `lib/quiz-schema.ts` (question count
and core IDs), `lib/storage-keys.ts`, `lib/site-shell.ts` (the existing
immersive-route convention), the bundled Spectral and Libre Franklin faces, and
the Astrolabe palette values.

## 10. Work that would become redundant if this ships

- The five-destination root menu in `components/home/root/` and its per-selection
  great-circle states in `lib/root/destinations.ts`.
- `/world-stage` as a second numbered menu. Its map would move inside Cases; its
  menu would not survive.
- The `Inventory`, `Atlas`, and `Perspective Runs` public nouns, and the
  `01 / 02 / 03` numbering in `lib/world-stage/scenes.ts`.
- The header split between five primary links and a `More` disclosure.

Nothing above is changed by this branch.

## 11. Known problems

1. `14 questions · about 5 minutes` is dispatched copy. The live Foundation says
   `about 6 to 8 minutes` for the same 14 items. One of the two is wrong.
2. Start's panel entry repeats the hero button. Start has no single production
   route, so First Principles is its only honest door.
3. Cases points at `/cases` and `/world-stage` separately. The intended single
   case and map environment does not exist yet.
4. The empty My Record state leaves roughly 230px of reserved space, the cost of
   keeping one detail region that never changes size.
5. The brass ring reads only at desktop widths. The mobile crop stops above it.
6. Prototype copy sits outside the public-copy audit scan roots, matching
   `content/root.ts`. Scanned directly it produces zero strict findings and five
   advisory ones, four for the mandated `Field Guide` label and one for a
   repeated word in the prototype note.
7. English only. No Simplified Chinese parity was attempted.

## 12. Estimated production implementation scope

If the direction is accepted: new `/start`, `/cases`, `/field-guide`, and
`/record` routes with redirects from the current public paths; one rewritten
site header; one merged Cases and map environment absorbing `/world-stage`;
Futures promoted out of the `More` menu; Simplified Chinese parity for the new
chrome; metadata, share-card, and sitemap titles reconciled with the chosen
name; and a name decision recorded before any of it. Scoring, banks, payloads,
storage, and analytics stay untouched throughout.

## 13. Owner questions

1. Does `Worldview Atlas` hold up when rendered, or is a shorter mark such as
   `Axiom` worth prototyping next?
2. Do Start, Cases, Field Guide, and My Record describe the product better than
   the current five rooms?
3. Does the first screen explain the project without reading as a SaaS homepage?
4. Does a still globe that never reacts to the menu keep enough personality? The
   alliance-colored situation-room version needs a sourced, dated alliance
   dataset before it can be built without inventing data. Does that belong
   inside Cases later?
5. Does this read as less machine-written than the current production root?
