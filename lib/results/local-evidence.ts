import { resolveArchetype } from "@/lib/archetypes"
import { completionProvenance } from "@/lib/locale-provenance"
import {
  FOUNDATION_INSTRUMENT_VERSION,
  FOUNDATION_STRUCTURAL_VERSION,
  dimensionLabels,
  getFoundationQuestions,
  getFoundationResultQuestions,
  selectFoundationAnswersForSet,
} from "@/lib/quiz-schema"
import {
  FOUNDATION_SCORING_VERSION,
  familyProfiles,
  generateResult,
  getV2ScoringCalibration,
  type CanonicalFoundationResult,
  type FoundationScoringCalibration,
} from "@/lib/scoring"
import { encodePayload, resolveFoundationPayload } from "@/lib/share"
import {
  FOUNDATION_LOCAL_EVIDENCE_HANDOFF_KEY,
  FOUNDATION_LOCAL_EVIDENCE_STORAGE_KEY,
} from "@/lib/storage-keys"
import { zhHansFoundationQuizUi, zhHansFoundationReviewUi } from "@/content/locales/zh-Hans/foundation-ui"
import { getZhHansFoundationQuestions } from "@/content/locales/zh-Hans/foundation-instrument"
import type { Locale } from "@/i18n/routing"
import type {
  Answers,
  AnswerValue,
  ChoiceOption,
  ChoiceQuestion,
  DimensionKey,
  FamilyKey,
  FoundationQuestionSet,
  NormativeModifier,
  Question,
  QuizMode,
  RankedChoiceAnswer,
  StrategyModifier,
} from "@/lib/types"

const STORE_VERSION = 1 as const
const MAX_EVIDENCE_RECORDS = 3
const MAX_STORED_COMPLETIONS = 32
const SCORING_MODE = "analyst" as const

const DIMENSIONS: DimensionKey[] = [
  "securityCompetition",
  "institutions",
  "domesticFilters",
  "normsIdentity",
  "politicalEconomy",
  "restraint",
  "orderJustice",
]

const ENGLISH_LIKERT_LABELS: Readonly<Record<number, string>> = {
  1: "Strongly disagree",
  2: "Disagree",
  3: "Somewhat disagree",
  4: "Neutral",
  5: "Somewhat agree",
  6: "Agree",
  7: "Strongly agree",
}

export type FoundationEvidenceAlternativeKind =
  | "actual-second-choice"
  | "model-selected-nearest-alternative"

export type FoundationLocalEvidenceRecord = Readonly<{
  itemId: string
  prompt: string
  selectedOptionId: string
  selectedTitle?: string
  selectedLabel: string
  alternative: Readonly<{
    kind: FoundationEvidenceAlternativeKind
    optionId: string
    title?: string
    label: string
  }>
  /**
   * Exact change in the live scorer's rounded primary-minus-runner-up
   * difference after substituting the comparison and holding all other
   * submitted answers fixed. This is stored for reconciliation, not printed
   * as a top-two gap.
   */
  contribution: Readonly<{
    primaryFamily: FamilyKey
    runnerUpFamily: FamilyKey
    effectOnRoundedFamilyDifference: number
    separatingDimension: DimensionKey
    separatingDimensionEffect: number
  }>
  explanation: string
}>

export type FoundationLocalEvidenceBinding = Readonly<{
  localCompletionId: string
  payloadDigest: string
  instrumentStructuralVersion: number
  bankVersion: number
  scorerVersion: number
  calibrationId: FoundationScoringCalibration
  copyVersion: number
  completionLocale: Locale
  questionSet: FoundationQuestionSet
  formId: string
  mode: QuizMode
  scoringMode: typeof SCORING_MODE
  resolvedFamily: FamilyKey
  resolvedRunnerUp: FamilyKey
  strategyModifier: StrategyModifier
  normativeModifier: NormativeModifier
  archetypeCode: string
}>

export type FoundationLocalEvidenceSet = Readonly<{
  v: typeof STORE_VERSION
  createdAt: number
  binding: FoundationLocalEvidenceBinding
  records: readonly FoundationLocalEvidenceRecord[]
}>

type FoundationLocalEvidenceStore = Readonly<{
  v: typeof STORE_VERSION
  completions: readonly FoundationLocalEvidenceSet[]
}>

