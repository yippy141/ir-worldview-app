# Tier 1 Production activation

Status: owner-operated runbook; Production is not activated by this document.

Tier 1 stores derived aggregate counters only. It does not store raw answers,
response order, raw timestamps, result URLs, respondent or session identifiers,
contact data, cookies, or a persistent IP or retry ledger. Migration `002`
also creates four respondent-level replay tables, but those tables must remain
empty. Their presence is not authority to activate Tier 2 or run scoring
replay.

This runbook prepares a controlled Production activation. The owner performs
every Neon, Vercel, deployment, smoke, reset, and rollback step manually.
Repository commands are inspection-only.

## Stop conditions

Stop, keep `TIER1_AGGREGATES_ENABLED` absent or `false`, and investigate if any
of these conditions occurs:

- the Production database or branch is shared with Preview, staging, or
  another application;
- a migration reports an error or its checked-in SHA-256 differs from this
  runbook;
- the exact eight-table catalog check fails;
- any dormant replay table contains a row;
- any aggregate table contains a row before the controlled smoke;
- the smoke produces a counter delta other than `+7 / +1 / +14 / +14`;
- the `n = 1` smoke cohort returns any aggregate bucket or label;
- unexpected traffic arrives before the smoke counters are reset;
- a Production connection string, smoke result URL, or credential appears in
  a transcript.

Do not run `npm run replay:scoring` during this procedure. It is a mutating,
dormant Tier 2 operation.

## Fixed activation contract

The current controlled smoke is one fresh English Core Foundation completion:

| Field | Expected value |
|---|---|
| Foundation instrument version | `2` |
| Foundation scoring version | `2` |
| Form key | `core` |
| Completion locale | `en` |
| Locale-copy version | `1` |
| Core items and reached steps | `14`, steps `0`–`13` |
| Dimension counter delta | `+7` |
| Label counter delta | `+1` |
| Completion counter delta | `+14` |
| Item-latency counter delta | `+14` |
| Replay-table rows | `0` in every table |
| Public comparison threshold | exact-cohort `n >= 100` |

The write endpoint always returns a silent `202` for valid writes when
collection is disabled, rate-limited, or unavailable. A `202` is not evidence
of a database write. Counter inspection is authoritative.

The rate limiter is process-local: five result writes per client bucket with a
one-token-per-hour refill, and 80 completion writes with a one-token-per-30
seconds refill. It is an abuse brake, not a distributed quota. Rate-limited
writes are intentionally absent from logs.

## 1. Record the activation target

Before creating or changing anything, open an owner-controlled activation
record and record:

- owner and UTC start time;
- intended `main` commit SHA;
- Production Neon project, branch, and database names or IDs;
- the separate Preview/staging project, branch, and database names or IDs;
- the intended Vercel Production project and deployment;
- a statement that recruitment has not started.

Do not record a connection string, password, pooled host URI, smoke result URL,
or result payload.

The owner must confirm in the Neon console that the Production database or
branch is separate from Preview/staging. SQL cannot prove branch identity.
Do not clone respondent-level data into it.

## 2. Apply migrations `001`–`003`

Keep the Production feature flag absent or `false`.

Apply these checked-in files in numeric order to the dedicated Production
database, stopping on the first error:

1. `db/migrations/001_tier1_aggregates.sql`
2. `db/migrations/002_research_scoring_replay.sql`
3. `db/migrations/003_tier1_cohorts.sql`

Record these SHA-256 values before execution:

```text
0382f48df3ea7012f1b304158d6865ae8360a073f9669da209011583a896cc8d  001_tier1_aggregates.sql
102ed4b1736b6df4fb5a957e2e286e92940d76bf93e6894802594614ae4d96b2  002_research_scoring_replay.sql
61908877b7f5bdf91749e0fd74669caa19db17db3a080422cdb7a03f65b71a59  003_tier1_cohorts.sql
```

Migrations `001` and `002` are not wrapped in one explicit transaction.
The owner must use a migration runner or SQL editor configured to stop on the
first error. Migration `003` is transactional. Apply all three even on a fresh
database; `003` also closes the supported upgrade path.

## 3. Run the read-only Production preflight

The preflight uses:

- `TIER1_OPERATIONS_DATABASE_URL`: an operator-supplied Postgres connection
  used only by the local inspection command;
- `TIER1_EXPECTED_DATABASE`: the exact dedicated Production database name.

Load the connection string from the password manager or Neon console into the
environment without echoing it and without placing it in argv or shell
history. Do not store it in `.env`, a transcript, or the repository. The
operations URL is not a Vercel runtime variable.

