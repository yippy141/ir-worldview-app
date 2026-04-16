import Link from "next/link"
import { QuizMenuCard } from "@/components/landing/resume-cta"
import { modules } from "@/lib/modules/framework"
import { siteConfig } from "@/lib/site-config"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: siteConfig.publicTitle,
  description:
    "An editorial interactive that maps baseline assumptions about world politics, then layers in issue-specific focus-area reads.",
}

export default function LandingPage() {
  const familyLinks = [
    ...modules.map((moduleDefinition) => ({
      href: `/modules/${moduleDefinition.slug}`,
      label: moduleDefinition.shortTitle,
      description: moduleDefinition.subtitle,
      meta: `${moduleDefinition.timeEstimate.standard} to ${moduleDefinition.timeEstimate.analyst}`,
    })),
    {
      href: "/ai",
      label: "AI Governance Compass",
      description: "A companion module that keeps AI governance legible without folding it into the IR baseline.",
      meta: "Parallel module",
    },
    {
      href: "/explore",
      label: "Explore",
      description: "A field guide to modeled traditions, nearby patterns, and the parts of the map that remain partial.",
      meta: "Browse the model",
    },
    {
      href: "/profile",
      label: "Profile",
      description: "Keep the Foundation, completed overlays, and any saved AI result in one integrated read.",
      meta: "Your saved synthesis",
    },
  ]

  return (
    <div className="landing-page">
      <section className="landing-hero landing-hero--editorial">
        <div className="landing-hero-grid">
          <div className="stack-md">
            <p className="section-kicker">Editorial interactive for IR and AI</p>
            <h1 className="landing-display">Map how you view international affairs</h1>
            <p className="landing-lead">
              Start with the IR Foundation. Then use Security, Technology, and the AI companion to
              see where that baseline holds, sharpens, or shifts.
            </p>
            <div className="row gap-sm wrap">
              <Link href="/quiz" className="cta-primary">
                Start with the Foundation
              </Link>
              <Link href="/explore" className="cta-secondary">
                Browse the field guide
              </Link>
            </div>
            <p className="landing-note">
              An interpretive tool, not a validated instrument. It makes theoretical priors easier
              to see; it does not assign a final verdict.
            </p>
          </div>

          <aside className="landing-side-stack">
            <div className="landing-side-panel stack-sm">
              <p className="section-kicker">How it works</p>
              <div className="landing-route-list">
                <div className="landing-route-item">
                  <p className="landing-route-title">1. Foundation baseline</p>
                  <p className="landing-route-text">Start with the shared IR read before moving into harder issue files.</p>
                </div>
                <div className="landing-route-item">
                  <p className="landing-route-title">2. Issue overlays</p>
                  <p className="landing-route-text">Use Security and Technology to see how the baseline travels under pressure.</p>
                </div>
                <div className="landing-route-item">
                  <p className="landing-route-title">3. Companion AI layer</p>
                  <p className="landing-route-text">Keep AI governance adjacent to the IR profile rather than folding it into one score.</p>
                </div>
              </div>
            </div>
            <QuizMenuCard />
          </aside>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-family-grid">
          <article className="landing-feature-card stack-md">
            <p className="section-kicker">Start here</p>
            <h2>IR Foundation</h2>
            <p className="landing-feature-text">
              The Foundation is the shared baseline for the product. It gives you the clearest
              first read before any issue-specific overlay or integrated profile work begins.
            </p>
            <div className="signal-list">
              <div className="signal-list-item">
                <strong>What it covers</strong>
                Seven dimensions across rivalry, institutions, domestic politics, identity,
                political economy, restraint, and order versus justice.
              </div>
              <div className="signal-list-item">
                <strong>How long it takes</strong>
                Standard is the cleaner first pass. Advanced adds denser tradeoffs, selected
                counterparty pressure tests, and optional second choices on case cards without
                changing the underlying scoring model.
              </div>
              <div className="signal-list-item">
                <strong>What it does not claim</strong>
                It does not sort people into natural kinds or certify a single correct worldview.
              </div>
            </div>
            <div className="row gap-sm wrap">
              <Link href="/quiz" className="cta-primary">
                Open the Foundation
              </Link>
              <Link href="/method" className="cta-secondary">
                Read the methods
              </Link>
            </div>
          </article>

          <div className="landing-family-rail">
            <div className="stack-xs">
              <h2 className="landing-family-heading">Issue overlays, companion module, browse surfaces, and profile</h2>
            </div>
            <div className="landing-rail-list">
              {familyLinks.map((entry) => (
                <Link key={entry.href} href={entry.href} className="landing-rail-link">
                  <div className="landing-rail-copy">
                    <p className="landing-rail-title">{entry.label}</p>
                    <p className="landing-rail-text">{entry.description}</p>
                  </div>
                  <div className="landing-rail-meta">
                    <span>{entry.meta}</span>
                    <span className="landing-rail-arrow">Open</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section landing-section--closing">
        <div className="landing-closing-grid">
          <div className="stack-sm">
            <p className="section-kicker">About the project</p>
            <p className="landing-closing-text">
              The {siteConfig.publicTitle} is an editorial interactive built by {siteConfig.author}
              for students, researchers, practitioners, and engaged readers who want a clearer
              account of the theoretical priors behind their foreign-policy instincts.
            </p>
          </div>
          <div className="landing-closing-links">
            <Link href="/references" className="landing-text-link">
              Continue into references
            </Link>
            <Link href="/feedback" className="landing-text-link">
              Send feedback
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