export type FoundationEvidenceHandoff = Readonly<{
  v: typeof STORE_VERSION
  localCompletionId: string
  payloadDigest: string
  mode: QuizMode
}>

type ReadWriteStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">

export type PersistFoundationLocalEvidenceInput = Readonly<{
  storage: ReadWriteStorage
  sessionStorage: ReadWriteStorage
  payload: string
  answers: Answers
  completionLocale: Locale
  questionSet: FoundationQuestionSet
  targetedFamilyPair?: readonly [FamilyKey, FamilyKey]
  mode: QuizMode
  scoringCalibration: FoundationScoringCalibration
  localCompletionId?: string
  now?: number
}>

export type FoundationLocalEvidenceLookup =
  | Readonly<{ status: "available"; evidence: FoundationLocalEvidenceSet }>
  | Readonly<{
      status: "unavailable"
      reason:
        | "legacy"
        | "no-local-binding"
        | "deleted"
        | "tuple-mismatch"
        | "locale-mismatch"
        | "no-records"
    }>

type DisplayChoice = {
  id: string
  title?: string
  label: string
  answer: AnswerValue
}

type EvidenceCandidate = {
  record: FoundationLocalEvidenceRecord
  order: number
}

/** Hash the normalized payload contract, not the raw URL spelling. */
export async function foundationPayloadDigest(payload: string): Promise<string | null> {
  const resolved = resolveFoundationPayload(payload)
  if (!resolved) return null

  const canonicalPayload = encodePayload(resolved.payload)
  const subtle = globalThis.crypto?.subtle
  if (!subtle) {
    throw new Error("Web Crypto is required for local Foundation evidence.")
  }
  const digest = await subtle.digest(
    "SHA-256",
    new TextEncoder().encode(canonicalPayload),
  )
  return `sha256:${Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("")}`
}

/**
 * Derive and persist no more than three records from the exact completed form.
 * The raw answer set is used only during this call and is never serialized.
 */
export async function persistFoundationLocalEvidence(
  input: PersistFoundationLocalEvidenceInput,
): Promise<FoundationLocalEvidenceSet> {
  const resolvedPayload = resolveFoundationPayload(input.payload)
  if (!resolvedPayload || resolvedPayload.payload.v !== 5 || !resolvedPayload.questionSet) {
    throw new Error("Exact local evidence requires a current Foundation payload.")
  }

  const payloadDigest = await foundationPayloadDigest(input.payload)
  if (!payloadDigest) {
    throw new Error("Unable to digest the Foundation payload.")
  }

  const exactAnswers = selectFoundationAnswersForSet(
    input.answers,
    input.questionSet,
    input.targetedFamilyPair,
  )
  const exactQuestions = getFoundationResultQuestions(
    input.questionSet,
    input.targetedFamilyPair,
  )
  assertExactCompletedForm(exactAnswers, exactQuestions)

  const result = generateResult(exactAnswers, SCORING_MODE, input.scoringCalibration)
  assertPayloadMatchesGeneration(
    resolvedPayload,
    result,
    input.questionSet,
    input.targetedFamilyPair,
    input.scoringCalibration,
    input.completionLocale,
  )

  const calibration = getV2ScoringCalibration(input.scoringCalibration)
  const archetypeCode = resolveArchetype(
    result,
    calibration.lowDifferentiationThreshold,
  ).code
  const localCompletionId = input.localCompletionId ?? createLocalCompletionId()
  const localizedQuestions = localizedQuestionMap(input.completionLocale)

  const evidence: FoundationLocalEvidenceSet = {
    v: STORE_VERSION,
    createdAt: input.now ?? Date.now(),
    binding: {
      localCompletionId,
      payloadDigest,
      instrumentStructuralVersion: FOUNDATION_STRUCTURAL_VERSION,
      bankVersion: FOUNDATION_INSTRUMENT_VERSION,
      scorerVersion: FOUNDATION_SCORING_VERSION,
      calibrationId: input.scoringCalibration,
      copyVersion: completionProvenance("foundation", input.completionLocale).localeCopyVersion,
      completionLocale: input.completionLocale,
      questionSet: input.questionSet,
      formId: foundationFormId(input.questionSet, resolvedPayload.targetedFamilyPair),
      mode: input.mode,
      scoringMode: SCORING_MODE,
      resolvedFamily: result.familyKey,
      resolvedRunnerUp: result.runnerUpKey,
      strategyModifier: result.strategyModifier,
      normativeModifier: result.normativeModifier,
      archetypeCode,
    },
    records: deriveEvidenceRecords({
      answers: exactAnswers,
      questions: exactQuestions,
      localizedQuestions,
      result,
      calibrationId: input.scoringCalibration,
      locale: input.completionLocale,
    }),
  }

  writeEvidenceSet(input.storage, evidence)
  writeFoundationEvidenceHandoff(input.sessionStorage, {
    v: STORE_VERSION,
    localCompletionId,
    payloadDigest,
    mode: input.mode,
  })
  return evidence
}

