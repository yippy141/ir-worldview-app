# V21 release audit

Date: 2026-08-01

Primary branch: `feature/v21-measurement-and-result-page`

Primary pull request: https://github.com/yippy141/ir-worldview-app/pull/24

Archetype-analogue follow-up:
https://github.com/yippy141/ir-worldview-app/pull/25

## Release call

**Primary V21 status: MERGED. Archetype follow-up: locally release-ready and
tracked in PR #25.**

V21 now contains the intended measurement and result-layer repairs, including
an actual historical V1 scorer, form-specific V2 calibration, explicit V5
provenance, safer aggregate reads, and legacy-link identity preservation.
PR #24 was squash-merged into `main` at
`8ecbf5e42e6ef2b9d5dbf4ac07e529438eb953c3`. PR #25 closes the deliberately
unfilled owner-authored analogue fields and exposes them without changing
scoring or payload formats.

The owner has now locked the eight V21 names, glosses, and historical
analogues. Broad public sharing retains a narrower **HOLD**: real
social-platform previews have not been recorded, and the Simplified Chinese
result is not archetype-first.

Tier 1 collection and scoring replay are dormant capabilities, not completed
production services. Tier 1 must remain default-off, and replay must not be run
on production research data, until their activation contracts below are
closed.

## Evidence-led completion matrix

| Stream | Current status | Evidence and qualification |
| --- | --- | --- |
| A0 diagnostics | Verified locally | The final diagnostic passed using independent per-item responses rather than one repeated Likert value across the bank. |
| A1 owner-profile clamp evidence | Historical evidence gap | The requested before/after printout was temporary evidence for an override that current V2 removes. It is not a live product defect, but it is not a completed durable artifact either. |
| A2 discrimination gates | Verified locally | All 299 unit tests passed with zero skips, including the strict measurement targets. |
| B1 clarity removal | Implemented | Current code and payloads do not produce or render confidence, clarity, or settledness. Legacy unknown fields remain decodable. |
| B2 scorer override removal | Implemented for current V2 | Current V2 has no end-of-scorer family override. The historical CPE clamp exists only inside the immutable V1 implementation because removing it would rewrite history. |
| B2b family-weight rebalance | Verified locally | The final independent-null diagnostic produced a 29.6% largest family, 4.8% largest three-part label, and all four families remained reachable. |
| B3 modifier and gap calibration | Verified locally by exact form | Core, full extended, and all six targeted family-pair forms resolve through separate calibration contracts. `npm run calibrate:targeted` reproduced all six committed constant sets. |
| C1–C3 item bank, balance, and validation battery | Verified locally | Validation passed with 135 unique items. Item content is versioned data, reverse coding is explicit, and the research-only validation battery remains outside Foundation scoring. |
| C4 core/full/targeted forms | Implemented | V5 carries the exact question set and canonical targeted pair. Stale answers outside the active form are excluded. |
| C5 hierarchy and threshold dimensions | Deferred as specified | These remain V22 measurement work. No new family should be added before item coverage. |
| D1–D3 Tier 1 aggregates and percentiles | Code present; activation gated | The write path is default-off. The public aggregate-stats read endpoint has been removed, internal aggregate rows are suppressed below `n = 100`, and a static contract test guards fresh/upgrade migration convergence. Production execution and controls remain open. |
| D4/D5 scoring replay | Strict same-bank replay implemented; operations dormant | V1 is self-contained and hash/golden-fixture tested. Replay now requires explicit matching consent, exact supported V1/V2 form and mode, one valid answer representation, and nonzero exit on quarantine. Cross-bank V1↔V2 replay is intentionally rejected without a reviewed compatibility map; batching and production operations remain open. |
| D6 Tier 2 | Deferred as specified | No production raw-answer collection should be inferred from the replay library or script. |
| E1/E2 archetype mapping and blends | Implemented as presentation only | Eight owner-authored pure types and twelve blends map over the canonical result without changing core dimensions or family scoring. Pure types have authored historical analogues; blends remain analogue-free. Leading `The` is removed only when composing a blend name. |
| E3 English share card | Locally verified; platform preview pending | The share card now renders the authored analogue on pure results. Final 1200×630 P+, R+, M−, and P/M+ renders passed visual review without tofu, clipping, overflow, or an invented blend analogue. |
| E4 archetype naming | Owner-locked for V21 | `content/archetypes.json` is authoritative for the exact names, glosses, and links. The owner decision is recorded in `V21_ARCHETYPE_NAMING_REVIEW.md`; re-evaluation is deferred to V22. |
| F1 English result | Verified locally and remotely | The archetype-first payoff and analysis disclosure are present. The final local Playwright suite and remote Chromium job passed; the Linux quiz, result, and Windows-font actuals were inspected and accepted. |
| F1 Simplified Chinese parity | Incomplete | The localized result remains on the earlier information architecture and lacks the archetype-first hero and localized custom card. |
| F2 live map | English implemented; Chinese incomplete | The English map follows the canonical projection. Chinese map copy remains intentionally omitted instead of silently falling back to English. |

