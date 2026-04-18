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
    href: "/modules",
    eyebrow: "Focus Areas",
    label: "Pressure-test the baseline in Security and Technology",
    description:
      "See where the Foundation holds, changes, or shifts when cases turn to force, alliances, tech competition, and industrial policy.",
    meta: "Browse Focus Areas",
  },
  {
    href: "/ai",
    eyebrow: "AI Companion",
    label: "Open the AI Governance Compass alongside the IR baseline",
    description:
      "A separate module on AI safety, regulation, rivalry, military use, and the long-term future of human agency.",
    meta: "Open AI companion",
  },
  {
    href: "/explore/atlas",
    eyebrow: "Atlas",
    label: "Browse recurring profile patterns",
    description:
      "Editorial summaries of nearby IR profile combinations in the current model, rather than a live user distribution.",
    meta: "Browse Atlas",
  },
  {
    href: "/profile",
    eyebrow: "Profile",
    label: "Keep saved results in one place",
    description:
      "See your Foundation, focus-area overlays, and AI result together on this device.",
    meta: "View Profile",
  },
]

const startHereSignals = [
  {
    title: "Foundation first",
    text:
      "Start with the shared baseline on power, institutions, identity, and world order before you branch into issue overlays or the AI companion.",
  },
  {
    title: "One baseline, several layers",
    text:
      "Security, Technology, and AI sit beside the Foundation. They pressure-test or extend the baseline rather than replacing it.",
  },
  {
    title: "Interpretive, not final",
    text:
      "This is an editorial interactive, not a validated instrument. The point is to make theoretical priors visible in plain English.",
  },
]

const deepDiveSections = [
  {
    eyebrow: "Focus Areas",
    title: "Security and Technology as issue overlays",
    description:
      "These modules begin from live policy debates but stay tied to the shared IR baseline. Use them when you want to see where your instincts hold, sharpen, or shift under pressure.",
    primaryLink: { href: "/modules", label: "Browse focus areas" },
    secondaryLinks: [
      { href: "/modules/security", label: "Open Security & Strategy" },
      { href: "/modules/technology", label: "Open Technology & Geoeconomics" },
    ],
  },
  {
    eyebrow: "AI Companion",
    title: "A separate module on AI governance",
    description:
      "The AI Governance Compass sits beside the IR product family rather than inside it. It maps how you think about safety, openness, competition, military use, and the future without folding everything into one master score.",
    primaryLink: { href: "/ai", label: "Open AI companion" },
    secondaryLinks: [{ href: "/ai/atlas", label: "Browse AI Atlas" }],
  },
]

const exploreLinks = [
  {
    href: "/explore",
    title: "Worldview Guide",
    text: "Browse modeled traditions, reading lists, and coverage gaps.",
  },
  {
    href: "/explore/atlas",
    title: "IR Atlas",
    text: "See recurring patterns and nearby profile families in the current model.",
  },
  {
    href: "/compare",
    title: "Compare Profiles",
    text: "Read two shared profiles side by side.",
  },
  {
    href: "/profile",
    title: "Profile",
    text: "Keep saved results together in one integrated view.",
  },
  {
    href: "/method",
    title: "Methods",
    text: "Read the scope, guardrails, and limits behind the instrument.",
  },
  {
    href: "/references",
    title: "References",
    text: "Use the source shelf as a companion reading list.",
  },
  {
    href: "/feedback",
    title: "Feedback",
    text: "Send notes while the beta is still being stabilized.",
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
                  Find out how you think about world politics, from the basics of IR theory to live
                  debates on security, technology, and AI. Start with the shared Foundation, then
                  go deeper only where it seems useful.
                </p>
              </div>
              <FoundationHeroActions />
              <p className="landing-note">
                An interpretive tool, not a validated instrument. Results make theoretical priors
                visible without pretending to assign a final verdict.
              </p>
            </div>

            <aside className="lobby-hero-panel stack-md">
              <div className="stack-xs">
                <p className="section-kicker">Keep going after the baseline</p>
                <p className="muted lobby-side-text">
                  The Foundation is the first action. Everything else exists to pressure-test,
                  browse, or compare that first read.
                </p>
              </div>
              <div className="lobby-hero-path-grid">
                {quickPaths.map((item) => (
                  <Link key={item.href} href={item.href} className="lobby-hero-path-card stack-xs">
                    <p className="landing-quick-kicker">{item.eyebrow}</p>
                    <p className="landing-quick-title">{item.label}</p>
                    <p className="landing-quick-text">{item.description}</p>
                    <span className="landing-quick-meta">{item.meta}</span>
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="homepage-band stack-lg">
          <div className="homepage-band-header stack-sm">
            <p className="section-kicker">Start here</p>
            <h2>The Foundation gives the shared language for everything else</h2>
            <p className="muted lobby-section-copy">
              Take the baseline first, then use modules, Atlas, and Profile to see where that
              logic stays stable and where it shifts.
            </p>
          </div>
          <div className="homepage-signal-grid">
            {startHereSignals.map((signal) => (
              <article key={signal.title} className="homepage-signal-card stack-xs">
                <strong>{signal.title}</strong>
                {signal.text}
              </article>
            ))}
          </div>
        </section>

        <section className="homepage-band stack-lg">
          <div className="homepage-band-header stack-sm">
            <p className="section-kicker">Go deeper</p>
            <h2>Move from the baseline into overlays and companion modules</h2>
            <p className="muted lobby-section-copy">
              The rest of the product should feel adjacent to the Foundation rather than like a
              separate directory of unrelated routes.
            </p>
          </div>
          <div className="homepage-feature-grid">
            {deepDiveSections.map((section) => (
              <article key={section.title} className="homepage-feature-card stack-md">
                <div className="stack-sm">
                  <div className="stack-xs">
                    <p className="section-kicker">{section.eyebrow}</p>
                    <h3 className="lobby-entry-title">{section.title}</h3>
                  </div>
                  <p className="muted lobby-entry-text">{section.description}</p>
                </div>
                <div className="stack-sm">
                  <Link href={section.primaryLink.href} className="cta-secondary homepage-feature-primary">
                    {section.primaryLink.label}
                  </Link>
                  <div className="homepage-inline-links" aria-label={`${section.title} links`}>
                    {section.secondaryLinks.map((link) => (
                      <Link key={link.href} href={link.href} className="homepage-inline-link">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="homepage-band stack-lg">
          <div className="homepage-band-header stack-sm">
            <p className="section-kicker">Explore and compare</p>
            <h2>Use the field guide, Atlas, and Profile to keep the whole picture legible</h2>
            <p className="muted lobby-section-copy">
              These pages should help users interpret what they have already learned rather than
              compete with the Foundation for first attention.
            </p>
          </div>
          <div className="homepage-resource-grid">
            {exploreLinks.map((link) => (
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
