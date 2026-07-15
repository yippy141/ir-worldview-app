import countryGeometryJson from "@/lib/world-stage/data/world-countries-110m.json" with {
  type: "json",
}
import type {
  CountryRole,
  WorldStageFlow,
  WorldStageLngLat,
  WorldStageNode,
  WorldStageScene,
  WorldStageTooltipItem,
} from "@/lib/world-stage/types"

type CountryGeometry = {
  type: "Polygon" | "MultiPolygon"
  coordinates: number[][][] | number[][][][]
}

export type WorldStageGeoJsonFeature<
  Geometry extends { type: string; coordinates: unknown },
  Properties extends Record<string, string | number>,
> = {
  type: "Feature"
  id: string
  properties: Properties
  geometry: Geometry
}

export type WorldStageGeoJsonFeatureCollection<Feature> = {
  type: "FeatureCollection"
  features: Feature[]
}

export type WorldStageCountryFeature = WorldStageGeoJsonFeature<
  CountryGeometry,
  {
    iso3: string
    name: string
    role: CountryRole
    roleLabel: string
    rationale: string
    confidence: string
    asOf: string
    sourceCount: number
    entityKind: "country"
    label: string
    meaning: string
  }
>

export type WorldStageNodeFeature = WorldStageGeoJsonFeature<
  { type: "Point"; coordinates: WorldStageLngLat },
  {
    id: string
    entityKind: "node"
    label: string
    kind: string
    meaning: string
    confidence: string
    asOf: string
    sourceCount: number
  }
>

export type WorldStageFlowFeature = WorldStageGeoJsonFeature<
  { type: "LineString"; coordinates: readonly [WorldStageLngLat, WorldStageLngLat] },
  {
    id: string
    entityKind: "flow"
    label: string
    kind: string
    meaning: string
    direction: string
    confidence: string
    asOf: string
    sourceCount: number
    weight: number
  }
>

type SourceCountryFeature = {
  type: "Feature"
  id: string
  properties: { iso3: string; name: string }
  geometry: CountryGeometry
}

type SourceCountryCollection = {
  type: "FeatureCollection"
  features: SourceCountryFeature[]
}

export const WORLD_STAGE_COUNTRY_GEOMETRY =
  countryGeometryJson as unknown as SourceCountryCollection

export const WORLD_STAGE_FALLBACK_NODE_LIMIT = 6
export const WORLD_STAGE_FALLBACK_FLOW_LIMIT = 4

const roleLabels: Record<CountryRole, string> = {
  focus: "Focus",
  partner: "Partner",
  competitor: "Competitor",
  hedging: "Hedging",
  exposed: "Exposed",
  contested: "Contested",
  neutral: "No assigned role",
}

export function getWorldStageRoleLabel(role: CountryRole) {
  return roleLabels[role]
}

export function buildWorldStageCountryData(
  scene: WorldStageScene,
): WorldStageGeoJsonFeatureCollection<WorldStageCountryFeature> {
  const roles = new Map(scene.countryRoles.map((role) => [role.iso3, role]))

  return {
    type: "FeatureCollection",
    features: WORLD_STAGE_COUNTRY_GEOMETRY.features.map((feature) => {
      const country = roles.get(feature.properties.iso3)
      const role = country?.role ?? "neutral"
      const rationale = country?.rationale ?? "No reviewed role is assigned in this lens."

      return {
        type: "Feature",
        id: feature.id,
        properties: {
          iso3: feature.properties.iso3,
          name: feature.properties.name,
          role,
          roleLabel: roleLabels[role],
          rationale,
          confidence: country?.confidence ?? "not assigned",
          asOf: scene.asOf,
          sourceCount: country?.sourceRefs.length ?? 0,
          entityKind: "country",
          label: `${feature.properties.name} · ${roleLabels[role]}`,
          meaning: rationale,
        },
        geometry: feature.geometry,
      }
    }),
  }
}

export function buildWorldStageNodeData(
  scene: WorldStageScene,
): WorldStageGeoJsonFeatureCollection<WorldStageNodeFeature> {
  return {
    type: "FeatureCollection",
    features: scene.nodes.map((node) => ({
      type: "Feature",
      id: node.id,
      properties: {
        id: node.id,
        entityKind: "node",
        label: node.label,
        kind: node.kind,
        meaning: node.whyItMatters,
        confidence: node.confidence,
        asOf: scene.asOf,
        sourceCount: node.sourceRefs.length,
      },
      geometry: { type: "Point", coordinates: node.coordinates },
    })),
  }
}

export function buildWorldStageFlowData(
  scene: WorldStageScene,
): WorldStageGeoJsonFeatureCollection<WorldStageFlowFeature> {
  const nodes = new Map(scene.nodes.map((node) => [node.id, node]))

  return {
    type: "FeatureCollection",
    features: scene.flows.flatMap((flow) => {
      const from = nodes.get(flow.fromNodeId)
      const to = nodes.get(flow.toNodeId)
      if (!from || !to) return []

      return [
        {
          type: "Feature" as const,
          id: flow.id,
          properties: {
            id: flow.id,
            entityKind: "flow" as const,
            label: flow.label,
            kind: flow.kind,
            meaning: flow.meaning,
            direction: flow.direction,
            confidence: flow.confidence,
            asOf: flow.asOf,
            sourceCount: flow.sourceRefs.length,
            weight: flow.weight,
          },
          geometry: {
            type: "LineString" as const,
            coordinates: [from.coordinates, to.coordinates] as const,
          },
        },
      ]
    }),
  }
}

export function getWorldStageFallbackNodes(scene: WorldStageScene): readonly WorldStageNode[] {
  return scene.nodes.slice(0, WORLD_STAGE_FALLBACK_NODE_LIMIT)
}

export function getWorldStageFallbackFlows(scene: WorldStageScene): readonly WorldStageFlow[] {
  return scene.flows.slice(0, WORLD_STAGE_FALLBACK_FLOW_LIMIT)
}

export function getWorldStageTooltipItems(scene: WorldStageScene): WorldStageTooltipItem[] {
  return [
    ...scene.countryRoles.map((country) => ({
      id: country.iso3,
      kind: "country" as const,
      label: `${country.iso3} · ${roleLabels[country.role]}`,
      meaning: country.rationale,
      asOf: scene.asOf,
      sourceCount: country.sourceRefs.length,
    })),
    ...scene.nodes.map((node) => ({
      id: node.id,
      kind: "node" as const,
      label: node.label,
      meaning: node.whyItMatters,
      asOf: scene.asOf,
      sourceCount: node.sourceRefs.length,
    })),
    ...scene.flows.map((flow) => ({
      id: flow.id,
      kind: "flow" as const,
      label: flow.label,
      meaning: flow.meaning,
      asOf: flow.asOf,
      sourceCount: flow.sourceRefs.length,
    })),
  ]
}
