import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import {
  evaluateDeclaredAxis,
  type DeclaredAxisEvaluation,
} from "@/lib/instrument/measurement-gates"
import { MODULE_PERSPECTIVE_MATRIX } from "@/lib/modules/framework"
// Node's strip-types runtime requires the explicit .mts extension.
// @ts-expect-error TypeScript's bundler resolver disallows that runtime form.
import { EVIDENCE_ARTIFACT_SCHEMA_VERSION } from "@/scripts/evidence-utils.mts"

type JsonRecord = Record<string, unknown>
type EvidenceGeneration = "current" | "legacy"
type EvidenceMode = "standard" | "analyst"
type ItemScoringStrategy = "foundation-block" | "module" | "all"
type ModeStrategy = "declared" | "foundation-v1"

export type EvidenceBankSpec = {
  key: string
  generation: EvidenceGeneration
  instrument: "foundation" | "security" | "technology" | "ai-governance"
  bankVersion: number | null
  scoringVersion: number
  runtimeVersion: number
  sourcePath: string
  bankVersionField: "instrumentVersion" | "scoringVersion"
  modeStrategy: ModeStrategy
  scoringStrategy: ItemScoringStrategy
  axes: readonly string[]
  bankFields: readonly string[]
  itemFieldsByKind: Readonly<Record<string, readonly string[]>>
  optionFields: readonly string[]
  requiresDiscriminatingAxes: boolean
  supportsDiscriminatingAxes: boolean
  separationPolicy: {
    midpoint: number
    minimumSpread: number
    source: "existing-measurement-gate"
  } | null
  modeNote: string
}

export type LoadedEvidenceBankDescriptor = EvidenceBankSpec & {
  bank: JsonRecord
}

/**
 * Structural shape returned by scripts/evidence-bank-validation.mts.
 * Kept structural here so the analysis layer can accept already-validated
 * banks without coupling its pure analysis API to a filesystem loader.
 */
export type ValidatedEvidenceBankIdentity = {
  key: string
  instrument: EvidenceBankSpec["instrument"]
  release: EvidenceGeneration
  bankVersion: number | null
  scoringVersion: number
}

export class EvidenceInstrumentValidationError extends Error {
  readonly problems: string[]

  constructor(problems: readonly string[]) {
    super(
      "Evidence instrument input failed closed:\n" +
        problems.map((problem) => `- ${problem}`).join("\n"),
    )
    this.name = "EvidenceInstrumentValidationError"
    this.problems = [...problems]
  }
}

const FOUNDATION_AXES = [
  "securityCompetition",
  "institutions",
  "domesticFilters",
  "normsIdentity",
  "politicalEconomy",
  "restraint",
  "orderJustice",
] as const

const SECURITY_AXES = [
  "activism",
  "escalation",
  "alliance",
  "legitimacy",
] as const

const TECHNOLOGY_AXES = [
  "control",
  "governance",
  "industrial",
  "safety",
] as const

const AI_AXES = [
  "riskHorizon",
  "deploymentPace",
  "oversight",
  "geopolitics",
  "openness",
  "militaryRole",
  "legitimacy",
  "humanFuture",
] as const

const FOUNDATION_CORE_LIKERT_FIELDS = [
  "id",
  "kind",
  "modes",
  "tier",
  "scoringBlock",
  "prompt",
  "helpText",
  "dimension",
  "reverse",
  "clarification",
] as const

const FOUNDATION_VALIDATION_LIKERT_FIELDS = [
  "id",
  "kind",
  "modes",
  "tier",
  "scoringBlock",
  "prompt",
  "helpText",
  "validationScale",
  "citation",
  "reverse",
  "clarification",
] as const

const FOUNDATION_CHOICE_FIELDS = [
  "id",
  "kind",
  "modes",
  "tier",
  "scoringBlock",
  "prompt",
  "helpText",
  "cardType",
  "allowSecondChoiceInAnalyst",
  "clarification",
  "options",
] as const

