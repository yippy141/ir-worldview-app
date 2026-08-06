import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import {
  AGGREGATE_TABLES,
  assertCoreSmoke,
  assertEmptyPreflight,
  assertMigrationHashes,
  assertResetComplete,
  assertSuppressedSmokeStats,
  assertTier1Catalog,
  buildSuppressionStatsUrl,
  CORE_SMOKE_EXPECTATION,
  EXPECTED_TIER1_INDEXES,
  EXPECTED_TIER1_PRIMARY_KEYS,
  EXPECTED_TIER1_SCHEMA,
  REPLAY_TABLES,
  requireOperationsEnvironment,
  safeTier1FailureMessage,
  TIER1_READ_ONLY_QUERIES,
  type Tier1Inspection,
} from "@/scripts/tier1-production-operations"
import { parseTier1VerificationPhase } from "@/scripts/tier1-production-verify"

const expectedDatabase = "ir_worldview_production"

test("Tier 1 Production operations use only read-only catalog and counter SQL", () => {
  const mutatingSql =
    /\b(?:insert|update|delete|truncate|alter|create|drop|grant|revoke|copy|call|merge)\b/iu

  for (const query of TIER1_READ_ONLY_QUERIES) {
    assert.doesNotMatch(query, mutatingSql)
    assert.match(query.trim(), /^(?:select|with)\b/iu)
  }

  const operationsSource = source("scripts/tier1-production-operations.ts")
  assert.match(operationsSource, /readOnly: true/)
  assert.match(operationsSource, /isolationLevel: "Serializable"/)
  assert.match(operationsSource, /deferrable: true/)
})

test("preflight validates the exact eight-table catalog and empty baseline", () => {
  const inspection = validInspection()

  assert.doesNotThrow(() =>
    assertTier1Catalog(inspection, expectedDatabase),
  )
  assert.doesNotThrow(() => assertEmptyPreflight(inspection))
  assert.equal(Object.keys(EXPECTED_TIER1_SCHEMA).length, 8)
  assert.equal(AGGREGATE_TABLES.length, 4)
  assert.equal(REPLAY_TABLES.length, 4)

  const missingColumn = {
    ...inspection,
    columns: inspection.columns.slice(1),
  }
  assert.throws(
    () => assertTier1Catalog(missingColumn, expectedDatabase),
    /column|table set/i,
  )
  assert.throws(
    () => assertTier1Catalog(inspection, "wrong_database"),
    /identity/i,
  )
})

test("smoke verification requires the exact Core deltas and zero replay rows", () => {
  const inspection = validInspection({
    aggregateTotals: {
      agg_dimension_buckets: CORE_SMOKE_EXPECTATION.dimensionCount,
      agg_labels: CORE_SMOKE_EXPECTATION.labelCount,
      agg_completion: CORE_SMOKE_EXPECTATION.completionCount,
      agg_item_latency: CORE_SMOKE_EXPECTATION.latencyCount,
    },
    smoke: true,
  })

  assert.deepEqual(CORE_SMOKE_EXPECTATION, {
    instrumentVersion: 2,
    scoringVersion: 2,
    formKey: "core",
    completionLocale: "en",
    localeCopyVersion: 1,
    dimensionCount: 7,
    labelCount: 1,
    completionCount: 14,
    latencyCount: 14,
    suppressionThreshold: 100,
  })
  assert.doesNotThrow(() => assertCoreSmoke(inspection))

  const replayWrite = {
    ...inspection,
    totals: inspection.totals.map((row) =>
      row.table_name === "research_sessions"
        ? { ...row, row_count: 1 }
        : row,
    ),
  }
  assert.throws(() => assertCoreSmoke(replayWrite), /zero rows/)
})

test("reset verification fails unless every aggregate and replay table is empty", () => {
  assert.doesNotThrow(() => assertResetComplete(validInspection()))

  const remainingSmokeCounter = validInspection({
    aggregateTotals: {
      agg_dimension_buckets: 1,
      agg_labels: 0,
      agg_completion: 0,
      agg_item_latency: 0,
    },
  })
  assert.throws(
    () => assertResetComplete(remainingSmokeCounter),
    /agg_dimension_buckets/,
  )
})

