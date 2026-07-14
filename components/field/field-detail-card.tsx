"use client"

import Link from "next/link"
import { referenceEntityTypeLabel, type FieldItem } from "@/lib/field/items"
import { FIELD_LAYER_CONFIG_BY_ID } from "@/lib/field/layers"

const KIND_ACTION_LABELS: Record<FieldItem["kind"], string> = {
  baseline: "Open Foundation result",
  "perspective-run": "View run result",
  "atlas-pattern": "Read this pattern",
  "reference-profile": "Read the profile",
  "reference-movement": "Read the movement",
}

type Props = {
  item: FieldItem
  onClose: () => void
}

export function FieldDetailCard({ item, onClose }: Props) {
  const layerLabel = FIELD_LAYER_CONFIG_BY_ID[item.layerId].label

  return (
    <section className="field-detail-card stack-xs" aria-label={`Selected: ${item.label}`}>
      <div className="field-detail-card__head">
        <p className="field-detail-card__kicker">
          {item.entityType ? referenceEntityTypeLabel(item.entityType) : layerLabel}
        </p>
        <button
          type="button"
          className="field-detail-card__close"
          onClick={onClose}
          aria-label="Close details"
        >
          Close
        </button>
      </div>
      <h3 className="field-detail-card__title">{item.label}</h3>
      <p className="field-detail-card__summary">{item.summary}</p>
      {item.metaLine ? <p className="field-detail-card__meta">{item.metaLine}</p> : null}
      {item.draft ? (
        <p className="reference-draft-tag">Research draft · pending editorial review</p>
      ) : null}
      {item.position === null ? (
        <p className="muted field-detail-card__note">
          This entry appears in the list only. It has no position on this map.
        </p>
      ) : null}
      <p className="field-detail-card__action">
        <Link href={item.href}>{KIND_ACTION_LABELS[item.kind]} →</Link>
      </p>
    </section>
  )
}
