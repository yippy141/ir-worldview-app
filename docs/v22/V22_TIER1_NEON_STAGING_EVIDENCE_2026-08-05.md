# V22 Tier 1 Neon staging evidence — 2026-08-05

This is the live database transcript for Prompt 2D. The target is the dedicated
Neon project used only by Vercel Preview. Production Vercel configuration and
deployments were not changed.

The output below comes from Neon SQL Editor's psql-compatible `\d+` meta-command.
Only the grid presentation was normalized to pipe-delimited text; table names,
column values, indexes, constraints, foreign keys, row-level-security status,
and access methods are unchanged.

## Execution summary

### Fresh path — database `neondb`

- Preflight: `public_tables = 0`; `tier1_tables = 0`.
- `001_tier1_aggregates.sql`: four CREATE statements succeeded.
- `002_research_scoring_replay.sql`: all 17 statements succeeded.
- `003_tier1_cohorts.sql`: all 22 statements, including COMMIT, succeeded.
- Live exact aggregate-column-set assertion: `true`.

### Pre-cohort upgrade — database `tier1_precohort_v22_20260805`

- Role preflight: `neondb_owner`, `rolcreatedb = true`.
- Database preflight: database absent before creation; then `public_tables = 0`
  and `tier1_tables = 0` after creation.
- Historical pre-cohort `001_tier1_aggregates.sql` from commit `82d1919`:
  four CREATE statements succeeded.
- Current migration `002`: all 17 statements succeeded.
- Four legacy sentinel rows inserted: one per aggregate table.
- Current migration `003`: all 22 statements, including COMMIT, succeeded.
- Live exact aggregate-column-set assertion: `true`.
- Sentinel result: all four rows retained `form_key = legacyUnknown`,
  `completion_locale = unknown`, and `locale_copy_version = 0`;
  the label row also retained `archetype_code = legacyUnknown`.

Migration `002` creates dormant respondent-level replay tables. Their
existence is not Tier 2 activation. The Tier 1 route remains aggregate-only and
writes only the four `agg_*` tables.

## Divergence report

No semantic schema divergence was found. Fresh and upgraded tables have the
same exact column sets, column definitions, defaults, primary keys, checks,
indexes, foreign keys, row-level-security state, and access method.

The four upgraded aggregate tables have a different physical display order in
`\d+` because migration `003` appends cohort columns to the historical tables.
The four replay tables have identical physical order. This catalog-only order
difference does not affect named-column writes or the exact-column-set contract.

Expected idempotency notices were observed: migration `002` skipped adding
`research_derived_results.scoring_version` because its CREATE already includes
it; fresh migration `003` skipped cohort columns already present from current
`001`; upgraded migration `003` skipped dropping cohort constraints that did not
exist in the historical schema.

## Preview activation and end-to-end run

- Vercel deployment:
  `dpl_5UoegHRLPxZ3gYmQPT4Cqfns4svc`
  (`https://ir-worldview-ov2gyp01h-yippy141s-projects.vercel.app`).
- Deployment state: `READY`; Preview only.
- `DATABASE_URL`: Vercel Preview only, connected to this Neon project.
- `TIER1_AGGREGATES_ENABLED=true`: Vercel Preview only.
- Production configuration and the production deployment were not changed.

Before the run, all four aggregate totals and all four replay-table row counts
were zero:

```text
dimension_count | label_count | completion_count | latency_count | respondent_rows | session_rows | answer_rows | derived_rows
0               | 0           | 0                | 0             | 0               | 0            | 0           | 0
```

A real English Foundation quiz was completed in the deployed Preview, using
all 14 questions and generating the result page. The resulting database totals
were:

```text
dimension_count | label_count | completion_count | latency_count | respondent_rows | session_rows | answer_rows | derived_rows
7               | 1           | 14               | 14            | 0               | 0            | 0           | 0
```

This is the exact expected delta: one bucket for each of seven dimensions, one
label row, one completion counter for each of 14 reached steps, and one coarse
latency bucket for each of 14 items. The four respondent-level replay tables
remained untouched.

At cohort `n = 1`, the deployed result page contained neither a percentile nor
a population comparison. This confirms that the live server read path
suppressed the below-`n = 100` cohort rather than sending aggregate rows to the
result presentation.

## Live rate-limit verification

The deployed result limiter has a five-token burst capacity per client IP. The
quiz result above consumed one token. Six more valid `fullExtended` result
submissions were then sent sequentially from the same client. Every request
returned the same silent success response:

```text
{"ok":true} HTTP 202
```

