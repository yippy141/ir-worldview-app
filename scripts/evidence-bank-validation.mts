/**
 * Strict structural validation for every instrument bank read by the
 * deterministic evidence audit.
 *
 * This intentionally does not reuse the current-bank JSON schema verbatim:
 * the frozen V21 banks omit fields that are required by the V22 schema. Each
 * supported version therefore has its own closed field set. The validator is
 * read-only and performs no filesystem, network, model, or database work.
 */

export type JsonPrimitive = string | number | boolean | null
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[]
export type JsonObject = { [key: string]: JsonValue }

export type SupportedInstrument =
  | "foundation"
  | "security"
  | "technology"
  | "ai-governance"

export type SupportedInstrumentBankKey =
  | "foundation-bank-v2"
  | "foundation-scoring-v1"
  | "security-bank-v2"
  | "security-bank-v3"
  | "security-bank-v4"
  | "security-bank-v5"
  | "technology-bank-v2"
  | "technology-bank-v3"
  | "ai-governance-bank-v2"
  | "ai-governance-bank-v3"

export type SupportedInstrumentBankDescriptor = {
  key: SupportedInstrumentBankKey
  instrument: SupportedInstrument
  release: "current" | "legacy"
  bankVersion: number | null
  scoringVersion: 1 | 2
}

type UnknownObject = Record<string, unknown>

const MODES = new Set(["standard", "analyst"])
const CARD_TYPES = new Set([
  "explanation",
  "decision",
  "actorLens",
  "both",
])
const FOUNDATION_TIERS = new Set(["core", "extended"])
const FOUNDATION_DIMENSIONS = new Set([
  "securityCompetition",
  "institutions",
  "domesticFilters",
  "normsIdentity",
  "politicalEconomy",
  "restraint",
  "orderJustice",
])
const FOUNDATION_VALIDATION_SCALES = new Set([
  "militantInternationalism",
  "cooperativeInternationalism",
  "isolationism",
])
const SECURITY_AXES = new Set([
  "activism",
  "escalation",
  "alliance",
  "legitimacy",
])
const TECHNOLOGY_AXES = new Set([
  "control",
  "governance",
  "industrial",
  "safety",
])
const AI_AXES = new Set([
  "riskHorizon",
  "deploymentPace",
  "oversight",
  "geopolitics",
  "openness",
  "militaryRole",
  "legitimacy",
  "humanFuture",
])
const AI_OPTION_IDS = new Set(["A", "B", "C", "D"])

const FOUNDATION_DISCRIMINATOR_KEYS = new Set([
  "realist|institutionalist",
  "realist|constructivist",
  "realist|criticalPoliticalEconomy",
  "institutionalist|constructivist",
  "institutionalist|criticalPoliticalEconomy",
  "constructivist|criticalPoliticalEconomy",
])

const FOUNDATION_BANK_FIELDS = [
  "instrument",
  "instrumentVersion",
  "discriminators",
  "items",
] as const
const FOUNDATION_SCORING_FIELDS = [
  "instrument",
  "scoringVersion",
  "items",
] as const
const VERSIONED_BANK_FIELDS = [
  "instrument",
  "instrumentVersion",
  "items",
] as const

const FOUNDATION_CORE_LIKERT_FIELDS = [
  "id",
  "kind",
  "modes",
  "tier",
  "scoringBlock",
  "dimension",
  "reverse",
  "prompt",
  "helpText",
  "clarification",
] as const
const FOUNDATION_VALIDATION_LIKERT_FIELDS = [
  "id",
  "kind",
  "modes",
  "tier",
  "scoringBlock",
  "validationScale",
  "citation",
  "reverse",
  "prompt",
  "helpText",
  "clarification",
] as const
const FOUNDATION_CHOICE_FIELDS = [
  "id",
  "kind",
  "modes",
  "tier",
  "scoringBlock",
  "cardType",
  "allowSecondChoiceInAnalyst",
  "prompt",
  "helpText",
  "clarification",
  "options",
] as const
const FOUNDATION_OPTION_FIELDS = [
  "id",
  "title",
  "label",
  "signals",
  "pinned",
] as const

const LEGACY_FOUNDATION_LIKERT_FIELDS = [
  "id",
  "kind",
  "dimension",
  "reverse",
] as const
const LEGACY_FOUNDATION_CHOICE_FIELDS = [
  "id",
  "kind",
  "allowSecondChoiceInAnalyst",
  "options",
] as const
const LEGACY_FOUNDATION_OPTION_FIELDS = ["id", "signals"] as const

