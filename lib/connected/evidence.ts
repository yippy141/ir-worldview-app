import { resolveFoundationPayload } from "@/lib/share"
import { resolveAiPayload, aiPayloadToAxisScores } from "@/lib/ai-governance-share"
import { resolveModulePayload } from "@/lib/modules/framework"
import { MODULE_SLUGS } from "@/lib/modules/types"
import { traditionNounLabel } from "@/lib/worldview-config"
import { DIMENSION_POLES } from "@/lib/results/dimension-bands"
import { aiAxisPoles } from "@/lib/ai-governance-results"
import { dimensionLabels } from "@/lib/quiz-schema"
import type { ProfileStore } from "@/lib/profile-store"
import type { FoundationLocalEvidenceSet } from "@/lib/results/local-evidence"
import type { AiCompletionEvidence } from "@/lib/results/ai-completion-evidence"

// Additive relation contract v1. Does not modify module manifest schema v1,
// permit numeric pooling, rescore answers, or supply missing administrations.
export const DOMAINS = ["foundation", ...MODULE_SLUGS, "ai"] as const
export type Domain = typeof DOMAINS[number]
export const DOMAIN_LABELS: Record<Domain, string> = { foundation: "Foundation", security: "Security", technology: "Technology", ai: "AI Governance" }
export type SourceKind = "exact-decision" | "explanation" | "actor-role-judgment" | "self-reported-reason" | "derived-score" | "editorial-reference" | "unscored-reflection"
export type Provenance = {
  bank: number | null; scorer: number | null; form: string | null
  language: string | null; copy: number | null
  exposureSource: "issued" | "declared" | "unknown"
}
export type Observation = {
  id: string; domain: Domain; resultId: string; provenance: Provenance; kind: SourceKind
  context: string; text: string; questionId?: string; choiceId?: string; secondChoice?: string
  value?: number; visibility: "local" | "supplied"; permittedUse: "describe-and-relate" | "describe-only"
}
export type ResultEvidence = {
  domain: Domain; resultId: string; title: string; provenance: Provenance
  scores: Record<string, number>; labels: Record<string, string>; poles?: Record<string, { low: string; high: string }>; observations: Observation[]
  missingness: string | null
}
export type EvidenceBundle = Partial<Record<Domain, ResultEvidence>>
export type Exposure = { language: string | null; copy: number | null; form?: string | null; declared?: boolean }
const unknownExposure: Exposure = { language: null, copy: null }

