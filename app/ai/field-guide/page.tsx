import Link from "next/link"
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
      <article className="result-article reading-page">
        <section className="result-hero stack-md">
          <div className="ai-hero-rule" />
          <p className="ai-hero-eyebrow">AI Governance</p>
          <h1 className="ai-hero-h1">Field Guide</h1>
          <p className="ai-hero-summary">
            Six approaches to governing powerful AI answer the same question differently:
            who may inspect a model, release it, restrict it, or stop it. This guide works
            one decision through all six and sets out where each would put those powers.
            It ends with what the questionnaire cannot see.
          </p>
          <div className="row gap-sm wrap">
            <AiResultReturnLink />
            <Link href="/ai/atlas" className="cta-secondary">The six approaches</Link>
            <Link href="/ai/quiz" className="cta-primary">Start AI Governance</Link>
          </div>
        </section>

        <nav className="ai-fg-anchorbar" aria-label="Field Guide sections (mobile)">
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`} className="ai-fg-anchorbar__link">
              {section.label}
            </a>
          ))}
        </nav>

        <div className="ai-fg-layout">
          <aside className="ai-fg-rail" aria-label="On this page">
            <p className="ai-fg-rail__lbl">On this page</p>
            <ol className="ai-fg-rail__list">
              {sections.map((section) => (
                <li key={section.id} className="ai-fg-rail__item">
                  <a href={`#${section.id}`} className="ai-fg-rail__link">
                    {section.label}
                  </a>
                </li>
              ))}
            </ol>
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
                  . {aiFieldGuideWorkedDecision.situation} Each approach reaches for a
                  different first question, and the first question does most of the deciding.
                </p>
              </header>
              <div className="ai-fg-perspective-grid">
                {aiFieldGuideWorkedReadings.map((reading) => (
                  <article key={reading.key} className="ai-fg-perspective stack-sm">
                    <div className="stack-xs">
                      <h3>
                        <Link href={getAiAtlasHref(reading.key)} className="ai-fg-parts__pair-link">
                          {labelByKey[reading.key]}
                        </Link>
                      </h3>
                      <p className="ai-fg-perspective__question">{reading.firstQuestion}</p>
                    </div>
                    <p>{reading.reading}</p>
                  </article>
                ))}
              </div>
              <p className="ai-fg-section__deck">
                These readings are authored illustrations. Nothing on this page is scored,
                and none of them is attached to you. To make the decision yourself,{" "}
                <Link href={aiFieldGuideWorkedDecision.exerciseHref}>open the exercise</Link>.
              </p>
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
              <div className="ai-fg-parts">
                <div className="ai-fg-parts__row ai-fg-parts__row--head">
                  <div>Approach</div>
                  <div>Inspect and release</div>
                  <div>Restrict and stop</div>
                </div>
                {aiFieldGuidePowerRows.map((row) => (
                  <div key={row.key} className="ai-fg-parts__row">
                    <div className="ai-fg-parts__pair">
                      <Link href={getAiAtlasHref(row.key)} className="ai-fg-parts__pair-link">
                        {labelByKey[row.key]}
                      </Link>
                    </div>
                    <div className="ai-fg-parts__col">
                      <span className="ai-fg-parts__kicker">Inspect and release</span>
                      {row.inspectAndRelease}
                    </div>
                    <div className="ai-fg-parts__col">
                      <span className="ai-fg-parts__kicker">Restrict and stop</span>
                      {row.restrictAndStop}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="splits" className="ai-fg-section stack-md">
              <header className="ai-fg-section__head">
                <h2 className="ai-fg-section__title">Where nearby approaches part ways</h2>
                <p className="ai-fg-section__deck">
                  Four pairs agree on most of the questionnaire and split on one point. The
                  split is the argument worth having.
                </p>
              </header>
              <div className="ai-fg-perspective-grid">
                {aiFieldGuideDisagreements.map((pair) => (
                  <article key={pair.id} className="ai-fg-perspective stack-sm">
                    <h3>
                      <Link href={getAiAtlasHref(pair.a)} className="ai-fg-parts__pair-link">
                        {labelByKey[pair.a]}
                      </Link>
                      {" and "}
                      <Link href={getAiAtlasHref(pair.b)} className="ai-fg-parts__pair-link">
                        {labelByKey[pair.b]}
                      </Link>
                    </h3>
                    <p className="ai-fg-perspective__limit">
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
                  The questionnaire places you on these axes. Each runs between two poles, and
                  either end is a position. Your result is the approach whose positions lie
                  nearest yours. It says nothing about technical expertise, and nothing about
                  whether the institutions you favor can be built in time.
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
