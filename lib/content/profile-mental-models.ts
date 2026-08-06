export type ProfileMentalModel = {
  patternId: string
  analogy: string
  explanation: string
  whereItBreaks: string
}

/**
 * Editorial teaching devices for Decision Pattern pages. These explain a decision
 * habit; they are separate from the source-verified historical case records.
 */
export const profileMentalModels: readonly ProfileMentalModel[] = [
  {
    patternId: "broad-spectrum-bridge-builder",
    analogy: "A second opinion",
    explanation:
      "A clinician orders one more test before naming the problem. This pattern keeps rival diagnoses open while the evidence accumulates.",
    whereItBreaks: "Some decisions arrive before a second opinion is available.",
  },
  {
    patternId: "constraint-first-realist",
    analogy: "Insurance under uncertainty",
    explanation:
      "Deterrence with limits works like insurance: steady, visible costs are paid to cap the worst outcome.",
    whereItBreaks:
      "The risk may stop being priceable when a rival changes the odds faster than the policy can adjust.",
  },
  {
    patternId: "competitive-balancer",
    analogy: "Bargaining leverage",
    explanation:
      "Every arrangement rests on fallback options. The side that can walk away more easily often sets the terms.",
    whereItBreaks:
      "Treating every table as a leverage contest can destroy arrangements that were producing shared value.",
  },
  {
    patternId: "coalition-pragmatist",
    analogy: "Convoy speed",
    explanation:
      "A convoy moves at the speed its most exposed ship can sustain. A coalition policy lasts only while pressured partners can carry it.",
    whereItBreaks: "The convoy can slow a response at the moment speed matters most.",
  },
  {
    patternId: "institution-builder",
    analogy: "Rules of the road",
    explanation:
      "Traffic rules let strangers move quickly because each can predict how the others are expected to behave.",
    whereItBreaks:
      "Road rules offer little protection from an actor that profits by rejecting the system.",
  },
  {
    patternId: "legitimacy-attuned-reader",
    analogy: "A social script",
    explanation:
      "The same line lands differently depending on who delivers it and what the audience remembers. Political moves acquire meaning through that script.",
    whereItBreaks:
      "A script can understate what raw capability accomplishes regardless of how the move is framed.",
  },
  {
    patternId: "justice-forward-solidarist",
    analogy: "A locked door in a fire",
    explanation:
      "Sovereignty works like a locked door: the lock normally protects the household, while a fire changes the case for breaking it.",
    whereItBreaks:
      "Every forced door becomes a precedent, including doors later forced in bad faith.",
  },
  {
    patternId: "structural-inequality-critic",
    analogy: "Structural plumbing",
    explanation:
      "Outcomes follow the pipes. Control over finance, production, and rule-writing shapes where pressure flows.",
    whereItBreaks: "The pipes shape the flow without explaining every act of agency inside them.",
  },
  {
    patternId: "development-sovereignty-builder",
    analogy: "An operating system",
    explanation:
      "Capacity is the operating system a state runs its choices on. Heavy outsourcing can leave future options dependent on someone else’s machine.",
    whereItBreaks: "Building an independent stack is slow, expensive, and often incomplete.",
  },
  {
    patternId: "cross-pressured-synthesizer",
    analogy: "Different tools, one workshop",
    explanation:
      "A practiced carpenter changes tools with the task. This pattern changes logics when the domain changes.",
    whereItBreaks:
      "Switching tools looks inconsistent when the rule for choosing among them stays implicit.",
  },
] as const

const mentalModelsByPatternId = new Map(
  profileMentalModels.map((model) => [model.patternId, model]),
)

export function getProfileMentalModel(patternId: string): ProfileMentalModel | null {
  return mentalModelsByPatternId.get(patternId) ?? null
}
