import assert from "node:assert/strict"
import test from "node:test"
import {
  consumeFoundationEvidenceHandoff,
  deleteFoundationLocalEvidence,
  deleteFoundationLocalEvidenceForPayload,
  foundationPayloadDigest,
  lookupFoundationLocalEvidence,
  persistFoundationLocalEvidence,
} from "@/lib/results/local-evidence"
import {
  foundationScoringCalibrationForForm,
  generateResult,
} from "@/lib/scoring"
import {
  buildFoundationSharePayload,
  encodePayload,
} from "@/lib/share"
import { getFoundationResultQuestions } from "@/lib/quiz-schema"
import {
  FOUNDATION_LOCAL_EVIDENCE_STORAGE_KEY,
} from "@/lib/storage-keys"
import type {
  Answers,
  Question,
} from "@/lib/types"

class MemoryStorage {
  readonly values = new Map<string, string>()

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

const questionSet = "core" as const
const calibration = foundationScoringCalibrationForForm(questionSet)
assert.ok(calibration)

const questions = getFoundationResultQuestions(questionSet)
const answers = Object.fromEntries(
  questions.map((question, index) => [
    question.id,
    answerForQuestion(question, index),
  ]),
) satisfies Answers
const result = generateResult(answers, "analyst", calibration)
const payload = encodePayload(
  buildFoundationSharePayload(result, "en", questionSet),
)

test("generation stores only a full binding and at most three derived records", async () => {
  const localStorage = new MemoryStorage()
  const sessionStorage = new MemoryStorage()
  const evidence = await persistFoundationLocalEvidence({
    storage: localStorage,
    sessionStorage,
    payload,
    answers,
    completionLocale: "en",
    questionSet,
    mode: "analyst",
    scoringCalibration: calibration,
    localCompletionId: "completion-a",
    now: 100,
  })

  assert.equal(evidence.binding.localCompletionId, "completion-a")
  assert.equal(evidence.binding.questionSet, "core")
  assert.equal(evidence.binding.formId, "core")
  assert.equal(evidence.binding.calibrationId, "core")
  assert.equal(evidence.binding.resolvedFamily, result.familyKey)
  assert.equal(evidence.binding.resolvedRunnerUp, result.runnerUpKey)
  assert.equal(evidence.binding.strategyModifier, result.strategyModifier)
  assert.equal(evidence.binding.normativeModifier, result.normativeModifier)
  assert.match(evidence.binding.payloadDigest, /^sha256:[a-f0-9]{64}$/u)
  assert.ok(evidence.records.length > 0)
  assert.ok(evidence.records.length <= 3)

  const persisted = localStorage.getItem(FOUNDATION_LOCAL_EVIDENCE_STORAGE_KEY)
  assert.ok(persisted)
  assert.doesNotMatch(persisted, /"answers"\s*:/u)
  assert.doesNotMatch(persisted, /reversalCondition/u)
  assert.equal(
    evidence.records.every(
      (record) =>
        record.alternative.kind === "actual-second-choice" ||
        record.alternative.kind === "model-selected-nearest-alternative",
    ),
    true,
  )
})

test("exact handoff matches while a shared result and a tuple mismatch fail closed", async () => {
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
    localCompletionId: "completion-match",
  })

  const digest = await foundationPayloadDigest(payload)
  assert.ok(digest)
  const handoff = consumeFoundationEvidenceHandoff(sessionStorage, digest)
  assert.ok(handoff)
  assert.equal(
    lookupFoundationLocalEvidence(localStorage, payload, digest, handoff).status,
    "available",
  )
  assert.deepEqual(
    lookupFoundationLocalEvidence(localStorage, payload, digest, null),
    { status: "unavailable", reason: "no-local-binding" },
  )

  const raw = localStorage.getItem(FOUNDATION_LOCAL_EVIDENCE_STORAGE_KEY)
  assert.ok(raw)
  const changed = JSON.parse(raw)
  changed.completions[0].binding.resolvedRunnerUp = result.familyKey
  localStorage.setItem(FOUNDATION_LOCAL_EVIDENCE_STORAGE_KEY, JSON.stringify(changed))
  assert.deepEqual(
    lookupFoundationLocalEvidence(localStorage, payload, digest, handoff),
    { status: "unavailable", reason: "tuple-mismatch" },
  )
})

test("legacy results report unavailable without consulting local records", async () => {
  const legacyPayload = encodePayload({
    v: 2,
    ds: [4, 4, 4, 4, 4, 4, 4],
    fk: "realist",
    nk: "institutionalist",
    sm: "Hedger",
    nm: "Conditional Solidarist",
  })
  const digest = await foundationPayloadDigest(legacyPayload)
  assert.ok(digest)

  assert.deepEqual(
    lookupFoundationLocalEvidence(
      new MemoryStorage(),
      legacyPayload,
      digest,
      {
        v: 1,
        localCompletionId: "legacy",
        payloadDigest: digest,
        mode: "standard",
      },
    ),
    { status: "unavailable", reason: "legacy" },
  )
})

