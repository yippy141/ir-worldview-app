#!/usr/bin/env node

/**
 * Blocking Security bank-v4 balance validation.
 *
 * The production bank deliberately keeps the closed v3 item schema. Actor,
 * theater, source, and scoring-role metadata therefore live in the reviewed
 * CSV ledger and are joined to the bank by (mode, item_id). This validator
 * fails closed when either side drifts.
 */

import { createHash } from "node:crypto"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { pathToFileURL } from "node:url"

export const SECURITY_V4_BANK_PATH = "content/instrument/security.v4.json"
export const SECURITY_V4_LEDGER_PATH =
  "docs/v23/security/V23_3_SECURITY_ACTOR_BALANCE_LEDGER.csv"
export const SECURITY_V4_SCORING_VERSION = 2
export const SECURITY_V4_BANK_SHA256 =
  "685317aa2ad0d9f4eea883e6bae9c800364a3865aeb6a49cb2f7f44f600eea4d"
export const SECURITY_V4_LEDGER_SHA256 =
  "eb0e6b2df2812b4f0ef710e93dc40a466273937c22950e9888c1cc0f61ed53f7"

const MODES = ["standard", "analyst"] as const
const AXES = ["activism", "escalation", "alliance", "legitimacy"] as const
const ONE_THIRD = 1 / 3
const NUMBER_TOLERANCE = 1e-6
const ACCEPTED_COST_DELIMITER = " Accepted cost: "

type SecurityMode = (typeof MODES)[number]
type SecurityAxis = (typeof AXES)[number]
type CountRecord = Record<string, number>

type SecurityOption = {
  id: string
  title: string
  label: string
  signals: Record<string, number>
}

type SecurityItem = {
  id: string
  kind: string
  modes: SecurityMode[]
  lane: string
  cardType: string
  discriminatingAxes: string[]
  allowSecondChoiceInAnalyst?: boolean
  options: SecurityOption[]
}

type SecurityBank = {
  instrument: string
  instrumentVersion: number
  items: SecurityItem[]
}

export type SecurityV4LedgerRow = {
  mode: SecurityMode
  itemId: string
  itemRole: string
  theaterFamily: string
  actorLabel: string
  mainScore: boolean
  lane: string
  cardType: string
  sourceIds: string[]
  declaredAxes: string[]
  itemPrimaryWeightPerAxis: number
  itemMaxWeightPerAxis: number
  familyScoredPrimaryNumeratorPerAxis: number
  modePrimaryDenominatorPerAxis: number
  familyScoredMaxNumeratorPerAxis: number
  modeMaxDenominatorPerAxis: number
  familyShares: Record<SecurityAxis, number>
  oneThirdPass: boolean
  reviewStatus: string
}

export type SecurityV4ModeCounts = {
  total: number
  mainScored: number
  actorLens: number
  byDeclaredAxisMainScored: CountRecord
  bySignalAxisMainScored: CountRecord
  byLaneAll: CountRecord
  byLaneMainScored: CountRecord
  byCardType: CountRecord
  byItemRole: CountRecord
  byActor: CountRecord
  byTheater: CountRecord
}

export type SecurityV4TheaterShare = {
  mode: SecurityMode
  axis: SecurityAxis
  theater: string
  primaryNumerator: number
  primaryDenominator: number
  primaryShare: number
  maxSecondaryNumerator: number
  maxSecondaryDenominator: number
  maxSecondaryShare: number
  passes: boolean
}

export type SecurityV4ValidationReport = {
  versions: {
    bank: 4
    scoring: 2
  }
  bankPath: typeof SECURITY_V4_BANK_PATH
  ledgerPath: typeof SECURITY_V4_LEDGER_PATH
  bankSha256: typeof SECURITY_V4_BANK_SHA256
  ledgerSha256: typeof SECURITY_V4_LEDGER_SHA256
  itemCount: 23
  optionCount: 92
  ledgerRowCount: 42
  modes: Record<SecurityMode, SecurityV4ModeCounts>
  theaterShares: SecurityV4TheaterShare[]
  actorLensItemIds: string[]
  mechanismCost: {
    checkedOptions: number
    malformedOptions: string[]
  }
  moralValence: {
    method: "title-lexicon-heuristic"
    findings: Array<{ itemId: string; optionId: string; term: string }>
  }
}