export function writeFoundationEvidenceHandoff(
  storage: Pick<Storage, "setItem">,
  handoff: FoundationEvidenceHandoff,
) {
  storage.setItem(FOUNDATION_LOCAL_EVIDENCE_HANDOFF_KEY, JSON.stringify(handoff))
}

/** A handoff is consumed once so opening a shared URL later cannot reuse it. */
export function consumeFoundationEvidenceHandoff(
  storage: Pick<Storage, "getItem" | "removeItem">,
  expectedPayloadDigest: string,
): FoundationEvidenceHandoff | null {
  const raw = storage.getItem(FOUNDATION_LOCAL_EVIDENCE_HANDOFF_KEY)
  storage.removeItem(FOUNDATION_LOCAL_EVIDENCE_HANDOFF_KEY)
  if (!raw) return null

  try {
    const value = JSON.parse(raw) as unknown
    return isEvidenceHandoff(value) && value.payloadDigest === expectedPayloadDigest
      ? value
      : null
  } catch {
    return null
  }
}

export function lookupFoundationLocalEvidence(
  storage: Pick<Storage, "getItem">,
  payload: string,
  payloadDigest: string,
  handoff: FoundationEvidenceHandoff | null,
  expectedLocale?: Locale,
): FoundationLocalEvidenceLookup {
  const resolved = resolveFoundationPayload(payload)
  if (!resolved || resolved.payload.v !== 5 || !resolved.questionSet) {
    return { status: "unavailable", reason: "legacy" }
  }
  if (!handoff || handoff.payloadDigest !== payloadDigest) {
    return { status: "unavailable", reason: "no-local-binding" }
  }

  const store = readEvidenceStore(storage)
  const evidence = store.completions.find(
    (candidate) => candidate.binding.localCompletionId === handoff.localCompletionId,
  )
  if (!evidence) return { status: "unavailable", reason: "deleted" }
  if (
    expectedLocale &&
    evidence.binding.completionLocale !== expectedLocale
  ) {
    return { status: "unavailable", reason: "locale-mismatch" }
  }
  if (!evidenceBindingMatches(evidence.binding, resolved, payloadDigest, handoff.mode)) {
    return { status: "unavailable", reason: "tuple-mismatch" }
  }
  if (evidence.records.length === 0) {
    return { status: "unavailable", reason: "no-records" }
  }
  return { status: "available", evidence }
}

/** Delete one completion without touching another completion with the same payload. */
export function deleteFoundationLocalEvidence(
  storage: ReadWriteStorage,
  localCompletionId: string,
): boolean {
  const current = readEvidenceStore(storage)
  const completions = current.completions.filter(
    (candidate) => candidate.binding.localCompletionId !== localCompletionId,
  )
  if (completions.length === current.completions.length) return false
  writeEvidenceStore(storage, { v: STORE_VERSION, completions })
  return true
}

/** Delete all local completion records cryptographically bound to one payload. */
export async function deleteFoundationLocalEvidenceForPayload(
  storage: ReadWriteStorage,
  payload: string,
): Promise<number> {
  const payloadDigest = await foundationPayloadDigest(payload)
  return payloadDigest
    ? deleteFoundationLocalEvidenceForPayloadDigest(storage, payloadDigest)
    : 0
}

export function deleteFoundationLocalEvidenceForPayloadDigest(
  storage: ReadWriteStorage,
  payloadDigest: string,
): number {
  const current = readEvidenceStore(storage)
  const completions = current.completions.filter(
    (candidate) => candidate.binding.payloadDigest !== payloadDigest,
  )
  const removed = current.completions.length - completions.length
  if (removed > 0) {
    writeEvidenceStore(storage, { v: STORE_VERSION, completions })
  }
  return removed
}

