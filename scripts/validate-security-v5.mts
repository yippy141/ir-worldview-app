#!/usr/bin/env node

import { createHash } from "node:crypto"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { pathToFileURL } from "node:url"
import { MODULE_CALIBRATIONS } from "@/lib/modules/calibration-data"
// Node's strip-types runtime requires the explicit .mts extension.
// @ts-expect-error TypeScript's bundler resolver disallows that runtime form.
import { SECURITY_V5_BANK_PATH, SECURITY_V5_BANK_SHA256, SECURITY_V5_LEDGER_PATH, SECURITY_V5_LEDGER_SHA256, SecurityV5ValidationError, buildSecurityV5BankValidationReport, parseSecurityV4BalanceLedger, renderSecurityV4ValidationReport } from "@/scripts/validate-security-v4.mts"

export const SECURITY_V5_CALIBRATION_SHA256 =
  "97bf80cbd1cb4af2c202e1b70efbd25ec7b262e88250c6558cd80f090442e9be"

const SECURITY_V4_BANK_PATH = "content/instrument/security.v4.json"
const SECURITY_SOURCE_LEDGER_PATH =
  "docs/v23/security/V23_3_SECURITY_SOURCE_LEDGER.md"

const EXACT_USABLE_SOURCE_IDS = new Set([
  "T01",
  "T02",
  "T03",
  "T05",
  "T07",
  "T08",
  "T09",
  "T10",
  "I01",
  "I02",
  "I03",
  "I06",
  "I07-S1",
  "I08",
  "I09",
  "I10",
  "I12",
  "I14",
  "U01",
  "U03",
  "U04",
  "U05",
  "U08",
  "U10",
  "U12",
])

/**
 * Closed editorial register for specialist terms used by v5 options. Each
 * entry binds option language to the sentence that introduces it on-card.
 */
export const SECURITY_V5_SPECIALIST_TERM_BINDINGS = [
  ["gray_zone_sabotage", "attribution", "attribution means"],
  ["gray_zone_sabotage", "threshold", "response threshold is"],
  ["eastern_flank", "pre-position", "pre-positioned stocks are"],
  ["eastern_flank", "rotational deployments", "rotational deployment is"],
  ["eastern_flank", "force ceiling", "force ceiling is"],
  ["maritime_pressure", "visiting-force access", "visiting-force access permits"],
  ["maritime_pressure", "coast-guard picture", "shared coast-guard picture is"],
  ["middle_power_alignment", "domestic denial", "domestic denial means"],
  ["middle_power_alignment", "diversified procurement", "diversified procurement means"],
  ["middle_power_alignment", "exclusive basing", "exclusive basing gives"],
  ["middle_power_alignment", "opt-outs", "opt-out lets"],
  ["atrocity_response", "mandate", "mandate is"],
  ["atrocity_response", "force ceiling", "force ceiling is"],
  ["aid_corridor", "escort", "escort is"],
  ["aid_corridor", "host-state authority", "host-state authority means"],
  ["sanctions_enforcement", "safe harbors", "safe harbor is"],
  ["sanctions_enforcement", "appeals process", "appeals process lets"],
  ["selective_enforcement_memory", "no-fly", "no-fly measure restricts"],
  ["selective_enforcement_memory", "mandate", "mandate is"],
  ["taiwan_beijing_instrument", "naval exclusion", "naval exclusion means"],
  ["taiwan_beijing_instrument", "military blockade", "military blockade is"],
  ["taiwan_beijing_instrument", "aviation notices", "aviation notice tells"],
  ["taiwan_washington_coalition", "common floor", "common floor is"],
  ["taiwan_washington_coalition", "modular participation", "modular participation lets"],
  ["taiwan_washington_coalition", "burden-sharing", "burden-sharing describes"],
  ["iran_tehran_leverage", "declared sites", "declared site is"],
  ["iran_tehran_leverage", "fuel-cycle activity", "fuel-cycle activity means"],
  ["iran_tehran_leverage", "missile tests", "missile-test notification gives"],
  ["iran_tehran_leverage", "incident hotline", "incident hotline is"],
  ["iran_israel_gulf_thresholds", "preventive action", "preventive action means"],
  ["iran_israel_gulf_thresholds", "posture", "posture means"],
  ["iran_mediator_navigation", "emergency energy reserves", "strategic-stock releases draw"],
  ["iran_mediator_navigation", "investigation by outsiders", "third-party investigation uses"],
  ["ukraine_kyiv_security_architecture", "guarantor", "guarantor is"],
  ["ukraine_kyiv_security_architecture", "trigger", "trigger is"],
  ["ukraine_kyiv_security_architecture", "monitored limits", "monitored force limit is"],
  ["ukraine_moscow_bargaining_tradeoff", "legal recognition", "legal recognition means"],
  ["ukraine_moscow_bargaining_tradeoff", "monitored limits", "monitored limit is"],
  ["ukraine_external_division_of_labor", "verification", "verification means"],
  ["ukraine_external_division_of_labor", "enforcement", "enforcement means"],
  ["ukraine_external_division_of_labor", "military-guarantor", "military guarantor promises"],
] as const

