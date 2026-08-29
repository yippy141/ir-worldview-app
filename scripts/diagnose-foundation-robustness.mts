/**
 * Deterministic Foundation label-robustness diagnostic.
 *
 * This is a structural sensitivity study. It reuses the live immutable bank,
 * scorer, form calibrations, and archetype resolver; it does not estimate
 * psychometric reliability, validity, or population behavior.
 *
 * Run:
 *   node --experimental-strip-types --import ./tests/register-alias-loader.mjs \
 *     scripts/diagnose-foundation-robustness.mts
 *
 * Optional:
 *   --output=/absolute/or/repo-relative/path
 *   --check
 */

import { createHash } from "node:crypto"
import { execFileSync } from "node:child_process"
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { resolve } from "node:path"
import {
  HEDGER_POSTURE_MIDPOINT,
  normFromNormativeModifier,
  resolveArchetype,
} from "@/lib/archetypes"
import { assessFoundationNarrative } from "@/lib/narrative/foundation"
import {
  foundationCoreQuestions,
  foundationFamilyPairKey,
  getFoundationResultQuestions,
} from "@/lib/quiz-schema"
import {
  buildCanonicalFoundationResult,
  foundationScoringCalibrationForForm,
  generateResult,
  getV2ScoringCalibration,
  type CanonicalFoundationResult,
  type FoundationScoringCalibration,
} from "@/lib/scoring"
import type {
  Answers,
  ChoiceQuestion,
  DimensionKey,
  DimensionScores,
  FamilyKey,
  FoundationQuestionSet,
  Question,
} from "@/lib/types"

const DEFAULT_OUTPUT = "docs/research/v23-6-foundation-robustness"
const GENERATED_FILES = [
  "per-item-influence.csv",
  "transition-matrix.csv",
  "ensemble-summary.csv",
  "boundary-analysis.csv",
  "worst-case-fixtures.json",
  "current-run.json",
] as const
const SOURCE_SEED = 20260728
const ENSEMBLE_SEEDS = {
  uniform: SOURCE_SEED,
  calibratedSynthetic: 2026082901,
  boundaryFocused: 2026082902,
  canonical: 2026082903,
  responseStyleStress: 2026082904,
} as const

const DIMENSIONS: readonly DimensionKey[] = [
  "securityCompetition",
  "institutions",
  "domesticFilters",
  "normsIdentity",
  "politicalEconomy",
  "restraint",
  "orderJustice",
]

const FAMILIES: readonly FamilyKey[] = [
  "realist",
  "institutionalist",
  "constructivist",
  "criticalPoliticalEconomy",
]

const TARGETED_PAIRS: readonly (readonly [FamilyKey, FamilyKey])[] = [
  ["realist", "institutionalist"],
  ["realist", "constructivist"],
  ["realist", "criticalPoliticalEconomy"],
  ["institutionalist", "constructivist"],
  ["institutionalist", "criticalPoliticalEconomy"],
  ["constructivist", "criticalPoliticalEconomy"],
]

// Existing scorer-test profiles. The item-space generator below treats each
// row as a correlated latent profile, not as population evidence.
const SYNTHETIC_PROFILES: Readonly<Record<FamilyKey, DimensionScores>> = {
  realist: {
    securityCompetition: 6.2,
    institutions: 2.5,
    domesticFilters: 3,
    normsIdentity: 2.8,
    politicalEconomy: 3.4,
    restraint: 3,
    orderJustice: 4.7,
  },
  institutionalist: {
    securityCompetition: 3.2,
    institutions: 6.2,
    domesticFilters: 5.6,
    normsIdentity: 4.8,
    politicalEconomy: 4.7,
    restraint: 5.4,
    orderJustice: 4.6,
  },
  constructivist: {
    securityCompetition: 3.1,
    institutions: 4.6,
    domesticFilters: 4.2,
    normsIdentity: 6.3,
    politicalEconomy: 4.2,
    restraint: 4.8,
    orderJustice: 4.6,
  },
  criticalPoliticalEconomy: {
    securityCompetition: 3.3,
    institutions: 2.6,
    domesticFilters: 5.7,
    normsIdentity: 4.5,
    politicalEconomy: 6.4,
    restraint: 4.4,
    orderJustice: 3.2,
  },
}

const SAMPLE_TARGETS = {
  uniform: { core: 300, targeted: 160, full: 160 },
  calibratedSynthetic: { core: 240, targeted: 120, full: 160 },
  boundaryFocused: { core: 64, targeted: 64, full: 64 },
  canonical: { core: 16, targeted: 16, full: 16 },
  responseStyleStress: { core: 24, targeted: 24, full: 24 },
} as const

const PROTECTED_FILES = [
  "content/instrument/foundation.v2.json",
  "content/instrument/foundation.scoring.v1.json",
  "lib/quiz-schema.ts",
  "lib/scoring.ts",
  "lib/scoring/v2.ts",
  "lib/scoring/v2-calibration.ts",
  "lib/scoring-calibration.ts",
  "lib/scoring/versions.ts",
  "lib/archetypes.ts",
  "lib/types.ts",
  "lib/share.ts",
  "lib/url-payload.ts",
] as const

type EnsembleKey = keyof typeof ENSEMBLE_SEEDS
type StartingClass = "all" | "pure" | "blend"
type PerturbationScope = "answer" | "posture-dimension"

type FormSpec = {
  key: string
  group: "core" | "targeted" | "full"
  questionSet: FoundationQuestionSet
  pair?: readonly [FamilyKey, FamilyKey]
  calibration: FoundationScoringCalibration
  questions: Question[]
}

type BaseRecord = {
  id: string
  ensemble: EnsembleKey
  form: FormSpec
  tags: string[]
  answers: Answers
  outcome: Outcome
}

type Outcome = {
  result: CanonicalFoundationResult
  family: FamilyKey
  posture: "+" | "-"
  routing: "pure" | "blend"
  archetype: string
  readingCode: string
  nearestFitGap: number
  lowDifferentiationThreshold: number
  familyBoundaryDistance: number
  blendBoundaryDistance: number
  postureBoundaryDistance: number
  placementState: ReturnType<typeof assessFoundationNarrative>["state"]
}

type Trial = {
  baseId: string
  ensemble: EnsembleKey
  form: FormSpec
  tags: string[]
  startingClass: Exclude<StartingClass, "all">
  scope: PerturbationScope
  mutation: string
  itemId: string
  itemDimensions: string[]
  fromAnswer: unknown
  toAnswer: unknown
  before: Outcome
  after: Outcome
  dimensionDeltas: Partial<Record<DimensionKey, number>>
  dimensionL1: number
  familyFlip: boolean
  postureFlip: boolean
  routingFlip: boolean
  pureToBlend: boolean
  blendToPure: boolean
  archetypeFlip: boolean
  maskedFamilyFlip: boolean
  amplifiedArchetypeFlip: boolean
}

type CsvValue = string | number | boolean | null | undefined

function makeRng(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 0x100000000
  }
}

