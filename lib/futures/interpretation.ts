import { featureIds, type FeatureId } from "@/lib/futures/catalogue/features"
import { scenarioRationales } from "@/lib/futures/catalogue/rationales"
import { hasDirection, type PreferenceAnswers } from "@/lib/futures/preferences"
import { matchFutures, type ScenarioComparison } from "@/lib/futures/matching"

const conditionPhrases: Record<FeatureId, Record<"present" | "absent", string>> = {
  humanAuthority: { present: "human final authority", absent: "nonhuman final authority" },
  revisablePower: { present: "mandates people can effectively revise", absent: "mandates that bind later generations" },
  personalExit: { present: "a usable right to leave", absent: "irrevocable membership" },
  pluralPolities: { present: "several self-governing communities", absent: "one common final authority" },
  sharedBenefits: { present: "a universal material guarantee", absent: "provision without a universal guarantee" },
  privateOwnership: { present: "private productive ownership", absent: "production without private ownership" },
  biologicalContinuity: { present: "continuing biological humanity", absent: "a successor world replacing biological humanity" },
  voluntaryTransformation: { present: "freedom to choose feasible transformation", absent: "a prohibition on feasible transformation" },
  digitalStanding: { present: "standing for hypothetical artificial persons", absent: "institutional standing reserved for biological humans" },
  capabilityLimits: { present: "an enforced capability ceiling", absent: "development without an institutional capability ceiling" },
  transparentPower: { present: "visible governing power", absent: "concealed governing intervention" },
  technicalIndependence: { present: "practical alternatives to an indispensable provider", absent: "reliance on an indispensable technical provider" },
}
export const joinConditions = (items: readonly string[]) => items.length < 3 ? items.join(" and ") : `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`
export function desiredCondition(id: FeatureId, answers: PreferenceAnswers): string {
  const answer = answers[id]
  return hasDirection(answer) ? conditionPhrases[id][answer.choice] : "an unstated condition"
}

