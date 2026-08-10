import { readFile } from "node:fs/promises"
import { createHash } from "node:crypto"
import { resolve } from "node:path"
import { neon } from "@neondatabase/serverless"
import { completionProvenance } from "@/lib/locale-provenance"
import { MIN_PERCENTILE_SAMPLE_SIZE } from "@/lib/percentiles"
import {
  FOUNDATION_INSTRUMENT_VERSION,
  questionCountsBySet,
} from "@/lib/quiz-schema"
import { FOUNDATION_SCORING_VERSION } from "@/lib/scoring"
import { PAYLOAD_DIMENSION_ORDER } from "@/lib/share"

type DefaultKind = "none" | "zero" | "now" | "false" | "completed"

type ExpectedColumn = {
  dataType: string
  nullable: boolean
  defaultKind?: DefaultKind
  numericPrecision?: number
  numericScale?: number
}

type CatalogColumnRow = {
  table_name: string
  column_name: string
  data_type: string
  is_nullable: string
  column_default: string | null
  numeric_precision: string | number | null
  numeric_scale: string | number | null
}

type PrimaryKeyRow = {
  table_name: string
  column_name: string
  ordinal_position: string | number
}

type RlsRow = {
  table_name: string
  rls_enabled: boolean
}

type IndexRow = {
  index_name: string
}

type ForeignKeyRow = {
  table_name: string
  column_name: string
  foreign_table_name: string
  foreign_column_name: string
  delete_rule: string
}

type CheckConstraintRow = {
  table_name: string
  constraint_name: string
}

type PolicyRow = {
  table_name: string
  policy_name: string
}

type TableTotalRow = {
  table_name: string
  row_count: string | number
  counter_total: string | number | null
}

type IdentityRow = {
  database_name: string
  transaction_read_only: string
}

type SmokeCohortRow = {
  metric: string
  row_count: string | number
  counter_total: string | number
  distinct_values: string | number
  minimum_value: string | number | null
  maximum_value: string | number | null
}

export type Tier1Inspection = {
  databaseName: string
  transactionReadOnly: boolean
  columns: CatalogColumnRow[]
  primaryKeys: PrimaryKeyRow[]
  rls: RlsRow[]
  indexes: IndexRow[]
  foreignKeys: ForeignKeyRow[]
  checkConstraints: CheckConstraintRow[]
  policies: PolicyRow[]
  totals: TableTotalRow[]
  smokeCohort: SmokeCohortRow[]
}

export type Tier1OperationsEnvironment = Readonly<
  Record<string, string | undefined>
>

export class Tier1OperationsCheckError extends Error {}

const integer = (nullable = false): ExpectedColumn => ({
  dataType: "integer",
  nullable,
})
const text = (nullable = false): ExpectedColumn => ({
  dataType: "text",
  nullable,
})
const bigint = (defaultKind: DefaultKind = "none"): ExpectedColumn => ({
  dataType: "bigint",
  nullable: false,
  defaultKind,
})
const jsonb = (nullable = true): ExpectedColumn => ({
  dataType: "jsonb",
  nullable,
})
const timestamptz = (
  nullable: boolean,
  defaultKind: DefaultKind = "none",
): ExpectedColumn => ({
  dataType: "timestamp with time zone",
  nullable,
  defaultKind,
})

