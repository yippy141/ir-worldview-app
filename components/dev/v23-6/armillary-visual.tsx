"use client"

import { ArchetypeMark } from "@/components/archetypes/archetype-mark"
import { getRootDestination } from "@/lib/v23-6/root-menu"
import {
  ORTHO_CENTER,
  ORTHO_RADIUS,
  ORTHO_VIEW_SIZE,
  buildGraticulePath,
  buildLandPath,
  buildRingPaths,
  frontFacingArc,
} from "@/lib/v23-6/orthographic"
import type { RootVisualState } from "./root-shell"
import styles from "./armillary-visual.module.css"

const MARK_SIZE = 196
const MARK_OFFSET = ORTHO_CENTER - MARK_SIZE / 2
const RING_SCALE = 1.08
const VIEW_LATITUDE = 16

/**
 * A drawn instrument rather than a rendered scene.
 *
 * Everything on it is the graticule, one great circle, or coastline from the
 * checked-in Natural Earth boundaries. There is no star field, no telemetry,
 * and no coordinate readout, because none of those would carry a claim this
 * product can support. Exactly one ring is drawn at a time. Its half behind
 * the sphere is kept faint so the ring reads as encircling the globe.
 */
export function ArmillaryVisual({
  destinationId,
  reducedMotion,
  savedArchetypeCode,
}: RootVisualState) {
  const destination = getRootDestination(destinationId)
  const ring = destination.armillary.ring
  const view = {
    rotation: destination.armillary.rotation,
    centerLatitude: VIEW_LATITUDE,
  }

  const land = buildLandPath(view)
  const graticule = buildGraticulePath(view)
  const ringPaths = buildRingPaths(ring, view, { radiusScale: RING_SCALE })
  const arc = frontFacingArc(
    ring,
    view,
    destination.armillary.arcStart,
    destination.armillary.arcSweep,
  )
  const highlight = buildRingPaths(ring, view, {
    radiusScale: RING_SCALE,
    ...arc,
  }).front

  return (
    <figure className={styles.frame} data-armillary-ring={ring}>
      <svg
        className={styles.canvas}
        viewBox={`0 0 ${ORTHO_VIEW_SIZE} ${ORTHO_VIEW_SIZE}`}
        role="presentation"
        aria-hidden="true"
        focusable="false"
      >
        <g
          className={styles.ringGroup}
          data-motion={reducedMotion ? "still" : "ambient"}
        >
          <path className={styles.ringBack} d={ringPaths.back} />
        </g>
        <circle
          className={styles.field}
          cx={ORTHO_CENTER}
          cy={ORTHO_CENTER}
          r={ORTHO_RADIUS}
        />
        <path className={styles.graticule} d={graticule} />
        <path className={styles.land} d={land} />
        <circle
          className={styles.limb}
          cx={ORTHO_CENTER}
          cy={ORTHO_CENTER}
          r={ORTHO_RADIUS}
        />
        {savedArchetypeCode ? (
          <g
            className={styles.sigil}
            transform={`translate(${MARK_OFFSET} ${MARK_OFFSET})`}
          >
            <ArchetypeMark code={savedArchetypeCode as never} size={MARK_SIZE} />
          </g>
        ) : null}
        <g
          className={styles.ringGroup}
          data-motion={reducedMotion ? "still" : "ambient"}
        >
          <path className={styles.ringFront} d={ringPaths.front} />
          <path className={styles.highlight} d={highlight} />
        </g>
      </svg>
    </figure>
  )
}
