"use client"

import Link from "next/link"
import {
  FIELD_LAYER_CONFIGS,
  isFieldLayerAvailable,
  type FieldLayerAvailability,
  type FieldLayerId,
} from "@/lib/field/layers"

type Props = {
  activeLayerIds: readonly FieldLayerId[]
  availability: FieldLayerAvailability
  counts: Partial<Record<FieldLayerId, number>>
  onToggle: (layerId: FieldLayerId) => void
}

const LATER_LAYERS: readonly FieldLayerId[] = ["friends", "commons"]

export function LayerControls({ activeLayerIds, availability, counts, onToggle }: Props) {
  const contextualActive = activeLayerIds.some((layerId) => layerId !== "my-profile")

  return (
    <fieldset className="field-layer-controls">
      <legend className="field-rail__heading">Layers</legend>
      <p className="muted field-layer-controls__note">
        Two layers can be active at once. My profile stays beside a contextual layer.
      </p>
      {FIELD_LAYER_CONFIGS.map((config) => {
        const later = LATER_LAYERS.includes(config.id)
        const available = !later && isFieldLayerAvailable(config.id, availability)
        const active = activeLayerIds.includes(config.id)
        const pinned = config.id === "my-profile" && active && contextualActive

        if (later) {
          return (
            <div key={config.id} className="field-layer-toggle field-layer-toggle--later">
              <span className="field-layer-toggle__label">
                {config.id === "commons" ? "Commons" : "Friends"}
              </span>
              <span className="field-layer-toggle__tag">Later</span>
            </div>
          )
        }

        if (config.id === "my-profile" && !available) {
          return (
            <div key={config.id} className="field-layer-toggle field-layer-toggle--later">
              <span className="field-layer-toggle__label">{config.label}</span>
              <span className="field-layer-toggle__hint">
                <Link href="/quiz">Take the Foundation</Link> to place your marker.
              </span>
            </div>
          )
        }

        return (
          <button
            key={config.id}
            type="button"
            className={`field-layer-toggle${active ? " field-layer-toggle--active" : ""}`}
            aria-pressed={active}
            onClick={() => onToggle(config.id)}
          >
            <span className="field-layer-toggle__check" aria-hidden="true" />
            <span className="field-layer-toggle__label">{config.label}</span>
            <span className="field-layer-toggle__count">{counts[config.id] ?? 0}</span>
            {pinned ? <span className="field-layer-toggle__tag">Pinned</span> : null}
          </button>
        )
      })}
    </fieldset>
  )
}