Before that batch, the `fullExtended` result counters were all zero. After the
batch, they were:

```text
dimension_count | label_count | latency_count
28              | 4           | 0
```

Each accepted result increments seven dimension buckets and one label, so
exactly four of the six batch submissions reached Neon. Together with the
preceding quiz result, five same-client writes were accepted and the two excess
writes were silently suppressed. This confirms that the live Vercel request
path uses the token bucket before database writes.

The limiter is intentionally process-local. It is an IP-bucketed abuse brake,
not a distributed quota, and can reset on cold start or scale independently
across Vercel instances. It stores only a process-salted one-way bucket key and
does not introduce a respondent identifier.

## Live silent-failure verification

The Neon `agg_completion` table was held under an `ACCESS EXCLUSIVE` lock for
30 seconds. While the lock was held, the deployed route received a valid
`fullExtended` completion write for step 53. The configured Neon client's
three-second abort path fired, while the external response remained:

```text
{"ok":true}
HTTP 202
elapsed: 4.746895 seconds
```

After the lock transaction rolled back, the exact target row still had
`count = 0`. Vercel recorded the expected server-only diagnostic:

```text
[aggregate] Completion counter write failed.
```

This exercised the real Preview route, Vercel runtime, Neon driver, and Neon
database rather than an injected database mock.

## Final repository and environment checks

- Unmerged index entries: none.
- Conflict-marker scan: clean.
- `npm run lint`: pass.
- `npm run test`: pass, 338 tests.
- `npm run build`: pass, 146 static/dynamic routes generated.
- Vercel Preview contains `DATABASE_URL` and
  `TIER1_AGGREGATES_ENABLED`.
- Vercel Production contains neither `DATABASE_URL` nor
  `TIER1_AGGREGATES_ENABLED`; it was not enabled or redeployed.

## Fresh database `\d+` transcript
### \d+ public.agg_dimension_buckets

```text
Table "public.agg_dimension_buckets"
Column | Type | Collation | Nullable | Default | Storage | Compression | Stats target | Description
-------|------|-----------|----------|---------|---------|-------------|--------------|------------
instrument_version | integer |  | not null |  | plain |  |  |
scoring_version | integer |  | not null |  | plain |  |  |
form_key | text |  | not null |  | extended |  |  |
completion_locale | text |  | not null |  | extended |  |  |
locale_copy_version | integer |  | not null |  | plain |  |  |
dimension | text |  | not null |  | extended |  |  |
bucket | numeric(2,1) |  | not null |  | main |  |  |
count | bigint |  | not null | 0 | plain |  |  |
Indexes:
    "agg_dimension_buckets_pkey" PRIMARY KEY, btree (instrument_version, scoring_version, form_key, completion_locale, locale_copy_version, dimension, bucket)
Check constraints:
    "agg_dimension_buckets_bucket_check" CHECK (bucket >= 1.0 AND bucket <= 7.0)
    "agg_dimension_buckets_completion_locale_check" CHECK (completion_locale = ANY (ARRAY['en'::text, 'zh-Hans'::text, 'unknown'::text]))
    "agg_dimension_buckets_count_check" CHECK (count >= 0)
    "agg_dimension_buckets_instrument_version_check" CHECK (instrument_version > 0)
    "agg_dimension_buckets_locale_copy_version_check" CHECK (locale_copy_version >= 0)
    "agg_dimension_buckets_scoring_version_check" CHECK (scoring_version > 0)
Not-null constraints:
    "agg_dimension_buckets_instrument_version_not_null" NOT NULL "instrument_version"
    "agg_dimension_buckets_scoring_version_not_null" NOT NULL "scoring_version"
    "agg_dimension_buckets_form_key_not_null" NOT NULL "form_key"
    "agg_dimension_buckets_completion_locale_not_null" NOT NULL "completion_locale"
    "agg_dimension_buckets_locale_copy_version_not_null" NOT NULL "locale_copy_version"
    "agg_dimension_buckets_dimension_not_null" NOT NULL "dimension"
    "agg_dimension_buckets_bucket_not_null" NOT NULL "bucket"
    "agg_dimension_buckets_count_not_null" NOT NULL "count"
Access method: heap
```
### \d+ public.agg_labels