const MODULE_ITEM_FIELDS = [
  "id",
  "kind",
  "modes",
  "lane",
  "cardType",
  "title",
  "prompt",
  "scene",
  "whyHard",
  "contextBullets",
  "perspectiveTags",
  "knowledgeLoad",
  "mirrorPairId",
  "allowSecondChoiceInAnalyst",
  "options",
] as const
const MODULE_ITEM_V3_FIELDS = [
  ...MODULE_ITEM_FIELDS,
  "discriminatingAxes",
] as const
const MODULE_OPTION_FIELDS = [
  "id",
  "title",
  "label",
  "signals",
  "pinned",
] as const

const AI_LIKERT_FIELDS = [
  "id",
  "kind",
  "modes",
  "axis",
  "reverse",
  "prompt",
  "helpText",
  "clarification",
] as const
const AI_LIKERT_V3_FIELDS = [
  ...AI_LIKERT_FIELDS,
  "discriminatingAxes",
] as const
const AI_SCENARIO_FIELDS = [
  "id",
  "kind",
  "modes",
  "cardType",
  "prompt",
  "analystPrompt",
  "helpText",
  "actorRole",
  "tags",
  "allowBackupChoiceInAnalyst",
  "options",
  "analystOptions",
] as const
const AI_SCENARIO_V3_FIELDS = [
  ...AI_SCENARIO_FIELDS,
  "discriminatingAxes",
] as const
const AI_OPTION_FIELDS = [
  "id",
  "label",
  "signals",
  "followUpId",
  "pinned",
] as const

const CLARIFICATION_FIELDS = [
  "title",
  "whatItAsks",
  "whatItDoesNotAsk",
  "terms",
] as const
const CLARIFICATION_TERM_FIELDS = ["term", "definition"] as const
const CONTEXT_BULLET_FIELDS = ["label", "text"] as const

/**
 * Validates a supported bank and returns its immutable version identity.
 *
 * The source label is included in thrown errors only; it is never written or
 * otherwise acted upon.
 */
export function validateSupportedInstrumentBank(
  bank: unknown,
  source = "instrument bank",
): SupportedInstrumentBankDescriptor {
  const object = requireObject(bank, source, "$")
  const instrument = requireString(object.instrument, source, "$.instrument")

  if (instrument === "foundation") {
    if (Object.hasOwn(object, "instrumentVersion")) {
      requireExactInteger(
        object.instrumentVersion,
        2,
        source,
        "$.instrumentVersion",
      )
      validateFoundationBankV2(object, source)
      return {
        key: "foundation-bank-v2",
        instrument,
        release: "current",
        bankVersion: 2,
        scoringVersion: 2,
      }
    }

    if (Object.hasOwn(object, "scoringVersion")) {
      requireExactInteger(
        object.scoringVersion,
        1,
        source,
        "$.scoringVersion",
      )
      validateFoundationScoringV1(object, source)
      return {
        key: "foundation-scoring-v1",
        instrument,
        release: "legacy",
        bankVersion: null,
        scoringVersion: 1,
      }
    }

    fail(
      source,
      "$",
      "foundation banks must declare instrumentVersion or scoringVersion.",
    )
  }

  if (instrument === "security" || instrument === "technology") {
    const version = requireInteger(
      object.instrumentVersion,
      source,
      "$.instrumentVersion",
    )
    const supported =
      instrument === "security"
        ? version === 2 || version === 3 || version === 4 || version === 5
        : version === 2 || version === 3
    if (!supported) {
      fail(
        source,
        "$.instrumentVersion",
        `unsupported ${instrument} bank version ${version}.`,
      )
    }

    validateModuleBank(object, source, instrument, version as 2 | 3 | 4 | 5)
    const isCurrent =
      instrument === "security" ? version === 5 : version === 3
    return {
      key: `${instrument}-bank-v${version}` as SupportedInstrumentBankKey,
      instrument,
      release: isCurrent ? "current" : "legacy",
      bankVersion: version,
      scoringVersion: version >= 3 ? 2 : 1,
    }
  }

  if (instrument === "ai-governance") {
    const version = requireInteger(
      object.instrumentVersion,
      source,
      "$.instrumentVersion",
    )
    if (version !== 2 && version !== 3) {
      fail(
        source,
        "$.instrumentVersion",
        `unsupported ai-governance bank version ${version}.`,
      )
    }

    validateAiBank(object, source, version)
    return {
      key: `ai-governance-bank-v${version}`,
      instrument,
      release: version === 3 ? "current" : "legacy",
      bankVersion: version,
      scoringVersion: version === 3 ? 2 : 1,
    }
  }

  fail(source, "$.instrument", `unsupported instrument ${JSON.stringify(instrument)}.`)
}

