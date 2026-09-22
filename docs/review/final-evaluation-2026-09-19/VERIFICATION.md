# Verification, coverage and review of delegated work

## Version and isolation

The user's working directory was on `dc1e95f` and contained an untracked `Claude outputs/` folder. It was not updated, reset, cleaned or used to test an obsolete version as though it were production.

PR 63 merged at `6c19e4125228767a25b6660d29c636cc9a41ddb0`. The live deployment inspected during this audit was PR 64's merge `b49365f79bdd4306fbe62d9f8ee2e48f130f5008`. The isolated source used branch commit `6c713ccf42d200deaf564d87518349f31e62c43e`; GitHub confirmed its tree and the production merge tree were identical: `5582b768a72469120743f3725ab383a4e8e133f2`.

Source and test runtime were prepared under `/private/tmp/ir-final-audit-20260919/source`. Existing installed dependencies were copied into that isolated tree, including the already locked d3 packages required by PR 64. No application dependencies were added and no package manifest or lockfile was changed. The report folder is the only new workspace deliverable.

Production was inspected through ordinary page loads and synthetic browser answers. No email, feedback, research response, public post, purchase, account change or deployment was submitted. Browser-local test results are synthetic and are not the user's opinions. A local production server on port 3319 was used for the full browser suite and additional storage probes.

## Final checks

| Check | Final result | Evidence |
|---|---|---|
| `npm run lint` | Pass | `evidence/pr64-lint.log` |
| `npm run test` | 745 passed, 0 failed | `evidence/pr64-test.log` |
| `npm run build` | Pass | `evidence/pr64-build.log` |
| `npm run test:e2e` against the isolated production server | 218 passed | `evidence/pr64-e2e.log` |
| Additional browser observations | 4 passed after correcting a probe's punctuation expectation | `evidence/behavior-probes.log` |
| Live HTTP/text/internal-link inventory | 210 routes: 208 HTTP 200, two HTTP 404 | `route-coverage.csv` |
| Source text extraction | 477 files, 102,604 lines, 11,641 candidate fragments | `source-file-coverage.csv`, `evidence/source-copy-inventory.json` |
| Reviewed candidate scanner | 851 flagged fragments | `copy-candidates.csv` |
| Deliberate source-copy judgments | 61 located passages, plus live-page edits | `COPY-REVIEW.md`, `reviewed-copy.csv` |

The existing suite includes sharing, locale compatibility, invalid and legacy links, one-shot evidence, storage clearing, module/AI results, responsive layouts, print, keyboard/touch controls, reduced motion and no-JavaScript root behavior. Its logs enumerate the actual tests. Passing them demonstrates those assertions on Chromium and this environment. It is not evidence that every Safari/mobile/screen-reader behavior works, or that every emitted sentence is justified.

Initial environment failures were corrected before interpreting the tests: the first isolated archive lacked Git metadata and d3 packages; a symlinked dependency tree was rejected by the build; a sandboxed build worker stalled. The final isolated Git tree, copied dependencies and approved build resolved those issues. The additional 404 probe initially expected a period that the actual heading does not contain. Correcting the test expectation produced the captured title/language defect. None of those initial failures is presented as an application defect.

The first Python HTTP attempt failed certificate verification in that Python environment. The crawler was changed to use system `curl` with normal TLS verification, not to bypass certificate checks. Two partial-download timeouts were retried successfully. They are not reported as production outages.

## Live journeys and what was observed

| Journey | Live manual coverage | Other coverage and limits |
|---|---|---|
| Homepage and menu | Entry, menu, deep links, navigation and visual inspection | Existing suite covers motion, keyboard, touch, no-JS and responsive variants. |
| Foundation | All 14 Core questions; clarification; selection without advance; reload/resume; required review; generation and full result | Synthetic Core patterns and boundary sweeps; targeted/extended variants through source and existing tests. |
| AI Governance | All 22 Standard questions, review, generation, full result and fresh exact-answer evidence | Advanced and compatibility branches through source/tests, not every Advanced response manually entered. |
| Security | All 19 Standard cases, draft resume, review and result | Advanced options and actor-lens exclusions covered in source/tests. |
| Technology | All 9 Standard cases, review and full result | Advanced and second-choice combinations covered by source/tests. |
| Profile | Empty/own-result states, connected questions and saved subjects | Recipient isolation, shared profiles, evidence binding and clear behavior in browser suite/probes. |
| Pair comparison | Valid identical links and their readback | Origin, malformed/oversize input and provenance through probes/tests. No cryptographic authentication claim. |
| Current Cases | Complete seven-step European missile-defence case, optional reasons, assumptions, final judgment and share controls | All three cases and six source/corrections subpages inventoried. Other complete paths through source/tests. |
| Decision exercises | Both exercises, both conditions, stated reasons, withheld decision and interpretation | Reset/revision/branch combinations through source/tests. |
| Perspective Runs | Exposed Ally, all three scenarios, review and generated result | All six role pages inventoried; scorer and helper wording inspected. No actual before/after role experiment. |
| Futures | All twelve preferences with uncertainty, review and appropriately insufficient comparison result | All nineteen scenario leaves and two-world comparison inventoried; directional/indispensable/expectation branches covered through source/tests. |
| Departure | Less-personal framing; all three comparisons/thirteen response groups; review and interpretation | Source/test review of framing and invalidation branches. Not every possible narrative combination manually generated. |
| World Stage | Map rendered; pause; all five map selectors changed their heading/evidence; membership section inspected | Source and test review of documented membership geometry, dates and motion. Not every point clicked or external source re-fact-checked. |
| Library | Route/text coverage of four traditions, eight archetypes, ten patterns, eight thinkers, six AI approaches, Field Guide and References | Selected live visual/readability inspection; not an equal-depth expert literature review of every paragraph. |
| Chinese and recovery | Chinese routes inventoried; unsupported-state inspection | Existing suite exercises Chinese mobile/results/shared Profile compatibility; English 404 hydration additionally reproduced. No human bilingual equivalence study. |