export class SecurityV4ValidationError extends Error {
  readonly problems: string[]

  constructor(problems: readonly string[]) {
    super(
      "Security v4 validation failed:\n" +
        problems.map((problem) => `- ${problem}`).join("\n"),
    )
    this.name = "SecurityV4ValidationError"
    this.problems = [...problems]
  }
}

const STANDARD_ITEM_IDS = [
  "gray_zone_sabotage",
  "eastern_flank",
  "maritime_pressure",
  "middle_power_alignment",
  "atrocity_response",
  "aid_corridor",
  "ceasefire_accountability",
  "taiwan_inspection_regime_core",
  "taiwan_beijing_instrument",
  "taiwan_taipei_continuity",
  "taiwan_washington_coalition",
  "iran_ceasefire_core",
  "iran_tehran_leverage",
  "iran_israel_gulf_thresholds",
  "iran_mediator_navigation",
  "ukraine_ceasefire_stall",
  "ukraine_kyiv_security_architecture",
  "ukraine_moscow_bargaining_tradeoff",
  "ukraine_external_division_of_labor",
] as const

const ANALYST_ONLY_ITEM_IDS = [
  "nuclear_hedging",
  "patron_trust_gap",
  "sanctions_enforcement",
  "selective_enforcement_memory",
] as const

const EXPECTED_MODE_COUNTS: Record<
  SecurityMode,
  Omit<SecurityV4ModeCounts, "bySignalAxisMainScored">
> = {
  standard: {
    total: 19,
    mainScored: 9,
    actorLens: 10,
    byDeclaredAxisMainScored: {
      activism: 7,
      escalation: 5,
      alliance: 4,
      legitimacy: 5,
    },
    byLaneAll: { deterrence: 8, alliances: 7, legitimacy: 4 },
    byLaneMainScored: { deterrence: 4, alliances: 2, legitimacy: 3 },
    byCardType: { actorLens: 10, decision: 4, explanation: 5 },
    byItemRole: {
      new_actor_lens: 9,
      new_scored: 3,
      retained_actor_lens: 1,
      retained_scored: 6,
    },
    byActor: {
      Beijing: 1,
      "Israel-US-Gulf": 1,
      Kyiv: 1,
      Moscow: 1,
      Taipei: 1,
      "Tehran-aligned_groups": 1,
      "Washington-regional_coalition": 1,
      "external_coalition-non_belligerents": 1,
      "mediator-trading_state": 1,
      middle_power: 1,
      neutral: 8,
      small_state: 1,
    },
    byTheater: {
      china_india: 1,
      euro_atlantic: 2,
      generic_mediation: 1,
      indo_pacific_non_taiwan: 1,
      iran: 4,
      taiwan: 4,
      trans_theater_protection: 2,
      ukraine: 4,
    },
  },
  analyst: {
    total: 23,
    mainScored: 13,
    actorLens: 10,
    byDeclaredAxisMainScored: {
      activism: 7,
      escalation: 6,
      alliance: 8,
      legitimacy: 7,
    },
    byLaneAll: { deterrence: 8, alliances: 9, legitimacy: 6 },
    byLaneMainScored: { deterrence: 4, alliances: 4, legitimacy: 5 },
    byCardType: { actorLens: 10, decision: 6, explanation: 7 },
    byItemRole: {
      new_actor_lens: 9,
      new_scored: 3,
      retained_actor_lens: 1,
      retained_scored: 10,
    },
    byActor: {
      Beijing: 1,
      "Israel-US-Gulf": 1,
      Kyiv: 1,
      Moscow: 1,
      Taipei: 1,
      "Tehran-aligned_groups": 1,
      "Washington-regional_coalition": 1,
      "external_coalition-non_belligerents": 1,
      guarantor_state: 1,
      "mediator-trading_state": 1,
      middle_power: 1,
      neutral: 8,
      partner_state: 1,
      post_colonial_caucus: 1,
      small_state: 1,
      swing_states: 1,
    },
    byTheater: {
      china_india: 1,
      euro_atlantic: 2,
      generic_economic_coercion: 1,
      generic_mediation: 1,
      generic_nonproliferation: 1,
      generic_patronage: 1,
      generic_postcolonial_order: 1,
      indo_pacific_non_taiwan: 1,
      iran: 4,
      taiwan: 4,
      trans_theater_protection: 2,
      ukraine: 4,
    },
  },
}