const MODULE_FIELDS_V2 = [
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

const MODULE_FIELDS_V3 = [
  ...MODULE_FIELDS_V2,
  "discriminatingAxes",
] as const

const AI_LIKERT_FIELDS_V2 = [
  "id",
  "kind",
  "modes",
  "axis",
  "reverse",
  "prompt",
  "helpText",
  "clarification",
] as const

const AI_SCENARIO_FIELDS_V2 = [
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

const AI_LIKERT_FIELDS_V3 = [
  ...AI_LIKERT_FIELDS_V2,
  "discriminatingAxes",
] as const

const AI_SCENARIO_FIELDS_V3 = [
  ...AI_SCENARIO_FIELDS_V2,
  "discriminatingAxes",
] as const

export const EVIDENCE_BANK_SPECS: readonly EvidenceBankSpec[] = [
  {
    key: "foundation-bank-v2",
    generation: "current",
    instrument: "foundation",
    bankVersion: 2,
    scoringVersion: 2,
    runtimeVersion: 2,
    sourcePath: "content/instrument/foundation.v2.json",
    bankVersionField: "instrumentVersion",
    modeStrategy: "declared",
    scoringStrategy: "foundation-block",
    axes: FOUNDATION_AXES,
    bankFields: ["instrument", "instrumentVersion", "discriminators", "items"],
    itemFieldsByKind: {
      likert: [
        ...new Set([
          ...FOUNDATION_CORE_LIKERT_FIELDS,
          ...FOUNDATION_VALIDATION_LIKERT_FIELDS,
        ]),
      ],
      tradeoff: FOUNDATION_CHOICE_FIELDS,
      miniCase: FOUNDATION_CHOICE_FIELDS,
    },
    optionFields: ["id", "title", "label", "signals", "pinned"],
    requiresDiscriminatingAxes: false,
    supportsDiscriminatingAxes: false,
    separationPolicy: null,
    modeNote:
      "Bank mode tags are reported as declared. The active tiered Foundation flow selects core/extended forms separately and scores selected answers in analyst mode.",
  },
  {
    key: "security-bank-v3",
    generation: "current",
    instrument: "security",
    bankVersion: 3,
    scoringVersion: 2,
    runtimeVersion: 2,
    sourcePath: "content/instrument/security.v3.json",
    bankVersionField: "instrumentVersion",
    modeStrategy: "declared",
    scoringStrategy: "module",
    axes: SECURITY_AXES,
    bankFields: ["instrument", "instrumentVersion", "items"],
    itemFieldsByKind: {
      case: MODULE_FIELDS_V3,
      synthesis: MODULE_FIELDS_V3,
    },
    optionFields: ["id", "title", "label", "signals", "pinned"],
    requiresDiscriminatingAxes: true,
    supportsDiscriminatingAxes: true,
    separationPolicy: {
      midpoint: 4,
      minimumSpread: 2,
      source: "existing-measurement-gate",
    },
    modeNote: "Module modes use the exact questionsByMode bank membership.",
  },
  {
    key: "technology-bank-v3",
    generation: "current",
    instrument: "technology",
    bankVersion: 3,
    scoringVersion: 2,
    runtimeVersion: 2,
    sourcePath: "content/instrument/technology.v3.json",
    bankVersionField: "instrumentVersion",
    modeStrategy: "declared",
    scoringStrategy: "module",
    axes: TECHNOLOGY_AXES,
    bankFields: ["instrument", "instrumentVersion", "items"],
    itemFieldsByKind: {
      case: MODULE_FIELDS_V3,
      synthesis: MODULE_FIELDS_V3,
    },
    optionFields: ["id", "title", "label", "signals", "pinned"],
    requiresDiscriminatingAxes: true,
    supportsDiscriminatingAxes: true,
    separationPolicy: {
      midpoint: 4,
      minimumSpread: 2,
      source: "existing-measurement-gate",
    },
    modeNote: "Module modes use the exact questionsByMode bank membership.",
  },
  {
    key: "ai-governance-bank-v3",
    generation: "current",
    instrument: "ai-governance",
    bankVersion: 3,
    scoringVersion: 2,
    runtimeVersion: 2,
    sourcePath: "content/instrument/ai-governance.v3.json",
    bankVersionField: "instrumentVersion",
    modeStrategy: "declared",
    scoringStrategy: "all",
    axes: AI_AXES,
    bankFields: ["instrument", "instrumentVersion", "items"],
    itemFieldsByKind: {
      likert: AI_LIKERT_FIELDS_V3,
      scenario: AI_SCENARIO_FIELDS_V3,
    },
    optionFields: ["id", "label", "signals", "followUpId", "pinned"],
    requiresDiscriminatingAxes: true,
    supportsDiscriminatingAxes: true,
    separationPolicy: {
      midpoint: 0,
      minimumSpread: 0.5,
      source: "existing-measurement-gate",
    },
    modeNote:
      "Analyst mode uses analystOptions where declared and otherwise uses options; standard items remain part of the analyst form.",
  },
  {
    key: "foundation-scoring-v1",
    generation: "legacy",
    instrument: "foundation",
    bankVersion: null,
    scoringVersion: 1,
    runtimeVersion: 1,
    sourcePath: "content/instrument/foundation.scoring.v1.json",
    bankVersionField: "scoringVersion",
    modeStrategy: "foundation-v1",
    scoringStrategy: "all",
    axes: FOUNDATION_AXES,
    bankFields: ["instrument", "scoringVersion", "items"],
    itemFieldsByKind: {
      likert: ["id", "kind", "dimension", "reverse"],
      tradeoff: ["id", "kind", "allowSecondChoiceInAnalyst", "options"],
      miniCase: ["id", "kind", "allowSecondChoiceInAnalyst", "options"],
    },
    optionFields: ["id", "signals"],
    requiresDiscriminatingAxes: false,
    supportsDiscriminatingAxes: false,
    separationPolicy: null,
    modeNote:
      "The frozen v1 scoring snapshot has no mode field. Non-an_ IDs are standard+analyst; an_ IDs are analyst-only, matching the v1 runtime.",
  },
  {
    key: "security-bank-v2",
    generation: "legacy",
    instrument: "security",
    bankVersion: 2,
    scoringVersion: 1,
    runtimeVersion: 1,
    sourcePath: "content/instrument/security.v2.json",
    bankVersionField: "instrumentVersion",
    modeStrategy: "declared",
    scoringStrategy: "module",
    axes: SECURITY_AXES,
    bankFields: ["instrument", "instrumentVersion", "items"],
    itemFieldsByKind: {
      case: MODULE_FIELDS_V2,
      synthesis: MODULE_FIELDS_V2,
    },
    optionFields: ["id", "title", "label", "signals", "pinned"],
    requiresDiscriminatingAxes: false,
    supportsDiscriminatingAxes: false,
    separationPolicy: null,
    modeNote:
      "Frozen V21 module bank. Discriminating axes were not declared in this version.",
  },
  {
    key: "technology-bank-v2",
    generation: "legacy",
    instrument: "technology",
    bankVersion: 2,
    scoringVersion: 1,
    runtimeVersion: 1,
    sourcePath: "content/instrument/technology.v2.json",
    bankVersionField: "instrumentVersion",
    modeStrategy: "declared",
    scoringStrategy: "module",
    axes: TECHNOLOGY_AXES,
    bankFields: ["instrument", "instrumentVersion", "items"],
    itemFieldsByKind: {
      case: MODULE_FIELDS_V2,
      synthesis: MODULE_FIELDS_V2,
    },
    optionFields: ["id", "title", "label", "signals", "pinned"],
    requiresDiscriminatingAxes: false,
    supportsDiscriminatingAxes: false,
    separationPolicy: null,
    modeNote:
      "Frozen V21 module bank. Discriminating axes were not declared in this version.",
  },
  {
    key: "ai-governance-bank-v2",
    generation: "legacy",
    instrument: "ai-governance",
    bankVersion: 2,
    scoringVersion: 1,
    runtimeVersion: 1,
    sourcePath: "content/instrument/ai-governance.v2.json",
    bankVersionField: "instrumentVersion",
    modeStrategy: "declared",
    scoringStrategy: "all",
    axes: AI_AXES,
    bankFields: ["instrument", "instrumentVersion", "items"],
    itemFieldsByKind: {
      likert: AI_LIKERT_FIELDS_V2,
      scenario: AI_SCENARIO_FIELDS_V2,
    },
    optionFields: ["id", "label", "signals", "followUpId", "pinned"],
    requiresDiscriminatingAxes: false,
    supportsDiscriminatingAxes: false,
    separationPolicy: null,
    modeNote:
      "Frozen V21 AI Governance bank. Discriminating axes were not declared in this version.",
  },
] as const

export const MODAL_VERB_LEXICON = [
  "can",
  "could",
  "may",
  "might",
  "must",
  "shall",
  "should",
  "will",
  "would",
  "have to",
  "has to",
  "need to",
  "needs to",
  "ought to",
] as const

export const ABSOLUTISM_LEXICON = [
  "all",
  "always",
  "never",
  "none",
  "no one",
  "only",
  "entirely",
  "completely",
  "absolutely",
  "inevitably",
  "impossible",
  "must",
  "under no circumstances",
  "in all cases",
  "without exception",
] as const

export const NEAR_DUPLICATE_SIMILARITY = 0.84
export const NEAR_DUPLICATE_MINIMUM_WORDS = 5

export async function loadEvidenceBankDescriptors(
  repositoryRoot = process.cwd(),
  specs: readonly EvidenceBankSpec[] = EVIDENCE_BANK_SPECS,
): Promise<LoadedEvidenceBankDescriptor[]> {
  const descriptors = await Promise.all(
    specs.map(async (spec) => {
      const source = await readFile(resolve(repositoryRoot, spec.sourcePath), "utf8")
      const parsed: unknown = JSON.parse(source)
      if (!isRecord(parsed)) {
        throw new EvidenceInstrumentValidationError([
          `${spec.sourcePath} must contain a JSON object.`,
        ])
      }
      return { ...spec, bank: parsed }
    }),
  )

  for (const descriptor of descriptors) {
    validateEvidenceBankDescriptor(descriptor)
  }

  return descriptors
}

export function acceptValidatedEvidenceBank(
  bank: JsonRecord,
  identity: ValidatedEvidenceBankIdentity,
  sourcePath?: string,
): LoadedEvidenceBankDescriptor {
  const spec = EVIDENCE_BANK_SPECS.find(
    (candidate) => candidate.key === identity.key,
  )
  if (
    !spec ||
    spec.instrument !== identity.instrument ||
    spec.generation !== identity.release ||
    spec.bankVersion !== identity.bankVersion ||
    spec.scoringVersion !== identity.scoringVersion
  ) {
    throw new EvidenceInstrumentValidationError([
      `Validated bank identity ${JSON.stringify(identity)} is not supported by the evidence analysis registry.`,
    ])
  }

  const descriptor = {
    ...spec,
    ...(sourcePath ? { sourcePath } : {}),
    bank,
  }
  validateEvidenceBankDescriptor(descriptor)
  return descriptor
}

export function validateEvidenceBankDescriptor(
  descriptor: LoadedEvidenceBankDescriptor,
): void {
  const problems: string[] = []
  const { bank, sourcePath } = descriptor
  rejectUnsupportedFields(bank, descriptor.bankFields, sourcePath, problems)

  if (bank.instrument !== descriptor.instrument) {
    problems.push(
      `${sourcePath}.instrument must be ${JSON.stringify(descriptor.instrument)}.`,
    )
  }

  const expectedVersion =
    descriptor.bankVersionField === "instrumentVersion"
      ? descriptor.bankVersion
      : descriptor.scoringVersion
  if (bank[descriptor.bankVersionField] !== expectedVersion) {
    problems.push(
      `${sourcePath}.${descriptor.bankVersionField} must be ${String(expectedVersion)}.`,
    )
  }

  if (!Array.isArray(bank.items)) {
    problems.push(`${sourcePath}.items must be an array.`)
  } else {
    const seenItemIds = new Set<string>()
    bank.items.forEach((value, itemIndex) => {
      const itemPath = `${sourcePath}.items[${itemIndex}]`
      if (!isRecord(value)) {
        problems.push(`${itemPath} must be an object.`)
        return
      }

      const kind = typeof value.kind === "string" ? value.kind : ""
      const allowedFields = descriptor.itemFieldsByKind[kind]
      if (!allowedFields) {
        problems.push(`${itemPath}.kind ${JSON.stringify(value.kind)} is unsupported.`)
        return
      }
      rejectUnsupportedFields(value, allowedFields, itemPath, problems)

      if (typeof value.id !== "string" || value.id.length === 0) {
        problems.push(`${itemPath}.id must be a non-empty string.`)
      } else if (seenItemIds.has(value.id)) {
        problems.push(`${itemPath}.id duplicates ${JSON.stringify(value.id)}.`)
      } else {
        seenItemIds.add(value.id)
      }

      if (descriptor.modeStrategy === "declared") {
        validateModes(value.modes, `${itemPath}.modes`, problems)
      }

      if (kind === "likert" && typeof value.reverse !== "boolean") {
        problems.push(`${itemPath}.reverse must explicitly be true or false.`)
      }

      const declaredAxes = readStringArray(value.discriminatingAxes)
      if (
        descriptor.requiresDiscriminatingAxes &&
        (!Array.isArray(value.discriminatingAxes) || declaredAxes.length === 0)
      ) {
        problems.push(`${itemPath}.discriminatingAxes must be a non-empty array.`)
      }
      for (const axis of declaredAxes) {
        if (!descriptor.axes.includes(axis)) {
          problems.push(
            `${itemPath}.discriminatingAxes contains unsupported axis ${JSON.stringify(axis)}.`,
          )
        }
      }

      for (const optionField of ["options", "analystOptions"] as const) {
        const rawOptions = value[optionField]
        if (rawOptions === undefined) continue
        if (!Array.isArray(rawOptions)) {
          problems.push(`${itemPath}.${optionField} must be an array.`)
          continue
        }
        const optionIds = new Set<string>()
        rawOptions.forEach((rawOption, optionIndex) => {
          const optionPath = `${itemPath}.${optionField}[${optionIndex}]`
          if (!isRecord(rawOption)) {
            problems.push(`${optionPath} must be an object.`)
            return
          }
          rejectUnsupportedFields(
            rawOption,
            descriptor.optionFields,
            optionPath,
            problems,
          )
          if (typeof rawOption.id !== "string" || rawOption.id.length === 0) {
            problems.push(`${optionPath}.id must be a non-empty string.`)
          } else if (optionIds.has(rawOption.id)) {
            problems.push(`${optionPath}.id duplicates ${JSON.stringify(rawOption.id)}.`)
          } else {
            optionIds.add(rawOption.id)
          }

          if (!isRecord(rawOption.signals)) {
            problems.push(`${optionPath}.signals must be an object.`)
            return
          }
          for (const [axis, signal] of Object.entries(rawOption.signals)) {
            if (!descriptor.axes.includes(axis)) {
              problems.push(
                `${optionPath}.signals contains unsupported axis ${JSON.stringify(axis)}.`,
              )
            }
            if (typeof signal !== "number" || !Number.isFinite(signal)) {
              problems.push(`${optionPath}.signals.${axis} must be a finite number.`)
            }
          }
        })
      }
    })
  }

  if (problems.length > 0) {
    throw new EvidenceInstrumentValidationError(problems)
  }
}

type EvidenceOptionSet = {
  source: "options" | "analystOptions"
  effectiveModes: EvidenceMode[]
  options: JsonRecord[]
}

export type EvidenceCoverageRecord = {
  id: string
  modes: EvidenceMode[]
  kind: string
  tier: string
  scoringBlock: string
  cardType: string
  lane: string
  assignedAxes: string[]
  signalAxes: string[]
  declaredDiscriminatingAxes: string[]
  actorRoles: string[]
  actorRoleSource: "explicit" | "perspective-tag-matrix" | "undeclared"
  theater: string
  perspectiveTags: string[]
  knowledgeLoad: string
  reverse: boolean | null
  scored: boolean
  primaryScored: boolean
  optionSets: Array<{
    source: "options" | "analystOptions"
    effectiveModes: EvidenceMode[]
    optionCount: number
  }>
}

type ShareSummary = {
  numerator: number
  denominator: number
  share: number | null
}

type CountSummary = Record<string, number>

export type EvidenceOptionTextLocation = {
  descriptorKey: string
  generation: EvidenceGeneration
  instrument: string
  itemId: string
  source: "options" | "analystOptions"
  effectiveModes: EvidenceMode[]
  optionId: string
  text: string
  normalizedText: string
  wordCount: number
  characterCount: number
  modalVerbs: string[]
  absolutistTerms: string[]
}

type NumericSpread = {
  minimum: number
  maximum: number
  mean: number
  spread: number
}

export type EvidenceOptionAsymmetry = {
  itemId: string
  source: "options" | "analystOptions"
  effectiveModes: EvidenceMode[]
  options: Array<{
    optionId: string
    wordCount: number
    characterCount: number
    modalVerbCount: number
    absolutismCount: number
  }>
  wordCount: NumericSpread
  characterCount: NumericSpread
  modalVerbCount: NumericSpread
  absolutismCount: NumericSpread
}

export type EvidenceAxisSeparation = {
  itemId: string
  kind: string
  status:
    | "reviewed-option-signals"
    | "direct-likert-scale"
    | "not-applicable"
    | "legacy-not-declared"
  declaredAxes: string[]
  allDeclaredAxesPassMidpointRangeGate: boolean | null
  optionSets: Array<{
    source: "options" | "analystOptions"
    effectiveModes: EvidenceMode[]
    duplicateCompleteOptionVectors: EvidenceDuplicateOptionVector[]
    axes: Array<
      DeclaredAxisEvaluation & {
        axis: string
        optionCount: number
        distinctSignalValueCount: number
        nonMidpointOptionCount: number
        missingSignalCount: number
        duplicateSignalValueCount: number
        soleMinimum: boolean
        soleMaximum: boolean
        passesMidpointRangeGate: boolean
      }
    >
  }>
}

export type EvidenceDuplicateOptionVector = {
  optionIds: string[]
  signals: Record<string, number>
}

export type EvidenceConcentration = {
  denominatorItems: number
  counts: CountSummary
  leaders: string[]
  leaderItemCount: number
  leaderShareOfItems: number | null
  undeclaredItems: number
}

export type InstrumentEvidenceAnalysis = {
  descriptor: {
    key: string
    generation: EvidenceGeneration
    instrument: string
    bankVersion: number | null
    scoringVersion: number
    runtimeVersion: number
    sourcePath: string
    modeNote: string
  }
  coverage: {
    totalItems: number
    items: EvidenceCoverageRecord[]
    byMode: CountSummary
    byAxis: CountSummary
    byLane: CountSummary
    byQuestionType: CountSummary
    byScoringBlock: CountSummary
    byActorRole: CountSummary
    byTheater: CountSummary
    byPerspectiveTag: CountSummary
    byKnowledgeLoad: CountSummary
  }
  shares: {
    reverseCodedAll: ShareSummary
    reverseCodedScored: ShareSummary
    reverseCodedPrimaryScored: ShareSummary
    scoredItems: ShareSummary
    primaryScoredItems: ShareSummary
    reverseCodedByMode: Record<string, ShareSummary>
    reverseCodedByAxis: Record<string, ShareSummary>
    scoredItemsByMode: Record<string, ShareSummary>
    scoredItemsByAxis: Record<string, ShareSummary>
    primaryScoredItemsByMode: Record<string, ShareSummary>
  }
  optionText: {
    method: {
      text: string
      modalVerbLexicon: readonly string[]
      absolutismLexicon: readonly string[]
    }
    locations: EvidenceOptionTextLocation[]
    asymmetry: EvidenceOptionAsymmetry[]
  }
  axisSeparation: {
    policy: EvidenceBankSpec["separationPolicy"]
    items: EvidenceAxisSeparation[]
    itemsFailingMidpointRangeGate: string[]
  }
  concentrations: {
    actorRole: EvidenceConcentration
    theater: EvidenceConcentration
    perspectiveTag: EvidenceConcentration
    knowledgeLoad: EvidenceConcentration
    actorRoleByMode: Record<string, EvidenceConcentration>
    theaterByMode: Record<string, EvidenceConcentration>
  }
  metadataGaps: Array<{
    field: string
    undeclaredItems: number
    totalItems: number
    note: string
  }>
}

export type EvidenceTextReuse = {
  exact: Array<{
    normalizedText: string
    locations: EvidenceOptionTextLocation[]
  }>
  near: Array<{
    similarity: number
    left: EvidenceOptionTextLocation
    right: EvidenceOptionTextLocation
  }>
  method: {
    exactNormalization: string
    nearSimilarity: string
    nearThreshold: number
    minimumWords: number
    classification: "advisory"
  }
}

export type InstrumentEvidenceReport = {
  schemaVersion: typeof EVIDENCE_ARTIFACT_SCHEMA_VERSION
  instruments: InstrumentEvidenceAnalysis[]
  textReuseByGeneration: Record<EvidenceGeneration, EvidenceTextReuse>
}

export function analyzeInstrumentDescriptor(
  descriptor: LoadedEvidenceBankDescriptor,
): InstrumentEvidenceAnalysis {
  validateEvidenceBankDescriptor(descriptor)
  const rawItems = descriptor.bank.items as JsonRecord[]
  const coverageItems = rawItems.map((item) =>
    buildCoverageRecord(descriptor, item),
  )
  const optionLocations = rawItems.flatMap((item) =>
    buildOptionTextLocations(descriptor, item),
  )

  return {
    descriptor: {
      key: descriptor.key,
      generation: descriptor.generation,
      instrument: descriptor.instrument,
      bankVersion: descriptor.bankVersion,
      scoringVersion: descriptor.scoringVersion,
      runtimeVersion: descriptor.runtimeVersion,
      sourcePath: descriptor.sourcePath,
      modeNote: descriptor.modeNote,
    },
    coverage: {
      totalItems: coverageItems.length,
      items: coverageItems,
      byMode: countMulti(coverageItems.flatMap((item) => item.modes)),
      byAxis: countMulti(coverageItems.flatMap((item) => item.assignedAxes)),
      byLane: countMulti(coverageItems.map((item) => item.lane)),
      byQuestionType: countMulti(coverageItems.map((item) => item.kind)),
      byScoringBlock: countMulti(
        coverageItems.map((item) => item.scoringBlock),
      ),
      byActorRole: countMulti(
        coverageItems.flatMap((item) => item.actorRoles),
      ),
      byTheater: countMulti(coverageItems.map((item) => item.theater)),
      byPerspectiveTag: countMulti(
        coverageItems.flatMap((item) =>
          item.perspectiveTags.length > 0
            ? item.perspectiveTags
            : ["undeclared"],
        ),
      ),
      byKnowledgeLoad: countMulti(
        coverageItems.map((item) => item.knowledgeLoad),
      ),
    },
    shares: buildShares(coverageItems),
    optionText: {
      method: {
        text:
          "Option display text is title plus label when both exist, otherwise label; whitespace is collapsed.",
        modalVerbLexicon: MODAL_VERB_LEXICON,
        absolutismLexicon: ABSOLUTISM_LEXICON,
      },
      locations: optionLocations,
      asymmetry: buildOptionAsymmetry(rawItems, descriptor),
    },
    axisSeparation: buildAxisSeparation(rawItems, descriptor),
    concentrations: {
      actorRole: concentration(
        coverageItems,
        (item) => item.actorRoles,
      ),
      theater: concentration(
        coverageItems,
        (item) => [item.theater],
      ),
      perspectiveTag: concentration(
        coverageItems,
        (item) =>
          item.perspectiveTags.length > 0
            ? item.perspectiveTags
            : ["undeclared"],
      ),
      knowledgeLoad: concentration(
        coverageItems,
        (item) => [item.knowledgeLoad],
      ),
      actorRoleByMode: concentrationsByMode(
        coverageItems,
        (item) => item.actorRoles,
      ),
      theaterByMode: concentrationsByMode(
        coverageItems,
        (item) => [item.theater],
      ),
    },
    metadataGaps: buildMetadataGaps(coverageItems, descriptor),
  }
}

export function analyzeInstrumentEvidence(
  descriptors: readonly LoadedEvidenceBankDescriptor[],
): InstrumentEvidenceReport {
  const instruments = [...descriptors]
    .sort((left, right) => compareText(left.key, right.key))
    .map(analyzeInstrumentDescriptor)

  const locationsByGeneration: Record<
    EvidenceGeneration,
    EvidenceOptionTextLocation[]
  > = {
    current: [],
    legacy: [],
  }
  for (const instrument of instruments) {
    locationsByGeneration[instrument.descriptor.generation].push(
      ...instrument.optionText.locations,
    )
  }

  return {
    schemaVersion: EVIDENCE_ARTIFACT_SCHEMA_VERSION,
    instruments,
    textReuseByGeneration: {
      current: findTextReuse(locationsByGeneration.current),
      legacy: findTextReuse(locationsByGeneration.legacy),
    },
  }
}

function buildCoverageRecord(
  descriptor: LoadedEvidenceBankDescriptor,
  item: JsonRecord,
): EvidenceCoverageRecord {
  const modes = getItemModes(descriptor, item)
  const optionSets = getEffectiveOptionSets(item, modes)
  const signalAxes = uniqueSorted(
    optionSets.flatMap(({ options }) =>
      options.flatMap((option) =>
        isRecord(option.signals) ? Object.keys(option.signals) : [],
      ),
    ),
  )
  const discriminatingAxes = readStringArray(item.discriminatingAxes)
  const directAxis =
    typeof item.dimension === "string"
      ? item.dimension
      : typeof item.axis === "string"
        ? item.axis
        : null
  const assignedAxes = uniqueSorted(
    directAxis
      ? [directAxis]
      : discriminatingAxes.length > 0
        ? discriminatingAxes
        : signalAxes,
  )
  const perspectiveTags = uniqueSorted([
    ...readStringArray(item.perspectiveTags),
    ...readStringArray(item.tags),
  ])
  const actor = getActorRoles(item, perspectiveTags)
  const scoring = getScoringRole(descriptor, item)

  return {
    id: String(item.id),
    modes,
    kind: String(item.kind),
    tier: typeof item.tier === "string" ? item.tier : "undeclared",
    scoringBlock: getScoringBlock(descriptor, item, scoring.primaryScored),
    cardType:
      typeof item.cardType === "string" ? item.cardType : "undeclared",
    lane: typeof item.lane === "string" ? item.lane : "undeclared",
    assignedAxes,
    signalAxes,
    declaredDiscriminatingAxes: discriminatingAxes,
    actorRoles: actor.roles,
    actorRoleSource: actor.source,
    theater:
      typeof item.theater === "string" && item.theater.length > 0
        ? item.theater
        : "undeclared",
    perspectiveTags,
    knowledgeLoad:
      typeof item.knowledgeLoad === "string"
        ? item.knowledgeLoad
        : "undeclared",
    reverse: typeof item.reverse === "boolean" ? item.reverse : null,
    scored: scoring.scored,
    primaryScored: scoring.primaryScored,
    optionSets: optionSets.map((set) => ({
      source: set.source,
      effectiveModes: set.effectiveModes,
      optionCount: set.options.length,
    })),
  }
}

function getScoringRole(
  descriptor: LoadedEvidenceBankDescriptor,
  item: JsonRecord,
) {
  if (descriptor.scoringStrategy === "foundation-block") {
    return {
      scored:
        item.scoringBlock === "core" ||
        item.scoringBlock === "validation",
      primaryScored: item.scoringBlock === "core",
    }
  }
  if (descriptor.scoringStrategy === "module") {
    return {
      scored: true,
      primaryScored: item.cardType !== "actorLens",
    }
  }
  return { scored: true, primaryScored: true }
}

function getScoringBlock(
  descriptor: LoadedEvidenceBankDescriptor,
  item: JsonRecord,
  primaryScored: boolean,
) {
  if (typeof item.scoringBlock === "string") return item.scoringBlock
  if (descriptor.scoringStrategy === "module") {
    return primaryScored ? "aggregate-and-card-type" : "card-type-only"
  }
  if (descriptor.instrument === "ai-governance") {
    return item.kind === "likert" ? "likert-base" : "scenario-adjustment"
  }
  return descriptor.generation === "legacy" ? "legacy-score" : "undeclared"
}

function getActorRoles(item: JsonRecord, perspectiveTags: readonly string[]): {
  roles: string[]
  source: EvidenceCoverageRecord["actorRoleSource"]
} {
  if (typeof item.actorRole === "string" && item.actorRole.length > 0) {
    return { roles: [item.actorRole], source: "explicit" }
  }

  const roles = MODULE_PERSPECTIVE_MATRIX.filter((role) =>
    perspectiveTags.some((tag) => role.tags.some((roleTag) => roleTag === tag)),
  ).map((role) => role.key)

  return roles.length > 0
    ? { roles: uniqueSorted(roles), source: "perspective-tag-matrix" }
    : { roles: ["undeclared"], source: "undeclared" }
}

function getItemModes(
  descriptor: LoadedEvidenceBankDescriptor,
  item: JsonRecord,
): EvidenceMode[] {
  if (descriptor.modeStrategy === "foundation-v1") {
    return String(item.id).startsWith("an_")
      ? ["analyst"]
      : ["standard", "analyst"]
  }
  return readStringArray(item.modes).filter(
    (mode): mode is EvidenceMode =>
      mode === "standard" || mode === "analyst",
  )
}

function getEffectiveOptionSets(
  item: JsonRecord,
  modes: readonly EvidenceMode[],
): EvidenceOptionSet[] {
  const options = readRecordArray(item.options)
  const analystOptions = readRecordArray(item.analystOptions)
  const bySource = new Map<
    EvidenceOptionSet["source"],
    { modes: Set<EvidenceMode>; options: JsonRecord[] }
  >()

  for (const mode of modes) {
    const source =
      mode === "analyst" && analystOptions.length > 0
        ? "analystOptions"
        : "options"
    const effectiveOptions =
      source === "analystOptions" ? analystOptions : options
    if (effectiveOptions.length === 0) continue
    const existing = bySource.get(source) ?? {
      modes: new Set<EvidenceMode>(),
      options: effectiveOptions,
    }
    existing.modes.add(mode)
    bySource.set(source, existing)
  }

  return [...bySource.entries()]
    .sort(([left], [right]) => compareText(left, right))
    .map(([source, value]) => ({
      source,
      effectiveModes: sortModes([...value.modes]),
      options: value.options,
    }))
}

function buildShares(
  items: readonly EvidenceCoverageRecord[],
): InstrumentEvidenceAnalysis["shares"] {
  const reverseEligible = items.filter((item) => item.reverse !== null)
  const reverseScoredEligible = reverseEligible.filter((item) => item.scored)
  const reversePrimaryScoredEligible = reverseEligible.filter(
    (item) => item.primaryScored,
  )
  const byMode: Record<string, ShareSummary> = {}
  const byAxis: Record<string, ShareSummary> = {}
  const scoredByMode: Record<string, ShareSummary> = {}
  const primaryScoredByMode: Record<string, ShareSummary> = {}
  const scoredByAxis: Record<string, ShareSummary> = {}

  for (const mode of ["standard", "analyst"] as const) {
    const modeItems = items.filter((item) => item.modes.includes(mode))
    const modeReverseItems = modeItems.filter((item) => item.reverse !== null)
    byMode[mode] = share(
      modeReverseItems.filter((item) => item.reverse === true).length,
      modeReverseItems.length,
    )
    scoredByMode[mode] = share(
      modeItems.filter((item) => item.scored).length,
      modeItems.length,
    )
    primaryScoredByMode[mode] = share(
      modeItems.filter((item) => item.primaryScored).length,
      modeItems.length,
    )
  }

  const axes = uniqueSorted(items.flatMap((item) => item.assignedAxes))
  for (const axis of axes) {
    const axisItems = items.filter((item) => item.assignedAxes.includes(axis))
    const reverseAxisItems = axisItems.filter((item) => item.reverse !== null)
    byAxis[axis] = share(
      reverseAxisItems.filter((item) => item.reverse === true).length,
      reverseAxisItems.length,
    )
    scoredByAxis[axis] = share(
      axisItems.filter((item) => item.scored).length,
      axisItems.length,
    )
  }

  return {
    reverseCodedAll: share(
      reverseEligible.filter((item) => item.reverse === true).length,
      reverseEligible.length,
    ),
    reverseCodedScored: share(
      reverseScoredEligible.filter((item) => item.reverse === true).length,
      reverseScoredEligible.length,
    ),
    reverseCodedPrimaryScored: share(
      reversePrimaryScoredEligible.filter((item) => item.reverse === true)
        .length,
      reversePrimaryScoredEligible.length,
    ),
    scoredItems: share(
      items.filter((item) => item.scored).length,
      items.length,
    ),
    primaryScoredItems: share(
      items.filter((item) => item.primaryScored).length,
      items.length,
    ),
    reverseCodedByMode: byMode,
    reverseCodedByAxis: byAxis,
    scoredItemsByMode: scoredByMode,
    scoredItemsByAxis: scoredByAxis,
    primaryScoredItemsByMode: primaryScoredByMode,
  }
}

function buildOptionTextLocations(
  descriptor: LoadedEvidenceBankDescriptor,
  item: JsonRecord,
): EvidenceOptionTextLocation[] {
  const modes = getItemModes(descriptor, item)
  return getEffectiveOptionSets(item, modes).flatMap((set) =>
    set.options.map((option) => {
      const text = optionDisplayText(option)
      const normalizedText = normalizeOptionText(text)
      const words = tokenize(text)
      return {
        descriptorKey: descriptor.key,
        generation: descriptor.generation,
        instrument: descriptor.instrument,
        itemId: String(item.id),
        source: set.source,
        effectiveModes: set.effectiveModes,
        optionId: String(option.id),
        text,
        normalizedText,
        wordCount: words.length,
        characterCount: [...text].length,
        modalVerbs: findLexiconMatches(words, MODAL_VERB_LEXICON),
        absolutistTerms: findLexiconMatches(words, ABSOLUTISM_LEXICON),
      }
    }),
  )
}

function buildOptionAsymmetry(
  items: readonly JsonRecord[],
  descriptor: LoadedEvidenceBankDescriptor,
): EvidenceOptionAsymmetry[] {
  return items.flatMap((item) => {
    const locations = buildOptionTextLocations(descriptor, item)
    const grouped = new Map<string, EvidenceOptionTextLocation[]>()
    for (const location of locations) {
      const key = location.source
      const existing = grouped.get(key) ?? []
      existing.push(location)
      grouped.set(key, existing)
    }

    return [...grouped.entries()]
      .sort(([left], [right]) => compareText(left, right))
      .map(([source, entries]) => {
        const options = entries.map((entry) => ({
          optionId: entry.optionId,
          wordCount: entry.wordCount,
          characterCount: entry.characterCount,
          modalVerbCount: entry.modalVerbs.length,
          absolutismCount: entry.absolutistTerms.length,
        }))
        return {
          itemId: String(item.id),
          source: source as EvidenceOptionAsymmetry["source"],
          effectiveModes: entries[0]?.effectiveModes ?? [],
          options,
          wordCount: numericSpread(options.map((option) => option.wordCount)),
          characterCount: numericSpread(
            options.map((option) => option.characterCount),
          ),
          modalVerbCount: numericSpread(
            options.map((option) => option.modalVerbCount),
          ),
          absolutismCount: numericSpread(
            options.map((option) => option.absolutismCount),
          ),
        }
      })
  })
}

function buildAxisSeparation(
  items: readonly JsonRecord[],
  descriptor: LoadedEvidenceBankDescriptor,
): InstrumentEvidenceAnalysis["axisSeparation"] {
  const results = items.map((item): EvidenceAxisSeparation => {
    const declaredAxes = readStringArray(item.discriminatingAxes)
    if (!descriptor.supportsDiscriminatingAxes) {
      return {
        itemId: String(item.id),
        kind: String(item.kind),
        status:
          descriptor.generation === "legacy" &&
          ["security", "technology", "ai-governance"].includes(
            descriptor.instrument,
          )
            ? "legacy-not-declared"
            : "not-applicable",
        declaredAxes,
        allDeclaredAxesPassMidpointRangeGate: null,
        optionSets: [],
      }
    }

    if (item.kind === "likert") {
      const directAxis = typeof item.axis === "string" ? item.axis : null
      const passes =
        directAxis !== null &&
        declaredAxes.length === 1 &&
        declaredAxes[0] === directAxis
      return {
        itemId: String(item.id),
        kind: String(item.kind),
        status: "direct-likert-scale",
        declaredAxes,
        allDeclaredAxesPassMidpointRangeGate: passes,
        optionSets: [],
      }
    }

    const policy = descriptor.separationPolicy
    if (!policy) {
      return {
        itemId: String(item.id),
        kind: String(item.kind),
        status: "not-applicable",
        declaredAxes,
        allDeclaredAxesPassMidpointRangeGate: null,
        optionSets: [],
      }
    }

    const optionSets = getEffectiveOptionSets(
      item,
      getItemModes(descriptor, item),
    ).map((set) => ({
      source: set.source,
      effectiveModes: set.effectiveModes,
      duplicateCompleteOptionVectors: findDuplicateCompleteOptionVectors(
        set.options,
        descriptor.axes,
        policy.midpoint,
      ),
      axes: declaredAxes.map((axis) => {
        const geometry = analyzeDeclaredAxisOptionGeometry(
          set.options,
          axis,
          policy.midpoint,
        )
        const evaluation = evaluateDeclaredAxis(
          geometry.signalValues,
          policy.midpoint,
          policy.minimumSpread,
        )
        return {
          axis,
          ...evaluation,
          optionCount: geometry.optionCount,
          distinctSignalValueCount: geometry.distinctSignalValueCount,
          nonMidpointOptionCount: geometry.nonMidpointOptionCount,
          missingSignalCount: geometry.missingSignalCount,
          duplicateSignalValueCount: geometry.duplicateSignalValueCount,
          soleMinimum: geometry.soleMinimum,
          soleMaximum: geometry.soleMaximum,
          passesMidpointRangeGate: evaluation.passes,
        }
      }),
    }))
    const passes =
      declaredAxes.length > 0 &&
      optionSets.length > 0 &&
      optionSets.every((set) =>
        set.axes.every((axis) => axis.passesMidpointRangeGate),
      )

    return {
      itemId: String(item.id),
      kind: String(item.kind),
      status: "reviewed-option-signals",
      declaredAxes,
      allDeclaredAxesPassMidpointRangeGate: passes,
      optionSets,
    }
  })

  return {
    policy: descriptor.separationPolicy,
    items: results,
    itemsFailingMidpointRangeGate: results
      .filter(
        (result) => result.allDeclaredAxesPassMidpointRangeGate === false,
      )
      .map((result) => result.itemId)
      .sort(compareText),
  }
}

export type EvidenceDeclaredAxisOptionGeometry = {
  signalValues: number[]
  optionCount: number
  distinctSignalValueCount: number
  nonMidpointOptionCount: number
  missingSignalCount: number
  duplicateSignalValueCount: number
  soleMinimum: boolean
  soleMaximum: boolean
}

/**
 * Describe authored option geometry without adding a new measurement gate.
 * Missing values use the policy midpoint, matching evaluateDeclaredAxis.
 */
export function analyzeDeclaredAxisOptionGeometry(
  options: readonly { signals?: unknown }[],
  axis: string,
  midpoint: number,
): EvidenceDeclaredAxisOptionGeometry {
  let missingSignalCount = 0
  const signalValues = options.map((option) => {
    const signal = isRecord(option.signals)
      ? option.signals[axis]
      : undefined
    if (typeof signal !== "number" || !Number.isFinite(signal)) {
      missingSignalCount += 1
      return midpoint
    }
    return signal
  })
  const distinctSignalValueCount = new Set(signalValues).size
  const minimum =
    signalValues.length > 0 ? Math.min(...signalValues) : midpoint
  const maximum =
    signalValues.length > 0 ? Math.max(...signalValues) : midpoint

  return {
    signalValues,
    optionCount: options.length,
    distinctSignalValueCount,
    nonMidpointOptionCount: signalValues.filter(
      (value) => value !== midpoint,
    ).length,
    missingSignalCount,
    duplicateSignalValueCount:
      signalValues.length - distinctSignalValueCount,
    soleMinimum:
      signalValues.length > 0 &&
      signalValues.filter((value) => value === minimum).length === 1,
    soleMaximum:
      signalValues.length > 0 &&
      signalValues.filter((value) => value === maximum).length === 1,
  }
}

/**
 * Find semantically duplicate complete vectors across the instrument axis
 * universe. Missing components use the policy midpoint.
 */
export function findDuplicateCompleteOptionVectors(
  options: readonly { id?: unknown; signals?: unknown }[],
  axes: readonly string[],
  midpoint: number,
): EvidenceDuplicateOptionVector[] {
  const sortedAxes = [...new Set(axes)].sort(compareText)
  const groups = new Map<
    string,
    { optionIds: string[]; signals: Record<string, number> }
  >()

  for (const option of options) {
    const authoredSignals = isRecord(option.signals)
      ? option.signals
      : {}
    const signals = Object.fromEntries(
      sortedAxes.map((axis) => {
        const value = authoredSignals[axis]
        return [
          axis,
          typeof value === "number" && Number.isFinite(value)
            ? value
            : midpoint,
        ]
      }),
    )
    const key = JSON.stringify(signals)
    const group = groups.get(key) ?? { optionIds: [], signals }
    group.optionIds.push(String(option.id))
    groups.set(key, group)
  }

  return [...groups.values()]
    .filter((group) => group.optionIds.length > 1)
    .map((group) => ({
      optionIds: [...group.optionIds].sort(compareText),
      signals: group.signals,
    }))
    .sort((left, right) =>
      compareText(left.optionIds.join("\u0000"), right.optionIds.join("\u0000")),
    )
}

function buildMetadataGaps(
  items: readonly EvidenceCoverageRecord[],
  descriptor: LoadedEvidenceBankDescriptor,
): InstrumentEvidenceAnalysis["metadataGaps"] {
  const gaps = [
    {
      field: "actorRole",
      undeclaredItems: items.filter(
        (item) => item.actorRoleSource === "undeclared",
      ).length,
      totalItems: items.length,
      note:
        "Uses explicit actorRole where present, then the repository's declared perspective-tag role matrix; never inferred from prose.",
    },
    {
      field: "theater",
      undeclaredItems: items.filter((item) => item.theater === "undeclared")
        .length,
      totalItems: items.length,
      note: "No theater is inferred from prompts, titles, scenes, or item IDs.",
    },
    {
      field: "perspectiveTags",
      undeclaredItems: items.filter(
        (item) => item.perspectiveTags.length === 0,
      ).length,
      totalItems: items.length,
      note: "Counts only declared perspectiveTags/tags.",
    },
    {
      field: "knowledgeLoad",
      undeclaredItems: items.filter(
        (item) => item.knowledgeLoad === "undeclared",
      ).length,
      totalItems: items.length,
      note: "Counts only declared knowledgeLoad.",
    },
  ]

  if (
    descriptor.generation === "legacy" &&
    descriptor.instrument === "foundation"
  ) {
    gaps.push(
      {
        field: "modes",
        undeclaredItems: items.length,
        totalItems: items.length,
        note:
          "The scoring-only snapshot declares no modes; reported mode membership follows the frozen v1 runtime's item-ID contract.",
      },
      {
        field: "itemAndOptionCopy",
        undeclaredItems: items.length,
        totalItems: items.length,
        note:
          "The scoring-only snapshot preserves IDs, reverse flags, and signals but no item or option display copy.",
      },
    )
  }

  if (
    descriptor.generation === "legacy" &&
    ["security", "technology", "ai-governance"].includes(descriptor.instrument)
  ) {
    gaps.push({
      field: "discriminatingAxes",
      undeclaredItems: items.filter(
        (item) => item.declaredDiscriminatingAxes.length === 0,
      ).length,
      totalItems: items.length,
      note:
        "The immutable V21 bank predates declared discriminating axes; signal axes remain separately reported.",
    })
  }

  return gaps.filter((gap) => gap.undeclaredItems > 0)
}

function concentration(
  items: readonly EvidenceCoverageRecord[],
  categories: (item: EvidenceCoverageRecord) => readonly string[],
): EvidenceConcentration {
  const normalizedCategories = items.flatMap((item) => {
    const values = uniqueSorted(categories(item))
    return values.length > 0 ? values : ["undeclared"]
  })
  const counts = countMulti(normalizedCategories)
  const leaderItemCount = Math.max(0, ...Object.values(counts))
  const leaders = Object.entries(counts)
    .filter(([, count]) => count === leaderItemCount)
    .map(([key]) => key)
    .sort(compareText)

  return {
    denominatorItems: items.length,
    counts,
    leaders,
    leaderItemCount,
    leaderShareOfItems:
      items.length > 0 ? round(leaderItemCount / items.length) : null,
    undeclaredItems: items.filter((item) => {
      const values = categories(item)
      return values.length === 0 || values.includes("undeclared")
    }).length,
  }
}

function concentrationsByMode(
  items: readonly EvidenceCoverageRecord[],
  categories: (item: EvidenceCoverageRecord) => readonly string[],
) {
  return Object.fromEntries(
    (["standard", "analyst"] as const).map((mode) => [
      mode,
      concentration(
        items.filter((item) => item.modes.includes(mode)),
        categories,
      ),
    ]),
  )
}

function findTextReuse(
  locations: readonly EvidenceOptionTextLocation[],
): EvidenceTextReuse {
  const sortedLocations = [...locations].sort(compareLocations)
  const exactGroups = new Map<string, EvidenceOptionTextLocation[]>()
  for (const location of sortedLocations) {
    if (!location.normalizedText) continue
    const group = exactGroups.get(location.normalizedText) ?? []
    group.push(location)
    exactGroups.set(location.normalizedText, group)
  }

  const exact = [...exactGroups.entries()]
    .filter(([, group]) => group.length > 1)
    .sort(([left], [right]) => compareText(left, right))
    .map(([normalizedText, group]) => ({
      normalizedText,
      locations: group,
    }))

  const near: EvidenceTextReuse["near"] = []
  for (let leftIndex = 0; leftIndex < sortedLocations.length; leftIndex += 1) {
    const left = sortedLocations[leftIndex]
    if (left.wordCount < NEAR_DUPLICATE_MINIMUM_WORDS) continue
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < sortedLocations.length;
      rightIndex += 1
    ) {
      const right = sortedLocations[rightIndex]
      if (right.wordCount < NEAR_DUPLICATE_MINIMUM_WORDS) continue
      if (left.normalizedText === right.normalizedText) continue
      const similarity = optionTextSimilarity(
        left.normalizedText,
        right.normalizedText,
      )
      if (similarity + Number.EPSILON < NEAR_DUPLICATE_SIMILARITY) continue
      near.push({
        similarity: round(similarity),
        left,
        right,
      })
    }
  }
  near.sort(
    (left, right) =>
      right.similarity - left.similarity ||
      compareLocations(left.left, right.left) ||
      compareLocations(left.right, right.right),
  )

  return {
    exact,
    near,
    method: {
      exactNormalization:
        "Unicode lowercase, apostrophe normalization, non-letter/non-number removal, collapsed whitespace.",
      nearSimilarity:
        "Mean of token-set Dice similarity and normalized character edit similarity; exact matches are reported separately.",
      nearThreshold: NEAR_DUPLICATE_SIMILARITY,
      minimumWords: NEAR_DUPLICATE_MINIMUM_WORDS,
      classification: "advisory",
    },
  }
}

function optionTextSimilarity(left: string, right: string): number {
  const tokenSimilarity = diceSet(tokenize(left), tokenize(right))
  const maximumLength = Math.max([...left].length, [...right].length)
  const editSimilarity =
    maximumLength === 0
      ? 1
      : 1 - levenshtein([...left], [...right]) / maximumLength
  return (tokenSimilarity + editSimilarity) / 2
}

function diceSet(leftValues: readonly string[], rightValues: readonly string[]) {
  const left = new Set(leftValues)
  const right = new Set(rightValues)
  if (left.size === 0 && right.size === 0) return 1
  let intersection = 0
  for (const value of left) {
    if (right.has(value)) intersection += 1
  }
  return (2 * intersection) / (left.size + right.size)
}

function levenshtein(left: readonly string[], right: readonly string[]) {
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index)
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex]
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] +
          (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1),
      )
    }
    previous = current
  }
  return previous[right.length]
}

