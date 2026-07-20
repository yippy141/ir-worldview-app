"use client"

import { Link } from "@/i18n/navigation"
import type { KeyboardEvent } from "react"
import { zhHansWorldviewMapUi } from "@/content/locales/zh-Hans/worldview-map"
import { referenceEntityTypeLabel, type FieldItem } from "@/lib/field/items"
import {
  fieldSelectionKey,
  getFieldListGroups,
  type FieldLayerId,
  type FieldSelectionKey,
} from "@/lib/field/layers"
import styles from "./worldview-map.module.css"

const KIND_TAGS: Record<FieldItem["kind"], string> = {
  baseline: "Baseline",
  "perspective-run": "Perspective shift",
  "atlas-pattern": "Worldview profile",
  "reference-profile": "Public position",
  "reference-movement": "Movement",
}

type Props = {
  items: readonly FieldItem[]
  activeLayerIds: readonly FieldLayerId[]
  selectedKey: FieldSelectionKey | null
  onSelect: (key: FieldSelectionKey) => void
  onArrowNavigate?: (
    direction: "next" | "previous",
    fromKey: FieldSelectionKey,
  ) => void
  emptyLine?: string
  copy?: typeof zhHansWorldviewMapUi
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
  copy,
}: Props) {
  function handleKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (!onArrowNavigate) return
    const target = event.target
    if (!(target instanceof HTMLElement) || !target.closest(`.${styles.listSelect}`)) {
      return
    }
    const rowId = target.closest<HTMLElement>("[id^='field-item-']")?.id
    const fromKey = rowId?.slice("field-item-".length) as
      | FieldSelectionKey
      | undefined
    if (!fromKey) return
    if (event.key === "ArrowDown") {
      event.preventDefault()
      onArrowNavigate("next", fromKey)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      onArrowNavigate("previous", fromKey)
    }
  }

  const groups = getFieldListGroups(items, activeLayerIds)

  if (items.length === 0) {
    return (
      <div className={styles.listEmpty}>
        <p>{emptyLine ?? "No items match these filters. Clear one or more to widen the view."}</p>
      </div>
    )
  }

  return (
    <div className={styles.fieldList}>
      {groups.map(({ layerId, label, items: layerItems }) => {
        return (
          <section key={layerId} className={styles.listGroup}>
            <h3 className={styles.listGroupHeading}>
              {copy?.layers.labels[layerId] ?? label}
              <span className={styles.listGroupCount}>{layerItems.length}</span>
            </h3>
            {layerItems.length > 0 ? (
              <ul className={styles.listItems} onKeyDown={handleKeyDown}>
                {layerItems.map((item) => {
                  const key = fieldSelectionKey(item)
                  const selected = key === selectedKey
                  return (
                    <li
                      key={key}
                      id={`field-item-${key}`}
                      className={`${styles.listRow}${selected ? ` ${styles.listRowSelected}` : ""}`}
                    >
                      <button
                        type="button"
                        className={styles.listSelect}
                        aria-pressed={selected}
                        onClick={() => onSelect(key)}
                      >
                        <span className={styles.listName}>{item.label}</span>
                        <span className={styles.listTags}>
                          <span className={styles.listTag}>
                            {item.entityType
                              ? referenceEntityTypeLabel(item.entityType, copy ? "zh-Hans" : "en")
                              : copy?.list.tags[item.kind] ?? KIND_TAGS[item.kind]}
                          </span>
                          {item.draft ? (
                            <span className={`${styles.listTag} ${styles.listTagDraft}`}>
                              {copy?.list.tags.draft ?? "Draft"}
                            </span>
                          ) : null}
                          {item.position === null ? (
                            <span className={styles.listTag}>{copy?.list.tags.listOnly ?? "List only"}</span>
                          ) : null}
                        </span>
                        {item.metaLine ? (
                          <span className={styles.listMeta}>{item.metaLine}</span>
                        ) : null}
                      </button>
                      <Link href={item.href} className={styles.listOpen}>
                        {copy?.list.open ?? "Open"} →
                      </Link>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className={styles.listGroupEmpty}>
                {layerId === "my-profile"
                  ? copy?.list.emptyProfile ?? "Your profile is missing from this map. Take the Foundation to place it."
                  : layerId === "perspective-runs"
                    ? copy?.list.emptyPerspective ?? "No saved runs yet. Open a brief to record one."
                    : copy?.list.emptyLayer ?? "This layer has nothing to show yet."}
              </p>
            )}
          </section>
        )
      })}
    </div>
  )
}