test("suppression verification derives a same-origin GET without printing the payload", async () => {
  const resultUrl =
    "https://inventory.example/results/opaque_smoke_payload?source=owner#result"
  const statsUrl = buildSuppressionStatsUrl(
    resultUrl,
    "https://inventory.example",
  )

  assert.equal(statsUrl.origin, "https://inventory.example")
  assert.equal(statsUrl.pathname, "/api/aggregate/stats")
  assert.equal(statsUrl.searchParams.get("payload"), "opaque_smoke_payload")
  assert.throws(
    () =>
      buildSuppressionStatsUrl(
        resultUrl,
        "https://other.example",
      ),
    /does not match/,
  )

  await assert.doesNotReject(() =>
    assertSuppressedSmokeStats(
      statsUrl,
      async () =>
        Response.json({
          buckets: [],
          labels: [],
        }),
    ),
  )
  await assert.rejects(
    () =>
      assertSuppressedSmokeStats(
        statsUrl,
        async () =>
          Response.json({
            buckets: [{ dimension: "institutions", count: 1 }],
            labels: [],
          }),
      ),
    /not fully suppressed/,
  )
})

test("operations configuration keeps connection strings out of argv and errors", () => {
  const secret =
    "postgresql://secret-user:secret-password@secret-host.example/production"
  assert.deepEqual(
    requireOperationsEnvironment({
      TIER1_OPERATIONS_DATABASE_URL: secret,
      TIER1_EXPECTED_DATABASE: expectedDatabase,
    }),
    {
      connectionString: secret,
      expectedDatabase,
    },
  )

  const message = safeTier1FailureMessage(
    new Error(`driver failed for ${secret}`),
    "Preflight",
  )
  assert.doesNotMatch(message, /secret-user|secret-password|secret-host/)
  assert.match(message, /No connection details were printed/)
  assert.throws(
    () => requireOperationsEnvironment({}),
    /TIER1_OPERATIONS_DATABASE_URL is required/,
  )

  const packageJson = JSON.parse(source("package.json"))
  assert.match(packageJson.scripts["tier1:preflight"], /preflight\.ts$/)
  assert.match(packageJson.scripts["tier1:verify"], /verify\.ts$/)
})

test("verification phases are explicit and fail closed", () => {
  assert.equal(parseTier1VerificationPhase(["smoke"]), "smoke")
  assert.equal(parseTier1VerificationPhase(["reset"]), "reset")
  assert.equal(parseTier1VerificationPhase(["status"]), "status")
  assert.throws(() => parseTier1VerificationPhase([]), /exactly one/)
  assert.throws(() => parseTier1VerificationPhase(["smoke", "reset"]), /exactly one/)
  assert.throws(() => parseTier1VerificationPhase(["unknown"]), /smoke, reset, or status/)
})

test("pinned migration checksums remain current", async () => {
  await assert.doesNotReject(() => assertMigrationHashes())
})

test("Production runbook retains every owner-operated activation gate", () => {
  const runbook = source(
    "docs/operations/TIER1_PRODUCTION_ACTIVATION.md",
  )

  for (const required of [
    "separate from Preview/staging",
    "001_tier1_aggregates.sql",
    "002_research_scoring_replay.sql",
    "003_tier1_cohorts.sql",
    "exact eight-table catalog",
    "zero replay rows",
    "Production-only runtime variables",
    "exactly one Production smoke",
    "+7 / +1 / +14 / +14",
    "n < 100",
    "Reset the smoke counters before recruitment",
    "TIER1_AGGREGATES_ENABLED=false",
    "first five real completions",
    "connection string",
  ]) {
    assert.match(runbook, new RegExp(escapeRegExp(required), "i"), required)
  }

  assert.match(runbook, /owner performs[\s\S]*manually/i)
  assert.match(runbook, /Do not run `npm run replay:scoring`/)
})

