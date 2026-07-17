# Current Case content workflow

Current Case is an editorial interactive, not a live-news feed. Production records enter the
typed catalog in `lib/current-cases/catalog.ts` only after the research pack has been approved and
the record passes `validateCurrentCaseForPublication`.

## Public contract

Every published `CurrentCase` must include:

- a stable ID and slug, positive content version, publication state, launch/archive role, category,
  publication date, update date, and bounded evidence window;
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

## Versioning and corrections

Keep `id` and `slug` stable. Increment `version` when a published case changes in a way that could
affect a reader's answer or interpretation. Extend the evidence window and source ledger rather than
rewriting old source URLs. Use `revisit` only after an editorially reviewed update can distinguish
supported, weakened, and unresolved assumptions.

The `/cases/[slug]/sources` route reads claim coverage from the source ledger. The
`/cases/[slug]/corrections` route reports the public record version and evidence date. Internal
wording and correction-risk notes are not rendered as findings.

Do not add a sample or seed case. The empty state is the correct production state until an approved
research record is available.