```text
Table "public.agg_labels"
Column | Type | Collation | Nullable | Default | Storage | Compression | Stats target | Description
-------|------|-----------|----------|---------|---------|-------------|--------------|------------
instrument_version | integer |  | not null |  | plain |  |  |
scoring_version | integer |  | not null |  | plain |  |  |
form_key | text |  | not null |  | extended |  |  |
completion_locale | text |  | not null |  | extended |  |  |
locale_copy_version | integer |  | not null |  | plain |  |  |
family | text |  | not null |  | extended |  |  |
strategy_modifier | text |  | not null |  | extended |  |  |
normative_modifier | text |  | not null |  | extended |  |  |
archetype_code | text |  | not null |  | extended |  |  |
count | bigint |  | not null | 0 | plain |  |  |
Indexes:
    "agg_labels_pkey" PRIMARY KEY, btree (instrument_version, scoring_version, form_key, completion_locale, locale_copy_version, family, strategy_modifier, normative_modifier, archetype_code)
Check constraints:
    "agg_labels_completion_locale_check" CHECK (completion_locale = ANY (ARRAY['en'::text, 'zh-Hans'::text, 'unknown'::text]))
    "agg_labels_count_check" CHECK (count >= 0)
    "agg_labels_instrument_version_check" CHECK (instrument_version > 0)
    "agg_labels_locale_copy_version_check" CHECK (locale_copy_version >= 0)
    "agg_labels_scoring_version_check" CHECK (scoring_version > 0)
Not-null constraints:
    "agg_labels_instrument_version_not_null" NOT NULL "instrument_version"
    "agg_labels_scoring_version_not_null" NOT NULL "scoring_version"
    "agg_labels_form_key_not_null" NOT NULL "form_key"
    "agg_labels_completion_locale_not_null" NOT NULL "completion_locale"
    "agg_labels_locale_copy_version_not_null" NOT NULL "locale_copy_version"
    "agg_labels_family_not_null" NOT NULL "family"
    "agg_labels_strategy_modifier_not_null" NOT NULL "strategy_modifier"
    "agg_labels_normative_modifier_not_null" NOT NULL "normative_modifier"
    "agg_labels_archetype_code_not_null" NOT NULL "archetype_code"
    "agg_labels_count_not_null" NOT NULL "count"
Access method: heap
```
### \d+ public.agg_completion

```text
Table "public.agg_completion"
Column | Type | Collation | Nullable | Default | Storage | Compression | Stats target | Description
-------|------|-----------|----------|---------|---------|-------------|--------------|------------
instrument_version | integer |  | not null |  | plain |  |  |
form_key | text |  | not null |  | extended |  |  |
completion_locale | text |  | not null |  | extended |  |  |
locale_copy_version | integer |  | not null |  | plain |  |  |
tier | text |  | not null |  | extended |  |  |
step_index | integer |  | not null |  | plain |  |  |
count | bigint |  | not null | 0 | plain |  |  |
Indexes:
    "agg_completion_pkey" PRIMARY KEY, btree (instrument_version, form_key, completion_locale, locale_copy_version, tier, step_index)
Check constraints:
    "agg_completion_completion_locale_check" CHECK (completion_locale = ANY (ARRAY['en'::text, 'zh-Hans'::text, 'unknown'::text]))
    "agg_completion_count_check" CHECK (count >= 0)
    "agg_completion_instrument_version_check" CHECK (instrument_version > 0)
    "agg_completion_locale_copy_version_check" CHECK (locale_copy_version >= 0)
    "agg_completion_step_index_check" CHECK (step_index >= 0)
Not-null constraints:
    "agg_completion_instrument_version_not_null" NOT NULL "instrument_version"
    "agg_completion_form_key_not_null" NOT NULL "form_key"
    "agg_completion_completion_locale_not_null" NOT NULL "completion_locale"
    "agg_completion_locale_copy_version_not_null" NOT NULL "locale_copy_version"
    "agg_completion_tier_not_null" NOT NULL "tier"
    "agg_completion_step_index_not_null" NOT NULL "step_index"
    "agg_completion_count_not_null" NOT NULL "count"
Access method: heap
```
### \d+ public.agg_item_latency

