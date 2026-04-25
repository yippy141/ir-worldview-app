import Link from "next/link"
import { modules } from "@/lib/modules/framework"
import type { Metadata } from "next"

const plannedModuleTracks = {
  functional: [
    {
      title: "International Economics and Finance",
      summary:
        "A geoeconomic overlay on trade, finance, sanctions, industrial policy, and economic statecraft.",
    },
    {
      title: "Governance, Politics, and Society",
      summary:
        "A domestic-order overlay on institutions, legitimacy, polarization, and state capacity under stress.",
    },
    {
      title: "Development, Climate, and Sustainability",
      summary:
        "A cross-border overlay on growth, resilience, climate pressure, and competing development priorities.",
    },
  ],
  regional: [
    {
      title: "China",
      summary:
        "A regional lens on how your baseline travels when Chinese strategy, institutions, and historical memory move to the center.",
    },
    {
      title: "Middle East",
      summary:
        "A regional lens on order, rivalry, deterrence, and state survival across a dense security environment.",
    },
    {
      title: "Africa",
      summary:
        "A regional lens on development, sovereignty, external influence, and uneven institutional capacity.",
    },
    {
      title: "Europe and Eurasia",
      summary:
        "A regional lens on alliance politics, continental security, border revision, and institutional constraint.",
    },
    {
      title: "Asia",
      summary:
        "A regional lens on maritime order, balancing behavior, development strategy, and strategic interdependence.",
    },
    {
      title: "Americas",
      summary:
        "A regional lens on hemispheric order, democratic stress, migration, and economic integration.",
    },
    {
      title: "United States",
      summary:
        "A domestic-regional lens on how baseline assumptions hold up inside U.S. strategic debate and statecraft.",
    },
  ],
} as const

export const metadata: Metadata = {
  title: "Focus-Area Modules — IR Worldview Inventory",
  description:
    "Take a focus-area module in Security or Technology and compare the result back to your Foundation baseline.",
}

