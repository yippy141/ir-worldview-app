"use client"

import { useId, useMemo } from "react"
import { computeCoreDimensionAudit } from "@/lib/scoring"
import {
  canPlaceLivePosition,
  describeMapPosition,
  toMapPosition,
} from "@/lib/results/position"
import type { Answers } from "@/lib/types"

export type QuizPositionMapCopy = {
  /** Visible label for the whole element. */
  label: string
  /** Shown until enough answers exist to plot a point. */
  pending: string
}

type Props = {
  answers: Answers
  answeredCount: number
  copy: QuizPositionMapCopy
}

// Plot geometry in viewBox units. Deliberately smaller than the result-page map:
// this sits beside the question and has to stay legible at 76px on a phone.
const VIEW_W = 200
const VIEW_H = 186
const CENTER_X = 100
const CENTER_Y = 86
const R = 62

/**
 * The 2x2 position map, live during the Foundation questionnaire.
 *
 * Uses the same projection as the result page (lib/results/position), so the
 * point a respondent watches while answering is the point they end up with.
 * During the quiz it shows axes and a marker only — no tradition anchors, no
 * family names, and nothing tying a movement to the answer that caused it.
 */
export function QuizPositionMap({ answers, answeredCount, copy }: Props) {
  const labelId = useId()

  const { position, placed } = useMemo(() => {
    // V21 question-set membership, rather than the legacy Standard/Analyst
    // display mode, defines the scored form. Analyst mode includes every item
    // that can appear in the core or extension sets.
    const { roundedAverages, weights } = computeCoreDimensionAudit(
      answers,
      "analyst",
    )

    return {
      position: toMapPosition(roundedAverages),
      placed: canPlaceLivePosition({ answeredCount, dimensionWeights: weights }),
    }
  }, [answers, answeredCount])

  const readings = describeMapPosition(position)
  const markerX = CENTER_X + position.x * R
  // Math space has +Y up; SVG has +Y down.
  const markerY = CENTER_Y - position.y * R

  return (
    <section className="quiz-position-map" aria-labelledby={labelId}>
      <div className="quiz-position-map__figure">
        <svg
          className="quiz-position-map__svg"
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          aria-hidden="true"
          focusable="false"
        >
          <rect
            x={CENTER_X - R}
            y={CENTER_Y - R}
            width={R * 2}
            height={R * 2}
            fill="none"
            stroke="var(--border)"
            strokeWidth={1}
          />
          <line
            x1={CENTER_X - R}
            y1={CENTER_Y}
            x2={CENTER_X + R}
            y2={CENTER_Y}
            stroke="var(--border)"
            strokeWidth={1}
            strokeDasharray="3 4"
          />
          <line
            x1={CENTER_X}
            y1={CENTER_Y - R}
            x2={CENTER_X}
            y2={CENTER_Y + R}
            stroke="var(--border)"
            strokeWidth={1}
            strokeDasharray="3 4"
          />

          {/* Axis poles only. Quadrants stay unnamed while the quiz is running. */}
          <text className="quiz-position-map__axis" x={CENTER_X} y={14} textAnchor="middle">
            Ideas &amp; norms
          </text>
          <text className="quiz-position-map__axis" x={CENTER_X} y={VIEW_H - 8} textAnchor="middle">
            Material structure
          </text>
          <text className="quiz-position-map__axis" x={2} y={CENTER_Y + 4} textAnchor="start">
            Power
          </text>
          <text
            className="quiz-position-map__axis"
            x={VIEW_W - 2}
            y={CENTER_Y + 4}
            textAnchor="end"
          >
            Rules
          </text>

          {placed ? (
            <g
              className="quiz-position-map__marker"
              style={{ transform: `translate(${markerX}px, ${markerY}px)` }}
            >
              <circle r={7} fill="var(--panel)" opacity={0.9} />
              <circle r={4} fill="var(--accent)" />
            </g>
          ) : null}
        </svg>
      </div>

      <div className="quiz-position-map__text">
        <p className="quiz-position-map__label" id={labelId}>
          {copy.label}
        </p>
        {placed ? (
          <dl className="quiz-position-map__readout">
            {readings.map((reading) => (
              <div key={reading.name}>
                <dt>{reading.name}</dt>
                <dd>{reading.reading}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="quiz-position-map__pending">{copy.pending}</p>
        )}
      </div>
    </section>
  )
}