function validInspection(
  options: {
    aggregateTotals?: Record<(typeof AGGREGATE_TABLES)[number], number>
    smoke?: boolean
  } = {},
): Tier1Inspection {
  const aggregateTotals = options.aggregateTotals ?? {
    agg_dimension_buckets: 0,
    agg_labels: 0,
    agg_completion: 0,
    agg_item_latency: 0,
  }

  return {
    databaseName: expectedDatabase,
    transactionReadOnly: true,
    columns: Object.entries(EXPECTED_TIER1_SCHEMA).flatMap(
      ([tableName, columns]) =>
        Object.entries(columns).map(([columnName, definition]) => ({
          table_name: tableName,
          column_name: columnName,
          data_type: definition.dataType,
          is_nullable: definition.nullable ? "YES" : "NO",
          column_default: fixtureDefault(definition.defaultKind),
          numeric_precision: definition.numericPrecision ?? null,
          numeric_scale: definition.numericScale ?? null,
        })),
    ),
    primaryKeys: Object.entries(EXPECTED_TIER1_PRIMARY_KEYS).flatMap(
      ([tableName, columns]) =>
        columns.map((columnName, index) => ({
          table_name: tableName,
          column_name: columnName,
          ordinal_position: index + 1,
        })),
    ),
    rls: Object.keys(EXPECTED_TIER1_SCHEMA).map((tableName) => ({
      table_name: tableName,
      rls_enabled: REPLAY_TABLES.includes(
        tableName as (typeof REPLAY_TABLES)[number],
      ),
    })),
    indexes: EXPECTED_TIER1_INDEXES.map((indexName) => ({
      index_name: indexName,
    })),
    foreignKeys: [
      {
        table_name: "research_answers",
        column_name: "session_id",
        foreign_table_name: "research_sessions",
        foreign_column_name: "session_id",
        delete_rule: "CASCADE",
      },
      {
        table_name: "research_derived_results",
        column_name: "session_id",
        foreign_table_name: "research_sessions",
        foreign_column_name: "session_id",
        delete_rule: "CASCADE",
      },
      {
        table_name: "research_sessions",
        column_name: "respondent_id",
        foreign_table_name: "research_respondents",
        foreign_column_name: "respondent_id",
        delete_rule: "CASCADE",
      },
    ],
    checkConstraints: expectedCheckConstraints().map((value) => {
      const separator = value.indexOf(".")
      return {
        table_name: value.slice(0, separator),
        constraint_name: value.slice(separator + 1),
      }
    }),
    policies: [],
    totals: [
      ...AGGREGATE_TABLES.map((tableName) => ({
        table_name: tableName,
        row_count: aggregateTotals[tableName],
        counter_total: aggregateTotals[tableName],
      })),
      ...REPLAY_TABLES.map((tableName) => ({
        table_name: tableName,
        row_count: 0,
        counter_total: null,
      })),
    ],
    smokeCohort: options.smoke
      ? [
          {
            metric: "dimensions",
            row_count: 7,
            counter_total: 7,
            distinct_values: 7,
            minimum_value: null,
            maximum_value: null,
          },
          {
            metric: "labels",
            row_count: 1,
            counter_total: 1,
            distinct_values: 1,
            minimum_value: null,
            maximum_value: null,
          },
          {
            metric: "completion",
            row_count: 14,
            counter_total: 14,
            distinct_values: 14,
            minimum_value: 0,
            maximum_value: 13,
          },
          {
            metric: "latency",
            row_count: 14,
            counter_total: 14,
            distinct_values: 14,
            minimum_value: null,
            maximum_value: null,
          },
        ]
      : [],
  } as Tier1Inspection
}

function fixtureDefault(kind: string | undefined) {
  if (!kind || kind === "none") return null
  if (kind === "zero") return "0"
  if (kind === "now") return "now()"
  if (kind === "false") return "false"
  return "'completed'::text"
}

function expectedCheckConstraints() {
  return [
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
  ]
}

function source(relativePath: string) {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8")
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