const MORAL_VALENCE_TITLE_TERMS = [
  "balanced",
  "courageous",
  "humane",
  "humanitarian",
  "lawful",
  "moderate",
  "patriotic",
  "principled",
  "realistic",
  "responsible",
  "safer",
  "sensible",
  "smarter",
] as const

const LEDGER_HEADERS = [
  "mode",
  "item_id",
  "item_role",
  "theater_family",
  "actor_label",
  "main_score",
  "lane",
  "card_type",
  "source_ids",
  "declared_axes",
  "item_primary_weight_per_axis",
  "item_max_weight_per_axis",
  "family_scored_primary_numerator_per_axis",
  "mode_primary_denominator_per_axis",
  "family_scored_max_numerator_per_axis",
  "mode_max_denominator_per_axis",
  "activism_family_share",
  "escalation_family_share",
  "alliance_family_share",
  "legitimacy_family_share",
  "one_third_pass",
  "review_status",
] as const

export async function buildSecurityV4ValidationReport(
  projectRoot = process.cwd(),
): Promise<SecurityV4ValidationReport> {
  const [bankText, ledgerText] = await Promise.all([
    readFile(resolve(projectRoot, SECURITY_V4_BANK_PATH), "utf8"),
    readFile(resolve(projectRoot, SECURITY_V4_LEDGER_PATH), "utf8"),
  ])
  return validateSecurityV4(JSON.parse(bankText), ledgerText, bankText)
}