function deriveEvidenceRecords({
  answers,
  questions,
  localizedQuestions,
  result,
  calibrationId,
  locale,
}: {
  answers: Answers
  questions: Question[]
  localizedQuestions: Map<string, Question>
  result: CanonicalFoundationResult
  calibrationId: FoundationScoringCalibration
  locale: Locale
}): FoundationLocalEvidenceRecord[] {
  const currentGap = familyDifference(result, result.familyKey, result.runnerUpKey)
  const candidates: EvidenceCandidate[] = []

  questions.forEach((question, order) => {
    const answer = answers[question.id]
    const selected = selectedDisplayChoice(question, answer, locale)
    if (!selected) return

    const alternatives = comparisonChoices(question, answer, locale)
    const evaluated = alternatives
      .map((alternative) => {
        const counterfactualAnswers = {
          ...answers,
          [question.id]: alternative.answer,
        }
        const counterfactual = generateResult(
          counterfactualAnswers,
          SCORING_MODE,
          calibrationId,
        )
        const counterfactualGap = familyDifference(
          counterfactual,
          result.familyKey,
          result.runnerUpKey,
        )
        return {
          alternative,
          counterfactual,
          counterfactualGap,
          effect: currentGap - counterfactualGap,
        }
      })
      .filter(({ effect }) => effect > 0)
      .sort((left, right) =>
        Math.abs(left.counterfactualGap) - Math.abs(right.counterfactualGap) ||
        right.effect - left.effect,
      )

    const strongestExactCounterfactual = evaluated[0]
    if (!strongestExactCounterfactual) return

    const separating = separatingDimensionForCounterfactual(
      result,
      strongestExactCounterfactual.counterfactual,
      result.familyKey,
      result.runnerUpKey,
      calibrationId,
    )
    if (!separating) return

    const localizedQuestion = localizedQuestions.get(question.id) ?? question
    const localizedSelected = selectedDisplayChoice(localizedQuestion, answer, locale) ?? selected
    const localizedAlternative = localizeComparisonChoice(
      localizedQuestion,
      strongestExactCounterfactual.alternative,
      locale,
    )
    const alternativeKind = hasActualSecondChoice(question, answer)
      ? "actual-second-choice"
      : "model-selected-nearest-alternative"

    candidates.push({
      order,
      record: {
        itemId: question.id,
        prompt: localizedQuestion.prompt,
        selectedOptionId: localizedSelected.id,
        ...(localizedSelected.title ? { selectedTitle: localizedSelected.title } : {}),
        selectedLabel: localizedSelected.label,
        alternative: {
          kind: alternativeKind,
          optionId: localizedAlternative.id,
          ...(localizedAlternative.title ? { title: localizedAlternative.title } : {}),
          label: localizedAlternative.label,
        },
        contribution: {
          primaryFamily: result.familyKey,
          runnerUpFamily: result.runnerUpKey,
          effectOnRoundedFamilyDifference: strongestExactCounterfactual.effect,
          separatingDimension: separating.dimension,
          separatingDimensionEffect: separating.effect,
        },
        explanation: evidenceExplanation(locale, separating.dimension),
      },
    })
  })

  return candidates
    .sort((left, right) => {
      const effectDelta =
        right.record.contribution.effectOnRoundedFamilyDifference -
        left.record.contribution.effectOnRoundedFamilyDifference
      return effectDelta || left.order - right.order
    })
    .slice(0, MAX_EVIDENCE_RECORDS)
    .map(({ record }) => record)
}

function comparisonChoices(
  question: Question,
  answer: AnswerValue | undefined,
  locale: Locale,
): DisplayChoice[] {
  if (question.kind === "likert") {
    if (typeof answer !== "number") return []
    return [1, 2, 3, 4, 5, 6, 7]
      .filter((value) => value !== answer)
      .map((value) => ({
        id: `likert-${value}`,
        label: likertLabel(locale, value),
        answer: value,
      }))
  }

  const primaryId = primaryOptionId(answer)
  if (!primaryId) return []
  const actualSecondary = secondaryOptionId(answer)
  if (actualSecondary) {
    const option = question.options.find(({ id }) => id === actualSecondary)
    if (!option) return []
    return [choiceOptionDisplay(option, swapRankedChoice(answer, actualSecondary))]
  }

  return question.options
    .filter(({ id }) => id !== primaryId)
    .map((option) => choiceOptionDisplay(option, replacementAnswer(answer, option.id)))
}

