import Link from "next/link"
import { FocusTheatres, type FocusTheatreViewModel } from "@/components/modules/focus-theatres"
import { modules } from "@/lib/modules/framework"
import type { Metadata } from "next"
import styles from "@/components/modules/focus-areas.module.css"

const plannedModules = [
  {
    track: "Functional",
    title: "International Economics and Finance",
    summary: "A geoeconomic overlay on trade, finance, sanctions, industrial policy, and economic statecraft.",
  },
  {
    track: "Functional",
    title: "Governance, Politics, and Society",
    summary: "A domestic-order overlay on institutions, legitimacy, polarization, and state capacity under stress.",
  },
  {
    track: "Functional",
    title: "Development, Climate, and Sustainability",
    summary: "A cross-border overlay on growth, resilience, climate pressure, and competing development priorities.",
  },
  {
    track: "Regional",
    title: "China",
    summary: "A regional lens on how your baseline travels when Chinese strategy, institutions, and historical memory move to the center.",
  },
  {
    track: "Regional",
    title: "Middle East",
    summary: "A regional lens on order, rivalry, deterrence, and state survival across a dense security environment.",
  },
  {
    track: "Regional",
    title: "Africa",
    summary: "A regional lens on development, sovereignty, external influence, and uneven institutional capacity.",
  },
  {
    track: "Regional",
    title: "Europe and Eurasia",
    summary: "A regional lens on alliance politics, continental security, border revision, and institutional constraint.",
  },
  {
    track: "Regional",
    title: "Asia",
    summary: "A regional lens on maritime order, balancing behavior, development strategy, and strategic interdependence.",
  },
  {
    track: "Regional",
    title: "Americas",
    summary: "A regional lens on hemispheric order, democratic stress, migration, and economic integration.",
  },
  {
    track: "Regional",
    title: "United States",
    summary: "A domestic-regional lens on how baseline assumptions hold up inside U.S. strategic debate and statecraft.",
  },
] as const

export const metadata: Metadata = {
  title: "Focus Areas — IR Worldview Inventory",
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
  const foundationQuery = foundation ? `?foundation=${encodeURIComponent(foundation)}` : ""

  const theatres: FocusTheatreViewModel[] = modules.map((moduleDefinition) => ({
    slug: moduleDefinition.slug,
    shortTitle: moduleDefinition.shortTitle,
    title: moduleDefinition.title,
    subtitle: moduleDefinition.subtitle,
    description: moduleDefinition.description,
    laneLabels: moduleDefinition.lanes.map((lane) => lane.label),
    standardTime: moduleDefinition.timeEstimate.standard,
    advancedTime: moduleDefinition.timeEstimate.analyst,
    standardQuestionCount: moduleDefinition.questionsByMode.standard.length,
    advancedQuestionCount: moduleDefinition.questionsByMode.analyst.length,
    doesNotClaim: moduleDefinition.doesNotClaim[0],
  }))

  return (
    <div className="wide-container">
      <article className="lobby-page stack-xl">
        <section className="lobby-hero lobby-hero--plain">
          <div className="lobby-hero-grid">
            <div className="stack-lg">
              <p className="section-kicker">Step 2 · Focus Areas</p>
              <h1>Add a focused overlay to the Foundation</h1>
              <p className="lobby-lead">
                Two theatres are live: Security and Technology. Each one keeps your Foundation in
                view while the cases become more specific and politically exposed.
              </p>
              <div className="row gap-sm wrap">
                {foundation ? (
                  <>
                    <Link href="#focus-theatres" className="cta-primary">Choose a theatre</Link>
                    <Link href="/profile" className="cta-secondary">View Profile</Link>
                  </>
                ) : (
                  <>
                    <Link href="/quiz" className="cta-primary">Take the Foundation first</Link>
                    <Link href="#focus-theatres" className="cta-secondary">Browse the theatres</Link>
                  </>
                )}
              </div>
            </div>

            <aside className="lobby-side-note lobby-side-note--offset stack-sm">
              <div className="stack-xs">
                <p className="section-kicker">How to read this layer</p>
                <p className="muted lobby-side-text">
                  Broad priors and issue instincts are related, but not identical. The point here
                  is to see what changes when the case becomes specific. A module result is an
                  issue read, not a better or truer Foundation result.
                </p>
              </div>
              {foundation ? (
                <div className="lobby-note-band stack-xs">
                  <p className="lobby-note-title">Foundation comparison is available</p>
                  <p className="muted lobby-side-text">
                    Choose either theatre and the result page will compare it with your Foundation.
                  </p>
                </div>
              ) : (
                <div className="lobby-note-band stack-xs">
                  <p className="lobby-note-title">Foundation still comes first</p>
                  <p className="muted lobby-side-text">
                    You can browse the theatres now. They read best after the Foundation.
                  </p>
                </div>
              )}
            </aside>
          </div>
        </section>

        <section id="focus-theatres" className="stack-md lobby-band" aria-labelledby="focus-theatres-heading">
          <div className="stack-xs">
            <p className="section-kicker">Live theatres</p>
            <h2 id="focus-theatres-heading">Choose the theatre you want to pressure-test first</h2>
          </div>
          <FocusTheatres theatres={theatres} foundationQuery={foundationQuery} />
        </section>

        <section className="stack-md lobby-band" aria-labelledby="planned-modules-heading">
          <h2 id="planned-modules-heading" className="sr-only">
            Planned modules
          </h2>
          <details className={styles.roadmap}>
            <summary>
              <span className={styles.roadmapSummaryTitle}>
                Roadmap: {plannedModules.length} planned modules
              </span>
              <span className={styles.roadmapSummaryHint} data-state="closed">
                Open the list
              </span>
              <span className={styles.roadmapSummaryHint} data-state="open">
                Close the list
              </span>
            </summary>
            <div className={styles.roadmapBody}>
              <p className={styles.roadmapNote}>
                These are roadmap entries, not live routes. Best next additions after this round:
                International Economics and Finance on the functional side, then China as the first
                regional flagship.
              </p>
              <dl className={styles.roadmapList}>
                {plannedModules.map((planned) => (
                  <div key={planned.title}>
                    <dt>
                      {planned.title}
                      <span className={styles.roadmapTrack}>{planned.track} track · Planned</span>
                    </dt>
                    <dd>{planned.summary}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </details>
        </section>

        <section className="stack-md lobby-band" aria-labelledby="modules-adjacent-heading">
          <div className="stack-sm">
            <p className="section-kicker">Same product family</p>
            <h2 id="modules-adjacent-heading">Adjacent surfaces</h2>
          </div>
          <div className="resource-list resource-list--grid">
            <Link href="/ai" className="resource-list-link">
              <span className="resource-list-copy">
                <span className="resource-list-title">AI &amp; Futures</span>
                <span className="resource-list-text">Open the AI Governance Compass and Twelve Trajectories.</span>
              </span>
            </Link>
            <Link href="/explore/atlas" className="resource-list-link">
              <span className="resource-list-copy">
                <span className="resource-list-title">Worldview Map</span>
                <span className="resource-list-text">See where module shifts land beside your baseline.</span>
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