function optionDisplayText(option: JsonRecord) {
  const title = typeof option.title === "string" ? option.title.trim() : ""
  const label = typeof option.label === "string" ? option.label.trim() : ""
  return [title, label]
    .filter((value, index, values) => value && values.indexOf(value) === index)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
}

function normalizeOptionText(text: string) {
  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[^\p{L}\p{N}']+/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function tokenize(text: string) {
  return (
    text
      .normalize("NFKC")
      .toLowerCase()
      .match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) ?? []
  ).map((word) => word.replace("’", "'"))
}

function findLexiconMatches(
  words: readonly string[],
  lexicon: readonly string[],
) {
  const matches: string[] = []
  for (const entry of lexicon) {
    const entryWords = entry.split(" ")
    for (let index = 0; index <= words.length - entryWords.length; index += 1) {
      if (
        entryWords.every(
          (word, offset) => words[index + offset] === word,
        )
      ) {
        matches.push(entry)
      }
    }
  }
  return matches.sort(compareText)
}

function numericSpread(values: readonly number[]): NumericSpread {
  if (values.length === 0) {
    return { minimum: 0, maximum: 0, mean: 0, spread: 0 }
  }
  const minimum = Math.min(...values)
  const maximum = Math.max(...values)
  return {
    minimum,
    maximum,
    mean: round(values.reduce((sum, value) => sum + value, 0) / values.length),
    spread: maximum - minimum,
  }
}