function normal(random: () => number) {
  const first = Math.max(random(), Number.EPSILON)
  const second = random()
  return Math.sqrt(-2 * Math.log(first)) * Math.cos(2 * Math.PI * second)
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.max(minimum, Math.min(maximum, value))
}

function round(value: number, digits = 6) {
  return Number(value.toFixed(digits))
}

function rate(count: number, total: number) {
  return total === 0 ? 0 : round(count / total)
}

function percentile(values: readonly number[], probability: number) {
  if (values.length === 0) return 0
  const sorted = [...values].sort((left, right) => left - right)
  const rank = (sorted.length - 1) * probability
  const lower = Math.floor(rank)
  const upper = Math.ceil(rank)
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (rank - lower)
}

function median(values: readonly number[]) {
  return percentile(values, 0.5)
}

function cloneAnswers(answers: Answers): Answers {
  return Object.fromEntries(
    Object.entries(answers).map(([key, value]) => [
      key,
      typeof value === "object" && value !== null ? { ...value } : value,
    ]),
  )
}

function answerFingerprint(answers: Answers) {
  return JSON.stringify(
    Object.fromEntries(Object.entries(answers).sort(([left], [right]) => left.localeCompare(right))),
  )
}

function sha256(value: string | Buffer) {
  return createHash("sha256").update(value).digest("hex")
}

function buildForms(): FormSpec[] {
  const definitions: Array<{
    key: string
    group: FormSpec["group"]
    questionSet: FoundationQuestionSet
    pair?: readonly [FamilyKey, FamilyKey]
  }> = [
    { key: "core", group: "core", questionSet: "core" },
    ...TARGETED_PAIRS.map((pair) => ({
      key: `targeted:${foundationFamilyPairKey(...pair)}`,
      group: "targeted" as const,
      questionSet: "targetedExtended" as const,
      pair,
    })),
    { key: "fullExtended", group: "full", questionSet: "fullExtended" },
  ]

  return definitions.map((definition) => {
    const calibration = foundationScoringCalibrationForForm(
      definition.questionSet,
      definition.pair,
    )
    if (!calibration) {
      throw new Error(`No scoring calibration for ${definition.key}.`)
    }
    return {
      ...definition,
      calibration,
      questions: getFoundationResultQuestions(
        definition.questionSet,
        definition.pair,
      ),
    }
  })
}

function sampleTarget(
  ensemble: keyof typeof SAMPLE_TARGETS,
  form: FormSpec,
) {
  return SAMPLE_TARGETS[ensemble][form.group]
}

function optionAnswer(
  question: ChoiceQuestion,
  primaryIndex: number,
  secondaryIndex?: number,
) {
  const primary = question.options[primaryIndex % question.options.length]
  if (!question.allowSecondChoiceInAnalyst || secondaryIndex === undefined) {
    return primary.id
  }
  const secondary = question.options[secondaryIndex % question.options.length]
  return secondary.id === primary.id
    ? { primary: primary.id }
    : { primary: primary.id, secondary: secondary.id }
}

function buildUniformAnswers(questions: readonly Question[], random: () => number): Answers {
  const answers: Answers = {}
  for (const question of questions) {
    if (question.kind === "likert") {
      answers[question.id] = 1 + Math.floor(random() * 7)
      continue
    }
    const primary = Math.floor(random() * question.options.length)
    // Uniformly sample the optional-secondary state plus every distinct option.
    const secondaryState = Math.floor(random() * question.options.length)
    const secondary = secondaryState === 0
      ? undefined
      : (primary + secondaryState) % question.options.length
    answers[question.id] = optionAnswer(question, primary, secondary)
  }
  return answers
}

function choiceDistance(
  question: ChoiceQuestion,
  optionIndex: number,
  target: DimensionScores,
  jitter: number,
) {
  const entries = Object.entries(question.options[optionIndex].signals) as [DimensionKey, number][]
  if (entries.length === 0) return 1_000 + jitter
  const squared = entries.reduce(
    (sum, [dimension, value]) => sum + (value - target[dimension]) ** 2,
    0,
  )
  return squared / entries.length + jitter
}

function buildProfileAnswers(
  questions: readonly Question[],
  baseProfile: DimensionScores,
  random: () => number,
  noise: boolean,
): Answers {
  const responseStyle = noise ? normal(random) * 0.22 : 0
  const latent = Object.fromEntries(
    DIMENSIONS.map((dimension) => [
      dimension,
      clamp(
        baseProfile[dimension] + responseStyle + (noise ? normal(random) * 0.35 : 0),
        1,
        7,
      ),
    ]),
  ) as DimensionScores
  const answers: Answers = {}

  for (const question of questions) {
    if (question.kind === "likert") {
      if (question.scoringBlock === "validation") {
        answers[question.id] = clamp(
          Math.round(4 + responseStyle + (noise ? normal(random) * 0.8 : 0)),
          1,
          7,
        )
        continue
      }
      const scoredTarget = latent[question.dimension]
      const rawTarget = question.reverse ? 8 - scoredTarget : scoredTarget
      answers[question.id] = clamp(
        Math.round(rawTarget + (noise ? normal(random) * 0.55 : 0)),
        1,
        7,
      )
      continue
    }

    const ranked = question.options
      .map((_, index) => ({
        index,
        distance: choiceDistance(
          question,
          index,
          latent,
          noise ? random() * 0.2 : index * Number.EPSILON,
        ),
      }))
      .sort((left, right) => left.distance - right.distance || left.index - right.index)
    const includeSecondary = question.allowSecondChoiceInAnalyst && (!noise || random() < 0.72)
    answers[question.id] = optionAnswer(
      question,
      ranked[0].index,
      includeSecondary ? ranked[1].index : undefined,
    )
  }
  return answers
}

function buildResponseStyleAnswers(
  questions: readonly Question[],
  style: string,
  variant: number,
): Answers {
  const answers: Answers = {}
  let likertIndex = 0
  let choiceIndex = 0
  for (const question of questions) {
    if (question.kind === "likert") {
      let value = 4
      if (style === "midpoint-heavy") {
        value = likertIndex % 10 === 0 ? 3 : likertIndex % 10 === 5 ? 5 : 4
      } else if (style === "acquiescent") {
        value = variant % 2 === 0 ? 6 : 7
      } else if (style === "disacquiescent") {
        value = variant % 2 === 0 ? 2 : 1
      } else if (style === "high-extremity") {
        value = (likertIndex + variant) % 2 === 0 ? 1 : 7
      } else if (style === "alternating") {
        value = (likertIndex + variant) % 2 === 0 ? 2 : 6
      }
      answers[question.id] = value
      likertIndex += 1
      continue
    }
    const primary = style === "high-extremity" || style === "alternating"
      ? (choiceIndex + variant) % 2 === 0 ? 0 : question.options.length - 1
      : variant % question.options.length
    answers[question.id] = optionAnswer(
      question,
      primary,
      question.allowSecondChoiceInAnalyst
        ? (primary + 1) % question.options.length
        : undefined,
    )
    choiceIndex += 1
  }
  return answers
}