Then run:

```bash
npm run tier1:preflight
```

The command submits only catalog and counter `SELECT` statements inside a
serializable, deferrable, read-only database transaction. It never prints the
connection string, host, role, database name, or raw driver error.

It fails unless all of the following are true:

- the connected database matches `TIER1_EXPECTED_DATABASE`;
- the `public` schema contains exactly four aggregate tables and four replay
  tables;
- every column name, data type, nullability, default, numeric precision, and
  primary-key order matches migrations `001`–`003`;
- expected indexes, foreign keys, check constraints, and RLS states match;
- all four replay tables have RLS enabled and no policies;
- every aggregate counter and replay-table row count is zero;
- local migration files match the pinned checksums.

The exact tables are:

```text
agg_completion
agg_dimension_buckets
agg_item_latency
agg_labels
research_answers
research_derived_results
research_respondents
research_sessions
```

Save the pass/fail summary in the activation record. Do not save environment
values.

## 4. Configure Production-only runtime variables

In the Vercel project settings, the owner manually configures these exact
server-only variables for the **Production** environment:

- `DATABASE_URL`: the dedicated Production database connection, never the
  Preview/staging database;
- `TIER1_AGGREGATES_ENABLED`: exact value `true` only for the controlled smoke
  and eventual recruitment window.

Neither name may use the `NEXT_PUBLIC_` prefix. Do not copy either value into
client configuration. `DATABASE_URL` alone does not activate collection.

Recommended sequence:

1. add the Production-scoped `DATABASE_URL`;
2. leave `TIER1_AGGREGATES_ENABLED` absent or `false`;
3. deploy and confirm ordinary Foundation results still work;
4. set the Production-scoped flag to exact `true`;
5. deploy the recorded `main` SHA for the controlled smoke.

Record only variable names, environment scope, deployment ID, SHA, UTC time,
and operator. Never record values.

## 5. Complete exactly one Production smoke

Use a fresh private browser profile or clear all site data first. A prior valid
disabled `202` can populate the browser-local result dedupe ledger even though
the database did not change.

Confirm that the browser measurement opt-out is off. Complete exactly one
English Core Foundation run:

- answer all 14 Core items;
- review the answers;
- generate the Foundation result once;
- do not refresh or regenerate it;
- do not begin recruitment or invite another participant.

Treat the resulting URL as sensitive. Load it into
`TIER1_SMOKE_RESULT_URL` without echoing it or placing it in command arguments.
Set `TIER1_PRODUCTION_ORIGIN` to the credential-free HTTPS Production origin.
Keep the read-only operations database variables from the preflight available.

Run:

```bash
npm run tier1:verify -- smoke
```

The post-activation command is read-only. It:

- repeats the exact catalog and migration checks;
- verifies that the only aggregate movement is seven dimension counters, one
  label, 14 completion steps, and 14 item-latency counters;
- verifies steps `0`–`13` and the exact English Core cohort;
- verifies all replay tables remain at zero rows;
- sends one same-origin `GET` to the public stats endpoint using the smoke
  payload;
- requires empty `buckets` and `labels` at `n = 1`.

Also inspect the rendered result manually. It must contain no percentile,
rarity, prevalence, or population-comparison claim. The public stats response
is cached for up to five minutes, but an empty cached response is conservative.

If any check fails, immediately follow the rollback checklist and do not reset
or recruit until the cause is known.

## 6. Reset the smoke counters before recruitment

First set `TIER1_AGGREGATES_ENABLED=false` in Vercel Production and redeploy.
Wait for the deployment to be ready. This closes the write window before the
destructive reset.

Run the smoke verifier once more if any time or traffic elapsed. If it no
longer reports exactly the single smoke, stop. Do not delete unexpected
counters.

The owner may then run the following reviewed transaction manually in the
dedicated Production database. It locks only the four aggregate tables,
asserts the exact single-smoke state and zero replay rows, and deletes only the
four aggregate tables. It never touches a replay table.

