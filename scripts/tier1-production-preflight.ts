#!/usr/bin/env node

import { resolve } from "node:path"
import { pathToFileURL } from "node:url"
import {
  AGGREGATE_TABLES,
  assertEmptyPreflight,
  assertMigrationHashes,
  assertTier1Catalog,
  inspectTier1Database,
  MIGRATION_SHA256,
  REPLAY_TABLES,
  requireOperationsEnvironment,
  safeTier1FailureMessage,
  type Tier1OperationsEnvironment,
} from "@/scripts/tier1-production-operations"

export async function runTier1ProductionPreflight(
  environment: Tier1OperationsEnvironment = process.env,
) {
  const { connectionString, expectedDatabase } =
    requireOperationsEnvironment(environment)
  await assertMigrationHashes()
  const inspection = await inspectTier1Database(connectionString, false)
  assertTier1Catalog(inspection, expectedDatabase)
  assertEmptyPreflight(inspection)

  console.log("Tier 1 Production preflight passed.")
  console.log(
    `Catalog: ${Object.keys(MIGRATION_SHA256).length} pinned migrations; ` +
      `${AGGREGATE_TABLES.length + REPLAY_TABLES.length} exact tables.`,
  )
  console.log("Aggregate counters: all zero.")
  console.log("Dormant replay tables: all zero rows.")
  console.log("Database connection details were not printed.")
}

function isMainModule() {
  const entryPoint = process.argv[1]
  return Boolean(
    entryPoint &&
    pathToFileURL(resolve(entryPoint)).href === import.meta.url,
  )
}

if (isMainModule()) {
  runTier1ProductionPreflight().catch((error: unknown) => {
    console.error(safeTier1FailureMessage(error, "Tier 1 Production preflight"))
    process.exitCode = 1
  })
}