export function assertSupportedInstrumentBank(
  bank: unknown,
  source = "instrument bank",
): asserts bank is JsonObject {
  void validateSupportedInstrumentBank(bank, source)
}

function validateFoundationBankV2(
  bank: UnknownObject,
  source: string,
) {
  requireAllowedFields(bank, FOUNDATION_BANK_FIELDS, source, "$")
  requireFields(bank, FOUNDATION_BANK_FIELDS, source, "$")
  requireLiteral(bank.instrument, "foundation", source, "$.instrument")

  const discriminators = requireObject(
    bank.discriminators,
    source,
    "$.discriminators",
  )
  requireAllowedFields(
    discriminators,
    FOUNDATION_DISCRIMINATOR_KEYS,
    source,
    "$.discriminators",
  )
  requireFields(
    discriminators,
    FOUNDATION_DISCRIMINATOR_KEYS,
    source,
    "$.discriminators",
  )
  for (const pair of [...FOUNDATION_DISCRIMINATOR_KEYS].sort()) {
    requireStringArray(
      discriminators[pair],
      source,
      `$.discriminators.${pair}`,
      { minimum: 5, maximum: 5, unique: true },
    )
  }

  const items = requireObjectArray(bank.items, source, "$.items", 1)
  requireUniqueIds(items, source, "$.items")
  items.forEach((item, index) =>
    validateFoundationV2Item(item, source, `$.items[${index}]`),
  )
}

function validateFoundationV2Item(
  item: UnknownObject,
  source: string,
  path: string,
) {
  const kind = requireString(item.kind, source, `${path}.kind`)

  if (kind === "likert") {
    const scoringBlock = requireString(
      item.scoringBlock,
      source,
      `${path}.scoringBlock`,
    )
    if (scoringBlock === "core") {
      requireAllowedFields(
        item,
        FOUNDATION_CORE_LIKERT_FIELDS,
        source,
        path,
      )
      requireFields(
        item,
        [
          "id",
          "kind",
          "modes",
          "tier",
          "scoringBlock",
          "dimension",
          "reverse",
          "prompt",
        ],
        source,
        path,
      )
      requireEnumString(
        item.dimension,
        FOUNDATION_DIMENSIONS,
        source,
        `${path}.dimension`,
      )
    } else if (scoringBlock === "validation") {
      requireAllowedFields(
        item,
        FOUNDATION_VALIDATION_LIKERT_FIELDS,
        source,
        path,
      )
      requireFields(
        item,
        [
          "id",
          "kind",
          "modes",
          "tier",
          "scoringBlock",
          "validationScale",
          "citation",
          "reverse",
          "prompt",
        ],
        source,
        path,
      )
      requireEnumString(
        item.validationScale,
        FOUNDATION_VALIDATION_SCALES,
        source,
        `${path}.validationScale`,
      )
      requireString(item.citation, source, `${path}.citation`)
    } else {
      fail(
        source,
        `${path}.scoringBlock`,
        `unsupported scoring block ${JSON.stringify(scoringBlock)}.`,
      )
    }

    validateFoundationSharedItemFields(item, source, path)
    requireBoolean(item.reverse, source, `${path}.reverse`)
    validateOptionalClarification(item.clarification, source, `${path}.clarification`)
    return
  }

  if (kind !== "tradeoff" && kind !== "miniCase") {
    fail(source, `${path}.kind`, `unsupported Foundation item kind ${JSON.stringify(kind)}.`)
  }

  requireAllowedFields(item, FOUNDATION_CHOICE_FIELDS, source, path)
  requireFields(
    item,
    [
      "id",
      "kind",
      "modes",
      "tier",
      "scoringBlock",
      "cardType",
      "prompt",
      "options",
    ],
    source,
    path,
  )
  validateFoundationSharedItemFields(item, source, path)
  requireLiteral(item.scoringBlock, "core", source, `${path}.scoringBlock`)
  requireEnumString(item.cardType, CARD_TYPES, source, `${path}.cardType`)
  validateOptionalBoolean(
    item.allowSecondChoiceInAnalyst,
    source,
    `${path}.allowSecondChoiceInAnalyst`,
  )
  validateOptionalClarification(item.clarification, source, `${path}.clarification`)
  const options = requireObjectArray(item.options, source, `${path}.options`, 3, 5)
  requireUniqueIds(options, source, `${path}.options`)
  options.forEach((option, index) =>
    validateFoundationOption(option, source, `${path}.options[${index}]`, true),
  )
}

