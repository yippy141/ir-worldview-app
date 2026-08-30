# V23.6 production conversion release index

This index records the reviewed evidence and required release gates for the V23.6 candidate. The exact base is `68806043ea83fad425f0db8f3507704a4aad3f7d`. The generated manifest records capture parent `6860a99c87da9fa4c4beca5c1aa89e8219c6fed5` plus the dirty candidate file list; the final third-commit SHA belongs in the PR handoff because embedding it in its own commit is impossible.

## Release gates

All commands below were run from the production-conversion branch on 2026-08-30.

| Gate | Result | Recorded detail |
| --- | --- | --- |
| `npm run typecheck` | Pass | TypeScript emitted no error |
| `npm run validate` | Pass | 147 unique instrument item IDs; blocking measurement-gate failures: 0 |
| `npm run copy:audit:strict` | Pass | 666 signals reviewed; strict blocking findings: 0 |
| `npm run evidence:audit:check` | Pass | Checked-in UTF-8 evidence exactly matched fresh generation |
| `npm run lint` | Pass | ESLint emitted no error |
| `npm run test` | Pass | 644/644 tests |
| `npm run build` | Pass | Optimized production build; 152 static pages generated |
| `CI=1 npm run test:e2e` | Pass | 122/122 Chromium tests |
| `git diff --check` | Pass | No whitespace error |

## Visual and browser evidence

The [generated manifest](artifacts/manifest.json) records routes, states, viewports, and the capture assertions for 25 artifacts.

| Required state | Evidence |
| --- | --- |
| Root before, 390 / 768 / 1440 | [390](artifacts/root/before-390.png), [768](artifacts/root/before-768.png), [1440](artifacts/root/before-1440.png) |
| Root after, new state, 390 / 768 / 1440 | [390](artifacts/root/after-new-390.png), [768](artifacts/root/after-new-768.png), [1440](artifacts/root/after-new-1440.png) |
| Root returning state | [390](artifacts/root/after-returning-390.png), [1440](artifacts/root/after-returning-1440.png) |
| World Stage | [1440 local fallback](artifacts/world-stage/world-stage-1440.png) |
| Low-differentiation core result | [1440](artifacts/results/low-differentiation-core-1440.png) |
| Clearer pure result | [1440](artifacts/results/clearer-pure-1440.png) |
| Blend | [1440](artifacts/results/blend-1440.png) |
| Shared result without local evidence | [700](artifacts/results/shared-evidence-unavailable.png) |
| Exact local evidence present | [700](artifacts/results/local-evidence-present.png) |
| Profile without / with domain record | [without](artifacts/profile/without-domain-records-1440.png), [with](artifacts/profile/with-domain-records-1440.png) |
| Simplified Chinese root / result | [root 390](artifacts/zh/root-390.png), [result 390](artifacts/zh/result-390.png) |
| Reduced motion | [1440](artifacts/motion/reduced-motion-result-1440.png) |
| Print | [three-page A4 PDF](artifacts/print/foundation-result.pdf) |
| Accessibility and read order | [JSON notes](artifacts/accessibility/read-order.json) |
| Clean root network | [candidate HAR](artifacts/network/root-clean.har), [candidate JSON](artifacts/network/root-clean.json), [baseline HAR](artifacts/network/baseline-root-clean.har), [baseline JSON](artifacts/network/baseline-root-clean.json) |
| Bundle and browser transfer | [root comparison](artifacts/performance/root-comparison.json) |

The print PDF is A4, three pages, unencrypted, and contains no embedded JavaScript. Visual review found complete chapters and no clipping. The final page has deliberate whitespace after the limits and continuation sections.

The accessibility record reports seven ordered chapters, seven chapter-local visuals, one scroll-led region, five ordinary root links, no tab semantics, no root-detail interactivity, and no horizontal overflow. Desktop visuals are sticky in their own chapter order; mobile, reduced-motion, JavaScript-disabled, and print presentations remain complete and linear.

## Root performance

The table uses the attached clean Chromium and local-build comparison. Browser cache was disabled and service workers were blocked. Negative percentages are reductions from the exact baseline.

| Root measure | V23.6 | Exact baseline | Change |
| --- | ---: | ---: | ---: |
| Client-reference JS, raw | 133,203 B | 447,933 B | -70.26% |
| Client-reference JS, gzip estimate | 38,091 B | 140,262 B | -72.84% |
| Client-reference JS, Brotli estimate | 33,528 B | 114,058 B | -70.60% |
| Browser-requested JS, raw | 589,967 B | 904,697 B | -34.79% |
| Browser-requested JS, gzip estimate | 170,144 B | 272,315 B | -37.52% |
| Browser-requested JS, Brotli estimate | 147,363 B | 227,893 B | -35.34% |
| Clean browser transfer, all resources | 351,942 B | 499,344 B | -29.52% |
| Clean browser transfer, JavaScript | 176,094 B | 279,721 B | -37.05% |
| Route font files, raw | 73,612 B | 219,488 B | -66.46% |
| Clean browser transfer, fonts | 75,648 B | 137,045 B | -44.80% |

The candidate root requested no Mapbox resource, loaded no JavaScript file containing a Mapbox signature, created no canvas, required no token, and rendered one checked-in geographic SVG. The computed body family matched a registered, loaded Libre Franklin face; the active menu family matched a registered, loaded Spectral face. All font resources were self-hosted.

## Protected surfaces

The diff from the exact base is empty for the Foundation, Security, Technology, and AI banks; scorers; calibrations; payload codecs; public share formats; stable IDs; and legacy decoders. No database, account, analytics activation, research collection, or public payload field was added.

## Contribution proof

For each exact current V2 result tuple, the displayed primary-versus-runner contribution is calculated per dimension as:

`((dimension score - registered calibration mean) / registered calibration SD) * (primary family weight - runner-up family weight)`

The deterministic tests reconstruct both live family totals, preserve each contribution sign and order, reconcile the unrounded pair difference, and explicitly bridge the independently rounded displayed scores with a residual no greater than 0.01. Raw distance from 4 is used only as extremity and never as classification contribution. Legacy tuples fail closed.

## Local evidence contract

At result generation, the browser derives no more than three records from the exact submitted form. The versioned local envelope is bound to canonical payload SHA-256, bank version, scorer version, calibration ID, copy version, question-set/form ID, mode, family, runner-up, modifiers, archetype/blend code, completion locale, and an exact local completion ID. Records contain only approved item/option labels and scorer-derived counterfactual separation; they do not contain the raw answer set.

The payload and URL remain unchanged. No answer or evidence record is sent to a server. Shared, legacy, deleted, locale-mismatched, or tuple-mismatched records show an unavailable state. Current and history Profile links restore only the exact one-shot local binding. Exact deletion helpers and the global Privacy clear remove associated evidence; this release does not add a separate per-Foundation deletion control.

## Evidence limits

- World Stage was captured in its complete local SVG fallback because the local build had no valid Mapbox token. Live-canvas attribution still needs re-verification in a valid-token environment.
- The screenshots and deterministic fixtures are release evidence, not human-participant data.
- The robustness diagnostic supports structural-sensitivity statements only. It makes no reliability, validity, or population claim.