export function validateSecurityV4(
  rawBank: unknown,
  ledgerText: string,
  bankText?: string,
): SecurityV4ValidationReport {
  const problems: string[] = []
  const bankSha256 = bankText
    ? createHash("sha256").update(bankText).digest("hex")
    : SECURITY_V4_BANK_SHA256
  const ledgerSha256 = createHash("sha256").update(ledgerText).digest("hex")
  if (bankSha256 !== SECURITY_V4_BANK_SHA256) {
    problems.push(
      `bank SHA-256 drifted; expected ${SECURITY_V4_BANK_SHA256}, ` +
        `received ${bankSha256}.`,
    )
  }
  if (ledgerSha256 !== SECURITY_V4_LEDGER_SHA256) {
    problems.push(
      `ledger SHA-256 drifted; expected ${SECURITY_V4_LEDGER_SHA256}, ` +
        `received ${ledgerSha256}.`,
    )
  }
  const bank = requireBank(rawBank, problems)
  const ledger = parseSecurityV4BalanceLedger(ledgerText, problems)

  if (bank.instrument !== "security") {
    problems.push(`bank instrument must be security; received ${bank.instrument}.`)
  }
  if (bank.instrumentVersion !== 4) {
    problems.push(
      `bank instrumentVersion must be 4; received ${bank.instrumentVersion}.`,
    )
  }

  const itemsById = new Map<string, SecurityItem>()
  for (const item of bank.items) {
    if (itemsById.has(item.id)) problems.push(`duplicate bank item ${item.id}.`)
    itemsById.set(item.id, item)
  }

  assertExactStringSet(
    "bank item IDs",
    [...itemsById.keys()],
    [...STANDARD_ITEM_IDS, ...ANALYST_ONLY_ITEM_IDS],
    problems,
  )

  const expectedLedgerKeys = new Set<string>()
  for (const item of bank.items) {
    for (const mode of item.modes) expectedLedgerKeys.add(`${mode}:${item.id}`)
  }
  const ledgerKeys = ledger.map((row) => `${row.mode}:${row.itemId}`)
  assertExactStringSet(
    "ledger (mode,item) rows",
    ledgerKeys,
    [...expectedLedgerKeys],
    problems,
  )
  if (new Set(ledgerKeys).size !== ledgerKeys.length) {
    problems.push("ledger must contain exactly one row per (mode,item_id).")
  }

  const malformedOptions: string[] = []
  const moralValenceFindings: SecurityV4ValidationReport["moralValence"]["findings"] = []
  for (const item of bank.items) {
    if (item.options.length !== 4) {
      problems.push(`${item.id} must contain exactly four options.`)
    }
    for (const option of item.options) {
      const optionSubject = `${item.id}.${option.id}`
      const delimiterCount = option.label.split(ACCEPTED_COST_DELIMITER).length - 1
      const [mechanism = "", acceptedCost = ""] = option.label.split(
        ACCEPTED_COST_DELIMITER,
      )
      if (
        delimiterCount !== 1 ||
        mechanism.trim().length === 0 ||
        acceptedCost.trim().length === 0
      ) {
        malformedOptions.push(optionSubject)
      }

      const signalKeys = Object.keys(option.signals).sort()
      assertExactStringSet(
        `${optionSubject} signal keys`,
        signalKeys,
        [...AXES],
        problems,
      )
      for (const axis of AXES) {
        const value = option.signals[axis]
        if (typeof value !== "number" || !Number.isFinite(value)) {
          problems.push(`${optionSubject}.${axis} must be a finite signal.`)
        }
      }

      const normalizedTitle = option.title.toLocaleLowerCase("en-US")
      for (const term of MORAL_VALENCE_TITLE_TERMS) {
        if (new RegExp(`\\b${escapeRegExp(term)}\\b`, "u").test(normalizedTitle)) {
          moralValenceFindings.push({ itemId: item.id, optionId: option.id, term })
        }
      }
    }
  }
  if (malformedOptions.length > 0) {
    problems.push(
      `options must separate mechanism from accepted cost with ${JSON.stringify(
        ACCEPTED_COST_DELIMITER,
      )}: ${malformedOptions.join(", ")}.`,
    )
  }

  const ledgerByKey = new Map(
    ledger.map((row) => [`${row.mode}:${row.itemId}`, row]),
  )
  for (const [key, row] of ledgerByKey) {
    const item = itemsById.get(row.itemId)
    if (!item) continue
    const expectedMainScore = item.cardType !== "actorLens"
    if (row.mainScore !== expectedMainScore) {
      problems.push(`${key} main_score does not match cardType ${item.cardType}.`)
    }
    if (row.lane !== item.lane) {
      problems.push(`${key} lane ${row.lane} does not match bank lane ${item.lane}.`)
    }
    if (row.cardType !== item.cardType) {
      problems.push(
        `${key} card_type ${row.cardType} does not match bank ${item.cardType}.`,
      )
    }
    assertExactStringSet(
      `${key} declared_axes`,
      row.declaredAxes,
      item.discriminatingAxes,
      problems,
    )
    if (row.sourceIds.length === 0) problems.push(`${key} has no source_ids.`)

    const expectedPrimaryWeight = expectedMainScore ? 1 : 0
    const expectedMaxWeight = expectedMainScore
      ? row.mode === "analyst" && item.allowSecondChoiceInAnalyst
        ? 1.45
        : 1
      : 0
    assertClose(
      `${key} item_primary_weight_per_axis`,
      row.itemPrimaryWeightPerAxis,
      expectedPrimaryWeight,
      problems,
    )
    assertClose(
      `${key} item_max_weight_per_axis`,
      row.itemMaxWeightPerAxis,
      expectedMaxWeight,
      problems,
    )
    if (item.cardType === "actorLens" && expectedMaxWeight !== 0) {
      problems.push(`${key} actorLens must have zero primary and secondary weight.`)
    }
  }

  const modes = Object.fromEntries(
    MODES.map((mode) => {
      const rows = ledger.filter((row) => row.mode === mode)
      const mainRows = rows.filter((row) => row.mainScore)
      const counts: SecurityV4ModeCounts = {
        total: rows.length,
        mainScored: mainRows.length,
        actorLens: rows.filter((row) => row.cardType === "actorLens").length,
        byDeclaredAxisMainScored: countMulti(
          mainRows.flatMap((row) => row.declaredAxes),
        ),
        bySignalAxisMainScored: Object.fromEntries(
          AXES.map((axis) => [
            axis,
            mainRows.filter((row) =>
              itemHasDenseAxis(itemsById.get(row.itemId), axis),
            ).length,
          ]),
        ),
        byLaneAll: count(rows.map((row) => row.lane)),
        byLaneMainScored: count(mainRows.map((row) => row.lane)),
        byCardType: count(rows.map((row) => row.cardType)),
        byItemRole: count(rows.map((row) => row.itemRole)),
        byActor: count(rows.map((row) => row.actorLabel)),
        byTheater: count(rows.map((row) => row.theaterFamily)),
      }
      const expected = EXPECTED_MODE_COUNTS[mode]
      assertDeepEqual(`${mode} counts`, counts, {
        ...expected,
        bySignalAxisMainScored: Object.fromEntries(
          AXES.map((axis) => [axis, expected.mainScored]),
        ),
      }, problems)
      return [mode, counts]
    }),
  ) as Record<SecurityMode, SecurityV4ModeCounts>

  const theaterShares = buildTheaterShares(ledger, itemsById, problems)
  validateLedgerShareColumns(ledger, theaterShares, problems)

  if (problems.length > 0) throw new SecurityV4ValidationError(problems)

  return {
    versions: { bank: 4, scoring: SECURITY_V4_SCORING_VERSION },
    bankPath: SECURITY_V4_BANK_PATH,
    ledgerPath: SECURITY_V4_LEDGER_PATH,
    bankSha256: SECURITY_V4_BANK_SHA256,
    ledgerSha256: SECURITY_V4_LEDGER_SHA256,
    itemCount: bank.items.length as 23,
    optionCount: bank.items.reduce<number>(
      (sum, item) => sum + item.options.length,
      0,
    ) as 92,
    ledgerRowCount: ledger.length as 42,
    modes,
    theaterShares,
    actorLensItemIds: bank.items
      .filter((item) => item.cardType === "actorLens")
      .map((item) => item.id)
      .sort(compareText),
    mechanismCost: {
      checkedOptions: bank.items.reduce(
        (sum, item) => sum + item.options.length,
        0,
      ),
      malformedOptions,
    },
    moralValence: {
      method: "title-lexicon-heuristic",
      findings: moralValenceFindings,
    },
  }
}

