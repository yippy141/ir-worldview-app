import type {
  Answers,
  FamilyKey,
  FoundationQuestionSet,
  FoundationTier,
  Question,
  QuizMode,
} from "@/lib/types"
import foundationBankJson from "@/content/instrument/foundation.v2.json" with {
  type: "json",
}

type FoundationDataItem = Question & { modes: QuizMode[] }
type FoundationDiscriminatorTable = Record<string, string[]>

const foundationDataItems =
  foundationBankJson.items as unknown as FoundationDataItem[]
const discriminatorTable =
  foundationBankJson.discriminators as FoundationDiscriminatorTable

export const FOUNDATION_INSTRUMENT_VERSION =
  foundationBankJson.instrumentVersion

const dimensionOrder = [
  "securityCompetition",
  "institutions",
  "domesticFilters",
  "normsIdentity",
  "politicalEconomy",
  "restraint",
  "orderJustice",
] as const

const familyOrder: FamilyKey[] = [
  "realist",
  "institutionalist",
  "constructivist",
  "criticalPoliticalEconomy",
]

function loadFoundationItems(
  include: (modes: QuizMode[]) => boolean,
): Question[] {
  return foundationDataItems.filter((item) => include(item.modes)).map((item) => {
    const { modes, ...question } = item
    void modes
    return question
  })
}

export const standardQuestions: Question[] = loadFoundationItems((modes) =>
  modes.includes("standard"),
)

export const analystQuestions: Question[] = loadFoundationItems(
  (modes) => modes.includes("analyst") && !modes.includes("standard"),
)

export const SCHEMA_VERSION = 4
export const FOUNDATION_STRUCTURAL_VERSION = SCHEMA_VERSION

export const dimensionLabels = {
  securityCompetition: "Security rivalry",
  institutions: "Institutions and rules",
  domesticFilters: "Domestic politics",
  normsIdentity: "Identity and legitimacy",
  politicalEconomy: "Markets and dependence",
  restraint: "Restraint and advantage",
  orderJustice: "Order and justice",
} as const

export function getFoundationQuestions(mode: QuizMode): Question[] {
  return mode === "analyst"
    ? [...standardQuestions, ...analystQuestions]
    : standardQuestions
}

export const foundationCoreQuestions: Question[] = foundationDataItems
  .filter((item) => item.tier === "core")
  .sort((left, right) => {
    if (
      left.kind !== "likert" ||
      right.kind !== "likert" ||
      left.scoringBlock !== "core" ||
      right.scoringBlock !== "core"
    ) {
      return 0
    }

    const dimensionDelta =
      dimensionOrder.indexOf(left.dimension) -
      dimensionOrder.indexOf(right.dimension)
    return dimensionDelta || Number(left.reverse) - Number(right.reverse)
  })
  .map(stripModes)

export const foundationExtendedQuestions: Question[] = foundationDataItems
  .filter((item) => item.tier === "extended")
  .map(stripModes)

export function getFoundationQuestionsByTier(tier: FoundationTier): Question[] {
  return tier === "core"
    ? foundationCoreQuestions
    : foundationExtendedQuestions
}

export function getFoundationDiscriminatorIds(
  left: FamilyKey,
  right: FamilyKey,
): string[] {
  if (left === right) return []
  return [...(discriminatorTable[foundationFamilyPairKey(left, right)] ?? [])]
}

export function getFoundationQuestionsForSet(
  questionSet: FoundationQuestionSet,
  targetedFamilyPair?: readonly [FamilyKey, FamilyKey],
): Question[] {
  if (questionSet === "core") {
    return foundationCoreQuestions
  }

  if (questionSet === "fullExtended") {
    return foundationExtendedQuestions
  }

  if (!targetedFamilyPair) {
    return []
  }

  const byId = new Map(
    foundationExtendedQuestions.map((question) => [question.id, question]),
  )
  return getFoundationDiscriminatorIds(...targetedFamilyPair)
    .map((id) => byId.get(id))
    .filter((question): question is Question => Boolean(question))
}