export const EXPECTED_TIER1_SCHEMA = {
  agg_dimension_buckets: {
    instrument_version: integer(),
    scoring_version: integer(),
    form_key: text(),
    completion_locale: text(),
    locale_copy_version: integer(),
    dimension: text(),
    bucket: {
      dataType: "numeric",
      nullable: false,
      numericPrecision: 2,
      numericScale: 1,
    },
    count: bigint("zero"),
  },
  agg_labels: {
    instrument_version: integer(),
    scoring_version: integer(),
    form_key: text(),
    completion_locale: text(),
    locale_copy_version: integer(),
    family: text(),
    strategy_modifier: text(),
    normative_modifier: text(),
    archetype_code: text(),
    count: bigint("zero"),
  },
  agg_completion: {
    instrument_version: integer(),
    form_key: text(),
    completion_locale: text(),
    locale_copy_version: integer(),
    tier: text(),
    step_index: integer(),
    count: bigint("zero"),
  },
  agg_item_latency: {
    instrument_version: integer(),
    form_key: text(),
    completion_locale: text(),
    locale_copy_version: integer(),
    item_id: text(),
    latency_bucket_ms: integer(),
    count: bigint("zero"),
  },
  research_respondents: {
    respondent_id: { dataType: "uuid", nullable: false },
    created_at: timestamptz(false, "now"),
    last_seen_at: timestamptz(true),
    research_consent: {
      dataType: "boolean",
      nullable: false,
      defaultKind: "false",
    },
    consent_version: text(true),
    source: text(true),
  },
  research_sessions: {
    session_id: { dataType: "uuid", nullable: false },
    respondent_id: { dataType: "uuid", nullable: false },
    instrument: text(),
    instrument_version: text(),
    scoring_version: text(),
    consent_version: text(),
    mode: text(true),
    app_version: text(true),
    started_at: timestamptz(true),
    completed_at: timestamptz(true),
    completion_status: {
      dataType: "text",
      nullable: false,
      defaultKind: "completed",
    },
    duration_seconds: integer(true),
    created_at: timestamptz(false, "now"),
  },
  research_answers: {
    session_id: { dataType: "uuid", nullable: false },
    question_id: text(),
    primary_answer: text(true),
    secondary_answer: text(true),
    raw_numeric: { dataType: "numeric", nullable: true },
    raw_json: jsonb(),
  },
  research_derived_results: {
    session_id: { dataType: "uuid", nullable: false },
    scoring_version: text(),
    top_label: text(true),
    runner_up: text(true),
    profile_state: text(true),
    family_scores: jsonb(),
    archetype_scores: jsonb(),
    dimension_scores: jsonb(),
    axis_scores: jsonb(),
    modifiers: jsonb(),
    summary: text(true),
    created_at: timestamptz(false, "now"),
  },
} as const satisfies Record<string, Record<string, ExpectedColumn>>

export const EXPECTED_TIER1_PRIMARY_KEYS = {
  agg_dimension_buckets: [
    "instrument_version",
    "scoring_version",
    "form_key",
    "completion_locale",
    "locale_copy_version",
    "dimension",
    "bucket",
  ],
  agg_labels: [
    "instrument_version",
    "scoring_version",
    "form_key",
    "completion_locale",
    "locale_copy_version",
    "family",
    "strategy_modifier",
    "normative_modifier",
    "archetype_code",
  ],
  agg_completion: [
    "instrument_version",
    "form_key",
    "completion_locale",
    "locale_copy_version",
    "tier",
    "step_index",
  ],
  agg_item_latency: [
    "instrument_version",
    "form_key",
    "completion_locale",
    "locale_copy_version",
    "item_id",
    "latency_bucket_ms",
  ],
  research_respondents: ["respondent_id"],
  research_sessions: ["session_id"],
  research_answers: ["session_id", "question_id"],
  research_derived_results: ["session_id", "scoring_version"],
} as const

export const EXPECTED_TIER1_INDEXES = [
  "agg_completion_pkey",
  "agg_dimension_buckets_pkey",
  "agg_item_latency_pkey",
  "agg_labels_pkey",
  "idx_research_answers_question",
  "idx_research_derived_results_version",
  "idx_research_sessions_instrument",
  "research_answers_pkey",
  "research_derived_results_pkey",
  "research_respondents_pkey",
  "research_sessions_pkey",
] as const

const EXPECTED_FOREIGN_KEYS = [
  "research_answers.session_id->research_sessions.session_id:CASCADE",
  "research_derived_results.session_id->research_sessions.session_id:CASCADE",
  "research_sessions.respondent_id->research_respondents.respondent_id:CASCADE",
] as const

const EXPECTED_CHECK_CONSTRAINTS = [
  "agg_completion.agg_completion_completion_locale_check",
  "agg_completion.agg_completion_count_check",
  "agg_completion.agg_completion_instrument_version_check",
  "agg_completion.agg_completion_locale_copy_version_check",
  "agg_completion.agg_completion_step_index_check",
  "agg_dimension_buckets.agg_dimension_buckets_bucket_check",
  "agg_dimension_buckets.agg_dimension_buckets_completion_locale_check",
  "agg_dimension_buckets.agg_dimension_buckets_count_check",
  "agg_dimension_buckets.agg_dimension_buckets_instrument_version_check",
  "agg_dimension_buckets.agg_dimension_buckets_locale_copy_version_check",
  "agg_dimension_buckets.agg_dimension_buckets_scoring_version_check",
  "agg_item_latency.agg_item_latency_completion_locale_check",
  "agg_item_latency.agg_item_latency_count_check",
  "agg_item_latency.agg_item_latency_instrument_version_check",
  "agg_item_latency.agg_item_latency_latency_bucket_ms_check",
  "agg_item_latency.agg_item_latency_locale_copy_version_check",
  "agg_labels.agg_labels_completion_locale_check",
  "agg_labels.agg_labels_count_check",
  "agg_labels.agg_labels_instrument_version_check",
  "agg_labels.agg_labels_locale_copy_version_check",
  "agg_labels.agg_labels_scoring_version_check",
] as const

