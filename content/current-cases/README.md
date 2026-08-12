# Current Case content workflow

Current Case is an editorial interactive, not a live-news feed. Production records enter the
typed catalog in `lib/current-cases/catalog.ts` only after the research pack has been approved and
the record passes `validateCurrentCaseForPublication`.

## Public contract

Every published `CurrentCase` must include:

- a stable ID and slug, positive content version, publication state, launch/archive role, category,
  publication date, update date, and bounded evidence window;
- an `asOf` date tied to the evidence actually reviewed, an explicit `reviewDueAt` date, a
  `freshnessStatus`, and an editorial `cadence`;
- a 250–450 word briefing, named actors, a global perspective, and at least one named counterparty
  perspective;
- 4–8 factual claims plus explicit known uncertainties;
- 3–4 decision or threshold options. Each option must state a distinct logic and the tradeoff it
  knowingly accepts; intensity-only variants do not qualify;
- 3–4 relevant readings resolved through stable Worldview Map profile IDs. Every reading must say
  what it notices first, interpret the case, recommend a course, state its strongest objection, and
  name evidence that would change the reading;
- one assumption challenge using the four stable response IDs in `types.ts`;
- internal next-route recommendations, factual and interpretive dispute lists, sensitive-wording
  guidance, correction risks, and a roughly 150-word editorial memo;
- a source ledger whose direct URLs are preserved verbatim and whose claim IDs cover every factual
  claim; and
- completed research, source, copy, and approval review fields with at least two reviewer IDs.

Publication validation fails closed. A record marked `published` but missing any required review,
source coverage, differentiated option logic, objection, or update condition makes the shipped
catalog invalid. Draft and pending-review records are not returned by public catalog helpers.

## Freshness and launch status

Freshness is authored metadata, not a news pipeline.

- `active` is the only status eligible for `launch` and for presentation at `/current`. A
  published catalog may have no active launch case; if one exists, it must be the only published
  launch case.
- `review-due` means the existing evidence record remains available, but its review deadline has
  passed without an approved evidence update. It must not be presented as current.
- `background` marks a record that remains useful for context but is not a current-case claim.
- `archived` marks a historical record retained for provenance and old links.

`asOf` is the last date through which the cited evidence was actually checked. Do not move it
forward because a record was re-read or because time passed. `reviewDueAt` is a date-only editorial
deadline chosen from the case's known decision points, correction risks, and expected rate of
change. An active record remains eligible through `reviewDueAt`; it is past due when the reference
date is later than `reviewDueAt`.

`cadence` describes that expected rate of change:

- `fast`: a known decision, implementation date, membership change, or operational development can
  materially change the case within days;
- `standard`: the decision frame is expected to remain useful for weeks but still needs a planned
  check; and
- `slow`: the record is mainly structural, anniversary, or background context.

Cadence does not calculate `reviewDueAt`. The author records the deadline explicitly and explains
it through the evidence and correction risks. Before an active launch reaches that deadline, an
editor must either publish an approved version with a newly supported evidence window or move the
record out of the active launch role. There is no scheduled status change, automatic publication,
scraper, or model-authored update.

## Versioning and corrections

Keep `id` and `slug` stable. Increment `version` when a published case changes in a way that could
affect a reader's answer or interpretation. Extend the evidence window and source ledger rather than
rewriting old source URLs. Use `revisit` only after an editorially reviewed update can distinguish
supported, weakened, and unresolved assumptions.

Changing evidence, `asOf`, a correction, or a revisit requires a new reviewed record version.
Never overwrite the previous evidentiary state in place. A status-only demotion preserves the
existing content version and dates because it does not claim that the evidence was refreshed.

The `/cases/[slug]/sources` route reads claim coverage from the source ledger. The
`/cases/[slug]/corrections` route reports the public record version and evidence date. Internal
wording and correction-risk notes are not rendered as findings.

Do not add a sample or seed case. The empty state is the correct production state until an approved
research record is available.

## Schema v2 migration record

The three records first published on 17 July 2026 were migrated to schema v2 without changing their
content version, `updatedAt`, evidence window, or `asOf` date:

- `europe-missile-defence-coalition-ukraine` is `fast`, due for review on 24 July, and
  `review-due`. Its coalition membership, delivery commitments, and U.S. force-review context were
  explicitly identified as fast-moving, so it is no longer the launch record.
- `us-brazil-section-301-tariffs` is `fast`, due for review on 22 July, and `review-due`. The date is
  the implementation boundary already named in the approved record.
- `south-china-sea-award-at-ten` is `slow` background, with an authored review checkpoint on
  15 October. It remains useful anniversary and legal context, but it is not presented as current.

These fields record editorial status as of the migration. They do not claim any evidence review
after 17 July or invent an August update.
