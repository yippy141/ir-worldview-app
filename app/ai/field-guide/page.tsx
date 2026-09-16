import Link from "next/link"
import { DestinationLink } from "@/components/layout/destination-link"
import styles from "./field-guide.module.css"
import type { Metadata } from "next"
import { futuresRoutes } from "@/lib/futures/catalogue/index"
import { AiResultReturnLink } from "@/components/ai/ai-result-return-link"
import {
  aiAtlasAxisGuide,
  getAiAtlasEntries,
  getAiAtlasHref,
  getAiAtlasSharedReadings,
} from "@/lib/ai-governance-atlas-content"
import {
  aiFieldGuideDisagreements,
  aiFieldGuidePowerRows,
  aiFieldGuideWorkedDecision,
  aiFieldGuideWorkedReadings,
  aiUnderModeledPerspectives,
} from "@/lib/ai-governance-field-guide-content"

const atlasEntries = getAiAtlasEntries()
const labelByKey = Object.fromEntries(atlasEntries.map((entry) => [entry.key, entry.label]))
const sharedReadings = getAiAtlasSharedReadings()

const sections = [
  { id: "disagree", label: "Why they disagree" },
  { id: "powers", label: "Who holds each power" },
  { id: "splits", label: "Where neighbors part ways" },
  { id: "axes", label: "The axes behind a result" },
  { id: "under-modeled", label: "What is left out" },
  { id: "start", label: "Where to read next" },
  { id: "futures", label: "Futures" },
]

export const metadata: Metadata = {
  title: "Field Guide | AI Governance | IR Worldview Inventory",
  description:
    "Why six approaches to governing powerful AI disagree, who each would let inspect, release, restrict, or stop a model, and what the questionnaire leaves out.",
}

