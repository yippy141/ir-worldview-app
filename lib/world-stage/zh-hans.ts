import {
  zhHansWorldStageScenes,
  zhHansWorldStageUi,
} from "@/content/locales/zh-Hans/world-stage"
import { worldStageScenes } from "@/lib/world-stage/scenes"
import type { WorldStageScene } from "@/lib/world-stage/types"

export const zhHansWorldStageMenuItems = zhHansWorldStageUi.menu
export const zhHansWorldStageSceneOptions = zhHansWorldStageUi.sceneOptions
export const zhHansWorldStageUtilityDestinations = zhHansWorldStageUi.utility

export const zhHansWorldStageScenesWithSharedGeometry: readonly WorldStageScene[] =
  worldStageScenes.map((scene) => {
    const copy = zhHansWorldStageScenes.find((candidate) => candidate.sceneId === scene.id)
    if (!copy || copy.researchSceneId !== scene.researchSceneId) {
      throw new Error(`Missing approved zh-Hans World Stage copy for ${scene.id}.`)
    }

    const countryCopy = new Map<string, (typeof copy.countryRoles)[number]>(
      copy.countryRoles.map((item) => [item.iso3, item]),
    )
    const nodeCopy = new Map<string, (typeof copy.nodes)[number]>(
      copy.nodes.map((item) => [item.researchId, item]),
    )
    const flowCopy = new Map<string, (typeof copy.flows)[number]>(
      copy.flows.map((item) => [item.researchId, item]),
    )

    return {
      ...scene,
      publicLabel: copy.publicLabel,
      caption: copy.caption,
      lensOwner: copy.lensOwner,
      asOf: copy.asOf,
      countryRoles: scene.countryRoles.map((item) => {
        const localized = countryCopy.get(item.iso3)
        if (!localized) throw new Error(`Missing zh-Hans country copy for ${scene.id}:${item.iso3}.`)
        return { ...item, rationale: localized.rationale }
      }),
      nodes: scene.nodes.map((item) => {
        const localized = nodeCopy.get(item.researchId)
        if (!localized) throw new Error(`Missing zh-Hans node copy for ${scene.id}:${item.researchId}.`)
        return {
          ...item,
          label: localized.label,
          whyItMatters: localized.whyItMatters,
        }
      }),
      flows: scene.flows.map((item) => {
        const localized = flowCopy.get(item.researchId)
        if (!localized) throw new Error(`Missing zh-Hans flow copy for ${scene.id}:${item.researchId}.`)
        return {
          ...item,
          label: localized.label,
          meaning: localized.meaning,
        }
      }),
    }
  })

export function getZhHansWorldStageScene(sceneId: string) {
  return zhHansWorldStageScenesWithSharedGeometry.find((scene) => scene.id === sceneId) ?? null
}