```text
Table "public.agg_item_latency"
Column | Type | Collation | Nullable | Default | Storage | Compression | Stats target | Description
-------|------|-----------|----------|---------|---------|-------------|--------------|------------
instrument_version | integer |  | not null |  | plain |  |  |
form_key | text |  | not null |  | extended |  |  |
completion_locale | text |  | not null |  | extended |  |  |
locale_copy_version | integer |  | not null |  | plain |  |  |
item_id | text |  | not null |  | extended |  |  |
latency_bucket_ms | integer |  | not null |  | plain |  |  |
count | bigint |  | not null | 0 | plain |  |  |
Indexes:
    "agg_item_latency_pkey" PRIMARY KEY, btree (instrument_version, form_key, completion_locale, locale_copy_version, item_id, latency_bucket_ms)
Check constraints:
    "agg_item_latency_completion_locale_check" CHECK (completion_locale = ANY (ARRAY['en'::text, 'zh-Hans'::text, 'unknown'::text]))
    "agg_item_latency_count_check" CHECK (count >= 0)
    "agg_item_latency_instrument_version_check" CHECK (instrument_version > 0)
    "agg_item_latency_latency_bucket_ms_check" CHECK (latency_bucket_ms = ANY (ARRAY[0, 2000, 5000, 10000, 30000, 120000]))
    "agg_item_latency_locale_copy_version_check" CHECK (locale_copy_version >= 0)
Not-null constraints:
    "agg_item_latency_instrument_version_not_null" NOT NULL "instrument_version"
    "agg_item_latency_form_key_not_null" NOT NULL "form_key"
    "agg_item_latency_completion_locale_not_null" NOT NULL "completion_locale"
    "agg_item_latency_locale_copy_version_not_null" NOT NULL "locale_copy_version"
    "agg_item_latency_item_id_not_null" NOT NULL "item_id"
    "agg_item_latency_latency_bucket_ms_not_null" NOT NULL "latency_bucket_ms"
    "agg_item_latency_count_not_null" NOT NULL "count"
Access method: heap
```
### \d+ public.research_respondents

```text
Table "public.research_respondents"
Column | Type | Collation | Nullable | Default | Storage | Compression | Stats target | Description
-------|------|-----------|----------|---------|---------|-------------|--------------|------------
respondent_id | uuid |  | not null |  | plain |  |  |
created_at | timestamp with time zone |  | not null | now() | plain |  |  |
last_seen_at | timestamp with time zone |  |  |  | plain |  |  |
research_consent | boolean |  | not null | false | plain |  |  |
consent_version | text |  |  |  | extended |  |  |
source | text |  |  |  | extended |  |  |
Indexes:
    "research_respondents_pkey" PRIMARY KEY, btree (respondent_id)
Referenced by:
    TABLE "research_sessions" CONSTRAINT "research_sessions_respondent_id_fkey" FOREIGN KEY (respondent_id) REFERENCES research_respondents(respondent_id) ON DELETE CASCADE
Policies (row security enabled): (none)
Not-null constraints:
    "research_respondents_respondent_id_not_null" NOT NULL "respondent_id"
    "research_respondents_created_at_not_null" NOT NULL "created_at"
    "research_respondents_research_consent_not_null" NOT NULL "research_consent"
Access method: heap
```
### \d+ public.research_sessions

```text
Table "public.research_sessions"
Column | Type | Collation | Nullable | Default | Storage | Compression | Stats target | Description
-------|------|-----------|----------|---------|---------|-------------|--------------|------------
session_id | uuid |  | not null |  | plain |  |  |
respondent_id | uuid |  | not null |  | plain |  |  |
instrument | text |  | not null |  | extended |  |  |
instrument_version | text |  | not null |  | extended |  |  |
scoring_version | text |  | not null |  | extended |  |  |
consent_version | text |  | not null |  | extended |  |  |
mode | text |  |  |  | extended |  |  |
app_version | text |  |  |  | extended |  |  |
started_at | timestamp with time zone |  |  |  | plain |  |  |
completed_at | timestamp with time zone |  |  |  | plain |  |  |
completion_status | text |  | not null | 'completed'::text | extended |  |  |
duration_seconds | integer |  |  |  | plain |  |  |
created_at | timestamp with time zone |  | not null | now() | plain |  |  |
Indexes:
    "research_sessions_pkey" PRIMARY KEY, btree (session_id)
    "idx_research_sessions_instrument" btree (instrument, instrument_version)
Foreign-key constraints:
    "research_sessions_respondent_id_fkey" FOREIGN KEY (respondent_id) REFERENCES research_respondents(respondent_id) ON DELETE CASCADE
Referenced by:
    TABLE "research_answers" CONSTRAINT "research_answers_session_id_fkey" FOREIGN KEY (session_id) REFERENCES research_sessions(session_id) ON DELETE CASCADE
    TABLE "research_derived_results" CONSTRAINT "research_derived_results_session_id_fkey" FOREIGN KEY (session_id) REFERENCES research_sessions(session_id) ON DELETE CASCADE
Policies (row security enabled): (none)
Not-null constraints:
    "research_sessions_session_id_not_null" NOT NULL "session_id"
    "research_sessions_respondent_id_not_null" NOT NULL "respondent_id"
    "research_sessions_instrument_not_null" NOT NULL "instrument"
    "research_sessions_instrument_version_not_null" NOT NULL "instrument_version"
    "research_sessions_scoring_version_not_null" NOT NULL "scoring_version"
    "research_sessions_consent_version_not_null" NOT NULL "consent_version"
    "research_sessions_completion_status_not_null" NOT NULL "completion_status"
    "research_sessions_created_at_not_null" NOT NULL "created_at"
Access method: heap
```
### \d+ public.research_answers

