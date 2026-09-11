// Authored choices, never a scoring instrument. Keep responses in component memory.
export const departure = {
  href: "/futures/departure",
  title: "The Departure",
  version: "departure-0.1-draft",
  status: "English draft · 11 September 2026",
} as const

export type Framing = "personal" | "policy"
export type Comparison = "a" | "b" | "c"
export type Step = "intro" | Comparison | "review" | "result"
type Option = { value: string; label: string }
type Question = {
  id: string
  stage: Comparison
  task: string
  prompt: string
  policyPrompt?: string
  clarification?: string
  options: readonly Option[]
}

const desiredOptions = [
  { value: "welcome", label: "I would welcome this arrangement." },
  { value: "accept", label: "I could accept it, despite objections." },
  { value: "reject", label: "I would reject it even with those protections." },
  { value: "open", label: "I have not settled what I would want." },
] as const
const evidenceOptions = [
  { value: "demonstration", label: "Independent observation of the settlements and a completed return journey." },
  { value: "control", label: "Transport and essential tools that people can operate without the AI’s permission." },
  { value: "accountability", label: "Public terms, independent inspection and a way for residents to challenge decisions." },
  { value: "trust", label: "Its record and stated commitments would be enough for me to consider the offer." },
  { value: "unresolved", label: "None of these resolves the enforcement problem for me." },
  { value: "other", label: "A different condition, or I do not yet know." },
] as const
const decisionOptions = [
  { value: "go", label: "Leave under the offer as it stands." },
  { value: "stay", label: "Stay on Earth." },
  { value: "defer", label: "Postpone the decision until more is known." },
  { value: "reject", label: "Reject this choice set; I want a different arrangement." },
] as const
const reasonOptions = [
  { value: "attachment", label: "Remaining connected to people and a life on Earth." },
  { value: "return", label: "Whether departure can be reversed." },
  { value: "opportunity", label: "The life and opportunities offered elsewhere." },
  { value: "authority", label: "Who holds authority over the settlement and the journey." },
  { value: "credibility", label: "The gap between a promise and evidence that it will hold." },
  { value: "other", label: "None of these captures my reason." },
  { value: "unsure", label: "I am not sure of my reason yet." },
] as const

