"use client"

import { Link } from "@/i18n/navigation"
import { zhHansWorldviewMapUi } from "@/content/locales/zh-Hans/worldview-map"
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
  layerIds?: readonly FieldLayerId[]
  heading?: string
  note?: string
  copy?: typeof zhHansWorldviewMapUi
}

/**
 * Four toggles do not need a column of their own. They run as a row of chips
 * above the map, and fold into the bottom sheet on small screens.
 */
export function LayerControls({
  activeLayerIds,
  availability,
  counts,
  onToggle,
  layerIds,
  heading,
  note,
  copy,
}: Props) {
  const configs = layerIds
    ? PUBLIC_FIELD_LAYER_CONFIGS.filter((config) => layerIds.includes(config.id))
    : PUBLIC_FIELD_LAYER_CONFIGS

  return (
    <fieldset className={styles.layerControls}>
      <legend className={styles.layerLegend}>
        {copy?.layers.heading ?? heading ?? "Layers"}
      </legend>
      <div className={styles.layerChips}>
        {configs.map((config) => {
          const available = isFieldLayerAvailable(config.id, availability)
          const active = activeLayerIds.includes(config.id)

          if (config.id === "my-profile" && !available) {
            return (
              <p key={config.id} className={styles.unavailableLayer}>
                <span className={styles.layerLabel}>
                  {copy?.layers.labels[config.id] ?? config.label}
                </span>
                <span className={styles.layerHint}>
                  {copy ? (
                    <Link href="/quiz">{copy.layers.takeFoundation}</Link>
                  ) : (
                    <><Link href="/quiz">Take the Foundation</Link> to place your marker.</>
                  )}
                </span>
              </p>
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
              <span className={styles.layerLabel}>
                {copy?.layers.labels[config.id] ?? config.label}
              </span>
              <span
                className={styles.layerCount}
                aria-label={copy
                  ? copy.layers.itemCountAria(counts[config.id] ?? 0)
                  : `${counts[config.id] ?? 0} items`}
              >
                {counts[config.id] ?? 0}
              </span>
            </button>
          )
        })}
      </div>
      <p className={styles.layerNote}>
        {copy?.layers.note ?? note ?? "Choose one or two layers. Each uses the same projection."}
      </p>
    </fieldset>
  )
}
