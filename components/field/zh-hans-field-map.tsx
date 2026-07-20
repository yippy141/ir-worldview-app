"use client"

import { FieldMap, type FieldMapMarker } from "@/components/field/field-map"
import { zhHansWorldviewMapUi } from "@/content/locales/zh-Hans/worldview-map"

export function ZhHansFieldMap({
  ariaLabel,
  caption,
  markers,
}: {
  ariaLabel: string
  caption: string
  markers: FieldMapMarker[]
}) {
  return (
    <FieldMap
      ariaLabel={ariaLabel}
      caption={caption}
      markers={markers}
      copy={zhHansWorldviewMapUi}
    />
  )
}