## Measurement and compatibility repairs

### Historical V1 is actually frozen

`lib/scoring/v1.ts` now owns the production algorithm from
`pre-v21-20260728`, including its historical thresholds and known CPE clamp.
Its 44 scoring-relevant items live in
`content/instrument/foundation.scoring.v1.json`. A content hash and golden
replay fixture guard the snapshot. Current V2 code must never be imported into
V1, and future cleanup must not “correct” historical outputs.

### Current V2 uses the response process it claims to calibrate

- Core uses its analytic two-item-per-dimension independent-null baseline.
- Full extended uses an independent-null simulation of 500,000 respondents
  with seed `20260728`.
- Each of the six possible targeted family pairs has its own exact 14+5-item
  neutral baseline, estimated from 100,000 unconditional independent-null
  respondents per pair with seeds `20260730`–`20260735`.
- Targeted modifier and nearest-fit cuts use the actual conditional workflow:
  500,000 core candidates, 127,474 eligible for targeted follow-up.

The unconditional targeted neutral baselines intentionally retain the
selection evidence that produced the close family pair. Conditioning those
baselines on pair eligibility would subtract the evidence the follow-up is
meant to refine.

The exact calibration now travels through result generation, narratives,
archetype posture, share resolution, share-card derivation, and Tier 1
validation. A targeted link is not allowed to fall back silently to the full
form.

### V5 records all three relevant versions

Current V5 payloads require the supported tuple:

- `iv = 4`: structural instrument contract;
- `bv = 2`: item-bank/content version;
- `sv = 2`: scoring implementation.

They also carry the exact form and, for targeted extension, the canonical
family pair. Unsupported version tuples fail closed. Older V2–V4 links retain
their encoded family and modifier identity; closest-tradition copy now uses
that authoritative identity instead of recomputing a conflicting neighbor
from current ancillary scores.

## Privacy and data-boundary repairs

- The unauthenticated public aggregate-stats read route was removed.
- Aggregate labels and archetypes are not returned internally until the exact
  cohort reaches at least 100 observations.
- Browser local-data deletion now removes the Tier 1 submitted-result dedupe
  ledger as well as quiz/profile data. The measurement opt-out preference is
  intentionally retained.
- Migration `003` backfills pre-cohort rows with explicit legacy sentinels,
  removes those migration-only defaults, and reinstates the same locale and
  copy-version constraints used by a fresh migration `001` schema. A focused
  static test guards this source contract; it is not evidence from a live
  Postgres migration.
- Tier 1 remains aggregate-only and default-off through
  `TIER1_AGGREGATES_ENABLED`.

These changes reduce exposure; they do not complete production activation.

## Dormant activation gates

### Tier 1

Do not enable Tier 1 until all of the following have evidence:

1. platform-level rate limiting and operational monitoring;
2. a retry/idempotence design that does not introduce a persistent respondent
   identifier;
3. locale and copy-version provenance fixed at quiz start and preserved across
   resume or language switching;
4. an explicit archetype-mapping version in aggregate cohort semantics;
5. execution of both the fresh `001` path and the pre-cohort upgrade through
   `003` against a representative Postgres instance, followed by catalog and
   retained-sentinel inspection; source-level convergence is implemented and
   statically tested, but has not been proven against a live database;