export const AGGREGATE_TABLES = [
  "agg_dimension_buckets",
  "agg_labels",
  "agg_completion",
  "agg_item_latency",
] as const

export const REPLAY_TABLES = [
  "research_respondents",
  "research_sessions",
  "research_answers",
  "research_derived_results",
] as const

export const CORE_SMOKE_EXPECTATION = {
  instrumentVersion: FOUNDATION_INSTRUMENT_VERSION,
  scoringVersion: FOUNDATION_SCORING_VERSION,
  formKey: "core",
  completionLocale: "en",
  localeCopyVersion: completionProvenance("foundation", "en").localeCopyVersion,
  dimensionCount: PAYLOAD_DIMENSION_ORDER.length,
  labelCount: 1,
  completionCount: questionCountsBySet.core,
  latencyCount: questionCountsBySet.core,
  suppressionThreshold: MIN_PERCENTILE_SAMPLE_SIZE,
} as const

export const MIGRATION_SHA256 = {
  "001_tier1_aggregates.sql":
    "0382f48df3ea7012f1b304158d6865ae8360a073f9669da209011583a896cc8d",
  "002_research_scoring_replay.sql":
    "102ed4b1736b6df4fb5a957e2e286e92940d76bf93e6894802594614ae4d96b2",
  "003_tier1_cohorts.sql":
    "61908877b7f5bdf91749e0fd74669caa19db17db3a080422cdb7a03f65b71a59",
} as const

export const IDENTITY_QUERY = `
  select
    current_database()::text as database_name,
    current_setting('transaction_read_only')::text as transaction_read_only
`

export const COLUMNS_QUERY = `
  select
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default,
    numeric_precision,
    numeric_scale
  from information_schema.columns
  where table_schema = 'public'
  order by table_name, column_name
`

export const PRIMARY_KEYS_QUERY = `
  select
    constraints.table_name,
    columns.column_name,
    columns.ordinal_position
  from information_schema.table_constraints as constraints
  join information_schema.key_column_usage as columns
    on columns.constraint_schema = constraints.constraint_schema
   and columns.constraint_name = constraints.constraint_name
  where constraints.table_schema = 'public'
    and constraints.constraint_type = 'PRIMARY KEY'
  order by constraints.table_name, columns.ordinal_position
`

export const RLS_QUERY = `
  select
    classes.relname::text as table_name,
    classes.relrowsecurity as rls_enabled
  from pg_catalog.pg_class as classes
  join pg_catalog.pg_namespace as namespaces
    on namespaces.oid = classes.relnamespace
  where namespaces.nspname = 'public'
    and classes.relkind = 'r'
  order by classes.relname
`

export const INDEXES_QUERY = `
  select indexname::text as index_name
  from pg_catalog.pg_indexes
  where schemaname = 'public'
  order by indexname
`

export const FOREIGN_KEYS_QUERY = `
  select
    source_table.relname::text as table_name,
    source_column.attname::text as column_name,
    target_table.relname::text as foreign_table_name,
    target_column.attname::text as foreign_column_name,
    case constraints.confdeltype
      when 'c' then 'CASCADE'
      when 'r' then 'RESTRICT'
      when 'n' then 'SET NULL'
      when 'd' then 'SET DEFAULT'
      else 'NO ACTION'
    end as delete_rule
  from pg_catalog.pg_constraint as constraints
  join pg_catalog.pg_class as source_table
    on source_table.oid = constraints.conrelid
  join pg_catalog.pg_namespace as namespaces
    on namespaces.oid = source_table.relnamespace
  join pg_catalog.pg_class as target_table
    on target_table.oid = constraints.confrelid
  join pg_catalog.pg_attribute as source_column
    on source_column.attrelid = source_table.oid
   and source_column.attnum = constraints.conkey[1]
  join pg_catalog.pg_attribute as target_column
    on target_column.attrelid = target_table.oid
   and target_column.attnum = constraints.confkey[1]
  where namespaces.nspname = 'public'
    and constraints.contype = 'f'
  order by source_table.relname, source_column.attname
`

