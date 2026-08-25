import type {
  ModuleDefinition,
  ModuleOption,
  ModuleQuestion,
} from "@/lib/modules/types"
import type { ChoiceCardType } from "@/lib/types"

export type SelectedModuleCall = {
  question: ModuleQuestion
  primary: ModuleOption | null
  secondary: ModuleOption | null
}

export type ModuleDecisiveCall = {
  id: string
  caseTitle: string
  laneLabel: string
  cardType: string
  framing: string
  implication: string
}

export function buildModuleDecisiveCalls({
  moduleDefinition,
  selected,
  laneLabelMap,
}: {
  moduleDefinition: ModuleDefinition
  selected: SelectedModuleCall[]
  laneLabelMap: Record<string, string>
}): ModuleDecisiveCall[] {
  const axisMap = Object.fromEntries(
    moduleDefinition.axes.map((axis) => [axis.key, axis]),
  ) as Record<string, ModuleDefinition["axes"][number]>

  return selected
    .flatMap((selection) => {
      if (!selection.primary) return []

      const signalStrength = Object.entries(selection.primary.signals)
        .map(([axisKey, value]) => ({
          axisKey,
          value,
          strength: Math.abs(value - 4),
        }))
        .sort((left, right) => right.strength - left.strength)

      const strongest = signalStrength.find((signal) => axisMap[signal.axisKey])
      if (!strongest) return []

      return [
        {
          selection,
          primary: selection.primary,
          strongest,
          rank:
            strongest.strength +
            (signalStrength[1]?.strength ?? 0) * 0.35 +
            (selection.question.cardType === "actorLens" ? 0.15 : 0),
        },
      ]
    })
    .sort((left, right) => right.rank - left.rank)
    .slice(0, 6)
    .map(({ selection, primary, strongest }) => {
      const axis = axisMap[strongest.axisKey]
      const leansHigh = strongest.value >= 4
      const direction = leansHigh ? axis.highLabel : axis.lowLabel
      const contrast = leansHigh ? axis.lowLabel : axis.highLabel

      return {
        id: selection.question.id,
        caseTitle: selection.question.title,
        laneLabel: laneLabelMap[selection.question.lane] ?? selection.question.lane,
        cardType: formatModuleCardType(selection.question.cardType),
        framing: primary.title,
        implication: buildDecisiveImplication({
          cardType: selection.question.cardType,
          axisLabel: axis.label,
          direction,
          contrast,
        }),
      }
    })
}

function buildDecisiveImplication({
  cardType,
  axisLabel,
  direction,
  contrast,
}: {
  cardType: ChoiceCardType
  axisLabel: string
  direction: string
  contrast: string
}) {
  const axis = axisLabel.toLowerCase()
  const toward = direction.toLowerCase()
  const away = contrast.toLowerCase()

  if (cardType === "actorLens") {
    return `From that actor's position, this makes ${axis} the pressure point: closer to ${toward} than ${away}.`
  }

  if (cardType === "decision") {
    return `As a decision, this puts the response mainly on ${axis}: closer to ${toward} than ${away}.`
  }

  if (cardType === "explanation") {
    return `As an explanation, this reads the case mainly through ${axis}: closer to ${toward} than ${away}.`
  }

  return `This choice makes ${axis} the clearest pressure point: closer to ${toward} than ${away}.`
}

export function formatModuleCardType(cardType: ChoiceCardType) {
  if (cardType === "explanation") return "Explanation"
  if (cardType === "decision") return "Decision"
  if (cardType === "actorLens") return "Actor lens"
  return "Both"
}
