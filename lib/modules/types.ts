import type { DimensionScores, QuizMode } from "@/lib/types"

export type ModuleSlug = "security" | "technology"

export type ModuleAxis = {
  key: string
  label: string
  lowLabel: string
  highLabel: string
}

export type ModuleOption = {
  id: string
  title: string
  label: string
  signals: Record<string, number>
}

export type ModuleQuestion = {
  id: string
  kind?: "case" | "synthesis"
  title: string
  prompt: string
  primer: string
  options: ModuleOption[]
  allowSecondChoiceInAnalyst?: boolean
}

export type ModuleSelection = {
  primary: string
  secondary?: string
}

export type ModuleAnswers = Record<string, ModuleSelection>

export type ModulePayload = {
  v: 2
  slug: ModuleSlug
  mode: QuizMode
  answers: ModuleAnswers
}

export type ModuleInterpretation = {
  headline: string
  summary: string
  instincts: string[]
  challenge: string
}

export type ModuleResult = ModuleInterpretation & {
  scores: Record<string, number>
  comparison?: string
}

export type ModuleDefinition = {
  slug: ModuleSlug
  title: string
  shortTitle: string
  timeEstimate: Record<QuizMode, string>
  description: string
  measures: string[]
  axes: ModuleAxis[]
  questionsByMode: Record<QuizMode, ModuleQuestion[]>
  interpret: (scores: Record<string, number>) => ModuleInterpretation
  compareToFoundation?: (
    scores: Record<string, number>,
    foundation: DimensionScores,
  ) => string
}