export const CHECK_CONSTRAINTS_QUERY = `
  select
    tables.relname::text as table_name,
    constraints.conname::text as constraint_name
  from pg_catalog.pg_constraint as constraints
  join pg_catalog.pg_class as tables
    on tables.oid = constraints.conrelid
  join pg_catalog.pg_namespace as namespaces
    on namespaces.oid = tables.relnamespace
  where namespaces.nspname = 'public'
    and constraints.contype = 'c'
  order by tables.relname, constraints.conname
`

export const POLICIES_QUERY = `
  select
    tablename::text as table_name,
    policyname::text as policy_name
  from pg_catalog.pg_policies
  where schemaname = 'public'
  order by tablename, policyname
`

export const TABLE_TOTALS_QUERY = `
  select 'agg_dimension_buckets'::text as table_name,
    count(*)::text as row_count,
    coalesce(sum(count), 0)::text as counter_total
  from public.agg_dimension_buckets
  union all
  select 'agg_labels', count(*)::text, coalesce(sum(count), 0)::text
  from public.agg_labels
  union all
  select 'agg_completion', count(*)::text, coalesce(sum(count), 0)::text
  from public.agg_completion
  union all
  select 'agg_item_latency', count(*)::text, coalesce(sum(count), 0)::text
  from public.agg_item_latency
  union all
  select 'research_respondents', count(*)::text, null::text
  from public.research_respondents
  union all
  select 'research_sessions', count(*)::text, null::text
  from public.research_sessions
  union all
  select 'research_answers', count(*)::text, null::text
  from public.research_answers
  union all
  select 'research_derived_results', count(*)::text, null::text
  from public.research_derived_results
  order by table_name
`

export const SMOKE_COHORT_QUERY = `
  select 'dimensions'::text as metric,
    count(*)::text as row_count,
    coalesce(sum(count), 0)::text as counter_total,
    count(distinct dimension)::text as distinct_values,
    null::text as minimum_value,
    null::text as maximum_value
  from public.agg_dimension_buckets
  where instrument_version = $1::integer
    and scoring_version = $2::integer
    and form_key = $3::text
    and completion_locale = $4::text
    and locale_copy_version = $5::integer
  union all
  select 'labels',
    count(*)::text,
    coalesce(sum(count), 0)::text,
    count(*)::text,
    null::text,
    null::text
  from public.agg_labels
  where instrument_version = $1::integer
    and scoring_version = $2::integer
    and form_key = $3::text
    and completion_locale = $4::text
    and locale_copy_version = $5::integer
  union all
  select 'completion',
    count(*)::text,
    coalesce(sum(count), 0)::text,
    count(distinct step_index)::text,
    min(step_index)::text,
    max(step_index)::text
  from public.agg_completion
  where instrument_version = $1::integer
    and form_key = $3::text
    and completion_locale = $4::text
    and locale_copy_version = $5::integer
    and tier = 'core'
  union all
  select 'latency',
    count(*)::text,
    coalesce(sum(count), 0)::text,
    count(distinct item_id)::text,
    null::text,
    null::text
  from public.agg_item_latency
  where instrument_version = $1::integer
    and form_key = $3::text
    and completion_locale = $4::text
    and locale_copy_version = $5::integer
  order by metric
`

export const TIER1_READ_ONLY_QUERIES = [
  IDENTITY_QUERY,
  COLUMNS_QUERY,
  PRIMARY_KEYS_QUERY,
  RLS_QUERY,
  INDEXES_QUERY,
  FOREIGN_KEYS_QUERY,
  CHECK_CONSTRAINTS_QUERY,
  POLICIES_QUERY,
  TABLE_TOTALS_QUERY,
  SMOKE_COHORT_QUERY,
] as const