function validateFoundationSharedItemFields(
  item: UnknownObject,
  source: string,
  path: string,
) {
  requireString(item.id, source, `${path}.id`)
  requireModes(item.modes, source, `${path}.modes`)
  requireEnumString(item.tier, FOUNDATION_TIERS, source, `${path}.tier`)
  requireString(item.prompt, source, `${path}.prompt`)
  validateOptionalString(item.helpText, source, `${path}.helpText`)
}

function validateFoundationScoringV1(
  bank: UnknownObject,
  source: string,
) {
  requireAllowedFields(bank, FOUNDATION_SCORING_FIELDS, source, "$")
  requireFields(bank, FOUNDATION_SCORING_FIELDS, source, "$")
  requireLiteral(bank.instrument, "foundation", source, "$.instrument")

  const items = requireObjectArray(bank.items, source, "$.items", 1)
  requireUniqueIds(items, source, "$.items")
  items.forEach((item, index) => {
    const path = `$.items[${index}]`
    const kind = requireString(item.kind, source, `${path}.kind`)

    if (kind === "likert") {
      requireAllowedFields(
        item,
        LEGACY_FOUNDATION_LIKERT_FIELDS,
        source,
        path,
      )
      requireFields(
        item,
        LEGACY_FOUNDATION_LIKERT_FIELDS,
        source,
        path,
      )
      requireString(item.id, source, `${path}.id`)
      requireEnumString(
        item.dimension,
        FOUNDATION_DIMENSIONS,
        source,
        `${path}.dimension`,
      )
      requireBoolean(item.reverse, source, `${path}.reverse`)
      return
    }

    if (kind !== "tradeoff" && kind !== "miniCase") {
      fail(
        source,
        `${path}.kind`,
        `unsupported legacy Foundation item kind ${JSON.stringify(kind)}.`,
      )
    }

    requireAllowedFields(
      item,
      LEGACY_FOUNDATION_CHOICE_FIELDS,
      source,
      path,
    )
    requireFields(
      item,
      LEGACY_FOUNDATION_CHOICE_FIELDS,
      source,
      path,
    )
    requireString(item.id, source, `${path}.id`)
    requireBoolean(
      item.allowSecondChoiceInAnalyst,
      source,
      `${path}.allowSecondChoiceInAnalyst`,
    )
    const options = requireObjectArray(
      item.options,
      source,
      `${path}.options`,
      3,
      5,
    )
    requireUniqueIds(options, source, `${path}.options`)
    options.forEach((option, optionIndex) =>
      validateFoundationOption(
        option,
        source,
        `${path}.options[${optionIndex}]`,
        false,
      ),
    )
  })
}

function validateFoundationOption(
  option: UnknownObject,
  source: string,
  path: string,
  includesCopy: boolean,
) {
  const fields = includesCopy
    ? FOUNDATION_OPTION_FIELDS
    : LEGACY_FOUNDATION_OPTION_FIELDS
  requireAllowedFields(option, fields, source, path)
  requireFields(
    option,
    includesCopy
      ? ["id", "title", "label", "signals"]
      : LEGACY_FOUNDATION_OPTION_FIELDS,
    source,
    path,
  )
  requireString(option.id, source, `${path}.id`)
  if (includesCopy) {
    requireString(option.title, source, `${path}.title`)
    requireString(option.label, source, `${path}.label`)
    validatePinned(option.pinned, source, `${path}.pinned`)
  }
  validateSignals(
    option.signals,
    FOUNDATION_DIMENSIONS,
    source,
    `${path}.signals`,
  )
}

