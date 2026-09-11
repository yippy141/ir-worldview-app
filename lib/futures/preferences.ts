import { featureDefinitions, type FeatureId } from "@/lib/futures/catalogue/features"

export type Preference = "present" | "absent" | "uncertain" | "no-preference" | "other"
export type PreferenceAnswer = { choice: Preference; nonNegotiable: boolean }
export type PreferenceAnswers = Partial<Record<FeatureId, PreferenceAnswer>>
export const preferenceQuestionVersion = "futures-questions-0.2"
export const preferenceQuestions: readonly { id: FeatureId; prompt: string; present: string; absent: string; scope: string }[] = [
  { id: "humanAuthority", prompt: "Would you prefer humans or a nonhuman authority to have the final governing say?", present: "Keep practical final authority with humans, accepting slower or less capable decisions.", absent: "Prefer a nonhuman authority with the final say, for its capabilities, accepting that humans could not overrule it.", scope: "This concerns collective governing authority, not who performs a technical task. It does not assume every future contains superintelligence." },
  { id: "revisablePower", prompt: "Would you prefer a revisable governing mandate or one that binds later generations?", present: "Prefer an effective power to revise the mandate as circumstances change, accepting disruption and the possibility of worse choices.", absent: "Prefer a binding mandate that sustains long-term commitments, accepting that later generations could not replace it.", scope: "Effective revision means practical power to change the arrangement, beyond a formal right written on paper." },
  { id: "personalExit", prompt: "For a society you might join, would you prefer a practical exit right or membership that cannot be ended?", present: "Prefer a usable right to leave, even if maintaining it reduces what the society can provide.", absent: "Prefer irrevocable membership to sustain shared commitments, accepting that I could not later leave.", scope: "This is a preference about your participation. Merely not insisting on exit does not mean preferring irrevocable membership; No preference and Neither describes my view remain available." },
  { id: "pluralPolities", prompt: "Would you prefer several self-governing communities or one common governing authority?", present: "Prefer several self-governing communities, accepting coordination problems and disagreement across borders.", absent: "Prefer one common governing authority, accepting less room for communities to choose different rules.", scope: "This concerns the political arrangement you would want across communities, rather than where you personally would live." },
  { id: "sharedBenefits", prompt: "How should a society balance a material floor against control over its resources?", present: "Guarantee broad material provision, accepting the collective claims on resources needed to fund it.", absent: "Use voluntary or local provision without a universal guarantee, accepting that some people may go without.", scope: "A material floor does not specify equal incomes, private ownership or a particular technology." },
  { id: "privateOwnership", prompt: "What should organize control of productive resources?", present: "Private ownership and exchange, accepting unequal bargaining power and access.", absent: "Common or public control without private productive ownership, accepting collective allocation decisions.", scope: "Personal possessions are not the issue. This question is distinct from whether everyone receives a material floor." },
  { id: "biologicalContinuity", prompt: "What would you want to preserve across a profound change in the kinds of beings that exist?", present: "Continuing biological humanity, even if this limits what its successors could do.", absent: "Favor a successor world that replaces biological humanity, accepting the loss of human continuity.", scope: "This states a desired condition, not a personal decision to transform yourself. Accepting succession does not establish that a specific catastrophic endpoint is welcome." },
  { id: "voluntaryTransformation", prompt: "If substantial technological transformation were feasible, should adults be free to choose it or should it be prohibited?", present: "Prefer freedom to choose transformation, accepting new problems of inequality, identity and shared obligations.", absent: "Prefer a prohibition to preserve shared forms of life, accepting that adults who want to transform could not do so.", scope: "This asks about a rule for a feasible option, not whether the technology exists. Technical unavailability cannot count as support for prohibition. It does not ask you to transform." },
  { id: "digitalStanding", prompt: "Assume artificial beings are persons with interests that matter morally. Should shared institutions recognize their standing?", present: "Prefer shared institutions that recognize artificial persons, accepting difficult questions about copying and representation.", absent: "Prefer institutions reserved for biological humans to preserve human self-government, accepting that artificial persons would lack standing within them.", scope: "Personhood is stipulated solely for this ethical hypothetical; no claim about present AI consciousness follows. Standing does not require identical votes. The alternative reserves shared institutions for humans, not a claim that artificial persons have no moral worth." },
  { id: "capabilityLimits", prompt: "Would you prefer an enforced ceiling on selected dangerous capabilities, or development without an institutional ceiling?", present: "Prefer an enforced capability ceiling to constrain severe risks, accepting inspections and some useful projects being unavailable.", absent: "Prefer development without an institutional capability ceiling to keep useful possibilities open, accepting additional risks.", scope: "This compares the presence or absence of an enforced ceiling. Willingness merely to permit a ceiling is not a preference for having one. Low technical capacity alone does not establish a restriction." },
  { id: "transparentPower", prompt: "Would you prefer governing power to be visible or its intervention to remain concealed?", present: "Prefer visible governing power so people know who rules, accepting that disclosure can make protection harder.", absent: "Favor concealed governing intervention for protection, accepting that people cannot knowingly contest it.", scope: "This concerns hidden rule, not every operational secret or every kind of personal privacy." },
  { id: "technicalIndependence", prompt: "How much should communities invest in operating without an indispensable technical provider?", present: "Maintain practical alternatives and repair capacity, accepting expense and lower efficiency.", absent: "Build around one indispensable provider for its capabilities, accepting the loss of practical alternatives.", scope: "This is practical capacity to continue operating, not merely the legal ability to select another vendor." },
]
export const requirementLabels: Record<FeatureId, Record<"present" | "absent", string>> = {
  "humanAuthority": {
    "present": "I require practical final governing authority to remain with humans.",
    "absent": "I require a nonhuman authority to have the final governing say."
  },
  "revisablePower": {
    "present": "I require people to be able to revise governing mandates effectively.",
    "absent": "I require a binding mandate that later generations cannot revise."
  },
  "personalExit": {
    "present": "I require a usable right to leave a society I join.",
    "absent": "I require membership that cannot later be ended."
  },
  "pluralPolities": {
    "present": "I require several self-governing communities.",
    "absent": "I require one common final governing authority."
  },
  "sharedBenefits": {
    "present": "I require a universal material guarantee.",
    "absent": "I require provision without a universal material guarantee."
  },
  "privateOwnership": {
    "present": "I require private ownership to organize productive resources.",
    "absent": "I require production without private productive ownership."
  },
  "biologicalContinuity": {
    "present": "I require biological humanity to continue.",
    "absent": "I require a successor world that replaces biological humanity."
  },
  "voluntaryTransformation": {
    "present": "I require adults to be free to choose feasible substantial transformation.",
    "absent": "I require feasible substantial transformation to be prohibited."
  },
  "digitalStanding": {
    "present": "I require shared institutions to recognize hypothetical artificial persons.",
    "absent": "I require shared institutions to reserve standing for biological humans."
  },
  "capabilityLimits": {
    "present": "I require an enforced ceiling on selected capabilities.",
    "absent": "I require development without an institutional capability ceiling."
  },
  "transparentPower": {
    "present": "I require governing power to be visible to the people it governs.",
    "absent": "I require governing intervention to remain concealed."
  },
  "technicalIndependence": {
    "present": "I require practical alternatives to an indispensable technical provider.",
    "absent": "I require an arrangement built around an indispensable technical provider."
  }
}