export async function inspectTier1Database(
  connectionString: string,
  includeSmokeCohort: boolean,
): Promise<Tier1Inspection> {
  const sql = neon(connectionString, {
    fetchOptions: {
      signal: AbortSignal.timeout(10_000),
    },
  })
  const queries = [
    IDENTITY_QUERY,
    COLUMNS_QUERY,
    PRIMARY_KEYS_QUERY,
    RLS_QUERY,
    INDEXES_QUERY,
    FOREIGN_KEYS_QUERY,
    CHECK_CONSTRAINTS_QUERY,
    POLICIES_QUERY,
    TABLE_TOTALS_QUERY,
    ...(includeSmokeCohort ? [SMOKE_COHORT_QUERY] : []),
  ]

  const results = await sql.transaction(
    (transaction) =>
      queries.map((query) =>
        transaction.query(
          query,
          query === SMOKE_COHORT_QUERY
            ? [
                CORE_SMOKE_EXPECTATION.instrumentVersion,
                CORE_SMOKE_EXPECTATION.scoringVersion,
                CORE_SMOKE_EXPECTATION.formKey,
                CORE_SMOKE_EXPECTATION.completionLocale,
                CORE_SMOKE_EXPECTATION.localeCopyVersion,
              ]
            : [],
        ),
      ),
    {
      isolationLevel: "Serializable",
      readOnly: true,
      deferrable: true,
    },
  )

  const [
    identityRows,
    columns,
    primaryKeys,
    rls,
    indexes,
    foreignKeys,
    checkConstraints,
    policies,
    totals,
    smokeCohort = [],
  ] = results as unknown as [
    IdentityRow[],
    CatalogColumnRow[],
    PrimaryKeyRow[],
    RlsRow[],
    IndexRow[],
    ForeignKeyRow[],
    CheckConstraintRow[],
    PolicyRow[],
    TableTotalRow[],
    SmokeCohortRow[]?,
  ]
  const identity = identityRows[0]
  if (!identity) {
    throw new Tier1OperationsCheckError(
      "The read-only transaction returned no database identity.",
    )
  }

  return {
    databaseName: identity.database_name,
    transactionReadOnly: identity.transaction_read_only === "on",
    columns,
    primaryKeys,
    rls,
    indexes,
    foreignKeys,
    checkConstraints,
    policies,
    totals,
    smokeCohort,
  }
}

export function requireOperationsEnvironment(
  environment: Tier1OperationsEnvironment,
): { connectionString: string; expectedDatabase: string } {
  const connectionString =
    environment.TIER1_OPERATIONS_DATABASE_URL?.trim() ?? ""
  const expectedDatabase = environment.TIER1_EXPECTED_DATABASE?.trim() ?? ""
  const expectedHostSha256 =
    environment.TIER1_EXPECTED_HOST_SHA256?.trim().toLowerCase() ?? ""
  if (!connectionString) {
    throw new Tier1OperationsCheckError(
      "TIER1_OPERATIONS_DATABASE_URL is required.",
    )
  }
  let databaseUrl: URL
  try {
    databaseUrl = new URL(connectionString)
    if (
      !["postgres:", "postgresql:"].includes(databaseUrl.protocol) ||
      !databaseUrl.hostname ||
      !databaseUrl.pathname.slice(1)
    ) {
      throw new Error("invalid")
    }
  } catch {
    throw new Tier1OperationsCheckError(
      "TIER1_OPERATIONS_DATABASE_URL must be a valid Postgres URL.",
    )
  }
  if (!/^[a-f0-9]{64}$/.test(expectedHostSha256)) {
    throw new Tier1OperationsCheckError(
      "TIER1_EXPECTED_HOST_SHA256 must be the Production database host SHA-256 fingerprint.",
    )
  }
  const actualHostSha256 = createHash("sha256")
    .update(databaseUrl.hostname.toLowerCase())
    .digest("hex")
  if (actualHostSha256 !== expectedHostSha256) {
    throw new Tier1OperationsCheckError(
      "Database host identity does not match TIER1_EXPECTED_HOST_SHA256.",
    )
  }
  if (!expectedDatabase || expectedDatabase.length > 63) {
    throw new Tier1OperationsCheckError(
      "TIER1_EXPECTED_DATABASE must name the dedicated Production database.",
    )
  }

  return { connectionString, expectedDatabase }
}