6. production migration verification, a documented clean cohort start, and
   low-sample/unavailable-database smoke tests.

### Scoring replay

The CLI now selects only sessions with explicit matching consent receipts,
gates supported item bank, source scorer, mode, and exact form, rejects
incomplete or ambiguous answers, and exits nonzero on quarantine unless
`--allow-quarantined-sessions` is explicitly supplied.

Do not run it on production research data until it also:

1. processes bounded batches rather than loading the full corpus at once;
2. provides a dry-run/reconciliation report and operator rollback plan;
3. has a reviewed compatibility map before any cross-bank V1↔V2 comparison;
4. proves the consent query and upsert behavior against the production schema;
   and
5. documents that a failed quarantine run may already have idempotently
   upserted its valid sessions.

The immutable V1 scorer is release-worthy compatibility code. The current
database replay workflow is not yet release-worthy operations code.

## Specification decisions still requiring ratification

1. **Flat response styles.** In a valence-balanced bank, all-6 and all-2
   agreement patterns should be family-invariant. A different cross-dimension
   choice shape, not generalized yea-/nay-saying, should move family.
2. **Hedger sign.** The implementation uses restraint below midpoint as `+`
   and restraint above midpoint as `-`, consistent with the scored dimension
   and surrounding prose but opposite one sentence in the archetype spec.
3. **Archetype names.** Ratified for V21. Keep the owner-authored names,
   glosses, codes, mapping, and analogue references stable. V22 may conduct a
   new evidence-led review, but no implementation agent may silently rewrite
   them or compensate for a naming concern through scoring.

## Final local evidence

- `npm run calibrate:targeted`: passed and reproduced all six committed
  targeted calibration constant sets.
- `npm run lint`: passed.
- `npm run validate`: passed with 135 unique items.
- `npm run test`: 299 passed, 0 failed, 0 skipped.
- `npm run diagnose`: passed.
  - Family shares: Social Constructivist 29.6%, Liberal Institutionalist
    26.0%, Strategic Realist 24.2%, Critical Political Economy 20.2%.
  - Strategy modifiers: 35.4%, 32.4%, 32.2%.
  - Normative modifiers: 38.2%, 33.0%, 28.8%.
  - Largest three-part label: 4.8%.
  - All four families remained reachable.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed with 138 generated pages/routes.
- `npm run test:e2e`: 46 passed and 1 intentionally skipped.
- Independent visual review: final 1200×630 M+, M−, P−, and M/S− cards passed
  with no tofu, clipping, or orphaned text. The build trace contains the four
  bundled local fonts.

PR #25 follow-up evidence:

- `npm run lint`: passed.
- `npm run validate`: passed with 135 unique items.
- `npm run test`: 301 passed, 0 failed, 0 skipped.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed and generated all eight analogue routes.
- `CI=1 npm run test:e2e`: 48 passed.
- Visual review: P+, R+, M−, and P/M+ cards and the P+ evidence page passed;
  the longest analogue label fit, the CJK title rendered, and blends omitted
  the analogue line.

These local results are complemented by the remote closeout evidence below.
Neither set is evidence of social-platform preview behavior or production
Tier 1/replay operation.

## Remote code-closeout evidence

- Runtime head: `9a94b15`.
- GitHub Actions run:
  https://github.com/yippy141/ir-worldview-app/actions/runs/30697555910
- `lint-test-typecheck-build`: passed in 1m 28s.
- `playwright-chromium`: passed in 2m 05s.
- Linux/Chromium quiz, result, and Windows-font actuals were inspected and
  accepted through commits `4bcd7ba` and `9a94b15`.
- All three P1 review threads were replied to and resolved.

PR #24 is merged. PR #25 is the final archetype-analogue follow-up; its GitHub
record is the authoritative merge and remote-CI record. Tier 1 must remain
default-off and replay operationally dormant.

## Public-sharing HOLD conditions

Broad sharing should wait until:

1. real previews are checked in X, LinkedIn, WhatsApp, and WeChat; and
2. the Chinese experience is either brought to archetype-first parity or its
   narrower supported share contract is explicitly approved.

Closing the code merge gates does not, by itself, close these public-sharing
gates. Tier 1 and replay retain their separate production activation gates.
