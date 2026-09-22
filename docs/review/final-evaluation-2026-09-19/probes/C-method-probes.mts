import { pathToFileURL } from "node:url"
import { createRequire } from "node:module"
import { register } from "node:module"

import {
  buildCanonicalFoundationResult,
  generateResult,
} from "@/lib/scoring/v2"
import { resolveArchetype } from "@/lib/archetypes"
import {
  foundationCoreQuestions,
  getFoundationQuestionsForSet,
} from "@/lib/quiz-schema"
import type { Answers, DimensionKey } from "@/lib/types"

const DIMENSIONS: DimensionKey[] = [
  "securityCompetition",
  "institutions",
  "domesticFilters",
  "normsIdentity",
  "politicalEconomy",
  "restraint",
  "orderJustice",
]

function buildAnswers(valueFor: (q: (typeof foundationCoreQuestions)[number]) => number | string): Answers {
  const answers: Answers = {}
  for (const q of foundationCoreQuestions) {
    answers[q.id] = valueFor(q) as never
  }
  return answers
}

const all4 = buildAnswers(() => 4)
const all7 = buildAnswers(() => 7)
const all1 = buildAnswers(() => 1)

const byId = new Map(foundationCoreQuestions.map((q) => [q.id, q]))

const firstForward = foundationCoreQuestions.find((q) => q.kind === "likert" && !q.reverse)!
const firstReverse = foundationCoreQuestions.find((q) => q.kind === "likert" && q.reverse)!
const secondForward = foundationCoreQuestions.filter((q) => q.kind === "likert" && !q.reverse)[1]!
const secondReverse = foundationCoreQuestions.filter((q) => q.kind === "likert" && q.reverse)[1]!

const forward7reverse1: Answers = buildAnswers(q => q.kind === "likert" && q.reverse ? 1 : 7)
const forward1reverse7: Answers = buildAnswers(q => q.kind === "likert" && q.reverse ? 7 : 1)

console.log("=== Core likert sanity ===")
console.log("forward item:", firstForward.id, "reverse item:", firstReverse.id)

const variedRaw = [6,5,6,3,5,3,6,2,5,3,6,3,6,5] as const
const variedAnswers: Answers = {}
foundationCoreQuestions.forEach((q, i) => {
  if (q.kind === "likert") {
    const raw = variedRaw[i % variedRaw.length]
    variedAnswers[q.id] = raw as never
  } else {
    variedAnswers[q.id] = (q.options?.[0]?.id ?? "a") as never
  }
})

function report(label: string, answers: Answers) {
  const result = generateResult(answers, "analyst", "core")
  const archetype = resolveArchetype(result)
  console.log(`--- ${label} ---`)
  console.log("dimensions:", result.dimensionScores)
  console.log("familyScores:", result.familyScores)
  console.log("family:", result.familyKey, result.familyLabel)
  console.log("runnerUp:", result.runnerUpKey, result.runnerUpLabel)
  console.log("gap:", result.nearestFitGap.toFixed(3))
  console.log("strategy:", result.strategyModifier, "normative:", result.normativeModifier)
  console.log("archetype:", archetype.code, archetype.name)
  return result
}

console.log("\n=== Aggregate checks ===")
report("all4", all4)
report("all7", all7)
report("all1", all1)
report("all forward=7 all reverse=1", forward7reverse1)
report("all forward=1 all reverse=7", forward1reverse7)
report("varied sequence", variedAnswers)

console.log("\n=== Single-item sweep (all others at 4) ===")
for (const q of foundationCoreQuestions) {
  if (q.kind !== "likert") continue
  const results: string[] = []
  for (let v = 1; v <= 7; v++) {
    const answers: Answers = { ...all4, [q.id]: v as never }
    const r = buildCanonicalFoundationResult(
      generateCoreScores(answers),
      "core",
    )
    results.push(`${v}:${r.familyKey}`)
  }
  const changed = new Set(results.map((s) => s.split(":")[1]))
  console.log(`${q.id} dim=${q.dimension} rev=${q.reverse ? "Y" : "N"} -> ${results.join(" ")}${changed.size > 1 ? "  [CHANGES]" : ""}`)
}

function generateCoreScores(answers: Answers) {
  const r = generateResult({ ...answers }, "analyst", "core")
  return r.dimensionScores
}

console.log("\n=== Order/justice dimension sweep ===")
{
  const base = buildCanonicalFoundationResult(generateCoreScores(all4), "core")
  console.log("all4 family:", base.familyKey, "normative:", base.normativeModifier)
  for (let v = 1; v <= 7; v++) {
    const answers = varyDimension(all4, "orderJustice", v)
    const r = buildCanonicalFoundationResult(generateCoreScores(answers), "core")
    console.log(`oj=${v} dim=${r.dimensionScores.orderJustice} family=${r.familyKey} normative=${r.normativeModifier}`)
  }
}

console.log("\n=== Restraint dimension sweep ===")
{
  const base = buildCanonicalFoundationResult(generateCoreScores(all4), "core")
  console.log("all4 family:", base.familyKey, "strategy:", base.strategyModifier)
  for (let v = 1; v <= 7; v++) {
    const answers = varyDimension(all4, "restraint", v)
    const r = buildCanonicalFoundationResult(generateCoreScores(answers), "core")
    console.log(`rs=${v} dim=${r.dimensionScores.restraint} family=${r.familyKey} strategy=${r.strategyModifier}`)
  }
}

function varyDimension(base: Answers, dim: DimensionKey, value: number): Answers {
  const out: Answers = { ...base }
  for (const q of foundationCoreQuestions) {
    if (q.kind === "likert" && q.dimension === dim) {
      out[q.id] = (q.reverse ? 8 - value : value) as never
    }
  }
  return out
}

console.log("\n=== Bank coverage ===")
const perDim: Record<string, { fwd: string[]; rev: string[] }> = {}
for (const d of DIMENSIONS) perDim[d] = { fwd: [], rev: [] }
for (const q of foundationCoreQuestions) {
  if (q.kind !== "likert" || q.scoringBlock !== "core") continue
  const bucket = q.reverse ? perDim[q.dimension].rev : perDim[q.dimension].fwd
  bucket.push(q.id)
}
for (const d of DIMENSIONS) {
  const { fwd, rev } = perDim[d]
  console.log(`${d}: total=${fwd.length + rev.length} fwd=[${fwd.join(",")}] rev=[${rev.join(",")}]`)
}
console.log("total core items:", foundationCoreQuestions.length)
console.log("displayed order:", foundationCoreQuestions.map((q) => q.id).join(", "))