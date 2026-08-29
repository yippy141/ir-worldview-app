"use client"

import { ArmillaryVisual } from "./armillary-visual"
import { RootShell, type RootTypeTreatment, type RootVisitorMode } from "./root-shell"

export function ArmillaryRoot({
  visitor,
  typeTreatment,
}: Readonly<{ visitor: RootVisitorMode; typeTreatment: RootTypeTreatment }>) {
  return (
    <RootShell
      variant="armillary-atlas"
      visitor={visitor}
      typeTreatment={typeTreatment}
      renderVisual={(state) => <ArmillaryVisual {...state} />}
    />
  )
}