function validateModuleBank(
  bank: UnknownObject,
  source: string,
  instrument: "security" | "technology",
  version: 2 | 3 | 4 | 5,
) {
  requireAllowedFields(bank, VERSIONED_BANK_FIELDS, source, "$")
  requireFields(bank, VERSIONED_BANK_FIELDS, source, "$")
  requireLiteral(bank.instrument, instrument, source, "$.instrument")

  const axes = instrument === "security" ? SECURITY_AXES : TECHNOLOGY_AXES
  const items = requireObjectArray(bank.items, source, "$.items", 1)
  requireUniqueIds(items, source, "$.items")

  items.forEach((item, index) => {
    const path = `$.items[${index}]`
    requireAllowedFields(
      item,
      version >= 3 ? MODULE_ITEM_V3_FIELDS : MODULE_ITEM_FIELDS,
      source,
      path,
    )
    requireFields(
      item,
      [
        "id",
        "kind",
        "modes",
        "lane",
        "cardType",
        "title",
        "prompt",
        "scene",
        "whyHard",
        "perspectiveTags",
        "knowledgeLoad",
        ...(version >= 3 ? ["discriminatingAxes"] : []),
        "options",
      ],
      source,
      path,
    )
    requireString(item.id, source, `${path}.id`)
    requireEnumString(
      item.kind,
      new Set(["case", "synthesis"]),
      source,
      `${path}.kind`,
    )
    requireModes(item.modes, source, `${path}.modes`)
    requireString(item.lane, source, `${path}.lane`)
    requireEnumString(item.cardType, CARD_TYPES, source, `${path}.cardType`)
    requireString(item.title, source, `${path}.title`)
    requireString(item.prompt, source, `${path}.prompt`)
    requireString(item.scene, source, `${path}.scene`)
    requireString(item.whyHard, source, `${path}.whyHard`)
    validateOptionalContextBullets(
      item.contextBullets,
      source,
      `${path}.contextBullets`,
    )
    requireStringArray(
      item.perspectiveTags,
      source,
      `${path}.perspectiveTags`,
      { unique: true },
    )
    requireEnumString(
      item.knowledgeLoad,
      new Set(["low", "medium", "high"]),
      source,
      `${path}.knowledgeLoad`,
    )
    validateOptionalString(item.mirrorPairId, source, `${path}.mirrorPairId`)
    validateOptionalBoolean(
      item.allowSecondChoiceInAnalyst,
      source,
      `${path}.allowSecondChoiceInAnalyst`,
    )
    if (version >= 3) {
      requireStringArray(
        item.discriminatingAxes,
        source,
        `${path}.discriminatingAxes`,
        { unique: true, allowedValues: axes },
      )
    }

    const options = requireObjectArray(
      item.options,
      source,
      `${path}.options`,
      3,
      5,
    )
    requireUniqueIds(options, source, `${path}.options`)
    options.forEach((option, optionIndex) =>
      validateModuleOption(
        option,
        axes,
        source,
        `${path}.options[${optionIndex}]`,
      ),
    )
  })
}

function validateModuleOption(
  option: UnknownObject,
  axes: ReadonlySet<string>,
  source: string,
  path: string,
) {
  requireAllowedFields(option, MODULE_OPTION_FIELDS, source, path)
  requireFields(option, ["id", "title", "label", "signals"], source, path)
  requireString(option.id, source, `${path}.id`)
  requireString(option.title, source, `${path}.title`)
  requireString(option.label, source, `${path}.label`)
  validateSignals(option.signals, axes, source, `${path}.signals`)
  validatePinned(option.pinned, source, `${path}.pinned`)
}

function validateAiBank(
  bank: UnknownObject,
  source: string,
  version: 2 | 3,
) {
  requireAllowedFields(bank, VERSIONED_BANK_FIELDS, source, "$")
  requireFields(bank, VERSIONED_BANK_FIELDS, source, "$")
  requireLiteral(bank.instrument, "ai-governance", source, "$.instrument")

  const items = requireObjectArray(bank.items, source, "$.items", 1)
  requireUniqueIds(items, source, "$.items")
  items.forEach((item, index) =>
    validateAiItem(item, source, `$.items[${index}]`, version),
  )
}

