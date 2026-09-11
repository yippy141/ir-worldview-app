# Departure draft validation

Verified 11 September 2026 in the isolated `codex/futures-departure-v2` worktree, based on main `5f3488415b667b128ff81bd8ff5aaafdb2af506d` after PR #57 merged. Existing edits in the owner's main checkout were not included.

## Completed checks

| Check | Final result |
| --- | --- |
| `npm run lint` | Pass |
| `npm run test` | 687 passed, 0 failed |
| `npm run build` | Pass, including TypeScript and the `/futures/departure` route |
| `npx playwright test --config playwright.departure.config.ts` | 4 production-browser tests passed |
| Impeccable mechanical detector | No findings on the changed Futures UI |
| Independent bounded finish review | Pass; all findings resolved |
| `git diff --check` | Pass |

The first validation pass caught internal-link lint errors, an SVG-description association, a copy-audit false positive for an SVG `V194` coordinate, and stale generated evidence summaries. Those were corrected without changing the audit rules or scoring baselines. A development-mode privacy test also observed a Next.js debug-channel storage write; final browser coverage runs the production build and verifies zero storage writes, without filtering out any keys. The production build required a sandbox escalation for its build workers.

`npm run evidence:audit` refreshed the two tracked summaries after the copy changes. The deterministic response-fixture baseline still matches; no measurement/scoring artifact baseline was rewritten. Repeated reason prompts and mutually exclusive copy variants can produce advisory copy-audit findings; no strict public-copy failure remains.

## Browser evidence

The four tests cover the full journey, no selection auto-advance, mandatory review before submission, preserved back navigation, downstream invalidation after an earlier edit, unknown reasons, policy framing, keyboard radio navigation, heading focus, confirmation safe-action focus and focus restoration, clearing drafts, reduced motion, English-only routing, and the existing twelve-card collection.

At 320, 390, 768 and 1440 CSS pixels, opening, all three comparisons, review, reading and the collection have no horizontal overflow. Screenshots are under `artifacts/futures-departure/`; [the visual walkthrough](../../artifacts/futures-departure/walkthrough.html) switches between six scenes and desktop/mobile captures. There is also an opening-and-sources PDF with the source disclosure opened before printing. Print represents the current view, not an exported answer record.

During the answer-selection and submission sequence, the production test observed **zero network requests**, no local/session-storage writes, no IndexedDB databases, unchanged cookies and an unchanged answer-free URL. Reload returns to an empty draft. This is a bounded test of these flows, not a claim about arbitrary future integrations or all browser behavior.

To reproduce browser coverage, stop the manually running preview first: the Playwright configuration starts its own production server on port 3107. Then run the build and browser commands above. The general development-server suite explicitly skips the privacy test because Next.js development tools write their own storage; all four tests execute in the dedicated production configuration (and in the general CI production suite).

## Visual review verdict

**Final disposition: Pass.** The fresh production captures resolved every finding from the finish review.

| Finding | Verdict | Evidence |
| --- | --- | --- |
| Confirmation focus and explanation | Resolved | Safe action receives focus and the explanation; cancel restores trigger focus. Production assertion passes. |
| Sticky diagram/header overlap | Resolved | 110px top clearance; complete diagram visible in desktop return capture. |
| Shelf-anchor clearance | Resolved | 110px scroll margin preserves heading visibility. |
| Incorrect mobile positional wording | Resolved | Neutral wording in current source and mobile capture. |
| Mobile diagram labels | Resolved | Larger labels and a separate return line verified at 320px. |

The page preserves Spectral/Libre Franklin, navy/brass tokens, a dominant reading column, understated option rows and a relationship diagram. No new font or package is installed. The graphic carries no timing, distance, outcome probability or personal score. No ambient motion is introduced; reduced-motion mode explicitly disables nonessential transitions within the surface.

## Contrast and asset size

Computed root colors were measured against both the navy page and selected-answer panel. Normal text ratios range from **5.25:1** (muted on panel) to **16.54:1** (primary text on page), above the 4.5:1 criterion. Inactive/disabled controls are not included in that prose-text statement. Tokens and measurements are recorded in [measurements.json](../../artifacts/futures-departure/measurements.json).

The baseline build is the clean accepted PR #57 worktree (`bd72184`), whose `app`, `components` and `lib` trees match verified main `5f34884`. Before screenshots use that existing production build. Browser-requested JavaScript is counted once per same-origin file, with gzip computed per asset; this includes shared application code and is not a network timing benchmark.

| Production route | Raw JavaScript | Gzip JavaScript |
| --- | ---: | ---: |
| `/futures`, accepted baseline | 602,055 bytes | 176,005 bytes |
| `/futures`, candidate | 602,087 bytes | 176,026 bytes |
| `/futures/departure`, new route | 615,958 bytes | 178,654 bytes |

The existing collection changes by 32 raw bytes / 21 gzip bytes. The new journey has no predecessor route; its total is 13,871 raw bytes / 2,628 gzip bytes above the candidate collection, which is a comparison between different routes rather than a precise incremental player-bundle size.

`scripts/futures/capture-departure-evidence.mjs` captures baseline screenshots, final opening viewports, an opening/source PDF and these measurements, then generates the standalone walkthrough. Set `DEPARTURE_BASELINE_BUILD` to the accepted build directory and run with the local baseline on 3108 and candidate on 3107.

## Remaining publication decisions

The story and interpretation rules are an authored draft, not externally validated research. Owner editorial approval remains the publication step. Constitutional Delegation is an outline; the other seven proposed additions received an overlap audit, not full essays. Source/status distinctions, scientific assumptions and the exact next field-guide publication are documented in [the delivery note](DEPARTURE_V01_DELIVERY.md).