```text
Table "public.research_answers"
Column | Type | Collation | Nullable | Default | Storage | Compression | Stats target | Description
-------|------|-----------|----------|---------|---------|-------------|--------------|------------
session_id | uuid |  | not null |  | plain |  |  |
question_id | text |  | not null |  | extended |  |  |
primary_answer | text |  |  |  | extended |  |  |
secondary_answer | text |  |  |  | extended |  |  |
raw_numeric | numeric |  |  |  | main |  |  |
raw_json | jsonb |  |  |  | extended |  |  |
Indexes:
    "research_answers_pkey" PRIMARY KEY, btree (session_id, question_id)
    "idx_research_answers_question" btree (question_id)
Foreign-key constraints:
    "research_answers_session_id_fkey" FOREIGN KEY (session_id) REFERENCES research_sessions(session_id) ON DELETE CASCADE
Policies (row security enabled): (none)
Not-null constraints:
    "research_answers_session_id_not_null" NOT NULL "session_id"
    "research_answers_question_id_not_null" NOT NULL "question_id"
Access method: heap
```
### \d+ public.research_derived_results

```text
Table "public.research_derived_results"
Column | Type | Collation | Nullable | Default | Storage | Compression | Stats target | Description
-------|------|-----------|----------|---------|---------|-------------|--------------|------------
session_id | uuid |  | not null |  | plain |  |  |
scoring_version | text |  | not null |  | extended |  |  |
top_label | text |  |  |  | extended |  |  |
runner_up | text |  |  |  | extended |  |  |
profile_state | text |  |  |  | extended |  |  |
family_scores | jsonb |  |  |  | extended |  |  |
archetype_scores | jsonb |  |  |  | extended |  |  |
dimension_scores | jsonb |  |  |  | extended |  |  |
axis_scores | jsonb |  |  |  | extended |  |  |
modifiers | jsonb |  |  |  | extended |  |  |
summary | text |  |  |  | extended |  |  |
created_at | timestamp with time zone |  | not null | now() | plain |  |  |
Indexes:
    "research_derived_results_pkey" PRIMARY KEY, btree (session_id, scoring_version)
    "idx_research_derived_results_version" btree (scoring_version)
Foreign-key constraints:
    "research_derived_results_session_id_fkey" FOREIGN KEY (session_id) REFERENCES research_sessions(session_id) ON DELETE CASCADE
Policies (row security enabled): (none)
Not-null constraints:
    "research_derived_results_session_id_not_null" NOT NULL "session_id"
    "research_derived_results_scoring_version_not_null" NOT NULL "scoring_version"
    "research_derived_results_created_at_not_null" NOT NULL "created_at"
Access method: heap
```
## Pre-cohort upgrade database `\d+` transcript
### \d+ public.agg_dimension_buckets

```text
Table "public.agg_dimension_buckets"
Column | Type | Collation | Nullable | Default | Storage | Compression | Stats target | Description
-------|------|-----------|----------|---------|---------|-------------|--------------|------------
instrument_version | integer |  | not null |  | plain |  |  |
scoring_version | integer |  | not null |  | plain |  |  |
dimension | text |  | not null |  | extended |  |  |
bucket | numeric(2,1) |  | not null |  | main |  |  |
count | bigint |  | not null | 0 | plain |  |  |
form_key | text |  | not null |  | extended |  |  |
completion_locale | text |  | not null |  | extended |  |  |
locale_copy_version | integer |  | not null |  | plain |  |  |
Indexes:
    "agg_dimension_buckets_pkey" PRIMARY KEY, btree (instrument_version, scoring_version, form_key, completion_locale, locale_copy_version, dimension, bucket)
Check constraints:
    "agg_dimension_buckets_bucket_check" CHECK (bucket >= 1.0 AND bucket <= 7.0)
    "agg_dimension_buckets_completion_locale_check" CHECK (completion_locale = ANY (ARRAY['en'::text, 'zh-Hans'::text, 'unknown'::text]))
    "agg_dimension_buckets_count_check" CHECK (count >= 0)
    "agg_dimension_buckets_instrument_version_check" CHECK (instrument_version > 0)
    "agg_dimension_buckets_locale_copy_version_check" CHECK (locale_copy_version >= 0)
    "agg_dimension_buckets_scoring_version_check" CHECK (scoring_version > 0)
Not-null constraints:
    "agg_dimension_buckets_instrument_version_not_null" NOT NULL "instrument_version"
    "agg_dimension_buckets_scoring_version_not_null" NOT NULL "scoring_version"
    "agg_dimension_buckets_dimension_not_null" NOT NULL "dimension"
    "agg_dimension_buckets_bucket_not_null" NOT NULL "bucket"
    "agg_dimension_buckets_count_not_null" NOT NULL "count"
    "agg_dimension_buckets_form_key_not_null" NOT NULL "form_key"
    "agg_dimension_buckets_completion_locale_not_null" NOT NULL "completion_locale"
    "agg_dimension_buckets_locale_copy_version_not_null" NOT NULL "locale_copy_version"
Access method: heap
```
### \d+ public.agg_labels

