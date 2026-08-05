# V22 Tier 1 activation record

Date: 2026-08-05

Tier 1 stores aggregate counters only. It remains default-off and contains no
raw answers, respondent or session identifiers, contact data, cookies, free
text, response order, or timestamp finer than a day. Bounded overcount and
undercount are accepted instead of adding an identity or retry ledger.

Migration `002` creates dormant respondent-level replay tables:
`research_respondents`, `research_sessions`, `research_answers`, and
`research_derived_results`. Their existence is not Tier 2 activation. The
Tier 1 route remains aggregate-only and writes only the four `agg_*` counter
tables.

## Reduced activation gate

| Gate | Evidence | Status |
|---|---|---|
| Staging migrations and catalog inspection | Migrations `001`–`003` ran on an empty Neon database. The historical pre-cohort `001`, current `002`, and current `003` ran on a second database with legacy sentinels retained. Actual `\d+` output for all eight tables and the divergence report are in the [Neon staging evidence](../v22/V22_TIER1_NEON_STAGING_EVIDENCE_2026-08-05.md). | **Pass live** |
| Exact aggregate-only write columns | The exact-column-set assertion passed against both Neon databases. `tests/tier1-aggregate.test.mts` also invokes the real route handler and asserts exact set equality for every `INSERT` column in result and completion writes. | **Pass live and locally** |
| Silent failure | A valid Preview write was made while Neon held `agg_completion` under an `ACCESS EXCLUSIVE` lock. The real three-second driver abort path returned the normal silent `202`, stored no row, and emitted only the expected server log. Local unavailable, malformed-URL, and injected-timeout coverage also passes. | **Pass live and locally** |
| Server-side `n >= 100` suppression | A real Foundation run produced cohort `n = 1`; its deployed result contained neither a percentile nor a population comparison. The local reader test independently verifies that neither label nor bucket rows leave the read path at `n = 99`. | **Pass live and locally** |

## Exact write contract

The result write is limited to:

- `agg_dimension_buckets`: `instrument_version`, `scoring_version`,
  `form_key`, `completion_locale`, `locale_copy_version`, `dimension`,
  `bucket`, `count`
- `agg_labels`: `instrument_version`, `scoring_version`, `form_key`,
  `completion_locale`, `locale_copy_version`, `family`,
  `strategy_modifier`, `normative_modifier`, `archetype_code`, `count`
- `agg_item_latency`: `instrument_version`, `form_key`,
  `completion_locale`, `locale_copy_version`, `item_id`,
  `latency_bucket_ms`, `count`

The completion write is limited to `instrument_version`, `form_key`,
`completion_locale`, `locale_copy_version`, `tier`, `step_index`, and `count`
in `agg_completion`.

All text values in those writes are selected from bounded server-side
contracts. The route rejects unknown payload fields before reaching the
database.

## Staging activation evidence

`TIER1_AGGREGATES_ENABLED=true` is enabled only in the Vercel Preview
environment. The verified Preview deployment is
`dpl_5UoegHRLPxZ3gYmQPT4Cqfns4svc`. Production configuration and production
deployments were not changed.

The real English Foundation run changed the aggregate totals from zero to
seven dimension buckets, one label, 14 completion counters, and 14 coarse
latency counters. All four dormant replay tables remained at zero rows. The
full transcript, counter queries, suppression observation, limiter exercise,
and real database timeout result are in the
[Neon staging evidence](../v22/V22_TIER1_NEON_STAGING_EVIDENCE_2026-08-05.md).

The aggregate write route uses IP-bucketed token buckets held only in process
memory. It retains only a process-salted HMAC bucket key, not the raw IP,
cookie, session ID, or a persistent rate-limit ledger. A limited request
receives the same silent `202` response as any other best-effort aggregate
write. The limiter resets and scales with server instances, so it is an abuse
brake rather than a distributed hard quota.

Rate limiting is a research-integrity control required before the first public
percentile. The live Preview exercise confirmed that the same-client
five-result burst limit suppresses excess writes before Neon while returning
the same silent `202` response. Alert ownership, retry/idempotence semantics,
and rollback rehearsal remain later operational work.
