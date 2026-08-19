import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import {
  findCompromiseReviewFindings,
  findDeclaredAxisFindings,
  findMissingDeclaredAxisFindings,
  findNoQualifyingAxisFindings,
  getAxisOptionStats,
  qualifyDiscriminatingAxes,
  MEASUREMENT_GATES_BLOCKING,
  type MeasurementFinding,
  type MeasurementOption,
} from "@/lib/instrument/measurement-gates"

type JsonObject = Record<string, unknown>
type InstrumentItem = JsonObject & {
  id?: unknown
  kind?: unknown
  dimension?: unknown
  axis?: unknown
  reverse?: unknown
  tier?: unknown
  modes?: unknown
  discriminatingAxes?: unknown
  options?: unknown
  analystOptions?: unknown
}
type InstrumentOption = JsonObject & {
  id?: unknown
  signals?: unknown
}
type InstrumentBank = JsonObject & {
  instrument?: unknown
  instrumentVersion?: unknown
  discriminators?: unknown
  items?: unknown
}

const INSTRUMENT_FILES = [
  "foundation.v2.json",
  "security.v3.json",
  "security.v4.json",
  "technology.v3.json",
  "ai-governance.v3.json",
] as const

const AI_AXIS_KEYS = [
  "riskHorizon",
  "deploymentPace",
  "oversight",
  "geopolitics",
  "openness",
  "militaryRole",
  "legitimacy",
  "humanFuture",
] as const
const MODULE_AXIS_KEYS_BY_INSTRUMENT: Record<
  "security" | "technology",
  ReadonlySet<string>
> = {
  security: new Set(["activism", "escalation", "alliance", "legitimacy"]),
  technology: new Set(["control", "governance", "industrial", "safety"]),
} as const

const contentDirectory = resolve(process.cwd(), "content/instrument")
const schemaPath = resolve(contentDirectory, "schema.json")
function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function describe(value: unknown): string {
  if (value === null) return "null"
  if (Array.isArray(value)) return "array"
  return typeof value
}

function sameJsonValue(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right)
}

function resolveSchemaReference(reference: string, root: JsonObject): JsonObject {
  if (!reference.startsWith("#/")) {
    throw new Error(`Unsupported schema reference: ${reference}`)
  }

  let current: unknown = root
  for (const encodedPart of reference.slice(2).split("/")) {
    const part = encodedPart.replaceAll("~1", "/").replaceAll("~0", "~")
    if (!isObject(current) || !(part in current)) {
      throw new Error(`Schema reference does not exist: ${reference}`)
    }
    current = current[part]
  }

  if (!isObject(current)) {
    throw new Error(`Schema reference is not an object: ${reference}`)
  }
  return current
}