function selectedDisplayChoice(
  question: Question,
  answer: AnswerValue | undefined,
  locale: Locale,
): DisplayChoice | null {
  if (question.kind === "likert") {
    if (typeof answer !== "number" || !Number.isInteger(answer) || answer < 1 || answer > 7) {
      return null
    }
    return {
      id: `likert-${answer}`,
      label: likertLabel(locale, answer),
      answer,
    }
  }

  const id = primaryOptionId(answer)
  const option = question.options.find((candidate) => candidate.id === id)
  return option ? choiceOptionDisplay(option, answer as string | RankedChoiceAnswer) : null
}

function localizeComparisonChoice(
  question: Question,
  comparison: DisplayChoice,
  locale: Locale,
): DisplayChoice {
  if (question.kind === "likert") {
    const value = Number(comparison.id.replace("likert-", ""))
    return { ...comparison, label: likertLabel(locale, value) }
  }
  const option = question.options.find(({ id }) => id === comparison.id)
  return option ? choiceOptionDisplay(option, comparison.answer) : comparison
}

function choiceOptionDisplay(option: ChoiceOption, answer: AnswerValue): DisplayChoice {
  return {
    id: option.id,
    title: option.title,
    label: option.label,
    answer,
  }
}

function replacementAnswer(
  answer: AnswerValue | undefined,
  optionId: string,
): string | RankedChoiceAnswer {
  return isRankedChoiceAnswer(answer) ? { primary: optionId } : optionId
}

function swapRankedChoice(
  answer: AnswerValue | undefined,
  secondaryId: string,
): RankedChoiceAnswer {
  return {
    primary: secondaryId,
    ...(isRankedChoiceAnswer(answer) ? { secondary: answer.primary } : {}),
  }
}

function hasActualSecondChoice(
  question: Question,
  answer: AnswerValue | undefined,
): boolean {
  return question.kind !== "likert" && Boolean(secondaryOptionId(answer))
}

function separatingDimensionForCounterfactual(
  current: CanonicalFoundationResult,
  counterfactual: CanonicalFoundationResult,
  primary: FamilyKey,
  runnerUp: FamilyKey,
  calibrationId: FoundationScoringCalibration,
): { dimension: DimensionKey; effect: number } | null {
  const calibration = getV2ScoringCalibration(calibrationId)
  const contributions = DIMENSIONS.map((dimension) => {
    const familyWeightDifference =
      (familyProfiles[primary][dimension] ?? 0) -
      (familyProfiles[runnerUp][dimension] ?? 0)
    const scoreDifference =
      current.dimensionScores[dimension] -
      counterfactual.dimensionScores[dimension]
    return {
      dimension,
      effect:
        (scoreDifference / calibration.neutralBaseline[dimension].sd) *
        familyWeightDifference,
    }
  }).sort((left, right) => Math.abs(right.effect) - Math.abs(left.effect))

  return contributions[0] && Math.abs(contributions[0].effect) > 0
    ? contributions[0]
    : null
}

function familyDifference(
  result: CanonicalFoundationResult,
  primary: FamilyKey,
  runnerUp: FamilyKey,
): number {
  return result.familyScores[primary] - result.familyScores[runnerUp]
}

function evidenceExplanation(locale: Locale, dimension: DimensionKey): string {
  const label = locale === "zh-Hans"
    ? zhHansFoundationQuizUi.dimensionLabels[dimension]
    : dimensionLabels[dimension]
  return locale === "zh-Hans"
    ? `在其余已提交答案不变的情况下，这个替代选项对两个当前读法差异的最大影响出现在“${label}”维度。`
    : `With every other submitted answer held fixed, this substitution changes the difference between the two current readings most through ${label}.`
}

function localizedQuestionMap(locale: Locale): Map<string, Question> {
  const questions = locale === "zh-Hans"
    ? getZhHansFoundationQuestions("analyst")
    : getFoundationQuestions("analyst")
  return new Map(questions.map((question) => [question.id, question]))
}