// Paragraphs connect related choices. No scenario name selects a reader's view.
// Each branch requires the propositions it interprets; unanswered counterparts
// are never silently supplied to make a coherent worldview.
type Theme = { ids: FeatureId[]; text: string }
export function preferenceThemes(answers: PreferenceAnswers): Theme[] {
  const choice = (id: FeatureId) => hasDirection(answers[id]) ? answers[id]!.choice : null
  const themes: Theme[] = []
  const authority = choice("humanAuthority"), revision = choice("revisablePower")
  if (authority && revision) themes.push({ ids: ["humanAuthority", "revisablePower"], text:
    authority === "present" && revision === "present" ? "You want humans to retain final authority and people to be able to replace governing mandates. Delegation would therefore need to leave them practical ways to change who rules; a capable or popular ruler alone would not meet both preferences."
    : authority === "present" ? "You would keep final authority with humans while binding later generations to an enduring mandate. Human government, on these terms, would sustain commitments that future citizens could not simply replace when their priorities changed."
    : revision === "present" ? "You favor nonhuman final authority while also wanting people to be able to revise governing mandates. Those preferences put a demanding condition on delegation: the governing system would need to respect a practical power to replace its mandate, even where humans could not overrule its individual decisions."
    : "You favor nonhuman final authority under a mandate that later generations cannot revise. That arrangement could sustain long-term commitments, but the ability to choose a different ruler would not be one of the conditions you are seeking." })
  const exit = choice("personalExit"), plural = choice("pluralPolities")
  if (exit && plural) themes.push({ ids: ["personalExit", "pluralPolities"], text:
    exit === "present" && plural === "present" ? "You want several communities to govern themselves and a usable right to leave a society you join. Different rules would then matter as practical alternatives, although borders, admission and the resources needed to move would still determine whether exit can be used."
    : exit === "present" ? "You prefer one common governing authority, while wanting a usable right to leave a society you join. The destination and terms of departure matter here: leaving a community within the same governing order may offer less independence than leaving that order itself."
    : plural === "present" ? "You favor several self-governing communities but prefer irrevocable membership for a society you join. Diversity between communities would coexist with binding commitments inside them; it would not give you a continuing right to move between their arrangements."
    : "You prefer one common governing authority and membership that cannot later be ended. These choices place continuity of the shared arrangement ahead of political alternatives or a personal exit right; they do not establish which particular authority you would accept." })
  const floor = choice("sharedBenefits"), ownership = choice("privateOwnership")
  if (floor && ownership) themes.push({ ids: ["sharedBenefits", "privateOwnership"], text:
    floor === "present" && ownership === "present" ? "You want a universal material guarantee alongside private productive ownership. Property and exchange would have to coexist with institutions that secure provision for everyone; wealth creation alone would not establish that the guarantee exists."
    : floor === "present" ? "You favor a universal material guarantee and production without private ownership. Common control would still need workable allocation rules to turn collective resources into dependable provision, rather than leaving that benefit assumed."
    : ownership === "present" ? "You favor private productive ownership and provision without a universal guarantee. That leaves more of the allocation decision with owners and voluntary or local institutions, while accepting that access to resources need not be secured for everyone."
    : "You favor production without private ownership but do not want a universal material guarantee. Common control and guaranteed provision are separate conditions in your answers: the former would not by itself settle everyone’s entitlement to what is produced." })
  const ceiling = choice("capabilityLimits"), independence = choice("technicalIndependence")
  if (ceiling && independence) themes.push({ ids: ["capabilityLimits", "technicalIndependence"], text:
    ceiling === "present" && independence === "present" ? "You want an enforced capability ceiling while preserving practical alternatives to an indispensable provider. The relevant future would need both a workable restriction and enough independent capacity to keep communities operating; low technology alone would not establish either institution."
    : ceiling === "present" ? "You favor an enforced capability ceiling and an arrangement built around an indispensable technical provider. A provider’s capabilities and the authority to constrain them would therefore need to coexist, with dependence remaining part of the arrangement you prefer."
    : independence === "present" ? "You prefer development without an institutional capability ceiling while maintaining practical alternatives to an indispensable provider. Continued technical development would not, on these terms, have to mean surrendering the capacity to operate without one system."
    : "You favor development without an institutional capability ceiling and reliance on an indispensable technical provider. That combination keeps development open while accepting concentrated dependency; the provider’s usefulness would not itself settle who governs it." })
  const biology = choice("biologicalContinuity"), digital = choice("digitalStanding")
  if (biology && digital) themes.push({ ids: ["biologicalContinuity", "digitalStanding"], text:
    biology === "present" && digital === "present" ? "You want biological humanity to continue alongside institutional standing for hypothetical artificial persons. This is a preference for coexistence with recognition, rather than an inference that today’s AI systems are conscious or that all future citizens should have identical votes."
    : biology === "present" ? "You want biological humanity to continue and shared institutions to reserve standing for biological humans. Under the question’s explicit assumption that artificial beings are persons, your choice excludes them from those shared institutions. It does not by itself determine who has final governing authority."
    : digital === "present" ? "You favor a successor world replacing biological humanity and standing for hypothetical artificial persons. A valued succession would need institutions recognizing those persons; the mere disappearance of humans would not establish that future."
    : "You favor a successor world replacing biological humanity while reserving shared institutional standing for biological humans. Those choices leave a substantive tension about who could participate once biological humanity had gone; extinction cannot supply the desired institutions." })
  // A single remaining proposition gets its own applicable explanation only
  // when no paired paragraph covers it. This keeps all response patterns legible.
  const singles: Record<FeatureId, Record<"present" | "absent", string>> = {
    humanAuthority: { present: "You want humans to retain practical final authority. The distinction is whether they can actually overrule the governing arrangement, not simply whether human offices or elections remain visible.", absent: "You favor a nonhuman authority with the final governing say. That leaves the scope of its mandate, the distribution of benefits and the rights of those it governs as separate questions." },
    revisablePower: { present: "You want people to be able to revise governing mandates effectively. A written right would be insufficient if the resources or authority needed to exercise it had disappeared.", absent: "You prefer a mandate that binds later generations. Its ability to sustain commitments would come with the accepted cost that future citizens could not replace it when their priorities changed." },
    personalExit: { present: "You want a usable right to leave a society you join. The presence of another destination and the practical means of reaching it matter as much as permission on paper.", absent: "You prefer irrevocable membership for a society you join. This is a positive preference for binding commitment, rather than merely declining to make exit indispensable." },
    pluralPolities: { present: "You favor several self-governing communities. Their coexistence would leave coordination and borders to be negotiated, rather than settling every disagreement through a common final authority.", absent: "You favor one common final governing authority. It could settle disputes within a shared order, while leaving communities less room to choose independent rules." },
    sharedBenefits: { present: "You want a universal material guarantee. Productive capacity or benevolent intentions alone cannot meet that condition; the scenario must actually specify broad guaranteed provision.", absent: "You prefer provision without a universal material guarantee. Voluntary or local arrangements could still provide support, but everyone’s entitlement would not be secured by a common guarantee." },
    privateOwnership: { present: "You want private ownership to organize productive resources. This concerns control of production; it does not by itself decide whether society also guarantees a material floor.", absent: "You favor production without private ownership. Common or public allocation would still need rules for deciding whose projects receive resources and how disagreements are resolved." },
    biologicalContinuity: { present: "You want biological humanity to continue. A successor regarded as worthy would not, on its own, preserve the human continuity you are seeking.", absent: "You favor a successor world that replaces biological humanity. That preference concerns a desired succession; catastrophic extinction cannot establish the institutions or legacy you would value." },
    voluntaryTransformation: { present: "You want adults to be free to choose feasible substantial transformation. That concerns other people’s options, without implying that you would transform yourself or that the technology will become possible.", absent: "You prefer feasible substantial transformation to be prohibited. A world where the technology simply does not exist cannot demonstrate that policy; the distinction matters when comparing technological retreat with institutional restriction." },
    digitalStanding: { present: "Under the explicit hypothesis that artificial beings are persons, you want institutions to recognize their standing. The terms of representation and copying would still need settlement; this answer makes no claim about present AI consciousness.", absent: "Under the explicit hypothesis that artificial beings are persons, you prefer institutions to reserve standing for biological humans. A world without artificial persons does not demonstrate that institutional exclusion." },
    capabilityLimits: { present: "You want an enforced ceiling on selected capabilities. This goes beyond willingness to permit restrictions: a scenario must actually contain an institutional ceiling to support that preference.", absent: "You prefer development without an institutional capability ceiling. A scenario’s silence about regulation does not establish that freedom, just as limited technical capacity does not prove an enforced restriction." },
    transparentPower: { present: "You want governing power to be visible to the people it governs. Beneficial intervention carried out in secret would leave them unable to knowingly judge who is ruling or contest that role.", absent: "You favor concealed governing intervention for protection. That accepts a gap between people’s experience of choosing and their knowledge of the power shaping those choices." },
    technicalIndependence: { present: "You want communities to maintain practical alternatives to an indispensable provider. Legal permission to switch is insufficient if essential services cannot continue without the same underlying infrastructure.", absent: "You prefer an arrangement built around an indispensable provider for its capabilities. Its usefulness would come with accepted dependency, rather than a continuing capacity to operate independently." },
  }
  const covered = new Set(themes.flatMap(theme => theme.ids))
  for (const id of featureIds) { const direction = choice(id); if (direction && !covered.has(id)) themes.push({ ids: [id], text: singles[id][direction as "present" | "absent"] }) }
  // Requirements lead; otherwise paired mechanisms lead in the authored order.
  return themes.map((theme, index) => ({ ...theme, index, required: theme.ids.filter(id => answers[id]?.nonNegotiable).length }))
    .sort((a, b) => b.required - a.required || b.ids.length - a.ids.length || a.index - b.index)
}

