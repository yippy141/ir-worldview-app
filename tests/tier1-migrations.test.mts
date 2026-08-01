import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const freshSql = normalizeSql(
  readFileSync(
    new URL("../db/migrations/001_tier1_aggregates.sql", import.meta.url),
    "utf8",
  ),
)
const upgradeSql = normalizeSql(
  readFileSync(
    new URL("../db/migrations/003_tier1_cohorts.sql", import.meta.url),
    "utf8",
  ),
)

const AGGREGATE_TABLES = [
  "agg_dimension_buckets",
  "agg_labels",
  "agg_completion",
  "agg_item_latency",
] as const
const COHORT_COLUMNS = [
  "form_key",
  "completion_locale",
  "locale_copy_version",
] as const

test("fresh and upgraded Tier 1 schemas converge on the cohort contract", () => {
  assert.match(upgradeSql, /^begin;/)
  assert.match(upgradeSql, /commit;$/)

  for (const table of AGGREGATE_TABLES) {
    const freshDefinition = requiredMatch(
      freshSql,
      new RegExp(
        `create table if not exists ${table} \\((.*?)\\);`,
      ),
      `${table} fresh definition`,
    )
    const legacyBackfill = requiredMatch(
      upgradeSql,
      new RegExp(
        `alter table ${table} add column if not exists form_key(.*?);`,
      ),
      `${table} legacy backfill`,
    )
    const defaultCleanup = requiredMatch(
      upgradeSql,
      new RegExp(
        `alter table ${table} alter column form_key drop default(.*?);`,
      ),
      `${table} default cleanup`,
    )
    const upgradeConstraints = requiredMatch(
      upgradeSql,
      new RegExp(
        `alter table ${table} add constraint ${table}_completion_locale_check(.*?);`,
      ),
      `${table} upgraded constraints`,
    )
    const upgradePrimaryKey = requiredMatch(
      upgradeSql,
      new RegExp(
        `alter table ${table} add primary key \\((.*?)\\);`,
      ),
      `${table} upgraded primary key`,
    )

    assert.match(freshDefinition, /form_key text not null/)
    assert.match(
      freshDefinition,
      /completion_locale text not null check \(completion_locale in \('en', 'zh-hans', 'unknown'\)\)/,
    )
    assert.match(
      freshDefinition,
      /locale_copy_version integer not null check \(locale_copy_version >= 0\)/,
    )
    assert.doesNotMatch(
      freshDefinition,
      /form_key text not null default/,
    )
    assert.doesNotMatch(
      freshDefinition,
      /completion_locale text not null default/,
    )
    assert.doesNotMatch(
      freshDefinition,
      /locale_copy_version integer not null default/,
    )

    assert.match(
      legacyBackfill,
      /form_key text not null default 'legacyunknown'/,
    )
    assert.match(
      legacyBackfill,
      /completion_locale text not null default 'unknown'/,
    )
    assert.match(
      legacyBackfill,
      /locale_copy_version integer not null default 0/,
    )
    assert.match(defaultCleanup, /completion_locale drop default/)
    assert.match(defaultCleanup, /locale_copy_version drop default/)

    assert.match(
      upgradeConstraints,
      /check \(completion_locale in \('en', 'zh-hans', 'unknown'\)\)/,
    )
    assert.match(
      upgradeConstraints,
      new RegExp(
        `add constraint ${table}_locale_copy_version_check check \\(locale_copy_version >= 0\\)`,
      ),
    )

    assertCohortColumnsInPrimaryKey(freshDefinition, table, "fresh")
    assertCohortColumnsInPrimaryKey(upgradePrimaryKey, table, "upgrade")

    assert.ok(
      upgradeSql.indexOf(legacyBackfill) <
        upgradeSql.indexOf(defaultCleanup),
      `${table} must backfill legacy rows before dropping defaults`,
    )
  }

  const freshLabels = requiredMatch(
    freshSql,
    /create table if not exists agg_labels \((.*?)\);/,
    "agg_labels fresh definition",
  )
  const upgradedLabels = requiredMatch(
    upgradeSql,
    /alter table agg_labels add column if not exists form_key(.*?);/,
    "agg_labels legacy backfill",
  )
  const labelsCleanup = requiredMatch(
    upgradeSql,
    /alter table agg_labels alter column form_key drop default(.*?);/,
    "agg_labels default cleanup",
  )

  assert.match(freshLabels, /archetype_code text not null/)
  assert.doesNotMatch(freshLabels, /archetype_code text not null default/)
  assert.match(
    upgradedLabels,
    /archetype_code text not null default 'legacyunknown'/,
  )
  assert.match(labelsCleanup, /archetype_code drop default/)
})

function normalizeSql(source: string): string {
  return source
    .replace(/--.*$/gm, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
}

function requiredMatch(
  source: string,
  pattern: RegExp,
  label: string,
): string {
  const match = source.match(pattern)
  assert.ok(match, `Missing ${label}`)
  return match[0]
}

function assertCohortColumnsInPrimaryKey(
  source: string,
  table: string,
  path: "fresh" | "upgrade",
) {
  const match = source.match(/primary key \((.*?)\)/)
  assert.ok(match, `Missing ${path} primary key for ${table}`)
  const columns = match[1].split(",").map((column) => column.trim())

  for (const cohortColumn of COHORT_COLUMNS) {
    assert.ok(
      columns.includes(cohortColumn),
      `${path} ${table} primary key must include ${cohortColumn}`,
    )
  }
}
