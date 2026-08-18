"use client"

import { Link } from "@/i18n/navigation"
import { zhHansWorldviewMapUi } from "@/content/locales/zh-Hans/worldview-map"
import { referenceEntityTypeLabel, type FieldItem } from "@/lib/field/items"
import { FIELD_LAYER_CONFIG_BY_ID } from "@/lib/field/layers"
import { traditionNounLabel } from "@/lib/worldview-config"
import styles from "./worldview-map.module.css"

const KIND_ACTION_LABELS: Record<FieldItem["kind"], string> = {
  baseline: "Open Foundation result",
  "perspective-run": "View run result",
  "atlas-pattern": "Read this Decision Pattern",
  "reference-profile": "Read the profile",
  "reference-movement": "Read the movement",
}

type Props = {
  item: FieldItem
  onClose: () => void
  headingId?: string
  copy?: typeof zhHansWorldviewMapUi
}

export function FieldDetailCard({
  item,
  onClose,
  headingId = "field-detail-heading",
  copy,
}: Props) {
  const layerLabel = copy?.layers.labels[item.layerId]
    ?? FIELD_LAYER_CONFIG_BY_ID[item.layerId].label
  const patternFamilyLabel =
    item.kind === "atlas-pattern" && item.familyKey
      ? copy?.filters.families[item.familyKey] ?? traditionNounLabel(item.familyKey)
      : null

  return (
    <section className={styles.detailCard} aria-labelledby={headingId}>
      <div className={styles.detailHead}>
        <p className={styles.detailContext}>
          {item.entityType
            ? referenceEntityTypeLabel(item.entityType, copy ? "zh-Hans" : "en")
            : patternFamilyLabel
              ? `${layerLabel} · ${patternFamilyLabel}`
              : layerLabel}
        </p>
        <button
          type="button"
          className={styles.detailClose}
          onClick={onClose}
          aria-label={copy?.detail.close ?? "Close details"}
        >
          {copy?.detail.close ?? "Close"}
        </button>
      </div>
      <h2 id={headingId} className={styles.detailTitle}>{item.label}</h2>
      <p className={styles.detailSummary}>{item.summary}</p>
      {item.metaLine ? <p className={styles.detailMeta}>{item.metaLine}</p> : null}
      {item.draft ? (
        <p className="reference-draft-tag">
          {copy?.detail.draft ?? "Research draft · pending editorial review"}
        </p>
      ) : null}
      {item.position === null ? (
        <p className={styles.detailNote}>
          {copy?.detail.listOnly ?? "This entry appears in the list only. It has no position on this map."}
        </p>
      ) : null}
      <p className={styles.detailAction}>
        <Link href={item.href}>
          {copy?.detail.actions[item.kind] ?? KIND_ACTION_LABELS[item.kind]} →
        </Link>
      </p>
    </section>
  )
}