export function parseSecurityV4BalanceLedger(
  csv: string,
  problems: string[] = [],
): SecurityV4LedgerRow[] {
  const records = parseCsv(csv)
  const header = records.shift() ?? []
  if (JSON.stringify(header) !== JSON.stringify(LEDGER_HEADERS)) {
    problems.push("ledger header does not match the reviewed v4 contract.")
  }

  return records.flatMap((record, index) => {
    const rowNumber = index + 2
    if (record.length !== LEDGER_HEADERS.length) {
      problems.push(
        `ledger row ${rowNumber} has ${record.length} fields; expected ${LEDGER_HEADERS.length}.`,
      )
      return []
    }
    const value = Object.fromEntries(
      LEDGER_HEADERS.map((key, fieldIndex) => [key, record[fieldIndex]]),
    ) as Record<(typeof LEDGER_HEADERS)[number], string>
    if (!MODES.includes(value.mode as SecurityMode)) {
      problems.push(`ledger row ${rowNumber} has invalid mode ${value.mode}.`)
      return []
    }

    const parseNumber = (field: (typeof LEDGER_HEADERS)[number]) => {
      const number = Number(value[field])
      if (!Number.isFinite(number)) {
        problems.push(`ledger row ${rowNumber}.${field} must be numeric.`)
        return Number.NaN
      }
      return number
    }
    const parseBoolean = (field: (typeof LEDGER_HEADERS)[number]) => {
      if (value[field] !== "true" && value[field] !== "false") {
        problems.push(`ledger row ${rowNumber}.${field} must be true or false.`)
      }
      return value[field] === "true"
    }

    return [
      {
        mode: value.mode as SecurityMode,
        itemId: value.item_id,
        itemRole: value.item_role,
        theaterFamily: value.theater_family,
        actorLabel: value.actor_label,
        mainScore: parseBoolean("main_score"),
        lane: value.lane,
        cardType: value.card_type,
        sourceIds: splitSemicolon(value.source_ids),
        declaredAxes: splitSemicolon(value.declared_axes),
        itemPrimaryWeightPerAxis: parseNumber(
          "item_primary_weight_per_axis",
        ),
        itemMaxWeightPerAxis: parseNumber("item_max_weight_per_axis"),
        familyScoredPrimaryNumeratorPerAxis: parseNumber(
          "family_scored_primary_numerator_per_axis",
        ),
        modePrimaryDenominatorPerAxis: parseNumber(
          "mode_primary_denominator_per_axis",
        ),
        familyScoredMaxNumeratorPerAxis: parseNumber(
          "family_scored_max_numerator_per_axis",
        ),
        modeMaxDenominatorPerAxis: parseNumber(
          "mode_max_denominator_per_axis",
        ),
        familyShares: {
          activism: parseNumber("activism_family_share"),
          escalation: parseNumber("escalation_family_share"),
          alliance: parseNumber("alliance_family_share"),
          legitimacy: parseNumber("legitimacy_family_share"),
        },
        oneThirdPass: parseBoolean("one_third_pass"),
        reviewStatus: value.review_status,
      },
    ]
  })
}