function validateAgainstSchema(
  value: unknown,
  schema: JsonObject,
  path: string,
  root: JsonObject,
): string[] {
  if (typeof schema.$ref === "string") {
    return validateAgainstSchema(
      value,
      resolveSchemaReference(schema.$ref, root),
      path,
      root,
    )
  }

  const errors: string[] = []

  if (Array.isArray(schema.oneOf)) {
    const branchErrors = schema.oneOf
      .filter(isObject)
      .map((branch) => validateAgainstSchema(value, branch, path, root))
    const matches = branchErrors.filter((branch) => branch.length === 0)

    if (matches.length !== 1) {
      const bestBranch = [...branchErrors].sort(
        (left, right) => left.length - right.length,
      )[0]
      return [
        `${path} must match exactly one permitted schema (matched ${matches.length}).`,
        ...(bestBranch ?? []).slice(0, 8),
      ]
    }
  }

  if (schema.const !== undefined && !sameJsonValue(value, schema.const)) {
    errors.push(`${path} must equal ${JSON.stringify(schema.const)}.`)
  }

  if (
    Array.isArray(schema.enum) &&
    !schema.enum.some((candidate) => sameJsonValue(value, candidate))
  ) {
    errors.push(
      `${path} must be one of ${schema.enum.map((entry) => JSON.stringify(entry)).join(", ")}.`,
    )
  }

  if (typeof schema.type === "string") {
    const matchesType =
      schema.type === "object"
        ? isObject(value)
        : schema.type === "array"
          ? Array.isArray(value)
          : schema.type === "integer"
            ? Number.isInteger(value)
            : schema.type === "number"
              ? typeof value === "number" && Number.isFinite(value)
              : typeof value === schema.type

    if (!matchesType) {
      errors.push(`${path} must be ${schema.type}; received ${describe(value)}.`)
      return errors
    }
  }

  if (typeof value === "string" && typeof schema.minLength === "number") {
    if (value.length < schema.minLength) {
      errors.push(`${path} must not be empty.`)
    }
  }

  if (typeof value === "number" && typeof schema.minimum === "number") {
    if (value < schema.minimum) {
      errors.push(`${path} must be at least ${schema.minimum}.`)
    }
  }

  if (Array.isArray(value)) {
    if (typeof schema.minItems === "number" && value.length < schema.minItems) {
      errors.push(`${path} must contain at least ${schema.minItems} items.`)
    }
    if (typeof schema.maxItems === "number" && value.length > schema.maxItems) {
      errors.push(`${path} must contain at most ${schema.maxItems} items.`)
    }
    if (
      schema.uniqueItems === true &&
      new Set(value.map((entry) => JSON.stringify(entry))).size !== value.length
    ) {
      errors.push(`${path} must not contain duplicate values.`)
    }
    if (isObject(schema.items)) {
      value.forEach((entry, index) => {
        errors.push(
          ...validateAgainstSchema(
            entry,
            schema.items as JsonObject,
            `${path}[${index}]`,
            root,
          ),
        )
      })
    }
  }

  if (isObject(value)) {
    const required = Array.isArray(schema.required)
      ? schema.required.filter((entry): entry is string => typeof entry === "string")
      : []
    for (const key of required) {
      if (!Object.hasOwn(value, key)) {
        errors.push(`${path}.${key} is required.`)
      }
    }

    const properties = isObject(schema.properties) ? schema.properties : {}
    for (const [key, propertySchema] of Object.entries(properties)) {
      if (Object.hasOwn(value, key) && isObject(propertySchema)) {
        errors.push(
          ...validateAgainstSchema(
            value[key],
            propertySchema,
            `${path}.${key}`,
            root,
          ),
        )
      }
    }

    for (const [key, entry] of Object.entries(value)) {
      if (Object.hasOwn(properties, key)) continue
      if (schema.additionalProperties === false) {
        errors.push(`${path}.${key} is not allowed.`)
      } else if (isObject(schema.additionalProperties)) {
        errors.push(
          ...validateAgainstSchema(
            entry,
            schema.additionalProperties,
            `${path}.${key}`,
            root,
          ),
        )
      }
    }

    if (
      typeof schema.minProperties === "number" &&
      Object.keys(value).length < schema.minProperties
    ) {
      errors.push(
        `${path} must contain at least ${schema.minProperties} properties.`,
      )
    }
  }

  return errors
}

