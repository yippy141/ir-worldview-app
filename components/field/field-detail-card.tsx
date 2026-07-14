"use client"

import Link from "next/link"
import { referenceEntityTypeLabel, type FieldItem } from "@/lib/field/items"
import { FIELD_LAYER_CONFIG_BY_ID } from "@/lib/field/layers"
import styles from "./worldview-map.module.css"

const KIND_ACTION_LABELS: Record<FieldItem["kind"], string> = {
  baseline: "Open Foundation result",
  "perspective-run": "View run result",
  "atlas-pattern": "Read this worldview profile",
  "reference-profile": "Read the profile",
  "reference-movement": "Read the movement",
}

type Props = {
  item: FieldItem
  onClose: () => void
  headingId?: string
}

export function FieldDetailCard({ item, onClose, headingId = "field-detail-heading" }: Props) {
  const layerLabel = FIELD_LAYER_CONFIG_BY_ID[item.layerId].label

  return (
    <section className={styles.detailCard} aria-labelledby={headingId}>
      <div className={styles.detailHead}>
        <p className={styles.detailContext}>
          {item.entityType ? referenceEntityTypeLabel(item.entityType) : layerLabel}
        </p>
        <button
          type="button"
          className={styles.detailClose}
          onClick={onClose}
          aria-label="Close details"
        >
          Close
        </button>
      </div>
      <h2 id={headingId} className={styles.detailTitle}>{item.label}</h2>
      <p className={styles.detailSummary}>{item.summary}</p>
      {item.metaLine ? <p className={styles.detailMeta}>{item.metaLine}</p> : null}
      {item.draft ? (
        <p className="reference-draft-tag">Research draft · pending editorial review</p>
      ) : null}
      {item.position === null ? (
        <p className={styles.detailNote}>
          This entry appears in the list only. It has no position on this map.
        </p>
      ) : null}
      <p className={styles.detailAction}>
        <Link href={item.href}>{KIND_ACTION_LABELS[item.kind]} →</Link>
      </p>
    </section>
  )
}
