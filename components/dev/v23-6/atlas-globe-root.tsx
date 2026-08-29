"use client"

import { AtlasGlobeVisual } from "./atlas-globe-visual"
import { RootShell, type RootTypeTreatment, type RootVisitorMode } from "./root-shell"

export function AtlasGlobeRoot({
  visitor,
  typeTreatment,
}: Readonly<{ visitor: RootVisitorMode; typeTreatment: RootTypeTreatment }>) {
  return (
    <RootShell
      variant="atlas-globe"
      visitor={visitor}
      typeTreatment={typeTreatment}
      renderVisual={(state) => <AtlasGlobeVisual {...state} />}
    />
  )
}