function validateAiItem(
  item: UnknownObject,
  source: string,
  path: string,
  version: 2 | 3,
) {
  const kind = requireString(item.kind, source, `${path}.kind`)
  if (kind === "likert") {
    requireAllowedFields(
      item,
      version === 3 ? AI_LIKERT_V3_FIELDS : AI_LIKERT_FIELDS,
      source,
      path,
    )
    requireFields(
      item,
      [
        "id",
        "kind",
        "modes",
        "axis",
        "reverse",
        ...(version === 3 ? ["discriminatingAxes"] : []),
        "prompt",
      ],
      source,
      path,
    )
    requireString(item.id, source, `${path}.id`)
    requireModes(item.modes, source, `${path}.modes`)
    requireEnumString(item.axis, AI_AXES, source, `${path}.axis`)
    requireBoolean(item.reverse, source, `${path}.reverse`)
    requireString(item.prompt, source, `${path}.prompt`)
    validateOptionalString(item.helpText, source, `${path}.helpText`)
    validateOptionalClarification(item.clarification, source, `${path}.clarification`)
    if (version === 3) {
      requireStringArray(
        item.discriminatingAxes,
        source,
        `${path}.discriminatingAxes`,
        { unique: true, allowedValues: AI_AXES },
      )
    }
    return
  }

  if (kind !== "scenario") {
    fail(source, `${path}.kind`, `unsupported AI item kind ${JSON.stringify(kind)}.`)
  }

  requireAllowedFields(
    item,
    version === 3 ? AI_SCENARIO_V3_FIELDS : AI_SCENARIO_FIELDS,
    source,
    path,
  )
  requireFields(
    item,
    [
      "id",
      "kind",
      "modes",
      "cardType",
      ...(version === 3 ? ["discriminatingAxes"] : []),
      "prompt",
      "options",
    ],
    source,
    path,
  )
  requireString(item.id, source, `${path}.id`)
  requireModes(item.modes, source, `${path}.modes`)
  requireEnumString(
    item.cardType,
    new Set(["explanation", "decision", "actorLens"]),
    source,
    `${path}.cardType`,
  )
  requireString(item.prompt, source, `${path}.prompt`)
  validateOptionalString(item.analystPrompt, source, `${path}.analystPrompt`)
  validateOptionalString(item.helpText, source, `${path}.helpText`)
  validateOptionalString(item.actorRole, source, `${path}.actorRole`)
  validateOptionalStringArray(item.tags, source, `${path}.tags`)
  validateOptionalBoolean(
    item.allowBackupChoiceInAnalyst,
    source,
    `${path}.allowBackupChoiceInAnalyst`,
  )
  if (version === 3) {
    requireStringArray(
      item.discriminatingAxes,
      source,
      `${path}.discriminatingAxes`,
      { unique: true, allowedValues: AI_AXES },
    )
  }

  const options = requireObjectArray(
    item.options,
    source,
    `${path}.options`,
    3,
    5,
  )
  requireUniqueIds(options, source, `${path}.options`)
  options.forEach((option, optionIndex) =>
    validateAiOption(option, source, `${path}.options[${optionIndex}]`),
  )

  if (item.analystOptions !== undefined) {
    const analystOptions = requireObjectArray(
      item.analystOptions,
      source,
      `${path}.analystOptions`,
      3,
      5,
    )
    requireUniqueIds(analystOptions, source, `${path}.analystOptions`)
    analystOptions.forEach((option, optionIndex) =>
      validateAiOption(
        option,
        source,
        `${path}.analystOptions[${optionIndex}]`,
      ),
    )
  }
}

function validateAiOption(
  option: UnknownObject,
  source: string,
  path: string,
) {
  requireAllowedFields(option, AI_OPTION_FIELDS, source, path)
  requireFields(option, ["id", "label", "signals"], source, path)
  requireEnumString(option.id, AI_OPTION_IDS, source, `${path}.id`)
  requireString(option.label, source, `${path}.label`)
  validateSignals(option.signals, AI_AXES, source, `${path}.signals`)
  validateOptionalString(option.followUpId, source, `${path}.followUpId`)
  validatePinned(option.pinned, source, `${path}.pinned`)
}

function validateSignals(
  value: unknown,
  axes: ReadonlySet<string>,
  source: string,
  path: string,
) {
  const signals = requireObject(value, source, path)
  requireAllowedFields(signals, axes, source, path)
  if (Object.keys(signals).length === 0) {
    fail(source, path, "must contain at least one signal.")
  }
  for (const [axis, signal] of Object.entries(signals)) {
    requireFiniteNumber(signal, source, `${path}.${axis}`)
  }
}

