import { futureCatalogue, catalogueVersion } from "@/lib/futures/catalogue/index"
import { featureDefinitions, featureIds, type FeatureId, type Domain } from "@/lib/futures/catalogue/features"
import type { FutureScenario } from "@/lib/futures/catalogue/types"
import { hasDirection, preferenceQuestionVersion, type PreferenceAnswers } from "@/lib/futures/preferences"

export const matchingVersion = "futures-preferences-0.2"
export type ScenarioComparison = {
  scenario: FutureScenario
  supported: FeatureId[]
  conflicts: FeatureId[]
  unresolved: FeatureId[]
  inapplicable: FeatureId[]
  hardConflicts: FeatureId[]
  unconfirmedConstraints: FeatureId[]
  knownDomains: number
  supportDomains: number
  // Internal ordering only. Never an outcome probability or identity score.
  orderingValue: number
  detailSufficient: boolean
  agreementSufficient: boolean
  evidenceSufficient: boolean
}
export function comparePreferences(scenario: FutureScenario, answers: PreferenceAnswers): ScenarioComparison {
  const supported: FeatureId[] = [], conflicts: FeatureId[] = [], unresolved: FeatureId[] = [], inapplicable: FeatureId[] = [], hardConflicts: FeatureId[] = [], unconfirmedConstraints: FeatureId[] = []
  const domains = new Map<Domain, number[]>(), known = new Set<Domain>(), support = new Set<Domain>()
  for (const [key, answer] of Object.entries(answers)) {
    const id = key as FeatureId
    if (!(id in featureDefinitions) || !hasDirection(answer)) continue
    const domain = featureDefinitions[id].domain, state = scenario.features[id]
    let value = 0
    if (state === "inapplicable" || (scenario.comparisonKind === "catastrophic-endpoint" && state === answer.choice)) {
      inapplicable.push(id)
      if (answer.nonNegotiable) unconfirmedConstraints.push(id)
    } else if (state === "present" || state === "absent") {
      known.add(domain)
      if (state === answer.choice) { supported.push(id); support.add(domain); value = 1 }
      else { conflicts.push(id); value = -1; if (answer.nonNegotiable) hardConflicts.push(id) }
    } else { unresolved.push(id); if (answer.nonNegotiable) unconfirmedConstraints.push(id) }
    domains.set(domain, [...(domains.get(domain) ?? []), value])
  }
  const orderingValue = [...domains.values()].reduce((sum, values) => sum + values.reduce((s, v) => s + v, 0) / values.length, 0)
  const detailSufficient = scenario.comparisonKind !== "catastrophic-endpoint" && known.size >= Math.max(3, Math.ceil(domains.size / 2))
  const agreementSufficient = support.size >= 2 && orderingValue > 0
  return { scenario, supported, conflicts, unresolved, inapplicable, hardConflicts, unconfirmedConstraints, knownDomains: known.size, supportDomains: support.size, orderingValue, detailSufficient, agreementSufficient, evidenceSufficient: detailSufficient && agreementSufficient }
}
export type MatchingOutcome = "insufficient-preferences" | "all-conflict" | "shortlist" | "poor-agreement" | "insufficient-scenario-evidence"
export function matchFutures(answers: PreferenceAnswers, catalogue: readonly FutureScenario[] = futureCatalogue) {
  const active = Object.entries(answers).filter(([id, a]) => id in featureDefinitions && hasDirection(a))
  const activeDomains = new Set(active.map(([id]) => featureDefinitions[id as FeatureId].domain)).size
  const comparisons = catalogue.map(s => comparePreferences(s, answers))
  const eligible = comparisons.filter(c => c.hardConflicts.length === 0 && c.evidenceSufficient)
    .sort((a, b) => b.orderingValue - a.orderingValue || a.scenario.name.localeCompare(b.scenario.name, "en"))
  const cutoff = eligible[Math.min(2, eligible.length - 1)]?.orderingValue
  const shortlist = activeDomains < 3 || cutoff === undefined ? [] : eligible.filter(c => c.orderingValue >= cutoff - 1e-9)
  const outcome: MatchingOutcome = activeDomains < 3 ? "insufficient-preferences" : comparisons.every(c => c.hardConflicts.length > 0) ? "all-conflict" : shortlist.length ? "shortlist" : comparisons.some(c => !c.hardConflicts.length && c.detailSufficient) ? "poor-agreement" : "insufficient-scenario-evidence"
  return { version: matchingVersion, questionVersion: preferenceQuestionVersion, catalogueVersion, outcome, activeDomains, comparisons, shortlist }
}

export const matchingMethod = "Only your explicit directional choices become priorities. Uncertainty, no preference and neither option contribute nothing. Each of eight active domains has equal weight; where a domain has several priorities, their contributions are averaged. A clear feature agreement contributes one, a conflict minus one, and an unspecified or variant-dependent feature zero, without reallocating its share. Catastrophic extinction cannot instantiate your preferred institutions or valued succession, so it supplies no positive support and cannot enter a preference shortlist; known conflicts remain visible and these endpoints remain available for expectations. A confirmed non-negotiable conflict excludes a scenario regardless of other attractions. An unresolved non-negotiable stays visibly unconfirmed. A shortlist requires priorities in at least three domains, known scenario features in at least three and at least half of your active domains, support in at least two domains, and positive net support. We show the first three qualifying entries by net support plus all ties at the boundary; tied entries are displayed alphabetically, with no tie-break preference. These authored rules compare conditions, not probabilities or validated traits."

// This diagnostic uses exactly the distinctions consumed by comparePreferences.
// Unspecified and variant-dependent both stay in its unresolved branch.
export function descriptorSignature(scenario: FutureScenario): string {
  return JSON.stringify([scenario.comparisonKind ?? "society", ...featureIds.map(id => {
    const state = scenario.features[id]
    return state === "unspecified" || state === "variant-dependent" ? "unresolved" : state
  })])
}
export function descriptorEquivalenceGroups(catalogue: readonly FutureScenario[] = futureCatalogue): FutureScenario[][] {
  const groups = new Map<string, FutureScenario[]>()
  for (const scenario of catalogue) {
    const signature = descriptorSignature(scenario)
    groups.set(signature, [...(groups.get(signature) ?? []), scenario])
  }
  return [...groups.values()].filter(group => group.length > 1)
}
export function equivalenceExplanation(group: readonly FutureScenario[]): string {
  return group.some(s => s.id === "negotiated-ceiling") && group.some(s => s.id === "planetary-restoration")
    ? "This questionnaire cannot distinguish Negotiated Ceiling from Planetary Restoration Compact. It asks about enforced limits, human authority and revisability, but does not ask whether ecosystems should have representation. The Compact’s ecological mandate is an additional premise, not a preference inferred from your answers. Compare their purposes and assumptions before treating either as your preferred world."
    : "These scenarios have the same comparison descriptors wherever this questionnaire can resolve a condition. Your answers cannot distinguish their defining differences; consult their premises and open questions."
}