function evaluate(form: FormSpec, answers: Answers): Outcome {
  const result = generateResult(answers, "analyst", form.calibration)
  return evaluateResult(form, result)
}

function evaluateResult(form: FormSpec, result: CanonicalFoundationResult): Outcome {
  const calibration = getV2ScoringCalibration(form.calibration)
  const archetype = resolveArchetype(result, calibration.lowDifferentiationThreshold)
  const routing = archetype.code.includes("/") ? "blend" : "pure"
  return {
    result,
    family: result.familyKey,
    posture: archetype.posture,
    routing,
    archetype: archetype.code,
    readingCode: `${archetype.code}.${normFromNormativeModifier(result.normativeModifier)}`,
    nearestFitGap: result.nearestFitGap,
    lowDifferentiationThreshold: calibration.lowDifferentiationThreshold,
    familyBoundaryDistance: result.nearestFitGap,
    blendBoundaryDistance: Math.abs(
      result.nearestFitGap - calibration.lowDifferentiationThreshold,
    ),
    postureBoundaryDistance: Math.abs(
      result.dimensionScores.restraint - HEDGER_POSTURE_MIDPOINT,
    ),
    placementState: assessFoundationNarrative(
      result.dimensionScores,
      form.calibration,
    ).state,
  }
}

function makeBaseRecord(
  ensemble: EnsembleKey,
  form: FormSpec,
  index: number,
  answers: Answers,
  tags: string[] = [],
): BaseRecord {
  return {
    id: `${ensemble}:${form.key}:${String(index).padStart(4, "0")}`,
    ensemble,
    form,
    tags,
    answers,
    outcome: evaluate(form, answers),
  }
}

function corePairMatches(form: FormSpec, answers: Answers) {
  if (!form.pair) return true
  const coreForm = FORMS.find((candidate) => candidate.key === "core")
  if (!coreForm) throw new Error("Core form is unavailable.")
  const coreIds = new Set(coreForm.questions.map((question) => question.id))
  const coreAnswers = Object.fromEntries(
    Object.entries(answers).filter(([questionId]) => coreIds.has(questionId)),
  )
  const coreResult = evaluate(coreForm, coreAnswers)
  const calibration = getV2ScoringCalibration("core")
  const pairKey = foundationFamilyPairKey(coreResult.family, coreResult.result.runnerUpKey)
  return (
    coreResult.nearestFitGap < calibration.lowDifferentiationThreshold &&
    pairKey === foundationFamilyPairKey(...form.pair)
  )
}

function buildUniformEnsemble(form: FormSpec): BaseRecord[] {
  const target = sampleTarget("uniform", form)
  const random = makeRng(ENSEMBLE_SEEDS.uniform + stableNumber(form.key))
  return Array.from({ length: target }, (_, index) =>
    makeBaseRecord("uniform", form, index, buildUniformAnswers(form.questions, random)),
  )
}

function buildCalibratedSyntheticEnsemble(form: FormSpec): BaseRecord[] {
  const target = sampleTarget("calibratedSynthetic", form)
  const random = makeRng(ENSEMBLE_SEEDS.calibratedSynthetic + stableNumber(form.key))
  return Array.from({ length: target }, (_, index) => {
    const family = FAMILIES[index % FAMILIES.length]
    return makeBaseRecord(
      "calibratedSynthetic",
      form,
      index,
      buildProfileAnswers(form.questions, SYNTHETIC_PROFILES[family], random, true),
      [`latent-family:${family}`],
    )
  })
}

function buildCanonicalEnsemble(form: FormSpec): BaseRecord[] {
  const random = makeRng(ENSEMBLE_SEEDS.canonical + stableNumber(form.key))
  const variants = [
    { name: "advantage-order", restraint: 2.5, orderJustice: 5.5 },
    { name: "advantage-justice", restraint: 2.5, orderJustice: 2.5 },
    { name: "restraint-order", restraint: 5.5, orderJustice: 5.5 },
    { name: "restraint-justice", restraint: 5.5, orderJustice: 2.5 },
  ]
  const records: BaseRecord[] = []
  for (const family of FAMILIES) {
    for (const variant of variants) {
      const profile = {
        ...SYNTHETIC_PROFILES[family],
        restraint: variant.restraint,
        orderJustice: variant.orderJustice,
      }
      records.push(
        makeBaseRecord(
          "canonical",
          form,
          records.length,
          buildProfileAnswers(form.questions, profile, random, false),
          [`archetype-directed:${family}`, variant.name],
        ),
      )
    }
  }
  return records.slice(0, sampleTarget("canonical", form))
}

function buildResponseStyleEnsemble(form: FormSpec): BaseRecord[] {
  const styles = [
    "midpoint-heavy",
    "acquiescent",
    "disacquiescent",
    "high-extremity",
    "alternating",
  ]
  const records: BaseRecord[] = []
  for (const style of styles) {
    for (let variant = 0; variant < 4; variant += 1) {
      records.push(
        makeBaseRecord(
          "responseStyleStress",
          form,
          records.length,
          buildResponseStyleAnswers(form.questions, style, variant),
          [`response-style:${style}`],
        ),
      )
    }
  }

  const random = makeRng(ENSEMBLE_SEEDS.responseStyleStress + stableNumber(form.key))
  const lowDifferentiationCandidates = Array.from({ length: 2_000 }, () => {
    const answers = buildUniformAnswers(form.questions, random)
    return { answers, outcome: evaluate(form, answers) }
  }).sort(
    (left, right) =>
      left.outcome.nearestFitGap - right.outcome.nearestFitGap ||
      averageCenterDistance(left.outcome.result.dimensionScores) -
        averageCenterDistance(right.outcome.result.dimensionScores),
  )
  for (const candidate of lowDifferentiationCandidates.slice(0, 4)) {
    records.push(
      makeBaseRecord(
        "responseStyleStress",
        form,
        records.length,
        candidate.answers,
        ["response-style:low-differentiation"],
      ),
    )
  }
  return records.slice(0, sampleTarget("responseStyleStress", form))
}

