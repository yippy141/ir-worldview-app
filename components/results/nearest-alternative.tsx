export type ComparisonExpectation = "high" | "neutral" | "low"

export type ComparisonRow = {
  key: string
  label: string
  userScore: number
  userPercentile?: number | null
  primaryExpected: ComparisonExpectation
  runnerUpExpected: ComparisonExpectation
}

type Props = {
  primaryLabel: string
  runnerUpLabel: string
  rows: ComparisonRow[]
}

const EXPECTED_COPY: Record<ComparisonExpectation, string> = {
  high: "Expects high",
  neutral: "No strong expectation",
  low: "Expects low",
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
        <caption className="sr-only">
          {primaryLabel} and {runnerUpLabel} compared where they diverge most
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
              <th scope="row">{row.label}</th>
              <td data-expected={row.primaryExpected}>{EXPECTED_COPY[row.primaryExpected]}</td>
              <td data-expected={row.runnerUpExpected}>{EXPECTED_COPY[row.runnerUpExpected]}</td>
              <td className="alt-compare__score">
                {row.userPercentile !== null &&
                row.userPercentile !== undefined
                  ? `${formatOrdinal(row.userPercentile)} percentile · raw ${row.userScore.toFixed(1)}`
                  : row.userScore.toFixed(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function formatOrdinal(value: number) {
  const mod100 = value % 100
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`
  if (value % 10 === 1) return `${value}st`
  if (value % 10 === 2) return `${value}nd`
  if (value % 10 === 3) return `${value}rd`
  return `${value}th`
}