export default async function ModulesPage(
  {
    searchParams,
  }: {
    searchParams: Promise<{ foundation?: string }>
  },
) {
  const { foundation } = await searchParams

  return (
    <div className="wide-container">
      <article className="lobby-page stack-xl">
        <section className="lobby-hero lobby-hero--plain">
          <div className="lobby-hero-grid">
            <div className="stack-lg">
              <p className="section-kicker">Step 2 · Focus-area modules</p>
              <h1>Add a focused overlay to the Foundation</h1>
              <p className="lobby-lead">
                Use Security and Technology to see where your Foundation result holds, hardens, or
                starts to split in concrete cases.
              </p>
              <div className="row gap-sm wrap">
                {foundation ? (
                  <>
                    <Link href="#available-modules" className="cta-primary">Choose a module</Link>
                    <Link href="/profile" className="cta-secondary">View Profile</Link>
                  </>
                ) : (
                  <>
                    <Link href="/quiz" className="cta-primary">Take the Foundation first</Link>
                    <Link href="#available-modules" className="cta-secondary">Browse modules</Link>
                  </>
                )}
              </div>
            </div>

            <aside className="lobby-side-note lobby-side-note--offset stack-sm">
              <div className="stack-xs">
                <p className="section-kicker">How to read this layer</p>
                <p className="muted lobby-side-text">
                  Broad priors and issue instincts are related, but not identical. The point here
                  is to see what changes when the case becomes specific.
                </p>
              </div>
              {foundation ? (
                <div className="lobby-note-band stack-xs">
                  <p className="lobby-note-title">Foundation comparison is available</p>
                  <p className="muted lobby-side-text">
                    Choose either module and the result page will compare it with your Foundation.
                  </p>
                </div>
              ) : (
                <div className="lobby-note-band stack-xs">
                  <p className="lobby-note-title">Foundation still comes first</p>
                  <p className="muted lobby-side-text">
                    You can browse the modules now. They read best after the Foundation.
                  </p>
                </div>
              )}
            </aside>
          </div>
        </section>

        <section className="lobby-signals lobby-signals--plain lobby-band">
          <div className="signal-list signal-list--three">
            <div className="signal-list-item">
              <strong>What this layer covers</strong>
              Security and Technology begin from familiar policy debates, then test the baseline
              from a smaller number of other vantage points.
            </div>
            <div className="signal-list-item">
              <strong>How long it takes</strong>
              Standard is the shorter issue read. Advanced adds extra cases and a smaller number
              of actor-lens pressure tests.
            </div>
            <div className="signal-list-item">
              <strong>What it does not claim</strong>
              A module result is an issue read, not a better or truer Foundation result.
            </div>
          </div>
        </section>

        <section id="available-modules" className="stack-md lobby-band">
          <div className="stack-xs">
            <p className="section-kicker">Available modules</p>
            <h2>Choose the focus area you want to pressure-test first</h2>
            <p className="muted lobby-section-copy">
              Each module keeps your Foundation in view while the cases become more specific and
              politically exposed.
            </p>
          </div>
          <div className="module-choice-grid">
            {modules.map((moduleDefinition) => (
              <article key={moduleDefinition.slug} className="module-choice-card stack-md">
                <div className="stack-sm">
                  <div className="stack-xs">
                    <p className="section-kicker">{moduleDefinition.shortTitle}</p>
                    <h3 className="lobby-entry-title">{moduleDefinition.title}</h3>
                    <p className="lobby-entry-subtitle">{moduleDefinition.subtitle}</p>
                  </div>
                  <p className="muted lobby-entry-text">{moduleDefinition.description}</p>
                  <div className="stack-xs">
                    <Link
                      href={`/modules/${moduleDefinition.slug}${foundation ? `?foundation=${encodeURIComponent(foundation)}` : ""}`}
                      className="cta-primary"
                    >
                      Open {moduleDefinition.shortTitle} questionnaire
                    </Link>
                    <p className="module-choice-note">
                      Use this when you want a more concrete read than the Foundation alone can give.
                    </p>
                  </div>
                </div>

                <dl className="module-choice-meta">
                  <div>
                    <dt>What it covers</dt>
                    <dd>{moduleDefinition.lanes.map((lane) => lane.label).join(" · ")}</dd>
                  </div>
                  <div>
                    <dt>How long it takes</dt>
                    <dd>
                      Standard: {moduleDefinition.timeEstimate.standard} · Advanced: {moduleDefinition.timeEstimate.analyst}
                    </dd>
                    <dd>
                      {moduleDefinition.questionsByMode.standard.length} standard questions · {moduleDefinition.questionsByMode.analyst.length} advanced questions
                    </dd>
                  </div>
                  <div>
                    <dt>What it does not claim</dt>
                    <dd>{moduleDefinition.doesNotClaim[0]}.</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="stack-md lobby-band">
          <div className="stack-sm">
            <p className="section-kicker">Planned next</p>
            <h2>Future modules stay visible, but they are not live in this round</h2>
            <p className="muted lobby-section-copy">
              The next additions are grouped by function and region. They are roadmap entries, not
              live routes.
            </p>
          </div>

          <div className="planned-track-grid">
            <section className="planned-track stack-md" aria-labelledby="planned-functional-track">
              <div className="stack-xs">
                <p className="section-kicker">Functional track</p>
                <h3 id="planned-functional-track" className="lobby-entry-title">
                  Add more issue areas before broadening into regions
                </h3>
                <p className="muted lobby-entry-text">
                  Functional modules extend the same Foundation-to-module structure without
                  changing the frame of the project.
                </p>
              </div>
              <div className="planned-module-grid">
                {plannedModuleTracks.functional.map((moduleDefinition) => (
                  <article key={moduleDefinition.title} className="planned-module-card stack-sm">
                    <div className="planned-module-header">
                      <h4 className="planned-module-title">{moduleDefinition.title}</h4>
                      <span className="planned-module-chip" aria-label="Status: Planned">
                        Planned
                      </span>
                    </div>
                    <p className="planned-module-text">{moduleDefinition.summary}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="planned-track stack-md" aria-labelledby="planned-regional-track">
              <div className="stack-xs">
                <p className="section-kicker">Regional track</p>
                <h3 id="planned-regional-track" className="lobby-entry-title">
                  Regional lenses come after the underlying language is clearer
                </h3>
                <p className="muted lobby-entry-text">
                  Regional modules introduce harder interpretation questions. They stay planned
                  until the core product language is clearer.
                </p>
              </div>
              <div className="planned-module-grid">
                {plannedModuleTracks.regional.map((moduleDefinition) => (
                  <article key={moduleDefinition.title} className="planned-module-card stack-sm">
                    <div className="planned-module-header">
                      <h4 className="planned-module-title">{moduleDefinition.title}</h4>
                      <span className="planned-module-chip" aria-label="Status: Planned">
                        Planned
                      </span>
                    </div>
                    <p className="planned-module-text">{moduleDefinition.summary}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <div className="planned-roadmap-note">
            <p className="muted lobby-section-copy">
              Best next additions after this round: <strong>International Economics and
              Finance</strong> on the functional side, then <strong>China</strong> as the first
              regional flagship.
            </p>
          </div>
        </section>

        <section className="stack-md lobby-band">
          <div className="stack-sm">
            <p className="section-kicker">Same product family</p>
            <h2>The AI companion and browse surfaces stay adjacent to the IR overlays</h2>
            <p className="muted lobby-section-copy">
              The AI Governance Compass runs alongside the IR Foundation and issue overlays. The
              field guide and Profile keep the whole product legible rather than scattering the
              pieces across separate experiences.
            </p>
          </div>
          <div className="resource-list resource-list--grid">
            <Link href="/ai" className="resource-list-link">
              <span className="resource-list-copy">
                <span className="resource-list-title">AI Governance Compass</span>
                <span className="resource-list-text">Open the companion module and its atlas.</span>
              </span>
            </Link>
            <Link href="/explore" className="resource-list-link">
              <span className="resource-list-copy">
                <span className="resource-list-title">Explore</span>
                <span className="resource-list-text">Browse modeled traditions, nearby patterns, and coverage gaps.</span>
              </span>
            </Link>
            <Link href="/profile" className="resource-list-link">
              <span className="resource-list-copy">
                <span className="resource-list-title">Profile</span>
                <span className="resource-list-text">Keep the Foundation, overlays, and saved AI result in one view.</span>
              </span>
            </Link>
          </div>
        </section>
      </article>
    </div>
  )
}