export function evidenceFromToken(domain: Domain, token: string, exposure: Exposure = unknownExposure, visibility: Observation["visibility"] = "supplied"): ResultEvidence | null {
  let provenance: Provenance
  let title: string
  let scores: Record<string, number>
  let labels: Record<string, string>
  let poles: Record<string, { low: string; high: string }>
  const observations: Observation[] = []
  let missingness: string | null = null
  if (domain === "foundation") {
    const r = resolveFoundationPayload(token)
    if (!r) return null
    const p = r.provenance
    provenance = { bank: p.instrumentVersion, scorer: p.scoringVersion, form: r.questionSet ? `${r.questionSet}:${r.targetedFamilyPair?.join("|") ?? ""}` : null, language: p.localeCopyVersion > 0 ? p.completionLocale : null, copy: p.localeCopyVersion || null, exposureSource: r.payload.v === 5 ? "issued" : "unknown" }
    title = traditionNounLabel(r.result.familyKey)
    scores = r.dimensionScores
    labels = dimensionLabels
    poles = DIMENSION_POLES
    missingness = "The underlying answers are not included in this link."
  } else if (domain === "ai") {
    const r = resolveAiPayload(token)
    if (!r) return null
    provenance = { bank: r.bankVersion, scorer: r.scoringVersion, form: exposure.form ?? null, language: exposure.language, copy: exposure.copy, exposureSource: exposure.declared ? "declared" : exposure.copy ? "issued" : "unknown" }
    title = r.scoring.archetypeLabels[r.payload.ak]
    scores = aiPayloadToAxisScores(r.payload)
    labels = r.schema.aiAxisLabels
    poles = aiAxisPoles
    missingness = "The AI scores are available; the underlying choices are not included."
  } else {
    const r = resolveModulePayload(token)
    if (!r || r.payload.slug !== domain) return null
    provenance = { bank: r.bankVersion, scorer: r.scoringVersion, form: r.payload.mode, language: exposure.language, copy: exposure.copy, exposureSource: exposure.declared ? "declared" : exposure.copy ? "issued" : "unknown" }
    const result = r.runtime.buildModuleResult(r.definition, r.payload.mode, r.payload.answers)
    title = result.headline
    scores = result.scores
    labels = Object.fromEntries(r.definition.axes.map(a => [a.key, a.label]))
    poles = Object.fromEntries(r.definition.axes.map(a => [a.key, { low: a.lowLabel, high: a.highLabel }]))
    for (const { question, primary, secondary } of r.runtime.getSelectedModuleOptions(r.definition, r.payload.mode, r.payload.answers)) {
      if (!primary) continue
      const kind = question.cardType === "actorLens" ? "actor-role-judgment" : question.cardType === "explanation" ? "explanation" : "exact-decision"
      observations.push({ id: question.id, questionId: question.id, domain, resultId: token, provenance, kind, context: `${question.title}: ${question.prompt}`, text: `${primary.title}. ${primary.label}`, choiceId: primary.id, secondChoice: secondary ? `${secondary.title}. ${secondary.label}` : undefined, visibility, permittedUse: kind === "actor-role-judgment" ? "describe-only" : "describe-and-relate" })
    }
    const count = r.runtime.getModuleQuestions(r.definition, r.payload.mode).filter(q => q.cardType !== "actorLens").length
    if (observations.filter(o => o.kind !== "actor-role-judgment").length !== count) missingness = "Some scored answers are absent; the preserved calculation is incomplete."
  }
  for (const [id, value] of Object.entries(scores)) observations.push({ id: `score:${id}`, domain, resultId: token, provenance, kind: "derived-score", context: labels[id], text: `${labels[id]}: ${value.toFixed(2)} of 7`, value, visibility, permittedUse: "describe-and-relate" })
  return { domain, resultId: token, title, provenance, scores, labels, poles, observations, missingness }
}

export function evidenceFromProfile(profile: ProfileStore, visibility: Observation["visibility"] = "local"): EvidenceBundle {
  const bundle: EvidenceBundle = {}
  if (profile.foundation) bundle.foundation = evidenceFromToken("foundation", profile.foundation.payload, undefined, visibility) ?? undefined
  for (const domain of MODULE_SLUGS) {
    const s = profile.modules[domain]
    if (s?.payload) bundle[domain] = evidenceFromToken(domain, s.payload, { language: s.locale, copy: s.localeCopyVersion || null }, visibility) ?? undefined
    // Score-only legacy module snapshots have no registered scorer/form tuple.
    else if (s) bundle[domain] = { domain, resultId: s.resultPath, title: s.headline, provenance: { bank: s.instrumentVersion, scorer: null, form: s.mode, language: s.locale, copy: s.localeCopyVersion || null, exposureSource: "unknown" }, scores: s.scores, labels: Object.fromEntries(Object.keys(s.scores).map(k => [k, k])), observations: [], missingness: "The original questionnaire details and choices are unavailable." }
  }
  if (profile.aiGovernance) {
    const s = profile.aiGovernance
    bundle.ai = evidenceFromToken("ai", s.payload, { language: s.locale, copy: s.localeCopyVersion || null }, visibility) ?? undefined
  }
  return Object.fromEntries(Object.entries(bundle).filter(([, result]) => result !== undefined))
}

