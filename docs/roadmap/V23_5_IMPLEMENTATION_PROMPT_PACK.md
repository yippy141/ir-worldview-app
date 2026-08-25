# V23.5 Implementation Prompt Pack

Status: active task contracts
Baseline lineage: `a80fe4d02d818ae546672d15f64aa596a25b1ceb`
Dispatch rule: one prompt, one isolated write lane, one reviewed merge

## How to use this pack

The operator copies one complete prompt below into a clean coding task. Before dispatch, replace every `__POPULATE_AT_DISPATCH__` token with the current verified value. A worker must stop if a token remains.

The exact base commit for PR 1 is the accepted baseline unless documentation is merged first. Every later PR starts from the exact accepted commit produced by the previous integration. Never tell two write lanes to edit overlapping files.

No prompt in `docs/archive/2026-08-21-claude-v24-review/` may be appended to these contracts.

## PR 1 task contract: Current Case and public-route integrity

```text
TASK: V23.5 PR 1, Current Case and public-route integrity
REPOSITORY: /Users/jinhuayip/Developer/ir-worldview-app-clean
BASE_BRANCH: __POPULATE_AT_DISPATCH__
BASE_COMMIT: __POPULATE_AT_DISPATCH__
DATA_CLASS: Green
PROVIDER: approved strong coding model
DIFF_BUDGET: 14 production files plus focused tests, 700 changed lines maximum
TIME_BUDGET: 4 hours before escalation

READ FIRST:
1. AGENTS.md
2. PRODUCT.md
3. CONSTITUTION
4. DESIGN.md
5. BASELINE_AND_DECISIONS.md
6. docs/roadmap/V23_5_V26_MASTER_ROADMAP.md sections 4, 6, and 7
7. docs/roadmap/RELEASE_TEST_MATRIX.md

PRECHECK:
- Print git status, current branch, HEAD, origin/main, and the base commit.
- Stop if the worktree is dirty, HEAD differs from BASE_COMMIT, or any dispatch token remains.
- Create or use one isolated worktree. Do not touch another lane.

GOAL:
Make the homepage, /current, development-only routes, and feedback invitations tell the truth about Current Case availability.

LOCKED BEHAVIOR:
- The reviewed Current Case catalog is the only availability authority.
- If a reviewed case is active, Current Case may lead.
- If no reviewed case is active, Foundation is the recommended first path and the case destination is called Recent Cases in exploration.
- The homepage revalidates at least hourly.
- /current and homepage state agree.
- /learn and /world-stage-prototype return notFound in production and carry noindex metadata. They remain usable in development.
- Feedback-page scope matches all public invitations.
- No dependency, scorer, bank, payload, share-link, Current Case record, or review-window edit.

ALLOWED PATHS:
- app/page.tsx
- app/current/route.ts
- app/cases/page.tsx
- app/learn/page.tsx
- app/world-stage-prototype/page.tsx
- app/feedback/page.tsx
- app/[locale]/feedback/page.tsx
- components/home/world-stage/**
- lib/world-stage/scenes.ts
- lib/current-cases/catalog.ts only if a small typed read helper is required
- content/locales/en/current-cases.ts
- content/locales/zh-Hans/world-stage.ts
- directly related tests in tests/

FORBIDDEN PATHS:
- content/current-cases/**
- content/instrument/**
- lib/scoring/** and all scorer or payload code
- package.json and lockfiles
- docs/archive/2026-08-21-claude-v24-review/**
- tmp/**

IMPLEMENTATION REQUIREMENTS:
1. Add an explicit typed live/archive availability state to the homepage menu contract.
2. Construct homepage items from reviewed availability and an injected or server-owned time.
3. Do not derive availability from hardcoded ordering, visible copy, or a client-only clock.
4. Preserve semantic fallback and map behavior.
5. Add deterministic active and inactive tests with fixed dates.
6. Test that the inactive homepage never promises assess a current case.
7. Test that production-only routes fail closed without breaking development rendering.

ACCEPTANCE:
- Active case: live label and route are present.
- Inactive case: Foundation leads, Recent Cases appears in exploration, and /current redirects consistently.
- State changes after the review-window boundary without a redeploy.
- Production-only hidden routes return not found and are noindex.
- English and supported Chinese labels remain coherent.

RUN:
- task-specific node tests for Current Case and World Stage
- npm run typecheck
- npm run validate
- npm run copy:audit:strict
- npm run lint
- npm run test
- npm run build

VISUAL CHECKS:
- Homepage at 320, 390, 768, and 1440 with active and inactive fixed dates.
- Keyboard order and accessibility tree.
- Map fallback with no token.

STOP AND REPORT:
- Catalog state cannot be resolved on the server.
- A behavior change requires editing a case record or compatibility contract.
- Any full gate fails.
- The diff budget is exceeded.

HANDOFF EVIDENCE:
- Exact base and head SHAs.
- File list and behavior summary.
- Test commands and results.
- Active and inactive screenshots.
- Bundle note and rollback boundary.

ROLLBACK:
Revert only this PR merge commit. No data migration exists.
```