export function conditionQualification(comparison: ScenarioComparison, id: FeatureId): string {
  // Catastrophe's exclusion from positive matching is separate from a descriptor's
  // institutional absence and from an irrelevant/uninstantiated institution.
  if (comparison.scenario.comparisonKind === "catastrophic-endpoint" && comparison.inapplicable.includes(id)) return "Human extinction cannot supply a preferred institution or establish a valued succession."
  return scenarioRationales(comparison.scenario.id)[id][2]
}
export function comparisonParagraph(comparison: ScenarioComparison, answers: PreferenceAnswers): string {
  const priority = (ids: FeatureId[]) => [...ids].sort((a, b) => Number(answers[b]?.nonNegotiable) - Number(answers[a]?.nonNegotiable))
  const supported = priority(comparison.supported).slice(0, 2)
  const conflict = priority(comparison.conflicts)[0]
  const unresolved = priority([...comparison.unresolved, ...comparison.inapplicable])[0]
  const support = supported.length ? `It provides ${joinConditions(supported.map(id => desiredCondition(id, answers)))}, as you prefer.` : "It does not establish support for the conditions you selected."
  const qualification = conflict ? ` It conflicts with your preference for ${desiredCondition(conflict, answers)}${comparison.hardConflicts.includes(conflict) ? ", which you made indispensable" : ""}.` : unresolved ? ` ${conditionQualification(comparison, unresolved)}` : " Those agreements do not settle every question about living under this arrangement."
  return support + qualification
}
export function comparativeReading(shortlist: ScenarioComparison[], answers: PreferenceAnswers): string | null {
  for (const first of shortlist) for (const second of shortlist) {
    if (first === second) continue
    const id = first.supported.find(id => second.conflicts.includes(id) || second.unresolved.includes(id) || second.inapplicable.includes(id))
    if (!id) continue
    const reason = conditionQualification(second, id)
    return `${first.scenario.name} explicitly supports your preference for ${desiredCondition(id, answers)}. ${second.scenario.name} ${second.conflicts.includes(id) ? "contains the opposite condition" : "does not establish that condition"}. ${reason}`
  }
  return null
}
export function interpretPreferences(answers: PreferenceAnswers, result = matchFutures(answers)) {
  const themes = preferenceThemes(answers)
  const nonResults = {
    "insufficient-preferences": { title: "More of your preferences remain open", text: "You have stated directional preferences in fewer than three domains, so there is too little to compare across these worlds. Not sure, No preference and Neither describes my view remain distinct answers; none is converted into a middle position. You can keep them open and browse the scenarios, or revisit your answers." },
    "poor-agreement": { title: "The described worlds do not align closely enough", text: "Enough scenario conditions are known to identify disagreement, but no remaining entry has both positive net agreement and support across enough of your active domains. This is a mismatch with the described worlds, rather than simply missing information. You can inspect the disagreements below without relaxing your preferences." },
    "insufficient-scenario-evidence": { title: "The scenarios leave too much unresolved", text: "Among the entries without a confirmed requirement conflict, too few relevant conditions are specified to support a shortlist. An open question is neither a promise nor a rejection. The comparisons below identify what each description would need to settle." },
    "all-conflict": { title: "No entry meets your confirmed requirements", text: "Every published entry explicitly conflicts with at least one condition you made indispensable. Other attractions cannot cancel those conflicts. You can inspect which requirement excludes each entry below, or reconsider your answers if your view has changed." },
  }
  if (result.outcome !== "shortlist") return { title: nonResults[result.outcome].title, paragraphs: [nonResults[result.outcome].text] }
  const comparison = comparativeReading(result.shortlist, answers)
  return { title: "Futures to consider", paragraphs: [...themes.slice(0, 1).map(theme => theme.text), ...(comparison ? [comparison] : [])] }
}
