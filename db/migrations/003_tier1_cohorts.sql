-- Existing pre-cohort counters cannot be compared safely with an exact V21
-- item form and locale. Preserve them under legacyUnknown while all current
-- writes use explicit form, completion-locale, and copy-version keys.

begin;

alter table agg_dimension_buckets
  add column if not exists form_key text not null default 'legacyUnknown',
  add column if not exists completion_locale text not null default 'unknown',
  add column if not exists locale_copy_version integer not null default 0;

alter table agg_dimension_buckets
  drop constraint if exists agg_dimension_buckets_pkey;
alter table agg_dimension_buckets
  add primary key (
    instrument_version,
    scoring_version,
    form_key,
    completion_locale,
    locale_copy_version,
    dimension,
    bucket
  );

alter table agg_labels
  add column if not exists form_key text not null default 'legacyUnknown',
  add column if not exists completion_locale text not null default 'unknown',
  add column if not exists locale_copy_version integer not null default 0,
  add column if not exists archetype_code text not null default 'legacyUnknown';

alter table agg_labels
  drop constraint if exists agg_labels_pkey;
alter table agg_labels
  add primary key (
    instrument_version,
    scoring_version,
    form_key,
    completion_locale,
    locale_copy_version,
    family,
    strategy_modifier,
    normative_modifier,
    archetype_code
  );

alter table agg_completion
  add column if not exists form_key text not null default 'legacyUnknown',
  add column if not exists completion_locale text not null default 'unknown',
  add column if not exists locale_copy_version integer not null default 0;

alter table agg_completion
  drop constraint if exists agg_completion_pkey;
alter table agg_completion
  add primary key (
    instrument_version,
    form_key,
    completion_locale,
    locale_copy_version,
    tier,
    step_index
  );

alter table agg_item_latency
  add column if not exists form_key text not null default 'legacyUnknown',
  add column if not exists completion_locale text not null default 'unknown',
  add column if not exists locale_copy_version integer not null default 0;

alter table agg_item_latency
  drop constraint if exists agg_item_latency_pkey;
alter table agg_item_latency
  add primary key (
    instrument_version,
    form_key,
    completion_locale,
    locale_copy_version,
    item_id,
    latency_bucket_ms
  );

-- Converge an upgraded pre-cohort schema with a fresh schema from migration
-- 001. Legacy rows retain explicit sentinel values, while future inserts must
-- supply every cohort key.

alter table agg_dimension_buckets
  alter column form_key drop default,
  alter column completion_locale drop default,
  alter column locale_copy_version drop default,
  drop constraint if exists agg_dimension_buckets_completion_locale_check,
  drop constraint if exists agg_dimension_buckets_locale_copy_version_check;
alter table agg_dimension_buckets
  add constraint agg_dimension_buckets_completion_locale_check
    check (completion_locale in ('en', 'zh-Hans', 'unknown')),
  add constraint agg_dimension_buckets_locale_copy_version_check
    check (locale_copy_version >= 0);

alter table agg_labels
  alter column form_key drop default,
  alter column completion_locale drop default,
  alter column locale_copy_version drop default,
  alter column archetype_code drop default,
  drop constraint if exists agg_labels_completion_locale_check,
  drop constraint if exists agg_labels_locale_copy_version_check;
alter table agg_labels
  add constraint agg_labels_completion_locale_check
    check (completion_locale in ('en', 'zh-Hans', 'unknown')),
  add constraint agg_labels_locale_copy_version_check
    check (locale_copy_version >= 0);

alter table agg_completion
  alter column form_key drop default,
  alter column completion_locale drop default,
  alter column locale_copy_version drop default,
  drop constraint if exists agg_completion_completion_locale_check,
  drop constraint if exists agg_completion_locale_copy_version_check;
alter table agg_completion
  add constraint agg_completion_completion_locale_check
    check (completion_locale in ('en', 'zh-Hans', 'unknown')),
  add constraint agg_completion_locale_copy_version_check
    check (locale_copy_version >= 0);

alter table agg_item_latency
  alter column form_key drop default,
  alter column completion_locale drop default,
  alter column locale_copy_version drop default,
  drop constraint if exists agg_item_latency_completion_locale_check,
  drop constraint if exists agg_item_latency_locale_copy_version_check;
alter table agg_item_latency
  add constraint agg_item_latency_completion_locale_check
    check (completion_locale in ('en', 'zh-Hans', 'unknown')),
  add constraint agg_item_latency_locale_copy_version_check
    check (locale_copy_version >= 0);

commit;