## PR 2 task contract: protect Foundation, AI, and Focus Area drafts

```text
TASK: V23.5 PR 2, protect user work
REPOSITORY: /Users/jinhuayip/Developer/ir-worldview-app-clean
BASE_BRANCH: __POPULATE_AT_DISPATCH__
BASE_COMMIT: __POPULATE_AT_DISPATCH__
DATA_CLASS: Green
PROVIDER: approved strong coding model
DIFF_BUDGET: 12 production files plus focused tests, 850 changed lines maximum
TIME_BUDGET: 5 hours before escalation

READ FIRST:
AGENTS.md, PRODUCT.md, CONSTITUTION, DESIGN.md, BASELINE_AND_DECISIONS.md,
docs/roadmap/V23_5_V26_MASTER_ROADMAP.md sections 4 and 7,
docs/roadmap/RELEASE_TEST_MATRIX.md.

PRECHECK:
Print Git state and verify HEAD equals BASE_COMMIT. Stop on a dirty tree, a mismatch, or an unfilled dispatch token. Work in an isolated lane.

GOAL:
Prevent accidental answer loss and preserve separate Standard and Advanced drafts without changing issued results.

LOCKED BEHAVIOR:
- Foundation and AI reset immediately when no answer exists.
- Foundation and AI ask for confirmation when any answer exists.
- Cancel preserves every answer and the current position.
- Focus Area drafts are keyed by module, instrument version, locale, and mode.
- Position is stored separately from answers.
- Switching Standard and Advanced restores each draft.
- Explicit reset clears only the active draft after confirmation.
- Existing scorer input, result payloads, links, and ProfileStore records are unchanged.
- Use a native confirmation unless an existing accessible confirmation pattern already satisfies the requirement.

ALLOWED PATHS:
- components/quiz-app.tsx
- components/ai-governance-quiz-app.tsx
- components/modules/module-app.tsx
- lib/modules/drafts.ts
- tests/module-drafts.test.mts
- directly related Foundation or AI interaction tests in tests/
- app/globals.css only for a touched control state

FORBIDDEN PATHS:
- content/instrument/**
- lib/scoring/**
- lib/ai-governance-scoring*
- lib/modules/** scorer, bank, checksum, payload, manifest, or version registry files other than drafts.ts
- lib/profile-store.ts
- package.json and lockfiles
- public copy outside reset instructions

IMPLEMENTATION REQUIREMENTS:
1. Model reset and mode switch as explicit state transitions.
2. Detect answers from actual draft state, not progress text.
3. Version a draft storage key only if the existing contract requires it. Preserve and test any migration.
4. Fail safely on malformed local storage without deleting other records.
5. Keep unsupported locale behavior unchanged.
6. Add tests for zero-answer reset, cancel, confirm, mode switch, reload, active-only reset, and malformed storage.

ACCEPTANCE:
- No answered draft is destroyed without confirmation.
- Standard and Advanced answers and positions survive switch and reload.
- Active reset cannot clear another mode or module.
- Old saved data still loads or follows a documented safe migration.
- Old result links reproduce exactly.

RUN:
Task-specific tests, then npm run typecheck, npm run validate, npm run copy:audit:strict, npm run lint, npm run test, and npm run build.

MANUAL CHECKS:
Foundation and AI reset with zero, one, and many answers. Security and Technology mode switching, reload, cancel, and confirm. Keyboard-only flow at 390px.

STOP AND REPORT:
A storage migration is necessary but not covered by an existing version contract; a scorer or payload change appears; a dependency is needed; another lane touches the same files; any gate fails; or the diff budget is exceeded.

HANDOFF EVIDENCE:
Base and head SHAs, storage-key matrix, transition table, test output, manual cases, changed files, and rollback boundary.

ROLLBACK:
Revert only this PR merge commit. Preserve browser data unless the owner separately authorizes cleanup.
```