function likertLabel(locale: Locale, value: number): string {
  return locale === "zh-Hans"
    ? (zhHansFoundationReviewUi.likertLabels as Readonly<Record<number, string>>)[value]
    : ENGLISH_LIKERT_LABELS[value]
}

function primaryOptionId(answer: AnswerValue | undefined): string | null {
  if (typeof answer === "string") return answer
  return isRankedChoiceAnswer(answer) ? answer.primary : null
}

function secondaryOptionId(answer: AnswerValue | undefined): string | null {
  return isRankedChoiceAnswer(answer) && typeof answer.secondary === "string"
    ? answer.secondary
    : null
}

function isRankedChoiceAnswer(value: AnswerValue | undefined): value is RankedChoiceAnswer {
  return typeof value === "object" && value !== null && typeof value.primary === "string"
}

function assertExactCompletedForm(answers: Answers, questions: Question[]) {
  const answerIds = Object.keys(answers)
  if (
    answerIds.length !== questions.length ||
    questions.some((question) => !isValidAnswer(question, answers[question.id]))
  ) {
    throw new Error("Local evidence requires the exact completed Foundation form.")
  }
}

function isValidAnswer(question: Question, answer: AnswerValue | undefined): boolean {
  if (question.kind === "likert") {
    return typeof answer === "number" && Number.isInteger(answer) && answer >= 1 && answer <= 7
  }
  const primary = primaryOptionId(answer)
  const secondary = secondaryOptionId(answer)
  const allowed = new Set(question.options.map(({ id }) => id))
  return Boolean(
    primary &&
    allowed.has(primary) &&
    (!secondary || (allowed.has(secondary) && secondary !== primary)),
  )
}

function assertPayloadMatchesGeneration(
  resolved: NonNullable<ReturnType<typeof resolveFoundationPayload>>,
  result: CanonicalFoundationResult,
  questionSet: FoundationQuestionSet,
  targetedFamilyPair: readonly [FamilyKey, FamilyKey] | undefined,
  calibrationId: FoundationScoringCalibration,
  locale: Locale,
) {
  const provenance = completionProvenance("foundation", locale)
  const payload = resolved.payload
  const expectedFormId = foundationFormId(questionSet, targetedFamilyPair)
  if (
    payload.v !== 5 ||
    resolved.questionSet !== questionSet ||
    foundationFormId(resolved.questionSet, resolved.targetedFamilyPair) !== expectedFormId ||
    resolved.scoringCalibration !== calibrationId ||
    payload.bv !== FOUNDATION_INSTRUMENT_VERSION ||
    payload.sv !== FOUNDATION_SCORING_VERSION ||
    payload.iv !== FOUNDATION_STRUCTURAL_VERSION ||
    payload.cv !== provenance.localeCopyVersion ||
    payload.cl !== locale ||
    result.familyKey !== resolved.result.familyKey ||
    result.runnerUpKey !== resolved.result.runnerUpKey ||
    result.strategyModifier !== resolved.result.strategyModifier ||
    result.normativeModifier !== resolved.result.normativeModifier ||
    DIMENSIONS.some(
      (dimension) => result.dimensionScores[dimension] !== resolved.dimensionScores[dimension],
    )
  ) {
    throw new Error("The submitted answers do not match the encoded Foundation result tuple.")
  }
}

function evidenceBindingMatches(
  binding: FoundationLocalEvidenceBinding,
  resolved: NonNullable<ReturnType<typeof resolveFoundationPayload>>,
  payloadDigest: string,
  mode: QuizMode,
): boolean {
  if (resolved.payload.v !== 5 || !resolved.questionSet) return false
  const payload = resolved.payload
  const calibration = getV2ScoringCalibration(resolved.scoringCalibration)
  return (
    binding.payloadDigest === payloadDigest &&
    binding.instrumentStructuralVersion === payload.iv &&
    binding.bankVersion === payload.bv &&
    binding.scorerVersion === payload.sv &&
    binding.calibrationId === resolved.scoringCalibration &&
    binding.copyVersion === payload.cv &&
    binding.completionLocale === payload.cl &&
    binding.questionSet === resolved.questionSet &&
    binding.formId === foundationFormId(resolved.questionSet, resolved.targetedFamilyPair) &&
    binding.mode === mode &&
    binding.scoringMode === SCORING_MODE &&
    binding.resolvedFamily === resolved.result.familyKey &&
    binding.resolvedRunnerUp === resolved.result.runnerUpKey &&
    binding.strategyModifier === resolved.result.strategyModifier &&
    binding.normativeModifier === resolved.result.normativeModifier &&
    binding.archetypeCode === resolveArchetype(
      resolved.result,
      calibration.lowDifferentiationThreshold,
    ).code
  )
}