function buildTheaterShares(
  rows: readonly SecurityV4LedgerRow[],
  itemsById: ReadonlyMap<string, SecurityItem>,
  problems: string[],
): SecurityV4TheaterShare[] {
  const result: SecurityV4TheaterShare[] = []

  for (const mode of MODES) {
    const allModeRows = rows.filter((row) => row.mode === mode)
    const modeRows = allModeRows.filter((row) => row.mainScore)
    const theaters = [...new Set(allModeRows.map((row) => row.theaterFamily))].sort(
      compareText,
    )
    for (const axis of AXES) {
      const axisRows = modeRows.filter((row) =>
        itemHasDenseAxis(itemsById.get(row.itemId), axis),
      )
      const primaryDenominator = axisRows.reduce(
        (sum, row) => sum + actualPrimaryWeight(row, itemsById),
        0,
      )
      const maxSecondaryDenominator = axisRows.reduce(
        (sum, row) => sum + actualMaxWeight(row, itemsById),
        0,
      )
      if (primaryDenominator <= 0 || maxSecondaryDenominator <= 0) {
        problems.push(`${mode}.${axis} must have positive scored denominators.`)
        continue
      }

      for (const theater of theaters) {
        const theaterRows = axisRows.filter(
          (row) => row.theaterFamily === theater,
        )
        const primaryNumerator = theaterRows.reduce(
          (sum, row) => sum + actualPrimaryWeight(row, itemsById),
          0,
        )
        const maxSecondaryNumerator = theaterRows.reduce(
          (sum, row) => sum + actualMaxWeight(row, itemsById),
          0,
        )
        const primaryShare = primaryNumerator / primaryDenominator
        const maxSecondaryShare =
          maxSecondaryNumerator / maxSecondaryDenominator
        const passes =
          primaryShare <= ONE_THIRD + NUMBER_TOLERANCE &&
          maxSecondaryShare <= ONE_THIRD + NUMBER_TOLERANCE
        if (!passes) {
          problems.push(
            `${mode}.${axis}.${theater} exceeds one-third scored-axis weight ` +
              `(primary ${(primaryShare * 100).toFixed(2)}%; ` +
              `max-secondary ${(maxSecondaryShare * 100).toFixed(2)}%).`,
          )
        }
        result.push({
          mode,
          axis,
          theater,
          primaryNumerator,
          primaryDenominator,
          primaryShare,
          maxSecondaryNumerator,
          maxSecondaryDenominator,
          maxSecondaryShare,
          passes,
        })
      }
    }
  }

  return result
}