export function assertTier1Catalog(
  inspection: Tier1Inspection,
  expectedDatabase: string,
) {
  if (!inspection.transactionReadOnly) {
    throw new Tier1OperationsCheckError(
      "The catalog inspection did not run in a read-only transaction.",
    )
  }
  if (inspection.databaseName !== expectedDatabase) {
    throw new Tier1OperationsCheckError(
      "Database identity does not match TIER1_EXPECTED_DATABASE.",
    )
  }

  assertExactColumns(inspection.columns)
  assertExactPrimaryKeys(inspection.primaryKeys)
  assertExactValues(
    inspection.indexes.map((row) => row.index_name),
    EXPECTED_TIER1_INDEXES,
    "index set",
  )
  assertExactValues(
    inspection.foreignKeys.map(
      (row) =>
        `${row.table_name}.${row.column_name}->` +
        `${row.foreign_table_name}.${row.foreign_column_name}:` +
        row.delete_rule,
    ),
    EXPECTED_FOREIGN_KEYS,
    "foreign-key set",
  )
  assertExactValues(
    inspection.checkConstraints.map(
      (row) => `${row.table_name}.${row.constraint_name}`,
    ),
    EXPECTED_CHECK_CONSTRAINTS,
    "check-constraint set",
  )
  if (inspection.policies.length !== 0) {
    throw new Tier1OperationsCheckError(
      "The dormant replay tables must have no active RLS policies.",
    )
  }

  const rlsByTable = new Map(
    inspection.rls.map((row) => [row.table_name, row.rls_enabled]),
  )
  assertExactValues(
    [...rlsByTable.keys()],
    Object.keys(EXPECTED_TIER1_SCHEMA),
    "RLS table set",
  )
  for (const table of AGGREGATE_TABLES) {
    if (rlsByTable.get(table) !== false) {
      throw new Tier1OperationsCheckError(
        `Unexpected row-level-security state for ${table}.`,
      )
    }
  }
  for (const table of REPLAY_TABLES) {
    if (rlsByTable.get(table) !== true) {
      throw new Tier1OperationsCheckError(
        `Row-level security must remain enabled for ${table}.`,
      )
    }
  }
}

export function assertEmptyPreflight(inspection: Tier1Inspection) {
  assertAggregateTotals(inspection, {
    agg_dimension_buckets: 0,
    agg_labels: 0,
    agg_completion: 0,
    agg_item_latency: 0,
  })
  assertReplayTablesEmpty(inspection)
}

export function assertCoreSmoke(inspection: Tier1Inspection) {
  assertAggregateTotals(inspection, {
    agg_dimension_buckets: CORE_SMOKE_EXPECTATION.dimensionCount,
    agg_labels: CORE_SMOKE_EXPECTATION.labelCount,
    agg_completion: CORE_SMOKE_EXPECTATION.completionCount,
    agg_item_latency: CORE_SMOKE_EXPECTATION.latencyCount,
  })
  assertReplayTablesEmpty(inspection)

  const metrics = new Map(
    inspection.smokeCohort.map((row) => [row.metric, row]),
  )
  assertSmokeMetric(
    metrics.get("dimensions"),
    CORE_SMOKE_EXPECTATION.dimensionCount,
    CORE_SMOKE_EXPECTATION.dimensionCount,
    "dimension",
  )
  assertSmokeMetric(
    metrics.get("labels"),
    CORE_SMOKE_EXPECTATION.labelCount,
    CORE_SMOKE_EXPECTATION.labelCount,
    "label",
  )
  assertSmokeMetric(
    metrics.get("completion"),
    CORE_SMOKE_EXPECTATION.completionCount,
    CORE_SMOKE_EXPECTATION.completionCount,
    "completion",
  )
  assertSmokeMetric(
    metrics.get("latency"),
    CORE_SMOKE_EXPECTATION.latencyCount,
    CORE_SMOKE_EXPECTATION.latencyCount,
    "latency",
  )

  const completion = metrics.get("completion")
  if (
    toInteger(completion?.minimum_value) !== 0 ||
    toInteger(completion?.maximum_value) !==
      CORE_SMOKE_EXPECTATION.completionCount - 1
  ) {
    throw new Tier1OperationsCheckError(
      "Core smoke completion steps are not the exact 0–13 sequence.",
    )
  }
}

export function assertResetComplete(inspection: Tier1Inspection) {
  assertEmptyPreflight(inspection)
}

export function assertReplayTablesEmpty(inspection: Tier1Inspection) {
  const totals = new Map(
    inspection.totals.map((row) => [row.table_name, row]),
  )
  for (const table of REPLAY_TABLES) {
    if (toInteger(totals.get(table)?.row_count) !== 0) {
      throw new Tier1OperationsCheckError(
        `Dormant replay table ${table} must contain zero rows.`,
      )
    }
  }
}

