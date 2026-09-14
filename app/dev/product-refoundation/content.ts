/** Prototype vocabulary only. No production labels, routes, or IDs are renamed. */
export const AREAS = [
  { id: "start", label: "Start", note: "Begin with your own judgments" },
  { id: "cases", label: "Cases", note: "Put a decision in context" },
  { id: "guide", label: "Field Guide", note: "Read the ideas behind the questions" },
  { id: "record", label: "My Record", note: "Return to saved and unfinished work" },
] as const

export type AreaId = (typeof AREAS)[number]["id"]
export type CaseEntry = { label: string; title: string | null; href: string }

export const INTRO = "You’ll make judgments about recurring problems in international affairs, beginning with the broad questions in First Principles. Security, Technology, and AI Governance ask more specific questions; cases put you inside a decision, while the Field Guide explains the ideas behind it. Your results interpret how you reason about world politics, with room for disagreement and change. They do not diagnose your personality."

export const START_PATHS = [
  { label: "First Principles", href: "/quiz", description: "Broad questions about how you explain recurring problems in world politics." },
  { label: "Security", href: "/modules/security", description: "Deterrence, escalation, alliances, coercion, and force." },
  { label: "Technology", href: "/modules/technology", description: "Technology controls, capacity, dependence, and international rules." },
  { label: "AI Governance", href: "/ai/quiz", description: "Frontier capability, oversight, access, competition, and political authority." },
] as const

export const GUIDE_PATHS = [
  { label: "Foundation readings", href: "/archetypes" },
  { label: "Traditions", href: "/explore#modeled-traditions" },
  { label: "Dimensions: what the questions track", href: "/explore#foundation-dimensions" },
  { label: "Thinkers and public positions", href: "/explore/reference" },
  { label: "AI governance approaches", href: "/ai/field-guide" },
  { label: "Methods and sources", href: "/method" },
] as const

export const HOW_IT_WORKS = [
  { label: "First Principles", description: "The broad starting point." },
  { label: "Specific areas", description: "Security, Technology, and AI ask different questions and keep their own results." },
  { label: "Cases", description: "Apply the same habits of reasoning to an actual decision." },
  { label: "Field Guide", description: "Compare the ideas behind the results and see where the model is incomplete." },
] as const