```text
Table "public.agg_labels"
Column | Type | Collation | Nullable | Default | Storage | Compression | Stats target | Description
-------|------|-----------|----------|---------|---------|-------------|--------------|------------
instrument_version | integer |  | not null |  | plain |  |  |
scoring_version | integer |  | not null |  | plain |  |  |
family | text |  | not null |  | extended |  |  |
strategy_modifier | text |  | not null |  | extended |  |  |
normative_modifier | text |  | not null |  | extended |  |  |
count | bigint |  | not null | 0 | plain |  |  |
form_key | text |  | not null |  | extended |  |  |
completion_locale | text |  | not null |  | extended |  |  |
locale_copy_version | integer |  | not null |  | plain |  |  |
archetype_code | text |  | not null |  | extended |  |  |
Indexes:
    "agg_labels_pkey" PRIMARY KEY, btree (instrument_version, scoring_version, form_key, completion_locale, locale_copy_version, family, strategy_modifier, normative_modifier, archetype_code)
Check constraints:
    "agg_labels_completion_locale_check" CHECK (completion_locale = ANY (ARRAY['en'::text, 'zh-Hans'::text, 'unknown'::text]))
    "agg_labels_count_check" CHECK (count >= 0)
    "agg_labels_instrument_version_check" CHECK (instrument_version > 0)
    "agg_labels_locale_copy_version_check" CHECK (locale_copy_version >= 0)
    "agg_labels_scoring_version_check" CHECK (scoring_version > 0)
Not-null constraints:
    "agg_labels_instrument_version_not_null" NOT NULL "instrument_version"
    "agg_labels_scoring_version_not_null" NOT NULL "scoring_version"
    "agg_labels_family_not_null" NOT NULL "family"
    "agg_labels_strategy_modifier_not_null" NOT NULL "strategy_modifier"
    "agg_labels_normative_modifier_not_null" NOT NULL "normative_modifier"
    "agg_labels_count_not_null" NOT NULL "count"
    "agg_labels_form_key_not_null" NOT NULL "form_key"
    "agg_labels_completion_locale_not_null" NOT NULL "completion_locale"
    "agg_labels_locale_copy_version_not_null" NOT NULL "locale_copy_version"
    "agg_labels_archetype_code_not_null" NOT NULL "archetype_code"
Access method: heap
```
### \d+ public.agg_completion

```text
Table "public.agg_completion"
Column | Type | Collation | Nullable | Default | Storage | Compression | Stats target | Description
-------|------|-----------|----------|---------|---------|-------------|--------------|------------
instrument_version | integer |  | not null |  | plain |  |  |
tier | text |  | not null |  | extended |  |  |
step_index | integer |  | not null |  | plain |  |  |
count | bigint |  | not null | 0 | plain |  |  |
form_key | text |  | not null |  | extended |  |  |
completion_locale | text |  | not null |  | extended |  |  |
locale_copy_version | integer |  | not null |  | plain |  |  |
Indexes:
    "agg_completion_pkey" PRIMARY KEY, btree (instrument_version, form_key, completion_locale, locale_copy_version, tier, step_index)
Check constraints:
    "agg_completion_completion_locale_check" CHECK (completion_locale = ANY (ARRAY['en'::text, 'zh-Hans'::text, 'unknown'::text]))
    "agg_completion_count_check" CHECK (count >= 0)
    "agg_completion_instrument_version_check" CHECK (instrument_version > 0)
    "agg_completion_locale_copy_version_check" CHECK (locale_copy_version >= 0)
    "agg_completion_step_index_check" CHECK (step_index >= 0)
Not-null constraints:
    "agg_completion_instrument_version_not_null" NOT NULL "instrument_version"
    "agg_completion_tier_not_null" NOT NULL "tier"
    "agg_completion_step_index_not_null" NOT NULL "step_index"
    "agg_completion_count_not_null" NOT NULL "count"
    "agg_completion_form_key_not_null" NOT NULL "form_key"
    "agg_completion_completion_locale_not_null" NOT NULL "completion_locale"
    "agg_completion_locale_copy_version_not_null" NOT NULL "locale_copy_version"
Access method: heap
```
### \d+ public.agg_item_latency