## PR 3 task contract: one-question Focus Area flow

```text
TASK: V23.5 PR 3, Focus Area pagination
REPOSITORY: /Users/jinhuayip/Developer/ir-worldview-app-clean
BASE_BRANCH: __POPULATE_AT_DISPATCH__
BASE_COMMIT: __POPULATE_AT_DISPATCH__
DATA_CLASS: Green
PROVIDER: approved strong coding model
DIFF_BUDGET: 10 production files plus focused tests, 1,000 changed lines maximum
TIME_BUDGET: 6 hours before escalation

READ FIRST:
AGENTS.md, PRODUCT.md, CONSTITUTION, DESIGN.md, BASELINE_AND_DECISIONS.md,
docs/roadmap/V23_5_V26_MASTER_ROADMAP.md sections 4 and 7,
docs/roadmap/RELEASE_TEST_MATRIX.md.

PRECHECK:
Verify a clean isolated worktree at BASE_COMMIT. Print current and upstream state. Stop if any dispatch token remains.

GOAL:
Replace the long Focus Area questionnaire document with one reversible question unit at a time while preserving exact scorer input.

LOCKED BEHAVIOR:
- One case or question unit is visible at a time.
- Answer selection never advances the page.
- Back and Next are explicit.
- A compact progress indicator remains visible.
- The final review shows every answer and supports returning to any item.
- Reload restores answers and position.
- Bank order passed to the scorer is byte-for-byte equivalent in meaning to the existing order.
- No item, option, clarification, scorer, checksum, payload, result copy, or manifest change.

ALLOWED PATHS:
- components/modules/module-app.tsx
- lib/modules/drafts.ts when position support is required
- app/globals.css for the Focus Area flow and focused quiz chrome
- focused component tests and tests/module-drafts.test.mts

FORBIDDEN PATHS:
- content/instrument/**
- lib/modules bank, scorer, checksum, result, manifest, and version files
- Foundation and AI quiz components
- package.json and lockfiles

WORKED EXAMPLE:
If the bank order is [q1, q2, q3] and the participant answers q2, then q1, then q3 through back navigation, the final scorer input remains [answer(q1), answer(q2), answer(q3)]. Interaction order never becomes scorer order.

IMPLEMENTATION REQUIREMENTS:
1. Use stable item IDs for navigation and answer lookup.
2. Clamp or recover an invalid saved position without changing answers.
3. Disable Next until the current required response exists, with nearby explanation.
4. Review remains a distinct step before result generation.
5. Back from the first item returns to the appropriate landing or mode choice using existing behavior.
6. Add tests for order invariance, back, review edit, reload, last-item transition, and malformed position.

ACCEPTANCE:
- One question unit at a time at all required viewports.
- No automatic advance.
- Every response remains reversible.
- Reload and mode switch restore the correct position.
- New and old UI paths produce the same scorer input for fixed answer fixtures.
- No 50-screen questionnaire document at 390px.

RUN:
Focused state and module tests, then the complete automated gate.

VISUAL AND MANUAL CHECKS:
Security and Technology, Standard and Advanced, at 320, 390, 768, and 1440. Keyboard-only completion, 400 percent reflow, sticky chrome, final review, and print if the route exposes print.

STOP AND REPORT:
Any mismatch in scorer input, frozen checksum, result payload, or replay; any lost answer; a new dependency; overlapping edits; failed gate; or budget overrun.

HANDOFF EVIDENCE:
Base and head SHAs, before and after screenshots, scorer-input equivalence output, test results, file list, and rollback boundary.

ROLLBACK:
Revert only this PR merge commit. Draft records remain compatible with PR 2.
```