/** Call only with the existing full-tuple, completion-ID-bound lookup result. */
export function withFoundationEvidence(bundle: EvidenceBundle, exact: FoundationLocalEvidenceSet): EvidenceBundle {
  if (!bundle.foundation) return bundle
  const r = bundle.foundation
  const observations = exact.records.map(row => ({ id: row.itemId, questionId: row.itemId, domain: "foundation" as const, resultId: r.resultId, provenance: r.provenance, kind: "exact-decision" as const, context: row.prompt, text: row.selectedLabel, choiceId: row.selectedOptionId, ...(row.alternative.kind === "actual-second-choice" ? { secondChoice: row.alternative.label } : {}), visibility: "local" as const, permittedUse: "describe-and-relate" as const }))
  return { ...bundle, foundation: { ...r, observations: [...observations, ...r.observations] } }
}

export function withAiEvidence(bundle: EvidenceBundle, exact: AiCompletionEvidence): EvidenceBundle {
  if (bundle.ai?.resultId !== exact.payload) return bundle
  const r = bundle.ai
  const provenance: Provenance = { bank: exact.bank, scorer: exact.scorer, form: exact.mode, language: exact.locale, copy: 1, exposureSource: "issued" }
  const observations = exact.observations.map(row => ({ id: row.id, questionId: row.id, domain: "ai" as const, resultId: r.resultId, provenance, kind: "exact-decision" as const, context: row.prompt, text: row.selection, value: row.value, secondChoice: row.secondary, visibility: "local" as const, permittedUse: "describe-and-relate" as const }))
  return { ...bundle, ai: { ...r, provenance, missingness: null, observations: [...observations, ...r.observations.map(o => ({ ...o, provenance }))] } }
}

export type Comparability = { status: "comparable" | "missing" | "incompatible" | "unknown" | "incomplete"; reason: string; ruleId: string }
export function compareProvenance(left?: ResultEvidence, right?: ResultEvidence): Comparability {
  const ruleId = "same-administration-v1"
  if (!left || !right) return { status: "missing", reason: "Only one person supplied this subject. It counts as neither agreement nor difference.", ruleId }
  if (left.domain !== right.domain) return { status: "incompatible", reason: "These questionnaires measure different subjects.", ruleId }
  const fields = ["bank", "scorer", "form", "language", "copy"] as const
  // A known difference stays incompatible even if other fields are unknown.
  if (fields.some(k => left.provenance[k] !== null && right.provenance[k] !== null && left.provenance[k] !== right.provenance[k])) return { status: "incompatible", reason: "The questionnaire editions, forms or languages differ. Read these results independently.", ruleId }
  if (fields.some(k => left.provenance[k] === null || right.provenance[k] === null)) return { status: "unknown", reason: "The original form, language or wording is not fully known. Score differences are withheld.", ruleId }
  if (left.domain !== "foundation" && [left, right].some(r => r.provenance.language !== "en" || r.provenance.copy !== 1 || !["standard", "analyst"].includes(r.provenance.form!))) return { status: "incompatible", reason: "No reviewed mapping supports this language, wording or form for this subject.", ruleId }
  if ([left, right].some(r => r.domain !== "foundation" && r.domain !== "ai" && r.missingness)) return { status: "incomplete", reason: "Some scored answers are absent. Score differences are withheld.", ruleId }
  return { status: "comparable", reason: "Same registered bank, scorer, form, language and wording edition.", ruleId }
}

/** Voluntary completion details can fill missing provenance, never replace issued facts. */
export function withDeclaredExposure(bundle: EvidenceBundle, exposure?: Exposure): EvidenceBundle {
  if (!exposure) return bundle
  return Object.fromEntries(Object.entries(bundle).map(([domain, result]) => {
    const p = result.provenance
    const patch = {
      ...(p.language === null && exposure.language ? { language: exposure.language } : {}),
      ...(p.copy === null && exposure.copy ? { copy: exposure.copy } : {}),
      ...(domain === "ai" && p.form === null && exposure.form ? { form: exposure.form } : {}),
    }
    return [domain, { ...result, provenance: { ...p, ...patch, ...(Object.keys(patch).length ? { exposureSource: "declared" as const } : {}) } }]
  }))
}