export function aggregateCounterTotals(
  inspection: Tier1Inspection,
): Record<(typeof AGGREGATE_TABLES)[number], number> {
  const totals = new Map(
    inspection.totals.map((row) => [row.table_name, row]),
  )
  return Object.fromEntries(
    AGGREGATE_TABLES.map((table) => [
      table,
      toInteger(totals.get(table)?.counter_total),
    ]),
  ) as Record<(typeof AGGREGATE_TABLES)[number], number>
}

export function buildSuppressionStatsUrl(
  resultUrlValue: string | undefined,
  productionOriginValue: string | undefined,
): URL {
  const resultUrl = safeHttpsUrl(
    resultUrlValue,
    "TIER1_SMOKE_RESULT_URL",
  )
  const productionOrigin = safeHttpsUrl(
    productionOriginValue,
    "TIER1_PRODUCTION_ORIGIN",
  )
  if (
    productionOrigin.pathname !== "/" ||
    productionOrigin.search ||
    productionOrigin.hash
  ) {
    throw new Tier1OperationsCheckError(
      "TIER1_PRODUCTION_ORIGIN must contain only the Production HTTPS origin.",
    )
  }
  if (resultUrl.origin !== productionOrigin.origin) {
    throw new Tier1OperationsCheckError(
      "The smoke result URL does not match TIER1_PRODUCTION_ORIGIN.",
    )
  }

  const match = resultUrl.pathname.match(/^\/(?:zh\/)?results\/([^/]+)$/)
  if (!match?.[1]) {
    throw new Tier1OperationsCheckError(
      "TIER1_SMOKE_RESULT_URL must be a Foundation result URL.",
    )
  }

  const statsUrl = new URL("/api/aggregate/stats", productionOrigin)
  statsUrl.searchParams.set("payload", match[1])
  return statsUrl
}

export async function assertSuppressedSmokeStats(
  statsUrl: URL,
  fetchImplementation: typeof fetch = fetch,
) {
  let response: Response
  try {
    response = await fetchImplementation(statsUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
        "cache-control": "no-cache",
      },
      cache: "no-store",
      redirect: "error",
      referrerPolicy: "no-referrer",
    })
  } catch {
    throw new Tier1OperationsCheckError(
      "The read-only Production suppression request failed.",
    )
  }
  if (response.status !== 200) {
    throw new Tier1OperationsCheckError(
      "The Production stats endpoint did not accept the current smoke result.",
    )
  }

  let body: unknown
  try {
    body = await response.json()
  } catch {
    throw new Tier1OperationsCheckError(
      "The Production stats endpoint returned invalid JSON.",
    )
  }
  if (
    !isRecord(body) ||
    !Array.isArray(body.buckets) ||
    !Array.isArray(body.labels) ||
    body.buckets.length !== 0 ||
    body.labels.length !== 0
  ) {
    throw new Tier1OperationsCheckError(
      `The n < ${CORE_SMOKE_EXPECTATION.suppressionThreshold} ` +
        "smoke cohort was not fully suppressed.",
    )
  }
}

export async function assertMigrationHashes() {
  const migrationDirectory = resolve(import.meta.dirname, "../db/migrations")
  for (const [fileName, expectedHash] of Object.entries(MIGRATION_SHA256)) {
    const source = await readFile(resolve(migrationDirectory, fileName))
    const actualHash = createHash("sha256").update(source).digest("hex")
    if (actualHash !== expectedHash) {
      throw new Tier1OperationsCheckError(
        `Migration checksum changed for ${fileName}; review the runbook before activation.`,
      )
    }
  }
}

export function safeTier1FailureMessage(error: unknown, operation: string) {
  if (error instanceof Tier1OperationsCheckError) {
    return `${operation} failed: ${error.message}`
  }
  return `${operation} failed during a read-only check. No connection details were printed.`
}

