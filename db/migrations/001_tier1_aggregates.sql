-- Tier 1 stores aggregate counters only. It contains no respondent, session,
-- answer, consent, contact, or other row-level identifiers.

create table if not exists agg_dimension_buckets (
  instrument_version integer not null check (instrument_version > 0),
  scoring_version integer not null check (scoring_version > 0),
  form_key text not null,
  -- `unknown` is reserved for counters migrated from the pre-cohort schema.
  -- Current writes always use an explicit supported completion locale.
  completion_locale text not null
    check (completion_locale in ('en', 'zh-Hans', 'unknown')),
  locale_copy_version integer not null check (locale_copy_version >= 0),
  dimension text not null,
  bucket numeric(2, 1) not null check (bucket between 1.0 and 7.0),
  count bigint not null default 0 check (count >= 0),
  primary key (
    instrument_version,
    scoring_version,
    form_key,
    completion_locale,
    locale_copy_version,
    dimension,
    bucket
  )
);

create table if not exists agg_labels (
  instrument_version integer not null check (instrument_version > 0),
  scoring_version integer not null check (scoring_version > 0),
  form_key text not null,
  completion_locale text not null
    check (completion_locale in ('en', 'zh-Hans', 'unknown')),
  locale_copy_version integer not null check (locale_copy_version >= 0),
  family text not null,
  strategy_modifier text not null,
  normative_modifier text not null,
  archetype_code text not null,
  count bigint not null default 0 check (count >= 0),
  primary key (
    instrument_version,
    scoring_version,
    form_key,
    completion_locale,
    locale_copy_version,
    family,
    strategy_modifier,
    normative_modifier,
    archetype_code
  )
);

create table if not exists agg_completion (
  instrument_version integer not null check (instrument_version > 0),
  form_key text not null,
  completion_locale text not null
    check (completion_locale in ('en', 'zh-Hans', 'unknown')),
  locale_copy_version integer not null check (locale_copy_version >= 0),
  tier text not null,
  step_index integer not null check (step_index >= 0),
  count bigint not null default 0 check (count >= 0),
  primary key (
    instrument_version,
    form_key,
    completion_locale,
    locale_copy_version,
    tier,
    step_index
  )
);

create table if not exists agg_item_latency (
  instrument_version integer not null check (instrument_version > 0),
  form_key text not null,
  completion_locale text not null
    check (completion_locale in ('en', 'zh-Hans', 'unknown')),
  locale_copy_version integer not null check (locale_copy_version >= 0),
  item_id text not null,
  -- Lower bound of the bucket: <2s, 2–5s, 5–10s, 10–30s, 30–120s, >=120s.
  latency_bucket_ms integer not null
    check (latency_bucket_ms in (0, 2000, 5000, 10000, 30000, 120000)),
  count bigint not null default 0 check (count >= 0),
  primary key (
    instrument_version,
    form_key,
    completion_locale,
    locale_copy_version,
    item_id,
    latency_bucket_ms
  )
);
