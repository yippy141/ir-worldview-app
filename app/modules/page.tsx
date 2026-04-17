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
        <section className="lobby-hero">
          <div className="lobby-hero-grid">
            <div className="stack-md">
              <p className="section-kicker">Focus-area modules</p>
              <h1>Focused issue reads for the IR Foundation</h1>
              <p className="lobby-lead">
                Security and Technology start from policy debates many users will recognize first.
                A smaller set of actor-lens cases checks how your logic holds when the vantage
                point changes: allied partners, exposed smaller states, rival powers, and
                nonaligned or development-focused governments.
              </p>
              <div className="row gap-sm wrap">
                <Link href="/quiz" className="cta-primary">Open the Foundation</Link>
                <Link href="/profile" className="cta-secondary">View your Profile</Link>
              </div>
            </div>

            <aside className="lobby-side-note stack-sm">
              <div className="stack-xs">
                <p className="section-kicker">Why these modules exist</p>
                <p className="muted lobby-side-text">
                  Broad priors and issue-specific instincts are related but not identical. This
                  layer tests how the baseline behaves when it has to answer live arguments rather
                  than abstract statements.
                </p>
              </div>
              {foundation ? (
                <div className="callout stack-xs">
                  <p style={{ fontWeight: 600 }}>Foundation comparison is available</p>
                  <p className="muted lobby-side-text">
                    Open either module from here and the result page will compare it back to your
                    Foundation baseline.
                  </p>
                </div>
              ) : null}
            </aside>
          </div>
        </section>

        <section className="lobby-signals">
          <div className="signal-list signal-list--three">
            <div className="signal-list-item">
              <strong>What this layer covers</strong>
              Security and Technology each use a structured set of cases rather than one large
              pile of prompts.
            </div>
            <div className="signal-list-item">
              <strong>How long it takes</strong>
              Standard is the shorter issue read. Advanced adds extra cases, including more
              actor-lens and cross-pressure tests.
            </div>
            <div className="signal-list-item">
              <strong>What it does not claim</strong>
              A module result is an issue read, not a more scientific replacement for the
              Foundation baseline.
            </div>
          </div>
        </section>

        <section className="stack-md">
          <div className="stack-xs">
            <p className="section-kicker">Available modules</p>
            <h2>Choose the focus area you want to pressure-test first</h2>
          </div>
          <div className="lobby-entry-list">
            {modules.map((moduleDefinition) => (
              <article key={moduleDefinition.slug} className="lobby-entry">
                <div className="lobby-entry-main stack-sm">
                  <div className="stack-xs">
                    <h3 className="lobby-entry-title">{moduleDefinition.title}</h3>
                    <p className="lobby-entry-subtitle">{moduleDefinition.subtitle}</p>
                  </div>
                  <p className="muted lobby-entry-text">{moduleDefinition.description}</p>
                  <div className="row gap-sm wrap">
                    <Link
                      href={`/modules/${moduleDefinition.slug}${foundation ? `?foundation=${encodeURIComponent(foundation)}` : ""}`}
                      className="cta-primary"
                    >
                      Open {moduleDefinition.shortTitle}
                    </Link>
                    <Link href="/profile" className="cta-secondary">Keep it in Profile</Link>
                  </div>
                </div>

                <div className="lobby-entry-meta">
                  <div className="lobby-meta-block">
                    <p className="lobby-meta-label">What it covers</p>
                    <p className="muted">{moduleDefinition.lanes.map((lane) => lane.label).join(" · ")}</p>
                  </div>
                  <div className="lobby-meta-block">
                    <p className="lobby-meta-label">How long it takes</p>
                    <p className="muted">
                      Standard: {moduleDefinition.timeEstimate.standard} · Advanced: {moduleDefinition.timeEstimate.analyst}
                    </p>
                    <p className="muted">
                      {moduleDefinition.questionsByMode.standard.length} standard questions · {moduleDefinition.questionsByMode.analyst.length} advanced questions
                    </p>
                  </div>
                  <div className="lobby-meta-block">
                    <p className="lobby-meta-label">What it does not claim</p>
                    <p className="muted">{moduleDefinition.doesNotClaim[0]}.</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="lobby-related-grid">
          <div className="stack-sm">
            <p className="section-kicker">Same product family</p>
            <h2>The AI companion and browse surfaces stay adjacent to the IR modules</h2>
            <p className="muted lobby-side-text">
              The AI Governance Compass runs alongside the IR Foundation and issue overlays. The
              field guide and Profile keep the whole product legible rather than scattering the
              pieces across separate experiences.
            </p>
          </div>
          <div className="resource-list">
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