export const nonPreferenceOptions = [
  { value: "uncertain", label: "Not sure" },
  { value: "no-preference", label: "No preference" },
  { value: "other", label: "Neither describes my view" },
] as const
export function preferenceLabel(id: FeatureId, answer?: PreferenceAnswer) {
  if (!answer) return "Not answered"
  if (answer.choice === "present" || answer.choice === "absent") return featureDefinitions[id][answer.choice]
  return nonPreferenceOptions.find(option => option.value === answer.choice)?.label ?? "Not answered"
}
export const hasDirection = (answer?: PreferenceAnswer): answer is PreferenceAnswer & { choice: "present" | "absent" } => answer?.choice === "present" || answer?.choice === "absent"
export const preferencesComplete = (answers: PreferenceAnswers) => preferenceQuestions.every(q => answers[q.id] && ["present", "absent", ...nonPreferenceOptions.map(o => o.value)].includes(answers[q.id]!.choice))

export type Expectation = "plausible" | "unlikely" | "unsure"
export type Expectations = Partial<Record<string, Expectation>>
export const expectationFrame = {
  horizon: "By the end of this century (2100)",
  assumptions: "Consider possible technical and political pathways from today. Superintelligence may or may not be achieved. These overlapping scenarios need not be final endpoints, and no capability outcome is assumed in advance.",
} as const
