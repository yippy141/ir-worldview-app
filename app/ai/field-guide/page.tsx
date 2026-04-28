import Link from "next/link"
import type { Metadata } from "next"
import {
  aiAtlasAxisGuide,
  getAiAtlasEntries,
} from "@/lib/ai-governance-atlas-content"

const atlasEntries = getAiAtlasEntries()
const labelByKey = Object.fromEntries(atlasEntries.map((entry) => [entry.key, entry.label]))

const sections = [
  { id: "axes", label: "The eight axes" },
  { id: "splits", label: "Where archetypes part ways" },
  { id: "cross-read", label: "IR ↔ AI cross-read" },
  { id: "start", label: "Where to start reading" },
  { id: "futures", label: "Futures appendix", optional: true },
]

const partWaysPairs = [
  {
    pair: "A",
    a: "democraticGuardrailist",
    b: "precautionarySteward",
    shared:
      "Both insist that frontier-only safety claims are not enough; both want stronger checks before broad deployment.",
    split:
      "Guardrailist binds the check to public oversight and procedural legitimacy; Precautionary Steward binds it to threshold-based caution about the capability itself.",
  },
  {
    pair: "B",
    a: "strategicCompetitor",
    b: "stateCapacityBuilder",
    shared:
      "Both treat AI governance as a state-level problem and accept that real instruments matter more than rhetoric.",
    split:
      "Strategic Competitor reads the system through capability edge under rivalry; State Capacity Builder reads it through who can actually supervise, procure, and verify in practice.",
  },
  {
    pair: "C",
    a: "openEcosystemBuilder",
    b: "coordinationArchitect",
    shared:
      "Both worry that frontier capability is concentrating in a few labs and a few states.",
    split:
      "Open Ecosystem Builder treats wider access as the cure; Coordination Architect treats durable cross-border rules and standards as the cure.",
  },
  {
    pair: "D",
    a: "coordinationArchitect",
    b: "democraticGuardrailist",
    shared:
      "Both want enforceable rules and are skeptical of voluntary lab self-governance alone.",
    split:
      "Coordination Architect looks outward to multilateral standards and shared verification; Democratic Guardrailist looks inward to publicly answerable domestic institutions.",
  },
] as const

const crossRead = [
  {
    irLabel: "Identity and legitimacy",
    irBody:
      "In IR, the live question is whether legitimacy is procedural (rule-following) or substantive (outcome-defending), and across whose institutions it has to hold.",
    aiAxisLabel: "Legitimacy and rule-setting",
    aiBody:
      "On the AI side, the same question becomes: who has standing to audit, license, or pause a model — and on what authority.",
  },
  {
    irLabel: "Security rivalry",
    irBody:
      "In IR, competition can be self-fulfilling — a security-dilemma reading turns defensive moves into offensive ones, and escalation follows.",
    aiAxisLabel: "Competition vs coordination",
    aiBody:
      "On the AI side, that lens asks how much pace pressure is real strategic constraint and how much is invoked to dismiss safety arguments.",
  },
  {
    irLabel: "Markets and dependence",
    irBody:
      "In IR, the political-economy lens reads supply-chain coercion, market dependence, and who sets the terms of access.",
    aiAxisLabel: "Openness vs control",
    aiBody:
      "On the AI side, the same lens reads compute, weights, and data concentration as governance questions, not only market ones.",
  },
] as const

const startReading = [
  {
    kicker: "From the Compass",
    title: "Read your nearest neighbor",
    text: "Your archetype card already names a neighbor. The argument is sharpest where two archetypes share most of the fingerprint and split on one axis.",
    href: "/ai/atlas",
    linkLabel: "Open the AI Atlas",
  },
  {
    kicker: "From IR",
    title: "Start with the cross-read",
    text: "Three meeting points where IR vocabulary and AI governance vocabulary line up. The translation is uneven on purpose.",
    href: "#cross-read",
    linkLabel: "Open the cross-read",
  },
  {
    kicker: "Browsing",
    title: "Open the AI Atlas",
    text: "The Atlas is the compact map of patterns. The Field Guide is the explainer behind each card — no second assessment.",
    href: "/ai/atlas",
    linkLabel: "Open the AI Atlas",
  },
] as const

