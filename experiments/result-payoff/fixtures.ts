import { createHash } from "node:crypto"
import { resolveArchetype } from "@/lib/archetypes"
import { getFoundationResultQuestions, FOUNDATION_INSTRUMENT_VERSION, dimensionLabels } from "@/lib/quiz-schema"
import { generateResult, FOUNDATION_SCORING_VERSION, foundationScoringCalibrationForForm, getV2ScoringCalibration } from "@/lib/scoring"
import { decomposeTopFoundationFamilyDifference } from "@/lib/results/foundation-contributions"
import { getCurrentAiGovernanceVersion, getAiGovernanceVersion } from "@/lib/ai-governance-versions"
import { completionProvenance } from "@/lib/locale-provenance"
import type { Answers } from "@/lib/types"
import type { AiAnswers } from "@/lib/ai-governance-types"
import { compareAi, rankExact, type Claim, type Provenance } from "@/experiments/result-payoff/evidence"

// Authored here from scratch. No saved profiles, PDFs, browser storage or personal records.
export const foundationAnswers: Answers = {
  sc2: 6, v21_sc_rev_02: 2, in2: 7, v21_in_rev_03: 3, df1: 5, v21_df_rev_04: 3,
  ni2: 3, v21_ni_rev_05: 5, pe2: 4, v21_pe_rev_02: 4, rs2: 6, v21_rs_rev_04: 4, oj1: 4, oj2: 5,
}
export const aiAnswers: AiAnswers = {
  rh1: 6, rh2: 2, dp1: 6, dp2: 3, ov1: 6, ov2: 3, gp1: 7, gp2: 7,
  op1: 4, op2: 4, mr1: 4, mr2: 4, lg1: 4, lg2: 4, hf1: 4, hf2: 4,
  capabilityThreshold: "A", rivalBreakthrough: "B", openWeights: "B",
  militaryIntegration: "B", multilateralVerification: "A", futureSociety: "B",
}
const calibration = foundationScoringCalibrationForForm("core")!
export const foundationProvenance: Provenance = {
  instrument: "foundation", bank: FOUNDATION_INSTRUMENT_VERSION, scorer: FOUNDATION_SCORING_VERSION,
  form: `core / analyst scoring / ${calibration}`, copy: completionProvenance("foundation", "en").localeCopyVersion,
  source: "content/instrument/foundation.v2.json; lib/scoring/v2.ts; lib/locale-provenance.ts",
}
const currentAi = getCurrentAiGovernanceVersion()
export const aiProvenance: Provenance = {
  instrument: "ai-governance", bank: currentAi.bankVersion, scorer: currentAi.scoringVersion, form: "standard",
  copy: completionProvenance("aiGovernance", "en").localeCopyVersion,
  source: "content/instrument/ai-governance.v3.json; lib/ai-governance-scoring.ts; lib/locale-provenance.ts",
}
export type SyntheticRecord = { provenance: Provenance; answers?: Answers | AiAnswers; result: unknown; binding: string }
function digest(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex")
}
function binding(record: Omit<SyntheticRecord, "binding">): string {
  // Sorted answer entries bind item evidence, including different answers with identical scores.
  return digest({ provenance: record.provenance, answers: Object.entries(record.answers ?? {}).sort(([a], [b]) => a.localeCompare(b)), result: record.result })
}
export function makeSyntheticRecord(instrument: "foundation" | "ai-governance", suppliedAnswers?: Answers | AiAnswers): SyntheticRecord {
  const foundation = { ...(suppliedAnswers ?? foundationAnswers) } as Answers
  const ai = { ...(suppliedAnswers ?? aiAnswers) } as AiAnswers
  const record = instrument === "foundation"
    ? { provenance: foundationProvenance, answers: foundation, result: generateResult(foundation, "analyst", calibration) }
    : { provenance: aiProvenance, answers: ai, result: currentAi.scoring.generateAiGovernanceResult(ai, "standard") }
  return { ...record, binding: binding(record) }
}
/** Exact synthetic binding plus complete issued-form validation; never reverse-engineer answers. */
export function qualifyRecord(record: SyntheticRecord): boolean {
  if (!record.answers || record.binding !== binding(record)) return false
  const foundation = record.provenance.instrument === "foundation"
  if (JSON.stringify(record.provenance) !== JSON.stringify(foundation ? foundationProvenance : aiProvenance)) return false
  const answers = record.answers
  if (foundation) {
    const questions = getFoundationResultQuestions("core")
    if (Object.keys(answers).length !== questions.length || !questions.every(q => q.kind === "likert" && Number.isInteger(answers[q.id]) && Number(answers[q.id]) >= 1 && Number(answers[q.id]) <= 7)) return false
    return JSON.stringify(generateResult(answers as Answers, "analyst", calibration)) === JSON.stringify(record.result)
  }
  const v = getAiGovernanceVersion(Number(record.provenance.bank), Number(record.provenance.scorer))
  if (!v) return false
  const core = v.schema.getAiCoreQuestions("standard")
  const sequence = v.scoring.getAiScenarioSequence(answers as AiAnswers, "standard")
  if (Object.keys(answers).length !== core.length + sequence.length) return false
  if (!core.every(q => Number.isInteger(answers[q.id]) && Number(answers[q.id]) >= 1 && Number(answers[q.id]) <= 7)) return false
  if (!sequence.every(q => v.schema.getScenarioOptions(q, "standard").some(o => o.id === answers[q.id]))) return false
  return JSON.stringify(v.scoring.generateAiGovernanceResult(answers as AiAnswers, "standard")) === JSON.stringify(record.result)
}
/** Applicability is separate from integrity. These predicates license only the named
 * authored observations below; they do not synthesize a reading for arbitrary results. */