```text
Table "public.agg_item_latency"
Column | Type | Collation | Nullable | Default | Storage | Compression | Stats target | Description
-------|------|-----------|----------|---------|---------|-------------|--------------|------------
instrument_version | integer |  | not null |  | plain |  |  |
item_id | text |  | not null |  | extended |  |  |
latency_bucket_ms | integer |  | not null |  | plain |  |  |
count | bigint |  | not null | 0 | plain |  |  |
form_key | text |  | not null |  | extended |  |  |
completion_locale | text |  | not null |  | extended |  |  |
locale_copy_version | integer |  | not null |  | plain |  |  |
Indexes:
    "agg_item_latency_pkey" PRIMARY KEY, btree (instrument_version, form_key, completion_locale, locale_copy_version, item_id, latency_bucket_ms)
Check constraints:
    "agg_item_latency_completion_locale_check" CHECK (completion_locale = ANY (ARRAY['en'::text, 'zh-Hans'::text, 'unknown'::text]))
    "agg_item_latency_count_check" CHECK (count >= 0)
    "agg_item_latency_instrument_version_check" CHECK (instrument_version > 0)
    "agg_item_latency_latency_bucket_ms_check" CHECK (latency_bucket_ms = ANY (ARRAY[0, 2000, 5000, 10000, 30000, 120000]))
    "agg_item_latency_locale_copy_version_check" CHECK (locale_copy_version >= 0)
Not-null constraints:
    "agg_item_latency_instrument_version_not_null" NOT NULL "instrument_version"
    "agg_item_latency_item_id_not_null" NOT NULL "item_id"
    "agg_item_latency_latency_bucket_ms_not_null" NOT NULL "latency_bucket_ms"
    "agg_item_latency_count_not_null" NOT NULL "count"
    "agg_item_latency_form_key_not_null" NOT NULL "form_key"
    "agg_item_latency_completion_locale_not_null" NOT NULL "completion_locale"
    "agg_item_latency_locale_copy_version_not_null" NOT NULL "locale_copy_version"
Access method: heap
```
### \d+ public.research_respondents

```text
Table "public.research_respondents"
Column | Type | Collation | Nullable | Default | Storage | Compression | Stats target | Description
-------|------|-----------|----------|---------|---------|-------------|--------------|------------
respondent_id | uuid |  | not null |  | plain |  |  |
created_at | timestamp with time zone |  | not null | now() | plain |  |  |
last_seen_at | timestamp with time zone |  |  |  | plain |  |  |
research_consent | boolean |  | not null | false | plain |  |  |
consent_version | text |  |  |  | extended |  |  |
source | text |  |  |  | extended |  |  |
Indexes:
    "research_respondents_pkey" PRIMARY KEY, btree (respondent_id)
Referenced by:
    TABLE "research_sessions" CONSTRAINT "research_sessions_respondent_id_fkey" FOREIGN KEY (respondent_id) REFERENCES research_respondents(respondent_id) ON DELETE CASCADE
Policies (row security enabled): (none)
Not-null constraints:
    "research_respondents_respondent_id_not_null" NOT NULL "respondent_id"
    "research_respondents_created_at_not_null" NOT NULL "created_at"
    "research_respondents_research_consent_not_null" NOT NULL "research_consent"
Access method: heap
```
### \d+ public.research_sessions

