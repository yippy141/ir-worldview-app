import Link from "next/link"
import { FoundationHeroActions } from "@/components/landing/resume-cta"
import { siteConfig } from "@/lib/site-config"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: siteConfig.publicTitle,
  description:
    "Find out how you think about world politics — from IR theory to security, technology, and AI governance.",
}

const quickPaths = [
  {
    step: "1",
    title: "Take the Foundation",
    description:
      "Get a baseline read on how you explain world politics before you branch into any overlay or companion module.",
  },
  {
    step: "2",
    title: "Add issue overlays",
    description:
      "Pressure-test that baseline in Security, Technology, and other domain-specific cases without replacing it.",
  },
  {
    step: "3",
    title: "Read the integrated profile",
    description:
      "Keep the Foundation, completed overlays, and saved AI result together in one device-level profile.",
  },
]

const availableNow = [
  {
    eyebrow: "Issue overlays",
    title: "Security and Technology",
    description:
      "Use the live IR modules to see where your baseline holds, hardens, or starts to split when the cases become more concrete.",
    primaryLink: { href: "/modules", label: "Browse modules" },
    supportingText: "Two live overlays are available now.",
  },
  {
    eyebrow: "AI companion",
    title: "AI Governance Compass",
    description:
      "Apply the same overall project logic to frontier AI governance rather than general IR theory, then read it back against your IR baseline.",
    primaryLink: { href: "/ai", label: "Open the AI companion" },
    supportingText: "Lives in the same project family, not as a separate app.",
  },
]

const supportSurfaces = [
  {
    href: "/profile",
    title: "Profile",
    text: "Keep the Foundation, overlays, and any saved AI result together in one integrated view.",
  },
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
                <h1 className="landing-display">Map how you view international affairs</h1>
                <p className="lobby-lead">
                  Start with one shared Foundation, then add overlays only where they sharpen the
                  picture. The goal is to make your baseline read on world politics legible before
                  you test it in security, technology, and AI governance.
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
                  The Foundation is the obvious first step. Everything else is there to test,
                  extend, or interpret that first read rather than compete with it.
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
                Want a quick browse before you start? <Link href="/explore/atlas">Open the Atlas</Link>.
              </p>
            </aside>
          </div>
        </section>

        <section className="homepage-band stack-lg">
          <div className="homepage-band-header stack-sm">
            <p className="section-kicker">Available now</p>
            <h2>Move from the baseline into live overlays and companion modules</h2>
            <p className="muted lobby-section-copy">
              Once you have the Foundation, the next question is where to pressure-test it. These
              are the live next steps in the current beta.
            </p>
          </div>
          <div className="homepage-feature-grid">
            {availableNow.map((entry) => (
              <article key={entry.title} className="homepage-feature-card stack-md">
                <div className="stack-sm">
                  <div className="stack-xs">
                    <p className="section-kicker">{entry.eyebrow}</p>
                    <h3 className="lobby-entry-title">{entry.title}</h3>
                  </div>
                  <p className="muted lobby-entry-text">{entry.description}</p>
                </div>
                <div className="stack-xs">
                  <Link href={entry.primaryLink.href} className="cta-secondary homepage-feature-primary">
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
            <p className="section-kicker">Interpret and compare</p>
            <h2>Use the browse surfaces once you want context, synthesis, or a wider frame</h2>
            <p className="muted lobby-section-copy">
              These pages are there to help you read the map more clearly after the Foundation,
              not to compete with it for first attention.
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
                Start with the Foundation. Then branch into modules, Atlas, or Profile only when
                you want more depth or comparison.
              </p>
            </div>
          </div>
        </section>
      </article>
    </div>
  )
}