function share(numerator: number, denominator: number): ShareSummary {
  return {
    numerator,
    denominator,
    share: denominator > 0 ? round(numerator / denominator) : null,
  }
}

function countMulti(values: readonly string[]): CountSummary {
  const counts = new Map<string, number>()
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }
  return Object.fromEntries(
    [...counts.entries()].sort(([left], [right]) => compareText(left, right)),
  )
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter(
        (entry): entry is string =>
          typeof entry === "string" && entry.length > 0,
      )
    : []
}

function readRecordArray(value: unknown): JsonRecord[] {
  return Array.isArray(value) ? value.filter(isRecord) : []
}

function validateModes(value: unknown, path: string, problems: string[]) {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    value.some((mode) => mode !== "standard" && mode !== "analyst") ||
    new Set(value).size !== value.length
  ) {
    problems.push(
      `${path} must be a non-empty unique array of "standard"/"analyst".`,
    )
  }
}

function rejectUnsupportedFields(
  value: JsonRecord,
  allowedFields: readonly string[],
  path: string,
  problems: string[],
) {
  const allowed = new Set(allowedFields)
  for (const key of Object.keys(value).sort(compareText)) {
    if (!allowed.has(key)) {
      problems.push(`${path}.${key} is not supported.`)
    }
  }
}

function uniqueSorted(values: readonly string[]) {
  return [...new Set(values)].sort(compareText)
}

function sortModes(modes: readonly EvidenceMode[]) {
  return [...modes].sort(
    (left, right) =>
      (left === "standard" ? 0 : 1) - (right === "standard" ? 0 : 1),
  )
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function compareText(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0
}

function compareLocations(
  left: EvidenceOptionTextLocation,
  right: EvidenceOptionTextLocation,
) {
  return (
    compareText(left.descriptorKey, right.descriptorKey) ||
    compareText(left.itemId, right.itemId) ||
    compareText(left.source, right.source) ||
    compareText(left.optionId, right.optionId)
  )
}

function round(value: number) {
  return Number(value.toFixed(6))
}