## PR 4 task contract: accessibility and responsive repair

```text
TASK: V23.5 PR 4, accessibility and responsive repair
REPOSITORY: /Users/jinhuayip/Developer/ir-worldview-app-clean
BASE_BRANCH: __POPULATE_AT_DISPATCH__
BASE_COMMIT: __POPULATE_AT_DISPATCH__
DATA_CLASS: Green
PROVIDER: approved strong coding model
DIFF_BUDGET: 14 production files plus focused tests, 900 changed lines maximum
TIME_BUDGET: 6 hours before escalation

READ FIRST:
AGENTS.md, PRODUCT.md, CONSTITUTION, DESIGN.md, BASELINE_AND_DECISIONS.md,
docs/roadmap/V23_5_V26_MASTER_ROADMAP.md sections 4 and 7,
docs/roadmap/RELEASE_TEST_MATRIX.md.

PRECHECK:
Verify clean isolated state at BASE_COMMIT and print Git facts. Stop on a mismatch or unfilled token.

GOAL:
Repair identified contrast, landmark, source-order, control-target, mobile-chrome, and locale-parity defects without restyling the product.

LOCKED BEHAVIOR:
- Keep the Astrolabe identity and dark-only scope.
- Normal explanatory text reaches 4.5:1 contrast on its actual surface.
- Exactly one main landmark exists per critical route.
- The homepage introduction and primary choices precede Map details and sources in document and accessibility-tree order.
- Locale and motion controls become one compact responsive group.
- Primary mobile targets are at least 44 by 44 CSS pixels.
- Focused questionnaire chrome retains essential progress and exit control without the tall stacked header.
- Reduced-motion and map fallback behavior remain intact.
- Supported Chinese task chrome performs the same task. Unsupported content still fails closed.

ALLOWED PATHS:
- app/globals.css
- components/field/field-explorer.tsx
- components/layout/site-chrome.tsx
- components/home/world-stage/**
- components/modules/module-app.tsx only for chrome markup needed by this repair
- content/locales/zh-Hans/navigation-controls.ts
- directly related semantic, route, and rendering tests

FORBIDDEN PATHS:
- scorer, bank, payload, share, or ProfileStore contracts
- map datasets and Current Case records
- typography families and root palette replacement
- package.json and lockfiles
- broad unrelated CSS cleanup

IMPLEMENTATION REQUIREMENTS:
1. Measure changed foreground and background pairs and record the ratios.
2. Replace the nested main with the correct named section or neutral container.
3. Preserve visual map placement when moving its semantic ledger in document order, if CSS ordering is required.
4. Test the accessible name and focus order of the combined control group.
5. Retain visible focus and forced-colors support.
6. Add structural tests where the repository's current test style supports them.

ACCEPTANCE:
Exactly one main, correct skip destination, map ledger after primary task, 44px controls, no locale-motion collision, AA normal text, visible focus, reduced motion, no sticky overlap, and no horizontal overflow at 320 or 390.

RUN:
Focused tests, then the complete automated gate.

VISUAL AND ACCESSIBILITY CHECKS:
320, 390, 768, and 1440. English and supported Chinese. Keyboard path, accessibility tree, reduced motion, forced colors where feasible, and print. Attach before and after evidence.

STOP AND REPORT:
A token change cannot meet contrast without a wider visual regression; moving the ledger removes the non-map alternative; locale support is ambiguous; another lane overlaps; any gate fails; or the budget is exceeded.

HANDOFF EVIDENCE:
SHAs, contrast table, landmark tree, screenshots, keyboard notes, test output, bundle note, file list, and rollback boundary.

ROLLBACK:
Revert only this PR merge commit.
```

## PR 5 task contract: rendered-copy fixtures and deterministic audit

