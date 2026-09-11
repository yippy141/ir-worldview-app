export type ComparisonExpectation = "high" | "neutral" | "low"

export type ComparisonRow = {
  key: string
  label: string
  lowLabel?: string
  highLabel?: string
  userScore: number
  primaryExpected: ComparisonExpectation
  runnerUpExpected: ComparisonExpectation
  note?: string
}

type Props = {
  primaryLabel: string
  runnerUpLabel: string
  rows: ComparisonRow[]
}

const EXPECTED_COPY: Record<ComparisonExpectation, string> = {
  high: "Higher-axis emphasis",
  neutral: "No strong model emphasis",
  low: "Lower-axis emphasis",
}

/**
 * Two columns, one per candidate reading, over the rows where the two disagree
 * most. Each row shows what each reading expects and where the respondent
 * actually scored, so the comparison is read rather than narrated.
 */
export function NearestAlternative({ primaryLabel, runnerUpLabel, rows }: Props) {
  return (
    <div
      className="alt-compare-scroll"
      role="region"
      aria-label={`${primaryLabel} and ${runnerUpLabel} comparison table`}
      tabIndex={0}
    >
      <table className="alt-compare">
        <caption>
          These are authored model emphases, not measured expectations about people.
        </caption>
        <thead>
          <tr>
            <th scope="col">Dimension</th>
            <th scope="col">{primaryLabel}</th>
            <th scope="col">{runnerUpLabel}</th>
            <th scope="col">You</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <th scope="row">
                {row.label}
                {row.lowLabel && row.highLabel ? (
                  <span className="alt-compare__poles">
                    {row.lowLabel} — {row.highLabel}
                  </span>
                ) : null}
              </th>
              <td data-expected={row.primaryExpected}>{row.primaryExpected === "high" && row.highLabel ? row.highLabel : row.primaryExpected === "low" && row.lowLabel ? row.lowLabel : EXPECTED_COPY[row.primaryExpected]}</td>
              <td data-expected={row.runnerUpExpected}>{row.runnerUpExpected === "high" && row.highLabel ? row.highLabel : row.runnerUpExpected === "low" && row.lowLabel ? row.lowLabel : EXPECTED_COPY[row.runnerUpExpected]}</td>
              <td className="alt-compare__score">{row.userScore.toFixed(1)}{row.note ? <span className="alt-compare__poles">{row.note}</span> : null}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