function validateOptionalClarification(
  value: unknown,
  source: string,
  path: string,
) {
  if (value === undefined) return
  const clarification = requireObject(value, source, path)
  requireAllowedFields(clarification, CLARIFICATION_FIELDS, source, path)
  requireFields(clarification, ["whatItAsks"], source, path)
  validateOptionalString(clarification.title, source, `${path}.title`)
  requireString(clarification.whatItAsks, source, `${path}.whatItAsks`)
  validateOptionalString(
    clarification.whatItDoesNotAsk,
    source,
    `${path}.whatItDoesNotAsk`,
  )

  if (clarification.terms !== undefined) {
    const terms = requireObjectArray(
      clarification.terms,
      source,
      `${path}.terms`,
      1,
    )
    terms.forEach((term, index) => {
      const termPath = `${path}.terms[${index}]`
      requireAllowedFields(
        term,
        CLARIFICATION_TERM_FIELDS,
        source,
        termPath,
      )
      requireFields(term, CLARIFICATION_TERM_FIELDS, source, termPath)
      requireString(term.term, source, `${termPath}.term`)
      requireString(term.definition, source, `${termPath}.definition`)
    })
  }
}

function validateOptionalContextBullets(
  value: unknown,
  source: string,
  path: string,
) {
  if (value === undefined) return
  const bullets = requireObjectArray(value, source, path)
  bullets.forEach((bullet, index) => {
    const bulletPath = `${path}[${index}]`
    requireAllowedFields(
      bullet,
      CONTEXT_BULLET_FIELDS,
      source,
      bulletPath,
    )
    requireFields(bullet, CONTEXT_BULLET_FIELDS, source, bulletPath)
    requireString(bullet.label, source, `${bulletPath}.label`)
    requireString(bullet.text, source, `${bulletPath}.text`)
  })
}

function requireObject(
  value: unknown,
  source: string,
  path: string,
): UnknownObject {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    fail(source, path, `must be an object; received ${describe(value)}.`)
  }
  return value as UnknownObject
}

function requireObjectArray(
  value: unknown,
  source: string,
  path: string,
  minimum = 0,
  maximum = Number.POSITIVE_INFINITY,
): UnknownObject[] {
  if (!Array.isArray(value)) {
    fail(source, path, `must be an array; received ${describe(value)}.`)
  }
  if (value.length < minimum || value.length > maximum) {
    fail(
      source,
      path,
      `must contain ${formatRange(minimum, maximum)} entries; found ${value.length}.`,
    )
  }
  return value.map((entry, index) =>
    requireObject(entry, source, `${path}[${index}]`),
  )
}

function requireAllowedFields(
  object: UnknownObject,
  allowedFields: Iterable<string>,
  source: string,
  path: string,
) {
  const allowed = new Set(allowedFields)
  const unsupported = Object.keys(object)
    .filter((field) => !allowed.has(field))
    .sort()
  if (unsupported.length > 0) {
    fail(
      source,
      path,
      `contains unsupported field${unsupported.length === 1 ? "" : "s"}: ` +
        unsupported.map((field) => JSON.stringify(field)).join(", ") +
        ".",
    )
  }
}

function requireFields(
  object: UnknownObject,
  requiredFields: Iterable<string>,
  source: string,
  path: string,
) {
  const missing = [...requiredFields]
    .filter((field) => !Object.hasOwn(object, field))
    .sort()
  if (missing.length > 0) {
    fail(
      source,
      path,
      `is missing required field${missing.length === 1 ? "" : "s"}: ` +
        missing.map((field) => JSON.stringify(field)).join(", ") +
        ".",
    )
  }
}

function requireString(
  value: unknown,
  source: string,
  path: string,
): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    fail(source, path, `must be a non-empty string; received ${describe(value)}.`)
  }
  return value
}

function validateOptionalString(
  value: unknown,
  source: string,
  path: string,
) {
  if (value !== undefined) requireString(value, source, path)
}

function requireBoolean(
  value: unknown,
  source: string,
  path: string,
): boolean {
  if (typeof value !== "boolean") {
    fail(source, path, `must be boolean; received ${describe(value)}.`)
  }
  return value
}

