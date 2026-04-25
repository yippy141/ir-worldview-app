import Link from "next/link"
import { FoundationHeroActions } from "@/components/landing/resume-cta"
import { siteConfig } from "@/lib/site-config"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: siteConfig.publicTitle,
  description:
    "An editorial interactive for mapping how you read world politics across an IR baseline, issue modules, AI governance, and an integrated profile.",
}

const quickPaths = [
  {
    step: "1",
    title: "Foundation",
    description:
      "Establish the shared IR baseline: how you explain power, institutions, domestic politics, norms, political economy, restraint, and order.",
  },
  {
    step: "2",
    title: "Modules",
    description:
      "Pressure-test that baseline in Security and Technology without treating a module result as a replacement for the Foundation.",
  },
  {
    step: "3",
    title: "AI Governance",
    description:
      "Take a related governance layer on its own, or read it against the IR baseline when you want the comparison.",
  },
  {
    step: "4",
    title: "Profile",
    description:
      "Return to the accumulating view that keeps the Foundation, completed modules, and any saved AI result together.",
  },
]

const productLayers = [
  {
    eyebrow: "Step 2",
    title: "Modules: Security and Technology",
    description:
      "Use the live IR modules to see where your baseline holds, hardens, or splits once the cases become more concrete.",
    primaryLink: { href: "/modules", label: "Open modules" },
    supportingText: "Two live focus-area overlays are available now.",
  },
  {
    eyebrow: "Step 3",
    title: "AI Governance Compass",
    description:
      "Apply the same interpretive project to frontier AI governance. It can stand on its own, but the stronger read comes when it sits beside the IR baseline.",
    primaryLink: { href: "/ai", label: "Open AI Governance" },
    supportingText: "A related layer in the same worldview product.",
  },
  {
    eyebrow: "Step 4",
    title: "Profile",
    description:
      "Use Profile as the home for saved layers: the Foundation, completed modules, and any AI result stored on this device.",
    primaryLink: { href: "/profile", label: "Open Profile" },
    supportingText: "Most useful after at least one result has been saved.",
  },
]

const supportSurfaces = [
  {
    href: "/explore/atlas",
    title: "Atlas",
    text: "Browse recurring profile patterns in the current model without treating them like fixed natural kinds.",
  },
  {
    href: "/explore",
    title: "Field guide",
    text: "Read the modeled traditions, coverage gaps, and issue comparisons behind the inventory.",
  },
  {
    href: "/method",
    title: "Methods",
    text: "Read the scope, guardrails, and limits behind the instrument.",
  },
]

export default function LandingPage() {
  return (
    <div className="wide-container">
      <article className="lobby-page stack-xl">
        <section className="lobby-hero">
          <div className="lobby-hero-grid">
            <div className="stack-lg">
              <div className="stack-md">
                <p className="section-kicker">IR Worldview Inventory</p>
                <h1 className="landing-display">Start with a baseline for how you read world politics</h1>
                <p className="lobby-lead">
                  The Foundation is the first read. Modules and AI Governance are optional layers
                  that test how that baseline travels across concrete policy problems. Profile is
                  where those saved layers come back together.
                </p>
              </div>
              <FoundationHeroActions />
              <p className="landing-note">
                An interpretive tool, not a validated instrument. Results make theoretical priors
                visible without pretending to assign a final verdict.
              </p>
            </div>

            <aside className="lobby-journey-panel stack-md">
              <div className="stack-xs">
                <p className="section-kicker">How to use it</p>
                <p className="muted lobby-side-text">
                  The sequence is simple: establish the baseline, add issue layers only when they
                  help, and return to Profile for the accumulated read.
                </p>
              </div>
              <div className="lobby-step-list">
                {quickPaths.map((item) => (
                  <div key={item.step} className="lobby-step">
                    <span className="lobby-step-number" aria-hidden="true">{item.step}</span>
                    <div className="stack-xs">
                      <p className="lobby-step-title">{item.title}</p>
                      <p className="lobby-step-text">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="lobby-journey-note">
                Browse surfaces stay available, but they are context around the instrument rather
                than alternate starting points.
              </p>
            </aside>
          </div>
        </section>

        <section className="homepage-band stack-lg">
          <div className="homepage-band-header stack-sm">
            <p className="section-kicker">After the Foundation</p>
            <h2>Continue only where another layer clarifies the baseline</h2>
            <p className="muted lobby-section-copy">
              These are the live continuation points in the current beta. Each one keeps the
              Foundation in view instead of competing with it for first attention.
            </p>
          </div>
          <div className="lobby-entry-list">
            {productLayers.map((entry) => (
              <article key={entry.title} className="lobby-entry">
                <div className="stack-sm">
                  <div className="stack-xs">
                    <p className="section-kicker">{entry.eyebrow}</p>
                    <h3 className="lobby-entry-title">{entry.title}</h3>
                  </div>
                  <p className="muted lobby-entry-text">{entry.description}</p>
                </div>
                <div className="lobby-entry-meta">
                  <Link href={entry.primaryLink.href} className="cta-secondary lobby-band-primary">
                    {entry.primaryLink.label}
                  </Link>
                  <p className="homepage-supporting-text">{entry.supportingText}</p>
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
              Atlas, the field guide, and methods pages explain the map. They are not separate
              starting paths.
            </p>
          </div>
          <div className="homepage-resource-grid">
            {supportSurfaces.map((link) => (
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
                for students, researchers, practitioners, and engaged readers who want a clearer
                account of the theoretical assumptions behind their foreign-policy instincts.
              </p>
            </div>
            <div className="stack-sm">
              <p className="landing-closing-text">
                The product is still in beta. The current version aims for trust, clarity, and
                legibility before it aims for breadth.
              </p>
              <p className="landing-closing-text">
                Use the Foundation as the baseline. Branch into modules, AI Governance, Atlas, or
                Profile when they add useful depth or comparison.
              </p>
            </div>
          </div>
        </section>
      </article>
    </div>
  )
}
