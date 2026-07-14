/**
 * Mental models for Worldview Profile pages (V17).
 *
 * One concrete analogy per profile, always paired with a caveat, per the V17
 * pack's profile-page structure. The analogy families (insurance under
 * uncertainty, rules of the road, operating system, bargaining leverage,
 * social script, structural plumbing) come from the approved implementation
 * pack; the sentences below are new editorial copy.
 *
 * EDITORIAL STATUS: drafted in-sprint, pending the same review pass as the
 * case library. These are teaching devices, not historical claims.
 */

export type ProfileMentalModel = {
  /** AtlasLitePattern id. */
  patternId: string
  /** Short analogy name, e.g. "Insurance under uncertainty". */
  analogy: string
  /** One or two sentences applying the analogy. */
  body: string
  /** The limit of the analogy, stated plainly. */
  caveat: string
}

export const profileMentalModels: readonly ProfileMentalModel[] = [
  {
    patternId: "broad-spectrum-bridge-builder",
    analogy: "A second opinion",
    body:
      "Like a clinician who orders one more test before naming the disease, this profile keeps rival diagnoses open while the evidence accumulates.",
    caveat: "Some decisions arrive before the second opinion does.",
  },
  {
    patternId: "constraint-first-realist",
    analogy: "Insurance under uncertainty",
    body:
      "Deterrence with limits works like insurance: steady, visible costs paid to cap the worst outcome, not to win a payout.",
    caveat:
      "Insurance assumes the risk stays priceable. A rival probing the boundary can change the odds faster than the premium adjusts.",
  },
  {
    patternId: "competitive-balancer",
    analogy: "Bargaining leverage",
    body:
      "Every arrangement rests on the fallback options underneath it: the side that can walk away more easily sets the terms.",
    caveat: "Treating every table as a leverage contest can break tables that were quietly producing value.",
  },
  {
    patternId: "coalition-pragmatist",
    analogy: "Convoy speed",
    body:
      "A convoy moves at the speed its most exposed ship can sustain. A coalition policy is only as durable as the partner under the most domestic pressure.",
    caveat: "Convoys protect, but they can also slow a response at the moment speed matters most.",
  },
  {
    patternId: "institution-builder",
    analogy: "Rules of the road",
    body:
      "Traffic rules let strangers move fast without colliding because everyone can predict everyone else.",
    caveat: "Road rules assume most drivers accept the system. They say little about a driver who profits from the crash.",
  },
  {
    patternId: "legitimacy-attuned-reader",
    analogy: "A social script",
    body:
      "The same line lands differently depending on who delivers it and what the audience remembers. Moves in world politics read from a script, not a physics table.",
    caveat: "Scripts explain reception. They can understate what raw capability does regardless of framing.",
  },
  {
    patternId: "justice-forward-solidarist",
    analogy: "A locked door in a fire",
    body:
      "Sovereignty works like a locked door: most days the lock protects the household, but a fire changes what breaking it means.",
    caveat: "Every forced door becomes precedent for the next one, including doors forced in bad faith.",
  },
  {
    patternId: "structural-inequality-critic",
    analogy: "Structural plumbing",
    body:
      "Outcomes follow the pipes: whoever owns the infrastructure of finance, production, and rule-writing decides where pressure flows.",
    caveat: "Plumbing explains the flow, not every act of agency inside it.",
  },
  {
    patternId: "development-sovereignty-builder",
    analogy: "An operating system",
    body:
      "Capacity is the operating system a state runs its choices on. Outsource too much of it, and your future options only run on someone else's machine.",
    caveat: "Building your own stack is slow and expensive, and the crisis may not wait.",
  },
  {
    patternId: "cross-pressured-synthesizer",
    analogy: "Different tools, one workshop",
    body:
      "A carpenter does not reach for the saw on every task. This profile switches logics by domain the way a practiced hand switches tools.",
    caveat: "Tool-switching reads as inconsistency unless the rule for choosing the tool is stated.",
  },
] as const

const mentalModelsByPatternId = new Map(
  profileMentalModels.map((model) => [model.patternId, model]),
)

export function getProfileMentalModel(patternId: string): ProfileMentalModel | null {
  return mentalModelsByPatternId.get(patternId) ?? null
}