function validateLedgerShareColumns(
  rows: readonly SecurityV4LedgerRow[],
  shares: readonly SecurityV4TheaterShare[],
  problems: string[],
) {
  for (const row of rows) {
    for (const axis of AXES) {
      const actual = shares.find(
        (share) =>
          share.mode === row.mode &&
          share.axis === axis &&
          share.theater === row.theaterFamily,
      )
      if (!row.mainScore && !actual) {
        assertClose(
          `${row.mode}:${row.itemId}.${axis} actor-lens family share`,
          row.familyShares[axis],
          0,
          problems,
        )
        continue
      }
      if (!actual) {
        problems.push(
          `${row.mode}:${row.itemId}.${axis} has no computed theater share.`,
        )
        continue
      }
      const subject = `${row.mode}:${row.itemId}.${axis}`
      assertClose(
        `${subject} family primary numerator`,
        row.familyScoredPrimaryNumeratorPerAxis,
        actual.primaryNumerator,
        problems,
      )
      assertClose(
        `${subject} primary denominator`,
        row.modePrimaryDenominatorPerAxis,
        actual.primaryDenominator,
        problems,
      )
      assertClose(
        `${subject} family max numerator`,
        row.familyScoredMaxNumeratorPerAxis,
        actual.maxSecondaryNumerator,
        problems,
      )
      assertClose(
        `${subject} max denominator`,
        row.modeMaxDenominatorPerAxis,
        actual.maxSecondaryDenominator,
        problems,
      )
      assertClose(
        `${subject} family share`,
        row.familyShares[axis],
        actual.primaryShare,
        problems,
      )
      if (row.oneThirdPass !== actual.passes) {
        problems.push(`${subject} one_third_pass disagrees with computed share.`)
      }
    }
  }
}

function actualPrimaryWeight(
  row: SecurityV4LedgerRow,
  itemsById: ReadonlyMap<string, SecurityItem>,
) {
  const item = itemsById.get(row.itemId)
  return item && item.cardType !== "actorLens" ? 1 : 0
}

function actualMaxWeight(
  row: SecurityV4LedgerRow,
  itemsById: ReadonlyMap<string, SecurityItem>,
) {
  const item = itemsById.get(row.itemId)
  if (!item || item.cardType === "actorLens") return 0
  return row.mode === "analyst" && item.allowSecondChoiceInAnalyst ? 1.45 : 1
}

function itemHasDenseAxis(item: SecurityItem | undefined, axis: SecurityAxis) {
  return Boolean(
    item &&
      item.options.length > 0 &&
      item.options.every((option) =>
        typeof option.signals[axis] === "number" &&
        Number.isFinite(option.signals[axis]),
      ),
  )
}

function requireBank(raw: unknown, problems: string[]): SecurityBank {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    problems.push("bank must be an object.")
    return { instrument: "", instrumentVersion: Number.NaN, items: [] }
  }
  const candidate = raw as Partial<SecurityBank>
  if (!Array.isArray(candidate.items)) problems.push("bank.items must be an array.")
  return {
    instrument: String(candidate.instrument ?? ""),
    instrumentVersion: Number(candidate.instrumentVersion),
    items: Array.isArray(candidate.items) ? candidate.items : [],
  }
}

function count(values: readonly string[]): CountRecord {
  const counts: CountRecord = {}
  for (const value of values) counts[value] = (counts[value] ?? 0) + 1
  return sortRecord(counts)
}

function countMulti(values: readonly string[]): CountRecord {
  return count(values)
}

function sortRecord(record: CountRecord): CountRecord {
  return Object.fromEntries(
    Object.entries(record).sort(([left], [right]) => compareText(left, right)),
  )
}