function buildBoundaryEnsemble(form: FormSpec): BaseRecord[] {
  const random = makeRng(ENSEMBLE_SEEDS.boundaryFocused + stableNumber(form.key))
  const candidateTarget = form.group === "targeted" ? 800 : 8_000
  const candidates: Array<{ answers: Answers; outcome: Outcome }> = []
  let attempts = 0
  const maximumAttempts = form.group === "targeted" ? 40_000 : candidateTarget

  while (candidates.length < candidateTarget && attempts < maximumAttempts) {
    attempts += 1
    const answers = buildUniformAnswers(form.questions, random)
    if (!corePairMatches(form, answers)) continue
    candidates.push({ answers, outcome: evaluate(form, answers) })
  }
  if (candidates.length < 200) {
    throw new Error(
      `Boundary candidate pool for ${form.key} is too small: ${candidates.length}.`,
    )
  }

  const selectors = [
    {
      tag: "family-boundary",
      score: (candidate: (typeof candidates)[number]) =>
        candidate.outcome.familyBoundaryDistance,
    },
    {
      tag: "pure-blend-threshold",
      score: (candidate: (typeof candidates)[number]) =>
        candidate.outcome.blendBoundaryDistance,
    },
    {
      tag: "posture-midpoint",
      score: (candidate: (typeof candidates)[number]) =>
        candidate.outcome.postureBoundaryDistance,
    },
    {
      tag: "ties-and-near-ties",
      score: (candidate: (typeof candidates)[number]) =>
        candidate.outcome.nearestFitGap === 0
          ? -1
          : candidate.outcome.nearestFitGap,
    },
  ]
  const target = sampleTarget("boundaryFocused", form)
  const perSelector = Math.ceil(target / selectors.length)
  const selected = new Map<string, { candidate: (typeof candidates)[number]; tags: string[] }>()
  for (const selector of selectors) {
    const ranked = [...candidates].sort(
      (left, right) =>
        selector.score(left) - selector.score(right) ||
        answerFingerprint(left.answers).localeCompare(answerFingerprint(right.answers)),
    )
    let added = 0
    for (const candidate of ranked) {
      const fingerprint = answerFingerprint(candidate.answers)
      const existing = selected.get(fingerprint)
      if (existing) {
        if (!existing.tags.includes(selector.tag)) existing.tags.push(selector.tag)
        continue
      }
      selected.set(fingerprint, { candidate, tags: [selector.tag] })
      added += 1
      if (added >= perSelector) break
    }
  }
  return [...selected.values()]
    .slice(0, target)
    .map(({ candidate, tags }, index) =>
      makeBaseRecord(
        "boundaryFocused",
        form,
        index,
        candidate.answers,
        tags.sort(),
      ),
    )
}

function averageCenterDistance(scores: DimensionScores) {
  return DIMENSIONS.reduce((sum, dimension) => sum + Math.abs(scores[dimension] - 4), 0) /
    DIMENSIONS.length
}