const futureScenarios = [
  {
    title: "Concentration tightens",
    text: "Frontier capability narrows to fewer labs and fewer states; downstream access is rationed.",
  },
  {
    title: "Open weights hold",
    text: "Open releases keep setting the deployment baseline; frontier closure does not stick.",
  },
  {
    title: "Multilateral baseline holds",
    text: "Standards bodies and treaties retain real verification teeth across rival blocs.",
  },
] as const

export const metadata: Metadata = {
  title: "Field Guide — AI Governance Compass",
  description:
    "Reader's companion to the AI Atlas. Eight axes, where archetypes part ways, IR ↔ AI cross-read, and a small reading shelf. Explainer only — no scoring, no second assessment.",
}

export default function AiFieldGuidePage() {
  return (
    <div className="wide-container">
      <article className="result-article">
        <section className="result-hero stack-md">
          <div className="ai-hero-rule" />
          <p className="ai-hero-eyebrow">AI Field Guide · Explainer · Companion to the Atlas</p>
          <p className="ai-fg-banner">
            <span className="ai-fg-banner__lbl">Explainer</span>
            <span className="ai-fg-banner__body">
              Reading surface only — no scoring, no second assessment, no quiz on this page.
            </span>
          </p>
          <h1 className="ai-hero-h1">A reader&rsquo;s companion to the AI Atlas.</h1>
          <p className="ai-hero-summary">
            Four short sections plus an optional, non-scored futures appendix. Use the rail to
            skip. To get an archetype, take the AI Governance Compass; this page does not produce
            one.
          </p>
          <div className="row gap-sm wrap">
            <Link href="/ai/atlas" className="cta-secondary">Open the AI Atlas</Link>
            <Link href="/ai/quiz" className="cta-primary">Take the AI questionnaire</Link>
          </div>
        </section>

        <nav className="ai-fg-anchorbar" aria-label="Field Guide sections (mobile)">
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`} className="ai-fg-anchorbar__link">
              {section.label}
              {section.optional ? (
                <span className="ai-fg-anchorbar__pill">optional</span>
              ) : null}
            </a>
          ))}
        </nav>

        <div className="ai-fg-layout">
          <aside className="ai-fg-rail" aria-label="On this page">
            <p className="ai-fg-rail__lbl">On this page</p>
            <ol className="ai-fg-rail__list">
              {sections.map((section) => (
                <li
                  key={section.id}
                  className={`ai-fg-rail__item${section.optional ? " ai-fg-rail__item--optional" : ""}`}
                >
                  <a href={`#${section.id}`} className="ai-fg-rail__link">
                    {section.label}
                  </a>
                  {section.optional ? (
                    <span className="ai-fg-rail__pill">optional</span>
                  ) : null}
                </li>
              ))}
            </ol>
            <div className="ai-fg-rail__legend">
              <p className="ai-fg-rail__legend-k">What this page is</p>
              <p className="ai-fg-rail__legend-v">
                An explainer. No score, no archetype produced. To get an archetype, take the AI
                Governance Compass.
              </p>
            </div>
          </aside>

          <div className="ai-fg-content">
            <section id="axes" className="ai-fg-section stack-md">
              <header className="ai-fg-section__head">
                <p className="ai-fg-section__num">§1</p>
                <h2 className="ai-fg-section__title">The eight axes</h2>
                <p className="ai-fg-section__deck">
                  The vocabulary the AI module uses. Names, one-line description, and opposing
                  poles only — no positions and no scores.
                </p>
              </header>
              <ol className="ai-fg-axes">
                {aiAtlasAxisGuide.map((axis, index) => (
                  <li key={axis.key} className="ai-fg-axis">
                    <span className="ai-fg-axis__n">A{index + 1}</span>
                    <div className="ai-fg-axis__body">
                      <p className="ai-fg-axis__nm">{axis.label}</p>
                      <p className="ai-fg-axis__desc">{axis.explainer}</p>
                    </div>
                    <div className="ai-fg-axis__poles">
                      <div className="ai-fg-axis__poles-row">
                        <span>{axis.lowLabel}</span>
                        <span aria-hidden="true">—</span>
                        <span>{axis.highLabel}</span>
                      </div>
                      <div className="ai-fg-axis__scale" aria-hidden="true" />
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section id="splits" className="ai-fg-section stack-md">
              <header className="ai-fg-section__head">
                <p className="ai-fg-section__num">§2</p>
                <h2 className="ai-fg-section__title">Where nearby archetypes part ways</h2>
                <p className="ai-fg-section__deck">
                  Pairs whose fingerprints overlap on most axes. The split on one or two axes is
                  what tells them apart.
                </p>
              </header>
              <div className="ai-fg-parts">
                <div className="ai-fg-parts__row ai-fg-parts__row--head">
                  <div>Pair</div>
                  <div>What they share</div>
                  <div>Where they split</div>
                </div>
                {partWaysPairs.map((entry) => (
                  <div key={entry.pair} className="ai-fg-parts__row">
                    <div className="ai-fg-parts__pair">
                      {labelByKey[entry.a]} · {labelByKey[entry.b]}
                      <small>Pair {entry.pair}</small>
                    </div>
                    <div className="ai-fg-parts__col">
                      <span className="ai-fg-parts__kicker">Shared</span>
                      {entry.shared}
                    </div>
                    <div className="ai-fg-parts__col">
                      <span className="ai-fg-parts__kicker">Split</span>
                      {entry.split}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="cross-read" className="ai-fg-section stack-md">
              <header className="ai-fg-section__head">
                <p className="ai-fg-section__num">§3</p>
                <h2 className="ai-fg-section__title">How IR and AI cross-read</h2>
                <p className="ai-fg-section__deck">
                  Three meeting points between the IR Foundation and the AI Compass. They are
                  related layers, not parallel scoring systems.
                </p>
              </header>
              <div className="ai-fg-cross">
                {crossRead.map((cell) => (
                  <article key={cell.irLabel} className="ai-fg-cross__cell">
                    <p className="ai-fg-cross__kicker">IR concept</p>
                    <h3 className="ai-fg-cross__title">{cell.irLabel}</h3>
                    <p className="ai-fg-cross__body">{cell.irBody}</p>
                    <p className="ai-fg-cross__ai">
                      <span className="ai-fg-cross__ai-k">AI · {cell.aiAxisLabel}:</span>{" "}
                      {cell.aiBody}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section id="start" className="ai-fg-section stack-md">
              <header className="ai-fg-section__head">
                <p className="ai-fg-section__num">§4</p>
                <h2 className="ai-fg-section__title">Where to start reading</h2>
                <p className="ai-fg-section__deck">
                  Three small entry points. Pick the one that matches why you arrived.
                </p>
              </header>
              <div className="ai-fg-start">
                {startReading.map((entry) => (
                  <article key={entry.title} className="ai-fg-start__cell">
                    <p className="ai-fg-start__lbl">{entry.kicker}</p>
                    <h3 className="ai-fg-start__title">{entry.title}</h3>
                    <p className="ai-fg-start__body">{entry.text}</p>
                    {entry.href.startsWith("#") ? (
                      <a href={entry.href} className="ai-fg-start__link">
                        {entry.linkLabel} →
                      </a>
                    ) : (
                      <Link href={entry.href} className="ai-fg-start__link">
                        {entry.linkLabel} →
                      </Link>
                    )}
                  </article>
                ))}
              </div>
            </section>

            <section id="futures" className="ai-fg-section stack-md">
              <div className="ai-fg-futures">
                <div className="ai-fg-futures__head">
                  <span className="ai-fg-futures__lbl">§5 · Appendix · Futures</span>
                  <span className="ai-fg-futures__pill">Optional · Non-scored</span>
                </div>
                <p className="ai-fg-futures__intro">
                  Three reading prompts used inside Field Guide entries to test how each archetype
                  responds to a different shape of the next decade. They are not predictions and
                  they do not enter any score on any page in this product.
                </p>
                <div className="ai-fg-futures__grid">
                  {futureScenarios.map((scenario) => (
                    <article key={scenario.title} className="ai-fg-futures__scen">
                      <p className="ai-fg-futures__scen-ttl">{scenario.title}</p>
                      <p className="ai-fg-futures__scen-meta">{scenario.text}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </article>
    </div>
  )
}
