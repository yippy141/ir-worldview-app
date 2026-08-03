export type PushRow = {
  key: string
  label: string
  /** Signed position on the axis: -1 at the low end, +1 at the high end. */
  deviation: number
  score: number
  /** Short name of the pole the score sits toward. */
  pole: string
}

type Props = {
  rows: PushRow[]
  lowCaption: string
  highCaption: string
  centreCaption: string
  tone?: string
}

/**
 * Diverging bars around a shared spine. Bars run left for the low pole and
 * right for the high pole, so the rows that moved a result are the long ones
 * and the rows that did nothing sit against the spine.
 */
export function PushChart({ rows, lowCaption, highCaption, centreCaption, tone }: Props) {
  return (
    <div className="push-chart" data-tone={tone}>
      <div className="push-chart__head" aria-hidden="true">
        <span>{lowCaption}</span>
        <span>{centreCaption}</span>
        <span>{highCaption}</span>
      </div>

      <ul className="push-chart__rows">
        {rows.map((row) => {
          const width = Math.abs(row.deviation) * 50
          const left = row.deviation < 0 ? 50 - width : 50

          return (
            <li key={row.key} className="push-chart__row">
              <p className="push-chart__label">{row.label}</p>
              <div className="push-chart__track">
                <span className="push-chart__spine" aria-hidden="true" />
                <span
                  className={`push-chart__fill${row.deviation < 0 ? " push-chart__fill--low" : ""}`}
                  style={{ left: `${left}%`, width: `${Math.max(width, 0.7)}%` }}
                  role="img"
                  aria-label={`${row.label}: ${row.score.toFixed(1)} of 7, toward ${row.pole.toLowerCase()}`}
                />
              </div>
              <p className="push-chart__read">
                <span className="push-chart__pole">{row.pole}</span>
                <span className="push-chart__score">{row.score.toFixed(1)}</span>
              </p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
