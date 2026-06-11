import Link from "next/link"
import { FoundationHeroActions } from "@/components/landing/resume-cta"
import { siteConfig } from "@/lib/site-config"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: siteConfig.publicTitle,
  description:
    "A scenario-based inventory for geopolitical judgment, built to turn foreign-policy instincts into a personal briefing.",
}

const entryPaths = [
  {
    eyebrow: "Default path",
    title: "Start the Foundation",
    description:
      "Answer the core scenarios first. This builds the baseline used by the rest of the inventory.",
    href: "/quiz",
    action: "Start the Foundation",
  },
  {
    eyebrow: "Parallel entry",
    title: "Try AI Governance",
    description:
      "Use the same judgment-mapping frame for frontier AI policy. It stands alone, and it is sharper beside the Foundation.",
    href: "/ai",
    action: "Try AI Governance",
  },
  {
    eyebrow: "Read first",
    title: "Explore the field guide",
    description:
      "Read the traditions, debates, and limits behind the map. Useful even if you never finish a quiz.",
    href: "/explore",
    action: "Open the field guide",
  },
]

const briefingSignals = [
  {
    title: "The arguments you trust",
    description:
      "Which claims carry weight for you: balance-of-power logic, institutions, norms, domestic politics, political economy, or restraint.",
  },
  {
    title: "The tradeoffs you accept",
    description:
      "Where you are willing to pay costs: sovereignty for protection, speed for coordination, leverage for legitimacy, order for justice.",
  },
  {
    title: "The places your instincts split",
    description:
      "Where one issue pulls you toward caution, another toward competition, and another toward rules or solidarity.",
  },
]

const productLayers = [
  {
    eyebrow: "Baseline",
    title: "Foundation",
    description:
      "The core inventory maps geopolitical judgment across power, institutions, domestic politics, norms, political economy, restraint, and order.",
    href: "/quiz",
    action: "Start the Foundation",
  },
  {
    eyebrow: "Policy layer",
    title: "AI Governance",
    description:
      "A parallel entry point for readers focused on frontier AI policy, using the same product logic rather than a separate personality frame.",
    href: "/ai",
    action: "Open AI Governance",
  },
  {
    eyebrow: "Context",
    title: "Field guide",
    description:
      "An educational route through the traditions, arguments, and coverage gaps behind the inventory, with or without a completed result.",
    href: "/explore",
    action: "Read the guide",
  },
]

export default function LandingPage() {
  return (
    <div className="wide-container">
      <article className="lobby-page stack-xl">
        <section className="landing-hero-v15">
          <div className="landing-hero-v15__copy stack-md">
            <p className="landing-hero-v15__eyebrow">IR Worldview Inventory</p>
            <h1 className="landing-hero-v15__h1">
              A scenario-based inventory for geopolitical judgment.
            </h1>
            <p className="landing-hero-v15__lead">
              Work through concrete foreign-policy scenarios and receive a personal briefing on
              the arguments you trust, the tradeoffs you accept, and the places your instincts
              split.
            </p>
            <p className="landing-hero-v15__note">
              This is not a personality test, a diagnosis, or a claim about your true ideology. It
              is a structured way to read your judgment under pressure.
            </p>
          </div>

          <div className="landing-entry-panel" aria-label="Ways to begin">
            <div className="landing-entry-card landing-entry-card--primary">
              <p className="section-kicker">{entryPaths[0].eyebrow}</p>
              <h2>{entryPaths[0].title}</h2>
              <p>{entryPaths[0].description}</p>
              <FoundationHeroActions />
            </div>
            {entryPaths.slice(1).map((path) => (
              <Link key={path.href} href={path.href} className="landing-entry-card">
                <span className="section-kicker">{path.eyebrow}</span>
                <strong>{path.title}</strong>
                <span>{path.description}</span>
                <em>{path.action}</em>
              </Link>
            ))}
          </div>
        </section>

        <section className="homepage-band stack-lg">
          <div className="homepage-band-header stack-sm">
            <p className="section-kicker">What it returns</p>
            <h2>A briefing before a label</h2>
            <p className="muted lobby-section-copy">
              The payoff is a plain-English account of how you reason about international politics,
              not a badge to wear or a box to defend.
            </p>
          </div>
          <div className="landing-briefing-grid">
            {briefingSignals.map((signal) => (
              <article key={signal.title} className="landing-briefing-item stack-xs">
                <h3>{signal.title}</h3>
                <p>{signal.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="homepage-band stack-lg">
          <div className="homepage-band-header stack-sm">
            <p className="section-kicker">Ways through the project</p>
            <h2>One inventory, three useful entrances</h2>
            <p className="muted lobby-section-copy">
              The Foundation remains the default route. AI Governance is a parallel policy layer.
              The field guide is there for readers who want the map before, during, or after a
              result.
            </p>
          </div>
          <div className="lobby-entry-list">
            {productLayers.map((entry) => (
              <article key={entry.title} className="lobby-entry">
                <div className="stack-xs">
                  <p className="section-kicker">{entry.eyebrow}</p>
                  <h3 className="lobby-entry-title">{entry.title}</h3>
                  <p className="muted lobby-entry-text">{entry.description}</p>
                </div>
                <div className="lobby-entry-meta">
                  <Link href={entry.href} className="cta-secondary lobby-band-primary">
                    {entry.action}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="homepage-band stack-lg">
          <div className="homepage-band-header stack-sm">
            <p className="section-kicker">Context surfaces</p>
            <h2>Use these once you want a wider frame</h2>
            <p className="muted lobby-section-copy">
              These pages make the model more legible. They are designed for reading, checking
              assumptions, and understanding where the inventory is deliberately limited.
            </p>
          </div>
          <div className="homepage-resource-grid">
            {[
              {
                href: "/explore/atlas",
                title: "Atlas",
                text: "Browse recurring profile patterns without treating them as fixed identities.",
              },
              {
                href: "/explore",
                title: "Field guide",
                text: "Read the modeled traditions, coverage gaps, and issue comparisons behind the inventory.",
              },
              {
                href: "/method",
                title: "Methods",
                text: "Read the scope, guardrails, and limits behind the project.",
              },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="homepage-resource-card stack-xs">
                <span className="resource-list-title">{link.title}</span>
                <span className="resource-list-text">{link.text}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="landing-section landing-section--closing">
          <div className="landing-closing-grid">
            <div className="stack-sm">
              <p className="section-kicker">About the project</p>
              <p className="landing-closing-text">
                The {siteConfig.publicTitle} is an editorial interactive built by {siteConfig.author}{" "}
                for readers who want a clearer account of the assumptions behind their
                foreign-policy instincts.
              </p>
            </div>
            <div className="stack-sm">
              <p className="landing-closing-text">
                The product is still in beta. This version prioritizes trust, clarity, and
                legibility before breadth.
              </p>
              <p className="landing-closing-text">
                Use the Foundation as the baseline. Branch into AI Governance, the field guide,
                modules, Atlas, or Profile when they add useful depth or comparison.
              </p>
            </div>
          </div>
        </section>
      </article>
    </div>
  )
}
