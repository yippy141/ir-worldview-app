import styles from "@/components/current-case/current-case.module.css"
import {
  CURRENT_CASE_CATEGORY_LABELS,
  formatCurrentCaseDate,
  type CurrentCasePublicRecord,
} from "@/lib/current-cases/presentation"

export function CurrentCasePrintSummary({ record }: { record: CurrentCasePublicRecord }) {
  return (
    <section className={styles.printSummary} aria-label="Printable Current Case summary">
      <header>
        <p>IR Worldview Inventory · Current Case</p>
        <h1>{record.title}</h1>
        <p>{record.dek}</p>
        <dl>
          <div>
            <dt>Category</dt>
            <dd>{CURRENT_CASE_CATEGORY_LABELS[record.category]}</dd>
          </div>
          <div>
            <dt>Published</dt>
            <dd>{formatCurrentCaseDate(record.publishedAt as string)}</dd>
          </div>
          <div>
            <dt>Evidence through</dt>
            <dd>{formatCurrentCaseDate(record.evidenceWindow.end)}</dd>
          </div>
        </dl>
      </header>

      <section>
        <h2>Case briefing</h2>
        {record.briefing.split("\n\n").map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section>
        <h2>Decision</h2>
        <p>{record.decision.prompt}</p>
        <ol>
          {record.decision.options.map((option) => (
            <li key={option.id}>
              <strong>{option.label}</strong>
              <span>{option.logic}</span>
              <small>Tradeoff: {option.acceptedTradeoff}</small>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2>Known uncertainties</h2>
        <ul>
          {record.knownUncertainties.map((uncertainty) => (
            <li key={uncertainty}>{uncertainty}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Source ledger</h2>
        <ol>
          {record.sources.map((source) => (
            <li key={source.id}>
              <strong>{source.title}</strong>
              <span>{source.publisher}</span>
              <small>{source.url}</small>
            </li>
          ))}
        </ol>
      </section>
    </section>
  )
}
