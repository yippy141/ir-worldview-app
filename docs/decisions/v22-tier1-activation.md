# V22 Tier 1 activation record

Date: 2026-08-02

Tier 1 stores aggregate counters only. It remains default-off and contains no
raw answers, respondent or session identifiers, contact data, cookies, free
text, response order, or timestamp finer than a day. Bounded overcount and
undercount are accepted instead of adding an identity or retry ledger.

## Reduced activation gate

| Gate | Local evidence | Status |
|---|---|---|
| Staging migrations and catalog inspection | The static migration test proves source-level convergence between a fresh schema and the pre-cohort upgrade. No staging database was available in this worktree, so neither migration path nor catalog output has been represented as executed. | **Blocked on staging** |
| Exact aggregate-only write columns | `tests/tier1-aggregate.test.mts` invokes the real route handler with an instrumented database client and asserts exact set equality for every `INSERT` column in both result and completion writes. | **Pass locally** |
| Silent failure | Valid writes return the same accepted response when the database is unavailable, the connection string is malformed, or the write times out. Browser fetch rejection and the analytics opt-out resolve without an unhandled rejection or visible error. | **Pass locally** |
| Server-side `n >= 100` suppression | `tests/aggregate-stats.test.mts` supplies a valid 99-result cohort directly to the server stats reader and verifies that neither label nor bucket rows leave the read path. | **Pass locally** |

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

## Staging-only evidence still required

Do not enable `TIER1_AGGREGATES_ENABLED` until an operator with staging
credentials:

1. runs migrations `001` through `003` against an empty staging database;
2. runs the pre-cohort upgrade path against a disposable legacy schema;
3. captures the actual catalog definition for all four aggregate tables and
   checks it against the migration SQL;
4. completes one Foundation result and confirms that only the expected
   counters increment; and
5. confirms that the stats reader returns suppressed output below `n = 100`.

Rate limiting, alert ownership, retry/idempotence semantics, and rollback
rehearsal are recorded as post-launch operational work, not part of this
reduced activation gate.
