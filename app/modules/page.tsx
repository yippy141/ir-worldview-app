import Link from "next/link"
import { modules } from "@/lib/modules/framework"
import type { Metadata } from "next"

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
              <p className="section-kicker">Focus-area modules</p>
              <h1>Focused issue reads for the IR Foundation</h1>
              <p className="lobby-lead">
                Most cases are written from debates that will feel familiar in Washington,
                Brussels, and allied policy circles. A smaller set of actor-lens pressure tests
                then shifts the vantage point to exposed partners, rival powers, and nonaligned
                governments to see whether your logic still holds.
              </p>
              <div className="row gap-sm wrap">
                <Link href="/quiz" className="cta-primary">Take the Foundation questionnaire</Link>
                <Link href="/profile" className="cta-secondary">View Profile</Link>
              </div>
            </div>

            <aside className="lobby-side-note lobby-side-note--offset stack-sm">
              <div className="stack-xs">
                <p className="section-kicker">How to read this layer</p>
                <p className="muted lobby-side-text">
                  Broad priors and issue-specific instincts are related but not identical. This
                  layer tests how the baseline behaves when it has to answer live arguments rather
                  than abstract statements.
                </p>
              </div>
              {foundation ? (
                <div className="lobby-note-band stack-xs">
                  <p className="lobby-note-title">Foundation comparison is available</p>
                  <p className="muted lobby-side-text">
                    Choose either module from here and the result page will compare it back to your
                    Foundation baseline.
                  </p>
                </div>
              ) : null}
            </aside>
          </div>
        </section>

        <section className="lobby-signals lobby-signals--plain lobby-band">
          <div className="signal-list signal-list--three">
            <div className="signal-list-item">
              <strong>What this layer covers</strong>
              Security and Technology stay anchored in familiar U.S. and allied policy debates,
              then pressure-test that baseline from a smaller number of other vantage points.
            </div>
            <div className="signal-list-item">
              <strong>How long it takes</strong>
              Standard is the shorter issue read. Advanced adds extra cases and a smaller number
              of actor-lens pressure tests.
            </div>
            <div className="signal-list-item">
              <strong>What it does not claim</strong>
              A module result is an issue read, not a more scientific replacement for the
              Foundation baseline.
            </div>
          </div>
        </section>

        <section className="stack-md lobby-band">
          <div className="stack-xs">
            <p className="section-kicker">Available modules</p>
            <h2>Choose the focus area you want to pressure-test first</h2>
            <p className="muted lobby-section-copy">
              Each module keeps the shared IR baseline in view, then asks how your read changes
              when the cases become more domain-specific and politically exposed.
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
                  <div className="row gap-sm wrap">
                    <Link
                      href={`/modules/${moduleDefinition.slug}${foundation ? `?foundation=${encodeURIComponent(foundation)}` : ""}`}
                      className="cta-primary"
                    >
                      Open {moduleDefinition.shortTitle} questionnaire
                    </Link>
                    <Link href="/profile" className="cta-secondary">View Profile</Link>
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
            <p className="section-kicker">Same product family</p>
            <h2>The AI companion and browse surfaces stay adjacent to the IR modules</h2>
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