export const departureQuestions = [
  { id: "aDesired", stage: "a", task: "The world you would want", prompt: "Suppose the benefits, Earth’s self-government and freedom from punishment are genuinely secure. Would you want this arrangement to exist?", clarification: "Only those protections are stipulated here. Return is still unknown. This asks about the arrangement, not whether you personally board.", options: desiredOptions },
  { id: "aEvidence", stage: "a", task: "The offer you would trust", prompt: "Now those protections are claims. What would matter most before treating the offer as credible?", clarification: "Select your main condition, not an exhaustive checklist. None of these is assumed available, and an ordinary institution cannot guarantee enforcement against a vastly more powerful AI.", options: evidenceOptions },
  { id: "aDecision", stage: "a", task: "Your decision", prompt: "With return terms unknown, what would you do?", policyPrompt: "With return terms unknown, what should the fictional adult considering this offer do?", options: decisionOptions },
  { id: "aReason", stage: "a", task: "Your stated reason", prompt: "What matters most to that decision?", options: reasonOptions },
  { id: "aOthers", stage: "a", task: "Other adults’ choice", prompt: "Should another competent adult be allowed to leave under this initial offer?", clarification: "This question concerns informed, voluntary adult decisions. Children and dependents raise separate questions.", options: [
    { value: "allow", label: "Yes, if informed and voluntary, even if I would stay." },
    { value: "conditions", label: "Only after additional protections or evidence are in place." },
    { value: "prevent", label: "No, I would support preventing departure under these terms." },
    { value: "open", label: "I have not settled this, or the options miss my position." },
  ] },
  { id: "bDesired", stage: "b", task: "The world you would want", prompt: "If the revised return and communication protections genuinely worked, would you want this arrangement to exist?", clarification: "For this preference question only, the return service works for each traveler’s lifetime, communication remains possible with travel-related delays, and residents can leave without the AI’s permission. This does not promise reunion with everyone or control over future generations.", options: desiredOptions },
  { id: "bEvidence", stage: "b", task: "The offer you would trust", prompt: "Outside that stipulation, these are still promises. What would matter most before treating the revised offer as credible?", clarification: "The right to return is written into the offer. Whether residents could actually exercise it against the AI remains unverified. Choose your main condition; it is not assumed met.", options: evidenceOptions },
  { id: "bDecision", stage: "b", task: "Your decision", prompt: "With the revised offer on the table, but its protections unverified, what would you do?", policyPrompt: "With the revised offer on the table, but its protections unverified, what should the fictional adult do?", options: decisionOptions },
  { id: "bReason", stage: "b", task: "Your stated reason", prompt: "What matters most to that revised decision?", options: reasonOptions },
  { id: "cPolicy", stage: "c", task: "A public mandate", prompt: "Which post-departure arrangement, if any, should people on Earth authorize?", clarification: "A successor ASI means a later artificial superintelligence. No option settles every risk between Earth and other settlements. Treat the compact’s limits as proposed terms, with enforcement still unresolved.", options: [
    { value: "no-veto", label: "No AI veto. Earth makes its own decisions about successor systems, while remaining responsible for risks it imposes on others." },
    { value: "compact", label: "A jointly agreed safety compact: limited inspections, published threat criteria, review every five years and no automatic power to intervene." },
    { value: "ban", label: "A unilateral ban: the departing AI may prevent any successor ASI indefinitely, without Earth’s approval." },
    { value: "other", label: "None of these arrangements is acceptable to me." },
    { value: "defer", label: "I would defer authorization pending different terms or evidence." },
  ] },
  { id: "cMonitoring", stage: "c", task: "Information rights", prompt: "Separately, would you authorize narrow monitoring of successor-AI work?", clarification: "Monitoring means access to specified safety evidence under an agreed scope, public reporting and periodic review. It does not grant permission to halt work.", options: [
    { value: "allow", label: "Yes, under those jointly agreed limits." },
    { value: "reject", label: "No, I would not grant that access." },
    { value: "defer", label: "I need different terms or more information." },
  ] },
  { id: "cIntervention", stage: "c", task: "Governing powers", prompt: "Separately, who should authorize intervention against a successor system?", clarification: "Intervention means halting or disabling a system. A demonstrated threat is different from merely creating a potential competitor.", options: [
    { value: "joint", label: "Earth and affected settlements together, for a demonstrated threat under agreed criteria." },
    { value: "unilateral", label: "The departing AI may act unilaterally when it judges intervention necessary." },
    { value: "none", label: "I would give the departing AI no intervention authority." },
    { value: "defer", label: "The authority and emergency terms need more work." },
  ] },
  { id: "cReason", stage: "c", task: "Your stated reason", prompt: "What matters most to these policy judgments?", options: [
    { value: "self-rule", label: "Preserving self-government and the ability to revise a mandate." },
    { value: "risk", label: "Preventing catastrophic risks that cross political borders." },
    { value: "monopoly", label: "Preventing the first AI from protecting its own monopoly." },
    { value: "competence", label: "Using the strongest available capacity to detect and prevent harm." },
    { value: "other", label: "None of these captures my reason." },
    { value: "unsure", label: "I am not sure of my reason yet." },
  ] },
] as const satisfies readonly Question[]

export type QuestionId = typeof departureQuestions[number]["id"]
export type Answers = Partial<Record<QuestionId, string>>
export const comparisonTitles = { a: "An invitation, with no known way back", b: "A return passage changes the offer", c: "What authority remains on Earth?" } as const
export const steps: readonly Comparison[] = ["a", "b", "c"]
export const questionsFor = (stage: Comparison) => departureQuestions.filter(q => q.stage === stage)
export function answerLabel(id: QuestionId, answers: Answers) {
  return departureQuestions.find(q => q.id === id)?.options.find(o => o.value === answers[id])?.label ?? "Not answered"
}
export function complete(stage: Comparison, answers: Answers) {
  return questionsFor(stage).every(q => q.options.some(o => o.value === answers[q.id]))
}
export type DepartureState = { step: Step; framing: Framing; answers: Answers; notice: string }
export const initialDepartureState: DepartureState = { step: "intro", framing: "personal", answers: {}, notice: "" }
export type DepartureAction =
  | { type: "answer"; id: QuestionId; value: string }
  | { type: "navigate"; step: Exclude<Step, "result"> }
  | { type: "submit" }
  | { type: "reset"; framing: Framing }

