import { isValidWorldStageIso3Key } from "@/lib/world-stage/scenes"
import type {
  WorldStageNode,
  WorldStageRoute,
  WorldStageValidationError,
  WorldStageValidationResult,
} from "@/lib/world-stage/types"

/**
 * Section stages are static, cropped excerpts of the World Stage system used
 * on section landing pages. They reuse the reviewed ISO-3 allowlist and the
 * editorial-demo posture of the homepage scenes: display only, never scoring.
 */

export const SECTION_STAGE_IDS = [
  "focus-areas",
  "perspectives",
  "ai-futures",
] as const

export type SectionStageId = (typeof SECTION_STAGE_IDS)[number]

export type SectionStageTone = "brass" | "steel" | "rust"

export type SectionStageGroup = {
  /** Stable visual-selection ID, e.g. a Focus Areas theatre. */
  id: string
  label: string
  tone: SectionStageTone
  nodes: readonly WorldStageNode[]
  routes: readonly WorldStageRoute[]
}

export type SectionStageDefinition = {
  id: SectionStageId
  /** Visible lens label, mirroring the homepage scene labels. */
  lens: string
  /** Visible caveat. Section stages are illustrative, never live claims. */
  qualification: string
  groups: readonly SectionStageGroup[]
}

const sectionStageQualification = "Illustrative editorial scene · not live intelligence"

export const sectionStages = [
  {
    id: "focus-areas",
    lens: "Issue-specific pressure",
    qualification: sectionStageQualification,
    groups: [
      {
        id: "security",
        label: "Security theatre",
        tone: "brass",
        nodes: [
          { id: "focus-security-usa", iso3Key: "USA", label: "United States · illustrative anchor" },
          { id: "focus-security-deu", iso3Key: "DEU", label: "Germany · illustrative anchor" },
          { id: "focus-security-jpn", iso3Key: "JPN", label: "Japan · illustrative anchor" },
        ],
        routes: [
          {
            id: "focus-security-route-one",
            fromNodeId: "focus-security-usa",
            toNodeId: "focus-security-deu",
            label: "Illustrative security route",
          },
          {
            id: "focus-security-route-two",
            fromNodeId: "focus-security-usa",
            toNodeId: "focus-security-jpn",
            label: "Illustrative security route",
          },
        ],
      },
      {
        id: "technology",
        label: "Technology theatre",
        tone: "steel",
        nodes: [
          { id: "focus-technology-sgp", iso3Key: "SGP", label: "Singapore · illustrative anchor" },
          { id: "focus-technology-ind", iso3Key: "IND", label: "India · illustrative anchor" },
          { id: "focus-technology-can", iso3Key: "CAN", label: "Canada · illustrative anchor" },
        ],
        routes: [
          {
            id: "focus-technology-route-one",
            fromNodeId: "focus-technology-sgp",
            toNodeId: "focus-technology-ind",
            label: "Illustrative technology route",
          },
          {
            id: "focus-technology-route-two",
            fromNodeId: "focus-technology-ind",
            toNodeId: "focus-technology-can",
            label: "Illustrative technology route",
          },
        ],
      },
    ],
  },
  {
    id: "perspectives",
    lens: "Judgment under context",
    qualification: sectionStageQualification,
    groups: [
      {
        id: "seats",
        label: "Strategic seats",
        tone: "steel",
        nodes: [
          { id: "section-perspectives-can", iso3Key: "CAN", label: "Canada · illustrative anchor" },
          { id: "section-perspectives-ken", iso3Key: "KEN", label: "Kenya · illustrative anchor" },
          { id: "section-perspectives-sgp", iso3Key: "SGP", label: "Singapore · illustrative anchor" },
          { id: "section-perspectives-bra", iso3Key: "BRA", label: "Brazil · illustrative anchor" },
        ],
        routes: [
          {
            id: "section-perspectives-route-one",
            fromNodeId: "section-perspectives-can",
            toNodeId: "section-perspectives-ken",
            label: "Illustrative context route",
          },
          {
            id: "section-perspectives-route-two",
            fromNodeId: "section-perspectives-ken",
            toNodeId: "section-perspectives-sgp",
            label: "Illustrative context route",
          },
          {
            id: "section-perspectives-route-three",
            fromNodeId: "section-perspectives-bra",
            toNodeId: "section-perspectives-ken",
            label: "Illustrative context route",
          },
        ],
      },
    ],
  },
  {
    id: "ai-futures",
    lens: "Technology and order",
    qualification: sectionStageQualification,
    groups: [
      {
        id: "compute",
        label: "Compute and governance",
        tone: "rust",
        nodes: [
          { id: "section-futures-usa", iso3Key: "USA", label: "United States · illustrative anchor" },
          { id: "section-futures-jpn", iso3Key: "JPN", label: "Japan · illustrative anchor" },
          { id: "section-futures-aus", iso3Key: "AUS", label: "Australia · illustrative anchor" },
          { id: "section-futures-deu", iso3Key: "DEU", label: "Germany · illustrative anchor" },
        ],
        routes: [
          {
            id: "section-futures-route-one",
            fromNodeId: "section-futures-usa",
            toNodeId: "section-futures-jpn",
            label: "Illustrative futures route",
          },
          {
            id: "section-futures-route-two",
            fromNodeId: "section-futures-jpn",
            toNodeId: "section-futures-aus",
            label: "Illustrative futures route",
          },
          {
            id: "section-futures-route-three",
            fromNodeId: "section-futures-usa",
            toNodeId: "section-futures-deu",
            label: "Illustrative futures route",
          },
        ],
      },
    ],
  },
] as const satisfies readonly SectionStageDefinition[]