```sql
begin;

lock table
  public.agg_dimension_buckets,
  public.agg_labels,
  public.agg_completion,
  public.agg_item_latency
in access exclusive mode;

do $tier1_smoke_reset$
declare
  dimension_rows bigint;
  dimension_total bigint;
  label_rows bigint;
  label_total bigint;
  completion_rows bigint;
  completion_total bigint;
  latency_rows bigint;
  latency_total bigint;
  replay_total bigint;
begin
  select count(*), coalesce(sum(count), 0)
    into dimension_rows, dimension_total
    from public.agg_dimension_buckets;
  select count(*), coalesce(sum(count), 0)
    into label_rows, label_total
    from public.agg_labels;
  select count(*), coalesce(sum(count), 0)
    into completion_rows, completion_total
    from public.agg_completion;
  select count(*), coalesce(sum(count), 0)
    into latency_rows, latency_total
    from public.agg_item_latency;
  select
      (select count(*) from public.research_respondents)
    + (select count(*) from public.research_sessions)
    + (select count(*) from public.research_answers)
    + (select count(*) from public.research_derived_results)
    into replay_total;

  if dimension_rows <> 7 or dimension_total <> 7
    or label_rows <> 1 or label_total <> 1
    or completion_rows <> 14 or completion_total <> 14
    or latency_rows <> 14 or latency_total <> 14
    or replay_total <> 0
  then
    raise exception
      'Tier 1 smoke reset aborted: database is not in the exact single-smoke state';
  end if;
end
$tier1_smoke_reset$;

delete from public.agg_dimension_buckets;
delete from public.agg_labels;
delete from public.agg_completion;
delete from public.agg_item_latency;

commit;
```

If the assertion raises, the transaction makes no change. Leave the flag off
and investigate.

After a successful reset, run:

```bash
npm run tier1:verify -- reset
```

This must report zero aggregate counters and zero replay rows. Record the
result. Do not begin recruitment until this check passes.

## 7. Rehearse rollback before recruitment

With the Production feature flag still `false`, run:

```bash
npm run tier1:verify -- status
```

Record the four zero totals. In a fresh browser, open the first Core item once.
The client may receive the ordinary silent `202`, but the database must not
move. Run the same status command again and require identical totals.

This is the rollback rehearsal. It proves that disabling the exact server flag
stops collection without depending on the client response.

Only after the smoke reset and rollback rehearsal pass may the owner set
`TIER1_AGGREGATES_ENABLED=true`, redeploy Production, and open controlled-beta
recruitment.

## 8. Review logs and counters after initial completions

After the first five real completions, the owner must review Production runtime
logs and a read-only counter status:

```bash
npm run tier1:verify -- status
```

Search the relevant deployment interval for:

```text
[aggregate] Completion counter write failed.
[aggregate] Result counter write failed.
[aggregate] Stats read failed.
```

Also review:

- aggregate-route 4xx or 5xx anomalies;
- unexpectedly high or flat `202` volume;
- cohort-specific counter movement against known completion forms;
- all four replay tables still at zero rows;
- absence of percentile and rarity display while exact cohorts remain below
  `n = 100`.

Logs alone cannot prove acceptance because database failures and rate-limit
drops are intentionally silent to the client, and limiter drops have no log.
Use counter movement and logs together. Record the review owner, time range,
deployment ID, findings, and decision to continue or roll back.

## Rollback checklist

Rollback authority remains with the owner. The first and sufficient collection
control is the exact server flag.

- [ ] Set Production `TIER1_AGGREGATES_ENABLED=false` or remove it.
- [ ] Redeploy Production and record deployment ID, SHA, UTC time, and owner.
- [ ] Leave `DATABASE_URL`, migrations, and existing aggregate rows intact.
- [ ] Do not drop tables, reverse migrations, or run scoring replay.
- [ ] Run `npm run tier1:verify -- status` and record a read-only baseline.
- [ ] After the disabled deployment is ready and traffic is quiescent, perform
      one controlled Core-step action in a fresh browser.
- [ ] Run the status command again and require no counter delta.
- [ ] Confirm Foundation completion and result navigation still work.
- [ ] Review the three exact aggregate error messages and route anomalies.
- [ ] Account for the stats endpoint's five-minute cache when checking visible
      comparisons; database counts are authoritative for collection shutdown.
- [ ] Record whether existing aggregate rows will be retained, reviewed, or
      excluded in a later owner decision.

If counters move after the disabled deployment, keep recruitment closed and
investigate deployment scope, environment inheritance, and the active SHA.
Do not attempt a database rollback as the first response.

## Activation record closure

Production activation is complete only when the owner has recorded:

1. separate Production project/branch/database evidence;
2. migration `001`–`003` execution and matching checksums;
3. passing exact-catalog preflight;
4. zero dormant replay rows;
5. Production-only server variable scopes;
6. deployed `main` SHA;
7. one Core smoke and exact `+7 / +1 / +14 / +14` delta;
8. `n < 100` suppression evidence;
9. smoke-counter reset and zero verification before recruitment;
10. disabled-flag rollback rehearsal;
11. the first-five-completions log and counter review.

Until every item is recorded, Tier 1 remains operationally unapproved for
Production recruitment.
