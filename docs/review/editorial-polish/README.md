# Editorial polish and homepage behavior

18 September 2026. Isolated branch from `main` at `6c19e41`, after verifying PR62 and PR63 were merged. No deployment or merge. Existing checkouts and personal browser storage were not used as fixtures or modified.

## What changed

- Bare `/` and `/zh` open the centered entrance even after a previous visit or with saved work. Explicit `#menu` / `#map-details` entries and Back from child routes retain the menu. Existing local results remain available after Enter.
- Enter moves the same mounted globe over 650ms. Menu text fades in over 360ms after a 90ms delay. Actions and focus remain immediately available; reduced motion gets the final layout immediately.
- Fifteen imagined scenes replace ten, with 5.5-second holds instead of eight seconds. The 140-second camera revolution is unchanged. New scenes concern coastal resilience, energy bargains, digital borders, food and water, and polar routes. These remain fictional artwork, separate from documented membership maps and questionnaire answers.
- AI Futures replaces the product label Futures; Chinese menu labels say AI 未来. Routes and storage identifiers are unchanged. Worldview Map is second in the Library group.
- Removed terminal periods from editorial headings and recovery-state titles. Complete questionnaire statements, ordinary prose, citations and source titles retain their punctuation.
- Corrected heading/body gaps in shared reading layouts, empty Profile, Cases, Method, archetype source sections, home captions and map introductions. Thinkers now uses readable editorial rows instead of squeezing each two-column item into a two-column grid. Spectral, Libre Franklin and the navy/brass palette are retained.
- Rewrote 104 interpretation passages across the eight archetype essays. For example, “commitments repeatedly collapse for want of enforceable backing” now reads “agreements keep failing because breaking them has no consequences.” “Sustained reciprocal compliance without coercive backing” becomes “governments reliably keep agreements without threats or penalties.” Policy instincts and reflection questions use bullets rather than numbers implying a sequence. Historical source claims and instrument wording were preserved.
- Replaced obsolete Decision Pattern names embedded in prose with their current public names, and simplified additional AI and pattern explanations. “The case, the objection, and the test” becomes “Where this approach helps and falls short”; “Three equal-weight orientations” becomes “Order and justice.”
- Added sourced reading essays for Hedley Bull, Elinor Ostrom, Amitav Acharya and Amartya Sen. The library has eight thinkers. Each new essay links its actual source and declares the scope consulted. They have no invented dimension estimates, map positions or claimed independent coding review. Chinese routes show the existing translation-status notice and a link to English.

## Map diagnosis

The Institutionalist patterns were present: four of the ten authored Decision Patterns are related to Institutionalism. The continuous view projected their five-axis fingerprints while also labeling areas of the plot as traditions. That made an empty-looking “Institutionalism” area appear to mean the library had no Institutionalist examples. It also suggested that Decision Patterns and the eight result sigils were the same classification.

The continuous view now omits those misleading tradition anchors and explains that position follows the plotted axes while color identifies the related tradition. The list retains all ten patterns and all four Institutionalist entries. The eight-sigil matrix remains the default. No fingerprints, projection coordinates, scoring or payload formats changed.

## Visual evidence

`before/` captures the prior PR63 production build (`aab1723`), whose app, components, lib, content and public trees were verified identical to merged main `6c19e41`. A cloned build was served separately; the prior checkout was preserved. `after/` captures the candidate production build. Both use empty isolated browser contexts, reduced motion, blocked non-GET/HEAD requests and a 1000px viewport height.

| Surface | Before | After |
| --- | --- | --- |
| Menu, 320px | [before](before/menu-320.jpg) | [after](after/menu-320.jpg) |
| Menu, 390px | [before](before/menu-390.jpg) | [after](after/menu-390.jpg) |
| Menu, 768px | [before](before/menu-768.jpg) | [after](after/menu-768.jpg) |
| Menu, 1440px | [before](before/menu-1440.jpg) | [after](after/menu-1440.jpg) |
| Archetype, 320px | [before](before/archetype-320.jpg) | [after](after/archetype-320.jpg) |
| Archetype, 390px | [before](before/archetype-390.jpg) | [after](after/archetype-390.jpg) |
| Archetype, 768px | [before](before/archetype-768.jpg) | [after](after/archetype-768.jpg) |
| Archetype, 1440px | [before](before/archetype-1440.jpg) | [after](after/archetype-1440.jpg) |
| Thinkers, 320px | [before](before/thinkers-320.jpg) | [after](after/thinkers-320.jpg) |
| Thinkers, 390px | [before](before/thinkers-390.jpg) | [after](after/thinkers-390.jpg) |
| Thinkers, 768px | [before](before/thinkers-768.jpg) | [after](after/thinkers-768.jpg) |
| Thinkers, 1440px | [before](before/thinkers-1440.jpg) | [after](after/thinkers-1440.jpg) |
| Grotian print | [before](before/archetype.pdf) | [after](after/archetype.pdf) |
| Keohane print | [before](before/thinker.pdf) | [after](after/thinker.pdf) |

The first responsive scan exposed specific zero-gap heading/body pairs; the correction pass passed the 32-route sweep at 320, 390, 768 and 1440px. Desktop and mobile screenshots were visually inspected. Printed pages were rendered and checked for readable text, sources and marks. The existing long Keohane evidence section still produces several print pages; this work does not redesign that output.

No color tokens changed. The Impeccable detector ran once over changed UI files and reported only three existing Arial declarations in the Current Case print stylesheet. These are retained print fallbacks, not new screen typography. Keyboard focus, immediate Enter availability, interruption, Back, direct hashes, storage-blocked behavior, no-JS and reduced motion are covered by the root and reading suites.

## PM / editorial follow-up

1. **Current-case schedule:** no catalog case is currently active. Two are marked review-due and one background. The page correctly falls back to recent cases. Choose a refresh/publication cadence and research owner; do not extend dates merely to restore the label.
2. **Grotian terminology:** the existing name note explains that this product uses the name differently from the rationalist middle of Martin Wight’s three traditions. That can confuse readers with prior IR training. The owner should decide whether to keep the convention with its explanation. This PR makes no rebrand or taxonomy revision.
3. **Thinker coverage:** the four additions are English reading essays. Chinese editorial review and any future independent numeric coding are separate work. Do not imply that these thinkers now have scored results or map positions.
4. **Decision Patterns versus results:** the labeling defect is fixed, but the underlying map remains a projection rather than family buckets. If the owner wants patterns grouped categorically under sigils, specify that as a separate product/methodology decision instead of moving points until they look right.
5. **Copy maintenance:** automated copy checks flag patterns, not whether a sentence is understandable. Review composed reading pages with concrete before/after edits. A strict audit passing is not a claim that every sentence across both languages has received a new human editorial review.

## Verification

See the final PR checks and head SHA for the authoritative CI outcome. Local check results are recorded in `verification.md`. Earlier failures were stale expected text after intentional title changes, a regenerated evidence summary, and one development-server run interrupted by disk exhaustion. Only this task’s generated development cache was removed. Tests continue to use synthetic fixtures; no personal result links, PDFs or answer traces are included.