export function departureReducer(state: DepartureState, action: DepartureAction): DepartureState {
  if (action.type === "reset") return { ...initialDepartureState, framing: action.framing }
  if (action.type === "submit") return state.step === "review" && steps.every(s => complete(s, state.answers)) ? { ...state, step: "result", notice: "" } : state
  if (action.type === "navigate") {
    const prerequisite = action.step === "review" ? steps : steps.slice(0, Math.max(0, steps.indexOf(action.step as Comparison)))
    if (!prerequisite.every(s => complete(s, state.answers))) return state
    return { ...state, step: action.step, notice: "" }
  }
  const index = departureQuestions.findIndex(q => q.id === action.id)
  const question = departureQuestions[index]
  if (!question || !question.options.some(o => o.value === action.value) || state.answers[action.id] === action.value) return state
  const answers = { ...state.answers, [action.id]: action.value }
  const revised = state.answers[action.id] !== undefined
  const later = departureQuestions.slice(index + 1)
  const cleared = revised && later.some(q => answers[q.id] !== undefined)
  if (revised) later.forEach(q => { delete answers[q.id] })
  return { ...state, answers, step: question.stage, notice: cleared ? "You changed an earlier answer. Later answers and the previous reading have been cleared so you can reconsider them under the revised choice." : state.notice }
}

export type Reading = { id: string; title: string; text: string }
export function interpretDeparture(a: Answers, framing: Framing = "personal"): Reading[] {
  if (!steps.every(s => complete(s, a))) return []
  const you = framing === "personal" ? "You" : "For the fictional adult, you"
  const readings: Reading[] = []
  if (a.aDecision === "stay" && a.bDecision === "go") readings.push({ id: "return-changes-choice", title: "The revised offer changes your decision", text: `${you} chose staying under unknown return terms and leaving under the revised offer. Return and communication terms changed together; this does not isolate either one as the cause. Your stated reason for the revised decision: ${answerLabel("bReason", a)}` })
  if (a.aDecision === "stay" && a.aOthers === "allow") readings.push({ id: "personal-and-permitted", title: "Staying and allowing departure can go together", text: `${you} chose staying while allowing another informed adult to leave. Those are separate judgments. Your stated reason for staying: ${answerLabel("aReason", a)}` })
  if (["welcome", "accept"].includes(a.bDesired ?? "") && a.cPolicy === "no-veto") readings.push({ id: "benefits-without-veto", title: "Accepting the arrangement does not grant a permanent veto", text: "You welcomed or accepted the revised arrangement under its trusted premises, while withholding an AI veto over successor systems. Your choices separate benefits from a grant of permanent authority." })
  if (a.cMonitoring === "allow" && ["joint", "none"].includes(a.cIntervention ?? "")) readings.push({ id: "information-not-rule", title: "Access to information is a different concession from unilateral power", text: "You allowed limited monitoring but did not give the departing AI unilateral intervention authority. Your intervention choice remains distinct from your preferred overall arrangement." })
  if (a.bDesired === "reject") readings.push({ id: "objection-under-premise", title: "The stipulated protections do not settle your objection", text: "You rejected the revised arrangement even when its benefits and protections were declared true. That records an objection to the arrangement; it does not identify ignorance, fear, religion or a particular moral theory. The unresolved question is which additional political or moral condition matters." })
  if (["welcome", "accept"].includes(a.bDesired ?? "") && ["stay", "defer", "reject"].includes(a.bDecision ?? "")) readings.push({ id: "desire-not-decision", title: "Wanting an arrangement is separate from accepting this offer", text: "You welcomed or accepted the world under trusted premises, but did not choose to leave under unverified terms. Your credibility condition and stated reason appear in your decisions below; neither answer cancels the other." })
  if (a.aReason === "other" && a.bReason === "other" && a.cReason === "other") readings.push({ id: "missing-reasons", title: "The offered reasons missed your account", text: "None of the supplied reasons captured your judgments. Your decisions still stand. What condition, obligation or alternative did the exercise leave out? This draft does not fill that gap with a psychological explanation." })
  if ((a.cPolicy === "ban" && a.cIntervention !== "unilateral") || (a.cPolicy === "no-veto" && a.cIntervention === "unilateral") || (a.cPolicy === "compact" && a.cMonitoring === "reject")) readings.push({ id: "terms-to-reconcile", title: "Some policy terms need reconciling", text: "Your preferred package and at least one separately authorized power differ. Keep both on the record: would you revise the package, or make an exception? The exercise does not average that disagreement away." })
  if (!readings.length) readings.push({ id: "decisions-first", title: "Your conditions remain separate", text: "The choices below are your account of the offer, the evidence you would need and the powers you would authorize. This draft has no additional interpretation rule that applies to this combination." })
  return readings
}
