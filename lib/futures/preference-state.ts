import { featureDefinitions, type FeatureId } from "@/lib/futures/catalogue/features"
import { hasDirection, preferencesComplete, preferenceQuestionVersion, type Preference, type PreferenceAnswers, type Expectations, type Expectation } from "@/lib/futures/preferences"
import { findFuture } from "@/lib/futures/catalogue/index"

export type PreferenceStep = "intro" | "questions" | "review" | "result" | "expectations"
export type PreferenceState = { questionVersion: string; step: PreferenceStep; question: number; answers: PreferenceAnswers; submitted: PreferenceAnswers | null; expectations: Expectations; expectationsSubmitted: boolean; notice: string }
export const initialPreferenceState: PreferenceState = { questionVersion: preferenceQuestionVersion, step: "intro", question: 0, answers: {}, submitted: null, expectations: {}, expectationsSubmitted: false, notice: "" }
export type PreferenceAction =
  | { type: "answer"; id: FeatureId; choice: Preference }
  | { type: "constraint"; id: FeatureId; confirmed: boolean }
  | { type: "question"; index: number }
  | { type: "review" }
  | { type: "submit" }
  | { type: "expectations" }
  | { type: "expectation"; id: string; value: Expectation | "unassessed" }
  | { type: "read-expectations" }
  | { type: "intro" }
  | { type: "reset" }
export function preferenceReducer(state: PreferenceState, action: PreferenceAction): PreferenceState {
  if (action.type === "reset") return initialPreferenceState
  if (action.type === "intro") return { ...state, step: "intro" }
  if (action.type === "question") return Number.isInteger(action.index) && action.index >= 0 && action.index < Object.keys(featureDefinitions).length ? { ...state, step: "questions", question: action.index } : state
  if (action.type === "review") return { ...state, step: "review" }
  if (action.type === "submit") return state.step === "review" && preferencesComplete(state.answers) ? { ...state, submitted: structuredClone(state.answers), step: "result", notice: "" } : state
  if (action.type === "expectations") return state.submitted ? { ...state, step: "expectations" } : state
  if (action.type === "expectation") {
    if (!findFuture(action.id)) return state
    const expectations = { ...state.expectations }
    if (action.value === "unassessed") delete expectations[action.id]
    else if (["plausible", "unlikely", "unsure"].includes(action.value)) expectations[action.id] = action.value
    else return state
    return { ...state, expectations, expectationsSubmitted: false }
  }
  if (action.type === "read-expectations") return state.submitted ? { ...state, expectationsSubmitted: true, step: "result" } : state
  if (!(action.id in featureDefinitions)) return state
  const previous = state.answers[action.id]
  if (action.type === "constraint" && !hasDirection(previous)) return state
  if (action.type === "answer" && !["present", "absent", "uncertain", "no-preference", "other"].includes(action.choice)) return state
  const answer = action.type === "constraint" ? { ...previous!, nonNegotiable: action.confirmed } : { choice: action.choice, nonNegotiable: previous?.choice === action.choice ? previous.nonNegotiable : false }
  if (previous?.choice === answer.choice && previous.nonNegotiable === answer.nonNegotiable) return state
  return { ...state, answers: { ...state.answers, [action.id]: answer }, submitted: null, notice: state.submitted ? "Your previous shortlist is withdrawn. Review and submit again to apply this change. Your separate expectations are preserved." : state.notice }
}