function assertExactStringSet(
  subject: string,
  actual: readonly string[],
  expected: readonly string[],
  problems: string[],
) {
  const normalizedActual = [...actual].sort(compareText)
  const normalizedExpected = [...expected].sort(compareText)
  if (JSON.stringify(normalizedActual) !== JSON.stringify(normalizedExpected)) {
    problems.push(
      `${subject} drifted; expected [${normalizedExpected.join(", ")}], ` +
        `received [${normalizedActual.join(", ")}].`,
    )
  }
}

function assertDeepEqual(
  subject: string,
  actual: unknown,
  expected: unknown,
  problems: string[],
) {
  if (canonicalJson(actual) !== canonicalJson(expected)) {
    problems.push(
      `${subject} drifted; expected ${JSON.stringify(expected)}, ` +
        `received ${JSON.stringify(actual)}.`,
    )
  }
}

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(canonicalJson).join(",")}]`
  }
  if (typeof value === "object" && value !== null) {
    return `{${Object.entries(value)
      .sort(([left], [right]) => compareText(left, right))
      .map(([key, entry]) => `${JSON.stringify(key)}:${canonicalJson(entry)}`)
      .join(",")}}`
  }
  return JSON.stringify(value)
}

function assertClose(
  subject: string,
  actual: number,
  expected: number,
  problems: string[],
) {
  if (!Number.isFinite(actual) || Math.abs(actual - expected) > NUMBER_TOLERANCE) {
    problems.push(`${subject} expected ${expected}; received ${actual}.`)
  }
}

function splitSemicolon(value: string) {
  return value.length === 0 ? [] : value.split(";").filter(Boolean)
}

function parseCsv(input: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ""
  let quoted = false

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index]
    if (character === '"') {
      if (quoted && input[index + 1] === '"') {
        field += '"'
        index += 1
      } else {
        quoted = !quoted
      }
    } else if (character === "," && !quoted) {
      row.push(field)
      field = ""
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && input[index + 1] === "\n") index += 1
      row.push(field)
      if (row.some((value) => value.length > 0)) rows.push(row)
      row = []
      field = ""
    } else {
      field += character
    }
  }

  if (quoted) throw new Error("Security v4 ledger contains an unterminated quote.")
  if (field.length > 0 || row.length > 0) {
    row.push(field)
    if (row.some((value) => value.length > 0)) rows.push(row)
  }
  return rows
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")
}

function compareText(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0
}

export function renderSecurityV4ValidationReport(
  report: SecurityV4ValidationReport,
) {
  const lines = [
    `Security bank v${report.versions.bank} / scorer v${report.versions.scoring} validated.`,
    `Items: ${report.itemCount}; options: ${report.optionCount}; ledger rows: ${report.ledgerRowCount}.`,
    `Bank SHA-256: ${report.bankSha256}.`,
    `Ledger SHA-256: ${report.ledgerSha256}.`,
  ]
  for (const mode of MODES) {
    const counts = report.modes[mode]
    lines.push(
      `${mode}: ${counts.total} total, ${counts.mainScored} main-scored, ` +
        `${counts.actorLens} actor lenses.`,
    )
  }
  const maximum = [...report.theaterShares].sort(
    (left, right) => right.maxSecondaryShare - left.maxSecondaryShare,
  )[0]
  if (maximum) {
    lines.push(
      `Largest scored-axis theater share: ${maximum.mode}/${maximum.axis}/` +
        `${maximum.theater} ${(maximum.maxSecondaryShare * 100).toFixed(2)}%.`,
    )
  }
  lines.push(
    `Mechanism/cost options checked: ${report.mechanismCost.checkedOptions}; malformed: 0.`,
    `Moral-valence title heuristic findings: ${report.moralValence.findings.length}.`,
  )
  return lines.join("\n")
}

async function run() {
  const report = await buildSecurityV4ValidationReport()
  process.stdout.write(`${renderSecurityV4ValidationReport(report)}\n`)
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
