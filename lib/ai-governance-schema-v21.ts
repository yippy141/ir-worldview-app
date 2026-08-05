import type {
  AiLikertQuestion,
  AiQuizMode,
  AiScenarioOption,
  AiScenarioQuestion,
} from "@/lib/ai-governance-types"
import aiGovernanceBankJson from "@/content/instrument/ai-governance.v2.json" with {
  type: "json",
}

/**
 * Immutable V21 AI Governance bank adapter.
 * Historical payloads resolve to bank v2 through the version registry.
 */
export const AI_GOVERNANCE_BANK_VERSION = 2
export const AI_GOVERNANCE_SCHEMA_VERSION = 1
export { AI_GOVERNANCE_STORAGE_KEY } from "@/lib/storage-keys"
export const aiLikertScale = [1, 2, 3, 4, 5, 6, 7] as const

export const aiAxisLabels = {
  riskHorizon: "Risk horizon",
  deploymentPace: "Deployment pace",
  oversight: "Public oversight",
  geopolitics: "Competition vs coordination",
  openness: "Openness vs control",
  militaryRole: "Military role",
  legitimacy: "Legitimacy and rule-setting",
  humanFuture: "Human future",
} as const


type AiDataModes = { modes: AiQuizMode[] }
type AiDataLikertQuestion = AiLikertQuestion & AiDataModes
type AiDataScenarioOption = Omit<AiScenarioOption, "weights"> & {
  signals: AiScenarioOption["weights"]
}
type AiDataScenarioQuestion =
  Omit<AiScenarioQuestion, "options" | "analystOptions"> &
    AiDataModes & {
      options: AiDataScenarioOption[]
      analystOptions?: AiDataScenarioOption[]
    }
type AiDataItem = AiDataLikertQuestion | AiDataScenarioQuestion

const aiDataItems = aiGovernanceBankJson.items as unknown as AiDataItem[]

function loadAiLikertQuestion(item: AiDataLikertQuestion): AiLikertQuestion {
  const { modes, ...question } = item
  void modes
  return question
}

function loadAiScenarioOption(option: AiDataScenarioOption): AiScenarioOption {
  const { signals, ...content } = option
  return { ...content, weights: signals }
}

function loadAiScenarioQuestion(
  item: AiDataScenarioQuestion,
): AiScenarioQuestion {
  const { modes, options, analystOptions, ...question } = item
  void modes
  return {
    ...question,
    options: options.map(loadAiScenarioOption),
    ...(analystOptions
      ? { analystOptions: analystOptions.map(loadAiScenarioOption) }
      : {}),
  }
}

const aiLikertDataItems = aiDataItems.filter(
  (item): item is AiDataLikertQuestion => item.kind === "likert",
)

export const aiCoreQuestions: AiLikertQuestion[] = aiLikertDataItems
  .filter((item) => item.modes.includes("standard"))
  .map(loadAiLikertQuestion)

export const aiAnalystOnlyQuestions: AiLikertQuestion[] = aiLikertDataItems
  .filter(
    (item) =>
      item.modes.includes("analyst") && !item.modes.includes("standard"),
  )
  .map(loadAiLikertQuestion)

export const aiScenarioQuestions: Record<string, AiScenarioQuestion> =
  Object.fromEntries(
    aiDataItems
      .filter(
        (item): item is AiDataScenarioQuestion => item.kind === "scenario",
      )
      .map((item) => [item.id, loadAiScenarioQuestion(item)]),
  )

export function getAiCoreQuestions(mode: AiQuizMode): AiLikertQuestion[] {
  if (mode === "analyst") return [...aiCoreQuestions, ...aiAnalystOnlyQuestions]
  return aiCoreQuestions
}

export const aiQuestionCountsByMode = {
  standard: aiCoreQuestions.length,
  analyst: aiCoreQuestions.length + aiAnalystOnlyQuestions.length,
} as const

export const aiAnalystScenarioOrder = [
  "auditIncidentRegime",
  "computeGovernance",
  "criticalInfrastructure",
] as const

/** Returns the effective options for a scenario in the given mode. */
export function getScenarioOptions(
  question: AiScenarioQuestion,
  mode: AiQuizMode,
): AiScenarioOption[] {
  if (mode === "analyst" && question.analystOptions) return question.analystOptions
  return question.options
}

/** Returns the effective prompt for a scenario in the given mode. */
export function getScenarioPrompt(
  question: AiScenarioQuestion,
  mode: AiQuizMode,
): string {
  if (mode === "analyst" && question.analystPrompt) return question.analystPrompt
  return question.prompt
}

export const aiRootScenarioOrder = [
  "capabilityThreshold",
  "rivalBreakthrough",
  "openWeights",
  "militaryIntegration",
  "multilateralVerification",
  "futureSociety",
] as const

export function getAiScenarioOrder(mode: AiQuizMode) {
  return mode === "analyst"
    ? [...aiRootScenarioOrder, ...aiAnalystScenarioOrder]
    : [...aiRootScenarioOrder]
}

export const aiScenarioCountsByMode = {
  standard: aiRootScenarioOrder.length,
  analyst: aiRootScenarioOrder.length + aiAnalystScenarioOrder.length,
} as const

export const aiTotalQuestionCountsByMode = {
  standard: aiQuestionCountsByMode.standard + aiScenarioCountsByMode.standard,
  analyst: aiQuestionCountsByMode.analyst + aiScenarioCountsByMode.analyst,
} as const