```text
TASK: V23.5 PR 5, rendered-copy fixtures and deterministic audit
REPOSITORY: /Users/jinhuayip/Developer/ir-worldview-app-clean
BASE_BRANCH: __POPULATE_AT_DISPATCH__
BASE_COMMIT: __POPULATE_AT_DISPATCH__
DATA_CLASS: Green
PROVIDER: approved strong coding model
DIFF_BUDGET: 16 production or script files plus fixtures and tests, 1,200 changed lines maximum
TIME_BUDGET: 8 hours before escalation

READ FIRST:
AGENTS.md, PRODUCT.md, CONSTITUTION sections 2 and 6, DESIGN.md sections 10 through 13,
BASELINE_AND_DECISIONS.md, the master roadmap section 8, and the release matrix.

PRECHECK:
Verify clean isolated state at BASE_COMMIT. Stop on mismatch, overlapping work, or an unfilled token.

GOAL:
Review the complete text readers receive, enforce narrow deterministic rules, and route likely weak blocks without turning noisy style measures into blockers.

LOCKED BEHAVIOR:
- Render all known runtime combinators as complete paragraphs.
- Every public block has one declared job: payoff, mechanism, definition, instruction, limitation, evidence, or tradeoff.
- No automatic rewrite or deletion.
- English authored prose contains no em dash.
- Exempt Chinese typography, quotations, proper names, and machine separators.
- Constitution filler phrases remain forbidden.
- Frozen-bank detection covers every version suffix in the repository.
- Nominalization, hedge, sentence variance, triad, and n-gram measures are advisory only.
- No public copy change in this PR except a minimal fixture adapter label if required.

ALLOWED PATHS:
- lib/narrative/**
- public-copy-producing helpers in lib/ when required for pure rendering adapters
- scripts/audit-public-copy.mjs
- new generated or source-controlled copy fixture directory outside tmp/
- focused tests and audit fixtures
- package.json only if adding a repository script that invokes existing runtime tools, with no dependency change

FORBIDDEN PATHS:
- content/instrument/**
- scorer, payload, checksum, version, and ProfileStore contracts
- app and component presentation copy
- dependency and lockfile changes
- tmp/**

IMPLEMENTATION REQUIREMENTS:
1. Enumerate Foundation narrative composites, module result narratives, AI summaries, Profile combinations, share and Open Graph copy, and locale variants.
2. Fail closed when a known combinator cannot render.
3. Give fixtures stable IDs and provenance for their source versions.
4. Separate blocking violations from review routes in output and exit codes.
5. Add a router for unnamed jobs, adjacent duplicate jobs, unnecessary instrument subjects, composition repetition, and repeated defensive negation.
6. Fix frozen-file regex coverage for dotted and hyphenated version suffixes.
7. Add fixture tests proving exemptions and preventing bank copy edits.

ACCEPTANCE:
All known combinators render; strict deterministic rules pass; advisory signals are summarized; no runtime paragraph lacks review state; frozen banks are protected; and existing runtime output remains unchanged.

RUN:
Fixture tests, npm run copy:audit:strict, then the complete automated gate.

MANUAL CHECK:
Review the routed paragraph set as rendered wholes. Record accepted, revise, or false-positive status outside generated output. Do not approve copy by score.

STOP AND REPORT:
A combinator requires executing private or live data; a bank must change; generated fixtures cannot be deterministic; a dependency is needed; the audit becomes noisy enough to block accepted copy; a gate fails; or budget is exceeded.

HANDOFF EVIDENCE:
SHAs, combinator inventory, fixture count, blocker and advisory counts, routed review list, test output, file list, and rollback boundary.

ROLLBACK:
Revert only this PR merge commit. Generated evidence can be regenerated from source.
```

## PR 6 task contract: homepage and browse information architecture