/**
 * Returns the exact item form that contributes to a result. The quiz UI shows
 * only the current extension after core completion, while scoring must include
 * the completed core plus that extension and must exclude stale answers from
 * any other form.
 */
export function getFoundationResultQuestions(
  questionSet: FoundationQuestionSet,
  targetedFamilyPair?: readonly [FamilyKey, FamilyKey],
): Question[] {
  if (questionSet === "core") {
    return foundationCoreQuestions
  }

  return [
    ...foundationCoreQuestions,
    ...getFoundationQuestionsForSet(questionSet, targetedFamilyPair),
  ]
}

export function selectFoundationAnswersForSet(
  answers: Answers,
  questionSet: FoundationQuestionSet,
  targetedFamilyPair?: readonly [FamilyKey, FamilyKey],
): Answers {
  const allowedIds = new Set(
    getFoundationResultQuestions(questionSet, targetedFamilyPair).map(
      (question) => question.id,
    ),
  )

  return Object.fromEntries(
    Object.entries(answers).filter(([questionId]) => allowedIds.has(questionId)),
  )
}

export function foundationFamilyPairKey(
  left: FamilyKey,
  right: FamilyKey,
): string {
  const ordered = [left, right].sort(
    (a, b) => familyOrder.indexOf(a) - familyOrder.indexOf(b),
  )
  return `${ordered[0]}|${ordered[1]}`
}

export function isFoundationFamilyKey(value: string | null): value is FamilyKey {
  return familyOrder.includes(value as FamilyKey)
}

export const questionCountsByMode = {
  standard: standardQuestions.length,
  analyst: standardQuestions.length + analystQuestions.length,
} as const

export const questionCountsBySet = {
  core: foundationCoreQuestions.length,
  targetedExtended: Math.max(
    0,
    ...Object.values(discriminatorTable).map((ids) => ids.length),
  ),
  fullExtended: foundationExtendedQuestions.length,
} as const

export const likertScale = [1, 2, 3, 4, 5, 6, 7] as const

// ── Foundation Standard sections (V14 friction reduction) ────────────────────
// Section markers shown to the user during the Standard quiz flow. Each entry
// lists the question IDs in display order — the standardQuestions array above
// is ordered to match these section boundaries.

export type FoundationSection = {
  index: number
  title: string
  questionIds: string[]
}

export const foundationStandardSections: FoundationSection[] = [
  {
    index: 1,
    title: "Your IR baseline",
    questionIds: [
      "sc1",
      "in1",
      "val_mi_1",
      "df1",
      "ni1",
      "val_ci_1",
      "pe1",
      "rs1",
      "val_iso_1",
      "oj1",
    ],
  },
  {
    index: 2,
    title: "Alliances and interdependence",
    questionIds: [
      "tradeoff_alliances",
      "val_mi_2",
      "sc2",
      "val_ci_2",
      "in2",
      "val_iso_2",
      "tradeoff_interdependence",
    ],
  },
  {
    index: 3,
    title: "Domestic politics and identity",
    questionIds: [
      "df2",
      "val_mi_3",
      "ni2",
      "val_ci_3",
      "pe2",
      "val_iso_3",
    ],
  },
  {
    index: 4,
    title: "Strategy and values",
    questionIds: [
      "rs2",
      "val_mi_4",
      "oj2",
      "val_ci_4",
      "tradeoff_strategy",
      "val_iso_4",
      "tradeoff_intervention",
    ],
  },
  {
    index: 5,
    title: "Applied cases",
    questionIds: ["case_semiconductors", "case_protection"],
  },
]

export const foundationSectionTotal = foundationStandardSections.length

export function getFoundationSectionForQuestionId(
  questionId: string,
): FoundationSection | undefined {
  return foundationStandardSections.find((section) =>
    section.questionIds.includes(questionId),
  )
}

// Index (0-based) of the last question in section 1 — used to trigger the
// midpoint preview interstitial after the user finishes the IR baseline block.
export const foundationMidpointQuestionIndex =
  foundationStandardSections[0].questionIds.length - 1

function stripModes(item: FoundationDataItem): Question {
  const { modes, ...question } = item
  void modes
  return question
}
