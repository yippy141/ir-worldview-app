import Link from "next/link"
import { FoundationHeroActions } from "@/components/landing/resume-cta"
import { ResultCardHero } from "@/components/results/result-card-hero"
import { siteConfig } from "@/lib/site-config"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: siteConfig.publicTitle,
  description:
    "An editorial interactive for reading your foreign-policy instincts across an IR baseline, issue modules, AI governance, and Profile.",
}

const quickPaths = [
  {
    step: "1",
    title: "Foundation",
    description:
      "Build the shared IR baseline: power, institutions, domestic politics, norms, political economy, restraint, and order.",
  },
  {
    step: "2",
    title: "Modules",
    description:
      "Test that baseline in Security and Technology without replacing the Foundation result.",
  },
  {
    step: "3",
    title: "AI Governance",
    description:
      "Take the AI layer on its own, or compare it with your IR baseline when that helps.",
  },
  {
    step: "4",
    title: "Profile",
    description:
      "Return to the place where the Foundation, modules, and any AI result sit together.",
  },
]

const productLayers = [
  {
    eyebrow: "Step 2",
    title: "Modules: Security and Technology",
    description:
      "Use the live IR modules to see whether your baseline holds, hardens, or splits in concrete cases.",
    primaryLink: { href: "/modules", label: "Open modules" },
    supportingText: "Two live focus-area overlays are available now.",
  },
  {
    eyebrow: "Step 3",
    title: "AI Governance Compass",
    description:
      "Read your instincts on frontier AI governance. It stands on its own, but it is sharper beside the IR baseline.",
    primaryLink: { href: "/ai", label: "Open AI Governance" },
    supportingText: "A related layer in the same worldview product.",
  },
  {
    eyebrow: "Step 4",
    title: "Profile",
    description:
      "Use Profile as the home for saved results: the Foundation, completed modules, and any AI result on this device.",
    primaryLink: { href: "/profile", label: "Open Profile" },
    supportingText: "Most useful after at least one result has been saved.",
  },
]

const supportSurfaces = [
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
]

export default function LandingPage() {
  return (
    <div className="wide-container">
      <article className="lobby-page stack-xl">
        <section className="landing-hero-v14 stack-md">
          <p className="landing-hero-v14__eyebrow">IR Worldview Inventory</p>
          <h1 className="landing-hero-v14__h1">What&rsquo;s your foreign policy worldview?</h1>
          <p className="landing-hero-v14__lead">
            25 questions. 12 minutes. Find out which IR tradition shapes your instincts.
          </p>
          <p className="landing-hero-v14__audience">
            Designed for students, analysts, and anyone curious about how they think about
            international politics.
          </p>
          <FoundationHeroActions />
          <p className="landing-hero-v14__alt">
            Or start with{" "}
            <Link href="/ai" className="landing-hero-v14__alt-link">
              AI Governance (8 min)
            </Link>
            .
          </p>
        </section>

        <section className="landing-preview stack-md">
          <div className="stack-xs">
            <p className="section-kicker">Sample result</p>
            <h2 className="landing-preview__heading">Here&rsquo;s what your result will look like</h2>
            <p className="muted landing-preview__caption">
              A fictional example. Your own result will name the tradition that fits your answers
              and surface one non-obvious tension from your scores.
            </p>
          </div>
          <ResultCardHero
            eyebrow="Foundation result"
            label="Liberal Institutionalist"
            accent="institutionalist"
            modifiers={["Hedger", "Conditional Solidarist"]}
            summary="Liberal Institutionalist is the clearest shorthand here. The profile invests in rules and monitoring, but it keeps strategic competition live rather than assuming institutions can hold it down."
            finding={{
              label: "Tension to watch",
              text: "When the issue turns strategic, rivalry reasserts itself. You believe institutions matter, but so does positional advantage. Which one wins depends on the issue — a coherent position, but one that is harder to apply in advance.",
            }}
          />
        </section>

        <section className="homepage-band stack-lg">
          <div className="homepage-band-header stack-sm">
            <p className="section-kicker">How to use it</p>
            <h2>Start with the Foundation, add layers when they help</h2>
            <p className="muted lobby-section-copy">
              Atlas, the field guide, and methods pages give context around the inventory; they are
              not separate places to begin.
            </p>
          </div>
          <div className="lobby-step-list lobby-step-list--row">
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
        </section>

        <section className="homepage-band stack-lg">
          <div className="homepage-band-header stack-sm">
            <p className="section-kicker">After the Foundation</p>
            <h2>Add another layer only when it clarifies the baseline</h2>
            <p className="muted lobby-section-copy">
              These are the live continuation points in the current beta. Each keeps the Foundation
              in view.
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
              Atlas, the field guide, and methods pages help you read the map after the baseline is
              in place.
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