```text
Table "public.research_sessions"
Column | Type | Collation | Nullable | Default | Storage | Compression | Stats target | Description
-------|------|-----------|----------|---------|---------|-------------|--------------|------------
session_id | uuid |  | not null |  | plain |  |  |
respondent_id | uuid |  | not null |  | plain |  |  |
instrument | text |  | not null |  | extended |  |  |
instrument_version | text |  | not null |  | extended |  |  |
scoring_version | text |  | not null |  | extended |  |  |
consent_version | text |  | not null |  | extended |  |  |
mode | text |  |  |  | extended |  |  |
app_version | text |  |  |  | extended |  |  |
started_at | timestamp with time zone |  |  |  | plain |  |  |
completed_at | timestamp with time zone |  |  |  | plain |  |  |
completion_status | text |  | not null | 'completed'::text | extended |  |  |
duration_seconds | integer |  |  |  | plain |  |  |
created_at | timestamp with time zone |  | not null | now() | plain |  |  |
Indexes:
    "research_sessions_pkey" PRIMARY KEY, btree (session_id)
    "idx_research_sessions_instrument" btree (instrument, instrument_version)
Foreign-key constraints:
    "research_sessions_respondent_id_fkey" FOREIGN KEY (respondent_id) REFERENCES research_respondents(respondent_id) ON DELETE CASCADE
Referenced by:
    TABLE "research_answers" CONSTRAINT "research_answers_session_id_fkey" FOREIGN KEY (session_id) REFERENCES research_sessions(session_id) ON DELETE CASCADE
    TABLE "research_derived_results" CONSTRAINT "research_derived_results_session_id_fkey" FOREIGN KEY (session_id) REFERENCES research_sessions(session_id) ON DELETE CASCADE
Policies (row security enabled): (none)
Not-null constraints:
    "research_sessions_session_id_not_null" NOT NULL "session_id"
    "research_sessions_respondent_id_not_null" NOT NULL "respondent_id"
    "research_sessions_instrument_not_null" NOT NULL "instrument"
    "research_sessions_instrument_version_not_null" NOT NULL "instrument_version"
    "research_sessions_scoring_version_not_null" NOT NULL "scoring_version"
    "research_sessions_consent_version_not_null" NOT NULL "consent_version"
    "research_sessions_completion_status_not_null" NOT NULL "completion_status"
    "research_sessions_created_at_not_null" NOT NULL "created_at"
Access method: heap
```
### \d+ public.research_answers

```text
Table "public.research_answers"
Column | Type | Collation | Nullable | Default | Storage | Compression | Stats target | Description
-------|------|-----------|----------|---------|---------|-------------|--------------|------------
session_id | uuid |  | not null |  | plain |  |  |
question_id | text |  | not null |  | extended |  |  |
primary_answer | text |  |  |  | extended |  |  |
secondary_answer | text |  |  |  | extended |  |  |
raw_numeric | numeric |  |  |  | main |  |  |
raw_json | jsonb |  |  |  | extended |  |  |
Indexes:
    "research_answers_pkey" PRIMARY KEY, btree (session_id, question_id)
    "idx_research_answers_question" btree (question_id)
Foreign-key constraints:
    "research_answers_session_id_fkey" FOREIGN KEY (session_id) REFERENCES research_sessions(session_id) ON DELETE CASCADE
Policies (row security enabled): (none)
Not-null constraints:
    "research_answers_session_id_not_null" NOT NULL "session_id"
    "research_answers_question_id_not_null" NOT NULL "question_id"
Access method: heap
```
### \d+ public.research_derived_results

```text
Table "public.research_derived_results"
Column | Type | Collation | Nullable | Default | Storage | Compression | Stats target | Description
-------|------|-----------|----------|---------|---------|-------------|--------------|------------
session_id | uuid |  | not null |  | plain |  |  |
scoring_version | text |  | not null |  | extended |  |  |
top_label | text |  |  |  | extended |  |  |
runner_up | text |  |  |  | extended |  |  |
profile_state | text |  |  |  | extended |  |  |
family_scores | jsonb |  |  |  | extended |  |  |
archetype_scores | jsonb |  |  |  | extended |  |  |
dimension_scores | jsonb |  |  |  | extended |  |  |
axis_scores | jsonb |  |  |  | extended |  |  |
modifiers | jsonb |  |  |  | extended |  |  |
summary | text |  |  |  | extended |  |  |
created_at | timestamp with time zone |  | not null | now() | plain |  |  |
Indexes:
    "research_derived_results_pkey" PRIMARY KEY, btree (session_id, scoring_version)
    "idx_research_derived_results_version" btree (scoring_version)
Foreign-key constraints:
    "research_derived_results_session_id_fkey" FOREIGN KEY (session_id) REFERENCES research_sessions(session_id) ON DELETE CASCADE
Policies (row security enabled): (none)
Not-null constraints:
    "research_derived_results_session_id_not_null" NOT NULL "session_id"
    "research_derived_results_scoring_version_not_null" NOT NULL "scoring_version"
    "research_derived_results_created_at_not_null" NOT NULL "created_at"
Access method: heap
```