async function readJson(path: string): Promise<unknown> {
  try {
    return JSON.parse(await readFile(path, "utf8"))
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Could not read valid JSON from ${path}: ${message}`)
  }
}

function readDimensionKeys(typeSource: string): string[] {
  const match = typeSource.match(
    /export type DimensionKey\s*=([\s\S]*?)\n\nexport type QuizMode/,
  )
  if (!match) {
    throw new Error("Could not locate the DimensionKey union in lib/types.ts.")
  }
  return [...match[1].matchAll(/"([^"]+)"/g)].map((entry) => entry[1])
}

function getItems(bank: InstrumentBank): InstrumentItem[] {
  return Array.isArray(bank.items)
    ? bank.items.filter(isObject) as InstrumentItem[]
    : []
}

function getOptions(value: unknown): InstrumentOption[] {
  return Array.isArray(value)
    ? value.filter(isObject) as InstrumentOption[]
    : []
}

function getSignals(option: InstrumentOption): Record<string, number> {
  if (!isObject(option.signals)) return {}
  return Object.fromEntries(
    Object.entries(option.signals).filter(
      (entry): entry is [string, number] =>
        typeof entry[1] === "number" && Number.isFinite(entry[1]),
    ),
  )
}

type InstrumentMode = "standard" | "analyst"

type EffectiveOptionSet = {
  mode: InstrumentMode
  source: "options" | "analystOptions"
  options: InstrumentOption[]
}

type ChoiceMeasurementFindings = {
  gateFindings: MeasurementFinding[]
  qualificationFindings: MeasurementFinding[]
  compromiseReviewFindings: MeasurementFinding[]
}

function getItemModes(item: InstrumentItem): InstrumentMode[] {
  if (!Array.isArray(item.modes)) return []
  return item.modes.filter(
    (mode): mode is InstrumentMode =>
      mode === "standard" || mode === "analyst",
  )
}

function getDeclaredAxes(item: InstrumentItem): string[] {
  if (!Array.isArray(item.discriminatingAxes)) return []
  return item.discriminatingAxes.filter(
    (axis): axis is string => typeof axis === "string",
  )
}

function getEffectiveOptionSets(item: InstrumentItem): EffectiveOptionSet[] {
  const standardOptions = getOptions(item.options)
  const analystOptions = getOptions(item.analystOptions)
  const optionSets: EffectiveOptionSet[] = []
  const seenSources = new Set<EffectiveOptionSet["source"]>()

  for (const mode of getItemModes(item)) {
    const source =
      mode === "analyst" && analystOptions.length > 0
        ? "analystOptions"
        : "options"
    if (seenSources.has(source)) continue

    if (source === "analystOptions") {
      optionSets.push({
        mode,
        source,
        options: analystOptions,
      })
    } else if (standardOptions.length > 0) {
      optionSets.push({ mode, source, options: standardOptions })
    }
    seenSources.add(source)
  }

  return optionSets
}

function toMeasurementOptions(
  options: InstrumentOption[],
): MeasurementOption<string>[] {
  return options.map((option) => ({
    id: String(option.id),
    signals: getSignals(option),
  }))
}

function getChoiceMeasurementFindings(
  item: InstrumentItem,
  instrument: string,
): ChoiceMeasurementFindings {
  const empty: ChoiceMeasurementFindings = {
    gateFindings: [],
    qualificationFindings: [],
    compromiseReviewFindings: [],
  }
  if (!["security", "technology", "ai-governance"].includes(instrument)) {
    return empty
  }
  if (item.kind === "likert") return empty

  const midpoint = instrument === "ai-governance" ? 0 : 4
  const qualificationSpread = instrument === "ai-governance" ? 0.5 : 1.5
  const gateSpread = instrument === "ai-governance" ? 0.5 : 2
  const optionSets = getEffectiveOptionSets(item)
  const declaredAxes = getDeclaredAxes(item)
  const subject = `${instrument}.${String(item.id)}`
  const moduleAxes = [
    ...new Set(
      optionSets.flatMap(({ options }) =>
        options.flatMap((option) => Object.keys(getSignals(option))),
      ),
    ),
  ].sort()
  const axisUniverse = instrument === "ai-governance"
    ? [...AI_AXIS_KEYS]
    : moduleAxes

  empty.qualificationFindings.push(
    ...findMissingDeclaredAxisFindings(subject, declaredAxes),
  )

  let qualifyingAxes = [...axisUniverse]
  for (const optionSet of optionSets) {
    const options = toMeasurementOptions(optionSet.options)
    const stats = getAxisOptionStats(options, axisUniverse, midpoint)
    const modeQualifiers = new Set(
      qualifyDiscriminatingAxes(stats, qualificationSpread),
    )
    qualifyingAxes = qualifyingAxes.filter((axis) => modeQualifiers.has(axis))

    empty.gateFindings.push(
      ...findDeclaredAxisFindings({
        subject: `${subject}.${optionSet.source}`,
        declaredAxes,
        options,
        midpoint,
        minimumSpread: gateSpread,
      }),
    )
    empty.compromiseReviewFindings.push(
      ...findCompromiseReviewFindings({
        subject: `${subject}.${optionSet.source}`,
        axes: axisUniverse,
        options,
        midpoint,
      }),
    )
  }

  empty.qualificationFindings.push(
    ...findNoQualifyingAxisFindings(subject, qualifyingAxes),
  )
  return empty
}

function optionCountFailures(
  item: InstrumentItem,
  instrument: string,
): string[] {
  if (item.kind === "likert") return []

  const errors: string[] = []
  for (const key of ["options", "analystOptions"] as const) {
    const options = item[key]
    if (
      options !== undefined &&
      (!Array.isArray(options) || options.length < 3 || options.length > 5)
    ) {
      const count = Array.isArray(options) ? options.length : "non-array"
      errors.push(
        `${instrument}.${String(item.id)} ${key} has ${count} choices; expected 3 to 5.`,
      )
    }
  }
  return errors
}

const schemaValue = await readJson(schemaPath)
if (!isObject(schemaValue)) {
  throw new Error(`${schemaPath} must contain a JSON object.`)
}

const banks = await Promise.all(
  INSTRUMENT_FILES.map(async (file) => {
    const value = await readJson(resolve(contentDirectory, file))
    if (!isObject(value)) {
      throw new Error(`${file} must contain a JSON object.`)
    }
    return { file, bank: value as InstrumentBank }
  }),
)

const blockingErrors: string[] = []
const measurementGateFindings: MeasurementFinding[] = []
const qualificationFindings: MeasurementFinding[] = []
const compromiseReviewFindings: MeasurementFinding[] = []
for (const { file, bank } of banks) {
  blockingErrors.push(
    ...validateAgainstSchema(bank, schemaValue, file, schemaValue),
  )
}

const typeSource = await readFile(resolve(process.cwd(), "lib/types.ts"), "utf8")
const dimensionKeysFromType = readDimensionKeys(typeSource)
const dimensionSchema = isObject(schemaValue.$defs) &&
  isObject(schemaValue.$defs.dimensionKey)
  ? schemaValue.$defs.dimensionKey
  : undefined
const dimensionKeysFromSchema = dimensionSchema &&
  Array.isArray(dimensionSchema.enum)
  ? dimensionSchema.enum.filter((key): key is string => typeof key === "string")
  : []

if (
  !sameJsonValue(
    [...dimensionKeysFromType].sort(),
    [...dimensionKeysFromSchema].sort(),
  )
) {
  blockingErrors.push(
    "schema.json dimensionKey values do not match the DimensionKey union in lib/types.ts.",
  )
}

const dimensionKeys = new Set(dimensionKeysFromType)
const seenIds = new Map<string, { file: string; instrument: string }>()
const reverseCounts = new Map<string, { reversed: number; total: number }>()
const foundationItemsById = new Map<string, InstrumentItem>()

for (const { file, bank } of banks) {
  const instrument =
    typeof bank.instrument === "string" ? bank.instrument : file
  const bankItemIds = new Set<string>()

  if (!Object.hasOwn(bank, "instrumentVersion")) {
    blockingErrors.push(`${file} is missing instrumentVersion.`)
  }

  for (const item of getItems(bank)) {
    const id = typeof item.id === "string" ? item.id : String(item.id)
    if (bankItemIds.has(id)) {
      blockingErrors.push(`Duplicate item id "${id}" appears within ${file}.`)
    }
    bankItemIds.add(id)
    const previous = seenIds.get(id)
    if (previous && previous.instrument !== instrument) {
      blockingErrors.push(
        `Duplicate item id "${id}" appears in ${previous.file} and ${file}.`,
      )
    } else if (!previous) {
      seenIds.set(id, { file, instrument })
    }

    if (instrument === "foundation") {
      foundationItemsById.set(id, item)
    }

    blockingErrors.push(...optionCountFailures(item, instrument))

    if (item.kind === "likert") {
      if (!Object.hasOwn(item, "reverse") || typeof item.reverse !== "boolean") {
        blockingErrors.push(
          `${instrument}.${id} is Likert but does not state reverse as true or false.`,
        )
      }

      const scoredAxis =
        typeof item.dimension === "string"
          ? item.dimension
          : typeof item.axis === "string"
            ? item.axis
            : undefined
      if (scoredAxis && instrument === "ai-governance") {
        for (const mode of getItemModes(item)) {
          const key = `${instrument}.${mode}.${scoredAxis}`
          const count = reverseCounts.get(key) ?? { reversed: 0, total: 0 }
          count.total += 1
          if (item.reverse === true) count.reversed += 1
          reverseCounts.set(key, count)
        }
      }
    }

    if (
      typeof item.dimension === "string" &&
      !dimensionKeys.has(item.dimension)
    ) {
      blockingErrors.push(
        `${instrument}.${id} references unknown DimensionKey "${item.dimension}".`,
      )
    }

    if (instrument === "security" || instrument === "technology") {
      const permittedAxes = MODULE_AXIS_KEYS_BY_INSTRUMENT[instrument]
      for (const axis of getDeclaredAxes(item)) {
        if (!permittedAxes.has(axis)) {
          blockingErrors.push(
            `${instrument}.${id} declares axis "${axis}", which is not ` +
              `scored by that module.`,
          )
        }
      }
      for (const { options } of getEffectiveOptionSets(item)) {
        for (const option of options) {
          for (const axis of Object.keys(getSignals(option))) {
            if (!permittedAxes.has(axis)) {
              blockingErrors.push(
                `${instrument}.${id} option ${String(option.id)} scores ` +
                  `unknown module axis "${axis}".`,
              )
            }
          }
        }
      }
    }

    if (
      instrument === "ai-governance" &&
      item.kind === "likert" &&
      typeof item.axis === "string" &&
      !sameJsonValue(getDeclaredAxes(item), [item.axis])
    ) {
      blockingErrors.push(
        `${instrument}.${id} is Likert and must declare exactly its scored ` +
          `axis "${item.axis}" as discriminating.`,
      )
    }

    if (instrument === "foundation" && Array.isArray(item.options)) {
      for (const option of item.options.filter(isObject)) {
        if (!isObject(option.signals)) continue
        for (const key of Object.keys(option.signals)) {
          if (!dimensionKeys.has(key)) {
            blockingErrors.push(
              `${instrument}.${id} option ${String(option.id)} references unknown DimensionKey "${key}".`,
            )
          }
        }
      }
    }

    const choiceFindings = getChoiceMeasurementFindings(item, instrument)
    measurementGateFindings.push(...choiceFindings.gateFindings)
    qualificationFindings.push(...choiceFindings.qualificationFindings)
    compromiseReviewFindings.push(
      ...choiceFindings.compromiseReviewFindings,
    )
  }
}

const reverseCodingFailures = [...reverseCounts.entries()]
  .filter(([, count]) => count.reversed / count.total < 0.4)
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([key, count]): MeasurementFinding => {
    const percentage = ((count.reversed / count.total) * 100).toFixed(1)
    return {
      code: "reverse-coding",
      classification: "gate",
      subject: key,
      message:
        `${key}: ${count.reversed}/${count.total} reverse-coded ` +
        `(${percentage}%; minimum 40%).`,
    }
  })

measurementGateFindings.push(...reverseCodingFailures)

const foundationBank = banks.find(
  ({ bank }) => bank.instrument === "foundation",
)?.bank
const expectedDiscriminatorPairs = [
  "realist|institutionalist",
  "realist|constructivist",
  "realist|criticalPoliticalEconomy",
  "institutionalist|constructivist",
  "institutionalist|criticalPoliticalEconomy",
  "constructivist|criticalPoliticalEconomy",
] as const

if (!foundationBank || !isObject(foundationBank.discriminators)) {
  blockingErrors.push("foundation.v2.json must define a discriminators table.")
} else {
  const actualPairs = Object.keys(foundationBank.discriminators).sort()
  const expectedPairs = [...expectedDiscriminatorPairs].sort()

  if (!sameJsonValue(actualPairs, expectedPairs)) {
    blockingErrors.push(
      "foundation discriminators must contain exactly the six unordered family pairs.",
    )
  }

  for (const pair of expectedDiscriminatorPairs) {
    const itemIds = foundationBank.discriminators[pair]
    if (!Array.isArray(itemIds) || itemIds.length !== 5) continue

    for (const itemId of itemIds) {
      const item = typeof itemId === "string"
        ? foundationItemsById.get(itemId)
        : undefined

      if (!item) {
        blockingErrors.push(
          `foundation discriminator ${pair} references unknown item "${String(itemId)}".`,
        )
      } else if (item.tier !== "extended" || item.scoringBlock !== "core") {
        blockingErrors.push(
          `foundation discriminator ${pair} must reference an extended scored item; ${String(itemId)} does not.`,
        )
      }
    }
  }
}

const foundationCoreItems = [...foundationItemsById.values()].filter(
  (item) => item.tier === "core",
)
if (foundationCoreItems.length !== 14) {
  blockingErrors.push(
    `foundation must contain exactly 14 core items; found ${foundationCoreItems.length}.`,
  )
}

for (const dimension of dimensionKeys) {
  const dimensionCoreItems = foundationCoreItems.filter(
    (item) =>
      item.kind === "likert" &&
      item.scoringBlock === "core" &&
      item.dimension === dimension,
  )
  const directions = new Set(
    dimensionCoreItems.map((item) => item.reverse),
  )

  if (
    dimensionCoreItems.length !== 2 ||
    !directions.has(false) ||
    !directions.has(true)
  ) {
    blockingErrors.push(
      `foundation core ${dimension} must contain one forward and one reverse-coded item.`,
    )
  }
}

const uniqueFindingMessages = (findings: MeasurementFinding[]) =>
  [...new Set(findings.map(({ message }) => message))]

if (MEASUREMENT_GATES_BLOCKING) {
  blockingErrors.push(
    ...uniqueFindingMessages([
      ...measurementGateFindings,
      ...qualificationFindings,
    ]),
  )
} else {
  console.warn(
    "V22 measurement gates are reporting-only during Prompt 2A; " +
      "they become blocking at the end of 2C.",
  )
  const gateMessages = uniqueFindingMessages(measurementGateFindings)
  if (gateMessages.length === 0) {
    console.warn("- Measurement gate failures: 0")
  } else {
    console.warn(`- Measurement gate failures: ${gateMessages.length}`)
    for (const message of gateMessages) console.warn(`  - ${message}`)
  }

  const qualificationMessages = uniqueFindingMessages(qualificationFindings)
  console.warn(
    `- Items with no qualifying discriminating axis: ` +
      `${qualificationMessages.length}`,
  )
  for (const message of qualificationMessages) console.warn(`  - ${message}`)
}

const compromiseMessages = uniqueFindingMessages(compromiseReviewFindings)
console.warn(
  `Geometric-compromise review findings (permanently non-blocking): ` +
    `${compromiseMessages.length}`,
)
for (const message of compromiseMessages) console.warn(`- ${message}`)

if (blockingErrors.length > 0) {
  console.error("Instrument validation failed:")
  for (const error of [...new Set(blockingErrors)]) {
    console.error(`- ${error}`)
  }
  process.exitCode = 1
} else {
  console.log(
    `Validated ${seenIds.size} unique item IDs across ${banks.length} instrument banks.`,
  )
}