function validateOptionalBoolean(
  value: unknown,
  source: string,
  path: string,
) {
  if (value !== undefined) requireBoolean(value, source, path)
}

function requireInteger(
  value: unknown,
  source: string,
  path: string,
): number {
  if (!Number.isInteger(value)) {
    fail(source, path, `must be an integer; received ${describe(value)}.`)
  }
  return value as number
}

function requireExactInteger(
  value: unknown,
  expected: number,
  source: string,
  path: string,
) {
  const actual = requireInteger(value, source, path)
  if (actual !== expected) {
    fail(source, path, `must equal ${expected}; received ${actual}.`)
  }
}

function requireFiniteNumber(
  value: unknown,
  source: string,
  path: string,
): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    fail(source, path, `must be a finite number; received ${describe(value)}.`)
  }
  return value
}

function requireLiteral(
  value: unknown,
  expected: string,
  source: string,
  path: string,
) {
  if (value !== expected) {
    fail(
      source,
      path,
      `must equal ${JSON.stringify(expected)}; received ${JSON.stringify(value)}.`,
    )
  }
}

function requireEnumString(
  value: unknown,
  allowedValues: ReadonlySet<string>,
  source: string,
  path: string,
): string {
  const string = requireString(value, source, path)
  if (!allowedValues.has(string)) {
    fail(
      source,
      path,
      `has unsupported value ${JSON.stringify(string)}; expected one of ` +
        [...allowedValues].sort().map((entry) => JSON.stringify(entry)).join(", ") +
        ".",
    )
  }
  return string
}

function requireModes(
  value: unknown,
  source: string,
  path: string,
) {
  requireStringArray(value, source, path, {
    minimum: 1,
    maximum: 2,
    unique: true,
    allowedValues: MODES,
  })
}

type StringArrayRequirements = {
  minimum?: number
  maximum?: number
  unique?: boolean
  allowedValues?: ReadonlySet<string>
}

function requireStringArray(
  value: unknown,
  source: string,
  path: string,
  requirements: StringArrayRequirements = {},
): string[] {
  if (!Array.isArray(value)) {
    fail(source, path, `must be an array; received ${describe(value)}.`)
  }
  const {
    minimum = 0,
    maximum = Number.POSITIVE_INFINITY,
    unique = false,
    allowedValues,
  } = requirements
  if (value.length < minimum || value.length > maximum) {
    fail(
      source,
      path,
      `must contain ${formatRange(minimum, maximum)} entries; found ${value.length}.`,
    )
  }

  const strings = value.map((entry, index) =>
    requireString(entry, source, `${path}[${index}]`),
  )
  if (unique && new Set(strings).size !== strings.length) {
    fail(source, path, "must not contain duplicate values.")
  }
  if (allowedValues) {
    strings.forEach((entry, index) => {
      if (!allowedValues.has(entry)) {
        fail(
          source,
          `${path}[${index}]`,
          `has unsupported value ${JSON.stringify(entry)}.`,
        )
      }
    })
  }
  return strings
}

function validateOptionalStringArray(
  value: unknown,
  source: string,
  path: string,
) {
  if (value !== undefined) {
    requireStringArray(value, source, path, { unique: true })
  }
}

function validatePinned(
  value: unknown,
  source: string,
  path: string,
) {
  if (value !== undefined) requireLiteral(value, "last", source, path)
}

function requireUniqueIds(
  objects: UnknownObject[],
  source: string,
  path: string,
) {
  const ids = objects.map((object, index) =>
    requireString(object.id, source, `${path}[${index}].id`),
  )
  const duplicate = ids.find((id, index) => ids.indexOf(id) !== index)
  if (duplicate) {
    fail(source, path, `contains duplicate id ${JSON.stringify(duplicate)}.`)
  }
}

function formatRange(minimum: number, maximum: number) {
  if (maximum === Number.POSITIVE_INFINITY) return `at least ${minimum}`
  if (minimum === maximum) return `exactly ${minimum}`
  return `${minimum} to ${maximum}`
}

function describe(value: unknown) {
  if (value === null) return "null"
  if (Array.isArray(value)) return "array"
  if (typeof value === "number" && !Number.isFinite(value)) {
    return String(value)
  }
  return typeof value
}

function fail(source: string, path: string, message: string): never {
  throw new TypeError(`${source}: ${path} ${message}`)
}
