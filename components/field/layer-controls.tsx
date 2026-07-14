"use client"

import Link from "next/link"
import {
  PUBLIC_FIELD_LAYER_CONFIGS,
  isFieldLayerAvailable,
  type FieldLayerAvailability,
  type FieldLayerId,
} from "@/lib/field/layers"
import styles from "./worldview-map.module.css"

type Props = {
  activeLayerIds: readonly FieldLayerId[]
  availability: FieldLayerAvailability
  counts: Partial<Record<FieldLayerId, number>>
  onToggle: (layerId: FieldLayerId) => void
}

export function LayerControls({ activeLayerIds, availability, counts, onToggle }: Props) {
  return (
    <fieldset className={styles.layerControls}>
      <legend className={styles.sectionHeading}>Layers</legend>
      <p className={styles.controlNote}>
        Choose one or two layers. Each uses the same projection.
      </p>
      <div className={styles.layerRows}>
      {PUBLIC_FIELD_LAYER_CONFIGS.map((config) => {
        const available = isFieldLayerAvailable(config.id, availability)
        const active = activeLayerIds.includes(config.id)

        if (config.id === "my-profile" && !available) {
          return (
            <div key={config.id} className={styles.unavailableLayer}>
              <span className={styles.layerLabel}>{config.label}</span>
              <span className={styles.layerHint}>
                <Link href="/quiz">Take the Foundation</Link> to place your marker.
              </span>
            </div>
          )
        }

        return (
          <button
            key={config.id}
            type="button"
            className={`${styles.layerToggle}${active ? ` ${styles.layerToggleActive}` : ""}`}
            aria-pressed={active}
            onClick={() => onToggle(config.id)}
          >
            <span className={styles.layerCheck} aria-hidden="true">
              {active ? "✓" : ""}
            </span>
            <span className={styles.layerLabel}>{config.label}</span>
            <span className={styles.layerCount} aria-label={`${counts[config.id] ?? 0} items`}>
              {counts[config.id] ?? 0}
            </span>
          </button>
        )
      })}
      </div>
    </fieldset>
  )
}