```text
TASK: V23.5 PR 6, homepage and browse information architecture
REPOSITORY: /Users/jinhuayip/Developer/ir-worldview-app-clean
BASE_BRANCH: __POPULATE_AT_DISPATCH__
BASE_COMMIT: __POPULATE_AT_DISPATCH__
DATA_CLASS: Green
PROVIDER: approved strong coding model with owner review
DIFF_BUDGET: 18 production files plus focused tests, 1,100 changed lines maximum
TIME_BUDGET: 8 hours before escalation

READ FIRST:
AGENTS.md, PRODUCT.md, CONSTITUTION, DESIGN.md, BASELINE_AND_DECISIONS.md,
master roadmap section 8, release matrix, and the accepted runtime-copy fixture output.

PRECHECK:
Verify clean isolated state at BASE_COMMIT and print Git facts. Stop if the owner has not approved the exact public taxonomy listed below.

GOAL:
Make Foundation the stable first path and use one public taxonomy across homepage, desktop navigation, mobile navigation, and Explore.

LOCKED TAXONOMY:
Foundation, Perspectives, Focus Areas, AI Governance, Cases or Recent Cases according to live state, Atlas, Futures, Reference.

LOCKED BEHAVIOR:
- Homepage groups are Start here and Continue exploring.
- Start here contains no more than three peers.
- Foundation is the stable first-time path.
- Current Case may lead only when reviewed content is active.
- /modules uses saved Foundation state when available, not a query-parameter assumption.
- No route, payload, scoring, or localization boundary change.
- No wholesale redesign or palette change.

ALLOWED PATHS:
- app/page.tsx
- app/modules/page.tsx
- app/explore/page.tsx
- components/home/world-stage/**
- components/layout/site-chrome.tsx
- lib/world-stage/scenes.ts
- lib/profile-store.ts only through an existing read API or a small presentation-only read helper with compatibility tests
- content/explore/hub.en.json
- approved navigation locale files
- relevant tests and touched CSS

FORBIDDEN PATHS:
- banks, scorers, payloads, checksums, and share contracts
- ProfileStore migrations or writes
- unsupported localization content
- package.json and lockfiles

ACCEPTANCE:
The same concept has the same name on every browse surface; Foundation leads the inactive first visit; active Current Case behavior remains truthful; no more than three peers appear in Start here; saved Foundation state changes /modules guidance safely; and internal schema names do not appear.

RUN:
Focused routing and state tests, then the complete automated gate.

VISUAL CHECKS:
Home, navigation, Explore, and /modules at required viewports, both Current Case states, empty and populated ProfileStore, English and supported Chinese chrome.

STOP AND REPORT:
Taxonomy requires a route migration; saved state needs a schema change; locale terms lack approval; another lane overlaps; a gate fails; or budget is exceeded.

HANDOFF EVIDENCE:
SHAs, taxonomy matrix, state matrix, screenshots, tests, copy review record, file list, and rollback boundary.

ROLLBACK:
Revert only this PR merge commit.
```

## PR 7 task contract: result, Profile, and Method hierarchy

```text
TASK: V23.5 PR 7, result, Profile, and Method hierarchy
REPOSITORY: /Users/jinhuayip/Developer/ir-worldview-app-clean
BASE_BRANCH: __POPULATE_AT_DISPATCH__
BASE_COMMIT: __POPULATE_AT_DISPATCH__
DATA_CLASS: Green
PROVIDER: approved strong coding model with owner copy review
DIFF_BUDGET: 24 production files plus focused tests, 1,500 changed lines maximum
TIME_BUDGET: 10 hours before escalation

READ FIRST:
All repository authorities, master roadmap section 8, release matrix, V23 master compatibility contract, and accepted runtime-copy review decisions.

PRECHECK:
Verify clean isolated state at BASE_COMMIT. Confirm that every proposed public-copy edit has an owner-approved before and after record. Stop if not.

GOAL:
Clarify the payoff, supporting interpretation, separate domain records, and Method lookup structure without changing any result.

LOCKED BEHAVIOR:
- Result hero remains payoff-first.
- Foundation archetype stays primary; tradition and modifiers are supporting interpretation.
- Security, Technology, and AI remain separate domain records.
- Named families are authored summaries, not natural kinds.
- Each invariant appears once per user journey unless a safety-critical context requires repetition.
- Translate internal statuses into reader language.
- Define or remove first-contact codes and version labels.
- Method has four anchored chapters: result meaning; answers to profile; evidence and versioning; limits, privacy, and corrections.
- Retain substantive methodology and compatibility disclosures.

ALLOWED PATHS:
- app/method/page.tsx
- components/i18n/chinese-methods-page.tsx only for approved structural parity, not new translation
- components/results/**
- components/profile/**
- components/worldview-profile/**
- lib/narrative/** presentation helpers
- approved result and profile locale copy
- relevant tests and touched CSS

FORBIDDEN PATHS:
- scoring, bank, resolver, payload, share encoding, calibration, and ProfileStore schema
- unapproved Chinese copy
- dependency changes
- broad Explore changes

ACCEPTANCE:
A new reader can name the main Foundation result, supporting interpretation, and separate domain records; internal status strings are absent; P+, Kairos, and version labels are defined or withheld at first contact; Method contents links work; and no substantive limit or evidence section is lost.

RUN:
Focused result, Profile, Method, share, and locale tests, then the complete automated gate.

VISUAL AND COPY CHECKS:
Representative pure and blended Foundation results, each module result, AI v3 result, empty and populated Profile, Method, supported Chinese routes, print, and share cards at required widths. Review rendered paragraphs, not fragments.

STOP AND REPORT:
A copy edit changes interpretation; old links would render with incompatible meaning; a Chinese change lacks authoring evidence; a compatibility test changes; another lane overlaps; any gate fails; or budget is exceeded.

HANDOFF EVIDENCE:
SHAs, before and after copy ledger, hierarchy screenshots, accessibility tree, compatibility output, tests, file list, and rollback boundary.

ROLLBACK:
Revert only this PR merge commit.
```