const sectionStageById = new Map<string, SectionStageDefinition>(
  sectionStages.map((stage) => [stage.id, stage]),
)

export function getSectionStage(id: SectionStageId): SectionStageDefinition {
  const stage = sectionStageById.get(id)
  if (!stage) throw new Error(`Unknown section stage: ${id}`)
  return stage
}

export function validateSectionStages(
  stages: readonly SectionStageDefinition[] = sectionStages,
): WorldStageValidationResult {
  const errors: WorldStageValidationError[] = []
  const stageIds = new Set<string>()
  const entityIds = new Set<string>()

  stages.forEach((stage, stageIndex) => {
    const stagePath = `sectionStages[${stageIndex}]`

    if (stageIds.has(stage.id)) {
      errors.push({
        code: "scene.id.duplicate",
        path: `${stagePath}.id`,
        message: `Section stage ID must be unique: ${stage.id}.`,
      })
    }
    stageIds.add(stage.id)

    if (!stage.qualification.trim()) {
      errors.push({
        code: "scene.qualification.missing",
        path: `${stagePath}.qualification`,
        message: "Section stages require a visible qualification.",
      })
    }

    stage.groups.forEach((group, groupIndex) => {
      const groupPath = `${stagePath}.groups[${groupIndex}]`
      const localNodeIds = new Set<string>()

      group.nodes.forEach((node, nodeIndex) => {
        const nodePath = `${groupPath}.nodes[${nodeIndex}]`

        if (entityIds.has(node.id)) {
          errors.push({
            code: "node.id.duplicate",
            path: `${nodePath}.id`,
            message: `Section stage node ID must be globally unique: ${node.id}.`,
          })
        }
        entityIds.add(node.id)
        localNodeIds.add(node.id)

        if (!isValidWorldStageIso3Key(node.iso3Key)) {
          errors.push({
            code: "node.iso3.invalid",
            path: `${nodePath}.iso3Key`,
            message: `ISO-3 key is not in the reviewed allowlist: ${node.iso3Key}.`,
          })
        }
      })

      group.routes.forEach((route, routeIndex) => {
        const routePath = `${groupPath}.routes[${routeIndex}]`

        if (entityIds.has(route.id)) {
          errors.push({
            code: "route.id.duplicate",
            path: `${routePath}.id`,
            message: `Section stage route ID must be globally unique: ${route.id}.`,
          })
        }
        entityIds.add(route.id)

        for (const [endpoint, nodeId] of [
          ["fromNodeId", route.fromNodeId],
          ["toNodeId", route.toNodeId],
        ] as const) {
          if (!localNodeIds.has(nodeId)) {
            errors.push({
              code: "route.endpoint.missing",
              path: `${routePath}.${endpoint}`,
              message: `Route endpoint must resolve inside group ${group.id}: ${nodeId}.`,
            })
          }
        }
      })
    })
  })

  return errors.length === 0 ? { ok: true, errors: [] } : { ok: false, errors }
}

const shippedSectionStageValidation = validateSectionStages()

if (!shippedSectionStageValidation.ok) {
  throw new Error(
    `Invalid shipped section stages: ${JSON.stringify(shippedSectionStageValidation.errors)}`,
  )
}