export default function AiFieldGuidePage() {
  return (
    <div className="wide-container">
      <article className={`result-article reading-page ${styles.guide}`}>
        <section className="result-hero stack-md">
          <div className="ai-hero-rule" />
          <DestinationLink destination="ai" />
          <h1 className="ai-hero-h1">Field Guide</h1>
          <p className="ai-hero-summary">
            A lab has built a powerful model. Releasing its weights would let others study
            and use it independently; keeping the weights inside the lab would limit that
            access. Who should decide, and what would justify their choice?
          </p>
          <div className="row gap-sm wrap print-hidden">
            <AiResultReturnLink className="cta-primary" />
            <DestinationLink destination="aiApproaches" className="cta-secondary" />
          </div>
        </section>

        <details className="ai-fg-anchorbar"><summary>On this page</summary><nav aria-label="Field Guide sections">
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`} className="ai-fg-anchorbar__link">
              {section.label}
            </a>
          ))}
        </nav></details>

        <div className="ai-fg-layout">
          <aside className="ai-fg-rail" aria-label="On this page">
            <p className="ai-fg-rail__lbl">On this page</p>
            <ul className="ai-fg-rail__list">
              {sections.map((section) => (
                <li key={section.id} className="ai-fg-rail__item">
                  <a href={`#${section.id}`} className="ai-fg-rail__link">
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          <div className="ai-fg-content">
            <section id="disagree" className="ai-fg-section stack-md">
              <header className="ai-fg-section__head">
                <h2 className="ai-fg-section__title">Why do the six approaches disagree?</h2>
                <p className="ai-fg-section__deck">
                  Take the decision from the exercise{" "}
                  <Link href={aiFieldGuideWorkedDecision.exerciseHref}>
                    {aiFieldGuideWorkedDecision.exerciseTitle}
                  </Link>
                  .
                </p>
              </header>
              <div className={styles.scenario}>
                <p>{aiFieldGuideWorkedDecision.situation}</p>
                <h3>The access options</h3>
                <ul>{aiFieldGuideWorkedDecision.options.map(option => <li key={option}>{option}</li>)}</ul>
                <div className={styles.admission}>
                  <section><h3>Original admission</h3><p>{aiFieldGuideWorkedDecision.originalAdmission}</p></section>
                  <section><h3>Revised admission</h3><p>{aiFieldGuideWorkedDecision.revisedAdmission}</p></section>
                </div>
                <section className={styles.unchanged}>
                  <h3>Unchanged conditions</h3>
                  <p>{aiFieldGuideWorkedDecision.unchanged}</p>
                  <p>{aiFieldGuideWorkedDecision.researchPermissions}</p>
                </section>
                <p>{aiFieldGuideWorkedDecision.uncertainty}</p>
              </div>
              <p className="ai-fg-section__deck">
                These illustrative arguments show how the six approaches could read this decision.
                Several may support the same arrangement for different reasons. To make your own
                decision, <Link href={aiFieldGuideWorkedDecision.exerciseHref}>open the exercise</Link>.
              </p>
              <div className={styles.readings}>
                {aiFieldGuideWorkedReadings.map((reading) => (
                  <article key={reading.key} className={styles.reading}>
                    <div className="stack-xs">
                      <h3>
                        <Link href={getAiAtlasHref(reading.key)} className="ai-fg-parts__pair-link">
                          {labelByKey[reading.key]}
                        </Link>
                      </h3>
                      {reading.firstQuestion && <p className={styles.question}>{reading.firstQuestion}</p>}
                    </div>
                    <p>{reading.reading}</p>
                  </article>
                ))}
              </div>

            </section>

            <section id="powers" className="ai-fg-section stack-md">
              <header className="ai-fg-section__head">
                <h2 className="ai-fg-section__title">
                  Who should be able to inspect, release, restrict, or stop a model?
                </h2>
                <p className="ai-fg-section__deck">
                  The same four powers, and where each approach would put them.
                </p>
              </header>
              <table className={styles.powers}>
                <caption className="sr-only">Where each AI approach would put the four powers</caption>
                <thead>
                  <tr>
                    <th id="power-approach" scope="col">Approach</th>
                    <th id="power-inspect" scope="col">Inspect and release</th>
                    <th id="power-restrict" scope="col">Restrict and stop</th>
                  </tr>
                </thead>
                <tbody>
                  {aiFieldGuidePowerRows.map((row) => (
                    <tr key={row.key}>
                      <th id={`power-${row.key}`} scope="row">
                        <Link href={getAiAtlasHref(row.key)} className="ai-fg-parts__pair-link">
                          {labelByKey[row.key]}
                        </Link>
                      </th>
                      <td headers={`power-${row.key} power-inspect`}>
                        <span className={styles.cellLabel} aria-hidden="true">Inspect and release</span>
                        {row.inspectAndRelease}
                      </td>
                      <td headers={`power-${row.key} power-restrict`}>
                        <span className={styles.cellLabel} aria-hidden="true">Restrict and stop</span>
                        {row.restrictAndStop}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section id="splits" className="ai-fg-section stack-md">
              <header className="ai-fg-section__head">
                <h2 className="ai-fg-section__title">Where nearby approaches part ways</h2>
                <p className="ai-fg-section__deck">
                  The same proposal can appeal to two approaches for different reasons. These
                  comparisons show where those reasons diverge.
                </p>
              </header>
              <div className={styles.disagreements}>
                {aiFieldGuideDisagreements.map((pair) => (
                  <article key={pair.id} className={styles.disagreement}>
                    <h3>
                      <Link href={getAiAtlasHref(pair.a)} className="ai-fg-parts__pair-link">
                        {labelByKey[pair.a]}
                      </Link>
                      {" and "}
                      <Link href={getAiAtlasHref(pair.b)} className="ai-fg-parts__pair-link">
                        {labelByKey[pair.b]}
                      </Link>
                    </h3>
                    <p className={styles.sharedGround}>
                      <span>Shared ground:</span> {pair.sharedGround}
                    </p>
                    <p>{pair.argument}</p>
                  </article>
                ))}
              </div>
            </section>

            <section id="axes" className="ai-fg-section stack-md">
              <header className="ai-fg-section__head">
                <h2 className="ai-fg-section__title">The axes behind a result</h2>
                <p className="ai-fg-section__deck">
                  Your answers give positions on the axes below. Each approach weights those
                  positions differently; the comparison determines which result leads.{" "}
                  <Link href="/method">Method</Link>
                </p>
              </header>
              <ol className="ai-fg-axes">
                {aiAtlasAxisGuide.map((axis) => (
                  <li key={axis.key} className="ai-fg-axis">
                    <div className="ai-fg-axis__body">
                      <p className="ai-fg-axis__nm">{axis.label}</p>
                      <p className="ai-fg-axis__desc">{axis.explainer}</p>
                    </div>
                    <div className="ai-fg-axis__poles">
                      <div className="ai-fg-axis__poles-row">
                        <span>{axis.lowLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span>{axis.highLabel}</span>
                      </div>
                      <div className="ai-fg-axis__scale" aria-hidden="true" />
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section id="under-modeled" className="ai-fg-section stack-md">
              <header className="ai-fg-section__head">
                <h2 className="ai-fg-section__title">What the questionnaire leaves out</h2>
                <p className="ai-fg-section__deck">
                  Six ways of arguing about AI that the six approaches touch without scoring.
                  Each ends with a question to put to your own result.
                </p>
              </header>
              <div className="ai-fg-perspective-grid">
                {aiUnderModeledPerspectives.map((perspective) => (
                  <article key={perspective.id} className="ai-fg-perspective stack-sm">
                    <div className="stack-xs">
                      <h3>{perspective.title}</h3>
                      <p>{perspective.whyItMatters}</p>
                    </div>
                    <p className="ai-fg-perspective__limit">
                      <span>In the questionnaire:</span> {perspective.currentCoverage}
                    </p>
                    <p className="ai-fg-perspective__question">{perspective.readingQuestion}</p>
                  </article>
                ))}
              </div>
            </section>

            <section id="start" className="ai-fg-section stack-md">
              <header className="ai-fg-section__head">
                <h2 className="ai-fg-section__title">Where to read next</h2>
                <p className="ai-fg-section__deck">
                  Four readings that every approach page starts from. Each approach page adds
                  its own first reading and its strongest critique.
                </p>
              </header>
              <div className="ai-fg-start">
                {sharedReadings.map((reading) => (
                  <article key={reading.id} className="ai-fg-start__cell">
                    <p className="ai-fg-start__lbl">
                      {reading.author} · {reading.year}
                    </p>
                    <h3 className="ai-fg-start__title">
                      {reading.url ? (
                        <a href={reading.url} target="_blank" rel="noopener noreferrer">
                          {reading.title}
                        </a>
                      ) : (
                        reading.title
                      )}
                    </h3>
                    <p className="ai-fg-start__body">{reading.whyItMatters}</p>
                  </article>
                ))}
              </div>
              <p>
                {atlasEntries.map((entry, index) => (
                  <span key={entry.key}>
                    {index > 0 ? " · " : ""}
                    <Link href={getAiAtlasHref(entry.key)}>{entry.label}</Link>
                  </span>
                ))}
              </p>
            </section>

            <section id="futures" className="ai-fg-section stack-md">
              <header className="ai-fg-section__head">
                <h2 className="ai-fg-section__title">Futures</h2>
              </header>
              <p>
                The six approaches argue about the next release. Futures asks about the world
                after many releases: nineteen possible futures, from continued human rule to
                authority passing to artificial systems, and the conditions you would want in
                each.{" "}
                <Link href={futuresRoutes.collection} prefetch={false}>Browse the whole Futures catalogue</Link>
                {" "}or{" "}
                <Link href={futuresRoutes.preferences} prefetch={false}>say which conditions you would want</Link>.
                Futures is a separate exercise and starts empty; it does not change an AI
                Governance result.
              </p>
            </section>
          </div>
        </div>
      </article>
    </div>
  )
}
