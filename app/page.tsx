import Link from "next/link"
import { QuizMenuCard } from "@/components/landing/resume-cta"
import { siteConfig } from "@/lib/site-config"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: siteConfig.publicTitle,
  description:
    "Find out how you think about world politics — from IR theory to security, technology, and AI governance.",
}

const lobbyItems = [
  {
    href: "/quiz",
    label: "IR Foundation Quiz",
    description:
      "The core assessment. Maps your views on power, institutions, identity, and world order across seven dimensions of IR theory.",
    meta: "15–25 min · Start here",
    primary: true,
  },
  {
    href: "/modules/security",
    label: "Security & Strategy",
    description:
      "Do your IR instincts hold up when applied to deterrence, alliances, and decisions about force? Tests your Foundation against real security debates.",
    meta: "15–20 min · Issue module",
    primary: false,
  },
  {
    href: "/modules/technology",
    label: "Technology & Geoeconomics",
    description:
      "How do you think about tech competition, export controls, and industrial policy? Applies your worldview to the economics and politics of technology.",
    meta: "15–20 min · Issue module",
    primary: false,
  },
  {
    href: "/ai",
    label: "AI Governance Compass",
    description:
      "A separate quiz on AI safety, regulation, international competition, and the long-term future of AI. Works alongside the IR quiz or on its own.",
    meta: "10–20 min · Companion quiz",
    primary: false,
  },
  {
    href: "/explore",
    label: "Explore Worldviews",
    description:
      "Browse the theory families behind the quiz — Realism, Liberal Institutionalism, Constructivism, and Critical Political Economy — with thinkers, readings, and profile patterns.",
    meta: "Browse · Field guide",
    primary: false,
  },
  {
    href: "/profile",
    label: "My Profile",
    description:
      "All your saved results in one place. Share your profile, compare it with others, or keep it as a record of where your instincts land across the whole inventory.",
    meta: "Your results",
    primary: false,
  },
]

export default function LandingPage() {
  return (
    <div className="landing-page">
      <section className="landing-hero landing-hero--editorial">
        <div className="landing-hero-compact stack-lg">
          <div className="stack-md">
            <h1 className="landing-display">Map how you view international affairs</h1>
            <p className="landing-lead">
              Find out how you think about world politics — from the basics of IR theory to live
              debates on security, technology, and AI. Takes 15 minutes to start, longer if you
              want to go deep.
            </p>
          </div>
          <div className="landing-hero-ctas">
            <Link href="/quiz" className="cta-primary">
              Take the Foundation Quiz
            </Link>
            <QuizMenuCard />
          </div>
          <p className="landing-note">
            An interpretive tool, not a validated instrument. Results make theoretical priors
            visible — they do not assign a final verdict.
          </p>
        </div>
      </section>

      <section className="landing-lobby">
        <div className="landing-lobby-list">
          {lobbyItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`lobby-menu-item${item.primary ? " lobby-menu-item--primary" : ""}`}
            >
              <div className="lobby-menu-copy">
                <p className="lobby-menu-label">{item.label}</p>
                <p className="lobby-menu-desc">{item.description}</p>
              </div>
              <div className="lobby-menu-right">
                <span className="lobby-menu-meta">{item.meta}</span>
                <span className="lobby-menu-arrow">Open →</span>
              </div>
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
          <div className="landing-closing-links">
            <Link href="/method" className="landing-text-link">
              Read the methods
            </Link>
            <Link href="/references" className="landing-text-link">
              Browse references
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