## Additional probes

The reviewed scripts are retained in `probes/`. They are audit code, not application imports. Some use explicit isolated-workspace paths; update those paths when reproducing elsewhere. They rely on the project's existing TypeScript loader or Playwright installation and do not require a new dependency.

- `B-functional-probes.mts`: completion intent matches exactly once; legacy versus current payload behavior; approved/disallowed link origins; malformed and oversized input. Output: `functional-probes.json`.
- `C-method-probes.mts`: all-neutral/agreement/disagreement, all scored directions high/low, one-item sweeps, order/justice and restraint sweeps, and Core coverage/order. Output: `method-probes.txt`.
- `D-copy-scanner.mjs`: TypeScript AST/JSON copy extraction and pattern flags. Output: `source-copy-inventory.json`; the exported CSV retains all flags.
- `behavior.spec.ts`: fresh shared-link recipient storage versus Profile; cross-form old history; blocked persistence and 404 metadata; neutral result screen/print artifacts.
- `http_inventory.py`: sitemap and discovered internal anchors, response/status/text files. The CSV is the portable summary. The full downloaded page cache remains in the temporary audit workspace rather than adding hundreds of HTML files to the repository.

The neutral screenshot and print PDF are retained as evidence. The PDF was generated to inspect this result's print output; this package does not claim a page-by-page audit of all possible print results.

The ten API source routes were also inventoried: analytics event intake; aggregate result and statistics; share-card generation; three retired research endpoints; and three retired Current Case challenge endpoints. Research intake returns an explicit 410 tombstone, as do the answer-bearing challenge routes. Aggregate/analytics validation, feature gates and card behavior have source/unit/browser coverage. No actual research or analytics submission was deliberately made to production to exercise a write path, and production provider configuration, retention and database state were not independently audited. Ordinary synthetic browsing may still trigger the site's configured coarse product counters.

The internal-anchor scan found only the two home `#entrance` links absent from literal IDs. These are handled by the root's JavaScript mode transition, so this is not an ordinary broken live link; a no-JavaScript return-to-opening anchor remains a low-priority fallback limitation. The retained Futures aliases point to real anchors.

## DeepSeek delegation: what was requested and integrated

Four workstreams were called through the available DeepSeek MCP chat tool:

1. **A — product/editorial/commercial assessment.** Independent source-based judgment, initially excluding the earlier critique to reduce anchoring.
2. **B — functional and state audit.** Requested executable read-only probes for payloads, save intent, comparison and persistence assumptions.
3. **C — methodology audit.** Requested a reproducible synthetic-response diagnostic and separation of code facts from empirical questions.
4. **D — copy audit.** Requested source extraction/scanner code and concrete prose findings with false-positive treatment.

These were distinct delegated MCP workstreams, not autonomous agents with direct access to the browser or filesystem. I supplied public source context and ran/reviewed their proposed code locally. Their initial reasoning-heavy responses exhausted output budgets; bounded follow-ups produced usable reports and code. The package does not claim verified token or cost savings.

The raw prompts and draft reports are in `delegation/` for traceability. **Those reports contain rejected and stale findings. They are evidence of the delegation, not additional accepted findings.** Most initial context was PR 63; I reviewed the PR 64 delta and checked final findings against the production-equivalent tree.

Integration required substantive correction:

- B's proposed current payload used incorrect version markers and placeholder tokens. These were replaced with valid current tuples before testing.
- C called the legacy `standard` path for the current Core form, excluding analyst-tagged Core reverse items and producing false extremes. I traced the live review generator, switched to its `analyst` path, checked the live dimension vector, and reran the diagnostics. Only corrected output is cited.
- C's high/low profile probes initially manipulated only part of the intended pattern. They were corrected to apply across all seven pairs.
- D's code needed conservative handling of templates and accessibility strings. I retained expression text and labels instead of silently erasing them. File-path heuristics were not accepted as proof of live use.
- The full reports' grand claims about security, psychometrics and hidden user behavior were narrowed to what could actually be reproduced.

## Adjudication of earlier and delegated criticism

| Claim | Audit decision |
|---|---|
| Opening a shared result contaminates personal history | Confirmed for the older Foundation history store. Rejected as a blanket claim that the current Profile is populated. |
| “Saved” can appear without successful storage | Confirmed with a blocked-storage browser probe. |
| HTTP comparison URLs are accepted and fetched insecurely | Rejected. Exact origin validation rejected the HTTP URL; parsing does not itself fetch the pasted result. |
| Legacy result labels can disagree with recomputed modern scores | Confirmed as a compatibility characteristic; not proof of a security compromise. Current v5 recomputes. Do not silently rewrite historical identities. |
| Full-form answers leak into Core generation | Not accepted. The active review path selects the intended form's answers. The initial DeepSeek script used the wrong path. |
| “All agree” should produce every dimension at 7 | Rejected for current Core: reverse scoring produces all 4s. The corrected probe demonstrates it. |
| Core reverse items are not adjacent to their forward items | Rejected for the active 14-item order. They are paired. A review of full-bank storage order was mistaken for UI order. |
| Actor-lens judgments contaminate current Security personal scores | Rejected. Current Security excludes them from headline, axes and lanes and reports them separately. |
| Every neutral result falsely claims a strong family | Too broad. Current copy acknowledges low differentiation; the accepted concern is the arbitrary two-family display within a four-way tie. |
| Category coefficients should be rounded to eliminate fake precision | Rejected as a remedy. Internal reproducible arithmetic and public inference are distinct. Change display, not frozen weights, without a substantive scorer revision. |
| There are only four Thinker pages | Stale after PR 64. Eight pages now exist; the four new essays do not create four new coded map estimates. |
| The homepage's state handling is necessarily broken | Not established. Live behavior and the current browser suite support the revised root flow. Code complexity alone is not a user defect. |
| Chinese count words and short keyboard instructions are automatically AI-like | Rejected as blanket judgments. Naturalness needs context, not a mechanical repetition rule. |
| All risk/limitation language should be moved to Method | Rejected. Some limits materially change how an adjacent claim should be understood. Simplify and place them well. |
| Every button needs a 44-pixel target to meet WCAG AA | Rejected as stated. Do not conflate enhanced target-size guidance with the AA requirement or ignore exceptions. This audit is not a full WCAG certification. |
| “How this is calculated” is itself an AI tell | Rejected. It is a useful, ordinary disclosure label. Repetitive or misleading content inside it is the relevant issue. |
| Current case dates make the site deceptive | Not accepted as deception: review-due status is visible. Accepted as an editorial cadence and expectation problem. |
| `/learn` and English 404 metadata need attention | Confirmed, with limited scope: stale documented route and wrong title; ordinary live navigation was not broadly broken. |
| A 50,000-character input limit is a bug | Not established. A defensive input bound is reasonable; no required current payload exceeding it was demonstrated. |
| Clearing local data during an in-flight save must preserve the save | Rejected. Respecting a clear action is the correct default. |
| Null provenance on both sides proves equivalence | Rejected. Matching unknown markers do not establish matching exposure. |

The Impeccable detector was run after the independent design assessment. It found syntactic visual patterns such as accent borders. These were not accepted as proof of AI authorship or as reasons to redesign the interface. Likewise, the repository's own copy audit emitted 1,241 findings across several audiences/contexts; that is a different heuristic inventory from the 851-row scanner and should not be summed into a defect count.

For the target-size distinction, consult W3C's [24 CSS-pixel minimum/spacing criterion at AA](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) and the separate [enhanced criterion](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html). Small or poorly spaced controls can still be a usability problem even when an exception applies. The older contrast complaint likewise needs the actual element/background, not only a palette token; current Method uses the dim brass mainly in numbered markers.

## Residual uncertainty and honest boundaries

The public route inventory is exhaustive relative to the sitemap and bounded internal-link crawl used here. Encoded result routes have an effectively unbounded state space. Alternative answer combinations, browser implementations, accessibility technologies, live provider behavior and all external bibliographic claims were not exhaustively tested. No responsible final audit can promise that every possible interaction is faultless.

What this package does provide is a detailed and reproducible basis for the next decisions: exact production scope, completed representative journeys, all discovered public reading leaves, passing automated checks, targeted reproductions, traceable copy candidates and prioritized remedies. It does not use uncertainty as a reason to stop useful pilot work.