export const authoredClaimApplies = {
  foundationPreparation: (a: Answers | AiAnswers) => ["sc2", "in2", "rs2"].every(id => typeof a[id] === "number" && Number(a[id]) >= 6),
  aiCautionAndScrutiny: (a: Answers | AiAnswers) => Number(a.rh1) >= 6 && a.capabilityThreshold === "A" && a.openWeights === "B",
  aiRivalryAndCoordination: (a: Answers | AiAnswers) => Number(a.gp1) >= 6 && Number(a.gp2) >= 6,
}
export const authoredReadingUnavailable = "These complete answers do not support this authored reading. A valid binding verifies which answers belong to the result; it does not make this example's interpretation applicable. Try the specific follow-up below."
export function foundationExample(record = makeSyntheticRecord("foundation")) {
  if (!qualifyRecord(record) || record.provenance.instrument !== "foundation") return null
  if (!authoredClaimApplies.foundationPreparation(record.answers!)) return null
  const result = generateResult(record.answers as Answers, "analyst", calibration)
  const archetype = resolveArchetype(result, getV2ScoringCalibration(calibration).lowDifferentiationThreshold)
  // The surrounding rival argument is authored for these two nearby families only.
  if (archetype.code !== "P/R-" || result.familyKey !== "institutionalist" || result.runnerUpKey !== "realist" || result.nearestFitGap > 0.5) return null
  const decomposition = decomposeTopFoundationFamilyDifference(result.dimensionScores, calibration)
  const { tied } = rankExact(result.familyScores)
  const evidence = ["sc2", "in2", "rs2"].map(id => {
    const question = getFoundationResultQuestions("core").find(q => q.id === id)!
    return { id, text: question.prompt, answer: Number(record.answers![id]) }
  })
  const claim: Claim = {
    id: "foundation-cooperation-with-preparation", provenance: record.provenance,
    kind: "editorial interpretation", refs: evidence.map(e => ({ id: e.id, text: `${e.text} Answer: ${e.answer}/7.` })),
    text: "In these responses, military preparation sits alongside support for agreements that use monitoring when trust is thin. Giving priority to avoiding overextension adds a limit on how far this example would press an advantage. Together, the three answers leave room for both an institutional and a realist reading.",
    supports: "This example accepts military preparation and monitoring-based agreements together, while giving avoiding overextension priority over taking every opening.",
    doesNotSupport: "These answers do not establish which institution the reader would accept, or how they would act in a crisis.",
  }
  return { result, archetype, evidence, claim, comparison: {
    primary: result.familyLabel, alternative: result.runnerUpLabel, primaryScore: decomposition.displayed.primary,
    alternativeScore: decomposition.displayed.runnerUp, tied: tied.length > 1 ? tied : [],
    terms: decomposition.rows.map(r => ({ axis: dimensionLabels[r.dimension], term: r.signedContribution })), residual: decomposition.roundingResidual,
  } }
}
export function aiExample(record = makeSyntheticRecord("ai-governance")) {
  if (!qualifyRecord(record) || record.provenance.instrument !== "ai-governance") return null
  if (!authoredClaimApplies.aiCautionAndScrutiny(record.answers!)) return null
  const result = currentAi.scoring.generateAiGovernanceResult(record.answers as AiAnswers, "standard")
  // Stewardship and the accountability rival are one display hypothesis, not a title mapper.
  const comparison = compareAi(result.axisScores, Number(record.provenance.bank), Number(record.provenance.scorer))!
  if (result.archetypeKey !== "precautionarySteward" || comparison.alternative !== currentAi.scoring.archetypeLabels.democraticGuardrailist || comparison.tied.length > 1) return null
  const core = currentAi.schema.getAiCoreQuestions("standard")
  const evidence = ["rh1", "capabilityThreshold", "openWeights"].map(id => {
    const question = core.find(q => q.id === id)
    const scenario = currentAi.schema.aiScenarioQuestions[id]
    const answer = record.answers![id]
    return { id, text: question?.prompt ?? scenario.prompt,
      answer: typeof answer === "number" ? `${answer}/7` : currentAi.schema.getScenarioOptions(scenario, "standard").find(o => o.id === answer)!.label }
  })
  const pair = ["gp1", "gp2"].map(id => ({ id, text: core.find(q => q.id === id)!.prompt, answer: Number(record.answers![id]) }))
  const claim: Claim = {
    id: "ai-contain-capability-preserve-scrutiny", provenance: record.provenance, kind: "editorial interpretation",
    refs: evidence.map(e => ({ id: e.id, text: `${e.text} Answer: ${e.answer}` })),
    text: "These responses give severe frontier risks substantial weight. In the cyber-capability scenario, this example pauses broader release while the evidence is tested; in the access scenario, it retains monitored outside evaluation. That combination supports caution about release alongside scrutiny, without establishing that the model is certainly dangerous or that the controls would work.",
    supports: "The example gives severe frontier risks weight, pauses broader release after a cyber threshold, and still chooses monitored access for outside testing.",
    doesNotSupport: "It does not endorse unrestricted weight release or establish that the proposed controls would work.",
  }
  const pairClaim: Claim | null = authoredClaimApplies.aiRivalryAndCoordination(record.answers!) ? {
    id: "ai-rivalry-and-coordination", provenance: record.provenance, kind: "direct observation",
    refs: pair.map(e => ({ id: e.id, text: `${e.text} Answer: ${e.answer}/7.` })),
    text: "This example expects rivalry and gives coordination priority.",
    supports: "Both recorded responses endorse their respective statements. They remain visible separately; neither substitutes for the other.",
    doesNotSupport: "The average is not evidence of moderation or indecision. Agreement with both statements is not a better or more mature answer.",
  } : null
  const controlledPairs = [7, 1, 4].map(value => currentAi.scoring.generateAiGovernanceResult({ ...record.answers as AiAnswers, gp1: value, gp2: value }, "standard"))
  const pairDiagnostic = { identical: controlledPairs.every(r => JSON.stringify(r) === JSON.stringify(controlledPairs[0])), finalGeopolitics: controlledPairs[0].axisScores.geopolitics }
  return { result, evidence, pair, claim, pairClaim, comparison, pairDiagnostic }
}
