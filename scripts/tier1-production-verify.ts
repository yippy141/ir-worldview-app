#!/usr/bin/env node

import { resolve } from "node:path"
import { pathToFileURL } from "node:url"
import {
  aggregateCounterTotals,
  assertCoreSmoke,
  assertMigrationHashes,
  assertReplayTablesEmpty,
  assertResetComplete,
  assertSuppressedSmokeStats,
  assertTier1Catalog,
  buildSuppressionStatsUrl,
  CORE_SMOKE_EXPECTATION,
  inspectTier1Database,
  requireOperationsEnvironment,
  safeTier1FailureMessage,
  Tier1OperationsCheckError,
  type Tier1OperationsEnvironment,
} from "@/scripts/tier1-production-operations"

export type Tier1VerificationPhase = "smoke" | "reset" | "status"

export function parseTier1VerificationPhase(
  arguments_: readonly string[],
): Tier1VerificationPhase {
  if (
    arguments_.length !== 1 ||
    !["smoke", "reset", "status"].includes(arguments_[0])
  ) {
    throw new Tier1OperationsCheckError(
      "Pass exactly one verification phase: smoke, reset, or status.",
    )
  }
  return arguments_[0] as Tier1VerificationPhase
}

export async function runTier1ProductionVerification(
  phase: Tier1VerificationPhase,
  environment: Tier1OperationsEnvironment = process.env,
) {
  const { connectionString, expectedDatabase } =
    requireOperationsEnvironment(environment)
  await assertMigrationHashes()
  const inspection = await inspectTier1Database(
    connectionString,
    phase === "smoke",
  )
  assertTier1Catalog(inspection, expectedDatabase)

  if (phase === "smoke") {
    assertCoreSmoke(inspection)
    const statsUrl = buildSuppressionStatsUrl(
      environment.TIER1_SMOKE_RESULT_URL,
      environment.TIER1_PRODUCTION_ORIGIN,
    )
    await assertSuppressedSmokeStats(statsUrl)

    console.log("Tier 1 Production smoke verification passed.")
    console.log(
      "Core counter deltas: " +
        `+${CORE_SMOKE_EXPECTATION.dimensionCount} dimensions, ` +
        `+${CORE_SMOKE_EXPECTATION.labelCount} label, ` +
        `+${CORE_SMOKE_EXPECTATION.completionCount} completion steps, ` +
        `+${CORE_SMOKE_EXPECTATION.latencyCount} latency buckets.`,
    )
    console.log(
      `Public stats: fully suppressed below n = ` +
        `${CORE_SMOKE_EXPECTATION.suppressionThreshold}.`,
    )
    console.log("Dormant replay tables: all zero rows.")
  } else if (phase === "reset") {
    assertResetComplete(inspection)
    console.log("Tier 1 Production reset verification passed.")
    console.log("Aggregate counters: all zero before recruitment.")
    console.log("Dormant replay tables: all zero rows.")
  } else {
    assertReplayTablesEmpty(inspection)
    const totals = aggregateCounterTotals(inspection)
    console.log("Tier 1 Production read-only status passed.")
    for (const [table, total] of Object.entries(totals)) {
      console.log(`${table}: counter total ${total}`)
    }
    console.log("Dormant replay tables: all zero rows.")
  }
  console.log("Database connection and result-link details were not printed.")
}

function isMainModule() {
  const entryPoint = process.argv[1]
  return Boolean(
    entryPoint &&
    pathToFileURL(resolve(entryPoint)).href === import.meta.url,
  )
}

if (isMainModule()) {
  let phase: Tier1VerificationPhase
  try {
    phase = parseTier1VerificationPhase(process.argv.slice(2))
  } catch (error) {
    console.error(
      safeTier1FailureMessage(error, "Tier 1 Production verification"),
    )
    process.exitCode = 1
    phase = "reset"
  }

  if (process.exitCode !== 1) {
    runTier1ProductionVerification(phase).catch((error: unknown) => {
      console.error(
        safeTier1FailureMessage(error, "Tier 1 Production verification"),
      )
      process.exitCode = 1
    })
  }
}