test("deletion can target one completion or every record bound to a payload", async () => {
  const localStorage = new MemoryStorage()
  const sessionStorage = new MemoryStorage()
  for (const localCompletionId of ["completion-one", "completion-two"]) {
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
    })
  }

  assert.equal(
    deleteFoundationLocalEvidence(localStorage, "completion-one"),
    true,
  )
  assert.equal(
    deleteFoundationLocalEvidence(localStorage, "completion-one"),
    false,
  )
  assert.equal(
    await deleteFoundationLocalEvidenceForPayload(localStorage, payload),
    1,
  )
  assert.equal(localStorage.getItem(FOUNDATION_LOCAL_EVIDENCE_STORAGE_KEY), null)
})

test("a payload or exact-form mismatch is rejected before anything is persisted", async () => {
  const localStorage = new MemoryStorage()
  const sessionStorage = new MemoryStorage()
  const mismatchedAnswers = { ...answers }
  const first = questions[0]
  mismatchedAnswers[first.id] = first.kind === "likert"
    ? ((Number(answers[first.id]) % 7) + 1)
    : first.options.find(({ id }) => id !== selectedId(answers[first.id]))?.id ?? answers[first.id]

  await assert.rejects(
    persistFoundationLocalEvidence({
      storage: localStorage,
      sessionStorage,
      payload,
      answers: mismatchedAnswers,
      completionLocale: "en",
      questionSet,
      mode: "analyst",
      scoringCalibration: calibration,
    }),
    /do not match the encoded Foundation result tuple/u,
  )
  assert.equal(localStorage.getItem(FOUNDATION_LOCAL_EVIDENCE_STORAGE_KEY), null)
})

test("targeted and full forms bind to their exact calibration and question set", async () => {
  const forms = [
    {
      questionSet: "targetedExtended" as const,
      targetedFamilyPair: ["realist", "institutionalist"] as const,
    },
    {
      questionSet: "fullExtended" as const,
      targetedFamilyPair: undefined,
    },
  ]

  for (const form of forms) {
    const formCalibration = foundationScoringCalibrationForForm(
      form.questionSet,
      form.targetedFamilyPair,
    )
    assert.ok(formCalibration)
    const formQuestions = getFoundationResultQuestions(
      form.questionSet,
      form.targetedFamilyPair,
    )
    const formAnswers = Object.fromEntries(
      formQuestions.map((question, index) => [
        question.id,
        answerForQuestion(question, index),
      ]),
    ) satisfies Answers
    const formResult = generateResult(formAnswers, "analyst", formCalibration)
    const formPayload = encodePayload(
      buildFoundationSharePayload(
        formResult,
        "en",
        form.questionSet,
        form.targetedFamilyPair,
      ),
    )
    const evidence = await persistFoundationLocalEvidence({
      storage: new MemoryStorage(),
      sessionStorage: new MemoryStorage(),
      payload: formPayload,
      answers: formAnswers,
      completionLocale: "en",
      questionSet: form.questionSet,
      targetedFamilyPair: form.targetedFamilyPair,
      mode: "analyst",
      scoringCalibration: formCalibration,
      localCompletionId: `completion-${form.questionSet}`,
    })

    assert.equal(evidence.binding.questionSet, form.questionSet)
    assert.equal(evidence.binding.calibrationId, formCalibration)
    assert.equal(
      evidence.binding.formId,
      form.questionSet === "targetedExtended"
        ? "targetedExtended:realist|institutionalist"
        : "fullExtended",
    )
  }
})

test("Simplified Chinese evidence stores approved localized prompts and labels", async () => {
  const zhPayload = encodePayload(
    buildFoundationSharePayload(result, "zh-Hans", questionSet),
  )
  const evidence = await persistFoundationLocalEvidence({
    storage: new MemoryStorage(),
    sessionStorage: new MemoryStorage(),
    payload: zhPayload,
    answers,
    completionLocale: "zh-Hans",
    questionSet,
    mode: "analyst",
    scoringCalibration: calibration,
    localCompletionId: "completion-zh",
  })

  assert.equal(evidence.binding.completionLocale, "zh-Hans")
  assert.ok(evidence.records.length > 0)
  assert.match(
    `${evidence.records[0].prompt}${evidence.records[0].selectedLabel}`,
    /[\u3400-\u9fff]/u,
  )
})

test("local evidence fails closed when the page and completion locales differ", async () => {
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
    localCompletionId: "completion-locale",
  })

  const digest = await foundationPayloadDigest(payload)
  assert.ok(digest)
  const handoff = consumeFoundationEvidenceHandoff(sessionStorage, digest)
  assert.ok(handoff)
  assert.deepEqual(
    lookupFoundationLocalEvidence(
      localStorage,
      payload,
      digest,
      handoff,
      "zh-Hans",
    ),
    { status: "unavailable", reason: "locale-mismatch" },
  )
})

function answerForQuestion(question: Question, index: number) {
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

function selectedId(answer: Answers[string]) {
  return typeof answer === "string"
    ? answer
    : typeof answer === "object" && answer !== null
      ? answer.primary
      : null
}
