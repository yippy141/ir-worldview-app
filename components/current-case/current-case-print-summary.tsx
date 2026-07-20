import styles from "@/components/current-case/current-case.module.css"
import { currentCaseContent } from "@/content/locales/current-cases"
import type { ZhHansCurrentCaseSource } from "@/content/locales/zh-Hans/types"
import { formatLocalizedDate } from "@/i18n/format"
import type { Locale } from "@/i18n/routing"
import type { CurrentCasePublicRecord } from "@/lib/current-cases/presentation"

export function CurrentCasePrintSummary({
  record,
  locale = "en",
  localizedSources,
}: {
  record: CurrentCasePublicRecord
  locale?: Locale
  localizedSources?: readonly ZhHansCurrentCaseSource[]
}) {
  const content = currentCaseContent(locale)
  const copy = content.flow

  return (
    <section className={styles.printSummary} aria-label={copy.printableSummary}>
      <header>
        <p>{copy.printBrand}</p>
        <h1>{record.title}</h1>
        <p>{record.dek}</p>
        <dl>
          <div>
            <dt>{copy.category}</dt>
            <dd>{content.archive.categories[record.category]}</dd>
          </div>
          <div>
            <dt>{copy.published}</dt>
            <dd>{formatLocalizedDate(record.publishedAt as string, locale)}</dd>
          </div>
          <div>
            <dt>{copy.evidenceThrough}</dt>
            <dd>{formatLocalizedDate(record.evidenceWindow.end, locale)}</dd>
          </div>
        </dl>
      </header>

      <section>
        <h2>{copy.caseBriefing}</h2>
        {record.briefing.split("\n\n").map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section>
        <h2>{copy.decision}</h2>
        <p>{record.decision.prompt}</p>
        <ol>
          {record.decision.options.map((option) => (
            <li key={option.id}>
              <strong>{option.label}</strong>
              <span>{option.logic}</span>
              <small>{copy.tradeoff}{locale === "zh-Hans" ? "：" : ": "}{option.acceptedTradeoff}</small>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2>{copy.knownUncertainties}</h2>
        <ul>
          {record.knownUncertainties.map((uncertainty) => (
            <li key={uncertainty}>{uncertainty}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>{copy.sourceLedgerHeading}</h2>
        <ol>
          {record.sources.map((source) => (
            <li key={source.id}>
              <strong>{source.title}</strong>
              {locale === "zh-Hans" ? (
                <span>
                  {content.archive.sourcePage.originalTitle}：
                  <span lang="en">
                    {localizedSources?.find((candidate) => candidate.id === source.id)?.originalTitle}
                  </span>
                </span>
              ) : null}
              <span>{source.publisher}</span>
              <small>{source.url}</small>
            </li>
          ))}
        </ol>
      </section>
    </section>
  )
}