function stableNumber(value: string) {
  let hash = 2166136261
  for (const character of value) {
    hash ^= character.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function itemDimensions(question: Question): string[] {
  if (question.kind === "likert") {
    return question.scoringBlock === "core"
      ? [question.dimension]
      : [`validation:${question.validationScale}`]
  }
  return [...new Set(
    question.options.flatMap((option) => Object.keys(option.signals)),
  )].sort()
}

function dimensionDeltas(before: Outcome, after: Outcome) {
  const deltas: Partial<Record<DimensionKey, number>> = {}
  for (const dimension of DIMENSIONS) {
    const delta = round(
      after.result.dimensionScores[dimension] -
        before.result.dimensionScores[dimension],
    )
    if (delta !== 0) deltas[dimension] = delta
  }
  return deltas
}

function makeTrial({
  base,
  scope,
  mutation,
  itemId,
  dimensions,
  fromAnswer,
  toAnswer,
  after,
}: {
  base: BaseRecord
  scope: PerturbationScope
  mutation: string
  itemId: string
  dimensions: string[]
  fromAnswer: unknown
  toAnswer: unknown
  after: Outcome
}): Trial {
  const deltas = dimensionDeltas(base.outcome, after)
  const familyFlip = base.outcome.family !== after.family
  const postureFlip = base.outcome.posture !== after.posture
  const routingFlip = base.outcome.routing !== after.routing
  const archetypeFlip = base.outcome.archetype !== after.archetype
  return {
    baseId: base.id,
    ensemble: base.ensemble,
    form: base.form,
    tags: base.tags,
    startingClass: base.outcome.routing,
    scope,
    mutation,
    itemId,
    itemDimensions: dimensions,
    fromAnswer,
    toAnswer,
    before: base.outcome,
    after,
    dimensionDeltas: deltas,
    dimensionL1: round(
      Object.values(deltas).reduce((sum, delta) => sum + Math.abs(delta ?? 0), 0),
    ),
    familyFlip,
    postureFlip,
    routingFlip,
    pureToBlend: base.outcome.routing === "pure" && after.routing === "blend",
    blendToPure: base.outcome.routing === "blend" && after.routing === "pure",
    archetypeFlip,
    maskedFamilyFlip: familyFlip && base.outcome.archetype === after.archetype,
    amplifiedArchetypeFlip: !familyFlip && archetypeFlip,
  }
}

function perturbBase(base: BaseRecord): Trial[] {
  const trials: Trial[] = []
  for (const question of base.form.questions) {
    const current = base.answers[question.id]
    const dimensions = itemDimensions(question)
    if (question.kind === "likert") {
      if (typeof current !== "number") {
        throw new Error(`Missing Likert answer ${question.id} in ${base.id}.`)
      }
      for (const direction of [-1, 1] as const) {
        const next = current + direction
        if (next < 1 || next > 7) continue
        const answers = cloneAnswers(base.answers)
        answers[question.id] = next
        trials.push(makeTrial({
          base,
          scope: "answer",
          mutation: direction < 0 ? "likert-down" : "likert-up",
          itemId: question.id,
          dimensions,
          fromAnswer: current,
          toAnswer: next,
          after: evaluate(base.form, answers),
        }))
      }
      continue
    }

    const primary = typeof current === "string"
      ? current
      : typeof current === "object" && current !== null
        ? current.primary
        : undefined
    if (!primary) throw new Error(`Missing choice answer ${question.id} in ${base.id}.`)
    for (const option of question.options) {
      if (option.id === primary) continue
      const answers = cloneAnswers(base.answers)
      if (typeof current === "string") {
        answers[question.id] = option.id
      } else {
        if (typeof current !== "object" || current === null) {
          throw new Error(`Invalid choice answer ${question.id} in ${base.id}.`)
        }
        answers[question.id] = {
          primary: option.id,
          secondary: current.secondary === option.id ? primary : current.secondary,
        }
      }
      trials.push(makeTrial({
        base,
        scope: "answer",
        mutation: "forced-choice-alternative",
        itemId: question.id,
        dimensions,
        fromAnswer: primary,
        toAnswer: option.id,
        after: evaluate(base.form, answers),
      }))
    }
  }

  for (const question of foundationCoreQuestions) {
    const current = base.answers[question.id]
    if (typeof current !== "number") {
      throw new Error(`Missing core answer ${question.id} in ${base.id}.`)
    }
    const omitted = cloneAnswers(base.answers)
    delete omitted[question.id]
    trials.push(makeTrial({
      base,
      scope: "answer",
      mutation: "core-omission",
      itemId: question.id,
      dimensions: itemDimensions(question),
      fromAnswer: current,
      toAnswer: null,
      after: evaluate(base.form, omitted),
    }))

    const neutralised = cloneAnswers(base.answers)
    neutralised[question.id] = 4
    trials.push(makeTrial({
      base,
      scope: "answer",
      mutation: "core-neutralisation",
      itemId: question.id,
      dimensions: itemDimensions(question),
      fromAnswer: current,
      toAnswer: 4,
      after: evaluate(base.form, neutralised),
    }))
  }

  for (const direction of [-0.01, 0.01] as const) {
    const scores = {
      ...base.outcome.result.dimensionScores,
      restraint: round(
        clamp(
          base.outcome.result.dimensionScores.restraint + direction,
          1,
          7,
        ),
        2,
      ),
    }
    const after = evaluateResult(
      base.form,
      buildCanonicalFoundationResult(scores, base.form.calibration),
    )
    trials.push(makeTrial({
      base,
      scope: "posture-dimension",
      mutation: direction < 0 ? "posture-dimension-down" : "posture-dimension-up",
      itemId: "__restraint_dimension__",
      dimensions: ["restraint"],
      fromAnswer: base.outcome.result.dimensionScores.restraint,
      toAnswer: scores.restraint,
      after,
    }))
  }
  return trials
}

function filterStartingClass<T extends { startingClass?: Exclude<StartingClass, "all"> }>(
  values: readonly T[],
  startingClass: StartingClass,
) {
  return startingClass === "all"
    ? [...values]
    : values.filter((value) => value.startingClass === startingClass)
}

function groupKey(...parts: string[]) {
  return parts.join("\u001f")
}

function groupBy<T>(values: readonly T[], key: (value: T) => string) {
  const groups = new Map<string, T[]>()
  for (const value of values) {
    const current = groups.get(key(value)) ?? []
    current.push(value)
    groups.set(key(value), current)
  }
  return groups
}

function buildPerItemRows(trials: readonly Trial[]) {
  const answerTrials = trials.filter((trial) => trial.scope === "answer")
  return [...groupBy(answerTrials, (trial) =>
    groupKey(trial.ensemble, trial.form.key, trial.startingClass, trial.itemId),
  )].map(([, rows]) => {
    const first = rows[0]
    const omissionRows = rows.filter((row) => row.mutation === "core-omission")
    const neutralRows = rows.filter((row) => row.mutation === "core-neutralisation")
    return {
      ensemble: first.ensemble,
      form: first.form.key,
      starting_class: first.startingClass,
      item_id: first.itemId,
      dimensions: first.itemDimensions.join("|"),
      perturbation_trials: rows.length,
      family_flips: rows.filter((row) => row.familyFlip).length,
      family_flip_rate: rate(rows.filter((row) => row.familyFlip).length, rows.length),
      posture_flips: rows.filter((row) => row.postureFlip).length,
      posture_flip_rate: rate(rows.filter((row) => row.postureFlip).length, rows.length),
      routing_flips: rows.filter((row) => row.routingFlip).length,
      routing_flip_rate: rate(rows.filter((row) => row.routingFlip).length, rows.length),
      full_archetype_flips: rows.filter((row) => row.archetypeFlip).length,
      full_archetype_flip_rate: rate(
        rows.filter((row) => row.archetypeFlip).length,
        rows.length,
      ),
      mean_dimension_l1: round(
        rows.reduce((sum, row) => sum + row.dimensionL1, 0) / rows.length,
      ),
      max_dimension_l1: Math.max(...rows.map((row) => row.dimensionL1)),
      omission_trials: omissionRows.length,
      omission_full_archetype_flip_rate: rate(
        omissionRows.filter((row) => row.archetypeFlip).length,
        omissionRows.length,
      ),
      neutralisation_trials: neutralRows.length,
      neutralisation_full_archetype_flip_rate: rate(
        neutralRows.filter((row) => row.archetypeFlip).length,
        neutralRows.length,
      ),
    }
  }).sort(compareRows(["ensemble", "form", "starting_class", "item_id"]))
}

function buildEnsembleSummaryRows(
  bases: readonly BaseRecord[],
  trials: readonly Trial[],
  perItemRows: ReturnType<typeof buildPerItemRows>,
) {
  const rows: Record<string, CsvValue>[] = []
  for (const ensemble of Object.keys(ENSEMBLE_SEEDS) as EnsembleKey[]) {
    for (const form of FORMS) {
      const formBases = bases.filter(
        (base) => base.ensemble === ensemble && base.form.key === form.key,
      )
      const formTrials = trials.filter(
        (trial) =>
          trial.ensemble === ensemble &&
          trial.form.key === form.key &&
          trial.scope === "answer",
      )
      const directPostureTrials = trials.filter(
        (trial) =>
          trial.ensemble === ensemble &&
          trial.form.key === form.key &&
          trial.scope === "posture-dimension",
      )
      for (const startingClass of ["all", "pure", "blend"] as const) {
        const selectedBases = startingClass === "all"
          ? formBases
          : formBases.filter((base) => base.outcome.routing === startingClass)
        const selectedTrials = filterStartingClass(formTrials, startingClass)
        const selectedDirect = filterStartingClass(directPostureTrials, startingClass)
        const influenceRows = perItemRows.filter(
          (row) =>
            row.ensemble === ensemble &&
            row.form === form.key &&
            (startingClass === "all" || row.starting_class === startingClass),
        )
        const itemRates = aggregateItemRates(selectedTrials)
        const fullFlips = selectedTrials.filter((trial) => trial.archetypeFlip)
        const itemFlipCounts = countBy(fullFlips, (trial) => trial.itemId)
        const dimensionFlipCounts = countDimensionAttributions(fullFlips)
        const topItems = sortedCounts(itemFlipCounts)
        const topDimensions = sortedCounts(dimensionFlipCounts)
        const totalItemFlipEvents = fullFlips.length
        const totalDimensionAttributions = Object.values(dimensionFlipCounts)
          .reduce((sum, count) => sum + count, 0)
        const omission = selectedTrials.filter((trial) => trial.mutation === "core-omission")
        const neutralisation = selectedTrials.filter(
          (trial) => trial.mutation === "core-neutralisation",
        )

        rows.push({
          ensemble,
          form: form.key,
          form_group: form.group,
          starting_class: startingClass,
          base_vectors: selectedBases.length,
          answer_perturbation_trials: selectedTrials.length,
          primary_family_flip_rate: flipRate(selectedTrials, "familyFlip"),
          posture_flip_rate: flipRate(selectedTrials, "postureFlip"),
          pure_blend_transition_rate: flipRate(selectedTrials, "routingFlip"),
          full_archetype_flip_rate: flipRate(selectedTrials, "archetypeFlip"),
          pure_to_blend_rate: rate(
            selectedTrials.filter((trial) => trial.pureToBlend).length,
            selectedTrials.length,
          ),
          blend_to_pure_rate: rate(
            selectedTrials.filter((trial) => trial.blendToPure).length,
            selectedTrials.length,
          ),
          median_item_influence: median(Object.values(itemRates)),
          maximum_item_influence: Math.max(0, ...Object.values(itemRates)),
          maximum_influence_item: sortedCounts(itemRates)[0]?.[0] ?? "",
          top_flip_item: topItems[0]?.[0] ?? "",
          top_item_flip_concentration: rate(topItems[0]?.[1] ?? 0, totalItemFlipEvents),
          top_two_item_flip_concentration: rate(
            (topItems[0]?.[1] ?? 0) + (topItems[1]?.[1] ?? 0),
            totalItemFlipEvents,
          ),
          top_flip_dimension: topDimensions[0]?.[0] ?? "",
          top_dimension_flip_concentration: rate(
            topDimensions[0]?.[1] ?? 0,
            totalDimensionAttributions,
          ),
          masked_family_flip_rate: rate(
            selectedTrials.filter((trial) => trial.maskedFamilyFlip).length,
            selectedTrials.length,
          ),
          amplified_archetype_flip_rate: rate(
            selectedTrials.filter((trial) => trial.amplifiedArchetypeFlip).length,
            selectedTrials.length,
          ),
          omission_full_archetype_flip_rate: flipRate(omission, "archetypeFlip"),
          neutralisation_full_archetype_flip_rate: flipRate(
            neutralisation,
            "archetypeFlip",
          ),
          direct_posture_dimension_trials: selectedDirect.length,
          direct_posture_dimension_flip_rate: flipRate(selectedDirect, "postureFlip"),
          diagnostic_item_rows: influenceRows.length,
        })
      }
    }
  }
  return rows
}

function aggregateItemRates(trials: readonly Trial[]) {
  const grouped = groupBy(trials, (trial) => trial.itemId)
  return Object.fromEntries(
    [...grouped].map(([itemId, rows]) => [
      itemId,
      rate(rows.filter((row) => row.archetypeFlip).length, rows.length),
    ]),
  )
}

function flipRate(trials: readonly Trial[], key: "familyFlip" | "postureFlip" | "routingFlip" | "archetypeFlip") {
  return rate(trials.filter((trial) => trial[key]).length, trials.length)
}

function countBy<T>(values: readonly T[], key: (value: T) => string) {
  const counts: Record<string, number> = {}
  for (const value of values) {
    const label = key(value)
    counts[label] = (counts[label] ?? 0) + 1
  }
  return counts
}

function countDimensionAttributions(trials: readonly Trial[]) {
  const counts: Record<string, number> = {}
  for (const trial of trials) {
    const changed = Object.keys(trial.dimensionDeltas)
    const dimensions = changed.length > 0 ? changed : trial.itemDimensions
    for (const dimension of dimensions) {
      counts[dimension] = (counts[dimension] ?? 0) + 1
    }
  }
  return counts
}

function sortedCounts(counts: Record<string, number>) {
  return Object.entries(counts).sort(
    ([leftKey, left], [rightKey, right]) => right - left || leftKey.localeCompare(rightKey),
  )
}

function buildTransitionRows(trials: readonly Trial[]) {
  const expanded = trials.flatMap((trial) => [
    { trial, type: "family", from: trial.before.family, to: trial.after.family },
    { trial, type: "posture", from: trial.before.posture, to: trial.after.posture },
    { trial, type: "routing", from: trial.before.routing, to: trial.after.routing },
    { trial, type: "full-archetype", from: trial.before.archetype, to: trial.after.archetype },
  ])
  return [...groupBy(expanded, ({ trial, type, from, to }) =>
    groupKey(trial.ensemble, trial.form.key, trial.scope, type, from, to),
  )].map(([, rows]) => {
    const first = rows[0]
    return {
      ensemble: first.trial.ensemble,
      form: first.trial.form.key,
      perturbation_scope: first.trial.scope,
      transition_type: first.type,
      from: first.from,
      to: first.to,
      changed: first.from !== first.to,
      count: rows.length,
      share_within_ensemble_form_scope_type: 0,
    }
  }).map((row, _index, allRows) => ({
    ...row,
    share_within_ensemble_form_scope_type: rate(
      Number(row.count),
      allRows
        .filter((candidate) =>
          candidate.ensemble === row.ensemble &&
          candidate.form === row.form &&
          candidate.perturbation_scope === row.perturbation_scope &&
          candidate.transition_type === row.transition_type,
        )
        .reduce((sum, candidate) => sum + Number(candidate.count), 0),
    ),
  })).sort(compareRows([
    "ensemble",
    "form",
    "perturbation_scope",
    "transition_type",
    "from",
    "to",
  ]))
}

function buildBoundaryRows(bases: readonly BaseRecord[], trials: readonly Trial[]) {
  const rows: Record<string, CsvValue>[] = []
  for (const ensemble of Object.keys(ENSEMBLE_SEEDS) as EnsembleKey[]) {
    for (const form of FORMS) {
      const groupBases = bases.filter(
        (base) => base.ensemble === ensemble && base.form.key === form.key,
      )
      const groupTrials = trials.filter(
        (trial) =>
          trial.ensemble === ensemble &&
          trial.form.key === form.key &&
          trial.scope === "answer",
      )
      const metrics = [
        {
          metric: "primary-family-flip",
          distance: (base: BaseRecord) => base.outcome.familyBoundaryDistance,
          flipped: (trial: Trial) => trial.familyFlip,
        },
        {
          metric: "pure-blend-transition",
          distance: (base: BaseRecord) => base.outcome.blendBoundaryDistance,
          flipped: (trial: Trial) => trial.routingFlip,
        },
        {
          metric: "posture-flip",
          distance: (base: BaseRecord) => base.outcome.postureBoundaryDistance,
          flipped: (trial: Trial) => trial.postureFlip,
        },
      ]
      for (const metric of metrics) {
        const distances = groupBases.map(metric.distance)
        const cuts = [0, 0.2, 0.4, 0.6, 0.8, 1].map((probability) =>
          percentile(distances, probability),
        )
        for (let bin = 0; bin < 5; bin += 1) {
          const lower = cuts[bin]
          const upper = cuts[bin + 1]
          const selectedBases = groupBases.filter((base) => {
            const distance = metric.distance(base)
            return distance >= lower && (bin === 4 ? distance <= upper : distance < upper)
          })
          const ids = new Set(selectedBases.map((base) => base.id))
          const selectedTrials = groupTrials.filter((trial) => ids.has(trial.baseId))
          rows.push({
            ensemble,
            form: form.key,
            analysis: "distance-quintile",
            metric: metric.metric,
            bin: `q${bin + 1}`,
            lower_distance: round(lower),
            upper_distance: round(upper),
            base_vectors: selectedBases.length,
            perturbation_trials: selectedTrials.length,
            flips: selectedTrials.filter(metric.flipped).length,
            flip_rate: rate(
              selectedTrials.filter(metric.flipped).length,
              selectedTrials.length,
            ),
            mean_distance: selectedBases.length === 0
              ? 0
              : round(
                  selectedBases.reduce((sum, base) => sum + metric.distance(base), 0) /
                    selectedBases.length,
                ),
          })
        }
      }

      for (const state of [
        "lowDifferentiation",
        "stableModeration",
        "sharplyDifferentiated",
      ] as const) {
        const selectedBases = groupBases.filter((base) => base.outcome.placementState === state)
        const ids = new Set(selectedBases.map((base) => base.id))
        const selectedTrials = groupTrials.filter((trial) => ids.has(trial.baseId))
        rows.push({
          ensemble,
          form: form.key,
          analysis: "placement-claim-band",
          metric: "full-archetype-flip",
          bin: state,
          lower_distance: "",
          upper_distance: "",
          base_vectors: selectedBases.length,
          perturbation_trials: selectedTrials.length,
          flips: selectedTrials.filter((trial) => trial.archetypeFlip).length,
          flip_rate: flipRate(selectedTrials, "archetypeFlip"),
          mean_distance: selectedBases.length === 0
            ? 0
            : round(
                selectedBases.reduce(
                  (sum, base) => sum + base.outcome.nearestFitGap,
                  0,
                ) / selectedBases.length,
              ),
        })
      }

      const restraintValues = groupBases.map(
        (base) => base.outcome.result.dimensionScores.restraint,
      )
      rows.push({
        ensemble,
        form: form.key,
        analysis: "posture-midpoint-location",
        metric: "restraint-score-distribution",
        bin: "all",
        lower_distance: Math.min(...restraintValues),
        upper_distance: Math.max(...restraintValues),
        base_vectors: groupBases.length,
        perturbation_trials: 0,
        flips: 0,
        flip_rate: 0,
        mean_distance: round(
          restraintValues.reduce((sum, value) => sum + Math.abs(value - 4), 0) /
            Math.max(1, restraintValues.length),
        ),
        midpoint_reachable: restraintValues.some((value) => value === 4),
        minimum_midpoint_distance: Math.min(...restraintValues.map((value) => Math.abs(value - 4))),
        below_midpoint_share: rate(restraintValues.filter((value) => value < 4).length, restraintValues.length),
        at_midpoint_share: rate(restraintValues.filter((value) => value === 4).length, restraintValues.length),
        above_midpoint_share: rate(restraintValues.filter((value) => value > 4).length, restraintValues.length),
        median_restraint: median(restraintValues),
      })
    }
  }
  return rows.sort(compareRows(["ensemble", "form", "analysis", "metric", "bin"]))
}

function checkMonotonicity(trials: readonly Trial[]) {
  let likertDimensionViolations = 0
  let postureViolations = 0
  for (const trial of trials) {
    if (trial.mutation === "likert-up" || trial.mutation === "likert-down") {
      const question = trial.form.questions.find((candidate) => candidate.id === trial.itemId)
      if (question?.kind === "likert" && question.scoringBlock === "core") {
        const delta = trial.dimensionDeltas[question.dimension] ?? 0
        const expectedSign = (trial.mutation === "likert-up" ? 1 : -1) *
          (question.reverse ? -1 : 1)
        if (delta !== 0 && Math.sign(delta) !== expectedSign) {
          likertDimensionViolations += 1
        }
      }
    }
    if (trial.scope === "posture-dimension") {
      const direction = trial.mutation.endsWith("up") ? 1 : -1
      if (
        (direction > 0 && trial.before.posture === "-" && trial.after.posture === "+") ||
        (direction < 0 && trial.before.posture === "+" && trial.after.posture === "-")
      ) {
        postureViolations += 1
      }
    }
  }
  return { likertDimensionViolations, postureViolations }
}

function fixtureOutcome(outcome: Outcome) {
  return {
    family: outcome.family,
    runnerUp: outcome.result.runnerUpKey,
    nearestFitGap: outcome.nearestFitGap,
    strategyModifier: outcome.result.strategyModifier,
    normativeModifier: outcome.result.normativeModifier,
    dimensionScores: outcome.result.dimensionScores,
    familyScores: outcome.result.familyScores,
    routing: outcome.routing,
    posture: outcome.posture,
    archetype: outcome.archetype,
    readingCode: outcome.readingCode,
    placementState: outcome.placementState,
  }
}

function fixtureTrial(trial: Trial | undefined) {
  if (!trial) return null
  return {
    mutation: trial.mutation,
    itemId: trial.itemId,
    fromAnswer: trial.fromAnswer,
    toAnswer: trial.toAnswer,
    dimensionDeltas: trial.dimensionDeltas,
    transitions: {
      family: `${trial.before.family}->${trial.after.family}`,
      routing: `${trial.before.routing}->${trial.after.routing}`,
      posture: `${trial.before.posture}->${trial.after.posture}`,
      archetype: `${trial.before.archetype}->${trial.after.archetype}`,
    },
    after: fixtureOutcome(trial.after),
  }
}

function buildWorstCases(bases: readonly BaseRecord[], trials: readonly Trial[]) {
  const byBase = groupBy(
    trials.filter((trial) => trial.scope === "answer"),
    (trial) => trial.baseId,
  )
  const ranked = bases.map((base) => {
    const baseTrials = byBase.get(base.id) ?? []
    const flips = baseTrials.filter((trial) => trial.archetypeFlip)
    const example = [...flips].sort(
      (left, right) =>
        right.dimensionL1 - left.dimensionL1 ||
        left.itemId.localeCompare(right.itemId),
    )[0]
    return {
      base,
      trials: baseTrials,
      flipRate: rate(flips.length, baseTrials.length),
      example,
    }
  }).sort(
    (left, right) =>
      right.flipRate - left.flipRate ||
      left.base.outcome.familyBoundaryDistance - right.base.outcome.familyBoundaryDistance ||
      left.base.id.localeCompare(right.base.id),
  )

  const serialize = (entry: (typeof ranked)[number]) => ({
    id: entry.base.id,
    ensemble: entry.base.ensemble,
    form: entry.base.form.key,
    calibration: entry.base.form.calibration,
    tags: entry.base.tags,
    answerPerturbationTrials: entry.trials.length,
    fullArchetypeFlipRate: entry.flipRate,
    answers: entry.base.answers,
    before: fixtureOutcome(entry.base.outcome),
    representativeFlip: fixtureTrial(entry.example),
  })

  const representative = (Object.keys(ENSEMBLE_SEEDS) as EnsembleKey[]).map((ensemble) => {
    const entries = ranked.filter((entry) => entry.base.ensemble === ensemble)
    return serialize(entries[Math.floor(entries.length / 2)])
  })
  const distinctWorst = [
    ...new Map(
      ranked.map((entry) => [
        `${entry.base.form.key}:${answerFingerprint(entry.base.answers)}`,
        entry,
      ]),
    ).values(),
  ]
  return {
    schemaVersion: 1,
    description:
      "Mechanical response fixtures for reproducing high-influence and representative transitions; not human records or psychometric evidence.",
    worstCaseFixtures: distinctWorst.slice(0, 10).map(serialize),
    representativeExamples: representative,
  }
}

function compareRows(keys: string[]) {
  return (left: Record<string, unknown>, right: Record<string, unknown>) => {
    for (const key of keys) {
      const comparison = String(left[key] ?? "").localeCompare(String(right[key] ?? ""))
      if (comparison !== 0) return comparison
    }
    return 0
  }
}

function toCsv(rows: readonly Record<string, CsvValue>[]) {
  const headers = [...new Set(rows.flatMap((row) => Object.keys(row)))]
  const cell = (value: CsvValue) => {
    const text = value === null || value === undefined ? "" : String(value)
    return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
  }
  return `${headers.join(",")}\n${rows
    .map((row) => headers.map((header) => cell(row[header])).join(","))
    .join("\n")}\n`
}

function outputArgument() {
  const argument = process.argv.find((value) => value.startsWith("--output="))
  return resolve(process.cwd(), argument?.slice("--output=".length) || DEFAULT_OUTPUT)
}

type AcceptedManifest = {
  sourceSha: string
}

function acceptedOutputDirectory() {
  return resolve(process.cwd(), DEFAULT_OUTPUT)
}

function readAcceptedManifest(): AcceptedManifest {
  const path = resolve(acceptedOutputDirectory(), "current-run.json")
  const manifest = JSON.parse(readFileSync(path, "utf8")) as AcceptedManifest
  if (!/^[0-9a-f]{40}$/u.test(manifest.sourceSha)) {
    throw new Error(`Accepted manifest has an invalid source SHA: ${manifest.sourceSha}.`)
  }
  return manifest
}

function currentHeadSha() {
  return execFileSync("git", ["rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim()
}

function sourceShaForOutput(outputDirectory: string) {
  return outputDirectory === acceptedOutputDirectory()
    ? readAcceptedManifest().sourceSha
    : currentHeadSha()
}

function writeArtifacts(
  outputDirectory: string,
  bases: readonly BaseRecord[],
  trials: readonly Trial[],
  sourceSha: string,
) {
  mkdirSync(outputDirectory, { recursive: true })
  const perItemRows = buildPerItemRows(trials)
  const files: Record<string, string> = {
    "per-item-influence.csv": toCsv(perItemRows),
    "transition-matrix.csv": toCsv(buildTransitionRows(trials)),
    "ensemble-summary.csv": toCsv(
      buildEnsembleSummaryRows(bases, trials, perItemRows),
    ),
    "boundary-analysis.csv": toCsv(buildBoundaryRows(bases, trials)),
    "worst-case-fixtures.json": `${JSON.stringify(buildWorstCases(bases, trials), null, 2)}\n`,
  }
  for (const [name, content] of Object.entries(files)) {
    writeFileSync(resolve(outputDirectory, name), content)
  }

  const monotonicity = checkMonotonicity(trials)
  const samples = [...groupBy(bases, (base) => groupKey(base.ensemble, base.form.key))]
    .map(([, rows]) => ({
      ensemble: rows[0].ensemble,
      form: rows[0].form.key,
      count: rows.length,
    }))
    .sort(compareRows(["ensemble", "form"]))
  const manifest = {
    schemaVersion: 1,
    diagnostic: "v23-6-foundation-label-robustness",
    sourceSha,
    deterministic: true,
    generatedAt: null,
    elapsedRuntimeMs: null,
    seeds: ENSEMBLE_SEEDS,
    forms: FORMS.map((form) => ({
      key: form.key,
      group: form.group,
      questionSet: form.questionSet,
      pair: form.pair ?? null,
      calibration: form.calibration,
      itemCount: form.questions.length,
      likertCount: form.questions.filter((question) => question.kind === "likert").length,
      forcedChoiceCount: form.questions.filter((question) => question.kind !== "likert").length,
    })),
    samples,
    totals: {
      baseVectors: bases.length,
      answerPerturbationTrials: trials.filter((trial) => trial.scope === "answer").length,
      postureDimensionTrials: trials.filter((trial) => trial.scope === "posture-dimension").length,
    },
    monotonicity,
    protectedFileDigests: Object.fromEntries(
      PROTECTED_FILES.map((file) => [file, sha256(readFileSync(resolve(process.cwd(), file)))]),
    ),
    artifactDigests: Object.fromEntries(
      Object.entries(files).map(([name, content]) => [name, sha256(content)]),
    ),
    interpretationBoundary:
      "Structural sensitivity only; no reliability, validity, prevalence, or population inference.",
  }
  writeFileSync(
    resolve(outputDirectory, "current-run.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  )
  return manifest
}

function checkAcceptedArtifacts(
  bases: readonly BaseRecord[],
  trials: readonly Trial[],
) {
  const acceptedDirectory = acceptedOutputDirectory()
  const scratchDirectory = mkdtempSync(
    resolve(tmpdir(), "v23-6-foundation-robustness-check-"),
  )
  const acceptedManifest = readAcceptedManifest()

  try {
    const manifest = writeArtifacts(
      scratchDirectory,
      bases,
      trials,
      acceptedManifest.sourceSha,
    )
    const mismatches = GENERATED_FILES.filter((file) =>
      !readFileSync(resolve(scratchDirectory, file)).equals(
        readFileSync(resolve(acceptedDirectory, file)),
      ),
    )
    if (mismatches.length > 0) {
      throw new Error(
        `Accepted Foundation robustness evidence is stale: ${mismatches.join(", ")}.`,
      )
    }
    console.log(
      `Foundation robustness check: ${manifest.totals.baseVectors} base vectors; ` +
        `${manifest.totals.answerPerturbationTrials} answer perturbations; ` +
        `${manifest.totals.postureDimensionTrials} direct posture perturbations.`,
    )
    console.log(
      `All ${GENERATED_FILES.length} generated CSV/JSON artifacts match accepted bytes; ` +
        `${Object.keys(manifest.protectedFileDigests).length} protected file digests match.`,
    )
  } finally {
    rmSync(scratchDirectory, { recursive: true, force: true })
  }
}

const FORMS = buildForms()

function main() {
  if (foundationCoreQuestions.length !== 14) {
    throw new Error(
      `Expected the frozen Foundation v2 core to contain 14 items; found ${foundationCoreQuestions.length}.`,
    )
  }
  const bases = FORMS.flatMap((form) => [
    ...buildUniformEnsemble(form),
    ...buildCalibratedSyntheticEnsemble(form),
    ...buildBoundaryEnsemble(form),
    ...buildCanonicalEnsemble(form),
    ...buildResponseStyleEnsemble(form),
  ])
  const trials = bases.flatMap(perturbBase)
  if (process.argv.includes("--check")) {
    checkAcceptedArtifacts(bases, trials)
    return
  }
  const output = outputArgument()
  const manifest = writeArtifacts(
    output,
    bases,
    trials,
    sourceShaForOutput(output),
  )
  console.log(
    `Foundation robustness diagnostic: ${manifest.totals.baseVectors} base vectors; ` +
      `${manifest.totals.answerPerturbationTrials} answer perturbations; ` +
      `${manifest.totals.postureDimensionTrials} direct posture perturbations.`,
  )
  console.log(`Wrote ${output}`)
}

main()