## PR 8 task contract: one Explore prototype and restrained design polish

```text
TASK: V23.5 PR 8, Explore prototype and Astrolabe polish
REPOSITORY: /Users/jinhuayip/Developer/ir-worldview-app-clean
BASE_BRANCH: __POPULATE_AT_DISPATCH__
BASE_COMMIT: __POPULATE_AT_DISPATCH__
DATA_CLASS: Green
PROVIDER: approved strong coding model with owner visual review
DIFF_BUDGET: 12 production files plus focused tests, 1,000 changed lines maximum
TIME_BUDGET: 8 hours before escalation

READ FIRST:
AGENTS.md, PRODUCT.md, CONSTITUTION, DESIGN.md, BASELINE_AND_DECISIONS.md,
master roadmap section 8, release matrix, and the approved before screenshots.

PRECHECK:
Verify clean isolated state at BASE_COMMIT. Record the single Explore page selected by the owner: __POPULATE_AT_DISPATCH__. Stop if no page is named.

GOAL:
Test a clearer editorial Explore pattern on one page and make only the approved cross-surface design corrections.

LOCKED BEHAVIOR:
- One Explore page only. Do not propagate before evidence and owner review.
- Preserve Astrolabe fonts, navy and brass palette, maps, asymmetry, and restrained motion.
- Reduce repetitive panels and use accent borders only for interpretive callouts.
- Do not add gradients, glass, neon, large shadows, marketing grids, dashboard conventions, or a light theme.
- Preserve all substantive content, sources, routes, and locale boundaries.

ALLOWED PATHS:
- the selected app/explore route
- its direct component and stylesheet
- app/globals.css only for an approved reusable Astrolabe primitive
- focused route and accessibility tests

FORBIDDEN PATHS:
- other Explore pages
- scoring, payload, ProfileStore, bank, source-record, and map-data contracts
- global font or palette replacement
- package.json and lockfiles

ACCEPTANCE:
The page supports scan and top-to-bottom reading, repeated cards are reduced, sources remain accessible, all copy jobs remain clear, contrast and keyboard access pass, and the visual identity remains recognizable in a side-by-side review.

RUN:
Focused tests and full automated gate.

VISUAL CHECKS:
Before and after at 320, 390, 768, and 1440; keyboard, reduced motion, 400 percent reflow, print, and screenshot comparison. Run the design detector once at the end and treat findings as review signals.

STOP AND REPORT:
The page requires a new content model; source behavior changes; the proposed pattern depends on a new package; owner visual approval is unavailable; another lane overlaps; a gate fails; or budget is exceeded.

HANDOFF EVIDENCE:
SHAs, selected page, design decisions with reasons, screenshots, detector summary, accessibility notes, tests, file list, and rollback boundary.

ROLLBACK:
Revert only this PR merge commit.
```

## Integration rule after every PR

The operator reviews the handoff against `OPERATOR_RUNBOOK.md`, accepts or rejects the patch, merges one PR, records the accepted SHA, and only then fills the next prompt. A worker never updates the next base commit on its own.