type SecurityBank = {
  instrumentVersion: number
  items: Array<{
    id: string
    cardType: string
    scene: string
    whyHard: string
    options: Array<{
      id: string
      title: string
      label: string
      signals: Record<string, number>
    }>
  }>
}

export type SecurityV5ValidationReport = Awaited<
  ReturnType<typeof buildSecurityV5BankValidationReport>
> & {
  calibrationSha256: typeof SECURITY_V5_CALIBRATION_SHA256
  scoredOptionIdsAndSignalsMatchV4: true
  exactSourceIds: string[]
  specialistTermBindingsChecked: number
}

export async function buildSecurityV5ValidationReport(
  projectRoot = process.cwd(),
): Promise<SecurityV5ValidationReport> {
  const bankReport = await buildSecurityV5BankValidationReport(projectRoot)
  const [v4Text, v5Text, ledgerText, sourceLedgerText] = await Promise.all([
    readFile(resolve(projectRoot, SECURITY_V4_BANK_PATH), "utf8"),
    readFile(resolve(projectRoot, SECURITY_V5_BANK_PATH), "utf8"),
    readFile(resolve(projectRoot, SECURITY_V5_LEDGER_PATH), "utf8"),
    readFile(resolve(projectRoot, SECURITY_SOURCE_LEDGER_PATH), "utf8"),
  ])
  const v4 = JSON.parse(v4Text) as SecurityBank
  const v5 = JSON.parse(v5Text) as SecurityBank
  const problems: string[] = []

  const calibrationSha256 = sha256(
    JSON.stringify(MODULE_CALIBRATIONS.security),
  )
  if (calibrationSha256 !== SECURITY_V5_CALIBRATION_SHA256) {
    problems.push(
      `calibration SHA-256 drifted; expected ${SECURITY_V5_CALIBRATION_SHA256}, received ${calibrationSha256}.`,
    )
  }

  if (scoredSignature(v4) !== scoredSignature(v5)) {
    problems.push(
      "bank v5 must preserve every scored v4 item ID, option ID, and signal.",
    )
  }

  const registeredSourceIds = new Set(
    [...sourceLedgerText.matchAll(/^\| ([A-Z][0-9]{2}(?:-S[0-9]+)?) \|/gmu)].map(
      (match) => match[1],
    ),
  )
  const sourceIds = [
    ...new Set(
      parseSecurityV4BalanceLedger(ledgerText).flatMap((row) => row.sourceIds),
    ),
  ].sort()
  for (const sourceId of sourceIds) {
    if (sourceId === "SAx") continue
    if (!registeredSourceIds.has(sourceId)) {
      problems.push(`${sourceId} does not resolve in the approved source ledger.`)
    }
    if (!EXACT_USABLE_SOURCE_IDS.has(sourceId)) {
      problems.push(`${sourceId} is not approved for a bank-v5 setup claim.`)
    }
  }

  const items = new Map(v5.items.map((item) => [item.id, item]))
  for (const [itemId, optionTerm, introduction] of
    SECURITY_V5_SPECIALIST_TERM_BINDINGS) {
    const item = items.get(itemId)
    if (!item) {
      problems.push(`specialist-term binding references missing item ${itemId}.`)
      continue
    }
    const optionCopy = item.options
      .map((option) => `${option.title} ${option.label}`)
      .join(" ")
      .toLocaleLowerCase("en-US")
    const contextCopy = `${item.scene} ${item.whyHard}`.toLocaleLowerCase(
      "en-US",
    )
    if (!optionCopy.includes(optionTerm)) {
      problems.push(`${itemId} no longer uses registered term ${optionTerm}.`)
    }
    if (!contextCopy.includes(introduction)) {
      problems.push(
        `${itemId} does not introduce ${optionTerm} through ${introduction}.`,
      )
    }
  }

  if (problems.length > 0) throw new SecurityV5ValidationError(problems)

  return {
    ...bankReport,
    calibrationSha256: SECURITY_V5_CALIBRATION_SHA256,
    scoredOptionIdsAndSignalsMatchV4: true,
    exactSourceIds: sourceIds,
    specialistTermBindingsChecked:
      SECURITY_V5_SPECIALIST_TERM_BINDINGS.length,
  }
}

function scoredSignature(bank: SecurityBank) {
  return JSON.stringify(
    bank.items
      .filter((item) => item.cardType !== "actorLens")
      .map((item) => ({
        id: item.id,
        options: item.options.map((option) => ({
          id: option.id,
          signals: option.signals,
        })),
      })),
  )
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex")
}

async function run() {
  const report = await buildSecurityV5ValidationReport()
  process.stdout.write(
    `${renderSecurityV4ValidationReport(report)}\n` +
      `Calibration SHA-256: ${report.calibrationSha256}.\n` +
      `Exact setup source IDs: ${report.exactSourceIds.join(", ")}.\n` +
      `Specialist-term bindings checked: ${report.specialistTermBindingsChecked}.\n`,
  )
}

const entryPoint = process.argv[1]
if (
  entryPoint &&
  pathToFileURL(resolve(entryPoint)).href === import.meta.url
) {
  run().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}

export {
  SECURITY_V5_BANK_PATH,
  SECURITY_V5_BANK_SHA256,
  SECURITY_V5_LEDGER_PATH,
  SECURITY_V5_LEDGER_SHA256,
}