function assertExactColumns(rows: readonly CatalogColumnRow[]) {
  const expectedTables = Object.keys(EXPECTED_TIER1_SCHEMA)
  assertExactValues(
    [...new Set(rows.map((row) => row.table_name))],
    expectedTables,
    "table set",
  )

  const actual = new Map(
    rows.map((row) => [`${row.table_name}.${row.column_name}`, row]),
  )
  const expectedKeys: string[] = []
  for (const [table, columns] of Object.entries(EXPECTED_TIER1_SCHEMA)) {
    for (const [column, definition] of Object.entries(columns)) {
      const key = `${table}.${column}`
      expectedKeys.push(key)
      const row = actual.get(key)
      if (!row) {
        throw new Tier1OperationsCheckError(`Missing column ${key}.`)
      }
      if (
        row.data_type !== definition.dataType ||
        (row.is_nullable === "YES") !== definition.nullable ||
        !defaultMatches(
          definition.defaultKind ?? "none",
          row.column_default,
        ) ||
        (
          definition.numericPrecision !== undefined &&
          toInteger(row.numeric_precision) !== definition.numericPrecision
        ) ||
        (
          definition.numericScale !== undefined &&
          toInteger(row.numeric_scale) !== definition.numericScale
        )
      ) {
        throw new Tier1OperationsCheckError(
          `Column definition does not match migrations 001–003 for ${key}.`,
        )
      }
    }
  }
  assertExactValues([...actual.keys()], expectedKeys, "column set")
}

function assertExactPrimaryKeys(rows: readonly PrimaryKeyRow[]) {
  const actual = new Map<string, string[]>()
  for (const row of [...rows].sort(
    (left, right) =>
      left.table_name.localeCompare(right.table_name) ||
      toInteger(left.ordinal_position) - toInteger(right.ordinal_position),
  )) {
    actual.set(row.table_name, [
      ...(actual.get(row.table_name) ?? []),
      row.column_name,
    ])
  }
  assertExactValues(
    [...actual.keys()],
    Object.keys(EXPECTED_TIER1_PRIMARY_KEYS),
    "primary-key table set",
  )
  for (const [table, columns] of Object.entries(
    EXPECTED_TIER1_PRIMARY_KEYS,
  )) {
    if (JSON.stringify(actual.get(table)) !== JSON.stringify(columns)) {
      throw new Tier1OperationsCheckError(
        `Primary key does not match migrations 001–003 for ${table}.`,
      )
    }
  }
}

function assertAggregateTotals(
  inspection: Tier1Inspection,
  expected: Record<(typeof AGGREGATE_TABLES)[number], number>,
) {
  const totals = new Map(
    inspection.totals.map((row) => [row.table_name, row]),
  )
  assertExactValues(
    [...totals.keys()],
    [...AGGREGATE_TABLES, ...REPLAY_TABLES],
    "counter table set",
  )
  for (const table of AGGREGATE_TABLES) {
    const row = totals.get(table)
    if (
      !row ||
      toInteger(row.counter_total) !== expected[table] ||
      toInteger(row.row_count) !== expected[table]
    ) {
      throw new Tier1OperationsCheckError(
        `${table} does not match the expected counter total and row count.`,
      )
    }
  }
}

function assertSmokeMetric(
  row: SmokeCohortRow | undefined,
  expectedTotal: number,
  expectedDistinct: number,
  label: string,
) {
  if (
    !row ||
    toInteger(row.counter_total) !== expectedTotal ||
    toInteger(row.row_count) !== expectedTotal ||
    toInteger(row.distinct_values) !== expectedDistinct
  ) {
    throw new Tier1OperationsCheckError(
      `The Core smoke ${label} delta is not exactly ${expectedTotal}.`,
    )
  }
}

function assertExactValues(
  actualValues: readonly string[],
  expectedValues: readonly string[],
  label: string,
) {
  const actual = [...actualValues].sort()
  const expected = [...expectedValues].sort()
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Tier1OperationsCheckError(
      `Production ${label} does not match migrations 001–003.`,
    )
  }
}

function defaultMatches(kind: DefaultKind, value: string | null) {
  if (kind === "none") return value === null
  const normalized = value?.replace(/\s+/g, "").toLowerCase() ?? ""
  if (kind === "zero") return /^(?:0|'0'::bigint)$/.test(normalized)
  if (kind === "now") return normalized === "now()"
  if (kind === "false") return /^(?:false|'false'::boolean)$/.test(normalized)
  return normalized === "'completed'::text"
}

function safeHttpsUrl(value: string | undefined, variableName: string): URL {
  try {
    const url = new URL(value?.trim() ?? "")
    if (url.protocol !== "https:" || url.username || url.password) {
      throw new Error("invalid")
    }
    return url
  } catch {
    throw new Tier1OperationsCheckError(
      `${variableName} must be a credential-free HTTPS URL.`,
    )
  }
}

function toInteger(value: unknown): number {
  const parsed = Number(value)
  return Number.isSafeInteger(parsed) ? parsed : Number.NaN
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}
