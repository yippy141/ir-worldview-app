import {
  FOUNDATION_INSTRUMENT_VERSION,
  FOUNDATION_STRUCTURAL_VERSION,
  getFoundationResultQuestions,
} from "@/lib/quiz-schema"
import {
  FOUNDATION_SCORING_VERSION,
  buildCanonicalFoundationResult,
  foundationScoringCalibrationForForm,
  generateResult,
} from "@/lib/scoring"
import {
  buildFoundationSharePayload,
  encodePayload,
} from "@/lib/share"
import {
  persistFoundationLocalEvidence,
} from "@/lib/results/local-evidence"
import {
  FOUNDATION_LOCAL_EVIDENCE_HANDOFF_KEY,
  FOUNDATION_LOCAL_EVIDENCE_STORAGE_KEY,
} from "@/lib/storage-keys"
import type {
  Answers,
  DimensionScores,
  FamilyKey,
  FoundationQuestionSet,
  Question,
} from "@/lib/types"
import type { Locale } from "@/i18n/routing"

const LOW_DIFFERENTIATION_SCORES: DimensionScores = {
  securityCompetition: 4,
  institutions: 4,
  domesticFilters: 4,
  normsIdentity: 4,
  politicalEconomy: 4,
  restraint: 4,
  orderJustice: 4,
}

const BLEND_SCORES: DimensionScores = {
  securityCompetition: 1,
  institutions: 1,
  domesticFilters: 4,
  normsIdentity: 4,
  politicalEconomy: 4,
  restraint: 4,
  orderJustice: 4,
}

const CLEAR_PURE_SCORES: DimensionScores = {
  securityCompetition: 6.48,
  institutions: 2.16,
  domesticFilters: 4,
  normsIdentity: 2.9,
  politicalEconomy: 4.27,
  restraint: 2.5,
  orderJustice: 3.17,
}

export type FoundationFixtureSet = {
  lowDifferentiationCore: string
  clearerPureCore: string
  blendCore: string
  targetedExtended: string
  fullExtended: string
  legacy: string
  chineseCore: string
}

export function buildFoundationFixtureSet(): FoundationFixtureSet {
  return {
    lowDifferentiationCore: buildCurrentPayload({
      scores: LOW_DIFFERENTIATION_SCORES,
      questionSet: "core",
    }),
    clearerPureCore: buildCurrentPayload({
      scores: CLEAR_PURE_SCORES,
      questionSet: "core",
    }),
    blendCore: buildCurrentPayload({
      scores: BLEND_SCORES,
      questionSet: "core",
    }),
    targetedExtended: buildCurrentPayload({
      scores: CLEAR_PURE_SCORES,
      questionSet: "targetedExtended",
      targetedFamilyPair: ["realist", "institutionalist"],
    }),
    fullExtended: buildCurrentPayload({
      scores: CLEAR_PURE_SCORES,
      questionSet: "fullExtended",
    }),
    legacy: encodePayload({
      v: 2,
      ds: [6.48, 2.16, 4, 2.9, 4.27, 2.5, 3.17],
      fk: "realist",
      nk: "criticalPoliticalEconomy",
      sm: "Maximizer",
      nm: "Pluralist",
    }),
    chineseCore: buildCurrentPayload({
      scores: LOW_DIFFERENTIATION_SCORES,
      questionSet: "core",
      locale: "zh-Hans",
    }),
  }
}

export type LocalEvidenceBrowserFixture = {
  payload: string
  localEvidenceJson: string
  handoffJson: string
  localCompletionId: string
}

export async function buildLocalEvidenceBrowserFixture(
  localCompletionId = "v23-6-release-evidence",
): Promise<LocalEvidenceBrowserFixture> {
  const questionSet = "core" as const
  const calibration = foundationScoringCalibrationForForm(questionSet)
  if (!calibration) throw new Error("The registered core calibration is unavailable.")

  const questions = getFoundationResultQuestions(questionSet)
  const answers = Object.fromEntries(
    questions.map((question, index) => [
      question.id,
      deterministicAnswer(question, index),
    ]),
  ) satisfies Answers
  const result = generateResult(answers, "analyst", calibration)
  const payload = encodePayload(
    buildFoundationSharePayload(result, "en", questionSet),
  )
  const localStorage = new MemoryStorage()
  const sessionStorage = new MemoryStorage()

  await persistFoundationLocalEvidence({
    storage: localStorage,
    sessionStorage,
    payload,
    answers,
    completionLocale: "en",
    questionSet,
    mode: "analyst",
    scoringCalibration: calibration,
    localCompletionId,
    now: 1_750_000_000_000,
  })

  const localEvidenceJson = localStorage.getItem(
    FOUNDATION_LOCAL_EVIDENCE_STORAGE_KEY,
  )
  const handoffJson = sessionStorage.getItem(
    FOUNDATION_LOCAL_EVIDENCE_HANDOFF_KEY,
  )
  if (!localEvidenceJson || !handoffJson) {
    throw new Error("The local-evidence fixture did not persist its browser records.")
  }

  return {
    payload,
    localEvidenceJson,
    handoffJson,
    localCompletionId,
  }
}

export const foundationContractVersions = {
  instrumentStructuralVersion: FOUNDATION_STRUCTURAL_VERSION,
  bankVersion: FOUNDATION_INSTRUMENT_VERSION,
  scorerVersion: FOUNDATION_SCORING_VERSION,
} as const

function buildCurrentPayload({
  scores,
  questionSet,
  targetedFamilyPair,
  locale = "en",
}: {
  scores: DimensionScores
  questionSet: FoundationQuestionSet
  targetedFamilyPair?: readonly [FamilyKey, FamilyKey]
  locale?: Locale
}) {
  const calibration = foundationScoringCalibrationForForm(
    questionSet,
    targetedFamilyPair,
  )
  if (!calibration) {
    throw new Error(`No registered calibration is available for ${questionSet}.`)
  }
  const result = buildCanonicalFoundationResult(scores, calibration)
  return encodePayload(
    buildFoundationSharePayload(
      result,
      locale,
      questionSet,
      targetedFamilyPair,
    ),
  )
}

function deterministicAnswer(question: Question, index: number) {
  if (question.kind === "likert") {
    return ((index * 3) % 7) + 1
  }
  if (question.allowSecondChoiceInAnalyst && question.options.length > 1) {
    return {
      primary: question.options[index % question.options.length].id,
      secondary: question.options[(index + 1) % question.options.length].id,
    }
  }
  return question.options[index % question.options.length].id
}

class MemoryStorage {
  private readonly values = new Map<string, string>()

  getItem(key: string) {
    return this.values.get(key) ?? null
  }

  setItem(key: string, value: string) {
    this.values.set(key, value)
  }

  removeItem(key: string) {
    this.values.delete(key)
  }
}