function foundationFormId(
  questionSet: FoundationQuestionSet,
  targetedFamilyPair?: readonly [FamilyKey, FamilyKey],
): string {
  return questionSet === "targetedExtended" && targetedFamilyPair
    ? `${questionSet}:${targetedFamilyPair[0]}|${targetedFamilyPair[1]}`
    : questionSet
}

function createLocalCompletionId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID()
  }
  const bytes = new Uint8Array(16)
  globalThis.crypto?.getRandomValues(bytes)
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")
}

function writeEvidenceSet(storage: ReadWriteStorage, evidence: FoundationLocalEvidenceSet) {
  const current = readEvidenceStore(storage)
  const completions = [
    evidence,
    ...current.completions.filter(
      (candidate) => candidate.binding.localCompletionId !== evidence.binding.localCompletionId,
    ),
  ].slice(0, MAX_STORED_COMPLETIONS)
  writeEvidenceStore(storage, { v: STORE_VERSION, completions })
}

function writeEvidenceStore(storage: Pick<Storage, "setItem" | "removeItem">, store: FoundationLocalEvidenceStore) {
  if (store.completions.length === 0) {
    storage.removeItem(FOUNDATION_LOCAL_EVIDENCE_STORAGE_KEY)
    return
  }
  storage.setItem(FOUNDATION_LOCAL_EVIDENCE_STORAGE_KEY, JSON.stringify(store))
}

function readEvidenceStore(storage: Pick<Storage, "getItem">): FoundationLocalEvidenceStore {
  const raw = storage.getItem(FOUNDATION_LOCAL_EVIDENCE_STORAGE_KEY)
  if (!raw) return { v: STORE_VERSION, completions: [] }
  try {
    const value = JSON.parse(raw) as unknown
    if (!isRecord(value) || value.v !== STORE_VERSION || !Array.isArray(value.completions)) {
      return { v: STORE_VERSION, completions: [] }
    }
    return {
      v: STORE_VERSION,
      completions: value.completions.filter(isEvidenceSet),
    }
  } catch {
    return { v: STORE_VERSION, completions: [] }
  }
}

function isEvidenceSet(value: unknown): value is FoundationLocalEvidenceSet {
  if (!isRecord(value) || value.v !== STORE_VERSION || !Number.isFinite(value.createdAt)) {
    return false
  }
  if (!isRecord(value.binding) || !Array.isArray(value.records) || value.records.length > MAX_EVIDENCE_RECORDS) {
    return false
  }
  const binding = value.binding
  return (
    typeof binding.localCompletionId === "string" &&
    typeof binding.payloadDigest === "string" &&
    typeof binding.formId === "string" &&
    typeof binding.archetypeCode === "string" &&
    binding.scoringMode === SCORING_MODE &&
    value.records.every(isEvidenceRecord)
  )
}

function isEvidenceRecord(value: unknown): value is FoundationLocalEvidenceRecord {
  return (
    isRecord(value) &&
    typeof value.itemId === "string" &&
    typeof value.prompt === "string" &&
    typeof value.selectedOptionId === "string" &&
    typeof value.selectedLabel === "string" &&
    isRecord(value.alternative) &&
    typeof value.alternative.optionId === "string" &&
    typeof value.alternative.label === "string" &&
    (value.alternative.kind === "actual-second-choice" ||
      value.alternative.kind === "model-selected-nearest-alternative") &&
    isRecord(value.contribution) &&
    typeof value.contribution.effectOnRoundedFamilyDifference === "number" &&
    typeof value.contribution.separatingDimension === "string" &&
    typeof value.explanation === "string"
  )
}

function isEvidenceHandoff(value: unknown): value is FoundationEvidenceHandoff {
  return (
    isRecord(value) &&
    value.v === STORE_VERSION &&
    typeof value.localCompletionId === "string" &&
    typeof value.payloadDigest === "string" &&
    (value.mode === "standard" || value.mode === "analyst")
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}
