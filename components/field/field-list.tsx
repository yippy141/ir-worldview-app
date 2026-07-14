"use client"

import Link from "next/link"
import type { KeyboardEvent } from "react"
import { referenceEntityTypeLabel, type FieldItem } from "@/lib/field/items"
import {
  FIELD_LAYER_CONFIG_BY_ID,
  FIELD_LAYER_IDS,
  fieldSelectionKey,
  type FieldLayerId,
  type FieldSelectionKey,
} from "@/lib/field/layers"

const KIND_TAGS: Record<FieldItem["kind"], string> = {
  baseline: "Baseline",
  "perspective-run": "Perspective run",
  "atlas-pattern": "Atlas pattern",
  "reference-profile": "Reference profile",
  "reference-movement": "Movement",
}

type Props = {
  items: readonly FieldItem[]
  activeLayerIds: readonly FieldLayerId[]
  selectedKey: FieldSelectionKey | null
  onSelect: (key: FieldSelectionKey) => void
  onArrowNavigate?: (direction: "next" | "previous") => void
  emptyLine?: string
}

/**
 * The semantic alternative to the map: every visible item, grouped by layer,
 * in the same stable order the selection helpers use.
 */
export function FieldList({
  items,
  activeLayerIds,
  selectedKey,
  onSelect,
  onArrowNavigate,
  emptyLine,
}: Props) {
  function handleKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (!onArrowNavigate) return
    if (event.key === "ArrowDown") {
      event.preventDefault()
      onArrowNavigate("next")
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      onArrowNavigate("previous")
    }
  }

  const layersInOrder = FIELD_LAYER_IDS.filter((layerId) =>
    activeLayerIds.includes(layerId),
  )

  if (items.length === 0) {
    return (
      <div className="field-list-empty stack-xs">
        <p className="muted">{emptyLine ?? "No items match these filters. Clear one or more to widen the view."}</p>
      </div>
    )
  }

  return (
    <div className="field-list stack-md">
      {layersInOrder.map((layerId) => {
        const layerItems = items.filter((item) => item.layerId === layerId)
        return (
          <section key={layerId} className="field-list__group stack-xs">
            <h3 className="field-list__group-heading">
              {FIELD_LAYER_CONFIG_BY_ID[layerId].label}
              <span className="field-list__group-count"> · {layerItems.length}</span>
            </h3>
            {layerItems.length > 0 ? (
              <ul className="field-list__items" onKeyDown={handleKeyDown}>
                {layerItems.map((item) => {
                  const key = fieldSelectionKey(item)
                  const selected = key === selectedKey
                  return (
                    <li
                      key={key}
                      id={`field-item-${key}`}
                      className={`field-list__row${selected ? " field-list__row--selected" : ""}`}
                    >
                      <button
                        type="button"
                        className="field-list__select"
                        aria-pressed={selected}
                        onClick={() => onSelect(key)}
                      >
                        <span className="field-list__name">{item.label}</span>
                        <span className="field-list__tags">
                          <span className="field-list__tag">
                            {item.entityType
                              ? referenceEntityTypeLabel(item.entityType)
                              : KIND_TAGS[item.kind]}
                          </span>
                          {item.draft ? (
                            <span className="field-list__tag field-list__tag--draft">Draft</span>
                          ) : null}
                          {item.position === null ? (
                            <span className="field-list__tag">List only</span>
                          ) : null}
                        </span>
                        {item.metaLine ? (
                          <span className="field-list__meta">{item.metaLine}</span>
                        ) : null}
                      </button>
                      <Link href={item.href} className="field-list__open">
                        Open →
                      </Link>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="muted field-list__group-empty">
                {layerId === "my-profile"
                  ? "Your profile is missing from this map. Take the Foundation to place it."
                  : layerId === "perspective-runs"
                    ? "No saved runs yet. Open a brief to record one."
                    : "This layer has nothing to show yet."}
              </p>
            )}
          </section>
        )
      })}
    </div>
  )
}
